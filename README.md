# Instant Meshes — Modly Extension

Clean quad/triangle retopology for AI-generated 3D meshes,
powered by [Instant Meshes](https://github.com/wjakob/instant-meshes).

**Extension ID:** `instant-meshes`  
**Version:** 1.0.0  
**Author:** Lorchie  
**Runtime:** Node.js + Instant Meshes CLI binary (CPU)

---

## Pipeline

```
GLB input
  └─ 1. GLB → OBJ  ──  concatenates all primitives, preserves vertex normals
  └─ 2. Instant Meshes CLI  ──  computes orientation field + remeshes
  └─ 3. OBJ → GLB  ──  triangulates quads, rebuilds gltf-transform document
  └─ 4. Normals  ──  recomputes smooth vertex normals
  └─ 5. GLB export via @gltf-transform
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `target_faces` | `5 000` | Number of faces in the output mesh (100 – 500 000) |
| `topology` | `quads` | Output topology: `quads` for animation/subdivision, `triangles` for game-ready assets |
| `crease` | `30°` | Dihedral angle above which edges are treated as sharp features (`0` = fully smooth) |
| `smooth` | `2` | Number of smoothing passes — higher = cleaner flow, slower processing |

### Always-on

`--intrinsic` and `--boundaries` are hardcoded — they produce significantly better results on the curved, non-watertight meshes typical of AI generators.

### Tuning guide

| Situation | Recommendation |
|-----------|----------------|
| Very noisy mesh / heavy artifacts | Increase smooth to `3–4`, lower crease to `20°` |
| Sharp features getting lost | Lower crease to `15–20°` |
| Output too heavy | Reduce target face count |
| Preparing for subdivision | Quads, crease `30°`, smooth `2` |
| Game engine / real-time asset | Triangles, target face count `2 000 – 5 000` |

---

## Requirements

Dependencies are installed automatically by `setup.py`, which also downloads the Instant Meshes binary.

| Package | Version | License | Description |
|---------|---------|---------|-------------|
| [`@gltf-transform/core`](https://github.com/donmccurdy/glTF-Transform) | ^3.9.0 | MIT | glTF 2.0 read/write core library |
| [`@gltf-transform/functions`](https://github.com/donmccurdy/glTF-Transform) | ^3.9.0 | MIT | Mesh processing functions (normals) |
| Instant Meshes binary | — | BSD-3-Clause | Downloaded by `setup.py` for Windows / macOS / Linux |

---

## Project Structure

```
modly-instant-meshes/
├── manifest.json     # Modly manifest (node declaration, parameters)
├── processor.ts      # TypeScript source of the processor
├── setup.py          # Installation script — npm deps + binary download
├── package.json      # npm dependencies
├── tsconfig.json     # TypeScript configuration
└── bin/
    └── instant-meshes[.exe]   # Downloaded by setup.py, excluded from repo
```

> `processor.js`, `node_modules/`, and the `bin/` binary are generated/downloaded locally.

---

## Credits

| Resource | Link |
|----------|------|
| Instant Meshes paper & code | [github.com/wjakob/instant-meshes](https://github.com/wjakob/instant-meshes) |
| Project page | [igl.ethz.ch/projects/instant-meshes](https://igl.ethz.ch/projects/instant-meshes/) |
| glTF-Transform | [github.com/donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) |

**Instant Meshes** — Jakob, Wenzel et al. (2015)  
*Instant Field-Aligned Meshes* — SIGGRAPH Asia 2015  
ETH Zurich & Università degli Studi di Milano

```bibtex
@article{instant_meshes,
  title   = {Instant Field-Aligned Meshes},
  author  = {Jakob, Wenzel and Tarini, Marco and Panozzo, Daniele and Sorkine-Hornung, Olga},
  journal = {ACM Transactions on Graphics (Proc. SIGGRAPH Asia)},
  volume  = {34},
  number  = {6},
  year    = {2015}
}
```

---

## License

This extension is distributed as part of the Modly ecosystem.  
Instant Meshes is released under the [BSD 3-Clause License](https://github.com/wjakob/instant-meshes/blob/master/LICENSE).  
glTF-Transform is released under the [MIT License](https://github.com/donmccurdy/glTF-Transform/blob/main/LICENSE).
