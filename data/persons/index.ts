import fs from 'fs';
import path from 'path';
import { AgeRange, Person, PersonData } from '../../types';

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data.json')).toString(),
) as PersonData[];

const persons: Person[] = data.map((item) => ({
  age: AgeRange['18+'],
  exclude: [],
  ...item,
}));

export default persons;
