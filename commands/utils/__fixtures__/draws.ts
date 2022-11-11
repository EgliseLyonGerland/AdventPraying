import { Draw } from '../../../types.js';
import persons from './persons.js';

const draws: Record<number, Draw> = {
  2018: {
    [persons['jaime-lannister'].id]: persons['jon-snow'].id,
    [persons['robb-stark'].id]: persons['theon-greyjoy'].id,
    [persons['tyrion-lannister'].id]: persons['robb-stark'].id,
    [persons['bran-stark'].id]: persons['roose-bolton'].id,
    [persons['theon-greyjoy'].id]: persons['tyrion-lannister'].id,
    [persons['roose-bolton'].id]: persons['theon-greyjoy'].id,
    [persons['jon-snow'].id]: persons['bran-stark'].id,
  },
  2019: {
    [persons['tyrion-lannister'].id]: persons['theon-greyjoy'].id,
    [persons['theon-greyjoy'].id]: persons['cersei-lannister'].id,
    [persons['cersei-lannister'].id]: persons['joffrey-baratheon'].id,
    [persons['joffrey-baratheon'].id]: persons['arya-stark'].id,
    [persons['arya-stark'].id]: persons['jon-snow'].id,
    [persons['jon-snow'].id]: persons['viserys-targaryen'].id,
    [persons['daenerys-targaryen'].id]: persons['petyr-baelish'].id,
    [persons['petyr-baelish'].id]: persons['tyrion-lannister'].id,
  },
};

export default draws;
