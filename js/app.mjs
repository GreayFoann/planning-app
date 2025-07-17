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
  // TODO: implémenter le rendu complet
}

document.getElementById('langSelect').addEventListener('change', (e) => {
  lang = e.target.value;
  render();
});

render();
