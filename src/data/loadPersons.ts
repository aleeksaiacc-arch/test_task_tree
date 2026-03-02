import type { PeopleById, Person } from "../types";
import sampleTree from "./persons.json";

export function loadPeopleById(): Promise<PeopleById> {
  return Promise.resolve(sampleTree as PeopleById);
}

export function loadPerson(id: string): Promise<Person | null> {
  const person = (sampleTree as PeopleById)[id];
  return Promise.resolve(person ?? null);
}
