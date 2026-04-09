# Instant Meshes — Modly Extension

> Clean quad/triangle retopology for AI-generated 3D meshes, powered by [Instant Meshes](https://github.com/wjakob/instant-meshes).

---

## What it does

Takes a raw GLB mesh (typically noisy output from an AI 3D model generator) and produces a clean, evenly-spaced quad or triangle mesh with proper edge flow — ready for animation, subdivision, or game engines.

```
AI model (messy topology)  →  Instant Remesh  →  clean quad/tri mesh
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| **Target face count** | `5 000` | Number of faces in the output. Lower = lighter, higher = more detail. |
| **Output topology** | `Quads` | **Quads** for animation/subdivision. **Triangles** for game-ready assets. |
| **Crease angle (°)** | `30°` | Dihedral angle above which edges are treated as sharp features. `0` = fully smooth. |
| **Smoothing iterations** | `2` | Number of smoothing passes. Higher = cleaner flow, slower processing. `2–4` is optimal. |

### Always-on (hidden)

These flags are hardcoded for best quality on AI meshes:

- **`--intrinsic`** — Uses the intrinsic surface solver. Produces significantly better orientation fields on curved and complex surfaces.
- **`--boundaries`** — Aligns output edges to mesh boundaries. Essential for open/non-watertight meshes, which are common in AI-generated output.

---

## Tuning guide

| Situation | Recommendation |
|-----------|----------------|
| Mesh is very noisy / heavy artifacts | Increase smooth to `3–4`, lower crease to `20°` |
| Sharp features are getting lost | Lower crease to `15–20°` |
| Output is too heavy | Reduce target face count |
| Preparing for subdivision | Use **Quads**, crease `30°`, smooth `2` |
| Game engine / real-time asset | Use **Triangles**, target face count `2 000–5 000` |

---

## How it works

1. Reads the input GLB and exports it as OBJ — including vertex normals when available, which significantly improves orientation field quality.
2. Runs the Instant Meshes CLI binary with the configured parameters.
3. Reads the output OBJ, recomputes smooth normals, and writes a clean GLB.

---

## Setup

The Instant Meshes binary must be present in the `bin/` folder. Run the setup script once:

```bash
python setup.py
```

This downloads the correct binary for your platform (Windows, macOS, Linux).

---

## Credits

**Instant Meshes** is an open-source tool developed by:

> Wenzel Jakob, Marco Tarini, Daniele Panozzo, Olga Sorkine-Hornung  
> *Instant Field-Aligned Meshes* — SIGGRAPH Asia 2015  
> ETH Zurich & Università degli Studi di Milano

- Paper: [igl.ethz.ch/projects/instant-meshes](https://igl.ethz.ch/projects/instant-meshes/)
- Source: [github.com/wjakob/instant-meshes](https://github.com/wjakob/instant-meshes)
- License: BSD 3-Clause

**Modly extension** by [Modly](https://modly.app) — wraps the CLI into a pipeline node with GLB I/O via [@gltf-transform](https://gltf-transform.donmccurdy.com/).
