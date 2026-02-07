#!/bin/bash

# Pokemon SFX Quick Download Helper
# Helps you get authentic Pokemon Game Boy sound effects

echo "🎮 Pokemon Memory Match - Sound Effects Download Helper"
echo "========================================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SFX_DIR="$PROJECT_DIR/assets/audio/sfx"
TEMP_DIR="$SCRIPT_DIR/pokemon-sounds-temp"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "📁 SFX Directory: $SFX_DIR"
echo ""

# Check if directory exists
if [ ! -d "$SFX_DIR" ]; then
    echo -e "${RED}❌ Error: SFX directory not found!${NC}"
    echo "Expected: $SFX_DIR"
    exit 1
fi

echo "Choose your method:"
echo ""
echo "1) Open download links in browser (Manual - 10 minutes)"
echo "2) Show file placement guide"
echo "3) Test existing SFX files"
echo "4) Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}Opening Pokemon SFX download sources...${NC}"
        echo ""

        # KHInsider - Main collection
        echo "📦 Opening KHInsider Gen 1 Attack Sounds (328 files, 11MB)"
        echo "   Download the MP3 ZIP and extract it"
        open "https://downloads.khinsider.com/game-soundtracks/album/pokemon-sfx-gen-1-attack-moves-rby"
        sleep 2

        # The Sounds Resource - Individual files
        echo ""
        echo "🔊 Opening The Sounds Resource (Individual downloads)"
        echo "   Search for: Faint, Menu Select, Level Up"
        open "https://www.sounds-resource.com/game_boy_gbc/pokemonredblueyellow/sound/17241/"
        sleep 2

        echo ""
        echo -e "${YELLOW}📋 Files to download and rename:${NC}"
        echo ""
        echo "From KHInsider ZIP:"
        echo "  • Tackle.mp3 → attack-hit.mp3"
        echo "  • Super Effective.mp3 → super-effective.mp3"
        echo "  • Not Very Effective.mp3 → not-effective.mp3"
        echo ""
        echo "From The Sounds Resource:"
        echo "  • SFX_FAINT_THUD → pokemon-faint.mp3"
        echo "  • SFX_PRESS_AB → menu-select.mp3"
        echo "  • SFX_LEVEL_UP → levelup.mp3"
        echo ""
        echo "📁 Save all files to: $SFX_DIR"
        echo ""
        echo -e "${GREEN}✅ When done, run option 3 to test your files!${NC}"
        ;;

    2)
        echo ""
        echo -e "${GREEN}📋 File Placement Guide${NC}"
        echo "========================"
        echo ""
        echo "Required files in: $SFX_DIR"
        echo ""
        echo "Priority 1 (Must Have):"
        echo "  ✓ attack-hit.mp3        - Generic attack sound"
        echo "  ✓ pokemon-faint.mp3     - Pokemon faints (HP = 0)"
        echo "  ✓ super-effective.mp3   - 2x type advantage"
        echo ""
        echo "Priority 2 (Important):"
        echo "  ✓ not-effective.mp3     - 0.5x type disadvantage"
        echo "  ✓ menu-select.mp3       - UI button clicks"
        echo "  ✓ levelup.mp3           - Pokemon unlock"
        echo ""
        echo "Priority 3 (Optional):"
        echo "  ○ attack-fire.mp3       - Fire-type attacks"
        echo "  ○ attack-water.mp3      - Water-type attacks"
        echo "  ○ attack-grass.mp3      - Grass-type attacks"
        echo "  ○ hp-low.mp3            - Low health warning"
        echo ""
        echo "💡 Tip: The game works without these files (uses synthesized sounds)"
        echo "   But authentic Pokemon sounds make it much better!"
        ;;

    3)
        echo ""
        echo -e "${GREEN}🧪 Testing SFX Files...${NC}"
        echo ""

        cd "$SFX_DIR"

        # Count MP3 files
        mp3_count=$(find . -name "*.mp3" 2>/dev/null | wc -l | tr -d ' ')

        if [ "$mp3_count" -eq 0 ]; then
            echo -e "${YELLOW}⚠️  No MP3 files found in SFX directory${NC}"
            echo ""
            echo "Expected location: $SFX_DIR"
            echo ""
            echo "Run option 1 to download files"
        else
            echo -e "${GREEN}✅ Found $mp3_count MP3 file(s)${NC}"
            echo ""

            # List and test each file
            for file in *.mp3; do
                if [ -f "$file" ]; then
                    size=$(ls -lh "$file" | awk '{print $5}')
                    echo "🔊 Testing: $file ($size)"
                    afplay "$file" &
                    pid=$!
                    sleep 1
                    kill $pid 2>/dev/null
                    echo "   ✅ OK"
                    echo ""
                fi
            done

            echo -e "${GREEN}🎉 All files tested successfully!${NC}"
            echo ""
            echo "Next step: Test in the game"
            echo "  1. Open index.html in browser"
            echo "  2. Start HP Battle"
            echo "  3. Listen for authentic Pokemon sounds!"
        fi
        ;;

    4)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;

    *)
        echo ""
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================================="
echo ""
echo "📚 More help:"
echo "  • Quick Guide: $SCRIPT_DIR/POKEMON_SOUNDS_QUICK_GUIDE.md"
echo "  • Full Collection: $SCRIPT_DIR/pokemon-sounds/"
echo "  • SFX README: $SFX_DIR/README.md"
echo ""
