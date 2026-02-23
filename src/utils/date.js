export function parseBrazilianDate(dateString) {
  if (typeof dateString !== 'string') return null;

  const trimmed = dateString.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return { day, month, year };
}

export function toIsoDateFromBrazilian(dateString) {
  const parsed = parseBrazilianDate(dateString);
  if (!parsed) return null;
  return `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
}
