# Resource Source Directory

This directory contains all guides, tools, and documentation for downloading and managing Pokemon sound effects.

## Quick Start

Run the interactive helper script:
```bash
./download-pokemon-sfx.sh
```

## Contents

### 📋 Guides
- **READY_TO_USE.txt** - Quick summary of completed improvements
- **POKEMON_SOUNDS_QUICK_GUIDE.md** - 10-minute quick start guide for downloading SFX

### 🛠️ Tools
- **download-pokemon-sfx.sh** - Interactive script to:
  - Open download links in browser
  - Show file placement guide
  - Test downloaded SFX files

### 📚 Documentation
- **pokemon-sounds/** - Complete sound effects documentation:
  - `README.md` - Overview and quick start
  - `DOWNLOAD_GUIDE.md` - Comprehensive download sources
  - `INTEGRATION_GUIDE.md` - Code examples and integration
  - `MANUAL_DOWNLOAD_LIST.txt` - Step-by-step instructions
  - `download-sounds.sh` - Alternative download helper
  - `test-audio.sh` - Audio testing script
  - Organized folders: `battle/`, `effects/`, `menu/`, `status/`, `victory/`

## What You Need to Download

### Essential (3 files - 5 minutes):
1. `attack-hit.mp3` - Normal attack sound
2. `pokemon-faint.mp3` - Pokemon faints
3. `super-effective.mp3` - 2x type advantage

### Recommended (3 more files - 5 minutes):
4. `not-effective.mp3` - 0.5x type disadvantage
5. `menu-select.mp3` - UI button clicks
6. `levelup.mp3` - Pokemon unlock

## Where Files Go

Downloaded SFX should be placed in:
```
../assets/audio/sfx/
```

The game automatically detects and uses them. If files aren't found, synthesized sounds are used as fallback.

## Best Download Source

**KHInsider - Pokemon Gen 1 Attack Sounds** (Fastest)
- URL: https://downloads.khinsider.com/game-soundtracks/album/pokemon-sfx-gen-1-attack-moves-rby
- Download: Click "Download" → "Download all songs (MP3)"
- Extract and rename 3-6 key files
- Time: 5-10 minutes total

## See Also

- Project SFX directory: `../assets/audio/sfx/README.md`
- Main documentation: `../IMPROVEMENTS_SUMMARY.md`
- Project structure: `../CLAUDE.md`
