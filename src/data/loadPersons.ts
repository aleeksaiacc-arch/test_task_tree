import type { Person, PeopleById } from "../types";
import persons from "./persons.json";
import personIds from "./person-ids.json";

export function loadPerson(id: string): Promise<Person | null> {
  const resolvedId = (personIds as Record<string, string>)[id] ?? id;
  const person = (persons as PeopleById)[resolvedId];
  return Promise.resolve(person ?? null);
}
