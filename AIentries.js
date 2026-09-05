/**
 * entries.js — GEDANKEN 3000
 *
 * Füge neue Einträge am ANFANG des Arrays hinzu (neueste zuerst).
 * Jeder Eintrag hat:
 *   - date:  ISO-Datum "JJJJ-MM-TT" (z.B. "2020-06-18")
 *            Wird automatisch als "18. Juni 2020" angezeigt; das Jahr
 *            daraus füllt den Jahresfilter.
 *   - title: optionaler Kurztitel (oder null)
 *   - text:  der eigentliche Text (HTML erlaubt: <em>, <strong>)
 */

const ENTRIES = [
  /* ── 2026 ─────────────────────────────────────── */
  {
    date: "2026-08-04",
    title: "Sommer",
    text: "Der August tut so, als hätte er alle Zeit der Welt. Er hat sie nicht. Ich mag ihn trotzdem dafür."
  },
  {
    date: "2026-07-28",
    title: null,
    text: "Ich habe gemerkt, dass ich Menschen nicht mehr überzeugen will. Nur noch verstehen. Das ist billiger und ehrlicher."
  },
  {
    date: "2026-07-15",
    title: "Sechsundzwanzig",
    text: "Mit zwanzig dachte ich, ich müsste jemand <em>werden</em>. Mit sechsundzwanzig reicht es mir, jemand zu bleiben."
  },
  {
    date: "2026-06-30",
    title: null,
    text: "Es gibt Freundschaften, die nur noch aus Geburtstagsnachrichten bestehen. Ich lösche sie nicht. Man weiß ja nie."
  },
  {
    date: "2026-06-12",
    title: "Arbeit",
    text: "Der Kalender ist voll, der Tag ist leer. Niemand hat mir erklärt, wie beides gleichzeitig geht."
  },
  {
    date: "2026-05-21",
    title: null,
    text: "Ich schreibe hier seit sechs Jahren. Der erste Eintrag war eine Frage. Die meisten danach auch."
  },
  {
    date: "2026-04-09",
    title: "Frühling",
    text: "Der Flieder blüht wieder in der Straße, in der ich nicht mehr wohne. Ich fahre trotzdem hin."
  },
  {
    date: "2026-02-18",
    title: null,
    text: "Man wird nicht älter an Geburtstagen. Man wird älter an den Tagen dazwischen, an denen niemand hinsieht."
  },
  {
    date: "2026-01-31",
    title: "Jahresende",
    text: "Ich habe die Vorsätze von letztem Jahr wiedergefunden. Sie waren gut. Sie sind es immer noch."
  },
  {
    date: "2026-01-14",
    title: null,
    text: "Januar ist ein Monat, der so tut, als wäre er ein Anfang. Dabei ist er nur der Dezember mit besserer Presse."
  },

  /* ── 2025 ─────────────────────────────────────── */
  {
    date: "2025-12-24",
    title: "Heiligabend",
    text: "Am Tisch sitzen dieselben Leute wie vor zehn Jahren, nur leiser. Das nennt man wohl Familie."
  },
  {
    date: "2025-11-30",
    title: null,
    text: "Ich mag Menschen, die zugeben, dass sie etwas nicht wissen. Es sind erstaunlich wenige."
  },
  {
    date: "2025-11-08",
    title: "Regen",
    text: "Regen macht die Stadt ehrlich. Alle haben es plötzlich eilig, und keiner tut mehr so, als wäre er gelassen."
  },
  {
    date: "2025-10-19",
    title: null,
    text: "Ein Gespräch ist kein Wettbewerb, aber die meisten führen es so. Ich auch, wenn ich nicht aufpasse."
  },
  {
    date: "2025-09-27",
    title: "Umzug",
    text: "Alles, was ich besitze, passt in neun Kisten. Acht davon habe ich seit dem letzten Umzug nicht geöffnet."
  },
  {
    date: "2025-09-03",
    title: null,
    text: "Manche Entscheidungen trifft man nicht. Man wartet nur so lange, bis sich eine Möglichkeit von selbst schließt."
  },
  {
    date: "2025-07-22",
    title: "Urlaub",
    text: "Ich bin zweitausend Kilometer gefahren, um festzustellen, dass ich mich mitgenommen habe."
  },
  {
    date: "2025-06-11",
    title: null,
    text: "Es gibt einen Unterschied zwischen <em>allein</em> und <em>einsam</em>. Ich brauche ungefähr fünfundzwanzig Jahre, um ihn zu erklären."
  },
  {
    date: "2025-04-30",
    title: "Nachts",
    text: "Um drei Uhr morgens hat jedes Problem die Größe eines Kontinents. Um neun ist es wieder eine Insel."
  },
  {
    date: "2025-02-20",
    title: null,
    text: "Ich habe versucht, weniger zu erklären und mehr zu zeigen. Es funktioniert. Es dauert nur länger."
  },
  {
    date: "2025-01-25",
    title: "Vorsatz",
    text: "Mein einziger Vorsatz: öfter zurückrufen. Es klingt klein. Es ist es nicht."
  },
  {
    date: "2025-01-06",
    title: null,
    text: "Die Wohnung ist nach den Feiertagen zu still. Ich lasse den Wasserkocher laufen, nur wegen des Geräuschs."
  },

  /* ── 2024 ─────────────────────────────────────── */
  {
    date: "2024-12-08",
    title: "Dezember",
    text: "Im Dezember tun alle so, als hätten sie das Jahr im Griff gehabt. Ich auch. Es ist eine schöne Übung."
  },
  {
    date: "2024-11-16",
    title: null,
    text: "Man erkennt gute Freunde daran, dass Schweigen zwischen euch nicht erklärt werden muss."
  },
  {
    date: "2024-10-29",
    title: "Kaffee",
    text: "Der beste Kaffee ist der zweite. Der erste ist Notwendigkeit, der dritte Verzweiflung."
  },
  {
    date: "2024-10-02",
    title: null,
    text: "Ich habe heute jemandem geglaubt, obwohl es unbequem war. Das ist vermutlich das Erwachsenste, was ich diese Woche getan habe."
  },
  {
    date: "2024-08-24",
    title: "Bahnhof",
    text: "Bahnhöfe sind die einzigen Orte, an denen Weinen niemanden beunruhigt. Vielleicht sollte es mehr Bahnhöfe geben."
  },
  {
    date: "2024-07-18",
    title: null,
    text: "Wir sagen <em>kein Problem</em> und meinen fast immer das Gegenteil. Höflichkeit ist ein sehr präzises Missverständnis."
  },
  {
    date: "2024-06-05",
    title: "Vierundzwanzig",
    text: "Ich bin jetzt genau doppelt so alt wie damals, als ich alles zu wissen glaubte. Ich weiß ungefähr halb so viel."
  },
  {
    date: "2024-05-14",
    title: null,
    text: "Es gibt Tage, die nur dazu da sind, zwischen zwei anderen zu liegen. Auch die zählen."
  },
  {
    date: "2024-04-02",
    title: "Kontrolle",
    text: "Ich plane, damit ich nicht denken muss. Manchmal ist ein Kalender nur ein sehr ordentliches Versteck."
  },
  {
    date: "2024-02-27",
    title: null,
    text: "Der Februar ist zu kurz für alles, was man sich für ihn vorgenommen hat. Das ist kein Fehler, das ist Fürsorge."
  },
  {
    date: "2024-01-19",
    title: "Winter",
    text: "Der Schnee bleibt nicht mehr liegen wie früher. Ich weiß nicht, ob das an der Stadt liegt oder an mir."
  },

  /* ── 2023 ─────────────────────────────────────── */
  {
    date: "2023-12-31",
    title: null,
    text: "Ein Jahr endet nicht um Mitternacht. Es hört irgendwann im November leise auf, und der Rest ist Formalität."
  },
  {
    date: "2023-12-03",
    title: "Erster Advent",
    text: "Vier Kerzen sind eine gute Erfindung. Sie geben dem Warten eine Zahl."
  },
  {
    date: "2023-11-11",
    title: null,
    text: "Ich habe angefangen, Bücher nicht zu Ende zu lesen. Es hat mein Verhältnis zu Büchern gerettet."
  },
  {
    date: "2023-10-08",
    title: "Herbst",
    text: "Der Herbst räumt auf, ohne zu fragen. Ich beneide ihn um diese Klarheit."
  },
  {
    date: "2023-09-14",
    title: null,
    text: "Man kann sich in einer Stadt verlaufen oder in einem Gespräch. Nur bei einem davon hilft ein Plan."
  },
  {
    date: "2023-08-20",
    title: "Sonntag",
    text: "Sonntagnachmittage sind der Beweis, dass Zeit kein gleichmäßiges Material ist."
  },
  {
    date: "2023-07-07",
    title: null,
    text: "Ich vermisse Menschen selten in der Reihenfolge, in der ich sie verloren habe."
  },
  {
    date: "2023-06-02",
    title: "Meinung",
    text: "Ich habe meine Meinung geändert und mich dafür entschuldigt. Das war der Fehler — nicht die Änderung."
  },
  {
    date: "2023-05-09",
    title: null,
    text: "Wer immer beschäftigt ist, muss sich nie fragen, ob er das Richtige tut. Ich verstehe die Versuchung sehr gut."
  },
  {
    date: "2023-04-11",
    title: "Nachbarn",
    text: "Ich kenne den Klang der Schritte über mir besser als das Gesicht dazu. Städte sind komische Verwandtschaften."
  },
  {
    date: "2023-02-22",
    title: null,
    text: "Man wird nicht dadurch erwachsen, dass man Antworten hat, sondern dadurch, dass man Fragen aushält."
  },
  {
    date: "2023-01-17",
    title: "Neujahr",
    text: "Die ersten Wochen im Jahr fühlen sich an wie fremde Schuhe. Man läuft sie ein oder gibt auf."
  },

  /* ── 2022 ─────────────────────────────────────── */
  {
    date: "2022-12-19",
    title: null,
    text: "Ich habe eine Liste mit Dingen, die ich später sagen wollte. Die Liste wird länger, das Später kürzer."
  },
  {
    date: "2022-11-25",
    title: "Grenzen",
    text: "Ich habe gelernt, Nein zu sagen. Es hat drei Jahre gedauert und zwei Freundschaften gekostet, die keine waren."
  },
  {
    date: "2022-10-30",
    title: null,
    text: "Es ist erstaunlich, wie viel Platz in einem Kopf ist, wenn man aufhört, Gespräche zu wiederholen, die nie stattgefunden haben."
  },
  {
    date: "2022-09-21",
    title: "Bibliothek",
    text: "Man lernt in der Bibliothek weniger über das Fach als über sich. Beides steht in keiner Prüfungsordnung."
  },
  {
    date: "2022-08-13",
    title: null,
    text: "Der Sommer, an den man sich später erinnert, ist nie der, den man geplant hat."
  },
  {
    date: "2022-07-04",
    title: "Geld",
    text: "Man merkt erst, dass Geld Zeit ist, wenn man beides gleichzeitig nicht hat."
  },
  {
    date: "2022-06-16",
    title: null,
    text: "Ich habe heute jemandem beim Nachdenken zugesehen. Es ist erstaunlich, wie sichtbar das ist, wenn man einmal darauf achtet."
  },
  {
    date: "2022-05-05",
    title: "Umzugskisten",
    text: "Zweiundzwanzig Jahre passen in ein Auto. Das ist entweder befreiend oder erschreckend, je nach Tageszeit."
  },
  {
    date: "2022-04-08",
    title: null,
    text: "Man kann nicht gleichzeitig sicher und neugierig sein. Ich versuche es trotzdem jeden Tag."
  },
  {
    date: "2022-03-15",
    title: "Nachrichten",
    text: "Ich lese Nachrichten und fühle mich informiert. <strong>Informiert</strong> ist nicht dasselbe wie hilfreich. Das habe ich zu spät gemerkt."
  },
  {
    date: "2022-02-14",
    title: null,
    text: "Zuneigung an einem festgelegten Tag ist wie ein Gedanke auf Bestellung: möglich, aber selten der beste."
  },
  {
    date: "2022-01-09",
    title: "Anfang, wieder",
    text: "Jeder Januar tut so, als wäre er der erste. Ich lasse ihm das."
  },

  /* ── 2021 ─────────────────────────────────────── */
  {
    date: "2021-12-11",
    title: null,
    text: "Es gibt Lieder, die man nicht mehr hören kann, weil sie zu einer bestimmten Person gehören. Ich habe eine Playlist davon. Ich spiele sie nie."
  },
  {
    date: "2021-11-19",
    title: "Novemberlicht",
    text: "Um halb fünf ist es dunkel, und die ganze Stadt tut so, als wäre nichts passiert."
  },
  {
    date: "2021-10-24",
    title: null,
    text: "Ich habe aufgehört, alles zu dokumentieren. Seitdem erinnere ich mich besser. Ich weiß nicht, ob das zusammenhängt."
  },
  {
    date: "2021-09-30",
    title: "Zuhause",
    text: "Zuhause ist der Ort, an dem man das Licht nicht suchen muss."
  },
  {
    date: "2021-08-17",
    title: null,
    text: "Manche Menschen hören zu, um zu antworten. Manche hören zu, um zu verstehen. Man erkennt es an der Pause davor."
  },
  {
    date: "2021-07-23",
    title: "Freibad",
    text: "Im Freibad sind alle gleich unbeholfen. Es ist der demokratischste Ort, den ich kenne."
  },
  {
    date: "2021-06-13",
    title: null,
    text: "Ich glaube, man verzeiht nicht auf einmal. Man verzeiht in sehr kleinen Raten, meistens ohne es zu bemerken."
  },
  {
    date: "2021-05-18",
    title: "Warten",
    text: "Warten ist keine verlorene Zeit. Es ist nur Zeit, die man nicht abrechnen kann."
  },
  {
    date: "2021-04-27",
    title: null,
    text: "Der Unterschied zwischen einem Gedanken und einer Meinung ist ungefähr eine Nacht Schlaf."
  },
  {
    date: "2021-03-21",
    title: "Ein Jahr",
    text: "Dieses Ding hier ist ein Jahr alt. Ich hatte nicht damit gerechnet, dass ich etwas so lange durchhalte, das niemand von mir verlangt."
  },
  {
    date: "2021-02-09",
    title: null,
    text: "Geburtstage sind Stichproben. Man prüft, ob man noch derselbe ist, und ist erleichtert, wenn nicht ganz."
  },
  {
    date: "2021-01-28",
    title: "Stillstand",
    text: "Es gibt eine Sorte Müdigkeit, die vom Nichtstun kommt. Sie ist schlimmer als die andere."
  },
  {
    date: "2021-01-05",
    title: null,
    text: "Ich habe Fotos vom letzten Sommer angesehen. Wir wussten damals nicht, wie gut es uns ging. Das ist vermutlich die Definition von <em>gut</em>."
  },

  /* ── 2020 ─────────────────────────────────────── */
  {
    date: "2020-12-13",
    title: "Dezemberabend",
    text: "Kerzen sind der einzige Grund, warum ich den Winter aushalte. Das ist keine Metapher."
  },
  {
    date: "2020-11-07",
    title: null,
    text: "Man kann eine Freundschaft nicht am Leben halten, indem man beide Enden gleichzeitig festhält."
  },
  {
    date: "2020-10-11",
    title: "Heizung",
    text: "Der erste Tag, an dem man die Heizung anmacht, ist der eigentliche Jahreswechsel."
  },
  {
    date: "2020-09-06",
    title: null,
    text: "Ich habe versucht, jemandem zu erklären, warum ich das hier schreibe. Es ist mir nicht gelungen. Ich schreibe trotzdem weiter."
  },
  {
    date: "2020-08-19",
    title: "August",
    text: "Der August ist der Sonntag unter den Monaten: schön, und man weiß die ganze Zeit, was danach kommt."
  },
  {
    date: "2020-07-02",
    title: null,
    text: "Zwei Menschen können dieselbe Erinnerung haben und trotzdem nicht dasselbe erlebt haben."
  },
  {
    date: "2020-06-18",
    title: null,
    text: "Manchmal frage ich mich, ob Stille auch eine Form von Lärm ist — nur einer, den man erst hören lernen muss."
  },
  {
    date: "2020-06-17",
    title: "Gewohnheit",
    text: "Wir nennen es Routine, weil uns das Wort <em>Betäubung</em> zu ehrlich erscheint."
  },
  {
    date: "2020-06-15",
    title: null,
    text: "Es gibt Menschen, die einen Raum betreten und ihn sofort kleiner machen. Und solche, die ihn aufmachen, ohne etwas zu sagen."
  },
  {
    date: "2020-06-12",
    title: "Über Erwartungen",
    text: "Jede Enttäuschung ist eine versteckte Erwartung, die man vergessen hatte aufzuschreiben."
  },
  {
    date: "2020-06-09",
    title: null,
    text: "Das Internet hat uns beigebracht, dass jeder Gedanke sofort geteilt werden muss. Ich versuche, einige für mich zu behalten. Auch wenn es schwerer wird."
  },
  {
    date: "2020-06-05",
    title: "Zeitgefühl",
    text: "Die Woche hatte vier Montage. Den Freitag habe ich irgendwo zwischen zwei Meetings verloren."
  },
  {
    date: "2020-06-01",
    title: null,
    text: "Jemand hat mir gesagt, ich denke zu viel nach. Seitdem denke ich darüber nach."
  },
  {
    date: "2020-05-28",
    title: "Stadtleben",
    text: "In der U-Bahn tragen alle Kopfhörer. Wir sind zusammen allein und keiner stört sich daran. Das ist entweder Zivilisation oder ihr Gegenteil."
  },
  {
    date: "2020-05-22",
    title: null,
    text: "Es ist merkwürdig, wie ein Song von vor zehn Jahren mehr über dich weiß als du selbst."
  },
  {
    date: "2020-05-18",
    title: "Frage ohne Antwort",
    text: "Was macht man mit einer Erinnerung, die man nicht loswerden will, obwohl man weiß, dass sie schadet?"
  },
  {
    date: "2020-05-14",
    title: null,
    text: "Ich habe aufgehört, Pläne für mehr als drei Tage im Voraus zu machen. Seitdem überrascht mich das Leben öfter — meistens angenehm."
  },
  {
    date: "2020-05-09",
    title: "Qualität",
    text: "Gut genug ist der Feind des Fertig. Aber manchmal ist Fertig auch der Feind des Gut."
  },
  {
    date: "2020-05-04",
    title: null,
    text: "Ich lese Briefe, die ich nie abgeschickt habe. Sie sind ehrlicher als alles, was ich je gesagt habe."
  },
  {
    date: "2020-04-29",
    title: "Nachmittag",
    text: "Das Licht um vier Uhr nachmittags im April ist das beste Licht des Jahres. Ich weiß nicht warum. Ich akzeptiere es."
  },
  {
    date: "2020-04-23",
    title: null,
    text: "Manchmal ist die mutigste Handlung, einfach nichts zu tun und zu warten, bis sich die Dinge selbst klären."
  },
  {
    date: "2020-04-17",
    title: "Sprache",
    text: "Es gibt Dinge, für die mir das Deutsche kein Wort gibt. Das macht sie nicht weniger real — nur schwerer zu teilen."
  },
  {
    date: "2020-04-10",
    title: null,
    text: "Ich habe heute jemanden getroffen, den ich vor Jahren kannte. Wir haben getan, als wären wir noch dieselben. Es war höflich und ein bisschen traurig."
  },
  {
    date: "2020-04-03",
    title: "Beobachtung",
    text: "Tauben wissen genau, wann die Ampel auf Grün schaltet. Vielleicht beobachten sie uns schon länger, als wir denken."
  },
  {
    date: "2020-03-27",
    title: null,
    text: "Man kann einer Person nicht erklären, wie sie sich anfühlt. Man kann nur hoffen, dass sie es irgendwann selbst merkt."
  },
  {
    date: "2020-03-20",
    title: "Anfang",
    text: "Dies ist Eintrag Nummer Eins. Ich weiß noch nicht, was das hier werden soll. Das ist wahrscheinlich der beste Grund, es trotzdem zu beginnen."
  }
];