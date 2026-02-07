#!/bin/bash

# Pokemon Sound Effects Download Script
# Created: 2026-02-07
# Purpose: Download authentic Game Boy Pokemon sound effects

SOUNDS_DIR="/Users/michaelzuo/Desktop/pokemon-sounds"
cd "$SOUNDS_DIR"

echo "========================================"
echo "Pokemon Sound Effects Downloader"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to download with retry
download_file() {
    local url="$1"
    local output="$2"
    local description="$3"

    echo -e "${YELLOW}Downloading:${NC} $description"

    if curl -L -f -o "$output" "$url" 2>/dev/null; then
        echo -e "${GREEN}✓ Success:${NC} $description"
        return 0
    else
        echo -e "${RED}✗ Failed:${NC} $description"
        return 1
    fi
}

echo "This script will attempt to download Pokemon sound effects."
echo "Note: Many sites block automated downloads, so manual download may be required."
echo ""
echo "BEST OPTION: Visit this URL to download all 328 Gen 1 attack sounds:"
echo "https://downloads.khinsider.com/game-soundtracks/album/pokemon-sfx-gen-1-attack-moves-rby"
echo ""
read -p "Press Enter to continue with sample downloads..."

# Create a list of recommended manual downloads
cat > "$SOUNDS_DIR/MANUAL_DOWNLOAD_LIST.txt" << 'EOF'
# Pokemon Sound Effects - Manual Download List
# Updated: 2026-02-07

## PRIORITY 1: KHInsider Gen 1 Attack Sounds (BEST COLLECTION)
URL: https://downloads.khinsider.com/game-soundtracks/album/pokemon-sfx-gen-1-attack-moves-rby
Action:
1. Click "Download" button at top right
2. Select "Download all songs (MP3)" - 11 MB
3. Save ZIP file
4. Extract to: /Users/michaelzuo/Desktop/pokemon-sounds/battle/

This gives you 328 authentic Game Boy attack sounds!

## PRIORITY 2: Individual Essential Sounds

### The Sounds Resource - General SFX
URL: https://www.sounds-resource.com/game_boy_gbc/pokemonredblueyellow/sound/17241/
Sounds needed:
- Pokemon faint
- Menu cursor
- Menu select
- HP low warning
- Battle start

Steps:
1. Visit the URL
2. Click on each sound to preview
3. Click download button
4. Save to appropriate subfolder (menu/, status/, etc.)

### SoundsVerse - Pokemon Red/Blue
Base URL: https://soundsverse.com/pokemon-video-game/red-and-blue

Available sounds to download:
1. Level Up: https://soundsverse.com/pokemon-video-game/pokemon-red-and-blue/pokemon-red-and-blue-level-up
   Save to: status/level-up.mp3

2. Capture: https://soundsverse.com/pokemon-video-game/pokemon-red-and-blue
   Save to: status/pokemon-capture.mp3

Steps for each:
1. Visit URL
2. Click play to preview
3. Look for download button
4. Choose format (MP3 recommended)
5. Save to suggested location

## PRIORITY 3: Victory and Battle Music

### KHInsider - Pokemon Red/Blue/Yellow OST
URL: https://downloads.khinsider.com/game-soundtracks/album/pokemon-red-green-blue-yellow

Specific tracks to download:
- Track 11: "Level Up!" (0:05)
- Track 12: "Victory! (Gym Leader)" (0:50) - Use first 5 seconds for quick victory
- Track 8: "Pokémon Obtained!" (0:02)
- Track 20: "Pokémon Caught!" (0:06)

Steps:
1. Visit the album page
2. Find the track number
3. Click on track name
4. Click MP3 or FLAC download
5. Save to victory/ folder

## ALTERNATIVE: BellBlitzKing Complete Collection

URL: https://bellblitzking.itch.io/pokemon-sound-collection
Size: 723 MB (4,500+ sounds from Gen 1-7)
Price: Pay what you want (can enter $0)

Steps:
1. Visit itch.io page
2. Click "Download Now"
3. Enter $0 or donate amount
4. Download 723 MB ZIP
5. Extract relevant Gen 1 sounds to battle/ folder

## QUICK START: 10 Essential Sounds

If you want to start small, manually download these 10:

1. Tackle.mp3 (basic attack) → battle/
2. Super Effective sound → effects/
3. Not Very Effective sound → effects/
4. Pokemon faint → status/pokemon-faint.mp3
5. Menu cursor → menu/cursor.mp3
6. Menu select → menu/select.mp3
7. Victory fanfare (short) → victory/victory-short.mp3
8. Level up → status/level-up.mp3
9. HP low → status/hp-low.mp3
10. Battle start → battle/battle-start.mp3

Sources: Mix of The Sounds Resource + KHInsider

## FILE NAMING GUIDE

Rename downloaded files to match these patterns:

Battle/Attack sounds:
- attack-tackle.mp3
- attack-thunderbolt.mp3
- attack-hit-normal.mp3
- attack-hit-critical.mp3
- attack-miss.mp3

Effects:
- effect-super-effective.mp3
- effect-not-effective.mp3

Menu:
- menu-cursor.mp3
- menu-select.mp3
- menu-cancel.mp3

Status:
- pokemon-faint.mp3
- pokemon-levelup.mp3
- pokemon-capture.mp3
- hp-low.mp3

Victory:
- victory-short.mp3
- victory-trainer.mp3
- victory-gym-leader.mp3

## BROWSER EXTENSIONS (Optional)

To make downloads easier from soundboards:
- "Download All Files" for Chrome/Firefox
- Right-click → "Save audio as..." on most soundboards

## NOTES

- Most sites require clicking through to individual sound pages
- Some sites may require account creation (free)
- KHInsider is the most reliable source for bulk downloads
- The Sounds Resource has high-quality individual files
- SoundsVerse provides multiple format options

## ESTIMATED TIME

- Quick start (10 sounds): 15-20 minutes
- KHInsider full collection: 5 minutes download + extract
- Complete manual collection: 1-2 hours

## VERIFICATION

After downloading, verify files:
cd /Users/michaelzuo/Desktop/pokemon-sounds
find . -name "*.mp3" -o -name "*.wav" | wc -l

Should show number of downloaded files.

Test playback:
afplay battle/[filename].mp3

EOF

echo ""
echo -e "${GREEN}Created manual download list:${NC} MANUAL_DOWNLOAD_LIST.txt"
echo ""
echo "==================== SUMMARY ===================="
echo ""
echo "Directory structure created at:"
echo "$SOUNDS_DIR"
echo ""
echo "Subdirectories:"
echo "  - battle/    (attack sounds, hit sounds)"
echo "  - effects/   (super effective, not very effective)"
echo "  - menu/      (cursor, select sounds)"
echo "  - status/    (faint, level up, capture)"
echo "  - victory/   (victory fanfares)"
echo ""
echo "RECOMMENDED NEXT STEPS:"
echo ""
echo "1. Visit KHInsider for bulk download (EASIEST):"
echo "   https://downloads.khinsider.com/game-soundtracks/album/pokemon-sfx-gen-1-attack-moves-rby"
echo ""
echo "2. Or follow the manual download guide:"
echo "   cat $SOUNDS_DIR/MANUAL_DOWNLOAD_LIST.txt"
echo ""
echo "3. Verify downloads:"
echo "   ls -R $SOUNDS_DIR"
echo ""
echo "================================================="

# Create a simple test file to verify audio playback
cat > "$SOUNDS_DIR/test-audio.sh" << 'TESTEOF'
#!/bin/bash
# Test audio playback of downloaded files

echo "Testing audio files..."
cd /Users/michaelzuo/Desktop/pokemon-sounds

for dir in battle effects menu status victory; do
    echo ""
    echo "=== $dir ==="
    count=$(find "$dir" -name "*.mp3" -o -name "*.wav" 2>/dev/null | wc -l)
    echo "Files found: $count"

    # Play first file if exists
    first_file=$(find "$dir" -name "*.mp3" -o -name "*.wav" 2>/dev/null | head -1)
    if [ -n "$first_file" ]; then
        echo "Playing: $(basename "$first_file")"
        afplay "$first_file"
    fi
done
TESTEOF

chmod +x "$SOUNDS_DIR/test-audio.sh"
echo -e "${GREEN}Created test script:${NC} test-audio.sh"
echo ""
echo "After downloading sounds, run: ./test-audio.sh"
