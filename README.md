<p align="center">
  <img src="public/icon-64.png" width="80" alt="MindMap Studio Icon"/>
</p>

<h1 align="center">MindMap Studio</h1>

<p align="center">
  <strong>Professional visual mind mapping tool</strong><br/>
  <sub>Import markdown. Export anywhere. Think visually.</sub>
</p>

<p align="center">
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/latest"><img src="https://img.shields.io/github/v/release/officialnullobjectweb/mindmap-studio?style=flat-square&color=6366f1" alt="Release"></a>
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/blob/main/LICENSE"><img src="https://img.shields.io/github/license/officialnullobjectweb/mindmap-studio?style=flat-square" alt="License"></a>
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/actions"><img src="https://img.shields.io/github/actions/workflow/status/officialnullobjectweb/mindmap-studio/release.yml?style=flat-square&label=build" alt="Build"></a>
</p>

---

## Demo

https://github.com/officialnullobjectweb/mindmap-studio/blob/main/public/mindmap-studio.mov

---

## Install

<p align="center">
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/latest/download/mindmap-studio-aarch64.dmg">
    <img src="https://img.shields.io/badge/-Download%20macOS%20(Apple%20Silicon)-1D1D1F?style=for-the-badge&logo=apple&logoColor=white" alt="macOS Apple Silicon"/>
  </a>
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/latest/download/mindmap-studio-x64.dmg">
    <img src="https://img.shields.io/badge/-Download%20macOS%20(Intel)-1D1D1F?style=for-the-badge&logo=apple&logoColor=white" alt="macOS Intel"/>
  </a>
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/latest/download/mindmap-studio-windows.exe">
    <img src="https://img.shields.io/badge/-Download%20Windows-1D1D1F?style=for-the-badge&logo=windows&logoColor=white" alt="Windows"/>
  </a>
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/latest/download/mindmap-studio-linux.AppImage">
    <img src="https://img.shields.io/badge/-Download%20Linux-1D1D1F?style=for-the-badge&logo=linux&logoColor=white" alt="Linux"/>
  </a>
</p>

Or visit the **[Releases](https://github.com/officialnullobjectweb/mindmap-studio/releases/latest)** page to see all available files.

---

## Features

| Feature | Description |
|---------|-------------|
| **Markdown Import** | Paste any markdown list → instant mind map |
| **Export Formats** | HTML, SVG, PNG, JPG, PDF, JSON |
| **Color Wheel** | Full HSL picker with hex input |
| **15+ Shapes** | Rectangle, Rounded, Circle, Diamond, Pill, Hexagon, Cloud, Star, and more |
| **Dark / Light Theme** | One-click theme toggle |
| **Drag & Drop** | Drag shapes from panel onto canvas |
| **Collapse Nodes** | Hide children for step-by-step views |
| **Keyboard Shortcuts** | `N` `Del` `⌘Z` `⌘D` `⌘A` `L` |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Add new node |
| `Del` | Delete selected |
| `⌘Z` | Undo |
| `⌘⇧Z` | Redo |
| `⌘D` | Duplicate |
| `⌘A` | Select all |
| `L` | Auto layout |
| `Esc` | Cancel / deselect |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, Tailwind CSS |
| Canvas | React Flow |
| State | Zustand |
| Desktop | Tauri 2 + Rust |
| Export | html-to-image, jsPDF |

---

## Development

```bash
# Install
npm install

# Run (web)
npm run dev

# Run (desktop)
npm run tauri:dev

# Build desktop app
npm run tauri:build
```

---

## License

[MIT](https://github.com/officialnullobjectweb/mindmap-studio/blob/main/LICENSE) — FRAMD Studio
