# MindMap Studio

A professional visual mind mapping tool built with Next.js and Tauri.

![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-purple)

## Download

| Platform | Link |
|----------|------|
| **macOS (Apple Silicon)** | [Download .dmg](../../releases/latest) |
| **macOS (Intel)** | [Download .dmg](../../releases/latest) |
| **Windows** | [Download .exe](../../releases/latest) |
| **Linux (AppImage)** | [Download .AppImage](../../releases/latest) |
| **Linux (Debian)** | [Download .deb](../../releases/latest) |

## Features

- **5 Shape Types**: Rectangle, Rounded, Circle, Diamond, Pill, Hexagon, and more
- **Markdown Import**: Paste markdown lists to create mind maps instantly
- **Multiple Export Formats**: HTML, SVG, PNG, JPG, PDF, JSON
- **Color Wheel**: Full HSL color picker with presets
- **Dark/Light Theme**: Toggle between themes
- **Keyboard Shortcuts**: N, Del, ⌘Z, ⌘D, ⌘A, L
- **Drag & Drop**: Drag shapes from panel to canvas
- **Collapse/Expand**: Hide child nodes for step-by-step views
- **Auto Layout**: Automatic node arrangement
- **Right-Click Menu**: Context-aware actions
- **Multi-Select**: Ctrl+Click, Shift+Drag, Ctrl+A

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for current platform
npm run tauri:build

# Build for all platforms (requires CI)
# Push a tag: git tag v1.0.0 && git push --tags
```

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, React Flow
- **Desktop**: Tauri 2 (Rust)
- **State**: Zustand
- **Export**: html-to-image, jsPDF

## License

MIT © FRAMD Studio
