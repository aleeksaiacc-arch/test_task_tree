export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  maidenName?: string;
  parents?: { motherId: string; fatherId: string };
  birthDate: string;
  deathDate: string;
  photoUrl?: string;
  bio: string;
  sex: "male" | "female";
}

export type PeopleById = Record<string, Person>;
