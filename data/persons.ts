import fs from 'fs';
import path from 'path';
import { Person } from '../types';

export default JSON.parse(
  fs.readFileSync(path.join(__dirname, 'person.json')).toString(),
) as Person[];
