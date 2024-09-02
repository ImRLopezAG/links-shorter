import { readFile } from 'node:fs/promises';

const space_jpg = await readFile('public/space.jpg');

console.log(space_jpg.toString('base64'));