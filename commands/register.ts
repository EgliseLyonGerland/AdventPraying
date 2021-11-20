import fs from 'fs';
import path from 'path';
import { prompt } from 'inquirer';
import { format } from 'prettier';
import _ from 'lodash';
import persons from '../data/persons';

const command = `register`;
const desc = 'Register a person';

const confirm = async (message: string) =>
  (
    await prompt<{ ok: boolean }>({
      name: 'ok',
      type: 'confirm',
      message,
    })
  ).ok;

const getAvailableId = (baseId: string) => {
  let counter = 2;
  while (_.find(persons, ['id', `${baseId}${counter}`])) {
    counter += 1;
  }

  return `${baseId}${counter}`;
};

const handler = async () => {
  const questions = [
    {
      name: 'firstname',
      message: 'Prénom',
    },
    {
      name: 'lastname',
      message: 'Nom',
    },
    {
      name: 'kids',
      message: 'Enfant',
      type: 'confirm',
      default: false,
    },
  ];

  const { firstname, lastname, kids } = await prompt<{
    firstname: string;
    lastname: string;
    kids: boolean;
  }>(questions);

  let id = _.kebabCase(`${firstname} ${lastname}`);

  if (_.find(persons, ['id', id])) {
    if (
      !(await confirm(`${firstname} ${lastname} is already registered. Do you want to continue`))
    ) {
      return;
    }

    id = getAvailableId(id);
  }

  persons.push({
    id,
    firstname,
    lastname,
    kids,
    exclude: [],
  });

  const sortedPersons = _.sortBy(persons, ['id']);
  const filepath = path.join(__dirname, '../data/persons.json');

  let content = JSON.stringify(sortedPersons);
  content = format(content, { parser: 'json' });

  fs.writeFileSync(filepath, content);

  if (await confirm('Would you like to register another person?')) {
    await handler();
  }
};

export default {
  command,
  desc,
  handler,
};
