import { map, includes, filter, shuffle, sample, findKey, size, forEach } from 'lodash';
import fs from 'fs';
import path from 'path';
import { DistinctQuestion, prompt } from 'inquirer';
import termSize from 'term-size';
import { Argv, Arguments, CommandModule } from 'yargs';

import persons from '../data/persons';
import draws from '../data/draws';
import { Person, PersonId } from '../types';

interface Props {
  year: number;
}

const command = `draw`;
const describe = "Let's draw";

async function ask<T>(options: DistinctQuestion) {
  const { answer } = await prompt<{
    answer: T;
  }>([{ ...options, name: 'answer' }]);

  return answer || null;
}

const builder = (yargs: Argv): Argv<Props> =>
  yargs.option('year', {
    alias: 'y',
    desc: 'Year',
    type: 'number',
    default: new Date().getFullYear(),
    demandOption: true,
  });

const confirm = (message: string) =>
  ask({
    name: 'continue',
    type: 'confirm',
    message,
  });

const getAvailablePersons = (
  person: Person,
  participants: Person[],
  mapping: Record<PersonId, PersonId | null>,
) =>
  filter(participants, (participant) => {
    if (person.id === participant.id) {
      return false;
    }

    if (person.kids !== participant.kids) {
      return false;
    }

    if (person.exclude.includes(participant.id)) {
      return false;
    }

    if (Object.values(mapping).includes(participant.id)) {
      return false;
    }

    if (findKey(mapping, (id) => id === person.id) === participant.id) {
      return false;
    }

    return true;
  });

const shake = (participants: Person[]) => {
  const mapping: Record<PersonId, PersonId | null> = {};

  forEach(participants, (person) => {
    const availablePersons = getAvailablePersons(person, participants, mapping);
    const remain = size(participants) - size(mapping);

    let chosenPerson;

    if (remain === 2 && size(availablePersons) === 2) {
      if (mapping[availablePersons[0].id]) {
        [, chosenPerson] = availablePersons;
      } else {
        [chosenPerson] = availablePersons;
      }
    } else {
      chosenPerson = sample(availablePersons);
    }

    mapping[person.id] = chosenPerson?.id || null;
  });

  return mapping;
};

const resolveExclude = (participants: Person[], year: number) =>
  participants.map((person) => {
    let { exclude = [] } = person;

    // Exclude same family members
    exclude = exclude.concat(map(filter(persons, ['lastname', person.lastname]), 'id'));

    // Exclude persons for whom he has already prayed it the two past year
    for (let i = 1; i <= 2; i += 1) {
      const pastYear = year - i;

      if (!draws[pastYear]) {
        break;
      }

      const draw = draws[pastYear];

      if (draw[person.id]) {
        exclude.push(draw[person.id]);
      }
    }

    return {
      ...person,
      exclude,
    };
  });

const handler = async ({ year }: Arguments<Props>) => {
  const { rows } = termSize();

  let participants =
    (await ask<Person[]>({
      type: 'checkbox',
      message: 'Select the participants',
      choices: map(persons, ({ id, firstname, lastname, kids }) => ({
        value: id,
        name: `${firstname} ${lastname}${kids ? ' (kid)' : ''}`,
        checked: true,
      })),
      pageSize: Math.max(10, rows - 10),
      validate: (input: Person[]) => {
        if (input.length < 3) {
          return 'You must choose 3 persons at least';
        }

        return true;
      },
    })) || [];

  if (!(await confirm(`Are you ready to random draw with these ${participants.length} persons?`))) {
    return;
  }

  participants = filter(persons, (person) => includes(participants, person));
  participants = resolveExclude(participants, year);
  participants = shuffle(participants);

  const mapping = shake(participants);

  fs.writeFileSync(
    path.join(__dirname, `../data/draws/${year}.json`),
    `${JSON.stringify(mapping, null, 2)}\n`,
  );
};

const commandModule: CommandModule<Record<string, unknown>, Props> = {
  command,
  describe,
  builder,
  handler,
};

export default commandModule;
