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
