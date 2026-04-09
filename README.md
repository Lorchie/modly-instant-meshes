# Clean & Remesh — Modly Extension

Denoises AI-generated 3D meshes with Laplacian smoothing, then remeshes into clean quad/triangle topology using [Instant Meshes](https://github.com/wjakob/instant-meshes).

**Extension ID:** `instant-meshes`  
**Version:** 2.0.0  
**Author:** Lorchie  
**Runtime:** Python + Instant Meshes CLI binary (CPU)

---

## Pipeline

```
GLB input
  └─ 1. Load GLB        ──  trimesh, merges all primitives
  └─ 2. Laplacian smooth ──  removes AI mesh noise & imperfections
  └─ 3. GLB → OBJ       ──  temp file for Instant Meshes
  └─ 4. Instant Meshes  ──  orientation field + remesh (quads or triangles)
  └─ 5. OBJ → GLB       ──  trimesh export with recomputed normals
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `denoise_iterations` | `5` | Laplacian smoothing passes before remesh. Removes AI noise & bumps. `0` = disabled |
| `target_faces` | `5 000` | Target face count for remesh. `-1` = auto (preserves original density) |
| `topology` | `quads` | `quads` for animation/subdivision, `triangles` for game-ready assets |
| `crease` | `25°` | Dihedral angle above which edges are preserved as sharp features |
| `smooth` | `2` | Instant Meshes internal smoothing passes — higher = cleaner edge flow |

### Tuning guide

| Situation | Recommendation |
|-----------|----------------|
| Heavy AI noise / bumpy surface | `denoise_iterations` 8–15 |
| Preserve silhouette & volume | `denoise_iterations` 3–5, `crease` 20–25° |
| Sharp-edged object (armor, weapon) | `denoise_iterations` 2, `crease` 35–45° |
| Organic character (skin, cloth) | `denoise_iterations` 8, `crease` 15°, topology `quads` |
| Game engine asset | `topology` triangles, `target_faces` 2 000–8 000 |
| Subdivision ready | `topology` quads, `target_faces` -1, `smooth` 3 |

---

## Requirements

Dependencies are installed automatically by `setup.py` at extension install time.

| Package | License | Description |
|---------|---------|-------------|
| [`trimesh`](https://github.com/mikedh/trimesh) | MIT | GLB read/write + Laplacian smoothing |
| [`numpy`](https://numpy.org) | BSD | Numerical arrays |
| Instant Meshes binary | BSD-3-Clause | Remesh engine (bundled for Windows, downloaded for other platforms) |

---

## Project Structure

```
modly-instant-meshes/
├── manifest.json     # Modly manifest (node declaration, parameters)
├── processor.py      # Main processor (denoise + remesh pipeline)
├── setup.py          # Install script — creates venv, installs deps, downloads binary
├── bin/
│   └── instant-meshes.exe   # Windows binary (bundled)
└── .gitignore
```

> `venv/` is created locally by `setup.py` and excluded from the repo.

---

## Credits

| Resource | Link |
|----------|------|
| Instant Meshes paper & code | [github.com/wjakob/instant-meshes](https://github.com/wjakob/instant-meshes) |
| Project page | [igl.ethz.ch/projects/instant-meshes](https://igl.ethz.ch/projects/instant-meshes/) |
| trimesh | [github.com/mikedh/trimesh](https://github.com/mikedh/trimesh) |

**Instant Meshes** — Jakob, Wenzel et al. (2015)  
*Instant Field-Aligned Meshes* — SIGGRAPH Asia 2015

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
trimesh is released under the [MIT License](https://github.com/mikedh/trimesh/blob/main/LICENSE.md).
