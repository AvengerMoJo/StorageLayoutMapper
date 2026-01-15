#!/usr/bin/env sh

# Deploy StorageLayoutMapper to AvengerMoJo.github.io
# This script builds the project and copies the essential files to the GitHub Pages repo

set -e

echo "Building StorageLayoutMapper..."
npm run build

TARGET_REPO="../AvengerMoJo.github.io"

echo "Copying files to $TARGET_REPO..."

# Copy the main HTML file
cp dist/StorageLayoutMapper.html "$TARGET_REPO/"

# Copy storage assets (find current storage files)
STORAGE_JS=$(ls dist/assets/storage.*.js | head -1)
STORAGE_CSS=$(ls dist/assets/storage.*.css | head -1)

if [ -n "$STORAGE_JS" ]; then
    cp "$STORAGE_JS" "$TARGET_REPO/assets/"
    echo "Copied $(basename $STORAGE_JS)"
fi

if [ -n "$STORAGE_CSS" ]; then
    cp "$STORAGE_CSS" "$TARGET_REPO/assets/"
    echo "Copied $(basename $STORAGE_CSS)"
fi

echo "Cleaning up old assets in $TARGET_REPO..."
cd "$TARGET_REPO"

# Remove old storage assets (keeping only the new ones)
for file in assets/storage.*.js assets/storage.*.css; do
    if [ -f "$file" ]; then
        # Check if this is NOT the new file we just copied
        if [ "$(basename $file)" != "$(basename $STORAGE_JS)" ] && [ "$(basename $file)" != "$(basename $STORAGE_CSS)" ]; then
            git rm "$file" 2>/dev/null || true
            echo "Removed $file"
        fi
    fi
done

# Remove vendor.js if it exists (now bundled)
git rm assets/vendor.*.js 2>/dev/null || true

cd - > /dev/null

echo "Committing changes..."
cd "$TARGET_REPO"
git add -A
git status

echo "Please review the changes above, then press Enter to commit and push, or Ctrl+C to cancel"
read -r response

git commit -m "Update StorageLayoutMapper build

Deployed from StorageLayoutMapper project
- Built and copied StorageLayoutMapper.html and storage assets
- Removed old unused assets"

git push

echo "Deployment complete!"
echo "Visit https://avengermojo.github.io/StorageLayoutMapper.html to see changes"
