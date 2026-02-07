# Sound Effects (SFX) Directory

This folder contains authentic Pokemon Game Boy sound effects.

## Required Sound Files

Place the following MP3 files in this directory:

### Priority 1: Essential (Must Have)
1. **attack-hit.mp3** - Generic attack hit sound (used for all normal attacks)
2. **pokemon-faint.mp3** - Pokemon fainting sound (when HP reaches 0)
3. **super-effective.mp3** - Super effective hit (2x damage)

### Priority 2: Important (Recommended)
4. **not-effective.mp3** - Not very effective hit (0.5x damage)
5. **menu-select.mp3** - Menu button click/selection sound
6. **levelup.mp3** - Pokemon unlock/level up fanfare

### Priority 3: Nice to Have (Optional)
7. **attack-fire.mp3** - Fire-type attack (Ember, Flamethrower, etc.)
8. **attack-water.mp3** - Water-type attack (Water Gun, Surf, etc.)
9. **attack-grass.mp3** - Grass-type attack (Vine Whip, Solar Beam, etc.)
10. **hp-low.mp3** - Low HP warning sound

## Where to Get These Sounds

### Quick Method (5 minutes):
Visit: https://downloads.khinsider.com/game-soundtracks/album/pokemon-sfx-gen-1-attack-moves-rby

Download the MP3 ZIP and extract. You'll find files like:
- `Tackle.mp3` → rename to `attack-hit.mp3`
- `Super Effective.mp3` → rename to `super-effective.mp3`
- `Not Very Effective.mp3` → rename to `not-effective.mp3`

### Individual Downloads:
Visit: https://www.sounds-resource.com/game_boy_gbc/pokemonredblueyellow/sound/17241/

Search for:
- Faint sound (SFX_FAINT_THUD)
- Menu select (SFX_PRESS_AB)
- Level up (SFX_LEVEL_UP)

## File Specifications

- **Format**: MP3
- **Bitrate**: 128 kbps (sufficient for Game Boy sounds)
- **Size**: Keep each file under 100 KB
- **Volume**: Will be normalized in game to 0.6 (60%)

## Fallback Behavior

If a sound file is not present, the game will automatically use synthesized sounds (Web Audio API) as a fallback. The game will work fine without these files, but authentic Pokemon sounds provide a much better experience.

## Testing

After adding sound files, test them in the game:

1. **attack-hit.mp3**: Start an HP Battle and attack
2. **pokemon-faint.mp3**: Win a battle (opponent Pokemon faints)
3. **super-effective.mp3**: Use type advantage (fire vs grass, etc.)
4. **menu-select.mp3**: Click Pokemon in team picker
5. **levelup.mp3**: Win a Memory Match game (unlocks Pokemon)

## See Also

- Full download guide: `/Users/michaelzuo/Desktop/POKEMON_SOUNDS_QUICK_GUIDE.md`
- Complete collection: `/Users/michaelzuo/Desktop/pokemon-sounds/`
- Integration examples: `/Users/michaelzuo/Desktop/pokemon-sounds/INTEGRATION_GUIDE.md`
