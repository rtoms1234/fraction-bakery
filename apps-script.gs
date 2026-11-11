// Fraction Bakery home base
// Paste this whole file into Extensions > Apps Script of a blank Google Sheet,
// then Deploy > New deployment > Web app, "Execute as: Me", "Who has access: Anyone".
// The game POSTs one row per finished level and keeps each player's progress
// so stars and coins follow her name from device to device.

var SESSIONS = 'sessions';
var PROGRESS = 'progress';
var SESSION_HEADERS = ['time', 'ts', 'day', 'name', 'station', 'level', 'stars', 'first', 'total', 'coins', 'hints', 'shown', 'minutes', 'streak', 'missed'];
var PROGRESS_HEADERS = ['name', 'savedAt', 'updated', 'state'];

function doGet(e) {
  var p = (e && e.parameter) || {};
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (p.action === 'ping') return json({ ok: true, sheet: ss.getName() });
  if (p.action === 'progress') {
    var row = findProgress(ss, String(p.name || ''));
    if (!row) return json({ ok: true, state: null });
    var state = null;
    try { state = JSON.parse(row.state); } catch (err) { state = null; }
    return json({ ok: true, savedAt: row.savedAt, state: state });
  }
  return json({ ok: true, hint: 'Fraction Bakery home base is running.' });
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return json({ ok: false, error: 'bad json' }); }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (body.type === 'session') {
      var sh = sheet(ss, SESSIONS, SESSION_HEADERS, 0);
      sh.appendRow([
        new Date(Number(body.ts) || Date.now()), Number(body.ts) || Date.now(), String(body.day || ''), String(body.name || ''),
        String(body.station || ''), String(body.level || ''), Number(body.stars) || 0, Number(body.first) || 0, Number(body.total) || 0,
        Number(body.coins) || 0, Number(body.hints) || 0, Number(body.shown) || 0, Number(body.minutes) || 0, Number(body.streak) || 0,
        (body.missed || []).map(String).join(' | ')
      ]);
      return json({ ok: true });
    }
    if (body.type === 'progress') {
      upsertProgress(ss, String(body.name || ''), Number(body.savedAt) || Date.now(), JSON.stringify(body.state || {}));
      return json({ ok: true });
    }
    return json({ ok: false, error: 'unknown type' });
  } finally {
    lock.releaseLock();
  }
}

function sheet(ss, name, headers, index) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name, index);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  // Remove the default empty "Sheet1" once our tabs exist.
  var first = ss.getSheetByName('Sheet1');
  if (first && ss.getSheets().length > 1 && first.getLastRow() === 0) ss.deleteSheet(first);
  return sh;
}

function findProgress(ss, name) {
  if (!name) return null;
  var sh = sheet(ss, PROGRESS, PROGRESS_HEADERS, 1);
  var last = sh.getLastRow();
  if (last < 2) return null;
  var rows = sh.getRange(2, 1, last - 1, 4).getValues();
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === name.toLowerCase()) {
      return { row: i + 2, savedAt: Number(rows[i][1]) || 0, state: rows[i][3] };
    }
  }
  return null;
}

function upsertProgress(ss, name, savedAt, stateJson) {
  if (!name) return;
  var sh = sheet(ss, PROGRESS, PROGRESS_HEADERS, 1);
  var found = findProgress(ss, name);
  if (found) {
    if (savedAt < found.savedAt) return; // an older device; keep the newer save
    sh.getRange(found.row, 2, 1, 3).setValues([[savedAt, new Date(), stateJson]]);
  } else {
    sh.appendRow([name, savedAt, new Date(), stateJson]);
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
