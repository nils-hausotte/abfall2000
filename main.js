/**
 * main.js — GEDANKEN 3000
 *
 * Nutzer-gesteuertes Scrollen im Credits-Stil.
 * Dazu: Volltextsuche, Filter nach Jahr
 * und ein Ticker, der 20 zufällige Gedanken durchlaufen lässt.
 */

(function () {
  'use strict';

  /* ── DOM Refs ───────────────────────────────────── */

  const header      = document.getElementById('site-header');
  const track       = document.getElementById('credits-track');
  const homeButton  = document.getElementById('home-button');
  const counterEl   = document.getElementById('counter-number');
  const counterLbl  = document.getElementById('counter-label');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const yearSelect   = document.getElementById('year-select');
  const tickerEl    = document.getElementById('ticker');
  const tickerTrack = document.getElementById('ticker-track');
  const noResults   = document.getElementById('no-results');

  const MONTHS = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const TICKER_ITEMS  = 20;
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

  function stripTags(html) {
    // <br> wird zum Leerzeichen — sonst kleben Zeilen in Suche und Ticker
    // aneinander ("...gehtWORAUF...").
    return html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
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

  /** Inhalt ersetzen — statt replaceChildren(), das erst ab Safari 14 existiert. */
  function setChildren(parent, node) {
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    parent.appendChild(node);
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
    const dateLabel = formatDate(entry.date);

    return {
      number: ENTRIES.length - index,
      iso: entry.date,
      dateLabel: dateLabel,
      text: entry.text,
      plain: plain,
      year: parseISO(entry.date).y,
      haystack: [plain, dateLabel]
        .join(' ')
        .toLowerCase()
    };
  });

  const YEARS = Array.from(new Set(ITEMS.map(i => i.year))).sort((a, b) => b - a);

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

    inner += `<p class="entry-text">${item.text}</p>`;

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
      year: yearSelect.value === 'all' ? null : Number(yearSelect.value)
    };
  }

  function render() {
    const { term, year } = currentFilter();
    const needle = term.toLowerCase();

    const matches = ITEMS.filter(function (item) {
      if (year !== null && item.year !== year) return false;
      if (needle && item.haystack.indexOf(needle) === -1) return false;
      return true;
    });

    const fragment = document.createDocumentFragment();
    matches.forEach(function (item) {
      const el = buildEntry(item);
      highlight(el, term);
      fragment.appendChild(el);
    });

    setChildren(track, fragment);

    noResults.hidden = matches.length > 0;
    searchClear.hidden = term.length === 0;
    updateCounter(matches.length, term || year !== null);
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

  /* ── Jahres-Dropdown ────────────────────────────── */

  function populateYearSelect() {
    const fragment = document.createDocumentFragment();

    YEARS.forEach(function (year) {
      const count = ITEMS.filter(i => i.year === year).length;
      const option = document.createElement('option');
      option.value = String(year);
      option.textContent = `${year} — ${count}`;
      fragment.appendChild(option);
    });

    yearSelect.appendChild(fragment);
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
        // Nach Tap/Klick keinen hängenden Fokus zurücklassen (Touch!).
        if (!lastInputWasKeyboard) {
          el.blur();
          pausedByFocus = false;
          syncTicker();
        }
      });
    }

    el.innerHTML =
      `<span class="ticker-num"># ${String(item.number).padStart(3, '0')}</span>` +
      `<span class="ticker-text">${excerpt(item.plain, EXCERPT_CHARS)}</span>` +
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
  let tickerLast   = 0;
  let tickerRAF    = null;

  /* Zwei getrennte Pausengründe — sonst hebt ein Ereignis die Pause des
     anderen auf (z.B. Klick mit der Maus, während der Zeiger noch drüber ist). */
  let pausedByPointer = false;
  let pausedByFocus   = false;

  function tickerPaused() {
    return pausedByPointer || pausedByFocus;
  }

  function isHovered() {
    try {
      return tickerEl.matches(':hover');
    } catch (e) {
      return false;                     // :hover kennt nicht jede Engine
    }
  }

  /**
   * Hebt Pausen auf, deren Grund nicht mehr existiert.
   *
   * `pointerleave` und `focusout` kommen nicht zuverlässig an: verlässt der
   * Zeiger den Ticker während eines Tab- oder Fensterwechsels, oder wird das
   * fokussierte Element aus dem DOM genommen, bleibt das Gegenereignis aus —
   * das Flag stünde dann für immer auf `true` und der Ticker liefe nie wieder
   * an. Darum wird vor jeder Entscheidung gegengeprüft.
   *
   * Wichtig: hier wird ausschließlich *entpausiert*, nie pausiert. Auf
   * Touch-Geräten bleibt `:hover` nach einem Tap hängen — daraus darf niemals
   * eine Pause entstehen.
   */
  function refreshPauseState() {
    if (pausedByPointer && !isHovered()) pausedByPointer = false;
    if (pausedByFocus && !tickerEl.contains(document.activeElement)) pausedByFocus = false;
  }

  function syncTicker() {
    refreshPauseState();
    if (tickerPaused()) stopTicker();
    else startTicker();
  }

  function tickerFrame(now) {
    if (!tickerLast) tickerLast = now;
    const dt = Math.min((now - tickerLast) / 1000, 0.1);  // Sprung nach Tab-Wechsel dämpfen
    tickerLast = now;

    if (tickerHalf > 0) {
      tickerOffset = (tickerOffset + TICKER_SPEED * dt) % tickerHalf;
      // translate3d statt translateX: stabilere Compositing-Ebene in Safari
      tickerTrack.style.transform = `translate3d(${-tickerOffset}px, 0, 0)`;
    }

    tickerRAF = requestAnimationFrame(tickerFrame);
  }

  function startTicker() {
    if (tickerRAF !== null || tickerPaused() || prefersReducedMotion()) return;
    tickerLast = 0;
    tickerRAF = requestAnimationFrame(tickerFrame);
  }

  function stopTicker() {
    if (tickerRAF === null) return;
    cancelAnimationFrame(tickerRAF);
    tickerRAF = null;
  }

  /* Letzte Rückfallebene: Falls gar kein Ereignis mehr kommt, prüft der Ticker
     einmal pro Sekunde selbst nach, ob seine Pause noch berechtigt ist. */
  function startTickerWatchdog() {
    setInterval(function () {
      if (tickerPaused() || tickerRAF === null) syncTicker();
    }, 1000);
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

    setChildren(tickerTrack, fragment);

    // Erst nach dem Layout messen, sonst ist scrollWidth noch 0.
    requestAnimationFrame(function () {
      measureTicker();
      startTicker();
    });

    // Nach dem Laden der Schriften kann sich die Breite ändern → neu messen.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureTicker).catch(function () {});
    }
  }

  /**
   * Nur Tastaturfokus soll pausieren, Fokus durch Antippen nicht.
   * Die Eingabeart wird selbst mitgeschrieben statt über `:focus-visible`
   * abgefragt: dessen Heuristik fällt je nach Browser unterschiedlich aus und
   * liefert für "tippen und dann fokussieren" teilweise `true` — der Ticker
   * bliebe auf dem Handy dann für immer stehen.
   */
  let lastInputWasKeyboard = false;

  function trackInputModality() {
    const setKey     = function () { lastInputWasKeyboard = true; };
    const setPointer = function () { lastInputWasKeyboard = false; };

    document.addEventListener('keydown', setKey, true);
    document.addEventListener('mousedown', setPointer, true);
    document.addEventListener('pointerdown', setPointer, true);
    document.addEventListener('touchstart', setPointer, { capture: true, passive: true });
  }

  /** Scrollen mit Fallback für Browser ohne smooth-Option. */
  function scrollToY(top) {
    const y = Math.max(0, top);
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    } else {
      window.scrollTo(0, y);
    }
  }

  let flashTimer  = null;
  let flashTarget = null;

  /** Springt zu einem Eintrag — hebt ggf. Filter auf, damit er sichtbar ist. */
  function jumpToEntry(number) {
    let target = document.getElementById(`eintrag-${number}`);

    if (!target) {
      searchInput.value = '';
      yearSelect.value = 'all';
      render();
      target = document.getElementById(`eintrag-${number}`);
    }

    if (!target) return;

    const pageY = window.pageYOffset || document.documentElement.scrollTop || 0;
    scrollToY(pageY + target.getBoundingClientRect().top - (header.offsetHeight + 24));

    // Bei schnellen Mehrfachklicks darf der Timer des vorigen Sprungs die
    // Markierung des neuen Ziels nicht wieder abräumen.
    if (flashTimer !== null) clearTimeout(flashTimer);
    if (flashTarget) flashTarget.classList.remove('entry-flash');

    flashTarget = target;
    target.classList.remove('entry-flash');
    void target.offsetWidth;            // Reflow erzwingen → Animation neu starten
    target.classList.add('entry-flash');
    flashTimer = setTimeout(function () {
      target.classList.remove('entry-flash');
      flashTimer = null;
      flashTarget = null;
    }, 1600);
  }

  /* ── Header-Höhe → CSS-Variable ─────────────────── */

  function syncHeaderHeight() {
    const h = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  }

  /* ── Events ─────────────────────────────────────── */

  function bindEvents() {
    // Klick auf den Seitentitel scrollt zurück nach oben zum ersten Eintrag.
    // Filter und Suche bleiben dabei bewusst stehen.
    homeButton.addEventListener('click', function () {
      scrollToY(0);
    });

    searchInput.addEventListener('input', render);

    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchInput.focus();
      render();
    });

    yearSelect.addEventListener('change', function () {
      render();
      scrollToY(0);
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

    /* Ticker friert beim Überfahren mit der Maus ein und läuft von genau dort
       weiter. Auf Touch-Geräten wird bewusst NICHT pausiert: dort bleibt nach
       einem Tap der Hover- bzw. Fokuszustand hängen (kein mouseleave, kein
       focusout), der Ticker würde also für immer stehen bleiben. */
    if (window.PointerEvent) {
      tickerEl.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'mouse') { pausedByPointer = true; syncTicker(); }
      });
      tickerEl.addEventListener('pointerleave', function (e) {
        if (e.pointerType === 'mouse') { pausedByPointer = false; syncTicker(); }
      });
      tickerEl.addEventListener('pointercancel', function () {
        pausedByPointer = false; syncTicker();
      });
      /* Falls das `pointerenter` verloren ging (z.B. weil der Zeiger beim
         Tab-Wechsel schon über dem Ticker stand), zieht die erste Bewegung
         die Pause nach. */
      tickerEl.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'mouse' && !pausedByPointer) {
          pausedByPointer = true; syncTicker();
        }
      });
    } else {
      tickerEl.addEventListener('mouseenter', function () {
        pausedByPointer = true; syncTicker();
      });
      tickerEl.addEventListener('mouseleave', function () {
        pausedByPointer = false; syncTicker();
      });
    }

    // Ältere Browser ohne Pointer Events feuern nach dem Tap ein Fake-Hover.
    tickerEl.addEventListener('touchend', function () {
      pausedByPointer = false;
      syncTicker();
    }, { passive: true });

    tickerEl.addEventListener('focusin', function (e) {
      if (lastInputWasKeyboard) { pausedByFocus = true; syncTicker(); }
    });
    tickerEl.addEventListener('focusout', function () {
      pausedByFocus = false; syncTicker();
    });

    window.addEventListener('resize', function () {
      syncHeaderHeight();
      measureTicker();
    });

    /* Beim Wechsel zurück in den Tab oder ins Fenster kann der Zeiger längst
       woanders sein, ohne dass ein pointerleave kam — also nachfassen. */
    document.addEventListener('visibilitychange', syncTicker);
    window.addEventListener('focus', syncTicker);
    window.addEventListener('blur', syncTicker);

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncHeaderHeight).observe(header);
    }
  }

  /* ── Init ───────────────────────────────────────── */

  function init() {
    trackInputModality();
    populateYearSelect();
    render();
    buildTicker();
    syncHeaderHeight();
    bindEvents();
    startTickerWatchdog();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
