/* ------------------------------------------------------------------
   ΑΥΤΟΜΑΤΟΣ ΕΛΕΓΧΟΣ
   Ελέγχει ότι τα 3 παραδείγματα του kanones-kopis.md βγαίνουν
   ΑΚΡΙΒΩΣ ίδια από τη μηχανή κανόνων.
   Τρέξιμο:  node test.js
   ------------------------------------------------------------------ */
'use strict';
var K = require('./kanones.js');

var apotyxies = 0, elegxoi = 0;

function grammes(kommatia) {
  return kommatia.map(function (x) {
    return K.nou(x.a) + ' × ' + K.nou(x.b) + ' = ' + x.temahia;
  });
}

function sygkrisi(titlos, pira, perimena) {
  elegxoi++;
  var a = pira.slice().sort(), b = perimena.slice().sort();
  var ok = a.length === b.length && a.every(function (v, i) { return v === b[i]; });
  console.log('');
  console.log(ok ? '[OK]      ' + titlos : '[ΛΑΘΟΣ]   ' + titlos);
  console.log('  Αρχείο kanones-kopis.md : ' + perimena.join(' · '));
  console.log('  Η εφαρμογή βγάζει       : ' + pira.join(' · '));
  if (!ok) {
    apotyxies++;
    var leipoun = b.filter(function (v) { return a.indexOf(v) < 0; });
    var perissa = a.filter(function (v) { return b.indexOf(v) < 0; });
    if (leipoun.length) console.log('  ΛΕΙΠΟΥΝ : ' + leipoun.join(' · '));
    if (perissa.length) console.log('  ΠΕΡΙΣΣΑ : ' + perissa.join(' · '));
  }
  return ok;
}

console.log('==================================================================');
console.log(' ΕΛΕΓΧΟΣ ΜΕ ΤΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΤΟΥ kanones-kopis.md');
console.log('==================================================================');

/* ---------- 1. Κάτω ντουλάπι, πλάτος 60, 1 ράφι ----------
   πάτος 60 × 56 = 1 · πλαϊνά 74,2 × 56 = 2 · τραβέρσες 56,4 × 12 = 2 ·
   πλάτη 58 × 74,2 = 1 · ράφι 56,3 × 53,2 = 1 · πόρτα 75,7 × 59,7 = 1      */
var k1 = K.neoKouti('kato', 60);
var p1 = K.kommatia(k1);
sygkrisi('Κάτω ντουλάπι, πλάτος 60, 1 ράφι', grammes(p1), [
  '60 × 56 = 1',
  '74,2 × 56 = 2',
  '56,4 × 12 = 2',
  '58 × 74,2 = 1',
  '56,3 × 53,2 = 1',
  '75,7 × 59,7 = 1'
]);
// επιπλέον: να βγαίνει μόνη της 1 πόρτα στο 60 και 2 πόρτες πάνω από 60
elegxoi++;
if (k1.portes !== 1) { apotyxies++; console.log('[ΛΑΘΟΣ]   Στο πλάτος 60 πρέπει να βγάλει 1 πόρτα'); }
else console.log('\n[OK]      Στο πλάτος 60 βγάζει μόνη της 1 πόρτα');

/* ---------- 2. Συρταριέρα, πλάτος 60 ----------
   μέτωπα 18,7 × 59,7 = 4 · πάτοι 47,6 × 48,9 = 4 · πίσω 11,6 × 47,7 = 4   */
var k2 = K.neoKouti('syrtariera', 60);
var p2 = K.kommatia(k2);
var syrtaria = p2.filter(function (x) { return x.omada === 'syrtari' || x.onoma === 'Μέτωπα'; });
sygkrisi('Συρταριέρα, πλάτος 60 (κομμάτια συρταριών)', grammes(syrtaria), [
  '18,7 × 59,7 = 4',
  '47,6 × 48,9 = 4',
  '11,6 × 47,7 = 4'
]);

// Το κουτί της συρταριέρας: πρέπει να είναι ίδιο με το κάτω ντουλάπι
// χωρίς ράφι και χωρίς πόρτα (το αρχείο δίνει τη συρταριέρα ως υποπίνακα
// του κάτω ντουλαπιού, γι' αυτό το παράδειγμα δείχνει μόνο τα συρτάρια).
var koutiSyrt = grammes(p2.filter(function (x) { return x.omada === 'kouti' || x.omada === 'plati'; }));
sygkrisi('Συρταριέρα, πλάτος 60 (το κουτί = κάτω ντουλάπι χωρίς ράφι/πόρτα)', koutiSyrt, [
  '60 × 56 = 1',
  '74,2 × 56 = 2',
  '56,4 × 12 = 2',
  '58 × 74,2 = 1'
]);

/* ---------- 3. Πάνω ντουλάπι, πλάτος 80, 2 ράφια ----------
   πάτος+καπάκι 80 × 35 = 2 · πλαϊνά 76,4 × 35 = 2 · πλάτη 78 × 76,4 = 1 ·
   ράφια 76,3 × 32,2 = 2 · πόρτες 79,7 × 39,7 = 2                          */
var k3 = K.neoKouti('pano', 80);
var p3 = K.kommatia(k3);
sygkrisi('Πάνω ντουλάπι, πλάτος 80, 2 ράφια', grammes(p3), [
  '80 × 35 = 2',
  '76,4 × 35 = 2',
  '78 × 76,4 = 1',
  '76,3 × 32,2 = 2',
  '79,7 × 39,7 = 2'
]);
elegxoi++;
if (k3.portes !== 2) { apotyxies++; console.log('[ΛΑΘΟΣ]   Στο πλάτος 80 πρέπει να βγάλει 2 πόρτες'); }
else console.log('\n[OK]      Στο πλάτος 80 βγάζει μόνη της 2 πόρτες');

/* ---------- 4. Σταθερότητα: ίδια μέτρα = ίδια λίστα ---------- */
elegxoi++;
var a = K.keimeno({ koutia: [k1, k2, k3], imerominia: '15/11/2026', onoma: 'Ελεγχος' });
var b = K.keimeno({ koutia: [k1, k2, k3], imerominia: '15/11/2026', onoma: 'Ελεγχος' });
if (a !== b) { apotyxies++; console.log('\n[ΛΑΘΟΣ]   Η ίδια δουλειά έβγαλε δύο διαφορετικές λίστες'); }
else console.log('\n[OK]      Ίδια μέτρα μέσα = ίδια λίστα έξω (τρέξιμο δύο φορές)');

/* ---------- 5. Ένωση ίδιων κομματιών ---------- */
elegxoi++;
var l = K.listaKopis([K.neoKouti('kato', 60), K.neoKouti('kato', 60)]);
var plaina = null;
l.forEach(function (g) {
  g.kommatia.forEach(function (x) { if (K.nou(x.a) === '74,2' && K.nou(x.b) === '56') plaina = x; });
});
if (!plaina || plaina.temahia !== 4) {
  apotyxies++;
  console.log('\n[ΛΑΘΟΣ]   Δύο ίδια κάτω ντουλάπια 60: τα πλαϊνά πρέπει να ενωθούν σε 4');
} else {
  console.log('\n[OK]      Δύο ίδια κάτω ντουλάπια 60 -> πλαϊνά 74,2 × 56 = 4 (ενωμένα)');
}

/* ---------- 6. Ντουλάπα: αυτόματος χωρισμός σε τμήματα έως 100 ---------- */
elegxoi++;
var sfalma = '';
[[90, 1], [200, 2], [260, 3], [300, 3], [320, 4]].forEach(function (z) {
  var tm = K.tmimata(z[0], K.rythmiseis(null));
  if (tm.n !== z[1]) sfalma += ' πλάτος ' + z[0] + ' -> ' + tm.n + ' (περίμενα ' + z[1] + ')';
  if (tm.esoterikoTmimatos > 100.0001) sfalma += ' πλάτος ' + z[0] + ' -> τμήμα ' + K.nou(tm.esoterikoTmimatos) + ' > 100';
});
if (sfalma) { apotyxies++; console.log('\n[ΛΑΘΟΣ]   Χωρισμός ντουλάπας:' + sfalma); }
else console.log('\n[OK]      Ντουλάπα: χωρίζεται μόνη της σε τμήματα έως 100 εκ.');

/* ---------- 7. Ντουλάπα: ύψος κουτιού = ταβάνι - 13 ---------- */
elegxoi++;
var nt = K.neoKouti('ntoulapa', 240, null, { ypsosTavaniou: 270, eidosPortas: 'syromenes' });
if (nt.ypsos !== 257) { apotyxies++; console.log('\n[ΛΑΘΟΣ]   Ταβάνι 270 -> ύψος κουτιού ' + nt.ypsos + ' (περίμενα 257)'); }
else console.log('\n[OK]      Ταβάνι 270 -> ύψος κουτιού 257 (ταβάνι - 10 πόδια - 3)');

/* ---------- 8. Συρόμενες: 4 πιο κοντές, επικάλυψη 1 ---------- */
elegxoi++;
var psyr = K.kommatia(nt).filter(function (x) { return x.onoma === 'Συρόμενες πόρτες'; })[0];
// ύψος 257 - 4 = 253 · πλάτος (240 + 1 × (3-1)) / 3 = 80,7 (3 τμήματα στα 240)
var perimena8 = '253 × 80,7 = 3';
if (!psyr || K.grammi(psyr) !== perimena8) {
  apotyxies++;
  console.log('\n[ΛΑΘΟΣ]   Συρόμενες: ' + (psyr ? K.grammi(psyr) : 'καμία') + ' (περίμενα ' + perimena8 + ')');
} else {
  console.log('\n[OK]      Συρόμενες πόρτες 240/ταβάνι 270: ' + perimena8);
}

/* ---------- 9. Δέχεται κόμμα και τελεία ---------- */
elegxoi++;
if (K.arithmos('56,4') !== 56.4 || K.arithmos('56.4') !== 56.4) {
  apotyxies++; console.log('\n[ΛΑΘΟΣ]   Δεν δέχεται και κόμμα και τελεία');
} else {
  console.log('\n[OK]      Δέχεται «56,4» και «56.4» το ίδιο');
}

console.log('');
console.log('==================================================================');
if (apotyxies === 0) {
  console.log(' ΟΛΑ ΣΩΣΤΑ: ' + elegxoi + ' έλεγχοι, 0 λάθη.');
  console.log(' Τα 3 παραδείγματα του αρχείου βγαίνουν ΑΚΡΙΒΩΣ ίδια.');
} else {
  console.log(' ΠΡΟΣΟΧΗ: ' + apotyxies + ' λάθη σε ' + elegxoi + ' ελέγχους.');
}
console.log('==================================================================');
process.exit(apotyxies === 0 ? 0 : 1);
