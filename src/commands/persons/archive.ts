import chalk from 'chalk';
import { data as persons, save } from '../../data/persons/index.js';
import { createModule } from '../utils/yargs.js';

const archiveModule = createModule({
  command: 'archive [personId]',
  describe: 'Archive persons',

  builder: (argv) =>
    argv
      .positional('personId', {
        type: 'string',
      })
      .option('all', {
        type: 'boolean',
        default: false,
      })
      .check((args) => {
        if (!args.all && !args.personId) {
          throw new Error(`You must provide ${chalk.italic('[personId]')}`);
        }

        if (args.all && args.personId) {
          throw new Error(`You cannot ${chalk.italic('--all')} with ${chalk.italic('[personId]')}`);
        }

        if (args.personId) {
          const index = persons.findIndex((person) => person.id === args.personId);

          if (index === -1) {
            throw new Error(`Person ${chalk.italic(args.personId)} not found`);
          }
        }

        return true;
      }),

  handler: (args) => {
    if (args.all) {
      save(persons.map((person) => ({ ...person, archived: true })));
      return;
    }

    save(
      persons.map((person) =>
        person.id === args.personId ? { ...person, archived: true } : person,
      ),
    );
  },
});

export default archiveModule;
