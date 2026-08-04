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
const COMBO_SLOTS = [
  {k:'PEST', t:'Pesticide',           ic:'🐛', cats:['Pesticide'],                    d:'Insect control'},
  {k:'FUNG', t:'Fungicide',           ic:'🍄', cats:['Fungicide'],                    d:'Disease control'},
  {k:'FOL',  t:'Foliar',              ic:'🌿', cats:['Foliar','Powder','Fertiliser'], d:'NPK and leaf feed'},
  {k:'BIO',  t:'Biostimulant',        ic:'⚡', cats:['Growth Reg','Foliar'],          d:'Hormone, amino, seaweed'},
  {k:'TE',   t:'Trace Elements (TE)', ic:'🧪', cats:['Foliar','Powder'],              d:'Zn, B, Ca, Mg and mixes'}
];

/* Unit types the Purchaser may onboard a new commercial item under, each with the
   default hidden multiplier that converts ONE CONTAINER into the operational unit the
   recipes are written in. 1 Drum = 20,000 ml is the farm's own example. The Purchaser
   may override the multiplier on the form — this is only the sensible starting number. */
const ONBOARD_UNITS = [
  {k:'ml',      t:'ml — liquid',              containers:[['bottle',1000],['jerrycan',5000],['drum',20000],['pail',18000]]},
  {k:'gm',      t:'gm — powder / granule',    containers:[['packet',1000],['bag',25000],['sack',50000],['tub',5000]]},
  {k:'bags',    t:'bags — counted whole',     containers:[['bag',1]]},
  {k:'tablets', t:'tablets — counted whole',  containers:[['box',100],['strip',10]]},
  {k:'m',       t:'m — measured length',      containers:[['roll',1000]]}
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
const EN={
  /* --- shell, tiles, sections --- */
  hubnote:'Only the sections you are allowed to use are shown.<br>Tap a tile to open it · tap ← or 🏠 to come back.',
  menuhead:'Choose a section. Every one is a full-width row — nothing is hidden off the side of the screen.',
  nav_home:'Home', nav_sync:'Sync',
  m_harvest:'Harvest',      m_tying:'Fruit Tying',   m_scale:'Morning Scale',
  m_ops:'Daily Ops',        m_inv:'Inventory',
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
  rl_cancelwhy:'Why is it not going?', rl_cancelph:'e.g. lorry left without it',
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
  bk_red:'Standard Red Box', bk_blue:'Heavy Blue Crate', bk_none:'Loose / no basket',
  ts_harvest:'grade A/B/C, loss', ts_tying:'tally clicker, rope, balances',
  ts_scale:'weigh, photograph, send', ts_ops:'tasks, stock out',
  ts_inv:'stock in/out, levels, alerts',
  ca_tag:'Card A · good fruit', ca_head:'🥭 Good fruit collected — count each grade',
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
  h_selecttree:'select a tree', w_clone:'Clone', w_readonly:'READ-ONLY',
  ty_head:'🎗️ Fruit Tying Tracker',
  ty_note:'Lock the tree in first, then tap once for every fruit you tie. Nothing leaves this screen until you press <b>Complete Tree &amp; Save to Queue</b>.',
  ty_tap:'[ 🎗️ TAP TO LOG 1 FRUIT TIED ]', ty_tally:'Current Session Tally:',
  ty_undo:'[ ↩️ Undo Mis-tap ]', ty_save:'[ 💾 Complete Tree &amp; Save to Queue ]',
  ty_selecttree:'— select tree —', ty_none:'Lock a tree in first.',
  ty_rope:'Every fruit tied draws 1.5 m of rope out of the store automatically',
  ty_store:'store shows',
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
  m_mkt:'Review & Credit', s_review:'Live Dispatch Review',
  s_supplyhub:'Supply Hub',
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
  ca_sec:'secured', ca_unsec:'unsecured', ca_fruit:'fruit'
};

/* Long month names, both languages, for the worker card's date row. Kept as data so the
   date reads the way each person's phone is set, not the way the server wrote it. */
const MONTH_LONG_EN=['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const MONTH_LONG_MS=['Januari','Februari','Mac','April','Mei','Jun',
  'Julai','Ogos','September','Oktober','November','Disember'];

/* Bahasa Malaysia — the terms the Owner approved. Anything missing here simply
   shows the English above, which is why a partial table is safe to ship. */
const MS={
  hubnote:'Hanya bahagian yang dibenarkan untuk anda sahaja dipaparkan.<br>Tekan satu petak untuk buka · tekan ← atau 🏠 untuk kembali.',
  menuhead:'Pilih satu bahagian. Semuanya baris penuh — tiada apa-apa tersembunyi di tepi skrin.',
  nav_home:'Utama', nav_sync:'Hantar Data',
  m_harvest:'Kutip Buah',   m_tying:'Ikat Buah',     m_scale:'Timbang Pagi',
  m_ops:'Kerja Harian',     m_inv:'Stok',
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
  rl_cancelwhy:'Kenapa tidak jadi?', rl_cancelph:'cth. lori bertolak tanpa muatan',
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
  bk_red:'Kotak Merah Biasa', bk_blue:'Bakul Biru Berat', bk_none:'Tanpa bakul',
  ts_harvest:'gred A/B/C, buah rosak', ts_tying:'kira ikat, tali, baki',
  ts_scale:'timbang, ambil gambar, hantar', ts_ops:'kerja, ambil bahan',
  ts_inv:'terima/ambil bahan, paras stok',
  ca_tag:'Kad A · buah elok', ca_head:'🥭 Buah elok dikutip — kira ikut gred',
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
  h_selecttree:'pilih satu pokok', w_clone:'Klon', w_readonly:'BACA SAHAJA',
  ty_head:'🎗️ Rekod Ikat Buah',
  ty_note:'Kunci pokok dahulu, kemudian tekan sekali bagi setiap buah yang anda ikat. Tiada apa-apa keluar dari skrin ini sehingga anda tekan <b>Siap Pokok &amp; Simpan</b>.',
  ty_tap:'[ 🎗️ TEKAN UNTUK REKOD 1 BUAH DIIKAT ]', ty_tally:'Jumlah sesi ini:',
  ty_undo:'[ ↩️ Batal Tekan Silap ]', ty_save:'[ 💾 Siap Pokok &amp; Simpan ]',
  ty_selecttree:'— pilih pokok —', ty_none:'Kunci satu pokok dahulu.',
  ty_rope:'Setiap buah yang diikat menolak 1.5 m tali dari stor secara automatik',
  ty_store:'stor ada',
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
  m_mkt:'Semak & Kredit', s_review:'Semakan Hantaran',
  s_supplyhub:'Pusat Bekalan',
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
  ca_sec:'bertali', ca_unsec:'tanpa tali', ca_fruit:'biji'
};
