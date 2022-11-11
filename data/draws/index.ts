import fs from 'fs';
import { rootPath } from '../../config/index.js';
import { Draw } from '../../types.js';

const drawsPath = `${rootPath}/data/draws`;
const files = fs.readdirSync(drawsPath);

const draws: Record<number, Draw> = {};

files.forEach((filename) => {
  const matches = /^([0-9]{4})\.json$/.exec(filename);

  if (!matches) {
    return;
  }

  const [, year] = matches;
  const content = fs.readFileSync(`${drawsPath}/${filename}`).toString();
  draws[Number(year)] = JSON.parse(content) as Draw;
});

export default draws;
