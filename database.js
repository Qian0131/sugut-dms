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
const EN={"pe_edit":"✎ EDIT THIS SET","pe_remove":"🗑 REMOVE","pe_planned":"Planned date","pe_dose":"Dose per 1,000 L tank","pe_save":"✓ SAVE THE CHANGE","pe_cancel":"Cancel","pe_saved":"Saved — it reaches the phones on the next sync","pe_removed":"Removed from the plan","pe_restored":"Back in the plan","pe_restore":"↺ PUT IT BACK","pe_removedlbl":"removed from the plan","pe_confirm":"Remove \u201c{s}\u201d from the plan?","pe_noline":"Keep at least one product","pe_active":"Close the active job on this set first","pe_locked":"This set cannot be removed.\n\n{n} stock-out entries are booked against it, worth {rm}. Removing it would leave that spend belonging to no programme at all.\n\nYou can still change the recipe — that only affects what is planned from now on.","pe_editwarn":"{n} stock-out entries worth {rm} are already booked against this set. A change here affects what is planned from now on — it does not touch what was already used.","pc_tag":"PROGRAMME CHANGED","pc_hint":"Tap to open the task","pc_cancel":"THIS SET IS CANCELLED","pc_date":"THE DATE HAS CHANGED","pc_mix":"THE MIX HAS CHANGED","pc_dose":"THE DOSE HAS CHANGED","pr_replan":"plan moved to the finishing day","pr_sheetsaid":"programme sheet ticked","pr_fromsheet":"From the farm programme sheet","pr_started":"started","pr_finished":"finished","pr_dayslate":"days late","pr_ontime":"on time","pr_rows":"stock-out entries","pr_nomaterial":"no material was booked against this set","pr_unconf":"Also listed, product not confirmed","lg_closing":"closing stock",
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
  cd_rateoff:'rate not confirmed',
  cd_ratewarn:'is a placeholder. Labour and left-over figures are indicative until you set the real rate in Reports \u25b8 LABOUR.'
};

/* Long month names, both languages, for the worker card's date row. Kept as data so the
   date reads the way each person's phone is set, not the way the server wrote it. */
const MONTH_LONG_EN=['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const MONTH_LONG_MS=['Januari','Februari','Mac','April','Mei','Jun',
  'Julai','Ogos','September','Oktober','November','Disember'];

/* Bahasa Malaysia — the terms the Owner approved. Anything missing here simply
   shows the English above, which is why a partial table is safe to ship. */
const MS={"pe_edit":"✎ UBAH SET INI","pe_remove":"🗑 BUANG","pe_planned":"Tarikh rancang","pe_dose":"Dos setiap tangki 1,000 L","pe_save":"✓ SIMPAN PERUBAHAN","pe_cancel":"Batal","pe_saved":"Disimpan — sampai ke telefon lain selepas sync","pe_removed":"Dibuang dari rancangan","pe_restored":"Kembali ke rancangan","pe_restore":"↺ MASUK SEMULA","pe_removedlbl":"dibuang dari rancangan","pe_confirm":"Buang \u201c{s}\u201d dari rancangan?","pe_noline":"Simpan sekurang-kurangnya satu produk","pe_active":"Tutup kerja aktif pada set ini dahulu","pe_locked":"Set ini tidak boleh dibuang.\n\n{n} rekod keluar stok bernilai {rm} sudah direkod untuknya. Jika dibuang, perbelanjaan itu tiada program.\n\nAnda masih boleh ubah campuran — itu hanya untuk kerja akan datang.","pe_editwarn":"{n} rekod keluar stok bernilai {rm} sudah direkod untuk set ini. Perubahan di sini hanya untuk kerja akan datang — bahan yang sudah dipakai tidak berubah.","pc_tag":"PROGRAM BERUBAH","pc_hint":"Tekan untuk buka kerja","pc_cancel":"SET INI DIBATALKAN","pc_date":"TARIKH BERUBAH","pc_mix":"CAMPURAN BERUBAH","pc_dose":"DOS BERUBAH","pr_replan":"tarikh rancang dipindah ke hari siap","pr_sheetsaid":"helaian program tanda","pr_fromsheet":"Daripada helaian program ladang","pr_started":"mula","pr_finished":"siap","pr_dayslate":"hari lewat","pr_ontime":"ikut masa","pr_rows":"rekod keluar stok","pr_nomaterial":"tiada bahan direkod untuk set ini","pr_unconf":"Turut disenaraikan, produk belum disahkan","lg_closing":"baki stok",
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
  cd_rateoff:'kadar belum disahkan',
  cd_ratewarn:'ialah kadar sementara. Angka upah dan baki hanya anggaran sehingga Tuan tetapkan kadar sebenar di Laporan \u25b8 UPAH.'
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
