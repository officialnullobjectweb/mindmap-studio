#!/bin/bash
# Build MindMap Studio for all platforms
# Run: bash scripts/build-all.sh

set -e

echo "🔨 Building MindMap Studio..."
echo ""

# Build Next.js static export
echo "📦 Building Next.js..."
npm run build

# Build for current platform
echo ""
echo "🖥️  Building Tauri..."
npx tauri build

echo ""
echo "✅ Build complete!"
echo ""
echo "Output locations:"
echo "  macOS:   src-tauri/target/release/bundle/dmg/"
echo "  Windows: src-tauri/target/release/bundle/nsis/"
echo "  Linux:   src-tauri/target/release/bundle/appimage/"
echo "           src-tauri/target/release/bundle/deb/"
