import { getMondayOfWeek, formatDateComplete, parseTime, formatDuration } from './utils.mjs';
import { saveWeek, loadWeek, getLastOffset, setLastOffset } from './storage.mjs';
import { isHoliday } from './holidays.mjs';

let offset = getLastOffset();
let lang = localStorage.getItem('lang') || 'fr';
let theme = localStorage.getItem('theme') || 'light';

const jours = {
  fr: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
};

document.getElementById('langSelect').value = lang;
document.getElementById('langSelect').addEventListener('change', e => {
  lang = e.target.value;
  localStorage.setItem('lang', lang);
  render();
});

document.getElementById('toggleTheme').addEventListener('click', () => {
  theme = theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
  applyTheme();
});

function applyTheme() {
  document.body.classList.toggle('dark', theme === 'dark');
}
applyTheme();

document.getElementById('prevWeek').addEventListener('click', () => {
  offset--;
  setLastOffset(offset);
  render();
});

document.getElementById('nextWeek').addEventListener('click', () => {
  offset++;
  setLastOffset(offset);
  render();
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const monday = getMondayOfWeek(offset);
  const data = Array.from(document.querySelectorAll('.day')).map(day => ({
    start: day.querySelector('.start').value,
    end: day.querySelector('.end').value,
    worked: day.querySelector('.worked').checked,
    leave: day.querySelector('.leave').checked,
    note: day.querySelector('.note').value
  }));
  saveWeek(monday, data);
  alert('Planning sauvegardé ✅');
});

document.getElementById('resetBtn').addEventListener('click', () => {
  render();
});

document.getElementById('exportCSV').addEventListener('click', () => {
  const rows = [['Date', 'Début', 'Fin', 'Durée', 'Travaillé', 'Congé', 'Note']];
  document.querySelectorAll('.day').forEach(day => {
    const date = day.dataset.date;
    const start = day.querySelector('.start').value;
    const end = day.querySelector('.end').value;
    const worked = day.querySelector('.worked').checked ? 'Oui' : 'Non';
    const leave = day.querySelector('.leave').checked ? 'Oui' : 'Non';
    const note = day.querySelector('.note').value;
    const duration = calculateDayDuration(start, end, worked, leave);
    rows.push([date, start, end, formatDuration(duration), worked, leave, note]);
  });

  const csv = rows.map(row => row.join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'planning.csv';
  a.click();
});

function calculateDayDuration(start, end, worked, leave) {
  if (leave) return 420;
  if (!worked) return 0;
  const t1 = parseTime(start);
  const t2 = parseTime(end);
  if (t1 === null || t2 === null || t2 <= t1) return 0;
  return t2 - t1;
}

function render() {
  const monday = getMondayOfWeek(offset);
  const endOfWeek = new Date(monday);
  endOfWeek.setDate(monday.getDate() + 6);
  document.getElementById('weekRange').textContent = `${formatDateComplete(monday, lang)} - ${formatDateComplete(endOfWeek, lang)}`;
  const data = loadWeek(monday);
  const container = document.getElementById('planning');
  container.innerHTML = '';

  let total = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayName = jours[lang][i];
    const holiday = isHoliday(d);

    const dayData = data[i] || {};
    const start = dayData.start || '09:00';
    const end = dayData.end || '17:00';
    const worked = dayData.worked !== false && !holiday;
    const leave = dayData.leave === true;
    const note = dayData.note || '';

    const duration = calculateDayDuration(start, end, worked, leave);
    total += duration;

    const div = document.createElement('div');
    div.className = 'day';
    div.dataset.date = iso;

    div.innerHTML = `
      <h2>${dayName} - ${iso}${holiday ? ' 🎉' : ''}</h2>
      <div class="inputs">
        <input type="time" class="start" value="${start}" ${!worked || leave ? 'disabled' : ''}>
        <input type="time" class="end" value="${end}" ${!worked || leave ? 'disabled' : ''}>
        <label><input type="checkbox" class="worked" ${worked ? 'checked' : ''}> Travaillé</label>
        <label><input type="checkbox" class="leave" ${leave ? 'checked' : ''}> Congé</label>
      </div>
      <textarea class="note" placeholder="Note...">${note}</textarea>
      <p class="total">Durée : <strong>${formatDuration(duration)}</strong></p>
    `;

    container.appendChild(div);

    const startInput = div.querySelector('.start');
    const endInput = div.querySelector('.end');
    const workedBox = div.querySelector('.worked');
    const leaveBox = div.querySelector('.leave');

    const updateFields = () => {
      const w = workedBox.checked;
      const l = leaveBox.checked;
      startInput.disabled = !w || l;
      endInput.disabled = !w || l;
      if (l) workedBox.checked = false;
      if (w) leaveBox.checked = false;
      render(); // rerender all to recalculate
    };

    workedBox.addEventListener('change', updateFields);
    leaveBox.addEventListener('change', updateFields);
    startInput.addEventListener('input', render);
    endInput.addEventListener('input', render);
  }

  document.getElementById('totalEffectue').textContent = formatDuration(total);
  const joursConges = [...container.querySelectorAll('.leave:checked')].length;
  const joursFeries = [...container.querySelectorAll('.day')].filter(d => d.querySelector('h2').textContent.includes('🎉')).length;
  const adjustedQuota = 35 * 60 - (joursConges + joursFeries) * 420;
  document.getElementById('reste').textContent = formatDuration(Math.max(adjustedQuota - total, 0));
}
render();