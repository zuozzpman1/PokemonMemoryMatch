# Quality Risk Analysis & Stability Improvement Plan

## 1. Confirmed Bugs

### BUG-1: Confetti array splice during iteration (script.js:246-248)

```js
confettiParticles.forEach((p, index) => {
    // ...
    if (p.y > canvas.height) {
        confettiParticles.splice(index, 1);  // BUG
    }
});
```

**Risk: Medium** — Mutating an array with `splice()` while iterating with `forEach` shifts indices, causing particles to be skipped. The confetti will appear to flicker and some particles will never be removed.

**Fix:** Filter instead of splice:
```js
confettiParticles = confettiParticles.filter(p => p.y <= canvas.height);
```

---

### BUG-2: Memory match uses weak shuffle for card deck (script.js:406)

```js
deck.sort(() => Math.random() - 0.5);
```

`Array.sort` with a random comparator produces a biased distribution — cards near the beginning of the array are statistically more likely to stay near the beginning. This happens **after** `shuffleArray()` already properly shuffles the Pokemon selection (Fisher-Yates), so the card pairs are selected fairly but their positions on the board are biased.

**Risk: Low** — A 5-year-old won't notice, but it means certain board positions are more predictable than they should be.

**Fix:** Use the existing `shuffleArray()`:
```js
deck = shuffleArray(deck);
```

---

### BUG-3: Confetti particle leak on repeated victories (script.js:213-228)

`createConfetti()` pushes 150 new particles onto `confettiParticles` without clearing it first. If the player wins the memory game, clicks "Play Again", and wins again quickly before all particles have fallen off-screen, the new 150 particles stack onto the remaining old ones. Over several quick games this accumulates.

**Risk: Low** — `initGame()` does clear `confettiParticles = []` on restart, so this only matters if victory is triggered without a restart in between (unlikely in memory match, but possible in rapid battle wins).

---

### BUG-4: Double `isOnline` state variable (script.js:276, 545, 662)

There are two separate variables tracking online status: the global `isOnline` (line 545) and `hpBattleState.isOnline` (line 914). They're set independently in different places:
- `setupConnection()` sets both (line 662-663)
- `handleDisconnect()` sets both (line 694-695)
- But `battle-vs-cpu-btn` only sets `hpBattleState.isOnline` (line 276)
- Various cleanup paths may miss one or the other

**Risk: Medium** — If these fall out of sync, online state checks behave inconsistently. For example, `handleDisconnect()` checks the global `isOnline` while `showHpBattleLoss()` checks `hpBattleState.isOnline`.

---

### BUG-5: Room code collision causes infinite recursion (script.js:624-632)

```js
peer.on('error', (err) => {
    if (err.type === 'unavailable-id') {
        peer.destroy();
        createRoom();  // Recursive call
    }
});
```

If the PeerJS server is under heavy load or all 4-digit codes (1000-9999) are taken, this recurses without bound. In practice the 9000-code space makes exhaustion unlikely, but there's no recursion limit.

**Risk: Low** — Extremely unlikely in practice, but could crash the tab if it happens.

---

## 2. Robustness Risks

### RISK-1: No error handling for sprite image loading

`createCard()` (line 434) and `getSpriteUrl()` (line 891-893) construct URLs to the PokeAPI GitHub-hosted sprites. If the CDN is down, slow, or rate-limited:
- All card fronts show broken image icons
- Battle sprites show nothing
- No fallback, no loading indicator, no retry

**Impact: High** — The entire game becomes visually broken. A child seeing broken image icons would be confused.

**Mitigation:**
- Add `onerror` handler on `<img>` elements to show a text fallback (Pokemon name)
- Consider caching sprites as base64 in localStorage after first load
- Add a loading state before starting the game

---

### RISK-2: No validation on PeerJS network messages (script.js:669-690)

`onDataReceived()` trusts all incoming data without validation. A malicious peer could send:
- `{ type: 'hp-turn-result', damage: 99999 }` — one-shot kill
- `{ type: 'hp-turn-result', resultType: 'attack' }` with missing fields — crash
- Arbitrary `newActiveIndex` values in `hp-switch-choice` — array out-of-bounds

**Impact: Medium** — This is a game for a 5-year-old played with family, so malicious peers are unlikely. But if the room code is guessed by a stranger, the game could crash or behave strangely.

**Mitigation:** Validate incoming message shape and ranges before processing.

---

### RISK-3: No timeout on PeerJS connection attempts (script.js:635-657)

When joining a room, if the host is unreachable, the connection attempt hangs indefinitely. The user sees "Connecting..." with no way to know if it will ever succeed.

**Impact: Medium** — A child will be stuck staring at "Connecting..." and need adult help to go back.

**Mitigation:** Add a 10-15 second timeout that shows "Could not connect. Try again." and cleans up the peer.

---

### RISK-4: localStorage could be cleared or unavailable

The game persists progression, stickers, and win streaks in localStorage. This data is lost if:
- Browser storage is cleared
- Private/incognito mode is used
- Storage quota is exceeded
- A different device is used

`saveProgress()` (line 325-331) does have a try/catch, but there's no user-visible feedback when saves fail silently.

**Impact: Medium** — Losing all stickers and progress would upset a child.

---

### RISK-5: Web Audio API autoplay restrictions

`audioCtx` is created immediately on load (line 82):
```js
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
```

Modern browsers suspend AudioContext until a user gesture. The code handles this in `playTone()` (line 85) by calling `audioCtx.resume()`, but only when `state === 'suspended'`. If the first user interaction triggers a function that doesn't go through `playTone()` (e.g., `speakVictoryMessage()`), audio may fail silently.

**Impact: Low** — The flip sound (which does go through `playTone()`) will typically fire first, resuming the context.

---

### RISK-6: External CDN dependency is a single point of failure

The app depends on two external CDNs loading successfully:
- `https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js` — Online mode completely broken if this fails
- `https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap` — Font falls back to Comic Sans (acceptable)
- `https://raw.githubusercontent.com/PokeAPI/sprites/...` — All images broken if this fails

**Impact: High** — If the user is offline or behind a restrictive firewall, the game loads but has no images and online mode crashes with `Peer is not defined`.

**Mitigation:**
- Bundle PeerJS locally instead of CDN
- Add a `typeof Peer === 'undefined'` guard before online mode buttons
- Bundle at least the 16 battle Pokemon sprites locally (they're small PNGs)

---

## 3. Maintainability Concerns

### MAINT-1: Single 1538-line file with 25+ global variables

All game logic, audio, networking, confetti, progression, and three game modes live in one file with globals. This makes it difficult to:
- Understand which variables affect which mode
- Refactor one mode without risking others
- Test any function in isolation

**Recommendation:** Even without a build system, the code could be split into multiple `<script>` tags:
```
script-data.js      — POKEMON_DATA, BATTLE_POKEMON, TYPE_CHART, constants
script-audio.js     — Audio and vibration functions
script-memory.js    — Memory match game
script-battle.js    — HP battle (CPU + online)
script-network.js   — PeerJS networking
script-progress.js  — localStorage persistence
script-ui.js        — Screen management, confetti, shared rendering
```

---

### MAINT-2: Duplicated state between online and offline code paths

The `runAutoBattle()` function (lines 1065-1167) handles both CPU and online play in one function with nested `if (hpBattleState.isOnline && hpBattleState.isHost)` checks throughout. Similarly, `onPlayerSwitch()` has separate branches for host, guest, and CPU.

This interleaving makes it hard to reason about either mode in isolation. Adding a new feature (e.g., "watch replay") would require touching every branch.

---

### MAINT-3: Deep callback nesting in animation chains

Battle animations use 3-4 levels of nested `setTimeout` callbacks:

```
animateAttack → setTimeout → (hit flash) → setTimeout → (hp drain) → setTimeout → callback
  → animateFaint → setTimeout → callback
    → runAutoBattle (next turn)
```

This pyramid makes it difficult to follow the control flow or insert new behavior at specific points.

**Recommendation:** Consider using Promises or async/await for animation sequencing:
```js
async function runAutoBattleTurn(attackerSide) {
    await animateAttack(...);
    defender.currentHp -= damage;
    if (defender.currentHp <= 0) {
        await animateFaint(...);
        // ...
    }
}
```

---

### MAINT-4: HTML uses inline IDs for every element (68 unique IDs)

The HTML has 68 unique element IDs, all referenced by `document.getElementById()` in JavaScript. There's no naming convention — some use hyphens (`hp-battle-result-modal`), some are short (`score`). Adding a new screen requires inventing unique IDs and hoping they don't collide.

---

### MAINT-5: No version tracking or cache busting

The HTML loads `script.js` and `style.css` without version parameters:
```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
```

After deploying via GitHub Pages, users may see stale cached versions of JS/CSS while the HTML updates.

**Recommendation:** Add a version query string: `script.js?v=2.1` or use a build step to hash filenames.

---

## 4. Security Considerations

### SEC-1: innerHTML with user-influenced data

Several functions use `innerHTML` with template literals containing Pokemon data:

```js
card.innerHTML = `
    <img src="${getSpriteUrl(pokemon.id)}" ... alt="${pokemon.name}">
    <div class="team-card-name">${pokemon.name}</div>
    ...
`;
```

Currently the Pokemon data is hardcoded constants, so this is safe. But if Pokemon data ever comes from an external source (API, user input), this becomes an XSS vector.

**Risk: Low now, but worth noting for future development.**

---

### SEC-2: PeerJS room codes are easily guessable

Room codes are 4-digit numbers (1000-9999), giving only ~9000 possible codes. An attacker could brute-force codes to find active rooms and disrupt games.

**Risk: Low** — The target audience is a 5-year-old playing with family on a local network. But if the game is shared more widely, this becomes a concern.

---

## 5. Performance Risks

### PERF-1: Unnecessary DOM re-renders in team picker

`togglePokemonSelection()` (line 970-983) calls `renderTeamPickerGrid()` which destroys and rebuilds all 16 DOM cards on every click. This involves:
- 16 `createElement` calls
- 16 image loads (even though they're cached)
- 16 event listener setups

**Impact: Low** — 16 elements is small enough that this doesn't cause visible jank. But it's wasteful.

---

### PERF-2: `loadProgress()` called repeatedly without caching

`loadProgress()` parses JSON from localStorage every time it's called. In `renderTeamPickerGrid()` and `renderCollectionGrid()`, it's called once per render. In `showHpBattleVictory()`, three separate functions each call `loadProgress()` independently (`incrementWinStreak`, `addSticker` x4).

**Impact: Low** — localStorage access is fast, but each call does `JSON.parse` + `UNLOCK_ORDER.forEach` + spread. During a victory, this means ~5 parse cycles in rapid succession.

---

### PERF-3: Confetti canvas runs requestAnimationFrame indefinitely

If confetti particles never all fall off-screen (e.g., due to the splice-during-iteration bug in BUG-1), `updateConfetti()` runs forever, consuming CPU even when the confetti canvas is visually hidden behind modals.

---

## 6. Recommendations Summary (Prioritized)

| Priority | Issue | Type | Effort |
|----------|-------|------|--------|
| **P0** | BUG-1: Fix confetti splice-during-iteration | Bug fix | 5 min |
| **P0** | BUG-2: Replace biased deck sort with `shuffleArray()` | Bug fix | 1 min |
| **P1** | RISK-1: Add image load error fallbacks | Robustness | 30 min |
| **P1** | RISK-6: Bundle PeerJS locally + guard online mode | Robustness | 15 min |
| **P1** | RISK-3: Add connection timeout | Robustness | 10 min |
| **P1** | BUG-4: Unify `isOnline` into single source of truth | Bug fix | 20 min |
| **P2** | MAINT-5: Add cache-busting version to asset URLs | Maintenance | 5 min |
| **P2** | RISK-2: Validate incoming network messages | Robustness | 30 min |
| **P2** | MAINT-1: Split script.js into modules | Maintenance | 2 hrs |
| **P3** | MAINT-3: Refactor animation callbacks to async/await | Maintenance | 3 hrs |
| **P3** | BUG-5: Add recursion limit to `createRoom()` | Bug fix | 5 min |
| **P3** | PERF-2: Cache `loadProgress()` result per frame | Performance | 15 min |
