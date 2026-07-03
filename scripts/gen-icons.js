#!/usr/bin/env node
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const iconDir = path.join(__dirname, '../src-tauri/icons');
const publicDir = path.join(__dirname, '../public');

const svgIcon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
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

// Create proper ICO file with multiple sizes
async function createIco() {
  const sizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = [];

  for (const size of sizes) {
    const png = await sharp(svgIcon).resize(size, size).png().toBuffer();
    pngBuffers.push({ size, buffer: png });
  }

  // ICO file format
  // Header: 6 bytes
  // Entries: 16 bytes each
  // Image data follows

  const numImages = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  const headerAndEntries = headerSize + (numImages * entrySize);

  let dataOffset = headerAndEntries;
  const entries = [];
  const imageData = [];

  for (const { size, buffer } of pngBuffers) {
    entries.push({
      width: size === 256 ? 0 : size,
      height: size === 256 ? 0 : size,
      colors: 0,
      reserved: 0,
      planes: 1,
      bpp: 32,
      size: buffer.length,
      offset: dataOffset,
    });
    imageData.push(buffer);
    dataOffset += buffer.length;
  }

  // Build ICO buffer
  const icoBuffer = Buffer.alloc(dataOffset);

  // Write header
  icoBuffer.writeUInt16LE(0, 0); // Reserved
  icoBuffer.writeUInt16LE(1, 2); // Type: ICO
  icoBuffer.writeUInt16LE(numImages, 4); // Number of images

  // Write entries
  let entryOffset = headerSize;
  for (const entry of entries) {
    icoBuffer.writeUInt8(entry.width, entryOffset);
    icoBuffer.writeUInt8(entry.height, entryOffset + 1);
    icoBuffer.writeUInt8(entry.colors, entryOffset + 2);
    icoBuffer.writeUInt8(entry.reserved, entryOffset + 3);
    icoBuffer.writeUInt16LE(entry.planes, entryOffset + 4);
    icoBuffer.writeUInt16LE(entry.bpp, entryOffset + 6);
    icoBuffer.writeUInt32LE(entry.size, entryOffset + 8);
    icoBuffer.writeUInt32LE(entry.offset, entryOffset + 12);
    entryOffset += 16;
  }

  // Write image data
  let imgOffset = headerAndEntries;
  for (const buffer of imageData) {
    buffer.copy(icoBuffer, imgOffset);
    imgOffset += buffer.length;
  }

  return icoBuffer;
}

async function generate() {
  fs.mkdirSync(iconDir, { recursive: true });

  // PNG icons
  const pngSizes = [
    { name: '32x32.png', size: 32 },
    { name: '128x128.png', size: 128 },
    { name: '128x128@2x.png', size: 256 },
    { name: '256x256.png', size: 256 },
    { name: '512x512.png', size: 512 },
  ];

  for (const s of pngSizes) {
    await sharp(svgIcon).resize(s.size, s.size).png().toFile(path.join(iconDir, s.name));
    console.log(`Generated ${s.name}`);
  }

  // Proper ICO file
  const icoBuffer = await createIco();
  fs.writeFileSync(path.join(iconDir, 'icon.ico'), icoBuffer);
  console.log('Generated icon.ico (proper multi-resolution)');

  // ICNS - use 512px PNG
  await sharp(svgIcon).resize(512, 512).png().toFile(path.join(iconDir, 'icon.icns'));
  console.log('Generated icon.icns');

  // Public favicon
  await sharp(svgIcon).resize(64, 64).png().toFile(path.join(publicDir, 'icon-64.png'));

  console.log('\nAll icons generated!');
}

generate().catch(console.error);
