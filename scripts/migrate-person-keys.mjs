import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data");

const CYRILLIC_TO_LATIN = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "j",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
  А: "a",
  Б: "b",
  В: "v",
  Г: "g",
  Д: "d",
  Е: "e",
  Ё: "e",
  Ж: "zh",
  З: "z",
  И: "i",
  Й: "j",
  К: "k",
  Л: "l",
  М: "m",
  Н: "n",
  О: "o",
  П: "p",
  Р: "r",
  С: "s",
  Т: "t",
  У: "u",
  Ф: "f",
  Х: "kh",
  Ц: "ts",
  Ч: "ch",
  Ш: "sh",
  Щ: "shch",
  Ъ: "",
  Ы: "y",
  Ь: "",
  Э: "e",
  Ю: "yu",
  Я: "ya",
  і: "i",
  ї: "yi",
  є: "ye",
  ґ: "g",
  І: "i",
  Ї: "yi",
  Є: "ye",
  Ґ: "g",
};

function transliterate(str) {
  return str
    .split("")
    .map((c) => CYRILLIC_TO_LATIN[c] ?? c)
    .join("");
}

function toKebabKey(str) {
  return transliterate(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function personKey(person) {
  const parts = [
    person.lastName,
    person.firstName,
    person.patronymic &&
    person.patronymic !== "undefined" &&
    person.patronymic !== ""
      ? person.patronymic
      : null,
  ].filter(Boolean);
  return toKebabKey(parts.join("-"));
}

function migrate() {
  const personsPath = join(DATA_DIR, "persons.json");
  const treesPath = join(DATA_DIR, "trees.json");

  const persons = JSON.parse(readFileSync(personsPath, "utf8"));
  const oldToNew = {};
  const newPersons = {};

  for (const [oldId, person] of Object.entries(persons)) {
    let key = personKey(person);
    let suffix = 0;
    while (newPersons[key] !== undefined) {
      suffix++;
      key = `${personKey(person)}-${suffix}`;
    }
    if (key !== oldId) oldToNew[oldId] = key;
    newPersons[key] = { ...person };
  }

  for (const person of Object.values(newPersons)) {
    const parents = person.parents;
    if (parents) {
      if (parents.fatherId && oldToNew[parents.fatherId]) {
        parents.fatherId = oldToNew[parents.fatherId];
      }
      if (parents.motherId && oldToNew[parents.motherId]) {
        parents.motherId = oldToNew[parents.motherId];
      }
    }
  }

  writeFileSync(personsPath, JSON.stringify(newPersons, null, 2), "utf8");

  const personIdsPath = join(DATA_DIR, "person-ids.json");
  const personIds = Object.fromEntries(
    Object.keys(newPersons).map((k) => [k, k])
  );
  writeFileSync(
    personIdsPath,
    JSON.stringify(personIds, null, 2),
    "utf8"
  );

  const trees = JSON.parse(readFileSync(treesPath, "utf8"));
  for (const group of Object.values(trees)) {
    if (group.parents) {
      if (group.parents.husbId && oldToNew[group.parents.husbId]) {
        group.parents.husbId = oldToNew[group.parents.husbId];
      }
      if (group.parents.wifeId && oldToNew[group.parents.wifeId]) {
        group.parents.wifeId = oldToNew[group.parents.wifeId];
      }
    }
    if (group.descendants) {
      for (const d of group.descendants) {
        if (d.id && oldToNew[d.id]) d.id = oldToNew[d.id];
        if (d.spouseId && oldToNew[d.spouseId])
          d.spouseId = oldToNew[d.spouseId];
      }
    }
  }

  writeFileSync(treesPath, JSON.stringify(trees, null, 2), "utf8");

  console.log("Migration complete. Old -> New mapping:");
  console.log(JSON.stringify(oldToNew, null, 2));
}

migrate();
