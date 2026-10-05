/* v3.41.5 — THE DURIAN. The harvest icon was a MANGO emoji: there is no durian in
   Unicode, so every screen that means "fruit off our own trees" was showing somebody
   else's fruit. IC_DUR is a drawing, not a font character — it renders the same on
   every phone, needs no network and no image file. It lives HERE because database.js
   loads first, so both files can use it at parse time.
   ⛔ IT IS HTML. It may go anywhere innerHTML is written (esc() protects it — see
   esc() in app.js) but NEVER inside an <option>, a title="" or a textContent — those
   cannot draw and would print the markup. That is why SEASON_STAGES keeps an emoji. */
const IC_DUR='<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="duric" role="img" aria-label="durian"><path d="M29.6 3.5h5a2.2 2.2 0 0 1 2.2 2.2V19h-9.4V5.7a2.2 2.2 0 0 1 2.2-2.2z" fill="#6b4a1f"/><rect x="27.4" y="3.5" width="3.2" height="15.5" rx="1.6" fill="#000" opacity=".14"/><polygon points="30.7,18.2 32.0,11.0 33.3,18.2 37.2,18.9 41.0,12.7 39.7,19.9 43.1,22.0 48.8,17.7 45.1,23.9 47.5,27.1 54.4,25.1 48.7,29.6 49.7,33.4 56.9,34.1 50.0,36.2 49.6,40.2 56.0,43.5 48.9,42.8 47.1,46.4 52.0,51.9 45.5,48.6 42.6,51.3 45.2,58.2 40.3,52.8 36.6,54.2 36.6,61.6 34.0,54.7 30.0,54.7 27.4,61.6 27.4,54.2 23.7,52.8 18.8,58.2 21.4,51.3 18.5,48.6 12.0,51.9 16.9,46.4 15.1,42.8 8.0,43.5 14.4,40.2 14.0,36.2 7.1,34.1 14.3,33.4 15.3,29.6 9.6,25.1 16.5,27.1 18.9,23.9 15.2,17.7 20.9,22.0 24.3,19.9 23.0,12.7 26.8,18.9" fill="#8caa4e" stroke="#4f6b28" stroke-width="1.2" stroke-linejoin="round"/><ellipse cx="24" cy="27" rx="10" ry="11" fill="#ffffff" opacity=".13"/><path d="M25.4 24.6L23.7 29.2L27.1 29.2Z" fill="#c9d98c"/><path d="M25.4 24.6L27.1 29.2L25.4 29.2Z" fill="#6f8c3c"/><path d="M32.0 24.6L30.3 29.2L33.7 29.2Z" fill="#c9d98c"/><path d="M32.0 24.6L33.7 29.2L32.0 29.2Z" fill="#6f8c3c"/><path d="M38.6 24.6L36.9 29.2L40.3 29.2Z" fill="#c9d98c"/><path d="M38.6 24.6L40.3 29.2L38.6 29.2Z" fill="#6f8c3c"/><path d="M22.1 31.3L20.4 35.9L23.8 35.9Z" fill="#c9d98c"/><path d="M22.1 31.3L23.8 35.9L22.1 35.9Z" fill="#6f8c3c"/><path d="M28.7 31.3L27.0 35.9L30.4 35.9Z" fill="#c9d98c"/><path d="M28.7 31.3L30.4 35.9L28.7 35.9Z" fill="#6f8c3c"/><path d="M35.3 31.3L33.6 35.9L37.0 35.9Z" fill="#c9d98c"/><path d="M35.3 31.3L37.0 35.9L35.3 35.9Z" fill="#6f8c3c"/><path d="M41.9 31.3L40.2 35.9L43.6 35.9Z" fill="#c9d98c"/><path d="M41.9 31.3L43.6 35.9L41.9 35.9Z" fill="#6f8c3c"/><path d="M18.8 38.1L17.1 42.7L20.5 42.7Z" fill="#c9d98c"/><path d="M18.8 38.1L20.5 42.7L18.8 42.7Z" fill="#6f8c3c"/><path d="M25.4 38.1L23.7 42.7L27.1 42.7Z" fill="#c9d98c"/><path d="M25.4 38.1L27.1 42.7L25.4 42.7Z" fill="#6f8c3c"/><path d="M32.0 38.1L30.3 42.7L33.7 42.7Z" fill="#c9d98c"/><path d="M32.0 38.1L33.7 42.7L32.0 42.7Z" fill="#6f8c3c"/><path d="M38.6 38.1L36.9 42.7L40.3 42.7Z" fill="#c9d98c"/><path d="M38.6 38.1L40.3 42.7L38.6 42.7Z" fill="#6f8c3c"/><path d="M45.2 38.1L43.5 42.7L46.9 42.7Z" fill="#c9d98c"/><path d="M45.2 38.1L46.9 42.7L45.2 42.7Z" fill="#6f8c3c"/><path d="M22.1 44.8L20.4 49.4L23.8 49.4Z" fill="#c9d98c"/><path d="M22.1 44.8L23.8 49.4L22.1 49.4Z" fill="#6f8c3c"/><path d="M28.7 44.8L27.0 49.4L30.4 49.4Z" fill="#c9d98c"/><path d="M28.7 44.8L30.4 49.4L28.7 49.4Z" fill="#6f8c3c"/><path d="M35.3 44.8L33.6 49.4L37.0 49.4Z" fill="#c9d98c"/><path d="M35.3 44.8L37.0 49.4L35.3 49.4Z" fill="#6f8c3c"/><path d="M41.9 44.8L40.2 49.4L43.6 49.4Z" fill="#c9d98c"/><path d="M41.9 44.8L43.6 49.4L41.9 49.4Z" fill="#6f8c3c"/><polygon points="32.0,46.7 32.8,49.0 35.2,49.0 33.3,50.5 34.0,52.8 32.0,51.5 30.0,52.8 30.7,50.5 28.8,49.0 31.2,49.0" fill="#3d2a0c" opacity=".55"/></svg>';
/* =====================================================================
   Sugut DMS — database.js
   S.H.A. Hup Aik Plantation Sdn Bhd · Sugut Durian Farm
   ---------------------------------------------------------------------
   RAW STRUCTURAL DATA ONLY. No functions, no DOM, no event listeners.
   This file MUST be loaded BEFORE app.js — every calculation in app.js
   reads from the arrays and lookup tables declared here.

     <script src="database.js"></script>   <-- first
     <script src="app.js"></script>        <-- second

   Contents
     1. Tree census .......... TREE_MASTER (171 trees: A 65 · B 66 · C 40), clones
     2. Material registry .... INVENTORY_RECON (68 products + active ingredient)
                             stock re-synced to the farm sheet 05/08/2026
     3. Programme sheet ...... PHASE_PROGRAM (monthly sets, doses, plan dates)
     4. Access registry ...... DEFAULT_KEYS, ROLE_TABS, WORKERS
     5. Historical logs ...... stock in / out / adjust ledger arrays
     6. Lookup tables ........ months, modes, systemic vs contact AI,
                               blueprint categories, general task types
   ===================================================================== */

const TREE_MASTER=[{"id":"A-001","lot":"A","no":1,"clone":"MK","census":null},{"id":"A-002","lot":"A","no":2,"clone":"MK","census":null},{"id":"A-003","lot":"A","no":3,"clone":"MK","census":null},{"id":"A-004","lot":"A","no":4,"clone":"MK","census":null},{"id":"A-005","lot":"A","no":5,"clone":"MK","census":3},{"id":"A-006","lot":"A","no":6,"clone":"B24","census":null},{"id":"A-007","lot":"A","no":7,"clone":"MK","census":1},{"id":"A-008","lot":"A","no":8,"clone":"MK","census":16},{"id":"A-009","lot":"A","no":9,"clone":"MK","census":20},{"id":"A-010","lot":"A","no":10,"clone":"MK","census":7},{"id":"A-011","lot":"A","no":11,"clone":"MK","census":18},{"id":"A-012","lot":"A","no":12,"clone":"MK","census":15},{"id":"A-013","lot":"A","no":13,"clone":"B24","census":35},{"id":"A-014","lot":"A","no":14,"clone":"MK","census":null},{"id":"A-015","lot":"A","no":15,"clone":"MK","census":null},{"id":"A-016","lot":"A","no":16,"clone":"MK","census":null},{"id":"A-017","lot":"A","no":17,"clone":"MK","census":null},{"id":"A-018","lot":"A","no":18,"clone":"MK","census":null},{"id":"A-019","lot":"A","no":19,"clone":"MK","census":null},{"id":"A-020","lot":"A","no":20,"clone":"MK","census":null},{"id":"A-021","lot":"A","no":21,"clone":"MK","census":null},{"id":"A-022","lot":"A","no":22,"clone":"MK","census":null},{"id":"A-023","lot":"A","no":23,"clone":"B24","census":10},{"id":"A-024","lot":"A","no":24,"clone":"MK","census":null},{"id":"A-025","lot":"A","no":25,"clone":"MK","census":null},{"id":"A-026","lot":"A","no":26,"clone":"MK","census":29},{"id":"A-027","lot":"A","no":27,"clone":"MK","census":20},{"id":"A-028","lot":"A","no":28,"clone":"MK","census":null},{"id":"A-029","lot":"A","no":29,"clone":"MK","census":null},{"id":"A-030","lot":"A","no":30,"clone":"MK","census":null},{"id":"A-031","lot":"A","no":31,"clone":"MK","census":null},{"id":"A-032","lot":"A","no":32,"clone":"MK","census":3},{"id":"A-033","lot":"A","no":33,"clone":"MK","census":null},{"id":"A-034","lot":"A","no":34,"clone":"B24","census":null},{"id":"A-035","lot":"A","no":35,"clone":"MK","census":17},{"id":"A-036","lot":"A","no":36,"clone":"B24","census":null},{"id":"A-037","lot":"A","no":37,"clone":"MK","census":null},{"id":"A-038","lot":"A","no":38,"clone":"MK","census":null},{"id":"A-039","lot":"A","no":39,"clone":"MK","census":null},{"id":"A-040","lot":"A","no":40,"clone":"MK","census":null},{"id":"A-041","lot":"A","no":41,"clone":"MK","census":null},{"id":"A-042","lot":"A","no":42,"clone":"MK","census":null},{"id":"A-043","lot":"A","no":43,"clone":"MK","census":null},{"id":"A-044","lot":"A","no":44,"clone":"MK","census":null},{"id":"A-045","lot":"A","no":45,"clone":"MK","census":null},{"id":"A-046","lot":"A","no":46,"clone":"MK","census":null},{"id":"A-047","lot":"A","no":47,"clone":"MK","census":null},{"id":"A-048","lot":"A","no":48,"clone":"MK","census":null},{"id":"A-049","lot":"A","no":49,"clone":"MK","census":null},{"id":"A-050","lot":"A","no":50,"clone":"MK","census":null},{"id":"A-051","lot":"A","no":51,"clone":"MK","census":1},{"id":"A-052","lot":"A","no":52,"clone":"MK","census":null},{"id":"A-053","lot":"A","no":53,"clone":"MK","census":null},{"id":"A-054","lot":"A","no":54,"clone":"MK","census":null},{"id":"A-055","lot":"A","no":55,"clone":"MK","census":null},{"id":"A-056","lot":"A","no":56,"clone":"MK","census":null},{"id":"A-057","lot":"A","no":57,"clone":"MK","census":11},{"id":"A-058","lot":"A","no":58,"clone":"MK","census":null},{"id":"A-059","lot":"A","no":59,"clone":"MK","census":null},{"id":"A-060","lot":"A","no":60,"clone":"MK","census":null},{"id":"A-061","lot":"A","no":61,"clone":"B24","census":null},{"id":"A-062","lot":"A","no":62,"clone":"MK","census":null},{"id":"A-063","lot":"A","no":63,"clone":"MK","census":7},{"id":"A-064","lot":"A","no":64,"clone":"MK","census":null},{"id":"A-065","lot":"A","no":65,"clone":"MK","census":null},{"id":"B-001","lot":"B","no":1,"clone":"B24","census":13},{"id":"B-002","lot":"B","no":2,"clone":"MK","census":69},{"id":"B-003","lot":"B","no":3,"clone":"MK","census":70},{"id":"B-004","lot":"B","no":4,"clone":"MK","census":70},{"id":"B-005","lot":"B","no":5,"clone":"MK","census":65},{"id":"B-006","lot":"B","no":6,"clone":"MK","census":65},{"id":"B-007","lot":"B","no":7,"clone":"MK","census":68},{"id":"B-008","lot":"B","no":8,"clone":"MK","census":55},{"id":"B-009","lot":"B","no":9,"clone":"MK","census":69},{"id":"B-010","lot":"B","no":10,"clone":"MK","census":67},{"id":"B-011","lot":"B","no":11,"clone":"BT","census":19},{"id":"B-012","lot":"B","no":12,"clone":"MK","census":null},{"id":"B-013","lot":"B","no":13,"clone":"MK","census":null},{"id":"B-014","lot":"B","no":14,"clone":"MK","census":1},{"id":"B-015","lot":"B","no":15,"clone":"MK","census":1},{"id":"B-016","lot":"B","no":16,"clone":"MK","census":null},{"id":"B-017","lot":"B","no":17,"clone":"MK","census":null},{"id":"B-018","lot":"B","no":18,"clone":"MK","census":null},{"id":"B-019","lot":"B","no":19,"clone":"MK","census":null},{"id":"B-020","lot":"B","no":20,"clone":"MK","census":null},{"id":"B-021","lot":"B","no":21,"clone":"MK","census":1},{"id":"B-022","lot":"B","no":22,"clone":"MK","census":17},{"id":"B-023","lot":"B","no":23,"clone":"MK","census":48},{"id":"B-024","lot":"B","no":24,"clone":"MK","census":22},{"id":"B-025","lot":"B","no":25,"clone":"MK","census":56},{"id":"B-026","lot":"B","no":26,"clone":"MK","census":64},{"id":"B-027","lot":"B","no":27,"clone":"MK","census":62},{"id":"B-028","lot":"B","no":28,"clone":"MK","census":59},{"id":"B-029","lot":"B","no":29,"clone":"MK","census":59},{"id":"B-030","lot":"B","no":30,"clone":"MK","census":45},{"id":"B-031","lot":"B","no":31,"clone":"101","census":20},{"id":"B-032","lot":"B","no":32,"clone":"101","census":null},{"id":"B-033","lot":"B","no":33,"clone":"101","census":40},{"id":"B-034","lot":"B","no":34,"clone":"101","census":null},{"id":"B-035","lot":"B","no":35,"clone":"101","census":null},{"id":"B-036","lot":"B","no":36,"clone":"101","census":40},{"id":"B-037","lot":"B","no":37,"clone":"101","census":40},{"id":"B-038","lot":"B","no":38,"clone":"101","census":35},{"id":"B-039","lot":"B","no":39,"clone":"101","census":35},{"id":"B-040","lot":"B","no":40,"clone":"101","census":35},{"id":"B-041","lot":"B","no":41,"clone":"101","census":35},{"id":"B-042","lot":"B","no":42,"clone":"MK","census":14},{"id":"B-043","lot":"B","no":43,"clone":"MK","census":32},{"id":"B-044","lot":"B","no":44,"clone":"MK","census":48},{"id":"B-045","lot":"B","no":45,"clone":"BT","census":68},{"id":"B-046","lot":"B","no":46,"clone":"BT","census":34},{"id":"B-047","lot":"B","no":47,"clone":"MK","census":52},{"id":"B-048","lot":"B","no":48,"clone":"MK","census":26},{"id":"B-049","lot":"B","no":49,"clone":"MK","census":8},{"id":"B-050","lot":"B","no":50,"clone":"TB","census":null},{"id":"B-051","lot":"B","no":51,"clone":"MK","census":19},{"id":"B-052","lot":"B","no":52,"clone":"MK","census":13},{"id":"B-053","lot":"B","no":53,"clone":"B24","census":40},{"id":"B-054","lot":"B","no":54,"clone":"MK","census":63},{"id":"B-055","lot":"B","no":55,"clone":"MK","census":27},{"id":"B-056","lot":"B","no":56,"clone":"B24","census":109},{"id":"B-057","lot":"B","no":57,"clone":"UM","census":8},{"id":"B-058","lot":"B","no":58,"clone":"MK","census":61},{"id":"B-059","lot":"B","no":59,"clone":"MK","census":25},{"id":"B-060","lot":"B","no":60,"clone":"MK","census":10},{"id":"B-061","lot":"B","no":61,"clone":"MK","census":3},{"id":"B-062","lot":"B","no":62,"clone":"MK","census":16},{"id":"B-063","lot":"B","no":63,"clone":"MK","census":2},{"id":"B-064","lot":"B","no":64,"clone":"B24","census":24},{"id":"B-065","lot":"B","no":65,"clone":"MK","census":5},{"id":"B-066","lot":"B","no":66,"clone":"MK","census":null},{"id":"C-001","lot":"C","no":1,"clone":"MK","census":null},{"id":"C-002","lot":"C","no":2,"clone":"MK","census":null},{"id":"C-003","lot":"C","no":3,"clone":"MK","census":null},{"id":"C-004","lot":"C","no":4,"clone":"MK","census":null},{"id":"C-005","lot":"C","no":5,"clone":"MK","census":14},{"id":"C-006","lot":"C","no":6,"clone":"MK","census":5},{"id":"C-007","lot":"C","no":7,"clone":"MK","census":null},{"id":"C-008","lot":"C","no":8,"clone":"MK","census":35},{"id":"C-009","lot":"C","no":9,"clone":"MK","census":1},{"id":"C-010","lot":"C","no":10,"clone":"MK","census":2},{"id":"C-011","lot":"C","no":11,"clone":"MK","census":7},{"id":"C-012","lot":"C","no":12,"clone":"MK","census":null},{"id":"C-013","lot":"C","no":13,"clone":"MK","census":31},{"id":"C-014","lot":"C","no":14,"clone":"MK","census":7},{"id":"C-015","lot":"C","no":15,"clone":"MK","census":58},{"id":"C-016","lot":"C","no":16,"clone":"MK","census":2},{"id":"C-017","lot":"C","no":17,"clone":"BT","census":21},{"id":"C-018","lot":"C","no":18,"clone":"MK","census":43},{"id":"C-019","lot":"C","no":19,"clone":"MK","census":null},{"id":"C-020","lot":"C","no":20,"clone":"MK","census":25},{"id":"C-021","lot":"C","no":21,"clone":"MK","census":3},{"id":"C-022","lot":"C","no":22,"clone":"MK","census":6},{"id":"C-023","lot":"C","no":23,"clone":"MK","census":null},{"id":"C-024","lot":"C","no":24,"clone":"MK","census":1},{"id":"C-025","lot":"C","no":25,"clone":"MK","census":null},{"id":"C-026","lot":"C","no":26,"clone":"MK","census":null},{"id":"C-027","lot":"C","no":27,"clone":"MK","census":null},{"id":"C-028","lot":"C","no":28,"clone":"TB","census":null},{"id":"C-029","lot":"C","no":29,"clone":"MK","census":19},{"id":"C-030","lot":"C","no":30,"clone":"MK","census":4},{"id":"C-031","lot":"C","no":31,"clone":"MK","census":null},{"id":"C-032","lot":"C","no":32,"clone":"MK","census":71},{"id":"C-033","lot":"C","no":33,"clone":"MK","census":null},{"id":"C-034","lot":"C","no":34,"clone":"MK","census":7},{"id":"C-035","lot":"C","no":35,"clone":"MK","census":34},{"id":"C-036","lot":"C","no":36,"clone":"MK","census":23},{"id":"C-037","lot":"C","no":37,"clone":"MK","census":8},{"id":"C-038","lot":"C","no":38,"clone":"MK","census":null},{"id":"C-039","lot":"C","no":39,"clone":"MK","census":10},{"id":"C-040","lot":"C","no":40,"clone":"MK","census":null}];

// TREE_MASTER is the single source of truth for all 171 trees — Lot A 65 · Lot B 66 · Lot C 40,
// confirmed by the Owner on 2 Aug 2026. C-041…C-047 were empty rows carried in from the census
// import (no clone, no count, no fruit) and were removed; the Lot C census total of 437 is unchanged.
// TREES is kept as an alias so every Phase-1 call site keeps working; both names
// point at the SAME array, so an Owner-approved correction updates the whole app.
const TREES=TREE_MASTER;

/* v3.70.0 - ONE LIST, NOT TWO. This was a hand-kept duplicate of CLONE_SELL_ORDER
   (line ~719) and it was used in exactly one place: the tree-correction clone picker.
   Adding a clone to one list and not the other gave you a clone the crew could pick at
   the tree but that was invisible at the scale, or the reverse. Derived now, so that
   cannot happen again. Add a clone in CLONE_SELL_ORDER and it appears in both. */
var CLONES;   // assigned from CLONE_SELL_ORDER below - see the note there (var, not const: it is filled in later in this file)

/* v3.70.0 (1 Sep 2026) - THE TRADE NAMES, ON THE OWNER'S LIST.
   NAMES ONLY. Not one CODE changed, and that is the whole point: the clone code is
   stamped into every drop, tying, rotten, dispatch and FOC row ever written, into the
   lines_json of every invoice, and into the contract books of RT-01, RT-02 and RT-05.
   Rename a CODE and every one of those rows stops matching CLONE_GRADES, hasGrade()
   returns false, priceOf() returns RM 0 and the tally splits into two columns. Rename
   the LABEL and nothing detaches.
     B24  is the farm's Sultan. Owner confirmed 1 Sep 2026 that B24 and D24 are the same
          clone, so it keeps the code B24 and simply reads D24 Sultan from here on.
     UM   Udang Merah IS Red Prawn - one clone, two languages, never two rows.
     TB   still means UNIDENTIFIED (B-050, C-028). It does NOT mean Tenom Beauty; Tenom
          Beauty is TNB below. If those two trees turn out to be Tenom Beauty, move them
          with a tree correction - do not repoint this code. */
const CLONE_NAME={MK:'Musang King (D197)',BT:'Black Thorn (D200)',B24:'D24 Sultan',
  '101':'D101',UM:'Red Prawn / Udang Merah (D175)',TB:'TB (unverified)',
  GP:'Golden Phoenix (D198)',XO:'XO (D168)',D99:'D99',TNB:'Tenom Beauty (D236)',
  '':'Not recorded'};

const LOTS=['A','B','C'];

const INVENTORY_RECON=[{"id":1,"name":"Amotan 22.8SC","active_ingredient":"Azoxystrobin","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":105,"cpu":0.21,"min_stock_threshold":500,"stock":7000},{"id":2,"name":"Cypermethrin 5.5 (Kencis)","active_ingredient":"Cypermethrin 5.5%","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":18,"cpu":0.018,"min_stock_threshold":1000,"stock":17000},{"id":3,"name":"Fipronil (Rainnil)","active_ingredient":"Fipronil","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":70,"cpu":0.07,"min_stock_threshold":1000,"stock":14000},{"id":4,"name":"Madell","active_ingredient":"Carbosulfan","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":88,"cpu":0.088,"min_stock_threshold":1000,"stock":6000},{"id":5,"name":"Abamectin (Envoy)","active_ingredient":"Abamectin","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":45,"cpu":0.045,"min_stock_threshold":1000,"stock":18000},{"id":6,"name":"Mancozeb (Raincozeb 80WB)","active_ingredient":"Mancozeb 80%","cat":"Fungicide","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":25,"cpu":0.025,"min_stock_threshold":1000,"stock":5000},{"id":7,"name":"Arimo 23EC","active_ingredient":"Difenoconazole","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":78,"cpu":0.156,"min_stock_threshold":500,"stock":10000},{"id":8,"name":"Agus 24SC","active_ingredient":"Diafenthiuron","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":85,"cpu":0.17,"min_stock_threshold":500,"stock":3500},{"id":9,"name":"Aliette (ribut petir)","active_ingredient":"Fosetyl-aluminium 80%","cat":"Fungicide","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":150,"cpu":0.15,"min_stock_threshold":1000,"stock":2000},{"id":10,"name":"AMG mix","active_ingredient":"Amino acid + Magnesium mix","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":68,"cpu":0.068,"min_stock_threshold":1000,"stock":3000},{"id":11,"name":"Wuzal Ascofol","active_ingredient":"Seaweed extract (Ascophyllum nodosum)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":265,"cpu":0.053,"min_stock_threshold":5000,"stock":0},{"id":12,"name":"Wuzal ZN","active_ingredient":"Zinc (chelated)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":395,"cpu":0.079,"min_stock_threshold":5000,"stock":0},{"id":13,"name":"Wuxal Ascofol CAB","active_ingredient":"Seaweed extract + Calcium + Boron","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":260,"cpu":0.052,"min_stock_threshold":5000,"stock":5000},{"id":14,"name":"A Zinc Mix","active_ingredient":"Zinc mix","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":70,"cpu":0.07,"min_stock_threshold":1000,"stock":25000},{"id":15,"name":"Xilca","active_ingredient":"Calcium + Silicon","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":60.83,"cpu":0.06083,"min_stock_threshold":1000,"stock":34000},{"id":16,"name":"Flora","active_ingredient":"Boron (foliar)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":82.5,"cpu":0.0825,"min_stock_threshold":1000,"stock":31000},{"id":17,"name":"Vitanica","active_ingredient":"Seaweed / amino acid complex","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":2500,"unit_price":133.33,"cpu":0.053332,"min_stock_threshold":2500,"stock":13000},{"id":18,"name":"Stunza","active_ingredient":"Mepiquat chloride (MEP)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":8750},{"id":19,"name":"Calcifol","active_ingredient":"Calcium + Boron (foliar)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":230,"cpu":0.046,"min_stock_threshold":5000,"stock":7000},{"id":20,"name":"Heromix T1","active_ingredient":"Foliar nutrient mix (T1)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":210,"cpu":0.042,"min_stock_threshold":5000,"stock":15000},{"id":21,"name":"Auxi-Pro","active_ingredient":"Auxin (plant hormone)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":13500},{"id":22,"name":"Cyto-Plus","active_ingredient":"Cytokinin (plant hormone)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":75,"cpu":0.075,"min_stock_threshold":1000,"stock":11250},{"id":23,"name":"Carboxamin","active_ingredient":"Amino acids","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":70.83,"cpu":0.07083,"min_stock_threshold":1000,"stock":14500},{"id":24,"name":"Sorbix","active_ingredient":"Sorbitol carrier + Boron","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":75,"cpu":0.075,"min_stock_threshold":1000,"stock":7500},{"id":25,"name":"A Plus Cal","active_ingredient":"Calcium (powder)","cat":"Powder","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":72,"cpu":0.072,"min_stock_threshold":1000,"stock":5000},{"id":26,"name":"AZ Plus","active_ingredient":"Amino acid + Zinc","cat":"Powder","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":95,"cpu":0.095,"min_stock_threshold":1000,"stock":3000},{"id":27,"name":"Brightstar PBZ","active_ingredient":"Paclobutrazol","cat":"Growth Reg","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":108.33,"cpu":0.10833,"min_stock_threshold":1000,"stock":9000},{"id":28,"name":"GA3 (Gibberlic Acid)","active_ingredient":"Gibberellic acid (GA3)","cat":"Growth Reg","container":"pack","unit":"tablets","unit_multiplier":10,"unit_price":95,"cpu":9.5,"min_stock_threshold":10,"stock":59},{"id":29,"name":"Yara MKP","active_ingredient":"Mono potassium phosphate 0-52-34","cat":"Foliar","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":300,"cpu":0.012,"min_stock_threshold":50000,"stock":58500},{"id":30,"name":"Hero Max (Sticker)","active_ingredient":"Non-ionic surfactant / sticker","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":200,"cpu":0.04,"min_stock_threshold":5000,"stock":0},{"id":31,"name":"Entrust 18SL (Racun rumput)","active_ingredient":"Glufosinate-ammonium","cat":"Herbicide","container":"bottle","unit":"ml","unit_multiplier":20000,"unit_price":250,"cpu":0.0125,"min_stock_threshold":20000,"stock":0},{"id":32,"name":"Yara Liva Tropicote","active_ingredient":"Calcium nitrate 15.5-0-0 + 26.5 CaO","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":80,"cpu":0.0032,"min_stock_threshold":50000,"stock":349000},{"id":33,"name":"Yara Liva Nitrobor","active_ingredient":"Calcium nitrate + Boron","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":99,"cpu":0.00396,"min_stock_threshold":50000,"stock":75000},{"id":34,"name":"Yara Mila 12-12-17","active_ingredient":"NPK 12-12-17 + 2MgO","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":230,"cpu":0.0046,"min_stock_threshold":100000,"stock":200000},{"id":35,"name":"Yara Tera Krista Mgs","active_ingredient":"Magnesium sulphate (MgS)","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":55,"cpu":0.0022,"min_stock_threshold":50000,"stock":140000},{"id":36,"name":"Garsoni 8-24-24","active_ingredient":"NPK 8-24-24","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":235,"cpu":0.0047,"min_stock_threshold":100000,"stock":860000},{"id":37,"name":"Polysulphate","active_ingredient":"Polyhalite (K, Ca, Mg, S)","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":90,"cpu":0.0018,"min_stock_threshold":100000,"stock":586000},{"id":38,"name":"Nutrigem","active_ingredient":"NPK compound (Nutrigem)","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":40000,"unit_price":34.6,"cpu":0.000865,"min_stock_threshold":80000,"stock":1680000},{"id":39,"name":"Herocris Nexus 5-25-25-2MGO","active_ingredient":"NPK 5-25-25 + 2MgO","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":300,"cpu":0.012,"min_stock_threshold":50000,"stock":357000},{"id":40,"name":"Basfoliar","active_ingredient":"Foliar NPK + micronutrients","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":2500,"unit_price":138.34,"cpu":0.055336,"min_stock_threshold":2500,"stock":15000},{"id":41,"name":"Plantara","active_ingredient":"Brassinosteroid (BR)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":12000},{"id":42,"name":"Raizon Max","active_ingredient":"Rooting / humic complex","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":10500},{"id":43,"name":"Yara Calcinit (CN)","active_ingredient":"Calcium nitrate 15.5-0-0","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":90,"cpu":0.0036,"min_stock_threshold":50000,"stock":198500},{"id":44,"name":"Fetto 480","active_ingredient":"Metalaxyl-M · fruit-contact, 14-day PHI","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":160,"cpu":0.32,"min_stock_threshold":500,"stock":6000},{"id":45,"name":"Pictor","active_ingredient":"Boscalid + Dimoxystrobin \u00b7 fruit-contact, 14-day PHI","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":6000},{"id":46,"name":"Marshal 20SC","active_ingredient":"Carbosulfan 20%","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":2500},{"id":47,"name":"Betakal Amino","active_ingredient":"Amino acid + Potassium","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":205,"cpu":0.041,"min_stock_threshold":5000,"stock":30000},{"id":48,"name":"Ardel","active_ingredient":"(confirm \u2014 see label)","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":0,"cpu":0,"min_stock_threshold":1000,"stock":3000},{"id":49,"name":"Pengasus 47.17sc","active_ingredient":"Diafenthiuron","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":75,"cpu":0.15,"min_stock_threshold":500,"stock":1500},{"id":50,"name":"Azatin","active_ingredient":"Azadirachtin","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":85,"cpu":0.17,"min_stock_threshold":500,"stock":2000},{"id":51,"name":"Match","active_ingredient":"Lufenuron 50 g/L","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":130,"cpu":0.26,"min_stock_threshold":500,"stock":3000},{"id":52,"name":"Zinc (powder)","active_ingredient":"Zinc sulphate","cat":"Fertiliser","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":0,"cpu":0,"min_stock_threshold":1000,"stock":1500},{"id":53,"name":"Yara Rega 13-4-25","active_ingredient":"NPK 13-4-25","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":285,"cpu":0.0114,"min_stock_threshold":50000,"stock":178000},{"id":54,"name":"Yara Tera Kristalon 13-40-13","active_ingredient":"NPK 13-40-13","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":28000},{"id":55,"name":"A Zinc (Year 2023)","active_ingredient":"Zinc mix","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":1000},{"id":56,"name":"Nutrimix Complete (AZ PLUS)","active_ingredient":"Complete micronutrient mix","cat":"Foliar","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":77,"cpu":0.077,"min_stock_threshold":1000,"stock":3000},{"id":57,"name":"Ultra Bor (Flora)","active_ingredient":"Boron","cat":"Foliar","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":3000},{"id":58,"name":"Anmi 4.8SC","active_ingredient":"Hexaconazole","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":1000},{"id":59,"name":"VS 34","active_ingredient":"(confirm \u2014 see label)","cat":"Foliar","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":0,"cpu":0,"min_stock_threshold":1000,"stock":1000},{"id":60,"name":"Abinsec 1.8EC","active_ingredient":"Abamectin 1.8%","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":4000,"unit_price":85,"cpu":0.02125,"min_stock_threshold":4000,"stock":5000},{"id":61,"name":"Basaplant Orange 14-5-30","active_ingredient":"NPK 14-5-30","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":25000},{"id":62,"name":"Hydrospeed Yield 3-14-37","active_ingredient":"NPK 3-14-37","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":50000},{"id":63,"name":"Yara Mila 12-11-18","active_ingredient":"NPK 12-11-18","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":230,"cpu":0.0046,"min_stock_threshold":100000,"stock":350000},{"id":64,"name":"Yara Tera 18-18-18","active_ingredient":"NPK 18-18-18","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":50000},{"id":65,"name":"Florica 21-21-21","active_ingredient":"NPK 21-21-21","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":250,"cpu":0.01,"min_stock_threshold":50000,"stock":25000},{"id":66,"name":"Ge Rocket 9-14-9","active_ingredient":"NPK 9-14-9","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":78,"cpu":0.00312,"min_stock_threshold":50000,"stock":6000},{"id":67,"name":"MSolumax 3-16-36","active_ingredient":"NPK 3-16-36","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":8000,"unit_price":85,"cpu":0.010625,"min_stock_threshold":16000,"stock":208000},{"id":68,"name":"Tying rope / string","active_ingredient":"","cat":"Consumable","container":"roll","unit":"m","unit_multiplier":500,"unit_price":0,"cpu":0,"min_stock_threshold":500,"stock":0}];

const PRODUCTS=INVENTORY_RECON;   // Phase-1/2 alias — same array reference

const PHASE_PROGRAM=[{"id":"2026 Jan (2)|Set 1","month":"2026 Jan (2)","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-01-29","lines":[{"raw":"Amotan","pid":1,"qty":500.0,"unit":"ml","ai":"Azoxystrobin"},{"raw":"Cypermethrin 5.5","pid":2,"qty":1000.0,"unit":"ml","ai":"Cypermethrin"},{"raw":"Fipronil","pid":3,"qty":1000.0,"unit":"ml","ai":"Fipronil"},{"raw":"A-Plus cal","pid":25,"qty":1000.0,"unit":"gm","ai":"Calcium"}],"done":"2026-01-29","unconfirmed":["20-20-20 · 2 kg — product not confirmed"],"sheetDone":"2026-01-29"},{"id":"2026 Jan (2)|Set 2","month":"2026 Jan (2)","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-02-07","lines":[{"raw":"Mancozeb","pid":6,"qty":500.0,"unit":"gm","ai":"Mancozeb"},{"raw":"Madell","pid":4,"qty":500.0,"unit":"ml","ai":"Carbosulfan"},{"raw":"Abamectin","pid":5,"qty":1000.0,"unit":"ml","ai":"Abamectin"},{"raw":"Calcium Natrate","pid":32,"qty":2000.0,"unit":"gm","ai":"Calcium nitrate"},{"raw":"amg mix","pid":10,"qty":1000.0,"unit":"ml","ai":""},{"raw":"wuzal zn","pid":12,"qty":1000.0,"unit":"ml","ai":"Zinc"}],"done":"2026-02-07","sheetDone":"2026-02-07"},{"id":"2026 Jan (2)|Set 3","month":"2026 Jan (2)","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-02-14","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":"Difenoconazole"},{"raw":"Agus","pid":8,"qty":500.0,"unit":"ml","ai":"Diafenthiuron"},{"raw":"cypermentrin 5.5","pid":2,"qty":1000.0,"unit":"ml","ai":"Cypermethrin"},{"raw":"13-40-13","pid":54,"qty":1000.0,"unit":"gm","ai":""},{"raw":"wuzal ascofol","pid":11,"qty":1000.0,"unit":"ml","ai":""}],"done":"2026-02-14","unconfirmed":["15-15-30 · 1 liter — product not confirmed"],"sheetDone":"2026-02-14"},{"id":"2026 Jan (2)|Fert Set 1","month":"2026 Jan (2)","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-02-04","lines":[{"raw":"Calcium nitrate","pid":43,"qty":1000.0,"unit":"gm","ai":""}],"done":"2026-02-04","sheetDone":"2026-02-04"},{"id":"2026 Jan (2)|Fert Set 2","month":"2026 Jan (2)","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-02-18","lines":[{"raw":"8-24-24","pid":36,"qty":1000.0,"unit":"gm","ai":""},{"raw":"poly sulphate","pid":37,"qty":500.0,"unit":"gm","ai":""}],"done":"2026-02-18","sheetDone":"2026-02-18"},{"id":"2026 Jan (2)|Fert Set 3","month":"2026 Jan (2)","set":"Fert Set 3","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-03-03","lines":[{"raw":"8-24-24","pid":36,"qty":1500.0,"unit":"gm","ai":""}],"done":"2026-03-03","sheetDone":"2026-03-03"},{"id":"Boosting|Set 1","month":"Boosting","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-02-28","lines":[{"raw":"PBZ","pid":27,"qty":3000.0,"unit":"ml","ai":"Paclobutrazol"},{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"AZ Plus","pid":26,"qty":1000.0,"unit":"gm","ai":""}],"started":"2026-02-23","done":"2026-02-28","donePerLot":{"B":"2026-02-23","A":"2026-02-25","C":"2026-02-28"},"sheetDone":"2026-02-28","planOriginal":"2026-02-20"},{"id":"March|Set 1","month":"March","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-03-14","lines":[{"raw":"Amotan","pid":1,"qty":500.0,"unit":"ml","ai":"Azoxystrobin"},{"raw":"Cypermethrin 5.5","pid":2,"qty":1000.0,"unit":"ml","ai":"Cypermethrin"},{"raw":"Fipronil","pid":3,"qty":1000.0,"unit":"ml","ai":"Fipronil"},{"raw":"Mkp","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"AZ plus","pid":26,"qty":1000.0,"unit":"gm","ai":""}],"started":"2026-03-12","done":"2026-03-14","unconfirmed":["Amino · 1 liter — product not confirmed"],"sheetDone":"2026-03-14","planOriginal":"2026-03-06"},{"id":"March|Set 2","month":"March","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-03-23","lines":[{"raw":"Mancozeb","pid":6,"qty":500.0,"unit":"gm","ai":"Mancozeb"},{"raw":"Madell","pid":4,"qty":500.0,"unit":"ml","ai":"Carbosulfan"},{"raw":"Abamectin","pid":5,"qty":1000.0,"unit":"ml","ai":"Abamectin"},{"raw":"5 25 25","pid":39,"qty":2000.0,"unit":"gm","ai":""}],"started":"2026-03-18","done":"2026-03-23","unconfirmed":["Amino · 1 liter — product not confirmed","Calcim Boron · 1 liter — product not confirmed"],"sheetDone":"2026-03-23","planOriginal":"2026-03-13"},{"id":"March|Set 3","month":"March","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-03-28","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":"Difenoconazole"},{"raw":"Agus","pid":8,"qty":500.0,"unit":"ml","ai":"Diafenthiuron"},{"raw":"cypermentrin 5.5","pid":2,"qty":1000.0,"unit":"ml","ai":"Cypermethrin"},{"raw":"5 25 25","pid":39,"qty":2000.0,"unit":"gm","ai":""},{"raw":"zinc","pid":52,"qty":500.0,"unit":"gm","ai":"Zinc"}],"started":"2026-03-27","done":"2026-03-28","unconfirmed":["Amino · 1 liter — product not confirmed","Calcim Boron · 1 liter — product not confirmed"],"sheetDone":"2026-03-28","planOriginal":"2026-03-20"},{"id":"March|Fert Set 1","month":"March","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-03-06","lines":[{"raw":"8 24 24","pid":36,"qty":1000.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}],"done":"2026-03-06","sheetDone":"2026-03-06","planOriginal":"2026-03-04"},{"id":"March|Fert Set 2","month":"March","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-03-22","lines":[{"raw":"8 24 24","pid":36,"qty":1500.0,"unit":"gm","ai":""}],"done":"2026-03-22","sheetDone":"2026-03-22","planOriginal":"2026-03-18"},{"id":"April|Set 1","month":"April","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside branches (induce more bud eye)","basis":"PER_1000L","litresPerTree":null,"plan":"2026-04-10","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Fipronil","pid":3,"qty":1000.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":1500.0,"unit":"gm","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"CaO"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":"Seaweed"},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":""}],"done":"2026-04-10","started":"2026-04-09","sheetDone":"2026-04-10","planOriginal":"2026-04-09"},{"id":"April|Set 2","month":"April","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside the branches","basis":"PER_1000L","litresPerTree":null,"plan":"2026-04-17","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Fipronil","pid":3,"qty":1000.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":1500.0,"unit":"gm","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":""},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":""}],"done":"2026-04-17","started":"2026-04-16","sheetDone":"2026-04-17","planOriginal":"2026-04-16"},{"id":"April|Set 3","month":"April","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"Spray outside the leaf (induce 1 layer new leaf)","basis":"PER_1000L","litresPerTree":null,"plan":"2026-04-22","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Ardel","pid":48,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Calcinit","pid":43,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":""},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":""},{"raw":"GA3","pid":28,"qty":5.0,"unit":"tablets","ai":"Gibberellic acid (GA3)"}],"done":"2026-04-22","started":"2026-04-21","sheetDone":"2026-04-22","planOriginal":"2026-04-20"},{"id":"April|Fert Set 1","month":"April","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-04-19","lines":[{"raw":"Calcinit","pid":43,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Nutrigm","pid":38,"qty":10000.0,"unit":"gm","ai":""}],"done":"2026-04-19","sheetDone":"2026-04-19"},{"id":"May|Set 1","month":"May","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside and outside whole tree( induce new leaf)","basis":"PER_1000L","litresPerTree":null,"plan":"2026-04-30","lines":[{"raw":"calcinit","pid":43,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":"seaweed"},{"raw":"AZ plus","pid":26,"qty":1000.0,"unit":"ml","ai":"TE"},{"raw":"GA3","pid":28,"qty":5.0,"unit":"tablets","ai":"Gibberellic acid (GA3)"}],"done":"2026-04-30","started":"2026-04-29","sheetDone":"2026-04-30","planOriginal":"2026-04-29"},{"id":"May|Set 2","month":"May","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray flower and leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-05-09","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Mardel","pid":4,"qty":1000.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":2000.0,"unit":"gm","ai":""},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"CaO"},{"raw":"flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":"Seaweed"}],"done":"2026-05-09","sheetDone":"2026-05-09","planOriginal":"2026-05-06"},{"id":"May|Fert Set 1","month":"May","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-05-05","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}],"done":"2026-05-05","sheetDone":"2026-05-05","planOriginal":"2026-05-02"},{"id":"May 2|Set 1","month":"May 2","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray flower only","basis":"PER_1000L","litresPerTree":null,"plan":"2026-05-14","lines":[{"raw":"Stunza","pid":18,"qty":250.0,"unit":"ml","ai":"MEP"},{"raw":"PBZ","pid":27,"qty":250.0,"unit":"ml","ai":""},{"raw":"CalCifol","pid":19,"qty":1000.0,"unit":"ml","ai":"Calcum"},{"raw":"Heromix T1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"},{"raw":"Auxi-pro","pid":21,"qty":500.0,"unit":"ml","ai":""},{"raw":"cyto-plus","pid":22,"qty":250.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":1000.0,"unit":"gm","ai":""}],"done":"2026-05-14","sheetDone":"2026-05-14"},{"id":"May 2|Set 2","month":"May 2","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray Outside leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-05-15","lines":[{"raw":"Stunza","pid":18,"qty":1000.0,"unit":"ml","ai":"MEP"},{"raw":"PBZ","pid":27,"qty":500.0,"unit":"ml","ai":""},{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Heromix T1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"},{"raw":"Carboxamin","pid":23,"qty":1000.0,"unit":"ml","ai":"Amino"}],"done":"2026-05-15","sheetDone":"2026-05-15"},{"id":"May 2|Set 3","month":"May 2","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"Spray flower","basis":"PER_1000L","litresPerTree":null,"plan":"2026-05-28","lines":[{"raw":"Abamectin","pid":5,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Auxi-pro","pid":21,"qty":500.0,"unit":"ml","ai":""},{"raw":"cyto-plus","pid":22,"qty":250.0,"unit":"ml","ai":""},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":""},{"raw":"MKP","pid":29,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"A Zinc mix","pid":14,"qty":1000.0,"unit":"ml","ai":"Zinc"}],"done":"2026-05-28","sheetDone":"2026-05-21","started":"2026-05-21","planOriginal":"2026-05-21"},{"id":"May 2|Fert Set 1","month":"May 2","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-05-20","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""}],"done":"2026-05-20","sheetDone":"2026-05-20","planOriginal":"2026-05-18"},{"id":"May 2|Fert Set 2","month":"May 2","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-06-03","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"June|Set 1","month":"June","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray outside leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-06-05","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":"Difenoconazole"},{"raw":"Pengasus 47.17sc","pid":49,"qty":500.0,"unit":"ml","ai":"Difenthiuron"},{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Stunza","pid":18,"qty":1000.0,"unit":"ml","ai":"MEP (stunt)"},{"raw":"Raizon Max","pid":42,"qty":500.0,"unit":"ml","ai":"Hero"},{"raw":"Heromix T1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"}],"done":"2026-06-05","sheetDone":"2026-06-05","planOriginal":"2026-06-04"},{"id":"June|Set 2","month":"June","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside (branches and fruit)","basis":"PER_1000L","litresPerTree":null,"plan":"2026-06-10","lines":[{"raw":"Azatin","pid":50,"qty":500.0,"unit":"ml","ai":"Azoxystrobin"},{"raw":"Match","pid":51,"qty":500.0,"unit":"ml","ai":"Lufenuron"},{"raw":"5 25 25","pid":39,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Auxi-Pro","pid":21,"qty":500.0,"unit":"ml","ai":"Fruit (NAA)"},{"raw":"Cyto-Plus","pid":22,"qty":250.0,"unit":"ml","ai":"Fruity (CPPU)"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":"Zinc"}],"done":"2026-06-10","sheetDone":"2026-06-10","planOriginal":"2026-06-09"},{"id":"June|Set 3","month":"June","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"2026-06-17","lines":[{"raw":"Fetto 480","pid":44,"qty":500.0,"unit":"ml","ai":"Metalaxyl"},{"raw":"Pictor","pid":45,"qty":1000.0,"unit":"ml","ai":"emmamectin benzoate"},{"raw":"5 25 25","pid":39,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Auxi-Pro","pid":21,"qty":500.0,"unit":"ml","ai":"Fruit (NAA)"},{"raw":"Cyto-Plus","pid":22,"qty":250.0,"unit":"ml","ai":"Fruity (CPPU)"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":"Zinc"}],"done":"2026-06-17","sheetDone":"2026-06-17","planOriginal":"2026-06-16"},{"id":"June|Fert Set 1","month":"June","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-06-04","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}],"done":"2026-06-04","sheetDone":"2026-06-04","planOriginal":"2026-06-03"},{"id":"June|Fert Set 2","month":"June","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-06-18","lines":[{"raw":"13 4 25","pid":53,"qty":1000.0,"unit":"gm","ai":""}],"done":"2026-06-18","sheetDone":"2026-06-18","planOriginal":"2026-06-17"},{"id":"June 2|Set 1","month":"June 2","set":"Set 1","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree)","basis":"PER_1000L","litresPerTree":10.0,"plan":"2026-06-20","lines":[{"raw":"5 25 25","pid":39,"qty":5000.0,"unit":"gm","ai":""},{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}],"done":"2026-06-20","sheetDone":"2026-06-20","planOriginal":"2026-06-13"},{"id":"June 2|Set 2","month":"June 2","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside","basis":"PER_1000L","litresPerTree":null,"plan":"2026-06-29","lines":[{"raw":"Fetto 480","pid":44,"qty":500.0,"unit":"ml","ai":"Metalaxy"},{"raw":"Marshal 20sc","pid":46,"qty":1000.0,"unit":"ml","ai":"Carbosulfan"},{"raw":"5 25 25","pid":39,"qty":2000.0,"unit":"gm","ai":""},{"raw":"Plantara","pid":41,"qty":500.0,"unit":"ml","ai":"Brassinolide"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"flora","pid":16,"qty":1000.0,"unit":"ml","ai":"boron"},{"raw":"sorbix","pid":24,"qty":500.0,"unit":"gm","ai":"Sorbital"},{"raw":"A zinc mix","pid":14,"qty":1000.0,"unit":"ml","ai":"zinc"}],"done":"2026-06-29","sheetDone":"2026-06-29","planOriginal":"2026-06-25"},{"id":"July|Set 1","month":"July","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Leaf and branches","basis":"PER_1000L","litresPerTree":null,"plan":"2026-07-06","lines":[{"raw":"Anmi 4.8SC","pid":58,"qty":1000.0,"unit":"ml","ai":"Hexaconazole"},{"raw":"Madell","pid":4,"qty":1000.0,"unit":"ml","ai":"Carbosulfan"},{"raw":"5 25 25","pid":39,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Raizo max","pid":42,"qty":500.0,"unit":"ml","ai":"Triacontanol"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Heromix T 1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"}],"done":"2026-07-06","sheetDone":"2026-07-06","noMaterial":true},{"id":"July|Set 2","month":"July","set":"Set 2","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree)","basis":"PER_1000L","litresPerTree":10,"plan":"2026-07-10","lines":[{"raw":"3 16 36","pid":67,"qty":5000.0,"unit":"gm","ai":""},{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":"Amino"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}],"done":"2026-07-10","sheetDone":"2026-07-10"},{"id":"July|Set 3","month":"July","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"Spray leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-07-13","lines":[{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Stunza","pid":18,"qty":1000.0,"unit":"ml","ai":"MEP"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"floara","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}],"done":"2026-07-13","sheetDone":"2026-07-13"},{"id":"July|Set 4","month":"July","set":"Set 4","kind":"FOLIAR","mode":"SPRAY","header":"spray fruit and leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-07-20","lines":[{"raw":"Fetto 480","pid":44,"qty":1000.0,"unit":"ml","ai":"Metalaxy"},{"raw":"Pictor","pid":45,"qty":1000.0,"unit":"ml","ai":"emmamectin benzoate"},{"raw":"3 16 36","pid":67,"qty":2000.0,"unit":"gm","ai":""},{"raw":"Raizo max","pid":42,"qty":1000.0,"unit":"ml","ai":"Triacontanol"},{"raw":"carboxamin","pid":23,"qty":1000.0,"unit":"ml","ai":"amino"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"flora","pid":16,"qty":1000.0,"unit":"ml","ai":"boron"}],"done":"2026-07-20","sheetDone":"2026-07-21"},{"id":"July|Set 5","month":"July","set":"Set 5","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree)","basis":"PER_1000L","litresPerTree":10,"plan":"2026-07-29","lines":[{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":"Amino"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}],"done":"2026-07-29","sheetDone":"2026-07-30","planOriginal":"2026-07-28"},{"id":"July|Fert Set 1","month":"July","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-07-02","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulphate","pid":37,"qty":500.0,"unit":"gm","ai":""}],"done":"2026-07-02","sheetDone":"2026-07-02","noMaterial":true},{"id":"July|Fert Set 2","month":"July","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-07-17","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""}],"done":"2026-07-17","sheetDone":"2026-07-17"},{"id":"Aug|Set 1","month":"Aug","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray fruit and leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-08-06","lines":[{"raw":"Fetto 480","pid":44,"qty":1000.0,"unit":"ml","ai":"Metalaxyl"},{"raw":"Pictor","pid":45,"qty":1000.0,"unit":"ml","ai":"emmamectin benzoate"},{"raw":"3 16 36","pid":67,"qty":2000.0,"unit":"gm","ai":""},{"raw":"Raizo max","pid":42,"qty":500.0,"unit":"ml","ai":"Triacontanol"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Heromix T 1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"}]},{"id":"Aug|Fert Set 1","month":"Aug","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-08-03","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""}],"sheetDone":null,"done":"2026-08-03"},{"id":"Aug|Fert Set 2","month":"Aug","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-08-18","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""}]}];

const CENSUS_TOTAL={"A": 213, "B": 2052, "C": 437};

const WORKERS=['Owner','Purchaser','Worker 1','Worker 2','Marketing'];

// Seed registry. The Owner edits this live in the app (Owner tab → Master Governance
// & User Registry); pushing mirrors it into the WORKERS tab of the Google Sheet, which
// is what every other phone reads at the hotspot.
const DEFAULT_KEYS = [
  {id:'U-OWNER',  name:'Owner',     role:'OWNER',     key:'738291', status:'Active'},
  {id:'U-MKT',    name:'Marketing', role:'MARKETING', key:'903172', status:'Active'},
  {id:'U-PURCH',  name:'Purchaser', role:'PURCHASER', key:'452817', status:'Active'},
  {id:'U-WKR1',   name:'Worker 1',  role:'WORKER',    key:'619304', status:'Active'},
  {id:'U-WKR2',   name:'Worker 2',  role:'WORKER',    key:'287465', status:'Active'}
];

const ROLE_TABS = { // which bottom tabs each role may see
  OWNER:     ['harvest','stock','sync','dash'],
  MARKETING: ['harvest','stock','sync','dash'],
  WORKER:    ['harvest','stock','sync'],
  PURCHASER: ['stock','sync']
};

const PEAK_DATE = new Date('2026-08-21T00:00:00');

/* v3.18.2 — Pengasus 47.17sc is Syngenta PEGASUS (diafenthiuron 47.17%), whose label
   publishes a 14-day pre-harvest interval. Added because peak drop is 21-22 Aug and the
   crew were being handed this drum with no residue warning at all. Agus 24SC carries the
   SAME chemical (diafenthiuron) so it gets the same interval — the app now also sees the
   two as one ingredient and will warn if both go in one tank.
   VERIFY BOTH AGAINST THE PHYSICAL LABEL. These came from manufacturer/distributor pages,
   not from the Malaysian Pesticides Board registry, which could not be reached. */
const PHI_PRODUCTS = {'Fetto 480':14,'Pictor':14,'Pengasus 47.17sc':14,'Agus 24SC':14}; // days before harvest

/* v3.70.0 - the four new clones carry 1.5 as a PLACEHOLDER, the same figure as D101,
   because this farm has never weighed one. AVG_KG drives the shed estimate on a ration
   request and the "about N kg" a worker sees before the Gate weighs it for real, so a
   wrong number here is a wrong expectation, not a wrong invoice. Replace each one with
   the farm's own average as soon as a full basket of that clone crosses the scale. */
const AVG_KG = {MK:1.7,BT:1.9,B24:1.6,'101':1.5,UM:1.4,TB:1.9,
  GP:1.5,XO:1.5,D99:1.5,TNB:1.5};

const SPRAY_SETS = ['Aug - Set 1 (fruit+leaf)','Aug - Set 2 (soil drench)','Aug - Set 3 (leaf only)','Aug - Set 4 (leaf only)','Aug - Set 5 (soil drench)','Aug - Fert 1','Aug - Fert 2','General / other'];

const MONTH_NAME=['January','February','March','April','May','June','July','August','September','October','November','December'];

const LOT_KEYS=['A','B','C'];

let stock_in_ledger=[], stock_out_ledger=[], stock_adjust_ledger=[];

const PROG_MONTH_ORDER=['2026 Jan (2)','Boosting','March','April','May','May 2','June','June 2','July','Aug','Sep'];

const MONTH_LABEL={'2026 Jan (2)':'Jan','Boosting':'Boosting','May 2':'May (2)','June 2':'June (2)','Aug':'August','Sep':'September'};

const MODE_LABEL={SPRAY:'Spray fruit + leaf',LEAF:'Spray leaf only — NO fruit',DRENCH:'Soil drench',SOIL:'Fertiliser broadcast'};

const SYSTEMIC_AI=[
  ['metalaxyl','systemic phenylamide — moves inside the leaf, rain-fast once dry'],
  ['fosetyl','systemic phosphonate — taken up by root and leaf'],
  ['azoxystrobin','systemic strobilurin — translaminar, holds through rain'],
  ['difenoconazole','systemic triazole — absorbed within hours'],
  ['hexaconazole','systemic triazole — absorbed within hours'],
  ['propiconazole','systemic triazole'],
  ['imidacloprid','systemic neonicotinoid'],
  ['thiamethoxam','systemic neonicotinoid'],
  ['carbosulfan','systemic carbamate'],
  ['fipronil','locally systemic phenylpyrazole'],
  ['emamectin','translaminar avermectin'],
  ['abamectin','translaminar avermectin'],
  ['lufenuron','ingested growth regulator — not surface dependent'],
  ['paclobutrazol','root/systemic growth regulator'],
  ['phosphonate','systemic phosphonate'],
  /* v3.18.3 — the rest of the store, classified. Plant hormones and growth regulators are
     taken INTO the tissue, so once the leaf is dry the rain has missed its chance. */
  ['boscalid','systemic SDHI — moves inside the leaf'],
  ['dimoxystrobin','systemic strobilurin — moves inside the leaf'],
  ['azadirachtin','translaminar neem extract — moves through the leaf'],
  ['auxin','plant hormone — absorbed by the tissue'],
  ['naa','plant hormone — absorbed by the tissue'],
  ['cytokinin','plant hormone — absorbed by the tissue'],
  ['cppu','plant hormone — absorbed by the tissue'],
  ['gibberellic','plant hormone — absorbed by the tissue'],
  ['brassino','plant hormone — absorbed by the tissue'],
  ['mepiquat','growth retardant — absorbed and carried to the shoot'],
  ['triacontanol','absorbed growth promoter']];

const CONTACT_AI=[
  ['mancozeb','protectant contact fungicide — washes off in rain'],
  ['copper','contact protectant — washes off in rain'],
  ['sulphur','contact protectant — washes off in rain'],
  ['sulfur','contact protectant — washes off in rain'],
  ['chlorothalonil','contact protectant — washes off in rain'],
  ['cypermethrin','contact pyrethroid — surface deposit, rain sensitive'],
  ['seaweed','foliar nutrient — surface deposit, rain sensitive'],
  ['boron','foliar nutrient — surface deposit, rain sensitive'],
  ['calcium','foliar nutrient — surface deposit, rain sensitive'],
  ['zinc','foliar nutrient — surface deposit, rain sensitive'],
  ['amino','foliar biostimulant — surface deposit, rain sensitive'],
  ['sorbitol','carrier — surface deposit, rain sensitive'],
  ['potassium phosphate','soluble foliar salt — washes off'],
  ['mono potassium','soluble foliar salt — washes off'],
  /* v3.18.3 — diafenthiuron needs sunlight to convert into its active form and barely
     moves in the leaf, so rain before it dries costs you the whole spray. Glufosinate is a
     contact herbicide that needs a few dry hours on the weed. Both were UNKNOWN until now.
     The two 'foliar' entries sit here deliberately: they must be tested BEFORE the SOIL
     table below, or "Foliar NPK + micronutrients" gets filed as a bag of ground feed. */
  ['diafenthiuron','light-activated contact + stomach insecticide — needs the leaf to dry'],
  ['glufosinate','contact herbicide — needs about 4-6 rain-free hours on the weed'],
  ['foliar nutrient','leaf feed — a surface deposit that rain removes'],
  ['foliar npk','leaf feed — a surface deposit that rain removes'],
  ['micronutrient','leaf feed — a surface deposit that rain removes']];

/* ===== v3.18.3 · TWO MORE ANSWERS THAN "IN THE LEAF" OR "ON THE LEAF" =====
   Sixteen of the farm's products are granular ground feed. Asking whether rain washes them
   off a leaf is the wrong question - they never touch one. Telling the crew a bag of
   12-12-17 might wash off is noise, and noise is what makes a real warning ignorable.
   An adjuvant is its own case again: a sticker has no action to lose, its whole job is
   making the OTHER lines in the tank rain-fast. */
const SOIL_AI=[
  ['npk','granular ground feed - spread at the root, not sprayed on a leaf'],
  ['polyhalite','granular ground feed - spread at the root'],
  ['magnesium sulphate','granular ground feed - spread at the root'],
  ['nutrigem','granular ground feed - spread at the root'],
  ['rooting','poured at the root, not on the leaf'],
  ['humic','poured at the root, not on the leaf']];
const ADJUVANT_AI=[
  ['surfactant','a sticker - it has no action of its own, it makes the OTHER lines rain-fast'],
  ['sticker','a sticker - it has no action of its own, it makes the OTHER lines rain-fast'],
  ['spreader','a spreader - it has no action of its own, it makes the OTHER lines rain-fast']];

const BP_CATS={PND:['Pesticide','Fungicide','Herbicide'],FOLIAR:['Foliar'],
  BIO:['Foliar','Growth Reg'],TE:['Foliar','Powder'],MANURE:['Fertiliser','Powder']};

const BP_LABEL={PND:'PnD spray',FOLIAR:'Foliar feed',BIO:'Biostimulant',TE:'Trace element',MANURE:'Manuring'};

/* ======================================================================================
   v3.12.0 · SEASONAL AGRONOMY MATRIX — the closed loop between Owner, Purchaser and field
   ======================================================================================
   THE WATER VOLUME CALIBRATION ANCHOR
   -----------------------------------
   TANK_L is the single number every spray recipe on this farm is written against. The
   Owner keys a concentration PER ONE 1,000 L POWER SPRAY PUMP TANK and nothing else.
   Every figure downstream — the Purchaser's brand quantity, the worker's dilution
   checklist, the inventory deduction and the RM posted to a lot — is that per-tank
   concentration MULTIPLIED BY THE NUMBER OF TANKS ACTUALLY MIXED IN THE FIELD.

       deduction = dose_per_1000L x tanks_mixed
       cost      = deduction x moving_average_cost_of_the_allocated_brand

   Do not add a second tank size. If the farm ever buys a 2,000 L pump, the correct
   change is that the worker keys 2.0 tanks, not that this constant moves. Every stored
   recipe in `global_agronomy_drafts` is calibrated against 1,000 and would silently
   double or halve if this number were edited.

   MANURING is per tree, not per tank — it is broadcast, no water is mixed. That is the
   ONLY basis exception, and it is carried explicitly on the draft as basis:'PER_TREE'.
   ====================================================================================== */
const TANK_L = 1000;

/* The two core programs. Everything the Agronomist builds is one or the other. */
const AGRO_PROGRAMS = [
  {k:'SPRAY',  t:'Spraying',  ic:'💦', basis:'PER_1000L', unitlbl:'per 1,000 L tank'},
  {k:'MANURE', t:'Manuring',  ic:'🪣', basis:'PER_TREE',  unitlbl:'per tree'}
];

/* Mandatory application-method targets. A directive without one is not issuable — the
   commonest field failure on this farm was a crew spraying the leaf when the Owner meant
   the fruit and branches, and nothing on paper said which. `mode` maps each target onto
   the EXISTING v2.6 mode vocabulary so rain-fastness, PHI and the wet-leaf guard keep
   working unchanged. */
/* v3.14 — `lpt` is LITRES OF SPRAY MIX PER TREE for that method, confirmed by the Owner
   on 4 Aug 2026. It is the number that turns a tree count into a tank count:

       litres = trees x lpt        tanks = litres / TANK_L

   The crew count TREES, which is what they actually know; the app does the rest. Change
   one of these and every stock deduction on that method moves with it, so the figure in
   use is STAMPED ONTO EACH DIRECTIVE when it is issued — editing the number here can
   never retroactively rewrite a job that has already been done. */
const SPRAY_METHODS = [
  {k:'WHOLE',  t:'Whole Tree (Inside/Outside)',   mode:'SPRAY',  lpt:15, d:'Full cover — canopy outside and inside branches'},
  /* v3.18.4 — the pass the farm actually does most often between the two extremes: the
     outer leaf AND the hanging fruit, without working the deep inside branches.
     mode is 'SPRAY', not 'LEAF', and that is the whole safety point — SPRAY means the
     chemical touches fruit, so the PHI residue warning and the fruit-contact guard both
     fire on it. Filing this as 'LEAF' would have made it silently exempt from them. */
  {k:'LEAFFRUIT',t:'Leaf and Fruit',              mode:'SPRAY',  lpt:13, d:'Outer canopy leaf and the hanging fruit — fruit IS contacted'},
  {k:'LEAFOUT',t:'Leaf Only (Outside)',           mode:'LEAF',   lpt:12, d:'Outer canopy leaf only — NO fruit contact'},
  {k:'INSIDE', t:'Inside Only (Fruit/Branches)',  mode:'SPRAY',  lpt:8,  d:'Inside the canopy — fruit and branch surfaces'},
  {k:'DRENCH', t:'Soil Drenching',                mode:'DRENCH', lpt:10, d:'Poured at the root zone, not sprayed on the tree'}
];
const MANURE_METHODS = [
  {k:'DRIP',   t:'Broadcast Dripping Zone',        mode:'SOIL', lpt:0, d:'The ring under the canopy edge where rain drips off'},
  {k:'OUTCAN', t:'Broadcast Outside the Canopy',   mode:'SOIL', lpt:0, d:'Beyond the canopy edge — feeding the outward roots'},
  {k:'INCAN',  t:'Broadcast Whole Inside Canopy',  mode:'SOIL', lpt:0, d:'The whole area inside the canopy, trunk outward'}
];

/* Season stage — the Owner's top-level filter. These are the durian phenology stages the
   programme sheet is organised around, in the order a season runs through them. */
const SEASON_STAGES = [
  {k:'VEG',    t:'Vegetative',    ic:'🌿', d:'Flushing leaf, building the canopy'},
  {k:'PREFLW', t:'Pre-Flowering', ic:'🌾', d:'Stress and bud-eye induction'},
  {k:'FLW',    t:'Flowering',     ic:'🌸', d:'Flower open — spray choice is at its most delicate'},
  {k:'FSET',   t:'Fruit Setting', ic:'🥭', d:'Fruit holding and sizing'},
  {k:'POSTH',  t:'Post-Harvest',  ic:'♻️', d:'Recovery feeding after the drop'}
];

/* Three-state weather. `wx` maps each state down onto the EXISTING two-state WEATHER
   flag (SUNNY / RAINY) that the whole v2.6 rain-fastness engine reads, so nothing that
   already works has to be rewritten to understand a third state. */
const WX3_MODES = [
  {k:'DRY',   t:'Dry / Hot',      ic:'☀️',  wx:'SUNNY', d:'No wash-off risk. Watch leaf burn in the midday sun.'},
  {k:'MOD',   t:'Moderate Rain',  ic:'🌦️', wx:'RAINY', d:'Contact products may wash off. Prefer systemic.'},
  {k:'HEAVY', t:'Heavy Rain',     ic:'🌧️', wx:'RAINY', d:'Do not spray. Soil work and drenching only.'}
];

/* THE FIVE COMPONENT SLOTS. This is the shape of every recipe the Owner builds — five
   dropdown slots, each filled with an ACTIVE INGREDIENT (never a brand) and a
   concentration per 1,000 L. The Purchaser puts the brand in later. `cats` is which
   product categories the slot's active-ingredient dropdown is built from. */
/* v3.18 — THESE ARE ROLES, NOT SLOTS. Until v3.17 this array was a hard cage: exactly
   one component per entry, and `cats` decided what the Owner was ALLOWED to prescribe.
   That made two fungicides in one tank — a contact and a systemic together, which is what
   an outbreak actually calls for — structurally impossible, put 19 fertiliser products in
   a queue for one seat, and left the catalogue's herbicide reachable from no entry at all.
   Now a combo is a free LIST of components. Each line carries one of these as a LABEL,
   `cats` only pre-filters the picker (there is always an ALL view), and a role may appear
   as many times as the job needs. HERB and FERT are new; every older key is still here, so
   directives written before v3.18 keep their slot keys and need no migration. */
const COMBO_SLOTS = [
  {k:'PEST', t:'Pesticide',           ic:'🐛', cats:['Pesticide'],                    d:'Insect control'},
  {k:'FUNG', t:'Fungicide',           ic:'🍄', cats:['Fungicide'],                    d:'Disease control'},
  {k:'HERB', t:'Herbicide',           ic:'🌾', cats:['Herbicide'],                    d:'Weed control'},
  {k:'FERT', t:'Fertiliser',          ic:'🌱', cats:['Fertiliser','Powder'],          d:'Granular and soil feed'},
  {k:'FOL',  t:'Foliar',              ic:'🌿', cats:['Foliar','Powder','Fertiliser'], d:'NPK and leaf feed'},
  {k:'BIO',  t:'Biostimulant',        ic:'⚡', cats:['Growth Reg','Foliar'],          d:'Hormone, amino, seaweed'},
  {k:'TE',   t:'Trace Elements (TE)', ic:'🧪', cats:['Foliar','Powder'],              d:'Zn, B, Ca, Mg and mixes'}
];
/* v3.18 — which role a catalogue category lands in when the Owner picks straight out of
   the ALL view. Advisory: it sets the label on the line, nothing more. */
const CAT_ROLE = {Pesticide:'PEST',Fungicide:'FUNG',Herbicide:'HERB',Fertiliser:'FERT',
  Foliar:'FOL','Growth Reg':'BIO',Powder:'TE',Consumable:'FOL'};

/* Unit types the Purchaser may onboard a new commercial item under, each with the
   default hidden multiplier that converts ONE CONTAINER into the operational unit the
   recipes are written in. 1 Drum = 20,000 ml is the farm's own example. The Purchaser
   may override the multiplier on the form — this is only the sensible starting number. */
const ONBOARD_UNITS = [
  {k:'ml',      t:'ml — liquid',              containers:[['bottle',1000],['jerrycan',5000],['drum',20000],['pail',18000]]},
  {k:'gm',      t:'gm — powder / granule',    containers:[['packet',1000],['bag',25000],['sack',50000],['tub',5000]]},
  {k:'bags',    t:'bags — counted whole',     containers:[['bag',1]]},
  {k:'tablets', t:'tablets — counted whole',  containers:[['box',100],['strip',10]]},
  {k:'m',       t:'m — measured length',      containers:[['roll',1000]]},
  /* v3.53.0 — the Owner asked for litre and kilogram, for every product not just new ones.
     ⛔ THE CONTAINER SIZES ARE IN THE UNIT ITSELF, which is the whole point and the whole
     danger: a 20 L drum is 20 here, where the same drum under 'ml' is 20000. Mixing the two
     inside one product would be off by a thousand, so the pair is offered as its own unit
     with its own containers rather than as a label on the old one. */
  {k:'L',       t:'L — litre, bought big',    containers:[['bottle',1],['jerrycan',5],['pail',18],['drum',20],['IBC tank',1000]]},
  {k:'kg',      t:'kg — kilogram, bought big',containers:[['pack',1],['bag',25],['sack',50],['tote',500]]}
];

/* Stage x weather guidance. Purely advisory text shown above the builder — the app
   never silently changes a recipe, it only tells the Owner what the farm's own agronomy
   notes say about that combination. A missing pair falls back to the stage line. */
const STAGE_ADVICE = {
  VEG:    {base:'Push leaf. NPK high in N, plus TE for a clean flush.',
           MOD:'Moderate rain suits vegetative feeding — the leaf is soft and takes it.',
           HEAVY:'Hold the spray. Broadcast fertiliser instead; the rain will carry it in.'},
  PREFLW: {base:'Stress the tree. High P and K, low N. PBZ / MKP work here.',
           MOD:'Rain undoes stress. Delay the inducer until three dry days.',
           HEAVY:'Do not induce in heavy rain — the flush will come back instead of flower.'},
  FLW:    {base:'Flower is fragile. Light rates, no strong surfactant, avoid midday.',
           MOD:'Fungicide cover matters most now — flower blight follows wet flowering.',
           HEAVY:'No spraying on open flower in heavy rain. Protect, do not feed.'},
  FSET:   {base:'Hold the fruit. Ca and B against fruit drop, plus fruit-borer cover.',
           MOD:'Watch the PHI clock — fruit-contact products need their cut-off honoured.',
           HEAVY:'Drench rather than spray. Nothing sprayed onto wet fruit stays there.'},
  POSTH:  {base:'Rebuild the tree. Amino, seaweed, calcium nitrate, full TE.',
           MOD:'Good window — recovery feeding wants moisture in the soil.',
           HEAVY:'Broadcast only. Save the foliar until the canopy can dry.'}
};

const GEN_TASKS={
  PRUNE:  {label:'Pruning',       need:'TREE_COUNT', countLabel:'branches pruned', unit:'branches'},
  WEED:   {label:'Weeding',       need:'AREA',       countLabel:'trees cleared',   unit:'trees'},
  FTIE:   {label:'Fruit tying',   need:'TREE_COUNT', countLabel:'fruits tied',     unit:'fruits'},
  BTIE:   {label:'Branch tying',  need:'TREE_COUNT', countLabel:'branches tied',   unit:'branches'},
  FTRIM:  {label:'Fruit trimming',need:'TREE_COUNT', countLabel:'fruits removed',  unit:'fruits'}};

const GEN_NEED_TEXT={TREE_COUNT:'This job is reported as a count per tree — the worker adds one line per tree.',
  AREA:'This job is reported as a number of trees covered, plus the hours worked.'};

/* =====================================================================
   7. v2.7 — GROWTH PHASE MAP
   Which physiological stage the tree is in during each programme month.
   Anchored on the 2026 schedule with the 21–22 Aug peak drop.
   To re-map a month to a different stage, edit MONTH_PHASE here only.
   ===================================================================== */
const GROWTH_PHASE_ORDER=['RECOVERY','INDUCTION','FLOWERING','FRUITSET','FRUITDEV','MATURING','HARVEST'];
const GROWTH_PHASE={
  RECOVERY :{label:'Post-harvest recovery',ic:'🌿',note:'Rebuild canopy and root reserves after the drop.'},
  INDUCTION:{label:'Flower induction',     ic:'🌤️',note:'Stress and boosting — push the tree to set flower buds.'},
  FLOWERING:{label:'Flowering',            ic:'🌸',note:'Protect the bloom; nothing that scorches an open flower.'},
  FRUITSET :{label:'Fruit set',            ic:'🫧',note:'Hold the young fruit — calcium, boron, gentle feeding.'},
  FRUITDEV :{label:'Fruit development',    ic:'🟢',note:'Bulking the fruit. Heaviest nutrient and PnD demand.'},
  MATURING :{label:'Fruit maturing',       ic:'🟡',note:'Filling and flavour. Watch every residue cut-off.'},
  HARVEST  :{label:'Harvest / peak drop',  ic:IC_DUR,note:'Collection. Spraying is the exception, not the rule.'}
};
const MONTH_PHASE={'2026 Jan (2)':'RECOVERY','Boosting':'INDUCTION','March':'FLOWERING','April':'FRUITSET',
  'May':'FRUITDEV','May 2':'FRUITDEV','June':'FRUITDEV','June 2':'FRUITDEV','July':'MATURING',
  'Aug':'HARVEST','Sep':'RECOVERY'};

/* =====================================================================
   8. v2.7 — COMBO SET (the 5-part tank mix, mirroring the Excel layout)
   Every spraying programme is expressed as five blocks in a fixed order.
   A sixth OTHER row appears only when a product fits none of them (a
   sticker, for example) — nothing is ever silently misfiled.
   ===================================================================== */
const TANK_LITRES=1000;                      // power spray pump tank capacity, litres
const COMBO_ORDER=['PEST','FUNG','FOL','BIO','TE'];
const COMBO_LABEL={PEST:'Pesticide',FUNG:'Fungicide',FOL:'Foliar',
  BIO:'Biostimulator',TE:'Trace Elements (TE)',OTHER:'Adjuvant / other'};
const COMBO_IC={PEST:'🐛',FUNG:'🍄',FOL:'🌱',BIO:'⚡',TE:'🧪',OTHER:'➕'};
// Product category decides first — a pesticide is a pesticide whatever it contains.
const COMBO_CAT={Pesticide:'PEST',Fungicide:'FUNG',Herbicide:'PEST'};
// Then the active ingredient, checked IN THIS ORDER. Biostimulant words win over the
// nutrient words printed beside them: "Amino acid + Zinc" is a biostimulant, not a TE.
const COMBO_AI_RULES=[
  ['BIO',['amino','seaweed','ascophyllum','humic','fulvic','auxin','cytokinin','gibberell','ga3',
          'paclobutrazol','sorbitol','biostimul','rooting','hormone']],
  ['TE', ['zinc','boron','copper','mangan','molybd','iron','silicon','micronutrient','trace',
          'calcium','magnesium','mgs','polyhalite']],
  ['FOL',['npk','potassium','phosphate','mkp','foliar','nutrient','urea','nitrogen','nitrate']]
];
// Last resort when the active ingredient is blank or still "(confirm — see label)".
const COMBO_CAT_FALLBACK={Foliar:'FOL',Fertiliser:'FOL',Powder:'TE','Growth Reg':'BIO'};

/* =====================================================================
   9. v2.8 / v3.7 — FRUIT LOSS CAUSES + HIGH-MOISTURE THRESHOLD
   A loss count is never accepted without a cause: the reason is what
   turns a loss figure into an agronomic decision.

   v3.7 ADDED `UNRIPE`, and renamed the card this list sits under from "Rotten" to
   "Loss" — because an unripe durian is not rotten, and a heading that says otherwise
   makes the app state something untrue. It also matters agronomically: animal, pest and
   disease all point at pest management, while unripe points at water or nutrient stress,
   and premature drop is one of the earliest stress signals the farm gets. Burying it in
   a rot bucket would hide exactly the thing worth seeing early.

   ADDING A FIFTH CAUSE IS A PURE DATA CHANGE. Every screen that shows a cause - the
   collect dropdown, the Owner's backdate modal, the daily-audit chips - loops over
   ROT_ORDER or Object.keys(ROT_CAUSE). Nothing below needs editing.
   ===================================================================== */
const ROT_ORDER=['ANIMAL','PEST','DISEASE','UNRIPE'];
const ROT_CAUSE={
  ANIMAL :{label:'Animal damage',     ic:'🐿️',note:'squirrel, monkey, rat, civet'},
  PEST   :{label:'Pest infestation',  ic:'🐛',note:'fruit borer, weevil, fruit fly'},
  DISEASE:{label:'Disease rot',       ic:'🍄',note:'Phytophthora, anthracnose, stem-end rot'},
  UNRIPE :{label:'Unripe',            ic:'🟢',note:'not mature — usually water or nutrient stress'}
};
/* The four causes are not all the same KIND of loss. Animal, pest and disease are damage;
   unripe is a physiological drop. The daily audit keeps them apart in the tooltip so the
   Owner reads a stress signal as a stress signal, not as another pest problem. */
const ROT_KIND={ANIMAL:'DAMAGE',PEST:'DAMAGE',DISEASE:'DAMAGE',UNRIPE:'PHYSIOLOGICAL'};

// Cumulative rainfall over RAIN_WET_DAYS above RAIN_WET_MM raises the high-moisture
// badge on the timeline: wet canopy, wash-off risk, and Phytophthora pressure.
const RAIN_WET_DAYS=3;
const RAIN_WET_MM=30;

/* =====================================================================
   10. v2.8.3 — OPENING FRUIT-TYING BALANCE
   Rebuilt 2 Aug 2026 DIRECTLY from the farm's own record —
   "Durian Farm Record- Census" (Google Sheet 1hxSMyFl…), tabs LOT A / LOT B / LOT C,
   the sheet the field team actually writes into.

   WHY IT WAS REBUILT. The first import (v2.8.2) came from the migrated
   Sugut_DMS_Database_v1.xlsx and was wrong: its CENSUS_EVENTS tab had shifted Lot B's
   tying up by one tree for rows B-002…B-008 (so B-002's 32 fruit were filed against
   B-001, which the farm never tied at all) and carried a phantom row of 4 fruit on
   B-008 that appears nowhere in the farm's record. Checked against the farm sheet, all
   171 tree IDs, all 171 clones and all 171 census counts agreed exactly — only the
   tying column was corrupted. Corrected figure: 959 fruit on 63 trees, not 963 on 64.

   STATIC SEED DATA, not an event queue. Shipped identically to every phone, never
   written to IndexedDB, never synced — the rows already live in the farm's sheet, so
   double-counting is impossible rather than merely guarded against. Fruit tied from
   now on is logged by workers as normal TASK_DONE / FRUIT_TYING replies on top of this.
     t = tree · d = date tied · n = fruits tied · u = source cell (lot, row, date)
   ===================================================================== */
const TIE_MIGRATION_RETIRED_2026_08_09=[{"t":"A-011","d":"2026-07-21","n":6,"u":"A11/07-21"},{"t":"A-011","d":"2026-07-27","n":5,"u":"A11/07-27"},{"t":"A-013","d":"2026-07-27","n":7,"u":"A13/07-27"},{"t":"A-023","d":"2026-07-27","n":4,"u":"A23/07-27"},{"t":"A-026","d":"2026-07-27","n":4,"u":"A26/07-27"},{"t":"A-027","d":"2026-07-27","n":7,"u":"A27/07-27"},{"t":"B-002","d":"2026-07-20","n":17,"u":"B2/07-20"},{"t":"B-002","d":"2026-07-26","n":15,"u":"B2/07-26"},{"t":"B-003","d":"2026-07-20","n":22,"u":"B3/07-20"},{"t":"B-003","d":"2026-07-26","n":10,"u":"B3/07-26"},{"t":"B-004","d":"2026-07-20","n":24,"u":"B4/07-20"},{"t":"B-004","d":"2026-07-26","n":27,"u":"B4/07-26"},{"t":"B-005","d":"2026-07-20","n":15,"u":"B5/07-20"},{"t":"B-005","d":"2026-07-22","n":2,"u":"B5/07-22"},{"t":"B-005","d":"2026-07-26","n":14,"u":"B5/07-26"},{"t":"B-006","d":"2026-07-20","n":20,"u":"B6/07-20"},{"t":"B-006","d":"2026-07-26","n":12,"u":"B6/07-26"},{"t":"B-007","d":"2026-07-14","n":18,"u":"B7/07-14"},{"t":"B-007","d":"2026-07-26","n":11,"u":"B7/07-26"},{"t":"B-008","d":"2026-07-20","n":24,"u":"B8/07-20"},{"t":"B-009","d":"2026-07-14","n":7,"u":"B9/07-14"},{"t":"B-009","d":"2026-07-26","n":19,"u":"B9/07-26"},{"t":"B-010","d":"2026-07-14","n":9,"u":"B10/07-14"},{"t":"B-010","d":"2026-07-26","n":1,"u":"B10/07-26"},{"t":"B-022","d":"2026-07-14","n":2,"u":"B22/07-14"},{"t":"B-023","d":"2026-07-14","n":14,"u":"B23/07-14"},{"t":"B-023","d":"2026-07-24","n":16,"u":"B23/07-24"},{"t":"B-024","d":"2026-07-14","n":1,"u":"B24/07-14"},{"t":"B-025","d":"2026-07-15","n":8,"u":"B25/07-15"},{"t":"B-025","d":"2026-07-24","n":22,"u":"B25/07-24"},{"t":"B-026","d":"2026-07-15","n":12,"u":"B26/07-15"},{"t":"B-026","d":"2026-07-24","n":13,"u":"B26/07-24"},{"t":"B-027","d":"2026-07-15","n":7,"u":"B27/07-15"},{"t":"B-027","d":"2026-07-24","n":19,"u":"B27/07-24"},{"t":"B-028","d":"2026-07-15","n":3,"u":"B28/07-15"},{"t":"B-028","d":"2026-07-22","n":14,"u":"B28/07-22"},{"t":"B-029","d":"2026-07-15","n":5,"u":"B29/07-15"},{"t":"B-029","d":"2026-07-22","n":12,"u":"B29/07-22"},{"t":"B-030","d":"2026-07-15","n":1,"u":"B30/07-15"},{"t":"B-030","d":"2026-07-22","n":8,"u":"B30/07-22"},{"t":"B-033","d":"2026-07-23","n":3,"u":"B33/07-23"},{"t":"B-035","d":"2026-07-23","n":4,"u":"B35/07-23"},{"t":"B-036","d":"2026-07-23","n":5,"u":"B36/07-23"},{"t":"B-037","d":"2026-07-23","n":3,"u":"B37/07-23"},{"t":"B-038","d":"2026-07-23","n":5,"u":"B38/07-23"},{"t":"B-039","d":"2026-07-23","n":8,"u":"B39/07-23"},{"t":"B-040","d":"2026-07-23","n":8,"u":"B40/07-23"},{"t":"B-041","d":"2026-07-16","n":21,"u":"B41/07-16"},{"t":"B-041","d":"2026-07-22","n":6,"u":"B41/07-22"},{"t":"B-042","d":"2026-07-16","n":1,"u":"B42/07-16"},{"t":"B-042","d":"2026-07-23","n":2,"u":"B42/07-23"},{"t":"B-043","d":"2026-07-16","n":7,"u":"B43/07-16"},{"t":"B-043","d":"2026-07-25","n":9,"u":"B43/07-25"},{"t":"B-044","d":"2026-07-16","n":18,"u":"B44/07-16"},{"t":"B-044","d":"2026-07-26","n":14,"u":"B44/07-26"},{"t":"B-045","d":"2026-07-16","n":24,"u":"B45/07-16"},{"t":"B-045","d":"2026-07-22","n":24,"u":"B45/07-22"},{"t":"B-046","d":"2026-07-19","n":10,"u":"B46/07-19"},{"t":"B-046","d":"2026-07-26","n":7,"u":"B46/07-26"},{"t":"B-047","d":"2026-07-19","n":23,"u":"B47/07-19"},{"t":"B-048","d":"2026-07-19","n":6,"u":"B48/07-19"},{"t":"B-051","d":"2026-07-14","n":4,"u":"B51/07-14"},{"t":"B-052","d":"2026-07-14","n":4,"u":"B52/07-14"},{"t":"B-054","d":"2026-07-17","n":18,"u":"B54/07-17"},{"t":"B-054","d":"2026-07-25","n":16,"u":"B54/07-25"},{"t":"B-055","d":"2026-07-17","n":3,"u":"B55/07-17"},{"t":"B-055","d":"2026-07-25","n":5,"u":"B55/07-25"},{"t":"B-057","d":"2026-07-26","n":1,"u":"B57/07-26"},{"t":"B-058","d":"2026-07-19","n":10,"u":"B58/07-19"},{"t":"B-058","d":"2026-07-25","n":7,"u":"B58/07-25"},{"t":"B-059","d":"2026-07-19","n":10,"u":"B59/07-19"},{"t":"B-061","d":"2026-07-24","n":1,"u":"B61/07-24"},{"t":"B-062","d":"2026-07-24","n":8,"u":"B62/07-24"},{"t":"B-064","d":"2026-07-24","n":4,"u":"B64/07-24"},{"t":"C-005","d":"2026-07-21","n":4,"u":"C5/07-21"},{"t":"C-005","d":"2026-07-27","n":4,"u":"C5/07-27"},{"t":"C-008","d":"2026-07-21","n":13,"u":"C8/07-21"},{"t":"C-008","d":"2026-07-27","n":9,"u":"C8/07-27"},{"t":"C-013","d":"2026-07-21","n":13,"u":"C13/07-21"},{"t":"C-013","d":"2026-07-27","n":9,"u":"C13/07-27"},{"t":"C-014","d":"2026-07-21","n":6,"u":"C14/07-21"},{"t":"C-015","d":"2026-07-21","n":9,"u":"C15/07-21"},{"t":"C-015","d":"2026-07-27","n":17,"u":"C15/07-27"},{"t":"C-017","d":"2026-07-21","n":16,"u":"C17/07-21"},{"t":"C-017","d":"2026-07-27","n":7,"u":"C17/07-27"},{"t":"C-018","d":"2026-07-21","n":6,"u":"C18/07-21"},{"t":"C-018","d":"2026-07-27","n":18,"u":"C18/07-27"},{"t":"C-020","d":"2026-07-21","n":6,"u":"C20/07-21"},{"t":"C-020","d":"2026-07-27","n":4,"u":"C20/07-27"},{"t":"C-021","d":"2026-07-27","n":3,"u":"C21/07-27"},{"t":"C-032","d":"2026-07-23","n":13,"u":"C32/07-23"},{"t":"C-032","d":"2026-07-27","n":7,"u":"C32/07-27"},{"t":"C-034","d":"2026-07-27","n":3,"u":"C34/07-27"},{"t":"C-035","d":"2026-07-23","n":4,"u":"C35/07-23"},{"t":"C-035","d":"2026-07-27","n":8,"u":"C35/07-27"},{"t":"C-036","d":"2026-07-23","n":5,"u":"C36/07-23"},{"t":"C-036","d":"2026-07-27","n":6,"u":"C36/07-27"},{"t":"C-037","d":"2026-07-23","n":8,"u":"C37/07-23"},{"t":"C-039","d":"2026-07-22","n":4,"u":"C39/07-22"},{"t":"C-039","d":"2026-07-27","n":1,"u":"C39/07-27"}];

/* =====================================================================
   10b. v3.29.1 — THE OPENING BALANCE IS RETIRED           9 Aug 2026

   The 959-fruit seed above covered 14-27 July. On 9 Aug the whole tying
   record was rebuilt from the paper field book (263 rounds, 2,294 fruit,
   86 trees, 14 Jul - 8 Aug) and logged as real BACKDATED TIE events.
   The book supersedes the seed completely: 92 of the seed's 100 rows
   appear in it unchanged, and the 8 that differ are the one-tree row
   offset the book itself corrects.

   Leaving the seed switched on would have added 959 fruit on top of the
   2,294 the book already contains. It is kept above, unused, so the
   figure can still be traced; TIE_MIGRATION is now empty and every tied
   fruit in the system comes from a real, dated, signed event.
   ===================================================================== */
const TIE_MIGRATION=[];

/* =====================================================================
   11. v2.9 — FRUIT TYING CONSUMABLE
   Tying a fruit uses rope. ROPE_M_PER_FRUIT metres come off the store for
   every fruit a worker ties, filed as an ordinary STOCK_OUT so it lands in
   the same moving-average costing as everything else.

   ROPE_PID points at "Tying rope / string", added to the registry with an
   OPENING STOCK OF ZERO and a ZERO unit price on purpose — nobody has told
   the app how much rope is in the store or what it cost. The Sandakan
   Purchaser keys the real roll count and price through Stock In, exactly as
   for any other material. Until then tying will drive the rope balance
   negative and the app will show it as short, which is the truth: the
   consumption is real and the opening balance is unknown. It is never
   guessed at.
   ===================================================================== */
const ROPE_PID=68;
const ROPE_M_PER_FRUIT=1.5;
/* v3.26.1 — ROPE IS NOT TRACKED THIS SEASON. Owner's decision, 7 Aug 2026: this is the farm's
   first season on the system and rope was never set up as a stock item — pid 68 does not exist
   in PRODUCTS at all (the list ends at 67), so 454.5 m had been consumed against a product that
   was not there, the balance sat permanently negative, and the tying screen kept telling the
   crew to ask the Purchaser to key in rolls that were never going to be keyed in. Turning this
   off stops rope being deducted, costed, badged or displayed. Nothing is deleted and no other
   material is affected — set it back to true and add pid 68 to PRODUCTS to switch it on again. */
const ROPE_TRACKING=false;

/* =====================================================================
   12. v2.9 — DROP AND ROTTEN CLASSIFICATION
   A fruit comes off the tree either still on its string (SECURED) or with no
   string on it (UNSECURED — an early wave that was never tied). The two tell
   completely different stories about the crop, so the worker states which.
   ===================================================================== */
const DROP_KIND={
  SECURED  :{label:'Secured drop',  ic:'🪢', note:'found with the string still on it'},
  UNSECURED:{label:'Unsecured drop',ic:'🍃', note:'no string — an early drop wave'}
};
const DROP_ORDER=['SECURED','UNSECURED'];

/* =====================================================================
   13. v3.0 — FRUIT GRADING   (v3.30.0: a FOURTH grade, BN — banana shape)
   Every good fruit collected is counted under one of four grades. The
   grade travels on the DROP event itself, so the harvest count, the
   marketing basket and the retailer invoice all read the same letter.

   BN — "banana" — is a SHAPE grade, and it is NOT a loss.
   A rotten fruit cannot be eaten; a banana-shaped fruit is perfectly
   edible and simply cannot be sold at grade. Reporting the two together
   would hide both problems at once, so BN counts with the GOOD fruit and
   is reported on its own line. `shape:true` is the marker, and it earns
   two behaviours that are worth understanding before you touch them:

     - BN is DELIBERATELY ABSENT FROM GRADE_BAND below. Every other letter
       is decided by the fruit's WEIGHT; banana is decided by EYE. Because
       bandOf() returns null for a grade with no band, the grade-versus-
       weight drift warning switches ITSELF off for BN — there is no
       special case anywhere in app.js. Add a BN row to GRADE_BAND and you
       re-arm that warning on every banana fruit, and the crew will learn
       to ignore warnings. Do not.
     - gradeForWeight() likewise never SUGGESTS a shape grade.

   Why it earns its place beyond the cheap sale price: a misshapen,
   lopsided durian is a documented sign of INCOMPLETE POLLINATION (also
   boron or calcium shortage, or water stress). Once banana is its own
   grade, the BN share per lot and per clone becomes a pollination score
   on the season report — worth far more than the fruit itself.
   ===================================================================== */
const GRADE_ORDER=['A','B','C','BN'];
const GRADE_META={
  A :{label:'Grade A', short:'A',  note:'export / premium pick'},
  B :{label:'Grade B', short:'B',  note:'local premium'},
  C :{label:'Grade C', short:'C',  note:'kampung / processing'},
  BN:{label:'Banana',  short:'🍌', note:'wrong shape — edible, cheap sale or FOC',
      shape:true}
};
/** The letters decided by weight — everything except the shape grades.
 *  Use this, not GRADE_ORDER, anywhere a weight band is implied. */
const GRADE_WEIGHED=GRADE_ORDER.filter(function(g){return !(GRADE_META[g]||{}).shape;});

/* =====================================================================
   13b. v3.30.0 — FRUIT THAT LEAVES WITHOUT AN INVOICE
   Not every fruit that leaves the shed is sold. Some is a worker's
   ration, some is a gift, some goes to a buyer as a sample, and some is
   simply not fit to sell by the time anyone looks at it. Until now none
   of that had a record, so the shed figure quietly drifted and nobody
   could say where the fruit went.

   THE CONTROL IS AN EQUATION, and it is the whole point of this section:

       came in the gate = sold + cheap sale + FOC + dumped + still in shed

   If it does not balance, fruit left with no record — which is exactly
   what the Owner wants to see.

   Two rules that keep it honest:
     - EVERY outflow is a REQUEST that the Gate approves or refuses. A
       worker asks on his phone; the card lands in the Marketer's queue
       beside the weigh-ins. Nothing leaves unapproved.
     - EVERY outflow is VALUED at what it would have sold for, from the
       live clone x grade book. Giving away Grade A costs RM 40 a kilo
       even though no money moved, and the approval card says so BEFORE
       she taps. A gift nobody prices is a gift nobody counts.

   `capKgMonth` is a SOFT control: over the line it warns, it never
   blocks. Blocking a worker on trial day is how people stop using a
   system and go back to paper. 0 = no limit set.
   `isLoss` separates fruit GIVEN (still a benefit to someone) from fruit
   LOST (pure waste) — the season report must never add those together.
   ===================================================================== */
const FOC_REASONS={
  RATION:{label:'Worker ration',  ic:'👷', capKgMonth:200,
          note:'the crew’s own fruit'},
  GIFT  :{label:'Family & gift',  ic:'🎁', capKgMonth:0,
          note:'the Owner’s gifts — no limit set, so it only ever warns on value'},
  SAMPLE:{label:'Buyer sample',   ic:'🧪', capKgMonth:50,
          note:'given to a merchant to win an order'},
  DUMP  :{label:'Dumped',         ic:'🗑️', capKgMonth:0, isLoss:true,
          note:'reached the shed but was not fit to sell — waste, not a gift'}
};
const FOC_REASON_ORDER=['RATION','GIFT','SAMPLE','DUMP'];
/** The states a request can be in. A row is never edited: the decision is
 *  its own append-only row pointing back at the request, exactly like
 *  every other correction in this app. */
const FOC_STATUS={PENDING:'PENDING',APPROVED:'APPROVED',REFUSED:'REFUSED'};

/* v3.37.4 — WHY A WEIGHED LOAD DOES NOT GO. These replace a prompt() box, which several
   Android WebViews refuse to open at all — the cancel then ended in silence. Four buttons
   covering what actually happens at the gate, plus a free note for everything else. The
   chosen label is written into DISPATCH_CANCEL.reason as readable text, exactly as the
   typed answer used to be, so every screen that already reads that field is untouched. */
const CANCEL_REASONS=[
  {k:'LORRY',  t:'rl_c_lorry',  en:'The lorry left without it'},
  {k:'BUYER',  t:'rl_c_buyer',  en:'The buyer does not want it'},
  {k:'REWEIGH',t:'rl_c_reweigh',en:'Weighed wrong — starting again'},
  {k:'ELSE',   t:'rl_c_else',   en:'The fruit went somewhere else'}
];

/* =====================================================================
   14. v3.1 / v3.6 — MULTI-MERCHANT CREDIT MASTER
   The Owner edits this list in Marketing -> PRICES & RETAILERS and the
   edited list is what persists.

   `opening_credit_rm` is the ONLY stored money figure. The live figure,
   `current_credit_balance_rm`, is DERIVED from the event log
   (opening + top-ups - dispatches) exactly like every other balance in
   this app, so a stored total can never drift from the deliveries behind
   it. Delete a dispatch and the credit comes back by itself.

   v3.6 REPLACED THIS LIST. It is now three independent merchant accounts,
   each carrying its own `pricing` mode and — for a contract buyer — its own
   `contract` clone x grade matrix. The two v3.1 sample buyers are retired.

   `pricing` is the whole of the new engine:
     'CONTRACT'  this merchant has negotiated rates. `contract` is read and
                 the Owner's daily spot panel is IGNORED for them, so a
                 trend move never silently rewrites a signed contract.
     'SPOT'      no contract. Prices come from CLONE_PRICE, the matrix the
                 Owner moves on the market-trend panel every morning. This
                 is what 'Default Cash' is for: a walk-in buyer at today's
                 market rate.

   `current_credit_balance_rm` appears on every retailer object so the shape
   matches the schema, but READ IT THROUGH retailerCredit(id) — it is
   DERIVED from opening + top-ups - dispatches, never stored, so it can
   never drift from the deliveries behind it. The seed value below is the
   opening figure repeated, nothing more.
   ===================================================================== */
const RETAILER_SEED=[
  {id:'RT-01',   name:'Roll',         contact:'',  opening_credit_rm:15000,
   current_credit_balance_rm:15000, status:'Active', pricing:'CONTRACT'},
  {id:'RT-02',   name:'Seng Kee',     contact:'',  opening_credit_rm:15000,
   current_credit_balance_rm:15000, status:'Active', pricing:'CONTRACT'},
  {id:'RT-CASH', name:'Default Cash', contact:'',  opening_credit_rm:0,
   current_credit_balance_rm:0,     status:'Active', pricing:'SPOT', pay_type:'CASH'}
];

/* The contract book, one matrix per merchant, keyed by retailer id.
   B24, TB and the four clones added on 1 Sep 2026 (GP, XO, D99, TNB) are
   NOT in either negotiated brief. B24 was agreed on 3 Aug to follow 101 /
   UM, TB is the unidentified clone sold on the same 2-grade ladder, and
   the Owner's instruction on the new four was "the rate are the same as
   101" - so all of them mirror the 101 / UM line — both mirror the 101 / UM line in each contract so a
   basket of them can never invoice at RM 0. Correct them in
   Marketing -> PRICES & RETAILERS when the buyer confirms a rate. */
const RETAILER_CONTRACT_SEED={
  'RT-01':{                        // Roll — the alliance rates
    MK   :{A:40, B:30, C:25},
    BT   :{A:45, B:35},
    B24  :{A:25, B:20},
    '101':{A:25, B:20},
    UM   :{A:25, B:20},
    GP   :{A:25, B:20},          // v3.70.0 - added on the 101/UM line, 1 Sep 2026
    XO   :{A:25, B:20},
    D99  :{A:25, B:20},
    TNB  :{A:25, B:20},
    TB   :{A:25, B:20}
  },
  'RT-02':{                        // Seng Kee — RM 1-2 above Roll across the book
    MK   :{A:42, B:32, C:26},
    BT   :{A:47, B:36},
    B24  :{A:26, B:21},
    '101':{A:26, B:21},
    UM   :{A:26, B:21},
    GP   :{A:26, B:21},          // v3.70.0 - RM 1 above Roll, same as the rest of his book
    XO   :{A:26, B:21},
    D99  :{A:26, B:21},
    TNB  :{A:26, B:21},
    TB   :{A:26, B:21}
  }
};
/* Stamped into kv `retmig` the first time a phone upgrades to v3.6, so the
   merchant migration runs exactly once and never re-writes a list the Owner
   has since edited. */
const RETAILER_MIGRATION_TAG='v3.6';
const CASH_RETAILER_ID='RT-CASH';

/* =====================================================================
   14b. v3.6 — SCALE PHOTO PROOF
   The worker photographs the digital scale display; the marketer audits
   that photo before a single ringgit of credit moves. The image is
   downscaled and re-encoded IN THE BROWSER before it ever enters the
   queue, because it has to travel worker phone -> Google Sheet -> marketer
   phone over a shared office hotspot, and a raw phone photo is 3-4 MB.

   640 px on the long edge keeps a scale display perfectly legible while
   landing around 25-35 KB of base64 — comfortably inside a Google Sheets
   cell, which caps at 50,000 characters. PHOTO_MAX_CHARS is the hard
   ceiling: the encoder steps quality down until it fits, so a busy photo
   can never produce a row the Sheet silently refuses to write.
   ===================================================================== */
const PHOTO_MAX_PX=640;
const PHOTO_Q_START=0.62;
const PHOTO_Q_FLOOR=0.30;
const PHOTO_MAX_CHARS=46000;

/* =====================================================================
   14c. v3.6 — LABOUR COSTING RATE
   Man-hours have been logged since v2.6, but never priced. The monthly
   matrix needs a RM figure per lot, so hours are multiplied by this rate.

   THIS FIGURE IS A PLACEHOLDER, exactly like the basket tare weights.
   The Owner sets the real daily/hourly rate in Costing -> LABOUR, and
   until they do, an amber banner sits above every labour column that
   depends on it. Do not present these RM totals as verified.
   ===================================================================== */
const LABOUR_RATE_SEED=8.00;             // RM per man-hour
const LABOUR_RATE_VERIFIED_SEED=false;

/* The alliance buyer the original matrix was agreed with. Used once, on
   first run, to make sure this account exists on a phone that already
   carries an older retailer list. After that the Owner owns the list. */
const ALLIANCE_RETAILER='Roll';

/* =====================================================================
   15. v3.1 — THE CLONE x GRADE PRICE MATRIX
   Grade is NOT one farm-wide ladder any more. Each clone carries its own
   ladder because Black Thorn at 1.4 kg is still a premium fruit while a
   Musang King at 1.4 kg is a middle grade, and 101 / UM / B24 are simply
   never sorted into a third tier.

   CLONE_GRADES  — which letters exist for that clone. BT, B24, 101 and UM
                   have NO Grade C at all; it is absent from the dropdown,
                   absent from the invoice and absent from the price editor.
   GRADE_BAND    — the per-FRUIT weight window each letter covers, in kg.
                   `max:null` means open-ended. These bands drive the
                   auto-grade hint on the scale: key the fruit count with
                   the weight and the app works out the average fruit and
                   tells the marketer which letter that average falls in.
   CLONE_PRICE_SEED — the agreed opening figures per KG. SEED ONLY: the
                   Owner overwrites them daily on the market-trend panel,
                   and the edited matrix is what every invoice is built
                   from. Never read a price off this constant at runtime,
                   read it off CLONE_PRICE.
   ===================================================================== */
/* v3.70.0 - THE ONE LIST. Sell order, display order, and (via CLONES at the top of this
   file) the tree-correction picker. The four added on 1 Sep 2026 sit after the farm's
   established clones and before TB, because TB is the "not identified yet" bucket and
   belongs last. Adding a clone here is step 1 of 7 - it also needs a CLONE_NAME, an
   AVG_KG, a CLONE_GRADES ladder, a GRADE_BAND, a CLONE_PRICE_SEED row and a line in
   each merchant's RETAILER_CONTRACT_SEED, or it prices at RM 0. */
const CLONE_SELL_ORDER=['MK','BT','B24','101','UM','GP','XO','D99','TNB','TB'];
CLONES=CLONE_SELL_ORDER.slice();   // see the note at the top of this file
/* v3.30.0 — BN is on EVERY clone's ladder. Any clone can set a badly
   pollinated fruit, so every clone must be able to record one. It is last
   in each list on purpose: the scale card offers the letters in this
   order, and the shape grade belongs after the weight grades. */
const CLONE_GRADES={
  MK   :['A','B','C','BN'],
  BT   :['A','B','BN'],
  B24  :['A','B','BN'],
  '101':['A','B','BN'],
  UM   :['A','B','BN'],
  /* v3.70.0 - the four added 1 Sep 2026. Two weighed letters plus BN, exactly like
     BT / B24 / 101 / UM. Only Musang King has ever earned a third letter here, and a
     clone gets one when the FARM starts sorting it three ways, not before. */
  GP   :['A','B','BN'],
  XO   :['A','B','BN'],
  D99  :['A','B','BN'],
  TNB  :['A','B','BN'],
  TB   :['A','B','BN']   // unverified clone — sold on the 2-grade ladder until identified
};
const BAND_TOP={min:1.5,max:null};      // >= 1.5 kg
/* ⚠ NO 'BN' ROW HERE, ON PURPOSE — see the note on GRADE_META. Banana is a
   SHAPE grade judged by eye; giving it a weight window would re-arm the
   grade-versus-weight drift warning on every banana fruit. */
const GRADE_BAND={
  /* v3.67.0 (29 Aug 2026) - THE OWNER MOVED THE C LINE FROM 1.0 kg TO 1.2 kg.
     His words, after finding a 0.99 kg/fruit load invoiced as Grade A:
     "i found one average fruits weight less that 1.2kg. please change to grade c".
     So B now starts at 1.2, not 1.0, and anything under 1.2 kg is Grade C.
     Only MK has three weighed letters; the other clones keep A/B at 1.5. */
  MK   :{A:{min:1.5,max:null}, B:{min:1.2,max:1.5}, C:{min:0,max:1.2}},
  BT   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  B24  :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  '101':{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  UM   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  GP   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  XO   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  D99  :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  TNB  :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  TB   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}}
};
/* BN carries a real price, not zero. A banana fruit that is GIVEN away is
   still valued at this rate on the FOC book, so the Owner can see what a
   season of gifts actually cost; and a cheap sale is priced from the book
   rather than typed in by hand at the gate. SEED ONLY — the Owner's
   market-trend panel overwrites it like every other rate. */
const CLONE_PRICE_SEED={
  MK   :{A:40, B:30, C:25, BN:10},  // Musang King  — the only 3-grade ladder
  BT   :{A:45, B:35,       BN:12},  // Black Thorn  — top of the book
  B24  :{A:25, B:20,       BN:8 },  // B24          — priced with 101 / UM
  '101':{A:25, B:20,       BN:8 },
  UM   :{A:25, B:20,       BN:8 },  // Udang Merah / Red Prawn
  /* v3.70.0 - the Owner's instruction on 1 Sep 2026 was "the rate are the same as 101",
     so all four open on the D101 line. SEED ONLY, like every row above it: the moment
     the Owner sets a rate in Marketing -> PRICES & RETAILERS the live matrix wins. */
  GP   :{A:25, B:20,       BN:8 },  // Golden Phoenix
  XO   :{A:25, B:20,       BN:8 },  // XO
  D99  :{A:25, B:20,       BN:8 },  // D99
  TNB  :{A:25, B:20,       BN:8 },  // Tenom Beauty
  TB   :{A:25, B:20,       BN:8 }
};

/* =====================================================================
   16. v3.1 — BASKET TARE MASTER
   The scale reads GROSS: fruit plus whatever it is sitting in. The tare is
   subtracted automatically before a single sen is calculated, so nobody is
   ever invoiced for the weight of a plastic crate.

   THESE TWO FIGURES ARE PLACEHOLDERS. Put an EMPTY red box on the scale,
   then an EMPTY blue crate, and key the real readings into
   Marketing -> PRICES & RETAILERS -> BASKET TARE. Until that is done the
   dispatch screen shows an amber "tare not verified" note.
   ===================================================================== */
/* v3.29.7 - THE REAL BASKETS. 'Standard Red Box 2.0 kg' and 'Heavy Blue Crate 3.5 kg' were
   invented placeholders that no one on the farm has ever used, and every load weighed
   against them had the wrong weight taken off. The farm runs TWO baskets, both black: one
   with a metal handle and one without, and the handle is the whole difference in tare.

   TARE IS DELIBERATELY 0 AND UNVERIFIED. A made-up number that looks real is worse than a
   zero that shouts: the app already paints a red "these tare weights have NOT been
   verified" box and every net weight is flagged until somebody puts an EMPTY basket on the
   scale and keys the reading. Put a 2.0 in here and that warning goes quiet while the
   figure stays wrong - and at ~RM 16 a basket that is real money on every single load.
   The Gate sets these next week; until then nothing is silently deducted.

   NONE must stay. It is the "no basket" case and the scale card offers it by id.
   New baskets are added in the app (Prices > Basket tare > ADD A BASKET) and travel to
   every device through the shared `baskets` setting - they do NOT need to be listed here. */
const BASKET_SEED=[
  {id:'BLKH', name:'Black basket — with metal handle', tare_kg:0, ic:'🧺'},
  {id:'BLKP', name:'Black basket — no metal handle',   tare_kg:0, ic:'🧺'},
  {id:'NONE', name:'Loose / no basket',                tare_kg:0, ic:'🍈'}
];
const BASKET_TARE_VERIFIED_SEED=false;

/* Invoice serials run INV-YYYYMMDD-XXX, restarting at 001 every calendar
   day, allocated at the moment the dispatch is confirmed. */
const INVOICE_PREFIX='INV';

/* A dispatch that would take a retailer below this figure raises the
   CRITICAL alert and locks the checkout button. Zero = credit may not go
   negative without the Owner's 6-digit key. */
const CREDIT_FLOOR_RM=0;

/* =====================================================================
   17. v3.2 — DUAL-SIGNATURE YIELD AUDIT
   Two people sign for the same fruit on the same night: the worker who
   COUNTS it at the tree, and the marketer who WEIGHS it at the shed the
   next morning. Divide one by the other and you get the average fruit
   that night. A durian that averages under 0.8 kg or over 4.0 kg is not a
   durian — it is a bookkeeping problem, and it points in a direction:

     avg TOO LOW   more fruit was counted in the orchard than ever reached
                   the scale  ->  leakage between tree and shed, or an
                   inflated count.
     avg TOO HIGH  more weight was weighed out than was ever counted at a
                   tree  ->  fruit reached the scale off the books.

   The pairing window ends at noon on the dispatch day and starts at noon
   the day before, because durian drops at night and is weighed the next
   morning. Both signatories are named on the alert so the Owner knows who
   to ask, and an alert is CLEARED by acknowledging it with a reason —
   never by editing either figure.
   ===================================================================== */
const YIELD_MIN_KG=0.8;          // below this, fruit went missing
const YIELD_MAX_KG=4.0;          // above this, fruit arrived off the books
const YIELD_WINDOW_HOUR=12;      // the night's harvest = the 24 h ending at noon

/* =====================================================================
   21. v3.7 — LANGUAGE TABLES (worker screens only)
   Two tables, same keys. EN is the source of truth and the fallback: if a
   key is missing from MS the app shows the English rather than a blank,
   so a term added in a later release degrades gracefully instead of
   leaving a worker staring at an empty button.

   SCOPE. Only the screens a Farm Worker can actually reach are in here -
   login, the home tiles, Collect, the Tally Clicker, the Morning Scale,
   Today's Tasks, Stock Out and Sync. The costing ledger, contract matrix
   and audit trail are deliberately absent: a wrong Malay term for
   "moving average cost" or "credit overdraft" reads as authoritative and
   is more dangerous than plain English.

   NEVER PUT THESE IN HERE:
     - tree IDs (A-001)      they are printed on the physical QR tags
     - clone codes and names (MK, Musang King)  the trade's own words
     - grade letters A/B/C   they reach the buyer's invoice
     - numbers, dates, weights, invoice serials
     - chemical and fertiliser product names - the label on the drum is
       the safety record, and a translated brand name is a real hazard

   The Malay below is the glossary the Owner approved on 3 Aug 2026.
   Correcting a term is a one-line edit here; nothing else needs touching.
   ===================================================================== */
const EN={"ow_censuscount":"Counted on","ow_projnote3":"The amber line is your own July census \u2014 counted before the fruit was trimmed, so it reads a little high. The grey dashes are not a plan: they are today\u2019s rate carried forward, stopping at the fruit still on the trees.","ow_censusbigger":"so the real crop is larger than that line.","ow_censusline":"July census","ow_censuspart":"The census covered","ow_censusof":"of","ow_censustrees":"trees","ow_projnote2":"The amber line is your own July census \u2014 what the crew counted hanging. The grey dashes are not a plan: they are today\u2019s rate carried forward, stopping at the fruit still on the trees.","ow_leftest":"The \u2248 means part of it is estimated from the July census, not counted string by string.","ow_today":"TODAY","ow_7days":"7 DAYS","ow_season":"SEASON","ow_last7":"Last 7 days","ow_lot":"Lot","ow_farm":"FARM","ow_trees":"Trees","ow_dropped":"Dropped","ow_good":"Good","ow_banana":"Banana","ow_bad":"Bad / loss","ow_losspct":"Loss %","ow_pertree":"Fruit / tree","ow_left":"Left on tree","ow_leftper":"Left / tree","ow_tot":"TOT","ow_bydate":"By date","ow_redsmall":"The small red number is the loss on that day.","ow_leftnote":"Left on tree is what the crew tied, minus what has come down. It is only as good as the tying count.","ow_harvest":"HARVEST","ow_day":"day","ow_stillon":"still on the trees","ow_moredays":"more days","ow_nohang":"nothing tied on the trees yet","ow_todayis":"Today","ow_sidebyside":"lots side by side","ow_chosen":"chosen week","ow_last7lbl":"last 7 days","ow_backtolast7":"Back to the last 7 days","ow_seasonchart":"Collected this season","ow_planned":"Plan the next programme","ow_farm2":"FARM","ow_money":"MONEY","ow_admin":"ADMIN","ow_alltools":"ALL TOOLS","ow_close":"Close","ow_corrwait":"correction(s) waiting for you","ow_focwait":"ration request(s) waiting","ow_unsynced":"records still on this phone \u2014 press SYNC","ow_daysleft":"Days left at this rate","ow_days":"days","ow_peak":"Peak","ow_daysaway":"days away","ow_passed":"already passed","ow_nextset":"Next set","ow_nothing":"Nothing to plan yet","ow_collected":"Collected","ow_proj":"Projection at today\u2019s rate","ow_ifrate":"if the rate holds","ow_now":"now","ow_chartalt":"Fruit collected this season, with a projection at the current rate","ow_projnote":"The farm has no stored season plan, so the dashed line is not a plan \u2014 it is today\u2019s rate carried forward, and it stops at the fruit still on the trees.","foc_myrecord":"My record","foc_gotthismonth":"you have had this month","foc_ofallow":"of the","foc_allowword":"allowance","foc_when":"Date","foc_what":"What","foc_answer":"Answer","foc_norecord":"Nothing decided yet. Anything you ask for will show here with the answer.","foc_askfruit":"Ask for fruit","ask_s1":"WHAT FOR","ask_s2":"WHO","ask_s3":"WHICH FRUIT","ask_s4":"HOW MANY","ask_me":"FOR ME","ask_medesc":"It goes on your own record and your own allowance","ask_other":"SOMEBODY ELSE","ask_otherdesc":"Key their name on the next line","ask_next":"NEXT","ask_back":"BACK","ask_needwho":"Key the name of the person receiving it.","ask_howmany":"How many fruit?","ask_about":"about","ask_estnote":"An estimate at this clone\u2019s average. The Gate weighs it for real when she hands it over.","ask_pickshed":"Tap what is standing in the shed. That is where your fruit will come from, so the clone and the grade are already answered.","ask_instock":"in the shed","ask_shedempty":"The shed is empty right now \u2014 there is no fruit standing to ask for. Try again after the morning collection.","ask_needn":"How many fruit? It must be more than zero.","ask_notetag":"asked by the count \u2014 weight estimated","ask_sent":"sent to the Gate","foc_r_RATION_d":"the crew\u2019s own fruit","foc_r_GIFT_d":"for family, or a gift","foc_r_SAMPLE_d":"given to a merchant to win an order","sy_never":"This phone is not linked to the Google Sheet, so this list only holds what was keyed on it.","sy_notyet":"Not synced yet \u2014 tap here to send what is on this phone and fetch what the others have sent.","sy_lastat":"Last synced","sy_justnow":"just now","sy_minago":"min ago","sy_pressync":"TAP TO SYNC","pr_v_book":"THE BOOK","pr_v_tare":"BASKET TARE","pr_v_cmp":"COMPARE","pr_whichbook":"Which price book?","pr_tapclone":"Tap a clone to set its rates","pr_grade":"grade","pr_trend":"Daily market trend","vf_armhead":"CHECK IT, THEN TAP AGAIN","vf_armgo":"TAP AGAIN TO WRITE THE INVOICE","vf_armno":"NOT YET \u2014 GO BACK","vf_armbal":"Credit after this","vf_armcash":"CASH SALE \u2014 collect it now","vf_armover":"OVERDRAWN \u2014 Owner override signed by","vf_armby":"Weighed by","vf_armseen":"photo checked by","vf_armnote":"Nothing is written until the second tap.","cr_armok":"Approve this change","cr_armack":"Acknowledge this note","cr_armno":"Reject this request","cr_armgo":"TAP AGAIN TO SAVE","cr_armlog":"This files a signed adjustment against that log. The original row is kept.","cr_armtree":"This permanently updates the Tree Master across the whole app.","cr_armback":"The worker sees the answer on his own phone.","sy_checking":"Checking with the other phones\u2026","vb_title":"A newer version is ready","vb_sub":"This phone is still running","vb_safe":"nothing you have keyed is lost","vb_go":"LOAD IT","foc_r_RATION":"Worker ration","foc_r_GIFT":"Family & gift","foc_r_SAMPLE":"Buyer sample","foc_r_DUMP":"Dumped","foc_willask":"\u2014 this is what you are asking for","s_foc":"Rations & Gifts","sy_l_foc":"Rations & gifts","foc_waiting":"Waiting for a decision","foc_none":"Nothing waiting. Every request has been answered.","foc_to":"to","foc_fruit":"fruit","foc_askedby":"asked by","foc_worth":"Worth","foc_atrate":"at","foc_thismonth":"this month","foc_overcap":"this one takes it over the allowance","foc_approve":"APPROVE","foc_refuse":"REFUSE","foc_waitgate":"Waiting for the Gate to decide","foc_give":"Record fruit going out free","foc_reason":"Reason","foc_receiver":"Who gets it","foc_name":"name","foc_clone":"Clone","foc_grade":"Grade","foc_fruitn":"Fruit","foc_kg":"Weight kg","foc_note":"Note","foc_record":"RECORD IT","foc_ask":"ASK THE GATE","foc_book":"The book \u2014 this month","foc_value":"Value","foc_allow":"Allowance","foc_nolimit":"no limit","foc_balance":"Where the fruit went \u2014 this month","foc_camein":"Came in the gate","foc_sold":"Sold to merchants","foc_given":"Given free (FOC)","foc_dumped":"Dumped","foc_shed":"Still in the shed","foc_bal":"Balance","foc_valueword":"value","foc_lost":"lost","foc_missing":"MORE went out than came in","foc_nothingmissing":"nothing missing","foc_negshed":"More fruit has left the shed than the scale ever recorded arriving. Either a weigh-in was never keyed, or a load went out twice.","foc_needkg":"Key the weight first","foc_needwho":"Who is it for?","foc_bad":"Could not file that","foc_notyours":"Only the Gate may decide this","foc_already":"Already decided","foc_gone":"That request is gone","foc_approved":"Approved","foc_refused":"Refused","pe_edit":"✎ EDIT THIS SET","pe_remove":"🗑 REMOVE","pe_planned":"Planned date","pe_dose":"Dose per 1,000 L tank","pe_save":"✓ SAVE THE CHANGE","pe_cancel":"Cancel","pe_saved":"Saved — it reaches the phones on the next sync","pe_removed":"Removed from the plan","pe_restored":"Back in the plan","pe_restore":"↺ PUT IT BACK","pe_removedlbl":"removed from the plan","pe_confirm":"Remove \u201c{s}\u201d from the plan?","pe_noline":"Keep at least one product","pe_active":"Close the active job on this set first","pe_locked":"This set cannot be removed.\n\n{n} stock-out entries are booked against it, worth {rm}. Removing it would leave that spend belonging to no programme at all.\n\nYou can still change the recipe — that only affects what is planned from now on.","pe_editwarn":"{n} stock-out entries worth {rm} are already booked against this set. A change here affects what is planned from now on — it does not touch what was already used.","pc_tag":"PROGRAMME CHANGED","pc_hint":"Tap to open the task","pc_cancel":"THIS SET IS CANCELLED","pc_date":"THE DATE HAS CHANGED","pc_mix":"THE MIX HAS CHANGED","pc_dose":"THE DOSE HAS CHANGED","pr_replan":"plan moved to the finishing day","pr_sheetsaid":"programme sheet ticked","pr_fromsheet":"From the farm programme sheet","pr_started":"started","pr_finished":"finished","pr_dayslate":"days late","pr_ontime":"on time","pr_rows":"stock-out entries","pr_nomaterial":"no material was booked against this set","pr_unconf":"Also listed, product not confirmed","lg_closing":"closing stock",
  /* --- shell, tiles, sections --- */
  hubnote:'Only the sections you are allowed to use are shown.<br>Tap a tile to open it · tap ← or 🏠 to come back.',
  menuhead:'Choose a section. Every one is a full-width row — nothing is hidden off the side of the screen.',
  nav_home:'Home', nav_sync:'Sync',
  m_harvest:'Harvest',      m_tying:'Fruit Tying',   m_scale:'Morning Scale',
  m_ops:'Daily Ops',        m_inv:'The Store',
  s_collect:'COLLECT',      s_collect_d:'Count good fruit by grade, and loss with its cause',
  s_tally:'TALLY CLICKER',  s_tally_d:'Tap-count fruit onto the string, tree by tree',
  s_scale:'MORNING SCALE',  s_scale_d:'Weigh the baskets and photograph the scale display',
  s_tasks:"TODAY'S TASKS",  s_tasks_d:'The jobs assigned to you, with one-tap completion',
  s_stockout:'STOCK OUT',   s_stockout_d:'Draw material from the store, against a lot',
  s_stockin:'STOCK IN',     s_stockin_d:'Receive goods against a supplier invoice',
  s_progcheck:'PROGRAM CHECK', s_progcheck_d:'Will the active spray programme run out?',
  s_nextphase:'NEXT PHASE', s_nextphase_d:'What to order now for the phase after this one',
  /* --- login --- */
  login_title:'Login', login_ask:'Key in your 6-digit access key',
  login_wrong:'Wrong key. Try again.',
  login_off:'This key is deactivated. Contact owner.',
  login_welcome:'Welcome,',
  /* v3.17.1 — the login screen can now fetch the staff list on its own */
  login_refresh:'GET THE LATEST STAFF LIST',
  login_refreshing:'Checking…',
  login_got:'✓ Staff list updated — {n} keys work on this phone now.',
  login_nourl:'This phone has no Sync URL. Log in with a key it already knows, then set the URL in Settings.',
  login_offline:'No internet. Connect to Wi-Fi or the hotspot, then tap again.',
  login_syncfail:'Could not reach the Google Sheet. Try again at the hotspot.',
  login_dirty:'This phone holds staff changes not yet pushed. Log in as Owner and push the registry first.',
  /* --- fruit words --- */
  w_tree:'Tree', w_lot:'Lot', w_good:'Good fruit', w_loss:'Loss', w_rotten:'Rotten',
  w_drop:'Drop', w_secured:'Secured drop', w_unsecured:'Unsecured drop',
  w_count:'Count', w_grade:'Grade', w_cause:'Cause', w_fruits:'fruits',
  c_ANIMAL:'Animal damage',  c_ANIMAL_n:'squirrel, monkey, rat, civet',
  c_PEST:'Pest infestation', c_PEST_n:'fruit borer, weevil, fruit fly',
  c_DISEASE:'Disease rot',   c_DISEASE_n:'Phytophthora, anthracnose, stem-end rot',
  c_UNRIPE:'Unripe',         c_UNRIPE_n:'not mature — usually water or nutrient stress',
  /* --- tying --- */
  w_tie:'Tie', w_rope:'Rope', w_ontree:'Still on the tree', w_balance:'Balance',
  /* --- the morning scale --- */
  sc_head:'Morning scale dispatch',
  sc_intro:'Weigh the baskets, key the GROSS reading exactly as the scale shows it, then <b>photograph the scale display</b>. Marketing checks your photo against your figures before the load is invoiced. You are recording weight only — no prices are shown on this screen.',
  sc_nomerchant:'No active merchant on this phone yet. Sync once at the office hotspot so the retailer list arrives.',
  sc_towhich:'Sending to which merchant', sc_choose:'— choose the buyer —',
  sc_tarewarn:'⚠ Basket tare weights are still the factory placeholders — tell the Owner to weigh an empty basket. Your GROSS reading is still recorded exactly as you key it.',
  sc_basket:'BASKET', sc_clone:'Clone', sc_grade:'Grade', sc_baskettype:'Basket type',
  sc_howmany:'How many baskets', sc_gross:'GROSS on scale (kg)', sc_fruitcount:'Fruit count',
  sc_addbasket:'＋ ADD ANOTHER BASKET',
  sc_photohead:'📷 Photo proof — required',
  sc_nophoto:'No photo yet. The load cannot be submitted without one.',
  sc_photook:'Photo attached', sc_retake:'retake',
  sc_takephoto:'[ 📷 Take Photo of Scale Weight ]',
  sc_photohint:'Hold the phone square to the scale so the numbers are readable. The photo is shrunk automatically so it will still send on a slow hotspot.',
  sc_note:'Note (optional)', sc_noteph:'e.g. lorry BKS 4412, driver Amin',
  sc_submit:'📤 SUBMIT TO MARKETING FOR APPROVAL',
  sc_waiting:'📤 Waiting on Marketing',
  sc_nothingwaiting:'Nothing waiting. Everything you sent has been approved or returned.',
  sc_decided:'Recently decided',
  sc_pending:'PENDING', sc_approved:'APPROVED', sc_returned:'RETURNED',
  sc_queued:'queued on this phone',
  sc_total:'TOTAL NET', sc_keyfirst:'Key the gross reading for at least one basket.',
  sc_gross_calc:'Gross', sc_tare_calc:'tare', sc_net_calc:'NET', sc_avg:'avg',
  /* --- v3.8 · direct-touch scale form --- */
  sc_addnext:'➕ ADD NEXT BASKET',
  /* --- v3.37.4 · the fix and the cancel --- */
  rl_c_lorry:'The lorry left without it',
  rl_c_buyer:'The buyer does not want it',
  rl_c_reweigh:'Weighed wrong — starting again',
  rl_c_else:'The fruit went somewhere else',
  rl_cancelq2:'Why is this load not going?',
  rl_cancelgo:'CANCEL THIS LOAD',
  rl_cancelkeep:'The fruit stays counted in the shed — nothing is thrown away, only this delivery is called off.',
  rl_needwhy:'Choose a reason first',
  rl_clonelock:'locked on a correction',
  /* --- v3.37.3 · a step is a place you can leave, and a locked button says why --- */
  nr_needs:'This basket still needs',
  nr_need_w:'the gross reading from the scale',
  nr_need_c:'how many fruit are in it',
  nr_need_p:'a photograph of the scale display',
  nr_odd:'That is one basket of',
  nr_odd2:'Check the decimal point — you can still send it if it is right.',
  /* v3.67.0 — the weight-versus-grade line on the weigh step */
  nr_avg:'Average',
  nr_afruit:'a fruit',
  nr_thatweight:'that weight is',
  nr_youchose:'You have chosen',
  nr_gradematch:'matches the weight.',
  /* --- v3.37.0 · THE NEW ROAD · the scale as four steps --- */
  nr_onlorry:'ON THE LORRY',
  nr_noweight:'not weighed',
  nr_ready:'READY',
  nr_unfinished:'FINISH IT',
  nr_shedledger:'The shed keeps its own record now.',
  nr_shedledger2:'What the crew logged at collection is already here — nothing to type again. Tap what is going on the scale.',
  nr_fruitin:'fruit in this basket',
  nr_weigh:'WEIGH',
  nr_byhand:'Key a basket by hand',
  nr_where:'WHERE IS IT GOING?',
  nr_backshed:'back to the shed',
  nr_backdest:'change destination',
  nr_inbasket:'IN THIS BASKET',
  nr_change:'change',
  nr_scalereads:'SCALE READS — GROSS',
  nr_basketdone:'BASKET DONE',
  nr_onscale:'is on the scale.',
  nr_onequestion:'One question, four answers — every way fruit leaves this farm is a button here, and every one of them is weighed and photographed.',
  nr_d_merch:'TO A MERCHANT',   nr_d_merchs:'the Gate approves · invoice · credit',
  nr_d_cash:'CASH AT THE GATE', nr_d_cashs:'walk-in buyer · paid now',
  nr_d_free:'FREE — RATION / GIFT', nr_d_frees:'weighed, not typed',
  nr_d_dump:'DUMPED',           nr_d_dumps:'rotten or damaged · a valued loss',
  nr_r2:'ROUND 2', nr_r2head:'Round 2',
  nr_r2body:'cash, rations and dumps cross this same scale in the next release. Until then they stay on the screens they live on today — nothing was taken away.',
  nr_whichmerchant:'WHICH MERCHANT?',
  nr_load:'THE LOAD',
  nr_send:'SEND TO THE GATE',
  nr_seam1:'Seam 1 closed',
  nr_seam1b:'clone and grade come FROM the shed — never typed twice. The layer tags carry the lot, so the money later knows which trees earned it.',
  nr_seam2:'Seam 2 closed',
  nr_seam2b:'the fruit COUNT and the WEIGHED kilos are captured together, in one motion, at one place.',
  nr_seam3:'Seam 3 closed',
  nr_seam3b:'one scale screen. The merchant is a destination, not a different room.',
  e_needbasket:'Weigh at least one basket first',
  /* --- v3.40.0 · the names that collided, and the two new segments --- */
  s_spray:'SPRAY RECORD',  s_spray_d:'What was actually applied, and how it ran against the plan',
  s_credit:'MERCHANT CREDIT', s_credit_d:'What each merchant owes, what was paid, and the balance',
  m5_bylot:'📊 BY LOT', m5_runs:'🧪 RUNS', m5_labour:'👷 LABOUR', m5_bymonth:'📒 BY MONTH',
  m5_applied:'📝 WHAT WAS APPLIED', m5_plan:'🏁 PLAN vs DONE',
  /* --- v3.39.0 · THE SHED replaces the backlog --- */
  rc_weighhere:'WEIGH A LOAD FOR THIS MERCHANT',
  rc_weighnote:'Weighing happens on the Morning Scale — the shed, the basket, the photograph and the harvest it came from, then one tap to invoice. It writes the same invoice this card used to, and the lot behind every kilo travels with it.',
  rc_openscale:'OPEN THE MORNING SCALE',
  foc_weighit:'Fruit going out free is weighed like everything else — open the Morning Scale, weigh the basket, and choose 🎁 FREE or 🗑 DUMPED. It draws off the shed, stamps the harvest it came from, and lands here already answered.',
  shd_head:'THE SHED',
  foc_shedfruit:'counted, not estimated',
  shd_standing:'fruit standing in the shed right now',
  shd_standing2:'standing now',
  shd_onenumber:'This is the same count the Morning Scale draws from — it cannot disagree with what a worker is allowed to weigh.',
  shd_intoday:'collected today',
  shd_outtoday:'left today',
  shd_atgate:'waiting at the gate',
  shd_whatsleft:'WHAT IS STANDING, AND FROM WHICH HARVEST',
  shd_wentwhere:'WHERE THE FRUIT WENT — THIS SEASON',
  shd_alarm:'More fruit has left than was ever counted in',
  shd_alarmnote:'Either a collection was never keyed, or fruit left without a record. The drop log is the first place to look.',
  shd_kgweighed:'Kilograms are shown only where fruit actually crossed the scale. The shed itself is counted in fruit, because a count is measured at both ends and a weight upstream is only ever an estimate.',
  /* --- v3.38.0 · ROUND 2 — the other three doors out of the shed --- */
  nr_seam4:'Seam 4 closed',
  nr_seam4b:'every way fruit leaves this farm is now one of these four buttons. All four are weighed, all four draw off the same shed, and all four are worth money — a dumped basket at the price it would have fetched.',
  nr_go_inv:'CONFIRM & INVOICE',
  nr_go_cash:'TAKE THE CASH & INVOICE',
  nr_go_free:'GIVE IT — AND RECORD IT',
  nr_go_dump:'WRITE OFF THIS LOSS',
  nr_go_ask:'ASK THE GATE TO APPROVE',
  nr_yes:'YES — DO IT NOW',
  nr_armhead:'TAP AGAIN TO CONFIRM',
  nr_armfoot:'Nothing has been written yet. Go back and change anything you need to.',
  nr_cashhead:'CASH AT THE GATE',
  nr_cashnote:'This is a sale, weighed and invoiced like any other — the only difference is that it is paid now, so it leaves no credit behind it.',
  nr_buyer:'WHO IS BUYING?',
  nr_buyerph:'a name for the receipt',
  nr_cashrow:'Recorded against',
  nr_cashspot:'priced at the farm’s spot rate',
  nr_cashdue:'CASH TO COLLECT',
  nr_pricedatgate:'The Gate prices this load — your phone records the weight.',
  nr_norate:'No spot rate is set for',
  nr_paid:'PAID CASH',
  nr_freehead:'WHY IS THIS FRUIT FREE?',
  nr_receiver:'WHO IS RECEIVING IT?',
  nr_receiverph:'the name that goes on the record',
  nr_thismonth:'this month',
  nr_overcap:'over the allowance — the Gate decides',
  nr_dumphead:'WHAT HAPPENED TO IT?',
  nr_dumpnote:'A dumped basket is weighed and valued at what it would have fetched. It is a loss the farm can see, not fruit that quietly disappeared.',
  nr_dumped:'Dumped',
  nr_why:'WHY IS IT NOT FIT TO SELL?',
  nr_whyph:'e.g. split open, fell 2 days ago, worm',
  nr_lossworth:'THIS LOSS IS WORTH',
  nr_recorded:'recorded',
  nr_waitgate:'waiting for the Gate',
  nr_atgate:'weighed at the gate',
  sc_optional:'optional',
  e_needreceiver:'Say who is receiving this fruit',
  e_needreason:'Choose a reason',
  e_needwhy:'Say what happened to this fruit',
  e_creditover:'Credit exceeded — the Owner keys the 6-digit override before this load can go',
  foc_photoon:'photographed on the weighing phone',
  foc_nophoto:'no photograph',
  foc_approveall:'APPROVE ALL',
  /* --- v3.37.0 · THE SHED, and the picker that draws off it --- */
  shd_title:'THE SHED',
  shd_fruit:'fruit',
  shd_tap:'Tap what this basket is filled with',
  shd_lot:'Lot',
  shd_more:'more',
  shd_leftinshed:'left in the shed',
  shd_fromgrade:'from Grade',
  shd_alsodraws:'also draws from',
  shd_over:'more fruit than the shed has a record of. Send it if the fruit is real — the drop log is what needs fixing.',
  shd_none:'No fruit logged in the shed yet. Key the baskets by hand below — the shed fills up from the daily collection.',
  sc_takephoto2:'📷 TAKE PHOTO OF SCALE WEIGHT',
  sc_photodone:'PHOTO CAPTURED',
  sc_phototap:'tap to retake',
  sc_tarefoot:'Basket tare weights are not yet confirmed by the Owner. Your GROSS reading is recorded exactly as you key it.',
  /* --- v3.8 · the Scale Tally Gatepass --- */
  gp_head:'📋 Scale Tally Gatepass',
  gp_locked:'SUBMITTED · LOCKED',
  gp_showdriver:'Show this screen to the lorry driver before he leaves.',
  gp_merchant:'Merchant', gp_time:'Submitted', gp_ref:'Ref',
  gp_baskets:'Baskets loaded', gp_fruits:'Total fruit count',
  gp_net:'Total NET weight', gp_gross:'Gross on scale', gp_tare:'Basket tare deducted',
  gp_tally:'NET weight tally — by clone &amp; grade',
  gp_grade:'Grade', gp_nolines:'No weighed baskets on this load.',
  gp_noprice:'Weight and count only. This gatepass carries no prices.',
  gp_newload:'➕ START A NEW LOAD',
  gp_close:'✕ CLOSE GATEPASS',
  gp_taphint:'Tap any load below to show its gatepass again.',
  gp_note:'Note',
  /* --- v3.8.1 · telling the worker the truth about their load --- */
  gp_notsent:'⚠ NOT YET RECEIVED BY THE OFFICE. This load is still on this phone. Bring it to the office hotspot and press Sync.',
  sc_notsent:'NOT SENT',
  sc_decided_1:'of your loads has been decided by Marketing',
  sc_decided_n:'of your loads have been decided by Marketing',
  sy_stuck_1:'record is still on this phone — the office has NOT received it',
  sy_stuck_n:'records are still on this phone — the office has NOT received them',
  /* --- v3.9 · compulsory plate, per-basket photo, compulsory count --- */
  sc_plate:'Vehicle plate', sc_plateph:'SS 0000 A',
  sc_platerecent:'Lorries seen this week — tap instead of typing',
  sc_required:'MUST', sc_basketphoto:'📷 PHOTO OF BASKET',
  sc_basketphotosub:'COMPULSORY — one photo for every basket',
  sc_basketdone:'PHOTOGRAPHED', sc_locked:'🔒 SUBMIT IS LOCKED',
  e_needplate:'Key the vehicle plate of the lorry taking this load.',
  e_needcount:'Fruit count is required on basket',
  e_needbphoto:'A photo is required on basket',
  e_needbweight:'No scale reading on basket',
  /* --- v3.9 · the returned-load loop --- */
  rl_head:'load returned — action needed', rl_headn:'loads returned — action needed',
  rl_fix:'🔧 FIX &amp; RESEND THIS LOAD', rl_cancel:'🚫 CANCEL — NOT GOING',
  rl_fixing:'Attempt %A of ref %R', rl_attempt:'ATTEMPT',
  rl_resend:'📤 RESEND AS ATTEMPT', rl_newphoto:'A resend needs a NEW photo on every basket.',
  rl_locked:'Merchant and clone are locked on a correction. Cancel and start again if the buyer is wrong.',
  rl_cancelq:'Cancel this load? The fruit stays counted in the shed.',
  rl_cancelwhy:'Why is it not going?', rl_cancelph:'anything to add? (optional)',
  rl_cancelback:'← Keep this load',
  rl_cancelled:'CANCELLED', rl_cancelok:'🚫 Load cancelled — the fruit stays on the farm',
  rl_tofix:'TO FIX', rl_replaced:'replaced by attempt',
  gp_superseded:'SUPERSEDED · DO NOT USE',
  gp_supersededby:'🚫 This pass was returned and replaced. Use ref %R instead.',
  gp_cancelled:'CANCELLED · DO NOT USE',
  gp_chain:'Attempt %A · previous ref %R was returned',
  gp_photos:'Photo proof — one per basket', gp_basket:'BASKET',
  /* --- v3.9 · what changed between attempts (Marketing) --- */
  vf_attempt:'ATTEMPT', vf_prevreturn:'↩ You returned attempt %A —',
  vf_changed:'What the worker changed', vf_nochange:'⚠ NOTHING CHANGED since the returned attempt',
  vf_gross:'Gross on scale', vf_net:'Net after tare', vf_photo:'Photo',
  vf_replaced:'replaced', vf_same:'unchanged', vf_before:'ATTEMPT %A', vf_after:'THIS ATTEMPT',
  /* --- v3.9 · fruit backlog and trace --- */
  bl_head:'📦 Fruit backlog &amp; trace', bl_tile:'Backlog',
  bl_in:'IN', bl_out:'OUT', bl_backlog:'BACKLOG',
  bl_collected:'Collected', bl_dispatched:'Dispatched', bl_inshed:'Still in shed',
  bl_clonegrade:'CLONE · GRADE', bl_total:'TOTAL', bl_ok:'OK', bl_short:'SHORT',
  bl_none:'Nothing collected yet — the backlog starts when the first fruit is logged.',
  bl_tap:'Tap a row to trace it.',
  bl_opening:'Opening balance', bl_avg:'Avg weight per fruit dispatched',
  bl_check:'CHECK', bl_drift:'Grade %G on %C is %B per fruit. These averaged %V kg.',
  bl_shortnote:'left the gate but were never logged as collected.',
  bl_norot:'Rotten and unripe fruit are not counted here — they never became sellable stock.',
  bl_fruits:'fruits',
  s_backlog:'BACKLOG', s_backlog_d:'Fruit collected, fruit dispatched, what is still in the shed',
  s_shed:'THE SHED', s_shed_d:'What is standing in the shed, which harvest it came from, and where the rest went',
  /* --- v3.9.2 · when each basket was actually weighed --- */
  ts_keyed:'keyed', ts_head:'Weighing times — basket by basket',
  ts_sent:'Sent to Marketing', ts_window:'weighed',
  /* --- v3.10 · a sync that says what is stuck, and photos on demand --- */
  sy_timeout:'the hotspot did not answer in time',
  sy_oldbackend:'the Google Sheet does not understand this yet',
  sy_stuck1:'thing has NOT reached the office', sy_stuckn:'things have NOT reached the office',
  sy_records:'records', sy_retry:'RETRY', sy_retrying:'Trying again…',
  sy_retryok:'sent', sy_retryfail:'still stuck — try again at the hotspot',
  sy_stucknote:'Nothing is lost. These are still saved on this phone and will go up when the connection holds.',
  sy_l_scale:'Scale loads + photos', sy_l_rotten:'Rotten fruit logs',
  sy_l_logadj:'Log corrections', sy_l_dispatch:'Dispatches', sy_l_audit:'Audit trail',
  sy_photoopen:'TAP TO OPEN THE SCALE PHOTO',
  sy_photowhy:'fetched now, so syncs stay fast',
  sy_photoget:'Fetching the photo…',
  sy_photonone:'That photo is not on the Sheet yet — the worker has not synced it.',
  sy_photooffline:'No connection. Open this photo when you are back on the hotspot.',
  /* --- v3.11 shared settings. A setting is not an event: it is the farm's
     current dial position, and every phone must show the same one. --- */
  sy_l_settings:'Shared settings (prices · tare · trees)',
  st_setby:'Set by', st_today:'today', st_updated:'updated on every phone',
  st_refused:'The office kept a newer version of',
  st_pricesaved:'Prices saved — they will reach every phone on the next sync',
  st_taresaved:'Basket weights saved — they will reach every phone on the next sync',
  st_stillunver:'still not weighed on a certified scale',
  st_cloneprice:'clone prices', st_pricemeta:'price notes',
  st_baskets:'basket weights', st_tareok:'tare verified',
  st_addtrees:'added trees',
  st_notshared:'NOT SHARED YET',
  st_notsharednote:'These settings are saved on this phone only. Press Send Data so the office and the other phones use the same numbers.',
  st_neverset:'never changed — still the setup value',
  st_thisphone:'this phone, not sent yet',
  vf_photounknown:'not loaded — tap the photo to compare',
  /* --- scale errors and toasts --- */
  e_pickmerchant:'Choose which merchant this load is going to.',
  e_suspended:'That merchant is suspended.',
  e_needweight:'Key the gross scale reading for at least one basket.',
  e_needphoto:'A photo of the scale display is required before this can be sent.',
  e_notphoto:'That file is not a photo.',
  e_photobig:'That photo is too detailed to send. Take it again closer to the scale display.',
  e_photoread:'The phone could not read that photo.',
  t_shrinking:'Shrinking the photo…', t_photoon:'📷 Photo attached',
  t_sent:'sent to Marketing for approval', t_queuedsuffix:'(queued)',
  /* --- shared buttons --- */
  b_save:'Save', b_cancel:'Cancel', b_remove:'remove', b_confirm:'Confirm',
  w_note:'Note', w_key:'Access key', w_queued:'Queued — not sent yet',
  /* --- sync --- */
  sy_head:'Send the day’s work to the office',
  sy_online:'ONLINE', sy_offline:'OFFLINE',
  bk_blkh:'Black basket — with metal handle', bk_blkp:'Black basket — no metal handle', bk_none:'Loose / no basket',
  ts_harvest:'grade A/B/C, loss', ts_tying:'tally clicker, rope, balances',
  ts_scale:'weigh, photograph, send', ts_ops:'tasks, stock out',
  ts_inv:'stock in/out, levels, alerts',
  /* v3.24 — ROLE-SPECIFIC TILE SUB-LABELS. A tile's sub-label had always been one fixed
     string, so it named sections the reader could not open: Admin advertised "corrections,
     yield, master, keys" to a Marketer entitled to only the last of the four, and after the
     v3.24 narrowing it would have named three screens he does not have. Read by tileSub()
     via ROLE_TILE_SUB, and only where a role's section list actually differs. */
  ts_mkt_harvest:'backlog, wave, farm today',
  ts_mkt_reports:'money, seven-day record, harvest',
  ts_mkt_admin:'staff access keys',
  /* v3.18.5 — the 3-button harvest matrix and the active task notice bar */
  ca_btn:'🧺 GOOD FRUIT', ca_btnsub:'Tap to count',
  ca_counting:'Counting into', ca_intograde:'Counting into grade', ca_string:'String status',
  ca_secbtn:'🨢 SECURED<span class="csub">a string was on it</span>',
  ca_unsecbtn:'🍃 UNSECURED<span class="csub">never tied</span>',
  ca_undo:'⌫ UNDO LAST TAP',
  cb_btn:'🍂 ROTTEN / LOST', cb_btnsub:'Tap only if fruit was lost',
  cb_btnmore:'Tap again to add another',
  tn_today:'PROGRAMME TODAY', tn_late:'OVERDUE',
  tn_pertank:'Per tank: 1,000 L water', tn_pertree:'Per tree',
  tn_waiting:'Waiting for the store — no brand matched yet',
  tn_hint:'Tap to open the task',
  ca_tag:'Card A · good fruit', ca_head:IC_DUR+' Good fruit collected — count each grade',
  ca_note:'Count Grade A, B and C separately. For every grade say whether the fruit came off <b>Secured (Tied)</b> — a string was on it — or <b>Unsecured (Untied)</b>, meaning it was never tied. Leave a grade on 0 if none was picked.',
  ca_none:'Nothing counted yet.', ca_save:'✓ SAVE GOOD FRUIT',
  cb_tag:'Card B · loss', cb_head:'🍂 Fruit lost — not sellable',
  cb_note:'Fruit that cannot be sold — rotten, damaged, or dropped before it was ripe. Leave it on 0 if nothing was lost.',
  cb_cause:'Loss cause', cb_tied:'Was it tied?', w_required:'REQUIRED',
  cb_tiedyes:'🩢 TIED<span class="csub">frees a string</span>',
  cb_tiedno:'🍃 UNTIED<span class="csub">never tied</span>',
  cb_save:'🍂 LOG FRUIT LOST',
  h_scan:'SCAN TREE TAG', h_treeno:'Tree number', h_usetree:'✓ USE THIS TREE',
  h_ortap:'Or tap the tree number', cb_choose:'— choose the loss cause —',
  h_scansub:'camera QR scan · or', h_picklist:'pick tree from list',
  /* v3.42.0 — the way out of a camera that will not read a dirty tag. */
  /* v3.43.0 — WHO'S ON. */
  /* v3.44.0 — PROGRAMME COST. */
  pc_head:'Programme cost — set by set', pc_tapmo:'Tap a month', pc_allmonths:'all months',
  pc_set:'set', pc_sets:'sets', pc_products:'products', pc_product:'Product', pc_volume:'Volume',
  pc_tanks:'tanks', pc_trees:'trees', pc_lots:'Lots', pc_crew:'crew', pc_hrs:'h',
  pc_mh:'man-hours', pc_by:'keyed by', pc_total:'Total', pc_allmat:'material, all sets',
  pc_setsrun:'sets run', pc_print:'PRINT — EVERY SET, EVERY PRODUCT',
  pc_none:'No programme set has drawn material yet. The moment a job is marked done, its products and cost land here.',
  pc_note:'Every figure is re-read from the store each time this screen opens — it is derived, never stored, so it cannot drift from the material that actually left the shed. A set that was never marked done has no rows here at all.',
  /* v3.47.0 — the four jobs and the count sheet. */
  m8_buy:'🛒 BUY', m8_recv:'📥 RECEIVE', m8_issue:'📤 ISSUE', m8_shelf:'📦 SHELF',
  // v3.48.0 — BUY's sub-toggle, and the other half of the count sheet.
  m8_buynow:'🛒 TO BUY NOW', m8_progchk:'📅 PROGRAMME CHECK',
  st_openbtn:'✓ KEY IN THE COUNTED SHEET', st_back:'← BACK TO THE SHELF',
  /* v3.49.0 — the day it actually happened, and the two baskets. */
  bd_saving:'⏪ This will be recorded on', bd_nottoday:'not today.',
  bd_future:'That day has not happened yet. Pick today or a day already past.',
  ob_day:'Day it left the shed', ob_dayin:'Day it arrived',
  ob_addone:'ADD ONE PRODUCT AT A TIME',
  ob_add:'＋ ADD TO THE LIST',
  ob_fill:'📋 FILL THE WHOLE SET FROM THE PLAN',
  ob_fillnote:'When the crew followed the programme this fills every product in one tap. Then change or remove whatever was different.',
  ob_head:'On this issue', ob_save:'SAVE THIS ISSUE', ob_saveone:'SAVE STOCK OUT',
  ob_clear:'CLEAR THIS ISSUE', ob_clearsure:'TAP AGAIN TO THROW AWAY ALL ',
  ob_total:'Issue total', ob_saved:'line(s) issued',
  ob_plantag:'PLAN', ob_shorttag:'SHORT',
  ob_shortwarn:'line(s) are more than the shelf shows',
  ob_dupe:'That product is already on this list — remove it first, or change its line.',
  ob_noplan:'No active programme phase to fill from — add the products by hand.',
  ob_fromplan:'from the plan', ob_allthere:'Everything in the plan is already on the list',
  /* v3.50.0 — the six programme status words. LATE, not DELAYED: the Owner's word. */
  sm_head:'My month', sm_openbtn:'📄 MY MONTH — WHAT I KEYED',
  sm_dels:'Deliveries keyed', sm_isss:'Issues keyed', sm_bought:'Bought', sm_used:'Used',
  sm_recv:'RECEIVED', sm_iss:'ISSUED', sm_prod:'Product', sm_qty:'Quantity', sm_rm:'RM',
  sm_entries:'entries', sm_taphint:'Tap a product to see every entry behind it.',
  sm_nodel:'No deliveries were keyed this month.', sm_noiss:'Nothing was issued this month.',
  sm_neverin:'Nothing has ever been received into this store.',
  sm_print:'PRINT THIS STATEMENT',
  sm_note:'Nothing here can be changed. If a line is wrong, key the correction the normal way — both stay on the record.',
  /* v3.55.0 — step 4. cx_* and NOT pc_*: pc_tag/pc_cancel/pc_date/pc_mix/pc_dose are the
     PROGRAMME CHANGED notice, and PC_MO/PC_OPEN/pcOpenMo/pcBack/pcTog are the PROGRAMME COST
     screen. Reusing that prefix is the v3.50 progCounts collision waiting to happen again. */
  pg_plan:'PLAN',
  cx_btn:'CANCEL', cx_undo:'UNDO', cx_head:'Cancel this set', cx_moved:'(moved)',
  cx_r_rain:'Rain', cx_r_wet:'Ground too wet', cx_r_wind:'Too windy',
  cx_r_mat:'No material', cx_r_crew:'No crew', cx_r_plan:'Plan changed',
  cx_whyq:'WHY DID IT NOT HAPPEN?', cx_freeph:'Add a word or two (optional)',
  cx_moveq:'DOES IT MOVE TO A NEW DAY?', cx_mvyes:'YES — replace it', cx_mvno:'NO — it is dropped',
  cx_newday:'NEW DAY', cx_go:'CANCEL THIS SET', cx_back:'‹ BACK TO THE PROGRAMME',
  cx_movenote:'A copy of this set — same products, same doses — is planned for the new day. The old one stays on the record marked CANCELLED, with your reason.',
  cx_dropnote:'The set stays on the record marked CANCELLED with your reason, and nothing replaces it.',
  cx_note:'Nothing is deleted. The set keeps its place on the record so next season you can see what the weather cost.',
  cx_needwhy:'Pick a reason — that is the whole point of cancelling instead of removing.',
  cx_needday:'Key the new day, or choose NOT REPLACED.',
  cx_pastday:'The new day cannot be in the past.',
  cx_notyours:'Only the Owner may cancel a set.',
  cx_already:'That set is already cancelled.',
  cx_done:'That set is already recorded as done.',
  cx_spent:'{n} stock-out entries worth {rm} are already booked against this set, so it happened.',
  cx_movedto:'moved to', cx_movedfrom:'moved from', cx_dropped:'cancelled, not replaced',
  cx_undone:'Back on the programme.', cx_notsheet:'not on the sheet',
  dd_head:'Stock pressure by set', dd_set:'Set', dd_cover:'Cover',
  dd_short:'line(s) short of stock', dd_ok:'every line covered',
  dd_none:'Nothing still to come is short — every coming set is covered by the shelf.',
  s_plandone:'Plan vs done',
  /* v3.56.0 — REKOD SAYA, the crew's day board. my_* and NOT mn_*: mn is the DOM prefix for
     its markup, and one prefix meaning two things is how this file has hurt itself before. */
  m_mine:'My Record', my_head:'My record',
  my_today:'TODAY', my_yest:'YESTERDAY',
  my_pending:'{n} entries still on this phone', my_send:'SEND NOW',
  my_allsent:'Everything is in the Sheet.', my_nowait:'Nothing waiting.',
  my_onphone:'ON THIS PHONE', my_insheet:'IN THE SHEET',
  my_a_waiting:'WAITING FOR THE GATE', my_a_checked:'CHECKED', my_a_back:'SENT BACK',
  my_a_cancelled:'CANCELLED', my_a_yes:'APPROVED', my_a_no:'REFUSED',
  my_none:'Nothing keyed on this day.', my_none2:'If you worked, it never went in.',
  my_note:'Nothing here can be changed. If a line is wrong, tell the Owner and key the correction — both stay on the record.',
  my_nosync:'This phone cannot send right now.',
  my_fruit:'fruit', my_badfruit:'bad fruit', my_ties:'ties', my_baskets:'baskets',
  my_asked:'Asked for', my_products:'products', my_tiefix:'Tying corrected',
  my_k_drop:'fruit collected', my_k_rot:'bad fruit', my_k_tie:'tying',
  my_k_tieadj:'tying correction', my_k_load:'morning load', my_k_foc:'asked for fruit',
  my_k_mat:'material taken', my_k_job:'job done',
  m_prog:'The Programme',
  ag_bigdose2:'Did you mean', ag_bigdose3:'Tap Cancel to keep',
  md_willdeduct:'Will deduct', md_onhand:'On hand', md_changed:'CHANGED',
  md_backtoplan:'↺ BACK TO THE PLANNED AMOUNTS',
  md_needtanks:'Key how many tanks were used.', md_howmanytanks:'How many tanks were used',
  md_over:'over', md_tree:'tree',
  md_needlpt:'Key the litres of mix each tree takes.', md_noqty:'This programme has no quantity to deduct.',
  md_picklots:'Tick every lot that was done.', md_ofall:'of', md_onerow:'One row per product.',
  md_markdone:'MARK DONE', md_workdone:'WORK DONE',
  pg_notfound:'That set is not on the programme.',
  pg_nolines:'That set has no products on the sheet, so there is nothing to deduct.',
  pg_done:'DONE', pg_coming:'COMING', pg_today:'TODAY',
  pg_hdone:'COMPLETED', pg_hcoming:'NOT YET RECORDED', pg_htoday:'DUE AND OVERDUE',
  pg_doneon:'Done', pg_planned:'Planned', pg_dayslate:'days after the plan',
  pg_dayspast:'days past', pg_items:'items', pg_none:'Nothing here.',
  pg_nomat:'recorded done, but no material was ever drawn for it',
  pg_cancelled:'cancelled',
  pg_impnote:'Dates for the imported months came from the workbook, not recorded on the day.',
  pg_ro:'This screen shows the season. Marking a set done comes in the next release.',
  lb_off:'Labour was not recorded for this work.',
  ps_on:'ON TIME', ps_late:'LATE', ps_due:'DUE NOW', ps_over:'OVERDUE',
  ps_come:'TO COME', ps_can:'CANCELLED',
  ps_imported:'date from the sheet, not recorded on the day',
  ob_alllots:'ALL LOTS', ob_trees:'trees',
  ob_splithead:'Split across every lot by tree count',
  ob_splitrows:'Each product becomes one row per lot.',
  so_pickprod:'Pick a product.', so_keyqty:'Enter the quantity used.',
  so_picklot:'Select the target lot the material was applied to.',
  si_haveinv:'📄 WITH INVOICE', si_noinv:'✋ NO INVOICE',
  si_ref:'Invoice / reference number', si_supp:'Supplier (optional)',
  si_whyno:'Why is there no invoice',
  si_needref:'Invoice number is required — or tap NO INVOICE and say why.',
  cs_head:'Monthly stock check — print for the estate', cs_store:'ESTATE STORE',
  cs_how:'Count every product. Write the number of FULL containers, and what is left in the opened one.',
  cs_prod:'Product', cs_appsays:'App says', cs_full:'Full', cs_open:'Opened',
  cs_by:'Counted by', cs_date:'Date', cs_sign:'Signature',
  cs_print:'PRINT THIS SHEET', cs_back:'‹ BACK TO THE SHELF',
  cs_openbtn:'🧾 PRINT A COUNT SHEET FOR THE ESTATE',
  cs_note:'Send it up with the lorry. What comes back is keyed through STOCK-TAKE, which posts a signed adjustment against the count — the shelf figure is never quietly overwritten.',
  pc_spray:'spray', pc_fert:'fertilizer', pc_sheet:'sheet',
  pc_skipped:'store rows are left out of this report because they are neither a spray nor a fertilizer — tying rope and the like.',
  s_pcost:'PROGRAMME COST',
  wo_head:'Who is on the farm', wo_today:'Today', wo_tpeople:'THE PHONES',
  wo_tfeed:'MINUTE BY MINUTE', wo_working:'WORKING', wo_quiet:'QUIET', wo_none:'NO RECORD',
  wo_trees:'trees', wo_good:'fruit', wo_lost:'lost', wo_tied:'tied', wo_weighed:'weighed',
  wo_approved:'approved', wo_returned:'returned', wo_otherrec:'other', wo_first:'first', wo_last:'last',
  wo_nothing:'nothing recorded', wo_norole:'not in the staff list',
  wo_noev:'Nothing was recorded on this day.',
  wo_nothingday:'This phone saved nothing on this day.',
  wo_quietmsg:'has recorded nothing for over an hour and a half.',
  wo_silentnote:'A person with no record may simply not have worked. The app does not record a login, so a phone that was opened and never used looks exactly like a phone that was never opened.',
  wo_gap:'This screen reads records that were saved. It cannot show a login — nothing in the app or in the Google Sheet records one yet, so a phone that was opened and never used leaves no trace at all.',
  s_who:"WHO'S ON",
  h_camclose:'✕ CLOSE CAMERA', h_campick:'☰ PICK TREE FROM LIST INSTEAD',
  h_othertree:'← CHOOSE A DIFFERENT TREE',
  h_backarm:'fruit counted and NOT saved. Tap again to leave this tree and lose them.',
  h_selecttree:'select a tree', w_clone:'Clone', w_readonly:'READ-ONLY',
  ty_head:'🎗️ Fruit Tying Tracker',
  ty_note:'Lock the tree in first, then tap once for every fruit you tie. Nothing leaves this screen until you press <b>Complete Tree &amp; Save to Queue</b>.',
  ty_tap:'[ 🎗️ TAP TO LOG 1 FRUIT TIED ]', ty_tally:'Current Session Tally:',
  ty_undo:'[ ↩️ Undo Mis-tap ]', ty_save:'[ 💾 Complete Tree &amp; Save to Queue ]',
  ty_selecttree:'— select tree —', ty_none:'Lock a tree in first.',
  ty_rope:'Every fruit tied draws 1.5 m of rope out of the store automatically',
  ty_store:'store shows',
  m3_orderplanner:'Order Planner', m3_thisphase:'THIS PHASE', m3_nextphase:'NEXT PHASE',
  m3_chkhead:'Upcoming programme stock check',
  m3_chknote:'Compares what the Owner\'s active programme will consume against the stock standing in the store right now. Anything short is flagged so it can be ordered before the spray date.',
  m3_readyhead:'Next phase material readiness',
  m3_readynote:'Looks past the phase running today at what the programme calls for next, grouped by <b>active ingredient</b> so one order can cover several brands. Order lead time is what this view exists to protect.',
  m3_noplan:'No programme phase is active. Nothing to order ahead for.',
  /* v3.57.0 — the card no longer shouts, so the heading no longer says URGENT. Both lists
     inside it are closed lines the Purchaser taps open; the only thing genuinely due today
     is the buy queue above, and that keeps the one red banner on the screen. */
  m3_alerthead:'Also worth knowing',
  m3_alertnote:'Nothing on this card is due today. A product is listed below its minimum when its live quantity drops under the minimum stock level. Live quantity = opening stock − used + received (including entries still queued on this phone).',
  m3_lowstrip:'Products below their minimum',
  m3_gapstrip:'Products missing a price or an ingredient',
  m3_inbuy:'already in the buy list above',
  m3_obhead:'Onboard a new commercial item',
  m3_obnote:'Anything added here joins the live catalogue immediately on this phone and reaches every other phone on the next sync. It opens at <b>zero stock</b> — receive the quantity on the Stock In screen against its invoice, exactly like every other product.',
  op_head:"📋 Today's tasks — from the Owner's active programme",
  op_note:'Tasks are set by the Owner and cannot be edited here. <b>CONFIRM COMPLETION</b> deducts exactly what the Owner planned for that lot — use it when the tank was mixed to the recipe above. If the field mixed a different amount, use <b>MIXED A DIFFERENT AMOUNT</b> and key the real tanks. Either way the material leaves farm stock automatically and is costed to that lot.',
  op_sent:'✓ Completion replies sent from this phone',
  op_gen:'🛠️ General field tasks',
  op_gennote:'Pruning, weeding, fruit tying, branch tying and fruit trimming. Each task asks for the counts that matter for that job — the app will not accept a reply without them.',
  op_notask:'No task waiting. The Owner has not activated a set, or every lot has already been reported.',
  op_noreply:'No completion reply sent from this phone yet.',
  op_nogen:'No general task waiting.',
  so_head:'📤 Material Stock Out — issued to the field', so_product:'Product',
  so_search:'Search brand or active ingredient…', so_ai:'Active ingredient',
  so_qty:'Quantity used', so_lot:'Target lot applied', so_set:'For spray set',
  so_save:'✓ SAVE STOCK OUT',
  so_note:'Saving reduces the farm stock straight away on this phone and queues the entry for the next sync.',
  so_phi:'fruit-contact, 14-day PHI', so_confirm:'(confirm — see label)', so_onhand:'on hand', so_nomatch:'— no match —',
  ty_onstring:'On the string now:', ty_untied:'Untied still hanging:', ty_nocensus:'no census',
  role_OWNER:'Owner / Admin', role_MARKETING:'Marketing',
  role_PURCHASER:'Sandakan Purchaser', role_WORKER:'Farm Worker',
  bg_onstring:'ON STRING', bg_tiedtoday:'TIED TODAY', bg_tasks:'TASKS', bg_ropeshort:'ROPE SHORT',

  /* --- v3.12 seasonal matrix / brand allocation / task run --- */
  s_builder:'PROGRAM BUILDER',   s_builder_d:'Build a five-part combo by active ingredient',
  s_alloc:'AI ➔ BRAND',          s_alloc_d:'Match a brand in the store to each ingredient the Owner asked for',
  s_onboard:'NEW PRODUCT',       s_onboard_d:'Add a commercial item to the store catalogue',
  s_runs:'PROGRAM RUNS',         s_runs_d:'Daily, monthly and yearly cost of the work actually done',
  /* --- v3.33.0 reports: three doors --- */
  s_money:'MONEY',               s_money_d:'One month at a time — revenue, what the work cost, what the store is worth',
  s_rec7:'DAILY RECORD',         s_rec7_d:'Seven days side by side — tied, good, loss, kg out',
  s_harv:'HARVEST REPORT',       s_harv_d:'The season\u2019s quality, and the one sheet you print for the meeting',

  /* --- v3.33.0 · the three report doors --- */
  rc_tied:'Tied',
  rc_good:'Good',
  rc_loss:'Loss',
  rc_kgout:'kg out',
  rc_last7:'the last 7 days',
  rc_weekof:'week ending ',
  rc_backnow:'back to this week',
  rc_k1:'counts tied',
  rc_k2:'good drops',
  rc_k3:'rotten',
  rc_k4:'kg dispatched',
  rc_nolog:'nothing logged',
  mn_themonth:'the month',
  mn_revenue:'Revenue',
  mn_material:'Material',
  mn_labour:'Labour',
  mn_draw:'Drawdown',
  mn_net:'Net',
  mn_perkg:'Average RM / kg',
  mn_work:'Cost of the work done',
  mn_job:'Job',
  mn_tanks:'Tanks',
  mn_matshort:'Material',
  mn_hours:'Hours',
  mn_total:'Total',
  mn_store:'Stock money — five lines',
  mn_open:'Opening value',
  mn_bought:'Bought in',
  mn_drawn:'Drawn out',
  mn_var:'Stock-take variance',
  mn_onhand:'On hand at month end',
  mn_detail:'The full screens',
  mn_totrm:'RM',
  mn_nojob:'Issued outside a job',
  mn_uncosted:'not costed yet',
  mn_netnolab:'revenue less material only — labour is not in this figure',
  /* --- v3.33.1 the backfill + the phone-match fingerprint --- */
  sy_histok:'Full season loaded — this phone now holds the same records as the others',
  sy_agree:'Do my phones agree?',
  sy_full:'This phone holds the full season',
  sy_notfull:'Still loading the older records — press SYNC once more',
  sy_frecords:'Records held',
  sy_ffirst:'Oldest fruit record',
  sy_fdrops:'Good drops, all season',
  sy_frot:'Loss, all season',
  sy_finv:'Invoices, all season',
  sy_fkg:'kg sent out, all season',
  sy_frecnote:'This last one is NOT a matching test. Each role is sent a different set of records on purpose — a field phone is never sent merchant loads or scale photos — so these three numbers are meant to differ. Only the five above have to match.',
  sy_agreenote:'Read these five on each phone after everybody has synced. Same five numbers = same season = the reports will agree. If one phone is short, it has records the others have not received yet — press SYNC on THAT phone first, never overwrite it.',
  hv_season:'Season so far',
  hv_day:'day',
  hv_dropped:'dropped',
  hv_good:'Good',
  hv_loss:'loss',
  hv_left:'left on tree',
  hv_s1:'Where the loss comes from',
  hv_s1d:'every rotten fruit, by the cause the crew tapped',
  hv_cause:'Cause',
  hv_fruit:'Fruit',
  hv_share:'Share',
  hv_s2:'By lot, judged per tree',
  hv_s2d:'so a small lot is not punished for being small',
  hv_lot:'Lot',
  hv_trees:'Trees',
  hv_losspct:'Loss %',
  hv_pertree:'/tree',
  hv_farm:'FARM',
  hv_s3:'Banana % — the pollination score',
  hv_s3d:'misshapen fruit is a known sign of incomplete pollination',
  hv_reads:'Reads as',
  hv_clone:'Clone',
  hv_byclone:'The same read, per clone',
  hv_s4:'Loss against the weather',
  hv_s4d:'a day counts as wet if it rained that day or in the two days before',
  hv_cond:'Condition',
  hv_days:'Days',
  hv_drop:'Drop',
  hv_dry:'Dry days',
  hv_wet:'Rain + 2 days after',
  hv_s5:'Where the fruit went',
  hv_s5d:'every kilo the gate weighed in, accounted for',
  hv_went:'Went to',
  hv_worth:'Worth',
  hv_sold:'Sold to merchants',
  hv_focgiven:'Given free — rations & gifts',
  hv_dumped:'Dumped',
  hv_shed:'Still in the shed',
  hv_gatein:'Weighed in at the gate',
  hv_s6:'The trees that lose the most',
  hv_s6d:'the list you actually walk',
  hv_tree:'Tree',
  hv_bad:'Bad',
  hv_s7:'Day by day, with quality',
  hv_s7d:'the whole season, one row per day — this is what the printed sheet is for',
  hv_showdays:'show every day on screen',
  hv_date:'Date',
  hv_dayname:'Day',
  hv_print:'PRINT — THE MEETING SHEET',
  hv_printnote:'This is the only screen in the app that prints. The day-by-day table is always on the printed sheet, whether or not it is open here.',
  ag_tank:'Every dose below is per ONE 1,000 L power spray pump tank.',
  ag_tankman:'Every dose below is per ONE TREE. Manuring is broadcast — no water is mixed.',
  ag_dir:'Operational directive',
  ag_method:'Application method',
  ag_stage:'Season stage',
  ag_wx:'Current weather',
  ag_await:'⏳ Waiting for the Sandakan Purchaser to allocate a brand. Do not start this job yet.',
  ag_ready:'✓ Brands allocated — this job may be run',
  ag_brand:'Brand allocated',
  ag_dose:'Dose per 1,000 L tank',
  ag_dosetree:'Dose per tree',
  ag_runbtn:'🧪 LOG ACTIVE TASK RUN',
  ag_runhead:'Log active task run',
  ag_water:'Total water volume utilised (litres)',
  ag_tanks:'Number of 1,000 L tanks mixed',
  ag_tankhint:'Decimals are allowed — key 3.5 for three full tanks and a half tank.',
  ag_trees:'Trees manured',
  ag_lot:'Target lot applied',
  ag_submit:'💾 SUBMIT & SECURE WORK LOG',
  ag_locked:'Once secured this log cannot be edited. Stock leaves the store and the cost is posted to the lot.',
  ag_nodir:'No directive is active for you. The Owner issues them from the Program Builder.',
  ag_deduct:'This run will deduct',
  ag_nobrand:'no brand allocated yet',
  ag_pubbtn:'📣 ISSUE TO THE FARM',
  ag_pub:'ISSUED',
  ag_draft:'DRAFT',
  ag_closed:'CLOSED',
  pu_allochead:'Match a brand to every ingredient the Owner asked for',
  pu_maclock:'Cost locked at',
  pu_nostock:'nothing in the store carries this ingredient',
  pu_onboardhead:'Onboard a new commercial item',
  pu_brandname:'Brand name',
  pu_ailink:'Active ingredient it carries',
  pu_unit:'Unit type',
  pu_mult:'One container holds',
  pu_onboardbtn:'＋ ONBOARD NEW MATERIAL',
  rn_today:'Today', rn_month:'This month', rn_year:'This year',
  /* season stages, weather and method targets are translated AT RENDER TIME from the
     record's KEY, never read back as the English label that was stored when it was
     issued -- otherwise a worker's phone shows a half-Malay card. */
  sg_VEG:'Vegetative', sg_PREFLW:'Pre-Flowering', sg_FLW:'Flowering',
  sg_FSET:'Fruit Setting', sg_POSTH:'Post-Harvest',
  wx3_DRY:'Dry / Hot', wx3_MOD:'Moderate Rain', wx3_HEAVY:'Heavy Rain',
  mt_WHOLE:'Whole Tree (Inside/Outside)',  mt_WHOLE_d:'Full cover — canopy outside and inside branches',
  mt_LEAFFRUIT:'Leaf and Fruit',           mt_LEAFFRUIT_d:'Outer canopy leaf and the hanging fruit — fruit IS contacted',
  mt_LEAFOUT:'Leaf Only (Outside)',        mt_LEAFOUT_d:'Outer canopy leaf only — NO fruit contact',
  mt_INSIDE:'Inside Only (Fruit/Branches)',mt_INSIDE_d:'Inside the canopy — fruit and branch surfaces',
  mt_DRENCH:'Soil Drenching',              mt_DRENCH_d:'Poured at the root zone, not sprayed on the tree',
  mt_DRIP:'Broadcast Dripping Zone',       mt_DRIP_d:'The ring under the canopy edge where rain drips off',
  mt_OUTCAN:'Broadcast Outside the Canopy',mt_OUTCAN_d:'Beyond the canopy edge — feeding the outward roots',
  mt_INCAN:'Broadcast Whole Inside Canopy',mt_INCAN_d:'The whole area inside the canopy, trunk outward',
  sl_PEST:'Pesticide', sl_FUNG:'Fungicide', sl_FOL:'Foliar',
  sl_BIO:'Biostimulant', sl_TE:'Trace Elements (TE)',
  ag_dirnote:'This job was set by the Owner and cannot be changed here. Tap LOG ACTIVE TASK RUN and key what was really mixed — the material leaves farm stock and is costed to that lot automatically.',
  ag_short:'⚠ NOT ENOUGH IN THE STORE for one full tank',
  ag_costhidden:'cost locked ✓ (RM figures are hidden for your role)',
  ag_crew:'Workers on the job', ag_hours:'Hours each',
  ag_deducthead:'This run will deduct',
  ag_col_brand:'Brand', ag_col_dose:'Dose', ag_col_onhand:'On hand',
  ag_cancel:'CANCEL', ag_dirlbl:'Directive', ag_methodlbl:'Application method',
  ag_manhours:'man-hours', ag_crewhint:'Crew size and hours build the month\u2019s labour total.',
  ag_tanksof:'tanks of', ag_treesdone:'trees', ag_waterkeyed:'L water keyed',
  ag_matcost:'Material cost of this run:',
  ag_keytanks:'Key how many 1,000 L tanks were mixed.',
  ag_keytrees:'Key how many trees were treated.',
  ag_phinote:'⚠ fruit-contact product — check the residue cut-off with the Owner first',
  ag_secured:'🔒 Work log secured', ag_costedto:'item(s) costed to Lot',
  ag_tmplnote:'Filtered by application method — tap one to pre-fill the slots, then change anything before you issue it.',

  /* --- v3.13 · the brand-only worker card and its two-field completion ---------------
     The crew's screen carries NO chemistry: no active ingredient, no product class, no
     PHI product name. Only the physical brand on the drum and how much of it goes in a
     1,000 L tank. The safety line below is deliberately kept, in plain Malay with no
     chemical named — a residue cut-off is a food-safety fact, not a technicality. */
  w13_date:'DATE', w13_task:'TASK', w13_method:'METHOD',
  w13_perTank:'per 1,000 L tank', w13_perTree:'per tree',
  w13_markdone:'📦 MARK WORK COMPLETED',
  w13_savetally:'💾 Save & Tally Store',
  w13_tanks:'How many 1,000 L tanks mixed',
  /* v3.18 · Module 6 — the procurement queue and the reason a card is locked */
  /* v3.19 — multi-line delivery + the order value on the buy queue */
  si_add:'＋ ADD TO THIS DELIVERY', si_added:'added to this delivery',
  si_thisdel:'On this delivery', si_total:'Delivery total',
  si_receive:'RECEIVE ALL', si_clear:'CLEAR THIS DELIVERY',
  si_clearask:'Throw away every line on this delivery?', si_lines:'line(s) received',
  pr_ordertot:'Estimated order value',
  pr_estnote:'at the moving-average cost',
  pr_estguess:'some at list price — never bought before',
  pr_title:'BUY FOR PROGRAMME',
  pr_head:'ingredient(s) blocking an issued programme \u2014 the crew cannot start on these',
  pr_none:'\u2713 Every ingredient an issued programme needs is covered by current stock.',
  pr_nobrand:'NO BRAND YET',
  pr_need:'Need', pr_have:'Have', pr_gap:'Short by', pr_buy:'Order',
  pr_orderby:'Order by', pr_daysleft:'days left', pr_overdue:'ORDER NOW \u2014 PAST THE DATE',
  pr_nodate:'No finish-by date on the directive',
  pr_match:'MATCH A BRAND', pr_onboard:'ONBOARD A BRAND', pr_stockin:'STOCK IN',
  pu_wrongunit:'Sold in a different unit \u2014 refused on pick',
  pu_onboardthis:'Onboard a new brand for this ingredient\u2026',
  pu_onboardgo:'Onboard a brand that carries this ingredient',
  ag_awaitn:'ingredient(s) still have no brand in the store',
  /* v3.18 — free combo: the component list, its picker and the tank advisories */
  sl_HERB:'Herbicide', sl_FERT:'Fertiliser',
  ag_confirmai:'CONFIRM THE LABEL',
  ag_bybrand:'BY BRAND',
  ag_unconfirmed:'ingredient not confirmed on the label',
  ag_blobfull:'of the directive sync limit used \u2014 close some finished directives soon',
  ag_addcomp:'ADD A COMPONENT',
  ag_nocomp:'No components yet. Add the first one below.',
  ag_rolefilter:'Filter by role \u2014 a hint, not a rule',
  ag_alling:'ALL',
  ag_searchai:'Search any ingredient\u2026',
  ag_zerostock:'ZERO STOCK',
  ag_instore:'in store',
  ag_mixnote:'Contact and systemic in one tank',
  ag_mixsub:'Spray only when the leaf can dry. Saved either way \u2014 this is advice, not a rule.',
  ag_dupnote:'appears more than once. Allowed \u2014 each line deducts separately, so check it is deliberate.',
  ag_manynote:'components in one tank. Check they physically mix \u2014 not blocked.',
  w13_confirm:'Confirm total taken from the store (ml/gm)',
  w13_expects:'The system expects',
  w13_mismatch:'What you took out does not match what the recipe needs.',
  w13_nospray:'⚠ DO NOT SPRAY THE FRUIT — ask the Owner first',
  w13_norain:'⚠ HEAVY RAIN — do not spray today',
  w13_wetleaf:'💧 The leaf is still wet — check with the Owner',
  w13_crew:'Crew', w13_hrs:'Hours each', w13_change:'change',
  w13_whichlot:'Which lot did you do?',
  w13_todo:'TO DO', w13_waiting:'WAITING', w13_donelot:'Done',
  w13_stilltodo:'Still to do',
  w13_confirmhead:'Confirm the work',
  w13_recipeTank:'What goes in one 1,000 L tank', w13_recipeTree:'What goes on each tree',
  w13_keytanks:'Key how many tanks were mixed.',
  w13_keytotal:'Key the total you took from the store.',
  w13_keycrew:'Key the crew size and hours — once only, it is remembered after this.',
  w13_saved:'✓ Work saved · store updated',

  /* physical, worker-facing method wording — what to point the lance at, nothing else */
  pm_WHOLE:'Spray Whole Tree / Inside & Outside',
  pm_LEAFOUT:'Spray Outer Leaf Only / No Fruit Contact',
  pm_INSIDE:'Spray Inside Only / Fruit & Branches',
  pm_DRENCH:'Soil Drench / Root Zone',
  pm_DRIP:'Broadcast Canopy Drip Ring',
  pm_OUTCAN:'Broadcast Outside The Canopy',
  pm_INCAN:'Broadcast Whole Inside Canopy',
  s_builder_t:'Templates', ag_comboname:'Combo name', ag_where:'Where it applies',
  ag_slots:'Components', ag_saveissue:'📣 SAVE & ISSUE', ag_clear:'CLEAR',
  ag_thematrix:'The matrix', ag_savecombo:'SAVE', ag_savechanges:'SAVE CHANGES',
  ag_doselbl:'Dose', ag_unitlbl:'Unit',

  /* --- v3.14 · count trees, the app works out the tanks ------------------------------
     One completion covers every lot touched that day. Crew and hours are keyed ONCE and
     split by tree count, so two lots in a day can no longer be recorded as double the
     man-hours. A lot that is not finished stays on the list with its progress. */
  t14_head:'How many trees did you do today',
  t14_treestoday:'Trees done today',
  t14_all:'ALL', t14_none:'NONE',
  t14_of:'of', t14_trees:'trees', t14_left:'left',
  t14_donebefore:'done on another day',
  t14_finished:'FINISHED', t14_carry:'CONTINUE', t14_nottouched:'NOT STARTED',
  t14_empty:'Leave empty if this lot was not touched today.',
  t14_rate:'Rate set by the Owner',
  t14_lpt:'LITRES per tree', t14_pertree:'Per tree — no water',
  t14_covers:'One 1,000 L tank covers about {n} trees.',
  t14_nowater:'Fertiliser is broadcast dry. The dose is per tree, not per tank.',
  t14_today:'Today',
  t14_mhonce:'man-hours — entered ONCE and split by trees',
  t14_keytrees:'Key how many trees were done.',
  t14_toomany:'That is more trees than the lot has left.',
  // v3.25.0 (audit D-09) — the store-is-short warning on the crew's completion screen
  t25_shortstock:'THE STORE DOES NOT HOLD ENOUGH FOR THIS JOB',
  t25_shortask:'Tell Sandakan before you mix. Log it anyway?',
  t25_basisclash:'THAT SET IS MEASURED PER TREE, NOT PER TANK',
  t25_basisclash2:'Switch the job type to MANURE / SOIL first, or the crew will be told to put a whole tree dose into one tank.',
  t14_stillleft:'Still on the list tomorrow',
  t14_allfinished:'Every tree is done. This job leaves the list.',
  t14_saved:'✓ Saved · store updated',
  t14_lotall:'ALL LOTS',
  t14_perlot:'Per lot',
  t14_genall:'Enter what was done in each lot. Leave a lot empty if it was not touched.',

  /* --- v3.15 · the date a programme must be finished by, and the record it builds -----
     One date per programme, suggested from the programme sheet. It is the only thing that
     makes "on time" and "late" mean anything, and it is what the monthly and yearly
     record is counted on. */
  dt_due:'Must finish by', dt_suggest:'Suggested from the programme sheet — change it if you like',
  dt_left:'{n} DAYS LEFT', dt_tomorrow:'TOMORROW', dt_today:'MUST FINISH TODAY',
  dt_late:'{n} DAYS LATE', dt_by:'finish by', dt_nodate:'no date set',
  dt_needdue:'Set the date this must be finished by.',
  s_record:'PROGRAM RECORD', s_record_d:'Issued, finished, on time or late — by month and year',
  rp_issued:'Programmes issued', rp_ontime:'Finished on time', rp_latedone:'Finished late',
  rp_open:'Not finished', rp_overdue:'{n} already late',
  rp_thismonth:'Programmes this month', rp_year:'Year record — by month',
  rp_mo:'Month', rp_out:'Issued', rp_ok:'On time', rp_lt:'Late', rp_total:'TOTAL',
  rp_scored:'Only programmes that are FINISHED count towards the percentage. An open one is not scored until it is done.',
  rp_done:'finished', rp_notdone:'not finished',
  rp_ontimechip:'ON TIME', rp_earlychip:'EARLY {n}d', rp_latechip:'LATE {n}d',
  rp_none:'No programme carries a date in this month yet.',
  rp_pct:'of the finished programmes were on time', rp_yearpct:'On time this year',
  bg_late:'LATE',
  rp_noscore:'No programme has been finished yet, so there is no percentage to show.',

  /* ---- v3.16 · four isolated workspaces ------------------------------------------- */
  m_cmd:'Command', s_exec:'Executive Summary', s_builder:'Program Builder',
  s_master:'Master Control',
  m_mkt:'Gate & Merchants', s_review:'Live Dispatch Review',
  s_supplyhub:'THE STORE',
  bg_variance:'TREE ALERT', bg_credit:'CREDIT LOW',
  /* the one unified tree-visit commit */
  cv_tag:'One visit · one save', cv_head:'✅ Finish this tree',
  cv_note:'Count the good fruit above, then any fruit that was lost. Both are saved together by this one button — you never save twice at the same tree. Leave either card on zero if it does not apply.',
  cv_save:'✅ LOG COMPLETE TREE VISIT',
  cv_none:'Nothing counted yet.', cv_good:'good', cv_lost:'lost',
  cv_notree:'Pick a tree first.',
  cv_nothing:'Count some good fruit, or some lost fruit, before saving.',
  cv_nocause:'Tag the damage cause — a loss count without a cause cannot be acted on.',
  cv_notied:'Say whether the lost fruit was tied or untied.',
  /* the Owner's executive summary */
  w_derived:'DERIVED',
  ex_varhead:'tree(s) dropping unsecured fruit today', ex_unsec:'unsecured',
  ex_varwhy:'or more unsecured drops on one tree in one day means the string work is not holding. Check the tying on these trees before the wave.',
  ex_varok:'No tree is over the unsecured-drop limit today',
  ex_varoka:'Fewer than', ex_varokb:'unsecured drops on every tree logged so far.',
  ex_rain:'Rain', ex_days:'days',
  ex_wet_a:'Above the', ex_wet:'mm moisture line — wet canopy, wash-off and root-rot pressure. Hold contact sprays.',
  ex_dry_a:'Under the', ex_dry:'mm moisture line. Spray windows are open.',
  ex_fcast:'Drop forecast', ex_norate:'No drop rate yet',
  ex_norateb:'Nothing has been collected in the last 7 days, so there is no run rate to project from. The forecast appears as soon as the crew log a day of drops.',
  ex_next7:'Next 7 days', ex_fruit:'fruit', ex_rate:'Running at', ex_perday:'fruit a day',
  ex_stillon:'still on the trees', ex_tied:'tied', ex_untied:'untied',
  ex_topeak:'Projected peak in', ex_pastpeak:'Past the projected peak date',
  ex_inwave:'wave window open',
  ex_nocensus:'Leaves out', ex_nocensusb:'trees that were never censused',
  ex_derived:'every ≈ figure is computed from the run rate and the census, not keyed by anyone',
  ex_credit:'Prepaid credit for the coming wave',
  ex_credunknown:'No dispatch history priced yet, so no ceiling can be recommended without guessing a price per kg.',
  ex_balance:'Balance now', ex_target:'recommended ceiling',
  ex_share:'Takes', ex_ofvolume:'of dispatched value', ex_next7low:'over the next 7 days',
  ex_topup:'top up by', ex_credok:'covers the wave',
  ex_credshort:'The pool runs out mid-wave at the current rate.',
  ex_month:'This month', ex_nomonth:'No dispatches or stock movements recorded yet.',
  ex_norev:'No retailer revenue yet', ex_revtot:'Revenue total',
  ex_spend:'Material + labour', ex_margin:'Margin', ex_draw:'Material drawdown',
  ex_kg:'Dispatched', ex_inv:'invoices',
  so_safety:'Safety note', so_searchw:'Search the drum name…',
  ex_credarrears:'Already overdrawn', ex_credarrears2:'of fruit has gone out against a pool that is empty. The top-up above clears that first, then funds the wave.',
  ca_sec:'secured', ca_unsec:'unsecured', ca_fruit:'fruit',

  /* ---- v3.17 · TILE F TAB 1 — what needs the Owner today -------------------------- */
  s_today:'Today', s_compare:'Compare',
  cd_needs:'Needs you today', cd_clear:'Nothing needs you',
  cd_clearsub:'No programme is late, every ingredient has a brand behind it, no load is waiting on your eye, and nothing is below its minimum.',
  cd_w_trees:'TREES', cd_w_late:'LATE', cd_w_hold:'HOLD', cd_w_wait:'WAIT',
  cd_w_short:'SHORT', cd_w_low:'LOW', cd_w_new:'NEW', cd_w_stale:'QUIET', cd_w_credit:'CREDIT',
  cd_a_trees:'Trees are dropping unsecured fruit today',
  cd_s_trees:'the string work is not holding on these trees',
  cd_a_late:'A programme is past the date you set',
  cd_s_late:'work still outstanding after the finish date',
  cd_a_hold:'Loads are waiting for your photo check',
  cd_s_hold:'credit does not move until you look',
  cd_a_wait:'An ingredient has no brand chosen yet',
  cd_s_wait:'the crew cannot start until a brand is matched',
  cd_a_short:'The store is short for an issued programme',
  cd_s_short:'not enough in the store to finish the work',
  cd_a_low:'Products are below their minimum',
  cd_s_low:'reorder before the wave, not during it',
  cd_a_corr:'A correction request is waiting',
  cd_s_corr:'a tree record cannot change until you decide',
  cd_a_stale:'A phone has not sent data for two days or more',
  cd_s_stale:'their work is not in any figure on this screen yet',
  cd_a_credit:'A merchant will run out of prepaid credit mid-wave',
  cd_s_credit:'top up before the fruit goes out, not after',
  cd_today:'Today', cd_fruit:'Fruit collected', cd_kgout:'Weighed out',
  cd_rmin:'Invoiced today', cd_rmout:'Material used today',
  cd_vsyest:'vs yesterday', cd_noyest:'nothing yesterday to compare',
  cd_crop:'The crop right now', cd_onstring:'On the string', cd_untied:'Not yet tied',
  cd_shed:'In the shed', cd_peak:'To peak drop', cd_past:'past peak',
  cd_days:'days', cd_fruitu:'fruit', cd_est:'est.',
  cd_month:'This month', cd_sold:'Fruit sold', cd_material:'Material used',
  cd_labour:'Labour', cd_left:'Left over',
  cd_soldsub:'from the invoices', cd_matsub:'from the store, at moving average cost',
  cd_labsub:'man-hours priced at the labour rate',
  cd_progout:'Programmes out', cd_ontime:'On time', cd_late:'Late',
  cd_phones:'Phones · last sent data', cd_never:'nothing yet',
  cd_minago:'min ago', cd_hourago:'h ago', cd_dayago:'d ago',
  cd_nomonth:'Nothing has been dispatched or issued this month yet.',
  cd_nocrop:'No tree has been censused yet, so there is nothing to count against.',

  /* ---- v3.17 · TILE F TAB 3 — compare -------------------------------------------- */
  cb_7:'7 DAYS', cb_7s:'last 7 days', cb_m:'THIS MONTH', cb_s:'SEASON', cb_ss:'this year',
  cb_fruit:'FRUIT', cb_kg:'KG', cb_in:'IN', cb_mat:'MATERIAL',
  cb_l_fruit:'Fruit collected', cb_l_kg:'Kg weighed out', cb_l_in:'RM invoiced',
  cb_l_mat:'RM material used',
  cb_vs7:'vs the 7 days before',
  cb_vsm:'vs the same days of last month', cb_vss:'vs the same span last year',
  cb_nocmp:'no comparison yet', cb_first:'first period on record',
  cb_ofdays:'{d} of {n} days recorded so far',
  cb_tap:'Tap a bar to see that day', cb_tapm:'Tap a bar to see that month', cb_shownum:'SHOW NUMBERS', cb_showchart:'SHOW CHART',
  cb_when:'When', cb_total:'Total',
  cb_money:'Money · this period against the one before',
  cb_before:'Before', cb_change:'Change',
  cb_grade:'Grade and rotten fruit', cb_ga:'Grade A', cb_gb:'Grade B', cb_gc:'Grade C',
  cb_rot:'Rotten',
  cb_rotnow:'Rotten this period', cb_rotprev:'Rotten the period before',
  cb_rotchg:'Change', cb_points:'points', cb_norec:'no record',
  cb_bylot:'By lot · fruit collected', cb_lot:'Lot', cb_share:'Share',
  cb_prog:'Programmes', cb_issued:'Issued', cb_pon:'Finished on time',
  cb_plate:'Finished late', cb_popen:'Still open', cb_ppct:'On time',
  cb_noscore:'nothing finished yet',
  cb_nodata:'Nothing has been recorded in this period yet. Every figure here builds itself from the harvest, dispatch, stock and programme records — there is nothing to key in.',
  cb_derived:'Every figure is added up from records already in the system. Nothing here is keyed in twice.',
  cb_thisper:'This period', bg_todo:'TO DO',
  m_admin:'Admin', s_adjust:'Adjustments', s_staff:'Staff', s_stocklvl:'Stock Level',
  /* v3.41.0 - MASTER DB became FIX A RECORD, and TREES + QR became sections of their own.
     Section labels are UPPERCASE in EN because that is what every other s_ key on a tab bar
     is; the _d line is the one-line description under the section on the menu screen. */
  s_fixrec:'FIX A RECORD',
  s_fixrec_d:'Correct a number, key work that was never logged, or clear out trial rows',
  s_trees:'TREES',
  s_trees_d:'The census - add a new planting spot, live in every dropdown at once',
  s_qrtag:'APP QR TAG',
  s_qrtag_d:'The code a new worker scans to install the app',
  cd_rateoff:'rate not confirmed',
  cd_ratewarn:'is a placeholder. Labour and left-over figures are indicative until you set the real rate in Reports \u25b8 LABOUR.',

  /* ===== v3.23.0 · ROUND 2 · MODULE 4 · SHARED COMPONENTS — merged from the lane reports at integration.
     Both lanes also carry an inline English fallback at every tr() call site, so a key
     missing here degrades to English rather than printing a key name at a farm worker. */
  m4_col_prod:"Product",
  m4_col_prodai:"Product / active ingredient",
  m4_col_onhand:"On hand",
  m4_col_min:"Min",
  m4_col_value:"Value",
  m4_low:"LOW",
  m4_nomatch:"No product matches that search.",
  m4_showall:"SHOW ALL",
  m4_showfirst:"SHOW ONLY THE FIRST",
  m4_product:"PRODUCT",
  m4_products:"PRODUCTS",
  m4_product_l:"product",
  m4_products_l:"products",
  m4_belowmin:"BELOW MINIMUM STOCK",
  m4_unitsword:"units",
  m4_notrecorded:"(not recorded)",

  /* ===== v3.23.0 · ROUND 2 · MODULE 8 · PIECES 3 + 5 — merged from the lane reports at integration.
     Both lanes also carry an inline English fallback at every tr() call site, so a key
     missing here degrades to English rather than printing a key name at a farm worker. */
  m8_recvtitle:"RECEIVE AGAINST THE BUY LIST",
  m8_recvnone:"Nothing on the buy list yet. When the Owner issues a programme, the lines to receive appear here already filled in.",
  m8_recvwhy:"These are the lines the buy queue asked for. Tick what actually arrived, correct the quantity if the supplier came up short, key the price you were charged, then add them all to the delivery below.",
  m8_recvinv:"The invoice number belongs to the delivery, not to the line — key it once in STOCK IN LOG below. RECEIVE ALL will refuse without it.",
  m8_recvgoinv:"KEY INVOICE NO.",
  m8_recvadd:"ADD TICKED TO THIS DELIVERY",
  m8_recvqty:"Containers received",
  m8_recvprice:"Price per container (RM)",
  m8_recvsugg:"suggestion",
  m8_recvasked:"Buy list asked for",
  m8_recvsel:"Ticked",
  m8_recvtot:"Value of ticked lines",
  m8_recvnothing:"Tick at least one line that arrived.",
  m8_recvbad:"Key a quantity and a price for:",
  m8_recvdone:"line(s) added to this delivery",
  m8_showplan:"SHOW ANTICIPATED",
  m8_hideplan:"HIDE ANTICIPATED",
  m8_planhead:"ANTICIPATED — NOT YET ISSUED",
  m8_planwhy:"Programme sets the Owner has planned inside the ordering window. They may still be moved, re-dosed or dropped — nothing here is committed work, and none of it is in the estimated order value above.",
  m8_planwin:"Ordering window",
  m8_plandays:"days",
  m8_plantot:"Anticipated order value",
  m8_plantag:"ANTICIPATED",
  m8_confirmtag:"CONFIRMED",
  m8_planfor:"For",
  m8_planby:"Order by"
};

/* Long month names, both languages, for the worker card's date row. Kept as data so the
   date reads the way each person's phone is set, not the way the server wrote it. */
const MONTH_LONG_EN=['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const MONTH_LONG_MS=['Januari','Februari','Mac','April','Mei','Jun',
  'Julai','Ogos','September','Oktober','November','Disember'];

/* Bahasa Malaysia — the terms the Owner approved. Anything missing here simply
   shows the English above, which is why a partial table is safe to ship. */
const MS={"ow_censuscount":"Dikira pada","ow_projnote3":"Garis kuning ialah banci Julai anda \u2014 dikira sebelum buah dijarangkan, jadi ia sedikit tinggi. Garis putus kelabu bukan rancangan: ia kadar hari ini dibawa ke hadapan, berhenti pada buah yang masih atas pokok.","ow_censusbigger":"jadi hasil sebenar lebih besar daripada garis itu.","ow_censusline":"Banci Julai","ow_censuspart":"Banci meliputi","ow_censusof":"daripada","ow_censustrees":"pokok","ow_projnote2":"Garis kuning ialah banci Julai anda \u2014 apa yang dikira tergantung. Garis putus kelabu bukan rancangan: ia kadar hari ini dibawa ke hadapan, berhenti pada buah yang masih atas pokok.","ow_leftest":"Tanda \u2248 bermaksud sebahagiannya anggaran daripada banci Julai, bukan dikira tali demi tali.","ow_today":"HARI INI","ow_7days":"7 HARI","ow_season":"MUSIM","ow_last7":"7 hari lepas","ow_lot":"Lot","ow_farm":"LADANG","ow_trees":"Pokok","ow_dropped":"Gugur","ow_good":"Elok","ow_banana":"Pisang","ow_bad":"Rosak","ow_losspct":"% rosak","ow_pertree":"Buah / pokok","ow_left":"Tinggal atas pokok","ow_leftper":"Tinggal / pokok","ow_tot":"JUM","ow_bydate":"Ikut tarikh","ow_redsmall":"Nombor merah kecil itu ialah buah rosak pada hari itu.","ow_leftnote":"Tinggal atas pokok ialah yang diikat tolak yang sudah gugur. Ia hanya setepat kiraan ikatan.","ow_harvest":"MUSIM KUTIP","ow_day":"hari","ow_stillon":"masih atas pokok","ow_moredays":"hari lagi","ow_nohang":"belum ada buah diikat","ow_todayis":"Hari ini","ow_sidebyside":"lot bersebelahan","ow_chosen":"minggu dipilih","ow_last7lbl":"7 hari lepas","ow_backtolast7":"Kembali ke 7 hari lepas","ow_seasonchart":"Dikutip musim ini","ow_planned":"Rancang program seterusnya","ow_farm2":"LADANG","ow_money":"WANG","ow_admin":"ADMIN","ow_alltools":"SEMUA ALAT","ow_close":"Tutup","ow_corrwait":"pembetulan menunggu anda","ow_focwait":"permohonan ransum menunggu","ow_unsynced":"rekod masih dalam telefon ini \u2014 tekan SYNC","ow_daysleft":"Hari berbaki pada kadar ini","ow_days":"hari","ow_peak":"Puncak","ow_daysaway":"hari lagi","ow_passed":"sudah berlalu","ow_nextset":"Set seterusnya","ow_nothing":"Belum ada apa-apa untuk dirancang","ow_collected":"Dikutip","ow_proj":"Unjuran pada kadar hari ini","ow_ifrate":"jika kadar kekal","ow_now":"kini","ow_chartalt":"Buah dikutip musim ini, dengan unjuran pada kadar semasa","ow_projnote":"Ladang tiada rancangan musim tersimpan, jadi garis putus-putus itu bukan rancangan \u2014 ia kadar hari ini dibawa ke hadapan, dan ia berhenti pada buah yang masih atas pokok.","foc_myrecord":"Rekod saya","foc_gotthismonth":"anda sudah terima bulan ini","foc_ofallow":"daripada","foc_allowword":"had","foc_when":"Tarikh","foc_what":"Apa","foc_answer":"Keputusan","foc_norecord":"Belum ada keputusan. Apa sahaja yang anda mohon akan keluar di sini dengan jawapannya.","foc_askfruit":"Mohon buah","ask_s1":"UNTUK APA","ask_s2":"SIAPA","ask_s3":"BUAH MANA","ask_s4":"BERAPA","ask_me":"UNTUK SAYA","ask_medesc":"Masuk rekod anda sendiri dan had bulanan anda","ask_other":"ORANG LAIN","ask_otherdesc":"Kunci nama mereka pada baris seterusnya","ask_next":"SETERUSNYA","ask_back":"KEMBALI","ask_needwho":"Kunci nama orang yang menerimanya.","ask_howmany":"Berapa biji?","ask_about":"lebih kurang","ask_estnote":"Anggaran pada purata klon ini. Gate akan timbang sebenar semasa menyerahkannya.","ask_pickshed":"Tekan buah yang ada dalam stor. Dari situ buah anda diambil, jadi klon dan gred sudah dijawab.","ask_instock":"dalam stor","ask_shedempty":"Stor kosong sekarang \u2014 tiada buah untuk dimohon. Cuba semula selepas kutipan pagi.","ask_needn":"Berapa biji? Mesti lebih daripada sifar.","ask_notetag":"dimohon ikut bilangan \u2014 berat dianggar","ask_sent":"dihantar ke Gate","foc_r_RATION_d":"buah untuk pekerja sendiri","foc_r_GIFT_d":"untuk keluarga, atau hadiah","foc_r_SAMPLE_d":"diberi kepada peniaga untuk dapat pesanan","sy_never":"Telefon ini belum disambung ke Google Sheet, jadi senarai ini hanya ada apa yang dikunci di sini.","sy_notyet":"Belum sync \u2014 tekan di sini untuk hantar apa yang ada dan ambil apa yang telefon lain hantar.","sy_lastat":"Sync terakhir","sy_justnow":"baru sahaja","sy_minago":"minit lalu","sy_pressync":"TEKAN UNTUK SYNC","pr_v_book":"BUKU HARGA","pr_v_tare":"BERAT BAKUL","pr_v_cmp":"BANDING","pr_whichbook":"Buku harga yang mana?","pr_tapclone":"Tekan klon untuk set harganya","pr_grade":"gred","pr_trend":"Aliran pasaran harian","vf_armhead":"SEMAK DULU, KEMUDIAN TEKAN SEKALI LAGI","vf_armgo":"TEKAN SEKALI LAGI UNTUK TULIS INVOIS","vf_armno":"BELUM \u2014 KEMBALI","vf_armbal":"Kredit selepas ini","vf_armcash":"JUALAN TUNAI \u2014 kutip sekarang","vf_armover":"TERLEBIH \u2014 pengecualian Tuan ditandatangani oleh","vf_armby":"Ditimbang oleh","vf_armseen":"gambar disemak oleh","vf_armnote":"Tiada apa-apa ditulis sehingga tekanan kedua.","cr_armok":"Luluskan perubahan ini","cr_armack":"Akui nota ini","cr_armno":"Tolak permohonan ini","cr_armgo":"TEKAN SEKALI LAGI UNTUK SIMPAN","cr_armlog":"Ini merekod pelarasan bertandatangan pada log itu. Baris asal dikekalkan.","cr_armtree":"Ini mengemas kini Tree Master di seluruh apl secara kekal.","cr_armback":"Pekerja akan nampak jawapannya pada telefonnya sendiri.","sy_checking":"Menyemak dengan telefon lain\u2026","vb_title":"Versi baharu sudah sedia","vb_sub":"Telefon ini masih guna","vb_safe":"apa yang anda kunci masuk tidak hilang","vb_go":"MUAT TURUN","foc_r_RATION":"Ransum pekerja","foc_r_GIFT":"Keluarga & hadiah","foc_r_SAMPLE":"Sampel pembeli","foc_r_DUMP":"Dibuang","foc_willask":"\u2014 ini yang anda mohon","s_foc":"Ransum & Hadiah","sy_l_foc":"Ransum & hadiah","foc_waiting":"Menunggu keputusan","foc_none":"Tiada yang menunggu. Semua permohonan sudah dijawab.","foc_to":"untuk","foc_fruit":"biji","foc_askedby":"dimohon oleh","foc_worth":"Bernilai","foc_atrate":"pada","foc_thismonth":"bulan ini","foc_overcap":"ini melebihi had bulanan","foc_approve":"LULUS","foc_refuse":"TOLAK","foc_waitgate":"Menunggu keputusan Pintu Gate","foc_give":"Rekod buah yang keluar percuma","foc_reason":"Sebab","foc_receiver":"Untuk siapa","foc_name":"nama","foc_clone":"Klon","foc_grade":"Gred","foc_fruitn":"Biji","foc_kg":"Berat kg","foc_note":"Nota","foc_record":"REKOD","foc_ask":"MOHON DARI GATE","foc_book":"Buku rekod \u2014 bulan ini","foc_value":"Nilai","foc_allow":"Had bulanan","foc_nolimit":"tiada had","foc_balance":"Ke mana buah pergi \u2014 bulan ini","foc_camein":"Masuk pintu","foc_sold":"Jual kepada peniaga","foc_given":"Diberi percuma (FOC)","foc_dumped":"Dibuang","foc_shed":"Masih dalam stor","foc_bal":"Imbangan","foc_valueword":"nilai","foc_lost":"hilang","foc_missing":"LEBIH keluar daripada yang masuk","foc_nothingmissing":"tiada yang hilang","foc_negshed":"Lebih banyak buah keluar daripada yang direkod masuk di penimbang. Sama ada satu timbangan tidak dikunci masuk, atau satu muatan keluar dua kali.","foc_needkg":"Kunci berat dahulu","foc_needwho":"Untuk siapa?","foc_bad":"Tidak dapat direkod","foc_notyours":"Hanya Gate boleh membuat keputusan ini","foc_already":"Sudah diputuskan","foc_gone":"Permohonan itu sudah tiada","foc_approved":"Diluluskan","foc_refused":"Ditolak","pe_edit":"✎ UBAH SET INI","pe_remove":"🗑 BUANG","pe_planned":"Tarikh rancang","pe_dose":"Dos setiap tangki 1,000 L","pe_save":"✓ SIMPAN PERUBAHAN","pe_cancel":"Batal","pe_saved":"Disimpan — sampai ke telefon lain selepas sync","pe_removed":"Dibuang dari rancangan","pe_restored":"Kembali ke rancangan","pe_restore":"↺ MASUK SEMULA","pe_removedlbl":"dibuang dari rancangan","pe_confirm":"Buang \u201c{s}\u201d dari rancangan?","pe_noline":"Simpan sekurang-kurangnya satu produk","pe_active":"Tutup kerja aktif pada set ini dahulu","pe_locked":"Set ini tidak boleh dibuang.\n\n{n} rekod keluar stok bernilai {rm} sudah direkod untuknya. Jika dibuang, perbelanjaan itu tiada program.\n\nAnda masih boleh ubah campuran — itu hanya untuk kerja akan datang.","pe_editwarn":"{n} rekod keluar stok bernilai {rm} sudah direkod untuk set ini. Perubahan di sini hanya untuk kerja akan datang — bahan yang sudah dipakai tidak berubah.","pc_tag":"PROGRAM BERUBAH","pc_hint":"Tekan untuk buka kerja","pc_cancel":"SET INI DIBATALKAN","pc_date":"TARIKH BERUBAH","pc_mix":"CAMPURAN BERUBAH","pc_dose":"DOS BERUBAH","pr_replan":"tarikh rancang dipindah ke hari siap","pr_sheetsaid":"helaian program tanda","pr_fromsheet":"Daripada helaian program ladang","pr_started":"mula","pr_finished":"siap","pr_dayslate":"hari lewat","pr_ontime":"ikut masa","pr_rows":"rekod keluar stok","pr_nomaterial":"tiada bahan direkod untuk set ini","pr_unconf":"Turut disenaraikan, produk belum disahkan","lg_closing":"baki stok",
  hubnote:'Hanya bahagian yang dibenarkan untuk anda sahaja dipaparkan.<br>Tekan satu petak untuk buka · tekan ← atau 🏠 untuk kembali.',
  menuhead:'Pilih satu bahagian. Semuanya baris penuh — tiada apa-apa tersembunyi di tepi skrin.',
  nav_home:'Utama', nav_sync:'Hantar Data',
  m_harvest:'Kutip Buah',   m_tying:'Ikat Buah',     m_scale:'Timbang Pagi',
  m_ops:'Kerja Harian',     m_inv:'Stor',
  s_collect:'KUTIP',        s_collect_d:'Kira buah elok ikut gred, dan buah rosak dengan sebabnya',
  s_tally:'KIRA IKAT',      s_tally_d:'Tekan untuk kira buah yang diikat, pokok demi pokok',
  s_scale:'TIMBANG PAGI',   s_scale_d:'Timbang bakul dan ambil gambar skrin penimbang',
  s_tasks:'KERJA HARI INI', s_tasks_d:'Kerja yang diberi kepada anda, satu tekan untuk sahkan siap',
  s_stockout:'AMBIL BAHAN', s_stockout_d:'Ambil bahan dari stor, untuk lot tertentu',
  s_stockin:'TERIMA BAHAN', s_stockin_d:'Terima barang dengan invois pembekal',
  s_progcheck:'SEMAK PROGRAM', s_progcheck_d:'Cukupkah bahan untuk program semburan sekarang?',
  s_nextphase:'FASA SETERUSNYA', s_nextphase_d:'Apa perlu dipesan untuk fasa selepas ini',
  login_title:'Log Masuk', login_ask:'Masukkan kunci masuk 6 angka anda',
  login_wrong:'Kunci salah. Cuba lagi.',
  login_off:'Kunci ini telah dimatikan. Hubungi tuan ladang.',
  login_welcome:'Selamat datang,',
  /* v3.17.1 — skrin log masuk boleh ambil senarai pekerja sendiri */
  login_refresh:'AMBIL SENARAI PEKERJA TERKINI',
  login_refreshing:'Menyemak…',
  login_got:'✓ Senarai pekerja dikemas kini — {n} kunci boleh guna di telefon ini.',
  login_nourl:'Telefon ini tiada Sync URL. Log masuk dengan kunci yang sedia ada, kemudian isi URL di Tetapan.',
  login_offline:'Tiada internet. Sambung Wi-Fi atau hotspot, kemudian tekan lagi.',
  login_syncfail:'Tidak dapat hubungi Google Sheet. Cuba lagi di hotspot.',
  login_dirty:'Telefon ini ada perubahan pekerja yang belum dihantar. Log masuk sebagai Tuan Ladang dan hantar senarai dahulu.',
  w_tree:'Pokok', w_lot:'Lot', w_good:'Buah Elok', w_loss:'Buah Rosak', w_rotten:'Buah Busuk',
  w_drop:'Buah Gugur', w_secured:'Gugur Bertali', w_unsecured:'Gugur Tanpa Tali',
  w_count:'Bilangan', w_grade:'Gred', w_cause:'Sebab', w_fruits:'biji',
  c_ANIMAL:'Rosak Haiwan',   c_ANIMAL_n:'tupai, monyet, tikus, musang',
  c_PEST:'Serangan Perosak', c_PEST_n:'ulat penggerek buah, kumbang, lalat buah',
  c_DISEASE:'Reput Penyakit',c_DISEASE_n:'Phytophthora, antraknos, reput hujung tangkai',
  c_UNRIPE:'Buah Muda',      c_UNRIPE_n:'belum cukup tua — biasanya kurang air atau baja',
  w_tie:'Ikat', w_rope:'Tali', w_ontree:'Masih Di Pokok', w_balance:'Baki',
  sc_head:'Timbang pagi',
  sc_intro:'Timbang bakul, masukkan bacaan BERAT KASAR tepat seperti pada penimbang, kemudian <b>ambil gambar skrin penimbang</b>. Marketing akan semak gambar anda dengan angka anda sebelum muatan diinvoiskan. Anda merekod berat sahaja — tiada harga dipaparkan di skrin ini.',
  sc_nomerchant:'Belum ada pembeli aktif dalam telefon ini. Hantar data sekali di hotspot pejabat supaya senarai pembeli sampai.',
  sc_towhich:'Hantar kepada pembeli mana', sc_choose:'— pilih pembeli —',
  sc_tarewarn:'⚠ Berat bakul kosong masih angka sementara — beritahu tuan ladang supaya timbang bakul kosong. Bacaan BERAT KASAR anda tetap direkod tepat seperti anda masukkan.',
  sc_basket:'BAKUL', sc_clone:'Klon', sc_grade:'Gred', sc_baskettype:'Jenis bakul',
  sc_howmany:'Berapa bakul', sc_gross:'BERAT KASAR pada penimbang (kg)', sc_fruitcount:'Bilangan buah',
  sc_addbasket:'＋ TAMBAH BAKUL LAGI',
  sc_photohead:'📷 Bukti gambar — wajib',
  sc_nophoto:'Belum ada gambar. Muatan tidak boleh dihantar tanpa gambar.',
  sc_photook:'Gambar disertakan', sc_retake:'ambil semula',
  sc_takephoto:'[ 📷 Ambil Gambar Timbangan ]',
  sc_photohint:'Pegang telefon tegak dengan penimbang supaya nombor jelas dibaca. Gambar dikecilkan sendiri supaya boleh dihantar walaupun talian perlahan.',
  sc_note:'Catatan (pilihan)', sc_noteph:'cth. lori BKS 4412, pemandu Amin',
  sc_submit:'📤 HANTAR UNTUK KELULUSAN',
  sc_waiting:'📤 Menunggu Kelulusan',
  sc_nothingwaiting:'Tiada yang menunggu. Semua yang anda hantar sudah diluluskan atau dikembalikan.',
  sc_decided:'Baru diputuskan',
  sc_pending:'MENUNGGU', sc_approved:'DILULUSKAN', sc_returned:'DIKEMBALIKAN',
  sc_queued:'dalam simpanan telefon ini',
  sc_total:'JUMLAH BERSIH', sc_keyfirst:'Masukkan bacaan berat kasar untuk sekurang-kurangnya satu bakul.',
  sc_gross_calc:'Berat kasar', sc_tare_calc:'berat bakul', sc_net_calc:'BERSIH', sc_avg:'purata',
  /* --- v3.8 · borang timbang sentuh terus --- */
  sc_addnext:'➕ TAMBAH BAKUL SETERUSNYA',
  /* --- v3.37.4 · pembetulan dan pembatalan --- */
  rl_c_lorry:'Lori bertolak tanpa muatan',
  rl_c_buyer:'Pembeli tidak jadi ambil',
  rl_c_reweigh:'Salah timbang — mula semula',
  rl_c_else:'Buah dihantar ke tempat lain',
  rl_cancelq2:'Kenapa muatan ini tidak jadi?',
  rl_cancelgo:'BATALKAN MUATAN INI',
  rl_cancelkeep:'Buah kekal dikira dalam stor — tiada yang dibuang, hanya penghantaran ini dibatalkan.',
  rl_needwhy:'Pilih sebab dahulu',
  rl_clonelock:'dikunci semasa pembetulan',
  /* --- v3.37.3 · setiap langkah boleh diundur, butang terkunci mesti beritahu sebabnya --- */
  nr_needs:'Bakul ini masih perlukan',
  nr_need_w:'bacaan berat kasar dari penimbang',
  nr_need_c:'berapa biji ada di dalamnya',
  nr_need_p:'gambar paparan penimbang',
  nr_odd:'Itu satu bakul seberat',
  nr_odd2:'Semak tanda perpuluhan — jika betul, anda tetap boleh hantar.',
  /* v3.67.0 — baris berat lawan gred di langkah timbang */
  nr_avg:'Purata',
  nr_afruit:'sebiji',
  nr_thatweight:'berat itu',
  nr_youchose:'Anda pilih',
  nr_gradematch:'sepadan dengan berat.',
  /* --- v3.37.0 · JALAN BARU · penimbang jadi empat langkah --- */
  nr_onlorry:'ATAS LORI',
  nr_noweight:'belum ditimbang',
  nr_ready:'SIAP',
  nr_unfinished:'BELUM SIAP',
  nr_shedledger:'Stor sudah ada rekodnya sendiri.',
  nr_shedledger2:'Apa yang direkod semasa kutipan sudah ada di sini — tidak perlu taip semula. Tekan buah yang hendak ditimbang.',
  nr_fruitin:'biji dalam bakul ini',
  nr_weigh:'TIMBANG',
  nr_byhand:'Masukkan bakul secara manual',
  nr_where:'KE MANA IA PERGI?',
  nr_backshed:'kembali ke stor',
  nr_backdest:'tukar destinasi',
  nr_inbasket:'DALAM BAKUL INI',
  nr_change:'tukar',
  nr_scalereads:'BACAAN PENIMBANG — KASAR',
  nr_basketdone:'BAKUL SIAP',
  nr_onscale:'ada atas penimbang.',
  nr_onequestion:'Satu soalan, empat jawapan — setiap jalan keluar buah dari ladang ada butangnya di sini, dan semuanya ditimbang dan digambar.',
  nr_d_merch:'KEPADA PENIAGA',  nr_d_merchs:'Gate meluluskan · invois · kredit',
  nr_d_cash:'TUNAI DI PINTU',   nr_d_cashs:'pembeli datang · bayar terus',
  nr_d_free:'PERCUMA — RANSUM / HADIAH', nr_d_frees:'ditimbang, bukan ditaip',
  nr_d_dump:'DIBUANG',          nr_d_dumps:'rosak atau busuk · kerugian bernilai',
  nr_r2:'PUSINGAN 2', nr_r2head:'Pusingan 2',
  nr_r2body:'tunai, ransum dan buah dibuang akan melalui penimbang yang sama dalam keluaran seterusnya. Sementara itu semuanya kekal di skrin asal — tiada apa yang dibuang.',
  nr_whichmerchant:'PENIAGA MANA?',
  nr_load:'MUATAN',
  nr_send:'HANTAR KE GATE',
  nr_seam1:'Jahitan 1 ditutup',
  nr_seam1b:'klon dan gred datang DARI stor — tidak ditaip dua kali. Tag lapisan membawa lot, jadi wang nanti tahu pokok mana yang menghasilkannya.',
  nr_seam2:'Jahitan 2 ditutup',
  nr_seam2b:'kiraan biji dan kilogram yang ditimbang direkod bersama, dalam satu gerakan, di satu tempat.',
  nr_seam3:'Jahitan 3 ditutup',
  nr_seam3b:'satu skrin penimbang sahaja. Peniaga ialah destinasi, bukan bilik yang lain.',
  e_needbasket:'Timbang sekurang-kurangnya satu bakul dahulu',
  /* --- v3.40.0 · nama yang bertindih, dan dua segmen baharu --- */
  s_spray:'REKOD SEMBURAN', s_spray_d:'Apa yang sebenarnya digunakan, dan bagaimana ia berbanding rancangan',
  s_credit:'KREDIT PENIAGA', s_credit_d:'Berapa hutang setiap peniaga, apa yang dibayar, dan bakinya',
  m5_bylot:'📊 IKUT LOT', m5_runs:'🧪 KERJA', m5_labour:'👷 BURUH', m5_bymonth:'📒 IKUT BULAN',
  m5_applied:'📝 APA YANG DIGUNAKAN', m5_plan:'🏁 RANCANG vs SIAP',
  /* --- v3.39.0 · STOR BUAH menggantikan baki --- */
  rc_weighhere:'TIMBANG MUATAN UNTUK PENIAGA INI',
  rc_weighnote:'Penimbangan dibuat di Penimbang Pagi — stor, bakul, gambar dan kutipan asalnya, kemudian satu tekan untuk invois. Ia menulis invois yang sama seperti kad ini dahulu, dan lot di sebalik setiap kilogram ikut bersama.',
  rc_openscale:'BUKA PENIMBANG PAGI',
  foc_weighit:'Buah yang keluar percuma ditimbang seperti yang lain — buka Penimbang Pagi, timbang bakul, dan pilih 🎁 PERCUMA atau 🗑 DIBUANG. Ia mengambil dari stor, mencap kutipan asalnya, dan sampai di sini sudah diluluskan.',
  shd_head:'STOR BUAH',
  foc_shedfruit:'dikira, bukan anggaran',
  shd_standing:'biji ada dalam stor sekarang',
  shd_standing2:'ada sekarang',
  shd_onenumber:'Ini kiraan yang sama digunakan oleh Penimbang Pagi — ia tidak boleh berbeza daripada apa yang pekerja dibenarkan timbang.',
  shd_intoday:'dikutip hari ini',
  shd_outtoday:'keluar hari ini',
  shd_atgate:'menunggu di pintu',
  shd_whatsleft:'APA YANG ADA, DAN DARI KUTIPAN MANA',
  shd_wentwhere:'KE MANA BUAH PERGI — MUSIM INI',
  shd_alarm:'Lebih banyak buah keluar daripada yang pernah direkod masuk',
  shd_alarmnote:'Sama ada kutipan tidak pernah dimasukkan, atau buah keluar tanpa rekod. Rekod kutipan harian tempat pertama untuk disemak.',
  shd_kgweighed:'Kilogram hanya ditunjukkan di mana buah benar-benar melalui penimbang. Stor dikira dalam biji, kerana kiraan diukur di dua hujung manakala berat di hulu hanyalah anggaran.',
  /* --- v3.38.0 · PUSINGAN 2 — tiga pintu keluar yang lain --- */
  nr_seam4:'Jahitan 4 ditutup',
  nr_seam4b:'setiap jalan keluar buah dari ladang kini salah satu daripada empat butang ini. Semuanya ditimbang, semuanya mengambil dari stor yang sama, dan semuanya bernilai wang — bakul yang dibuang pun pada harga yang sepatutnya diperoleh.',
  nr_go_inv:'SAHKAN & INVOIS',
  nr_go_cash:'AMBIL TUNAI & INVOIS',
  nr_go_free:'BERI — DAN REKODKAN',
  nr_go_dump:'REKOD KERUGIAN INI',
  nr_go_ask:'MINTA KELULUSAN GATE',
  nr_yes:'YA — BUAT SEKARANG',
  nr_armhead:'TEKAN SEKALI LAGI UNTUK SAHKAN',
  nr_armfoot:'Belum ada apa-apa direkod. Boleh kembali dan tukar apa sahaja.',
  nr_cashhead:'TUNAI DI PINTU',
  nr_cashnote:'Ini jualan biasa — ditimbang dan diinvois sama seperti yang lain. Bezanya ia dibayar sekarang, jadi tiada kredit tertinggal.',
  nr_buyer:'SIAPA YANG MEMBELI?',
  nr_buyerph:'nama untuk resit',
  nr_cashrow:'Direkod di bawah',
  nr_cashspot:'harga pasaran ladang',
  nr_cashdue:'TUNAI PERLU DIKUTIP',
  nr_pricedatgate:'Gate yang menetapkan harga — telefon anda merekod berat sahaja.',
  nr_norate:'Tiada harga pasaran ditetapkan untuk',
  nr_paid:'DIBAYAR TUNAI',
  nr_freehead:'KENAPA BUAH INI PERCUMA?',
  nr_receiver:'SIAPA YANG MENERIMA?',
  nr_receiverph:'nama yang masuk dalam rekod',
  nr_thismonth:'bulan ini',
  nr_overcap:'melebihi had — Gate yang memutuskan',
  nr_dumphead:'APA YANG BERLAKU PADANYA?',
  nr_dumpnote:'Bakul yang dibuang tetap ditimbang dan dinilai pada harga yang sepatutnya diperoleh. Ia kerugian yang boleh dilihat ladang, bukan buah yang hilang begitu sahaja.',
  nr_dumped:'Dibuang',
  nr_why:'KENAPA TIDAK BOLEH DIJUAL?',
  nr_whyph:'cth. pecah, jatuh 2 hari lepas, ulat',
  nr_lossworth:'KERUGIAN INI BERNILAI',
  nr_recorded:'direkodkan',
  nr_waitgate:'menunggu Gate',
  nr_atgate:'ditimbang di pintu',
  sc_optional:'pilihan',
  e_needreceiver:'Nyatakan siapa yang menerima buah ini',
  e_needreason:'Pilih sebab',
  e_needwhy:'Nyatakan apa yang berlaku pada buah ini',
  e_creditover:'Kredit melebihi had — tuan ladang perlu masukkan kod 6 digit sebelum muatan ini boleh keluar',
  foc_photoon:'digambar pada telefon yang menimbang',
  foc_nophoto:'tiada gambar',
  foc_approveall:'LULUSKAN SEMUA',
  /* --- v3.37.0 · STOR, dan pemilih yang mengambil daripadanya --- */
  shd_title:'STOR BUAH',
  shd_fruit:'biji',
  shd_tap:'Tekan buah yang ada dalam bakul ini',
  shd_lot:'Lot',
  shd_more:'lagi',
  shd_leftinshed:'tinggal dalam stor',
  shd_fromgrade:'dari Gred',
  shd_alsodraws:'juga ambil dari',
  shd_over:'biji lebih daripada rekod stor. Hantar juga jika buah itu memang ada — rekod kutipan harian yang perlu dibetulkan.',
  shd_none:'Belum ada buah direkod dalam stor. Masukkan bakul secara manual di bawah — stor diisi daripada kutipan harian.',
  sc_takephoto2:'📷 AMBIL GAMBAR BERAT PENIMBANG',
  sc_photodone:'GAMBAR SIAP DIAMBIL',
  sc_phototap:'tekan untuk ambil semula',
  sc_tarefoot:'Berat bakul kosong belum disahkan oleh tuan ladang. Bacaan BERAT KASAR anda tetap direkod tepat seperti anda masukkan.',
  /* --- v3.8 · Pas Keluar Timbangan --- */
  gp_head:'📋 Pas Keluar Timbangan',
  gp_locked:'SUDAH DIHANTAR · DIKUNCI',
  gp_showdriver:'Tunjuk skrin ini kepada pemandu lori sebelum dia bertolak.',
  gp_merchant:'Pembeli', gp_time:'Dihantar', gp_ref:'Ruj',
  gp_baskets:'Bakul dimuatkan', gp_fruits:'Jumlah bilangan buah',
  gp_net:'Jumlah berat BERSIH', gp_gross:'Berat kasar penimbang', gp_tare:'Berat bakul ditolak',
  gp_tally:'Kiraan berat BERSIH — ikut klon &amp; gred',
  gp_grade:'Gred', gp_nolines:'Tiada bakul bertimbang pada muatan ini.',
  gp_noprice:'Berat dan bilangan sahaja. Pas ini tiada harga.',
  gp_newload:'➕ MULA MUATAN BARU',
  gp_close:'✕ TUTUP PAS',
  gp_taphint:'Tekan mana-mana muatan di bawah untuk buka pas semula.',
  gp_note:'Catatan',
  /* --- v3.8.1 · beritahu pekerja keadaan sebenar muatan mereka --- */
  gp_notsent:'⚠ BELUM SAMPAI KE PEJABAT. Muatan ini masih dalam telefon ini. Bawa ke hotspot pejabat dan tekan Sync.',
  sc_notsent:'BELUM DIHANTAR',
  sc_decided_1:'muatan anda sudah diputuskan oleh Marketing',
  sc_decided_n:'muatan anda sudah diputuskan oleh Marketing',
  sy_stuck_1:'rekod masih dalam telefon ini — pejabat BELUM menerimanya',
  sy_stuck_n:'rekod masih dalam telefon ini — pejabat BELUM menerimanya',
  /* --- v3.9 · nombor lori, gambar setiap bakul, bilangan buah wajib --- */
  sc_plate:'Nombor lori', sc_plateph:'SS 0000 A',
  sc_platerecent:'Lori minggu ini — tekan, tidak perlu taip',
  sc_required:'WAJIB', sc_basketphoto:'📷 GAMBAR BAKUL',
  sc_basketphotosub:'WAJIB — satu gambar bagi setiap bakul',
  sc_basketdone:'SUDAH DIGAMBAR', sc_locked:'🔒 HANTAR DIKUNCI',
  e_needplate:'Masukkan nombor lori yang membawa muatan ini.',
  e_needcount:'Bilangan buah wajib bagi bakul',
  e_needbphoto:'Gambar wajib bagi bakul',
  e_needbweight:'Tiada bacaan penimbang bagi bakul',
  /* --- v3.9 · muatan dikembalikan --- */
  rl_head:'muatan dikembalikan — perlu tindakan', rl_headn:'muatan dikembalikan — perlu tindakan',
  rl_fix:'🔧 BETULKAN &amp; HANTAR SEMULA', rl_cancel:'🚫 BATAL — TIDAK JADI',
  rl_fixing:'Cubaan %A bagi ruj %R', rl_attempt:'CUBAAN',
  rl_resend:'📤 HANTAR SEBAGAI CUBAAN', rl_newphoto:'Hantar semula perlu gambar BARU bagi setiap bakul.',
  rl_locked:'Pembeli dan klon dikunci semasa pembetulan. Batal dan mula semula jika pembeli salah.',
  rl_cancelq:'Batalkan muatan ini? Buah kekal dikira dalam stor.',
  rl_cancelwhy:'Kenapa tidak jadi?', rl_cancelph:'ada apa-apa nak tambah? (pilihan)',
  rl_cancelback:'← Jangan batal',
  rl_cancelled:'DIBATALKAN', rl_cancelok:'🚫 Muatan dibatalkan — buah kekal di ladang',
  rl_tofix:'PERLU BETUL', rl_replaced:'diganti oleh cubaan',
  gp_superseded:'DIGANTI · JANGAN GUNA',
  gp_supersededby:'🚫 Pas ini dikembalikan dan diganti. Guna ruj %R.',
  gp_cancelled:'DIBATALKAN · JANGAN GUNA',
  gp_chain:'Cubaan %A · ruj sebelum ini %R dikembalikan',
  gp_photos:'Bukti gambar — satu bagi setiap bakul', gp_basket:'BAKUL',
  /* --- v3.9 · apa yang berubah (Marketing) --- */
  vf_attempt:'CUBAAN', vf_prevreturn:'↩ Anda kembalikan cubaan %A —',
  vf_changed:'Apa yang pekerja ubah', vf_nochange:'⚠ TIADA APA BERUBAH sejak cubaan yang dikembalikan',
  vf_gross:'Berat kasar', vf_net:'Bersih selepas tolak bakul', vf_photo:'Gambar',
  vf_replaced:'diganti', vf_same:'tidak berubah', vf_before:'CUBAAN %A', vf_after:'CUBAAN INI',
  /* --- v3.9 · baki buah dan jejak --- */
  bl_head:'📦 Baki buah &amp; jejak', bl_tile:'Baki buah',
  bl_in:'MASUK', bl_out:'KELUAR', bl_backlog:'BAKI',
  bl_collected:'Dikutip', bl_dispatched:'Dihantar', bl_inshed:'Masih dalam stor',
  bl_clonegrade:'KLON · GRED', bl_total:'JUMLAH', bl_ok:'OK', bl_short:'KURANG',
  bl_none:'Belum ada yang dikutip — baki bermula bila buah pertama direkod.',
  bl_tap:'Tekan satu baris untuk jejak.',
  bl_opening:'Baki pembukaan', bl_avg:'Purata berat sebiji yang dihantar',
  bl_check:'SEMAK', bl_drift:'Gred %G bagi %C ialah %B sebiji. Purata yang ini %V kg.',
  bl_shortnote:'keluar dari pintu tetapi tidak pernah direkod dikutip.',
  bl_norot:'Buah busuk dan mentah tidak dikira di sini — ia tidak pernah menjadi stok jualan.',
  bl_fruits:'biji',
  s_backlog:'BAKI BUAH', s_backlog_d:'Buah dikutip, buah dihantar, apa yang masih dalam stor',
  s_shed:'STOR BUAH', s_shed_d:'Apa yang ada dalam stor, dari kutipan mana, dan ke mana yang lain pergi',
  /* --- v3.9.2 · masa setiap bakul ditimbang --- */
  ts_keyed:'direkod', ts_head:'Masa timbang — setiap bakul',
  ts_sent:'Dihantar ke Marketing', ts_window:'ditimbang',
  /* --- v3.10 · sync yang beritahu apa yang tersekat --- */
  sy_timeout:'hotspot tidak menjawab dalam masa',
  sy_oldbackend:'Google Sheet belum faham ini',
  sy_stuck1:'perkara BELUM sampai ke pejabat', sy_stuckn:'perkara BELUM sampai ke pejabat',
  sy_records:'rekod', sy_retry:'CUBA LAGI', sy_retrying:'Mencuba lagi…',
  sy_retryok:'sudah dihantar', sy_retryfail:'masih tersekat — cuba lagi di hotspot',
  sy_stucknote:'Tiada yang hilang. Semua ini masih disimpan dalam telefon dan akan naik apabila talian stabil.',
  sy_l_scale:'Muatan timbang + gambar', sy_l_rotten:'Rekod buah rosak',
  sy_l_logadj:'Pembetulan rekod', sy_l_dispatch:'Penghantaran', sy_l_audit:'Jejak audit',
  sy_photoopen:'TEKAN UNTUK BUKA GAMBAR TIMBANGAN',
  sy_photowhy:'diambil sekarang, supaya sync kekal laju',
  sy_photoget:'Mengambil gambar…',
  sy_photonone:'Gambar itu belum ada di Sheet — pekerja belum hantar.',
  sy_photooffline:'Tiada talian. Buka gambar ini apabila anda kembali ke hotspot.',
  /* --- v3.11 tetapan bersama --- */
  sy_l_settings:'Tetapan bersama (harga · berat bakul · pokok)',
  st_setby:'Ditetapkan oleh', st_today:'hari ini', st_updated:'dikemas kini di semua telefon',
  st_refused:'Pejabat menyimpan versi lebih baru bagi',
  st_pricesaved:'Harga disimpan — akan sampai ke semua telefon pada sync berikutnya',
  st_taresaved:'Berat bakul disimpan — akan sampai ke semua telefon pada sync berikutnya',
  st_stillunver:'masih belum ditimbang dengan penimbang bertauliah',
  st_cloneprice:'harga klon', st_pricemeta:'nota harga',
  st_baskets:'berat bakul', st_tareok:'tara disahkan',
  st_addtrees:'pokok tambahan',
  st_notshared:'BELUM DIKONGSI',
  st_notsharednote:'Tetapan ini disimpan di telefon ini sahaja. Tekan Hantar Data supaya pejabat dan telefon lain guna nombor yang sama.',
  st_neverset:'belum diubah — masih nilai asal',
  st_thisphone:'telefon ini, belum dihantar',
  vf_photounknown:'belum dimuatkan — tekan gambar untuk banding',
  e_pickmerchant:'Pilih pembeli untuk muatan ini.',
  e_suspended:'Pembeli ini digantung.',
  e_needweight:'Masukkan bacaan berat kasar untuk sekurang-kurangnya satu bakul.',
  e_needphoto:'Gambar skrin penimbang wajib sebelum ini boleh dihantar.',
  e_notphoto:'Fail itu bukan gambar.',
  e_photobig:'Gambar itu terlalu besar untuk dihantar. Ambil semula lebih dekat dengan skrin penimbang.',
  e_photoread:'Telefon tidak dapat membaca gambar itu.',
  t_shrinking:'Mengecilkan gambar…', t_photoon:'📷 Gambar disertakan',
  t_sent:'dihantar kepada Marketing untuk kelulusan', t_queuedsuffix:'(dalam simpanan)',
  b_save:'Simpan', b_cancel:'Batal', b_remove:'buang', b_confirm:'Sahkan',
  w_note:'Catatan', w_key:'Kunci Masuk', w_queued:'Belum Dihantar',
  sy_head:'Hantar kerja hari ini ke pejabat',
  sy_online:'DALAM TALIAN', sy_offline:'LUAR TALIAN',
  bk_blkh:'Bakul hitam — ada pemegang besi', bk_blkp:'Bakul hitam — tiada pemegang besi', bk_none:'Tanpa bakul',
  ts_harvest:'gred A/B/C, buah rosak', ts_tying:'kira ikat, tali, baki',
  ts_scale:'timbang, ambil gambar, hantar', ts_ops:'kerja, ambil bahan',
  ts_inv:'terima/ambil bahan, paras stok',
  /* v3.24 — label kecil ikut peranan. Marketing hanya boleh buka bahagian ini sahaja. */
  ts_mkt_harvest:'baki dalam bangsal, buah atas tali, hari ini',
  ts_mkt_reports:'wang, rekod tujuh hari, hasil',
  ts_mkt_admin:'kunci akses pekerja',
  /* v3.18.5 — matriks 3 butang dan bar tugasan hari ini */
  ca_btn:'🧺 BUAH ELOK', ca_btnsub:'Ketuk untuk kira',
  ca_counting:'Dikira ke gred', ca_intograde:'Dikira ke gred', ca_string:'Status tali',
  ca_secbtn:'🨢 BERTALI<span class="csub">ada tali padanya</span>',
  ca_unsecbtn:'🍃 TANPA TALI<span class="csub">tidak pernah diikat</span>',
  ca_undo:'⌫ BATAL KETUKAN AKHIR',
  cb_btn:'🍂 BUAH ROSAK', cb_btnsub:'Ketuk hanya jika ada buah rosak',
  cb_btnmore:'Ketuk lagi untuk tambah',
  tn_today:'PROGRAM HARI INI', tn_late:'SUDAH LEWAT',
  tn_pertank:'Setiap tangki: 1,000 L air', tn_pertree:'Setiap pokok',
  tn_waiting:'Menunggu stor — belum ada jenama dipadankan',
  tn_hint:'Ketuk untuk buka tugasan',
  ca_tag:'Kad A · buah elok', ca_head:IC_DUR+' Buah elok dikutip — kira ikut gred',
  ca_note:'Kira Gred A, B dan C berasingan. Bagi setiap gred, nyatakan sama ada buah itu <b>Bertali (Diikat)</b> — ada tali padanya — atau <b>Tanpa Tali</b>, bermakna ia tidak pernah diikat. Biarkan gred pada 0 jika tiada dikutip.',
  ca_none:'Belum ada yang dikira.', ca_save:'✓ SIMPAN BUAH ELOK',
  cb_tag:'Kad B · buah rosak', cb_head:'🍂 Buah rosak — tidak boleh dijual',
  cb_note:'Buah yang tidak boleh dijual — busuk, rosak, atau gugur sebelum masak. Biarkan pada 0 jika tiada yang rosak.',
  cb_cause:'Sebab rosak', cb_tied:'Adakah ia diikat?', w_required:'WAJIB',
  cb_tiedyes:'🩢 BERTALI<span class="csub">tali terlepas</span>',
  cb_tiedno:'🍃 TANPA TALI<span class="csub">tidak pernah diikat</span>',
  cb_save:'🍂 REKOD BUAH ROSAK',
  h_scan:'IMBAS TAG POKOK', h_treeno:'Nombor pokok', h_usetree:'✓ GUNA POKOK INI',
  h_ortap:'Atau tekan nombor pokok', cb_choose:'— pilih sebab rosak —',
  h_scansub:'imbas QR dengan kamera · atau', h_picklist:'pilih pokok dari senarai',
  pc_head:'Kos program — set demi set', pc_tapmo:'Tekan satu bulan', pc_allmonths:'semua bulan',
  pc_set:'set', pc_sets:'set', pc_products:'produk', pc_product:'Produk', pc_volume:'Isipadu',
  pc_tanks:'tangki', pc_trees:'pokok', pc_lots:'Lot', pc_crew:'pekerja', pc_hrs:'j',
  pc_mh:'jam-orang', pc_by:'direkod oleh', pc_total:'Jumlah', pc_allmat:'bahan, semua set',
  pc_setsrun:'set dijalankan', pc_print:'CETAK — SETIAP SET, SETIAP PRODUK',
  pc_none:'Belum ada set program yang mengeluarkan bahan. Sebaik sahaja kerja ditanda siap, produk dan kosnya akan muncul di sini.',
  pc_note:'Setiap angka dibaca semula dari stor setiap kali skrin ini dibuka — ia diterbitkan, tidak pernah disimpan, jadi ia tidak boleh berbeza daripada bahan yang benar-benar keluar dari stor.',
  m8_buy:'🛒 BELI', m8_recv:'📥 TERIMA', m8_issue:'📤 KELUAR', m8_shelf:'📦 RAK',
  m8_buynow:'🛒 BELI SEKARANG', m8_progchk:'📅 SEMAK PROGRAM',
  st_openbtn:'✓ MASUKKAN HELAIAN KIRAAN', st_back:'← KEMBALI KE RAK',
  /* v3.49.0 */
  bd_saving:'⏪ Ini akan direkod pada', bd_nottoday:'bukan hari ini.',
  bd_future:'Hari itu belum sampai. Pilih hari ini atau hari yang sudah lepas.',
  ob_day:'Hari barang keluar stor', ob_dayin:'Hari barang sampai',
  ob_addone:'TAMBAH SATU PRODUK PADA SATU MASA',
  ob_add:'＋ TAMBAH KE SENARAI',
  ob_fill:'📋 ISI SATU SET PENUH DARI PELAN',
  ob_fillnote:'Kalau kru ikut program, ini isi semua produk dengan satu tekan. Lepas itu ubah atau buang mana yang lain.',
  ob_head:'Dalam pengeluaran ini', ob_save:'SIMPAN PENGELUARAN INI', ob_saveone:'SIMPAN STOK KELUAR',
  ob_clear:'KOSONGKAN SENARAI', ob_clearsure:'TEKAN SEKALI LAGI UNTUK BUANG SEMUA ',
  ob_total:'Jumlah pengeluaran', ob_saved:'baris dikeluarkan',
  ob_plantag:'PELAN', ob_shorttag:'TAK CUKUP',
  ob_shortwarn:'baris lebih daripada apa yang ada di rak',
  ob_dupe:'Produk itu sudah ada dalam senarai — buang dulu, atau ubah barisnya.',
  ob_noplan:'Tiada fasa program aktif untuk diisi — tambah produk secara manual.',
  ob_fromplan:'dari pelan', ob_allthere:'Semua dalam pelan sudah ada dalam senarai',
  sm_head:'Bulan saya', sm_openbtn:'📄 BULAN SAYA — APA YANG SAYA MASUKKAN',
  sm_dels:'Penghantaran dimasukkan', sm_isss:'Pengeluaran dimasukkan', sm_bought:'Dibeli', sm_used:'Digunakan',
  sm_recv:'DITERIMA', sm_iss:'DIKELUARKAN', sm_prod:'Produk', sm_qty:'Kuantiti', sm_rm:'RM',
  sm_entries:'catatan', sm_taphint:'Tekan produk untuk lihat setiap catatan di belakangnya.',
  sm_nodel:'Tiada penghantaran dimasukkan bulan ini.', sm_noiss:'Tiada pengeluaran bulan ini.',
  sm_neverin:'Tiada apa pernah diterima masuk ke stor ini.',
  sm_print:'CETAK PENYATA INI',
  sm_note:'Tiada apa di sini boleh diubah. Kalau ada baris salah, masukkan pembetulan seperti biasa — kedua-duanya kekal dalam rekod.',
  /* v3.55.0 — step 4, Bahasa. */
  pg_plan:'RANCANG',
  cx_btn:'BATAL', cx_undo:'BATAL SEMULA', cx_head:'Batalkan set ini', cx_moved:'(dipindah)',
  cx_r_rain:'Hujan', cx_r_wet:'Tanah terlalu basah', cx_r_wind:'Terlalu berangin',
  cx_r_mat:'Tiada bahan', cx_r_crew:'Tiada pekerja', cx_r_plan:'Rancangan berubah',
  cx_whyq:'KENAPA IA TIDAK JADI?', cx_freeph:'Tambah satu dua patah perkataan (pilihan)',
  cx_moveq:'ADAKAH IA PINDAH KE HARI LAIN?', cx_mvyes:'YA — ganti ia', cx_mvno:'TIDAK — ia digugurkan',
  cx_newday:'HARI BAHARU', cx_go:'BATALKAN SET INI', cx_back:'‹ KEMBALI KE PROGRAM',
  cx_movenote:'Satu salinan set ini — produk sama, dos sama — dirancang untuk hari baharu. Yang lama kekal dalam rekod bertanda DIBATALKAN, dengan sebab anda.',
  cx_dropnote:'Set ini kekal dalam rekod bertanda DIBATALKAN dengan sebab anda, dan tiada apa menggantikannya.',
  cx_note:'Tiada apa dipadam. Set ini kekal tempatnya dalam rekod supaya musim depan anda nampak apa yang cuaca telah kos.',
  cx_needwhy:'Pilih sebab — itulah tujuan membatalkan dan bukan membuang.',
  cx_needday:'Masukkan hari baharu, atau pilih TIDAK DIGANTI.',
  cx_pastday:'Hari baharu tidak boleh sudah berlalu.',
  cx_notyours:'Hanya Tuan boleh membatalkan set.',
  cx_already:'Set itu sudah dibatalkan.',
  cx_done:'Set itu sudah direkod siap.',
  cx_spent:'{n} rekod keluar stok bernilai {rm} sudah direkod untuk set ini, jadi ia sudah berlaku.',
  cx_movedto:'dipindah ke', cx_movedfrom:'dipindah dari', cx_dropped:'dibatalkan, tidak diganti',
  cx_undone:'Kembali ke program.', cx_notsheet:'tiada dalam helaian',
  dd_head:'Tekanan stok mengikut set', dd_set:'Set', dd_cover:'Liputan',
  dd_short:'baris kurang stok', dd_ok:'semua baris mencukupi',
  dd_none:'Tiada set akan datang yang kurang stok — semua dilindungi rak.',
  s_plandone:'Rancang vs siap',
  /* v3.56.0 — REKOD SAYA, Bahasa. */
  m_mine:'Rekod Saya', my_head:'Rekod saya',
  my_today:'HARI INI', my_yest:'SEMALAM',
  my_pending:'{n} rekod masih dalam telefon ini', my_send:'HANTAR SEKARANG',
  my_allsent:'Semua sudah masuk Sheet.', my_nowait:'Tiada yang menunggu.',
  my_onphone:'DALAM TELEFON INI', my_insheet:'SUDAH MASUK SHEET',
  my_a_waiting:'MENUNGGU GATE', my_a_checked:'DISEMAK', my_a_back:'DIHANTAR BALIK',
  my_a_cancelled:'DIBATALKAN', my_a_yes:'DILULUSKAN', my_a_no:'DITOLAK',
  my_none:'Tiada apa dimasukkan pada hari ini.', my_none2:'Kalau anda bekerja, ia tidak masuk.',
  my_note:'Tiada apa di sini boleh diubah. Kalau ada baris salah, beritahu Tuan dan masukkan pembetulan — kedua-duanya kekal dalam rekod.',
  my_nosync:'Telefon ini tidak boleh hantar sekarang.',
  my_fruit:'biji', my_badfruit:'buah rosak', my_ties:'ikatan', my_baskets:'bakul',
  my_asked:'Mohon', my_products:'produk', my_tiefix:'Ikatan dibetulkan',
  my_k_drop:'buah kutip', my_k_rot:'buah rosak', my_k_tie:'ikat buah',
  my_k_tieadj:'pembetulan ikatan', my_k_load:'timbang pagi', my_k_foc:'minta buah',
  my_k_mat:'ambil bahan', my_k_job:'kerja siap',
  m_prog:'Program',
  ag_bigdose2:'Adakah anda maksudkan', ag_bigdose3:'Tekan Batal untuk kekalkan',
  md_willdeduct:'Akan tolak', md_onhand:'Ada', md_changed:'DIUBAH',
  md_backtoplan:'↺ KEMBALI KE JUMLAH ASAL',
  md_needtanks:'Masukkan berapa tangki telah digunakan.', md_howmanytanks:'Berapa tangki digunakan',
  md_over:'untuk', md_tree:'pokok',
  md_needlpt:'Masukkan liter campuran bagi setiap pokok.', md_noqty:'Program ini tiada kuantiti untuk ditolak.',
  md_picklots:'Tandakan setiap lot yang telah dibuat.', md_ofall:'daripada', md_onerow:'Satu baris bagi setiap produk.',
  md_markdone:'TANDA SIAP', md_workdone:'KERJA SIAP',
  pg_notfound:'Set itu tiada dalam program.',
  pg_nolines:'Set itu tiada produk dalam helaian, jadi tiada apa untuk ditolak.',
  pg_done:'SUDAH', pg_coming:'AKAN DATANG', pg_today:'HARI INI',
  pg_hdone:'SUDAH SIAP', pg_hcoming:'BELUM DIREKOD', pg_htoday:'PERLU BUAT DAN TERLEWAT',
  pg_doneon:'Siap', pg_planned:'Dirancang', pg_dayslate:'hari selepas rancangan',
  pg_dayspast:'hari lepas', pg_items:'barang', pg_none:'Tiada apa-apa di sini.',
  pg_nomat:'direkod siap, tetapi tiada bahan pernah dikeluarkan untuknya',
  pg_cancelled:'dibatalkan',
  pg_impnote:'Tarikh bagi bulan yang diimport datang dari helaian, bukan direkod pada hari itu.',
  pg_ro:'Skrin ini menunjukkan musim. Menanda set sebagai siap akan datang dalam keluaran seterusnya.',
  lb_off:'Buruh tidak direkod untuk kerja ini.',
  ps_on:'IKUT MASA', ps_late:'LEWAT', ps_due:'PERLU BUAT', ps_over:'TERLEWAT',
  ps_come:'AKAN DATANG', ps_can:'DIBATALKAN',
  ps_imported:'tarikh dari helaian, bukan direkod pada hari itu',
  ob_alllots:'SEMUA LOT', ob_trees:'pokok',
  ob_splithead:'Dibahagi ke semua lot ikut bilangan pokok',
  ob_splitrows:'Setiap produk jadi satu baris bagi setiap lot.',
  so_pickprod:'Pilih satu produk.', so_keyqty:'Masukkan kuantiti yang digunakan.',
  so_picklot:'Pilih lot sasaran di mana bahan digunakan.',
  si_haveinv:'📄 ADA INVOIS', si_noinv:'✋ TIADA INVOIS',
  si_ref:'Nombor invois / rujukan', si_supp:'Pembekal (pilihan)',
  si_whyno:'Kenapa tiada invois',
  si_needref:'Nombor invois diperlukan — atau tekan TIADA INVOIS dan beri sebab.',
  cs_head:'Semakan stok bulanan — cetak untuk ladang', cs_store:'STOR LADANG',
  cs_how:'Kira setiap produk. Tulis bilangan bekas PENUH, dan berapa yang tinggal dalam bekas yang dibuka.',
  cs_prod:'Produk', cs_appsays:'Aplikasi kata', cs_full:'Penuh', cs_open:'Dibuka',
  cs_by:'Dikira oleh', cs_date:'Tarikh', cs_sign:'Tandatangan',
  cs_print:'CETAK HELAIAN INI', cs_back:'‹ KEMBALI KE RAK',
  cs_openbtn:'🧾 CETAK HELAIAN KIRAAN UNTUK LADANG',
  cs_note:'Hantar bersama lori. Apa yang kembali dikunci melalui STOCK-TAKE, yang merekod pelarasan bertandatangan — angka rak tidak pernah ditulis ganti secara senyap.',
  pc_spray:'semburan', pc_fert:'baja', pc_sheet:'helaian',
  pc_skipped:'baris stor tidak dimasukkan dalam laporan ini kerana ia bukan semburan atau baja — seperti tali pengikat.',
  s_pcost:'KOS PROGRAM',
  wo_head:'Siapa ada di ladang', wo_today:'Hari ini', wo_tpeople:'TELEFON',
  wo_tfeed:'MINIT DEMI MINIT', wo_working:'BEKERJA', wo_quiet:'SENYAP', wo_none:'TIADA REKOD',
  wo_trees:'pokok', wo_good:'buah', wo_lost:'rosak', wo_tied:'diikat', wo_weighed:'ditimbang',
  wo_approved:'diluluskan', wo_returned:'dipulangkan', wo_otherrec:'lain', wo_first:'mula', wo_last:'akhir',
  wo_nothing:'tiada rekod', wo_norole:'tiada dalam senarai kakitangan',
  wo_noev:'Tiada apa-apa direkodkan pada hari ini.',
  wo_nothingday:'Telefon ini tidak menyimpan apa-apa pada hari ini.',
  wo_quietmsg:'tidak merekod apa-apa lebih sejam setengah.',
  wo_silentnote:'Orang yang tiada rekod mungkin memang tidak bekerja. Aplikasi ini tidak merekod log masuk, jadi telefon yang dibuka tetapi tidak digunakan nampak sama seperti telefon yang tidak pernah dibuka.',
  wo_gap:'Skrin ini membaca rekod yang telah disimpan. Ia tidak boleh menunjukkan log masuk — tiada apa-apa dalam aplikasi atau Google Sheet yang merekodnya lagi, jadi telefon yang dibuka tetapi tidak digunakan tidak meninggalkan sebarang kesan.',
  s_who:'SIAPA ADA',
  h_camclose:'✕ TUTUP KAMERA', h_campick:'☰ PILIH POKOK DARI SENARAI',
  h_othertree:'← TUKAR POKOK LAIN',
  h_backarm:'buah dikira dan BELUM disimpan. Tekan sekali lagi untuk tinggalkan pokok ini dan hilangkan kiraan.',
  h_selecttree:'pilih satu pokok', w_clone:'Klon', w_readonly:'BACA SAHAJA',
  ty_head:'🎗️ Rekod Ikat Buah',
  ty_note:'Kunci pokok dahulu, kemudian tekan sekali bagi setiap buah yang anda ikat. Tiada apa-apa keluar dari skrin ini sehingga anda tekan <b>Siap Pokok &amp; Simpan</b>.',
  ty_tap:'[ 🎗️ TEKAN UNTUK REKOD 1 BUAH DIIKAT ]', ty_tally:'Jumlah sesi ini:',
  ty_undo:'[ ↩️ Batal Tekan Silap ]', ty_save:'[ 💾 Siap Pokok &amp; Simpan ]',
  ty_selecttree:'— pilih pokok —', ty_none:'Kunci satu pokok dahulu.',
  ty_rope:'Setiap buah yang diikat menolak 1.5 m tali dari stor secara automatik',
  ty_store:'stor ada',
  m3_orderplanner:'Perancang Pesanan', m3_thisphase:'FASA INI', m3_nextphase:'FASA SETERUSNYA',
  m3_chkhead:'Semakan stok program akan datang',
  m3_chknote:'Membandingkan apa yang akan digunakan oleh program aktif tuan ladang dengan stok yang ada di stor sekarang. Apa-apa yang tidak cukup akan ditandakan supaya boleh dipesan sebelum tarikh semburan.',
  m3_readyhead:'Kesediaan bahan fasa seterusnya',
  m3_readynote:'Melihat melepasi fasa yang berjalan hari ini kepada apa yang diperlukan oleh program seterusnya, dikumpulkan mengikut <b>bahan aktif</b> supaya satu pesanan boleh meliputi beberapa jenama. Masa menunggu pesanan adalah sebab paparan ini wujud.',
  m3_noplan:'Tiada fasa program yang aktif. Tiada apa-apa untuk dipesan lebih awal.',
  m3_alerthead:'Baik juga tahu',
  m3_alertnote:'Tiada apa-apa di kad ini yang perlu dibuat hari ini. Sesuatu produk disenaraikan di bawah minimum apabila kuantiti hidupnya jatuh di bawah paras stok minimum. Kuantiti hidup = stok pembukaan − digunakan + diterima (termasuk entri yang masih menunggu giliran di telefon ini).',
  m3_lowstrip:'Produk di bawah paras minimum',
  m3_gapstrip:'Produk tiada harga atau bahan aktif',
  m3_inbuy:'sudah ada dalam senarai beli di atas',
  m3_obhead:'Daftar barang komersial baharu',
  m3_obnote:'Apa sahaja yang ditambah di sini akan masuk ke dalam katalog hidup serta-merta di telefon ini dan sampai ke telefon lain pada penyegerakan berikutnya. Ia bermula pada <b>stok sifar</b> — terima kuantitinya di skrin Stok Masuk mengikut invois, sama seperti produk lain.',
  op_head:'📋 Kerja hari ini — dari program aktif tuan ladang',
  op_note:'Kerja ditetapkan oleh tuan ladang dan tidak boleh diubah di sini. <b>SAHKAN SIAP</b> akan menolak tepat seperti yang dirancang untuk lot itu — guna ia apabila tangki dicampur ikut resipi di atas. Jika di ladang campur jumlah lain, guna <b>CAMPUR JUMLAH LAIN</b> dan masukkan bilangan tangki sebenar. Apa pun, bahan akan keluar dari stok ladang secara automatik dan dikira kos untuk lot itu.',
  op_sent:'✓ Laporan siap yang dihantar dari telefon ini',
  op_gen:'🛠️ Kerja ladang am',
  op_gennote:'Cantas, cabut rumput, ikat buah, ikat dahan dan buang buah. Setiap kerja meminta bilangan yang penting untuk kerja itu — aplikasi tidak akan terima laporan tanpa bilangan itu.',
  op_notask:'Tiada kerja menunggu. Tuan ladang belum aktifkan set, atau semua lot sudah dilaporkan.',
  op_noreply:'Belum ada laporan siap dihantar dari telefon ini.',
  op_nogen:'Tiada kerja am menunggu.',
  so_head:'📤 Ambil Bahan — dikeluarkan ke ladang', so_product:'Bahan',
  so_search:'Cari nama jenama atau bahan aktif…', so_ai:'Bahan aktif',
  so_qty:'Jumlah digunakan', so_lot:'Lot yang disembur', so_set:'Untuk set semburan',
  so_save:'✓ SIMPAN AMBIL BAHAN',
  so_note:'Menyimpan akan terus menolak stok ladang di telefon ini dan menunggu giliran untuk dihantar.',
  so_phi:'sentuh buah, PHI 14 hari', so_confirm:'(sahkan — lihat label)', so_onhand:'stok ada', so_nomatch:'— tiada padanan —',
  ty_onstring:'Masih di tali sekarang:', ty_untied:'Belum diikat, masih tergantung:', ty_nocensus:'tiada banci',
  role_OWNER:'Tuan Ladang / Admin', role_MARKETING:'Marketing',
  role_PURCHASER:'Pembeli Sandakan', role_WORKER:'Pekerja Ladang',
  bg_onstring:'DI TALI', bg_tiedtoday:'DIIKAT HARI INI', bg_tasks:'KERJA', bg_ropeshort:'TALI TIDAK CUKUP',

  /* --- v3.12 matriks bermusim / padanan jenama / rekod kerja --- */
  s_builder:'BINA PROGRAM',      s_builder_d:'Bina kombinasi lima bahagian ikut bahan aktif',
  s_alloc:'BAHAN ➔ JENAMA',      s_alloc_d:'Padankan jenama dalam stor dengan bahan aktif yang Tuan Ladang minta',
  s_onboard:'BARANG BARU',       s_onboard_d:'Tambah barang komersial ke dalam katalog stor',
  s_runs:'KERJA PROGRAM',        s_runs_d:'Kos harian, bulanan dan tahunan kerja yang betul-betul dibuat',
  /* --- v3.33.0 laporan: tiga pintu --- */
  s_money:'WANG',                s_money_d:'Satu bulan pada satu masa \u2014 hasil jualan, kos kerja, nilai stor',
  s_rec7:'REKOD HARIAN',         s_rec7_d:'Tujuh hari bersebelahan \u2014 diikat, elok, rosak, kg keluar',
  s_harv:'LAPORAN HASIL',        s_harv_d:'Mutu sepanjang musim, dan satu helaian yang dicetak untuk mesyuarat',

  /* --- v3.33.0 · tiga pintu laporan --- */
  rc_tied:'Diikat',
  rc_good:'Elok',
  rc_loss:'Rosak',
  rc_kgout:'kg keluar',
  rc_last7:'7 hari terakhir',
  rc_weekof:'minggu berakhir ',
  rc_backnow:'kembali ke minggu ini',
  rc_k1:'bilangan diikat',
  rc_k2:'buah elok gugur',
  rc_k3:'rosak',
  rc_k4:'kg dihantar',
  rc_nolog:'tiada rekod',
  mn_themonth:'bulan ini',
  mn_revenue:'Hasil jualan',
  mn_material:'Bahan',
  mn_labour:'Upah kerja',
  mn_draw:'Pengeluaran stor',
  mn_net:'Bersih',
  mn_perkg:'Purata RM / kg',
  mn_work:'Kos kerja yang dibuat',
  mn_job:'Kerja',
  mn_tanks:'Tangki',
  mn_matshort:'Bahan',
  mn_hours:'Jam',
  mn_total:'Jumlah',
  mn_store:'Wang stor — lima baris',
  mn_open:'Nilai buka',
  mn_bought:'Dibeli masuk',
  mn_drawn:'Dikeluarkan',
  mn_var:'Beza kiraan stok',
  mn_onhand:'Baki hujung bulan',
  mn_detail:'Skrin penuh',
  mn_totrm:'RM',
  mn_nojob:'Keluar tanpa kerja',
  mn_uncosted:'belum dikira kos',
  mn_netnolab:'hasil tolak bahan sahaja — upah kerja tiada dalam angka ini',
  /* --- v3.33.1 muat turun sejarah + cap padanan telefon --- */
  sy_histok:'Rekod penuh musim sudah masuk — telefon ini kini sama dengan yang lain',
  sy_agree:'Adakah telefon saya sepadan?',
  sy_full:'Telefon ini ada rekod penuh musim',
  sy_notfull:'Rekod lama masih dimuat turun — tekan SYNC sekali lagi',
  sy_frecords:'Rekod disimpan',
  sy_ffirst:'Rekod buah paling lama',
  sy_fdrops:'Buah elok, sepanjang musim',
  sy_frot:'Rosak, sepanjang musim',
  sy_finv:'Invois, sepanjang musim',
  sy_fkg:'kg dihantar keluar, sepanjang musim',
  sy_frecnote:'Yang terakhir ini BUKAN ujian padanan. Setiap peranan dihantar set rekod yang berbeza dengan sengaja — telefon ladang tidak pernah dihantar muatan peniaga atau gambar penimbang — jadi tiga angka ini memang patut berbeza. Hanya lima di atas yang wajib sama.',
  sy_agreenote:'Baca lima angka ini pada setiap telefon selepas semua sync. Lima angka sama = musim sama = laporan akan sepadan. Kalau satu telefon kurang, ia ada rekod yang belum sampai kepada yang lain — tekan SYNC pada telefon ITU dahulu, jangan sekali-kali tulis ganti.',
  hv_season:'Musim setakat ini',
  hv_day:'hari',
  hv_dropped:'gugur',
  hv_good:'Elok',
  hv_loss:'rosak',
  hv_left:'tinggal di pokok',
  hv_s1:'Dari mana kerosakan datang',
  hv_s1d:'setiap buah rosak, ikut sebab yang pekerja tekan',
  hv_cause:'Sebab',
  hv_fruit:'Buah',
  hv_share:'Bahagian',
  hv_s2:'Ikut lot, dikira setiap pokok',
  hv_s2d:'supaya lot kecil tidak dihukum kerana kecil',
  hv_lot:'Lot',
  hv_trees:'Pokok',
  hv_losspct:'% Rosak',
  hv_pertree:'/pokok',
  hv_farm:'LADANG',
  hv_s3:'% Pisang — markah pendebungaan',
  hv_s3d:'buah herot tanda pendebungaan tidak lengkap',
  hv_reads:'Bermakna',
  hv_clone:'Klon',
  hv_byclone:'Bacaan yang sama, ikut klon',
  hv_s4:'Kerosakan berbanding cuaca',
  hv_s4d:'satu hari dikira basah jika hujan hari itu atau dua hari sebelumnya',
  hv_cond:'Keadaan',
  hv_days:'Hari',
  hv_drop:'Gugur',
  hv_dry:'Hari kering',
  hv_wet:'Hujan + 2 hari selepas',
  hv_s5:'Ke mana buah pergi',
  hv_s5d:'setiap kilo yang ditimbang di pintu, dikira semula',
  hv_went:'Pergi ke',
  hv_worth:'Nilai',
  hv_sold:'Dijual kepada peniaga',
  hv_focgiven:'Diberi percuma — catuan & hadiah',
  hv_dumped:'Dibuang',
  hv_shed:'Masih dalam bangsal',
  hv_gatein:'Ditimbang di pintu',
  hv_s6:'Pokok yang paling banyak rosak',
  hv_s6d:'senarai yang tuan betul-betul pergi tengok',
  hv_tree:'Pokok',
  hv_bad:'Rosak',
  hv_s7:'Hari demi hari, dengan mutu',
  hv_s7d:'sepanjang musim, satu baris satu hari — inilah tujuan helaian cetak',
  hv_showdays:'tunjuk setiap hari di skrin',
  hv_date:'Tarikh',
  hv_dayname:'Hari',
  hv_print:'CETAK — HELAIAN MESYUARAT',
  hv_printnote:'Hanya skrin ini boleh dicetak. Jadual hari demi hari sentiasa ada pada helaian cetak, sama ada dibuka di sini atau tidak.',
  ag_tank:'Setiap sukatan di bawah adalah untuk SATU tangki pam 1,000 L.',
  ag_tankman:'Setiap sukatan di bawah adalah untuk SATU POKOK. Baja ditabur — tiada air dicampur.',
  ag_dir:'Arahan kerja',
  ag_method:'Cara pembajaan / semburan',
  ag_stage:'Peringkat musim',
  ag_wx:'Cuaca sekarang',
  ag_await:'⏳ Menunggu Pembeli Sandakan pilih jenama. Jangan mula kerja ini dahulu.',
  ag_ready:'✓ Jenama sudah dipilih — kerja ini boleh dijalankan',
  ag_brand:'Jenama diberi',
  ag_dose:'Sukatan setiap tangki 1,000 L',
  ag_dosetree:'Sukatan setiap pokok',
  ag_runbtn:'🧪 REKOD KERJA YANG DIBUAT',
  ag_runhead:'Rekod kerja yang dibuat',
  ag_water:'Jumlah air digunakan (liter)',
  ag_tanks:'Berapa tangki 1,000 L dicampur',
  ag_tankhint:'Boleh guna titik perpuluhan — tulis 3.5 untuk tiga tangki penuh dan setengah tangki.',
  ag_trees:'Berapa pokok dibaja',
  ag_lot:'Lot yang dibuat',
  ag_submit:'💾 SIMPAN & KUNCI REKOD KERJA',
  ag_locked:'Selepas disimpan rekod ini tidak boleh diubah. Stok keluar dari stor dan kos masuk ke lot tersebut.',
  ag_nodir:'Tiada arahan kerja untuk anda. Tuan Ladang keluarkan arahan dari Bina Program.',
  ag_deduct:'Kerja ini akan menolak',
  ag_nobrand:'jenama belum dipilih',
  ag_pubbtn:'📣 KELUARKAN KEPADA LADANG',
  ag_pub:'DIKELUARKAN',
  ag_draft:'DRAF',
  ag_closed:'DITUTUP',
  pu_allochead:'Padankan jenama untuk setiap bahan aktif yang Tuan Ladang minta',
  pu_maclock:'Kos dikunci pada',
  pu_nostock:'tiada barang dalam stor membawa bahan aktif ini',
  pu_onboardhead:'Daftar barang komersial baru',
  pu_brandname:'Nama jenama',
  pu_ailink:'Bahan aktif yang dibawa',
  pu_unit:'Jenis unit',
  pu_mult:'Satu bekas mengandungi',
  pu_onboardbtn:'＋ DAFTAR BAHAN BARU',
  rn_today:'Hari ini', rn_month:'Bulan ini', rn_year:'Tahun ini',
  sg_VEG:'Peringkat Daun', sg_PREFLW:'Sebelum Berbunga', sg_FLW:'Berbunga',
  sg_FSET:'Buah Mula Jadi', sg_POSTH:'Selepas Musim Buah',
  wx3_DRY:'Panas / Kering', wx3_MOD:'Hujan Sederhana', wx3_HEAVY:'Hujan Lebat',
  mt_WHOLE:'Seluruh Pokok (Dalam/Luar)',   mt_WHOLE_d:'Sembur penuh — luar tajuk dan dahan dalam',
  mt_LEAFFRUIT:'Daun dan Buah',            mt_LEAFFRUIT_d:'Daun tajuk luar dan buah bergantung — buah TERKENA sembur',
  mt_LEAFOUT:'Daun Luar Sahaja',           mt_LEAFOUT_d:'Daun tajuk luar sahaja — JANGAN kena buah',
  mt_INSIDE:'Dalam Sahaja (Buah/Dahan)',   mt_INSIDE_d:'Dalam tajuk — permukaan buah dan dahan',
  mt_DRENCH:'Siram Tanah',                 mt_DRENCH_d:'Dicurah di kawasan akar, bukan disembur pada pokok',
  mt_DRIP:'Tabur Kawasan Titisan',         mt_DRIP_d:'Bulatan di bawah hujung tajuk tempat air hujan menitis',
  mt_OUTCAN:'Tabur Luar Tajuk',            mt_OUTCAN_d:'Di luar hujung tajuk — memberi makan akar yang menjalar keluar',
  mt_INCAN:'Tabur Seluruh Dalam Tajuk',    mt_INCAN_d:'Seluruh kawasan dalam tajuk, dari batang ke luar',
  sl_PEST:'Racun Serangga', sl_FUNG:'Racun Kulat', sl_FOL:'Baja Daun',
  sl_BIO:'Perangsang', sl_TE:'Bahan Surih (TE)',
  ag_dirnote:'Kerja ini ditetapkan oleh Tuan Ladang dan tidak boleh diubah di sini. Tekan REKOD KERJA YANG DIBUAT dan masukkan apa yang betul-betul dicampur — bahan akan keluar dari stok ladang dan dikira kos untuk lot itu secara automatik.',
  ag_short:'⚠ STOK TIDAK CUKUP untuk satu tangki penuh',
  ag_costhidden:'kos dikunci ✓ (angka RM disembunyikan untuk peranan anda)',
  ag_crew:'Berapa pekerja buat kerja ini', ag_hours:'Berapa jam seorang',
  ag_deducthead:'Kerja ini akan menolak',
  ag_col_brand:'Jenama', ag_col_dose:'Sukatan', ag_col_onhand:'Stok ada',
  ag_cancel:'BATAL', ag_dirlbl:'Arahan kerja', ag_methodlbl:'Cara pembajaan / semburan',
  ag_manhours:'jam-orang', ag_crewhint:'Bilangan pekerja dan jam membina jumlah upah bulan ini.',
  ag_tanksof:'tangki', ag_treesdone:'pokok', ag_waterkeyed:'L air dimasukkan',
  ag_matcost:'Kos bahan kerja ini:',
  ag_keytanks:'Masukkan berapa tangki 1,000 L dicampur.',
  ag_keytrees:'Masukkan berapa pokok dibuat.',
  ag_phinote:'⚠ barang sentuh buah — tanya Tuan Ladang tentang tempoh menunggu sebelum guna',
  ag_secured:'🔒 Rekod kerja disimpan', ag_costedto:'barang dikira kos untuk Lot',
  ag_tmplnote:'Ditapis ikut cara semburan — tekan satu untuk isi slot, kemudian ubah apa-apa sebelum keluarkan arahan.',

  /* --- v3.13 · kad kerja jenama sahaja --- */
  w13_date:'TARIKH', w13_task:'KERJA', w13_method:'CARA KERJA',
  w13_perTank:'setiap tangki 1,000 L', w13_perTree:'setiap pokok',
  w13_markdone:'📦 TANDA KERJA SIAP',
  w13_savetally:'💾 Simpan & Kira Stor',
  w13_tanks:'Berapa Tangki 1,000L Dicampur',
  w13_confirm:'Sahkan Jumlah Isi Padu (ml/gm)',
  w13_expects:'Sistem kira sepatutnya',
  w13_mismatch:'Jumlah yang anda ambil tidak sama dengan yang resipi perlukan.',
  w13_nospray:'⚠ JANGAN SEMBUR BUAH — tanya Tuan Ladang dahulu',
  /* v3.18 · Modul 6 */
  /* v3.19 — penerimaan banyak baris + nilai pesanan */
  si_add:'＋ TAMBAH KE PENGHANTARAN INI', si_added:'ditambah ke penghantaran ini',
  si_thisdel:'Dalam penghantaran ini', si_total:'Jumlah penghantaran',
  si_receive:'TERIMA SEMUA', si_clear:'KOSONGKAN PENGHANTARAN INI',
  si_clearask:'Buang semua baris dalam penghantaran ini?', si_lines:'baris diterima',
  pr_ordertot:'Anggaran nilai pesanan',
  pr_estnote:'pada kos purata bergerak',
  pr_estguess:'sebahagian pada harga senarai — belum pernah dibeli',
  pr_title:'BELI UNTUK PROGRAM',
  pr_head:'bahan menyekat program yang telah dikeluarkan \u2014 pekerja tidak boleh mula',
  pr_none:'\u2713 Semua bahan untuk program yang dikeluarkan mencukupi dalam stok.',
  pr_nobrand:'BELUM ADA JENAMA',
  pr_need:'Perlu', pr_have:'Ada', pr_gap:'Kurang', pr_buy:'Pesan',
  pr_orderby:'Pesan sebelum', pr_daysleft:'hari lagi', pr_overdue:'PESAN SEKARANG \u2014 SUDAH LEWAT',
  pr_nodate:'Tiada tarikh siap pada arahan ini',
  pr_match:'PADAN JENAMA', pr_onboard:'DAFTAR JENAMA', pr_stockin:'TERIMA STOK',
  pu_wrongunit:'Dijual dalam unit lain \u2014 ditolak bila dipilih',
  pu_onboardthis:'Daftar jenama baharu untuk bahan ini\u2026',
  pu_onboardgo:'Daftar jenama yang membawa bahan ini',
  ag_awaitn:'bahan masih tiada jenama dalam stor',
  /* v3.18 — kombo bebas */
  sl_HERB:'Racun Rumpai', sl_FERT:'Baja',
  ag_confirmai:'SAHKAN LABEL',
  ag_bybrand:'IKUT JENAMA',
  ag_unconfirmed:'bahan aktif belum disahkan pada label',
  ag_blobfull:'had limit penyegerakan arahan digunakan \u2014 tutup arahan yang sudah siap',
  ag_addcomp:'TAMBAH BAHAN',
  ag_nocomp:'Belum ada bahan. Tambah yang pertama di bawah.',
  ag_rolefilter:'Tapis ikut jenis \u2014 panduan, bukan syarat',
  ag_alling:'SEMUA',
  ag_searchai:'Cari mana-mana bahan\u2026',
  ag_zerostock:'STOK KOSONG',
  ag_instore:'dalam stor',
  ag_mixnote:'Sentuh dan sistemik dalam satu tangki',
  ag_mixsub:'Sembur bila daun boleh kering. Tetap disimpan \u2014 ini nasihat, bukan syarat.',
  ag_dupnote:'muncul lebih daripada sekali. Dibenarkan \u2014 setiap baris tolak stok berasingan, pastikan ia disengajakan.',
  ag_manynote:'bahan dalam satu tangki. Pastikan ia boleh bercampur \u2014 tidak disekat.',
  w13_norain:'⚠ HUJAN LEBAT — jangan sembur hari ini',
  w13_wetleaf:'💧 Daun masih basah — tanya Tuan Ladang dahulu',
  w13_crew:'Pekerja', w13_hrs:'Jam seorang', w13_change:'tukar',
  w13_whichlot:'Lot mana yang dibuat?',
  w13_todo:'BELUM SIAP', w13_waiting:'MENUNGGU', w13_donelot:'Sudah siap',
  w13_stilltodo:'Belum siap',
  w13_confirmhead:'Sahkan kerja',
  w13_recipeTank:'Apa yang masuk dalam satu tangki 1,000 L', w13_recipeTree:'Apa yang masuk untuk setiap pokok',
  w13_keytanks:'Masukkan berapa tangki dicampur.',
  w13_keytotal:'Masukkan jumlah yang anda ambil dari stor.',
  w13_keycrew:'Masukkan bilangan pekerja dan jam — sekali sahaja, lepas ini sistem ingat.',
  w13_saved:'✓ Kerja disimpan · stok stor dikemas kini',

  pm_WHOLE:'Sembur Seluruh Pokok / Dalam & Luar',
  pm_LEAFOUT:'Sembur Daun Luar Sahaja / Jangan Kena Buah',
  pm_INSIDE:'Sembur Dalam Sahaja / Buah & Dahan',
  pm_DRENCH:'Siram Tanah / Kawasan Akar',
  pm_DRIP:'Tabur Kawasan Titisan Tajuk',
  pm_OUTCAN:'Tabur Luar Tajuk',
  pm_INCAN:'Tabur Seluruh Dalam Tajuk',
  s_builder_t:'Templat', ag_comboname:'Nama kombinasi', ag_where:'Untuk lot mana',
  ag_slots:'Bahagian', ag_saveissue:'📣 SIMPAN & KELUARKAN', ag_clear:'KOSONGKAN',
  ag_thematrix:'Senarai program', ag_savecombo:'SIMPAN', ag_savechanges:'SIMPAN PERUBAHAN',
  ag_doselbl:'Sukatan', ag_unitlbl:'Unit',

  /* --- v3.14 · kira pokok, sistem kira tangki --- */
  t14_head:'Berapa pokok sudah dibuat hari ini',
  t14_treestoday:'Pokok dibuat hari ini',
  t14_all:'SEMUA', t14_none:'TIADA',
  t14_of:'daripada', t14_trees:'pokok', t14_left:'tinggal',
  t14_donebefore:'dibuat hari lain',
  t14_finished:'SIAP', t14_carry:'SAMBUNG', t14_nottouched:'BELUM',
  t14_empty:'Kosongkan jika lot ini tidak disentuh hari ini.',
  t14_rate:'Kadar yang Tuan Ladang tetapkan',
  t14_lpt:'LITER setiap pokok', t14_pertree:'Ikut pokok — tiada air',
  t14_covers:'Satu tangki 1,000 L cukup untuk kira-kira {n} pokok.',
  t14_nowater:'Baja ditabur terus. Sukatan ikut pokok, bukan ikut tangki.',
  t14_today:'Hari ini',
  t14_mhonce:'jam-orang — dimasukkan SEKALI dan dibahagi ikut pokok',
  t14_keytrees:'Masukkan berapa pokok sudah dibuat.',
  t14_toomany:'Itu lebih banyak daripada baki pokok dalam lot ini.',
  // v3.25.0 (audit D-09)
  t25_shortstock:'STOK DALAM STOR TIDAK CUKUP UNTUK KERJA INI',
  t25_shortask:'Beritahu Sandakan sebelum campur. Nak simpan juga?',
  t25_basisclash:'SET ITU DIUKUR IKUT POKOK, BUKAN IKUT TANGKI',
  t25_basisclash2:'Tukar jenis kerja kepada BAJA / SOIL dahulu, kalau tidak pekerja akan diberitahu masuk dos satu pokok penuh ke dalam satu tangki.',
  t14_stillleft:'Masih dalam senarai esok',
  t14_allfinished:'Semua pokok sudah siap. Kerja ini keluar dari senarai.',
  t14_saved:'✓ Disimpan · stok stor dikemas kini',
  t14_lotall:'SEMUA LOT',
  t14_perlot:'Setiap lot',
  t14_genall:'Masukkan apa yang dibuat di setiap lot. Kosongkan lot yang tidak disentuh.',

  /* --- v3.15 · tarikh mesti siap dan rekodnya --- */
  dt_due:'Mesti siap', dt_suggest:'Dicadang dari jadual program — boleh tukar',
  dt_left:'LAGI {n} HARI', dt_tomorrow:'ESOK', dt_today:'MESTI SIAP HARI INI',
  dt_late:'LEWAT {n} HARI', dt_by:'mesti siap', dt_nodate:'tiada tarikh',
  dt_needdue:'Letak tarikh kerja ini mesti siap.',
  s_record:'REKOD PROGRAM', s_record_d:'Dikeluarkan, siap, ikut masa atau lewat — ikut bulan dan tahun',
  rp_issued:'Program dikeluarkan', rp_ontime:'Siap ikut masa', rp_latedone:'Siap lewat',
  rp_open:'Belum siap', rp_overdue:'{n} sudah lewat',
  rp_thismonth:'Program bulan ini', rp_year:'Rekod tahun — ikut bulan',
  rp_mo:'Bulan', rp_out:'Keluar', rp_ok:'Ikut masa', rp_lt:'Lewat', rp_total:'JUMLAH',
  rp_scored:'Hanya program yang SUDAH SIAP dikira dalam peratus. Yang belum siap belum ada markah.',
  rp_done:'siap', rp_notdone:'belum siap',
  rp_ontimechip:'IKUT MASA', rp_earlychip:'AWAL {n} HARI', rp_latechip:'LEWAT {n} HARI',
  rp_none:'Tiada program bertarikh dalam bulan ini lagi.',
  rp_pct:'daripada program yang sudah siap, siap ikut masa', rp_yearpct:'Ikut masa tahun ini',
  bg_late:'LEWAT',
  rp_noscore:'Belum ada program yang siap, jadi belum ada peratus untuk ditunjuk.',

  /* ---- v3.16 · empat ruang kerja berasingan ---------------------------------------- */
  m_cmd:'Arahan', s_exec:'Ringkasan Eksekutif', s_builder:'Bina Program',
  s_master:'Kawalan Induk',
  m_mkt:'Pintu & Peniaga', s_review:'Semakan Hantaran',
  s_supplyhub:'STOR',
  bg_variance:'AMARAN POKOK', bg_credit:'KREDIT RENDAH',
  /* satu lawatan pokok, satu simpan */
  cv_tag:'Satu lawatan · satu simpan', cv_head:'✅ Habiskan pokok ini',
  cv_note:'Kira buah elok di atas, kemudian buah yang rosak. Kedua-duanya disimpan sekali dengan butang ini — anda tidak simpan dua kali di pokok yang sama. Biar mana-mana kad pada 0 jika tiada.',
  cv_save:'✅ SIMPAN SEMUA LAWATAN POKOK',
  cv_none:'Belum ada yang dikira.', cv_good:'elok', cv_lost:'rosak',
  cv_notree:'Pilih pokok dahulu.',
  cv_nothing:'Kira buah elok, atau buah rosak, sebelum simpan.',
  cv_nocause:'Pilih sebab rosak — kiraan tanpa sebab tidak boleh diambil tindakan.',
  cv_notied:'Nyatakan sama ada buah rosak itu terikat atau tidak.',
  /* ringkasan eksekutif Tuan */
  w_derived:'DIKIRA',
  ex_varhead:'pokok gugur buah tidak terikat hari ini', ex_unsec:'tidak terikat',
  ex_varwhy:'atau lebih gugur tidak terikat pada satu pokok dalam satu hari bermakna kerja ikat tidak menahan. Periksa ikatan pokok ini sebelum gelombang.',
  ex_varok:'Tiada pokok melebihi had gugur tidak terikat hari ini',
  ex_varoka:'Kurang daripada', ex_varokb:'gugur tidak terikat pada setiap pokok setakat ini.',
  ex_rain:'Hujan', ex_days:'hari',
  ex_wet_a:'Melebihi', ex_wet:'mm garis lembapan — kanopi basah, mudah luntur dan tekanan reput akar. Tahan semburan sentuh.',
  ex_dry_a:'Bawah', ex_dry:'mm garis lembapan. Tetingkap semburan terbuka.',
  ex_fcast:'Ramalan gugur', ex_norate:'Belum ada kadar gugur',
  ex_norateb:'Tiada kutipan dalam 7 hari lepas, jadi tiada kadar untuk diunjur. Ramalan muncul sebaik sahaja kru merekod satu hari gugur.',
  ex_next7:'7 hari akan datang', ex_fruit:'biji', ex_rate:'Kadar', ex_perday:'biji sehari',
  ex_stillon:'masih di pokok', ex_tied:'terikat', ex_untied:'tidak terikat',
  ex_topeak:'Puncak dijangka dalam', ex_pastpeak:'Sudah lepas tarikh puncak',
  ex_inwave:'tetingkap gelombang terbuka',
  ex_nocensus:'Tidak termasuk', ex_nocensusb:'pokok yang tidak pernah dibanci',
  ex_derived:'setiap angka ≈ dikira daripada kadar gugur dan banci, bukan dikunci sesiapa',
  ex_credit:'Kredit pendahuluan untuk gelombang akan datang',
  ex_credunknown:'Belum ada sejarah hantaran berharga, jadi tiada had boleh disyorkan tanpa meneka harga sekilo.',
  ex_balance:'Baki sekarang', ex_target:'had disyorkan',
  ex_share:'Ambil', ex_ofvolume:'daripada nilai hantaran', ex_next7low:'dalam 7 hari akan datang',
  ex_topup:'tambah', ex_credok:'cukup untuk gelombang',
  ex_credshort:'Kredit akan habis di tengah gelombang pada kadar sekarang.',
  ex_month:'Bulan ini', ex_nomonth:'Belum ada hantaran atau pergerakan stok direkod.',
  ex_norev:'Belum ada hasil peruncit', ex_revtot:'Jumlah hasil',
  ex_spend:'Bahan + buruh', ex_margin:'Margin', ex_draw:'Susut bahan',
  ex_kg:'Dihantar', ex_inv:'invois',
  so_safety:'Nota keselamatan', so_searchw:'Cari nama pada drum…',
  ex_credarrears:'Sudah terlebih guna', ex_credarrears2:'nilai buah sudah keluar sedangkan kredit sudah habis. Tambahan di atas menjelaskan hutang itu dahulu, kemudian menampung gelombang.',
  ca_sec:'bertali', ca_unsec:'tanpa tali', ca_fruit:'biji',

  /* ---- v3.17 · TILE F TAB 1 — apa yang perlu perhatian Tuan hari ini -------------- */
  s_today:'Hari Ini', s_compare:'Banding',
  cd_needs:'Perlu perhatian anda hari ini', cd_clear:'Tiada apa perlu perhatian',
  cd_clearsub:'Tiada program lewat, setiap bahan sudah ada jenamanya, tiada muatan menunggu semakan, dan tiada stok bawah paras minimum.',
  cd_w_trees:'POKOK', cd_w_late:'LEWAT', cd_w_hold:'TAHAN', cd_w_wait:'TUNGGU',
  cd_w_short:'KURANG', cd_w_low:'RENDAH', cd_w_new:'BARU', cd_w_stale:'SENYAP', cd_w_credit:'KREDIT',
  cd_a_trees:'Ada pokok gugur buah tanpa tali hari ini',
  cd_s_trees:'kerja tali tidak bertahan pada pokok ini',
  cd_a_late:'Ada program lepas tarikh yang Tuan tetapkan',
  cd_s_late:'kerja belum siap selepas tarikh tamat',
  cd_a_hold:'Ada muatan menunggu semakan gambar Tuan',
  cd_s_hold:'kredit tidak bergerak sebelum Tuan lihat',
  cd_a_wait:'Ada bahan belum dipilih jenamanya',
  cd_s_wait:'pekerja tidak boleh mula sebelum jenama dipadan',
  cd_a_short:'Stor tidak cukup untuk program yang dikeluarkan',
  cd_s_short:'stok di stor tidak cukup untuk habiskan kerja',
  cd_a_low:'Ada produk bawah paras minimum',
  cd_s_low:'pesan sebelum gelombang, bukan semasa',
  cd_a_corr:'Ada permohonan pembetulan menunggu',
  cd_s_corr:'rekod pokok tidak berubah sebelum Tuan putuskan',
  cd_a_stale:'Ada telefon tidak hantar data dua hari atau lebih',
  cd_s_stale:'kerja mereka belum masuk dalam angka di skrin ini',
  cd_a_credit:'Ada peniaga akan kehabisan kredit pratunai pertengahan gelombang',
  cd_s_credit:'tambah sebelum buah keluar, bukan selepas',
  cd_today:'Hari ini', cd_fruit:'Buah dikutip', cd_kgout:'Kg ditimbang keluar',
  cd_rmin:'Invois hari ini', cd_rmout:'Bahan diguna hari ini',
  cd_vsyest:'berbanding semalam', cd_noyest:'semalam tiada rekod untuk dibanding',
  cd_crop:'Buah sekarang', cd_onstring:'Atas tali', cd_untied:'Belum diikat',
  cd_shed:'Dalam bangsal', cd_peak:'Ke puncak gugur', cd_past:'lepas puncak',
  cd_days:'hari', cd_fruitu:'biji', cd_est:'anggaran',
  cd_month:'Bulan ini', cd_sold:'Buah dijual', cd_material:'Bahan diguna',
  cd_labour:'Upah', cd_left:'Baki',
  cd_soldsub:'daripada invois', cd_matsub:'daripada stor, kos purata bergerak',
  cd_labsub:'jam-orang didarab kadar upah',
  cd_progout:'Program dikeluarkan', cd_ontime:'Ikut masa', cd_late:'Lewat',
  cd_phones:'Telefon · data terakhir dihantar', cd_never:'belum ada',
  cd_minago:'minit lalu', cd_hourago:'jam lalu', cd_dayago:'hari lalu',
  cd_nomonth:'Belum ada hantaran atau pengeluaran bulan ini.',
  cd_nocrop:'Belum ada pokok dibanci, jadi tiada asas untuk dikira.',

  /* ---- v3.17 · TILE F TAB 3 — banding -------------------------------------------- */
  cb_7:'7 HARI', cb_7s:'7 hari lepas', cb_m:'BULAN INI', cb_s:'MUSIM', cb_ss:'tahun ini',
  cb_fruit:'BUAH', cb_kg:'KG', cb_in:'MASUK', cb_mat:'BAHAN',
  cb_l_fruit:'Buah dikutip', cb_l_kg:'Kg ditimbang keluar', cb_l_in:'RM invois',
  cb_l_mat:'RM bahan diguna',
  cb_vs7:'berbanding 7 hari sebelumnya',
  cb_vsm:'berbanding hari yang sama bulan lepas', cb_vss:'berbanding tempoh sama tahun lepas',
  cb_nocmp:'belum ada banding', cb_first:'tempoh pertama direkod',
  cb_ofdays:'{d} daripada {n} hari direkod setakat ini',
  cb_tap:'Tekan bar untuk lihat hari itu', cb_tapm:'Tekan bar untuk lihat bulan itu', cb_shownum:'TUNJUK ANGKA', cb_showchart:'TUNJUK CARTA',
  cb_when:'Bila', cb_total:'Jumlah',
  cb_money:'Duit · tempoh ini berbanding tempoh sebelum',
  cb_before:'Sebelum', cb_change:'Beza',
  cb_grade:'Gred dan buah rosak', cb_ga:'Gred A', cb_gb:'Gred B', cb_gc:'Gred C',
  cb_rot:'Rosak',
  cb_rotnow:'Rosak tempoh ini', cb_rotprev:'Rosak tempoh sebelum',
  cb_rotchg:'Beza', cb_points:'mata', cb_norec:'tiada rekod',
  cb_bylot:'Ikut lot · buah dikutip', cb_lot:'Lot', cb_share:'Bahagian',
  cb_prog:'Program', cb_issued:'Dikeluarkan', cb_pon:'Siap ikut masa',
  cb_plate:'Siap lewat', cb_popen:'Belum siap', cb_ppct:'Ikut masa',
  cb_noscore:'belum ada yang siap',
  cb_nodata:'Belum ada apa-apa direkod dalam tempoh ini. Setiap angka di sini dibina sendiri daripada rekod tuai, hantaran, stok dan program — tiada apa perlu ditaip.',
  cb_derived:'Setiap angka dijumlahkan daripada rekod yang sedia ada dalam sistem. Tiada apa di sini ditaip dua kali.',
  cb_thisper:'Tempoh ini', bg_todo:'PERLU BUAT',
  m_admin:'Pentadbiran', s_adjust:'Pembetulan', s_staff:'Pekerja', s_stocklvl:'Paras Stok',
  /* v3.41.0 */
  s_fixrec:'BETULKAN REKOD',
  s_fixrec_d:'Betulkan angka, masukkan kerja yang tak direkod, atau buang data ujian',
  s_trees:'POKOK',
  s_trees_d:'Banci pokok - tambah pokok baru, terus ada dalam setiap senarai',
  s_qrtag:'TAG QR APL',
  s_qrtag_d:'Kod yang pekerja baru imbas untuk pasang apl',
  cd_rateoff:'kadar belum disahkan',
  cd_ratewarn:'ialah kadar sementara. Angka upah dan baki hanya anggaran sehingga Tuan tetapkan kadar sebenar di Laporan \u25b8 UPAH.',

  /* ===== v3.23.0 · ROUND 2 · MODULE 4 · SHARED COMPONENTS — merged from the lane reports at integration.
     Both lanes also carry an inline English fallback at every tr() call site, so a key
     missing here degrades to English rather than printing a key name at a farm worker. */
  m4_col_prod:"Produk",
  m4_col_prodai:"Produk / bahan aktif",
  m4_col_onhand:"Baki stok",
  m4_col_min:"Min",
  m4_col_value:"Nilai",
  m4_low:"RENDAH",
  m4_nomatch:"Tiada produk yang sepadan dengan carian itu.",
  m4_showall:"TUNJUK SEMUA",
  m4_showfirst:"TUNJUK HANYA YANG PERTAMA",
  m4_product:"PRODUK",
  m4_products:"PRODUK",
  m4_product_l:"produk",
  m4_products_l:"produk",
  m4_belowmin:"DI BAWAH STOK MINIMUM",
  m4_unitsword:"unit",
  m4_notrecorded:"(tidak direkodkan)",

  /* ===== v3.23.0 · ROUND 2 · MODULE 8 · PIECES 3 + 5 — merged from the lane reports at integration.
     Both lanes also carry an inline English fallback at every tr() call site, so a key
     missing here degrades to English rather than printing a key name at a farm worker. */
  m8_recvtitle:"TERIMA MENGIKUT SENARAI BELIAN",
  m8_recvnone:"Belum ada apa-apa dalam senarai belian. Bila Tuan keluarkan program, baris untuk diterima akan muncul di sini, sudah pun terisi.",
  m8_recvwhy:"Ini baris yang diminta oleh senarai belian. Tanda yang betul-betul sampai, betulkan kuantiti kalau pembekal hantar kurang, kunci harga yang dicaj, kemudian tambah semuanya ke penghantaran di bawah.",
  m8_recvinv:"Nombor invois milik penghantaran, bukan milik baris — kunci sekali sahaja di LOG STOK MASUK di bawah. TERIMA SEMUA akan tolak tanpa nombor invois.",
  m8_recvgoinv:"KUNCI NO. INVOIS",
  m8_recvadd:"TAMBAH YANG DITANDA KE PENGHANTARAN INI",
  m8_recvqty:"Bekas diterima",
  m8_recvprice:"Harga sebekas (RM)",
  m8_recvsugg:"cadangan",
  m8_recvasked:"Senarai belian minta",
  m8_recvsel:"Ditanda",
  m8_recvtot:"Nilai baris yang ditanda",
  m8_recvnothing:"Tanda sekurang-kurangnya satu baris yang sampai.",
  m8_recvbad:"Kunci kuantiti dan harga untuk:",
  m8_recvdone:"baris ditambah ke penghantaran ini",
  m8_showplan:"TUNJUK JANGKAAN",
  m8_hideplan:"SEMBUNYI JANGKAAN",
  m8_planhead:"JANGKAAN — BELUM DIKELUARKAN",
  m8_planwhy:"Set program yang Tuan rancang dalam tetingkap pesanan di hadapan. Ia mungkin masih dialih, diubah dos atau dibatalkan — tiada apa di sini yang sudah disahkan, dan tiada satu pun dikira dalam anggaran nilai pesanan di atas.",
  m8_planwin:"Tetingkap pesanan",
  m8_plandays:"hari",
  m8_plantot:"Nilai pesanan jangkaan",
  m8_plantag:"JANGKAAN",
  m8_confirmtag:"DISAHKAN",
  m8_planfor:"Untuk",
  m8_planby:"Pesan sebelum"
};


/* =====================================================================
   USAGE_IMPORT_2026 — the farm's own Usage Log, 29 Jan to 3 Aug 2026,
   452 entries, RM 33,347.90 of inputs. Transcribed from
   SugutDurian_Inventory_GoogleSheet_7_1_1.xlsx and reconciled 44/44
   against that workbook's own per-product totals.
   Whole-farm jobs are split by tree count (A 65 / B 66 / C 40 of 171);
   GA3 is left whole with no lot, because tablets do not divide.
   Every opening balance above is now WHAT WAS RECEIVED since 1 January,
   so opening minus these entries returns each product to its counted
   stock and the store still values at RM 19,604.22.
   uuids are fixed, so six phones holding this file cannot make six copies.
   ===================================================================== */
const USAGE_IMPORT_TAG="2026-08-05";
const USAGE_IMPORT_2026=[{"uuid":"imp2026-0001","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":1,"pname":"Amotan 22.8SC","ai":"Azoxystrobin","qty":570.18,"unit":"ml","lot":"A","set":"January - Set 1","cost":119.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0002","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":1,"pname":"Amotan 22.8SC","ai":"Azoxystrobin","qty":578.95,"unit":"ml","lot":"B","set":"January - Set 1","cost":121.58,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0003","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":1,"pname":"Amotan 22.8SC","ai":"Azoxystrobin","qty":350.87,"unit":"ml","lot":"C","set":"January - Set 1","cost":73.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0004","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1140.35,"unit":"ml","lot":"A","set":"January - Set 1","cost":20.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0005","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1157.89,"unit":"ml","lot":"B","set":"January - Set 1","cost":20.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0006","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":701.76,"unit":"ml","lot":"C","set":"January - Set 1","cost":12.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0007","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":1140.35,"unit":"ml","lot":"A","set":"January - Set 1","cost":79.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0008","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":1157.89,"unit":"ml","lot":"B","set":"January - Set 1","cost":81.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0009","type":"STOCK_OUT","dt":"2026-01-29T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":701.76,"unit":"ml","lot":"C","set":"January - Set 1","cost":49.12,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 1"},{"uuid":"imp2026-0010","type":"STOCK_OUT","dt":"2026-02-04T08:00:00","pid":32,"pname":"Yara Liva Tropicote","ai":"Calcium nitrate 15.5-0-0 + 26.5 CaO","qty":63859.65,"unit":"gm","lot":"A","set":"January - Fert Set 1","cost":204.35,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 1"},{"uuid":"imp2026-0011","type":"STOCK_OUT","dt":"2026-02-04T08:00:00","pid":32,"pname":"Yara Liva Tropicote","ai":"Calcium nitrate 15.5-0-0 + 26.5 CaO","qty":64842.11,"unit":"gm","lot":"B","set":"January - Fert Set 1","cost":207.49,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 1"},{"uuid":"imp2026-0012","type":"STOCK_OUT","dt":"2026-02-04T08:00:00","pid":32,"pname":"Yara Liva Tropicote","ai":"Calcium nitrate 15.5-0-0 + 26.5 CaO","qty":39298.24,"unit":"gm","lot":"C","set":"January - Fert Set 1","cost":125.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 1"},{"uuid":"imp2026-0013","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":10,"pname":"AMG mix","ai":"Amino acid + Magnesium mix","qty":1140.35,"unit":"ml","lot":"A","set":"January - Set 2","cost":77.54,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0014","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":10,"pname":"AMG mix","ai":"Amino acid + Magnesium mix","qty":1157.89,"unit":"ml","lot":"B","set":"January - Set 2","cost":78.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0015","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":10,"pname":"AMG mix","ai":"Amino acid + Magnesium mix","qty":701.76,"unit":"ml","lot":"C","set":"January - Set 2","cost":47.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0016","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1140.35,"unit":"ml","lot":"A","set":"January - Set 2","cost":51.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0017","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1157.89,"unit":"ml","lot":"B","set":"January - Set 2","cost":52.11,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0018","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":701.76,"unit":"ml","lot":"C","set":"January - Set 2","cost":31.58,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0019","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":570.18,"unit":"ml","lot":"A","set":"January - Set 2","cost":50.18,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0020","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":578.95,"unit":"ml","lot":"B","set":"January - Set 2","cost":50.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0021","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":350.87,"unit":"ml","lot":"C","set":"January - Set 2","cost":30.88,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0022","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":6,"pname":"Mancozeb (Raincozeb 80WB)","ai":"Mancozeb 80%","qty":570.18,"unit":"gm","lot":"A","set":"January - Set 2","cost":14.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0023","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":6,"pname":"Mancozeb (Raincozeb 80WB)","ai":"Mancozeb 80%","qty":578.95,"unit":"gm","lot":"B","set":"January - Set 2","cost":14.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0024","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":6,"pname":"Mancozeb (Raincozeb 80WB)","ai":"Mancozeb 80%","qty":350.87,"unit":"gm","lot":"C","set":"January - Set 2","cost":8.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0025","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":32,"pname":"Yara Liva Tropicote","ai":"Calcium nitrate 15.5-0-0 + 26.5 CaO","qty":2280.7,"unit":"gm","lot":"A","set":"January - Set 2","cost":7.3,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0026","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":32,"pname":"Yara Liva Tropicote","ai":"Calcium nitrate 15.5-0-0 + 26.5 CaO","qty":2315.79,"unit":"gm","lot":"B","set":"January - Set 2","cost":7.41,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0027","type":"STOCK_OUT","dt":"2026-02-07T08:00:00","pid":32,"pname":"Yara Liva Tropicote","ai":"Calcium nitrate 15.5-0-0 + 26.5 CaO","qty":1403.51,"unit":"gm","lot":"C","set":"January - Set 2","cost":4.49,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 2"},{"uuid":"imp2026-0028","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":8,"pname":"Agus 24SC","ai":"Diafenthiuron","qty":570.18,"unit":"ml","lot":"A","set":"January - Set 3","cost":96.93,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0029","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":8,"pname":"Agus 24SC","ai":"Diafenthiuron","qty":578.95,"unit":"ml","lot":"B","set":"January - Set 3","cost":98.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0030","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":8,"pname":"Agus 24SC","ai":"Diafenthiuron","qty":350.87,"unit":"ml","lot":"C","set":"January - Set 3","cost":59.65,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0031","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":570.18,"unit":"ml","lot":"A","set":"January - Set 3","cost":88.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0032","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":578.95,"unit":"ml","lot":"B","set":"January - Set 3","cost":90.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0033","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":350.87,"unit":"ml","lot":"C","set":"January - Set 3","cost":54.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0034","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1140.35,"unit":"ml","lot":"A","set":"January - Set 3","cost":20.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0035","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1157.89,"unit":"ml","lot":"B","set":"January - Set 3","cost":20.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0036","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":701.76,"unit":"ml","lot":"C","set":"January - Set 3","cost":12.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0037","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":54,"pname":"Yara Tera Kristalon 13-40-13","ai":"NPK 13-40-13","qty":1140.35,"unit":"gm","lot":"A","set":"January - Set 3","cost":13.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0038","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":54,"pname":"Yara Tera Kristalon 13-40-13","ai":"NPK 13-40-13","qty":1157.89,"unit":"gm","lot":"B","set":"January - Set 3","cost":13.66,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0039","type":"STOCK_OUT","dt":"2026-02-14T08:00:00","pid":54,"pname":"Yara Tera Kristalon 13-40-13","ai":"NPK 13-40-13","qty":701.76,"unit":"gm","lot":"C","set":"January - Set 3","cost":8.28,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Set 3"},{"uuid":"imp2026-0040","type":"STOCK_OUT","dt":"2026-02-18T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":63859.65,"unit":"gm","lot":"A","set":"January - Fert Set 2","cost":300.14,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 2"},{"uuid":"imp2026-0041","type":"STOCK_OUT","dt":"2026-02-18T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":64842.11,"unit":"gm","lot":"B","set":"January - Fert Set 2","cost":304.76,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 2"},{"uuid":"imp2026-0042","type":"STOCK_OUT","dt":"2026-02-18T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":39298.24,"unit":"gm","lot":"C","set":"January - Fert Set 2","cost":184.7,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 2"},{"uuid":"imp2026-0043","type":"STOCK_OUT","dt":"2026-02-18T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":31929.82,"unit":"gm","lot":"A","set":"January - Fert Set 2","cost":57.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 2"},{"uuid":"imp2026-0044","type":"STOCK_OUT","dt":"2026-02-18T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":32421.05,"unit":"gm","lot":"B","set":"January - Fert Set 2","cost":58.36,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 2"},{"uuid":"imp2026-0045","type":"STOCK_OUT","dt":"2026-02-18T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":19649.13,"unit":"gm","lot":"C","set":"January - Fert Set 2","cost":35.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 2"},{"uuid":"imp2026-0046","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":26,"pname":"AZ Plus","ai":"Amino acid + Zinc","qty":760.23,"unit":"gm","lot":"A","set":"Boosting (Feb) - Set 1","cost":72.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0047","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":26,"pname":"AZ Plus","ai":"Amino acid + Zinc","qty":771.93,"unit":"gm","lot":"B","set":"Boosting (Feb) - Set 1","cost":73.33,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0048","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":26,"pname":"AZ Plus","ai":"Amino acid + Zinc","qty":467.84,"unit":"gm","lot":"C","set":"Boosting (Feb) - Set 1","cost":44.44,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0049","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":27,"pname":"Brightstar PBZ","ai":"Paclobutrazol","qty":2280.7,"unit":"ml","lot":"A","set":"Boosting (Feb) - Set 1","cost":247.07,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0050","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":27,"pname":"Brightstar PBZ","ai":"Paclobutrazol","qty":2315.79,"unit":"ml","lot":"B","set":"Boosting (Feb) - Set 1","cost":250.87,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0051","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":27,"pname":"Brightstar PBZ","ai":"Paclobutrazol","qty":1403.51,"unit":"ml","lot":"C","set":"Boosting (Feb) - Set 1","cost":152.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0052","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1900.58,"unit":"gm","lot":"A","set":"Boosting (Feb) - Set 1","cost":22.81,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0053","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1929.82,"unit":"gm","lot":"B","set":"Boosting (Feb) - Set 1","cost":23.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0054","type":"STOCK_OUT","dt":"2026-02-28T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1169.6,"unit":"gm","lot":"C","set":"Boosting (Feb) - Set 1","cost":14.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Boosting|Set 1"},{"uuid":"imp2026-0055","type":"STOCK_OUT","dt":"2026-03-03T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":95789.47,"unit":"gm","lot":"A","set":"January - Fert Set 3","cost":450.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 3"},{"uuid":"imp2026-0056","type":"STOCK_OUT","dt":"2026-03-03T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":97263.16,"unit":"gm","lot":"B","set":"January - Fert Set 3","cost":457.14,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 3"},{"uuid":"imp2026-0057","type":"STOCK_OUT","dt":"2026-03-03T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":58947.37,"unit":"gm","lot":"C","set":"January - Fert Set 3","cost":277.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"2026 Jan (2)|Fert Set 3"},{"uuid":"imp2026-0058","type":"STOCK_OUT","dt":"2026-03-06T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":63859.65,"unit":"gm","lot":"A","set":"March - Fert Set 1","cost":300.14,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 1"},{"uuid":"imp2026-0059","type":"STOCK_OUT","dt":"2026-03-06T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":64842.11,"unit":"gm","lot":"B","set":"March - Fert Set 1","cost":304.76,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 1"},{"uuid":"imp2026-0060","type":"STOCK_OUT","dt":"2026-03-06T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":39298.24,"unit":"gm","lot":"C","set":"March - Fert Set 1","cost":184.7,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 1"},{"uuid":"imp2026-0061","type":"STOCK_OUT","dt":"2026-03-06T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":31929.82,"unit":"gm","lot":"A","set":"March - Fert Set 1","cost":57.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 1"},{"uuid":"imp2026-0062","type":"STOCK_OUT","dt":"2026-03-06T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":32421.05,"unit":"gm","lot":"B","set":"March - Fert Set 1","cost":58.36,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 1"},{"uuid":"imp2026-0063","type":"STOCK_OUT","dt":"2026-03-06T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":19649.13,"unit":"gm","lot":"C","set":"March - Fert Set 1","cost":35.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 1"},{"uuid":"imp2026-0064","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":1,"pname":"Amotan 22.8SC","ai":"Azoxystrobin","qty":570.18,"unit":"ml","lot":"A","set":"March - Set 1","cost":119.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0065","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":1,"pname":"Amotan 22.8SC","ai":"Azoxystrobin","qty":578.95,"unit":"ml","lot":"B","set":"March - Set 1","cost":121.58,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0066","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":1,"pname":"Amotan 22.8SC","ai":"Azoxystrobin","qty":350.87,"unit":"ml","lot":"C","set":"March - Set 1","cost":73.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0067","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1140.35,"unit":"ml","lot":"A","set":"March - Set 1","cost":20.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0068","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1157.89,"unit":"ml","lot":"B","set":"March - Set 1","cost":20.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0069","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":701.76,"unit":"ml","lot":"C","set":"March - Set 1","cost":12.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0070","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":1140.35,"unit":"ml","lot":"A","set":"March - Set 1","cost":79.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0071","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":1157.89,"unit":"ml","lot":"B","set":"March - Set 1","cost":81.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0072","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":701.76,"unit":"ml","lot":"C","set":"March - Set 1","cost":49.12,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0073","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":2850.88,"unit":"gm","lot":"A","set":"March - Set 1","cost":34.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0074","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":2894.74,"unit":"gm","lot":"B","set":"March - Set 1","cost":34.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0075","type":"STOCK_OUT","dt":"2026-03-14T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1754.38,"unit":"gm","lot":"C","set":"March - Set 1","cost":21.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 1"},{"uuid":"imp2026-0076","type":"STOCK_OUT","dt":"2026-03-22T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":95789.47,"unit":"gm","lot":"A","set":"March - Fert Set 2","cost":450.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 2"},{"uuid":"imp2026-0077","type":"STOCK_OUT","dt":"2026-03-22T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":97263.16,"unit":"gm","lot":"B","set":"March - Fert Set 2","cost":457.14,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 2"},{"uuid":"imp2026-0078","type":"STOCK_OUT","dt":"2026-03-22T08:00:00","pid":36,"pname":"Garsoni 8-24-24","ai":"NPK 8-24-24","qty":58947.37,"unit":"gm","lot":"C","set":"March - Fert Set 2","cost":277.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Fert Set 2"},{"uuid":"imp2026-0079","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1140.35,"unit":"ml","lot":"A","set":"March - Set 2","cost":51.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0080","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1157.89,"unit":"ml","lot":"B","set":"March - Set 2","cost":52.11,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0081","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":701.76,"unit":"ml","lot":"C","set":"March - Set 2","cost":31.58,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0082","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":2280.7,"unit":"gm","lot":"A","set":"March - Set 2","cost":27.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0083","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":2315.79,"unit":"gm","lot":"B","set":"March - Set 2","cost":27.79,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0084","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1403.51,"unit":"gm","lot":"C","set":"March - Set 2","cost":16.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0085","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":570.18,"unit":"ml","lot":"A","set":"March - Set 2","cost":50.18,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0086","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":578.95,"unit":"ml","lot":"B","set":"March - Set 2","cost":50.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0087","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":350.87,"unit":"ml","lot":"C","set":"March - Set 2","cost":30.88,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0088","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":6,"pname":"Mancozeb (Raincozeb 80WB)","ai":"Mancozeb 80%","qty":570.18,"unit":"gm","lot":"A","set":"March - Set 2","cost":14.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0089","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":6,"pname":"Mancozeb (Raincozeb 80WB)","ai":"Mancozeb 80%","qty":578.95,"unit":"gm","lot":"B","set":"March - Set 2","cost":14.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0090","type":"STOCK_OUT","dt":"2026-03-23T08:00:00","pid":6,"pname":"Mancozeb (Raincozeb 80WB)","ai":"Mancozeb 80%","qty":350.87,"unit":"gm","lot":"C","set":"March - Set 2","cost":8.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 2"},{"uuid":"imp2026-0091","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":8,"pname":"Agus 24SC","ai":"Diafenthiuron","qty":570.18,"unit":"ml","lot":"A","set":"March - Set 3","cost":96.93,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0092","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":8,"pname":"Agus 24SC","ai":"Diafenthiuron","qty":578.95,"unit":"ml","lot":"B","set":"March - Set 3","cost":98.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0093","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":8,"pname":"Agus 24SC","ai":"Diafenthiuron","qty":350.87,"unit":"ml","lot":"C","set":"March - Set 3","cost":59.65,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0094","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":570.18,"unit":"ml","lot":"A","set":"March - Set 3","cost":88.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0095","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":578.95,"unit":"ml","lot":"B","set":"March - Set 3","cost":90.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0096","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":350.87,"unit":"ml","lot":"C","set":"March - Set 3","cost":54.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0097","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1140.35,"unit":"ml","lot":"A","set":"March - Set 3","cost":20.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0098","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":1157.89,"unit":"ml","lot":"B","set":"March - Set 3","cost":20.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0099","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":2,"pname":"Cypermethrin 5.5 (Kencis)","ai":"Cypermethrin 5.5%","qty":701.76,"unit":"ml","lot":"C","set":"March - Set 3","cost":12.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0100","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":2280.7,"unit":"gm","lot":"A","set":"March - Set 3","cost":27.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0101","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":2315.79,"unit":"gm","lot":"B","set":"March - Set 3","cost":27.79,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0102","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1403.51,"unit":"gm","lot":"C","set":"March - Set 3","cost":16.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0103","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":52,"pname":"Zinc (powder)","ai":"Zinc sulphate","qty":570.18,"unit":"gm","lot":"A","set":"March - Set 3","cost":0.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0104","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":52,"pname":"Zinc (powder)","ai":"Zinc sulphate","qty":578.95,"unit":"gm","lot":"B","set":"March - Set 3","cost":0.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0105","type":"STOCK_OUT","dt":"2026-03-28T08:00:00","pid":52,"pname":"Zinc (powder)","ai":"Zinc sulphate","qty":350.87,"unit":"gm","lot":"C","set":"March - Set 3","cost":0.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"March|Set 3"},{"uuid":"imp2026-0106","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 1","cost":53.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0107","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 1","cost":54.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0108","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 1","cost":32.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0109","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":380.12,"unit":"ml","lot":"A","set":"April - Set 1","cost":59.3,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0110","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":385.96,"unit":"ml","lot":"B","set":"April - Set 1","cost":60.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0111","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":233.92,"unit":"ml","lot":"C","set":"April - Set 1","cost":36.49,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0112","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 1","cost":53.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0113","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 1","cost":54.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0114","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 1","cost":32.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0115","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 1","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0116","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 1","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0117","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 1","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0118","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1140.35,"unit":"gm","lot":"A","set":"April - Set 1","cost":13.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0119","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1157.89,"unit":"gm","lot":"B","set":"April - Set 1","cost":13.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0120","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":701.76,"unit":"gm","lot":"C","set":"April - Set 1","cost":8.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0121","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 1","cost":40.54,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0122","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 1","cost":41.17,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0123","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 1","cost":24.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0124","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 1","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0125","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 1","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0126","type":"STOCK_OUT","dt":"2026-04-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 1","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 1"},{"uuid":"imp2026-0127","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 2","cost":53.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0128","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 2","cost":54.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0129","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 2","cost":32.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0130","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":380.12,"unit":"ml","lot":"A","set":"April - Set 2","cost":59.3,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0131","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":385.96,"unit":"ml","lot":"B","set":"April - Set 2","cost":60.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0132","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":233.92,"unit":"ml","lot":"C","set":"April - Set 2","cost":36.49,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0133","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 2","cost":53.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0134","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 2","cost":54.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0135","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":3,"pname":"Fipronil (Rainnil)","ai":"Fipronil","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 2","cost":32.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0136","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 2","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0137","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 2","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0138","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 2","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0139","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1140.35,"unit":"gm","lot":"A","set":"April - Set 2","cost":13.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0140","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1157.89,"unit":"gm","lot":"B","set":"April - Set 2","cost":13.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0141","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":701.76,"unit":"gm","lot":"C","set":"April - Set 2","cost":8.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0142","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 2","cost":40.54,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0143","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 2","cost":41.17,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0144","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 2","cost":24.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0145","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"April - Set 2","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0146","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"April - Set 2","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0147","type":"STOCK_OUT","dt":"2026-04-17T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"April - Set 2","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 2"},{"uuid":"imp2026-0148","type":"STOCK_OUT","dt":"2026-04-19T08:00:00","pid":38,"pname":"Nutrigem","ai":"NPK compound (Nutrigem)","qty":638596.49,"unit":"gm","lot":"A","set":"April - Fert Set 1","cost":552.39,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Fert Set 1"},{"uuid":"imp2026-0149","type":"STOCK_OUT","dt":"2026-04-19T08:00:00","pid":38,"pname":"Nutrigem","ai":"NPK compound (Nutrigem)","qty":648421.05,"unit":"gm","lot":"B","set":"April - Fert Set 1","cost":560.88,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Fert Set 1"},{"uuid":"imp2026-0150","type":"STOCK_OUT","dt":"2026-04-19T08:00:00","pid":38,"pname":"Nutrigem","ai":"NPK compound (Nutrigem)","qty":392982.46,"unit":"gm","lot":"C","set":"April - Fert Set 1","cost":339.93,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Fert Set 1"},{"uuid":"imp2026-0151","type":"STOCK_OUT","dt":"2026-04-19T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":63859.65,"unit":"gm","lot":"A","set":"April - Fert Set 1","cost":229.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Fert Set 1"},{"uuid":"imp2026-0152","type":"STOCK_OUT","dt":"2026-04-19T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":64842.11,"unit":"gm","lot":"B","set":"April - Fert Set 1","cost":233.43,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Fert Set 1"},{"uuid":"imp2026-0153","type":"STOCK_OUT","dt":"2026-04-19T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":39298.24,"unit":"gm","lot":"C","set":"April - Fert Set 1","cost":141.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Fert Set 1"},{"uuid":"imp2026-0154","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":1140.35,"unit":"ml","lot":"A","set":"April - Set 3","cost":79.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0155","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":1157.89,"unit":"ml","lot":"B","set":"April - Set 3","cost":81.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0156","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":701.76,"unit":"ml","lot":"C","set":"April - Set 3","cost":49.12,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0157","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":48,"pname":"Ardel","ai":"(confirm — see label)","qty":1140.35,"unit":"ml","lot":"A","set":"April - Set 3","cost":0.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0158","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":48,"pname":"Ardel","ai":"(confirm — see label)","qty":1157.89,"unit":"ml","lot":"B","set":"April - Set 3","cost":0.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0159","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":48,"pname":"Ardel","ai":"(confirm — see label)","qty":701.76,"unit":"ml","lot":"C","set":"April - Set 3","cost":0.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0160","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":570.18,"unit":"ml","lot":"A","set":"April - Set 3","cost":88.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0161","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":578.95,"unit":"ml","lot":"B","set":"April - Set 3","cost":90.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0162","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":350.87,"unit":"ml","lot":"C","set":"April - Set 3","cost":54.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0163","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":28,"pname":"GA3 (Gibberlic Acid)","ai":"Gibberellic acid (GA3)","qty":15,"unit":"tablets","lot":"","set":"April - Set 3","cost":142.5,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0164","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":1140.35,"unit":"ml","lot":"A","set":"April - Set 3","cost":60.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0165","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":1157.89,"unit":"ml","lot":"B","set":"April - Set 3","cost":61.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0166","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":701.76,"unit":"ml","lot":"C","set":"April - Set 3","cost":37.43,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0167","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":2850.88,"unit":"gm","lot":"A","set":"April - Set 3","cost":10.26,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0168","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":2894.74,"unit":"gm","lot":"B","set":"April - Set 3","cost":10.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0169","type":"STOCK_OUT","dt":"2026-04-22T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":1754.38,"unit":"gm","lot":"C","set":"April - Set 3","cost":6.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"April|Set 3"},{"uuid":"imp2026-0170","type":"STOCK_OUT","dt":"2026-04-30T08:00:00","pid":28,"pname":"GA3 (Gibberlic Acid)","ai":"Gibberellic acid (GA3)","qty":15,"unit":"tablets","lot":"","set":"May - Set 1","cost":142.5,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 1"},{"uuid":"imp2026-0171","type":"STOCK_OUT","dt":"2026-04-30T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":1140.35,"unit":"ml","lot":"A","set":"May - Set 1","cost":60.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 1"},{"uuid":"imp2026-0172","type":"STOCK_OUT","dt":"2026-04-30T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":1157.89,"unit":"ml","lot":"B","set":"May - Set 1","cost":61.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 1"},{"uuid":"imp2026-0173","type":"STOCK_OUT","dt":"2026-04-30T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":701.76,"unit":"ml","lot":"C","set":"May - Set 1","cost":37.43,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 1"},{"uuid":"imp2026-0174","type":"STOCK_OUT","dt":"2026-04-30T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":1140.35,"unit":"gm","lot":"A","set":"May - Set 1","cost":4.11,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 1"},{"uuid":"imp2026-0175","type":"STOCK_OUT","dt":"2026-04-30T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":1157.89,"unit":"gm","lot":"B","set":"May - Set 1","cost":4.17,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 1"},{"uuid":"imp2026-0176","type":"STOCK_OUT","dt":"2026-04-30T08:00:00","pid":43,"pname":"Yara Calcinit (CN)","ai":"Calcium nitrate 15.5-0-0","qty":701.76,"unit":"gm","lot":"C","set":"May - Set 1","cost":2.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 1"},{"uuid":"imp2026-0177","type":"STOCK_OUT","dt":"2026-05-05T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":31929.82,"unit":"gm","lot":"A","set":"May - Fert Set 1","cost":383.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Fert Set 1"},{"uuid":"imp2026-0178","type":"STOCK_OUT","dt":"2026-05-05T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":32421.05,"unit":"gm","lot":"B","set":"May - Fert Set 1","cost":389.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Fert Set 1"},{"uuid":"imp2026-0179","type":"STOCK_OUT","dt":"2026-05-05T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":19649.13,"unit":"gm","lot":"C","set":"May - Fert Set 1","cost":235.79,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Fert Set 1"},{"uuid":"imp2026-0180","type":"STOCK_OUT","dt":"2026-05-05T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":31929.82,"unit":"gm","lot":"A","set":"May - Fert Set 1","cost":57.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Fert Set 1"},{"uuid":"imp2026-0181","type":"STOCK_OUT","dt":"2026-05-05T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":32421.05,"unit":"gm","lot":"B","set":"May - Fert Set 1","cost":58.36,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Fert Set 1"},{"uuid":"imp2026-0182","type":"STOCK_OUT","dt":"2026-05-05T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":19649.13,"unit":"gm","lot":"C","set":"May - Fert Set 1","cost":35.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Fert Set 1"},{"uuid":"imp2026-0183","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":570.18,"unit":"ml","lot":"A","set":"May - Set 2","cost":88.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0184","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":578.95,"unit":"ml","lot":"B","set":"May - Set 2","cost":90.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0185","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":350.87,"unit":"ml","lot":"C","set":"May - Set 2","cost":54.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0186","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":1140.35,"unit":"ml","lot":"A","set":"May - Set 2","cost":94.08,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0187","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":1157.89,"unit":"ml","lot":"B","set":"May - Set 2","cost":95.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0188","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":701.76,"unit":"ml","lot":"C","set":"May - Set 2","cost":57.9,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0189","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":2280.7,"unit":"gm","lot":"A","set":"May - Set 2","cost":27.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0190","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":2315.79,"unit":"gm","lot":"B","set":"May - Set 2","cost":27.79,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0191","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1403.51,"unit":"gm","lot":"C","set":"May - Set 2","cost":16.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0192","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":1140.35,"unit":"ml","lot":"A","set":"May - Set 2","cost":100.35,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0193","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":1157.89,"unit":"ml","lot":"B","set":"May - Set 2","cost":101.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0194","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":4,"pname":"Madell","ai":"Carbosulfan","qty":701.76,"unit":"ml","lot":"C","set":"May - Set 2","cost":61.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0195","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":1140.35,"unit":"ml","lot":"A","set":"May - Set 2","cost":60.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0196","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":1157.89,"unit":"ml","lot":"B","set":"May - Set 2","cost":61.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0197","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":17,"pname":"Vitanica","ai":"Seaweed / amino acid complex","qty":701.76,"unit":"ml","lot":"C","set":"May - Set 2","cost":37.43,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0198","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":1140.35,"unit":"ml","lot":"A","set":"May - Set 2","cost":69.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0199","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":1157.89,"unit":"ml","lot":"B","set":"May - Set 2","cost":70.43,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0200","type":"STOCK_OUT","dt":"2026-05-09T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":701.76,"unit":"ml","lot":"C","set":"May - Set 2","cost":42.69,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May|Set 2"},{"uuid":"imp2026-0201","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":570.18,"unit":"ml","lot":"A","set":"May 2 - Set 1 (flower only)","cost":48.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0202","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":578.95,"unit":"ml","lot":"B","set":"May 2 - Set 1 (flower only)","cost":49.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0203","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":350.87,"unit":"ml","lot":"C","set":"May 2 - Set 1 (flower only)","cost":29.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0204","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":19,"pname":"Calcifol","ai":"Calcium + Boron (foliar)","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 1 (flower only)","cost":52.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0205","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":19,"pname":"Calcifol","ai":"Calcium + Boron (foliar)","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 1 (flower only)","cost":53.26,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0206","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":19,"pname":"Calcifol","ai":"Calcium + Boron (foliar)","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 1 (flower only)","cost":32.28,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0207","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":285.09,"unit":"ml","lot":"A","set":"May 2 - Set 1 (flower only)","cost":21.38,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0208","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":289.47,"unit":"ml","lot":"B","set":"May 2 - Set 1 (flower only)","cost":21.71,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0209","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":175.44,"unit":"ml","lot":"C","set":"May 2 - Set 1 (flower only)","cost":13.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0210","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1140.35,"unit":"gm","lot":"A","set":"May 2 - Set 1 (flower only)","cost":13.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0211","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1157.89,"unit":"gm","lot":"B","set":"May 2 - Set 1 (flower only)","cost":13.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0212","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":701.76,"unit":"gm","lot":"C","set":"May 2 - Set 1 (flower only)","cost":8.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0213","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 1 (flower only)","cost":47.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0214","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 1 (flower only)","cost":48.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0215","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 1 (flower only)","cost":29.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0216","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":285.09,"unit":"ml","lot":"A","set":"May 2 - Set 1 (flower only)","cost":24.23,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0217","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":289.47,"unit":"ml","lot":"B","set":"May 2 - Set 1 (flower only)","cost":24.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0218","type":"STOCK_OUT","dt":"2026-05-14T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":175.44,"unit":"ml","lot":"C","set":"May 2 - Set 1 (flower only)","cost":14.91,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 1"},{"uuid":"imp2026-0219","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 2 (outside leaf)","cost":80.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0220","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 2 (outside leaf)","cost":82.01,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0221","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 2 (outside leaf)","cost":49.71,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0222","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 2 (outside leaf)","cost":47.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0223","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 2 (outside leaf)","cost":48.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0224","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 2 (outside leaf)","cost":29.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0225","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 2 (outside leaf)","cost":96.93,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0226","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 2 (outside leaf)","cost":98.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0227","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 2 (outside leaf)","cost":59.65,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0228","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":2850.88,"unit":"gm","lot":"A","set":"May 2 - Set 2 (outside leaf)","cost":34.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0229","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":2894.74,"unit":"gm","lot":"B","set":"May 2 - Set 2 (outside leaf)","cost":34.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0230","type":"STOCK_OUT","dt":"2026-05-15T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1754.38,"unit":"gm","lot":"C","set":"May 2 - Set 2 (outside leaf)","cost":21.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 2"},{"uuid":"imp2026-0231","type":"STOCK_OUT","dt":"2026-05-20T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":31929.82,"unit":"gm","lot":"A","set":"May 2 - Fert Set 1","cost":383.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Fert Set 1"},{"uuid":"imp2026-0232","type":"STOCK_OUT","dt":"2026-05-20T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":32421.05,"unit":"gm","lot":"B","set":"May 2 - Fert Set 1","cost":389.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Fert Set 1"},{"uuid":"imp2026-0233","type":"STOCK_OUT","dt":"2026-05-20T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":19649.13,"unit":"gm","lot":"C","set":"May 2 - Fert Set 1","cost":235.79,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Fert Set 1"},{"uuid":"imp2026-0234","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd1","cost":79.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0235","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd1","cost":81.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0236","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd1","cost":49.12,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0237","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd1","cost":51.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0238","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd1","cost":52.11,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0239","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd1","cost":31.58,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0240","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":570.18,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd1","cost":48.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0241","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":578.95,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd1","cost":49.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0242","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":350.87,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd1","cost":29.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0243","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":285.09,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd1","cost":21.38,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0244","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":289.47,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd1","cost":21.71,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0245","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":175.44,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd1","cost":13.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0246","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd1","cost":94.08,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0247","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd1","cost":95.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0248","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd1","cost":57.9,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0249","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd1","cost":69.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0250","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd1","cost":70.43,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0251","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd1","cost":42.69,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0252","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1140.35,"unit":"gm","lot":"A","set":"May 2 - Set 3 (flower) rnd1","cost":13.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0253","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1157.89,"unit":"gm","lot":"B","set":"May 2 - Set 3 (flower) rnd1","cost":13.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0254","type":"STOCK_OUT","dt":"2026-05-21T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":701.76,"unit":"gm","lot":"C","set":"May 2 - Set 3 (flower) rnd1","cost":8.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0255","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd2","cost":79.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0256","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd2","cost":81.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0257","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd2","cost":49.12,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0258","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd2","cost":51.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0259","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd2","cost":52.11,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0260","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":5,"pname":"Abamectin (Envoy)","ai":"Abamectin","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd2","cost":31.58,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0261","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":570.18,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd2","cost":48.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0262","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":578.95,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd2","cost":49.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0263","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":350.87,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd2","cost":29.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0264","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":285.09,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd2","cost":21.38,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0265","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":289.47,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd2","cost":21.71,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0266","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":175.44,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd2","cost":13.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0267","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd2","cost":94.08,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0268","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd2","cost":95.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0269","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd2","cost":57.9,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0270","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":1140.35,"unit":"ml","lot":"A","set":"May 2 - Set 3 (flower) rnd2","cost":69.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0271","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":1157.89,"unit":"ml","lot":"B","set":"May 2 - Set 3 (flower) rnd2","cost":70.43,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0272","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":701.76,"unit":"ml","lot":"C","set":"May 2 - Set 3 (flower) rnd2","cost":42.69,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0273","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1140.35,"unit":"gm","lot":"A","set":"May 2 - Set 3 (flower) rnd2","cost":13.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0274","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1157.89,"unit":"gm","lot":"B","set":"May 2 - Set 3 (flower) rnd2","cost":13.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0275","type":"STOCK_OUT","dt":"2026-05-28T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":701.76,"unit":"gm","lot":"C","set":"May 2 - Set 3 (flower) rnd2","cost":8.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"May 2|Set 3"},{"uuid":"imp2026-0276","type":"STOCK_OUT","dt":"2026-06-04T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":31929.82,"unit":"gm","lot":"A","set":"June - Fert Set 1","cost":383.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 1"},{"uuid":"imp2026-0277","type":"STOCK_OUT","dt":"2026-06-04T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":32421.05,"unit":"gm","lot":"B","set":"June - Fert Set 1","cost":389.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 1"},{"uuid":"imp2026-0278","type":"STOCK_OUT","dt":"2026-06-04T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":19649.13,"unit":"gm","lot":"C","set":"June - Fert Set 1","cost":235.79,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 1"},{"uuid":"imp2026-0279","type":"STOCK_OUT","dt":"2026-06-04T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":31929.82,"unit":"gm","lot":"A","set":"June - Fert Set 1","cost":57.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 1"},{"uuid":"imp2026-0280","type":"STOCK_OUT","dt":"2026-06-04T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":32421.05,"unit":"gm","lot":"B","set":"June - Fert Set 1","cost":58.36,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 1"},{"uuid":"imp2026-0281","type":"STOCK_OUT","dt":"2026-06-04T08:00:00","pid":37,"pname":"Polysulphate","ai":"Polyhalite (K, Ca, Mg, S)","qty":19649.13,"unit":"gm","lot":"C","set":"June - Fert Set 1","cost":35.37,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 1"},{"uuid":"imp2026-0282","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":570.18,"unit":"ml","lot":"A","set":"June - Set 1 (outside leaf)","cost":88.95,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0283","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":578.95,"unit":"ml","lot":"B","set":"June - Set 1 (outside leaf)","cost":90.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0284","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":7,"pname":"Arimo 23EC","ai":"Difenoconazole","qty":350.87,"unit":"ml","lot":"C","set":"June - Set 1 (outside leaf)","cost":54.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0285","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":1140.35,"unit":"ml","lot":"A","set":"June - Set 1 (outside leaf)","cost":47.89,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0286","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":1157.89,"unit":"ml","lot":"B","set":"June - Set 1 (outside leaf)","cost":48.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0287","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":20,"pname":"Heromix T1","ai":"Foliar nutrient mix (T1)","qty":701.76,"unit":"ml","lot":"C","set":"June - Set 1 (outside leaf)","cost":29.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0288","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":49,"pname":"Pengasus 47.17sc","ai":"Diafenthiuron","qty":570.18,"unit":"ml","lot":"A","set":"June - Set 1 (outside leaf)","cost":85.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0289","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":49,"pname":"Pengasus 47.17sc","ai":"Diafenthiuron","qty":578.95,"unit":"ml","lot":"B","set":"June - Set 1 (outside leaf)","cost":86.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0290","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":49,"pname":"Pengasus 47.17sc","ai":"Diafenthiuron","qty":350.87,"unit":"ml","lot":"C","set":"June - Set 1 (outside leaf)","cost":52.63,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0291","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":42,"pname":"Raizon Max","ai":"Rooting / humic complex","qty":570.18,"unit":"ml","lot":"A","set":"June - Set 1 (outside leaf)","cost":48.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0292","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":42,"pname":"Raizon Max","ai":"Rooting / humic complex","qty":578.95,"unit":"ml","lot":"B","set":"June - Set 1 (outside leaf)","cost":49.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0293","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":42,"pname":"Raizon Max","ai":"Rooting / humic complex","qty":350.87,"unit":"ml","lot":"C","set":"June - Set 1 (outside leaf)","cost":29.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0294","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":1140.35,"unit":"ml","lot":"A","set":"June - Set 1 (outside leaf)","cost":96.93,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0295","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":1157.89,"unit":"ml","lot":"B","set":"June - Set 1 (outside leaf)","cost":98.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0296","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":701.76,"unit":"ml","lot":"C","set":"June - Set 1 (outside leaf)","cost":59.65,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0297","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":2850.88,"unit":"gm","lot":"A","set":"June - Set 1 (outside leaf)","cost":34.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0298","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":2894.74,"unit":"gm","lot":"B","set":"June - Set 1 (outside leaf)","cost":34.74,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0299","type":"STOCK_OUT","dt":"2026-06-05T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1754.38,"unit":"gm","lot":"C","set":"June - Set 1 (outside leaf)","cost":21.05,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 1"},{"uuid":"imp2026-0300","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":53.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0301","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":54.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0302","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":32.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0303","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":380.12,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":32.31,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0304","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":385.96,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":32.81,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0305","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":233.92,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":19.88,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0306","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":50,"pname":"Azatin","ai":"Azadirachtin","qty":380.12,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":64.62,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0307","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":50,"pname":"Azatin","ai":"Azadirachtin","qty":385.96,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":65.61,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0308","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":50,"pname":"Azatin","ai":"Azadirachtin","qty":233.92,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":39.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0309","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":53.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0310","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":54.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0311","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":33.14,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0312","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":190.06,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":14.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0313","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":192.98,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":14.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0314","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":116.96,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":8.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0315","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0316","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0317","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0318","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":760.23,"unit":"gm","lot":"A","set":"June - Set 2 (branches+fruit)","cost":9.12,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0319","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":771.93,"unit":"gm","lot":"B","set":"June - Set 2 (branches+fruit)","cost":9.26,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0320","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":467.84,"unit":"gm","lot":"C","set":"June - Set 2 (branches+fruit)","cost":5.61,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0321","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":51,"pname":"Match","ai":"Lufenuron 50 g/L","qty":380.12,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":98.83,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0322","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":51,"pname":"Match","ai":"Lufenuron 50 g/L","qty":385.96,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":100.35,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0323","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":51,"pname":"Match","ai":"Lufenuron 50 g/L","qty":233.92,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":60.82,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0324","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 2 (branches+fruit)","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0325","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 2 (branches+fruit)","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0326","type":"STOCK_OUT","dt":"2026-06-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 2 (branches+fruit)","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 2"},{"uuid":"imp2026-0327","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 3","cost":53.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0328","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 3","cost":54.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0329","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 3","cost":32.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0330","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":380.12,"unit":"ml","lot":"A","set":"June - Set 3","cost":32.31,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0331","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":385.96,"unit":"ml","lot":"B","set":"June - Set 3","cost":32.81,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0332","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":21,"pname":"Auxi-Pro","ai":"Auxin (plant hormone)","qty":233.92,"unit":"ml","lot":"C","set":"June - Set 3","cost":19.88,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0333","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 3","cost":53.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0334","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 3","cost":54.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0335","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 3","cost":33.14,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0336","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":190.06,"unit":"ml","lot":"A","set":"June - Set 3","cost":14.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0337","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":192.98,"unit":"ml","lot":"B","set":"June - Set 3","cost":14.47,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0338","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":22,"pname":"Cyto-Plus","ai":"Cytokinin (plant hormone)","qty":116.96,"unit":"ml","lot":"C","set":"June - Set 3","cost":8.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0339","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":380.12,"unit":"ml","lot":"A","set":"June - Set 3","cost":121.64,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0340","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":385.96,"unit":"ml","lot":"B","set":"June - Set 3","cost":123.51,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0341","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":233.92,"unit":"ml","lot":"C","set":"June - Set 3","cost":74.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0342","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 3","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0343","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 3","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0344","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 3","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0345","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":760.23,"unit":"gm","lot":"A","set":"June - Set 3","cost":9.12,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0346","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":771.93,"unit":"gm","lot":"B","set":"June - Set 3","cost":9.26,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0347","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":467.84,"unit":"gm","lot":"C","set":"June - Set 3","cost":5.61,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0348","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":45,"pname":"Pictor","ai":"Boscalid + Dimoxystrobin · fruit-contact, 14-day PHI","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 3","cost":49.41,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0349","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":45,"pname":"Pictor","ai":"Boscalid + Dimoxystrobin · fruit-contact, 14-day PHI","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 3","cost":50.18,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0350","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":45,"pname":"Pictor","ai":"Boscalid + Dimoxystrobin · fruit-contact, 14-day PHI","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 3","cost":30.41,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0351","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"June - Set 3","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0352","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"June - Set 3","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0353","type":"STOCK_OUT","dt":"2026-06-17T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"June - Set 3","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Set 3"},{"uuid":"imp2026-0354","type":"STOCK_OUT","dt":"2026-06-18T08:00:00","pid":53,"pname":"Yara Rega 13-4-25","ai":"NPK 13-4-25","qty":63859.65,"unit":"gm","lot":"A","set":"June - Fert Set 2","cost":728.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 2"},{"uuid":"imp2026-0355","type":"STOCK_OUT","dt":"2026-06-18T08:00:00","pid":53,"pname":"Yara Rega 13-4-25","ai":"NPK 13-4-25","qty":64842.11,"unit":"gm","lot":"B","set":"June - Fert Set 2","cost":739.2,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 2"},{"uuid":"imp2026-0356","type":"STOCK_OUT","dt":"2026-06-18T08:00:00","pid":53,"pname":"Yara Rega 13-4-25","ai":"NPK 13-4-25","qty":39298.24,"unit":"gm","lot":"C","set":"June - Fert Set 2","cost":448.0,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June|Fert Set 2"},{"uuid":"imp2026-0357","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":3801.17,"unit":"ml","lot":"A","set":"June 2 - Set 1 (soil drench)","cost":155.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0358","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":3859.65,"unit":"ml","lot":"B","set":"June 2 - Set 1 (soil drench)","cost":158.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0359","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":2339.18,"unit":"ml","lot":"C","set":"June 2 - Set 1 (soil drench)","cost":95.91,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0360","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"June 2 - Set 1 (soil drench)","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0361","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"June 2 - Set 1 (soil drench)","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0362","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"June 2 - Set 1 (soil drench)","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0363","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":3801.17,"unit":"gm","lot":"A","set":"June 2 - Set 1 (soil drench)","cost":45.61,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0364","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":3859.65,"unit":"gm","lot":"B","set":"June 2 - Set 1 (soil drench)","cost":46.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0365","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":2339.18,"unit":"gm","lot":"C","set":"June 2 - Set 1 (soil drench)","cost":28.07,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0366","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"June 2 - Set 1 (soil drench)","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0367","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"June 2 - Set 1 (soil drench)","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0368","type":"STOCK_OUT","dt":"2026-06-20T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"June 2 - Set 1 (soil drench)","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 1"},{"uuid":"imp2026-0369","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":760.23,"unit":"ml","lot":"A","set":"June 2 - Set 2 (spray inside)","cost":53.22,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0370","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":771.93,"unit":"ml","lot":"B","set":"June 2 - Set 2 (spray inside)","cost":54.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0371","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":14,"pname":"A Zinc Mix","ai":"Zinc mix","qty":467.84,"unit":"ml","lot":"C","set":"June 2 - Set 2 (spray inside)","cost":32.75,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0372","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":380.12,"unit":"ml","lot":"A","set":"June 2 - Set 2 (spray inside)","cost":121.64,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0373","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":385.96,"unit":"ml","lot":"B","set":"June 2 - Set 2 (spray inside)","cost":123.51,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0374","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":233.92,"unit":"ml","lot":"C","set":"June 2 - Set 2 (spray inside)","cost":74.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0375","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"June 2 - Set 2 (spray inside)","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0376","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"June 2 - Set 2 (spray inside)","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0377","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"June 2 - Set 2 (spray inside)","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0378","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1520.47,"unit":"gm","lot":"A","set":"June 2 - Set 2 (spray inside)","cost":18.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0379","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":1543.86,"unit":"gm","lot":"B","set":"June 2 - Set 2 (spray inside)","cost":18.53,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0380","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":39,"pname":"Herocris Nexus 5-25-25-2MGO","ai":"NPK 5-25-25 + 2MgO","qty":935.67,"unit":"gm","lot":"C","set":"June 2 - Set 2 (spray inside)","cost":11.23,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0381","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":46,"pname":"Marshal 20SC","ai":"Carbosulfan 20%","qty":760.23,"unit":"ml","lot":"A","set":"June 2 - Set 2 (spray inside)","cost":49.41,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0382","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":46,"pname":"Marshal 20SC","ai":"Carbosulfan 20%","qty":771.93,"unit":"ml","lot":"B","set":"June 2 - Set 2 (spray inside)","cost":50.18,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0383","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":46,"pname":"Marshal 20SC","ai":"Carbosulfan 20%","qty":467.84,"unit":"ml","lot":"C","set":"June 2 - Set 2 (spray inside)","cost":30.41,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0384","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":41,"pname":"Plantara","ai":"Brassinosteroid (BR)","qty":380.12,"unit":"ml","lot":"A","set":"June 2 - Set 2 (spray inside)","cost":32.31,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0385","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":41,"pname":"Plantara","ai":"Brassinosteroid (BR)","qty":385.96,"unit":"ml","lot":"B","set":"June 2 - Set 2 (spray inside)","cost":32.81,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0386","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":41,"pname":"Plantara","ai":"Brassinosteroid (BR)","qty":233.92,"unit":"ml","lot":"C","set":"June 2 - Set 2 (spray inside)","cost":19.88,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0387","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"June 2 - Set 2 (spray inside)","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0388","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"June 2 - Set 2 (spray inside)","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0389","type":"STOCK_OUT","dt":"2026-06-29T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"June 2 - Set 2 (spray inside)","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"June 2|Set 2"},{"uuid":"imp2026-0390","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":3801.17,"unit":"ml","lot":"A","set":"July - Set 2","cost":155.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0391","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":3859.65,"unit":"ml","lot":"B","set":"July - Set 2","cost":158.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0392","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":2339.18,"unit":"ml","lot":"C","set":"July - Set 2","cost":95.91,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0393","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 2","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0394","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 2","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0395","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 2","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0396","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":3801.17,"unit":"gm","lot":"A","set":"July - Set 2","cost":40.39,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0397","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":3859.65,"unit":"gm","lot":"B","set":"July - Set 2","cost":41.01,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0398","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":2339.18,"unit":"gm","lot":"C","set":"July - Set 2","cost":24.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0399","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 2","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0400","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 2","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0401","type":"STOCK_OUT","dt":"2026-07-10T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 2","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 2"},{"uuid":"imp2026-0402","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 3","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0403","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 3","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0404","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 3","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0405","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":24,"pname":"Sorbix","ai":"Sorbitol carrier + Boron","qty":570.18,"unit":"ml","lot":"A","set":"July - Set 3","cost":42.76,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0406","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":24,"pname":"Sorbix","ai":"Sorbitol carrier + Boron","qty":578.95,"unit":"ml","lot":"B","set":"July - Set 3","cost":43.42,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0407","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":24,"pname":"Sorbix","ai":"Sorbitol carrier + Boron","qty":350.87,"unit":"ml","lot":"C","set":"July - Set 3","cost":26.32,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0408","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 3","cost":64.62,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0409","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 3","cost":65.61,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0410","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":18,"pname":"Stunza","ai":"Mepiquat chloride (MEP)","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 3","cost":39.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0411","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 3","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0412","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 3","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0413","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 3","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0414","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1900.58,"unit":"gm","lot":"A","set":"July - Set 3","cost":22.81,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0415","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1929.82,"unit":"gm","lot":"B","set":"July - Set 3","cost":23.16,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0416","type":"STOCK_OUT","dt":"2026-07-13T08:00:00","pid":29,"pname":"Yara MKP","ai":"Mono potassium phosphate 0-52-34","qty":1169.6,"unit":"gm","lot":"C","set":"July - Set 3","cost":14.04,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 3"},{"uuid":"imp2026-0417","type":"STOCK_OUT","dt":"2026-07-17T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":20526.32,"unit":"gm","lot":"A","set":"July - Fert Set 2","cost":218.09,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Fert Set 2"},{"uuid":"imp2026-0418","type":"STOCK_OUT","dt":"2026-07-17T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":20842.11,"unit":"gm","lot":"B","set":"July - Fert Set 2","cost":221.45,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Fert Set 2"},{"uuid":"imp2026-0419","type":"STOCK_OUT","dt":"2026-07-17T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":12631.57,"unit":"gm","lot":"C","set":"July - Fert Set 2","cost":134.21,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Fert Set 2"},{"uuid":"imp2026-0420","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 4","cost":53.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0421","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 4","cost":54.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0422","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":23,"pname":"Carboxamin","ai":"Amino acids","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 4","cost":33.14,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0423","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 4","cost":243.27,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0424","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 4","cost":247.02,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0425","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":44,"pname":"Fetto 480","ai":"Metalaxyl-M · fruit-contact, 14-day PHI","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 4","cost":149.71,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0426","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 4","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0427","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 4","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0428","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 4","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0429","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":1520.47,"unit":"gm","lot":"A","set":"July - Set 4","cost":16.15,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0430","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":1543.86,"unit":"gm","lot":"B","set":"July - Set 4","cost":16.4,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0431","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":935.67,"unit":"gm","lot":"C","set":"July - Set 4","cost":9.94,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0432","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":45,"pname":"Pictor","ai":"Boscalid + Dimoxystrobin · fruit-contact, 14-day PHI","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 4","cost":49.41,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0433","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":45,"pname":"Pictor","ai":"Boscalid + Dimoxystrobin · fruit-contact, 14-day PHI","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 4","cost":50.18,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0434","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":45,"pname":"Pictor","ai":"Boscalid + Dimoxystrobin · fruit-contact, 14-day PHI","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 4","cost":30.41,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0435","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":42,"pname":"Raizon Max","ai":"Rooting / humic complex","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 4","cost":64.62,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0436","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":42,"pname":"Raizon Max","ai":"Rooting / humic complex","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 4","cost":65.61,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0437","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":42,"pname":"Raizon Max","ai":"Rooting / humic complex","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 4","cost":39.77,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0438","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 4","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0439","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 4","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0440","type":"STOCK_OUT","dt":"2026-07-20T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 4","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 4"},{"uuid":"imp2026-0441","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":3801.17,"unit":"ml","lot":"A","set":"July - Set 5","cost":155.85,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0442","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":3859.65,"unit":"ml","lot":"B","set":"July - Set 5","cost":158.25,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0443","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":47,"pname":"Betakal Amino","ai":"Amino acid + Potassium","qty":2339.18,"unit":"ml","lot":"C","set":"July - Set 5","cost":95.91,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0444","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 5","cost":62.72,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0445","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 5","cost":63.68,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0446","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":16,"pname":"Flora","ai":"Boron (foliar)","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 5","cost":38.6,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0447","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":760.23,"unit":"ml","lot":"A","set":"July - Set 5","cost":46.24,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0448","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":771.93,"unit":"ml","lot":"B","set":"July - Set 5","cost":46.96,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0449","type":"STOCK_OUT","dt":"2026-07-29T08:00:00","pid":15,"pname":"Xilca","ai":"Calcium + Silicon","qty":467.84,"unit":"ml","lot":"C","set":"July - Set 5","cost":28.46,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"July|Set 5"},{"uuid":"imp2026-0450","type":"STOCK_OUT","dt":"2026-08-03T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":18245.61,"unit":"gm","lot":"A","set":"Aug - Fert Set 1","cost":193.86,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Aug|Fert Set 1"},{"uuid":"imp2026-0451","type":"STOCK_OUT","dt":"2026-08-03T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":18526.32,"unit":"gm","lot":"B","set":"Aug - Fert Set 1","cost":196.84,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Aug|Fert Set 1"},{"uuid":"imp2026-0452","type":"STOCK_OUT","dt":"2026-08-03T08:00:00","pid":67,"pname":"MSolumax 3-16-36","ai":"NPK 3-16-36","qty":11228.07,"unit":"gm","lot":"C","set":"Aug - Fert Set 1","cost":119.3,"worker":"IMPORT 2026","device":"sheet-import","synced":false,"phaseId":"Aug|Fert Set 1"}];

/* ===================== v3.29.5 - THE DATE FLOOR FOR THE RETURN ROAD =====================
   From this date onward a device downloads the OTHER devices' work records as well as
   sending its own up. Rows dated before it stay on the Google Sheet as history and never
   travel, so the pre-trial test rows the 7 Aug audit found mixed in with the real ones do
   not land on four devices on trial morning. Move it forward to start a clean period.
   ===================================================================================== */
const SYNC_EVENTS_FROM='2026-08-09';
/* ===================================================================================
   v3.33.1 · THE ONE-TIME BACKFILL FLOOR
   ===================================================================================
   SYNC_EVENTS_FROM above is the ROUTINE floor: what every sync asks for, kept recent so
   the peak-season pull stays small. It was set to 9 Aug to fence off the test rows the
   7 Aug data audit found mixed into the sheet.

   That floor had a consequence nobody costed: a record keyed on a phone BEFORE it never
   travels. The season opened well before 9 Aug, so each device held its own July work and
   nobody else's — and the Owner's harvest report, the Gate's and the store's could never
   agree no matter how many times they synced. The sync was working perfectly; it was
   never asking for the older half.

   SYNC_HISTORY_FROM is asked for ONCE per phone. After it lands, the phone stores the
   date it backfilled and goes back to the routine floor for ever. Change this date and
   every phone backfills again on its next sync — that is the intended way to correct it.

   SET IT NO EARLIER THAN THE FIRST REAL RECORD. Everything before this date stays on the
   sheet as history and does not travel, which is what keeps the pre-trial test rows out.
   Rows the Owner has already cleaned up are refused at the door by the tombstone gate
   (v3.29.8) whatever this date says, so a clean-up can never be undone by a backfill.
   =================================================================================== */
const SYNC_HISTORY_FROM='2026-07-01';

/* ===================================================================================
   v3.74.0 · WORDS FOR THE SEASON DOOR AND THE OPENING COUNT
   English falls back to the string written beside each tr() call in app.js; Bahasa
   Malaysia lives here so the crew's count screen reads in their language.
   =================================================================================== */
Object.assign(EN,{
  s_season:'SEASON', st_season:'Season', st_opencount:'Opening count',
  oc_openbtn:'🧾 OPENING COUNT — COUNT THE WHOLE SHELF'});
Object.assign(MS,{
  s_season:'MUSIM', st_season:'Musim', st_opencount:'Kiraan pembukaan',
  oc_openbtn:'🧾 KIRAAN PEMBUKAAN — KIRA SELURUH STOR',
  oc_head:'KIRAAN PEMBUKAAN', oc_how:'Kira setiap kad: bekas penuh, kemudian baki dalam bekas yang sudah dibuka. Tiada langsung di rak — tekan 0. Simpan bila-bila masa dan sambung kemudian; Tuan akan sahkan.',
  oc_counted:'dikira', oc_sent:'dihantar', oc_draft:'masih mengira', oc_by:'oleh', oc_date:'Tarikh kiraan',
  oc_appsays:'Sistem kata', oc_full:'Penuh', oc_loose:'Baki', oc_countedin:'Dikira', oc_notyet:'belum dikira',
  oc_matches:'sama', oc_short:'kurang', oc_surplus:'lebih', oc_save:'SIMPAN — SAMBUNG KEMUDIAN',
  oc_send:'HANTAR KIRAAN KEPADA TUAN', oc_sendnote:'HANTAR berkongsi dengan Tuan pada sync seterusnya. Tiada apa berubah dalam stor sehingga Tuan sahkan.',
  oc_sentmsg:'Kiraan dihantar — Tuan akan sahkan', oc_savedmsg:'Disimpan dalam telefon ini', oc_pressync:'tekan SYNC untuk kongsi',
  oc_needseason:'Buka musim dahulu — kiraan ditulis sebagai stok pembukaan musim itu.',
  oc_confirmed:'Kiraan pembukaan disahkan', oc_products:'produk', oc_donenote:'Stor kini bermula daripada apa yang dikira. Baris yang salah dibetulkan dengan stock-take biasa.',
  oc_zero:'0 · tiada', oc_confirmedw:'disahkan',
  cs_back:'KEMBALI KE RAK'});
/* ===================================================================================
   v3.75.0 · THE RAIN RECORD
   RAIN_FROM is the first day the farm is expected to key the gauge. A past day from here
   on with no reading shows red on the month sheet; nothing before it is ever called
   missing. English falls back to the string written beside each tr() call in app.js;
   Bahasa Malaysia lives here so the crew's HUJAN screen reads in their language.
   =================================================================================== */
const RAIN_FROM='2026-10-01';
Object.assign(EN,{
  m_rain:'Rain', m_rain_d:'Key the rain gauge: which day, how many mm, and when it fell',
  ts_rain:'key the rain gauge each morning', bg_rainmiss:'NOT KEYED'});
Object.assign(MS,{
  m_rain:'Hujan', m_rain_d:'Rekod tolok hujan: hari mana, berapa mm, dan bila hujan turun',
  ts_rain:'rekod hujan setiap pagi', bg_rainmiss:'BELUM',
  rn_head:'Hujan — tolok ladang', rn_notyet:'BELUM', rn_alldone:'semua hari direkod',
  rn_q_day:'Hujan hari mana?',
  rn_hint_day:'Hujan petang atau malam semalam → Semalam. Hujan selepas tengah malam → Hari ini.',
  rn_yest:'Semalam', rn_today:'Hari ini', rn_other:'Tarikh lain', rn_pick:'pilih', rn_date:'Tarikh',
  rn_exists_a:'sudah ada rekod:', rn_exists_b:'Simpan semula akan menggantikannya.', rn_norain_s:'tiada hujan',
  rn_q_kind:'Ada hujan?', rn_dry:'TIADA HUJAN', rn_wet:'ADA HUJAN',
  rn_q_mm:'Bacaan tolok hujan (mm)', rn_q_when:'Bila hujan turun?', rn_when_h:'Boleh pilih lebih dari satu.',
  rn_b_em:'Awal pagi', rn_bh_em:'12 mlm – 6 pagi', rn_b_m:'Pagi', rn_bh_m:'6 pagi – 12 tgh hari',
  rn_b_a:'Petang', rn_bh_a:'12 tgh hari – 6 ptg', rn_b_n:'Malam', rn_bh_n:'6 ptg – 12 mlm',
  rn_times:'jam mula dan berhenti, jika tahu', rn_start:'Mula', rn_stop:'Berhenti',
  rn_note:'Catatan (jika ada)', rn_note_ph:'cth. lebat, parit melimpah',
  rn_save:'SIMPAN', rn_again_rep:'TEKAN SEKALI LAGI UNTUK GANTI',
  rn_again_big_a:'BETUL', rn_again_big_b:'MM? TEKAN SEKALI LAGI',
  rn_e_date:'Pilih tarikh.', rn_e_future:'Tarikh itu belum tiba.', rn_e_kind:'Pilih TIADA HUJAN atau ADA HUJAN.',
  rn_e_mm:'Masukkan bacaan mm dari tolok.', rn_e_band:'Pilih bila hujan turun.',
  rn_e_early:'Tarikh itu sebelum rekod hujan bermula.', rn_e_far:'Terlalu lama untuk telefon ini. Minta Tuan betulkan.',
  rn_refused:'Tidak disimpan — Sheet sudah ada bacaan lebih baru untuk',
  rn_saved:'✓ Disimpan', rn_r_date:'TARIKH', rn_r_rain:'HUJAN', rn_r_none:'TIADA (0 mm)',
  rn_r_notime:'jam tidak direkod', rn_r_note:'CATATAN', rn_r_by:'OLEH',
  rn_syncnote:'Rekod dihantar bila telefon SYNC.', rn_next:'REKOD', rn_another:'Rekod hari lain',
  rn_backhome:'Kembali ke menu'});

/* ===================================================================================
   v3.76.0 · THE PROGRAMME, SEASON 2026/27
   ===================================================================================
   PLAN_2627 is the Owner's workbook "Sugut Programme 2026-27 Monthly Sheets" (drawn up
   21 Sep 2026): 57 rounds that draw material from the store. It is the PLAN and nothing
   else - a round here is grey, has no number and nags nobody. A round becomes WORK when
   the Owner issues it: the issue is a PROGRAMS record that travels to every phone, and
   that is when it takes its name ("October · Set 1": the next number in that month).
     basis  T = dose per 1,000 L tank · P = dose per tree · R = dose per round
     u      gm / ml / tab, as the workbook writes them; the app converts to the unit of
            the store card when it draws
     pid    the store card. null = the workbook names a product the store has no card
            for; PP_ALIAS finds the card by NAME once the Purchaser has made one.
   The `code` is the workbook's own short code (GS2, S02 ...). The Owner does not use the
   codes: they are shown in small grey on HIS screens only and are never a set's name.
   PP_FIX     what the Owner said on 2 Oct 2026 about a planned round.
   PP_ADOPT   stock already drawn before this release that belongs to a set: the 26 Sep
              spray was keyed as a plain stock-out with no set name. The rows are not
              touched; the app reads them as September · Set 1.
   PP_CLOSE_2526  how Programme 26 (last season's workbook) shows the three sets the app
              still held open on 2 Oct 2026. Pre-picked answers only - the Owner confirms.
   =================================================================================== */
const PP_SEASON='2026/27';
const PP_FROM='2026-09-21';
const PP_TREES=162;   // 'Trees in programme' on the workbook's Legend: 171 less 9 top-worked. Every per-tree round is planned on it.
const PLAN_2627=[{"id":"P27|DR1","code":"DR1","k":"drench","plan":"2026-09-28","stage":"Recovery","tgt":"Soil drenching","tgtbm":"Siram tanah","basis":"T","tanks":2,"lines":[{"pid":32,"n":"Calcium nitrate (Tropicote)","q":10000,"u":"gm"},{"pid":47,"n":"Betakal","q":5000,"u":"ml"}]},{"id":"P27|S01","code":"S01","k":"fert","plan":"2026-09-29","stage":"Recovery","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":null,"n":"Dolomite","q":5000,"u":"gm"}]},{"id":"P27|GS2","code":"GS2","k":"spray","plan":"2026-10-06","stage":"Recovery","tgt":"Leaf & branches","tgtbm":"Daun dan dahan","basis":"T","tanks":2,"lines":[{"pid":32,"n":"Calcium nitrate (Tropicote)","q":2000,"u":"gm"},{"pid":13,"n":"Wuxal Ascofol","q":1000,"u":"ml"},{"pid":26,"n":"AZ Plus","q":1000,"u":"gm"},{"pid":6,"n":"Mancozeb","q":500,"u":"gm"},{"pid":4,"n":"Madell","q":500,"u":"ml"},{"pid":5,"n":"Abamectin","q":1000,"u":"ml"}]},{"id":"P27|PD1","code":"PD1","k":"trunk","plan":"2026-10-08","stage":"Recovery","tgt":"Trunk and root disease (Aliette) · per tree","tgtbm":"Penyakit batang dan akar (Aliette) · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":9,"n":"Aliette","q":20,"u":"gm"}]},{"id":"P27|S02","code":"S02","k":"fert","plan":"2026-10-13","stage":"Recovery","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":38,"n":"Nutrigem","q":15000,"u":"gm"}]},{"id":"P27|GS3","code":"GS3","k":"spray","plan":"2026-10-16","stage":"Leaf layer 1 → pre-boost","tgt":"Leaf & branches","tgtbm":"Daun dan dahan","basis":"T","tanks":2,"lines":[{"pid":64,"n":"18-18-18 (Yara Tera)","q":1000,"u":"gm"},{"pid":13,"n":"Wuxal Ascofol","q":1000,"u":"ml"},{"pid":26,"n":"AZ Plus","q":1000,"u":"gm"},{"pid":7,"n":"Arimo 23EC","q":500,"u":"ml"},{"pid":8,"n":"Agus 24SC","q":500,"u":"ml"}]},{"id":"P27|HS1","code":"HS1","k":"spray","plan":"2026-10-26","stage":"Leaf layer 1 → pre-boost","tgt":"Leaf — hardening (no GA3, no N)","tgtbm":"Daun — keraskan daun (tanpa GA3, tanpa N)","basis":"T","tanks":2,"lines":[{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":null,"n":"Calcium-Boron","q":1000,"u":"ml"},{"pid":20,"n":"Heromix T1","q":1000,"u":"ml"},{"pid":14,"n":"A Zinc Mix","q":500,"u":"ml"}]},{"id":"P27|S03","code":"S03","k":"fert","plan":"2026-10-27","stage":"Leaf layer 1 → pre-boost","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":null,"n":"Urea","q":500,"u":"gm"},{"pid":32,"n":"Calcium nitrate (Tropicote)","q":500,"u":"gm"}]},{"id":"P27|W2","code":"W2","k":"weed","plan":"2026-10-27","stage":"Leaf layer 1 → pre-boost","tgt":"Weeding · path spray, knapsack","tgtbm":"Racun rumput · sembur laluan, pam galas","basis":"R","tanks":0,"lines":[{"pid":31,"n":"Glyphosate (Entrust)","q":2000,"u":"ml"}]},{"id":"P27|PB1","code":"PB1","k":"spray","plan":"2026-11-03","stage":"Leaf layer 1 → pre-boost","tgt":"Pre-boost, high P","tgtbm":"Sebelum boosting, P tinggi","basis":"T","tanks":2,"lines":[{"pid":54,"n":"13-40-13","q":1000,"u":"gm"},{"pid":29,"n":"MKP","q":1000,"u":"gm"},{"pid":null,"n":"15-15-30","q":1000,"u":"ml"},{"pid":7,"n":"Arimo 23EC","q":500,"u":"ml"},{"pid":8,"n":"Agus 24SC","q":500,"u":"ml"},{"pid":2,"n":"Cypermethrin 5.5","q":1000,"u":"ml"}]},{"id":"P27|PBZ","code":"PBZ","k":"spray","plan":"2026-11-10","stage":"Boosting (PBZ)","tgt":"Inside canopy, branch bark","tgtbm":"Dalam kanopi, kulit dahan","basis":"T","tanks":2,"lines":[{"pid":27,"n":"PBZ (Brightstar)","q":3000,"u":"ml"},{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":26,"n":"AZ Plus","q":1000,"u":"gm"}]},{"id":"P27|S04","code":"S04","k":"fert","plan":"2026-11-10","stage":"Boosting (PBZ)","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":36,"n":"8-24-24 (Garsoni)","q":1000,"u":"gm"},{"pid":37,"n":"Polysulphate","q":500,"u":"gm"}]},{"id":"P27|IN1","code":"IN1","k":"spray","plan":"2026-11-19","stage":"Bud induction","tgt":"Inside branches","tgtbm":"Dahan sebelah dalam","basis":"T","tanks":2,"lines":[{"pid":1,"n":"Amotan 22.8SC","q":500,"u":"ml"},{"pid":2,"n":"Cypermethrin 5.5","q":1000,"u":"ml"},{"pid":3,"n":"Fipronil","q":1000,"u":"ml"},{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"},{"pid":26,"n":"AZ Plus","q":1000,"u":"gm"},{"pid":14,"n":"A Zinc Mix","q":500,"u":"ml"}]},{"id":"P27|S05","code":"S05","k":"fert","plan":"2026-11-24","stage":"Bud induction","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":36,"n":"8-24-24 (Garsoni)","q":1500,"u":"gm"}]},{"id":"P27|IN2","code":"IN2","k":"spray","plan":"2026-11-27","stage":"Bud induction","tgt":"Inside branches","tgtbm":"Dahan sebelah dalam","basis":"T","tanks":2,"lines":[{"pid":6,"n":"Mancozeb","q":500,"u":"gm"},{"pid":4,"n":"Madell","q":500,"u":"ml"},{"pid":5,"n":"Abamectin","q":1000,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":2000,"u":"gm"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"},{"pid":null,"n":"Calcium-Boron","q":1000,"u":"ml"}]},{"id":"P27|IN3","code":"IN3","k":"spray","plan":"2026-12-07","stage":"Bud induction","tgt":"Inside branches","tgtbm":"Dahan sebelah dalam","basis":"T","tanks":2,"lines":[{"pid":7,"n":"Arimo 23EC","q":500,"u":"ml"},{"pid":8,"n":"Agus 24SC","q":500,"u":"ml"},{"pid":2,"n":"Cypermethrin 5.5","q":1000,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":2000,"u":"gm"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"},{"pid":null,"n":"Calcium-Boron","q":1000,"u":"ml"}]},{"id":"P27|S06","code":"S06","k":"fert","plan":"2026-12-11","stage":"Bud induction","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":43,"n":"Calcinit","q":1000,"u":"gm"},{"pid":38,"n":"Nutrigem","q":10000,"u":"gm"}]},{"id":"P27|IN4","code":"IN4","k":"spray","plan":"2026-12-18","stage":"Flowering","tgt":"Bud support (no N)","tgtbm":"Sokong mata bunga (tanpa N)","basis":"T","tanks":2,"lines":[{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":null,"n":"Calcium-Boron","q":1000,"u":"ml"},{"pid":20,"n":"Heromix T1","q":1000,"u":"ml"}]},{"id":"P27|FL1","code":"FL1","k":"spray","plan":"2026-12-28","stage":"Flowering","tgt":"Inside branches","tgtbm":"Dahan sebelah dalam","basis":"T","tanks":2,"lines":[{"pid":7,"n":"Arimo 23EC","q":500,"u":"ml"},{"pid":3,"n":"Fipronil","q":1000,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":1500,"u":"gm"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":17,"n":"Vitanica","q":1000,"u":"ml"},{"pid":14,"n":"A Zinc Mix","q":1000,"u":"ml"}]},{"id":"P27|S07","code":"S07","k":"fert","plan":"2026-12-30","stage":"Flowering","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":500,"u":"gm"},{"pid":37,"n":"Polysulphate","q":500,"u":"gm"}]},{"id":"P27|FL2","code":"FL2","k":"spray","plan":"2027-01-04","stage":"Flowering","tgt":"Inside branches","tgtbm":"Dahan sebelah dalam","basis":"T","tanks":2,"lines":[{"pid":7,"n":"Arimo 23EC","q":500,"u":"ml"},{"pid":3,"n":"Fipronil","q":1000,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":1500,"u":"gm"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":17,"n":"Vitanica","q":1000,"u":"ml"},{"pid":14,"n":"A Zinc Mix","q":1000,"u":"ml"}]},{"id":"P27|LL1","code":"LL1","k":"spray","plan":"2027-01-11","stage":"Flowering","tgt":"Outside leaf","tgtbm":"Daun sebelah luar","basis":"T","tanks":2,"lines":[{"pid":7,"n":"Arimo 23EC","q":500,"u":"ml"},{"pid":48,"n":"Ardel","q":1000,"u":"ml"},{"pid":43,"n":"Calcinit","q":2500,"u":"gm"},{"pid":28,"n":"GA3","q":5,"u":"tab"},{"pid":17,"n":"Vitanica","q":1000,"u":"ml"},{"pid":14,"n":"A Zinc Mix","q":1000,"u":"ml"}]},{"id":"P27|W2b","code":"W2b","k":"weed","plan":"2027-01-13","stage":"Flowering","tgt":"Weeding · path spray, knapsack","tgtbm":"Racun rumput · sembur laluan, pam galas","basis":"R","tanks":0,"lines":[{"pid":31,"n":"Glyphosate (Entrust)","q":2000,"u":"ml"}]},{"id":"P27|S08","code":"S08","k":"fert","plan":"2027-01-15","stage":"Flowering","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":500,"u":"gm"}]},{"id":"P27|FL3","code":"FL3","k":"spray","plan":"2027-01-18","stage":"Flowering","tgt":"Flower & leaf","tgtbm":"Bunga dan daun","basis":"T","tanks":2,"lines":[{"pid":4,"n":"Madell","q":1000,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":2000,"u":"gm"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":17,"n":"Vitanica","q":1000,"u":"ml"}]},{"id":"P27|FL4","code":"FL4","k":"spray","plan":"2027-01-25","stage":"Flowering","tgt":"Flower & leaf","tgtbm":"Bunga dan daun","basis":"T","tanks":2,"lines":[{"pid":5,"n":"Abamectin","q":1000,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":2000,"u":"gm"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":17,"n":"Vitanica","q":1000,"u":"ml"}]},{"id":"P27|BS1","code":"BS1","k":"spray","plan":"2027-02-01","stage":"Bloom & set","tgt":"Flower only","tgtbm":"Bunga sahaja","basis":"T","tanks":2,"lines":[{"pid":18,"n":"Stunza (MEP)","q":250,"u":"ml"},{"pid":27,"n":"PBZ (Brightstar)","q":250,"u":"ml"},{"pid":19,"n":"Calcifol","q":1000,"u":"ml"},{"pid":20,"n":"Heromix T1","q":1000,"u":"ml"},{"pid":21,"n":"Auxi-Pro (NAA)","q":500,"u":"ml"},{"pid":22,"n":"Cyto-Plus (CPPU)","q":250,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":1000,"u":"gm"},{"pid":14,"n":"A Zinc Mix","q":1000,"u":"ml"}]},{"id":"P27|S09","code":"S09","k":"fert","plan":"2027-02-04","stage":"Bloom & set","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":43,"n":"Calcinit","q":1000,"u":"gm"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":500,"u":"gm"},{"pid":37,"n":"Polysulphate","q":500,"u":"gm"}]},{"id":"P27|BS2","code":"BS2","k":"spray","plan":"2027-02-09","stage":"Bloom & set","tgt":"Outside leaf, flush control","tgtbm":"Daun sebelah luar, kawal pucuk baru","basis":"T","tanks":2,"lines":[{"pid":18,"n":"Stunza (MEP)","q":1000,"u":"ml"},{"pid":27,"n":"PBZ (Brightstar)","q":500,"u":"ml"},{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":20,"n":"Heromix T1","q":1000,"u":"ml"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"}]},{"id":"P27|SE1","code":"SE1","k":"spray","plan":"2027-02-17","stage":"Bloom & set","tgt":"Flower / fruitlet","tgtbm":"Bunga / putik buah","basis":"T","tanks":2,"lines":[{"pid":5,"n":"Abamectin","q":1000,"u":"ml"},{"pid":21,"n":"Auxi-Pro (NAA)","q":500,"u":"ml"},{"pid":22,"n":"Cyto-Plus (CPPU)","q":250,"u":"ml"},{"pid":24,"n":"Sorbix","q":500,"u":"ml"},{"pid":29,"n":"MKP","q":1000,"u":"gm"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"}]},{"id":"P27|S10","code":"S10","k":"fert","plan":"2027-02-23","stage":"Bloom & set","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":43,"n":"Calcinit","q":1000,"u":"gm"}]},{"id":"P27|SE2","code":"SE2","k":"spray","plan":"2027-02-25","stage":"Bloom & set","tgt":"Inside, branches & fruit","tgtbm":"Sebelah dalam, dahan dan buah","basis":"T","tanks":2,"lines":[{"pid":50,"n":"Azatin","q":500,"u":"ml"},{"pid":51,"n":"Match","q":500,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":1000,"u":"gm"},{"pid":21,"n":"Auxi-Pro (NAA)","q":500,"u":"ml"},{"pid":22,"n":"Cyto-Plus (CPPU)","q":250,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":14,"n":"A Zinc Mix","q":1000,"u":"ml"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"}]},{"id":"P27|SE3","code":"SE3","k":"spray","plan":"2027-03-05","stage":"Fruit development 1","tgt":"Inside — LAST Fetto/Pictor","tgtbm":"Sebelah dalam — Fetto/Pictor TERAKHIR","basis":"T","tanks":2,"lines":[{"pid":44,"n":"Fetto 480","q":500,"u":"ml"},{"pid":45,"n":"Pictor","q":1000,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":1000,"u":"gm"},{"pid":21,"n":"Auxi-Pro (NAA)","q":500,"u":"ml"},{"pid":22,"n":"Cyto-Plus (CPPU)","q":250,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":14,"n":"A Zinc Mix","q":1000,"u":"ml"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"}]},{"id":"P27|S11","code":"S11","k":"fert","plan":"2027-03-09","stage":"Fruit development 1","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":53,"n":"13-4-25","q":1000,"u":"gm"}]},{"id":"P27|F01","code":"F01","k":"spray","plan":"2027-03-15","stage":"Fruit development 1","tgt":"Leaf & branches — last pesticide","tgtbm":"Daun dan dahan — racun serangga terakhir","basis":"T","tanks":2,"lines":[{"pid":58,"n":"Anmi 4.8SC","q":1000,"u":"ml"},{"pid":4,"n":"Madell","q":1000,"u":"ml"},{"pid":41,"n":"Plantara","q":500,"u":"ml"},{"pid":39,"n":"5-25-25 (Herocris Nexus)","q":2500,"u":"gm"},{"pid":13,"n":"Wuxal Ascofol","q":1000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":21,"n":"Auxi-Pro (NAA)","q":250,"u":"ml"}]},{"id":"P27|PD2","code":"PD2","k":"trunk","plan":"2027-03-17","stage":"Fruit development 1","tgt":"Trunk and root disease (Aliette) · per tree","tgtbm":"Penyakit batang dan akar (Aliette) · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":9,"n":"Aliette","q":20,"u":"gm"}]},{"id":"P27|DR2","code":"DR2","k":"drench","plan":"2027-03-22","stage":"Fruit development 1","tgt":"Drench 10 L/tree","tgtbm":"Siram tanah 10 L sepokok","basis":"T","tanks":2,"lines":[{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":67,"n":"3-16-36 (MSolumax)","q":5000,"u":"gm"},{"pid":47,"n":"Betakal Amino","q":5000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":21,"n":"Auxi-Pro (NAA)","q":250,"u":"ml"}]},{"id":"P27|S12","code":"S12","k":"fert","plan":"2027-03-24","stage":"Fruit development 1","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":null,"n":"K-sulphate (SOP)","q":500,"u":"gm"}]},{"id":"P27|F03","code":"F03","k":"spray","plan":"2027-03-29","stage":"Fruit development 1","tgt":"Leaf — flush control","tgtbm":"Daun — kawal pucuk baru","basis":"T","tanks":2,"lines":[{"pid":18,"n":"Stunza (MEP)","q":1000,"u":"ml"},{"pid":67,"n":"3-16-36 (MSolumax)","q":2000,"u":"gm"},{"pid":24,"n":"Sorbix","q":500,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":28,"n":"GA3","q":2,"u":"tab"}]},{"id":"P27|F04","code":"F04","k":"spray","plan":"2027-04-05","stage":"Fruit development 2","tgt":"Leaf only, no fruit","tgtbm":"Daun sahaja, jangan kena buah","basis":"T","tanks":2,"lines":[{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":24,"n":"Sorbix","q":500,"u":"ml"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":21,"n":"Auxi-Pro (NAA)","q":250,"u":"ml"},{"pid":28,"n":"GA3","q":2,"u":"tab"}]},{"id":"P27|S13","code":"S13","k":"fert","plan":"2027-04-07","stage":"Fruit development 2","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":67,"n":"3-16-36 (MSolumax)","q":500,"u":"gm"},{"pid":37,"n":"Polysulphate","q":500,"u":"gm"},{"pid":35,"n":"MgS (Krista)","q":500,"u":"gm"}]},{"id":"P27|PD3","code":"PD3","k":"trunk","plan":"2027-04-09","stage":"Fruit development 2","tgt":"Trunk and root disease (Aliette) · per tree","tgtbm":"Penyakit batang dan akar (Aliette) · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":9,"n":"Aliette","q":20,"u":"gm"}]},{"id":"P27|DR3","code":"DR3","k":"drench","plan":"2027-04-13","stage":"Fruit development 2","tgt":"Drench 10 L/tree","tgtbm":"Siram tanah 10 L sepokok","basis":"T","tanks":2,"lines":[{"pid":67,"n":"3-16-36 (MSolumax)","q":5000,"u":"gm"},{"pid":47,"n":"Betakal Amino","q":5000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":42,"n":"Raizon Max","q":500,"u":"ml"}]},{"id":"P27|F06","code":"F06","k":"spray","plan":"2027-04-20","stage":"Fruit development 2","tgt":"Leaf only","tgtbm":"Daun sahaja","basis":"T","tanks":2,"lines":[{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":42,"n":"Raizon Max","q":500,"u":"ml"},{"pid":24,"n":"Sorbix","q":500,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":21,"n":"Auxi-Pro (NAA)","q":250,"u":"ml"},{"pid":28,"n":"GA3","q":2,"u":"tab"}]},{"id":"P27|S14","code":"S14","k":"fert","plan":"2027-04-22","stage":"Fruit development 2","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":67,"n":"3-16-36 (MSolumax)","q":500,"u":"gm"}]},{"id":"P27|DR4","code":"DR4","k":"drench","plan":"2027-04-27","stage":"Fruit development 2","tgt":"Drench — last NAA","tgtbm":"Siram tanah — NAA terakhir","basis":"T","tanks":2,"lines":[{"pid":67,"n":"3-16-36 (MSolumax)","q":5000,"u":"gm"},{"pid":47,"n":"Betakal Amino","q":5000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":21,"n":"Auxi-Pro (NAA)","q":250,"u":"ml"}]},{"id":"P27|F08","code":"F08","k":"spray","plan":"2027-05-04","stage":"Fruit development 2","tgt":"Leaf only — no auxin","tgtbm":"Daun sahaja — tanpa auksin","basis":"T","tanks":2,"lines":[{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":24,"n":"Sorbix","q":500,"u":"ml"},{"pid":23,"n":"Carboxamin (amino)","q":1000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"}]},{"id":"P27|S15","code":"S15","k":"fert","plan":"2027-05-07","stage":"Fruit development 2","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":67,"n":"3-16-36 (MSolumax)","q":500,"u":"gm"},{"pid":35,"n":"MgS (Krista)","q":500,"u":"gm"}]},{"id":"P27|F09","code":"F09","k":"spray","plan":"2027-05-11","stage":"Fruit development 2","tgt":"Ca + K only","tgtbm":"Ca + K sahaja","basis":"T","tanks":2,"lines":[{"pid":29,"n":"MKP","q":2500,"u":"gm"},{"pid":24,"n":"Sorbix","q":500,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"}]},{"id":"P27|W2c","code":"W2c","k":"weed","plan":"2027-05-13","stage":"Fruit development 2","tgt":"Weeding · path spray, knapsack","tgtbm":"Racun rumput · sembur laluan, pam galas","basis":"R","tanks":0,"lines":[{"pid":31,"n":"Glyphosate (Entrust)","q":2000,"u":"ml"}]},{"id":"P27|F10","code":"F10","k":"spray","plan":"2027-05-18","stage":"Fruit development 2","tgt":"Ca only — last before drop","tgtbm":"Ca sahaja — terakhir sebelum buah gugur","basis":"T","tanks":2,"lines":[{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":19,"n":"Calcifol","q":1000,"u":"ml"}]},{"id":"P27|DR5","code":"DR5","k":"drench","plan":"2027-05-25","stage":"Harvest","tgt":"Pre-peak drench, no pesticide","tgtbm":"Siram tanah sebelum puncak, tanpa racun serangga","basis":"T","tanks":2,"lines":[{"pid":67,"n":"3-16-36 (MSolumax)","q":5000,"u":"gm"},{"pid":47,"n":"Betakal Amino","q":5000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":16,"n":"Flora","q":1000,"u":"ml"},{"pid":24,"n":"Sorbix","q":500,"u":"ml"}]},{"id":"P27|S16","code":"S16","k":"fert","plan":"2027-05-26","stage":"Harvest","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":67,"n":"3-16-36 (MSolumax)","q":500,"u":"gm"},{"pid":37,"n":"Polysulphate","q":500,"u":"gm"}]},{"id":"P27|DR6","code":"DR6","k":"drench","plan":"2027-07-16","stage":"Post-harvest","tgt":"Recovery drench","tgtbm":"Siram tanah pemulihan","basis":"T","tanks":2,"lines":[{"pid":43,"n":"Calcinit","q":5000,"u":"gm"},{"pid":47,"n":"Betakal Amino","q":5000,"u":"ml"},{"pid":15,"n":"Xilca","q":1000,"u":"ml"},{"pid":42,"n":"Raizon Max","q":500,"u":"ml"},{"pid":20,"n":"Heromix T1","q":1000,"u":"ml"}]},{"id":"P27|S17","code":"S17","k":"fert","plan":"2027-07-19","stage":"Post-harvest","tgt":"Soil fertiliser · per tree","tgtbm":"Baja tanah · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":43,"n":"Calcinit","q":500,"u":"gm"},{"pid":null,"n":"Dolomite","q":5000,"u":"gm"}]},{"id":"P27|PD4","code":"PD4","k":"trunk","plan":"2027-07-22","stage":"Post-harvest","tgt":"Trunk and root disease (Aliette) · per tree","tgtbm":"Penyakit batang dan akar (Aliette) · setiap pokok","basis":"P","tanks":0,"lines":[{"pid":9,"n":"Aliette","q":20,"u":"gm"}]},{"id":"P27|W3","code":"W3","k":"weed","plan":"2027-07-26","stage":"Post-harvest","tgt":"Weeding · path spray, knapsack","tgtbm":"Racun rumput · sembur laluan, pam galas","basis":"R","tanks":0,"lines":[{"pid":31,"n":"Glyphosate (Entrust)","q":2000,"u":"ml"}]}];
const PP_FIX={'P27|DR1':{mon:'2026-10',nodate:true,was:'2026-09-28',why:'FIELD',
  note:'Postponed from 28-29 Sep to October: heavy weeds in the field. The day is not set; you set it when you issue.'}};
const PP_ADOPT=[{id:'P27|A0926',mon:'2026-09',k:'spray',num:1,day:'2026-09-26',tanks:2,stage:'Recovery',
  tgt:'First set of the recovery, after the trimming',tgtbm:'Set pertama pemulihan, selepas pangkasan',
  pids:[1,2,3,65,14],
  lines:[{pid:1,n:'Amotan 22.8SC',q:500,u:'ml'},{pid:2,n:'Cypermethrin 5.5',q:1000,u:'ml'},{pid:3,n:'Fipronil',q:1000,u:'ml'},
         {pid:65,n:'Florica 21-21-21',q:1000,u:'gm'},{pid:14,n:'A Zinc Mix',q:1000,u:'ml'}]}];
const PP_ALIAS={'Dolomite':'dolomit','Urea':'\\burea\\b','15-15-30':'15\\D?15\\D?30',
  'K-sulphate (SOP)':'\\bsop\\b|sulphate of potash|sulfate of potash|potassium sul|k[- ]?sul',
  'Calcium-Boron':'calcium[ -]?boron|cal[ -]?bor'};
const PP_CLOSE_2526={
  'May 2|Fert Set 2':{sug:'dup',date:'2026-06-04',ev:'Programme 26: planned 3 Jun, no actual date. The same mix with the same plan day is on the June sheet as Fert Set 1, done 4 Jun.'},
  'Aug|Set 1':{sug:'done',date:'2026-08-06',ev:'Programme 26: Actual 6 Aug.'},
  'Aug|Fert Set 2':{sug:'not',date:'2026-08-25',ev:'Programme 26: planned 18 Aug, no actual date.'}};
const PP_CLOSE_NOTE='On 25 Aug the field phone drew 5-25-25 and Polysulphate for all 171 trees, filed under "May 2 · Fert Set 2" after it was issued again on 23 Aug. Programme 26 has no fertiliser round on that day. Closing leaves that draw where it is, inside the season\u2019s cost. If it was really August · Fert Set 2 done with a different fertiliser, change that answer to Was done; the day is already set to 25 Aug.';
Object.assign(EN,{
  m_prog:'The Programme', ts_prog:'today · coming · done · month', st_buyask:'what to buy for the programme'});
Object.assign(MS,{
  m_prog:'Program', ts_prog:'kerja program yang dikeluarkan', st_buyask:'senarai beli untuk program'});
/* v3.77.0 - the Programme opens on the month; the old doors are closed. */
Object.assign(EN,{
  ts_prog:'by month · to buy · record', ts_prog_pur:'coming · done', ts_prog_w:'programme work issued to you',
  m_wx:'Weather', ts_wx:'rain gauge, month sheet',
  ow_prog:'PROGRAMME', bg_over:'OVERDUE',
  op_head:"📋 Today's tasks — the sets the Owner has issued",
  op_notask:'No task waiting. The Owner has not issued a set, or every lot has already been reported.',
  so_notset:'A programme set is not keyed here. When the set is marked done in THE PROGRAMME, its materials come off the store count by themselves. Use this form for anything else that leaves the store.'});
Object.assign(MS,{
  ts_prog:'ikut bulan · beli · rekod', ts_prog_pur:'akan datang · siap', ts_prog_w:'kerja program yang dikeluarkan',
  m_wx:'Cuaca', ts_wx:'tolok hujan, helaian bulan',
  ow_prog:'PROGRAM', bg_over:'LEWAT',
  op_head:'📋 Kerja hari ini — set yang dikeluarkan oleh tuan ladang',
  op_notask:'Tiada kerja menunggu. Tuan ladang belum keluarkan set, atau semua lot sudah dilaporkan.',
  so_notset:'Set program tidak dimasukkan di sini. Bila set ditanda siap di PROGRAM, bahannya ditolak daripada kiraan stor dengan sendiri. Guna borang ini untuk bahan lain yang keluar dari stor.'});
/* v3.78.0 - the watering call: the numbers the Owner approved on 3 Oct 2026, and the season plan's water line by stage. */
const WATER_WET_MM=8;        // rain in one day that cancels watering
const WATER_SOAK_MM=25;      // rain over WATER_SOAK_DAYS that still counts as wet
const WATER_SOAK_DAYS=3;
const WATER_HOT_DAY=3;       // the dry alert turns red from this dry morning in a row
const WATER_TELL_DAY=5;      // the Owner is told at this one
const WATER_L_DEFAULT=200, WATER_L_MIN=50, WATER_L_MAX=400, WATER_L_STEP=50;   // litres per tree on a dry day
const WATER_GRAFT_L=100;     // the grafted trees, every dry day, also during a hold
const WATER_HOLD_DAYS=7;     // a new hold runs this many days unless the Owner picks another day
const WATER_HOLD_MAX=60;
const WATER_STRIP_DAYS=21;   // mornings shown on the Owner's page
const WATER_MISS_DAYS=7;     // how far back "watering not reported" looks
const WATER_LATE_HOUR=9;     // yesterday's rain keyed at or after this hour reached the crew late
const WATER_PAST_MAX=12;     // holds and OFFs that have ended, kept so their mornings stay what they were
const WATER_SYNC_MS=1500;    // one sync for a burst of taps on the order
const WATER_PULL_MS=60000;   // opening the Weather page takes the farm's copy first, at most this often
const WATER_FRESH_WAIT_MS=6000; // a tap on the order waits this long, at most, for that copy to land
const WATER_RETRY_MS=1000, WATER_RETRY_MAX=120;   // the order's own sync waits behind an upload that is running
const WATER_OWN_MAX=200;     // this phone's own stamps sent with the order (a reply can be lost after the Sheet stored it)
const WATER_PLAN=[
  {from:'2026-09-15',to:'2026-10-15',stage:'Recovery',when:'15 Sep – 15 Oct',txt:'none until it turns dry; 200 L from about 12 Oct'},
  {from:'2026-10-16',to:'2026-11-09',stage:'Leaf layer 1 → pre-boost',when:'16 Oct – 9 Nov',txt:'200 L (100 + 100) on days under 8 mm'},
  {from:'2026-11-10',to:'2026-11-17',stage:'Boost / PBZ',when:'10 – 17 Nov',txt:'HOLD 7 days'},
  {from:'2026-11-18',to:'2026-12-14',stage:'Bud induction',when:'18 Nov – 14 Dec',txt:'100 L on dry days (deficit)'},
  {from:'2026-12-15',to:'2027-01-31',stage:'Flowering',when:'15 Dec – 5 Feb',txt:'200 L once buds show; do not flood before bloom'},
  {from:'2027-02-01',to:'2027-02-28',stage:'Bloom and set',when:'February',txt:'100 L at bloom, 200 L after set'},
  {from:'2027-03-01',to:'2027-04-02',stage:'Fruit development 1',when:'March',txt:'200 → 300 L, skip days over 8 mm'},
  {from:'2027-04-03',to:'2027-05-19',stage:'Fruit development 2',when:'3 Apr – 19 May',txt:'300 L on dry days, 150 L in wet weeks'},
  {from:'2027-05-20',to:'2027-06-30',stage:'Harvest',when:'20 May – 30 Jun',txt:'300 / 150 L by the rain'}];
Object.assign(EN,{st_waterorder:'Water order',
  cd_a_dry:'Dry days in a row', cd_s_dry:'no real rain on the farm gauge — check the spring and the tank', cd_w_dry:'WATER',
  ow_dry:'dry days in a row — check the spring and the tank',
  st_oldgs:'kept on this phone: the Google Sheet side is older than this app',
  ts_wx:'watering call, rain gauge, month sheet'});
Object.assign(MS,{st_waterorder:'Arahan siram air',
  cd_a_dry:'Hari kering berturut-turut', cd_s_dry:'tiada hujan sebenar pada tolok ladang — periksa mata air dan tangki', cd_w_dry:'AIR',
  ow_dry:'hari kering berturut-turut — periksa mata air dan tangki',
  st_oldgs:'disimpan di telefon ini: bahagian Google Sheet lebih lama daripada aplikasi ini',
  ts_wx:'arahan siram air, tolok hujan, helaian bulan'});
/* v3.79.0 - the tree survey: the nine top-worked trees the Owner confirmed on 4 Oct 2026, the two
   checks that can be issued, the questions with the wording of the staff guide, and the numbers
   of the practice and of the travel between the phones and the Sheet. */
const GRAFT_TREES=['A-013','A-023','A-034','A-036','A-061','B-001','B-053','B-056','B-064'];
/* v3.79.1 - THE FRIDAY FLUSH HAS FIVE ANSWERS, the leaf cycle the Owner gave on 5 Oct 2026:
   0 no new shoot, 1 new shoot just out, 2 long tail (leaves getting longer), 3 leaf spacing
   (light green, gaps between the nodes), 4 mature and hard. Hardened is now answer 4.
   The check has a NEW ID (FL2) on purpose: a phone still on v3.79.0 knows only the four
   answers, where 3 meant hardened. It does not know FL2, so it shows no flush check at all
   until it has loaded this version - it cannot key the old scale into the new record. */
const TC_FL='FL2';
const TC_FLUSH_HARD='4';      // the answer that counts as hardened leaf
const TC_FLUSH_DAYS=[3,7,25]; // about how many days from answer 1 to 2, 2 to 3, 3 to 4 (the Owner's leaf cycle; a guide, not a rule)
/* v3.79.1 - the four photographs of the leaf cycle are the Owner's, from the farm (5 Oct 2026). 280 x 140, kept inside
   the app so the guide works where there is no line. Answer 0 (no new shoot) has no photograph and keeps a drawing. */
const TC_FLUSH_PHOTO={1:'data:image/jpeg;base64,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',2:'data:image/jpeg;base64,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',3:'data:image/jpeg;base64,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',4:'data:image/jpeg;base64,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'};
/* v3.79.1 - the farm's own photographs of a sign that is tapped only when seen: [photo, English, Bahasa].
   Shown under the "?" and on the practice card in place of the drawing. A question with no entry keeps its drawing. */
const TC_SEEN_PHOTO={canker:[['data:image/jpeg;base64,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','a crack, dark liquid running down','rekahan, cecair gelap meleleh'],
  ['data:image/jpeg;base64,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','a dark wet patch','tompok gelap dan basah'],
  ['data:image/jpeg;base64,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','gum coming out of the bark','getah keluar dari kulit'],
  ['data:image/jpeg;base64,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','a rough patch with drops of gum','tompok kasar, ada titisan getah']]};
const TC_CHECKS=[
  {id:'CE1',kind:'census',ic:'📋',en:'Health census',ms:'Banci kesihatan',
   plan:['Due 1–2 Oct on the plan','Sepatutnya 1–2 Okt dalam pelan'],due:'2026-10-02',mons:['2026-10']},
  {id:TC_FL,kind:'flush',ic:'🌿',en:'Friday flush check',ms:'Semakan pucuk hari Jumaat',
   plan:['Every Friday from 16 Oct','Setiap Jumaat dari 16 Okt'],from:'2026-10-16',mons:['2026-10','2026-11']}];
const TC_FLUSH_LINE=80;       // % of trees with hardened leaf: the plan's line for Gate 1
const TC_PASS=4;              // practice: right answers out of the five pictures that open the checks
const TC_REF_DEFAULT=['A-001','A-002','A-003','A-004','A-005'];
const TC_PUSH_ROWS=60;        // tree rows in one upload
const TC_PUSH_PHOTOS=2;       // photos in one upload; a photo goes up after its row, by itself
const TC_PUSH_ROUNDS=8;       // uploads in one sync
const TC_PUSH_TIMEOUT_MS=45000;
const TC_IDLE_SYNC_MS=90000;  // a walk that has gone quiet sends what it has
const TC_DONE_SHOW=7;         // a finished check stays on the crew's list this many days
const TC_TZ_MS=8*3600000;     // the farm's time: UTC+8, no summer time. Every stamp of a tree row is written in it.
const TC_SKEW_MS=5000;        // the kept difference to the Sheet's clock is replaced only by a measurement that cannot agree with it: further than this plus half the time the answer took
const TC_BACK_MAX=30000;      // a row is never placed before the one this phone keyed just before it, when the step back is no more than this
const TC_CLOCK_EVERY_MS=1800000;  // the Sheet is asked the time at most this often in one session
const TC_CLOCK_TIMEOUT_MS=12000;
const TC_DTAP_MS=350;         // a second tap on the same control inside this is the other half of a double tap
const TC_TAP_MS=500;          // after a tap that changes the tree on the form, the next tap is not taken for this long
const TC_SYNC_EVERY=10;       // a walk with no pause still sends what it has every so many trees
const TC_PAGES=8;             // pages of the tree tab read in one sync
/* The questions. Wording: from the codes of the September sample and the diagnostic checklist in
   the season plan; the Owner is the agronomist and corrects any line. `must` = answered on every
   tree; the others are tapped only when seen. */
const TC_Q=[
  {id:'leaf',must:1,en:'Leaf colour',ms:'Warna daun',
   how:['Look at the old leaves in the middle of the tree, not the new shoots.','Lihat daun tua di tengah pokok, bukan pucuk baru.'],
   o:[['1','pale','pucat','pale, yellowish','pucat, kekuningan'],['2','','','',''],['3','green','hijau','normal green','hijau biasa'],['4','','','',''],['5','dark, soft','gelap, lembut','very dark, big, soft','hijau gelap, besar, lembut']]},
  {id:'canopy',must:1,en:'Canopy',ms:'Kanopi',
   how:['Stand under the tree and look up.','Berdiri di bawah pokok dan pandang ke atas.'],
   o:[['1','thin','nipis','thin: you see a lot of sky','nipis: banyak nampak langit'],['2','medium','sederhana','medium','sederhana'],['3','dense','lebat','dense: almost no sky','lebat: hampir tak nampak langit']]},
  {id:'light',must:1,en:'Sunlight on the tree',ms:'Cahaya matahari pada pokok',bad:'S',
   how:['Look at the trees around it. Does anything stand between this tree and the sun?','Lihat pokok di keliling. Ada apa-apa menghalang matahari?'],
   o:[['O','open','terbuka','open: sun most of the day','terbuka: kena matahari hampir sepanjang hari'],['P','part','separa','part: shaded for part of the day, or on one side','separa: terlindung sebahagian hari, atau sebelah sahaja'],['S','shaded','terlindung','shaded: under or between bigger trees','terlindung: di bawah atau di celah pokok besar']]},
  {id:'hose',must:1,en:'Does the hose reach this tree?',ms:'Hos sampai ke pokok ini?',bad:'N',yn:1,
   how:['Pull the hose from the nearest tap to the foot of the tree.','Tarik hos dari paip terdekat ke pangkal pokok.'],
   o:[['Y','YES','YA','YES: it reaches the trunk','YA: sampai ke pangkal'],['N','NO','TIDAK','NO: it stops short','TIDAK: tak sampai']]},
  {id:'canker',en:'Canker or gum on the trunk',ms:'Kanker atau getah di batang',
   how:['Walk once around the trunk. Look from the ground up to the first branches. Moss can hide it: look where the moss is dark, wet or gone.','Pusing sekali keliling batang. Lihat dari tanah hingga dahan pertama. Lumut boleh menutupnya: cari tempat lumut gelap, basah atau hilang.'],
   o:[['✓','','','a dark wet patch, or gum running down','tompok gelap dan basah, atau getah meleleh']]},
  {id:'borer',en:'Borer holes',ms:'Lubang ulat pengorek',
   how:['Look at the bark of the trunk and the big branches.','Lihat kulit batang dan dahan besar.'],
   o:[['✓','','','small holes in the bark, with wood dust below','lubang kecil pada kulit, ada habuk kayu di bawahnya']]},
  {id:'dieback',en:'Dieback: dead branch tips',ms:'Mati rosot: hujung dahan mati',
   how:['Look at the top and the outside of the crown.','Lihat bahagian atas dan luar kanopi.'],
   o:[['✓','','','branch tips dry, with no leaves','hujung dahan kering, tiada daun']]},
  {id:'wet',en:'Standing water, soggy ground',ms:'Air bertakung, tanah becak',
   how:['Look at the ground around the foot of the tree.','Lihat tanah di keliling pangkal pokok.'],
   o:[['✓','','','water standing, or mud that sinks under the boot','air bertakung, atau lumpur yang jerlus dipijak']]},
  {id:'flush',fl:1,en:'The newest leaves on this tree',ms:'Daun paling baru pada pokok ini',
   how:['Look at the newest leaves at the tips of the branches.','Lihat daun paling baru di hujung dahan.'],
   o:[['0','no new shoot','tiada pucuk','no new shoot','tiada pucuk baru'],
      ['1','new shoot','pucuk baru','new shoots just out, red','pucuk baru keluar, merah'],
      ['2','long tail','daun memanjang','long red leaves, hanging','daun panjang, merah, terkulai'],
      ['3','leaves open','daun renggang','light green, leaves open and apart','hijau muda, daun terbuka, jarak antara daun'],
      ['4','mature, hard','matang, keras','dark green, hard','hijau tua, keras']]}];
const TC_RULES=[
  ['Start in Lot A. Follow the tree numbers.','Mula di Lot A. Ikut nombor pokok.'],
  ['One tree at a time. Walk once around the trunk, then look up.','Satu pokok satu masa. Pusing sekali keliling batang, kemudian pandang ke atas.'],
  ['Key what you see today, not what you remember.','Masukkan apa yang nampak hari ini, bukan yang diingat.'],
  ['Not sure? Press NOT SURE and take a photo. The manager decides.','Tak pasti? Tekan TAK PASTI dan ambil gambar. Pengurus tentukan.'],
  ['A tree you cannot reach: press "Cannot check this tree".','Pokok yang tak dapat didekati: tekan "Tak dapat semak pokok ini".']];
/* the five pictures of the practice: which question, which drawing, the right answer */
const TC_QUIZ=[{q:'canopy',a:'1'},{q:'light',a:'S'},{q:'leaf',a:'5'},{q:'flush',a:'3'},{q:'hose',a:'N'}];
Object.assign(EN,{m_tsv:'Trees', m_tsv_d:'The tree survey, the Friday flush and the checks you issue',
  sy_l_trees:'Tree checks', bg_notsure:'NOT SURE', bg_tclate:'CHECK LATE',
  cd_a_tcun:'Tree answers marked NOT SURE', cd_s_tcun:'the staff could not decide — look at the photo and answer', cd_w_tcun:'DECIDE',
  cd_a_tclate:'Tree check past its day', cd_s_tclate:'issued to the crew and not finished', cd_w_tclate:'LATE',
  my_k_tree:'tree check', ts_prog_w:'sets and tree checks issued to you'});
Object.assign(MS,{m_tsv:'Pokok', m_tsv_d:'Banci pokok, semakan pucuk Jumaat dan semakan yang anda keluarkan',
  sy_l_trees:'Semakan pokok', bg_notsure:'TAK PASTI', bg_tclate:'SEMAKAN LEWAT',
  cd_a_tcun:'Jawapan pokok ditanda TAK PASTI', cd_s_tcun:'pekerja tak dapat tentukan — lihat gambar dan jawab', cd_w_tcun:'TENTUKAN',
  cd_a_tclate:'Semakan pokok lewat', cd_s_tclate:'dikeluarkan kepada pekerja dan belum siap', cd_w_tclate:'LEWAT',
  my_k_tree:'semak pokok', ts_prog_w:'set dan semak pokok'});
