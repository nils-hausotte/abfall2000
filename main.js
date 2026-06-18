/**
 * main.js — GEDANKEN 3000
 *
 * Nutzer-gesteuertes Scrollen im Credits-Stil.
 * Einträge laufen von unten nach oben — aber nur durch manuelles Scrollen.
 */

(function () {
  'use strict';

  /* ── DOM Refs ───────────────────────────────────── */

  const track     = document.getElementById('credits-track');
  const counterEl = document.getElementById('counter-number');

  /* ── Build Entries ──────────────────────────────── */

  function buildEntry(entry, index) {
    const div = document.createElement('div');
    div.className = 'entry';
    div.setAttribute('aria-label', `Eintrag ${index + 1}`);

    let inner = '';

    inner += `<span class="entry-number"># ${String(ENTRIES.length - index).padStart(3, '0')}</span>`;

    if (entry.date) {
      inner += `<span class="entry-date">${entry.date}</span>`;
    }

    if (entry.title) {
      inner += `<span class="entry-title">${entry.title}</span>`;
    }

    inner += `<p class="entry-text">${entry.text}</p>`;
    inner += `<span class="entry-divider" aria-hidden="true">· · ·</span>`;

    div.innerHTML = inner;
    return div;
  }

  function populateTrack() {
    const fragment = document.createDocumentFragment();
    ENTRIES.forEach((entry, i) => {
      fragment.appendChild(buildEntry(entry, i));
    });
    track.appendChild(fragment);
  }

  /* ── Counter ────────────────────────────────────── */

  function updateCounter() {
    counterEl.textContent = ENTRIES.length;
  }

  /* ── Init ───────────────────────────────────────── */

  function init() {
    updateCounter();
    populateTrack();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
