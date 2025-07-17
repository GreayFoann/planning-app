export function getMondayOfWeek(weekOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + weekOffset * 7);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function formatDateComplete(date) {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}
