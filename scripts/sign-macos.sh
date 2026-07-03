#!/bin/bash
# Sign macOS app for distribution
# Run after: npm run tauri:build

set -e

echo "🔐 Signing macOS app..."

# Find the .app bundle
APP_PATH=$(find src-tauri/target/release/bundle/macos -name "*.app" -type d 2>/dev/null | head -1)

if [ -z "$APP_PATH" ]; then
  echo "❌ No .app bundle found. Run 'npm run tauri:build' first."
  exit 1
fi

echo "📱 Found: $APP_PATH"

# Ad-hoc sign (no Apple Developer account needed)
echo "✍️  Signing with ad-hoc identity..."
codesign --force --deep --sign - "$APP_PATH"

# Verify
echo "✅ Verifying signature..."
codesign --verify --verbose "$APP_PATH"

# Sign the DMG too
DMG_PATH=$(find src-tauri/target/release/bundle/dmg -name "*.dmg" 2>/dev/null | head -1)
if [ -n "$DMG_PATH" ]; then
  echo "📀 Signing DMG: $DMG_PATH"
  codesign --force --sign - "$DMG_PATH"
fi

echo ""
echo "✅ Done! App is now signed and ready to distribute."
echo "   Users can open it without the 'damaged' error."
echo ""
echo "Note: This uses ad-hoc signing (no Apple Developer account needed)."
echo "For distribution outside your Mac, you may need a paid Apple Developer account."
