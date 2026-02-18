# SpeakRight - Phase 0 Prototype

3D mouth visualization for English pronunciation learning.

## Quick Start

```bash
cd /workspaces/My-moltbot/projects/english-app/app
npm run dev
# Open http://localhost:3000
```

## What's Built

- **3D Mouth Cross-Section**: Animated sagittal (剖面) view using Three.js + React Three Fiber showing tongue, lips, jaw, palate, and teeth
- **Viseme System**: 30+ phoneme mouth parameter presets covering vowels, consonants, and diphthongs with smooth interpolation
- **Playback Controls**: Play/pause, reset, speed control (0.25x/0.5x/1x), clickable phoneme timeline
- **Word Cards**: 10 sample words with IPA, Chinese definitions, example sentences, confusion pairs, difficulty ratings
- **Interactive**: Click any word card → 3D mouth animates through the phoneme sequence

## Tech Stack

- Next.js 15 + TypeScript
- Three.js + React Three Fiber + Drei
- Tailwind CSS
