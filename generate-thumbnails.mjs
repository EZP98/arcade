#!/usr/bin/env node

/**
 * Script per generare thumbnails delle immagini esistenti
 * Scarica le immagini da R2, crea thumbnails e le ricarica
 */

import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lista immagini esistenti
const images = [
  'DSCF3759.jpg',
  'adele.jpg',
  'evento-pannello.png',
  'parallax-image.jpg',
  'opera.png',
  'DSCF9079.jpg',
  'DSCF2104.jpg',
  'evento-poster.png',
  'evento-locandina.png',
  'DSCF2012.jpg'
];

async function createThumbnail(inputPath, outputPath) {
  console.log(`Creating thumbnail for ${path.basename(inputPath)}...`);

  const image = await loadImage(inputPath);

  // Calcola dimensioni mantenendo aspect ratio (max 400px)
  let width = image.width;
  let height = image.height;
  const maxSize = 400;

  if (width > height) {
    if (width > maxSize) {
      height = (height * maxSize) / width;
      width = maxSize;
    }
  } else {
    if (height > maxSize) {
      width = (width * maxSize) / height;
      height = maxSize;
    }
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);

  // Salva thumbnail
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.85 });
  fs.writeFileSync(outputPath, buffer);

  console.log(`✓ Thumbnail created: ${path.basename(outputPath)} (${(buffer.length / 1024).toFixed(0)}KB)`);
}

async function main() {
  console.log('Generating thumbnails for existing images...\n');

  const publicDir = path.join(__dirname, 'public');
  const tempDir = path.join(__dirname, 'temp-thumbnails');

  // Crea directory temporanea per thumbnails
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  for (const imageName of images) {
    const inputPath = path.join(publicDir, imageName);
    const ext = path.extname(imageName);
    const baseName = path.basename(imageName, ext);
    const thumbnailName = `${baseName}_thumb${ext}`;
    const outputPath = path.join(tempDir, thumbnailName);

    if (fs.existsSync(inputPath)) {
      await createThumbnail(inputPath, outputPath);
    } else {
      console.log(`⚠ Image not found: ${imageName}`);
    }
  }

  console.log(`\n✨ All thumbnails generated in ${tempDir}`);
  console.log('\nNext steps:');
  console.log('1. Upload thumbnails to R2 with:');
  console.log('   cd temp-thumbnails && for img in *; do');
  console.log('     wrangler r2 object put adele-lo-feudo-images/"$img" --file="$img" --content-type="image/jpeg" --remote');
  console.log('   done');
  console.log('2. Delete temp-thumbnails folder');
}

main().catch(console.error);
