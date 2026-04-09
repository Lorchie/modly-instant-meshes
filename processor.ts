/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import https from 'https';
import path from 'path';
import { spawnSync } from 'child_process';
import { execFileSync } from 'child_process';

interface Input   { filePath: string }
interface Params  { [key: string]: unknown }
interface Context {
  log(message: string): void;
  progress(percent: number, label: string): void;
  workspaceDir: string;
}

// ---------------------------------------------------------------------------
// GLB → OBJ  (concatenates all primitives)
// ---------------------------------------------------------------------------
function docToOBJ(doc: any): string {
  const lines: string[] = [];
  let offset = 0;

  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (!pos) continue;

      const count = pos.getCount();
      for (let i = 0; i < count; i++) {
        const v = pos.getElement(i, [0, 0, 0]);
        lines.push(`v ${v[0]} ${v[1]} ${v[2]}`);
      }

      const indices = prim.getIndices();
      if (indices) {
        for (let i = 0; i < indices.getCount(); i += 3) {
          const a = indices.getScalar(i)     + 1 + offset;
          const b = indices.getScalar(i + 1) + 1 + offset;
          const c = indices.getScalar(i + 2) + 1 + offset;
          lines.push(`f ${a} ${b} ${c}`);
        }
      } else {
        for (let i = 0; i < count; i += 3)
          lines.push(`f ${i + 1 + offset} ${i + 2 + offset} ${i + 3 + offset}`);
      }
      offset += count;
    }
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// OBJ → new @gltf-transform Document  (triangulates quads)
// ---------------------------------------------------------------------------
function objToDoc(objContent: string, Document: any): any {
  const verts: number[]  = [];
  const faces: number[]  = [];

  for (const raw of objContent.split('\n')) {
    const line  = raw.trim();
    const parts = line.split(/\s+/);

    if (parts[0] === 'v') {
      verts.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    } else if (parts[0] === 'f') {
      const idx = parts.slice(1).map(p => parseInt(p.split('/')[0], 10) - 1);
      if (idx.length === 3) {
        faces.push(idx[0], idx[1], idx[2]);
      } else if (idx.length === 4) {
        // Triangulate quad
        faces.push(idx[0], idx[1], idx[2]);
        faces.push(idx[0], idx[2], idx[3]);
      }
    }
  }

  const doc    = new Document();
  const buffer = doc.createBuffer();
  const scene  = doc.createScene('Scene');
  const node   = doc.createNode('Mesh');
  scene.addChild(node);
  doc.getRoot().setDefaultScene(scene);

  const posAcc = doc.createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(verts))
    .setBuffer(buffer);

  const idxAcc = doc.createAccessor()
    .setType('SCALAR')
    .setArray(new Uint32Array(faces))
    .setBuffer(buffer);

  const prim = doc.createPrimitive()
    .setAttribute('POSITION', posAcc)
    .setIndices(idxAcc);

  const mesh = doc.createMesh('Mesh').addPrimitive(prim);
  node.setMesh(mesh);

  return doc;
}

// ---------------------------------------------------------------------------
// Executable path + lazy download
// ---------------------------------------------------------------------------
const DOWNLOAD_URLS: Record<string, string> = {
  win32:  'https://instant-meshes.s3.eu-central-1.amazonaws.com/Release/instant-meshes-windows.zip',
  darwin: 'https://instant-meshes.s3.eu-central-1.amazonaws.com/instant-meshes-macos.zip',
  linux:  'https://instant-meshes.s3.eu-central-1.amazonaws.com/instant-meshes-linux.zip',
};

function getExecutable(): string {
  const binDir = path.join(__dirname, 'bin');
  const name   = process.platform === 'win32' ? 'instant-meshes.exe' : 'instant-meshes';
  return path.join(binDir, name);
}

async function ensureExecutable(context: Context): Promise<void> {
  const exe = getExecutable();
  if (fs.existsSync(exe)) return;

  const url = DOWNLOAD_URLS[process.platform];
  if (!url) throw new Error(`Instant Meshes: unsupported platform "${process.platform}"`);

  context.log('Downloading Instant Meshes binary…');
  context.progress(2, 'Downloading Instant Meshes…');

  const zipBuf = await new Promise<Buffer>((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location!, (res2) => {
          const chunks: Buffer[] = [];
          res2.on('data', (c: Buffer) => chunks.push(c));
          res2.on('end', () => resolve(Buffer.concat(chunks)));
          res2.on('error', reject);
        }).on('error', reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });

  context.log('Extracting binary…');
  const binDir = path.join(__dirname, 'bin');
  fs.mkdirSync(binDir, { recursive: true });

  // Write zip to temp file and extract with Node's built-in zlib isn't enough —
  // use a temp path and the adm-zip bundled approach via raw zip parsing
  const tmpZip = exe + '.zip';
  fs.writeFileSync(tmpZip, zipBuf);

  // Extract using PowerShell (Windows) or unzip (Unix)
  if (process.platform === 'win32') {
    execFileSync('powershell', [
      '-NoProfile', '-Command',
      `Expand-Archive -Force -LiteralPath '${tmpZip}' -DestinationPath '${binDir}'`,
    ]);
    // Rename if needed (zip may contain a different name)
    const entries = fs.readdirSync(binDir).filter(f => f.endsWith('.exe') && f !== path.basename(exe));
    if (entries.length === 1 && !fs.existsSync(exe)) {
      fs.renameSync(path.join(binDir, entries[0]), exe);
    }
  } else {
    execFileSync('unzip', ['-o', tmpZip, '-d', binDir]);
    const entries = fs.readdirSync(binDir).filter(f => !f.endsWith('.zip') && f !== 'instant-meshes');
    if (entries.length === 1 && !fs.existsSync(exe)) {
      fs.renameSync(path.join(binDir, entries[0]), exe);
    }
    fs.chmodSync(exe, 0o755);
  }

  fs.unlinkSync(tmpZip);
  context.log('Binary ready.');
}

// ---------------------------------------------------------------------------
// Processor
// ---------------------------------------------------------------------------
const processor = async (
  input: Input,
  params: Params,
  context: Context,
): Promise<{ filePath: string }> => {
  if (!input.filePath) throw new Error('instant-meshes: input.filePath is required');

  await ensureExecutable(context);
  const exe = getExecutable();

  // Lazy requires
  const { NodeIO, Document } = require('@gltf-transform/core');
  const { normals }          = require('@gltf-transform/functions');

  context.progress(10, 'Loading mesh…');
  const io  = new NodeIO();
  const doc = await io.read(input.filePath);

  // Count input triangles
  let inputFaces = 0;
  for (const mesh of doc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      inputFaces += idx ? Math.round(idx.getCount() / 3) : 0;
    }
  context.log(`Input: ${inputFaces} triangles — ${input.filePath}`);

  // Write temp OBJ
  context.progress(25, 'Converting to OBJ…');
  const outDir  = path.join(context.workspaceDir, 'Workflows');
  fs.mkdirSync(outDir, { recursive: true });

  const ts       = Date.now();
  const tmpIn    = path.join(outDir, `im-in-${ts}.obj`);
  const tmpOut   = path.join(outDir, `im-out-${ts}.obj`);
  fs.writeFileSync(tmpIn, docToOBJ(doc), 'utf8');

  // Build args
  const targetFaces = Math.max(100, Math.round(Number(params['target_faces'] ?? 5000)));
  const topology    = String(params['topology'] ?? 'quads');
  const rosy        = topology === 'triangles' ? '6' : '4';
  const posy        = topology === 'triangles' ? '6' : '4';
  const smooth      = String(params['smooth'] ?? '2');
  const crease      = Number(params['crease'] ?? 30);

  const args: string[] = [
    tmpIn,
    '--output',     tmpOut,
    '--faces',      targetFaces.toString(),
    '--rosy',       rosy,
    '--posy',       posy,
    '--smooth',     smooth,
    '--intrinsic',
    '--boundaries',
  ];
  if (crease > 0) args.push('--crease', crease.toString());

  context.log(`Running: instant-meshes --faces ${targetFaces} --rosy ${rosy} --posy ${posy} --smooth ${smooth} --crease ${crease} --intrinsic --boundaries`);
  context.progress(40, 'Running Instant Meshes…');

  const result = spawnSync(exe, args, { timeout: 180_000, encoding: 'utf8' });

  if (result.status !== 0) {
    fs.unlinkSync(tmpIn);
    throw new Error(`Instant Meshes failed (exit ${result.status}): ${result.stderr ?? result.error}`);
  }

  if (!fs.existsSync(tmpOut)) {
    fs.unlinkSync(tmpIn);
    throw new Error('Instant Meshes did not produce output — check input mesh.');
  }

  // Read output OBJ → GLB
  context.progress(75, 'Converting output to GLB…');
  const objContent = fs.readFileSync(tmpOut, 'utf8');
  const outDoc     = objToDoc(objContent, Document);

  // Compute normals
  await outDoc.transform(normals({ overwrite: true }));

  // Count output faces
  let outputFaces = 0;
  for (const mesh of outDoc.getRoot().listMeshes())
    for (const prim of mesh.listPrimitives()) {
      const idx = prim.getIndices();
      outputFaces += idx ? Math.round(idx.getCount() / 3) : 0;
    }
  context.log(`Output: ${outputFaces} triangles`);

  context.progress(90, 'Writing GLB…');
  const outPath = path.join(outDir, `instant-meshes-${ts}.glb`);
  await io.write(outPath, outDoc);

  // Cleanup
  fs.unlinkSync(tmpIn);
  fs.unlinkSync(tmpOut);

  context.progress(100, 'Done.');
  context.log(`Output: ${outPath}`);
  return { filePath: outPath };
};

export = processor;
