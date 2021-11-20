import fs from 'fs';
import path from 'path';
import { Draw } from '../../types';

const files = fs.readdirSync(__dirname);

const draws: Record<number, Draw> = {};

files.forEach((filename) => {
  const matches = /^([0-9]{4})\.json$/.exec(filename);

  if (!matches) {
    return;
  }

  const [, year] = matches;
  const content = fs.readFileSync(path.join(__dirname, filename)).toString();
  draws[Number(year)] = JSON.parse(content) as Draw;
});

export default draws;
