/* ==================================================================
   PASTE CHECK - read this first
   After you paste this whole file into the Apps Script editor, scroll to
   the very bottom. The last line must read exactly:

       // END OF FILE v3.11.0

   If it does not, the paste did not land whole. Select all in the editor,
   delete, and paste again from AppsScript_code.txt (that .txt opens
   straight into Notepad, the .gs does not).
   ================================================================== */
/**
 * SUGUT DMS  -  Sync backend (Google Apps Script)
 * S.H.A. Hup Aik Plantation Sdn Bhd
 *
 * Receives event batches from the field app and appends them to the
 * database spreadsheet. Append-only, deduplicated by EventUUID.
 *
 * v2.3  -  stock-in rows now carry the invoice reference, active ingredient and unit
 * price; stock-out rows carry the target lot and active ingredient; Owner stock-take
 * adjustments land on their own STOCK_ADJUST tab.
 *
 * v2.6  -  general field tasks assigned by the Owner travel under `tasks` (TASKS tab);
 * worker completions of those tasks travel under `tasklogs` (TASK_LOGS tab). Both carry
 * their own confirmation flag, so a backend that predates v2.6 can never swallow them.
 * Programme rows gained startDate / durDays / weather; stock-out rows gained the crew
 * size and hours worked, so labour can be totalled per month.
 *
 * v3.0  -  retailer dispatches and credit top-ups travel under `dispatch` (MKT_DISPATCH tab,
 * one immutable row per weighed load with the per-grade kilos, the order value and the
 * retailer credit left afterwards) and the retailer master travels under `retailers`
 * (RETAILERS tab, upserted by RetailerID and served back on doGet so every phone shares
 * one credit master). Drop rows gained PickId, so the Grade A / B / C rows a worker saved
 * in one tap on one tree can always be put back together.
 *
 * v3.1  -  MKT_DISPATCH gained `invoice_no` (INV-YYYYMMDD-XXX, restarting at 001 daily),
 * `total_gross_kg` / `total_tare_kg` (the scale reading and the basket weight the net was
 * worked out from), `override_by` / `override_at` (the Owner who released a dispatch past
 * a retailer's credit limit) and `lines_json`  -  the full clone x grade x basket breakdown
 * the WhatsApp receipt was printed from. Columns are written by header NAME, so an
 * existing MKT_DISPATCH tab simply gains the new headers on the right.
 *
 * v3.6  -  THREE THINGS.
 *   1. Worker scale submissions travel under `dispatchreqs` and land on a DISPATCH_REQ tab,
 *      one row per weighed load, carrying `photo_b64`  -  a downscaled JPEG of the scale
 *      display as a base64 string. doGet serves the still-undecided ones BACK, because the
 *      worker weighs on one phone and the marketer audits on another; without the return
 *      trip the verification hub would only ever show loads weighed on its own device.
 *      Photos are shrunk in the browser to fit a spreadsheet cell (50,000 char limit); this
 *      script additionally refuses to serve any row whose photo is over that size rather
 *      than failing the whole GET.
 *   2. RETAILERS gained PriceProfile (CONTRACT or SPOT) and Contract  -  the merchant's own
 *      clone x grade rate table as JSON, the same trick lines_json uses, because a
 *      spreadsheet cell cannot hold a nested table. Both are appended by header NAME, so an
 *      existing RETAILERS tab keeps its rows and simply gains two columns on the right.
 *   3. MKT_DISPATCH gained req_uuid / weighed_by / verified_by  -  the three signatures on
 *      a load that came through the handshake, so the sheet records who weighed it and who
 *      checked the photo, not just who pressed the button.
 *
 * v3.2  -  the audit trail travels under `audit` (AUDIT_LOG tab): LOG_VOID rows for an
 * entry an Owner removed before it ever synced, and YIELD_ACK rows answering a yield
 * count vs weight mismatch. Both ride their OWN payload key rather than the generic
 * `events` batch, because an unknown type in that batch fails the WHOLE upload  -  this way
 * a backend that predates v3.2 simply keeps them queued and everything else still syncs.
 *
 * v2.9  -  continuous tying rounds travel under `tying` (TYING_LOGS tab, one row per round
 * with the rope drawn), their approved corrections under `tieadj` (TIE_ADJUST tab), and
 * marketing sales under `sales` (SALES tab). Drop rows now carry Secured (was the fruit
 * still on its string) and rotten rows carry Tied  -  the two figures the untied-wave
 * estimate is built from.
 *
 * v2.8  -  rotten fruit logs travel under `rotten` (ROTTEN_LOGS tab, one row per log with the
 * mandatory cause) and Owner-approved corrections to a drop or rotten count travel under
 * `logadj` (LOG_ADJUST tab). A correction NEVER rewrites the original row: it files a signed
 * delta beside it, so the sheet keeps both the mistake and the person who authorised the fix.
 *
 * v2.7  -  the Owner's manual rain-gauge readings travel under `rain` and land on a RAIN
 * tab, one row per date, upserted by uuid so correcting a mis-keyed morning reading
 * overwrites that day instead of adding a second row. Carries its own confirmation flag.
 *
 * v2.5  -  activated agronomist phase programmes travel under `programs` and land on a
 * PROGRAMS tab; stock-out rows filed from a worker's completion reply also carry the
 * programme name, tanks used and water litres.
 *
 * SETUP (once):
 * 1. Open the imported "Sugut_DMS_Database_v1" Google Sheet.
 * 2. Extensions > Apps Script. Delete any code there, paste this file.
 * 3. Click Deploy > New deployment > type: Web app.
 *      - Execute as: Me
 *      - Who has access: Anyone with the link
 * 4. Copy the Web app URL (ends in /exec) into the app's Settings.
 */

var SHEET_MAP = {
  DROP:      { sheet: 'DROP_LOGS',
               cols: function(e){ return [e.uuid, e.dt, e.tree, e.lot, e.clone, e.qty, e.grade, e.estkg, e.worker, e.device, '']; },
               // v2.9  -  Secured says the fruit came off with its string still on it. A drop
               // filed before v2.9 has no flag and is read as secured, which is what it was.
               extra: function(e){ return { Secured: (e.secured === false ? 'NO' : 'YES'),
                                            DropKind: e.dropKind || (e.secured === false ? 'UNSECURED' : 'SECURED'),
                                            // v3.0  -  the three grade rows of one collection round share a PickId
                                            PickId: e.pickId || '' }; } },
  STOCK_OUT: { sheet: 'STOCK_OUT',
               cols: function(e){ return [e.uuid, e.dt, e.pid, e.pname, e.qty, e.unit, e.set, e.cost, e.worker, e.device, '']; },
               // v2.3 fields are placed BY HEADER NAME, so they land correctly no
               // matter how many columns the sheet already has.
               extra: function(e){ return { TargetLot: e.lot || '', ActiveIngredient: e.ai || '',
                                            Programme: e.progSet || '', TanksUsed: (e.tanks == null ? '' : e.tanks),
                                            WaterLitres: (e.water == null ? '' : e.water),
                                            Crew: (e.crew == null ? '' : e.crew),
                                            LabourHours: (e.hours == null ? '' : e.hours) }; } },
  STOCK_IN:  { sheet: 'STOCK_IN',
               cols: function(e){ return [e.uuid, e.dt.slice(0,10), e.pid, e.pname, e.qty, e.unit, '', '', e.cost, e.supplier || '', e.worker, '']; },
               extra: function(e){ return { InvoiceRef: e.ref || '', ActiveIngredient: e.ai || '',
                                            UnitPrice: (e.unitPrice == null ? '' : e.unitPrice) }; } },
  CENSUS:    { sheet: 'CENSUS_EVENTS',
               cols: function(e){ return [e.uuid, e.dt.slice(0,10), e.tree, 'CENSUS', e.qty, e.stage || '', e.device, '']; } }
};

/**
 * v2.3  -  make sure the Phase-3 columns exist on a sheet, and return where they are.
 * Columns are appended once at the end of the header row and matched by NAME, so
 * nothing Phase 1 / Phase 2 already writes is moved or overwritten.
 * Returns { idx: {ColumnName: zeroBasedIndex}, width: totalColumns }.
 */
function ensureExtraCols_(sh, names) {
  var width = Math.max(sh.getLastColumn(), 1);
  var r1 = sh.getRange(1, 1, 1, width).getValues()[0].map(function (v) { return String(v).trim(); });
  var hRow = (r1.filter(function (v) { return v; }).length >= 3) ? 1 : 2;
  var head = sh.getRange(hRow, 1, 1, width).getValues()[0].map(function (v) { return String(v).trim(); });
  var idx = {};
  (names || []).forEach(function (n) {
    var i = head.indexOf(n);
    if (i === -1) { head.push(n); sh.getRange(hRow, head.length).setValue(n); i = head.length - 1; }
    idx[n] = i;
  });
  return { idx: idx, width: head.length };
}

function doPost(req) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // one phone syncs at a time  -  no interleaved writes
  try {
    var body = JSON.parse(req.postData.contents);

    // ---- Owner pushed the user registry from the app (v2.1 governance) ----
    if (body.registry) {
      return json_(saveRegistry_(body.registry));
    }

    // ---- correction requests / Owner decisions (v2.2 data correction workflow) ----
    if (body.corrections) {
      return json_(saveCorrections_(body.corrections));
    }

    // ---- Owner stock-take adjustments (v2.3 inventory audit) ----
    if (body.adjustments) {
      return json_(saveAdjustments_(body.adjustments));
    }

    // ---- general field tasks assigned by the Owner (v2.6) ----
    if (body.tasks) {
      return json_(saveTasks_(body.tasks));
    }

    // ---- worker completions of those tasks, incl. labour (v2.6) ----
    if (body.tasklogs) {
      return json_(saveTaskLogs_(body.tasklogs));
    }

    // ---- activated agronomist phase programmes (v2.5) ----
    if (body.programs) {
      return json_(savePrograms_(body.programs));
    }

    // ---- manual daily rainfall from the farm cage (v2.7) ----
    if (body.rain) {
      return json_(saveRain_(body.rain));
    }

    // ---- rotten fruit logs, cause mandatory (v2.8) ----
    if (body.rotten) {
      return json_(saveRotten_(body.rotten));
    }

    // ---- Owner-approved corrections to a drop / rotten count (v2.8) ----
    if (body.logadj) {
      return json_(saveLogAdj_(body.logadj));
    }

    // ---- continuous fruit-tying rounds from the tree board (v2.9) ----
    if (body.tying) {
      return json_(saveTying_(body.tying));
    }

    // ---- Owner-approved corrections to a tying round (v2.9) ----
    if (body.tieadj) {
      return json_(saveTieAdj_(body.tieadj));
    }

    // ---- marketing sales (v2.9) ----
    if (body.sales) {
      return json_(saveSales_(body.sales));
    }

    // ---- v3.11 the farm's shared settings: prices, basket tare, added trees ----
    if (body.settings) {
      return json_(saveSettings_(body.settings));
    }

    // ---- retailer master + opening credit (v3.0) ----
    if (body.retailers) {
      return json_(saveRetailers_(body.retailers));
    }

    // ---- weighed retailer dispatches + credit top-ups (v3.0) ----
    if (body.dispatch) {
      return json_(saveDispatch_(body.dispatch));
    }

    // ---- v3.6 worker scale submissions, carrying the photo of the scale display ----
    if (body.dispatchreqs) {
      return json_(saveDispatchReqs_(body.dispatchreqs));
    }

    // ---- v3.2 anti-manipulation audit trail: voided entries + yield answers ----
    if (body.audit) {
      return json_(saveAudit_(body.audit));
    }

    var events = body.events || [];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var seen = getSeenUuids_(ss);
    var appended = 0, skipped = 0, errors = [];

    // group rows per sheet so each sheet gets one batch write
    var batches = {}, extraFor = {};
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      if (!e || !e.uuid || !SHEET_MAP[e.type]) { errors.push('bad event ' + i); continue; }
      if (seen[e.uuid]) { skipped++; continue; }
      var m = SHEET_MAP[e.type];
      if (!batches[m.sheet]) { batches[m.sheet] = []; extraFor[m.sheet] = m.extra || null; }
      // v2.5.1: the uuid is NOT marked seen here  -  only after its sheet write succeeds,
      // otherwise a failed write burns the uuid and the phone can never re-send it.
      try { batches[m.sheet].push({ base: m.cols(e), extra: m.extra ? m.extra(e) : null, uuid: e.uuid }); }
      catch (err) { errors.push('event ' + i + ': ' + err); }
    }
    for (var name in batches) {
      var sh = ss.getSheetByName(name);
      if (!sh) { errors.push('missing sheet ' + name); continue; }
      var pack = batches[name];
      try {
        var names = [];
        if (pack[0].extra) for (var kk in pack[0].extra) names.push(kk);
        var layout = ensureExtraCols_(sh, names);
        var w = Math.max(layout.width, pack[0].base.length);
        var rows = pack.map(function (r) {
          var row = new Array(w).fill('');
          for (var c = 0; c < r.base.length; c++) row[c] = r.base[c];
          if (r.extra) for (var k in r.extra) if (layout.idx[k] !== undefined) row[layout.idx[k]] = r.extra[k];
          return row;
        });
        sh.getRange(sh.getLastRow() + 1, 1, rows.length, w).setValues(rows);
        // written for real  -  now the uuids may be remembered
        for (var q = 0; q < pack.length; q++) { seen[pack[q].uuid] = true; appended++; }
      } catch (err2) {
        // this sheet failed; its uuids stay unseen so the phone retries only these rows
        errors.push('sheet ' + name + ': ' + err2);
      }
    }
    saveSeenUuids_(ss, seen);
    // v2.5.1: ok is FALSE when anything failed. The phone marks a batch synced on ok
    // alone, so reporting ok:true with errors deleted field data silently.
    return json_({ ok: errors.length === 0, appended: appended, skipped: skipped, errors: errors });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** GET returns master data so the app can refresh trees/products/workers at the hotspot. */
/**
 * v3.10 - ASK FOR WHAT YOU NEED.
 *
 * Until now doGet took no parameters, so every phone was handed the same payload: every
 * waiting load, every scale photo, all 171 trees and all 68 products. Measured against a
 * peak morning that is 2.9 MB per phone per sync, of which 88% is photographs that a Farm
 * Worker never opens. Three workers at the hotspot pulled 8.7 MB between them to learn
 * nothing they needed.
 *
 * Two parameters change that, and neither alters how a single record is stored:
 *
 *   role=WORKER|PURCHASER|MARKETING|OWNER
 *        A worker is not an auditor. They get no other worker's pending loads and no
 *        photos at all - only the DECISIONS on loads they raised themselves.
 *   sig=<masters signature the phone already holds>
 *        Trees, products, staff and retailers change perhaps once a month. If the phone's
 *        signature matches, they are left out entirely and `mastersunchanged:true` says so.
 *
 * PHOTOS NEVER TRAVEL IN BULK ANY MORE - see doGet's `photo` branch. Marketing pulls a
 * single picture at the moment they open it. The farm confirmed Marketing always has
 * coverage, which is what makes that safe.
 *
 * An old app that calls doGet with no parameters still works: no role means "give me
 * everything", exactly as before. That is deliberate - a phone that has not updated yet
 * must not break on the morning of the deploy.
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var q = (e && e.parameter) ? e.parameter : {};
  var role = String(q.role || '').toUpperCase();
  var uid = String(q.uid || '');
  var legacy = !role;                       // a pre-v3.10 phone: behave exactly as before
  var full = legacy || role === 'OWNER' || role === 'MARKETING';

  // ---- single-photo fetch: the whole of Option B in one branch ----
  if (q.photo) {
    return json_({ ok: true, photo: true, req_uuid: String(q.photo),
                   photos: readDispatchPhotos_(ss, [String(q.photo)])[String(q.photo)] || [] });
  }

  // ---- who needs the pending-load list at all? ----
  // Only somebody who can decide one. A worker's own requests are already on their phone;
  // what a worker needs back is the DECISION, which is served separately and is tiny.
  var reqs = full ? readDispatchReqs_(ss) : [];
  if (!full) DREQ_SERVED = [];

  // ---- strip the photos out of the load list ----
  // Each load row carries a ~28 KB base64 picture. On its own that was 350 KB of a peak
  // sync. The row keeps `photo_kb` and `has_photo` so the marketer's list can still say
  // a photo exists and offer to open it.
  for (var i = 0; i < reqs.length; i++) {
    reqs[i].photo_kb = Math.round(String(reqs[i].photo_b64 || '').length / 1024);
    reqs[i].has_photo = reqs[i].photo_b64 ? 1 : 0;
    reqs[i].photo_b64 = '';
  }

  // ---- masters: send them only if this phone does not already have them ----
  var mast = mastersFor_(ss);
  var same = q.sig && String(q.sig) === mast.sig;

  return json_({
    ok: true,
    role: role, uid: uid,
    sig: mast.sig,
    mastersunchanged: !!same,
    trees:    same ? [] : mast.trees,
    products: same ? [] : mast.products,
    // WORKERS is never withheld. It is the kill switch: a phone that cannot read the staff
    // list cannot tell whether its own access has been revoked, and v2.5.1 made that a
    // hard stop. Saving 300 bytes is not worth blinding the revocation path.
    workers:  mast.workers,
    retailers: same ? [] : mast.retailers,
    corrections: readCorrections_(ss),
    programs: readPrograms_(ss),
    tasks: readTasks_(ss),
    // v3.6 - loads a worker weighed and nobody has decided yet, photo included, so the
    // marketer's phone can audit work done on somebody else's phone
    dispatchreqs: reqs,
    // v3.10 - photos NO LONGER travel with the bulk pull. Marketing asks for one picture at
    // the moment they open it, via ?photo=<req_uuid>. This single line is 88% of the fix.
    dispatchphotos: {},
    // v3.8.1 - what Marketing decided, so the worker who weighed the load finds out.
    // Weight, time and who. No invoice number, no ringgit, no credit balance.
    dispatchdecisions: readDispatchDecisions_(ss),
    // v3.11 - the shared dials. Served to EVERY role, including a Farm Worker: the basket
    // tare is subtracted from their own weighing and a tree they cannot see cannot be
    // logged against. Small enough to send every time.
    settings: readSettings_(ss),
    // v3.5 - the farm-wide per-tree totals, so every phone shows the same figure
    treestats: readTreeStats_(ss),
    // v3.5.1 - which tabs that reading actually found, so a phone can SAY why a total
    // looks wrong instead of quietly showing a smaller number
    treestatsmeta: TREE_STATS_META
  });
}

/**
 * v3.10 - the four slow-moving tables, plus a signature over them.
 *
 * The signature is deliberately cheap: row counts and the last row of each table. Trees and
 * products are only ever appended to or edited in place by the Owner, so a change moves one
 * of those numbers. It is not a cryptographic hash and does not need to be - the worst case
 * of a missed change is that a phone keeps yesterday's product list until the next edit,
 * and the Owner can force a full refresh from Settings.
 */
function mastersFor_(ss) {
  var trees = tableToObjects_(ss, 'TREES');
  var products = tableToObjects_(ss, 'PRODUCTS');
  var workers = tableToObjects_(ss, 'WORKERS');
  var retailers = readRetailers_(ss);
  function tail(a) {
    if (!a || !a.length) return '0';
    var last = a[a.length - 1], s = '';
    for (var k in last) s += String(last[k]);
    return a.length + ':' + s.length + ':' + s.slice(0, 40);
  }
  var sig = ['T' + tail(trees), 'P' + tail(products),
             'W' + tail(workers), 'R' + tail(retailers)].join('|');
  return { trees: trees, products: products, workers: workers, retailers: retailers, sig: sig };
}

// Filled in by readTreeStats_ on every call; reported straight back to the phone.
var TREE_STATS_META = { tabs: {}, missing: [], trees: 0 };

/**
 * v3.5 - PER-TREE TOTALS ACROSS EVERY PHONE.
 *
 * Before this, events only ever travelled UP. Each phone built its tree balances from the
 * rows IT had keyed, so the Owner's phone and a worker's phone showed different totals for
 * the same tree and neither was wrong - each was honestly reporting a partial picture.
 * This returns one compact row per tree covering every phone's work; the app adds only its
 * own not-yet-uploaded rows on top.
 *
 * Nothing here writes. If a tab is missing it is skipped, so a partially set-up sheet
 * degrades to smaller numbers rather than an error.
 *
 * Returns { 'B-045': {tied, secured, untied, rotTied, rotUntied}, ... }
 */
function readTreeStats_(ss) {
  var out = {};
  function bucket(tree) {
    var t = String(tree || '').trim();
    if (!t) return null;
    if (!out[t]) out[t] = { tied: 0, secured: 0, untied: 0, rotTied: 0, rotUntied: 0 };
    return out[t];
  }
  var META = { tabs: {}, missing: [], trees: 0 };
  // Find the header row (some tabs carry a note line above it) and index it by name.
  // `name` may be a list of acceptable tab names - farms that set the sheet up by hand do
  // not always use the exact spelling this script was written against.
  function read_(name) {
    var names = (typeof name === 'string') ? [name] : name;
    var sh = null, used = '';
    for (var q = 0; q < names.length; q++) {
      sh = ss.getSheetByName(names[q]);
      if (sh) { used = names[q]; break; }
    }
    if (!sh) { META.missing.push(names[0]); return null; }
    var vals = sh.getDataRange().getValues();
    if (vals.length < 2) return null;
    var hr = 0;
    for (var r = 0; r < Math.min(2, vals.length); r++) {
      var joined = vals[r].join('|').toLowerCase();
      if (joined.indexOf('uuid') >= 0) { hr = r; break; }
      hr = r;
    }
    var head = vals[hr].map(function (v) { return String(v).trim().toLowerCase(); });
    var idx = function (names, fallback) {
      for (var i = 0; i < names.length; i++) {
        var c = head.indexOf(String(names[i]).toLowerCase());
        if (c >= 0) return c;
      }
      return (fallback === undefined) ? -1 : fallback;
    };
    META.tabs[used] = Math.max(0, vals.length - (hr + 1));
    return { vals: vals, from: hr + 1, idx: idx };
  }
  function num(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
  function isNo(v) { var t = String(v).trim().toUpperCase(); return t === 'NO' || t === 'FALSE' || t === 'UNTIED'; }

  // ---- tying rounds ----
  var t = read_(['TYING_LOGS', 'TYING_LOG', 'TIE_LOGS', 'TIE_LOG']);
  if (t) {
    var cT = t.idx(['tree'], 2), cN = t.idx(['n', 'qty', 'fruits'], 5);
    for (var i = t.from; i < t.vals.length; i++) {
      var b = bucket(t.vals[i][cT]); if (b) b.tied += num(t.vals[i][cN]);
    }
  }
  // ---- approved tying corrections ----
  var ta = read_(['TIE_ADJUST', 'TIE_ADJUSTMENTS']);
  if (ta) {
    var aT = ta.idx(['tree'], 5), aD = ta.idx(['delta'], 10);
    for (var j = ta.from; j < ta.vals.length; j++) {
      var b2 = bucket(ta.vals[j][aT]); if (b2) b2.tied += num(ta.vals[j][aD]);
    }
  }
  // ---- collected fruit. Secured means it came off with its string still on. ----
  var d = read_(['DROP_LOGS', 'DROP_LOG', 'DROPS', 'HARVEST_LOGS']);
  if (d) {
    var dT = d.idx(['tree'], 2), dQ = d.idx(['qty', 'fruits'], 5), dS = d.idx(['secured'], -1);
    for (var k = d.from; k < d.vals.length; k++) {
      var b3 = bucket(d.vals[k][dT]); if (!b3) continue;
      var q = num(d.vals[k][dQ]);
      var untied = (dS >= 0) && isNo(d.vals[k][dS]);
      if (untied) b3.untied += q; else b3.secured += q;
    }
  }
  // ---- rotten fruit ----
  var ro = read_(['ROTTEN_LOGS', 'ROTTEN_LOG', 'ROTTEN']);
  if (ro) {
    var rT = ro.idx(['tree'], 2), rQ = ro.idx(['qty'], 5), rTie = ro.idx(['tied'], 8);
    for (var m = ro.from; m < ro.vals.length; m++) {
      var b4 = bucket(ro.vals[m][rT]); if (!b4) continue;
      var q2 = num(ro.vals[m][rQ]);
      if ((rTie >= 0) && isNo(ro.vals[m][rTie])) b4.rotUntied += q2; else b4.rotTied += q2;
    }
  }
  // ---- approved drop / rotten corrections; `type` says which log it fixes ----
  var la = read_(['LOG_ADJUST', 'LOG_ADJUSTMENTS', 'DROP_ADJUST']);
  if (la) {
    var lTy = la.idx(['type'], 2), lT = la.idx(['tree'], 5), lD = la.idx(['delta'], 10),
        lS = la.idx(['secured'], -1), lTie = la.idx(['tied'], -1);
    for (var n2 = la.from; n2 < la.vals.length; n2++) {
      var b5 = bucket(la.vals[n2][lT]); if (!b5) continue;
      var delta = num(la.vals[n2][lD]);
      var ty = String(la.vals[n2][lTy] || '').toUpperCase();
      if (ty.indexOf('ROTTEN') >= 0) {
        if ((lTie >= 0) && isNo(la.vals[n2][lTie])) b5.rotUntied += delta; else b5.rotTied += delta;
      } else {
        if ((lS >= 0) && isNo(la.vals[n2][lS])) b5.untied += delta; else b5.secured += delta;
      }
    }
  }
  META.trees = 0;
  for (var kk in out) META.trees++;
  TREE_STATS_META = META;
  return out;
}

// ---------- correction requests (CORRECTIONS tab, v2.2) ----------

// v2.8 adds evUuid / evType / evDt so a LOGQTY request points at the exact log it fixes.
var CORR_HEAD = ['uuid','dt','tree','lot','no','ctype','oldVal','newVal','note',
                 'worker','workerId','device','status','decidedBy','decidedAt',
                 'evUuid','evType','evDt'];   // v2.8  -  a LOGQTY request points at one log

function corrSheet_(ss) {
  var sh = ss.getSheetByName('CORRECTIONS');
  if (!sh) {
    sh = ss.insertSheet('CORRECTIONS');
    sh.appendRow(CORR_HEAD);
    sh.getRange(1, 1, 1, CORR_HEAD.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  ensureHead_(sh, CORR_HEAD);   // v2.8  -  self-heal the three new columns on an existing sheet
  return sh;
}

/**
 * Upsert by uuid. A row that already carries an Owner decision (APPROVED/REJECTED)
 * is never downgraded back to PENDING by a stale phone.
 */
function saveCorrections_(list) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = corrSheet_(ss);
  var vals = sh.getDataRange().getValues();
  var rowOf = {};
  for (var r = 1; r < vals.length; r++) if (vals[r][0]) rowOf[String(vals[r][0])] = r;

  var appended = 0, updated = 0, skipped = 0, newRows = [];
  for (var i = 0; i < list.length; i++) {
    var c = list[i];
    if (!c || !c.uuid) { skipped++; continue; }
    var row = CORR_HEAD.map(function (k) { return c[k] === undefined || c[k] === null ? '' : c[k]; });
    var r2 = rowOf[String(c.uuid)];
    if (r2 === undefined) { newRows.push(row); appended++; }
    else {
      var cur = String(vals[r2][CORR_HEAD.indexOf('status')] || 'PENDING').toUpperCase();
      var inc = String(c.status || 'PENDING').toUpperCase();
      if (cur !== 'PENDING' && inc === 'PENDING') { skipped++; continue; }
      sh.getRange(r2 + 1, 1, 1, CORR_HEAD.length).setValues([row]);
      updated++;
    }
  }
  if (newRows.length) {
    sh.getRange(sh.getLastRow() + 1, 1, newRows.length, CORR_HEAD.length).setValues(newRows);
  }
  return { ok: true, corrections: true, appended: appended, updated: updated, skipped: skipped };
}

/** Most recent 300 correction rows, newest last  -  small enough for a phone on 3G. */
function readCorrections_(ss) {
  var sh = ss.getSheetByName('CORRECTIONS');
  if (!sh || sh.getLastRow() < 2) return [];
  var start = Math.max(2, sh.getLastRow() - 299);
  var n = sh.getLastRow() - start + 1;
  var vals = sh.getRange(start, 1, n, CORR_HEAD.length).getValues();
  var out = [];
  for (var i = 0; i < vals.length; i++) {
    if (!vals[i][0]) continue;
    var o = {};
    for (var c = 0; c < CORR_HEAD.length; c++) {
      var v = vals[i][c];
      o[CORR_HEAD[c]] = (v instanceof Date) ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm') : v;
    }
    out.push(o);
  }
  return out;
}

// ---------- stock-take adjustments (STOCK_ADJUST tab, v2.3) ----------

var ADJ_HEAD = ['uuid', 'dt', 'pid', 'pname', 'ai', 'unit', 'systemQty', 'counted',
                'variance', 'varianceValueRM', 'note', 'worker', 'device'];

/**
 * Append-only, deduplicated by uuid. Adjustments arrive in their own payload key so
 * an older deployment of this script can never silently swallow them: if this
 * function is missing, the reply carries no `adjustments:true` and the phone simply
 * keeps the entry queued.
 */
function saveAdjustments_(list) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('STOCK_ADJUST');
  if (!sh) {
    sh = ss.insertSheet('STOCK_ADJUST');
    sh.appendRow(ADJ_HEAD);
    sh.getRange(1, 1, 1, ADJ_HEAD.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  var seen = {};
  if (sh.getLastRow() > 1) {
    var have = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < have.length; i++) if (have[i][0]) seen[String(have[i][0])] = true;
  }
  var rows = [], appended = 0, skipped = 0;
  for (var j = 0; j < list.length; j++) {
    var a = list[j];
    if (!a || !a.uuid || seen[String(a.uuid)]) { skipped++; continue; }
    seen[String(a.uuid)] = true;
    rows.push([a.uuid, a.dt, a.pid, a.pname, a.ai || '', a.unit || '',
               a.before, a.counted, a.delta, a.cost, a.note || '', a.worker || '', a.device || '']);
    appended++;
  }
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, ADJ_HEAD.length).setValues(rows);
  return { ok: true, adjustments: true, appended: appended, skipped: skipped };
}

// ---------- agronomist phase programmes (PROGRAMS tab, v2.5) ----------

var PROG_HEAD = ['uuid', 'phaseId', 'month', 'set', 'kind', 'mode', 'basis', 'plan',
                 'scope', 'trees', 'litresPerTree', 'tanks', 'projCost',
                 'by', 'byId', 'at', 'status', 'lines',
                 'startDate', 'durDays', 'weather', 'header'];   // v2.6 phase clock

var TASK_HEAD = ['uuid', 'kind', 'kindLabel', 'need', 'countLabel', 'unit', 'scope', 'trees',
                 'startDate', 'durDays', 'note', 'by', 'at', 'status'];
var TLOG_HEAD = ['uuid', 'dt', 'taskId', 'kind', 'kindLabel', 'lot', 'count', 'countLabel',
                 'unit', 'trees', 'crew', 'hours', 'manHours', 'worker', 'device', 'detail'];

/** v2.6  -  make sure a tab we own carries every column the current version writes. */
function ensureHead_(sh, head) {
  var w = Math.max(sh.getLastColumn(), 1);
  var cur = sh.getRange(1, 1, 1, w).getValues()[0].map(function (v) { return String(v).trim(); });
  var missing = false;
  for (var i = 0; i < head.length; i++) if (cur[i] !== head[i]) { missing = true; break; }
  if (missing) {
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
  }
}

/** Upsert helper shared by the v2.6 task tabs: dedupe by uuid in column A. */
function upsertByUuid_(sheetName, head, list) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(sheetName);
  if (!sh) {
    sh = ss.insertSheet(sheetName);
    sh.appendRow(head);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  ensureHead_(sh, head);
  var vals = sh.getDataRange().getValues();
  var rowOf = {};
  for (var r = 1; r < vals.length; r++) if (vals[r][0]) rowOf[String(vals[r][0])] = r;

  var appended = 0, updated = 0, skipped = 0, newRows = [];
  for (var i = 0; i < list.length; i++) {
    var o = list[i];
    if (!o || !o.uuid) { skipped++; continue; }
    var row = head.map(function (k) {
      var v = o[k];
      if (k === 'detail' || k === 'lines') return JSON.stringify(v || []);
      return (v === undefined || v === null) ? '' : v;
    });
    var r2 = rowOf[String(o.uuid)];
    if (r2 === undefined) { newRows.push(row); appended++; }
    else { sh.getRange(r2 + 1, 1, 1, head.length).setValues([row]); updated++; }
  }
  if (newRows.length) sh.getRange(sh.getLastRow() + 1, 1, newRows.length, head.length).setValues(newRows);
  return { appended: appended, updated: updated, skipped: skipped };
}

var RAIN_HEAD = ['uuid', 'date', 'mm', 'note', 'by', 'byId', 'at', 'device'];

var ROT_HEAD  = ['uuid', 'dt', 'tree', 'lot', 'clone', 'qty', 'cause', 'causeLabel',
                 'tied', 'estkg', 'worker', 'workerId', 'device'];   // v2.9 adds Tied
var TIE_HEAD  = ['uuid', 'dt', 'tree', 'lot', 'clone', 'n', 'ropeM', 'roundId',
                 'worker', 'workerId', 'device'];
var TADJ_HEAD = ['uuid', 'dt', 'type', 'evUuid', 'corrId', 'tree', 'lot', 'clone',
                 'was', 'now', 'delta', 'ropeM', 'reason', 'requestedBy', 'approvedBy'];
var SALE_HEAD = ['uuid', 'dt', 'buyer', 'grade', 'kg', 'pricePerKg', 'amount', 'note',
                 'worker', 'device'];

// v3.1  -  one immutable row per weighed load. `credit_after_rm` is what the app showed the
// supervisor at the moment of dispatch; the app recomputes the running balance from the
// whole ledger when it renders, so a late-syncing phone can never corrupt the sequence.
//
// v3.1 added: `invoice_no` (INV-YYYYMMDD-XXX), the gross/tare pair the net weight was
// worked out from, `override_by`/`override_at` for a dispatch the Owner released past a
// retailer's credit limit, and `lines_json`  -  the full clone x grade x basket breakdown
// as JSON, so the sheet keeps everything the WhatsApp receipt was printed from even
// though a spreadsheet row cannot hold a nested list.
//
// ADDING COLUMNS IS SAFE: upsertByUuid_ writes by header NAME. An existing MKT_DISPATCH
// tab keeps its v3.0 rows; the new headers appear on the right and fill from the next
// dispatch onwards.
var DISP_HEAD = ['uuid', 'dt', 'invoice_no', 'type', 'retailer_id', 'retailer_name', 'contact',
                 'kg_A', 'kg_B', 'kg_C',
                 'total_gross_kg', 'total_tare_kg', 'total_kg',
                 'price_A', 'price_B', 'price_C',
                 'value_A', 'value_B', 'value_C', 'total_value_rm',
                 'amount_rm', 'credit_before_rm', 'credit_after_rm',
                 'over_credit', 'override_by', 'override_at',
                 'line_count', 'lines_json',
                 // v3.6 - the three signatures on a handshake dispatch. Blank on a load
                 // the marketer weighed themselves, which is itself the useful signal.
                 'req_uuid', 'weighed_by', 'weighed_at', 'verified_by', 'verified_at',
                 'pricing', 'photo_kb',
                 // v3.10.1 - set only when a breakdown had to be cut to fit one cell
                 'lines_truncated',
                 'note', 'worker', 'workerId', 'device'];
var RET_HEAD  = ['RetailerID', 'Name', 'Contact', 'OpeningCreditRM', 'Status',
                 // v3.6 - CONTRACT or SPOT, and the merchant's own rate table as JSON
                 'PriceProfile', 'Contract'];

/**
 * v3.6  -  one row per load a worker weighed and photographed, before anyone has decided
 * on it. This tab is the ONLY place a photo lives; the approved MKT_DISPATCH row points
 * back at it by req_uuid rather than carrying a second copy of the image.
 *
 * The row is written by upsertByUuid_, so a phone that re-sends after a dropped hotspot
 * updates its own row instead of creating a duplicate load.
 */
var DREQ_HEAD = ['uuid', 'dt', 'retailer_id', 'retailer_name', 'contact',
                 'kg_A', 'kg_B', 'kg_C', 'fruit_count',
                 'total_gross_kg', 'total_tare_kg', 'total_kg',
                 'line_count', 'lines_json',
                 'photo_kb', 'photo_b64',
                 // v3.9 - the lorry that took it, and the correction chain. `redo_of` points
                 // at the uuid this load is a second attempt AT; `attempt` is 1 for a first
                 // submission. ensureHead_ appends these to an existing tab BY NAME, so a
                 // v3.6 DISPATCH_REQ tab keeps every row it already has.
                 'vehicle_plate', 'redo_of', 'attempt',
                 'note', 'worker', 'workerId', 'device'];

/* v3.9 - ONE ROW PER BASKET PHOTO.
   A load can carry ten baskets at peak and every basket now needs its own picture. Ten
   photos in one DISPATCH_REQ row would be roughly 300,000 characters against a
   50,000-character cell ceiling, so the photos live here instead: one row each, keyed back
   to the load by req_uuid. The row uuid is req_uuid + ':' + basket_no, so a re-send after a
   dropped hotspot updates its own row instead of duplicating it. */
var DPHOTO_HEAD = ['uuid', 'req_uuid', 'basket_no', 'dt', 'photo_kb', 'photo_b64',
                   'worker', 'workerId', 'device'];

/* A Google Sheets cell holds at most 50,000 characters. The app shrinks a photo below
   that before it ever queues, but a row hand-pasted into the sheet, or one written by a
   future build, could still be over. Truncating would produce a corrupt image that looks
   like a real one, so an oversize photo is dropped and the row is kept: the load still
   syncs, the marketer is simply told there is no photo to audit. */
var CELL_MAX = 49000;

function saveDispatchReqs_(list) {
  var photoRows = [];
  var rows = (list || []).map(function (e) {
    var o = {};
    for (var k in e) o[k] = e[k];

    // v3.9 - lift every basket photo out of the lines and into its own row. The line keeps
    // its weight and count; only the image moves. Doing this BEFORE stringifying is what
    // keeps lines_json comfortably inside one cell however many baskets the load has.
    var lines = o.lines;
    if (typeof lines === 'string') { try { lines = JSON.parse(lines); } catch (x) { lines = null; } }
    if (Object.prototype.toString.call(lines) === '[object Array]') {
      var clean = [];
      for (var i = 0; i < lines.length; i++) {
        var L = {}, src = lines[i] || {};
        for (var f in src) if (f !== 'photo_b64') L[f] = src[f];
        var bp = String(src.photo_b64 || '');
        L.basket_no = (src.basket_no != null) ? src.basket_no : (i + 1);
        L.has_photo = bp ? 1 : 0;
        clean.push(L);
        if (bp && bp.length <= CELL_MAX) {
          photoRows.push({
            uuid: String(o.uuid || '') + ':' + L.basket_no,
            req_uuid: String(o.uuid || ''),
            basket_no: L.basket_no,
            dt: o.dt || '',
            photo_kb: Math.round(bp.length / 1024),
            photo_b64: bp,
            worker: o.worker || '', workerId: o.workerId || '', device: o.device || ''
          });
        }
      }
      o.lines = clean;
      o.lines_json = JSON.stringify(clean);
    } else if (o.lines && !o.lines_json) {
      try { o.lines_json = JSON.stringify(o.lines); } catch (x2) { o.lines_json = '[]'; }
    }
    delete o.lines;                      // the object form never belongs in a cell

    // The load-level photo stays: it is basket 1's picture, and every screen written before
    // v3.9 reads it. An oversize one is DROPPED, never truncated - a cut-off base64 string
    // decodes into a corrupt image that looks like a real one.
    var p = String(o.photo_b64 || '');
    o.photo_b64 = (p.length > CELL_MAX) ? '' : p;
    o.photo_kb = Math.round(String(o.photo_b64).length / 1024);
    o.attempt = Math.max(1, Math.floor(Number(o.attempt) || 1));
    o.redo_of = String(o.redo_of || '');
    o.vehicle_plate = String(o.vehicle_plate || '').toUpperCase();
    return o;
  });

  var r = upsertByUuid_('DISPATCH_REQ', DREQ_HEAD, rows);
  var pr = { appended: 0, updated: 0 };
  if (photoRows.length) pr = upsertByUuid_('DISPATCH_PHOTO', DPHOTO_HEAD, photoRows);
  return { ok: true, dispatchreqs: true,
           appended: r.appended, updated: r.updated, skipped: r.skipped,
           photos: photoRows.length, photos_appended: pr.appended };
}

/**
 * v3.9 - the basket photos belonging to loads still waiting on a decision.
 *
 * Fetched only for the undecided requests, and hard-capped, because photos are by far the
 * heaviest thing this backend moves and a decided load's pictures have no reason to travel
 * again. Returns { req_uuid: [ {basket_no, photo_kb, photo_b64}, ... ] }.
 */
var PHOTO_ROW_MAX = 120;

function readDispatchPhotos_(ss, wantedUuids) {
  var out = {};
  if (!wantedUuids || !wantedUuids.length) return out;
  var sh = ss.getSheetByName('DISPATCH_PHOTO');
  if (!sh || sh.getLastRow() < 2) return out;

  var want = {};
  for (var w = 0; w < wantedUuids.length; w++) want[String(wantedUuids[w])] = 1;

  var vals = sh.getDataRange().getValues();
  var head = vals[0].map(function (v) { return String(v).trim(); });
  var ri = head.indexOf('req_uuid'), bi = head.indexOf('basket_no'),
      pi = head.indexOf('photo_b64'), ki = head.indexOf('photo_kb');
  if (ri < 0 || pi < 0) return out;

  var n = 0;
  for (var r = vals.length - 1; r >= 1 && n < PHOTO_ROW_MAX; r--) {
    var ru = String(vals[r][ri] || '').trim();
    if (!ru || !want[ru]) continue;
    var b64 = String(vals[r][pi] || '');
    if (!b64) continue;
    if (!out[ru]) out[ru] = [];
    out[ru].push({
      basket_no: bi >= 0 ? (Number(vals[r][bi]) || 0) : 0,
      photo_kb: ki >= 0 ? (Number(vals[r][ki]) || 0) : Math.round(b64.length / 1024),
      photo_b64: b64
    });
    n++;
  }
  // basket 1 first, so the strip reads in the order the worker weighed them
  for (var k in out) out[k].sort(function (a, b) { return a.basket_no - b.basket_no; });
  return out;
}

/**
 * Serve back only the loads still WAITING on a decision. A request is decided once a
 * MKT_DISPATCH row quotes its uuid in req_uuid, or an AUDIT_LOG row returns it. Filtering
 * here rather than on the phone is what keeps the payload small: photos are the heaviest
 * thing this backend moves, and a decided load's photo has no reason to travel again.
 */
// Filled in by readDispatchReqs_ on every call and read straight afterwards by doGet, so
// the photo reader only ever loads pictures for loads that are actually being served.
var DREQ_SERVED = [];

function readDispatchReqs_(ss) {
  DREQ_SERVED = [];
  var sh = ss.getSheetByName('DISPATCH_REQ');
  if (!sh || sh.getLastRow() < 2) return [];

  // which requests have already been answered
  var decided = {};
  var d = ss.getSheetByName('MKT_DISPATCH');
  if (d && d.getLastRow() > 1) {
    var dv = d.getDataRange().getValues();
    var dh = dv[0].map(function (v) { return String(v).trim(); });
    var ri = dh.indexOf('req_uuid');
    if (ri >= 0) for (var i = 1; i < dv.length; i++) if (dv[i][ri]) decided[String(dv[i][ri]).trim()] = true;
  }
  var a = ss.getSheetByName('AUDIT_LOG');
  if (a && a.getLastRow() > 1) {
    var av = a.getDataRange().getValues();
    var ah = av[0].map(function (v) { return String(v).trim(); });
    var ti = ah.indexOf('targetUuid'), tp = ah.indexOf('type');
    if (ti >= 0) for (var j = 1; j < av.length; j++) {
      // v3.9 - a worker CANCEL closes a load just as firmly as a marketer's return, and it
      // rides the same audit key. Leave it out here and a cancelled load keeps coming back
      // down to every phone for ever.
      var aty = tp >= 0 ? String(av[j][tp]) : '';
      if (aty !== 'DISPATCH_REJECT' && aty !== 'DISPATCH_CANCEL') continue;
      if (av[j][ti]) decided[String(av[j][ti]).trim()] = true;
    }
  }

  var vals = sh.getDataRange().getValues();
  var head = vals[0].map(function (v) { return String(v).trim(); });
  var out = [];
  for (var r = 1; r < vals.length; r++) {
    var id = String(vals[r][0] || '').trim();
    if (!id || decided[id]) continue;
    var o = {};
    for (var c = 0; c < head.length; c++) if (head[c]) o[head[c]] = vals[r][c];
    o.uuid = id;
    out.push(o);
    DREQ_SERVED.push(id);
    // A hard stop on how many photos one GET may carry. Fifty unaudited loads is already
    // a backlog nobody is working through; serving hundreds would time the request out
    // and the phone would get nothing at all, which is strictly worse.
    if (out.length >= 50) break;
  }
  return out;
}

/**
 * v3.2  -  the anti-manipulation trail. Two kinds of row share one tab because they answer
 * the same question: "who touched the record, and what did they say about it".
 *   LOG_VOID   an Owner removed a still-unsynced entry from a phone. The entry itself
 *              never reached the sheet, so THIS row is the only proof it ever existed  - 
 *              which is exactly why it is written before the deletion happens.
 *   YIELD_ACK  an Owner answered a yield count vs weight mismatch. The alert is never
 *              cleared by editing a figure; it is answered, and both stay on the record.
 */
var AUD_HEAD  = ['uuid', 'dt', 'type', 'targetUuid', 'targetType', 'targetDt', 'targetWorker',
                 'detail', 'day', 'dispatch_kg', 'harvest_fruits', 'avg_fruit_kg', 'flag',
                 'signed_field', 'signed_scale',
                 'reason', 'worker', 'workerId', 'device'];

/** Deduped by uuid, so a phone that re-sends after a dropped connection cannot double-log.
 *  upsertByUuid_ creates the AUDIT_LOG tab on first use, so no manual sheet setup. */
function saveAudit_(list) {
  var rows = (list || []).map(function (e) {
    var o = {};
    for (var k in e) o[k] = e[k];
    o.type = e.type || 'LOG_VOID';
    return o;
  });
  var r = upsertByUuid_('AUDIT_LOG', AUD_HEAD, rows);
  return { ok: true, audit: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}

/**
 * v3.0  -  dispatches and credit top-ups share one tab so the retailer's account reads
 * top to bottom in one place. Deduped by uuid, so a phone that re-sends after a dropped
 * connection can never double-charge a retailer.
 */
/**
 * v3.10.1 - DEFENCE IN DEPTH ON THE ONE CELL THAT KEEPS OVERFLOWING.
 *
 * An approved dispatch's `lines_json` goes into a single spreadsheet cell, and Google caps
 * a cell at 50,000 characters. v3.9 gave every basket its own ~28 KB photo, the approval
 * path copied those lines wholesale, and an eight-basket load produced 226,000 characters.
 * The upload failed with a bare "Failed to fetch" and no dispatch could be approved at all.
 *
 * The app no longer sends them. This strips them again anyway, because a phone that has
 * not updated yet must not be able to jam the Sheet - and because the picture already
 * lives on DISPATCH_PHOTO keyed by req_uuid, which the row records.
 */
function stripLinePhotos_(o) {
  var lines = o.lines;
  if (typeof lines === 'string') { try { lines = JSON.parse(lines); } catch (x) { lines = null; } }
  if (Object.prototype.toString.call(lines) !== '[object Array]') {
    // no object form to work from - fall back to scrubbing the string itself
    var lj = String(o.lines_json || '');
    if (lj.length > CELL_MAX) {
      try {
        var arr = JSON.parse(lj);
        for (var q = 0; q < arr.length; q++) { delete arr[q].photo_b64; delete arr[q].photo_kb; }
        o.lines_json = JSON.stringify(arr);
      } catch (y) { o.lines_json = '[]'; o.lines_truncated = 'unreadable and oversize'; }
    }
    return o;
  }
  var clean = [];
  for (var i = 0; i < lines.length; i++) {
    var L = {}, src = lines[i] || {};
    for (var f in src) if (f !== 'photo_b64' && f !== 'photo_kb') L[f] = src[f];
    if (src.photo_b64) L.has_photo = 1;
    clean.push(L);
  }
  o.lines_json = JSON.stringify(clean);
  // Still too big after the photos are gone? Keep the MONEY row - the totals, the invoice
  // and the credit movement all live in their own columns - and say plainly that the
  // breakdown was cut. A silently truncated JSON string would parse as a shorter load.
  if (String(o.lines_json).length > CELL_MAX) {
    o.lines_json = '[]';
    o.lines_truncated = clean.length + ' lines too large for one cell';
  }
  delete o.lines;
  return o;
}

function saveDispatch_(list) {
  var rows = (list || []).map(function (e) {
    var o = {};
    for (var k in e) o[k] = e[k];
    o.type = e.type || 'DISPATCH';
    o.over_credit = (e.over_credit ? 'YES' : '');
    o = stripLinePhotos_(o);
    return o;
  });
  var r = upsertByUuid_('MKT_DISPATCH', DISP_HEAD, rows);
  return { ok: true, dispatch: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}

/**
 * v3.0  -  the retailer master. Upserted by RetailerID (falling back to Name) so the Owner's
 * phone can edit a name or an opening credit without creating a second retailer, and
 * doGet serves it back so every phone prices against the same list. Money that has
 * already moved lives in MKT_DISPATCH, never here  -  this tab holds only the opening
 * position and the contact details.
 */
function saveRetailers_(list) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('RETAILERS');
  if (!sh) {
    sh = ss.insertSheet('RETAILERS');
    sh.appendRow(RET_HEAD);
    sh.getRange(1, 1, 1, RET_HEAD.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  ensureHead_(sh, RET_HEAD);
  var vals = sh.getDataRange().getValues();
  var rowById = {}, rowByName = {};
  for (var r = 1; r < vals.length; r++) {
    if (vals[r][0]) rowById[String(vals[r][0]).trim()] = r;
    if (vals[r][1]) rowByName[String(vals[r][1]).trim().toLowerCase()] = r;
  }
  var appended = 0, updated = 0, newRows = [];
  for (var i = 0; i < (list || []).length; i++) {
    var o = list[i];
    if (!o || (!o.id && !o.name)) continue;
    // v3.6 - a contract table can be long; if it somehow exceeds a cell the merchant row
    // is still written, just without the book. Losing the rates is recoverable (the Owner
    // re-saves them); losing the merchant row is not.
    var book = String(o.contract || '');
    if (book.length > CELL_MAX) book = '';
    var row = [String(o.id || ''), String(o.name || ''), String(o.contact || ''),
               (o.opening_credit_rm == null ? 0 : +o.opening_credit_rm),
               String(o.status || 'Active'),
               String(o.pricing || 'SPOT').toUpperCase(),
               book];
    var at = rowById[String(o.id || '').trim()];
    if (at === undefined) at = rowByName[String(o.name || '').trim().toLowerCase()];
    if (at === undefined) { newRows.push(row); appended++; }
    else { sh.getRange(at + 1, 1, 1, RET_HEAD.length).setValues([row]); updated++; }
  }
  if (newRows.length) sh.getRange(sh.getLastRow() + 1, 1, newRows.length, RET_HEAD.length).setValues(newRows);
  return { ok: true, retailers: true, appended: appended, updated: updated };
}

/** v3.0  -  serve the retailer master back to every phone on doGet. */
/**
 * v3.8.1  -  THE DECISION TRAVELS BACK DOWN.
 *
 * Approving a load writes a MKT_DISPATCH row and returning one writes a DISPATCH_REJECT
 * into AUDIT_LOG - and BOTH of those happen on the marketer's phone. Until this function
 * existed, nothing carried that news back, so the worker who weighed the load watched it
 * sit at PENDING for ever. Same shape as the v3.5 divergence bug: information travelling
 * one way only.
 *
 * SIX FIELDS, BY NAME, AND NOTHING ELSE. A MKT_DISPATCH row carries invoice_no,
 * total_value_rm, credit_before_rm and credit_after_rm. Handing the row over wholesale
 * would put live prices and a merchant's credit balance on a farm worker's phone, which
 * is the single thing the whole photo-handshake design exists to prevent. Read the columns
 * by header name and never widen this list without asking why.
 */
var DECISION_MAX = 300;

function readDispatchDecisions_(ss) {
  var out = [];

  // ---- approvals: MKT_DISPATCH rows that quote a req_uuid ----
  var d = ss.getSheetByName('MKT_DISPATCH');
  if (d && d.getLastRow() > 1) {
    var dv = d.getDataRange().getValues();
    var dh = dv[0].map(function (v) { return String(v).trim(); });
    var ri = dh.indexOf('req_uuid');
    if (ri >= 0) {
      var di = dh.indexOf('dt'), vi = dh.indexOf('verified_by'),
          ki = dh.indexOf('total_kg'), ni = dh.indexOf('retailer_name');
      for (var i = dv.length - 1; i >= 1 && out.length < DECISION_MAX; i--) {
        var ru = String(dv[i][ri] || '').trim();
        if (!ru) continue;                       // a load the marketer weighed themselves
        out.push({
          req_uuid: ru,
          state: 'APPROVED',
          dt: di >= 0 ? String(dv[i][di] || '') : '',
          by: vi >= 0 ? String(dv[i][vi] || '') : '',
          total_kg: ki >= 0 ? (Number(dv[i][ki]) || 0) : 0,
          retailer_name: ni >= 0 ? String(dv[i][ni] || '') : '',
          reason: ''
        });
      }
    }
  }

  // ---- returns: DISPATCH_REJECT rows in AUDIT_LOG ----
  var a = ss.getSheetByName('AUDIT_LOG');
  if (a && a.getLastRow() > 1) {
    var av = a.getDataRange().getValues();
    var ah = av[0].map(function (v) { return String(v).trim(); });
    var ti = ah.indexOf('targetUuid'), tp = ah.indexOf('type');
    if (ti >= 0) {
      var ad = ah.indexOf('dt'), aw = ah.indexOf('worker'), ar = ah.indexOf('reason');
      for (var j = av.length - 1; j >= 1 && out.length < DECISION_MAX * 2; j--) {
        var ty = tp >= 0 ? String(av[j][tp]) : '';
        if (ty !== 'DISPATCH_REJECT' && ty !== 'DISPATCH_CANCEL') continue;
        var tu = String(av[j][ti] || '').trim();
        if (!tu) continue;
        out.push({
          req_uuid: tu,
          state: (ty === 'DISPATCH_CANCEL') ? 'CANCELLED' : 'RETURNED',
          dt: ad >= 0 ? String(av[j][ad] || '') : '',
          by: aw >= 0 ? String(av[j][aw] || '') : '',
          total_kg: 0,
          retailer_name: '',
          reason: ar >= 0 ? String(av[j][ar] || '') : ''
        });
      }
    }
  }
  return out;
}

/* ======================================================================================
   v3.11 - THE SHARED SETTINGS TAB
   ======================================================================================
   Three things the farm agrees on were only ever stored in the browser of whichever phone
   edited them, with no way out:

     cloneprice / pricemeta   the daily spot matrix. The Owner re-set it every morning and
                              Marketing kept invoicing Default Cash at whatever it last had.
     baskets / tareok         the empty-basket weights. Tare comes off EVERY load, so the
                              day the real figures are keyed is the day every other phone
                              starts calculating wrongly - and these are still placeholders.
     addtrees                 orchard expansion. A tree that exists on one phone only cannot
                              be selected by the worker standing at it.

   Same shape as the v3.5 divergence bug: information travelling one direction only.

   ONE ROW PER SETTING, keyed by name, not by uuid - a setting is a current value, not an
   event, so it is the one thing in this system that is deliberately overwritten rather than
   appended. The append-only rule still governs the LOG; this tab is the farm's dial
   positions.

   NEWEST WRITE WINS, and an older one is REFUSED. A phone that was offline all morning and
   syncs at noon must not push its 6am price matrix over the Owner's 11am correction. That
   is the one rule protecting this from being worse than no sync at all.
   ====================================================================================== */
var SET_HEAD = ['key', 'value_json', 'updated_at', 'updated_by', 'role', 'device'];
var SETTINGS_ALLOWED = ['cloneprice', 'pricemeta', 'baskets', 'tareok', 'addtrees'];

function saveSettings_(map) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('SETTINGS');
  if (!sh) {
    sh = ss.insertSheet('SETTINGS');
    sh.appendRow(SET_HEAD);
    sh.getRange(1, 1, 1, SET_HEAD.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  ensureHead_(sh, SET_HEAD);

  var vals = sh.getDataRange().getValues();
  var head = vals[0].map(function (v) { return String(v).trim(); });
  var kI = head.indexOf('key'), tI = head.indexOf('updated_at');
  var rowOf = {};
  for (var r = 1; r < vals.length; r++) {
    var k = String(vals[r][kI] || '').trim();
    if (k) rowOf[k] = { row: r + 1, at: String(vals[r][tI] || '') };
  }

  var wrote = 0, refused = [], newRows = [];
  for (var key in map) {
    if (SETTINGS_ALLOWED.indexOf(key) < 0) { refused.push(key + ' (not a shared setting)'); continue; }
    var inc = map[key] || {};
    var at = String(inc.updated_at || '');
    if (!at) { refused.push(key + ' (no timestamp)'); continue; }
    var row = {
      key: key,
      value_json: (typeof inc.value === 'string') ? inc.value : JSON.stringify(inc.value),
      updated_at: at,
      updated_by: String(inc.updated_by || ''),
      role: String(inc.role || ''),
      device: String(inc.device || '')
    };
    if (String(row.value_json).length > CELL_MAX) { refused.push(key + ' (too large for one cell)'); continue; }
    var cur = rowOf[key];
    if (cur) {
      // an older edit NEVER overwrites a newer one
      if (at < cur.at) { refused.push(key + ' (older than the stored value)'); continue; }
      sh.getRange(cur.row, 1, 1, SET_HEAD.length)
        .setValues([SET_HEAD.map(function (h) { return row[h] === undefined ? '' : row[h]; })]);
      wrote++;
    } else {
      newRows.push(SET_HEAD.map(function (h) { return row[h] === undefined ? '' : row[h]; }));
      rowOf[key] = { row: 0, at: at };
      wrote++;
    }
  }
  if (newRows.length)
    sh.getRange(sh.getLastRow() + 1, 1, newRows.length, SET_HEAD.length).setValues(newRows);
  return { ok: true, settings: true, wrote: wrote, refused: refused };
}

/** Every shared setting, with who set it and when. Small - a few KB at most. */
function readSettings_(ss) {
  var out = {};
  var sh = ss.getSheetByName('SETTINGS');
  if (!sh || sh.getLastRow() < 2) return out;
  var vals = sh.getDataRange().getValues();
  var head = vals[0].map(function (v) { return String(v).trim(); });
  var kI = head.indexOf('key'), vI = head.indexOf('value_json'),
      tI = head.indexOf('updated_at'), bI = head.indexOf('updated_by'),
      rI = head.indexOf('role');
  if (kI < 0 || vI < 0) return out;
  for (var r = 1; r < vals.length; r++) {
    var k = String(vals[r][kI] || '').trim();
    if (!k || SETTINGS_ALLOWED.indexOf(k) < 0) continue;
    var raw = String(vals[r][vI] || '');
    var parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) { continue; }   // unreadable row is skipped, not served
    out[k] = {
      value: parsed,
      updated_at: tI >= 0 ? String(vals[r][tI] || '') : '',
      updated_by: bI >= 0 ? String(vals[r][bI] || '') : '',
      role: rI >= 0 ? String(vals[r][rI] || '') : ''
    };
  }
  return out;
}

function readRetailers_(ss) {
  var sh = ss.getSheetByName('RETAILERS');
  if (!sh || sh.getLastRow() < 2) return [];
  var vals = sh.getDataRange().getValues();
  var out = [];
  for (var r = 1; r < vals.length; r++) {
    if (!vals[r][0] && !vals[r][1]) continue;
    out.push({ id: String(vals[r][0] || vals[r][1]).trim(),
               name: String(vals[r][1] || vals[r][0]).trim(),
               contact: String(vals[r][2] || ''),
               opening_credit_rm: +vals[r][3] || 0,
               status: String(vals[r][4] || 'Active'),
               // v3.6 - blank on a sheet that predates these columns. The app treats a
               // blank as "no opinion" and keeps whatever mode that phone already had,
               // rather than silently moving a contract merchant onto the daily trend.
               pricing: String(vals[r][5] || ''),
               contract: String(vals[r][6] || '') });
  }
  return out;
}

/** v2.9  -  one row per tying round, carrying the rope it drew from the store. */
function saveTying_(list) {
  var r = upsertByUuid_('TYING_LOGS', TIE_HEAD, list);
  return { ok: true, tying: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}
/** v2.9  -  an Owner-approved correction to a tying round. The original row is kept. */
function saveTieAdj_(list) {
  var r = upsertByUuid_('TIE_ADJUST', TADJ_HEAD, list);
  return { ok: true, tieadj: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}
/** v2.9  -  marketing sales, logged against fruit already collected. */
function saveSales_(list) {
  var r = upsertByUuid_('SALES', SALE_HEAD, list);
  return { ok: true, sales: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}
var LADJ_HEAD = ['uuid', 'dt', 'type', 'evUuid', 'corrId', 'tree', 'lot', 'clone',
                 'was', 'now', 'delta', 'estkg', 'reason', 'requestedBy', 'approvedBy',
                 // v3.5 - without these two the farm-wide totals cannot tell a secured
                 // drop correction from an untied one, or a tied rot from an untied rot.
                 'secured', 'tied'];

/**
 * v2.8  -  rotten fruit. Every row carries the cause the worker had to choose; a count with
 * no cause never leaves the phone, so this tab is always analysable by reason of loss.
 */
function saveRotten_(list) {
  var r = upsertByUuid_('ROTTEN_LOGS', ROT_HEAD, list);
  return { ok: true, rotten: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}

/**
 * v2.8  -  an Owner-approved correction to a drop or rotten count. The original DROP_LOGS /
 * ROTTEN_LOGS row is left exactly as the worker filed it; this tab holds the signed delta,
 * who asked for it and who approved it. Sum the base row and its deltas for the true count.
 */
function saveLogAdj_(list) {
  var r = upsertByUuid_('LOG_ADJUST', LADJ_HEAD, list);
  return { ok: true, logadj: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}

/**
 * v2.7  -  daily rainfall, one row per date. The app sends the whole record again when
 * a reading is corrected, and upsertByUuid_ overwrites that day's row rather than
 * appending a second one, so the RAIN tab always holds one truth per morning.
 */
function saveRain_(list) {
  var r = upsertByUuid_('RAIN', RAIN_HEAD, list);
  return { ok: true, rain: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}

function saveTasks_(list) {
  var r = upsertByUuid_('TASKS', TASK_HEAD, list);
  return { ok: true, tasks: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}
function saveTaskLogs_(list) {
  // completions are append-only in spirit, but upserting by uuid makes a retry harmless
  var r = upsertByUuid_('TASK_LOGS', TLOG_HEAD, list);
  return { ok: true, tasklogs: true, appended: r.appended, updated: r.updated, skipped: r.skipped };
}
function readTasks_(ss) {
  var sh = ss.getSheetByName('TASKS');
  if (!sh || sh.getLastRow() < 2) return [];
  var start = Math.max(2, sh.getLastRow() - 119);
  var n = sh.getLastRow() - start + 1;
  var vals = sh.getRange(start, 1, n, TASK_HEAD.length).getValues();
  var out = [];
  for (var i = 0; i < vals.length; i++) {
    if (!vals[i][0]) continue;
    var o = {};
    for (var c = 0; c < TASK_HEAD.length; c++) {
      var v = vals[i][c];
      o[TASK_HEAD[c]] = (v instanceof Date)
        ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd') : v;
    }
    out.push(o);
  }
  return out;
}

/**
 * Upsert by uuid. The Owner activates a phase on their phone; every worker phone
 * reads it back through doGet and shows it in Today's Tasks. `lines` is stored as a
 * JSON string in one cell so the sheet stays one row per programme.
 * Programmes arrive under their own payload key, so an Apps Script that predates
 * v2.5 replies without `programs:true` and the phone simply keeps them queued.
 */
function savePrograms_(list) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('PROGRAMS');
  if (!sh) {
    sh = ss.insertSheet('PROGRAMS');
    sh.appendRow(PROG_HEAD);
    sh.getRange(1, 1, 1, PROG_HEAD.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  ensureHead_(sh, PROG_HEAD);          // v2.6 added startDate / durDays / weather / header
  var vals = sh.getDataRange().getValues();
  var rowOf = {};
  for (var r = 1; r < vals.length; r++) if (vals[r][0]) rowOf[String(vals[r][0])] = r;

  var appended = 0, updated = 0, skipped = 0, newRows = [];
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (!p || !p.uuid) { skipped++; continue; }
    var row = PROG_HEAD.map(function (k) {
      if (k === 'lines') return JSON.stringify(p.lines || []);
      return (p[k] === undefined || p[k] === null) ? '' : p[k];
    });
    var r2 = rowOf[String(p.uuid)];
    if (r2 === undefined) { newRows.push(row); appended++; }
    else { sh.getRange(r2 + 1, 1, 1, PROG_HEAD.length).setValues([row]); updated++; }
  }
  if (newRows.length) {
    sh.getRange(sh.getLastRow() + 1, 1, newRows.length, PROG_HEAD.length).setValues(newRows);
  }
  return { ok: true, programs: true, appended: appended, updated: updated, skipped: skipped };
}

/** Most recent 120 programme rows  -  small enough for a phone on 3G. */
function readPrograms_(ss) {
  var sh = ss.getSheetByName('PROGRAMS');
  if (!sh || sh.getLastRow() < 2) return [];
  var start = Math.max(2, sh.getLastRow() - 119);
  var n = sh.getLastRow() - start + 1;
  var vals = sh.getRange(start, 1, n, PROG_HEAD.length).getValues();
  var out = [];
  for (var i = 0; i < vals.length; i++) {
    if (!vals[i][0]) continue;
    var o = {};
    for (var c = 0; c < PROG_HEAD.length; c++) {
      var v = vals[i][c];
      o[PROG_HEAD[c]] = (v instanceof Date)
        ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm') : v;
    }
    out.push(o);
  }
  return out;
}

// ---------- user registry (WORKERS tab) ----------

/**
 * Mirrors the Owner's in-app registry into the WORKERS tab.
 * The app is the master: rows are matched on WorkerID (falling back to Name),
 * updated in place, appended when new, and marked Status=Deleted when the Owner
 * removed them. Rows without an AccessKey (e.g. casual labour) are never touched.
 */
function saveRegistry_(registry) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('WORKERS');
  if (!sh) return { ok: false, error: 'WORKERS sheet not found' };

  var vals = sh.getDataRange().getValues();
  var hRow = headerRow_(vals, 'WorkerID');          // 0-based index of the header row
  var head = vals[hRow].map(function (h) { return String(h).trim(); });

  // make sure the four governance columns exist
  ['WorkerID', 'Name', 'Role', 'AccessKey', 'Status'].forEach(function (c) {
    if (head.indexOf(c) === -1) { head.push(c); sh.getRange(hRow + 1, head.length).setValue(c); }
  });
  var col = {};
  head.forEach(function (h, i) { col[h] = i; });

  // index existing rows
  var rowOf = {}, nameOf = {};
  for (var r = hRow + 1; r < vals.length; r++) {
    var id = String(vals[r][col.WorkerID] || '').trim();
    var nm = String(vals[r][col.Name] || '').trim().toLowerCase();
    if (id) rowOf[id] = r;
    if (nm) nameOf[nm] = r;
  }

  var keep = {}, appended = 0, updated = 0, deleted = 0;
  var newRows = [];

  registry.forEach(function (u) {
    var id = String(u.id || '').trim();
    var nm = String(u.name || '').trim();
    var r = rowOf.hasOwnProperty(id) ? rowOf[id] : nameOf[nm.toLowerCase()];
    if (r === undefined) {
      var row = new Array(head.length).fill('');
      row[col.WorkerID] = id || ('U' + (registry.indexOf(u) + 1));
      row[col.Name] = nm;
      row[col.Role] = u.role;
      row[col.AccessKey] = "'" + String(u.key);   // leading quote keeps 019304 intact
      row[col.Status] = u.status;
      newRows.push(row);
      appended++;
    } else {
      keep[r] = true;
      sh.getRange(r + 1, col.WorkerID + 1).setValue(id || vals[r][col.WorkerID]);
      sh.getRange(r + 1, col.Name + 1).setValue(nm);
      sh.getRange(r + 1, col.Role + 1).setValue(u.role);
      sh.getRange(r + 1, col.AccessKey + 1).setValue("'" + String(u.key));
      sh.getRange(r + 1, col.Status + 1).setValue(u.status);
      updated++;
    }
  });

  // anyone who HAD a key but is no longer in the registry was deleted by the Owner
  for (var r2 = hRow + 1; r2 < vals.length; r2++) {
    if (keep[r2]) continue;
    var hadKey = String(vals[r2][col.AccessKey] || '').trim();
    if (!hadKey) continue;                       // no key = not an app user, leave alone
    if (String(vals[r2][col.Status] || '').trim() === 'Deleted') continue;
    sh.getRange(r2 + 1, col.Status + 1).setValue('Deleted');
    deleted++;
  }

  if (newRows.length) {
    sh.getRange(sh.getLastRow() + 1, 1, newRows.length, head.length).setValues(newRows);
  }
  return { ok: true, appended: appended, updated: updated, deleted: deleted };
}

function headerRow_(vals, firstCol) {
  for (var i = 0; i < Math.min(vals.length, 5); i++) {
    if (String(vals[i][0]).trim().indexOf(firstCol) === 0) return i;
  }
  return vals.length > 1 ? 1 : 0;   // row 1 is usually a note line
}

// ---------- helpers ----------

/** UUID index kept on a hidden sheet  -  O(1) dedupe without rescanning data sheets. */
function getSeenUuids_(ss) {
  var sh = ss.getSheetByName('SYNC_INDEX');
  if (!sh) { sh = ss.insertSheet('SYNC_INDEX'); sh.hideSheet(); sh.appendRow(['uuid']); }
  var vals = sh.getDataRange().getValues();
  var seen = {};
  for (var i = 1; i < vals.length; i++) if (vals[i][0]) seen[vals[i][0]] = 'old';
  return seen;
}

function saveSeenUuids_(ss, seen) {
  var sh = ss.getSheetByName('SYNC_INDEX');
  var fresh = [];
  for (var u in seen) if (seen[u] === true) fresh.push([u]); // only newly added this call
  if (fresh.length) sh.getRange(sh.getLastRow() + 1, 1, fresh.length, 1).setValues(fresh);
}

function tableToObjects_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) return [];
  var vals = sh.getDataRange().getValues();
  if (vals.length < 2) return [];
  // header row is row 2 when row 1 is the note line
  var hIdx = (String(vals[0][0]).indexOf('TreeID') === 0 || String(vals[0][0]).indexOf('ProductID') === 0 || String(vals[0][0]).indexOf('WorkerID') === 0) ? 0 : 1;
  var head = vals[hIdx];
  var out = [];
  for (var r = hIdx + 1; r < vals.length; r++) {
    if (!vals[r][0]) continue;
    var o = {};
    for (var c = 0; c < head.length; c++) if (head[c]) o[head[c]] = vals[r][c];
    out.push(o);
  }
  return out;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// END OF FILE v3.11.0
