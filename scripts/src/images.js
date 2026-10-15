// Offline checks for the image files in data/images/: presence, JPEG format, exact pixel size and file size.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { IMAGES_DIR } from './catalog.js';

export const WEIGHT_KB_BY_SIZE = {
  '3000x3750': [800, 2048],
  '3840x2160': [800, 2048],
  '1800x2250': [500, 1536],
};

const JPEG_SOF = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

export function readJpegSize(bytes) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    if (JPEG_SOF.has(marker)) {
      return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  return null;
}

export function validateImage(entry, bytes) {
  if (!bytes) return [`${entry.filename}: missing`];
  const problems = [];
  const size = readJpegSize(bytes);
  if (!size) return [`${entry.filename}: not a readable JPEG`];

  const actual = `${size.width}x${size.height}`;
  if (actual !== entry.size) problems.push(`${entry.filename}: ${actual}, expected ${entry.size}`);

  const [minKb, maxKb] = WEIGHT_KB_BY_SIZE[entry.size] ?? [0, Infinity];
  const kb = Math.round(bytes.length / 1024);
  if (kb < minKb || kb > maxKb) problems.push(`${entry.filename}: ${kb} KB, expected ${minKb} to ${maxKb} KB`);
  return problems;
}

export const readImage = (filename) => readFile(join(IMAGES_DIR, filename));

export async function checkImages(plan) {
  const names = new Set(await readdir(IMAGES_DIR));
  const problems = [];
  let present = 0;

  for (const entry of plan) {
    const bytes = names.has(entry.filename) ? await readImage(entry.filename) : null;
    if (bytes) present += 1;
    problems.push(...validateImage(entry, bytes));
  }

  const planned = new Set(plan.map(({ filename }) => filename));
  const unexpected = [...names].filter((name) => !planned.has(name) && name !== 'brief.md' && name !== 'prompts.json');
  return { problems, present, unexpected };
}
