# Instant Remesh — Modly Extension

Retopologizes any 3D mesh into clean quad or triangle topology using [Instant Meshes](https://github.com/wjakob/instant-meshes).

**Extension ID:** `instant-meshes`  
**Version:** 3.0.0  
**Author:** Lorchie  
**Runtime:** Python + Instant Meshes CLI binary (CPU)

---

## Pipeline

```
GLB input
  └─ 1. Load GLB        ──  trimesh, merges all primitives
  └─ 2. GLB → OBJ       ──  temp file for Instant Meshes
  └─ 3. Instant Meshes  ──  orientation field + remesh
  └─ 4. OBJ → GLB       ──  recomputes normals, exports
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `target_faces` | `5 000` | Target face count. `-1` = auto (preserves original density) |
| `topology` | `quads` | `quads` for animation/subdivision, `triangles` for game-ready assets |
| `crease` | `25°` | Dihedral angle above which edges are preserved as sharp |
| `smooth` | `2` | Instant Meshes internal smoothing passes |

### Tuning guide

| Situation | Recommendation |
|-----------|----------------|
| Organic character | `topology` quads, `crease` 20°, `smooth` 3 |
| Hard-surface / armor | `topology` quads, `crease` 40°, `smooth` 2 |
| Game engine asset | `topology` triangles, `target_faces` 3 000–8 000 |
| Subdivision ready | `topology` quads, `target_faces` -1, `smooth` 3 |
| Preserve fine detail | `target_faces` -1 or high count, `crease` 15° |

---

## Requirements

Dependencies are installed automatically by `setup.py` at extension install time.

| Package | License | Description |
|---------|---------|-------------|
| [`trimesh`](https://github.com/mikedh/trimesh) | MIT | GLB/OBJ read & write |
| [`numpy`](https://numpy.org) | BSD | Numerical arrays |
| Instant Meshes binary | BSD-3-Clause | Remesh engine (bundled for Windows) |

---

## Project Structure

```
modly-instant-meshes/
├── manifest.json     # Modly manifest (node declaration, parameters)
├── processor.py      # Main processor
├── setup.py          # Install script — creates venv, installs deps
├── bin/
│   └── instant-meshes.exe   # Windows binary (bundled)
└── .gitignore
```

---

## Credits

| Resource | Link |
|----------|------|
| Instant Meshes | [github.com/wjakob/instant-meshes](https://github.com/wjakob/instant-meshes) |
| trimesh | [github.com/mikedh/trimesh](https://github.com/mikedh/trimesh) |

**Instant Meshes** — Jakob, Wenzel et al. — *Instant Field-Aligned Meshes* — SIGGRAPH Asia 2015

---

## License

Instant Meshes — [BSD 3-Clause](https://github.com/wjakob/instant-meshes/blob/master/LICENSE)  
trimesh — [MIT](https://github.com/mikedh/trimesh/blob/main/LICENSE.md)
