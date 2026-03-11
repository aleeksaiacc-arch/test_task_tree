const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh",
  щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  А: "A", Б: "B", В: "V", Г: "G", Д: "D", Е: "E", Ё: "E", Ж: "Zh", З: "Z",
  И: "I", Й: "J", К: "K", Л: "L", М: "M", Н: "N", О: "O", П: "P", Р: "R",
  С: "S", Т: "T", У: "U", Ф: "F", Х: "Kh", Ц: "Ts", Ч: "Ch", Ш: "Sh",
  Щ: "Shch", Ъ: "", Ы: "Y", Ь: "", Э: "E", Ю: "Yu", Я: "Ya",
  і: "i", ї: "yi", є: "ye", ґ: "g", І: "I", Ї: "Yi", Є: "Ye", Ґ: "G",
};

export function transliterateCyrillicToLatin(text: string): string {
  return text
    .split("")
    .map((c) => CYRILLIC_TO_LATIN[c] ?? c)
    .join("");
}

const CYRILLIC_LOCALES = new Set(["ru", "by"]);

export function nameForLocale(
  nameParts: (string | undefined | "notApplicable")[],
  locale: string
): string {
  const raw = nameParts.filter(Boolean).filter(v => v !== "notApplicable").join(" ");
  if (!raw) return "—";
  if (CYRILLIC_LOCALES.has(locale)) return raw;
  return transliterateCyrillicToLatin(raw);
}
