import type { Person, PeopleById } from "../types";
import sampleTree from "./persons.json";

export function loadPerson(id: string): Promise<Person | null> {
  const person = (sampleTree as PeopleById)[id];
  return Promise.resolve(person ?? null);
}
