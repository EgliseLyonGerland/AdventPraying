export type PersonId = string;

export enum AgeRange {
  '6-9' = '6-9',
  '10-13' = '10-13',
  '14-17' = '14-17',
  '18+' = '18+',
}

export interface PersonData {
  id: PersonId;
  firstname: string;
  lastname: string;
  age?: AgeRange;
  exclude?: PersonId[];
  archived?: boolean;
}

export type Person = Required<PersonData>;

export type Draw = Record<PersonId, PersonId>;
