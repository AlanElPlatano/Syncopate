# EarGym

A web-based musical ear training application with multiple training modes, built with React, TypeScript, and Tone.js.

## Features

- **Chord Type Training**: Identify different chord types (Major, Minor, 7th chords, etc.)
- **Interval Training**: Recognize intervals between notes with customizable options
- **Chord Progression Training**: Identify chord progressions using Roman numeral notation

## Tech Stack

- React 18
- TypeScript
- Vite
- Tone.js (Web Audio synthesis)
- GitHub Pages (deployment)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Project Structure

```
EarGym/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML entry point
└── vite.config.ts       # Vite configuration
```

## Statistics

All training statistics are stored locally in your browser using localStorage. No account or backend required.

## License

MIT
