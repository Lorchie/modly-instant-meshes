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
  └─ 2. Repair          ──  fix winding, fill holes, remove degenerate/duplicate faces
  └─ 3. GLB → OBJ       ──  temp file for Instant Meshes
  └─ 4. Instant Meshes  ──  orientation field + remesh
  └─ 5. OBJ → GLB       ──  recomputes normals, exports
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `target_faces` | `5 000` | Target face count. `-1` = auto (preserves original density) |
| `topology` | `quads` | `quads` for animation/subdivision, `triangles` for game-ready assets |
| `crease` | `25°` | Dihedral angle above which edges are preserved as sharp |
| `smooth` | `2` | Instant Meshes internal smoothing passes |

### Tuning tips

| Situation | Recommendation |
|-----------|----------------|
| Organic character | `topology` quads, `crease` 20°, `smooth` 3 |
| Creature with fine detail | `target_faces` -1, `crease` 15°, `smooth` 2 |
| Subdivision-ready | `topology` quads, `target_faces` -1, `smooth` 3 |
| Game engine asset (organic) | `topology` triangles, `target_faces` 3 000–8 000 |

---

## When to use

| Use case | Result |
|----------|--------|
| Organic mesh (character, creature, plant) | Clean quad retopology for animation or subdivision |
| Dense mesh needing face reduction | Intelligent decimation with controlled face count |

## When NOT to use

| Use case | Why |
|----------|-----|
| Hard-surface mesh (building, armor, furniture) | Orientation fields diverge at corners → artifacts |
| AI-generated mesh with non-manifold geometry | Holes and artifacts even after repair |
| Mesh already clean and usable | No benefit — may add noise |

---

## Known limitations

- **Non-manifold meshes** — self-intersections or open borders degrade results. The repair step mitigates but cannot fix fundamental topology issues.
- **Hard-surface geometry** — right angles and flat planes cause orientation field noise. Use a dedicated decimation tool instead.
- **Fine detail loss** — use `target_faces` `-1` or a high count to preserve detail.
- **Processing time** — large meshes (>200k faces) can take several minutes on CPU.

---

## Requirements

Dependencies are installed automatically by `setup.py` in an isolated venv.

| Package | License | Description |
|---------|---------|-------------|
| [`trimesh`](https://github.com/mikedh/trimesh) | MIT | GLB/OBJ read, write & repair |
| [`numpy`](https://numpy.org) | BSD | Numerical arrays |
| [`scipy`](https://scipy.org) | BSD | Required by trimesh for OBJ export |
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
