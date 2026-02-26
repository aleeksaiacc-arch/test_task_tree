export function formatDate(locale: string, dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const hasDay = dateStr.length >= 10;
  if (hasDay)
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  return new Intl.DateTimeFormat(locale, { year: "numeric" }).format(d);
}
