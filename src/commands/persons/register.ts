import fs from 'fs';
import path from 'path';

import inquirer, { QuestionCollection } from 'inquirer';
import _ from 'lodash';
import papaparse from 'papaparse';
import { format } from 'prettier';

import { rootPath } from '../../config/index.js';
import { data as persons } from '../../data/persons/index.js';
import { AgeRange, defaultAgeRange, PersonData } from '../../types.js';
import { confirm } from '../utils/prompt.js';
import { createModule } from '../utils/yargs.js';

type PersonEntry = Pick<PersonData, 'email' | 'firstname' | 'lastname' | 'gender' | 'age'>;

const dictionary: Record<string, string> = {
  prenom: 'firstname',
  nom: 'lastname',
  tonPrenom: 'firstname',
  tonNom: 'lastname',
  dansQuelleTrancheDageTeSituesTu: 'age',
  horodateur: 'timestamp',
  username: 'email',
  nomDutilisateur: 'email',
  '18 et plus': '18+',
};

function addPerson({ email, firstname, lastname, age, gender }: PersonEntry) {
  const data = {
    id: _.kebabCase(`${firstname} ${lastname}`),
    email,
    firstname,
    lastname,
    gender,
    ...(age === defaultAgeRange ? {} : { age }),
  };

  const index = _.findIndex(persons, ['id', data.id]);

  if (index >= 0) {
    persons[index] = data;
  } else {
    persons.push(data);
  }
}

function persistPersons() {
  const sortedPersons = _.sortBy(persons, ['id']);
  const filepath = `${rootPath}/data/persons/data.json`;

  let content = JSON.stringify(sortedPersons);
  content = format(content.replace(/{/g, '{\n'), { parser: 'json' });

  fs.writeFileSync(filepath, content);
}

async function manualHandler() {
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
      name: 'gender',
      message: 'Gender',
      type: 'list',
      choices: [
        { name: 'Homme', value: 'male' },
        { name: 'Femme', value: 'female' },
      ],
    },
    {
      name: 'email',
      message: 'Email',
    },
    {
      name: 'age',
      message: 'Enfant',
      type: 'list',
      choices: Object.values(AgeRange),
      default: defaultAgeRange,
    },
  ];

  const answers = await inquirer.prompt<{
    email: string;
    firstname: string;
    lastname: string;
    gender: 'male' | 'female';
    age: AgeRange;
  }>(questions);

  addPerson(answers);
  persistPersons();

  if (await confirm('Would you like to register another person?')) {
    await manualHandler();
  }
}

function translate(value: string): string {
  return dictionary[value] || value;
}

function formatValue(value: string, key: string) {
  let result = value;

  switch (key) {
    case 'firstname':
    case 'lastname':
      if (/^[A-Z]+$/.test(value) || /^[a-z]+$/.test(value)) {
        result = _.capitalize(value);
      }
      break;

    default:
      break;
  }

  return result.trim();
}

function batchHandler(file: string) {
  const filePath = path.resolve(file);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Unable to find \`${file}\` file`);
  }
  if (fs.lstatSync(filePath).isDirectory()) {
    throw new Error(`\`${file}\` is a directory. Please provide a CSV-type file's path`);
  }

  const content = fs.readFileSync(filePath);
  const { data } = papaparse.parse<PersonEntry>(content.toString(), {
    header: true,
    transformHeader: (value: string) => translate(_.camelCase(_.deburr(value))),
    transform: (value, key) => formatValue(translate(value), `${key}`),
  });

  data.forEach(addPerson);

  persistPersons();
}

const registerModule = createModule({
  command: 'register',
  describe: 'Register a person',

  builder: (argv) =>
    argv.option('batch', {
      desc: 'Path to batch',
      type: 'string',
    }),

  handler: async ({ batch }) => {
    if (batch) {
      batchHandler(batch);
    } else {
      await manualHandler();
    }
  },
});

export default registerModule;
