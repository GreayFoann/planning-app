const PREFIX = 'planning_';
const OFFSET_KEY = 'derniereSemaineOffset';

export function saveWeek(monday, data) {
  localStorage.setItem(PREFIX + monday.toISOString().split('T')[0], JSON.stringify(data));
  localStorage.setItem(OFFSET_KEY, getWeekOffset(monday));
}

export function loadWeek(monday) {
  try {
    const stored = localStorage.getItem(PREFIX + monday.toISOString().split('T')[0]);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getLastOffset() {
  const val = localStorage.getItem(OFFSET_KEY);
  return val !== null ? parseInt(val, 10) : 0;
}

function getWeekOffset(monday) {
  const now = new Date();
  const mondayNow = new Date(now);
  mondayNow.setDate(now.getDate() - (now.getDay() + 6) % 7);
  return Math.round((monday - mondayNow) / (7 * 86400000));
}
