import fs from 'fs';

import _ from 'lodash';
import termSize from 'term-size';
import { Argv, Arguments, CommandModule } from 'yargs';

import { rootPath } from '../config/index.js';
import draws from '../data/draws/index.js';
import persons from '../data/persons/index.js';
import { Draw, Person } from '../types.js';
import { letsDraw } from './utils/draw.js';
import { ask, confirm } from './utils/prompt.js';

interface Props {
  year: number;
}

const command = `draw`;
const describe = "Let's draw";

const builder = (yargs: Argv): Argv<Props> =>
  yargs.option('year', {
    alias: 'y',
    desc: 'Year',
    type: 'number',
    default: new Date().getFullYear(),
    demandOption: true,
  });

const handler = async ({ year }: Arguments<Props>) => {
  const { rows } = termSize();

  const currentDraw: Draw = draws[year] || {};

  const players =
    (await ask<Person[]>({
      type: 'checkbox',
      message: 'Select the participants',
      choices: _.map(persons, (person) => ({
        value: person,
        name: `${person.firstname} ${person.lastname} (${person.age})`,
        checked: person.id in currentDraw,
      })),
      pageSize: Math.max(10, rows - 10),
      validate: (input: Person[]) => {
        if (input.length < 3) {
          return 'You must choose 3 persons at least';
        }

        return true;
      },
    })) || [];

  if (!(await confirm(`Are you ready to random draw with these ${players.length} persons?`))) {
    return;
  }

  const draw = letsDraw(players, draws, year);

  fs.writeFileSync(`${rootPath}/data/draws/${year}.json`, `${JSON.stringify(draw, null, 2)}\n`);
};

const commandModule: CommandModule<unknown, Props> = {
  command,
  describe,
  builder,
  handler,
};

export default commandModule;
