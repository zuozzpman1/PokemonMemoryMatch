# Quick Guide: Get Pokemon Sounds in 10 Minutes

## The Fastest Path (Recommended)

### Step 1: Download 1 ZIP File (2 minutes)

Visit this link and download the complete Gen 1 sound effects:
```
https://downloads.khinsider.com/game-soundtracks/album/pokemon-sfx-gen-1-attack-moves-rby
```

Click **"Download"** → **"Download all songs (MP3)"** → Extract the ZIP

You'll get 328 authentic Pokemon Game Boy sounds (11 MB)

### Step 2: Copy These 8 Essential Sounds (3 minutes)

From the downloaded files, copy these to your pokemon-sounds folders:

```bash
# Attack sounds
cp "downloaded-folder/Tackle.mp3" ~/Desktop/pokemon-sounds/battle/attack-hit.mp3
cp "downloaded-folder/Thunder Shock.mp3" ~/Desktop/pokemon-sounds/battle/attack-electric.mp3

# Effects
cp "downloaded-folder/Super Effective.mp3" ~/Desktop/pokemon-sounds/effects/super-effective.mp3
cp "downloaded-folder/Not Very Effective.mp3" ~/Desktop/pokemon-sounds/effects/not-effective.mp3

# Status (you may need to search for these in the collection)
# Or download individually from sources below
```

### Step 3: Download These 4 Individual Sounds (5 minutes)

**Option A: The Sounds Resource**
1. Go to: https://www.sounds-resource.com/game_boy_gbc/pokemonredblueyellow/sound/17241/
2. Search and download:
   - `pokemon-faint.mp3` (SFX_FAINT_THUD)
   - `menu-select.mp3` (SFX_PRESS_AB)
   - `hp-low.mp3` (SFX_BATTLE_1E)
   - `levelup.mp3` (SFX_LEVEL_UP)

**Option B: SoundsVerse** (easier individual downloads)
1. Go to: https://soundsverse.com/pokemon-video-game/red-and-blue
2. Search for each sound by name
3. Click download (MP3 format)

---

## The 8 Essential Sounds You Need

| Sound File | Used For | Priority |
|------------|----------|----------|
| `attack-hit.mp3` | Normal attack damage | ⭐⭐⭐ Must have |
| `pokemon-faint.mp3` | Pokemon HP reaches 0 | ⭐⭐⭐ Must have |
| `super-effective.mp3` | 2x type advantage | ⭐⭐⭐ Must have |
| `not-effective.mp3` | 0.5x type disadvantage | ⭐⭐ Important |
| `menu-select.mp3` | Button clicks/team selection | ⭐⭐ Important |
| `hp-low.mp3` | Low health warning | ⭐ Nice to have |
| `levelup.mp3` | Pokemon unlock notification | ⭐ Nice to have |
| `battle-start.mp3` | Battle begins | ⭐ Nice to have |

---

## Quick Commands

```bash
# Check your downloads
ls -la ~/Desktop/pokemon-sounds/*/

# Test a sound
afplay ~/Desktop/pokemon-sounds/battle/attack-hit.mp3

# Copy sounds to game (once you have them)
cp ~/Desktop/pokemon-sounds/**/*.mp3 "/Users/michaelzuo/Engineering/Workspace of Antigravity/PokemonMemoryMatch/assets/audio/"
```

---

## Alternative: Use Free Sound Effect Sites

If KHInsider downloads are difficult, use these:

### Pixabay (No account needed)
https://pixabay.com/sound-effects/search/pokemon/

### Freesound (Free account required)
https://freesound.org/search/?q=pokemon+game+boy

### Zapsplat (Free account)
https://www.zapsplat.com/

Search for:
- "8-bit hit"
- "game boy attack"
- "retro damage"
- "chip tune faint"

---

## Integration Code (Ready to Use)

Once you have the sounds, here's the code to add to your game:

```javascript
// Add to js/script.js

// Preload sound effects
const sfx = {
    attackHit: new Audio('assets/audio/sfx/attack-hit.mp3'),
    faint: new Audio('assets/audio/sfx/pokemon-faint.mp3'),
    superEffective: new Audio('assets/audio/sfx/super-effective.mp3'),
    notEffective: new Audio('assets/audio/sfx/not-effective.mp3'),
    menuSelect: new Audio('assets/audio/sfx/menu-select.mp3'),
    hpLow: new Audio('assets/audio/sfx/hp-low.mp3'),
    levelUp: new Audio('assets/audio/sfx/levelup.mp3')
};

// Set volumes
Object.values(sfx).forEach(audio => audio.volume = 0.5);

// Replace existing functions
function playAttackSound(type) {
    sfx.attackHit.currentTime = 0;
    sfx.attackHit.play().catch(e => console.log('SFX play failed:', e));
    vibrate([30, 20, 40]);
}

function playSuperEffectiveSound() {
    sfx.superEffective.currentTime = 0;
    sfx.superEffective.play().catch(e => console.log('SFX play failed:', e));
    vibrate([40, 20, 40, 20, 80]);
}

function playFaintSound() {
    sfx.faint.currentTime = 0;
    sfx.faint.play().catch(e => console.log('SFX play failed:', e));
    vibrate([60, 40, 80]);
}
```

---

## Next Steps

1. **Right now**: Visit KHInsider link and download the ZIP (2 min)
2. **Extract**: Unzip the file (1 min)
3. **Copy**: Move 8 sounds to pokemon-sounds folders (3 min)
4. **Test**: Run `afplay` commands to verify (1 min)
5. **Later**: Integrate into game with code above (10 min)

**Total time: 10-15 minutes**

---

## Need Help?

- Can't download from KHInsider? Try The Sounds Resource or Pixabay
- Can't find a specific sound? Use any similar 8-bit/Game Boy sound
- Integration questions? Check `/Desktop/pokemon-sounds/INTEGRATION_GUIDE.md`

**The guide is ready at:** `/Users/michaelzuo/Desktop/pokemon-sounds/`
