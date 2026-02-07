# Assets Directory

This directory contains all static assets for the Pokemon Memory Match game.

## Structure

```
assets/
├── audio/           # All audio files
│   ├── battle-music.mp3       # Pokemon Red/Blue wild battle theme (2.7MB)
│   ├── victory-music.mp3      # Pokemon trainer victory theme (1.0MB)
│   └── Good Job Damian.mp3    # Personalized victory message (62KB)
└── docs/            # Planning and documentation files
    └── pokemon-battle-plan.md # Original React migration plan (archived)
```

## Audio Files

### Battle Music
- **Source**: Pokemon Red/Blue - Wild Battle Theme
- **Usage**: Plays during HP Battle mode (loops until battle ends)
- **Volume**: 30% to not overpower sound effects

### Victory Music
- **Source**: Pokemon Red/Blue - Trainer Victory Theme
- **Usage**: Plays when player wins HP Battle
- **Volume**: 40%
- **Note**: "Good Job Damian.mp3" plays 3 seconds after victory music starts

### Good Job Damian
- **Source**: Custom recorded audio for Damian
- **Usage**: Plays after Memory Match wins and HP Battle victories
- **Note**: Personalized encouragement message

## Documentation

The `docs/` folder contains archived planning documents and design specs that are not part of the active codebase.
