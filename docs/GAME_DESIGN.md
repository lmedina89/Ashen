# GAME DESIGN DOCUMENT — ASHEN KINGDOM 0.1

## Creative pillar

A lonely traveller approaches a dead kingdom under a violet celestial storm. Architecture feels huge, landscapes feel ancient, and magic provides color in an otherwise foreboding moonlit world. No cartoon proportions, candy color grading, or noisy arcade UI.

## Art direction

- **Color:** velvet indigo and plum clouds, cold blue slate, moss green forest, copper/amber flames, turquoise ritual magic, scarce gold.
- **Scale:** 8–30 meter Gothic architecture viewed from a human-height camera; trees 8–14 meters; road curves through mountain shoulders.
- **Atmosphere:** nebula sky, distant stars, moonlight, exp2 fog, lights and drifting emissive particles.
- **Graphic options:** cinematic pixel resolution, crisp 3D; prioritize silhouettes, legible stone materials and mood over raw polygon count.

## Prototype quest loop

Explore forest road → discover rune lights → enter ruined processional → pass Gothic gate → restore four runes to Astral Altar → continue exploration.

The milestone intentionally has **no character enemies**: user-approved environment direction comes first, then character quality is researched independently. No placeholder enemies included.

## Production roadmap

1. **0.1 Astral Keep Environment Foundation (current):** static 3D architecture, procedural textures, sky panorama, mobile camera and rune quest.
2. **0.2 World fidelity:** improved architectural stone modular kits, physically raised road, more realistic silhouette trees, animated wisps, cliff decals, directional shadows on desktop.
3. **0.3 World interactivity:** opening doors, tower stairs, chapel interior, checkpoint/quest persistence, interactable candles and notes.
4. **0.4 Animation & narrative:** animated player hands, cinematic lore, dialogue, audio soundscape, atmospheric spectral phenomena.
5. **0.5 Characters/combat:** separately validated game-ready knight GLBs or professionally sourced licensed assets; rigorous quality gate, skeleton, locomotion, combat.

## Technical boundaries

Three.js/WebGL through Vite; generated PNG textures; deterministic procedural geometry; simple hardcoded collider regions for landmark walls (replace with collision meshes/navmesh for full production); static GitHub Pages host; optional Web Audio synthesized ambience.

## Quality gates before expanding

- Confirm 30 fps or acceptable responsiveness on intended iPhone.
- Confirm road alignment, gate traversal, rune interactions and camera collision.
- Replace placeholder architectural meshes only when visual improvements are demonstrably better.
- Verify any imported character model in actual gameplay size and perspective before committing it to content production.
