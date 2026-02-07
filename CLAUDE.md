# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pokemon Memory Match is a vanilla JavaScript memory card game built for a 5-year-old (Damian), optimized for Xiaomi Pad 7S Pro (3:2 aspect ratio tablet). Deployed via GitHub Pages.

**Zero dependencies** — no package.json, no build tools, no framework. All code runs directly in the browser.

## Running Locally

Open `index.html` directly in a browser, or serve via any HTTP server:
```bash
python -m http.server 8000
```

There is no build step, no test suite, and no linter configured.

## Project Structure

```
PokemonMemoryMatch/
├── index.html              # Main HTML entry point
├── css/
│   └── style.css          # All styles (1328 lines)
├── js/
│   └── script.js          # All game logic (1655 lines)
├── assets/
│   ├── audio/             # Music and sound effects
│   │   ├── battle-music.mp3      # Pokemon battle theme (2.7MB)
│   │   ├── victory-music.mp3     # Victory theme (1.0MB)
│   │   └── Good Job Damian.mp3   # Personalized message (62KB)
│   └── docs/              # Archived planning docs
├── CLAUDE.md              # This file
└── README.md              # User-facing documentation
```

## Architecture

- **`index.html`** — Markup for all game screens (mode selector, Memory Match, HP Battle, Collection). Loads Google Font "ZCOOL KuaiLe".
- **`js/script.js`** — All game logic in a single file (~1655 lines):
  - **Pokemon data**: 23 Pokemon for Memory Match, 16 for HP Battle. Sprites from PokeAPI CDN.
  - **Game modes**: Memory Match (card flip), HP Battle (auto-battle system), Collection (stickers/unlocks)
  - **Online mode**: PeerJS WebRTC for 2-player battles (host-authoritative)
  - **Audio**: Web Audio API synthesized SFX + HTML5 Audio for music (Pokemon Red/Blue OST)
  - **Progression**: localStorage for unlocks, stickers, win streaks
  - **Battle system**: Type effectiveness (fire/water/grass), auto-battle AI, team picker
- **`css/style.css`** — CSS variables for Pokémon theming. CSS Grid layouts. 3D card flips via `transform-style: preserve-3d`. Touch-optimized (60px+ tap targets).

## Key Design Constraints

- **Target user is a 5-year-old** — UI must remain simple, touch-friendly, with large elements and high-contrast colors.
- **Tablet-first** — Designed for 3:2 aspect ratio; viewport scaling is disabled.
- **No external JS dependencies** — All effects (audio, confetti, animations) are implemented with browser APIs.
