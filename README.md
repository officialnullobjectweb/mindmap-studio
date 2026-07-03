<p align="center">
  <img src="public/icon-64.png" width="80" alt="MindMap Studio Icon"/>
</p>

<h1 align="center">MindMap Studio</h1>

<p align="center">
  <strong>Professional visual mind mapping tool</strong><br/>
  <sub>Import markdown · Export anywhere · Think visually</sub>
</p>

<p align="center">
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/latest"><img src="https://img.shields.io/github/v/release/officialnullobjectweb/mindmap-studio?style=flat-square&color=6366f1" alt="Release"></a>
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/blob/main/LICENSE"><img src="https://img.shields.io/github/license/officialnullobjectweb/mindmap-studio?style=flat-square" alt="License"></a>
  <a href="https://github.com/officialnullobjectweb/mindmap-studio/actions"><img src="https://img.shields.io/github/actions/workflow/status/officialnullobjectweb/mindmap-studio/release.yml?style=flat-square&label=build" alt="Build"></a>
</p>

<br/>

<p align="center">
  <img src="public/mindmap-studio-ezgif.com-speed.gif" width="100%" alt="MindMap Studio Demo"/>
</p>

<br/>

---

## Download

<p align="center">

| Platform | Installer |
|----------|-----------|
| **macOS (Apple Silicon)** | <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/download/v1.0.0/mindmap-studio_1.0.0_aarch64.dmg"><img src="https://img.shields.io/badge/Download-macOS%20Apple%20Silicon-1D1D1F?style=for-the-badge&logo=apple&logoColor=white" alt="macOS Apple Silicon"/></a> |
| **macOS (Intel)** | <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/download/v1.0.0/mindmap-studio_1.0.0_x64.dmg"><img src="https://img.shields.io/badge/Download-macOS%20Intel-1D1D1F?style=for-the-badge&logo=apple&logoColor=white" alt="macOS Intel"/></a> |
| **Windows** | <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/download/v1.0.0/mindmap-studio_1.0.0_x64-setup.exe"><img src="https://img.shields.io/badge/Download-Windows%20.exe-1D1D1F?style=for-the-badge&logo=windows&logoColor=white" alt="Windows"/></a> |
| **Linux (AppImage)** | <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/download/v1.0.0/mindmap-studio_1.0.0_amd64.AppImage"><img src="https://img.shields.io/badge/Download-Linux%20AppImage-1D1D1F?style=for-the-badge&logo=linux&logoColor=white" alt="Linux AppImage"/></a> |
| **Linux (Debian)** | <a href="https://github.com/officialnullobjectweb/mindmap-studio/releases/download/v1.0.0/mindmap-studio_1.0.0_amd64.deb"><img src="https://img.shields.io/badge/Download-Linux%20.deb-1D1D1F?style=for-the-badge&logo=debian&logoColor=white" alt="Linux DEB"/></a> |

</p>

---

## Features

| Feature | Description |
|---------|-------------|
| **Markdown Import** | Paste any markdown list and get an instant mind map |
| **Export Formats** | HTML · SVG · PNG · JPG · PDF · JSON |
| **Color Wheel** | Full HSL color picker with hex code input |
| **15+ Shapes** | Rectangle, Rounded, Circle, Diamond, Pill, Hexagon, Cloud, Star, and more |
| **Dark / Light Theme** | One-click theme toggle with smooth transitions |
| **Drag & Drop** | Drag shapes from the panel onto the canvas |
| **Collapse Nodes** | Hide child nodes for step-by-step walkthroughs |
| **Keyboard Shortcuts** | `N` · `Del` · `⌘Z` · `⌘D` · `⌘A` · `L` |

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
