# Pokemon Memory Match (Damian's Edition)

A web-based memory matching game built specifically for **Damian (5 years old)**. 
Designed for **Xiaomi Pad 7S Pro** (3:2 Aspect Ratio).

👉 **[Play the Game Here](https://MichaelZuo-AI.github.io/PokemonMemoryMatch/)** 👈

## Features for Damian
*   **Simple English**: Easy-to-read words like "Score", "Restart", and "Good Job".
*   **Pokemon Theme**: Features Pikachu, Charmander, Mewtwo, and more!
*   **Touch Friendly**: Large cards and buttons optimized for tablet use.
*   **Victory Celebration**: 
    *   Confetti explosion! 🎉
    *   "Good Job Damian!" popup.
    *   Personalized audio message.

## Release History

### v2.1 - Manual Switch on Faint & Balance Update
*   **New Feature**: When a Pokemon faints in battle, the player now manually picks which replacement to send in via a "Choose Next Pokemon!" overlay.
*   **CPU Behavior**: CPU still auto-switches to the next alive Pokemon.
*   **Online Support**: Both players pick their own replacements when their Pokemon faints (via `hp-request-switch` / `hp-switch-choice` protocol).
*   **Balance**: Buffed Mewtwo (HP 32, Damage 11) and Dragonite (HP 35, Damage 10) — now the strongest Pokemon in the game.

### v2.0 - Pokemon Battle Mode & Collection
*   **New Mode**: HP Battle — auto-battle Pokemon combat (team of 3, attack-only, type advantages).
*   **VS CPU**: Pick your team and fight a CPU-selected opponent team.
*   **Online 2-Player**: Create/join rooms via PeerJS WebRTC for real-time online battles.
*   **Collection Screen**: View all unlocked Pokemon, earned stickers, and win streak.
*   **Progression**: Stickers earned by beating CPU Pokemon; win streak tracking.
*   **Expanded Roster**: 23 Pokemon across Fire, Water, Grass, and Normal types (16 battle-ready).
*   **Battle Lobby**: Room code system for online matchmaking.
*   **Dramatic Animations**: Attack, hit, faint, and switch-in sprite animations with sound effects.

### v1.2 - Gameplay Refinement
*   **Removed Mewtwo Rule**: Game now follows standard memory match rules (find all pairs).
*   **Bug Fix**: Fixed issue where overlay could hinder gameplay.

### v1.1 - The "Good Job Damian" Update
*   **New Feature**: Custom Audio - Plays "Good Job Damian" voice message on win.
*   **Polish**: Added colorful Confetti explosion effect on victory.
*   **UI**: Added a "Victory Modal" with 3 stars instead of a boring system alert.
*   **Gameplay Adjustment**: Changed Mewtwo rule from "Auto-Win" to "Psychic Flash" (reveals board for 1.5s) to extend playtime.

### v1.0 - Initial Release
*   Core Memory Match gameplay (4x4 Grid).
*   Responsive layout optimized for Xiaomi Pad 7S Pro (3:2 ratio).
*   Basic sound effects (Flip, Match).
*   Mewtwo Easter Egg (Auto-Win).
