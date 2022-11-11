import fs from 'fs';

import _ from 'lodash';
import termSize from 'term-size';

import { rootPath } from '../config/index.js';
import draws from '../data/draws/index.js';
import persons from '../data/persons/index.js';
import { Draw, Person } from '../types.js';
import { letsDraw } from './utils/draw.js';
import { ask, confirm } from './utils/prompt.js';
import { createModule } from './utils/yargs.js';

const commandModule = createModule({
  command: 'draw',
  describe: "Let's draw",

  builder: (argv) =>
    argv.option('year', {
      alias: 'y',
      desc: 'Year',
      type: 'number',
      default: new Date().getFullYear(),
      demandOption: true,
    }),

  handler: async ({ year }) => {
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
  },
});

export default commandModule;
