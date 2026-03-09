import { format, parseISO, isValid } from "date-fns";

export function formatDate(_locale: string, dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = parseISO(dateStr);
  if (!isValid(d)) return dateStr;
  return format(d, "yyyy");
}
