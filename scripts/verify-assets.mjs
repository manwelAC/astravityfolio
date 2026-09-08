import { readFile, readdir, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
const source = await readFile(new URL('../data/projects.ts', import.meta.url), 'utf8');
const projects = JSON.parse(source.split('export const projects: Project[] = ')[1].trim().replace(/;$/, ''));
const folders = (await readdir(new URL('../public/assets/projects/', import.meta.url), { withFileTypes: true })).filter(p => p.isDirectory()).map(p => p.name).sort();
assert.deepEqual(projects.map(p => p.id).sort(), folders);
let count = 0;
for (const p of projects) {
 assert.ok(p.gallery.includes(p.cover), `${p.id} cover must belong to gallery`);
 for (const image of p.gallery) {
  assert.ok(image.startsWith(`/assets/projects/${p.id}/`));
  await access(new URL(`../public${image}`, import.meta.url));
  count++;
 }
}
console.log(`Verified ${projects.length} project folders and ${count} existing images.`);
