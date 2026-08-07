/**
 * main.js — GEDANKEN 3000
 *
 * Nutzer-gesteuertes Scrollen im Credits-Stil.
 * Dazu: Volltextsuche, Filter nach Lebensjahr (Alter von Nils)
 * und ein Ticker, der fünf zufällige Gedanken durchlaufen lässt.
 */

(function () {
  'use strict';

  /* ── DOM Refs ───────────────────────────────────── */

  const header      = document.getElementById('site-header');
  const track       = document.getElementById('credits-track');
  const counterEl   = document.getElementById('counter-number');
  const counterLbl  = document.getElementById('counter-label');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const ageSelect   = document.getElementById('age-select');
  const tickerEl    = document.getElementById('ticker');
  const tickerTrack = document.getElementById('ticker-track');
  const noResults   = document.getElementById('no-results');

  const MONTHS = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const TICKER_ITEMS  = 5;
  const TICKER_SPEED  = 55;   // Pixel pro Sekunde
  const EXCERPT_CHARS = 95;

  /* ── Helpers ────────────────────────────────────── */

  function parseISO(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return { y: y, m: m, d: d };
  }

  function formatDate(iso) {
    const p = parseISO(iso);
    return `${p.d}. ${MONTHS[p.m - 1]} ${p.y}`;
  }

  /** Alter von Nils am Tag des Eintrags. */
  function ageAt(iso) {
    const born = parseISO(BIRTHDAY);
    const at   = parseISO(iso);
    let age = at.y - born.y;
    if (at.m < born.m || (at.m === born.m && at.d < born.d)) age--;
    return age;
  }

  /** Zeitraum eines Lebensjahres, z.B. "2020 – 2021". */
  function ageSpan(age) {
    const born = parseISO(BIRTHDAY);
    const from = born.y + age;
    return `${from}–${from + 1}`;
  }

  function stripTags(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function excerpt(str, max) {
    if (str.length <= max) return str;
    const cut = str.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + '…';
  }

  function prefersReducedMotion() {
    return window.matchMedia &&
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function shuffled(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /* ── Model ──────────────────────────────────────── */

  /**
   * ENTRIES ist neueste-zuerst sortiert.
   * `number` ist die stabile Eintragsnummer (ältester Eintrag = 1),
   * sie bleibt auch beim Filtern erhalten.
   */
  const ITEMS = ENTRIES.map(function (entry, index) {
    const plain = stripTags(entry.text);
    const age   = ageAt(entry.date);
    const dateLabel = formatDate(entry.date);

    return {
      number: ENTRIES.length - index,
      iso: entry.date,
      dateLabel: dateLabel,
      title: entry.title,
      text: entry.text,
      plain: plain,
      age: age,
      haystack: [entry.title || '', plain, dateLabel, `mit ${age}`]
        .join(' ')
        .toLowerCase()
    };
  });

  const AGES = Array.from(new Set(ITEMS.map(i => i.age))).sort((a, b) => b - a);

  /* ── Build Entries ──────────────────────────────── */

  function buildEntry(item) {
    const div = document.createElement('div');
    div.className = 'entry';
    div.id = `eintrag-${item.number}`;
    div.setAttribute('aria-label', `Eintrag ${item.number}`);

    let inner = '';

    inner += `<span class="entry-meta">` +
             `<span class="entry-date">${item.dateLabel}</span>` +
             `<span class="entry-meta-sep" aria-hidden="true">—</span>` +
             `<span class="entry-number"># ${String(item.number).padStart(3, '0')}</span>` +
             `</span>`;

    if (item.title) {
      inner += `<span class="entry-title">${item.title}</span>`;
    }

    inner += `<p class="entry-text">${item.text}</p>`;
    inner += `<span class="entry-divider" aria-hidden="true">· · ·</span>`;

    div.innerHTML = inner;
    return div;
  }

  /** Markiert Fundstellen im fertig gerenderten Eintrag (ohne HTML zu zerstören). */
  function highlight(root, term) {
    if (!term) return;

    const rx = new RegExp(escapeRegExp(term), 'gi');
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      const text = node.nodeValue;
      rx.lastIndex = 0;

      let match, last = 0;
      const frag = document.createDocumentFragment();

      while ((match = rx.exec(text)) !== null) {
        if (match.index > last) {
          frag.appendChild(document.createTextNode(text.slice(last, match.index)));
        }
        const mark = document.createElement('mark');
        mark.textContent = match[0];
        frag.appendChild(mark);
        last = match.index + match[0].length;
      }

      if (last === 0) return;   // nichts gefunden
      if (last < text.length) {
        frag.appendChild(document.createTextNode(text.slice(last)));
      }
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ── Filter & Render ────────────────────────────── */

  function currentFilter() {
    return {
      term: searchInput.value.trim(),
      age: ageSelect.value === 'all' ? null : Number(ageSelect.value)
    };
  }

  function render() {
    const { term, age } = currentFilter();
    const needle = term.toLowerCase();

    const matches = ITEMS.filter(function (item) {
      if (age !== null && item.age !== age) return false;
      if (needle && item.haystack.indexOf(needle) === -1) return false;
      return true;
    });

    const fragment = document.createDocumentFragment();
    matches.forEach(function (item) {
      const el = buildEntry(item);
      highlight(el, term);
      fragment.appendChild(el);
    });

    track.replaceChildren(fragment);

    noResults.hidden = matches.length > 0;
    searchClear.hidden = term.length === 0;
    updateCounter(matches.length, term || age !== null);
  }

  function updateCounter(shown, filtered) {
    if (filtered) {
      counterEl.textContent = shown;
      counterLbl.textContent = `von ${ITEMS.length} Gedanken`;
    } else {
      counterEl.textContent = ITEMS.length;
      counterLbl.textContent = 'and counting';
    }
  }

  /* ── Age Dropdown ───────────────────────────────── */

  function populateAgeSelect() {
    const fragment = document.createDocumentFragment();

    AGES.forEach(function (age) {
      const count = ITEMS.filter(i => i.age === age).length;
      const option = document.createElement('option');
      option.value = String(age);
      option.textContent = `Mit ${age} (${ageSpan(age)}) · ${count}`;
      fragment.appendChild(option);
    });

    ageSelect.appendChild(fragment);
  }

  /* ── Ticker ─────────────────────────────────────── */

  function buildTickerItem(item, isClone) {
    const el = document.createElement(isClone ? 'span' : 'button');
    el.className = 'ticker-item';

    if (isClone) {
      el.setAttribute('aria-hidden', 'true');
    } else {
      el.type = 'button';
      el.addEventListener('click', function () {
        jumpToEntry(item.number);
      });
    }

    el.innerHTML =
      `<span class="ticker-num"># ${String(item.number).padStart(3, '0')}</span>` +
      `<span class="ticker-text">${item.title ? item.title + ' — ' : ''}` +
      `${excerpt(item.plain, EXCERPT_CHARS)}</span>` +
      `<span class="ticker-sep" aria-hidden="true">◆</span>`;

    return el;
  }

  /**
   * Der Lauf wird per requestAnimationFrame gesteuert statt per CSS-Animation:
   * `animation-play-state: paused` lässt den Compositor beim Anhalten auf den
   * (leicht älteren) Stand des Main-Threads zurückspringen — der Ticker ruckelt
   * dann sichtbar zurück. Hier friert er exakt dort ein, wo er steht.
   */
  let tickerOffset = 0;   // aktuelle Verschiebung in px
  let tickerHalf   = 0;   // Breite einer Sequenz-Hälfte
  let tickerPaused = false;
  let tickerLast   = 0;
  let tickerRAF    = null;

  function tickerFrame(now) {
    if (!tickerLast) tickerLast = now;
    const dt = Math.min((now - tickerLast) / 1000, 0.1);  // Sprung nach Tab-Wechsel dämpfen
    tickerLast = now;

    if (tickerHalf > 0) {
      tickerOffset = (tickerOffset + TICKER_SPEED * dt) % tickerHalf;
      tickerTrack.style.transform = `translateX(${-tickerOffset}px)`;
    }

    tickerRAF = requestAnimationFrame(tickerFrame);
  }

  function startTicker() {
    if (tickerRAF !== null || tickerPaused || prefersReducedMotion()) return;
    tickerLast = 0;
    tickerRAF = requestAnimationFrame(tickerFrame);
  }

  function stopTicker() {
    if (tickerRAF === null) return;
    cancelAnimationFrame(tickerRAF);
    tickerRAF = null;
  }

  function measureTicker() {
    tickerHalf = tickerTrack.scrollWidth / 2;
    if (tickerHalf > 0) tickerOffset = tickerOffset % tickerHalf;
  }

  function buildTicker() {
    const picks = shuffled(ITEMS).slice(0, Math.min(TICKER_ITEMS, ITEMS.length));
    const fragment = document.createDocumentFragment();

    // Zweimal dieselbe Sequenz — dadurch läuft der Ticker nahtlos in Schleife.
    picks.forEach(item => fragment.appendChild(buildTickerItem(item, false)));
    picks.forEach(item => fragment.appendChild(buildTickerItem(item, true)));

    tickerTrack.replaceChildren(fragment);

    // Erst nach dem Layout messen, sonst ist scrollWidth noch 0.
    requestAnimationFrame(function () {
      measureTicker();
      startTicker();
    });
  }

  function pauseTicker() {
    tickerPaused = true;
    stopTicker();
  }

  function resumeTicker() {
    tickerPaused = false;
    startTicker();
  }

  /** Springt zu einem Eintrag — hebt ggf. Filter auf, damit er sichtbar ist. */
  function jumpToEntry(number) {
    let target = document.getElementById(`eintrag-${number}`);

    if (!target) {
      searchInput.value = '';
      ageSelect.value = 'all';
      render();
      target = document.getElementById(`eintrag-${number}`);
    }

    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.add('entry-flash');
    setTimeout(() => target.classList.remove('entry-flash'), 1600);
  }

  /* ── Header-Höhe → CSS-Variable ─────────────────── */

  function syncHeaderHeight() {
    const h = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }

  /* ── Events ─────────────────────────────────────── */

  function bindEvents() {
    searchInput.addEventListener('input', render);

    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchInput.focus();
      render();
    });

    ageSelect.addEventListener('change', function () {
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // "/" fokussiert die Suche, Escape leert sie.
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        render();
      }
    });

    // Ticker friert beim Überfahren ein und läuft von genau dort weiter.
    tickerEl.addEventListener('mouseenter', pauseTicker);
    tickerEl.addEventListener('mouseleave', resumeTicker);
    tickerEl.addEventListener('focusin', pauseTicker);
    tickerEl.addEventListener('focusout', resumeTicker);

    window.addEventListener('resize', function () {
      syncHeaderHeight();
      measureTicker();
    });

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncHeaderHeight).observe(header);
    }
  }

  /* ── Init ───────────────────────────────────────── */

  function init() {
    populateAgeSelect();
    render();
    buildTicker();
    syncHeaderHeight();
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
