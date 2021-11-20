import fs from 'fs';
import path from 'path';
import { prompt, QuestionCollection } from 'inquirer';
import { format } from 'prettier';
import _ from 'lodash';
import { all as persons } from '../data/persons';
import { AgeRange, PersonData } from '../types';

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
  const questions: QuestionCollection = [
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
      type: 'list',
      choices: Object.values(AgeRange),
      default: AgeRange['18+'],
    },
  ];

  const { firstname, lastname, age } = await prompt<{
    firstname: string;
    lastname: string;
    age: AgeRange;
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

  const data: PersonData[] = persons;

  data.push({
    id,
    firstname,
    lastname,
    age,
  });

  const sortedPersons = _.sortBy(persons, ['id']);
  const filepath = path.join(__dirname, '../data/persons/data.json');

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
