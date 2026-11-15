/* ------------------------------------------------------------------
   ΜΗΧΑΝΗ ΚΑΝΟΝΩΝ ΚΟΠΗΣ
   Όλοι οι τύποι από το kanones-kopis.md (ερωτηματολόγιο 15/11/2026).
   Καμία σύνδεση στο ίντερνετ, κανένα AI: σταθεροί τύποι.
   Ίδια μέτρα μέσα = πάντα ίδια λίστα έξω.
   ------------------------------------------------------------------ */
(function (root) {
  'use strict';

  /* ---------- ΣΤΑΘΕΡΕΣ (αλλάζουν από τις Ρυθμίσεις) ---------- */
  var PROEPILOGES = {
    // πάχη
    T:                1.8,   // πάχος κουτιού (μελαμίνη)
    PLATI_T:          0.8,   // πάχος πλάτης
    GKINISIA_BATHOS:  0.8,   // βάθος γκινισιάς πλάτης (κουζίνα)
    GKINISIA_MESA:    1.0,   // πόσο μέσα από την πίσω άκρη
    PORTA_T:          1.8,   // πάχος πόρτας (ακρυλικό)

    // πόρτες
    KENO_AKRO:        0.15,  // κενό στις έξω άκρες
    KENO_MESA:        0.3,   // κενό ανάμεσα σε δύο πόρτες
    DYO_PORTES_ANO:   60,    // δύο πόρτες όταν το πλάτος είναι πάνω από

    // κουζίνα - κοινά
    TRAVERSA_PLATOS:  12,
    RAFI_KENO:        0.1,   // το ράφι 1 χιλ. στενότερο
    RAFI_MEION_BATHOS: 2.8,  // βάθος ραφιού = βάθος - 2,8

    // κάτω ντουλάπι
    KATO_YPSOS:       76,
    KATO_BATHOS:      56,
    KATO_RAFIA:       1,
    KATO_PODIA:       10,
    KATO_PAGKOS:      4,

    // συρτάρια (Blum TANDEMBOX)
    SYRT_ARITHMOS:    4,
    SYRT_T:           1.6,
    SYRT_ODIGOS:      50,
    SYRT_PISO_YPSOS:  11.6,
    SYRT_PATOS_MEION_MIKOS: 2.4,
    SYRT_PATOS_MEION_ES:    7.5,
    SYRT_PISO_MEION_ES:     8.7,

    // πάνω ντουλάπι
    PANO_YPSOS:       80,
    PANO_BATHOS:      35,
    PANO_RAFIA:       2,
    PANO_KREMASMA:    150,   // μόνο για το σχέδιο: ύψος από το πάτωμα

    // ντουλάπα ρούχων
    NT_BATHOS:        60,
    NT_PODIA:         10,
    NT_KATO_TAVANI:   3,
    NT_MAX_TMIMA:     100,
    NT_RAFIA_TMIMA:   1,
    NT_PLATI_MEION:   0.1,
    NT_BATHOS_MEION:  1,
    NT_SYR_MEION_YPSOS: 4,
    NT_SYR_EPIKALYPSI:  1,

    // μπάνιο
    BANIO_YPSOS:      55,
    BANIO_BATHOS:     40,
    BANIO_RAFIA:      1,

    // φύλλο (πληροφοριακά)
    FYLLO_MIKOS:      366,
    FYLLO_PLATOS:     183,
    PRIONI:           0.3,

    // ονόματα υλικών
    YL_KOUTI:       'Μελαμίνη 1,8',
    YL_PLATI:       'Μελαμίνη 0,8',
    YL_SYRTARI:     'Μελαμίνη 1,6',
    YL_PORTA:       'Ακρυλικό 1,8',
    YL_BANIO:       'Κόντρα πλακέ θαλάσσης 1,8',
    YL_BANIO_PLATI: 'Κόντρα πλακέ θαλάσσης 0,8'
  };

  var SEIRA_YLIKON = ['YL_KOUTI', 'YL_PLATI', 'YL_SYRTARI', 'YL_PORTA', 'YL_BANIO', 'YL_BANIO_PLATI'];

  /* ---------- βοηθητικά ---------- */

  // στρογγύλεμα στο ένα δεκαδικό (σταθερό, χωρίς εκπλήξεις από τα δεκαδικά)
  function r1(x) {
    return Math.round(x * 10 + (x >= 0 ? 1e-9 : -1e-9)) / 10;
  }

  // 74.2 -> "74,2"  /  56 -> "56"
  function nou(x) {
    var v = r1(x);
    var s = (Math.abs(v * 10 % 10) < 1e-9) ? String(Math.round(v)) : v.toFixed(1);
    return s.replace('.', ',');
  }

  // δέχεται και κόμμα και τελεία
  function arithmos(txt) {
    if (typeof txt === 'number') return txt;
    if (txt === null || txt === undefined) return NaN;
    var s = String(txt).trim().replace(',', '.').replace(/[^0-9.\-]/g, '');
    if (s === '' || s === '-' || s === '.') return NaN;
    return parseFloat(s);
  }

  function rythmiseis(r) {
    var s = {}, k;
    for (k in PROEPILOGES) if (PROEPILOGES.hasOwnProperty(k)) s[k] = PROEPILOGES[k];
    if (r) for (k in r) if (r.hasOwnProperty(k) && s.hasOwnProperty(k)) s[k] = r[k];
    return s;
  }

  // ελληνικά κεφαλαία ΧΩΡΙΣ τόνους (ΜΕΛΑΜΙΝΗ, όχι ΜΕΛΑΜΊΝΗ)
  var TONOI = { 'ά':'Α','έ':'Ε','ή':'Η','ί':'Ι','ό':'Ο','ύ':'Υ','ώ':'Ω',
                'ΐ':'Ϊ','ΰ':'Ϋ','ϊ':'Ϊ','ϋ':'Ϋ','ς':'Σ',
                'Ά':'Α','Έ':'Ε','Ή':'Η','Ί':'Ι','Ό':'Ο','Ύ':'Υ','Ώ':'Ω','Ϊ':'Ϊ','Ϋ':'Ϋ' };
  function kefalaia(t) {
    return String(t).replace(/[\s\S]/g, function (x) {
      return TONOI[x] || x;
    }).toUpperCase().replace(/[\s\S]/g, function (x) { return TONOI[x] || x; });
  }

  function kom(onoma, yliko, a, b, temahia, omada) {
    return { onoma: onoma, yliko: yliko, a: r1(a), b: r1(b), temahia: temahia, omada: omada || 'kouti' };
  }

  // εσωτερικό πλάτος
  function esoteriko(platos, s) { return platos - 2 * s.T; }

  /* ---------- πόρτες ---------- */

  // πόσες πόρτες θέλει ένα πλάτος
  function arithmosPorton(platos, s) {
    return platos > s.DYO_PORTES_ANO ? 2 : 1;
  }

  // διάσταση πόρτας: κενό 0,15 στις έξω άκρες, 0,3 ανάμεσα
  function porta(platos, ypsos, n, s) {
    var kathares = platos - 2 * s.KENO_AKRO - s.KENO_MESA * (n - 1);
    return { n: n, platos: kathares / n, ypsos: ypsos - 2 * s.KENO_AKRO };
  }

  /* ---------- ΚΑΤΩ ΝΤΟΥΛΑΠΙ ΚΟΥΖΙΝΑΣ ---------- */
  function kato(k, s) {
    var W = k.platos, H = k.ypsos, D = k.bathos, es = esoteriko(W, s);
    var p = [];
    p.push(kom('Πάτος',     s.YL_KOUTI, W, D, 1));
    p.push(kom('Πλαϊνά',    s.YL_KOUTI, H - s.T, D, 2));
    p.push(kom('Τραβέρσες', s.YL_KOUTI, es, s.TRAVERSA_PLATOS, 2));
    p.push(kom('Πλάτη',     s.YL_PLATI, es + 2 * s.GKINISIA_BATHOS, H - s.T, 1, 'plati'));
    if (k.rafia > 0) {
      p.push(kom('Ράφια', s.YL_KOUTI, es - s.RAFI_KENO, D - s.RAFI_MEION_BATHOS, k.rafia));
    }
    var n = k.portes > 0 ? k.portes : 0;
    if (n > 0) {
      var pr = porta(W, H, n, s);
      p.push(kom(n > 1 ? 'Πόρτες' : 'Πόρτα', s.YL_PORTA, pr.ypsos, pr.platos, n, 'porta'));
    }
    return p;
  }

  /* ---------- ΣΥΡΤΑΡΙΕΡΑ ---------- */
  /* Το κουτί είναι κάτω ντουλάπι (χωρίς ράφια, χωρίς πόρτα)
     και από πάνω μπαίνουν τα κομμάτια των συρταριών. */
  function syrtariera(k, s) {
    var W = k.platos, H = k.ypsos, D = k.bathos, es = esoteriko(W, s);
    var n = k.syrtaria > 0 ? k.syrtaria : s.SYRT_ARITHMOS;
    var p = kato({ platos: W, ypsos: H, bathos: D, rafia: 0, portes: 0 }, s);
    p.push(kom('Μέτωπα',            s.YL_PORTA,   (H - n * s.KENO_MESA) / n, W - 2 * s.KENO_AKRO, n, 'porta'));
    p.push(kom('Πάτοι συρταριών',   s.YL_SYRTARI, s.SYRT_ODIGOS - s.SYRT_PATOS_MEION_MIKOS, es - s.SYRT_PATOS_MEION_ES, n, 'syrtari'));
    p.push(kom('Πίσω συρταριών',    s.YL_SYRTARI, s.SYRT_PISO_YPSOS, es - s.SYRT_PISO_MEION_ES, n, 'syrtari'));
    return p;
  }

  /* ---------- ΠΑΝΩ ΝΤΟΥΛΑΠΙ ΚΟΥΖΙΝΑΣ ---------- */
  function pano(k, s, ylKouti, ylPlati) {
    var W = k.platos, H = k.ypsos, D = k.bathos, es = esoteriko(W, s);
    var YK = ylKouti || s.YL_KOUTI, YP = ylPlati || s.YL_PLATI;
    var p = [];
    p.push(kom('Πάτος και καπάκι', YK, W, D, 2));
    p.push(kom('Πλαϊνά',           YK, H - 2 * s.T, D, 2));
    p.push(kom('Πλάτη',            YP, es + 2 * s.GKINISIA_BATHOS, H - 2 * s.T, 1, 'plati'));
    if (k.rafia > 0) {
      p.push(kom('Ράφια', YK, es - s.RAFI_KENO, D - s.RAFI_MEION_BATHOS, k.rafia));
    }
    var n = k.portes > 0 ? k.portes : 0;
    if (n > 0) {
      var pr = porta(W, H, n, s);
      p.push(kom(n > 1 ? 'Πόρτες' : 'Πόρτα', s.YL_PORTA, pr.ypsos, pr.platos, n, 'porta'));
    }
    return p;
  }

  /* ---------- ΜΠΑΝΙΟ (κανόνες πάνω ντουλαπιού, κόντρα πλακέ θαλάσσης) ---------- */
  function banio(k, s) {
    return pano(k, s, s.YL_BANIO, s.YL_BANIO_PLATI);
  }

  /* ---------- ΝΤΟΥΛΑΠΑ ΡΟΥΧΩΝ ---------- */

  // πόσα τμήματα θέλει ένα συνολικό πλάτος (κάθε τμήμα έως NT_MAX_TMIMA)
  function tmimata(platosSynolo, s) {
    var n = 1;
    while (n < 40) {
      var esTm = (platosSynolo - 2 * s.T - (n - 1) * s.T) / n;
      if (esTm <= s.NT_MAX_TMIMA) return { n: n, esoterikoTmimatos: esTm };
      n++;
    }
    return { n: n, esoterikoTmimatos: (platosSynolo - 2 * s.T - (n - 1) * s.T) / n };
  }

  function ypsosNtoulapas(ypsosTavaniou, s) {
    return ypsosTavaniou - s.NT_PODIA - s.NT_KATO_TAVANI;
  }

  function ntoulapa(k, s) {
    var W = k.platos, D = k.bathos;
    var H = k.ypsos;                       // ύψος κουτιού (υπολογισμένο από το ταβάνι)
    var tm = tmimata(W, s);
    var n = tm.n, esTm = tm.esoterikoTmimatos;
    var p = [];
    p.push(kom('Πάτος και καπάκι', s.YL_KOUTI, W, D, 2));
    p.push(kom('Πλαϊνά',           s.YL_KOUTI, H - 2 * s.T, D, 2));
    if (n > 1) {
      p.push(kom('Χωρίσματα', s.YL_KOUTI, H - 2 * s.T, D - s.NT_BATHOS_MEION, n - 1));
    }
    p.push(kom('Πλάτη', s.YL_PLATI, H - s.NT_PLATI_MEION, W - s.NT_PLATI_MEION, 1, 'plati'));
    var rafia = (k.rafia === undefined ? s.NT_RAFIA_TMIMA : k.rafia);
    if (rafia > 0) {
      p.push(kom('Ράφια', s.YL_KOUTI, esTm - s.RAFI_KENO, D - s.NT_BATHOS_MEION, rafia * n));
    }
    if (k.eidosPortas === 'syromenes') {
      var ns = k.portes > 0 ? k.portes : Math.max(2, n);
      p.push(kom('Συρόμενες πόρτες', s.YL_PORTA,
        H - s.NT_SYR_MEION_YPSOS,
        (W + s.NT_SYR_EPIKALYPSI * (ns - 1)) / ns, ns, 'porta'));
    } else {
      var na = k.portes > 0 ? k.portes : portesNtoulapas(W, n, s);
      var pr = porta(W, H, na, s);
      p.push(kom('Ανοιγόμενες πόρτες', s.YL_PORTA, pr.ypsos, pr.platos, na, 'porta'));
    }
    return p;
  }

  // ανοιγόμενες: κάθε τμήμα παίρνει 1 ή 2 πόρτες με τον κανόνα της κουζίνας
  function portesNtoulapas(W, n, s) {
    var platosTmimatos = W / n, syn = 0, i;
    for (i = 0; i < n; i++) syn += arithmosPorton(platosTmimatos, s);
    return syn;
  }

  /* ---------- ΤΥΠΟΙ ΚΟΥΤΙΩΝ ---------- */
  var TYPOI = {
    kato:       { onoma: 'Κάτω ντουλάπι',   f: kato },
    pano:       { onoma: 'Πάνω ντουλάπι',   f: function (k, s) { return pano(k, s); } },
    syrtariera: { onoma: 'Συρταριέρα',      f: syrtariera },
    ntoulapa:   { onoma: 'Ντουλάπα ρούχων', f: ntoulapa },
    banio:      { onoma: 'Μπάνιο',          f: banio }
  };

  // τα αυτόματα μέτρα ενός καινούργιου κουτιού
  function neoKouti(typos, platos, r, extra) {
    var s = rythmiseis(r);
    var k = { typos: typos, platos: r1(platos) };
    if (typos === 'kato' || typos === 'syrtariera') {
      k.ypsos = s.KATO_YPSOS; k.bathos = s.KATO_BATHOS;
      k.rafia = (typos === 'kato') ? s.KATO_RAFIA : 0;
      k.portes = (typos === 'kato') ? arithmosPorton(platos, s) : 0;
      if (typos === 'syrtariera') k.syrtaria = s.SYRT_ARITHMOS;
    } else if (typos === 'pano') {
      k.ypsos = s.PANO_YPSOS; k.bathos = s.PANO_BATHOS;
      k.rafia = s.PANO_RAFIA; k.portes = arithmosPorton(platos, s);
    } else if (typos === 'banio') {
      k.ypsos = s.BANIO_YPSOS; k.bathos = s.BANIO_BATHOS;
      k.rafia = s.BANIO_RAFIA; k.portes = arithmosPorton(platos, s);
    } else if (typos === 'ntoulapa') {
      k.ypsosTavaniou = r1((extra && extra.ypsosTavaniou) || 250);
      k.ypsos = r1(ypsosNtoulapas(k.ypsosTavaniou, s));
      k.bathos = s.NT_BATHOS;
      k.rafia = s.NT_RAFIA_TMIMA;
      k.eidosPortas = (extra && extra.eidosPortas) || 'anoigomenes';
      k.portes = 0; // 0 = αυτόματα
    }
    return k;
  }

  // αν αλλάξει το ύψος ταβανιού, ξαναβγάζει το ύψος κουτιού
  function ananeosiNtoulapas(k, r) {
    var s = rythmiseis(r);
    if (k.typos === 'ntoulapa' && k.ypsosTavaniou) k.ypsos = r1(ypsosNtoulapas(k.ypsosTavaniou, s));
    return k;
  }

  /* ---------- κομμάτια ενός κουτιού ---------- */
  function kommatia(k, r) {
    var s = rythmiseis(r);
    var t = TYPOI[k.typos];
    if (!t) return [];
    return t.f(k, s);
  }

  function titlos(k, r) {
    var t = TYPOI[k.typos];
    var onoma = t ? t.onoma : k.typos;
    if (k.typos === 'ntoulapa') {
      var tm = tmimata(k.platos, rythmiseis(r));
      return onoma + ' ' + nou(k.platos) + ' εκ. (' + tm.n + ' τμήματα, ' +
        (k.eidosPortas === 'syromenes' ? 'συρόμενες' : 'ανοιγόμενες') + ')';
    }
    return onoma + ' ' + nou(k.platos) + ' εκ.';
  }

  /* ---------- ΛΙΣΤΑ ΚΟΠΗΣ: ανά υλικό, ίδια κομμάτια ενωμένα ---------- */
  function listaKopis(koutia, r) {
    var s = rythmiseis(r);
    var omades = {}, i, j;
    for (i = 0; i < koutia.length; i++) {
      var p = kommatia(koutia[i], r);
      for (j = 0; j < p.length; j++) {
        var x = p[j];
        var kleidi = x.yliko + '|' + x.a.toFixed(1) + '|' + x.b.toFixed(1);
        if (!omades[kleidi]) {
          omades[kleidi] = { yliko: x.yliko, a: x.a, b: x.b, temahia: 0, onomata: [] };
        }
        omades[kleidi].temahia += x.temahia;
        if (omades[kleidi].onomata.indexOf(x.onoma) < 0) omades[kleidi].onomata.push(x.onoma);
      }
    }
    // ομαδοποίηση ανά υλικό, με σταθερή σειρά
    var seira = [], k;
    for (i = 0; i < SEIRA_YLIKON.length; i++) {
      var on = s[SEIRA_YLIKON[i]];
      if (seira.indexOf(on) < 0) seira.push(on);
    }
    var anaYliko = {};
    for (k in omades) if (omades.hasOwnProperty(k)) {
      var g = omades[k];
      if (!anaYliko[g.yliko]) anaYliko[g.yliko] = [];
      anaYliko[g.yliko].push(g);
    }
    var apotelesma = [];
    for (i = 0; i < seira.length; i++) {
      var yl = seira[i];
      if (!anaYliko[yl]) continue;
      anaYliko[yl].sort(function (x, y) { return (y.a - x.a) || (y.b - x.b); });
      apotelesma.push({ yliko: yl, kommatia: anaYliko[yl] });
      delete anaYliko[yl];
    }
    for (k in anaYliko) if (anaYliko.hasOwnProperty(k)) {
      anaYliko[k].sort(function (x, y) { return (y.a - x.a) || (y.b - x.b); });
      apotelesma.push({ yliko: k, kommatia: anaYliko[k] });
    }
    return apotelesma;
  }

  // «74,2 × 56 = 2»
  function grammi(g) {
    return nou(g.a) + ' × ' + nou(g.b) + ' = ' + g.temahia;
  }

  // κείμενο για Viber / WhatsApp / εκτύπωση
  function keimeno(douleia, r) {
    var l = listaKopis(douleia.koutia, r), i, j, out = [];
    out.push('ΛΙΣΤΑ ΚΟΠΗΣ' + (douleia.onoma ? ' - ' + douleia.onoma : ''));
    out.push(douleia.imerominia || '');
    out.push('');
    for (i = 0; i < douleia.koutia.length; i++) out.push('- ' + titlos(douleia.koutia[i], r));
    out.push('');
    for (i = 0; i < l.length; i++) {
      out.push(kefalaia(l[i].yliko));
      for (j = 0; j < l[i].kommatia.length; j++) {
        var g = l[i].kommatia[j];
        out.push('  ' + grammi(g) + '   (' + g.onomata.join(', ') + ')');
      }
      out.push('');
    }
    out.push('Ολα σε εκατοστα. Πρωτα το υψος (κατα τα νερα).');
    return out.join('\n');
  }

  var API = {
    PROEPILOGES: PROEPILOGES,
    TYPOI: TYPOI,
    r1: r1, nou: nou, arithmos: arithmos,
    rythmiseis: rythmiseis,
    esoteriko: esoteriko,
    arithmosPorton: arithmosPorton,
    porta: porta,
    tmimata: tmimata,
    ypsosNtoulapas: ypsosNtoulapas,
    neoKouti: neoKouti,
    ananeosiNtoulapas: ananeosiNtoulapas,
    kommatia: kommatia,
    titlos: titlos,
    listaKopis: listaKopis,
    grammi: grammi,
    kefalaia: kefalaia,
    keimeno: keimeno
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else root.KANONES = API;
})(typeof self !== 'undefined' ? self : this);
