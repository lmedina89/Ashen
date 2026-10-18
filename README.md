# ASHEN KINGDOM — THE ASTRAL KEEP

**Playable dark-fantasy environment vertical slice** — original Three.js/WebGL world, atmospheric pixel-art rendering, explorable terrain and a small rune-recovery quest. This is the first game foundation, not a finished commercial RPG.

## Deploy to GitHub Pages — works from repository root

**This corrected release is deployable without running npm or Vite.** The game's `index.html` loads `./src/style.css`, `./src/main.js`, and `./textures/` relative to its current location. This works with repository subpaths such as `username.github.io/your-repo/`.

1. Upload all files and directories from this ZIP to your existing GitHub repository **root** (not a nested folder). Replace the old `index.html`, `src/`, workflow and other files. Delete the old `vite.config.js` if present.
2. If GitHub Pages is set to **Deploy from a branch**, choose `main` and `/(root)`. This release works in that mode.
3. Alternatively, use **GitHub Actions** as the Pages source. The included workflow publishes the static files directly, with **no build step**.
4. Wait for GitHub Pages deployment and reload the site. If a previous copy is cached on iPhone, use a private browser tab or add `?v=2` to the URL.

**External library:** The page loads pinned `three.js@0.180.0` from Cloudflare CDN via an import map. An internet connection to cdnjs.cloudflare.com is required for the 3D engine; the visual textures and code are included in the ZIP. A diagnostic error panel appears if the game resource fails to load. CDN loading could not be live-verified in the build environment.

## Run locally (optional)

Requires Node.js 18+ for the lightweight server, but no npm install:

```bash
npm run dev
```

Open `http://localhost:5173/`. Do not use `file://` — browser ES modules require HTTP(S).

Validation scripts:

```bash
npm test
npm run check
```

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
- **Original generated textures**, including night nebula panorama, weathered stone, slate roofs, forest floor, cobbles, cliff shale and glow sprites — all bundled locally in `textures/`.
- GPU-instanced trees, foliage, mushrooms, fireflies, embers and dust; atmospheric color, fog, moonlight and interactive lantern.
- **Rune quest:** recover four floating runes distributed along the approach, then return to the courtyard altar and awaken it. No enemies in this ambience-first milestone.
- Touch controls, render style switch (`Cinematic pixel` / `Clean 3D`), quality presets, FPS overlay, optional synthesized wind ambience, no external art dependencies.

## Structure

```text
.
├── .github/workflows/deploy.yml     # automated GitHub Pages
├── docs/GAME_DESIGN.md               # design vision + next milestones
├── textures/                       # original bundled PNG materials
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
└── package.json
```

## Performance

Start with **Auto** quality; on phones this uses a reduced-resolution WebGL render target with nearest-neighbor upscaling, keeping pixel edges crisp. Use **Battery saver** if frame rate is low, or `Clean 3D` to disable pixelation. Reduce browser zoom to 100% if touch controls feel offset. WebGL is required.

## Notes / current limitations

- Terrain, castle and vegetation are actual 3D geometry, not photogrammetry or high-poly GLBs. Materials are authored procedural textures. The current gate and chapel are exterior gameplay landmarks, not furnished interiors.
- Character combat, inventory, save files, cutscenes, dynamic day/night and polished sound are not implemented in v0.1.
- The architecture is an original prototype. No references or screenshots supplied by the user are copied into the shipped game.
- An internet connection is needed to load Three.js from CDN. All textures and game-specific JavaScript are shipped with the ZIP.

## Checks

```bash
npm test
npm run check
```

Texture regeneration (only if desired): `python -m pip install pillow numpy && python tools/generate_textures.py`.

MIT licensed source; original Ashen Kingdom concept art direction and title are project placeholders that can be renamed before release.
