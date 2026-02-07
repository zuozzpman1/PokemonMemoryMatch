# Pokemon Sound Effects - Integration Guide

Quick reference for adding downloaded sounds to your Pokemon Memory Match game.

## Current Game Audio System

**Location:** `/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/`

**Current implementation:**
- Web Audio API for synthesized tones (flip, match)
- `Good Job Damian.mp3` for victory
- No external audio library

**Relevant file:** `script.js` - All audio logic

## Sound Requirements by Game Mode

### HP Battle Mode (Auto-Battle)
```javascript
// Attack sounds
playSound('attack-hit.mp3');           // Normal damage
playSound('attack-super-effective.mp3'); // 2x damage
playSound('attack-not-effective.mp3');   // 0.5x damage

// Status changes
playSound('pokemon-faint.mp3');        // HP reaches 0
playSound('pokemon-switch.mp3');       // Auto-switch on faint

// Battle flow
playSound('battle-start.mp3');         // Start of battle
playSound('victory-battle.mp3');       // Win battle
playSound('defeat-battle.mp3');        // Lose battle
```

### Memory Match Mode
```javascript
// Current: Web Audio API beeps
// Optional upgrade with GB sounds:
playSound('menu-cursor.mp3');          // Card hover
playSound('card-flip.mp3');            // Card flip
playSound('match-found.mp3');          // Match found
playSound('level-up.mp3');             // All pairs matched
```

### Collection Screen
```javascript
playSound('menu-select.mp3');          // Click Pokemon
playSound('unlock-pokemon.mp3');       // New Pokemon unlocked
```

### Menu/Navigation
```javascript
playSound('menu-cursor.mp3');          // Button hover
playSound('menu-select.mp3');          // Button click
playSound('menu-cancel.mp3');          // Back button
```

## Implementation Pattern

### Option 1: HTML Audio Elements (Simplest)

Add to `index.html` before closing `</body>`:

```html
<!-- Pokemon Sound Effects -->
<audio id="sfx-attack-hit" preload="auto">
  <source src="sounds/battle/attack-hit.mp3" type="audio/mpeg">
</audio>
<audio id="sfx-attack-super" preload="auto">
  <source src="sounds/effects/super-effective.mp3" type="audio/mpeg">
</audio>
<audio id="sfx-attack-weak" preload="auto">
  <source src="sounds/effects/not-effective.mp3" type="audio/mpeg">
</audio>
<audio id="sfx-faint" preload="auto">
  <source src="sounds/status/pokemon-faint.mp3" type="audio/mpeg">
</audio>
<audio id="sfx-victory" preload="auto">
  <source src="sounds/victory/victory-short.mp3" type="audio/mpeg">
</audio>
<audio id="sfx-menu-select" preload="auto">
  <source src="sounds/menu/select.mp3" type="audio/mpeg">
</audio>
```

Add to `script.js`:

```javascript
// Sound effect helper
function playSFX(id) {
  const audio = document.getElementById(`sfx-${id}`);
  if (audio) {
    audio.currentTime = 0; // Reset to start
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
}

// Usage in battle system
function applyDamage(damage, effectiveness) {
  // ... damage calculation ...

  // Play appropriate sound
  if (effectiveness === 2.0) {
    playSFX('attack-super');
  } else if (effectiveness === 0.5) {
    playSFX('attack-weak');
  } else {
    playSFX('attack-hit');
  }
}

function handleFaint() {
  playSFX('faint');
  // ... faint logic ...
}
```

### Option 2: Howler.js (Better for Games)

Add to `index.html` before `script.js`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>
```

Add to `script.js`:

```javascript
// Initialize sound library
const sounds = {
  attackHit: new Howl({ src: ['sounds/battle/attack-hit.mp3'], volume: 0.7 }),
  attackSuper: new Howl({ src: ['sounds/effects/super-effective.mp3'], volume: 0.8 }),
  attackWeak: new Howl({ src: ['sounds/effects/not-effective.mp3'], volume: 0.6 }),
  faint: new Howl({ src: ['sounds/status/pokemon-faint.mp3'], volume: 0.8 }),
  victory: new Howl({ src: ['sounds/victory/victory-short.mp3'], volume: 0.9 }),
  menuSelect: new Howl({ src: ['sounds/menu/select.mp3'], volume: 0.5 }),
  menuCursor: new Howl({ src: ['sounds/menu/cursor.mp3'], volume: 0.3 })
};

// Usage
function applyDamage(damage, effectiveness) {
  if (effectiveness === 2.0) {
    sounds.attackSuper.play();
  } else if (effectiveness === 0.5) {
    sounds.attackWeak.play();
  } else {
    sounds.attackHit.play();
  }
}
```

### Option 3: Web Audio API (Current Approach)

Keep synthesized sounds, add MP3 for key moments:

```javascript
// Existing Web Audio for beeps
// Add real sounds for important events only

const criticalSounds = {
  faint: new Audio('sounds/status/pokemon-faint.mp3'),
  victory: new Audio('sounds/victory/victory-short.mp3'),
  superEffective: new Audio('sounds/effects/super-effective.mp3')
};

// Preload
Object.values(criticalSounds).forEach(audio => audio.load());

// Play with fallback
function playImportantSound(name) {
  const audio = criticalSounds[name];
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Fallback to Web Audio beep
      playBeep(440, 200);
    });
  }
}
```

## Recommended Sound Mapping

### Battle System Priority Order

**Essential (Priority 1):**
1. `pokemon-faint.mp3` - Most important, dramatic moment
2. `attack-hit.mp3` - Played frequently, needs to be crisp
3. `victory-short.mp3` - End of battle satisfaction

**Important (Priority 2):**
4. `super-effective.mp3` - Type advantage feedback
5. `not-effective.mp3` - Type disadvantage feedback
6. `battle-start.mp3` - Set the mood

**Nice to Have (Priority 3):**
7. `menu-select.mp3` - UI feedback
8. `pokemon-switch.mp3` - Pokemon swap
9. `hp-low.mp3` - Warning sound

### File Organization

Copy downloaded sounds to your game:

```bash
# Create sounds directory in your game
mkdir -p "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds"
mkdir -p "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/battle"
mkdir -p "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/effects"
mkdir -p "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/menu"
mkdir -p "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/status"
mkdir -p "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/victory"

# Copy essential sounds
cp ~/Desktop/pokemon-sounds/status/pokemon-faint.mp3 \
   "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/status/"

cp ~/Desktop/pokemon-sounds/battle/attack-*.mp3 \
   "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/battle/"

# etc...
```

## Volume Balancing

Game Boy sounds can be loud. Recommended volumes:

```javascript
const volumeLevels = {
  // Combat
  attackHit: 0.6,        // Frequent, keep moderate
  attackSuper: 0.8,      // Emphasize effectiveness
  attackWeak: 0.5,       // Subtle for weak hits

  // Status
  faint: 0.9,            // Important moment, loud
  levelUp: 0.7,          // Celebration
  capture: 0.7,          // Celebration

  // Menu
  menuCursor: 0.3,       // Very subtle
  menuSelect: 0.5,       // Moderate feedback

  // Victory
  victoryShort: 0.85,    // Satisfying but not jarring
  victoryFull: 0.9       // Full celebration
};
```

## Performance Considerations

**For tablet (Xiaomi Pad 7S Pro):**
- Preload essential sounds only
- Use MP3 format (best compatibility)
- Bitrate: 128kbps sufficient for Game Boy sounds
- Keep individual files under 100KB
- Total audio budget: ~2-5MB for all sounds

**Lazy loading pattern:**

```javascript
// Load sounds on first battle start, not on page load
let soundsLoaded = false;

function loadBattleSounds() {
  if (soundsLoaded) return;

  // Initialize sound objects here
  sounds.attackHit = new Audio('sounds/battle/attack-hit.mp3');
  // ... etc

  soundsLoaded = true;
}

// Call when entering battle mode
function startBattle() {
  loadBattleSounds();
  // ... battle logic
}
```

## Testing Checklist

After integration, test:

- [ ] Attack hit sound plays on normal damage
- [ ] Super effective sound plays on 2x damage
- [ ] Not effective sound plays on 0.5x damage
- [ ] Faint sound plays when HP reaches 0
- [ ] Victory sound plays on battle win
- [ ] Menu sounds don't overlap awkwardly
- [ ] Sounds work on both online and CPU battles
- [ ] Volume levels are balanced
- [ ] No audio delay/lag during auto-battle
- [ ] Sounds work on tablet (test on Xiaomi Pad 7S Pro)

## Quick Start Command

After downloading sounds from KHInsider:

```bash
# 1. Extract downloaded ZIP
unzip ~/Downloads/pokemon-sfx-gen-1-attack-moves-rby.zip -d ~/Desktop/pokemon-sounds/battle/

# 2. Copy to game directory
mkdir -p "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/battle"
cp ~/Desktop/pokemon-sounds/battle/Tackle.mp3 \
   "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/battle/attack-hit.mp3"

# 3. Test playback
afplay "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/sounds/battle/attack-hit.mp3"
```

## Fallback Strategy

Always have fallback for audio failures:

```javascript
function playSoundSafe(soundName) {
  try {
    if (sounds[soundName]) {
      sounds[soundName].play();
    }
  } catch (error) {
    // Silently fail or use Web Audio beep
    console.log('Sound playback failed:', soundName);
    // Optional: playWebAudioBeep();
  }
}
```

## Next Steps

1. Download sounds using the DOWNLOAD_GUIDE.md
2. Choose implementation pattern (Option 1 recommended for simplicity)
3. Copy 3-5 essential sounds to test
4. Update script.js with playSFX() calls
5. Test on desktop browser
6. Test on Xiaomi Pad 7S Pro
7. Fine-tune volume levels
8. Add remaining sounds gradually

---

**Pro tip:** Start with just 3 sounds:
1. attack-hit.mp3
2. pokemon-faint.mp3
3. victory-short.mp3

Get those working perfectly, then expand!
