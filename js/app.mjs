import { getMondayOfWeek, formatDateComplete } from './utils.mjs';
import { isHoliday } from './holidays.mjs';
import { saveWeek, loadWeek, getLastOffset, setLastOffset } from './storage.mjs';

const translations = {
  fr: {
    title: "Planning Hebdomadaire",
    totalDone: "Total effectué",
    remaining: "Reste à faire",
    save: "Sauvegarder",
    cancel: "Annuler",
    duplicate: "Dupliquer",
    exportCSV: "Export CSV",
    exportPDF: "Imprimer / PDF"
  },
  en: {
    title: "Weekly Planner",
    totalDone: "Total worked",
    remaining: "Remaining",
    save: "Save",
    cancel: "Cancel",
    duplicate: "Duplicate",
    exportCSV: "Export CSV",
    exportPDF: "Print / PDF"
  }
};

let lang = 'fr';
let offset = getLastOffset();

function t(key) {
  return translations[lang][key] || key;
}

function render() {
  const monday = getMondayOfWeek(offset);
  const weekRangeEl = document.getElementById('weekRange');
  const planningEl = document.getElementById('planning');

  const endOfWeek = new Date(monday);
  endOfWeek.setDate(monday.getDate() + 6);
  weekRangeEl.textContent = `${formatDateComplete(monday, lang)} - ${formatDateComplete(endOfWeek, lang)}`;

  planningEl.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const isFerie = isHoliday(date);

    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    if (isFerie) dayEl.style.opacity = 0.6;

    const title = document.createElement('h2');
    title.textContent = formatDateComplete(date, lang);
    dayEl.appendChild(title);

    const inputs = document.createElement('div');
    inputs.className = 'inputs';

    ['Début', 'Fin', 'Pause', 'Total'].forEach(label => {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = label;
      inputs.appendChild(input);
    });

    dayEl.appendChild(inputs);

    const checkboxes = document.createElement('div');
    checkboxes.className = 'checkboxes';

    ['Jour travaillé', 'Congé payé'].forEach(text => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      label.appendChild(checkbox);
      label.append(` ${text}`);
      checkboxes.appendChild(label);
    });

    dayEl.appendChild(checkboxes);

    planningEl.appendChild(dayEl);
  }
}

document.getElementById('langSelect').addEventListener('change', (e) => {
  lang = e.target.value;
  render();
});

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

render();