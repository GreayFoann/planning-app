export function isHoliday(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const key = `${day}-${month}`;

  const fixed = ['1-1', '1-5', '8-5', '14-7', '15-8', '1-11', '11-11', '25-12'];
  if (fixed.includes(key)) return true;

  const easter = getEasterDate(year);
  const holidays = [
    easter,
    addDays(easter, 1),
    addDays(easter, 39),
    addDays(easter, 50)
  ];

  return holidays.some(h => h.toDateString() === date.toDateString());
}

function getEasterDate(year) {
  const f = Math.floor;
  const G = year % 19;
  const C = f(year / 100);
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11));
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J;
  const month = 3 + f((L + 40) / 44);
  const day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}