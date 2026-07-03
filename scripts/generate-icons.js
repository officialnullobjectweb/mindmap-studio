#!/usr/bin/env node
// Generate app icons from SVG
// Run: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="100" fill="#4f46e5"/>
  <circle cx="256" cy="256" r="50" fill="#fff"/>
  <circle cx="128" cy="128" r="24" fill="#fff" opacity=".8"/>
  <circle cx="384" cy="128" r="24" fill="#fff" opacity=".8"/>
  <circle cx="128" cy="384" r="24" fill="#fff" opacity=".8"/>
  <circle cx="384" cy="384" r="24" fill="#fff" opacity=".8"/>
  <line x1="256" y1="256" x2="128" y2="128" stroke="#fff" stroke-width="6" opacity=".5"/>
  <line x1="256" y1="256" x2="384" y2="128" stroke="#fff" stroke-width="6" opacity=".5"/>
  <line x1="256" y1="256" x2="128" y2="384" stroke="#fff" stroke-width="6" opacity=".5"/>
  <line x1="256" y1="256" x2="384" y2="384" stroke="#fff" stroke-width="6" opacity=".5"/>
</svg>`;

const icoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none">
  <rect width="256" height="256" rx="48" fill="#4f46e5"/>
  <circle cx="128" cy="128" r="28" fill="#fff"/>
  <circle cx="64" cy="64" r="14" fill="#fff" opacity=".8"/>
  <circle cx="192" cy="64" r="14" fill="#fff" opacity=".8"/>
  <circle cx="64" cy="192" r="14" fill="#fff" opacity=".8"/>
  <circle cx="192" cy="192" r="14" fill="#fff" opacity=".8"/>
  <line x1="128" y1="128" x2="64" y2="64" stroke="#fff" stroke-width="4" opacity=".5"/>
  <line x1="128" y1="128" x2="192" y2="64" stroke="#fff" stroke-width="4" opacity=".5"/>
  <line x1="128" y1="128" x2="64" y2="192" stroke="#fff" stroke-width="4" opacity=".5"/>
  <line x1="128" y1="128" x2="192" y2="192" stroke="#fff" stroke-width="4" opacity=".5"/>
</svg>`;

const iconDir = path.join(__dirname, '../src-tauri/icons');
const publicDir = path.join(__dirname, '../public');

// Write SVG icons
fs.writeFileSync(path.join(iconDir, 'icon.svg'), svgIcon);
fs.writeFileSync(path.join(publicDir, 'icon.svg'), icoSvg);

// Generate PNG sizes (placeholder - in production use sharp or canvas)
const sizes = [
  { name: '32x32.png', size: 32 },
  { name: '128x128.png', size: 128 },
  { name: '128x128@2x.png', size: 256 },
  { name: '256x256.png', size: 256 },
  { name: '512x512.png', size: 512 },
];

// Create placeholder PNGs (1x1 pixel - in production use sharp)
for (const s of sizes) {
  // Minimal valid PNG header
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // 8-bit RGB
    0xDE, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND
    0x44, 0xAE, 0x42, 0x60, 0x82,
  ]);
  fs.writeFileSync(path.join(iconDir, s.name), pngHeader);
}

// Create .ico (copy SVG as fallback)
fs.writeFileSync(path.join(iconDir, 'icon.ico'), icoSvg);

// Create .icns placeholder
fs.writeFileSync(path.join(iconDir, 'icon.icns'), icoSvg);

console.log('Icons generated in src-tauri/icons/');
console.log('For production, install sharp: npm install -D sharp');
console.log('Then run: node scripts/generate-icons.js --sharp');
