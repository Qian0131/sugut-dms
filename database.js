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

const INVENTORY_RECON=[{"id":1,"name":"Amotan 22.8SC","active_ingredient":"(confirm \u2014 see label)","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":105,"cpu":0.21,"min_stock_threshold":500,"stock":4000},{"id":2,"name":"Cypermethrin 5.5 (Kencis)","active_ingredient":"Cypermethrin 5.5%","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":18,"cpu":0.018,"min_stock_threshold":1000,"stock":5000},{"id":3,"name":"Fipronil (Rainnil)","active_ingredient":"Fipronil","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":70,"cpu":0.07,"min_stock_threshold":1000,"stock":4000},{"id":4,"name":"Madell","active_ingredient":"(confirm \u2014 see label)","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":88,"cpu":0.088,"min_stock_threshold":1000,"stock":0},{"id":5,"name":"Abamectin (Envoy)","active_ingredient":"Abamectin","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":45,"cpu":0.045,"min_stock_threshold":1000,"stock":6000},{"id":6,"name":"Mancozeb (Raincozeb 80WB)","active_ingredient":"Mancozeb 80%","cat":"Fungicide","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":25,"cpu":0.025,"min_stock_threshold":1000,"stock":2000},{"id":7,"name":"Arimo 23EC","active_ingredient":"(confirm \u2014 see label)","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":78,"cpu":0.156,"min_stock_threshold":500,"stock":500},{"id":8,"name":"Agus 24SC","active_ingredient":"(confirm \u2014 see label)","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":85,"cpu":0.17,"min_stock_threshold":500,"stock":500},{"id":9,"name":"Aliette (ribut petir)","active_ingredient":"Fosetyl-aluminium 80%","cat":"Fungicide","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":150,"cpu":0.15,"min_stock_threshold":1000,"stock":2000},{"id":10,"name":"AMG mix","active_ingredient":"Amino acid + Magnesium mix","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":68,"cpu":0.068,"min_stock_threshold":1000,"stock":0},{"id":11,"name":"Wuzal Ascofol","active_ingredient":"Seaweed extract (Ascophyllum nodosum)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":265,"cpu":0.053,"min_stock_threshold":5000,"stock":0},{"id":12,"name":"Wuzal ZN","active_ingredient":"Zinc (chelated)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":395,"cpu":0.079,"min_stock_threshold":5000,"stock":0},{"id":13,"name":"Wuxal Ascofol CAB","active_ingredient":"Seaweed extract + Calcium + Boron","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":260,"cpu":0.052,"min_stock_threshold":5000,"stock":5000},{"id":14,"name":"A Zinc Mix","active_ingredient":"Zinc mix","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":70,"cpu":0.07,"min_stock_threshold":1000,"stock":6000},{"id":15,"name":"Xilca","active_ingredient":"Calcium + Silicon","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":60.83,"cpu":0.06083,"min_stock_threshold":1000,"stock":2000},{"id":16,"name":"Flora","active_ingredient":"Boron (foliar)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":82.5,"cpu":0.0825,"min_stock_threshold":1000,"stock":4000},{"id":17,"name":"Vitanica","active_ingredient":"Seaweed / amino acid complex","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":2500,"unit_price":133.33,"cpu":0.053332,"min_stock_threshold":2500,"stock":0},{"id":18,"name":"Stunza","active_ingredient":"(confirm \u2014 see label)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":0},{"id":19,"name":"Calcifol","active_ingredient":"Calcium + Boron (foliar)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":230,"cpu":0.046,"min_stock_threshold":5000,"stock":4000},{"id":20,"name":"Heromix T1","active_ingredient":"Foliar nutrient mix (T1)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":210,"cpu":0.042,"min_stock_threshold":5000,"stock":1000},{"id":21,"name":"Auxi-Pro","active_ingredient":"Auxin (plant hormone)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":7000},{"id":22,"name":"Cyto-Plus","active_ingredient":"Cytokinin (plant hormone)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":75,"cpu":0.075,"min_stock_threshold":1000,"stock":8000},{"id":23,"name":"Carboxamin","active_ingredient":"Amino acids","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":70.83,"cpu":0.07083,"min_stock_threshold":1000,"stock":5500},{"id":24,"name":"Sorbix","active_ingredient":"Sorbitol carrier + Boron","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":75,"cpu":0.075,"min_stock_threshold":1000,"stock":6000},{"id":25,"name":"A Plus Cal","active_ingredient":"Calcium (powder)","cat":"Powder","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":72,"cpu":0.072,"min_stock_threshold":1000,"stock":5000},{"id":26,"name":"AZ Plus","active_ingredient":"Amino acid + Zinc","cat":"Powder","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":95,"cpu":0.095,"min_stock_threshold":1000,"stock":1000},{"id":27,"name":"Brightstar PBZ","active_ingredient":"Paclobutrazol","cat":"Growth Reg","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":108.33,"cpu":0.10833,"min_stock_threshold":1000,"stock":3000},{"id":28,"name":"GA3 (Gibberlic Acid)","active_ingredient":"Gibberellic acid (GA3)","cat":"Growth Reg","container":"pack","unit":"tablets","unit_multiplier":10,"unit_price":95,"cpu":9.5,"min_stock_threshold":10,"stock":29},{"id":29,"name":"Yara MKP","active_ingredient":"Mono potassium phosphate 0-52-34","cat":"Foliar","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":300,"cpu":0.012,"min_stock_threshold":50000,"stock":20000},{"id":30,"name":"Hero Max (Sticker)","active_ingredient":"Non-ionic surfactant / sticker","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":200,"cpu":0.04,"min_stock_threshold":5000,"stock":0},{"id":31,"name":"Entrust 18SL (Racun rumput)","active_ingredient":"(confirm \u2014 see label)","cat":"Herbicide","container":"bottle","unit":"ml","unit_multiplier":20000,"unit_price":250,"cpu":0.0125,"min_stock_threshold":20000,"stock":0},{"id":32,"name":"Yara Liva Tropicote","active_ingredient":"Calcium nitrate 15.5-0-0 + 26.5 CaO","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":80,"cpu":0.0032,"min_stock_threshold":50000,"stock":175000},{"id":33,"name":"Yara Liva Nitrobor","active_ingredient":"Calcium nitrate + Boron","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":99,"cpu":0.00396,"min_stock_threshold":50000,"stock":75000},{"id":34,"name":"Yara Mila 12-12-17","active_ingredient":"NPK 12-12-17 + 2MgO","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":230,"cpu":0.0046,"min_stock_threshold":100000,"stock":200000},{"id":35,"name":"Yara Tera Krista Mgs","active_ingredient":"Magnesium sulphate (MgS)","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":55,"cpu":0.0022,"min_stock_threshold":50000,"stock":140000},{"id":36,"name":"Garsoni 8-24-24","active_ingredient":"NPK 8-24-24","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":235,"cpu":0.0047,"min_stock_threshold":100000,"stock":20000},{"id":37,"name":"Polysulphate","active_ingredient":"Polyhalite (K, Ca, Mg, S)","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":90,"cpu":0.0018,"min_stock_threshold":100000,"stock":250000},{"id":38,"name":"Nutrigem","active_ingredient":"NPK compound (Nutrigem)","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":40000,"unit_price":34.6,"cpu":0.000865,"min_stock_threshold":80000,"stock":0},{"id":39,"name":"Herocris Nexus 5-25-25-2MGO","active_ingredient":"NPK 5-25-25 + 2MgO","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":300,"cpu":0.012,"min_stock_threshold":50000,"stock":60000},{"id":40,"name":"Basfoliar","active_ingredient":"Foliar NPK + micronutrients","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":2500,"unit_price":138.34,"cpu":0.055336,"min_stock_threshold":2500,"stock":15000},{"id":41,"name":"Plantara","active_ingredient":"(confirm \u2014 see label)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":11000},{"id":42,"name":"Raizon Max","active_ingredient":"Rooting / humic complex","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":7000},{"id":43,"name":"Yara Calcinit (CN)","active_ingredient":"Calcium nitrate 15.5-0-0","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":90,"cpu":0.0036,"min_stock_threshold":50000,"stock":20000},{"id":44,"name":"Fetto 480","active_ingredient":"(confirm \u2014 see label) \u00b7 fruit-contact, 14-day PHI","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":160,"cpu":0.32,"min_stock_threshold":500,"stock":0},{"id":45,"name":"Pictor","active_ingredient":"Boscalid + Dimoxystrobin \u00b7 fruit-contact, 14-day PHI","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":0},{"id":46,"name":"Marshal 20SC","active_ingredient":"Carbosulfan 20%","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":500},{"id":47,"name":"Betakal Amino","active_ingredient":"Amino acid + Potassium","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":5000,"unit_price":205,"cpu":0.041,"min_stock_threshold":5000,"stock":10000},{"id":48,"name":"Ardel","active_ingredient":"(confirm \u2014 see label)","cat":"Fungicide","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":0,"cpu":0,"min_stock_threshold":1000,"stock":0},{"id":49,"name":"Pengasus 47.17sc","active_ingredient":"(confirm \u2014 see label)","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":75,"cpu":0.15,"min_stock_threshold":500,"stock":0},{"id":50,"name":"Azatin","active_ingredient":"Azadirachtin","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":85,"cpu":0.17,"min_stock_threshold":500,"stock":1000},{"id":51,"name":"Match","active_ingredient":"Lufenuron 50 g/L","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":500,"unit_price":130,"cpu":0.26,"min_stock_threshold":500,"stock":2000},{"id":52,"name":"Zinc (powder)","active_ingredient":"Zinc sulphate","cat":"Fertiliser","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":0,"cpu":0,"min_stock_threshold":1000,"stock":0},{"id":53,"name":"Yara Rega 13-4-25","active_ingredient":"NPK 13-4-25","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":285,"cpu":0.0114,"min_stock_threshold":50000,"stock":10000},{"id":54,"name":"Yara Tera Kristalon 13-40-13","active_ingredient":"NPK 13-40-13","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":25000},{"id":55,"name":"A Zinc (Year 2023)","active_ingredient":"Zinc mix","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":1000},{"id":56,"name":"Nutrimix Complete (AZ PLUS)","active_ingredient":"Complete micronutrient mix","cat":"Foliar","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":77,"cpu":0.077,"min_stock_threshold":1000,"stock":3000},{"id":57,"name":"Ultra Bor (Flora)","active_ingredient":"Boron","cat":"Foliar","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":65,"cpu":0.065,"min_stock_threshold":1000,"stock":3000},{"id":58,"name":"Anmi 4.8SC","active_ingredient":"(confirm \u2014 see label)","cat":"Foliar","container":"bottle","unit":"ml","unit_multiplier":1000,"unit_price":85,"cpu":0.085,"min_stock_threshold":1000,"stock":1000},{"id":59,"name":"VS 34","active_ingredient":"(confirm \u2014 see label)","cat":"Foliar","container":"pack","unit":"gm","unit_multiplier":1000,"unit_price":0,"cpu":0,"min_stock_threshold":1000,"stock":1000},{"id":60,"name":"Abinsec 1.8EC","active_ingredient":"Abamectin 1.8%","cat":"Pesticide","container":"bottle","unit":"ml","unit_multiplier":4000,"unit_price":85,"cpu":0.02125,"min_stock_threshold":4000,"stock":5000},{"id":61,"name":"Basaplant Orange 14-5-30","active_ingredient":"NPK 14-5-30","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":25000},{"id":62,"name":"Hydrospeed Yield 3-14-37","active_ingredient":"NPK 3-14-37","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":50000},{"id":63,"name":"Yara Mila 12-11-18","active_ingredient":"NPK 12-11-18","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":50000,"unit_price":230,"cpu":0.0046,"min_stock_threshold":100000,"stock":350000},{"id":64,"name":"Yara Tera 18-18-18","active_ingredient":"NPK 18-18-18","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":295,"cpu":0.0118,"min_stock_threshold":50000,"stock":50000},{"id":65,"name":"Florica 21-21-21","active_ingredient":"NPK 21-21-21","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":250,"cpu":0.01,"min_stock_threshold":50000,"stock":25000},{"id":66,"name":"Ge Rocket 9-14-9","active_ingredient":"NPK 9-14-9","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":25000,"unit_price":78,"cpu":0.00312,"min_stock_threshold":50000,"stock":6000},{"id":67,"name":"MSolumax 3-16-36","active_ingredient":"NPK 3-16-36","cat":"Fertiliser","container":"bag","unit":"gm","unit_multiplier":8000,"unit_price":85,"cpu":0.010625,"min_stock_threshold":16000,"stock":52000},{"id":68,"name":"Tying rope / string","active_ingredient":"","cat":"Consumable","container":"roll","unit":"m","unit_multiplier":500,"unit_price":0,"cpu":0,"min_stock_threshold":500,"stock":0}];

const PRODUCTS=INVENTORY_RECON;   // Phase-1/2 alias — same array reference

const PHASE_PROGRAM=[{"id":"2026 Jan (2)|Fert Set 1","month":"2026 Jan (2)","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-02-04","lines":[{"raw":"Calcium nitrate","pid":43,"qty":1000.0,"unit":"gm","ai":""}]},{"id":"2026 Jan (2)|Fert Set 2","month":"2026 Jan (2)","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-02-18","lines":[{"raw":"8-24-24","pid":36,"qty":1000.0,"unit":"gm","ai":""},{"raw":"poly sulphate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"2026 Jan (2)|Fert Set 3","month":"2026 Jan (2)","set":"Fert Set 3","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-03-03","lines":[{"raw":"8-24-24","pid":36,"qty":1500.0,"unit":"gm","ai":""}]},{"id":"March|Fert Set 1","month":"March","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-03-04","lines":[{"raw":"8 24 24","pid":36,"qty":1000.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"March|Fert Set 2","month":"March","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-03-18","lines":[{"raw":"8 24 24","pid":36,"qty":1500.0,"unit":"gm","ai":""}]},{"id":"April|Set 1","month":"April","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside branches (induce more bud eye)","basis":"PER_1000L","litresPerTree":null,"plan":"2026-04-09","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Fipronil","pid":3,"qty":1000.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":1500.0,"unit":"gm","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"CaO"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":"Seaweed"},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":""}]},{"id":"April|Set 2","month":"April","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside the branches","basis":"PER_1000L","litresPerTree":null,"plan":"2026-04-16","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Fipronil","pid":3,"qty":1000.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":1500.0,"unit":"gm","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":""},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":""}]},{"id":"April|Set 3","month":"April","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"Spray outside the leaf (induce 1 layer new leaf)","basis":"PER_1000L","litresPerTree":null,"plan":"2026-04-20","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Ardel","pid":48,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Calcinit","pid":43,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":""},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":""}]},{"id":"April|Fert Set 1","month":"April","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-04-19","lines":[{"raw":"Calcinit","pid":43,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Nutrigm","pid":38,"qty":10000.0,"unit":"gm","ai":""}]},{"id":"May|Set 1","month":"May","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside and outside whole tree( induce new leaf)","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"calcinit","pid":43,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":"seaweed"},{"raw":"AZ plus","pid":26,"qty":1000.0,"unit":"ml","ai":"TE"}]},{"id":"May|Set 2","month":"May","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray flower and leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-05-06","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":""},{"raw":"Mardel","pid":4,"qty":1000.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":2000.0,"unit":"gm","ai":""},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"CaO"},{"raw":"flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"vitanica","pid":17,"qty":1000.0,"unit":"ml","ai":"Seaweed"}]},{"id":"May|Fert Set 1","month":"May","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-05-02","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"May 2|Set 1","month":"May 2","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray flower only","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"Stunza","pid":18,"qty":250.0,"unit":"ml","ai":"MEP"},{"raw":"PBZ","pid":27,"qty":250.0,"unit":"ml","ai":""},{"raw":"CalCifol","pid":19,"qty":1000.0,"unit":"ml","ai":"Calcum"},{"raw":"Heromix T1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"},{"raw":"Auxi-pro","pid":21,"qty":500.0,"unit":"ml","ai":""},{"raw":"cyto-plus","pid":22,"qty":250.0,"unit":"ml","ai":""},{"raw":"5 25 25","pid":39,"qty":1000.0,"unit":"gm","ai":""}]},{"id":"May 2|Set 2","month":"May 2","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray Outside leaf","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"Stunza","pid":18,"qty":1000.0,"unit":"ml","ai":"MEP"},{"raw":"PBZ","pid":27,"qty":500.0,"unit":"ml","ai":""},{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Heromix T1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"},{"raw":"Carboxamin","pid":23,"qty":1000.0,"unit":"ml","ai":"Amino"}]},{"id":"May 2|Set 3","month":"May 2","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"Spray flower","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"Abamectin","pid":5,"qty":1000.0,"unit":"ml","ai":""},{"raw":"Auxi-pro","pid":21,"qty":500.0,"unit":"ml","ai":""},{"raw":"cyto-plus","pid":22,"qty":250.0,"unit":"ml","ai":""},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":""},{"raw":"MKP","pid":29,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"A Zinc mix","pid":14,"qty":1000.0,"unit":"ml","ai":"Zinc"}]},{"id":"May 2|Fert Set 1","month":"May 2","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-05-18","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""}]},{"id":"May 2|Fert Set 2","month":"May 2","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-06-03","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"June|Set 1","month":"June","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray outside leaf","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"Arimo","pid":7,"qty":500.0,"unit":"ml","ai":"Difenoconazole"},{"raw":"Pengasus 47.17sc","pid":49,"qty":500.0,"unit":"ml","ai":"Difenthiuron"},{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Stunza","pid":18,"qty":1000.0,"unit":"ml","ai":"MEP (stunt)"},{"raw":"Raizon Max","pid":42,"qty":500.0,"unit":"ml","ai":"Hero"},{"raw":"Heromix T1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"}]},{"id":"June|Set 2","month":"June","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside (branches and fruit)","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"Azatin","pid":50,"qty":500.0,"unit":"ml","ai":"Azoxystrobin"},{"raw":"Match","pid":51,"qty":500.0,"unit":"ml","ai":"Lufenuron"},{"raw":"5 25 25","pid":39,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Auxi-Pro","pid":21,"qty":500.0,"unit":"ml","ai":"Fruit (NAA)"},{"raw":"Cyto-Plus","pid":22,"qty":250.0,"unit":"ml","ai":"Fruity (CPPU)"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":"Zinc"}]},{"id":"June|Set 3","month":"June","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"Fetto 480","pid":44,"qty":500.0,"unit":"ml","ai":"Metalaxyl"},{"raw":"Pictor","pid":45,"qty":1000.0,"unit":"ml","ai":"emmamectin benzoate"},{"raw":"5 25 25","pid":39,"qty":1000.0,"unit":"gm","ai":""},{"raw":"Auxi-Pro","pid":21,"qty":500.0,"unit":"ml","ai":"Fruit (NAA)"},{"raw":"Cyto-Plus","pid":22,"qty":250.0,"unit":"ml","ai":"Fruity (CPPU)"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"A zin mix","pid":14,"qty":1000.0,"unit":"ml","ai":"Zinc"}]},{"id":"June|Fert Set 1","month":"June","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-06-03","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulfate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"June|Fert Set 2","month":"June","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-06-17","lines":[{"raw":"13 4 25","pid":53,"qty":1000.0,"unit":"gm","ai":""}]},{"id":"June 2|Set 1","month":"June 2","set":"Set 1","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree)","basis":"PER_1000L","litresPerTree":10.0,"plan":"","lines":[{"raw":"5 25 25","pid":39,"qty":5000.0,"unit":"gm","ai":""},{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":""},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}]},{"id":"June 2|Set 2","month":"June 2","set":"Set 2","kind":"FOLIAR","mode":"SPRAY","header":"Spray inside","basis":"PER_1000L","litresPerTree":null,"plan":"","lines":[{"raw":"Fetto 480","pid":44,"qty":500.0,"unit":"ml","ai":"Metalaxy"},{"raw":"Marshal 20sc","pid":46,"qty":1000.0,"unit":"ml","ai":"Carbosulfan"},{"raw":"5 25 25","pid":39,"qty":2000.0,"unit":"gm","ai":""},{"raw":"Plantara","pid":41,"qty":500.0,"unit":"ml","ai":"Brassinolide"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"flora","pid":16,"qty":1000.0,"unit":"ml","ai":"boron"},{"raw":"sorbix","pid":24,"qty":500.0,"unit":"gm","ai":"Sorbital"},{"raw":"A zinc mix","pid":14,"qty":1000.0,"unit":"ml","ai":"zinc"}]},{"id":"July|Set 1","month":"July","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Leaf and branches","basis":"PER_1000L","litresPerTree":null,"plan":"2026-07-06","lines":[{"raw":"Anmi 4.8SC","pid":58,"qty":1000.0,"unit":"ml","ai":"Hexaconazole"},{"raw":"Madell","pid":4,"qty":1000.0,"unit":"ml","ai":"Carbosulfan"},{"raw":"5 25 25","pid":39,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Raizo max","pid":42,"qty":500.0,"unit":"ml","ai":"Triacontanol"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Heromix T 1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"}]},{"id":"July|Set 3","month":"July","set":"Set 3","kind":"FOLIAR","mode":"SPRAY","header":"Spray leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-07-13","lines":[{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Stunza","pid":18,"qty":1000.0,"unit":"ml","ai":"MEP"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"floara","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}]},{"id":"July|Set 4","month":"July","set":"Set 4","kind":"FOLIAR","mode":"SPRAY","header":"spray fruit and leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-07-20","lines":[{"raw":"Fetto 480","pid":44,"qty":1000.0,"unit":"ml","ai":"Metalaxy"},{"raw":"Pictor","pid":45,"qty":1000.0,"unit":"ml","ai":"emmamectin benzoate"},{"raw":"3 16 36","pid":67,"qty":2000.0,"unit":"gm","ai":""},{"raw":"Raizo max","pid":42,"qty":1000.0,"unit":"ml","ai":"Triacontanol"},{"raw":"carboxamin","pid":23,"qty":1000.0,"unit":"ml","ai":"amino"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"flora","pid":16,"qty":1000.0,"unit":"ml","ai":"boron"}]},{"id":"July|Fert Set 1","month":"July","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-07-02","lines":[{"raw":"5 25 25","pid":39,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulphate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"July|Fert Set 2","month":"July","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-07-17","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""}]},{"id":"Aug|Set 1","month":"Aug","set":"Set 1","kind":"FOLIAR","mode":"SPRAY","header":"Spray fruit and leaf","basis":"PER_1000L","litresPerTree":null,"plan":"2026-08-06","lines":[{"raw":"Fetto 480","pid":44,"qty":1000.0,"unit":"ml","ai":"Metalaxyl"},{"raw":"Pictor","pid":45,"qty":1000.0,"unit":"ml","ai":"emmamectin benzoate"},{"raw":"3 16 36","pid":67,"qty":2000.0,"unit":"gm","ai":""},{"raw":"Raizo max","pid":42,"qty":500.0,"unit":"ml","ai":"Triacontanol"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"Heromix T 1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"}]},{"id":"Aug|Set 2","month":"Aug","set":"Set 2","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree)","basis":"PER_1000L","litresPerTree":10.0,"plan":"2026-08-13","lines":[{"raw":"3 16 36","pid":67,"qty":5000.0,"unit":"gm","ai":""},{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":"Amino"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}]},{"id":"Aug|Set 3","month":"Aug","set":"Set 3","kind":"FOLIAR","mode":"LEAF","header":"Spray leaf only - NO fruit","basis":"PER_1000L","litresPerTree":null,"plan":"2026-08-20","lines":[{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"carboxamin","pid":23,"qty":1000.0,"unit":"ml","ai":"amino"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"floara","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}]},{"id":"Aug|Set 4","month":"Aug","set":"Set 4","kind":"FOLIAR","mode":"LEAF","header":"Spray leaf only - NO fruit","basis":"PER_1000L","litresPerTree":null,"plan":"2026-08-27","lines":[{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Raizo max","pid":42,"qty":500.0,"unit":"ml","ai":"Triacontanol"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"calcium"},{"raw":"flora","pid":16,"qty":1000.0,"unit":"ml","ai":"boron"}]},{"id":"Aug|Set 5","month":"Aug","set":"Set 5","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree)","basis":"PER_1000L","litresPerTree":10.0,"plan":"2026-08-31","lines":[{"raw":"3 16 36","pid":67,"qty":5000.0,"unit":"gm","ai":""},{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":"Amino"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"}]},{"id":"Aug|Fert Set 1","month":"Aug","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-08-03","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulphate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"Aug|Fert Set 2","month":"Aug","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-08-18","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""}]},{"id":"Sep|Set 1","month":"Sep","set":"Set 1","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree)","basis":"PER_1000L","litresPerTree":10.0,"plan":"2026-09-03","lines":[{"raw":"3 16 36","pid":67,"qty":5000.0,"unit":"gm","ai":""},{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":"Amino"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Flora","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"}]},{"id":"Sep|Set 2","month":"Sep","set":"Set 2","kind":"FOLIAR","mode":"LEAF","header":"Spray leaf only - NO fruit","basis":"PER_1000L","litresPerTree":null,"plan":"2026-09-10","lines":[{"raw":"MKP","pid":29,"qty":2500.0,"unit":"gm","ai":""},{"raw":"Sorbix","pid":24,"qty":500.0,"unit":"ml","ai":"Sorbital"},{"raw":"xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"floara","pid":16,"qty":1000.0,"unit":"ml","ai":"Boron"},{"raw":"Heromix T 1","pid":20,"qty":1000.0,"unit":"ml","ai":"TE"}]},{"id":"Sep|Set 3","month":"Sep","set":"Set 3","kind":"FOLIAR","mode":"DRENCH","header":"Soil Drenching (10 liter per tree) - post-peak recovery","basis":"PER_1000L","litresPerTree":10.0,"plan":"2026-09-28","lines":[{"raw":"Calcinit","pid":43,"qty":5000.0,"unit":"gm","ai":"Calcium nitrate"},{"raw":"Betakal Amino","pid":47,"qty":5000.0,"unit":"ml","ai":"Amino"},{"raw":"Xilca","pid":15,"qty":1000.0,"unit":"ml","ai":"Calcium"},{"raw":"Raizo max","pid":42,"qty":500.0,"unit":"ml","ai":"Triacontanol"}]},{"id":"Sep|Fert Set 1","month":"Sep","set":"Fert Set 1","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-09-01","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""},{"raw":"polysulphate","pid":37,"qty":500.0,"unit":"gm","ai":""}]},{"id":"Sep|Fert Set 2","month":"Sep","set":"Fert Set 2","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-09-15","lines":[{"raw":"3 16 36","pid":67,"qty":500.0,"unit":"gm","ai":""}]},{"id":"Sep|Fert Set 3","month":"Sep","set":"Fert Set 3","kind":"FERT","mode":"SOIL","header":"Fertilizer input — broadcast per tree","basis":"PER_TREE","litresPerTree":null,"plan":"2026-09-29","lines":[{"raw":"Calcinit","pid":43,"qty":500.0,"unit":"gm","ai":""}]}];

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

const PHI_PRODUCTS = {'Fetto 480':14,'Pictor':14}; // days before harvest — from SPRAY_PROGRAM FruitContact/PHIDays

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
  ['phosphonate','systemic phosphonate']];

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
  ['mono potassium','soluble foliar salt — washes off']];

const BP_CATS={PND:['Pesticide','Fungicide','Herbicide'],FOLIAR:['Foliar'],
  BIO:['Foliar','Growth Reg'],TE:['Foliar','Powder'],MANURE:['Fertiliser','Powder']};

const BP_LABEL={PND:'PnD spray',FOLIAR:'Foliar feed',BIO:'Biostimulant',TE:'Trace element',MANURE:'Manuring'};

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
  HARVEST  :{label:'Harvest / peak drop',  ic:'🥭',note:'Collection. Spraying is the exception, not the rule.'}
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
   9. v2.8 — ROTTEN FRUIT CAUSES + HIGH-MOISTURE THRESHOLD
   A rotten count is never accepted without a cause: the reason is what
   turns a loss figure into an agronomic decision.
   ===================================================================== */
const ROT_ORDER=['ANIMAL','PEST','DISEASE'];
const ROT_CAUSE={
  ANIMAL :{label:'Animal damage',     ic:'🐿️',note:'squirrel, monkey, rat, civet'},
  PEST   :{label:'Pest infestation',  ic:'🐛',note:'fruit borer, weevil, fruit fly'},
  DISEASE:{label:'Disease rot',       ic:'🍄',note:'Phytophthora, anthracnose, stem-end rot'}
};
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
const TIE_MIGRATION=[{"t":"A-011","d":"2026-07-21","n":6,"u":"A11/07-21"},{"t":"A-011","d":"2026-07-27","n":5,"u":"A11/07-27"},{"t":"A-013","d":"2026-07-27","n":7,"u":"A13/07-27"},{"t":"A-023","d":"2026-07-27","n":4,"u":"A23/07-27"},{"t":"A-026","d":"2026-07-27","n":4,"u":"A26/07-27"},{"t":"A-027","d":"2026-07-27","n":7,"u":"A27/07-27"},{"t":"B-002","d":"2026-07-20","n":17,"u":"B2/07-20"},{"t":"B-002","d":"2026-07-26","n":15,"u":"B2/07-26"},{"t":"B-003","d":"2026-07-20","n":22,"u":"B3/07-20"},{"t":"B-003","d":"2026-07-26","n":10,"u":"B3/07-26"},{"t":"B-004","d":"2026-07-20","n":24,"u":"B4/07-20"},{"t":"B-004","d":"2026-07-26","n":27,"u":"B4/07-26"},{"t":"B-005","d":"2026-07-20","n":15,"u":"B5/07-20"},{"t":"B-005","d":"2026-07-22","n":2,"u":"B5/07-22"},{"t":"B-005","d":"2026-07-26","n":14,"u":"B5/07-26"},{"t":"B-006","d":"2026-07-20","n":20,"u":"B6/07-20"},{"t":"B-006","d":"2026-07-26","n":12,"u":"B6/07-26"},{"t":"B-007","d":"2026-07-14","n":18,"u":"B7/07-14"},{"t":"B-007","d":"2026-07-26","n":11,"u":"B7/07-26"},{"t":"B-008","d":"2026-07-20","n":24,"u":"B8/07-20"},{"t":"B-009","d":"2026-07-14","n":7,"u":"B9/07-14"},{"t":"B-009","d":"2026-07-26","n":19,"u":"B9/07-26"},{"t":"B-010","d":"2026-07-14","n":9,"u":"B10/07-14"},{"t":"B-010","d":"2026-07-26","n":1,"u":"B10/07-26"},{"t":"B-022","d":"2026-07-14","n":2,"u":"B22/07-14"},{"t":"B-023","d":"2026-07-14","n":14,"u":"B23/07-14"},{"t":"B-023","d":"2026-07-24","n":16,"u":"B23/07-24"},{"t":"B-024","d":"2026-07-14","n":1,"u":"B24/07-14"},{"t":"B-025","d":"2026-07-15","n":8,"u":"B25/07-15"},{"t":"B-025","d":"2026-07-24","n":22,"u":"B25/07-24"},{"t":"B-026","d":"2026-07-15","n":12,"u":"B26/07-15"},{"t":"B-026","d":"2026-07-24","n":13,"u":"B26/07-24"},{"t":"B-027","d":"2026-07-15","n":7,"u":"B27/07-15"},{"t":"B-027","d":"2026-07-24","n":19,"u":"B27/07-24"},{"t":"B-028","d":"2026-07-15","n":3,"u":"B28/07-15"},{"t":"B-028","d":"2026-07-22","n":14,"u":"B28/07-22"},{"t":"B-029","d":"2026-07-15","n":5,"u":"B29/07-15"},{"t":"B-029","d":"2026-07-22","n":12,"u":"B29/07-22"},{"t":"B-030","d":"2026-07-15","n":1,"u":"B30/07-15"},{"t":"B-030","d":"2026-07-22","n":8,"u":"B30/07-22"},{"t":"B-033","d":"2026-07-23","n":3,"u":"B33/07-23"},{"t":"B-035","d":"2026-07-23","n":4,"u":"B35/07-23"},{"t":"B-036","d":"2026-07-23","n":5,"u":"B36/07-23"},{"t":"B-037","d":"2026-07-23","n":3,"u":"B37/07-23"},{"t":"B-038","d":"2026-07-23","n":5,"u":"B38/07-23"},{"t":"B-039","d":"2026-07-23","n":8,"u":"B39/07-23"},{"t":"B-040","d":"2026-07-23","n":8,"u":"B40/07-23"},{"t":"B-041","d":"2026-07-16","n":21,"u":"B41/07-16"},{"t":"B-041","d":"2026-07-22","n":6,"u":"B41/07-22"},{"t":"B-042","d":"2026-07-16","n":1,"u":"B42/07-16"},{"t":"B-042","d":"2026-07-23","n":2,"u":"B42/07-23"},{"t":"B-043","d":"2026-07-16","n":7,"u":"B43/07-16"},{"t":"B-043","d":"2026-07-25","n":9,"u":"B43/07-25"},{"t":"B-044","d":"2026-07-16","n":18,"u":"B44/07-16"},{"t":"B-044","d":"2026-07-26","n":14,"u":"B44/07-26"},{"t":"B-045","d":"2026-07-16","n":24,"u":"B45/07-16"},{"t":"B-045","d":"2026-07-22","n":24,"u":"B45/07-22"},{"t":"B-046","d":"2026-07-19","n":10,"u":"B46/07-19"},{"t":"B-046","d":"2026-07-26","n":7,"u":"B46/07-26"},{"t":"B-047","d":"2026-07-19","n":23,"u":"B47/07-19"},{"t":"B-048","d":"2026-07-19","n":6,"u":"B48/07-19"},{"t":"B-051","d":"2026-07-14","n":4,"u":"B51/07-14"},{"t":"B-052","d":"2026-07-14","n":4,"u":"B52/07-14"},{"t":"B-054","d":"2026-07-17","n":18,"u":"B54/07-17"},{"t":"B-054","d":"2026-07-25","n":16,"u":"B54/07-25"},{"t":"B-055","d":"2026-07-17","n":3,"u":"B55/07-17"},{"t":"B-055","d":"2026-07-25","n":5,"u":"B55/07-25"},{"t":"B-057","d":"2026-07-26","n":1,"u":"B57/07-26"},{"t":"B-058","d":"2026-07-19","n":10,"u":"B58/07-19"},{"t":"B-058","d":"2026-07-25","n":7,"u":"B58/07-25"},{"t":"B-059","d":"2026-07-19","n":10,"u":"B59/07-19"},{"t":"B-061","d":"2026-07-24","n":1,"u":"B61/07-24"},{"t":"B-062","d":"2026-07-24","n":8,"u":"B62/07-24"},{"t":"B-064","d":"2026-07-24","n":4,"u":"B64/07-24"},{"t":"C-005","d":"2026-07-21","n":4,"u":"C5/07-21"},{"t":"C-005","d":"2026-07-27","n":4,"u":"C5/07-27"},{"t":"C-008","d":"2026-07-21","n":13,"u":"C8/07-21"},{"t":"C-008","d":"2026-07-27","n":9,"u":"C8/07-27"},{"t":"C-013","d":"2026-07-21","n":13,"u":"C13/07-21"},{"t":"C-013","d":"2026-07-27","n":9,"u":"C13/07-27"},{"t":"C-014","d":"2026-07-21","n":6,"u":"C14/07-21"},{"t":"C-015","d":"2026-07-21","n":9,"u":"C15/07-21"},{"t":"C-015","d":"2026-07-27","n":17,"u":"C15/07-27"},{"t":"C-017","d":"2026-07-21","n":16,"u":"C17/07-21"},{"t":"C-017","d":"2026-07-27","n":7,"u":"C17/07-27"},{"t":"C-018","d":"2026-07-21","n":6,"u":"C18/07-21"},{"t":"C-018","d":"2026-07-27","n":18,"u":"C18/07-27"},{"t":"C-020","d":"2026-07-21","n":6,"u":"C20/07-21"},{"t":"C-020","d":"2026-07-27","n":4,"u":"C20/07-27"},{"t":"C-021","d":"2026-07-27","n":3,"u":"C21/07-27"},{"t":"C-032","d":"2026-07-23","n":13,"u":"C32/07-23"},{"t":"C-032","d":"2026-07-27","n":7,"u":"C32/07-27"},{"t":"C-034","d":"2026-07-27","n":3,"u":"C34/07-27"},{"t":"C-035","d":"2026-07-23","n":4,"u":"C35/07-23"},{"t":"C-035","d":"2026-07-27","n":8,"u":"C35/07-27"},{"t":"C-036","d":"2026-07-23","n":5,"u":"C36/07-23"},{"t":"C-036","d":"2026-07-27","n":6,"u":"C36/07-27"},{"t":"C-037","d":"2026-07-23","n":8,"u":"C37/07-23"},{"t":"C-039","d":"2026-07-22","n":4,"u":"C39/07-22"},{"t":"C-039","d":"2026-07-27","n":1,"u":"C39/07-27"}];

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
   13. v3.0 — FRUIT GRADING
   Every good fruit collected is counted under one of three grades. The
   grade travels on the DROP event itself, so the harvest count, the
   marketing basket and the retailer invoice all read the same letter.
   ===================================================================== */
const GRADE_ORDER=['A','B','C'];
const GRADE_META={
  A:{label:'Grade A', note:'export / premium pick'},
  B:{label:'Grade B', note:'local premium'},
  C:{label:'Grade C', note:'kampung / processing'}
};

/* =====================================================================
   14. v3.1 — RETAILER CREDIT MASTER
   `Roll` is the alliance retailer the price matrix below was negotiated
   for; the other two are sample buyers so the morning weighing flow can be
   tested before the real accounts are keyed in. The Owner edits this list
   in Marketing -> PRICES & RETAILERS and the edited list is what persists.

   `opening_credit_rm` is the ONLY stored money figure. The live figure,
   `current_credit_balance_rm`, is DERIVED from the event log
   (opening + top-ups - dispatches) exactly like every other balance in
   this app, so a stored total can never drift from the deliveries behind
   it. Delete a dispatch and the credit comes back by itself.
   ===================================================================== */
const RETAILER_SEED=[
  {id:'RT-01', name:'Roll',                          contact:'',             opening_credit_rm:10000, status:'Active'},
  {id:'RT-02', name:'Sandakan Fresh Fruit Trading',  contact:'013-000 0001', opening_credit_rm:10000, status:'Active'},
  {id:'RT-03', name:'Kota Kinabalu Durian Hub',      contact:'016-000 0002', opening_credit_rm:10000, status:'Active'}
];
/* The alliance buyer the matrix was agreed with. Used once, on first run of
   v3.1, to make sure this account exists on a phone that already carries a
   v3.0 retailer list. After that the Owner owns the list completely. */
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
const CLONE_GRADES={
  MK   :['A','B','C'],
  BT   :['A','B'],
  B24  :['A','B'],
  '101':['A','B'],
  UM   :['A','B'],
  TB   :['A','B']        // unverified clone — sold on the 2-grade ladder until identified
};
const BAND_TOP={min:1.5,max:null};      // >= 1.5 kg
const GRADE_BAND={
  MK   :{A:{min:1.5,max:null}, B:{min:1.0,max:1.5}, C:{min:0,max:1.0}},
  BT   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  B24  :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  '101':{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  UM   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}},
  TB   :{A:{min:1.5,max:null}, B:{min:0,  max:1.5}}
};
const CLONE_PRICE_SEED={
  MK   :{A:40, B:30, C:25},   // Musang King  — the only 3-grade ladder
  BT   :{A:45, B:35},         // Black Thorn  — top of the book
  B24  :{A:25, B:20},         // B24          — priced with 101 / UM
  '101':{A:25, B:20},
  UM   :{A:25, B:20},         // Udang Merah
  TB   :{A:25, B:20}
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
const BASKET_SEED=[
  {id:'RED',  name:'Standard Red Box', tare_kg:2.0, ic:'🟥'},
  {id:'BLUE', name:'Heavy Blue Crate', tare_kg:3.5, ic:'🟦'},
  {id:'NONE', name:'Loose / no basket',tare_kg:0,   ic:'🍈'}
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
