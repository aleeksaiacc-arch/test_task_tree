export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  maidenName?: string;
  birthDate?: string;
  deathDate?: string;
  photoUrl?: string;
  bio?: string;
}

export type PeopleById = Record<string, Person>;
