#!/usr/bin/env bun
/**
 * Image Conversion Script
 * Converts all JPEG/PNG images in /public to high-quality WebP format.
 *
 * Usage:  bun scripts/convert-images.ts
 * Options:
 *   --dry-run   Show what would be converted without writing files
 *   --force     Re-convert even if a .webp output already exists
 *   --delete    Delete the original file after successful conversion
 *
 * Quality settings:
 *   JPEG → WebP lossy  quality 92  (visually lossless, ~40% smaller)
 *   PNG  → WebP lossless            (bit-for-bit identical colours)
 */

import sharp from "sharp";
import { readdirSync, statSync, existsSync, unlinkSync } from "fs";
import { join, extname, basename, dirname } from "path";

// ─── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE   = args.includes("--force");
const DELETE  = args.includes("--delete");

// ─── Config ───────────────────────────────────────────────────────────────────
const PUBLIC_DIR = join(process.cwd(), "public");
const JPEG_QUALITY = 92;   // 1-100; 90+ is visually lossless
const SKIP_DIRS = new Set([".DS_Store"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getSize(path: string): number {
  try { return statSync(path).size; } catch { return 0; }
}

/** Recursively collect all image files under a directory */
function collectImages(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectImages(full));
    } else {
      const ext = extname(entry).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        results.push(full);
      }
    }
  }
  return results;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n🥭  MangoMasti Image Converter`);
console.log(`📁  Scanning: ${PUBLIC_DIR}`);
if (DRY_RUN) console.log("🔍  DRY RUN — no files will be written\n");

const images = collectImages(PUBLIC_DIR);
console.log(`Found ${images.length} image(s) to process.\n`);

let converted = 0;
let skipped   = 0;
let totalSaved = 0;

for (const src of images) {
  const ext  = extname(src).toLowerCase();
  const dir  = dirname(src);
  const name = basename(src, ext);
  const dest = join(dir, `${name}.webp`);

  // Skip if output already exists and --force not set
  if (!FORCE && existsSync(dest)) {
    console.log(`  ⏭  Skipped (already exists): ${basename(dest)}`);
    skipped++;
    continue;
  }

  const srcSize = getSize(src);
  const isJpeg  = [".jpg", ".jpeg"].includes(ext);

  if (DRY_RUN) {
    console.log(`  🔄  Would convert: ${basename(src)} → ${basename(dest)}`);
    converted++;
    continue;
  }

  try {
    const img = sharp(src);

    if (isJpeg) {
      await img.webp({ quality: JPEG_QUALITY, effort: 6 }).toFile(dest);
    } else {
      // PNG → lossless WebP (same pixel values, smaller file)
      await img.webp({ lossless: true, effort: 6 }).toFile(dest);
    }

    const destSize = getSize(dest);
    const saved    = srcSize - destSize;
    const pct      = srcSize > 0 ? ((saved / srcSize) * 100).toFixed(1) : "0.0";
    totalSaved += Math.max(0, saved);

    const sizeInfo = saved >= 0
      ? `${formatBytes(srcSize)} → ${formatBytes(destSize)} (−${pct}%)`
      : `${formatBytes(srcSize)} → ${formatBytes(destSize)} (+${Math.abs(Number(pct))}%)`;

    console.log(`  ✅  ${basename(src).padEnd(50)} ${sizeInfo}`);
    converted++;

    if (DELETE) {
      unlinkSync(src);
      console.log(`     🗑  Deleted original: ${basename(src)}`);
    }
  } catch (err) {
    console.error(`  ❌  Failed: ${basename(src)} — ${(err as Error).message}`);
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`
────────────────────────────────────────────`);
console.log(`✅  Converted : ${converted}`);
console.log(`⏭   Skipped  : ${skipped}`);
if (!DRY_RUN && totalSaved > 0) {
  console.log(`💾  Space saved: ${formatBytes(totalSaved)}`);
}
console.log(`\nDone! Add .webp paths to your Next.js <Image> src props to serve WebP directly.`);
console.log(`(Next.js also auto-serves WebP when using the <Image> component.)\n`);
