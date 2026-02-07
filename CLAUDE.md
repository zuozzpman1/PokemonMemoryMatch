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

## Architecture

The entire app is three files:

- **`index.html`** — Markup for header (score, restart button), game board container, victory modal, and confetti canvas. Loads Google Font "ZCOOL KuaiLe" and links to `style.css` + `script.js`.
- **`script.js`** — All game logic in a single file:
  - **Pokemon data**: 8 Pokemon with PokeAPI IDs, names, and brand colors. Sprites loaded from PokeAPI CDN.
  - **Game state**: Global variables (`flippedCards`, `matchedPairs`, `isLocked`, `score`) — no state management library.
  - **Core functions**: `initGame()`, `createCard()`, `flipCard()`, `checkForMatch()`, `disableCards()`, `unflipCards()`.
  - **Audio**: Web Audio API synthesized tones (flip, match, victory fanfare) — no audio library.
  - **Confetti**: Canvas-based particle system (150 particles with gravity simulation) using `requestAnimationFrame`.
  - **Victory**: Shows modal, plays personalized "Good Job Damian.mp3", triggers confetti.
- **`style.css`** — CSS variables for Pokémon theming (`--primary-color: #ffcb05`, `--secondary-color: #3b4cca`, `--accent-color: #ff5050`). CSS Grid for 4x4 board. 3D card flip via `transform-style: preserve-3d` and `rotateY(180deg)`. Touch-optimized (no tap highlight, no user-select, large targets). Viewport units (vh/vw) for responsive sizing.

One audio asset: `Good Job Damian.mp3` (personalized victory message).

## Key Design Constraints

- **Target user is a 5-year-old** — UI must remain simple, touch-friendly, with large elements and high-contrast colors.
- **Tablet-first** — Designed for 3:2 aspect ratio; viewport scaling is disabled.
- **No external JS dependencies** — All effects (audio, confetti, animations) are implemented with browser APIs.
