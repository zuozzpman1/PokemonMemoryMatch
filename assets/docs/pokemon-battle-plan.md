# 🎮 Pokémon Card Battle Game — Consolidated Plan

## For Damian (age 5) | Built by Dad with Claude Code

---

## 1. Vision

Transform the existing **Pokémon Memory Match** game into a **turn-based Pokémon card battle game** — keeping the same design DNA (tablet-first, kid-friendly, no-frustration) while adding a simple but satisfying battle system. The memory match game becomes the **"training mode"** where Damian unlocks new Pokémon for his battle deck.

---

## 2. What We Keep from the Current Game

| Current Feature | How It Carries Over |
|---|---|
| PokéAPI sprites & data | Same API, expanded to ~20 Pokémon |
| Pokémon brand colors (`#ffcb05`, `#3b4cca`, `#ff5050`) | Core palette stays — it's iconic |
| "Good Job Damian.mp3" & victory confetti | Reused for battle victories |
| Touch-optimized, large targets | Same philosophy — big cards, fat buttons |
| Tablet-first (3:2 aspect ratio) | Primary target stays Xiaomi Pad 7S Pro |
| Web Audio synthesized sounds | Expanded for attacks, damage, type advantages |
| No complex text / reading required | Icons, colors, and numbers only |

---

## 3. Game Modes

### Mode 1: Memory Match (existing, lightly refreshed)
- Same 4×4 card flip game
- **New twist**: Each win unlocks a new Pokémon for the Battle Deck
- Acts as "training ground" for younger moments when battles feel too much

### Mode 2: Card Battle (the new main mode)
- Turn-based 1v1 Pokémon battles
- Player vs CPU (with optional 2-player hot-seat for playing with Dad)
- Simple enough that a 5-year-old can play independently after 1-2 guided rounds

---

## 4. Battle System Design (Age 5 Friendly)

### 4a. Team Building
- **Pick 3 Pokémon** from unlocked collection (tap to select, tap again to deselect)
- Visual grid of Pokémon cards showing: sprite, name, type icon, HP number
- No complex stats — just HP and type

### 4b. Battle Flow

```
┌─────────────────────────────────────┐
│         OPPONENT'S POKÉMON          │
│     [Sprite]  ❤️ 25/25 HP          │
│     💧 Squirtle                     │
│                                     │
│            ⚡ VS ⚡                  │
│                                     │
│        DAMIAN'S POKÉMON             │
│     [Sprite]  ❤️ 20/20 HP          │
│     🌿 Bulbasaur                    │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 🌿 ATTACK│  │ 🔄 SWITCH│        │
│  │ Vine Whip│  │  Pokémon │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

**Each turn, Damian has 2 choices:**
1. **ATTACK** (one big button per Pokémon — no move selection)
2. **SWITCH** (swap to another Pokémon from his team of 3)

That's it. Two buttons. No items, no status effects, no PP.

### 4c. Damage & Type System

**Three types only** (rock-paper-scissors triangle):

```
      🔥 Fire
     /       \
    /  beats   \
   /             \
🌿 Grass ←——→ 💧 Water
       beats
```

- **Super effective** (2× damage) → big green flash + "SUPER!" text
- **Normal** (1× damage) → standard hit
- **Not effective** (0.5× damage) → small red flash + "Weak..." text

**The type triangle is ALWAYS visible** on screen as a helper — Damian can look at it before choosing.

### 4d. Numbers (kept tiny)

| Stat | Range | Example |
|---|---|---|
| HP | 15–30 | Pikachu: 20 HP |
| Attack damage | 5–8 base | Thunderbolt: 6 damage |
| Super effective | ×2 | 6 → 12 damage |
| Not effective | ×0.5 | 6 → 3 damage |

Battles last ~4-6 turns. Quick, punchy, no drawn-out fights.

### 4e. CPU Opponent AI

- **Easy mode (default)**: CPU picks randomly, occasionally picking a type-disadvantaged Pokémon. Damian wins ~70% of the time.
- **Medium mode (unlockable)**: CPU picks the type-advantaged Pokémon when it can. Damian wins ~50%.
- No "hard mode" needed for a 5-year-old!

---

## 5. Pokémon Roster (Starter Set — 12 Pokémon)

| Pokémon | Type | HP | Attack | Damage |
|---|---|---|---|---|
| 🔥 Charmander | Fire | 20 | Ember | 6 |
| 🔥 Vulpix | Fire | 18 | Fire Spin | 7 |
| 🔥 Growlithe | Fire | 22 | Flame Wheel | 6 |
| 🔥 Flareon | Fire | 25 | Fire Blast | 5 |
| 💧 Squirtle | Water | 22 | Water Gun | 6 |
| 💧 Psyduck | Water | 20 | Aqua Tail | 7 |
| 💧 Lapras | Water | 28 | Surf | 5 |
| 💧 Vaporeon | Water | 25 | Hydro Pump | 6 |
| 🌿 Bulbasaur | Grass | 22 | Vine Whip | 6 |
| 🌿 Oddish | Grass | 18 | Razor Leaf | 7 |
| 🌿 Chikorita | Grass | 20 | Solar Beam | 6 |
| 🌿 Leafeon | Grass | 25 | Leaf Blade | 6 |

> All sprites from PokéAPI. Expand later with Electric, Psychic, etc.

---

## 6. Progression & Rewards

1. **Sticker Book** — After each battle win, Damian earns a Pokémon sticker (shiny card animation). Collecting all 12 = special celebration screen.
2. **New Pokémon Unlocks** — Start with 6 Pokémon (2 per type). Win Memory Match games to unlock the remaining 6.
3. **Win Streak Counter** — A simple star tracker (⭐⭐⭐) that resets each session. 3 wins in a row = bonus confetti explosion.
4. **No punishment for losing** — Encouraging message + "Battle Again?" button. Never feels bad.

---

## 7. Tech Stack Migration

| Aspect | Current (Memory Match) | New (Battle Game) |
|---|---|---|
| Framework | Vanilla JS | **React + Next.js** |
| Styling | Single CSS file | **CSS Modules or Tailwind** |
| State | Global variables | **React useState/useReducer** |
| Routing | Single page | **Next.js pages** (`/`, `/battle`, `/collection`) |
| Data | Hardcoded array | **PokéAPI fetch + local JSON fallback** |
| Audio | Web Audio API | **Same approach, wrapped in custom hooks** |
| Animations | CSS transitions + Canvas | **Framer Motion + CSS** |
| Deployment | GitHub Pages | **Vercel (free) or keep GitHub Pages** |
| Device target | Xiaomi Pad 7S Pro | **Same, responsive for phones too** |

### Project Structure
```
pokemon-battle/
├── app/
│   ├── page.tsx              # Home — mode select
│   ├── battle/
│   │   └── page.tsx          # Battle screen
│   ├── memory/
│   │   └── page.tsx          # Memory Match (existing game, ported)
│   └── collection/
│       └── page.tsx          # Sticker book / Pokémon collection
├── components/
│   ├── PokemonCard.tsx       # Reusable card (used in battle + collection)
│   ├── BattleScene.tsx       # Main battle UI
│   ├── HPBar.tsx             # Animated health bar
│   ├── TypeTriangle.tsx      # Always-visible type chart helper
│   ├── AttackAnimation.tsx   # Hit effects
│   ├── VictoryScreen.tsx     # Confetti + sticker reward
│   └── TeamPicker.tsx        # Pre-battle team selection
├── lib/
│   ├── pokemon-data.ts       # Pokémon roster, stats, moves
│   ├── battle-engine.ts      # Damage calc, type effectiveness, CPU AI
│   └── audio.ts              # Web Audio synth sounds
├── public/
│   └── Good Job Damian.mp3
└── CLAUDE.md                 # Updated for Claude Code
```

---

## 8. Build Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Next.js project with Tailwind
- [ ] Port PokéAPI integration + Pokémon data
- [ ] Build `PokemonCard` component (sprite, name, type badge, HP)
- [ ] Build home screen with mode selection (Memory Match / Battle)
- [ ] Port Memory Match game to React

### Phase 2: Battle Core (Week 2)
- [ ] Build `BattleScene` with opponent & player Pokémon display
- [ ] Implement `battle-engine.ts` (damage calc, type effectiveness)
- [ ] Add Attack & Switch buttons
- [ ] Animate HP bar changes
- [ ] CPU AI (easy mode — random with mistakes)
- [ ] Turn flow: player acts → CPU acts → check faint → next turn

### Phase 3: Polish & Juice (Week 3)
- [ ] Attack hit animations (shake, flash, particles)
- [ ] Type advantage callouts ("SUPER!" / "Weak...")
- [ ] Victory screen with confetti + "Good Job Damian.mp3"
- [ ] Lose screen with encouragement
- [ ] Sound effects (attack sounds, faint sound, victory fanfare)
- [ ] Type triangle helper always visible

### Phase 4: Progression (Week 4)
- [ ] Sticker book / collection page
- [ ] Unlock system (Memory Match wins → new Pokémon)
- [ ] Win streak tracker (⭐ stars)
- [ ] Team picker before battle
- [ ] LocalStorage to persist unlocks & collection

### Phase 5: Stretch Goals (Ongoing)
- [ ] 2-player hot-seat mode (pass the tablet)
- [ ] Pokémon evolution (Charmander → Charmeleon after 5 wins)
- [ ] More types (Electric, Psychic)
- [ ] Medium difficulty CPU
- [ ] Card "rarity" system (common / rare / legendary sparkle effects)

---

## 9. UX Principles (Non-Negotiable)

1. **No reading required** — Icons, colors, numbers only. Names shown but not needed to play.
2. **No timers** — Damian takes as long as he wants.
3. **No punishment** — Losing is gentle. Winning is a party.
4. **Two buttons max** per decision point — Attack or Switch.
5. **Always show the type triangle** — It's a learning tool, not a cheat.
6. **Big, chunky touch targets** — Minimum 60×60px tap areas.
7. **Instant feedback** — Every tap produces a sound + visual response.
8. **Sessions are short** — A full battle takes 2-3 minutes max.

---

## 10. Updated CLAUDE.md (for Claude Code)

When you start building, update your repo's `CLAUDE.md` to reflect the new architecture. Here's a draft:

```markdown
# CLAUDE.md

## Project Overview
Pokemon Card Battle is a React/Next.js turn-based battle game built for a 5-year-old (Damian),
optimized for Xiaomi Pad 7S Pro (3:2 tablet). Includes a legacy Memory Match mode.
Deployed via Vercel.

## Running Locally
npm run dev  # Next.js dev server on localhost:3000

## Architecture
- Next.js App Router with TypeScript
- Tailwind CSS for styling
- No external game engine — battle logic in lib/battle-engine.ts
- PokéAPI for sprites, local JSON fallback for offline play
- Web Audio API for sound effects (no audio library)
- Framer Motion for animations

## Key Design Constraints
- Target user is 5 years old — max 2 choices per screen, no reading required
- Tablet-first (3:2 aspect ratio), touch-optimized (60px+ tap targets)
- Type system: Fire > Grass > Water > Fire (3 types only)
- HP range: 15-30, Damage range: 5-8 base
- CPU wins ~30% of battles on easy mode
- Sessions < 3 minutes per battle

## Key Files
- lib/battle-engine.ts — Damage calc, type chart, CPU AI
- lib/pokemon-data.ts — Full roster with stats
- components/BattleScene.tsx — Main battle UI
- components/PokemonCard.tsx — Reusable card component
```

---

*This plan is designed to be built incrementally with Claude Code — each phase is self-contained and testable. Start with Phase 1, playtest with Damian, and iterate!* 🎉
