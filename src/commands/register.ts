import fs from 'fs';
import path from 'path';
import inquirer, { QuestionCollection } from 'inquirer';
import { format } from 'prettier';
import _ from 'lodash';
import { data as persons } from '../data/persons/index.js';
import { AgeRange, defaultAgeRange, PersonData } from '../types.js';
import { Arguments, Argv, CommandModule } from 'yargs';
import papaparse from 'papaparse';
import { confirm } from './utils/prompt.js';
import { rootPath } from '../config/index.js';

type PersonEntry = Pick<PersonData, 'email' | 'firstname' | 'lastname' | 'gender' | 'age'>;

interface Props {
  batch?: string;
}

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

const command = `register`;
const describe = 'Register a person';

function builder(yargs: Argv): Argv<Props> {
  return yargs.option('batch', {
    desc: 'Path to batch',
    type: 'string',
  });
}

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

const handler = async ({ batch }: Arguments<Props>) => {
  if (batch) {
    batchHandler(batch);
  } else {
    await manualHandler();
  }
};

const commandModule: CommandModule<unknown, Props> = {
  command,
  describe,
  builder,
  handler,
};

export default commandModule;
