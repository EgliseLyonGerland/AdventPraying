export type PersonId = string;

export interface Person {
  id: PersonId;
  firstname: string;
  lastname: string;
  kids: boolean;
  exclude: PersonId[];
}

export type Draw = Record<PersonId, PersonId>;
