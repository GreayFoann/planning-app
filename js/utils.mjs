export function getMondayOfWeek(weekOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + weekOffset * 7);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function formatDateComplete(date, lang = 'fr') {
  return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export function parseTime(str) {
  const [h, m] = str.split(':').map(n => parseInt(n, 10));
  return isNaN(h) || isNaN(m) ? null : h * 60 + m;
}

export function formatDuration(minutes) {
  if (isNaN(minutes)) return '0h00min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, '0')}min`;
}