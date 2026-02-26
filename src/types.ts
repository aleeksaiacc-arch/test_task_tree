export interface Person {
  id: string;
  name: string;
  patronymic?: string;
  maidenName?: string;
  birthDate?: string;
  deathDate?: string;
  photoUrl?: string;
  bio?: string;
}

export type RelationType = "parent-child" | "spouse";

export interface Relation {
  type: RelationType;
  parentId?: string;
  childId?: string;
  personId?: string;
  spouseId?: string;
}

export interface Tree {
  people: Person[];
  relations: Relation[];
}
