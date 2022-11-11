import fs from 'fs';

import _ from 'lodash';
import { format } from 'prettier';

import { rootPath } from '../../config/index.js';
import { defaultAgeRange, Person, PersonData, PersonId } from '../../types.js';

const path = `${rootPath}/data/persons/data.json`;

export const data = JSON.parse(fs.readFileSync(path).toString()) as PersonData[];

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

export function save(persons: PersonData[]) {
  const sortedPersons = _.sortBy(persons, ['id']);
  const filepath = path;

  let content = JSON.stringify(sortedPersons);
  content = format(content.replace(/{/g, '{\n'), { parser: 'json' });

  fs.writeFileSync(filepath, content);
}

export default all.filter(({ archived }) => !archived);
