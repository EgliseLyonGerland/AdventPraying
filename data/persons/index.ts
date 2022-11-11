import fs from 'fs';
import { rootPath } from '../../config/index.js';
import { defaultAgeRange, Person, PersonData, PersonId } from '../../types.js';

export const data = JSON.parse(
  fs.readFileSync(`${rootPath}/data/persons/data.json`).toString(),
) as PersonData[];

export const all: Person[] = data.map((item) => ({
  age: defaultAgeRange,
  exclude: [],
  archived: false,
  ...item,
}));

export const byId: Record<PersonId, Person> = data.reduce(
  (acc, curr) => ({
    ...acc,
    [curr.id]: curr,
  }),
  {},
);

export default all.filter(({ archived }) => !archived);
