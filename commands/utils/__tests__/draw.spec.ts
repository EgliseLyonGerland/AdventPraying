import { mockRandom } from 'jest-mock-random';
import {
  getFamilyMembers,
  getTwoPastDraws,
  resolveExclude,
  letsDraw,
  getCandidates,
} from '../draw';
import persons from '../__fixtures__/persons';
import draws from '../__fixtures__/draws';
import { cloneDeep } from 'lodash';

const players = Object.values(persons);

test('letsDraw()', () => {
  mockRandom([
    0.7134873781309836, 0.6566703528332583, 0.970250475625656, 0.4265692519444848,
    0.6724790602278108, 0.5801688831154479, 0.26820188576420145, 0.28928823496188283,
    0.8492126277484653, 0.7508148343151484, 0.853162141153462, 0.607520163924727,
    0.38055135333948487, 0.995776535955728, 0.8825166814134866, 0.187156342404472,
  ]);

  const draw = letsDraw(cloneDeep(players), draws, 2023);

  expect(draw).toMatchObject({
    'robb-stark': 'joffrey-baratheon',
    'bran-stark': '',
    'tyrion-lannister': 'petyr-baelish',
    'arya-stark': '',
    'sansa-stark': 'jon-snow',
    'ned-stark': 'jaime-lannister',
    'cersei-lannister': 'roose-bolton',
    'jaime-lannister': 'viserys-targaryen',
    'daenerys-targaryen': 'sansa-stark',
    'jon-snow': 'robb-stark',
    'tywin-lannister': 'theon-greyjoy',
    'theon-greyjoy': 'ned-stark',
    'viserys-targaryen': 'cersei-lannister',
    'roose-bolton': 'tywin-lannister',
    'joffrey-baratheon': 'daenerys-targaryen',
    'petyr-baelish': '',
  });
});

test('getCandidates()', () => {
  const current = {
    ...persons['arya-stark'],
    exclude: ['roose-bolton', 'ned-stark'],
  };
  const draw = {
    'robb-stark': 'daenerys-targaryen',
    'petyr-baelish': 'tywin-lannister',
    'jon-snow': 'arya-stark',
  };

  expect(getCandidates(current, players, draw)).toMatchObject(['bran-stark']);
});

test('getFamilyMembers()', () => {
  const players = Object.values(persons);
  const current = persons['robb-stark'];

  expect(getFamilyMembers(players, current)).toMatchObject([
    persons['bran-stark'],
    persons['ned-stark'],
    persons['arya-stark'],
    persons['sansa-stark'],
  ]);
});

test('getTwoPastDraws()', () => {
  const entry = {
    2015: { foo: 'foo' },
    2016: { bar: 'bar' },
    2018: { baz: 'baz' },
  };

  expect(getTwoPastDraws(entry, 2023)).toMatchObject([{ bar: 'bar' }, { baz: 'baz' }]);
  expect(getTwoPastDraws(entry, 2018)).toMatchObject([{ foo: 'foo' }, { bar: 'bar' }]);
  expect(getTwoPastDraws(entry, 2017)).toMatchObject([{ foo: 'foo' }, { bar: 'bar' }]);
  expect(getTwoPastDraws(entry, 2016)).toMatchObject([{ foo: 'foo' }]);
  expect(getTwoPastDraws(entry, 2015)).toMatchObject([]);
});

test('resolveExclude()', () => {
  expect(resolveExclude(cloneDeep(players), draws, 2023)).toMatchInlineSnapshot(`
    Array [
      Object {
        "age": "14-17",
        "archived": false,
        "email": "daenerys@targaryen.com",
        "exclude": Array [
          "jon-snow",
          "viserys-targaryen",
          "petyr-baelish",
        ],
        "firstname": "Daenerys",
        "id": "daenerys-targaryen",
        "lastname": "Targaryen",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "viserys@targaryen.com",
        "exclude": Array [
          "daenerys-targaryen",
        ],
        "firstname": "Viserys",
        "id": "viserys-targaryen",
        "lastname": "Targaryen",
      },
      Object {
        "age": "14-17",
        "archived": false,
        "email": "robb@stark.com",
        "exclude": Array [
          "bran-stark",
          "ned-stark",
          "arya-stark",
          "sansa-stark",
          "theon-greyjoy",
        ],
        "firstname": "Robb",
        "id": "robb-stark",
        "lastname": "Stark",
      },
      Object {
        "age": "10-13",
        "archived": false,
        "email": "bran@stark.com",
        "exclude": Array [
          "robb-stark",
          "ned-stark",
          "arya-stark",
          "sansa-stark",
          "roose-bolton",
        ],
        "firstname": "Bran",
        "id": "bran-stark",
        "lastname": "Stark",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "roose@bolton.com",
        "exclude": Array [
          "theon-greyjoy",
        ],
        "firstname": "Roose",
        "id": "roose-bolton",
        "lastname": "Bolton",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "ned@stark.com",
        "exclude": Array [
          "robb-stark",
          "bran-stark",
          "arya-stark",
          "sansa-stark",
        ],
        "firstname": "Ned",
        "id": "ned-stark",
        "lastname": "Stark",
      },
      Object {
        "age": "14-17",
        "archived": false,
        "email": "jon@snow.com",
        "exclude": Array [
          "daenerys-targaryen",
          "bran-stark",
          "viserys-targaryen",
        ],
        "firstname": "Jon",
        "id": "jon-snow",
        "lastname": "Snow",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "tyrion@lannister.com",
        "exclude": Array [
          "cersei-lannister",
          "jaime-lannister",
          "tywin-lannister",
          "robb-stark",
          "theon-greyjoy",
        ],
        "firstname": "Tyrion",
        "id": "tyrion-lannister",
        "lastname": "Lannister",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "cersei@lannister.com",
        "exclude": Array [
          "tyrion-lannister",
          "jaime-lannister",
          "tywin-lannister",
          "joffrey-baratheon",
        ],
        "firstname": "Cersei",
        "id": "cersei-lannister",
        "lastname": "Lannister",
      },
      Object {
        "age": "10-13",
        "archived": false,
        "email": "arya@stark.com",
        "exclude": Array [
          "robb-stark",
          "bran-stark",
          "ned-stark",
          "sansa-stark",
          "jon-snow",
        ],
        "firstname": "Arya",
        "id": "arya-stark",
        "lastname": "Stark",
      },
      Object {
        "age": "14-17",
        "archived": false,
        "email": "sansa@stark.com",
        "exclude": Array [
          "petyr-baelish",
          "robb-stark",
          "bran-stark",
          "ned-stark",
          "arya-stark",
        ],
        "firstname": "Sansa",
        "id": "sansa-stark",
        "lastname": "Stark",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "jaime@lannister.com",
        "exclude": Array [
          "tyrion-lannister",
          "cersei-lannister",
          "tywin-lannister",
          "jon-snow",
        ],
        "firstname": "Jaime",
        "id": "jaime-lannister",
        "lastname": "Lannister",
      },
      Object {
        "age": "14-17",
        "archived": false,
        "email": "joffrey@baratheon.com",
        "exclude": Array [
          "arya-stark",
        ],
        "firstname": "Joffrey",
        "id": "joffrey-baratheon",
        "lastname": "Baratheon",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "theon@greyjoy.com",
        "exclude": Array [
          "tyrion-lannister",
          "cersei-lannister",
        ],
        "firstname": "Theon",
        "id": "theon-greyjoy",
        "lastname": "Greyjoy",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "tywin@lannister.com",
        "exclude": Array [
          "tyrion-lannister",
          "cersei-lannister",
          "jaime-lannister",
        ],
        "firstname": "Tywin",
        "id": "tywin-lannister",
        "lastname": "Lannister",
      },
      Object {
        "age": "18+",
        "archived": false,
        "email": "petyr@baelish.com",
        "exclude": Array [
          "tyrion-lannister",
        ],
        "firstname": "Petyr",
        "id": "petyr-baelish",
        "lastname": "Baelish",
      },
    ]
  `);
});
