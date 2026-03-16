import { format, parse, parseISO, isValid } from "date-fns";

function parsePersonDate(dateStr: string): Date | null | string {
  if (dateStr.length === 4 && !isNaN(+dateStr)) return dateStr;
  try {
    const d = parse(dateStr, "dd-MM-yyyy", new Date());
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

export function formatPersonDateYear(dateStr: string | undefined): string {
  if (!dateStr || dateStr === "undefined") return "...";
  if (dateStr.length === 4 && !isNaN(+dateStr)) return dateStr;
  const d = parsePersonDate(dateStr);
  if (d) return format(d, "yyyy");
  if (/^\d{4}$/.test(dateStr)) return `..-..-${dateStr}`;
  return dateStr;
}

export function formatPersonDateBirth(dateStr: string | undefined): string {
  if (!dateStr || dateStr === "undefined") return "...";
  if (dateStr.length === 4 && !isNaN(+dateStr)) return dateStr;
  const d = parsePersonDate(dateStr);
  if (d) return format(d, "dd.MM.yyyy");
  if (/^\d{4}$/.test(dateStr)) return `..-..-${dateStr}`;
  return dateStr;
}

export function formatDate(_locale: string, dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = parseISO(dateStr);
  if (!isValid(d)) return dateStr;
  return format(d, "yyyy");
}
