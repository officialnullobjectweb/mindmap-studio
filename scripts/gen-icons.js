#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const iconDir = path.join(__dirname, '../src-tauri/icons');
const publicDir = path.join(__dirname, '../public');

const svgBuffer = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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
</svg>`);

const svgSmall = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
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
</svg>`);

async function generate() {
  fs.mkdirSync(iconDir, { recursive: true });

  // PNG icons
  const sizes = [
    { name: '32x32.png', size: 32 },
    { name: '128x128.png', size: 128 },
    { name: '128x128@2x.png', size: 256 },
    { name: '256x256.png', size: 256 },
    { name: '512x512.png', size: 512 },
  ];

  for (const s of sizes) {
    await sharp(svgBuffer).resize(s.size, s.size).png().toFile(path.join(iconDir, s.name));
    console.log(`Generated ${s.name}`);
  }

  // ICO file (use 256px as ICO)
  await sharp(svgBuffer).resize(256, 256).png().toFile(path.join(iconDir, 'icon.ico'));

  // ICNS - just copy the 512px PNG (macOS will handle it)
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(iconDir, 'icon.icns'));

  // Public favicon
  await sharp(svgSmall).resize(64, 64).png().toFile(path.join(publicDir, 'icon-64.png'));

  console.log('\nAll icons generated!');
}

generate().catch(console.error);
