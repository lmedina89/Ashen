# ASHEN KINGDOM — THE ASTRAL KEEP

**Playable dark-fantasy environment vertical slice** — original Three.js/WebGL world, atmospheric pixel-art rendering, explorable terrain and a small rune-recovery quest. This is the first game foundation, not a finished commercial RPG.

## Play locally

Requires **Node.js 22.12+** and npm. No Blender, accounts, API keys or paid assets are required.

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`). To publish a standalone build:

```bash
npm run build
npm run preview
```

The ZIP has **no parent folder**: upload/extract its contents directly into the root of a GitHub repository.

## Controls

| Action | Desktop | iPhone / Android |
| --- | --- | --- |
| Walk | `W A S D` | Left touch joystick |
| Look | Drag the 3D view | Drag right-hand side of the 3D view |
| Sprint | Hold `Shift` | Hold `RUN` |
| Interact | `E` when near an object | Tap `INTERACT` when shown |
| Lantern | `L` | `LAMP` |
| Sound | Top-right music icon | Top-right music icon |
| Settings | `Escape` or gear | Gear |

## What is actually playable

- Procedurally generated **3D rolling hills** with a winding climbable cobblestone road, woodland, cliffs, scattered stones and a dark pool.
- Multi-tier **Gothic castle approach** with a traversable central gate, curtain walls, crenellations, clock spire, chapel, courtyard altar, glowing windows, columns and torches.
- **Original generated textures**, including night nebula panorama, weathered stone, slate roofs, forest floor, cobbles, cliff shale and glow sprites — all bundled locally in `public/textures/`.
- GPU-instanced trees, foliage, mushrooms, fireflies, embers and dust; atmospheric color, fog, moonlight and interactive lantern.
- **Rune quest:** recover four floating runes distributed along the approach, then return to the courtyard altar and awaken it. No enemies in this ambience-first milestone.
- Touch controls, render style switch (`Cinematic pixel` / `Clean 3D`), quality presets, FPS overlay, optional synthesized wind ambience, no external art dependencies.

## GitHub Pages deployment

1. Create a new GitHub repository (or an existing empty repo).
2. Upload **all ZIP contents at repository root**. Keep `.github/workflows/deploy.yml` and `public/textures/`.
3. Set the main branch to `main` and push.
4. In **Settings → Pages**, choose **Source → GitHub Actions**.
5. The included `Deploy to GitHub Pages` action installs dependencies, runs tests, builds the game and publishes `dist/`.

`vite.config.js` uses `base: './'` so asset paths work on project subpaths hosted by GitHub Pages.

## Structure

```text
.
├── .github/workflows/deploy.yml     # automated GitHub Pages
├── docs/GAME_DESIGN.md               # design vision + next milestones
├── public/textures/                # original bundled PNG materials
├── src/
│   ├── graphics/renderer.js         # WebGL pixel render target + clean mode
│   ├── systems/                     # player, quest, particles, interface, audio
│   ├── world/                       # sky, terrain, vegetation, architecture, materials
│   ├── utils/math.js                # seeded world functions
│   ├── main.js                      # composition / update loop
│   └── style.css                    # cinematic responsive interface
├── tests/world.test.js              # repeatability and terrain tests
├── tools/generate_textures.py       # optional reproducible texture generator
├── index.html
├── vite.config.js
└── package.json
```

## Performance

Start with **Auto** quality; on phones this uses a reduced-resolution WebGL render target with nearest-neighbor upscaling, keeping pixel edges crisp. Use **Battery saver** if frame rate is low, or `Clean 3D` to disable pixelation. Reduce browser zoom to 100% if touch controls feel offset. WebGL is required.

## Notes / current limitations

- Terrain, castle and vegetation are actual 3D geometry, not photogrammetry or high-poly GLBs. Materials are authored procedural textures. The current gate and chapel are exterior gameplay landmarks, not furnished interiors.
- Character combat, inventory, save files, cutscenes, dynamic day/night and polished sound are not implemented in v0.1.
- The architecture is an original prototype. No references or screenshots supplied by the user are copied into the shipped game.
- No network access is needed **after npm build**; the built static site hosts its own textures and JS.

## Checks

```bash
npm test
npm run build
```

Texture regeneration (only if desired): `python -m pip install pillow numpy && python tools/generate_textures.py`.

MIT licensed source; original Ashen Kingdom concept art direction and title are project placeholders that can be renamed before release.
