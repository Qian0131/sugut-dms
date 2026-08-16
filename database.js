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

const CLONES=['MK','BT','B24','101','UM','TB'];

const CLONE_NAME={MK:'Musang King',BT:'Black Thorn',B24:'B24','101':'101',UM:'Udang Merah',TB:'TB (unverified)','':'Not recorded'};

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

const AVG_KG = {MK:1.7,BT:1.9,B24:1.6,'101':1.5,UM:1.4,TB:1.9};

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
   current_credit_balance_rm:0,     status:'Active', pricing:'SPOT'}
];

/* The contract book, one matrix per merchant, keyed by retailer id.
   B24 and TB are NOT in either negotiated brief. B24 was agreed on 3 Aug to
   follow 101 / UM, and TB is the unidentified clone sold on the same
   2-grade ladder — both mirror the 101 / UM line in each contract so a
   basket of them can never invoice at RM 0. Correct them in
   Marketing -> PRICES & RETAILERS when the buyer confirms a rate. */
const RETAILER_CONTRACT_SEED={
  'RT-01':{                        // Roll — the alliance rates
    MK   :{A:40, B:30, C:25},
    BT   :{A:45, B:35},
    B24  :{A:25, B:20},
    '101':{A:25, B:20},
    UM   :{A:25, B:20},
    TB   :{A:25, B:20}
  },
  'RT-02':{                        // Seng Kee — RM 1-2 above Roll across the book
    MK   :{A:42, B:32, C:26},
    BT   :{A:47, B:36},
    B24  :{A:26, B:21},
    '101':{A:26, B:21},
    UM   :{A:26, B:21},
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
const CLONE_SELL_ORDER=['MK','BT','B24','101','UM','TB'];
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
  TB   :['A','B','BN']   // unverified clone — sold on the 2-grade ladder until identified
};
const BAND_TOP={min:1.5,max:null};      // >= 1.5 kg
/* ⚠ NO 'BN' ROW HERE, ON PURPOSE — see the note on GRADE_META. Banana is a
   SHAPE grade judged by eye; giving it a weight window would re-arm the
   grade-versus-weight drift warning on every banana fruit. */
const GRADE_BAND={
  MK   :{A:{min:1.5,max:null}, B:{min:1.0,max:1.5}, C:{min:0,max:1.0}},
  BT   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  B24  :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  '101':{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  UM   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
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
  UM   :{A:25, B:20,       BN:8 },  // Udang Merah
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
