#!/usr/bin/env python3
"""
processor.py — Clean & Remesh processor for Modly.

Pipeline:
  1. Load GLB (trimesh)
  2. Laplacian smooth (trimesh.smoothing) — denoise AI mesh
  3. Export temp OBJ
  4. Instant Meshes remesh
  5. Load output OBJ, export GLB

Protocol: one JSON line from stdin → JSON lines to stdout.
"""
import json
import os
import stat
import subprocess
import sys
import tempfile
import time


# ── I/O helpers ───────────────────────────────────────────────────────────────

def emit(data: dict) -> None:
    print(json.dumps(data), flush=True)

def log(msg: str) -> None:
    emit({'type': 'log', 'message': str(msg)})

def progress(pct: int, label: str) -> None:
    emit({'type': 'progress', 'percent': pct, 'label': label})

def error(msg: str) -> None:
    emit({'type': 'error', 'message': str(msg)})
    sys.exit(1)


# ── Read payload ──────────────────────────────────────────────────────────────

try:
    payload       = json.loads(sys.stdin.readline())
    input_data    = payload['input']
    params        = payload.get('params', {})
    workspace_dir = payload.get('workspaceDir', '')
    temp_dir      = payload.get('tempDir', tempfile.gettempdir())
except Exception as e:
    error(f'Failed to parse input: {e}')

file_path = input_data.get('filePath', '')
if not file_path:
    error('No input filePath provided')

EXT_DIR = os.path.dirname(os.path.abspath(__file__))


# ── Parameters ────────────────────────────────────────────────────────────────

denoise_iters = max(0,   int(params.get('denoise_iterations', 5)))
target_faces  =          int(params.get('target_faces', 5000))
topology      =          str(params.get('topology', 'quads'))
crease        = max(0,   int(params.get('crease', 25)))
smooth        =          str(params.get('smooth', '2'))
rosy          = '6' if topology == 'triangles' else '4'
posy          = '6' if topology == 'triangles' else '4'


# ── Imports (auto-install if missing) ────────────────────────────────────────

try:
    import trimesh
    import trimesh.smoothing
    import numpy as np
except ImportError:
    log('trimesh not found — installing…')
    try:
        subprocess.check_call(
            [sys.executable, '-m', 'pip', 'install', 'trimesh', 'numpy', 'scipy', '--quiet'],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        import trimesh
        import trimesh.smoothing
        import numpy as np
        log('trimesh installed successfully.')
    except Exception as e:
        error(f'Could not install trimesh: {e}. Please reinstall the extension.')


# ── Load mesh ─────────────────────────────────────────────────────────────────

progress(5, 'Loading mesh…')
try:
    scene = trimesh.load(file_path)
    if isinstance(scene, trimesh.Scene):
        meshes = list(scene.geometry.values())
        if not meshes:
            error('No geometry found in GLB')
        mesh = trimesh.util.concatenate(meshes) if len(meshes) > 1 else meshes[0]
    else:
        mesh = scene

    log(f'Input: {len(mesh.faces):,} faces — {len(mesh.vertices):,} vertices')
except Exception as e:
    error(f'Failed to load mesh: {e}')


# ── Laplacian smooth (denoise) ────────────────────────────────────────────────

if denoise_iters > 0:
    progress(15, f'Denoising ({denoise_iters} iterations)…')
    try:
        trimesh.smoothing.filter_laplacian(mesh, iterations=denoise_iters)
        log('Denoising done.')
    except Exception as e:
        log(f'Warning: denoising failed — {e}')


# ── Export temp OBJ ───────────────────────────────────────────────────────────

ts      = int(time.time() * 1000)
out_dir = os.path.join(workspace_dir, 'Workflows') if workspace_dir else temp_dir
os.makedirs(out_dir, exist_ok=True)

tmp_in  = os.path.join(temp_dir, f'im-in-{ts}.obj')
tmp_out = os.path.join(temp_dir, f'im-out-{ts}.obj')

progress(30, 'Converting to OBJ…')
try:
    mesh.export(tmp_in)
except Exception as e:
    error(f'Failed to export OBJ: {e}')


# ── Instant Meshes ────────────────────────────────────────────────────────────

exe_name = 'instant-meshes.exe' if sys.platform == 'win32' else 'instant-meshes'
exe      = os.path.join(EXT_DIR, 'bin', exe_name)

if not os.path.isfile(exe):
    error(f'Instant Meshes binary not found at {exe}. Please reinstall the extension.')

args = [exe, tmp_in, '--output', tmp_out,
        '--rosy', rosy, '--posy', posy,
        '--smooth', smooth,
        '--intrinsic', '--boundaries']
if target_faces > 0:
    args += ['--faces', str(target_faces)]
if crease > 0:
    args += ['--crease', str(crease)]

log(f'Running Instant Meshes — faces={target_faces if target_faces > 0 else "auto"} '
    f'topology={topology} crease={crease}° smooth={smooth}')
progress(40, 'Remeshing…')

try:
    result = subprocess.run(args, capture_output=True, text=True, timeout=300)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f'exit code {result.returncode}')
except subprocess.TimeoutExpired:
    error('Instant Meshes timed out (>5 min)')
except Exception as e:
    error(f'Instant Meshes failed: {e}')
finally:
    try: os.unlink(tmp_in)
    except: pass

if not os.path.isfile(tmp_out):
    error('Instant Meshes produced no output — check the input mesh.')


# ── Load output & export GLB ──────────────────────────────────────────────────

progress(75, 'Converting to GLB…')
try:
    mesh_out = trimesh.load(tmp_out, force='mesh')
    log(f'Output: {len(mesh_out.faces):,} faces — {len(mesh_out.vertices):,} vertices')

    out_path = os.path.join(out_dir, f'instant-meshes-{ts}.glb')
    progress(90, 'Writing GLB…')
    mesh_out.export(out_path)
except Exception as e:
    error(f'Failed to write GLB: {e}')
finally:
    try: os.unlink(tmp_out)
    except: pass


# ── Done ──────────────────────────────────────────────────────────────────────

progress(100, 'Done.')
log(f'Output: {out_path}')
emit({'type': 'done', 'result': {'filePath': out_path}})
