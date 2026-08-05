/* =====================================================================
   Sugut DMS — app.js
   ---------------------------------------------------------------------
   ALL reactive logic: calculations, moving-average costing, rendering,
   event listeners, IndexedDB storage and Google Sheet sync.

   Requires database.js to be loaded FIRST. Every static array
   (TREE_MASTER, INVENTORY_RECON, PHASE_PROGRAM, DEFAULT_KEYS, ...)
   lives there, not here.
   ===================================================================== */

// ================= config & constants =================
const APP_VERSION = 'v3.17.2';   // v3.17.2 - A CORRECTION CAN NOW ONLY LAND ONCE. Only the phone holding the original entry writes its adjustment, and that adjustment's id is derived from the correction's id, so a second phone can never append a duplicate. Includes a one-time clear-out of rows a phone re-made for entries it does not hold. // v3.17.1 - THE LOGIN SCREEN CAN NOW FETCH THE STAFF LIST BY ITSELF, so a phone that was logged out (or pushed out when the Owner changed a key) can still learn a PIN created afterwards. Automatic when the screen opens, plus a button. It reads the WORKERS list and nothing else - no kill switch, no farm data. // v3.17.0 - THE OWNER'S COMMAND TILE GAINS TWO TABS. TODAY lists everything waiting on the Owner as colour + icon + word, each row naming and opening the screen that fixes it, above today's figures, the crop on the trees, the month's margin and which phones have gone quiet. COMPARE answers the one question no other screen could: is this better or worse than before - 7 days, month-to-date or the season, against a LIKE-FOR-LIKE previous period, never a part-month against a whole one. The v3.16 Executive Summary, the four isolated workspaces and every earlier feature are untouched
// PREVIOUS: v3.14.0 - COUNT TREES, NOT TANKS.
// PREVIOUS: v3.13.0 - INTERFACE SHARPENING.
// PREVIOUS: v3.12.0 - SEASONAL AGRONOMY MATRIX + BRAND ALLOCATION + CLOSED-LOOP RUN COSTING.
// PREVIOUS: v3.11.0 — SHARED SETTINGS. The price matrix, the basket tare and any added tree now travel to every phone instead of living on the one that typed them. A setting is not an event: it is overwritten, newest wins, and an older phone can never undo a newer correction

// ================= storage (IndexedDB, memory fallback) =================
let db=null, mem={events:[],config:null,corrections:[]};
function idb(){return new Promise((res)=>{ if(!window.indexedDB) return res(null);
  // v2 adds the offline `correction_requests` queue. Existing events/kv data is preserved.
  // v3 adds the `programs` store (activated agronomist phases). Existing
  // events / kv / corrections data is preserved by the upgrade.
  // v4 adds `tasks` (Owner-assigned general field jobs) and `blueprints`
  // (Owner-built programme sets). Existing data is preserved by the upgrade.
  // v5 adds `rain` (the manual rain-gauge log). Existing data is preserved.
  const rq=indexedDB.open('sugut-dms',5);
  rq.onupgradeneeded=e=>{const d=e.target.result;
    if(!d.objectStoreNames.contains('events'))d.createObjectStore('events',{keyPath:'uuid'});
    if(!d.objectStoreNames.contains('kv'))d.createObjectStore('kv',{keyPath:'k'});
    if(!d.objectStoreNames.contains('corrections'))d.createObjectStore('corrections',{keyPath:'uuid'});
    if(!d.objectStoreNames.contains('programs'))d.createObjectStore('programs',{keyPath:'uuid'});
    if(!d.objectStoreNames.contains('tasks'))d.createObjectStore('tasks',{keyPath:'uuid'});
    if(!d.objectStoreNames.contains('blueprints'))d.createObjectStore('blueprints',{keyPath:'uuid'});
    if(!d.objectStoreNames.contains('rain'))d.createObjectStore('rain',{keyPath:'uuid'});};
  rq.onsuccess=e=>res(e.target.result); rq.onerror=()=>res(null);});}
function put(store,obj){return new Promise(res=>{if(!db){res();return;}const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(obj);tx.oncomplete=res;tx.onerror=res;});}
function del(store,key){return new Promise(res=>{if(!db){res();return;}const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(key);tx.oncomplete=res;tx.onerror=res;});}
function all(store){return new Promise(res=>{if(!db){res(null);return;}const tx=db.transaction(store,'readonly');const rq=tx.objectStore(store).getAll();rq.onsuccess=()=>res(rq.result);rq.onerror=()=>res(null);});}

let EVENTS=[], CFG=null, KEYS=DEFAULT_KEYS.map(k=>({...k})), LOCKED=false, REG_DIRTY=false;
/* v3.8.1 - DECISIONS MADE ON SOMEBODY ELSE'S PHONE.
   Marketing's approval is a DISPATCH event and their return is a DISPATCH_REJECT, and
   BOTH are created on the marketer's device. Until v3.8.1 neither ever came back down,
   so a worker's load sat at PENDING for ever - the v3.5 divergence bug in a new place.
   This map is the decision only: uuid -> {state, dt, by, reason, total_kg, retailer_name}.
   It is deliberately NOT an event. Writing a stripped, zero-value DISPATCH into a
   worker's append-only log would corrupt every derived figure built on top of it. */
let REQ_DECIDED={};
// v2.2 — offline queue of worker-submitted corrections + the approved overrides
// that have been burned into TREE_MASTER.
let CORRECTIONS=[], TREE_FIX={};
// v3.1 — retailer master, the clone x grade price matrix and the basket tare master.
// All three are small Owner-managed registries, held in kv exactly like the staff
// registry, NOT in the event log. The money that MOVES is in the event log; these are
// only the settings that money is calculated from, so an edit re-prices nothing that
// has already been invoiced.
// v3.3 — trees the Owner added after install, and the address the QR points at.
// Both are kv registries: TREE_MASTER itself ships inside database.js and is replaced on
// every upgrade, so an added tree that lived only there would vanish at the next release.
let ADDED_TREES=[], APP_URL='';
/* v3.11 - THE SHARED SETTINGS.
   Three dials the whole farm has to agree on used to live only in the browser of whichever
   phone edited them. SET_META records who last set each one and when; SET_DIRTY marks the
   ones this phone has changed and not yet pushed. Newest stamp wins, so an offline phone
   syncing at noon can never overwrite the Owner's 11am correction with its 6am value. */
/* v3.12 — three more shared keys ride the SAME tested channel, for the same reason the
   first five do: every one of them is information that has to travel DOWN as well as up.
     agrodrafts — the Owner's recipe. Useless on the Owner's phone alone.
     aialloc    — the Purchaser's brand choice. The worker cannot start without it.
     newprods   — a product onboarded in Sandakan that the field must be able to draw.
   This is the fourth time the one-way-information bug has been designed out rather than
   fixed after the fact. Ask which direction it travels BEFORE writing it. */
const SETTINGS_KEYS=['cloneprice','pricemeta','baskets','tareok','addtrees',
  'agrodrafts','aialloc','newprods'];
let SET_META={}, SET_DIRTY={};
/**
 * v3.5 — THE FIX FOR "TWO PHONES, TWO DIFFERENT TOTALS".
 *
 * Until now events only ever travelled UP. `doGet` returned trees, products, workers,
 * corrections, programmes, tasks and retailers — never a single drop or tying round. So
 * each phone's tree balance was built ONLY from the rows keyed on that phone, plus the
 * migrated opening balance. The Owner's phone showed its own work, the worker's phone
 * showed its own, and the two could never agree. Nothing was corrupt; each phone was
 * honestly reporting a partial picture, which is worse, because it looks authoritative.
 *
 * The Sheet now returns a small per-tree total (`treestats`) covering every phone's rows.
 * A tree's figure = the Sheet's total + only those local rows the Sheet has not seen yet.
 * `syncedAt` is what makes that exact: a row already counted in `treestats` is skipped,
 * a row pushed AFTER the stats were fetched is still added, so there is no window in
 * which a fruit is counted twice or dropped.
 */
let statsWarned=false, STATS_FAULT='', STATS_META=null;
let TREE_STATS=null;    // {at:'YYYY-MM-DD HH:MM', trees:{ 'B-045':{tied,secured,untied,rotTied,rotUntied} }}
function statOf(tree,k){
  const t=TREE_STATS&&TREE_STATS.trees?TREE_STATS.trees[tree]:null;
  return t?(+t[k]||0):0;}
/** Does this local row still need adding on top of the Sheet's total? */
function countsLocally(e){
  if(!TREE_STATS)return true;                 // never fetched: this phone is all we know
  if(!e.synced)return true;                   // not in the Sheet yet
  return String(e.syncedAt||'')>String(TREE_STATS.at||'');   // pushed after the stats
}
function statsAge(){
  if(!TREE_STATS||!TREE_STATS.at)return null;
  return TREE_STATS.at;}
let RETAILERS=RETAILER_SEED.map(r=>({...r})),
    CLONE_PRICE=priceMatrixCopy(CLONE_PRICE_SEED),
    PRICE_META={at:'',by:''},
    BASKETS=BASKET_SEED.map(b=>({...b})),
    TARE_VERIFIED=BASKET_TARE_VERIFIED_SEED,
    RET_DIRTY=false,
    // v3.6 — man-hours have been logged since v2.6 but never priced. This is what turns
    // them into the labour column of the monthly matrix. Placeholder until the Owner
    // confirms it, exactly like the basket tare.
    LABOUR_RATE=LABOUR_RATE_SEED,
    LABOUR_RATE_OK=LABOUR_RATE_VERIFIED_SEED,
    // v3.6 — the contract book: retailer id -> clone -> grade -> RM/kg. Held apart from
    // the retailer rows so editing a merchant's contact details can never disturb their
    // negotiated rates.
    RET_CONTRACT={};
/* ---- v3.12 live state for the seasonal matrix -------------------------------------
   AGRO_DRAFTS  the Owner's recipes            (shared key 'agrodrafts')
   AI_ALLOC     draftUuid|slotKey -> allocation(shared key 'aialloc')
   NEW_PRODS    items onboarded in Sandakan    (shared key 'newprods')
   WX3          three-state weather; drives the existing two-state WEATHER flag
   These are declared here, above initStore(), because initStore() writes into them. */
let AGRO_DRAFTS=[], AI_ALLOC={}, NEW_PRODS=[], WX3='DRY';

async function initStore(){
  db=await idb();
  if(db){ EVENTS=(await all('events'))||[]; const kv=(await all('kv'))||[];
    CORRECTIONS=(await all('corrections'))||[];
    PROGRAMS=(await all('programs'))||[];
    TASKS=(await all('tasks'))||[];
    BLUEPRINTS=(await all('blueprints'))||[];
    RAINFALL=(await all('rain'))||[];
    const c=kv.find(x=>x.k==='cfg'); CFG=c?c.v:null;
    const k=kv.find(x=>x.k==='keys'); if(k&&Array.isArray(k.v)&&k.v.length) KEYS=k.v;
    const l=kv.find(x=>x.k==='locked'); LOCKED=!!(l&&l.v);
    const rd=kv.find(x=>x.k==='regdirty'); REG_DIRTY=!!(rd&&rd.v);
    const tf=kv.find(x=>x.k==='treefix'); if(tf&&tf.v&&typeof tf.v==='object') TREE_FIX=tf.v;
    const io=kv.find(x=>x.k==='invover'); if(io&&io.v&&typeof io.v==='object') INV_OVERRIDE=io.v;
    const lp=kv.find(x=>x.k==='lastlpt'); if(lp&&lp.v&&typeof lp.v==='object') LAST_LPT=lp.v;
    const wx=kv.find(x=>x.k==='weather'); if(wx&&wx.v) WEATHER=String(wx.v);
    const lc=kv.find(x=>x.k==='lastcrew'); if(lc&&lc.v&&typeof lc.v==='object') LAST_CREW=lc.v;
    const rt=kv.find(x=>x.k==='retailers'); if(rt&&Array.isArray(rt.v)&&rt.v.length) RETAILERS=rt.v;
    // v3.1 — the clone x grade matrix. A saved table only ever OVERLAYS the seed, so a
    // clone or a grade added in a later release appears immediately instead of coming
    // back as RM 0 on a phone that already has a v3.1 table stored.
    const cp=kv.find(x=>x.k==='cloneprice');
    if(cp&&cp.v&&typeof cp.v==='object'){
      const merged=priceMatrixCopy(CLONE_PRICE_SEED);
      Object.keys(cp.v).forEach(c=>{ if(!merged[c])return;
        Object.keys(cp.v[c]||{}).forEach(g=>{ if(hasGrade(c,g))merged[c][g]=+cp.v[c][g]||0; });});
      CLONE_PRICE=merged;}
    const pm=kv.find(x=>x.k==='pricemeta'); if(pm&&pm.v&&typeof pm.v==='object') PRICE_META=pm.v;
    const bk=kv.find(x=>x.k==='baskets');
    if(bk&&Array.isArray(bk.v)&&bk.v.length){
      BASKETS=BASKET_SEED.map(seed=>{
        const saved=bk.v.find(x=>String(x.id)===String(seed.id));
        return saved?{...seed,tare_kg:+saved.tare_kg||0,name:saved.name||seed.name}:{...seed};});}
    const tk=kv.find(x=>x.k==='tareok'); TARE_VERIFIED=!!(tk&&tk.v);
    // v3.8.1 — decisions Marketing made on THEIR phone, pulled down to this one.
    const rq=kv.find(x=>x.k==='reqdecided'); if(rq&&rq.v&&typeof rq.v==='object') REQ_DECIDED=rq.v;
    const ms=kv.find(x=>x.k==='mastersig'); if(ms&&ms.v) MASTER_SIG=String(ms.v);
    const sm=kv.find(x=>x.k==='setmeta');  if(sm&&sm.v&&typeof sm.v==='object') SET_META=sm.v;
    const sd=kv.find(x=>x.k==='setdirty'); if(sd&&sd.v&&typeof sd.v==='object') SET_DIRTY=sd.v;
    const rdt=kv.find(x=>x.k==='retdirty'); RET_DIRTY=!!(rdt&&rdt.v);
    const at=kv.find(x=>x.k==='addtrees'); if(at&&Array.isArray(at.v)) ADDED_TREES=at.v;
    // v3.12 — the seasonal matrix, the brand allocations and anything the Purchaser has
    // onboarded. New products are folded into the live catalogue BEFORE the first paint,
    // so a brand added in Sandakan is pickable on this phone the moment the app opens.
    const ad=kv.find(x=>x.k==='agrodrafts'); if(ad&&Array.isArray(ad.v)) AGRO_DRAFTS=ad.v;
    const al=kv.find(x=>x.k==='aialloc');    if(al&&al.v&&typeof al.v==='object') AI_ALLOC=al.v;
    const np=kv.find(x=>x.k==='newprods');   if(np&&Array.isArray(np.v)) NEW_PRODS=np.v;
    applyNewProducts();
    const w3=kv.find(x=>x.k==='wx3'); if(w3&&w3.v) WX3=String(w3.v);
    const au=kv.find(x=>x.k==='appurl');   if(au&&au.v) APP_URL=String(au.v);
    const ts=kv.find(x=>x.k==='treestats'); if(ts&&ts.v&&ts.v.trees) TREE_STATS=ts.v;
    // v3.6 — the labour rate that prices man-hours into the monthly matrix.
    const lr=kv.find(x=>x.k==='labrate'); if(lr&&+lr.v>0) LABOUR_RATE=+lr.v;
    const lro=kv.find(x=>x.k==='labrateok'); LABOUR_RATE_OK=!!(lro&&lro.v);
    // v3.7 — the chosen language. Only an EXPLICIT choice is stored; with nothing saved,
    // applyRole() picks the default from the role, so a fresh worker phone opens in Malay
    // while a phone whose owner has tapped EN stays in English for good.
    const lg=kv.find(x=>x.k==='lang'); if(lg&&(lg.v==='ms'||lg.v==='en')) LANG=lg.v;
    LANG_SET=!!(lg&&lg.v);

    // v3.1 — the alliance buyer the price matrix was agreed with. Added ONCE to a phone
    // upgrading from v3.0, never re-added if the Owner later renames or removes it.
    const rs=kv.find(x=>x.k==='rollseed');
    if(!(rs&&rs.v)){
      if(!RETAILERS.some(r=>String(r.name).trim().toLowerCase()===ALLIANCE_RETAILER.toLowerCase())){
        let n=1; while(RETAILERS.some(r=>r.id==='RT-'+String(n).padStart(2,'0')))n++;
        RETAILERS.unshift({id:'RT-'+String(n).padStart(2,'0'),name:ALLIANCE_RETAILER,contact:'',
          opening_credit_rm:10000,status:'Active'});
        RET_DIRTY=true;
        await put('kv',{k:'retailers',v:RETAILERS});
        await put('kv',{k:'retdirty',v:RET_DIRTY});}
      await put('kv',{k:'rollseed',v:true});}

    // ---- v3.6 — the one-time multi-merchant migration --------------------------------
    // A phone upgrading from v3.5 already holds a saved retailer list, so changing the
    // seed alone would change nothing. This runs EXACTLY ONCE (kv `retmig`) and is
    // deliberately narrow: it re-bases Roll to the agreed RM 15,000 opening, adds Seng
    // Kee and Default Cash if they are missing, retires the two v3.1 sample buyers, and
    // attaches the contract matrices. It never touches a retailer the Owner created, and
    // it never deletes anything — a retired sample buyer goes to status Deleted so its
    // history survives.
    const rmg=kv.find(x=>x.k==='retmig');
    if(String(rmg&&rmg.v||'')!==RETAILER_MIGRATION_TAG){
      const byName=n=>RETAILERS.find(r=>String(r.name).trim().toLowerCase()===n.toLowerCase());
      let touched=false;
      RETAILER_SEED.forEach(seed=>{
        const found=RETAILERS.find(r=>String(r.id)===seed.id)||byName(seed.name);
        if(found){
          found.id=found.id||seed.id;
          found.opening_credit_rm=seed.opening_credit_rm;   // re-based to the agreed figure
          found.pricing=seed.pricing;
          if(String(found.status||'Active').toLowerCase()==='deleted')found.status='Active';
        } else {
          RETAILERS.push({...seed});
        }
        touched=true;});
      // the two v3.1 sample buyers, retired but never erased
      ['Sandakan Fresh Fruit Trading','Kota Kinabalu Durian Hub'].forEach(n=>{
        const s=byName(n); if(s&&String(s.status).toLowerCase()!=='deleted'){s.status='Deleted';touched=true;}});
      RETAILERS.forEach(r=>{ if(!r.pricing)r.pricing=RETAILER_CONTRACT_SEED[r.id]?'CONTRACT':'SPOT'; });
      if(touched){RET_DIRTY=true;
        await put('kv',{k:'retailers',v:RETAILERS});
        await put('kv',{k:'retdirty',v:RET_DIRTY});}
      await put('kv',{k:'retmig',v:RETAILER_MIGRATION_TAG});}

    // The contract book itself is stored separately from the retailer rows so an edit to
    // a merchant's details can never blow away their rates, and vice versa. Same overlay
    // rule as the spot matrix: a saved book LAYERS onto the seed, so a clone or grade
    // added in a later release appears at its seeded rate instead of RM 0.
    const rc=kv.find(x=>x.k==='retcontract');
    RET_CONTRACT=contractBookCopy(RETAILER_CONTRACT_SEED);
    if(rc&&rc.v&&typeof rc.v==='object'){
      Object.keys(rc.v).forEach(rid=>{
        if(!RET_CONTRACT[rid])RET_CONTRACT[rid]={};
        Object.keys(rc.v[rid]||{}).forEach(c=>{
          if(!CLONE_GRADES[c])return;
          if(!RET_CONTRACT[rid][c])RET_CONTRACT[rid][c]={};
          Object.keys(rc.v[rid][c]||{}).forEach(g=>{
            if(hasGrade(c,g))RET_CONTRACT[rid][c][g]=+rc.v[rid][c][g]||0;});});});}
  }
  else { EVENTS=mem.events; CFG=mem.config; CORRECTIONS=mem.corrections; }
  // v3.7 — settle the language HERE, before anything renders. Deciding it in applyRole()
  // (which runs after the boot paint) left every worker panel drawn in English and only
  // repainted on the next interaction. First paint must already be right.
  if(!LANG_SET)LANG=((CFG&&CFG.role)==='WORKER')?'ms':'en';
  KEYS.forEach(k=>{if(!k.id)k.id=newUid();});   // registries saved by v2.0 had no ids
  applyAddedTrees();                            // Owner-added trees BEFORE anything reads the census
  applyTreeFixes();                             // approved corrections are permanent
  applyInvOverrides();                          // Owner's min-stock / AI edits are permanent
  rebuildLedgers();                             // materialise stock_in / stock_out / adjust ledgers
}
async function persistEvent(ev){ EVENTS.push(ev); if(db) await put('events',ev); else mem.events=EVENTS;
  if(typeof rebuildLedgers==='function') rebuildLedgers();   // ledgers follow the event store
  badge(); }
async function persistCfg(){ if(db) await put('kv',{k:'cfg',v:CFG}); else mem.config=CFG; }
async function persistCorrection(c){
  const i=CORRECTIONS.findIndex(x=>x.uuid===c.uuid);
  if(i>=0) CORRECTIONS[i]=c; else CORRECTIONS.push(c);
  if(db) await put('corrections',c); else mem.corrections=CORRECTIONS;
  badge();}
async function persistTreeFix(){ if(db) await put('kv',{k:'treefix',v:TREE_FIX}); }

// ================= helpers =================
const $=id=>document.getElementById(id);
function toast(m,err){const t=$('toast');t.textContent=m;t.className='toast show'+(err?' err':'');setTimeout(()=>t.classList.remove('show'),2300);}
function uuid(){ if(crypto&&crypto.randomUUID)return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return (c=='x'?r:(r&0x3|0x8)).toString(16);});}
function now(){const d=new Date(),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes());}
function todayStr(){return now().slice(0,10);}
/* v3.9.2 — the rest of the app stamps to the minute, which is right for a day's work. A
   worker weighing ten baskets can do three inside one minute, so the moment a basket was
   KEYED is stamped to the second. Same string shape, two characters longer, so every
   existing slice(0,10) / localeCompare still behaves. */
function nowSec(){const d=new Date(),p=n=>String(n).padStart(2,'0');
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+
    p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());}
/** Just the clock time out of any of our stamps, for a screen that already shows the date. */
function hm(ts){const m=String(ts||'').match(/(\d{2}:\d{2})(:\d{2})?/);return m?m[1]+(m[2]||''):'';}
function pending(){return EVENTS.filter(e=>!e.synced).length;}
function corrUnsynced(){return CORRECTIONS.filter(c=>!c.synced).length;}
function q4(){return (typeof progUnsynced==='function'?progUnsynced():0)+
  (typeof taskUnsynced==='function'?taskUnsynced():0)+
  (typeof rainUnsynced==='function'?rainUnsynced():0)+
  (typeof q5==='function'?q5():0)+
  (typeof q6==='function'?q6():0)+
  (typeof q7==='function'?q7():0)+
  (typeof q8==='function'?q8():0)+
  (typeof q9==='function'?q9():0);}
function badge(){$('qbadge').textContent=pending()+corrUnsynced()+q4()+setUnsynced();}
function netUpdate(){const on=navigator.onLine;const p=$('netpill');p.textContent=on?'● ONLINE':'● OFFLINE';p.className='pill'+(on?' on':'');
  const q=pending()+corrUnsynced()+q4()+setUnsynced();
  if(on&&(q>0||REG_DIRTY)&&CFG&&CFG.url)doSync(true);}
window.addEventListener('online',netUpdate);window.addEventListener('offline',netUpdate);
// v2.6.1 — a phone that stays open all day would otherwise never see a new assignment.
// Pull when the worker comes back to the app, and quietly every 5 minutes while online.
async function netPull(){
  if(LOCKED||!CFG||!CFG.url||!CFG.key||!navigator.onLine)return;
  const got=await refreshMasters();
  if(got&&(got.tasks+got.programs)>0){
    const nn=got.tasks+got.programs;
    toast('📋 '+nn+' new job'+(nn>1?'s':'')+' from the Owner');}}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)netPull();});
setInterval(netPull,5*60*1000);

// ================= TREE MASTER engine (v2.2) =================
// TREE_FIX holds every Owner-APPROVED correction, keyed by TreeID. It is replayed
// over TREE_MASTER on every boot and immediately after an approval, so a corrected
// clone is permanent and identical on every screen of the app.
function treeById(id){return TREE_MASTER.find(t=>t.id===id)||null;}
function treesInLot(l){return TREE_MASTER.filter(t=>t.lot===l);}
function cloneLabel(c){return c?((CLONE_NAME[c]||c)+' ('+c+')'):'Not recorded';}
function applyTreeFixes(){
  Object.keys(TREE_FIX).forEach(id=>{
    const t=treeById(id); if(!t)return; const f=TREE_FIX[id];
    if(f.clone!==undefined) t.clone=f.clone;
    if(f.census!==undefined) t.census=f.census;
    if(f.note!==undefined) t.note=f.note;
  });
  recalcCensusTotals();}
function recalcCensusTotals(){
  LOTS.forEach(l=>{CENSUS_TOTAL[l]=treesInLot(l).reduce((s,t)=>s+(t.census||0),0)||1;});}

// ================= correction requests (worker → owner) =================
function canCorrect(){return myRole()==='WORKER'||myRole()==='OWNER'||myRole()==='MARKETING';}
function canApprove(){return myRole()==='OWNER';}
let corrType='CLONE', corrClone='', corrTree=null;
function closeCorrection(){$('corrmodal').classList.add('hidden');}
function pickCorrType(t){corrType=t;
  [...$('cf-types').children].forEach(el=>el.classList.toggle('on',el.dataset.ct===t));
  $('cf-clonewrap').classList.toggle('hidden',t!=='CLONE');
  $('cf-censuswrap').classList.toggle('hidden',t!=='CENSUS');}
function pickCorrClone(c){corrClone=c;
  [...$('cf-clones').children].forEach(el=>el.classList.toggle('on',el.dataset.c===c));}
function renderMyCorrections(){
  const box=$('mycorr'); if(!box)return;
  if(!canCorrect()){box.style.display='none';return;}
  const mine=CORRECTIONS.filter(c=>c.worker===(CFG&&CFG.worker)).sort((a,b)=>b.dt.localeCompare(a.dt)).slice(0,12);
  box.style.display=mine.length?'':'none';
  $('mycorrlist').innerHTML=mine.map(c=>{
    const s=c.status==='APPROVED'?'a':(c.status==='REJECTED'?'r':'p');
    return '<div class="lrow"><span><b>'+esc(c.tree)+'</b> · '+esc(corrSummary(c))+'<br><span class="small">'+esc(c.dt)+'</span></span><span class="cstat '+s+'">'+esc(c.status)+'</span></div>';}).join('');}

// ================= owner: pending data adjustments =================
let corrFilter='PENDING';
function setCorrFilter(f,el){corrFilter=f;[...$('corrfilter').children].forEach(x=>x.classList.remove('on'));if(el)el.classList.add('on');renderCorrections();}
function renderCorrections(){
  const panel=$('corrpanel'); if(!panel)return;
  const r=myRole();
  panel.style.display=(r==='OWNER'||r==='MARKETING')?'':'none';   // never the Purchaser
  if(panel.style.display==='none')return;
  const pend=CORRECTIONS.filter(c=>c.status==='PENDING');
  const b=$('corrcount'); b.textContent=pend.length; b.classList.toggle('hidden',!pend.length);
  const list=corrFilter==='PENDING'?pend:(corrFilter==='DECIDED'?CORRECTIONS.filter(c=>c.status!=='PENDING'):CORRECTIONS.slice());
  list.sort((a,b2)=>b2.dt.localeCompare(a.dt));
  $('corrlist').innerHTML=list.length?list.map(c=>{
    const s=c.status==='APPROVED'?'a':(c.status==='REJECTED'?'r':'p');
    const acts=(c.status==='PENDING'&&canApprove())
      ?'<div class="cacts"><button class="ok" onclick="decideCorrection(\''+c.uuid+'\',1)">✓ '+(c.ctype==='NOTE'?'ACKNOWLEDGE':'APPROVE CHANGE')+'</button><button class="no" onclick="decideCorrection(\''+c.uuid+'\',0)">✕ REJECT REQUEST</button></div>'
      :(c.status==='PENDING'?'<div class="small">Owner approval required.</div>'
        :'<div class="small">'+c.status.toLowerCase()+' by '+(c.decidedBy||'—')+' · '+(c.decidedAt||'')+'</div>');
    return '<div class="crow"><div class="ch"><div><div class="ctree">'+esc(c.tree)+'</div>'+
      '<div class="cwho">Lot '+esc(c.lot)+' · Tree '+esc(c.no)+'<br>'+esc(c.worker)+' · '+esc(c.dt)+'</div></div>'+
      '<span class="cstat '+s+'">'+esc(c.status)+'</span></div>'+
      '<div class="cchange">'+esc(corrSummary(c))+'</div>'+
      (c.note?'<div class="cnote">“'+esc(c.note)+'”</div>':'')+acts+'</div>';}).join('')
    :'<div class="small">No '+(corrFilter==='PENDING'?'pending':'')+' correction requests.</div>';}
// Burn an APPROVED correction into TREE_MASTER permanently (used by the Owner's
// approval and, on worker phones, when an approval arrives down the sync).
async function bakeApproved(c){
  if(!treeById(c.tree))return;
  TREE_FIX[c.tree]=TREE_FIX[c.tree]||{};
  if(c.ctype==='CLONE') TREE_FIX[c.tree].clone=c.newVal;
  else if(c.ctype==='CENSUS') TREE_FIX[c.tree].census=Math.round(+c.newVal);
  else if(c.note) TREE_FIX[c.tree].note=c.note;
  await persistTreeFix(); applyTreeFixes();}
/* ======================================================================================
   v3.7 · LANGUAGE — Bahasa Malaysia for the worker's screens
   ======================================================================================
   Deliberately NOT a whole-app translation. A Farm Worker reaches 254 distinct strings
   across 22 render functions; the app holds about 1,700. The other 1,450 are the costing
   ledger, the contract matrix and the audit trail — moving-average cost, drawdown
   percentage, credit overdraft — where a wrong Malay term reads as authoritative and is
   more dangerous than plain English. So the worker's world is translated completely and
   the management screens stay English.

   Three rules that make this safe:
     1. tr(key) FALLS BACK TO ENGLISH on a missing key. A screen can never render blank,
        and a term added later simply shows in English until it is translated.
     2. Nothing that identifies a physical thing is translated - tree IDs are printed on
        the QR tags, clone codes and grade letters reach the buyer's invoice, and chemical
        product names are the safety record on the drum.
     3. The BM / EN chip is available to EVERY role, not just the worker. The Owner has to
        be able to flip a worker's phone to English while standing next to them, or
        troubleshooting over the radio becomes guesswork.
   ====================================================================================== */
let LANG='en', LANG_SET=false;
function isMs(){return LANG==='ms';}
/** THE lookup. Falls back to English, then to the key itself, so nothing renders empty. */
function tr(key,en){
  if(LANG==='ms'){
    const v=(typeof MS!=='undefined')?MS[key]:null;
    if(v!=null&&v!=='')return v;}
  const e=(typeof EN!=='undefined')?EN[key]:null;
  return (e!=null&&e!=='')?e:(en!=null?en:key);}
/** Module / section names travel through the same table when they carry a `tn` key. */
function moduleLabel(m){return m?(m.tn?tr(m.tn,m.name):m.name):'';}
/** The small grey line under a tile name. Translated only where a worker sees it. */
function tileSub(k,m){
  const s=MS_TILE_SUB[k];
  return (s&&isMs())?tr(s,m.sub):m.sub;}
/** Loss-cause label and note, translated. `c_<KEY>` / `c_<KEY>_n` — so a fifth cause
 *  added to ROT_CAUSE only needs two more dictionary lines, no code. */
function causeLabel(k){return tr('c_'+k,(ROT_CAUSE[k]||{}).label||k);}
function causeNote(k){return tr('c_'+k+'_n',(ROT_CAUSE[k]||{}).note||'');}
const MS_TILE_SUB={harvest:'ts_harvest',tying:'ts_tying',scale:'ts_scale',ops:'ts_ops',inv:'ts_inv'};
function tabLabel(x){return x?(x.tn?tr(x.tn,x.t):x.t):'';}
function sectionDesc(x){return x?(x.tn?tr(x.tn+'_d',x.d||''):(x.d||'')):'';}

async function setLang(l){
  LANG=(l==='ms')?'ms':'en';
  // An explicit tap is a CHOICE and outranks the role default for good — including for
  // the rest of this session, which is why the in-memory flag is set too, not just kv.
  LANG_SET=true;
  if(db)await put('kv',{k:'lang',v:LANG});
  applyStaticLang();
  renderLangChip();
  // repaint whatever is on screen right now, at whatever depth
  renderHub();
  if(curModule&&inMenu)openMenu(curModule);
  else if(curModule&&curTab)openModule(curModule,curTab);
}
function renderLangChip(){
  const el=$('langchip'); if(!el)return;
  el.innerHTML='<span class="'+(LANG==='ms'?'on':'')+'" onclick="setLang(\'ms\')">BM</span>'+
               '<span class="'+(LANG==='en'?'on':'')+'" onclick="setLang(\'en\')">EN</span>';}
/** Static markup carries data-t / data-tph, so index.html needs no JS rewrite to switch. */
function applyStaticLang(){
  document.querySelectorAll('[data-t]').forEach(el=>{
    const k=el.getAttribute('data-t');
    if(!el.dataset.ten)el.dataset.ten=el.innerHTML;      // remember the English once
    const v=(LANG==='ms'&&typeof MS!=='undefined'&&MS[k])?MS[k]:el.dataset.ten;
    el.innerHTML=v;});
  document.querySelectorAll('[data-tph]').forEach(el=>{
    const k=el.getAttribute('data-tph');
    if(!el.dataset.tphen)el.dataset.tphen=el.getAttribute('placeholder')||'';
    const v=(LANG==='ms'&&typeof MS!=='undefined'&&MS[k])?MS[k]:el.dataset.tphen;
    el.setAttribute('placeholder',v);});}

// ================= v2.5 SIX-MODULE HUB + CLEAN SUB-TAB BARS =================
// Six major sections, each a big tile. A module with more than one section shows a
// sub-tab bar pinned under the header. Two independent gates decide what a person
// sees: HUB_ORDER (which tiles they are given) and roleAllows() (which panels may
// render at all) — so calling straight into a module exposes nothing extra.
// v3.7 — 'menu' is the section list a multi-section tile opens onto. It is a real screen
// so the existing show/hide machinery governs it like any other.
const SCREENS=['home','menu','harvest','stock','sync','dash'];
const FULL_ROLES=['OWNER','MARKETING'];
const MODULES={
  // ====================================================================================
  // v3.16 — TILE F · THE OWNER'S COMMAND WORKSPACE
  // Three tabs and no more: what happened (Executive Summary), what to spray next
  // (Program Builder), and the master overrides. It does NOT replace the eight working
  // tiles — those stay reachable underneath, so nothing the Owner uses today loses its
  // route. This is the daily driver, not a cage: burying stock-take, labour, the yield
  // audit and the delivery ledger behind three tabs would cost more than it saved.
  // Every tab is OWNER-only at the tile gate AND again in roleAllows().
  // ====================================================================================
  // v3.17 — two more tabs, and TODAY goes first. The Executive Summary answers "what is
  // the state of the farm"; it cannot answer "what do I have to do before lunch" or "is
  // this better than last week". Those are different questions and they get their own
  // screens rather than being stacked onto a summary that is already dense.
  cmd:{ic:'👑',name:'Command',sub:'today, summary, compare, programme, master',tn:'m_cmd',
    tabs:[{k:'today', t:'TODAY',           scr:'dash',panels:['cmdtoday'],  roles:['OWNER'],ic:'📌',tn:'s_today', d:'What needs you today, today’s figures, and which phones have gone quiet'},
          {k:'exec',  t:'EXECUTIVE SUMMARY',scr:'dash',panels:['cmdexec'],   roles:['OWNER'],ic:'📈',tn:'s_exec',  d:'Variance alerts, rain, retailer revenue, drawdown and the drop forecast'},
          {k:'cmp',   t:'COMPARE',         scr:'dash',panels:['cmdcompare'],roles:['OWNER'],ic:'📊',tn:'s_compare',d:'7 days, this month or the whole season — against the period before it'},
          {k:'build', t:'PROGRAM BUILDER',  scr:'dash',panels:['agromatrix'],roles:['OWNER'],ic:'🧬',tn:'s_builder',d:'Build a five-part combo by active ingredient, per 1,000 L tank'},
          {k:'master',t:'MASTER CONTROL',   scr:'dash',panels:['masterdb'],  roles:['OWNER'],ic:'🔐',tn:'s_master', d:'Edit any row, backdate, add trees, manage keys, show the QR'}]},
  // v3.0 — tying has LEFT this module. The collection screen is now two cards only:
  // Card A good fruit by grade, Card B rotten loss. Nothing else competes for the
  // worker's thumb while fruit is being counted.
  harvest:{ic:'🥭',name:'Harvest',sub:'grade A/B/C, loss',tn:'m_harvest',
    tabs:[{k:'log', t:'COLLECT',   scr:'harvest',panels:[],ic:'🥭',tn:'s_collect',d:'Count good fruit by grade, and loss with its cause'},
          // v3.9 — the backlog answers a harvest question, so it lives on the harvest tile
          // and every role that can reach harvest can reach it. The worker sees the plain
          // count; the flags and the trace are gated inside renderBacklog by SHOW_VALUES.
          {k:'backlog',t:'BACKLOG',  scr:'dash',panels:['backlogcard'],ic:'📦',tn:'s_backlog',d:'Fruit collected, fruit dispatched, what is still in the shed'},
          {k:'wave',t:'THE WAVE',  scr:'dash',panels:['wavecard'],roles:FULL_ROLES,ic:'🌊',d:'How much of the crop is still on the string'},
          {k:'today',t:'FARM TODAY',scr:'dash',panels:['yieldstrip','kpis','phibox','lotcard','mktcard','dashnote'],roles:FULL_ROLES,ic:'📈',d:'Today across all three lots'}]},
  // v3.0 — the tying tracker is its own tile. Hidden from the Sandakan Purchaser.
  tying:{ic:'🎗️',name:'Fruit Tying',sub:'tally clicker, rope, balances',tn:'m_tying',
    tabs:[{k:'tally',t:'TALLY CLICKER',scr:'dash',panels:['tallycard'],ic:'🎗️',tn:'s_tally',d:'Tap-count fruit onto the string, tree by tree'},
          {k:'bal',  t:'BALANCES',     scr:'dash',panels:['tyingcard'],roles:FULL_ROLES,ic:'⚖️',d:'What each tree still owes against what was tied'}]},
  // v3.7 — the Morning Scale is its own tile now. It is a daily, time-critical, single
  // screen job, and as the second chip inside Daily Ops it was a two-tap job whose
  // location a worker had to remember. One section, so it opens straight into the form.
  scale:{ic:'⚖️',name:'Morning Scale',sub:'weigh, photograph, send',tn:'m_scale',
    tabs:[{k:'scale',t:'MORNING SCALE',scr:'dash',panels:['scalecard'],
           roles:['OWNER','MARKETING','WORKER'],ic:'⚖️',tn:'s_scale',
           d:'Weigh the baskets and photograph the scale display'}]},
  ops:{ic:'📋',name:'Daily Ops',sub:'tasks, stock out',tn:'m_ops',
    tabs:[{k:'tasks',t:"TODAY'S TASKS",scr:'dash',panels:['opstasks','opsgeneral','opshistory'],ic:'📋',tn:'s_tasks',d:'The jobs assigned to you, with one-tap completion'},
          {k:'out',  t:'STOCK OUT',    scr:'stock',panels:['pnl-out','onhandcard'],ic:'📤',tn:'s_stockout',d:'Draw material from the store, against a lot'},
          {k:'assign',t:'ASSIGN WORK', scr:'dash',panels:['opsassign'],roles:FULL_ROLES,ic:'👷',d:'Give the crew their jobs'},
          // kept for Owner / Marketing only — for them weighing is occasional stand-in
          // work, not their morning, so it does not earn a tile of its own.
          {k:'scale',t:'MORNING SCALE',scr:'dash',panels:['scalecard'],roles:FULL_ROLES,ic:'⚖️',d:'Weigh the baskets and photograph the scale display'}]},
  agro:{ic:'🌱',name:'Agronomist',sub:'program builder, timeline, weather',
    // v3.12 — the seasonal matrix is the Agronomist's main tool now and therefore sits
    // first. The v2.6 "My sets" AI->brand builder is untouched and still lives under the
    // month timeline: every set the Owner has already built keeps its edit path.
    tabs:[{k:'build',t:'PROGRAM BUILDER',scr:'dash',panels:['agromatrix'],roles:FULL_ROLES,ic:'🧬',tn:'s_builder',d:'Build a five-part combo by active ingredient, per 1,000 L tank'},
          {k:'month',t:'THIS MONTH',scr:'dash',panels:['agromonth'],  roles:FULL_ROLES,ic:'🌱',d:'The phase timeline and what is due'},
          {k:'wx',   t:'WEATHER',   scr:'dash',panels:['agroweather','agrorain'],roles:FULL_ROLES,ic:'🌧️',d:'Rain gauge and spray-window advice'},
          {k:'rec',  t:'RECORD',    scr:'dash',panels:['agrorecord'], roles:FULL_ROLES,ic:'📝',d:'Log what was actually applied'}]},
  // v3.7 — reordered: the four hands-on sections first, the two planning ones last.
  // The landing section is still STOCK IN, so no muscle memory breaks.
  inv:{ic:'📦',name:'Inventory',sub:'stock in/out, levels, alerts',tn:'m_inv',
    // v3.16 — TILE D · the Purchaser's SUPPLY HUB. Receiving an invoice, matching a brand
    // to the ingredient the Owner asked for, and onboarding a product the store has never
    // carried are one continuous job done at one desk, and splitting them across three
    // sections made the Purchaser re-key the same product twice. alloccard and onboardcard
    // were physically moved into the stock screen in index.html so all four forms and the
    // live on-hand list can share one page. The three original sections are kept below,
    // unchanged, so every existing deep link and habit still lands.
    tabs:[{k:'hub', t:'SUPPLY HUB',   scr:'stock',panels:['alertcenter','pnl-in','alloccard','onboardcard','onhandcard'],roles:['OWNER','MARKETING','PURCHASER'],ic:'🛒',tn:'s_supplyhub',d:'Invoice in, brand matched, new product, live stock — one page'},
          {k:'in',  t:'STOCK IN',     scr:'stock',panels:['alertcenter','pnl-in','onhandcard'],roles:['OWNER','MARKETING','PURCHASER'],ic:'📥',tn:'s_stockin',d:'Receive goods against a supplier invoice'},
          // v3.12 — the two sections that close the gap between the office and Sandakan.
          // Both sit immediately under STOCK IN because they are the Purchaser's morning.
          // v3.16 — scr is 'stock' now, not 'dash': both cards were moved into the stock
          // screen so the Supply Hub above can render them beside Stock In. Naming the
          // wrong screen here would show the section header with an empty body.
          {k:'alloc',t:'AI ➔ BRAND',  scr:'stock',panels:['alloccard'],roles:['OWNER','MARKETING','PURCHASER'],ic:'🔗',tn:'s_alloc',d:'Match a brand in the store to each ingredient the Owner asked for'},
          {k:'onboard',t:'NEW PRODUCT',scr:'stock',panels:['onboardcard'],roles:['OWNER','MARKETING','PURCHASER'],ic:'🆕',tn:'s_onboard',d:'Add a commercial item to the store catalogue'},
          {k:'out', t:'STOCK OUT',    scr:'stock',panels:['pnl-out','onhandcard'],             roles:FULL_ROLES,ic:'📤',d:'Draw material for a job, against a lot'},
          {k:'lvl', t:'STOCK LEVEL',  scr:'dash', panels:['invcc'],                            roles:FULL_ROLES,ic:'📦',tn:'s_stocklvl',d:'Live valuation, reorder alerts, active ingredients'},
          {k:'take',t:'STOCK-TAKE',   scr:'dash', panels:['stocktake'],                        roles:FULL_ROLES,ic:'🧾',d:'Physical count vs system, posted as an adjustment'},
          {k:'chk', t:'PROGRAM CHECK',scr:'dash', panels:['progcheck'],                        roles:['OWNER','MARKETING','PURCHASER'],ic:'🔍',tn:'s_progcheck',d:'Will the active spray programme run out?'},
          {k:'next',t:'NEXT PHASE',   scr:'dash', panels:['progready'],                        roles:['OWNER','MARKETING','PURCHASER'],ic:'📅',tn:'s_nextphase',d:'What to order now for the phase after this one'}]},
  // v3.0 — Marketing is the morning dispatch desk: weigh the baskets, invoice the
  // retailer, watch the credit come down. Owner and Marketing only.
  // v3.16 — TILE E · REVIEW & CREDIT. The Marketer's morning is auditing what the field
  // weighed, not opening a merchant card, so LIVE DISPATCH REVIEW is the landing section
  // and the tile is named for it. RETAILERS drops to second. Marketing keeps the ledger,
  // the contract books and the price/tare matrix: nobody else sets basket tare, and
  // pulling MARKETING out of FULL_ROLES would have moved ~40 gates to fix one label.
  mkt:{ic:'📊',name:'Review & Credit',sub:'dispatch review, merchant credit',tn:'m_mkt',
    tabs:[{k:'verify',t:'LIVE DISPATCH REVIEW',scr:'dash',panels:['verifycard'], roles:FULL_ROLES,ic:'📷',tn:'s_review',d:'Check the scale photo against the keyed figures, then approve and dispatch'},
          {k:'disp',  t:'RETAILERS',          scr:'dash',panels:['dispatchcard'],roles:FULL_ROLES,ic:'🚚',d:'Open a merchant card and invoice a load'},
          {k:'ledger',t:'DELIVERY LEDGER',    scr:'dash',panels:['mktledger'],  roles:FULL_ROLES,ic:'🧾',d:'Every dispatch and top-up, newest first'},
          {k:'price', t:'PRICES & MERCHANTS', scr:'dash',panels:['pricecard'],  roles:FULL_ROLES,ic:'💲',d:'Contract books, daily spot matrix, basket tare'},
          {k:'sell',  t:'OTHER SALES',        scr:'dash',panels:['mktpanel'],   roles:FULL_ROLES,ic:'🏷️',d:'Cash sales outside the merchant accounts'}]},
  // v3.7 — what you READ, split from what you ADMINISTER. Month Ledger is weekly;
  // Master DB is twice a season. They should not be neighbours on one list.
  // v3.16 — was 📊, which now collides with the Review & Credit tile on the Owner's home
  // screen. Two identical icons in one 2-column grid is a tile you have to read rather
  // than recognise, which is the whole point of the Big Tile layout.
  reports:{ic:'🗂️',name:'Reports',sub:'audit, ledger, costing, labour',
    tabs:[{k:'daily', t:'DAILY AUDIT', scr:'dash',panels:['dailyaudit'],  roles:FULL_ROLES,ic:'📅',d:'Day by day: tied, good, loss, kg out'},
          {k:'matrix',t:'MONTH LEDGER',scr:'dash',panels:['matrixledger'],roles:FULL_ROLES,ic:'📊',d:'Yield, revenue, spend and drawdown by month'},
          // v3.12 — what the directives actually cost, rolled up three ways. Separate
          // from COSTING because that reads the whole stock ledger; this reads only work
          // done against an issued programme, which is the number the Owner budgets on.
          {k:'runs',  t:'PROGRAM RUNS',scr:'dash',panels:['runcostcard'],roles:FULL_ROLES,ic:'🧪',tn:'s_runs',d:'Daily, monthly and yearly cost of the work actually done'},
          // v3.15 — what was promised against what landed, by month and by year
          // v3.16 — was 📅, the same icon as DAILY AUDIT two rows above it in the same
          // section list. 🏁 says what this screen is: finished on time, or not.
          {k:'record',t:'PROGRAM RECORD',scr:'dash',panels:['progrecord'],roles:FULL_ROLES,ic:'🏁',tn:'s_record',d:'Issued, finished, on time or late — by month and year'},
          {k:'sum',   t:'COSTING',     scr:'dash',panels:['ledgercard'],  roles:FULL_ROLES,ic:'📒',d:'The raw stock ledger, month by month'},
          {k:'labour',t:'LABOUR',      scr:'dash',panels:['labourcard'],  roles:FULL_ROLES,ic:'💵',d:'Man-hours and the rate they are priced at'}]},
  admin:{ic:'🔐',name:'Admin',sub:'corrections, yield, master, keys',tn:'m_admin',
    tabs:[{k:'corr',  t:'ADJUSTMENTS',scr:'dash',panels:['corrpanel'], roles:FULL_ROLES,ic:'✏️',tn:'s_adjust',d:'Approve or reject field correction requests'},
          // v3.2 — the dual-signature yield audit is the Owner's alone. Marketing weighs
          // the fruit, so Marketing does not get to mark its own homework.
          {k:'yield', t:'YIELD AUDIT', scr:'dash',panels:['yieldaudit'],roles:['OWNER'],ic:'🔎',d:'Fruit counted vs fruit weighed — the mismatch list'},
          // v3.3 — the Owner's master override suite. OWNER only, and the panel renders
          // an empty string for anyone else so none of its markup reaches the DOM.
          {k:'master',t:'MASTER DB',   scr:'dash',panels:['masterdb'], roles:['OWNER'],ic:'🔐',d:'Owner override suite, tree expansion, QR tags'},
          {k:'reg',   t:'STAFF',       scr:'dash',panels:['keyspanel'],roles:FULL_ROLES,ic:'🔑',tn:'s_staff',d:'Access keys and who may do what'}]}
};
// v3.7 — tile order per role. The role gate is applied here AND again in roleAllows(),
// so calling straight into a module still exposes nothing extra.
// Owner/Marketing: 8 tiles — which renders in the same four rows of a 2-column grid as
// seven did, so splitting Costing/Admin costs no screen height at all.
// Worker: 4 tiles, three of which have ONE section and therefore open at a single tap.
// v3.16 — four isolated workspaces. Each role's FIRST tile is the job it actually opens
// the phone to do, so the landing screen is the work and not a menu of everything.
//   OWNER     — Command first, then the eight working tiles it summarises.
//   MARKETING — Review & Credit first; the dispatch queue is the marketer's morning.
//   WORKER    — field actions only, and Morning Scale is one of the four.
//   PURCHASER — Inventory only, landing on the merged Supply Hub. No harvest, no money.
const HUB_ORDER={
  OWNER:    ['cmd','harvest','tying','inv','agro','ops','mkt','reports','admin'],
  MARKETING:['mkt','harvest','tying','inv','agro','ops','reports','admin'],
  WORKER:   ['harvest','tying','scale','ops'],   // + Morning Scale as its own tile
  PURCHASER:['inv']                              // Inventory ONLY — no harvest, no money
};
/* v3.7 legacy shim — 'costadmin' was split into 'reports' + 'admin'. Anything still
   asking for the old key (a saved deep link, an older guide, a stale test) lands on
   Reports rather than bouncing the person to Home with no explanation. */
const MODULE_ALIAS={costadmin:'reports'};
const HUB_PANELS=['kpis','phibox','lotcard','mktcard','dashnote','invcc','ledgercard','stocktake',
  'corrpanel','keyspanel','alertcenter','pnl-in','pnl-out','onhandcard',
  'opstasks','opshistory','agrophases','agroproj','progcheck',
  'opsgeneral','opsassign','labourcard','agroweather','progready',
  'agrorain','agromonth','agrorecord','tyingcard','wavecard','mktpanel',
  'tallycard','dispatchcard','mktledger','pricecard','yieldaudit','yieldstrip','masterdb',
  // v3.6 — a panel that is NOT in this list is never hidden by hideAllPanels() and leaks
  // onto every other screen. That has bitten this codebase once already.
  'scalecard','verifycard','dailyaudit','matrixledger',
  // v3.12 FIX — 'backlogcard' has been a live panel since v3.9 and was never in this
  // list, so hideAllPanels() could not hide it: once a worker opened BACKLOG the card
  // stayed on screen over every other section for the rest of the session. Exactly the
  // failure the v3.6 comment above warns about, caught by the panel-coverage test.
  'backlogcard',
  // v3.12 — four new panels. Leaving one out of this list does not hide it: it leaks
  // onto every other screen, which is exactly what happened once already in v3.6.
  'agromatrix','alloccard','onboardcard','runcostcard',
  'progrecord',
  // v3.16 — the Owner's Executive Summary. Same rule as every entry above it: a panel
  // missing from this array is never hidden and leaks onto every other screen.
  'cmdexec',
  // v3.17 — the other two Command tabs. Left out of this list they would sit on top of
  // every other screen for the rest of the session; that has happened twice already
  // (v3.6 and again with backlogcard in v3.12), so the panel-coverage test now fails
  // the build if any panel id in index.html is missing here.
  'cmdtoday','cmdcompare'];
let curModule=null, curTab=null;

function myRole(){return (CFG&&CFG.role)||'WORKER';}
function allowedTabs(){return ROLE_TABS[myRole()]||ROLE_TABS.WORKER;}
function hubTiles(){return HUB_ORDER[myRole()]||HUB_ORDER.WORKER;}
function tabsFor(k){
  const m=MODULES[k];if(!m)return [];
  const r=myRole();
  return m.tabs.filter(t=>!t.roles||t.roles.indexOf(r)>=0);}
// second, independent gate — a panel never renders for a role not entitled to it
function roleAllows(id){
  const r=myRole(), full=FULL_ROLES.indexOf(r)>=0;
  switch(id){
    case 'pnl-in': case 'alertcenter': return full||r==='PURCHASER';
    case 'progcheck': case 'progready': return full||r==='PURCHASER';
    case 'pnl-out': case 'opstasks': case 'opshistory': case 'opsgeneral': return full||r==='WORKER';
    case 'opsassign': case 'labourcard': case 'agroweather': return full;
    case 'agrorain': case 'agromonth': case 'agrorecord': case 'tyingcard':
    case 'wavecard': case 'mktpanel': return full;
    // v3.0 — the tally clicker is a field tool: worker + Owner/Marketing, never the Purchaser
    case 'tallycard': return full||myRole()==='WORKER';
    // v3.0 — anything carrying a retailer credit balance is Owner / Marketing only
    case 'dispatchcard': case 'mktledger': case 'pricecard': return full;
    // v3.6 — the worker's scale form shows weight and a photo, never a price, so a
    // Worker may reach it. The verification hub deducts credit, so they may not.
    case 'scalecard':    return full||myRole()==='WORKER';
    case 'verifycard':   return full;
    // v3.6 — the summary ledger carries revenue per merchant and spend per lot.
    // Owner and Marketer only, exactly as briefed.
    case 'dailyaudit': case 'matrixledger': return full;
    // v3.2 — the yield audit names who counted and who weighed. Owner only.
    case 'yieldaudit': case 'yieldstrip': return myRole()==='OWNER';
    case 'masterdb': return myRole()==='OWNER';
    // v3.16 — the Executive Summary carries retailer revenue, material drawdown and a
    // recommended credit ceiling. Owner alone, and renderCmdExec() writes an empty string
    // for anyone else so none of its markup ever reaches the DOM.
    case 'cmdexec': return myRole()==='OWNER';
    // v3.17 — TODAY carries today's invoiced RM and the month's margin; COMPARE carries
    // revenue, material and labour against the previous period. Owner alone, and both
    // painters write an empty string for anyone else, exactly like cmdexec above.
    case 'cmdtoday': case 'cmdcompare': return myRole()==='OWNER';
    // v3.12 — the recipe is the Agronomist's. Only Owner/Marketing may write one.
    case 'agromatrix': return full;
    // The allocation matrix and the onboarding form are the Purchaser's daily job, with
    // Owner/Marketing able to cover when Sandakan is offline — the same widening that
    // was applied to basket tare and the spot matrix in v3.11.
    case 'alloccard': case 'onboardcard': return full||myRole()==='PURCHASER';
    // Run costing carries RM per lot. Owner and Marketer only, like every other ledger.
    case 'runcostcard': return full;
    // v3.15 — the programme record is a management view: what was promised, what landed.
    case 'progrecord': return full;
    case 'onhandcard':                 return true;
    case 'invcc': case 'ledgercard': case 'stocktake': case 'corrpanel': case 'keyspanel':
    case 'kpis': case 'phibox': case 'lotcard':
    case 'mktcard': case 'dashnote':   return full;
    default: return true;
  }
}
function tileBadge(k){
  // v3.16 — the Command tile carries whatever the Owner has to ACT on today, in the order
  // it costs them money: a tree bleeding unsecured fruit, then a programme past its date,
  // then a merchant about to run out of prepaid credit mid-wave.
  if(k==='cmd'){
    const v=(typeof varianceAlerts==='function')?varianceAlerts().length:0;
    if(v)return {t:v+' '+tr('bg_variance')};
    const od=(typeof overdueDirectives==='function')?overdueDirectives().length:0;
    if(od)return {t:od+' '+tr('bg_late')};
    const cr=(typeof creditAdvice==='function')?creditAdvice().filter(c=>c.raise).length:0;
    if(cr)return {t:cr+' '+tr('bg_credit'),amber:1};
    // v3.17 — everything else the TODAY tab is holding: a load waiting on the Owner's
    // eye, an ingredient with no brand, stock under its minimum, a correction, a phone
    // gone quiet. Without this the tile reads "nothing to do" while five things wait.
    const rest=(typeof needsYou==='function')?needsYou().length:0;
    return rest?{t:rest+' '+tr('bg_todo'),amber:1}:null;}
  if(k==='inv'){
    // v3.12 — an ingredient with no brand behind it outranks a reorder alert: a low
    // product still lets the crew work, an unallocated slot stops them dead.
    const u=(typeof unallocatedSlots==='function')?unallocatedSlots():0;
    if(u)return {t:u+' TO MATCH'};
    const n=programShortages().length||lowStock().length;
    return n?{t:(programShortages().length?programShortages().length+' SHORT':n+' LOW')}:null;}
  // v3.7 — the returned-load badge sits on the Morning Scale tile, which is the tile the
  // worker has to open to fix it. On Daily Ops it pointed at the wrong place.
  if(k==='scale'){
    // v3.9 — the badge counts loads that still NEED THE WORKER TO DO SOMETHING, not
    // rejections that happened today. A load returned yesterday and never fixed is exactly
    // the case that used to disappear, and it is the one holding fruit in limbo.
    const back=(typeof myReturnedLoads==='function')?myReturnedLoads().length:0;
    if(back)return {t:back+' '+tr('rl_tofix')};
    const mine=pendingDispatches().filter(e=>!CFG||!CFG.uid||String(e.workerId||'')===String(CFG.uid||'')).length;
    return mine?{t:mine+' '+tr('sc_pending'),amber:1}:null;}
  if(k==='ops'){
    // v3.12 — a directive waiting on a brand still counts as work the crew is carrying.
    // It is the thing they need to see, and hiding it is what made them ring the office.
    const n=myTasks().length+myGeneralTasks().length+
      ((typeof myDirectives==='function')?myDirectives().length:0);
    return n?{t:n+' '+tr('bg_tasks')}:null;}
  if(k==='agro'){
    // v3.15 — a programme past its date with work outstanding outranks everything else
    // on this tile. It is the one thing the Owner has to act on rather than read about.
    const od=(typeof overdueDirectives==='function')?overdueDirectives().length:0;
    if(od)return {t:od+' '+tr('bg_late')};
    if(WEATHER==='RAINY'){const risky=activePrograms().filter(r=>{const a=weatherAdvice(r,r.lines);return a&&!a.ok;});
      if(risky.length)return {t:'🌧️ '+risky.length+' AT RISK'};}
    const n=activePrograms().length;return n?{t:n+' ACTIVE',amber:1}:null;}
  // v3.7 — costadmin was split; the yield alert and the pending queue follow the section
  // they belong to, so a badge always names a tile that can actually resolve it.
  if(k==='admin'){
    // v3.2 — an unresolved yield mismatch outranks a pending correction: it is the one
    // that means fruit may be walking off the farm.
    const y=(typeof yieldFlags==='function'&&myRole()==='OWNER')?yieldFlags().length:0;
    if(y)return {t:y+' YIELD ALERT'+(y>1?'S':'')};
    const n=CORRECTIONS.filter(c=>String(c.status).toUpperCase()==='PENDING').length;
    return n?{t:n+' PENDING',amber:1}:null;}
  if(k==='mkt'){
    // v3.6 — photo proof waiting on a human beats a standing "kg ready" figure. Red, not
    // amber: a load sitting unverified is fruit that has been weighed and not invoiced.
    const p=pendingDispatches().length;
    if(p)return {t:p+' TO VERIFY'};
    const kg=Math.round(collectedKg()-soldKg());
    return kg>0?{t:nf(kg)+' KG READY',amber:1}:null;}
  if(k==='harvest'){const b=LOT_KEYS.reduce((s,L)=>s+lotLedger(L).current_tied_balance,0);
    return b>0?{t:nf(b)+' '+tr('bg_onstring')}:null;}
  if(k==='tying'){
    const rope=ropeOnHand();
    if(rope<0)return {t:tr('bg_ropeshort')};                 // red, flashing — key the rolls in
    const today=todayStr();
    const n=EVENTS.filter(e=>e.type==='TIE'&&String(e.dt||'').slice(0,10)===today)
      .reduce((a,e)=>a+(+e.n||0),0);
    return n?{t:nf(n)+' '+tr('bg_tiedtoday'),amber:1}:null;}
  return null;}
function renderHub(){
  if(!$('hubtiles'))return;
  $('hub-name').textContent=(CFG&&CFG.worker)||'—';
  $('hub-role').textContent=tr('role_'+myRole(),ROLE_LABEL[myRole()]||myRole());
  $('hub-dev').innerHTML=((CFG&&CFG.device)||'—')+'<br>'+APP_VERSION;
  $('hubtiles').innerHTML=hubTiles().map(k=>{
    const m=MODULES[k];if(!m)return '';
    const b=tileBadge(k);
    return '<div class="tile" onclick="openModule(\''+k+'\')"><span class="ti">'+m.ic+'</span>'+
      '<div class="tn">'+esc(moduleLabel(m))+'</div><div class="ts">'+esc(tileSub(k,m))+'</div>'+
      (b?'<div class="tbadge'+(b.amber?' amber':'')+'">'+esc(b.t)+'</div>':'')+'</div>';}).join('');}
function showScreen(x){
  SCREENS.forEach(k=>$('scr-'+k).classList.toggle('hidden',k!==x));
  $('scr-setup').classList.add('hidden');$('scr-login').classList.add('hidden');
  $('nav-home').classList.toggle('on',x==='home');
  $('nav-sync').classList.toggle('on',x==='sync');}
function hideAllPanels(){
  HUB_PANELS.forEach(id=>{const el=$(id);if(!el)return;
    if(id==='phibox'){el.dataset.dashhide='1';el.style.display='none';return;}
    el.style.display='none';});}
function goHome(){
  if(!CFG||!CFG.key||!CFG.worker){showLogin();return;}   // v2.5.1: the hub is never reachable without a key
  curModule=null;curTab=null;inMenu=false;
  hideAllPanels();
  $('subbar').classList.add('hidden');$('subbar').innerHTML='';
  showScreen('home');
  $('backbtn').classList.add('hidden');
  $('ttl').textContent='Sugut DMS';
  renderHub();}
/** v3.7 — ← now walks back one level at a time: section → section menu → home. Going
 *  straight to Home from a section would make the menu a screen you can only reach by
 *  starting over, which is exactly the trap the chip bar had. */
function hubBack(){
  if(!CFG||!CFG.key||!CFG.worker){showLogin();return;}    // v2.5.1: tapping the title never bypasses login
  if($('scr-home').classList.contains('hidden')){
    if(curModule&&!inMenu&&tabsFor(curModule).length>1){openMenu(curModule);return;}
    goHome();}}
/* ======================================================================================
   v3.7 · STRICT BIG TILE ROUTING
   ======================================================================================
   Home → tile → section, and every step is a full-width thumb target.

   The horizontal chip bar is gone. It had grown to the point where the Owner's
   Costing / Admin bar was 430 px wider than the phone — more than a whole screen width
   of sections reachable only by swiping a strip that does not look swipeable. Four of
   seven tiles overflowed. A vertical list cannot do that: it can only get longer, and a
   long list is something people already know how to scroll.

   openModule(k) with no section named opens the MENU for a multi-section tile, and goes
   straight into the work for a single-section one. openModule(k, sectionKey) still opens
   that section directly, so every existing call site, deep link and test keeps working.
   ====================================================================================== */
let inMenu=false;

function openModule(k,tabKey){
  k=MODULE_ALIAS[k]||k;
  const m=MODULES[k];
  if(!m||hubTiles().indexOf(k)<0){goHome();return;}
  const tabs=tabsFor(k);
  if(!tabs.length){goHome();return;}
  // No section named and more than one to choose from -> show the menu, not a guess.
  if(!tabKey&&tabs.length>1){openMenu(k);return;}
  const tab=tabs.find(t=>t.k===tabKey)||tabs[0];
  curModule=k;curTab=tab.k;inMenu=false;
  hideAllPanels();
  (tab.panels||[]).forEach(id=>{const el=$(id);if(!el||!roleAllows(id))return;
    if(id==='phibox'){el.dataset.dashhide='';return;}
    el.style.display='';});
  showScreen(tab.scr);
  $('backbtn').classList.remove('hidden');
  // The header names the SECTION, with the tile above it, so a person who has drilled two
  // levels down can still see where they are.
  $('ttl').textContent=tabs.length>1?tabLabel(tab):moduleLabel(m);
  const sb=$('subbar'); sb.classList.add('hidden'); sb.innerHTML='';   // retired in v3.7
  renderForTab(k,tab.k);
  $('scr-'+tab.scr).scrollTop=0;}

/** The section list for one tile. One row per section, nothing off the right edge. */
function openMenu(k){
  const m=MODULES[k]; if(!m)return goHome();
  const tabs=tabsFor(k); if(!tabs.length)return goHome();
  if(tabs.length===1)return openModule(k,tabs[0].k);
  curModule=k;curTab=null;inMenu=true;
  hideAllPanels();
  const sb=$('subbar'); sb.classList.add('hidden'); sb.innerHTML='';
  $('menuhead').innerHTML=tr('menuhead');
  $('menulist').innerHTML=tabs.map(x=>{
    const b=sectionBadge(k,x.k);
    return '<div class="mrow2" onclick="openModule(\''+esc(k)+'\',\''+esc(x.k)+'\')">'+
      '<div class="mi">'+(x.ic||'▫')+'</div>'+
      '<div class="mt"><div class="mn">'+esc(tabLabel(x))+'</div>'+
        '<div class="md">'+esc(sectionDesc(x))+'</div></div>'+
      (b?('<div class="mb'+(b.amber?' amber':'')+'">'+esc(b.t)+'</div>'):'')+
      '<div class="mg">›</div></div>';}).join('');
  showScreen('menu');
  $('backbtn').classList.remove('hidden');
  $('ttl').textContent=moduleLabel(m);
  $('scr-menu').scrollTop=0;}

/** A count worth carrying onto the row itself, so the menu says where the work is. */
function sectionBadge(k,tk){
  if(k==='mkt'&&tk==='verify'){const n=pendingDispatches().length; return n?{t:String(n)}:null;}
  if(k==='admin'&&tk==='corr'){
    const n=CORRECTIONS.filter(c=>String(c.status).toUpperCase()==='PENDING').length;
    return n?{t:String(n),amber:1}:null;}
  if(k==='admin'&&tk==='yield'&&myRole()==='OWNER'){
    const n=(typeof yieldFlags==='function')?yieldFlags().length:0; return n?{t:String(n)}:null;}
  if(k==='inv'&&tk==='lvl'){const n=lowStock().length; return n?{t:String(n),amber:1}:null;}
  if(k==='inv'&&tk==='alloc'){const n=unallocatedSlots(); return n?{t:String(n)}:null;}
  if(k==='reports'&&tk==='record'){const n=overdueDirectives().length; return n?{t:String(n)}:null;}
  if(k==='agro'&&tk==='build'){
    const n=AGRO_DRAFTS.filter(d=>!d.deleted&&d.status==='DRAFT').length;
    return n?{t:String(n)+' DRAFT',amber:1}:null;}
  return null;}
function renderV26(){renderWeather();renderGeneralTasks();renderAssign();
  renderLabour();renderReady();renderRain();renderTimeline();renderRecord();
  renderTying();renderMyLogs();renderRotCauses();renderWave();renderMarketing();
  renderGradeRows();renderTally();renderDispatch();renderMktLedger();renderPrices();
  renderYieldAudit();renderMasterDB();
  renderScaleCard();renderVerify();renderDailyAudit();renderMatrix();
  renderAgroMatrix();renderAllocCard();renderOnboard();renderRunCost();renderProgRecord();
  renderCmdExec();}
function renderForTab(k,t){
  if(k==='harvest'&&t==='log'){buildLotSelect();renderMyCorrections();renderMyLogs();renderRotCauses();
    renderGradeRows();refreshTreeBoard();}
  if(k==='harvest'&&t==='wave')renderWave();
  if(k==='harvest'&&t==='today')renderDash();
  if(k==='tying'&&t==='tally')renderTally();
  if(k==='tying'&&t==='bal')renderTying();
  if(k==='ops'&&t==='tasks'){renderOpsTasks();renderGeneralTasks();renderOpsHistory();}
  if(k==='ops'&&t==='scale')renderScaleCard();
  if(k==='ops'&&t==='out'){renderOutOpts();renderStock();}
  if(k==='ops'&&t==='assign')renderAssign();
  if(k==='agro'&&t==='month')renderTimeline();
  if(k==='agro'&&t==='wx'){renderWeather();renderRain();}
  if(k==='agro'&&t==='rec')renderRecord();
  if(k==='inv'&&t==='in'){renderInOpts();renderAlerts();renderStock();}
  if(k==='inv'&&t==='chk')renderProgCheck();
  if(k==='inv'&&t==='next')renderReady();
  if(k==='inv'&&t==='out'){renderOutOpts();renderStock();}
  if(k==='inv'&&t==='lvl')renderInvCC();
  if(k==='inv'&&t==='take'){renderStOpts();renderStRecent();}
  if(k==='mkt'&&t==='disp')renderDispatch();
  if(k==='mkt'&&t==='verify')renderVerify();
  if(k==='mkt'&&t==='ledger')renderMktLedger();
  if(k==='mkt'&&t==='price')renderPrices();
  if(k==='reports'&&t==='daily')renderDailyAudit();
  if(k==='reports'&&t==='matrix')renderMatrix();
  if(k==='admin'&&t==='yield')renderYieldAudit();
  if(k==='admin'&&t==='master')renderMasterDB();
  if(k==='mkt'&&t==='sell')renderMarketing();
  if(k==='reports'&&t==='sum')renderLedgerSummary();
  if(k==='reports'&&t==='labour')renderLabour();
  if(k==='admin'&&t==='corr')renderCorrections();
  if(k==='admin'&&t==='reg')renderKeys();
  if(k==='scale'&&t==='scale')renderScaleCard();
  if(k==='harvest'&&t==='backlog')renderBacklog();
  // v3.12
  if(k==='agro'&&t==='build')renderAgroMatrix();
  if(k==='inv'&&t==='alloc')renderAllocCard();
  if(k==='inv'&&t==='onboard')renderOnboard();
  if(k==='reports'&&t==='runs')renderRunCost();
  if(k==='reports'&&t==='record')renderProgRecord();
  // v3.16 — Tile F. The builder and the master suite reuse the panels the agro/admin
  // tiles already render, so only the Executive Summary needs its own painter.
  if(k==='cmd'&&t==='today')renderCmdToday();
  if(k==='cmd'&&t==='cmp')renderCmdCompare();
  if(k==='cmd'&&t==='exec')renderCmdExec();
  if(k==='cmd'&&t==='build')renderAgroMatrix();
  if(k==='cmd'&&t==='master')renderMasterDB();
  // v3.16 — the merged Purchaser page paints every form it carries in one pass.
  if(k==='inv'&&t==='hub'){renderInOpts();renderAlerts();renderStock();renderAllocCard();renderOnboard();}}
/** v3.2 — a session ALWAYS starts on the retailer list. Without this, logging out and
 *  back in — possibly as a different person — left the previous user's open retailer
 *  card, their half-keyed baskets and any granted overdraft override on the screen. */
function resetMarketingView(){
  if(typeof MKT_SEL!=='undefined')MKT_SEL='';
  if(typeof DLINES!=='undefined')DLINES=[];
  if(typeof DNOTE!=='undefined')DNOTE='';
  if(typeof clearOverride==='function')clearOverride();
  if(typeof LAST_INVOICE_UUID!=='undefined')LAST_INVOICE_UUID='';
  // v3.6 — same rule for every new piece of module-level view state. PHOTO_SEEN in
  // particular MUST be cleared: it is the record that THIS person looked at the photo,
  // and inheriting it would let the next marketer approve a load sight unseen.
  if(typeof VERIFY_SEL!=='undefined')VERIFY_SEL='';
  if(typeof PHOTO_SEEN!=='undefined')PHOTO_SEEN={};
  if(typeof PRICE_SEL!=='undefined')PRICE_SEL='SPOT';
  if(typeof WLINES!=='undefined')WLINES=[];
  if(typeof W_PHOTO!=='undefined')W_PHOTO='';
  if(typeof W_NOTE!=='undefined')W_NOTE='';
  if(typeof W_RET!=='undefined')W_RET='';
  // v3.8 — an open gatepass is one worker's load. A different person logging in on this
  // phone must not land on the previous worker's gate tally.
  if(typeof W_GATEPASS!=='undefined')W_GATEPASS='';
  // v3.9 — a half-finished correction belongs to one worker on one shift.
  if(typeof W_PLATE!=='undefined')W_PLATE='';
  if(typeof W_REDO!=='undefined')W_REDO=null;
  if(typeof closePhoto==='function')closePhoto();}
function applyRole(){
  resetMarketingView();
  // v3.16 — the same class of bug resetMarketingView() was written for in v3.2. The
  // Owner's Executive Summary carries retailer revenue and a credit ceiling; hiding the
  // panel leaves that markup sitting in the DOM of whoever logs in next on the same
  // phone. Repainting it under the new role empties it, because renderCmdExec() writes
  // an empty string for anyone who is not the Owner.
  if(typeof renderCmdExec==='function')renderCmdExec();
  const r=myRole();
  const full=FULL_ROLES.indexOf(r)>=0;
  SHOW_VALUES=full;                                   // gates every RM figure in the app
  // v3.7 — a Farm Worker on a phone nobody has set a language on starts in Malay.
  // An explicit tap on BM or EN is remembered and always wins over this default.
  const wasLang=LANG;
  if(!LANG_SET)LANG=(r==='WORKER')?'ms':'en';
  applyStaticLang(); renderLangChip();
  // a different person logged in on this phone — repaint anything language-dependent
  if(wasLang!==LANG&&typeof renderV26==='function')renderV26();
  // regulatory guardrail: the Sandakan Purchaser never sees harvest or correction tools
  const harvestOK=hubTiles().indexOf('harvest')>=0;
  if($('scr-harvest')) $('scr-harvest').style.display=harvestOK?'':'none';
  if($('corrbtn'))   $('corrbtn').style.display=(harvestOK&&canCorrect())?'':'none';
  if($('mycorr'))    $('mycorr').style.display=(harvestOK&&canCorrect())?'':'none';
  if(harvestOK&&canCorrect()) renderMyCorrections();
  renderHub();
  if(curModule&&hubTiles().indexOf(curModule)<0) goHome();   // role changed under us
}
function homeTab(){return 'home';}
// Legacy entry points kept so older call sites and the deploy guide still work.
const LEGACY_GO={harvest:'harvest',dash:'harvest',stock:'inv',ops:'ops',
  ledger:'reports',admin:'admin',mkt:'mkt',tie:'tying',tying:'tying'};
function go(s){
  if(s==='home'){goHome();return;}
  if(s==='sync'){hideAllPanels();$('subbar').classList.add('hidden');showScreen('sync');
    $('backbtn').classList.remove('hidden');$('ttl').textContent='Sync';renderSync();return;}
  const k=LEGACY_GO[s];
  if(k&&hubTiles().indexOf(k)>=0){openModule(k);return;}
  goHome();}

// ================= access key login =================
let pin='';
function findKey(k){return KEYS.find(x=>String(x.key).trim()===k);}
function buildKeypad(){
  const kp=$('keypad');kp.innerHTML='';
  ['1','2','3','4','5','6','7','8','9','CLEAR','0','⌫'].forEach(d=>{
    const b=document.createElement('div');b.textContent=d;
    if(d==='CLEAR'||d==='⌫')b.classList.add('fn');
    b.onclick=()=>{ if(d==='CLEAR')pin=''; else if(d==='⌫')pin=pin.slice(0,-1);
      else if(pin.length<6)pin+=d; renderPin(); if(pin.length===6)tryLogin(); };
    kp.appendChild(b);});
  renderPin();}
function renderPin(){const r=$('pinrow');r.innerHTML='';for(let i=0;i<6;i++){const b=document.createElement('div');b.className='pinbox'+(i<pin.length?' filled':'');b.textContent=i<pin.length?'•':'';r.appendChild(b);}$('pinerr').textContent='';}
async function tryLogin(){
  const w=findKey(pin);
  if(!w){$('pinerr').textContent=tr('login_wrong');pin='';setTimeout(renderPin,600);return;}
  if(String(w.status).toLowerCase()!=='active'){$('pinerr').textContent=tr('login_off');pin='';setTimeout(renderPin,900);return;}
  CFG=Object.assign({},CFG||{},{worker:w.name,role:w.role,key:w.key,uid:w.id});
  await persistCfg();pin='';
  // applyRole settles the language for THIS person first — greeting them in the previous
  // user's language would be the very first thing they saw.
  applyRole();
  toast(tr('login_welcome')+' '+w.name);
  $('nav-home').style.display='';$('nav-sync').style.display='';
  if(!CFG.url||!CFG.device) showSetup(); else goHome();}
function showLogin(){SCREENS.forEach(x=>$('scr-'+x).classList.add('hidden'));
  $('nav-home').style.display='none';$('nav-sync').style.display='none';
  $('backbtn').classList.add('hidden');$('ttl').textContent='Sugut DMS';
  $('scr-setup').classList.add('hidden');$('scr-login').classList.remove('hidden');$('ttl').textContent='Login';buildKeypad();
  // v3.17.1 — try to fetch the staff list the moment this screen opens, so the common
  // case (phone pushed out because the Owner changed a key, new key waiting in the
  // Sheet) needs no button press at all. Fire and forget: it must never delay the pad.
  const b=$('loginrefresh'); if(b)b.textContent='⟳ '+tr('login_refresh');
  const s=$('loginsync'); if(s){s.textContent='';s.style.color='';}
  refreshKeysOnly(0);}

/* ================= v3.17.1 · the login screen learns new staff =====================
   A phone only ever learned a new access key inside refreshMasters(), and EVERY caller
   of that function requires a session: boot takes the showLogin() branch and returns
   before it, netPull() bails on `!CFG.key`, and the Sync screen is behind the pad. So a
   phone that was logged out — or pushed out because the Owner changed a key — could
   never be told about a staff member added afterwards. It matched PINs against the list
   it was holding when it last synced, for ever. Same one-way-information fault as v3.5,
   v3.8.1 and v3.11; this time on the way IN.

   Deliberately narrow. It reads the WORKERS list and NOTHING else:
   - no kill switch. There is no session to judge, and a logged-out phone must never be
     able to wipe itself. The revocation path stays exactly where it was, in
     refreshMasters(), where CFG.key proves who this device claims to be.
   - no corrections, programmes, tasks, retailers, settings or tree totals. None of them
     is needed to decide whether six digits are real, and merging farm data with nobody
     logged in is how a previous user's rows end up on the next user's screen.
   - MASTER_SIG is SENT (so an unchanged tree/product master is not re-sent for a job
     that only wants the staff list) but never written back — the trees and products in
     this reply are dropped on the floor, so claiming to hold them would be a lie. */
async function refreshKeysOnly(manual){
  const say=(m,bad)=>{const el=$('loginsync');if(el){el.textContent=m;el.style.color=bad?'#b3261e':'#1b5e20';}};
  if(!CFG||!CFG.url){if(manual)say(tr('login_nourl'),1);return false;}
  if(!navigator.onLine){if(manual)say(tr('login_offline'),1);return false;}
  // A registry edited on THIS phone and not yet pushed still outranks the Sheet — the
  // same rule refreshMasters() applies at its own tail, so the two can never disagree.
  if(REG_DIRTY){if(manual)say(tr('login_dirty'),1);return false;}
  const btn=$('loginrefresh');
  if(btn){btn.disabled=true;btn.textContent=tr('login_refreshing');}
  try{
    const r=await fetchT(CFG.url+'?role=WORKER&uid=&sig='+encodeURIComponent(MASTER_SIG||''),{},SYNC_TIMEOUT_MS);
    const j=await r.json();
    if(!(j&&j.ok&&Array.isArray(j.workers)&&j.workers.length))throw new Error('no staff list');
    const ks=j.workers.filter(w=>w.AccessKey).map(w=>({
      id:String(w.WorkerID||w.Name||'').trim()||newUid(),
      name:w.Name||w.WorkerID,
      role:String(w.Role||'').toUpperCase().includes('OWNER')?'OWNER':
        String(w.Role||'').toUpperCase().includes('MARKET')?'MARKETING':
        String(w.Role||'').toUpperCase().includes('PURCH')?'PURCHASER':'WORKER',
      key:String(w.AccessKey).trim(),
      status:String(w.Status||'Active').trim()}));
    // An empty list is a fault, not an instruction. Adopting it would leave this phone
    // with no way in at all — the v3.10 "{} is truthy" landmine, in a worse place.
    if(!ks.length)throw new Error('no staff list');
    KEYS=ks.filter(x=>String(x.status).toLowerCase()!=='deleted');
    if(db)await put('kv',{k:'keys',v:KEYS});
    const n=KEYS.filter(x=>String(x.status).toLowerCase()==='active').length;
    say(tr('login_got').replace('{n}',n),0);
    return true;
  }catch(e){ if(manual)say(tr('login_syncfail'),1); return false; }
  finally{ if(btn){btn.disabled=false;btn.textContent='⟳ '+tr('login_refresh');} }}
async function logout(){if(!confirm('Log out of this device? (Queued events stay saved)'))return;
  CFG=Object.assign({},CFG,{worker:null,role:null,key:null,uid:null});await persistCfg();showLogin();}
async function forceLogout(msg){
  CFG=Object.assign({},CFG,{worker:null,role:null,key:null,uid:null});await persistCfg();
  showLogin();$('pinerr').textContent=msg||'Your access key was changed. Ask the Owner for the new one.';}

// ================= kill switch =================
function showLock(sim){$('wipeoverlay').classList.add('hidden');
  if(!sim){['login','setup'].concat(SCREENS).forEach(x=>$('scr-'+x).classList.add('hidden'));
    document.querySelector('.nav').classList.add('hidden');}
  $('lockscreen').classList.remove('hidden');$('simnote').classList.toggle('hidden',!sim);}
let simTaps=0;
async function realWipe(){
  if(db){try{const tx=db.transaction(['programs','tasks','blueprints','rain'],'readwrite');
    tx.objectStore('programs').clear();tx.objectStore('tasks').clear();
    tx.objectStore('blueprints').clear();tx.objectStore('rain').clear();}catch(e){}}
  PROGRAMS=[];TASKS=[];BLUEPRINTS=[];RAINFALL=[];
  // 1. wipe events + config + keys from IndexedDB
  await new Promise(res=>{if(!db){res();return;}const tx=db.transaction(['events','kv','corrections'],'readwrite');
    tx.objectStore('events').clear();tx.objectStore('kv').clear();
    tx.objectStore('corrections').clear();                 // v2.5.1: field notes must go too
    tx.oncomplete=res;tx.onerror=res;});
  EVENTS=[];CORRECTIONS=[];TREE_FIX={};REQ_DECIDED={};CFG=null;
  // 2. persist the lock so reopening the app stays locked
  if(db)await put('kv',{k:'locked',v:true});
  try{localStorage.clear();sessionStorage.clear();}catch(e){}
  LOCKED=true;}
// v2.5.1 — upload first, wipe second. A revoked worker may be carrying a whole day of
// offline drops; destroying them loses farm data that exists nowhere else. If the upload
// cannot complete we log the device out instead and retry the wipe on the next sync.
async function safeWipe(){
  const q=()=>pending()+corrUnsynced()+q4();
  if(q()>0)await doSync(true);
  if(q()>0){
    await forceLogout('Your access was removed. '+q()+' record(s) on this phone have not uploaded yet — '+
      'connect to the office Wi-Fi and open the app once more so nothing is lost.');
    return false;}
  await runWipeSequence(false);return true;}
async function runWipeSequence(sim){
  $('wipeoverlay').classList.remove('hidden');
  const steps=['ws1','ws2','ws3','ws4'];
  for(let i=0;i<steps.length;i++){
    await new Promise(r=>setTimeout(r,650));$(steps[i]).classList.add('on');
    if(!sim&&i===1)await realWipe();}
  await new Promise(r=>setTimeout(r,600));
  showLock(sim);}
function simulateKill(){
  if(!confirm('Run a SIMULATED kill switch on this device?\n\nYou will see exactly what a resigned worker sees. No real data is deleted.'))return;
  simTaps=0;$('simnote').onclick=()=>{if(++simTaps>=3){$('lockscreen').classList.add('hidden');['ws1','ws2','ws3','ws4'].forEach(s=>$(s).classList.remove('on'));toast('Simulation ended');}};
  runWipeSequence(true);}

// Pull correction requests + Owner decisions made on other phones.
// Rule: a decision from the sheet always beats a local PENDING row; a local row
// that has not been pushed yet always beats the sheet.
async function mergeCorrections(rows){
  let changed=false, approvedNow=0;
  for(const raw of rows){
    const sc={uuid:String(raw.uuid||raw.CorrectionUUID||'').trim(),dt:String(raw.dt||''),
      tree:String(raw.tree||''),lot:String(raw.lot||''),no:+raw.no||0,ctype:String(raw.ctype||'NOTE'),
      evUuid:String(raw.evUuid||''),evType:String(raw.evType||''),evDt:String(raw.evDt||''),
      oldVal:raw.oldVal===undefined?'':raw.oldVal,newVal:raw.newVal===undefined?'':raw.newVal,
      note:String(raw.note||''),worker:String(raw.worker||''),workerId:String(raw.workerId||''),
      device:String(raw.device||''),status:String(raw.status||'PENDING').toUpperCase(),
      decidedBy:String(raw.decidedBy||''),decidedAt:String(raw.decidedAt||''),synced:true};
    if(!sc.uuid||!sc.tree)continue;
    const lc=CORRECTIONS.find(x=>x.uuid===sc.uuid);
    if(!lc){ CORRECTIONS.push(sc); if(db)await put('corrections',sc);
      if(sc.status==='APPROVED'){
        if(sc.ctype==='LOGQTY')await applyLogCorrection(sc); else await bakeApproved(sc);
        approvedNow++;} changed=true; continue; }
    if(!lc.synced) continue;                                  // our unpushed edit wins
    if(lc.status===sc.status && lc.decidedBy===sc.decidedBy) continue;
    Object.assign(lc,sc); if(db)await put('corrections',lc);
    if(sc.status==='APPROVED'){
      if(lc.ctype==='LOGQTY')await applyLogCorrection(lc); else await bakeApproved(lc);
      approvedNow++;}
    changed=true;
  }
  if(changed){badge();renderCorrections();renderMyCorrections();
    if(curTree)selectTree(curTree.id);
    if(approvedNow)toast('✓ '+approvedNow+' approved tree correction'+(approvedNow>1?'s':'')+' applied');}}

// ================= master data refresh + revocation check =================
/** v3.10 — the signature of the slow-moving tables this phone already holds. */
let MASTER_SIG='';

async function refreshMasters(){
  if(!CFG||!CFG.url||!navigator.onLine)return null;
  let got={tasks:0,programs:0};
  try{
    // v3.10 — tell the Sheet who is asking and what we already have. A worker gets no
    // other worker's loads and no photographs; anyone whose signature still matches gets
    // no trees, products or retailers either. Measured: 2.9 MB -> ~20 KB at peak.
    const q='?role='+encodeURIComponent(myRole())+
            '&uid='+encodeURIComponent((CFG&&CFG.uid)||'')+
            '&sig='+encodeURIComponent(MASTER_SIG||'');
    const r=await fetchT(CFG.url+q,{},SYNC_TIMEOUT_MS);const j=await r.json();
    if(j&&j.sig&&j.sig!==MASTER_SIG){MASTER_SIG=j.sig;if(db)await put('kv',{k:'mastersig',v:MASTER_SIG});}
    // corrections are merged only AFTER the kill switch has cleared this device
    const inCorr=(j&&j.ok&&Array.isArray(j.corrections))?j.corrections:null;
    const inProg=(j&&j.ok&&Array.isArray(j.programs))?j.programs:null;
    const inTask=(j&&j.ok&&Array.isArray(j.tasks))?j.tasks:null;
    // v3.10 — LANDMINE. mergeRetailers() REPLACES the local list, and doGet now returns an
    // empty array when this phone's masters are already current. `if(inRet)` was true for
    // `[]`, so an unchanged-masters reply would have wiped every merchant off the phone.
    // Only a non-empty list is ever merged.
    const inRet =(j&&j.ok&&Array.isArray(j.retailers)&&j.retailers.length)?j.retailers:null;
    // v3.5 — the per-tree totals across EVERY phone. Stamped with the moment of the fetch
    // so a row pushed after this point is still added on top instead of being lost.
    const inStats=(j&&j.ok&&j.treestats&&typeof j.treestats==='object')?j.treestats:null;
    // v2.5.1: if the WORKERS tab is unreadable the kill switch cannot be evaluated, so
    // nothing is ingested either — a revoked phone must not keep receiving farm data.
    if(!(j&&j.ok&&Array.isArray(j.workers)&&j.workers.length))return got;
    const ks=j.workers.filter(w=>w.AccessKey).map(w=>({
      id:String(w.WorkerID||w.Name||'').trim()||newUid(),
      name:w.Name||w.WorkerID,
      role:String(w.Role||'').toUpperCase().includes('OWNER')?'OWNER':
        String(w.Role||'').toUpperCase().includes('MARKET')?'MARKETING':
        String(w.Role||'').toUpperCase().includes('PURCH')?'PURCHASER':'WORKER',
      key:String(w.AccessKey).trim(),
      status:String(w.Status||'Active').trim()}));
    if(!ks.length)return;

    // ---- kill switch: judge THIS device against the sheet, before anything else ----
    if(CFG.key){
      const byId=CFG.uid?ks.find(x=>x.id===CFG.uid):null;
      const byName=ks.find(x=>String(x.name).trim().toLowerCase()===String(CFG.worker||'').trim().toLowerCase());
      const byKey=ks.find(x=>String(x.key)===String(CFG.key));
      const me=byId||byName||byKey;
      // deleted from the registry entirely, or revoked / resigned
      if(!me||String(me.status).toLowerCase()!=='active'){
        if(await safeWipe())return got;          // wiped — this device is finished
        KEYS=ks.filter(x=>String(x.status).toLowerCase()!=='deleted');  // key is dead either way
        if(db)await put('kv',{k:'keys',v:KEYS});
        return got;}
      if(String(me.key)!==String(CFG.key)){      // Owner changed their key — not a wipe
        KEYS=ks;if(db)await put('kv',{k:'keys',v:KEYS});
        await forceLogout('Your access key was changed. Ask the Owner for the new 6-digit key.');return got;}
      CFG.uid=me.id;CFG.worker=me.name;CFG.role=me.role;await persistCfg();
    }
    if(inCorr)await mergeCorrections(inCorr);   // device is cleared — safe to ingest
    if(inProg)got.programs=await mergePrograms(inProg);  // agronomist phases from the Owner's phone
    if(inTask)got.tasks=await mergeTasks(inTask);        // general field jobs from the Owner's phone
    if(inRet)await mergeRetailers(inRet);               // retailer master + opening credit
    // v3.6 — pending scale photos come DOWN too. The worker weighs on one phone and the
    // marketer audits on another; without this the hub would only ever show loads
    // weighed on the marketer's own device, which is the v3.5 divergence bug again.
    const inReq=(j&&j.ok&&Array.isArray(j.dispatchreqs))?j.dispatchreqs:null;
    const inPh=(j&&j.ok&&j.dispatchphotos&&typeof j.dispatchphotos==='object')?j.dispatchphotos:null;
    if(inReq){
      const n=await mergeDispatchReqs(inReq,inPh);
      if(n){got.dispatchreqs=n; if(typeof renderVerify==='function')renderVerify();}}
    // v3.8.1 — and the DECISIONS come down too. Approving and returning both happen on the
    // marketer's device, so without this leg the worker who weighed the load is never told
    // what became of it and his screen says PENDING for ever.
    // v3.11 — the farm's shared dials. Merged BEFORE anything that depends on them is
    // repainted, so a load recalculating with a new tare does so with the new tare.
    const inSet=(j&&j.ok&&j.settings&&typeof j.settings==='object')?j.settings:null;
    if(inSet){
      const moved=await mergeSettings(inSet);
      if(moved.length){
        got.settings=moved.length;
        if(typeof renderPrices==='function')renderPrices();
        if(typeof renderScaleCard==='function')renderScaleCard();
        if(typeof renderDispatch==='function')renderDispatch();
        if(typeof refreshTreeBoard==='function')refreshTreeBoard();
        if(typeof renderHub==='function')renderHub();
        toast('⚙ '+moved.map(k=>tr('st_'+k,k)).join(', ')+' '+tr('st_updated'),0);}}
    const inDec=(j&&j.ok&&Array.isArray(j.dispatchdecisions))?j.dispatchdecisions:null;
    if(inDec){
      const mineN=myNewDecisions(inDec.filter(x=>x&&!REQ_DECIDED[String(x.req_uuid||'').trim()]));
      const n=await mergeDispatchDecisions(inDec);
      if(n){
        got.dispatchdecisions=n;
        if(typeof renderScaleCard==='function')renderScaleCard();
        if(typeof renderVerify==='function')renderVerify();
        if(mineN)toast('📬 '+mineN+' '+tr(mineN>1?'sc_decided_n':'sc_decided_1'));}}
    // v3.5 — adopt the farm-wide per-tree totals. This is what makes the Owner's phone and
    // the workers' phones show the same tied balance.
    const inMeta=(j&&j.treestatsmeta&&typeof j.treestatsmeta==='object')?j.treestatsmeta:null;
    if(inStats){
      const nTrees=Object.keys(inStats).length;
      // {} is truthy. Adopting an EMPTY payload would zero every farm-wide figure and make
      // the totals smaller than before — worse than the problem it is meant to fix. If the
      // Sheet found nothing while this phone is holding uploaded rows, the aggregation
      // clearly did not read the log tabs, so keep the old behaviour and say so.
      const haveUploaded=EVENTS.some(e=>e.synced&&
        (e.type==='TIE'||e.type==='DROP'||e.type==='ROTTEN'));
      if(nTrees>0||!haveUploaded){
        TREE_STATS={at:now(),trees:inStats,meta:inMeta||null,trees_n:nTrees};
        if(db)await put('kv',{k:'treestats',v:TREE_STATS});
        rebuildLedgers();
      } else {
        STATS_FAULT='empty';
        STATS_META=inMeta;
        if(!statsWarned){statsWarned=true;
          toast('The Sheet returned no tree totals — check the Sync screen',1);}
      }
    } else {
      STATS_FAULT='missing';
      if(!statsWarned){statsWarned=true;
        toast('Tree totals are still per-phone — update the Apps Script to share them',1);}
    }

    // ---- local unpushed edits always win until they are pushed ----
    if(REG_DIRTY){renderKeys();return got;}
    // rows the Owner deleted stay in the sheet as Status=Deleted (audit trail) but
    // must not reappear in the app's registry
    KEYS=ks.filter(x=>String(x.status).toLowerCase()!=='deleted');
    if(db)await put('kv',{k:'keys',v:KEYS});
    applyRole();renderKeys();
    return got;
  }catch(e){/* offline or sheet unreachable — check again next sync */ return null;}}

// ================= owner: master governance & user registry =================
const ROLE_LABEL={OWNER:'Owner / Admin',MARKETING:'Marketing',PURCHASER:'Sandakan Purchaser',WORKER:'Farm Worker'};
function isActive(k){return String(k.status||'').toLowerCase()==='active';}
function isMe(k){return CFG&&CFG.uid&&k.id===CFG.uid;}
function activeOwners(list){return (list||KEYS).filter(k=>isActive(k)&&k.role==='OWNER').length;}
async function persistKeys(dirty){
  KEYS.forEach(k=>{if(!k.id)k.id=newUid();});
  if(dirty)REG_DIRTY=true;
  if(db){await put('kv',{k:'keys',v:KEYS});await put('kv',{k:'regdirty',v:REG_DIRTY});}
  renderKeys();}
function newUid(){return 'U'+Math.abs(Date.now()%100000000).toString(36).toUpperCase()+Math.floor(Math.random()*900+100);}

function renderKeys(){
  const el=$('keylist');if(!el)return;
  const d=$('regdirty');
  if(d){d.classList.toggle('hidden',!REG_DIRTY);
    if(REG_DIRTY)d.textContent='⚠ '+ (CFG&&CFG.url?'Registry changed on this phone. Push it to the Google Sheet so the other phones get it.':'Registry changed. Set the Sync URL in Settings to share it with the other phones.');}
  // the Owner can push at any time — not only after an edit. Seeding a fresh
  // WORKERS tab and re-sending after a sheet mishap both need this.
  const pb=$('pushregbtn');
  if(pb)pb.textContent=REG_DIRTY?'⇧ PUSH REGISTRY TO GOOGLE SHEET':'⇧ RE-SEND REGISTRY TO GOOGLE SHEET';
  if(!KEYS.length){el.innerHTML='<div class="small">No staff in the registry yet — tap ADD STAFF MEMBER.</div>';return;}
  const order={OWNER:0,MARKETING:1,PURCHASER:2,WORKER:3};
  el.innerHTML=[...KEYS].sort((a,b)=>(order[a.role]??9)-(order[b.role]??9)||String(a.name).localeCompare(String(b.name))).map(k=>{
    const a=isActive(k), me=isMe(k);
    return '<div class="regrow'+(me?' me':'')+'">'+
      '<div style="min-width:0"><div class="regname">'+esc(k.name)+(me?' <span class="small">(you)</span>':'')+'</div>'+
      '<div class="regmeta">'+(ROLE_LABEL[k.role]||k.role)+'</div>'+
      '<div style="margin-top:4px;display:flex;align-items:center;gap:6px;flex-wrap:wrap"><span class="keycode">'+esc(k.key)+'</span>'+
      '<span class="kstat '+(a?'a':'r')+'">'+(a?'ACTIVE':'REVOKED')+'</span></div></div>'+
      '<div class="regacts">'+
        '<button class="iconbtn" title="Edit" onclick="openUserForm(\''+k.id+'\')">✏️</button>'+
        '<button class="iconbtn warn" title="'+(a?'Revoke':'Restore')+'" onclick="toggleUser(\''+k.id+'\')"'+(me?' disabled':'')+'>'+(a?'⏻':'↩')+'</button>'+
        '<button class="iconbtn danger" title="Delete" onclick="deleteUser(\''+k.id+'\')"'+(me?' disabled':'')+'>🗑</button>'+
      '</div></div>';}).join('');}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

// ---- add / edit form ----
let editingId=null, formRole='WORKER', formStatus='Active';
function pickRole(r){formRole=r;[...$('um-roles').children].forEach(el=>el.classList.toggle('on',el.dataset.role===r));}
function pickStatus(s){formStatus=s;$('um-active').classList.toggle('on',s==='Active');$('um-revoked').classList.toggle('on',s!=='Active');}
function genKey(){let k;do{k=String(Math.floor(100000+Math.random()*900000));}while(KEYS.some(x=>String(x.key)===k&&x.id!==editingId));$('um-key').value=k;}
function openUserForm(id){
  editingId=id||null;
  const k=id?KEYS.find(x=>x.id===id):null;
  $('um-title').textContent=k?'Edit staff member':'Add staff member';
  $('um-sub').textContent=k?'Change their name, role, access key or status.':'Give them a name, a role, and a 6-digit access key.';
  $('um-name').value=k?k.name:'';
  $('um-key').value=k?k.key:'';
  pickRole(k?k.role:'WORKER');
  pickStatus(k&&!isActive(k)?'Revoked':'Active');
  $('um-err').textContent='';
  if(!k)genKey();
  $('usermodal').classList.remove('hidden');
  setTimeout(()=>$('um-name').focus(),80);}
function closeUserForm(){$('usermodal').classList.add('hidden');editingId=null;}
async function saveUser(){
  const name=$('um-name').value.trim();
  const key=$('um-key').value.trim();
  const err=m=>{$('um-err').textContent=m;};
  if(name.length<2)return err('Enter the staff member’s name.');
  if(!/^\d{6}$/.test(key))return err('The access key must be exactly 6 digits.');
  if(KEYS.some(x=>String(x.key).trim()===key&&x.id!==editingId))return err('That key is already used by '+KEYS.find(x=>String(x.key).trim()===key).name+'.');
  if(KEYS.some(x=>x.name.trim().toLowerCase()===name.toLowerCase()&&x.id!==editingId))return err('There is already a staff member named '+name+'.');
  // never allow the farm to be left without a way in
  const after=KEYS.map(x=>x.id===editingId?{...x,role:formRole,status:formStatus}:x);
  if(editingId&&!activeOwners(after))return err('You must keep at least one ACTIVE Owner in the registry.');
  if(editingId){
    const k=KEYS.find(x=>x.id===editingId);
    const keyChanged=String(k.key)!==key;
    k.name=name;k.role=formRole;k.key=key;k.status=formStatus;
    if(isMe(k)){ // keep this device's own session in step with its new details
      CFG=Object.assign({},CFG,{worker:name,role:formRole,key:key});await persistCfg();applyRole();}
    await persistKeys(true);
    toast('✓ '+name+' updated'+(keyChanged?' · new key '+key:''));
  }else{
    KEYS.push({id:newUid(),name,role:formRole,key,status:formStatus});
    await persistKeys(true);
    toast('✓ '+name+' added · key '+key);
  }
  closeUserForm();}
async function toggleUser(id){
  const k=KEYS.find(x=>x.id===id);if(!k)return;
  if(isMe(k)){toast('You cannot revoke your own access',1);return;}
  const a=isActive(k);
  if(a&&activeOwners(KEYS.map(x=>x.id===id?{...x,status:'Revoked'}:x))===0){toast('Keep at least one active Owner',1);return;}
  if(a&&!confirm('Revoke '+k.name+'?\n\nTheir key stops working immediately on this phone. After you push the registry, their own phone wipes its data and locks the next time it finds internet.'))return;
  k.status=a?'Revoked':'Active';
  await persistKeys(true);
  toast(a?('⛔ '+k.name+' revoked'):('✓ '+k.name+' restored'));}
async function deleteUser(id){
  const k=KEYS.find(x=>x.id===id);if(!k)return;
  if(isMe(k)){toast('You cannot delete your own account',1);return;}
  if(activeOwners(KEYS.filter(x=>x.id!==id))===0){toast('Keep at least one active Owner',1);return;}
  if(!confirm('DELETE '+k.name+' from the registry?\n\nThis removes them completely. After you push the registry, their phone wipes all farm data and locks permanently.\n\nTheir already-synced records stay in the Google Sheet.'))return;
  KEYS=KEYS.filter(x=>x.id!==id);
  await persistKeys(true);
  toast('🗑 '+k.name+' deleted');}

// ---- push the registry up to the WORKERS tab ----
async function pushRegistry(manual){
  if(!manual&&!REG_DIRTY)return true;      // automatic pushes only when something changed
  if(!CFG||!CFG.url){if(manual)toast('Set the Sync URL in Settings first',1);return false;}
  if(!navigator.onLine){if(manual)toast('No internet — it will push at the office hotspot',1);return false;}
  const btn=$('pushregbtn');if(btn)btn.textContent='Uploading registry…';
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({registry:KEYS.map(k=>({
        id:k.id,name:k.name,role:k.role,key:String(k.key),status:isActive(k)?'Active':'Revoked'}))}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(!j||!j.ok)throw new Error((j&&j.error)||'server error');
    REG_DIRTY=false;if(db)await put('kv',{k:'regdirty',v:false});
    renderKeys();toast('✓ Registry pushed to Google Sheet');return true;
  }catch(e){toast('Registry push failed: '+e.message,1);return false;}
  finally{renderKeys();}}

// ================= setup =================
function showSetup(){SCREENS.forEach(x=>$('scr-'+x).classList.add('hidden'));
  $('backbtn').classList.add('hidden');
  $('scr-login').classList.add('hidden');$('scr-setup').classList.remove('hidden');$('ttl').textContent='Setup';
  $('su-who').textContent=(CFG&&CFG.worker?CFG.worker+' ('+CFG.role+')':'—');
  if(CFG){$('su-device').value=CFG.device||'';$('su-url').value=CFG.url||'';}}
function editSetup(){showSetup();}
async function saveSetup(){CFG=Object.assign({},CFG,{device:$('su-device').value.trim()||'phone-01',url:$('su-url').value.trim()});
  await persistCfg();toast('Saved. Selamat bekerja, '+CFG.worker+'!');
  $('nav-home').style.display='';$('nav-sync').style.display='';applyRole();goHome();
  // pull the real registry straight away, so this phone never pushes the sample
  // seed users over the top of the live WORKERS tab
  if(CFG.url&&!REG_DIRTY)await refreshMasters();}

// ================= harvest =================
let qty=1,grade='A',curTree=null,scanner=null;
function startScan(){
  if(typeof Html5Qrcode==='undefined'){toast('Camera scanner unavailable — use the tree list',1);showPicker();return;}
  $('scanbox').classList.add('hidden');$('picker').classList.add('hidden');const v=$('qrview');v.style.display='block';
  scanner=new Html5Qrcode('qrview');
  scanner.start({facingMode:'environment'},{fps:10,qrbox:220},txt=>{stopScan();selectTree(txt.trim());},()=>{})
  .catch(()=>{stopScan();toast('Camera not available — pick from list',1);showPicker();});}
function stopScan(){if(scanner){scanner.stop().catch(()=>{});scanner=null;}$('qrview').style.display='none';$('scanbox').classList.remove('hidden');}
function showPicker(){$('picker').classList.remove('hidden');buildLotSelect();
  // v2.5.1: pass the button too, or the grid shows Lot B while "Lot A" stays highlighted
  pickLot(curLot,($('lotbtns')||{children:[]}).children[LOTS.indexOf(curLot)]);}
let curLot='B';
// --- dynamic dropdowns: Lot ➔ Tree number ➔ read-only clone ---
function buildLotSelect(){
  const s=$('h-lot'); if(s.options.length) {s.value=curLot; return;}
  s.innerHTML=LOTS.map(l=>'<option value="'+l+'">Lot '+l+' ('+treesInLot(l).length+' trees)</option>').join('');
  s.value=curLot; $('tm-count').textContent=TREE_MASTER.length; buildTreeSelect();}
function buildTreeSelect(){
  const s=$('h-tree');
  s.innerHTML='<option value="">'+esc(tr('ty_selecttree'))+'</option>'+treesInLot(curLot).map(t=>
    '<option value="'+t.id+'">'+t.id+'  ·  Tree '+t.no+'</option>').join('');
  s.value=''; showCloneReadout(null);}
function onLotChange(){curLot=$('h-lot').value;
  [...$('lotbtns').children].forEach((x,i)=>x.classList.toggle('on',LOTS[i]===curLot));
  renderGrid(); buildTreeSelect();}
function onTreeChange(){showCloneReadout(treeById($('h-tree').value));}
function showCloneReadout(t){
  $('h-clone').textContent=t?(t.clone||'NOT RECORDED'):'—';
  $('h-cloneinfo').innerHTML=t
    ?(cloneLabel(t.clone)+'<br>Census Jul: <b>'+(t.census!=null?t.census+' fruit':'—')+'</b>'+(t.note?'<br>⚠ '+t.note:''))
    :'select a tree';}
function confirmTreePick(){
  const id=$('h-tree').value;
  if(!id){toast('Choose a tree number first',1);return;}
  selectTree(id);}
function renderGrid(){
  const g=$('pickgrid');g.innerHTML='';
  treesInLot(curLot).forEach(t=>{const d=document.createElement('div');d.className='mk';d.textContent=t.no;d.onclick=()=>selectTree(t.id);g.appendChild(d);});}
function pickLot(l,el){curLot=l;if(el){[...$('lotbtns').children].forEach(x=>x.classList.remove('on'));el.classList.add('on');}
  if($('h-lot').options.length)$('h-lot').value=l;
  renderGrid(); buildTreeSelect();}
function cancelTree(){curTree=null;$('treezone').classList.add('hidden');}
// v3.0 — Card A. Three independent counters, one per grade, each with its own
// SECURED / UNSECURED answer, because a tree can drop tied Grade A and untied
// Grade C in the same round and the two mean completely different things.
// GCOUNT/GKIND are the whole state of the card; SAVE turns them into one DROP
// event per grade that has a count, then clears them.
let GCOUNT={A:0,B:0,C:0}, GKIND={A:'SECURED',B:'SECURED',C:'SECURED'};
function gTotal(){return GRADE_ORDER.reduce((s,g)=>s+(GCOUNT[g]||0),0);}
function gBump(g,d){GCOUNT[g]=Math.max(0,(GCOUNT[g]||0)+d);paintGrade(g);gTotalPaint();}
function gZero(g){GCOUNT[g]=0;paintGrade(g);gTotalPaint();}
function gKind(g,k){GKIND[g]=k;paintGrade(g);gTotalPaint();}
function gClearAll(){GRADE_ORDER.forEach(g=>{GCOUNT[g]=0;GKIND[g]='SECURED';});
  GRADE_ORDER.forEach(paintGrade);gTotalPaint();const e=$('g-err');if(e)e.textContent='';}
function paintGrade(g){
  const n=$('g-n-'+g); if(n)n.textContent=GCOUNT[g]||0;
  const row=$('grow-'+g); if(row)row.classList.toggle('hot',(GCOUNT[g]||0)>0);
  DROP_ORDER.forEach(k=>{const el=$('gs-'+g+'-'+k);if(el)el.classList.toggle('on',GKIND[g]===k);});}
function gTotalPaint(){
  if(typeof visitSumPaint==='function')visitSumPaint();   // v3.16 — one visit, one summary
  const box=$('g-tot'); if(!box)return;
  const tot=gTotal();
  // v3.16 — this line was hard-coded English on a screen the crew read in Malay, and it
  // sat directly above the translated visit summary, which is what made it obvious.
  if(!tot){box.className='gtot zero';box.textContent=tr('ca_none','Nothing counted yet.');return;}
  box.className='gtot';
  const parts=GRADE_ORDER.filter(g=>GCOUNT[g]>0)
    .map(g=>GCOUNT[g]+' × '+g+' ('+(GKIND[g]==='SECURED'?tr('ca_sec','secured'):tr('ca_unsec','unsecured'))+')');
  box.innerHTML=tot+' '+esc(tr('ca_fruit','fruit'))+' — '+parts.join(' · ');}
function renderGradeRows(){
  const box=$('graderows'); if(!box)return;
  box.innerHTML=GRADE_ORDER.map(g=>{
    const m=GRADE_META[g];
    return '<div class="grow" id="grow-'+g+'">'+
      '<div class="ghead"><span class="gname">'+esc(m.label)+'</span>'+
        '<span class="gnote">'+esc(m.note)+'</span></div>'+
      '<div class="stepper">'+
        '<button onclick="gBump(\''+g+'\',-1)">−</button>'+
        '<div class="n" id="g-n-'+g+'">0</div>'+
        '<button onclick="gBump(\''+g+'\',1)">+</button></div>'+
      '<div class="quickadd">'+
        '<div onclick="gBump(\''+g+'\',5)">+5</div>'+
        '<div onclick="gBump(\''+g+'\',10)">+10</div>'+
        '<div onclick="gZero(\''+g+'\')">CLEAR</div></div>'+
      '<div class="lotbtns tiny">'+
        '<div id="gs-'+g+'-SECURED" onclick="gKind(\''+g+'\',\'SECURED\')">🪢 Secured (Tied)</div>'+
        '<div id="gs-'+g+'-UNSECURED" onclick="gKind(\''+g+'\',\'UNSECURED\')">🍃 Unsecured (Untied)</div>'+
      '</div></div>';}).join('');
  GRADE_ORDER.forEach(paintGrade); gTotalPaint();}
// legacy shims — older call sites (and the QR deep links) still reference these
function bump(d){gBump('A',d);}
function resetQty(){gClearAll();}
function setGrade(i){/* the grade is now per-counter; kept so old call sites do not throw */}
let savingDrop=false, lastDrop={tree:null,time:0};
// ================= stock =================
// ================= v2.3 INVENTORY MASTER =================
// INVENTORY_RECON is the named source of truth for the 67 reconciled products.
// PRODUCTS stays as an alias to the SAME array reference so every Phase-1/2 call
// site keeps working — one approved correction updates the whole app at once.
// Opening valuation of the seeded data reconciles to the Inventory Dashboard
// sheet: RM 18,591.73.
let INV_OVERRIDE={};        // {pid:{min_stock_threshold, active_ingredient}} — Owner edits
let SHOW_VALUES=false;      // financial figures are role-gated, never rendered for Worker/Purchaser

function prodById(id){return INVENTORY_RECON.find(p=>p.id===+id)||null;}
function aiOf(id){const p=prodById(id);return p?(p.active_ingredient||''):'';}
function packLabel(p){return p.container+' × '+nf(p.unit_multiplier)+' '+p.unit;}
function toOps(p,containers){return (+containers||0)*(p.unit_multiplier||1);}      // drums -> ml
function toCont(p,ops){return p.unit_multiplier?(+ops||0)/p.unit_multiplier:0;}    // ml -> drums
function nf(n){n=+n||0;return (Math.round(n*100)/100).toLocaleString('en-US',{maximumFractionDigits:2});}
function rm(n){n=+n||0;const s=n<0?'-':'';return s+'RM '+Math.abs(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function applyInvOverrides(){
  for(const k in INV_OVERRIDE){const p=prodById(k);if(!p)continue;const o=INV_OVERRIDE[k]||{};
    if(o.min_stock_threshold!=null&&o.min_stock_threshold!=='')p.min_stock_threshold=+o.min_stock_threshold;
    if(o.active_ingredient)p.active_ingredient=o.active_ingredient;}}
async function persistInvOverride(){if(db)await put('kv',{k:'invover',v:INV_OVERRIDE});}

// ---- balances (opening − used + received ± stock-take adjustments) ----
function usedOf(pid){return EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.pid===+pid).reduce((s,e)=>s+(+e.qty||0),0);}
function recvOf(pid){return EVENTS.filter(e=>e.type==='STOCK_IN'&&e.pid===+pid).reduce((s,e)=>s+(+e.qty||0),0);}
function adjOf(pid){return EVENTS.filter(e=>e.type==='STOCK_ADJUST'&&e.pid===+pid).reduce((s,e)=>s+(+e.delta||0),0);}
function onHand(p){return (p.stock||0)-usedOf(p.id)+recvOf(p.id)+adjOf(p.id);}
function valueOf(p){return onHand(p)*(p.cpu||0);}
function isLow(p){return onHand(p)<(p.min_stock_threshold||0);}
function lowStock(){return INVENTORY_RECON.filter(isLow);}
function totalStockValue(){return INVENTORY_RECON.reduce((s,p)=>s+valueOf(p),0);}
function matchProd(p,q){if(!q)return true;q=q.toLowerCase();
  return p.name.toLowerCase().includes(q)||String(p.active_ingredient||'').toLowerCase().includes(q);}

// ---- raw transaction ledgers (materialised from the append-only event store, so
//      there is exactly one write path and no chance of double counting) ----
function rebuildLedgers(){
  stock_in_ledger=[];stock_out_ledger=[];stock_adjust_ledger=[];
  for(const e of EVENTS){
    const p=prodById(e.pid);const cpu=p?(p.cpu||0):0;
    if(e.type==='STOCK_IN'){
      stock_in_ledger.push({uuid:e.uuid,timestamp:e.dt,productId:e.pid,productName:e.pname,
        activeIngredient:e.ai||aiOf(e.pid),quantity:+e.qty||0,unit:e.unit||(p?p.unit:''),
        unitPrice:(e.unitPrice!=null?+e.unitPrice:(p?p.unit_price:0)),
        value:(e.cost!=null?+e.cost:(+e.qty||0)*cpu),
        reference:e.ref||'',supplier:e.supplier||'',targetLot:e.lot||'',
        operator:e.worker||'',device:e.device||'',synced:!!e.synced});
    } else if(e.type==='STOCK_OUT'){
      stock_out_ledger.push({uuid:e.uuid,timestamp:e.dt,productId:e.pid,productName:e.pname,
        activeIngredient:e.ai||aiOf(e.pid),quantity:+e.qty||0,unit:e.unit||(p?p.unit:''),
        unitPrice:(p?p.unit_price:0),value:(e.cost!=null?+e.cost:(+e.qty||0)*cpu),
        reference:e.set||'',targetLot:e.lot||'',operator:e.worker||'',device:e.device||'',synced:!!e.synced});
    } else if(e.type==='STOCK_ADJUST'){
      stock_adjust_ledger.push({uuid:e.uuid,timestamp:e.dt,productId:e.pid,productName:e.pname,
        activeIngredient:e.ai||aiOf(e.pid),counted:+e.counted||0,systemQty:+e.before||0,
        variance:+e.delta||0,unit:e.unit||(p?p.unit:''),varianceValue:(e.cost!=null?+e.cost:0),
        note:e.note||'',operator:e.worker||'',device:e.device||'',synced:!!e.synced});
    }
  }
  const byTs=(a,b)=>String(a.timestamp).localeCompare(String(b.timestamp));
  stock_in_ledger.sort(byTs);stock_out_ledger.sort(byTs);stock_adjust_ledger.sort(byTs);
}

// ---- dynamic Monthly / Yearly Summary Ledger ----
// Chronological matrix: opening → received → disbursed (per lot) → variance → closing.
function buildLedgerSummary(){
  const openQty=INVENTORY_RECON.reduce((s,p)=>s+(p.stock||0),0);
  const openVal=INVENTORY_RECON.reduce((s,p)=>s+(p.stock||0)*(p.cpu||0),0);
  const map={};
  const touch=k=>{if(!map[k])map[k]={key:k,inQty:0,inVal:0,outQty:0,outVal:0,varQty:0,varVal:0,rows:0,
      lots:{A:{q:0,v:0},B:{q:0,v:0},C:{q:0,v:0},'—':{q:0,v:0}}};return map[k];};
  for(const e of EVENTS){
    if(e.type!=='STOCK_IN'&&e.type!=='STOCK_OUT'&&e.type!=='STOCK_ADJUST')continue;
    const k=String(e.dt||'').slice(0,7); if(k.length!==7)continue;
    const m=touch(k);m.rows++;
    const p=prodById(e.pid);const cpu=p?(p.cpu||0):0;
    const q=+e.qty||0, v=(e.cost!=null?+e.cost:q*cpu);
    if(e.type==='STOCK_IN'){m.inQty+=q;m.inVal+=v;}
    else if(e.type==='STOCK_OUT'){m.outQty+=q;m.outVal+=v;
      const L=LOT_KEYS.indexOf(e.lot)>=0?e.lot:'—';m.lots[L].q+=q;m.lots[L].v+=v;}
    else{m.varQty+=(+e.delta||0);m.varVal+=(+e.cost||0);}
  }
  const keys=Object.keys(map).sort();
  let runQty=openQty,runVal=openVal;
  const months=[];
  for(const k of keys){const m=map[k];
    m.openQty=runQty;m.openVal=runVal;
    m.closeQty=runQty+m.inQty-m.outQty+m.varQty;
    m.closeVal=runVal+m.inVal-m.outVal+m.varVal;
    runQty=m.closeQty;runVal=m.closeVal;
    m.year=k.slice(0,4);m.label=MONTH_NAME[+k.slice(5,7)-1]+' '+m.year;
    months.push(m);}
  const years=[];
  for(const m of months){
    let y=years.find(x=>x.year===m.year);
    if(!y){y={year:m.year,openQty:m.openQty,openVal:m.openVal,inQty:0,inVal:0,outQty:0,outVal:0,
      varQty:0,varVal:0,closeQty:0,closeVal:0,rows:0,
      lots:{A:{q:0,v:0},B:{q:0,v:0},C:{q:0,v:0},'—':{q:0,v:0}},months:[]};years.push(y);}
    y.inQty+=m.inQty;y.inVal+=m.inVal;y.outQty+=m.outQty;y.outVal+=m.outVal;
    y.varQty+=m.varQty;y.varVal+=m.varVal;y.rows+=m.rows;
    LOT_KEYS.concat(['—']).forEach(L=>{y.lots[L].q+=m.lots[L].q;y.lots[L].v+=m.lots[L].v;});
    y.closeQty=m.closeQty;y.closeVal=m.closeVal;y.months.push(m);}
  return {openQty:openQty,openVal:openVal,months:months,years:years,
    closeQty:months.length?months[months.length-1].closeQty:openQty,
    closeVal:months.length?months[months.length-1].closeVal:openVal};
}

// ================= stock screen — role partitioned =================
function fillProdSelect(selId,searchId){
  const q=($(searchId).value||'');const sel=$(selId);const keep=sel.value;
  sel.innerHTML='';
  INVENTORY_RECON.filter(p=>matchProd(p,q)).forEach(p=>{
    const o=document.createElement('option');o.value=p.id;
    // v3.16 — the option read "Brand · Chemical 5.5%". A worker picks the drum by the word
    // painted on it; the chemistry behind that word is not theirs to carry. Where the field
    // holds a residue warning it survives, because that IS the worker's business.
    const sub=aiTextRole(p);
    o.textContent=p.name+(sub?(' · '+sub):'');sel.appendChild(o);});
  if(!sel.options.length){const o=document.createElement('option');o.value='';o.textContent=tr('so_nomatch');sel.appendChild(o);}
  if(keep&&[...sel.options].some(o=>o.value===keep))sel.value=keep; else sel.selectedIndex=0;
}

// ---- Sandakan Purchaser: Stock In ----
let inUnitMode='C';
function renderInOpts(){fillProdSelect('in-prod','in-search');onInProd();}
function onInProd(){const p=prodById($('in-prod').value);
  $('in-ai').textContent=p?(p.active_ingredient||'—'):'—';
  $('in-pack').innerHTML=p?(esc(packLabel(p))+'<br>baseline '+rm(p.unit_price)+' / '+esc(p.container)):'—';
  $('in-uolbl').textContent=p?p.unit:'ml/gm';
  if(p&&!$('in-price').value)$('in-price').value=p.unit_price;
  onInCalc();}
function setInUnit(m){inUnitMode=m;$('in-uc').classList.toggle('on',m==='C');$('in-uo').classList.toggle('on',m==='O');onInCalc();}
function inOpsQty(){const p=prodById($('in-prod').value);if(!p)return 0;
  const v=+$('in-qty').value||0;return inUnitMode==='C'?toOps(p,v):v;}
function onInCalc(){const p=prodById($('in-prod').value);if(!p){$('in-conv').textContent='—';return;}
  const ops=inOpsQty(), price=+$('in-price').value||0;
  const cont=toCont(p,ops);
  const total=inUnitMode==='C'?(+$('in-qty').value||0)*price:cont*price;
  $('in-conv').innerHTML='Receiving <b>'+nf(ops)+' '+esc(p.unit)+'</b> = '+nf(cont)+' '+esc(p.container)+
    ' · invoice value <b>'+rm(total)+'</b>';}
let savingStock=false;   // v2.5.1: rebuildLedgers() takes a moment on a cheap phone — one tap, one event
async function submitStockIn(){
  const err=$('in-err');err.textContent='';
  if(savingStock)return;
  const p=prodById($('in-prod').value); if(!p){err.textContent='Pick a product.';return;}
  const ops=inOpsQty(); if(!(ops>0)){err.textContent='Enter the quantity received.';return;}
  const price=+$('in-price').value; if(!(price>0)){err.textContent='Enter the unit price in RM.';return;}
  const ref=$('in-ref').value.trim(); if(!ref){err.textContent='Invoice / reference number is required.';return;}
  const cont=toCont(p,ops);
  const value=+((inUnitMode==='C'?(+$('in-qty').value||0):cont)*price).toFixed(2);
  savingStock=true;
  try{
    await persistEvent({uuid:uuid(),type:'STOCK_IN',dt:now(),pid:p.id,pname:p.name,ai:p.active_ingredient,
      qty:ops,unit:p.unit,containers:+cont.toFixed(4),unitPrice:price,cost:value,ref:ref,
      supplier:$('in-supplier').value.trim(),lot:'',worker:CFG.worker,device:CFG.device,synced:false});
  } finally { savingStock=false; }
  $('in-qty').value=1;$('in-ref').value='';
  toast('✓ Stock in: '+nf(ops)+' '+p.unit+' '+p.name);
  refreshInventoryViews();}

// ---- Farm Worker: Material Stock Out ----
let outLot='';
function renderOutOpts(){
  // v3.16 — the placeholder named the chemistry as something to search on. A worker
  // searches by the word printed on the drum, and nothing else.
  {const b=$('out-search');
   if(b)b.setAttribute('placeholder',hideChem()?tr('so_searchw','Search the drum name…')
                                               :tr('so_search','Search brand or active ingredient…'));}fillProdSelect('out-prod','out-search');onOutProd();}
/** The active ingredient as shown to a worker. A real AI is printed verbatim; the
 *  "(confirm - see label)" placeholder is app copy and is translated. */
function aiText(p){
  let a=String((p&&p.active_ingredient)||'');
  // Two products carry their residue cut-off inside this field. The warning is the one
  // part of it a worker must be able to read in their own language; the chemistry is not.
  a=a.replace('fruit-contact, 14-day PHI',tr('so_phi'));
  a=a.replace('(confirm — see label)',tr('so_confirm'));
  return a;}
/** v3.16 — what a given ROLE may read out of the active-ingredient field.
 *  The crew see the drum, not the chemistry — but the residue cut-off is the one part of
 *  this field a worker must be able to read, and it survives the purge. The ingredient
 *  name and its concentration do not. Owner, Marketing and the Purchaser are unaffected.
 *  Returns '' when a worker's product carries no warning at all, which is the signal to
 *  hide the box rather than print a bare dash under a chemistry heading. */
function aiTextRole(p){
  if(!p)return '';
  if(!hideChem())return aiText(p);
  const raw=String(p.active_ingredient||''), safe=[];
  if(/fruit-contact|14-day PHI/i.test(raw))safe.push(tr('so_phi'));
  if(/\(confirm — see label\)/i.test(raw))safe.push(tr('so_confirm'));
  return safe.join(' · ');}

function onOutProd(){const p=prodById($('out-prod').value);
  // the product name and the real active ingredient are NEVER translated - the drum
  // label is the safety record. Only the "not yet confirmed" placeholder is UI copy.
  // v3.16 — routed through aiTextRole() so a Farm Worker gets the warning without the
  // chemistry. The heading changes with it: "Active ingredient" over a safety note is a
  // chemistry label the crew were told they would never have to read.
  const shown=aiTextRole(p);
  const wrap=$('out-aiwrap'), lbl=$('out-ailbl');
  if(lbl)lbl.textContent=hideChem()?tr('so_safety','Safety note'):tr('so_ai','Active ingredient');
  if(wrap)wrap.style.display=(hideChem()&&!shown)?'none':'';
  $('out-ai').textContent=shown||'—';
  $('out-unitlbl').textContent=p?p.unit:'ml/gm';
  $('out-onhand').innerHTML=p?(esc(tr('so_onhand'))+'<br><b>'+nf(onHand(p))+' '+esc(p.unit)+'</b>'):'—';
  onOutCalc();}
function pickOutLot(l){outLot=l;LOT_KEYS.forEach(k=>$('ol-'+k).classList.toggle('on',k===l));}
function onOutCalc(){const p=prodById($('out-prod').value);if(!p){$('out-conv').textContent='—';return;}
  const q=+$('out-qty').value||0;
  $('out-conv').innerHTML='Using <b>'+nf(q)+' '+esc(p.unit)+'</b> = '+nf(toCont(p,q))+' '+esc(p.container)+
    ' · leaves '+nf(onHand(p)-q)+' '+esc(p.unit);}
async function submitStockOut(){
  const err=$('out-err');err.textContent='';
  if(savingStock)return;
  const p=prodById($('out-prod').value); if(!p){err.textContent='Pick a product.';return;}
  const q=+$('out-qty').value; if(!(q>0)){err.textContent='Enter the quantity used.';return;}
  if(!outLot){err.textContent='Select the target lot the material was applied to.';return;}
  const phi=PHI_PRODUCTS[p.name];
  if(phi){const days=Math.ceil((PEAK_DATE-new Date())/86400000);
    if(days>=0&&days<phi&&!confirm('⚠ PHI WARNING\n'+p.name+' has a '+phi+'-day residue cut-off.\nProjected peak drop 21–22 Aug is in '+days+' day(s).\n\nOwner approval required. Log anyway?'))return;}
  const oh=onHand(p);
  if(oh<q&&!confirm('Stock shows only '+nf(oh)+' '+p.unit+' of '+p.name+'. Log anyway?'))return;
  savingStock=true;
  try{
    await persistEvent({uuid:uuid(),type:'STOCK_OUT',dt:now(),pid:p.id,pname:p.name,ai:p.active_ingredient,
      qty:q,unit:p.unit,lot:outLot,set:$('sset').value,cost:+(q*(p.cpu||0)).toFixed(2),
      worker:CFG.worker,device:CFG.device,synced:false});
  } finally { savingStock=false; }
  toast('✓ Stock out: '+nf(q)+' '+p.unit+' '+p.name+' → Lot '+outLot);
  $('out-qty').value='';                    // v2.5.1: clear the form so it cannot be sent twice
  outLot='';LOT_KEYS.forEach(L=>{const el=$('ol-'+L);if(el)el.classList.remove('on');});
  onOutCalc();
  refreshInventoryViews();}

// ---- live stock on hand list (values only for Owner / Marketing) ----
function renderStock(){
  const q=($('stocksearch').value||'');
  $('oh-valnote').style.display=SHOW_VALUES?'':'none';
  // v3.16 — this list sits under the worker's Stock Out form, and every row carried the
  // active ingredient in blue under the brand. Same purge as the picker above it.
  {const b=$('stocksearch');
   if(b)b.setAttribute('placeholder',hideChem()?tr('so_searchw','Search the drum name…')
                                              :tr('so_search','Search brand or active ingredient…'));}
  const list=INVENTORY_RECON.filter(p=>matchProd(p,q));
  $('stocklist').innerHTML=list.length?list.map(p=>{
    const oh=onHand(p),low=isLow(p);
    const right=nf(oh)+' '+esc(p.unit)+(low?' ⚠':'')+(SHOW_VALUES?('<br><span class="small">'+rm(valueOf(p))+'</span>'):'');
    const sub=aiTextRole(p);
    return '<div class="lrow"><span><b>'+esc(p.name)+'</b>'+
      (sub?('<br><span class="small" style="color:#26418f">'+esc(sub)+'</span>'):'')+'</span>'+
      '<span style="text-align:right;font-weight:700;color:'+(low?'#b3261e':'#1b5e20')+'">'+right+'</span></div>';}).join('')
    :'<div class="small">No product matches that search.</div>';}

// ---- urgent reorder alert center ----
function renderAlerts(){
  const low=lowStock();
  const box=$('alertlist');if(!box)return;
  if(!low.length){box.innerHTML='<div class="alertnone">✓ All products are at or above their minimum stock level.</div>';return;}
  // the seeded farm has a long out-of-stock tail — show the worst first and keep
  // the rest one tap away so the Stock In form is never buried under the alerts
  const CAP=5, shown=alertsAll?low:low.slice(0,CAP);
  const card=p=>'<div class="alertrow"><div class="an">'+esc(p.name)+'</div>'+
    // v3.16 — one rule for the chemistry everywhere, so a screen later opened up to the
    // crew cannot reintroduce it by accident.
    ((x=>x?'<div class="ai">'+esc(x)+'</div>':'')(aiTextRole(p)))+
    '<div class="aq">'+nf(onHand(p))+' '+esc(p.unit)+' left · minimum '+nf(p.min_stock_threshold)+' '+esc(p.unit)+
    ' ('+nf(toCont(p,p.min_stock_threshold))+' '+esc(p.container)+')</div></div>';
  box.innerHTML='<div class="alertbig">⚠ '+low.length+' PRODUCT'+(low.length>1?'S':'')+' BELOW MINIMUM — REORDER NOW</div>'+
    shown.map(card).join('')+
    (low.length>CAP?('<div class="segs" style="margin-top:2px"><div onclick="toggleAlerts()">'+
      (alertsAll?'▴ SHOW ONLY THE TOP '+CAP:'▾ SHOW ALL '+low.length+' PRODUCTS')+'</div></div>'):'');}
let alertsAll=false;
function toggleAlerts(){alertsAll=!alertsAll;renderAlerts();}

// ================= Owner: Inventory Control Center =================
let ccMode='ALL';
function setCCMode(m,el){ccMode=m;[...$('ccmode').children].forEach(x=>x.classList.remove('on'));if(el)el.classList.add('on');renderInvCC();}
function renderInvCC(){
  if(!$('cctbl'))return;
  const low=lowStock();
  $('i-val').textContent=rm(totalStockValue()).replace('.00','');
  $('i-low').textContent=low.length;
  $('i-items').textContent=INVENTORY_RECON.length;
  $('i-zero').textContent=INVENTORY_RECON.filter(p=>onHand(p)<=0).length;
  $('invalert').innerHTML=low.length?'<div class="alertbig">⚠ '+low.length+' PRODUCT'+(low.length>1?'S':'')+' BELOW MINIMUM STOCK</div>':'';
  const q=($('ccsearch').value||'').toLowerCase();
  let list=INVENTORY_RECON.filter(p=>{
    if(!q)return true;
    const n=p.name.toLowerCase(), a=String(p.active_ingredient||'').toLowerCase();
    if(ccMode==='BRAND')return n.includes(q);
    if(ccMode==='AI')return a.includes(q);
    return n.includes(q)||a.includes(q);});
  const head='<tr><th>Product / active ingredient</th><th class="num">On hand</th><th class="num">Min</th><th class="num">Value</th></tr>';
  const row=p=>{const oh=onHand(p),low=isLow(p);
    return '<tr onclick="openInvEdit('+p.id+')" style="cursor:pointer">'+
      '<td><div class="pn">'+esc(p.name)+(low?' <span class="cstat r">LOW</span>':'')+'</div><div class="pa">'+esc(p.active_ingredient||'—')+'</div>'+
      '<div class="exphint">'+esc(packLabel(p))+' · '+rm(p.unit_price)+'/'+esc(p.container)+'</div></td>'+
      '<td class="num '+(low?'lowq':'')+'">'+nf(oh)+'<br><span class="exphint">'+esc(p.unit)+'</span></td>'+
      '<td class="num">'+nf(p.min_stock_threshold)+'</td>'+
      '<td class="num">'+rm(valueOf(p))+'</td></tr>';};
  // GROUP BY AI exists to cross-compare the whole catalogue — never truncate it
  const CAP=15, more=(!ccShowAll&&ccMode!=='GROUP'&&list.length>CAP)?list.length-CAP:0;
  if(more)list=list.slice(0,CAP);
  const tail=more?('<tr><td colspan="4"><div class="collapsebtn" onclick="ccShowAll=true;renderInvCC()">▾ SHOW ALL '+(more+CAP)+' PRODUCTS</div></td></tr>')
    :(ccShowAll?'<tr><td colspan="4"><div class="collapsebtn" onclick="ccShowAll=false;renderInvCC()">▴ SHOW ONLY THE FIRST '+CAP+'</div></td></tr>':'');
  if(ccMode==='GROUP'){
    const g={};list.forEach(p=>{const k=p.active_ingredient||'(not recorded)';(g[k]=g[k]||[]).push(p);});
    const keys=Object.keys(g).sort();
    $('cctbl').innerHTML=head+keys.map(k=>
      '<tr><td colspan="4"><div class="aigrp">'+esc(k)+' · '+g[k].length+' product'+(g[k].length>1?'s':'')+
      ' · '+nf(g[k].reduce((s,p)=>s+onHand(p),0))+' units · '+rm(g[k].reduce((s,p)=>s+valueOf(p),0))+'</div></td></tr>'+
      g[k].map(row).join('')).join('');
  } else {
    $('cctbl').innerHTML=head+(list.length?list.map(row).join(''):'<tr><td colspan="4" class="small">No product matches that filter.</td></tr>')+tail;
  }}
let ccShowAll=false;
async function openInvEdit(pid){
  const p=prodById(pid);if(!p)return;
  const t=prompt('Minimum stock level for '+p.name+'\n(in '+p.unit+' — one '+p.container+' = '+nf(p.unit_multiplier)+' '+p.unit+')',String(p.min_stock_threshold));
  if(t===null)return;
  const v=+t;if(!(v>=0)){toast('Enter a number',1);return;}
  const a=prompt('Active ingredient for '+p.name+'\n(leave as-is if correct)',String(p.active_ingredient||''));
  INV_OVERRIDE[p.id]=Object.assign({},INV_OVERRIDE[p.id],{min_stock_threshold:v},a===null?{}:{active_ingredient:a.trim()||p.active_ingredient});
  applyInvOverrides();await persistInvOverride();
  toast('✓ '+p.name+' updated');refreshInventoryViews();}

// ================= Owner: Monthly & Yearly Summary Ledger =================
let openYears={}, openMonths={};
function toggleYear(y){if(!(y in openYears))openYears[y]=true;   // years render expanded by default
  openYears[y]=!openYears[y];renderLedgerSummary();}
function toggleMonth(k){openMonths[k]=!openMonths[k];renderLedgerSummary();}
function renderLedgerSummary(){
  const box=$('ledgersum');if(!box)return;
  const S=buildLedgerSummary();
  if(!S.months.length){
    box.innerHTML='<div class="small">No stock movements recorded yet. Opening stock valuation is <b>'+rm(S.openVal)+
      '</b> across '+INVENTORY_RECON.length+' products. The ledger fills in automatically from the first stock-in or stock-out.</div>';return;}
  box.innerHTML=S.years.map(y=>{
    const yOpen=openYears[y.year]!==false;  // years start expanded
    const head='<div class="yrow" onclick="toggleYear(\''+y.year+'\')">'+
      '<div><div class="yl">'+(yOpen?'▾':'▸')+' '+y.year+'</div><div class="exphint">'+y.rows+' transaction'+(y.rows===1?'':'s')+'</div></div>'+
      '<div class="yv">In '+rm(y.inVal)+' · Out '+rm(y.outVal)+'<br>Closing <b>'+rm(y.closeVal)+'</b></div></div>';
    if(!yOpen)return head;
    return head+y.months.map(m=>{
      const mOpen=!!openMonths[m.key];
      let h='<div class="mrow"><div class="mh" onclick="toggleMonth(\''+m.key+'\')">'+
        '<div><div class="ml">'+(mOpen?'▾':'▸')+' '+m.label+'</div><div class="exphint">'+m.rows+' transaction'+(m.rows===1?'':'s')+'</div></div>'+
        '<div class="mc">'+rm(m.closeVal)+'</div></div>';
      if(mOpen){
        h+='<div class="msub">'+
          '<div class="mline"><span>Opening stock value</span><b>'+rm(m.openVal)+'</b></div>'+
          '<div class="mline pos"><span>Received (stock in) · '+nf(m.inQty)+' ml/gm</span><b>+ '+rm(m.inVal)+'</b></div>'+
          '<div class="mline neg"><span>Disbursed (stock out) · '+nf(m.outQty)+' ml/gm</span><b>− '+rm(m.outVal)+'</b></div>'+
          LOT_KEYS.map(L=>'<div class="mline"><span><span class="lotchip">LOT '+L+'</span>'+nf(m.lots[L].q)+' ml/gm</span><b>'+rm(m.lots[L].v)+'</b></div>').join('')+
          (m.lots['—'].q?'<div class="mline"><span><span class="lotchip">NO LOT</span>'+nf(m.lots['—'].q)+' ml/gm</span><b>'+rm(m.lots['—'].v)+'</b></div>':'')+
          '<div class="mline '+(m.varVal<0?'neg':'pos')+'"><span>Stock-take variance / spillage</span><b>'+(m.varVal<0?'− ':'+ ')+rm(Math.abs(m.varVal))+'</b></div>'+
          '<div class="mline"><span><b>Closing balance &amp; valuation</b></span><b>'+rm(m.closeVal)+'</b></div>'+
        '</div>';}
      return h+'</div>';}).join('');}).join('')+
    '<div class="mline" style="margin-top:10px;border-top:2px solid #e2e6e1;padding-top:8px"><span><b>Closing stock balance today</b></span><b>'+rm(S.closeVal)+'</b></div>';}

// ================= Owner: Inventory Audit / Stock-Take Adjustment =================
function renderStOpts(){fillProdSelect('st-prod','st-search');onStProd();}
function onStProd(){const p=prodById($('st-prod').value);
  $('st-sys').textContent=p?(nf(onHand(p))+' '+p.unit):'—';
  $('st-ai').innerHTML=p?(esc(p.active_ingredient||'—')+'<br>'+esc(packLabel(p))):'—';
  $('st-unitlbl').textContent=p?p.unit:'ml/gm';
  onStCalc();}
function onStCalc(){const p=prodById($('st-prod').value);const box=$('st-var');
  if(!p||$('st-count').value===''){box.className='varbox';box.textContent='Enter the counted quantity to see the variance.';return;}
  const sys=onHand(p), cnt=+$('st-count').value||0, d=cnt-sys, v=d*(p.cpu||0);
  if(Math.abs(d)<1e-9){box.className='varbox ok';box.textContent='✓ Physical count matches the system exactly — no adjustment needed.';return;}
  box.className='varbox '+(d<0?'bad':'ok');
  box.innerHTML=(d<0?'SHORTAGE / SPILLAGE':'SURPLUS FOUND')+': <b>'+nf(Math.abs(d))+' '+esc(p.unit)+'</b> ('+nf(Math.abs(toCont(p,d)))+' '+esc(p.container)+')<br>Value impact <b>'+(d<0?'− ':'+ ')+rm(Math.abs(v))+'</b>';}
async function submitStockTake(){
  const err=$('st-err');err.textContent='';
  const p=prodById($('st-prod').value); if(!p){err.textContent='Pick the product you counted.';return;}
  if($('st-count').value===''){err.textContent='Enter the physical count.';return;}
  const cnt=+$('st-count').value; if(!(cnt>=0)){err.textContent='Physical count cannot be negative.';return;}
  const sys=onHand(p), d=+(cnt-sys).toFixed(4);
  if(Math.abs(d)<1e-9){toast('Count matches the system — nothing to adjust');return;}
  const v=+(d*(p.cpu||0)).toFixed(2);
  if(!confirm('Post stock-take adjustment?\n\n'+p.name+'\nSystem '+nf(sys)+' '+p.unit+' → counted '+nf(cnt)+' '+p.unit+
    '\nVariance '+(d<0?'':'+')+nf(d)+' '+p.unit+'  ('+(v<0?'-':'+')+'RM '+Math.abs(v).toFixed(2)+')'))return;
  await persistEvent({uuid:uuid(),type:'STOCK_ADJUST',dt:now(),pid:p.id,pname:p.name,ai:p.active_ingredient,
    counted:cnt,before:sys,delta:d,qty:Math.abs(d),unit:p.unit,cost:v,note:$('st-note').value.trim(),
    worker:CFG.worker,device:CFG.device,synced:false});
  $('st-count').value='';$('st-note').value='';
  toast('✓ Adjustment posted for '+p.name);
  refreshInventoryViews();}
function renderStRecent(){
  const box=$('st-recent');if(!box)return;
  const rows=[...stock_adjust_ledger].reverse().slice(0,8);
  box.innerHTML=rows.length?('<div class="sec">Recent adjustments</div>'+rows.map(a=>
    '<div class="lrow"><span><b>'+esc(a.productName)+'</b><br><span class="small">'+esc(a.timestamp)+' · '+esc(a.operator)+
    (a.note?' · '+esc(a.note):'')+'</span></span><span style="text-align:right;font-weight:800;color:'+(a.variance<0?'#b3261e':'#1b5e20')+'">'+
    (a.variance<0?'':'+')+nf(a.variance)+' '+esc(a.unit)+'<br><span class="small">'+rm(a.varianceValue)+'</span></span></div>').join(''))
    :'';}

// ---- single refresh entry point after any inventory write ----
function refreshInventoryViews(){
  rebuildLedgers();
  if(typeof renderHub==='function')renderHub();   // tile badges follow live stock
  if(typeof renderProgCheck==='function')renderProgCheck();
  if($('stocklist')&&$('scr-stock'))renderStock();
  renderAlerts();
  if(SHOW_VALUES){renderInvCC();renderLedgerSummary();renderStRecent();}
  if($('in-prod'))onInCalc();
  if($('out-prod'))onOutProd();
  if($('st-prod'))onStProd();
  badge();}

// ================= sync =================
// v3.2 — one description of an event, used by the sync list AND by the void audit row,
// so what the Owner sees on screen is literally what lands in the audit trail.
function describeEvent(e){
  if(!e)return '';
  if(e.type==='DROP')        return '🥭 '+e.qty+'× '+(e.clone||'?')+' @ '+e.tree+(e.grade?(' · Grade '+e.grade):'');
  if(e.type==='ROTTEN')      return '🍂 '+e.qty+' rotten @ '+e.tree+(e.cause?(' · '+e.cause):'');
  if(e.type==='TIE')         return '🎗️ '+e.n+' tied @ '+e.tree;
  if(e.type==='STOCK_OUT')   return '📦→ '+e.qty+' '+(e.unit||'')+' '+(e.pname||'')+(e.lot?(' · Lot '+e.lot):'');
  if(e.type==='STOCK_IN')    return '📦← '+e.qty+' '+(e.unit||'')+' '+(e.pname||'')+(e.ref?(' · '+e.ref):'');
  if(e.type==='STOCK_ADJUST')return '🧾 stock-take '+((e.delta||0)<0?'':'+')+e.delta+' '+(e.unit||'')+' '+(e.pname||'');
  if(e.type==='DISPATCH')    return '🚚 '+(e.invoice_no||'')+' · '+nf(e.total_kg)+' kg → '+(e.retailer_name||'');
  if(e.type==='CREDIT_TOPUP')return '💳 '+rm(e.amount_rm)+' credit → '+(e.retailer_name||'');
  if(e.type==='LOG_VOID')    return '⛔ voided: '+(e.detail||e.targetType||'');
  if(e.type==='ADMIN_CLEANUP')return '🗳️ clean-up: '+(e.removed||0)+' records removed';
  if(e.type==='ADMIN_PURGE') return '☢️ purge: '+(e.wiped||0)+' records wiped';
  if(e.type==='YIELD_ACK')   return '✍️ yield answer for '+(e.day||'');
  return (e.type||'event')+' '+(e.qty!=null?e.qty:'');}

/** v3.2 — nobody deletes a record. The Owner may VOID a row that has not yet reached the
 *  Google Sheet, and that voiding is itself an event, so the removal can never be hidden.
 *  A worker or purchaser has no delete path at all — their only route is a correction
 *  request, which lands on the Owner's Pending Data Adjustments dashboard. */
function canVoidEntry(){return myRole()==='OWNER';}
function isTreeLog(e){return e&&(e.type==='DROP'||e.type==='ROTTEN'||e.type==='TIE')&&!!e.tree;}

/**
 * v3.5.1 — "why do two phones show different numbers?" must be answerable from the phone.
 * This says, in one block: is the farm-wide total arriving, when did it last arrive, which
 * Sheet tabs it was built from, and how much of what you can see is only on this phone.
 */
function syncHealthHtml(){
  const mine=EVENTS.filter(e=>!e.synced&&
    (e.type==='TIE'||e.type==='DROP'||e.type==='ROTTEN')).length;
  const meta=(TREE_STATS&&TREE_STATS.meta)||STATS_META||null;
  const tabTxt=meta&&meta.tabs?Object.keys(meta.tabs).map(k=>k+' ('+meta.tabs[k]+')').join(', '):'';
  const missTxt=meta&&meta.missing&&meta.missing.length?meta.missing.join(', '):'';
  let head, body;
  if(TREE_STATS&&TREE_STATS.trees&&Object.keys(TREE_STATS.trees).length){
    head='<div class="shok">✓ Farm-wide tree totals ARE arriving</div>';
    body='Last received <b>'+esc(TREE_STATS.at)+'</b> covering <b>'+
      Object.keys(TREE_STATS.trees).length+' trees</b>.'+
      (tabTxt?('<br>Built from: '+esc(tabTxt)):'')+
      (missTxt?('<br><span class="shwarn">Tabs not found: '+esc(missTxt)+'</span>'):'')+
      '<br>Every phone that has synced since then shows the same figures.';
  } else if(STATS_FAULT==='empty'){
    head='<div class="shbad">✗ The Sheet is answering, but found no log rows</div>';
    body='The Apps Script is updated, but it could not read your tying / drop / rotten tabs, so it '+
      'returned nothing. Until that is fixed each phone still shows only its own work.'+
      (tabTxt?('<br>Tabs it did read: '+esc(tabTxt)):'')+
      (missTxt?('<br><b>Tabs it could NOT find: '+esc(missTxt)+'</b> — check the tab names in your '+
        'Google Sheet match these exactly.'):'');
  } else if(STATS_FAULT==='missing'){
    head='<div class="shbad">✗ Farm-wide totals are NOT arriving</div>';
    body='Your Google Sheet is still running the old Apps Script. Until it is updated and '+
      '<b>re-deployed as a New version</b>, each phone shows only the work keyed on it — which is '+
      'why two phones disagree.';
  } else {
    head='<div class="shwait">• Not checked yet</div>';
    body='Press SYNC NOW. If this phone has never reached the Sheet it shows only its own work.';
  }
  return '<div class="synchealth">'+head+'<div class="shbody">'+body+
    '<br>On this phone and not yet uploaded: <b>'+mine+'</b> row'+(mine===1?'':'s')+'.</div></div>';}

/** v3.10 — everything the office has NOT received, named, with a way to try again.
 *  Before this the only signal was a toast that appeared once and then never again. */
function stuckHtml(){
  const keys=Object.keys(SYNC_FAILS);
  if(!keys.length)return '';
  return '<div class="stuckbox"><div class="sh">⚠ '+keys.length+' '+
      esc(tr(keys.length>1?'sy_stuckn':'sy_stuck1'))+'</div>'+
    keys.map(k=>{const f=SYNC_FAILS[k];
      return '<div class="srow"><div class="sm"><b>'+esc(f.label||k)+'</b>'+
        '<span class="ss">'+f.n+' '+esc(tr('sy_records'))+' · '+esc(f.why)+'</span></div>'+
        '<button class="sretry" onclick="retryOne(\''+esc(k)+'\')">'+esc(tr('sy_retry'))+'</button>'+
      '</div>';}).join('')+
    '<div class="sfoot">'+esc(tr('sy_stucknote'))+'</div></div>';}

function renderSync(){
  $('cfginfo').innerHTML=(CFG?('Worker: <b>'+(CFG.worker||'—')+'</b> <span class="small">('+(CFG.role||'')+')</span> · Device: <b>'+(CFG.device||'—')+'</b><br>Sync URL: '+(CFG.url?'<b>set ✓</b>':'<span style="color:#b3261e">not set — edit settings</span>')):'')+'<br>App version: <b>'+APP_VERSION+'</b> · <span class="linkish" onclick="logout()">log out</span>';
  const sh=$('synchealth'); if(sh)sh.innerHTML=stuckHtml()+syncHealthHtml();
  const ap=$('appendnote');
  if(ap)ap.innerHTML='<b>🔒 This log is append-only.</b> '+(canVoidEntry()
    ? 'As Owner you may void an entry that has not yet reached the Google Sheet — voiding writes a '+
      'permanent audit row naming you and your reason. Anything already synced can never be removed by anyone.'
    : 'Nothing here can be deleted or edited from this phone. If a number is wrong, tap '+
      '<b>Request correction</b> — it goes to the Owner’s Pending Data Adjustments dashboard, and the '+
      'original entry stays on the record either way.');
  const L=$('ledger');
  L.innerHTML=EVENTS.length?[...EVENTS].reverse().slice(0,60).map(e=>{
    let d=describeEvent(e);
    if(e.type==='DROP') d='🥭 '+e.qty+'× '+(e.clone||'?')+' @ '+e.tree;
    else if(e.type==='STOCK_OUT') d='📦→ '+e.qty+' '+e.unit+' '+e.pname+(e.lot?(' · Lot '+e.lot):'')+(e.progSet?(' · '+e.progSet):'');
    else if(e.type==='STOCK_IN') d='📦← '+e.qty+' '+esc(e.unit||'')+' '+esc(e.pname||'')+(e.ref?(' · '+esc(e.ref)):'');
    else if(e.type==='STOCK_ADJUST') d='🧾 stock-take '+((e.delta||0)<0?'':'+')+e.delta+' '+e.unit+' '+e.pname;
    else if(e.type==='TASK_DONE') d='🛠️ '+esc(e.kindLabel||e.kind||'task')+' · Lot '+esc(e.lot||'')+
      (e.count?(' · '+e.count+' '+esc(e.countLabel||'items')):'')+' · '+nf(e.hours*e.crew)+' man-h';
    // v3.5.1 — this used to end `else d=e.type`, which threw away describeEvent()'s wording
    // and showed a bare "TIE" / "DISPATCH" for every row it did not name explicitly.
    // v3.2 — the delete control is gone for everyone except the Owner, and even then it
    // is a VOID that leaves a trace. Workers get the governed correction path instead.
    const right=e.synced
      ? '<span class="tag s">SYNCED</span>'
      : (canVoidEntry()
        ? '<span style="display:flex;align-items:center;gap:6px"><span class="tag q">QUEUED</span>'+
          '<span onclick="removeEvent(\''+e.uuid+'\')" style="color:#b3261e;font-weight:800;font-size:11px;'+
          'padding:4px 8px;border:1.5px solid #f1c3bf;border-radius:9px;cursor:pointer">VOID</span></span>'
        : '<span class="tag q">QUEUED</span>');
    const ask=(!canVoidEntry()&&isTreeLog(e)&&canCorrect())
      ? '<div><span class="linkish" onclick="openLogCorrection(\''+e.uuid+'\')">📝 Request correction</span></div>'
      : '';
    return '<div class="lrow"><span>'+d+'<br><span class="small">'+e.dt+' · '+e.worker+'</span>'+ask+'</span>'+right+'</div>';}).join('')
  :'<div class="small">No events yet.</div>';
  // v2.6.1 — a phone with an empty queue still needs to PULL the Owner's new work.
  // The button used to disable itself here, which left a worker with no way to ask.
  // v3.11 — this line used to omit setUnsynced(), so a phone with an unshared price matrix
  // read "CHECK FOR NEW WORK" as though it had nothing to send. Same misleading-signal
  // shape as the toast that printed the word "false".
  const b=$('syncbtn');const n=pending()+corrUnsynced()+q4()+setUnsynced();
  b.disabled=false;
  b.textContent=n?('⇧ SYNC '+n+' ITEM'+(n>1?'S':'')+' NOW'):'⇩ CHECK FOR NEW WORK';}
/**
 * v3.2 ANTI-MANIPULATION. Before this release ANY role could silently delete a queued
 * entry from their own phone before it ever synced — a worker could log 40 fruits, think
 * better of it, and remove the row with nothing upstream ever knowing. That hole is shut:
 *   · Worker / Purchaser: no delete path exists at all. They request a correction.
 *   · Owner: may void a row that has NOT yet reached the sheet, and the void itself is a
 *     LOG_VOID event carrying who, what and why. It syncs like any other record.
 *   · Anything already synced is untouchable for everyone, always.
 */
async function removeEvent(u){
  const e=EVENTS.find(x=>x.uuid===u);
  if(!e)return;
  if(e.synced){toast('Synced records can never be removed. Request a correction.',1);return;}
  if(!canVoidEntry()){
    toast('Records cannot be deleted. Tap “Request correction” — the Owner decides.',1);return;}
  const d=describeEvent(e);
  const res=await askForm({
    title:'Void this queued entry',
    sub:'“'+d+'” has not reached the Google Sheet yet. Voiding writes a permanent audit row naming you, '+
        'the entry and your reason — the removal itself can never be hidden.',
    f1:{label:'Reason for voiding',type:'text',value:'',placeholder:'e.g. keyed twice by mistake'},
    ok:'⛔ VOID THIS ENTRY'});
  if(!res)return;
  if(!res.v1.trim()){toast('A reason is required to void an entry',1);return;}
  await persistEvent({uuid:uuid(),type:'LOG_VOID',dt:now(),
    targetUuid:e.uuid,targetType:e.type||'',targetDt:e.dt||'',targetWorker:e.worker||'',
    detail:d,reason:res.v1.trim(),
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  EVENTS=EVENTS.filter(x=>x.uuid!==u);
  if(db)await del('events',u); else mem.events=EVENTS;
  badge();renderSync();toast('Entry voided — the audit row stays on the record');}
// Correction requests travel in their own payload key so the tested DROP/STOCK
// event pipeline is untouched. If the Google Sheet still runs the old Apps Script
// (no `corrections:true` in the reply) nothing is marked synced — the queue simply
// waits, and the app keeps working fully offline in the meantime.
let corrWarned=false;
async function pushCorrections(){
  const batch=CORRECTIONS.filter(c=>!c.synced);
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({corrections:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j.corrections){
      for(const c of batch){c.synced=true;if(db)await put('corrections',c);}
      badge();return true;}
    if(!corrWarned){corrWarned=true;
      toast('Corrections kept on this phone — update the Apps Script to share them',1);}
    return false;
  }catch(e){return false;}}
// Stock-take adjustments are a NEW event type. An Apps Script deployment that
// predates v2.3 does not know STOCK_ADJUST and would silently drop it while still
// replying ok — so adjustments go up in their own payload key and are only marked
// synced when the reply explicitly confirms `adjustments:true`. Old backend => the
// queue simply waits, one toast, and the app keeps working fully offline.
let adjWarned=false;
async function pushAdjustments(){
  const batch=EVENTS.filter(e=>e.type==='STOCK_ADJUST'&&!e.synced);
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({adjustments:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j.adjustments){
      for(const e of batch){e.synced=true;e.syncedAt=now();if(db)await put('events',e);}
      rebuildLedgers();badge();return true;}
    if(!adjWarned){adjWarned=true;
      toast('Stock-take adjustments kept on this phone — update the Apps Script to share them',1);}
    return false;
  }catch(e){return false;}}
let syncing=false;
async function doSync(auto){
  if(syncing)return;
  if(!CFG||!CFG.url){if(!auto)toast('Set the Sync URL in Settings first',1);return;}
  if(!navigator.onLine){if(!auto)toast('No internet connection',1);return;}
  if(REG_DIRTY)await pushRegistry();          // registry changes go up first
  await pushCorrections();                    // then correction requests / decisions
  await pushAdjustments();                    // then stock-take adjustments (own payload key)
  await pushPrograms();                       // then activated programmes (own payload key)
  await pushTasks();                          // then general task assignments (own payload key)
  await pushTaskLogs();                       // then general task completions + labour
  await pushRain();                           // then the rain gauge log (own payload key)
  await pushRotten();                         // then rotten fruit logs (own payload key)
  await pushLogAdj();                         // then approved log corrections (own payload key)
  await pushTying();                          // then continuous tying rounds (own payload key)
  await pushTieAdj();                         // then approved tying corrections (own payload key)
  await pushSales();                          // then marketing sales (own payload key)
  await pushRetailers();                      // then the retailer master (own payload key)
  await pushSettings();                       // v3.11 — prices, basket tare, added trees
  await pushDispatchReqs();                   // v3.6 — scale photo requests (own payload key)
  await pushDispatch();                       // then retailer dispatches + credit top-ups
  await pushAudit();                          // then the anti-manipulation audit trail
  // Anything with its own payload key MUST also be excluded here, or it goes up twice.
  const batch=EVENTS.filter(e=>!e.synced&&e.type!=='STOCK_ADJUST'&&e.type!=='TASK_DONE'
    &&e.type!=='ROTTEN'&&e.type!=='DROP_ADJUST'&&e.type!=='ROTTEN_ADJUST'
    &&e.type!=='TIE'&&e.type!=='TIE_ADJUST'&&e.type!=='SALE'
    &&e.type!=='DISPATCH'&&e.type!=='CREDIT_TOPUP'&&e.type!=='DISPATCH_REQ'
    &&e.type!=='LOG_VOID'&&e.type!=='YIELD_ACK'&&e.type!=='ADMIN_PURGE'&&e.type!=='ADMIN_CLEANUP'
    &&e.type!=='DISPATCH_REJECT'&&e.type!=='DISPATCH_CANCEL');
  if(!batch.length){
    const got=await refreshMasters();renderSync();
    // v3.8.1 — every own-key push above has already run. Anything still unsynced at this
    // point was REFUSED by the backend, and saying "up to date" over the top of that is how
    // a stuck load stayed invisible: the worker was told everything was fine.
    const stuck=pending()+setUnsynced();
    if(!auto){
      const nn=got?(got.tasks+got.programs):0;
      if(stuck)toast('⚠ '+stuck+' '+tr(stuck>1?'sy_stuck_n':'sy_stuck_1'),1);
      // v3.8.1 — the `,!got` used to sit INSIDE these brackets, so the comma operator threw
      // the message away and the worker was shown the literal word "false" every time they
      // pressed Sync with an empty queue. Pre-existing since v2.5.1; caught by test 6.4.
      else toast(nn?('✓ '+nn+' new job'+(nn>1?'s':'')+' received from the Owner')
              :(got?'✓ Up to date — nothing new from the Owner':'Could not reach the Google Sheet'),!got);}
    return;}
  syncing=true;const b=$('syncbtn');b.textContent='Uploading '+batch.length+'…';
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({events:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}}); // text/plain avoids CORS preflight for Apps Script
    const j=await r.json();
    if(j&&j.ok){for(const e of batch){e.synced=true;e.syncedAt=now();if(db)await put('events',e);}rebuildLedgers();badge();renderSync();
      const left=pending()+setUnsynced();   // refused own-key records still sitting here
      toast(left?('⚠ '+batch.length+' sent, but '+left+' '+tr(left>1?'sy_stuck_n':'sy_stuck_1'))
                :('✓ '+batch.length+' events synced to Google Sheets'),!!left);
      refreshMasters(); // hidden hotspot token validation runs after every sync
    }
    // v2.5.1: the backend now reports ok:false with a reason — show the reason, not "server error"
    else throw new Error((j&&(j.error||(j.errors&&j.errors.length&&j.errors[0])))||'server error');
  }catch(err){toast('Sync failed: '+err.message,1);renderSync();}
  syncing=false;}

// ================= dashboard =================
function renderDash(){
  const today=todayStr();
  const drops=EVENTS.filter(e=>e.type==='DROP');
  const dToday=drops.filter(e=>e.dt.slice(0,10)===today);
  const wk=drops.filter(e=>(new Date()-new Date(e.dt.replace(' ','T')))<7*86400000);
  const tot=dToday.reduce((s,e)=>s+e.qty,0), kg=dToday.reduce((s,e)=>s+e.estkg,0);
  const mk=today.slice(0,7);                       // v2.5.1: this month, not a hard-coded August
  const cost=EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.dt.slice(0,7)===mk).reduce((s,e)=>s+(e.cost||0),0);
  const ML=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const cl=$('k-costlbl'); if(cl)cl.textContent='Material cost · '+ML[+mk.slice(5,7)-1];
  $('k-drops').textContent=tot;$('k-kg').textContent=kg.toFixed(0);
  $('k-week').textContent=wk.reduce((s,e)=>s+e.qty,0);$('k-cost').textContent='RM '+cost.toFixed(0);
  // PHI banner
  const days=Math.ceil((PEAK_DATE-new Date())/86400000);
  const box=$('phibox');
  if(days>=0&&days<=15&&box.dataset.dashhide!=='1'){box.style.display='block';
    box.innerHTML='<b>🔒 PHI WATCH:</b> peak drop projected 21–22 Aug ('+days+' day'+(days==1?'':'s')+'). Fruit-contact products (Fetto 480, Pictor) now require Owner approval to log.';}
  else box.style.display='none';
  // lot bars
  $('lotbars').innerHTML=['A','B','C'].map(l=>{
    const n=drops.filter(e=>e.lot===l).reduce((s,e)=>s+e.qty,0);
    const c=CENSUS_TOTAL[l]||1;
    return '<div class="bar"><div class="br"><span>Lot '+l+'</span><b>'+n.toLocaleString()+' / '+c.toLocaleString()+'</b></div><div class="track"><div class="fill" style="width:'+Math.min(100,n/c*100)+'%"></div></div></div>';}).join('');
  const by={};dToday.forEach(e=>{const k=e.clone||'?';by[k]=by[k]||{n:0,kg:0};by[k].n+=e.qty;by[k].kg+=e.estkg;});
  $('mkt').innerHTML=Object.keys(by).length?Object.entries(by).map(([c,v])=>
    '<div class="lrow"><span><b>'+c+'</b></span><span><b>'+v.n+'</b> fruit · ~'+v.kg.toFixed(0)+' kg</span></div>').join('')
  :'<div class="lrow"><span>—</span><span class="small">no drops today</span></div>';}

// ================= v2.5 AGRONOMIST PROGRAMME · DAILY OPS · PROGRAM STOCK CHECK =================
// PHASE_PROGRAM is parsed straight from Sgsgtdurianprogramme_26.xlsx. Two dose bases,
// exactly as the sheet states them:
//   FOLIAR sets  -> dose is PER 1000 LITRE TANK MIX  ("Set 1 | 1000L")
//   FERT sets    -> dose is PER TREE                  ("Fertilizer Input ... 500gm")
// Soil-drench headers carry their own rate ("Soil Drenching (10 liter per tree)"), so
// their tank count is known. For spray/leaf sets the sheet does not state litres per
// tree — the Owner supplies it when activating, and the app never guesses.
let PROGRAMS=[];                       // activated programme records (IndexedDB 'programs')

function monthLabel(m){return MONTH_LABEL[m]||m;}
function phaseById(id){return PHASE_PROGRAM.find(p=>p.id===id)||
  (typeof BLUEPRINTS!=='undefined'?BLUEPRINTS.find(p=>p.id===id):null)||null;}
function allPhases(){return PHASE_PROGRAM.concat(typeof BLUEPRINTS!=='undefined'?BLUEPRINTS:[]);}
function treesInScope(sc){return sc==='ALL'?TREE_MASTER.length:treesInLot(sc).length;}
function progOf(uuid){return PROGRAMS.find(p=>p.uuid===uuid)||null;}
function activePrograms(){return PROGRAMS.filter(p=>p.status==='ACTIVE');}

// ---- projection: how much of each product a phase will consume ----
// FOLIAR: tanks = litresPerTree x trees / 1000 ; required = dose x tanks
// FERT  : required = dose x trees
function projectPhase(phase,scope,litresPerTree){
  const trees=treesInScope(scope);
  const perTree=(phase.basis==='PER_1000L')?(+litresPerTree||0):0;
  const tanks=(phase.basis==='PER_1000L')?(perTree*trees/1000):0;
  const mult=(phase.basis==='PER_1000L')?tanks:trees;
  const lines=phase.lines.map(l=>{
    const p=prodById(l.pid);
    return {pid:l.pid,raw:l.raw,pname:p?p.name:l.raw,ai:p?p.active_ingredient:(l.ai||''),
      unit:p?p.unit:l.unit,dose:l.qty,doseUnit:l.unit,
      required:+(l.qty*mult).toFixed(2),
      cpu:p?(p.cpu||0):0,cost:+(l.qty*mult*(p?(p.cpu||0):0)).toFixed(2)};});
  return {trees:trees,litresPerTree:perTree,litres:+(perTree*trees).toFixed(1),
    tanks:+tanks.toFixed(3),mult:mult,lines:lines,
    cost:+lines.reduce((s,x)=>s+x.cost,0).toFixed(2)};
}

// ================= Owner: phase browser =================
let agroMonth='Aug';
function setAgroMonth(m){agroMonth=m;renderTimeline();}
// renderAgroPhases() moved to the v2.7 section below
let pmPhase=null,pmScopeVal='ALL';
function openProgModal(id){
  const p=phaseById(id); if(!p){toast('Phase not found',1);return;}
  pmPhase=p; pmScopeVal='ALL';
  $('pm-title').textContent=monthLabel(p.month)+' · '+p.set;
  $('pm-sub').textContent=p.header||'';
  $('pm-basis').textContent=p.basis==='PER_1000L'?'per 1000 L tank':'per tree';
  $('pm-mode').innerHTML=esc(MODE_LABEL[p.mode]||p.mode)+(p.plan?('<br>planned '+esc(p.plan)):'');
  ['ALL','A','B','C'].forEach(k=>$('ps-'+k).classList.toggle('on',k==='ALL'));
  const foliar=(p.basis==='PER_1000L');
  $('pm-lptwrap').style.display=foliar?'':'none';
  $('pm-lpt').value=foliar?(p.litresPerTree||LAST_LPT[p.mode]||''):'';
  $('pm-lpthint').textContent=p.litresPerTree
    ?('The sheet states '+p.litresPerTree+' litres per tree for this drench set — change it only if the field does something different.')
    :'The sheet gives the dose per 1000 L tank but not the litres each tree takes — enter what the sprayer actually applies.';
  $('pm-start').value=ymd(dayStart(new Date()));
  pmDurSet(LAST_DUR[p.mode]||30);
  $('pm-err').textContent='';
  $('progmodal').classList.remove('hidden');
  pmCalc();}
let LAST_DUR={};
function pmDurSet(days){
  days=Math.max(1,Math.round(+days||30));
  const u=(days%365===0&&days>=365)?365:((days%30===0&&days>=30)?30:((days%7===0&&days>=7)?7:1));
  $('pm-duru').value=String(u);$('pm-durn').value=days/u;
  [...$('pm-durpick').children].forEach(el=>el.classList.remove('on'));
  const hit=[...$('pm-durpick').children].find(el=>/pmDur\((\d+)/.test(el.getAttribute('onclick'))&&
    +el.getAttribute('onclick').match(/pmDur\((\d+)/)[1]===days);
  if(hit)hit.classList.add('on');
  pmClock();}
function pmDur(days,el){
  $('pm-duru').value='1';$('pm-durn').value=days;
  [...$('pm-durpick').children].forEach(x=>x.classList.remove('on'));
  if(el)el.classList.add('on');
  pmDurSet(days);}
function pmDurCustom(){[...$('pm-durpick').children].forEach(x=>x.classList.remove('on'));pmClock();}
function pmDurDays(){return Math.max(1,Math.round((+$('pm-durn').value||0)*(+$('pm-duru').value||1)));}
function pmClock(){
  const st=parseDay($('pm-start').value)||dayStart(new Date());
  const d=pmDurDays(), end=addDays(st,d);
  const c=phaseClock({startDate:ymd(st),durDays:d});
  $('pm-clock').innerHTML='Runs <b>'+esc(durLabel(d))+'</b> — '+esc(ymd(st))+' ➔ <b>'+esc(ymd(end))+
    '</b><br><span class="exphint">'+esc(c.text)+' · the workers\' task card counts this down</span>';}
function closeProgModal(){$('progmodal').classList.add('hidden');pmPhase=null;}
function pmScope(s){pmScopeVal=s;['ALL','A','B','C'].forEach(k=>$('ps-'+k).classList.toggle('on',k===s));pmCalc();}
function pmCalc(){
  if(!pmPhase)return;
  pmClock();
  const pr=projectPhase(pmPhase,pmScopeVal,$('pm-lpt').value);
  $('pm-adv').innerHTML=advHTML(weatherAdvice(pmPhase,pmPhase.lines));
  $('pm-conv').innerHTML=pmPhase.basis==='PER_1000L'
    ?('<b>'+pr.trees+' trees</b> × '+nf(pr.litresPerTree)+' L = '+nf(pr.litres)+' L mix = <b>'+nf(pr.tanks)+' tank'+(pr.tanks===1?'':'s')+'</b> of 1000 L')
    :('<b>'+pr.trees+' trees</b> × the per-tree dose below');
  $('pm-tbl').innerHTML='<tr><th>Product</th><th class="num">Dose</th><th class="num">Required</th><th class="num">On hand</th></tr>'+
    pr.lines.map(l=>{const oh=prodById(l.pid)?onHand(prodById(l.pid)):0;const short=oh<l.required;
      return '<tr><td><div class="pn">'+esc(l.pname)+'</div><div class="pa">'+esc(l.ai||'—')+'</div></td>'+
        '<td class="num">'+nf(l.dose)+' '+esc(l.doseUnit)+'</td>'+
        '<td class="num"><b>'+nf(l.required)+'</b><br><span class="exphint">'+esc(l.unit)+'</span></td>'+
        '<td class="num '+(short?'lowq':'')+'">'+nf(oh)+(short?'<br><span class="exphint">short '+nf(l.required-oh)+'</span>':'')+'</td></tr>';}).join('')+
    (SHOW_VALUES?('<tr><td colspan="3"><b>Projected material cost</b></td><td class="num"><b>'+rm(pr.cost)+'</b></td></tr>'):'');}
let LAST_LPT={};
async function activatePhase(){
  const err=$('pm-err');err.textContent='';
  if(!pmPhase)return;
  const foliar=(pmPhase.basis==='PER_1000L');
  const lpt=+$('pm-lpt').value||0;
  if(foliar&&!(lpt>0)){err.textContent='Enter the litres of spray mix each tree takes.';return;}
  const pr=projectPhase(pmPhase,pmScopeVal,lpt);
  if(foliar){LAST_LPT[pmPhase.mode]=lpt;if(db)await put('kv',{k:'lastlpt',v:LAST_LPT});}
  LAST_DUR[pmPhase.mode]=pmDurDays();
  const rec={uuid:uuid(),phaseId:pmPhase.id,month:pmPhase.month,set:pmPhase.set,kind:pmPhase.kind,
    mode:pmPhase.mode,header:pmPhase.header||'',basis:pmPhase.basis,plan:pmPhase.plan||'',
    scope:pmScopeVal,trees:pr.trees,litresPerTree:pr.litresPerTree,tanks:pr.tanks,
    startDate:ymd(parseDay($('pm-start').value)||dayStart(new Date())),durDays:pmDurDays(),
    weather:WEATHER,custom:!!pmPhase.custom,
    lines:pr.lines.map(l=>({pid:l.pid,pname:l.pname,ai:l.ai,unit:l.unit,dose:l.dose,required:l.required})),
    projCost:pr.cost,by:CFG.worker,byId:CFG.uid||'',at:now(),status:'ACTIVE',synced:false};
  // one live record per phase — re-activating supersedes the previous one
  for(const old of PROGRAMS.filter(x=>x.phaseId===rec.phaseId&&x.status==='ACTIVE')){
    old.status='CLOSED';old.synced=false;if(db)await put('programs',old);}
  PROGRAMS.push(rec); if(db)await put('programs',rec);
  const label=pmPhase.set;                 // read before closeProgModal() clears pmPhase
  closeProgModal();badge();
  toast('✓ '+label+' activated for '+pr.trees+' trees');
  renderTimeline();renderTimeline();renderProgCheck();renderReady();renderOpsTasks();
  renderWeather();renderHub();}
async function closeProgram(u){
  const r=progOf(u); if(!r)return;
  if(!confirm('Close '+r.set+'?\nWorkers will stop seeing it in Today\'s Tasks.'))return;
  r.status='CLOSED';r.synced=false; if(db)await put('programs',r);
  badge();toast('Phase closed');
  renderTimeline();renderTimeline();renderProgCheck();renderOpsTasks();renderHub();}

// ---- Owner projection view ----
function renderProjection(){
  const box=$('projbox');if(!box)return;
  const live=activePrograms();
  if(!live.length){box.innerHTML='<div class="small">No phase is active. Open <b>PHASES</b>, pick a set and tap ACTIVATE PHASE — the projected volume for every product appears here.</div>';return;}
  box.innerHTML=live.map(r=>{
    const done=lotsDone(r.uuid);
    return '<div class="mrow"><div class="mh"><div><div class="ml">'+esc(monthLabel(r.month))+' · '+esc(r.set)+'</div>'+
      '<div class="exphint">'+esc(MODE_LABEL[r.mode]||r.mode)+' · '+r.trees+' trees ('+(r.scope==='ALL'?'whole farm':'Lot '+r.scope)+')'+
      (r.basis==='PER_1000L'?(' · '+nf(r.tanks)+' tanks @ '+nf(r.litresPerTree)+' L/tree'):'')+'</div></div>'+
      '<div class="mc">'+(SHOW_VALUES?rm(r.projCost):'')+'</div></div>'+
      '<div class="msub">'+clockHTML(r)+'<table class="tbl">'+
      '<tr><th>Product</th><th class="num">Required</th><th class="num">On hand</th><th class="num">Used</th></tr>'+
      r.lines.map(l=>{const p=prodById(l.pid);const oh=p?onHand(p):0;const used=usedForProgram(r.uuid,l.pid);
        return '<tr><td><div class="pn">'+esc(l.pname)+'</div><div class="pa">'+esc(l.ai||'—')+'</div></td>'+
        '<td class="num"><b>'+nf(l.required)+'</b> '+esc(l.unit)+'</td>'+
        '<td class="num '+(oh<l.required?'lowq':'')+'">'+nf(oh)+'</td>'+
        '<td class="num">'+nf(used)+'</td></tr>';}).join('')+'</table>'+
      '<div class="mline"><span>Lots reported complete</span><b>'+(done.length?done.map(l=>'<span class="lotchip">LOT '+l+'</span>').join(''):'none yet')+'</b></div>'+
      '</div></div>';}).join('');}

// completion is DERIVED from the stock-out rows the workers file, so a reply needs
// no sync channel of its own — it rides the already-tested STOCK_OUT pipeline.
function lotsDone(pu){return LOT_KEYS.filter(L=>EVENTS.some(e=>e.type==='STOCK_OUT'&&e.progId===pu&&e.lot===L));}
function usedForProgram(pu,pid){return EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.progId===pu&&e.pid===+pid)
  .reduce((s,e)=>s+(+e.qty||0),0);}

// ================= Purchaser: upcoming programme stock check =================
function programNeeds(){                       // product -> outstanding requirement
  const need={};
  activePrograms().forEach(r=>r.lines.forEach(l=>{
    const outstanding=Math.max(0,l.required-usedForProgram(r.uuid,l.pid));
    if(outstanding<=0)return;
    const k=l.pid;
    if(!need[k])need[k]={pid:l.pid,pname:l.pname,ai:l.ai,unit:l.unit,req:0,phases:[]};
    need[k].req+=outstanding;need[k].phases.push(monthLabel(r.month)+' '+r.set);}));
  return Object.values(need).map(n=>{
    const p=prodById(n.pid);const oh=p?onHand(p):0;
    n.onHand=oh;n.gap=+(n.req-oh).toFixed(2);n.short=n.gap>0;
    n.buyContainers=p&&p.unit_multiplier?Math.ceil(n.gap/p.unit_multiplier):0;
    n.container=p?p.container:'';return n;}).sort((a,b)=>b.gap-a.gap);}
function programShortages(){return programNeeds().filter(n=>n.short);}
function renderProgCheck(){
  const box=$('chkbox');if(!box)return;
  const live=activePrograms();
  if(!live.length){box.innerHTML='<div class="alertnone">No programme phase is active. Nothing to order ahead for.</div>';return;}
  const needs=programNeeds(), short=needs.filter(n=>n.short);
  box.innerHTML=(short.length
      ?'<div class="alertbig">⚠ INSUFFICIENT STOCK FOR ACTIVE PHASE — '+short.length+' PRODUCT'+(short.length>1?'S':'')+'</div>'
      :'<div class="alertnone">✓ Every product in the active phase is covered by current stock.</div>')+
    '<div class="small" style="margin:8px 0 4px">Active: '+live.map(r=>esc(monthLabel(r.month)+' '+r.set)+' ('+r.trees+' trees)').join(' · ')+'</div>'+
    '<div class="tblwrap"><table class="tbl"><tr><th>Product</th><th class="num">Needs</th><th class="num">In store</th><th class="num">Order</th></tr>'+
    needs.map(n=>'<tr'+(n.short?' style="background:#fdecea"':'')+'>'+
      '<td><div class="pn">'+esc(n.pname)+(n.short?' <span class="cstat r">SHORT</span>':'')+'</div>'+
      '<div class="pa">'+esc(n.ai||'—')+'</div><div class="exphint">'+esc(n.phases.join(', '))+'</div></td>'+
      '<td class="num">'+nf(n.req)+'<br><span class="exphint">'+esc(n.unit)+'</span></td>'+
      '<td class="num '+(n.short?'lowq':'')+'">'+nf(n.onHand)+'</td>'+
      '<td class="num">'+(n.short?('<b>'+n.buyContainers+'</b><br><span class="exphint">'+esc(n.container)+'</span>'):'—')+'</td></tr>').join('')+
    '</table></div>';}

// ---- Purchaser read-ahead: what the NEXT phase needs, grouped by active ingredient ----
// "Next" means the phases that follow the ones running now, in programme order, so the
// purchaser can order on lead time instead of reacting to a shortage on spray day.
function nextPhases(limit){
  const liveIds=activePrograms().map(r=>r.phaseId);
  // only the calendar programme has a "next" — a custom set is not a point in the year
  const seq=PHASE_PROGRAM.slice().sort((a,b)=>{
    const d=PROG_MONTH_ORDER.indexOf(a.month)-PROG_MONTH_ORDER.indexOf(b.month);
    return d!==0?d:String(a.set).localeCompare(String(b.set));});
  let start=-1;
  for(let i=seq.length-1;i>=0;i--) if(liveIds.indexOf(seq[i].id)>=0){start=i+1;break;}
  if(start<0){                       // nothing from the calendar is running — anchor on today
    const t=todayStr();
    const i=seq.findIndex(x=>x.plan&&String(x.plan)>=t);
    start=i>=0?i:0;}
  return seq.slice(start).filter(x=>liveIds.indexOf(x.id)<0).slice(0,limit||3);}
function readyNeeds(){
  const lpt=(m)=>(LAST_LPT&&LAST_LPT[m])||6;      // last litres/tree the Owner actually used
  const by={};
  nextPhases(3).forEach(ph=>{
    const pr=projectPhase(ph,'ALL',ph.litresPerTree||lpt(ph.mode));
    pr.lines.forEach(l=>{
      const p=prodById(l.pid); const ai=aiFor(l.pid,l.ai)||'(not recorded)';
      if(!by[ai])by[ai]={ai:ai,req:0,onHand:0,unit:l.unit,prods:{},phases:{},cls:rainClass(ai)};
      const b=by[ai];
      b.req+=l.required; b.phases[monthLabel(ph.month)+' '+ph.set]=1;
      if(p&&!b.prods[p.id]){b.prods[p.id]={name:p.name,oh:onHand(p),unit:p.unit,
        container:p.container,mult:p.unit_multiplier||1};b.onHand+=onHand(p);}});});
  return Object.values(by).map(b=>{
    b.gap=+(b.req-b.onHand).toFixed(2); b.short=b.gap>0;
    const first=Object.values(b.prods)[0];
    b.buy=b.short&&first&&first.mult?Math.ceil(b.gap/first.mult):0;
    b.container=first?first.container:''; b.req=+b.req.toFixed(2);
    return b;}).sort((a,b)=>b.gap-a.gap);}
function renderReady(){
  const box=$('readybox'); if(!box)return;
  const nx=nextPhases(3);
  if(!nx.length){box.innerHTML='<div class="alertnone">Nothing further in the programme after the active phase.</div>';return;}
  const needs=readyNeeds(), short=needs.filter(x=>x.short);
  box.innerHTML=(short.length
      ?'<div class="alertbig">⚠ PREPARE NOW — '+short.length+' ACTIVE INGREDIENT'+(short.length>1?'S':'')+' SHORT FOR THE NEXT PHASE</div>'
      :'<div class="alertnone">✓ The next phases are covered by stock on hand.</div>')+
    '<div class="small" style="margin:8px 0 4px">Coming up: '+nx.map(p=>esc(monthLabel(p.month)+' '+p.set)).join(' · ')+
    '<br><span class="exphint">Foliar volumes assume the litres per tree last used; the Owner sets the real figure on activation.</span></div>'+
    '<div class="tblwrap"><table class="tbl"><tr><th>Active ingredient</th><th class="num">Needs</th><th class="num">In store</th><th class="num">Order</th></tr>'+
    needs.map(x=>'<tr'+(x.short?' style="background:#fdecea"':'')+'>'+
      '<td><div class="pn">'+esc(x.ai)+(x.short?' <span class="cstat r">SHORT</span>':'')+'</div>'+
      '<div class="pa">'+Object.values(x.prods).map(pr=>esc(pr.name)).join(', ')+'</div>'+
      '<div class="exphint">'+esc(Object.keys(x.phases).join(', '))+'</div></td>'+
      '<td class="num">'+nf(x.req)+'<br><span class="exphint">'+esc(x.unit)+'</span></td>'+
      '<td class="num '+(x.short?'lowq':'')+'">'+nf(x.onHand)+'</td>'+
      '<td class="num">'+(x.short?('<b>'+x.buy+'</b><br><span class="exphint">'+esc(x.container)+'</span>'):'—')+'</td></tr>').join('')+
    '</table></div>';}

// ================= Farm Worker: today's tasks + completion reply =================
function myTasks(){
  // a task stays on the worker's list until every lot in its scope has been reported
  return activePrograms().filter(r=>{
    const need=r.scope==='ALL'?LOT_KEYS:[r.scope];
    return need.some(L=>!lotsDone(r.uuid).includes(L));});}
// renderOpsTasks() moved to the v2.7 section below
function renderOpsHistory(){
  const box=$('opshistlist');if(!box)return;
  const rows=EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.progId).slice(-40).reverse();
  const seen={},groups=[];
  rows.forEach(e=>{const k=e.progId+'|'+e.lot+'|'+e.dt;
    if(!seen[k]){seen[k]={k:k,dt:e.dt,lot:e.lot,prog:e.progSet||'',worker:e.worker,tanks:e.tanks,
      water:e.water,waterKeyed:e.waterKeyed,n:0,cost:0};groups.push(seen[k]);}
    seen[k].n++;seen[k].cost+=(+e.cost||0);});
  box.innerHTML=groups.length?groups.slice(0,12).map(g=>
    '<div class="lrow"><span><b>'+esc(g.prog||'programme')+'</b> · Lot '+esc(g.lot)+
    '<br><span class="small">'+esc(g.dt)+' · '+esc(g.worker)+' · '+nf(g.tanks)+' tank(s) · '+
    (g.waterKeyed===false?'≈':'')+nf(g.water)+' L water</span></span>'+
    '<span style="text-align:right;font-weight:800">'+g.n+' item'+(g.n>1?'s':'')+
    (SHOW_VALUES?('<br><span class="small">'+rm(g.cost)+'</span>'):'')+'</span></div>').join('')
    :'<div class="small">'+esc(tr('op_noreply'))+'</div>';}

let rpProg=null,rpLotVal='';
// v2.5.1 — a completion reply covers ONE lot. When the phase was activated for the
// whole farm the prefill must be that lot's SHARE, never the whole-farm figure, or
// three lot replies deduct three times the material that was actually applied.
function rpShare(){
  if(!rpProg)return 1;
  if(rpProg.scope!=='ALL'||!rpLotVal)return 1;
  const t=+rpProg.trees||0; if(!t)return 1;
  return treesInLot(rpLotVal).length/t;}
function rpTrees(){return Math.round((rpProg?(+rpProg.trees||0):0)*rpShare());}
function rpFill(){
  if(!rpProg)return;
  const foliar=(rpProg.basis==='PER_1000L'), sh=rpShare(), tr=rpTrees();
  // raw numbers only: nf() adds a thousands comma and <input type="number"> silently drops it
  $('rp-tanks').value=foliar?+((+rpProg.tanks||0)*sh).toFixed(3):tr;
  $('rp-water').value=foliar?+((+rpProg.litresPerTree||0)*(+rpProg.trees||0)*sh).toFixed(1):'';
  $('rp-mode').innerHTML=esc(MODE_LABEL[rpProg.mode]||rpProg.mode)+'<br>'+tr+' tree'+(tr===1?'':'s')+
    (rpProg.scope==='ALL'
      ?(rpLotVal?(' · Lot '+esc(rpLotVal)+' share of the farm'):' · whole farm — pick the lot you did')
      :(' · Lot '+esc(rpProg.scope)));
  rpCalc();}
function openReply(u){
  const r=progOf(u); if(!r){toast('Task not found',1);return;}
  rpProg=r; rpLotVal='';
  const foliar=(r.basis==='PER_1000L');
  $('rp-sub').textContent='This task was set by the Owner and cannot be changed. Report what was actually applied.';
  $('rp-task').textContent=monthLabel(r.month)+' · '+r.set;
  $('rp-unitlbl').textContent=foliar?'Tanks sprayed (1000 L each)':'Trees treated';
  LOT_KEYS.forEach(L=>$('rl-'+L).classList.toggle('on',false));
  $('rp-crew').value='';$('rp-hours').value='';
  $('rp-err').textContent='';
  $('replymodal').classList.remove('hidden');
  rpFill();}
function closeReply(){$('replymodal').classList.add('hidden');rpProg=null;}
function rpLot(L){rpLotVal=L;LOT_KEYS.forEach(k=>$('rl-'+k).classList.toggle('on',k===L));rpFill();}
function rpMult(){return +$('rp-tanks').value||0;}
function rpCalc(){
  if(!rpProg)return;
  const m=rpMult();
  $('rp-tbl').innerHTML='<tr><th>Product</th><th class="num">Dose</th><th class="num">Will deduct</th><th class="num">On hand</th></tr>'+
    rpProg.lines.map(l=>{const p=prodById(l.pid);const oh=p?onHand(p):0;const q=+(l.dose*m).toFixed(2);
      return '<tr><td><div class="pn">'+esc(l.pname)+'</div><div class="pa">'+esc(l.ai||'—')+'</div></td>'+
        '<td class="num">'+nf(l.dose)+'</td>'+
        '<td class="num"><b>'+nf(q)+'</b> '+esc(l.unit)+'</td>'+
        '<td class="num '+(oh<q?'lowq':'')+'">'+nf(oh)+'</td></tr>';}).join('');
  const crew=+$('rp-crew').value||0, hrs=+$('rp-hours').value||0;
  $('rp-labour').innerHTML=crew&&hrs
    ?('<b>'+nf(crew*hrs)+'</b> man-hours ('+crew+' worker'+(crew>1?'s':'')+' × '+nf(hrs)+' h)')
    :'Enter the crew size and hours — the month’s labour total is built from these.';}
let replySaving=false;
async function submitReply(){
  const err=$('rp-err');err.textContent='';
  if(!rpProg||replySaving)return;
  const m=rpMult();
  if(!(m>0)){err.textContent=(rpProg.basis==='PER_1000L'?'Enter how many tanks were sprayed.':'Enter how many trees were treated.');return;}
  const water=+$('rp-water').value;
  if(!(water>=0)||$('rp-water').value===''){err.textContent='Enter the water volume used in litres.';return;}
  if(!rpLotVal){err.textContent='Select the target lot the programme was applied to.';return;}
  const crew=Math.round(+$('rp-crew').value||0), hours=+$('rp-hours').value;
  if(!(crew>0)){err.textContent='Enter how many workers were on the job.';return;}
  if(!(hours>0)){err.textContent='Enter the hours worked per worker.';return;}
  if(lotsDone(rpProg.uuid).includes(rpLotVal)&&
     !confirm('Lot '+rpLotVal+' was already reported for this phase.\nSend another reply anyway?'))return;
  // PHI guard is kept on the programme path too
  for(const l of rpProg.lines){
    const p=prodById(l.pid); if(!p)continue;
    const phi=PHI_PRODUCTS[p.name]; if(!phi)continue;
    const days=Math.ceil((PEAK_DATE-new Date())/86400000);
    if(days>=0&&days<phi&&!confirm('⚠ PHI WARNING\n'+p.name+' has a '+phi+'-day residue cut-off.\nProjected peak drop 21–22 Aug is in '+days+' day(s).\n\nLog this reply anyway?'))return;}
  replySaving=true;
  const stamp=now(), rid=uuid();
  try{
    for(const l of rpProg.lines){
      const p=prodById(l.pid); const q=+(l.dose*m).toFixed(2); if(!(q>0))continue;
      await persistEvent({uuid:uuid(),type:'STOCK_OUT',dt:stamp,pid:l.pid,pname:l.pname,
        ai:l.ai||(p?p.active_ingredient:''),qty:q,unit:l.unit,lot:rpLotVal,
        set:monthLabel(rpProg.month)+' - '+rpProg.set,
        cost:+(q*(p?(p.cpu||0):0)).toFixed(2),
        progId:rpProg.uuid,progSet:monthLabel(rpProg.month)+' · '+rpProg.set,replyId:rid,
        tanks:m,water:water,crew:crew,hours:hours,
        worker:CFG.worker,device:CFG.device,synced:false});}
  } finally { replySaving=false; }
  const n=rpProg.lines.length, lot=rpLotVal;   // read before closeReply() clears rpProg
  closeReply();
  toast('✓ Reply sent · '+n+' item(s) deducted from Lot '+lot);
  refreshInventoryViews();renderOpsTasks();renderOpsHistory();renderTimeline();
  renderProgCheck();renderReady();renderLabour();renderHub();}

// ---- programme sync: activation records travel in their own payload key, so an
//      Apps Script that predates v2.5 cannot silently swallow them ----
let progWarned=false;
async function pushPrograms(){
  const batch=PROGRAMS.filter(p=>!p.synced);
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({programs:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j.programs){for(const p of batch){p.synced=true;if(db)await put('programs',p);}badge();return true;}
    if(!progWarned){progWarned=true;
      toast('Programme kept on this phone — update the Apps Script to send it to the workers',1);}
    return false;
  }catch(e){return false;}}
async function mergePrograms(rows){
  let changed=false, fresh=0;
  for(const raw of rows){
    const u=String(raw.uuid||'').trim(); if(!u)continue;
    let lines=raw.lines;
    if(typeof lines==='string'){try{lines=JSON.parse(lines);}catch(e){lines=[];}}
    if(!Array.isArray(lines))continue;
    const sp={uuid:u,phaseId:String(raw.phaseId||''),month:String(raw.month||''),set:String(raw.set||''),
      kind:String(raw.kind||'FOLIAR'),mode:String(raw.mode||'SPRAY'),header:String(raw.header||''),
      basis:String(raw.basis||'PER_1000L'),plan:String(raw.plan||''),scope:String(raw.scope||'ALL'),
      trees:+raw.trees||0,litresPerTree:+raw.litresPerTree||0,tanks:+raw.tanks||0,
      lines:lines,projCost:+raw.projCost||0,by:String(raw.by||''),byId:String(raw.byId||''),
      at:String(raw.at||''),status:String(raw.status||'ACTIVE').toUpperCase(),synced:true};
    const lc=PROGRAMS.find(x=>x.uuid===u);
    if(!lc){PROGRAMS.push(sp);if(db)await put('programs',sp);changed=true;
      if(sp.status==='ACTIVE')fresh++;continue;}
    if(!lc.synced)continue;                                  // our unpushed edit wins
    if(lc.status===sp.status)continue;
    Object.assign(lc,sp);if(db)await put('programs',lc);changed=true;}
  if(changed){renderOpsTasks();renderTimeline();renderProgCheck();renderTimeline();renderHub();badge();}
  return fresh;}
function progUnsynced(){return PROGRAMS.filter(p=>!p.synced).length;}

// ================= v2.6 PHASE CLOCK · WEATHER · AI BLUEPRINT · GENERAL TASKS · LABOUR =================
let TASKS=[], BLUEPRINTS=[], WEATHER='SUNNY';

// ---- 1. variable phase duration -------------------------------------------------
// A phase is NOT a calendar month. The Owner sets a start date and a duration in
// days (1 week for flowering, 3 years for immature vegetative), and every screen
// counts down from it. Nothing auto-closes — the Owner still decides — but an
// overdue phase says so in red on the worker's task card and the Owner's list.
function dayStart(d){const x=new Date(d);x.setHours(0,0,0,0);return x;}
function parseDay(str){ if(!str)return null;
  const m=String(str).slice(0,10).split('-'); if(m.length!==3)return null;
  const d=new Date(+m[0],+m[1]-1,+m[2]); return isNaN(d)?null:dayStart(d);}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return dayStart(x);}
function ymd(d){const p=n=>String(n).padStart(2,'0');
  return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}
function durLabel(days){
  days=Math.max(1,Math.round(+days||0));
  if(days>=365&&days%365===0)return (days/365)+' year'+(days/365>1?'s':'');
  if(days>=30&&days%30===0) return (days/30)+' month'+(days/30>1?'s':'');
  if(days>=7&&days%7===0)   return (days/7)+' week'+(days/7>1?'s':'');
  return days+' day'+(days>1?'s':'');}
// the live counter every screen shares
function phaseClock(rec){
  const start=parseDay(rec.startDate)||parseDay(rec.at)||dayStart(new Date());
  const dur=Math.max(1,Math.round(+rec.durDays||30));
  const end=addDays(start,dur), today=dayStart(new Date());
  const left=Math.round((end-today)/86400000);
  const gone=Math.max(0,Math.min(dur,Math.round((today-start)/86400000)));
  const notYet=today<start;
  return {start:start,end:end,dur:dur,left:left,gone:gone,notYet:notYet,
    pct:Math.max(0,Math.min(100,Math.round(gone/dur*100))),
    over:left<0, soon:left>=0&&left<=3,
    text: notYet ? ('starts in '+Math.round((start-today)/86400000)+' day(s)')
        : (left<0 ? (Math.abs(left)+' day(s) OVERDUE')
        : (left===0?'last day':left+' day(s) remaining'))};}
function clockHTML(rec){
  const c=phaseClock(rec), cls=c.over?'over':(c.soon?'warn':'');
  return '<div class="clock"><span class="clockpill '+cls+'">'+esc(c.text)+'</span>'+
    '<span class="clockbar"><i class="'+cls+'" style="width:'+c.pct+'%"></i></span>'+
    '<span class="exphint">'+durLabel(c.dur)+'</span></div>';}

// ---- 2. weather mode + rain-fastness ---------------------------------------------
// Rain-fastness is decided by ACTIVE INGREDIENT, never by brand. Anything the
// database cannot classify is marked UNKNOWN and shown to the Owner as a question —
// the app never guesses chemistry it does not hold.
// the programme sheet often names an ingredient the store card has not confirmed —
// prefer the sheet's word over "(confirm — see label)" rather than inventing one
function aiFor(pid,fallback){
  const p=prodById(pid); const inv=p?String(p.active_ingredient||''):'';
  if(inv&&inv.indexOf('(confirm')<0)return inv;
  if(fallback&&String(fallback).trim())return String(fallback).trim()+' (per programme sheet)';
  return inv||'';}
function rainClass(aiText){
  const t=String(aiText||'').toLowerCase();
  if(!t||t.indexOf('(confirm')===0)return {k:'UNKNOWN',why:'the store card has no confirmed active ingredient'};
  for(const [kw,why] of SYSTEMIC_AI) if(t.indexOf(kw)>=0)return {k:'SYSTEMIC',why:why};
  for(const [kw,why] of CONTACT_AI)  if(t.indexOf(kw)>=0)return {k:'CONTACT',why:why};
  return {k:'UNKNOWN',why:'not in the rain-fastness table — confirm with the label'};}
function aiTagHTML(cls){
  const m={SYSTEMIC:['sys','SYSTEMIC'],CONTACT:['con','WASHES OFF'],UNKNOWN:['unk','UNCONFIRMED']};
  const x=m[cls.k]||m.UNKNOWN; return '<span class="aitag '+x[0]+'">'+x[1]+'</span>';}
// a phase where fruit is on the tree — the case the brief calls out
function isFruitPhase(ph){
  const t=((ph.header||'')+' '+(ph.set||'')+' '+(ph.mode||'')).toLowerCase();
  return t.indexOf('fruit')>=0||ph.mode==='SPRAY';}
// systemic stand-ins that are actually IN THE STORE, ranked by what is on hand
function systemicAlternatives(cat){
  return INVENTORY_RECON.filter(p=>{
    if(cat&&p.cat!==cat)return false;
    return rainClass(p.active_ingredient).k==='SYSTEMIC'&&onHand(p)>0;})
    .sort((a,b)=>onHand(b)-onHand(a)).slice(0,3);}
function weatherAdvice(ph,lines){
  if(WEATHER!=='RAINY')return null;
  if(ph&&(ph.mode==='SOIL'||ph.mode==='DRENCH'))
    return {ok:true,head:'Rainy mode — soil applied, no wash-off risk',rows:[]};
  const rows=[];
  (lines||[]).forEach(l=>{
    const ai=aiFor(l.pid,l.ai), cls=rainClass(ai), p=prodById(l.pid);
    if(cls.k==='SYSTEMIC')return;
    rows.push({pname:(p?p.name:l.raw)||l.pname||'—',ai:ai,cls:cls,
      alts:cls.k==='CONTACT'?systemicAlternatives(p?p.cat:''):[]});});
  return {ok:rows.length===0,
    head:rows.length?('Rainy mode — '+rows.length+' line'+(rows.length>1?'s':'')+' may wash off before it works')
                    :'Rainy mode — every line in this set stays on the tree',
    rows:rows};}
function advHTML(adv){
  if(!adv)return '';
  let h='<div class="advbox"><div class="ah">🌧️ '+esc(adv.head)+'</div>';
  if(!adv.rows.length)h+='<div class="small">Nothing to swap. Spray as written.</div>';
  adv.rows.forEach(r=>{
    h+='<div class="swap"><span><b>'+esc(r.pname)+'</b> '+aiTagHTML(r.cls)+
       '<br><span class="exphint">'+esc(r.ai||'—')+' — '+esc(r.cls.why)+'</span></span></div>';
    if(r.alts.length)h+='<div class="small" style="padding-left:8px">↳ systemic stand-in on hand: '+
       r.alts.map(a=>'<b>'+esc(a.name)+'</b> <span class="exphint">('+esc(a.active_ingredient)+', '+nf(onHand(a))+' '+esc(a.unit)+')</span>').join(' · ')+'</div>';
    else if(r.cls.k==='CONTACT')h+='<div class="small" style="padding-left:8px">↳ no systemic stand-in of this type is in the store — order one or wait for a dry window.</div>';});
  h+='<div class="small" style="margin-top:6px">This is advice, not an automatic change. The set is applied exactly as the Owner activates it.</div></div>';
  return h;}
async function setWeather(w){
  WEATHER=w; if(db)await put('kv',{k:'weather',v:w});
  renderWeather();renderTimeline();renderOpsTasks();if(pmPhase)pmCalc();
  toast(w==='RAINY'?'🌧️ Rainy mode on — spray lines are now checked for wash-off':'☀️ Sunny mode');}
function renderWeather(){
  if(!$('wxbtns'))return;
  ['SUNNY','RAINY'].forEach(k=>$('wx-'+k).classList.toggle('on',k===WEATHER));
  const live=activePrograms();
  let note='';
  if(WEATHER==='RAINY'){
    const risky=live.filter(r=>{const a=weatherAdvice(r,r.lines);return a&&!a.ok;});
    note=live.length
      ?(risky.length?('⚠ '+risky.length+' active phase'+(risky.length>1?'s':'')+' contain a line that washes off — open PHASES to see the stand-ins.')
                    :'✓ Every active phase holds through rain.')
      :'No phase is active. The check runs the moment you activate one.';
  } else note='Spray as the programme states. Switch to Rainy when the sky turns and the app re-checks every active phase.';
  $('wxnote').innerHTML=esc(note);}

// ---- 3. programme blueprint, built from the ACTIVE INGREDIENT out ------------------
let bpLines=[], bpBasisVal='PER_1000L';
function bpPool(){const cats=BP_CATS[$('bp-kind').value]||[];
  return INVENTORY_RECON.filter(p=>cats.indexOf(p.cat)>=0);}
function bpAIs(){
  const seen={},out=[];
  bpPool().forEach(p=>{const ai=String(p.active_ingredient||'').trim()||'(not recorded)';
    if(!seen[ai]){seen[ai]={ai:ai,n:0};out.push(seen[ai]);} seen[ai].n++;});
  const unknown=x=>(x.ai.indexOf('(confirm')===0||x.ai==='(not recorded)')?1:0;
  return out.sort((a,b)=>(unknown(a)-unknown(b))||a.ai.localeCompare(b.ai));}
// v2.8 — the same AI-first builder now CREATES a set and MODIFIES one the Owner built.
function openBlueprint(u){
  const rec=u?BLUEPRINTS.find(b=>b.uuid===u):null;
  if(rec){ $('bp-title').textContent='Edit programme set';
    bpFrom(rec,''); bpEditUuid=rec.uuid; return; }
  bpEditUuid=null;
  bpLines=[];bpBasisVal='PER_1000L';
  $('bp-title').textContent='New programme set';
  $('bp-name').value='';$('bp-dose').value='';$('bp-err').textContent='';
  $('bp-kind').value='PND';
  ['PER_1000L','PER_TREE'].forEach(k=>$('bb-'+k).classList.toggle('on',k===bpBasisVal));
  bpKind();renderBpLines();
  $('bpmodal').classList.remove('hidden');}
function closeBlueprint(){$('bpmodal').classList.add('hidden');bpLines=[];bpEditUuid=null;}
function bpBasis(b){bpBasisVal=b;['PER_1000L','PER_TREE'].forEach(k=>$('bb-'+k).classList.toggle('on',k===b));
  $('bp-unitlbl').textContent=(b==='PER_1000L')?'per 1000 L tank':'per tree';}
function bpKind(){
  const ais=bpAIs();
  $('bp-ai').innerHTML=ais.map(a=>'<option value="'+esc(a.ai)+'">'+esc(a.ai)+' ('+a.n+' product'+(a.n>1?'s':'')+')</option>').join('')
    ||'<option value="">no product in this category</option>';
  if($('bp-kind').value==='MANURE')bpBasis('PER_TREE'); else bpBasis('PER_1000L');
  bpAI();}
function bpAI(){
  const ai=$('bp-ai').value;
  const list=bpPool().filter(p=>String(p.active_ingredient||'').trim()===ai);
  const cls=rainClass(ai);
  $('bp-aihint').innerHTML=aiTagHTML(cls)+esc(cls.why)+
    (WEATHER==='RAINY'&&cls.k==='CONTACT'?' <b style="color:#b3261e">— rainy mode is on</b>':'');
  $('bp-prod').innerHTML=list.map(p=>'<option value="'+p.id+'">'+esc(p.name)+' — '+nf(onHand(p))+' '+esc(p.unit)+' on hand</option>').join('')
    ||'<option value="">—</option>';
  bpProd();}
function bpProd(){const p=prodById(+$('bp-prod').value);
  $('bp-unitlbl').textContent=(bpBasisVal==='PER_1000L'?'per 1000 L tank':'per tree')+(p?(' · '+p.unit):'');}
function bpAdd(){
  const err=$('bp-err');err.textContent='';
  const p=prodById(+$('bp-prod').value);
  const dose=+$('bp-dose').value;
  if(!p){err.textContent='Pick a product.';return;}
  if(!(dose>0)){err.textContent='Enter the dose.';return;}
  if(bpLines.some(l=>l.pid===p.id)){err.textContent=p.name+' is already in this set.';return;}
  bpLines.push({pid:p.id,pname:p.name,ai:String(p.active_ingredient||''),unit:p.unit,qty:dose});
  $('bp-dose').value='';renderBpLines();}
function bpDrop(i){bpLines.splice(i,1);renderBpLines();}
function renderBpLines(){
  $('bp-lines').innerHTML=bpLines.length?bpLines.map((l,i)=>{
    const cls=rainClass(l.ai);
    return '<div class="bline"><span><b>'+esc(l.pname)+'</b> '+aiTagHTML(cls)+
      '<br><span class="exphint">'+esc(l.ai||'—')+'</span></span>'+
      '<span><b>'+nf(l.qty)+' '+esc(l.unit)+'</b> <span class="x" onclick="bpDrop('+i+')">✕</span></span></div>';}).join('')
    :'<div class="small">No line added yet.</div>';}
async function bpSave(){
  const err=$('bp-err');err.textContent='';
  const name=$('bp-name').value.trim();
  if(!name){err.textContent='Give the set a name.';return;}
  if(!bpLines.length){err.textContent='Add at least one line.';return;}
  const kind=$('bp-kind').value;
  const old=bpEditUuid?BLUEPRINTS.find(b=>b.uuid===bpEditUuid):null;
  const rec={uuid:old?old.uuid:uuid(),id:old?old.id:('BP|'+uuid().slice(0,8)),month:'My sets',set:name,
    kind:(kind==='MANURE'?'FERT':'FOLIAR'),bpKind:kind,
    mode:(kind==='MANURE'?'SOIL':'SPRAY'),header:BP_LABEL[kind]+' — built by active ingredient',
    basis:bpBasisVal,litresPerTree:old?old.litresPerTree:null,plan:old?old.plan:'',lines:bpLines.slice(),
    by:CFG.worker,at:now(),custom:true};
  if(old)BLUEPRINTS[BLUEPRINTS.indexOf(old)]=rec; else BLUEPRINTS.push(rec);
  if(db)await put('blueprints',rec);
  const label=rec.set, edited=!!old;
  bpEditUuid=null;
  closeBlueprint();
  toast('✓ '+label+(edited?' updated':' saved — it is now under “My sets” in the timeline'));
  tlMonth='My sets';renderTimeline();}
async function bpDelete(u){
  const r=BLUEPRINTS.find(x=>x.uuid===u); if(!r)return;
  if(PROGRAMS.some(p=>p.phaseId===r.id&&p.status==='ACTIVE')){toast('Close the active phase first',1);return;}
  if(!confirm('Delete "'+r.set+'"?'))return;
  BLUEPRINTS=BLUEPRINTS.filter(x=>x.uuid!==u); if(db)await del('blueprints',u);
  renderTimeline();renderTimeline();toast('Set deleted');}
function renderBlueprints(){
  const box=$('bplist'); if(!box)return;
  box.innerHTML=BLUEPRINTS.length?BLUEPRINTS.map(r=>
    '<div class="crow"><div class="ch"><div><div class="ctree">'+esc(r.set)+'</div>'+
    '<div class="cwho">'+esc(BP_LABEL[r.bpKind]||r.bpKind)+' · '+(r.basis==='PER_1000L'?'per 1000 L':'per tree')+
    '<br>built by '+esc(r.by)+' · '+esc(r.at)+'</div></div>'+
    '<span class="cstat p">MY SET</span></div>'+
    '<div class="cchange">'+r.lines.map(l=>esc(l.pname)+' <b>'+nf(l.qty)+' '+esc(l.unit)+'</b>').join(' · ')+'</div>'+
    '<div class="cacts"><button class="ok" onclick="openProgModal(\''+esc(r.id)+'\')">ACTIVATE PHASE</button>'+
    '<button class="no" onclick="bpDelete(\''+r.uuid+'\')">DELETE</button></div></div>').join('')
    :'<div class="small">No set built yet. Tap the button below — you choose the active ingredient, not the brand.</div>';}

// ---- 4. general field tasks (no chemical) ------------------------------------------
// Each job declares what a completion reply must carry. The reply form is generated
// from this table, so a worker cannot file a tying job without a count per tree.
function taskById(u){return TASKS.find(t=>t.uuid===u)||null;}
function activeTasks(){return TASKS.filter(t=>t.status==='OPEN');}
function taskUnsynced(){return TASKS.filter(t=>!t.synced).length;}
function tasksDoneLots(tu){return LOT_KEYS.filter(L=>EVENTS.some(e=>e.type==='TASK_DONE'&&e.taskId===tu&&e.lot===L));}
function myGeneralTasks(){
  return activeTasks().filter(t=>{
    const need=t.scope==='ALL'?LOT_KEYS:[t.scope];
    const done=tasksDoneLots(t.uuid);
    return need.some(L=>done.indexOf(L)<0);});}
let tfScopeVal='ALL';
function openTaskForm(){
  tfScopeVal='ALL';
  $('tf-kind').innerHTML=Object.keys(GEN_TASKS).map(k=>'<option value="'+k+'">'+esc(GEN_TASKS[k].label)+'</option>').join('');
  ['ALL','A','B','C'].forEach(k=>$('ts-'+k).classList.toggle('on',k==='ALL'));
  $('tf-start').value=ymd(dayStart(new Date()));
  $('tf-days').value=7;$('tf-note').value='';$('tf-err').textContent='';
  tfKind();
  $('taskmodal').classList.remove('hidden');}
function closeTaskForm(){$('taskmodal').classList.add('hidden');}
function tfScope(s){tfScopeVal=s;['ALL','A','B','C'].forEach(k=>$('ts-'+k).classList.toggle('on',k===s));}
function tfKind(){const g=GEN_TASKS[$('tf-kind').value];
  $('tf-need').textContent=g?GEN_NEED_TEXT[g.need]:'';}
async function saveTask(){
  const err=$('tf-err');err.textContent='';
  const k=$('tf-kind').value, g=GEN_TASKS[k];
  const days=Math.round(+$('tf-days').value||0);
  const start=parseDay($('tf-start').value);
  if(!g){err.textContent='Pick a job.';return;}
  if(!start){err.textContent='Pick the start date.';return;}
  if(!(days>0)){err.textContent='Enter how many days the job has.';return;}
  const rec={uuid:uuid(),kind:k,kindLabel:g.label,need:g.need,countLabel:g.countLabel,unit:g.unit,
    scope:tfScopeVal,trees:treesInScope(tfScopeVal),startDate:ymd(start),durDays:days,
    note:$('tf-note').value.trim(),by:CFG.worker,at:now(),status:'OPEN',synced:false};
  TASKS.push(rec); if(db)await put('tasks',rec);
  const label=g.label;
  closeTaskForm();badge();
  toast('✓ '+label+' assigned to the workers');
  renderAssign();renderGeneralTasks();renderHub();}
async function closeTask(u){
  const t=taskById(u); if(!t)return;
  if(!confirm('Close "'+t.kindLabel+'"?\nWorkers will stop seeing it.'))return;
  t.status='CLOSED';t.synced=false; if(db)await put('tasks',t);
  badge();renderAssign();renderGeneralTasks();renderHub();toast('Task closed');}
function renderAssign(){
  const box=$('assignlist'); if(!box)return;
  const list=TASKS.slice().sort((a,b)=>String(b.at).localeCompare(String(a.at))).slice(0,20);
  box.innerHTML=list.length?list.map(t=>{
    const done=tasksDoneLots(t.uuid);
    const logs=EVENTS.filter(e=>e.type==='TASK_DONE'&&e.taskId===t.uuid);
    const cnt=logs.reduce((s,e)=>s+(+e.count||0),0);
    const mh=logs.reduce((s,e)=>s+((+e.hours||0)*(+e.crew||0)),0);
    return '<div class="crow"><div class="ch"><div><div class="ctree">'+esc(t.kindLabel)+
      (t.status==='OPEN'?' <span class="cstat a">OPEN</span>':' <span class="cstat r">CLOSED</span>')+'</div>'+
      '<div class="cwho">'+(t.scope==='ALL'?'whole farm':'Lot '+esc(t.scope))+' · '+t.trees+' trees'+
      '<br>set by '+esc(t.by)+' · '+esc(t.at)+'</div></div></div>'+
      (t.status==='OPEN'?clockHTML(t):'')+
      (t.note?'<div class="cnote">“'+esc(t.note)+'”</div>':'')+
      '<div class="cchange">Reported so far: <b>'+nf(cnt)+' '+esc(t.unit)+'</b> · <b>'+nf(mh)+'</b> man-hours'+
      (done.length?(' · lots done: '+done.map(L=>'<span class="lotchip">LOT '+L+'</span>').join('')):'')+'</div>'+
      (t.status==='OPEN'?'<div class="cacts"><button class="no" onclick="closeTask(\''+t.uuid+'\')">CLOSE TASK</button></div>':'')+
      '</div>';}).join('')
    :'<div class="small">No general task assigned yet.</div>';}
function renderGeneralTasks(){
  const box=$('genlist'); if(!box)return;
  const t=myGeneralTasks();
  box.innerHTML=t.length?t.map(x=>{
    const done=tasksDoneLots(x.uuid);
    const need=(x.scope==='ALL'?LOT_KEYS:[x.scope]).filter(L=>done.indexOf(L)<0);
    return '<div class="crow"><div class="ch"><div><div class="ctree">'+esc(x.kindLabel)+'</div>'+
      '<div class="cwho">'+(x.scope==='ALL'?'whole farm':'Lot '+esc(x.scope))+' · '+x.trees+' trees'+
      '<br>set by '+esc(x.by)+' · '+esc(x.at)+'</div></div><span class="cstat p">TO DO</span></div>'+
      clockHTML(x)+
      (x.note?'<div class="cnote">“'+esc(x.note)+'”</div>':'')+
      '<div class="cwho">Still to report: '+need.map(L=>'<span class="lotchip">LOT '+L+'</span>').join('')+
      (done.length?(' · done: '+done.map(L=>'<span class="lotchip">LOT '+L+'</span>').join('')):'')+'</div>'+
      '<div class="cacts"><button class="ok" onclick="openGeneral(\''+x.uuid+'\')">✓ REPORT WORK DONE</button></div></div>';}).join('')
    :'<div class="alertnone">'+esc(tr('op_nogen'))+'</div>';}

// ---- 5. worker reply for a general task: structure enforced per job type ------------
let grTask=null, grLotVal='', grRows=[];
function grAllowAll(){return grTask&&grTask.scope==='ALL';}
/** Lots this general task still needs a report for. */
function grLotsLeft(){
  if(!grTask)return [];
  const scope=grTask.scope==='ALL'?LOT_KEYS.slice():[grTask.scope];
  const done=tasksDoneLots(grTask.uuid);
  return scope.filter(L=>done.indexOf(L)<0);}

function openGeneral(u){
  const t=taskById(u); if(!t){toast('Task not found',1);return;}
  grTask=t; grLotVal=''; grRows=[];
  $('gr-task').textContent=t.kindLabel;
  $('gr-mode').innerHTML=(t.scope==='ALL'?tr('t14_lotall'):'Lot '+esc(t.scope))+'<br>'+phaseClock(t).text;
  $('gr-crew').value=(LAST_CREW&&LAST_CREW.crew)||'';
  $('gr-hours').value=(LAST_CREW&&LAST_CREW.hours)||'';
  $('gr-err').textContent='';
  // v3.14 — ONE filing covers every lot. A whole-farm job used to be reported three
  // times, each asking for crew and hours again, so 3 men x 6 h became 54 man-hours.
  grRows=grLotsLeft().map(L=>({lot:L,n:'',trees:[]}));
  renderGrRows();
  $('genmodal').classList.remove('hidden');}
function closeGeneral(){$('genmodal').classList.add('hidden');grTask=null;grRows=[];}
function grSetN(i,v){grRows[i].n=v;grCalc();}
function grFill(i){
  const r=grRows[i]; r.n=treesInLot(r.lot).length; renderGrRows();}
function grClear(i){grRows[i].n='';renderGrRows();}
function grActive(){return grRows.filter(r=>+r.n>0);}
function grTotal(){return grRows.reduce((s,r)=>s+(+r.n||0),0);}

function renderGrRows(){
  if(!grTask)return;
  const perTree=grTask.need==='TREE_COUNT';
  $('gr-hint').textContent=tr('t14_genall');
  $('gr-rows').innerHTML=grRows.map((r,i)=>{
    const total=treesInLot(r.lot).length;
    const n=+r.n||0;
    return '<div class="lotrow'+(n>0?' active':'')+'">'+
      '<div class="lrhead"><span class="lrname">LOT '+esc(r.lot)+
        '<span class="lrsub">'+total+' '+esc(tr('t14_trees'))+'</span></span>'+
        (n>0?'<span class="lrtag doing">'+esc(tr('t14_finished'))+'</span>'
            :'<span class="lrtag todo">'+esc(tr('t14_nottouched'))+'</span>')+'</div>'+
      '<div class="lrbody">'+
        '<div class="lrlbl">'+esc(grTask.countLabel)+'</div>'+
        '<input class="tree" type="number" min="0" step="1" inputmode="numeric" placeholder="0" '+
          'value="'+esc(r.n)+'" oninput="grSetN('+i+',this.value)">'+
        '<div class="quick">'+
          '<div onclick="grFill('+i+')">'+esc(tr('t14_all'))+' '+total+'</div>'+
          '<div onclick="grClear('+i+')">'+esc(tr('t14_none'))+'</div>'+
        '</div>'+
        (n>0?'':'<div class="lrskip">'+esc(tr('t14_empty'))+'</div>')+
      '</div></div>';}).join('')
    ||'<div class="alertnone">—</div>';
  grCalc();}

function grCalc(){
  if(!grTask)return;
  const act=grActive(), tot=grTotal();
  const crew=+$('gr-crew').value||0, hrs=+$('gr-hours').value||0;
  const shares=splitExact(crew*hrs,act.map(r=>+r.n||0));
  $('gr-total').innerHTML=tot
    ?('<b>'+nf(tot)+'</b> '+esc(grTask.countLabel)+' · '+act.length+' lot'+
      '<span class="sub">'+act.map(r=>'Lot '+r.lot+' '+nf(+r.n||0)).join(' · ')+'</span>')
    :esc(tr('t14_keytrees'));
  $('gr-labour').innerHTML=(crew&&hrs&&act.length)
    ?('<b>'+nf(crew*hrs)+'</b> '+esc(tr('t14_mhonce'))+'<br>'+
      act.map((r,i)=>'Lot '+r.lot+' '+nf(shares[i])).join(' · '))
    :esc(tr('w13_keycrew'));}

let genSaving=false;
async function submitGeneral(){
  const err=$('gr-err');err.textContent='';
  if(!grTask||genSaving)return;
  const act=grActive();
  if(!act.length){err.textContent=tr('t14_keytrees');return;}
  const crew=Math.round(+$('gr-crew').value||0), hours=+$('gr-hours').value||0;
  if(!(crew>0)){err.textContent='Enter how many workers were on the job.';return;}
  if(!(hours>0)){err.textContent='Enter the hours worked per worker.';return;}
  const dup=act.find(r=>tasksDoneLots(grTask.uuid).indexOf(r.lot)>=0);
  if(dup&&!confirm('Lot '+dup.lot+' was already reported for this task.\nSend another report anyway?'))return;
  genSaving=true;
  const stamp=now(), rid=uuid(), kl=grTask.kindLabel;
  // ONE row per lot — never a single row carrying lot 'ALL'. tasksDoneLots(), the
  // Owner's lot chips, the month labour matrix and the per-lot costing all filter on
  // e.lot===L, so a fourth value in that column would break five readers at once.
  const shares=splitExact(crew*hours,act.map(r=>+r.n||0));
  try{
    for(let i=0;i<act.length;i++){
      const r=act[i];
      await persistEvent({uuid:uuid(),type:'TASK_DONE',dt:stamp,taskId:grTask.uuid,
        kind:grTask.kind,kindLabel:grTask.kindLabel,need:grTask.need,
        lot:r.lot,count:+r.n||0,countLabel:grTask.countLabel,unit:grTask.unit,
        trees:+r.n||0,
        reportId:rid, allLots:act.length>1, lotsInReport:act.length,
        // true crew and hours on every row; only the man-hour SHARE differs
        crew:crew,hours:hours,manHours:shares[i],
        worker:CFG.worker,device:CFG.device,synced:false});}
  } finally { genSaving=false; }
  LAST_CREW={crew:crew,hours:hours}; if(db)await put('kv',{k:'lastcrew',v:LAST_CREW});
  const tot=grTotal(), lots=act.map(r=>r.lot).join(', ');
  closeGeneral();
  toast('✓ '+kl+' · '+nf(tot)+' · Lot '+lots);
  renderGeneralTasks();renderAssign();renderLabour();renderHub();badge();}

// ---- 6. labour roll-up ---------------------------------------------------------------
function labourRows(){
  const out=[];
  // v3.14 — mhOf() reads the SHARE stored on the row when one completion covered several
  // lots, and falls back to crew x hours for every row written before v3.14. Both labour
  // readers go through here, so this one change fixes the month matrix too.
  EVENTS.filter(e=>e.type==='TASK_DONE').forEach(e=>out.push({dt:e.dt,what:e.kindLabel,lot:e.lot,
    crew:+e.crew||0,hours:+e.hours||0,mh:mhOf(e),worker:e.worker}));
  const seen={};
  EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.progId&&e.hours).forEach(e=>{
    // one filing can now cover several lots, so the key must include the lot or the
    // second lot's man-hours are dropped on the floor
    const k=(e.replyId||(e.progId+'|'+e.dt))+'|'+e.lot; if(seen[k])return; seen[k]=1;
    out.push({dt:e.dt,what:e.progSet||'programme',lot:e.lot,crew:+e.crew||0,hours:+e.hours||0,
      mh:mhOf(e),worker:e.worker});});
  return out.sort((a,b)=>String(b.dt).localeCompare(String(a.dt)));}
function labourByMonth(){
  const m={};
  labourRows().forEach(r=>{const k=String(r.dt).slice(0,7);
    if(!m[k])m[k]={k:k,mh:0,n:0};m[k].mh+=r.mh;m[k].n++;});
  return Object.values(m).sort((a,b)=>b.k.localeCompare(a.k));}
/** v3.6 — the rate that turns man-hours into the labour column of the monthly matrix.
 *  Same honesty rule as the basket tare: it ships as a placeholder and SAYS so until the
 *  Owner confirms the real figure. */
function labourRateHtml(){
  const own=canSetPrice();
  return '<div class="sec">💵 Labour cost rate</div>'+
    (LABOUR_RATE_OK?'':'<div class="critbox">This rate has NOT been confirmed. '+rm(LABOUR_RATE)+
      ' per man-hour is a placeholder — every labour and margin figure in the month ledger is '+
      'indicative until you set the real one.</div>')+
    (own?('<label>RM per man-hour</label>'+
      '<input type="number" id="lr-rate" min="0" step="0.01" inputmode="decimal" value="'+
        (+LABOUR_RATE||0).toFixed(2)+'">'+
      '<label style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:12.5px">'+
        '<input type="checkbox" id="lr-ok" '+(LABOUR_RATE_OK?'checked':'')+' style="width:auto">'+
        'This is the farm’s real rate</label>'+
      '<button class="bigbtn ghost" style="margin-top:7px;padding:12px;font-size:13.5px" '+
        'onclick="saveLabourRate()">✓ SAVE LABOUR RATE</button>')
      :('<div class="cnote">Rate in use: <b>'+rm(LABOUR_RATE)+'</b> per man-hour'+
        (LABOUR_RATE_OK?'':' (placeholder)')+'. Only the Owner can change it.</div>'))+
    '<div class="exphint" style="margin-top:6px">Man-hours come from the crew size and hours on every '+
      'completion reply. Multiply them by this rate and you have the labour column of the month ledger, '+
      'allocated to the lot the job was done on.</div>';}
async function saveLabourRate(){
  if(!canSetPrice()){toast('Only the Owner can set the labour rate',1);return;}
  const el=$('lr-rate'); const v=el?el.value:'';
  if(v===''||isNaN(+v)||+v<0){toast('The rate must be a figure of zero or more',1);return;}
  LABOUR_RATE=+(+v).toFixed(2);
  LABOUR_RATE_OK=!!($('lr-ok')&&$('lr-ok').checked);
  await persistLabourRate();
  renderLabour(); renderMatrix();
  toast('✓ Labour rate saved'+(LABOUR_RATE_OK?'':' — still marked unconfirmed'));}

function renderLabour(){
  const box=$('labourbox'); if(!box)return;
  const rows=labourRows(), months=labourByMonth();
  if(!rows.length){box.innerHTML=labourRateHtml()+
    '<div class="small" style="margin-top:10px">No labour logged yet. Every completion reply now asks for the crew size and hours.</div>';return;}
  box.innerHTML=labourRateHtml()+
    '<div class="sec" style="margin-top:12px">Man-hours by month</div>'+
    '<div class="tblwrap"><table class="tbl">'+
    '<tr><th>Month</th><th class="num">Reports</th><th class="num">Man-hours</th><th class="num">Cost</th></tr>'+
    months.map(m=>'<tr><td><b>'+esc(m.k)+'</b></td><td class="num">'+m.n+'</td><td class="num"><b>'+nf(m.mh)+
      '</b></td><td class="num">'+(SHOW_VALUES?rm(m.mh*LABOUR_RATE):'—')+'</td></tr>').join('')+
    '</table></div><div class="sec" style="margin-top:10px">Latest entries</div>'+
    rows.slice(0,12).map(r=>'<div class="lrow"><span><b>'+esc(r.what)+'</b> · Lot '+esc(r.lot||'—')+
      '<br><span class="small">'+esc(r.dt)+' · '+esc(r.worker||'')+' · '+r.crew+' × '+nf(r.hours)+' h</span></span>'+
      '<span style="font-weight:800">'+nf(r.mh)+' man-h</span></div>').join('');}

// ---- 7. sync: assignments and completions each get their own payload key ------------
let taskWarned=false, tlogWarned=false;
async function pushTasks(){
  const batch=TASKS.filter(t=>!t.synced);
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  const stamp=batch.map(t=>t.uuid+'|'+t.status);
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({tasks:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j.tasks){
      for(let i=0;i<batch.length;i++){const t=batch[i];
        if(t.uuid+'|'+t.status!==stamp[i])continue;      // edited while the upload was in flight
        t.synced=true;if(db)await put('tasks',t);}
      badge();return true;}
    if(!taskWarned){taskWarned=true;
      toast('Task list kept on this phone — update the Apps Script to send it to the workers',1);}
    return false;
  }catch(e){return false;}}
async function pushTaskLogs(){
  const batch=EVENTS.filter(e=>e.type==='TASK_DONE'&&!e.synced);
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({tasklogs:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j.tasklogs){for(const e of batch){e.synced=true;e.syncedAt=now();if(db)await put('events',e);}badge();return true;}
    if(!tlogWarned){tlogWarned=true;
      toast('Work reports kept on this phone — update the Apps Script to upload them',1);}
    return false;
  }catch(e){return false;}}
async function mergeTasks(rows){
  let changed=false, fresh=0;
  for(const raw of rows){
    const u=String(raw.uuid||'').trim(); if(!u)continue;
    let detail=raw.detail;
    const st={uuid:u,kind:String(raw.kind||''),kindLabel:String(raw.kindLabel||raw.kind||''),
      need:String(raw.need||'TREE_COUNT'),countLabel:String(raw.countLabel||'items'),unit:String(raw.unit||'items'),
      scope:String(raw.scope||'ALL'),trees:+raw.trees||0,startDate:String(raw.startDate||'').slice(0,10),
      durDays:+raw.durDays||30,note:String(raw.note||''),by:String(raw.by||''),at:String(raw.at||''),
      status:String(raw.status||'OPEN').toUpperCase(),synced:true};
    const lc=TASKS.find(x=>x.uuid===u);
    if(!lc){TASKS.push(st);if(db)await put('tasks',st);changed=true;
      if(st.status==='OPEN')fresh++;continue;}
    if(!lc.synced)continue;                       // our unpushed edit wins
    if(lc.status===st.status)continue;
    Object.assign(lc,st);if(db)await put('tasks',lc);changed=true;}
  if(changed){renderGeneralTasks();renderAssign();renderHub();badge();}
  return fresh;}


// ================= v2.7 RAINFALL · PROGRAMME ORGANISER · COMBO SET · MARK DONE =================
// Four additions, all Owner-facing except the last:
//   1. a manual rain-gauge log, because the farm reads a physical cage every morning
//   2. a sort selector over the programme list — by growth phase, by month, or by
//      how hard each set draws down the store
//   3. the Excel combo-set grid: five fixed blocks, calibrated to a 1000 L pump tank
//   4. a one-tap MARK DONE on the worker's card that deducts the planned mix
let RAINFALL=[], LAST_CREW={crew:0,hours:0};

// ---- 1. rainfall -------------------------------------------------------------------
// One reading per date. Re-saving a date corrects that day rather than adding a second
// row, which is what actually happens when someone mis-keys a number in the morning.
function rainOn(d){return RAINFALL.find(r=>r.date===d)||null;}
function rainSorted(){return RAINFALL.slice().sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0);}
function rainUnsynced(){return RAINFALL.filter(r=>!r.synced).length;}
function rainSum(fromDate){return RAINFALL.filter(r=>r.date>=fromDate).reduce((s,r)=>s+(+r.mm||0),0);}
function rainMonth(ym){return RAINFALL.filter(r=>r.date.slice(0,7)===ym).reduce((s,r)=>s+(+r.mm||0),0);}
function dryDays(){
  const wet=RAINFALL.filter(r=>(+r.mm||0)>0).map(r=>r.date).sort();
  if(!wet.length)return null;
  return Math.round((dayStart(new Date())-parseDay(wet[wet.length-1]))/86400000);}
function rainMax(){return RAINFALL.reduce((m,r)=>Math.max(m,+r.mm||0),0);}

async function saveRain(){
  const err=$('rain-err'); err.textContent='';
  const d=$('rain-date').value, mmRaw=$('rain-mm').value;
  if(!d){err.textContent='Pick the date this reading was taken.';return;}
  if(mmRaw===''||isNaN(+mmRaw)||+mmRaw<0){err.textContent='Enter the millimetres from the cage — 0 is a valid reading.';return;}
  if(d>todayStr()){err.textContent='That date is in the future. Log the cage after you have read it.';return;}
  const mm=+(+mmRaw).toFixed(1);
  if(mm>500&&!confirm(mm+' mm in one day is extreme.\nSave it anyway?'))return;
  const old=rainOn(d);
  if(old&&!confirm(d+' already has '+nf(old.mm)+' mm recorded.\nReplace it with '+nf(mm)+' mm?'))return;
  const rec=old?Object.assign({},old):{uuid:uuid(),date:d};
  rec.mm=mm; rec.note=$('rain-note').value.trim();
  rec.by=(CFG&&CFG.worker)||''; rec.byId=(CFG&&CFG.uid)||'';
  rec.device=(CFG&&CFG.device)||''; rec.at=now(); rec.synced=false;
  if(old)RAINFALL[RAINFALL.indexOf(old)]=rec; else RAINFALL.push(rec);
  if(db)await put('rain',rec);
  $('rain-mm').value=''; $('rain-note').value=''; $('rain-date').value=todayStr();  // next morning is one tap
  badge(); renderRain(); renderHub();
  toast('✓ '+nf(mm)+' mm logged for '+d);
  if(mm>0&&d===todayStr()&&WEATHER!=='RAINY')
    toast('🌧️ Rain recorded today — switch to Rainy mode if you are spraying',1);
}
function renderRain(){
  if(!$('rainlist'))return;
  if(!$('rain-date').value)$('rain-date').value=todayStr();
  const ym=todayStr().slice(0,7), rows=rainSorted().slice(0,30), mx=Math.max(rainMax(),1);
  const d7=ymd(addDays(dayStart(new Date()),-6)), d30=ymd(addDays(dayStart(new Date()),-29));
  const dd=dryDays();
  $('rain-kpis').innerHTML=
    '<div class="kpi"><div class="v">'+nf(rainMonth(ym))+'</div><div class="l">mm this month</div></div>'+
    '<div class="kpi"><div class="v">'+nf(rainSum(d7))+'</div><div class="l">mm last 7 days</div></div>'+
    '<div class="kpi"><div class="v">'+nf(rainSum(d30))+'</div><div class="l">mm last 30 days</div></div>'+
    '<div class="kpi"><div class="v">'+(dd===null?'—':dd)+'</div><div class="l">days since rain</div></div>';
  $('rainlist').innerHTML=rows.length?('<table class="tbl"><tr><th>Date</th><th>Reading</th><th class="num">mm</th></tr>'+
    rows.map(r=>'<tr><td>'+esc(r.date)+(r.synced?'':' <span class="cstat p">QUEUED</span>')+
      (r.note?('<div class="pa">'+esc(r.note)+'</div>'):'')+'</td>'+
      '<td><div class="rainbar"><div class="rainfill" style="width:'+Math.round(100*(+r.mm||0)/mx)+'%"></div></div></td>'+
      '<td class="num"><b>'+nf(r.mm)+'</b></td></tr>').join('')+'</table>')
    :'<div class="alertnone">No rainfall logged yet. Read the cage each morning and key the millimetres above.</div>';
}
async function pushRain(){
  const batch=RAINFALL.filter(r=>!r.synced);
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({rain:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j.rain){for(const x of batch){x.synced=true;if(db)await put('rain',x);}badge();return true;}
    if(!rainWarned){rainWarned=true;
      toast('Rainfall kept on this phone — update the Apps Script to add the RAIN tab',1);}
    return false;
  }catch(e){return false;}}
let rainWarned=false;

// ---- 2. programme organiser --------------------------------------------------------
function growthOf(m){return MONTH_PHASE[m]||null;}
function assumedLPT(p){return +p.litresPerTree||+LAST_LPT[p.mode]||0;}
// How hard does this set draw the store down? Coverage = the worst stocked line in it.
function drawdown(p){
  const lpt=assumedLPT(p);
  if(p.basis==='PER_1000L'&&!(lpt>0))
    return {known:false,cover:null,short:0,cost:0,why:'litres per tree not set for this set yet'};
  const pr=projectPhase(p,'ALL',lpt);
  let worst=null,short=0;
  pr.lines.forEach(l=>{
    const pd=prodById(l.pid); if(!pd||!(l.required>0))return;
    const c=onHand(pd)/l.required;
    if(c<1)short++;
    if(worst===null||c<worst)worst=c;});
  return {known:true,cover:worst===null?null:+worst.toFixed(3),short:short,cost:pr.cost,lines:pr.lines.length};
}
function drawdownRank(){
  return allPhases().map(p=>({p:p,d:drawdown(p)})).sort((a,b)=>{
    if(a.d.known!==b.d.known)return a.d.known?-1:1;      // unrankable sets sink, never guessed at
    if(a.d.short!==b.d.short)return b.d.short-a.d.short;  // most short lines first
    const ac=a.d.cover===null?9:a.d.cover, bc=b.d.cover===null?9:b.d.cover;
    if(ac!==bc)return ac-bc;                              // then the thinnest cover
    return String(a.p.plan||'9999').localeCompare(String(b.p.plan||'9999'));});
}
function coverPill(d){
  if(!d.known)return '<span class="cstat">NOT RANKED</span>';
  if(d.cover===null)return '<span class="cstat">NO DOSE</span>';
  const pct=Math.round(d.cover*100);
  const cls=d.cover>=1?'a':(d.cover>=0.5?'p':'r');
  return '<span class="cstat '+cls+'">'+(pct>999?'999+':pct)+'% COVERED</span>';
}
// ---- 3. combo set grid -------------------------------------------------------------
function comboSlotOf(pid,aiFallback){
  const p=prodById(pid);
  const cat=p?String(p.cat||''):'';
  if(COMBO_CAT[cat])return COMBO_CAT[cat];
  const ai=String((p&&p.active_ingredient)||aiFallback||'').toLowerCase();
  if(ai&&ai.indexOf('confirm')<0){
    for(let i=0;i<COMBO_AI_RULES.length;i++){
      const slot=COMBO_AI_RULES[i][0], keys=COMBO_AI_RULES[i][1];
      for(let j=0;j<keys.length;j++) if(ai.indexOf(keys[j])>=0) return slot;}}
  return COMBO_CAT_FALLBACK[cat]||'OTHER';
}
function comboSlots(rec){
  const out={}; COMBO_ORDER.concat(['OTHER']).forEach(s=>out[s]=[]);
  (rec.lines||[]).forEach(l=>{out[comboSlotOf(l.pid,l.ai)].push(l);});
  return out;
}
// Everything the sprayer needs to know before mixing: how many FULL tanks, and what
// the last part tank takes. A part tank mixed at full dose is the classic overdose.
function tankPlan(trees,litresPerTree,tankL){
  const cap=+tankL>0?+tankL:TANK_LITRES;
  const lpt=+litresPerTree||0;
  const litres=+(trees*lpt).toFixed(1);
  const exact=litres/cap;
  const full=Math.floor(exact+1e-9);
  const partL=+(litres-full*cap).toFixed(1);
  return {trees:trees,cap:cap,lpt:lpt,litres:litres,exact:+exact.toFixed(3),
    full:full,partL:partL,partFrac:+(partL/cap).toFixed(4),
    treesPerTank:lpt>0?Math.floor(cap/lpt):0};
}
// ---- 4. worker card: combo format + one-tap MARK DONE -------------------------------
function comboCardHTML(r){
  const slots=comboSlots(r);
  const per=r.basis==='PER_1000L'?' / 1000 L tank':' / tree';
  return '<div class="combomini">'+COMBO_ORDER.concat(slots.OTHER.length?['OTHER']:[]).map(s=>{
    const ls=slots[s];
    return '<div class="cmrow'+(ls.length?'':' off')+'"><div class="cmk">'+COMBO_IC[s]+' '+esc(COMBO_LABEL[s])+'</div>'+
      '<div class="cmv">'+(ls.length?ls.map(l=>esc(l.pname)+' <b>'+nf(l.dose)+' '+esc(l.unit)+'</b>'+per).join('<br>')
        :'<span class="exphint">not in this set</span>')+'</div></div>';}).join('')+'</div>';
}
let mdProg=null, mdLotVal='';
function mdShare(){
  if(!mdProg)return 1;
  if(mdProg.scope!=='ALL'||!mdLotVal)return 1;
  const t=+mdProg.trees||0; if(!t)return 1;
  return treesInLot(mdLotVal).length/t;}
function mdMult(){
  if(!mdProg)return 0;
  const sh=mdShare();
  return mdProg.basis==='PER_1000L'?+((+mdProg.tanks||0)*sh).toFixed(3):Math.round((+mdProg.trees||0)*sh);}
function openMarkDone(u){
  const r=progOf(u); if(!r){toast('Task not found',1);return;}
  mdProg=r;
  const need=(r.scope==='ALL'?LOT_KEYS:[r.scope]).filter(L=>!lotsDone(r.uuid).includes(L));
  mdLotVal=(r.scope!=='ALL')?r.scope:(need.length===1?need[0]:'');
  $('md-task').textContent=monthLabel(r.month)+' · '+r.set;
  $('md-lotwrap').style.display=(r.scope==='ALL')?'':'none';
  LOT_KEYS.forEach(L=>{const el=$('ml-'+L);el.classList.toggle('on',L===mdLotVal);
    el.classList.toggle('done',lotsDone(r.uuid).includes(L));});
  $('md-crew').value=LAST_CREW.crew||'';
  $('md-hours').value=LAST_CREW.hours||'';
  $('md-err').textContent='';
  $('mdmodal').classList.remove('hidden');
  mdCalc();}
function closeMarkDone(){$('mdmodal').classList.add('hidden');mdProg=null;}
function mdLot(L){mdLotVal=L;LOT_KEYS.forEach(k=>$('ml-'+k).classList.toggle('on',k===L));mdCalc();}
function mdCalc(){
  if(!mdProg)return;
  const m=mdMult(), foliar=mdProg.basis==='PER_1000L';
  $('md-plan').innerHTML=foliar
    ?('<b>'+nf(m)+' tank'+(m===1?'':'s')+'</b> of 1000 L'+(mdLotVal?(' for Lot '+esc(mdLotVal)):' — pick the lot'))
    :('<b>'+nf(m)+' tree'+(m===1?'':'s')+'</b>'+(mdLotVal?(' in Lot '+esc(mdLotVal)):' — pick the lot'));
  $('md-tbl').innerHTML='<tr><th>Product</th><th class="num">Will deduct</th><th class="num">On hand</th></tr>'+
    mdProg.lines.map(l=>{const p=prodById(l.pid),oh=p?onHand(p):0,q=+(l.dose*m).toFixed(2);
      return '<tr><td><div class="pn">'+esc(l.pname)+'</div><div class="pa">'+esc(l.ai||'—')+'</div></td>'+
        '<td class="num"><b>'+nf(q)+'</b> '+esc(l.unit)+'</td>'+
        '<td class="num '+(oh<q?'lowq':'')+'">'+nf(oh)+'</td></tr>';}).join('');}
let mdSaving=false;
async function submitMarkDone(){
  const err=$('md-err'); err.textContent='';
  if(!mdProg||mdSaving)return;
  if(!mdLotVal){err.textContent='Pick the lot that was done.';return;}
  const m=mdMult();
  if(!(m>0)){err.textContent='This programme has no quantity to deduct.';return;}
  const crew=Math.round(+$('md-crew').value||0), hours=+$('md-hours').value||0;
  if(!(crew>0)){err.textContent='How many workers were on the job?';return;}
  if(!(hours>0)){err.textContent='How many hours did each worker put in?';return;}
  if(lotsDone(mdProg.uuid).includes(mdLotVal)&&
     !confirm('Lot '+mdLotVal+' was already reported for this phase.\nMark it done again anyway?'))return;
  for(const l of mdProg.lines){
    const p=prodById(l.pid); if(!p)continue;
    const phi=PHI_PRODUCTS[p.name]; if(!phi)continue;
    const days=Math.ceil((PEAK_DATE-new Date())/86400000);
    if(days>=0&&days<phi&&!confirm('⚠ PHI WARNING\n'+p.name+' has a '+phi+'-day residue cut-off.\nProjected peak drop 21–22 Aug is in '+days+' day(s).\n\nMark done anyway?'))return;}
  const water=+((+mdProg.litresPerTree||0)*(+mdProg.trees||0)*mdShare()).toFixed(1);
  if(!confirm('Mark done — Lot '+mdLotVal+'\n\nThis deducts the PLANNED mix from stock:\n'+
    mdProg.lines.map(l=>'· '+l.pname+'  '+nf(+(l.dose*m).toFixed(2))+' '+l.unit).join('\n')+
    '\n\nIf the field used a different amount, cancel and use SUBMIT COMPLETION REPLY instead.'))return;
  mdSaving=true;
  const stamp=now(), rid=uuid();
  try{
    for(const l of mdProg.lines){
      const p=prodById(l.pid); const q=+(l.dose*m).toFixed(2); if(!(q>0))continue;
      await persistEvent({uuid:uuid(),type:'STOCK_OUT',dt:stamp,pid:l.pid,pname:l.pname,
        ai:l.ai||(p?p.active_ingredient:''),qty:q,unit:l.unit,lot:mdLotVal,
        set:monthLabel(mdProg.month)+' - '+mdProg.set,
        cost:+(q*(p?(p.cpu||0):0)).toFixed(2),
        progId:mdProg.uuid,progSet:monthLabel(mdProg.month)+' · '+mdProg.set,replyId:rid,
        tanks:mdProg.basis==='PER_1000L'?m:'',water:water,crew:crew,hours:hours,
        via:'MARK_DONE',planned:true,
        worker:CFG.worker,device:CFG.device,synced:false});}
  } finally { mdSaving=false; }
  LAST_CREW={crew:crew,hours:hours}; if(db)await put('kv',{k:'lastcrew',v:LAST_CREW});
  const n=mdProg.lines.length, lot=mdLotVal;
  closeMarkDone();
  toast('✓ Marked done · '+n+' item(s) deducted from Lot '+lot);
  refreshInventoryViews();renderOpsTasks();renderOpsHistory();renderTimeline();
  renderProgCheck();renderReady();renderLabour();renderHub();}

// ---- programme list, rendered three ways -------------------------------------------
// ---- worker's task list, in the combo format ---------------------------------------

// ================= v2.8 MONTH TIMELINE · TYING BALANCE · ROTTEN LOG · LOG CORRECTIONS =================
// The Agronomist is now three tabs: THIS MONTH (a chronological timeline of the
// month's combo sets) · WEATHER (mode + rain cage) · RECORD (finished months, kept
// for the monthly and yearly report). The tank is fixed at 1000 L everywhere — there
// is one power spray pump on this farm and pretending otherwise only invites a
// mis-mixed tank.

// ---- high moisture ------------------------------------------------------------------
function rainWindow(days){
  let s=0;
  for(let i=0;i<days;i++){const r=rainOn(ymd(addDays(dayStart(new Date()),-i)));s+=r?(+r.mm||0):0;}
  return +s.toFixed(1);}
function wetFlag(){
  const mm=rainWindow(RAIN_WET_DAYS);
  return {wet:mm>RAIN_WET_MM,mm:mm,
    text:mm+' mm in '+RAIN_WET_DAYS+' days — wet canopy, wash-off and root-rot pressure'};}

// ---- where a set stands, read from the real records ---------------------------------
function progsFor(pid){return PROGRAMS.filter(x=>x.phaseId===pid);}
function setDone(r){
  const need=r.scope==='ALL'?LOT_KEYS:[r.scope];
  return need.every(L=>lotsDone(r.uuid).includes(L));}
function lastOutFor(u){
  const es=EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.progId===u).sort((a,b)=>a.dt<b.dt?1:-1);
  return es.length?es[0].dt.slice(0,10):null;}
// DONE · PART (started, some lots outstanding) · LATE · DUE · NEXT
function setStatus(p){
  const recs=progsFor(p.id);
  const fin=recs.find(setDone);
  if(fin)return {st:'DONE',on:lastOutFor(fin.uuid),rec:fin};
  const live=recs.find(x=>x.status==='ACTIVE');
  if(live&&lotsDone(live.uuid).length)return {st:'PART',on:lastOutFor(live.uuid),rec:live};
  const today=ymd(dayStart(new Date()));
  if(live)return {st:(p.plan&&p.plan<today)?'LATE':'DUE',on:null,rec:live};
  if(!p.plan)return {st:'NEXT',on:null,rec:null};
  if(p.plan<today)return {st:'LATE',on:null,rec:null};
  if(p.plan===today)return {st:'DUE',on:null,rec:null};
  return {st:'NEXT',on:null,rec:null};}
const TL_PILL={DONE:['done','✓ DONE'],PART:['due','◐ PART DONE'],LATE:['late','⚠ LATE'],
  DUE:['due','● DUE NOW'],NEXT:['next','UPCOMING']};

// ---- the fixed 1000 L tank ----------------------------------------------------------
// Everything downstream reads this one function, so the tank size can never drift
// between the Owner's projection and the worker's card.
function tankFor(trees,litresPerTree){return tankPlan(trees,litresPerTree,TANK_LITRES);}
function tankLineHTML(p,lpt,trees){
  if(p.basis!=='PER_1000L')
    return '<div class="tanknote">Fertiliser — broadcast <b>per tree</b> across '+trees+
      ' tree'+(trees===1?'':'s')+'. No tank mix.</div>';
  if(!(lpt>0))
    return '<div class="cbwarn">This set has no <b>litres per tree</b> on record. Open ACTIVATE and enter '+
      'what the sprayer actually applies — the app will not invent a tank count.</div>';
  const tp=tankFor(trees,lpt);
  return '<div class="tanknote">'+trees+' trees × '+nf(tp.lpt)+' L = '+nf(tp.litres)+' L → <b>'+tp.full+
    ' full tank'+(tp.full===1?'':'s')+'</b>'+(tp.partL>0?(' + one part tank of <b>'+nf(tp.partL)+' L</b>'):'')+
    '<div class="tnsub">One 1,000 L tank covers about '+tp.treesPerTank+' trees'+
    (tp.partL>0?' · the part tank is mixed at '+Math.round(tp.partFrac*100)+'% dose':'')+'</div></div>';}

// ---- the 5-part combo grid, rendered inside a timeline card -------------------------
function comboGridHTML(p,lpt,trees){
  const slots=comboSlots(p);
  const fert=(p.basis!=='PER_1000L');
  const tp=fert?null:tankFor(trees,lpt);
  const known=fert||(lpt>0);
  const perTank=q=>fert?null:+(q*tp.cap/1000).toFixed(2);
  const perPart=q=>fert?null:+(q*tp.partL/1000).toFixed(2);
  const total  =q=>fert?+(q*trees).toFixed(2):(known?+(q*tp.litres/1000).toFixed(2):null);
  return '<div class="tblwrap cbwrap"><table class="tbl cbtbl"><tr><th>Product</th>'+
    '<th class="num">'+(fert?'Per tree':'Goes in one tank')+'</th><th class="num">Total needed</th></tr>'+
    COMBO_ORDER.concat(slots.OTHER.length?['OTHER']:[]).map(s=>{
      const ls=slots[s];
      const head='<tr class="cbhead"><td colspan="3">'+COMBO_IC[s]+' '+esc(COMBO_LABEL[s])+
        (ls.length?'':' <span class="cbempty">— not in this set</span>')+'</td></tr>';
      if(!ls.length)return head;
      return head+ls.map(l=>{
        const pd=prodById(l.pid), oh=pd?onHand(pd):0, need=total(l.qty);
        const short=(need!==null&&oh<need);
        return '<tr><td><div class="pn">'+esc((pd&&pd.name)||l.raw||'—')+'</div>'+
          '<div class="pa">'+esc(aiFor(l.pid,l.ai||'')||l.ai||'—')+'</div></td>'+
          '<td class="num"><b>'+nf(fert?l.qty:(known?perTank(l.qty):l.qty))+'</b> '+esc(l.unit)+
          '<div class="exphint">'+(fert?'per tree':(known?'per full 1,000 L tank':'per 1,000 L tank'))+'</div>'+
          ((!fert&&known&&tp.partL>0)?('<div class="partdose">part tank '+nf(perPart(l.qty))+' '+esc(l.unit)+'</div>'):'')+
          '</td>'+
          '<td class="num '+(short?'lowq':'')+'">'+(need===null?'<span class="exphint">set the litres/tree</span>'
            :('<b>'+nf(need)+'</b> '+esc(l.unit)+'<div class="exphint">have '+nf(oh)+
              (short?(' · short '+nf(+(need-oh).toFixed(2))):'')+'</div>'))+'</td></tr>';}).join('');
    }).join('')+'</table></div>';}

// ---- the timeline -------------------------------------------------------------------
let tlMonth=null, tlOpen={};
function tlMonths(){
  return PROG_MONTH_ORDER.filter(m=>PHASE_PROGRAM.some(p=>p.month===m))
    .concat(BLUEPRINTS.length?['My sets']:[]);}
function tlDefaultMonth(){
  const ms=tlMonths(), today=ymd(dayStart(new Date()));
  // the month holding the next unfinished set, else the last month with a plan date behind us
  let best=null;
  allPhases().forEach(p=>{if(!p.plan)return;
    if(p.plan>=today&&(!best||p.plan<best.plan))best=p;});
  if(best&&ms.indexOf(best.month)>=0)return best.month;
  return ms[ms.length-1]||null;}
function tlSet(m){tlMonth=m;tlOpen={};renderTimeline();}
function tlStep(d){
  const ms=tlMonths(); if(!ms.length)return;
  let i=ms.indexOf(tlMonth); if(i<0)i=0;
  i=Math.max(0,Math.min(ms.length-1,i+d));
  tlSet(ms[i]);}
function tlToggle(id){tlOpen[id]=!tlOpen[id];renderTimeline();}
function tlSets(){
  return allPhases().filter(p=>p.month===tlMonth)
    .sort((a,b)=>String(a.plan||'9999-99-99').localeCompare(String(b.plan||'9999-99-99')));}
function tlCard(p){
  const s=setStatus(p), pill=TL_PILL[s.st], isOpen=!!tlOpen[p.id];
  const rec=s.rec;
  const scope=rec?rec.scope:'ALL';
  const trees=treesInScope(scope);
  const lpt=rec?(+rec.litresPerTree||0):assumedLPT(p);
  const wf=wetFlag();
  const spray=(p.mode==='SPRAY'||p.mode==='LEAF');
  const phi=p.lines.some(l=>PHI_PRODUCTS[(prodById(l.pid)||{}).name]);
  const adv=weatherAdvice(p,p.lines);
  let inner='';
  if(isOpen){
    inner=tankLineHTML(p,lpt,trees)+comboGridHTML(p,lpt,trees);
    if(phi)inner+='<div class="cnote" style="color:#b3261e;font-weight:700">⚠ contains a fruit-contact product with a 14-day residue cut-off</div>';
    if(adv&&!adv.ok)inner+=advHTML(adv);
    if(wf.wet&&spray)inner+='<div class="wetnote">💧 '+esc(wf.text)+'. A contact spray put on now may not stay on the leaf.</div>';
    if(s.st==='DONE'||s.st==='PART'){
      const done=lotsDone(rec.uuid);
      inner+='<div class="varbox ok">Reported for '+done.map(L=>'Lot '+L).join(', ')+
        (s.on?(' · last on '+esc(s.on)):'')+'</div>';}
    inner+='<div class="cacts">'+
      (s.st==='DONE'
        ?'<button class="no" style="background:#e8f0fe;color:#123a71" onclick="event.stopPropagation();openProgModal(\''+esc(p.id)+'\')">RE-ACTIVATE</button>'
        :'<button class="ok" onclick="event.stopPropagation();openProgModal(\''+esc(p.id)+'\')">✓ ACTIVATE &amp; SEND TO WORKERS</button>')+
      (p.custom
        ?'<button class="no" style="background:#e8f0fe;color:#123a71" onclick="event.stopPropagation();openBlueprint(\''+esc(p.uuid||'')+'\')">EDIT SET</button>'+
         '<button class="no" onclick="event.stopPropagation();bpDelete(\''+esc(p.uuid||'')+'\')">DELETE</button>'
        :'<button class="no" style="background:#e8f0fe;color:#123a71" onclick="event.stopPropagation();copyToBlueprint(\''+esc(p.id)+'\')">COPY &amp; EDIT BY INGREDIENT</button>')+
      (rec&&rec.status==='ACTIVE'?'<button class="no" onclick="event.stopPropagation();closeProgram(\''+rec.uuid+'\')">CLOSE PHASE</button>':'')+
      '</div>';
  }
  return '<div class="setrow '+s.st.toLowerCase()+'" onclick="tlToggle(\''+esc(p.id)+'\')">'+
    '<div class="sh"><div><div class="sn">'+esc(p.set)+'</div>'+
    '<div class="sd">'+esc(MODE_LABEL[p.mode]||p.mode)+' · '+p.lines.length+' product'+(p.lines.length===1?'':'s')+
    (p.plan?('<br>planned '+esc(p.plan)):'')+(s.on?(' · applied '+esc(s.on)):'')+'</div></div>'+
    '<span class="pill '+pill[0]+'">'+pill[1]+'</span></div>'+
    (rec?clockHTML(rec):'')+
    (isOpen?inner:'<div class="tlhint">tap to open the combo set and tank count</div>')+'</div>';}
function renderTimeline(){
  const box=$('tlbox'); if(!box)return;
  const ms=tlMonths();
  if(!ms.length){box.innerHTML='<div class="alertnone">No programme loaded.</div>';return;}
  if(ms.indexOf(tlMonth)<0)tlMonth=tlDefaultMonth()||ms[ms.length-1];
  const i=ms.indexOf(tlMonth), sets=tlSets(), wf=wetFlag();
  const today=ymd(dayStart(new Date()));
  const c={DONE:0,PART:0,LATE:0,DUE:0,NEXT:0};
  sets.forEach(p=>c[setStatus(p).st]++);
  let rows='', line=false;
  sets.forEach(p=>{
    if(!line&&p.plan&&p.plan>today){line=true;
      rows+='<div class="today"><span class="todaytag">TODAY · '+esc(today)+'</span></div>';}
    const st=setStatus(p).st;
    rows+='<div class="tlrow"><div class="tldate">'+(p.plan?esc(p.plan.slice(8)):'—')+
      '<small>'+(p.plan?esc(monthLabel(tlMonth)).slice(0,3):'no date')+'</small></div>'+
      '<div class="tldot '+st.toLowerCase()+'"></div>'+tlCard(p)+'</div>';});
  if(!line&&sets.length)rows+='<div class="today"><span class="todaytag">TODAY · '+esc(today)+'</span></div>';
  box.innerHTML=
    '<div class="mrow"><div class="marrow'+(i<=0?' off':'')+'" onclick="tlStep(-1)">‹</div>'+
    '<div class="mname">'+esc(monthLabel(tlMonth))+'<small>'+sets.length+' set'+(sets.length===1?'':'s')+
    ' · '+c.DONE+' applied'+(c.LATE?(' · '+c.LATE+' late'):'')+'</small></div>'+
    '<div class="marrow'+(i>=ms.length-1?' off':'')+'" onclick="tlStep(1)">›</div></div>'+
    (wf.wet?'<div class="wetbadge">💧 HIGH MOISTURE — '+esc(wf.text)+'</div>':'')+
    (sets.length?('<div class="tl">'+rows+'</div>')
      :'<div class="alertnone">No set recorded for this month.</div>')+
    '<button class="bigbtn ghost" style="margin-top:10px" onclick="openBlueprint()">＋ BUILD A SET BY ACTIVE INGREDIENT</button>';}

// ---- RECORD: finished months, kept for the monthly and yearly report ----------------
function monthRecord(m){
  const sets=allPhases().filter(p=>p.month===m);
  let done=0,late=0,cost=0,tanks=0;
  sets.forEach(p=>{const s=setStatus(p);
    if(s.st==='DONE')done++; if(s.st==='LATE')late++;
    if(s.rec){tanks+=+s.rec.tanks||0;
      EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.progId===s.rec.uuid).forEach(e=>cost+=+e.cost||0);}});
  return {m:m,n:sets.length,done:done,late:late,cost:+cost.toFixed(2),tanks:+tanks.toFixed(2),
    growth:growthOf(m)};}
function renderRecord(){
  const box=$('recbox'); if(!box)return;
  const rows=tlMonths().map(monthRecord);
  const tot=rows.reduce((a,r)=>({n:a.n+r.n,done:a.done+r.done,cost:a.cost+r.cost}),{n:0,done:0,cost:0});
  box.innerHTML=
    '<div class="kpis" style="margin-bottom:8px">'+
    '<div class="kpi"><div class="v">'+tot.n+'</div><div class="l">sets in the programme</div></div>'+
    '<div class="kpi"><div class="v">'+tot.done+'</div><div class="l">applied so far</div></div>'+
    '<div class="kpi"><div class="v">'+(SHOW_VALUES?rm(tot.cost):'—')+'</div><div class="l">material used</div></div>'+
    '<div class="kpi"><div class="v">'+nf(rainMonth(todayStr().slice(0,7)))+'</div><div class="l">mm rain this month</div></div>'+
    '</div>'+
    '<div class="tblwrap"><table class="tbl"><tr><th>Month</th><th>Growth stage</th>'+
    '<th class="num">Applied</th><th class="num">Material</th></tr>'+
    rows.map(r=>'<tr><td><div class="pn">'+esc(monthLabel(r.m))+'</div>'+
      (r.late?'<div class="pa" style="color:#b3261e">'+r.late+' past the plan date</div>':'')+'</td>'+
      '<td>'+(r.growth?(GROWTH_PHASE[r.growth].ic+' '+esc(GROWTH_PHASE[r.growth].label)):'<span class="exphint">custom</span>')+'</td>'+
      '<td class="num"><b>'+r.done+'</b> / '+r.n+'</td>'+
      '<td class="num">'+(SHOW_VALUES?rm(r.cost):'—')+'</td></tr>').join('')+'</table></div>'+
    '<p class="small">Every month of the programme with what was actually applied against it. This is the '+
    'record the monthly and yearly report is built from — the working screen is THIS MONTH.</p>'+
    '<div class="sec" style="margin-top:14px">Stock pressure by set</div>'+
    '<div class="tblwrap" style="max-height:280px"><table class="tbl"><tr><th>Set</th><th class="num">Cover</th></tr>'+
    drawdownRank().slice(0,12).map(o=>'<tr><td><div class="pn">'+esc(monthLabel(o.p.month))+' · '+esc(o.p.set)+'</div>'+
      '<div class="pa">'+(o.d.known?(o.d.short?(o.d.short+' line'+(o.d.short>1?'s':'')+' short of stock'):'every line covered')
        :esc(o.d.why))+'</div></td>'+
      '<td class="num">'+coverPill(o.d)+'</td></tr>').join('')+'</table></div>';}

// ---- blueprint: create AND modify a set from the active-ingredient dropdown ---------
// Editing a set the Owner built reopens the same AI-first builder. A set that came off
// the programme sheet is never edited in place — it is COPIED into a custom set, so the
// sheet stays the reference and the change is visibly the Owner's.
let bpEditUuid=null;
function bpFrom(rec,nameSuffix){
  bpEditUuid=null;
  bpLines=(rec.lines||[]).map(l=>{const p=prodById(l.pid);
    return {pid:l.pid,pname:(p&&p.name)||l.pname||l.raw||'',ai:String((p&&p.active_ingredient)||l.ai||''),
      unit:l.unit||(p&&p.unit)||'',qty:+l.qty||+l.dose||0};});
  bpBasisVal=rec.basis==='PER_TREE'?'PER_TREE':'PER_1000L';
  $('bp-name').value=(rec.set||'')+(nameSuffix||'');
  $('bp-kind').value=rec.bpKind||(rec.kind==='FERT'?'MANURE':'PND');
  ['PER_1000L','PER_TREE'].forEach(k=>$('bb-'+k).classList.toggle('on',k===bpBasisVal));
  bpKind();renderBpLines();
  $('bp-err').textContent='';$('bp-dose').value='';
  $('bpmodal').classList.remove('hidden');}
function copyToBlueprint(pid){
  const p=phaseById(pid); if(!p){toast('Set not found',1);return;}
  $('bp-title').textContent='Copy and edit by ingredient';
  bpFrom(p,' (my version)');
  toast('Copied — the sheet set is untouched');}

// ---- fruit tying balance -------------------------------------------------------------
// Workers log fruits tied per tree under Daily Ops (FTIE). Every drop and every rotten
// fruit taken off that tree comes back off the balance, so what is left is what is still
// hanging on a string.
// Two sources, never mixed up: the migrated opening balance from the census workbook
// (static, shipped in database.js, never synced) and what workers have logged since.
function tiedMigOf(tree){
  return (typeof TIE_MIGRATION==='undefined')?0:
    TIE_MIGRATION.reduce((s,r)=>s+(r.t===tree?(+r.n||0):0),0);}
function tiedOf(tree){return tiedMigOf(tree)+tiedLoggedOf(tree);}
function droppedOf(tree){
  return EVENTS.filter(e=>e.type==='DROP'&&e.tree===tree).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='DROP_ADJUST'&&e.tree===tree).reduce((s,e)=>s+(+e.delta||0),0);}
function rottenOf(tree){
  return EVENTS.filter(e=>e.type==='ROTTEN'&&e.tree===tree).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='ROTTEN_ADJUST'&&e.tree===tree).reduce((s,e)=>s+(+e.delta||0),0);}
function renderTying(){
  const box=$('tyingbox'); if(!box)return;
  const rows=tyingMatrix();
  const tot=rows.reduce((a,r)=>({trees:a.trees+r.trees,tied:a.tied+r.tied,mig:a.mig+r.mig,
    logged:a.logged+r.logged,dropped:a.dropped+r.dropped,rotten:a.rotten+r.rotten,
    bal:a.bal+r.bal,kg:a.kg+r.kg}),{trees:0,tied:0,mig:0,logged:0,dropped:0,rotten:0,bal:0,kg:0});
  const over=tiedTrees().filter(id=>tiedBalance(id)<0);
  box.innerHTML=
    '<div class="kpis" style="margin-bottom:8px">'+
    '<div class="kpi"><div class="v">'+nf(tot.tied)+'</div><div class="l">fruits tied</div></div>'+
    '<div class="kpi"><div class="v">'+nf(tot.dropped)+'</div><div class="l">dropped since</div></div>'+
    '<div class="kpi"><div class="v">'+nf(tot.rotten)+'</div><div class="l">logged rotten</div></div>'+
    '<div class="kpi"><div class="v">'+nf(tot.bal)+'</div><div class="l">still on the string<br>≈ '+nf(Math.round(tot.kg))+' kg</div></div></div>'+
    (tot.mig?('<div class="cnote">📒 <b>'+nf(tot.mig)+'</b> of these were carried in from the July census workbook '+
      'on '+nf(tiedTrees().filter(id=>tiedMigOf(id)>0).length)+' trees. <b>'+nf(tot.logged)+'</b> have been tied by '+
      'workers in the app since.</div>'):'')+
    (rows.length?('<div class="tblwrap"><table class="tbl"><tr><th>Lot</th><th class="num">Trees</th>'+
      '<th class="num">Tied</th><th class="num">Off the tree</th><th class="num">Balance</th></tr>'+
      rows.map(r=>'<tr><td><b>Lot '+r.lot+'</b></td><td class="num">'+r.trees+'</td>'+
        '<td class="num">'+nf(r.tied)+(r.mig&&r.logged?('<div class="exphint">'+nf(r.mig)+' carried in · '+nf(r.logged)+' in app</div>'):'')+'</td>'+
        '<td class="num">'+nf(r.dropped+r.rotten)+'<div class="exphint">'+nf(r.dropped)+' drop · '+nf(r.rotten)+' rotten</div></td>'+
        '<td class="num '+(r.bal<0?'lowq':'')+'"><b>'+nf(r.bal)+'</b></td></tr>').join('')+'</table></div>')
      :'<div class="alertnone">No fruit tied yet. Assign a <b>Fruit tying</b> task in Daily Ops → ASSIGN WORK and the balance builds itself from the workers’ replies.</div>')+
    (over.length?('<div class="cnote" style="color:#b3261e;font-weight:700">⚠ '+over.length+
      ' tree'+(over.length>1?'s have':' has')+' more fruit off the tree than was ever tied: '+
      over.slice(0,8).map(esc).join(', ')+(over.length>8?' …':'')+
      '<br>Either the tying count was under-reported or untied fruit is being logged against it.</div>'):'')+
    '<p class="small">Opening balance carried in from the <b>July census workbook</b> on 2 Aug 2026, plus every '+
    '<b>Fruit tying</b> reply the workers have sent since. Each drop and each rotten fruit logged on a tree comes '+
    'off its balance automatically — nobody keeps this figure by hand.</p>';}

// ---- rotten fruit log ----------------------------------------------------------------
// v3.0 — Card B. The counter starts at ZERO, because most trees lose nothing and a
// counter sitting on 1 invites a phantom rotten fruit. The cause dropdown and the
// tied/untied toggle only appear once the count is above zero — and once they appear
// they are both mandatory.
let rotQty=0, rotCause='';
function rotBump(d){rotQty=Math.max(0,rotQty+d);$('rot-n').textContent=rotQty;rotExtras();}
function rotReset(){rotQty=0;rotCause='';rotTied=null;
  if($('rot-n'))$('rot-n').textContent=0;
  if($('rot-cause'))$('rot-cause').value='';
  ['T','U'].forEach(k=>{const el=$('rt-'+k);if(el)el.classList.remove('on');});
  if($('rot-err'))$('rot-err').textContent='';
  rotExtras();}
function rotExtras(){
  const x=$('rot-extra'); if(x)x.classList.toggle('hidden',!(rotQty>0));
  if(typeof visitSumPaint==='function')visitSumPaint();}   // v3.16
function rotPick(c){rotCause=c;
  const sel=$('rot-cause'); if(sel&&sel.value!==c)sel.value=c;
  if($('rot-err'))$('rot-err').textContent='';}
function rotPickSel(){rotPick($('rot-cause').value);}
function renderRotCauses(){
  const sel=$('rot-cause'); if(!sel)return;
  sel.innerHTML='<option value="">'+esc(tr('cb_choose'))+'</option>'+
    ROT_ORDER.map(k=>'<option value="'+k+'">'+ROT_CAUSE[k].ic+' '+esc(causeLabel(k))+
      ' — '+esc(causeNote(k))+'</option>').join('');
  sel.value=rotCause||''; rotExtras();}
let savingRot=false;
// ---- my logs + request log correction -------------------------------------------------
// A worker never edits a log. Anything wrong goes to the Owner as a request and is only
// applied when the Owner approves it, exactly like a clone or census correction.
function renderMyLogs(){
  const box=$('mylogs'); if(!box)return;
  const rows=myLogs();
  box.style.display=rows.length?'':'none';
  const list=$('mylogslist'); if(!list)return;
  list.innerHTML=rows.map(e=>{
    const adj=logAdjOf(e.uuid);
    const pend=CORRECTIONS.some(c=>c.evUuid===e.uuid&&c.status==='PENDING');
    return '<div class="lrow"><span><b>'+esc(e.tree)+'</b> · '+logLabel(e)+
      (adj?(' <span class="cstat a">corrected '+(adj>0?'+':'')+nf(adj)+'</span>'):'')+
      '<br><span class="small">'+esc(e.dt)+(e.synced?'':' · queued')+'</span></span>'+
      (pend?'<span class="cstat p">CORRECTION SENT</span>'
           :'<button class="corrreq" onclick="openLogCorrection(\''+e.uuid+'\')">📝 Request Log Correction</button>')+
      '</div>';}).join('');}
let corrEv=null;
// ---- correction workflow, extended to cover drop and rotten logs ---------------------
function openCorrection(){
  if(!canCorrect()){toast('Not permitted for your role',1);return;}
  if(!curTree){toast('Pick a tree first',1);return;}
  corrEv=null; corrTree=curTree; corrClone=''; corrType='CLONE';
  $('cf-tree').textContent=curTree.id;
  $('cf-current').innerHTML='Clone on record<br><b>'+cloneLabel(curTree.clone)+'</b><br>Census Jul: <b>'+(curTree.census!=null?curTree.census:'—')+'</b>';
  $('cf-clones').innerHTML=CLONES.map(c=>'<div data-c="'+c+'" onclick="pickCorrClone(\''+c+'\')">'+c+'</div>').join('');
  $('cf-census').value=curTree.census!=null?curTree.census:'';
  $('cf-types').classList.remove('hidden');
  $('cf-logwrap').classList.add('hidden');
  $('cf-sub').textContent='The Owner must approve before the master record changes.';
  $('cf-note').value=''; $('cf-err').textContent='';
  pickCorrType('CLONE');
  $('corrmodal').classList.remove('hidden');}
function corrSummary(c){
  if(c.ctype==='CLONE') return 'Clone: '+(c.oldVal||'—')+'  ➔  '+c.newVal;
  if(c.ctype==='CENSUS') return 'July census: '+(c.oldVal===''||c.oldVal==null?'—':c.oldVal)+'  ➔  '+c.newVal;
  if(c.ctype==='LOGQTY') return (c.evType==='ROTTEN'?'Rotten count: ':'Drop count: ')+
    (c.oldVal===''||c.oldVal==null?'—':c.oldVal)+'  ➔  '+c.newVal+
    (c.evDt?('   ('+String(c.evDt).slice(0,16)+')'):'');
  return 'Tag / other issue — no automatic change';}
async function submitCorrection(){
  if(!canCorrect()||!corrTree)return;
  const t=corrTree, note=$('cf-note').value.trim();
  let oldVal='', newVal='', extra={};
  if(corrType==='LOGQTY'){
    if(!corrEv){$('cf-err').textContent='No log selected.';return;}
    const v=$('cf-logqty').value;
    if(v===''||isNaN(+v)||+v<0){$('cf-err').textContent='Enter the number that should have been logged.';return;}
    const nv=Math.round(+v);
    // a TIE event stores the count in `n`, a DROP/ROTTEN in `qty` — read whichever applies,
    // or the correction files a delta measured from zero
    const cur=Math.round(logQtyOf(corrEv));
    if(nv===cur){$('cf-err').textContent='That is already the number on record.';return;}
    if(!note){$('cf-err').textContent='Tell the Owner what happened — a count change needs a reason.';return;}
    oldVal=cur; newVal=nv;
    extra={evUuid:corrEv.uuid,evType:corrEv.type,evDt:corrEv.dt};
  }else if(corrType==='CLONE'){
    if(!corrClone){$('cf-err').textContent='Choose the correct clone.';return;}
    if(corrClone===t.clone){$('cf-err').textContent='That is already the clone on record.';return;}
    oldVal=t.clone||''; newVal=corrClone;
  }else if(corrType==='CENSUS'){
    const v=$('cf-census').value;
    if(v===''||isNaN(+v)||+v<0){$('cf-err').textContent='Enter the correct census count.';return;}
    if(t.census!=null&&+v===t.census){$('cf-err').textContent='That is already the count on record.';return;}
    oldVal=(t.census==null?'':t.census); newVal=Math.round(+v);
  }else{
    if(!note){$('cf-err').textContent='Describe the problem for the Owner.';return;}
    oldVal=''; newVal='';
  }
  await persistCorrection(Object.assign({uuid:uuid(),dt:now(),tree:t.id,lot:t.lot,no:t.no||0,ctype:corrType,
    oldVal:oldVal,newVal:newVal,note:note,worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,
    status:'PENDING',decidedBy:'',decidedAt:'',synced:false},extra));
  closeCorrection(); corrEv=null;
  renderMyCorrections(); renderMyLogs();
  toast('✓ Sent to Owner for approval'+(navigator.onLine?'':' (queued)'));}
// An approved log correction never rewrites the original row — the Sheet is append-only.
// It emits a signed adjustment event, exactly as a stock-take adjustment does, so the
// audit trail shows both the mistake and the Owner who authorised the fix.
async function decideCorrection(id,ok){
  if(!canApprove()){toast('Only the Owner can approve corrections',1);return;}
  const c=CORRECTIONS.find(x=>x.uuid===id); if(!c||c.status!=='PENDING')return;
  const isLog=(c.ctype==='LOGQTY');
  const t=treeById(c.tree);
  if(ok){
    if(!confirm('Approve this change?\n\n'+c.tree+'\n'+corrSummary(c)+'\n\n'+
      (isLog?'This files a signed adjustment against that log. The original row is kept.'
            :'This permanently updates the Tree Master across the whole app.')))return;
  }else{
    if(!confirm('Reject this request?\n\n'+c.tree+'\n'+corrSummary(c)))return;}
  c.status=ok?'APPROVED':'REJECTED'; c.decidedBy=CFG.worker; c.decidedAt=now(); c.synced=false;
  if(ok){ if(isLog)await applyLogCorrection(c); else if(t)await bakeApproved(c); }
  await persistCorrection(c);
  renderCorrections(); renderDash(); renderTying(); renderMyLogs(); refreshInventoryViews();
  if(curTree&&curTree.id===c.tree) selectTree(c.tree);
  toast(ok?('✓ Approved — '+c.tree+' updated'):'Request rejected');}

// ---- sync: rotten logs and log adjustments each travel on their own key --------------
let rotWarned=false, ladjWarned=false;
function rottenQueue(){return EVENTS.filter(e=>e.type==='ROTTEN'&&!e.synced);}
function logAdjQueue(){return EVENTS.filter(e=>(e.type==='DROP_ADJUST'||e.type==='ROTTEN_ADJUST')&&!e.synced);}
function q5(){return rottenQueue().length+logAdjQueue().length;}
/* ======================================================================================
   v3.10 · A SYNC THAT CAN TIME OUT, RETRY, AND SAY WHAT IS STUCK
   ======================================================================================
   Three things were wrong with every upload in this app:

     · no timeout    a hotspot that accepts the connection and then dies left the request
                     hanging until the browser gave up, minutes later, with the button
                     still saying "Uploading…".
     · no retry      one dropped packet and that batch waited for somebody to press Sync
                     again. At the office that is a walk back across the yard.
     · no memory     `catch(e){return false;}` swallowed the reason. Nobody could tell a
                     rejected payload from a lost signal, and nothing on any screen said
                     which of the sixteen uploads had failed.

   Records were never at risk - a failed push leaves them queued. But a worker cannot act
   on a failure nobody tells them about, which is the "inconsistent" half of the report.
   ====================================================================================== */
const SYNC_TIMEOUT_MS=25000, SYNC_TRIES=2, SYNC_BACKOFF_MS=1200;
/** key -> {label, n, why, at} for everything that would not go up. Rendered on the sync
 *  screen with a RETRY button, and cleared the moment that key succeeds. */
let SYNC_FAILS={};
function syncFailCount(){return Object.keys(SYNC_FAILS).length;}
function clearSyncFail(k){delete SYNC_FAILS[k];}
function noteSyncFail(k,label,n,why){SYNC_FAILS[k]={label:label,n:n,why:String(why||''),at:now()};}

/** fetch with a hard deadline. Without this a half-open hotspot hangs the whole sync. */
async function fetchT(url,opts,ms){
  const ac=(typeof AbortController!=='undefined')?new AbortController():null;
  const t=setTimeout(()=>{try{ac&&ac.abort();}catch(e){}},ms||SYNC_TIMEOUT_MS);
  try{ return await fetch(url,Object.assign({},opts||{},ac?{signal:ac.signal}:{})); }
  finally{ clearTimeout(t); }}

async function pushOwnKey(batch,key,flag,warnSetter,warnMsg,label,shape){
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  // v3.10.1 — `shape` slims what goes ON THE WIRE without touching what is stored. This is
  // what rescues a record that was already queued in the fat format: the event on the phone
  // keeps its photos, the upload does not carry them.
  const wire=shape?batch.map(shape):batch;
  let lastWhy='';
  for(let attempt=1;attempt<=SYNC_TRIES;attempt++){
    try{
      const body={}; body[key]=wire;
      const r=await fetchT(CFG.url,{method:'POST',body:JSON.stringify(body),
        headers:{'Content-Type':'text/plain;charset=utf-8'}});
      const j=await r.json();
      if(j&&j.ok&&j[flag]){
        for(const e of batch){e.synced=true;e.syncedAt=now();if(db)await put('events',e);}
        clearSyncFail(key); badge(); return true;}
      // A well-formed reply that simply does not carry the flag means the BACKEND does not
      // understand this payload — retrying cannot help, so stop and say so plainly.
      warnSetter(warnMsg);
      noteSyncFail(key,label||key,batch.length,tr('sy_oldbackend'));
      return false;
    }catch(err){
      lastWhy=(err&&err.name==='AbortError')?tr('sy_timeout'):(err&&err.message)||'network';
      if(attempt<SYNC_TRIES)await new Promise(r=>setTimeout(r,SYNC_BACKOFF_MS));
    }}
  noteSyncFail(key,label||key,batch.length,lastWhy);
  return false;}

/** Push one key again, on demand, from the sync screen. */
async function retryOne(key){
  const m={rotten:pushRotten,logadj:pushLogAdj,tying:pushTying,tieadj:pushTieAdj,
    sales:pushSales,retailers:pushRetailers,dispatchreqs:pushDispatchReqs,
    dispatch:pushDispatch,audit:pushAudit,adjustments:pushAdjustments,
    programs:pushPrograms,tasks:pushTasks,tasklogs:pushTaskLogs,rain:pushRain,
    corrections:pushCorrections,registry:pushRegistry,
    // v3.11 — without this line the RETRY button on the stuck "Shared settings" row said
    // "Nothing to retry". A dead retry is worse than no retry: it teaches people the
    // button lies. Same dead-end shape as RETURNED before v3.9 closed the loop.
    settings:pushSettings};
  const fn=m[key]; if(!fn){toast('Nothing to retry',1);return;}
  toast(tr('sy_retrying'));
  const okd=await fn();
  renderSync(); badge();
  toast(okd?('✓ '+tr('sy_retryok')):('⚠ '+tr('sy_retryfail')),!okd);}
async function pushRotten(){
  return pushOwnKey(rottenQueue(),'rotten','rotten',
    m=>{if(!rotWarned){rotWarned=true;toast(m,1);}},
    'Rotten fruit logs kept on this phone — update the Apps Script to add the ROTTEN_LOGS tab',
    tr('sy_l_rotten'));}
async function pushLogAdj(){
  return pushOwnKey(logAdjQueue(),'logadj','logadj',
    m=>{if(!ladjWarned){ladjWarned=true;toast(m,1);}},
    'Approved log corrections kept on this phone — update the Apps Script to add the LOG_ADJUST tab',
    tr('sy_l_logadj'));}

// ---- tree card: the tied balance, deducted live as drops and rotten are logged -------
function treeTieHTML(t){
  if(!t)return '';
  const tied=tiedOf(t.id); if(!tied)return '';
  const bal=tiedBalance(t.id), off=droppedOf(t.id)+rottenOf(t.id), mig=tiedMigOf(t.id);
  return '<div class="tiebox'+(bal<0?' bad':'')+'">🪢 <b>'+nf(bal)+'</b> still tied on this tree'+
    '<div class="tnsub">'+nf(tied)+' tied'+(mig?(' ('+nf(mig)+' from the July workbook)'):'')+
    ' · '+nf(off)+' already off the tree'+
    (bal<0?' · more taken off than was ever tied':'')+'</div></div>';}
// ---- worker's recipe card: the combo set, the tank, and one Confirm Completion -------
// The card is the mixing instruction. It states the tank the farm actually owns (1,000 L),
// how many of them the job needs, and what goes into each one — then takes one tap.
function renderOpsTasks(){
  const box=$('opslist');if(!box)return;
  const t=myTasks(), today=ymd(dayStart(new Date())), wf=wetFlag();
  box.innerHTML=t.length?t.map(function(r){
    const done=lotsDone(r.uuid);
    const need=(r.scope==='ALL'?LOT_KEYS:[r.scope]).filter(function(L){return done.indexOf(L)<0;});
    const phi=r.lines.some(function(l){return PHI_PRODUCTS[(prodById(l.pid)||{}).name];});
    const isToday=(r.plan===today)||(r.startDate===today);
    const overdue=r.plan&&r.plan<today;
    const spray=(r.mode==='SPRAY'||r.mode==='LEAF');
    const tanks=+r.tanks||0;
    return '<div class="crow'+(isToday?' todaycard':'')+'"><div class="ch">'+
      '<div><div class="ctree">'+(isToday?'<span class="todaychip">TODAY</span> ':'')+
      esc(monthLabel(r.month))+' · '+esc(r.set)+'</div>'+
      '<div class="cwho">'+esc(MODE_LABEL[r.mode]||r.mode)+(r.plan?(' · planned '+esc(r.plan)):'')+
      '<br>set by '+esc(r.by)+' · '+esc(r.at)+'</div></div>'+
      '<span class="cstat '+(overdue?'r':'p')+'">'+(overdue?'OVERDUE':'TO DO')+'</span></div>'+
      clockHTML(r)+
      (r.basis==='PER_1000L'&&tanks
        ?(function(){
            // never hand a sprayer a decimal tank — say full tanks and the part tank in litres
            const tp=tankFor(r.trees,+r.litresPerTree||0);
            return '<div class="tanknote">Mix <b>'+tp.full+' full tank'+(tp.full===1?'':'s')+'</b> of 1,000 L'+
              (tp.partL>0?(' + <b>one part tank of '+nf(tp.partL)+' L</b>'):'')+' for '+r.trees+' trees'+
              '<div class="tnsub">'+nf(r.litresPerTree)+' L of mix per tree · one full tank covers about '+
              tp.treesPerTank+' trees'+
              (tp.partL>0?(' · mix the part tank at '+Math.round(tp.partFrac*100)+'% of the dose below'):'')+
              '</div></div>';})()
        :'<div class="tanknote">Broadcast <b>per tree</b> across '+r.trees+' trees. No tank mix.</div>')+
      (phi?'<div class="cnote" style="color:#b3261e;font-weight:700">⚠ fruit-contact product — check the residue cut-off with the Owner first</div>':'')+
      (r.weather==='RAINY'?'<div class="cnote" style="color:#123a71;font-weight:700">🌧️ set while the Owner had Rainy mode on — spray only when the leaf can dry</div>':'')+
      (wf.wet&&spray?('<div class="wetnote">💧 '+esc(wf.text)+'. Check with the Owner before spraying a contact product.</div>'):'')+
      comboCardHTML(r)+
      '<div class="cwho">Still to report: '+need.map(function(L){return '<span class="lotchip">LOT '+L+'</span>';}).join('')+
      (done.length?(' · done: '+done.map(function(L){return '<span class="lotchip">LOT '+L+'</span>';}).join('')):'')+'</div>'+
      '<div class="cacts"><button class="ok" onclick="openMarkDone(\'' + r.uuid + '\')">✓ CONFIRM COMPLETION</button>'+
      '<button class="no" style="background:#e8f0fe;color:#123a71" onclick="openReply(\'' + r.uuid + '\')">MIXED A DIFFERENT AMOUNT</button></div></div>';}).join('')
    :'';
  // v3.12 — the seasonal directives sit ABOVE the programme-sheet phases, because a
  // directive is what the Owner issued this morning and a phase is the standing plan.
  const dir=directiveCardsHTML();
  // v3.13 — the directive note is DELETED. It was six lines of prose, and worse, it told
  // the crew to press "REKOD KERJA YANG DIBUAT" — a button this release renamed. A note
  // that describes a control by a name it no longer has is worse than no note at all.
  box.innerHTML=dir+box.innerHTML+
    ((dir||t.length)?'':'<div class="alertnone">'+esc(tr('op_notask'))+'</div>');
  // v3.12 FIX (screenshot, not test) — the standing note under this list explains
  // CONFIRM COMPLETION and MIXED A DIFFERENT AMOUNT. A directive card has neither
  // button, so with only directives on screen that note described controls that were
  // not there. Same misleading-signal class as the dead RETRY button in v3.11.
  const note=document.querySelector('#opstasks [data-t="op_note"]');
  if(note)note.style.display=t.length?'':'none';}


// ================= v2.9 TREE LEDGER · DUAL COUNTERS · UNTIED WAVE · ROPE =================
// Every figure below is DERIVED from the event log — nothing is stored twice, so a
// figure can never drift from the events that produced it. One function per property
// named exactly as the schema calls it.

// ---- the tree ledger -----------------------------------------------------------------
function censusCount(tree){const t=treeById(tree);return (t&&t.census!=null)?+t.census:0;}
// A drop logged before v2.9 has no `secured` flag. Those were all filed against tied
// fruit under the old model, so a missing flag reads as SECURED — the historical
// balances stay exactly as they were.
function isSecuredDrop(e){return e.secured!==false;}
function securedDropsOf(tree){
  return statOf(tree,'secured')
       + EVENTS.filter(e=>e.type==='DROP'&&e.tree===tree&&isSecuredDrop(e)&&countsLocally(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='DROP_ADJUST'&&e.tree===tree&&e.secured!==false&&countsLocally(e)).reduce((s,e)=>s+(+e.delta||0),0);}
function untiedDropsOf(tree){
  return statOf(tree,'untied')
       + EVENTS.filter(e=>e.type==='DROP'&&e.tree===tree&&!isSecuredDrop(e)&&countsLocally(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='DROP_ADJUST'&&e.tree===tree&&e.secured===false&&countsLocally(e)).reduce((s,e)=>s+(+e.delta||0),0);}
function totalDroppedOf(tree){return securedDropsOf(tree)+untiedDropsOf(tree);}
// Rotten fruit is classified the same way — a rotten fruit that was tied frees its string.
function isTiedRotten(e){return e.tied!==false;}
function rottenTiedOf(tree){
  return statOf(tree,'rotTied')
       + EVENTS.filter(e=>e.type==='ROTTEN'&&e.tree===tree&&isTiedRotten(e)&&countsLocally(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='ROTTEN_ADJUST'&&e.tree===tree&&e.tied!==false&&countsLocally(e)).reduce((s,e)=>s+(+e.delta||0),0);}
function rottenUntiedOf(tree){
  return statOf(tree,'rotUntied')
       + EVENTS.filter(e=>e.type==='ROTTEN'&&e.tree===tree&&!isTiedRotten(e)&&countsLocally(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='ROTTEN_ADJUST'&&e.tree===tree&&e.tied===false&&countsLocally(e)).reduce((s,e)=>s+(+e.delta||0),0);}
// Counter A writes TIE events; the Owner-assigned Fruit tying task still writes TASK_DONE.
function tieRoundsOf(tree){
  return statOf(tree,'tied')
       + EVENTS.filter(e=>e.type==='TIE'&&e.tree===tree&&countsLocally(e)).reduce((s,e)=>s+(+e.n||0),0)
       + EVENTS.filter(e=>e.type==='TIE_ADJUST'&&e.tree===tree&&countsLocally(e)).reduce((s,e)=>s+(+e.delta||0),0);}

/**
 * The running ledger for one tree. Property names are the schema's, verbatim.
 *   untied_hanging_estimate = census_count − total_fruits_tied, less every untied
 *   fruit already taken off the tree. It is an ESTIMATE because the census is a single
 *   July snapshot; a tree with no census returns null rather than a misleading zero.
 */
function treeLedger(tree){
  const census=censusCount(tree), hasCensus=(treeById(tree)&&treeById(tree).census!=null);
  const tied=tiedOf(tree);
  const sec=securedDropsOf(tree), uns=untiedDropsOf(tree);
  const rotT=rottenTiedOf(tree), rotU=rottenUntiedOf(tree);
  const bal=tied-sec-rotT;
  const est=hasCensus?(census-tied-uns-rotU):null;
  return {tree:tree,
    census_count:census, has_census:hasCensus,
    total_fruits_tied:tied,
    current_tied_balance:bal,
    total_dropped_collected:sec+uns,
    total_untied_drops_collected:uns,
    secured_drops:sec, rotten_tied:rotT, rotten_untied:rotU,
    untied_hanging_estimate:est,
    total_hanging_estimate:(est===null?null:Math.max(0,bal)+Math.max(0,est))};}
function lotLedger(lot){
  const out={lot:lot,trees:0,census_count:0,total_fruits_tied:0,current_tied_balance:0,
    total_dropped_collected:0,total_untied_drops_collected:0,untied_hanging_estimate:0,noCensus:0};
  treesInLot(lot).forEach(t=>{const L=treeLedger(t.id);
    out.trees++; out.census_count+=L.census_count; out.total_fruits_tied+=L.total_fruits_tied;
    out.current_tied_balance+=L.current_tied_balance;
    out.total_dropped_collected+=L.total_dropped_collected;
    out.total_untied_drops_collected+=L.total_untied_drops_collected;
    if(L.untied_hanging_estimate===null)out.noCensus++; else out.untied_hanging_estimate+=L.untied_hanging_estimate;});
  return out;}

// ---- tying rounds: one shared commit, used by the v3.0 tally clicker -----------------
let savingTie=false;
function ropeNeeded(n){return +((+n||0)*ROPE_M_PER_FRUIT).toFixed(2);}
function ropeOnHand(){const p=prodById(ROPE_PID);return p?onHand(p):0;}
/**
 * The ONE place a tying round becomes events. A TIE event for the count, and an
 * ordinary STOCK_OUT for the rope it consumed — ROPE_M_PER_FRUIT (1.5 m) per fruit —
 * so rope lands in the same moving-average costing as every other material and the
 * lot's rope balance falls by itself. Both rows carry the same roundId, so the tying
 * and the rope that paid for it can always be matched up again in the Sheet.
 */
async function commitTieRound(t,n){
  const need=ropeNeeded(n), stamp=now(), rid=uuid();
  await persistEvent({uuid:uuid(),type:'TIE',dt:stamp,tree:t.id,lot:t.lot,clone:t.clone||'',
    n:n,ropeM:need,roundId:rid,
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  const rp=prodById(ROPE_PID);
  if(rp&&need>0) await persistEvent({uuid:uuid(),type:'STOCK_OUT',dt:stamp,pid:ROPE_PID,pname:rp.name,
    ai:'',qty:need,unit:rp.unit,lot:t.lot,set:'Fruit tying',
    cost:+(need*(rp.cpu||0)).toFixed(2),roundId:rid,tree:t.id,
    worker:CFG.worker,device:CFG.device,synced:false});
  return need;}

// ================= v3.0 FRUIT TYING TRACKER — WAY 4 TALLY CLICKER =====================
// Its own tile, off the collection screen entirely. Lock the tree in, tap once per
// fruit, undo a mis-tap, then save the whole tree in one go. The tally is local until
// saved, so a mis-tap costs nothing and no half-counted tree reaches the ledger.
let tyTree=null, tyTally=0, tyLot='B';
function tyBuildLots(){
  const s=$('ty-lot'); if(!s)return;
  if(!s.options.length){
    s.innerHTML=LOTS.map(l=>'<option value="'+l+'">Lot '+l+' ('+treesInLot(l).length+' trees)</option>').join('');}
  s.value=tyLot;}
function tyBuildTrees(){
  const s=$('ty-tree'); if(!s)return;
  s.innerHTML='<option value="">'+esc(tr('ty_selecttree'))+'</option>'+treesInLot(tyLot).map(t=>
    '<option value="'+t.id+'">'+t.id+'  ·  Tree '+t.no+'</option>').join('');
  s.value=tyTree?tyTree.id:'';}
function tyLotChange(){
  if(tyTally>0&&!confirm('You have '+tyTally+' fruit counted on '+(tyTree?tyTree.id:'this tree')+
     ' that is not saved yet.\n\nChange lot and throw that tally away?')){$('ty-lot').value=tyLot;return;}
  tyLot=$('ty-lot').value; tyTree=null; tyTally=0; tyBuildTrees(); tyPaint();}
function tyTreeChange(){
  const id=$('ty-tree').value;
  if(tyTally>0&&tyTree&&id!==tyTree.id&&
     !confirm('You have '+tyTally+' fruit counted on '+tyTree.id+' that is not saved yet.\n\n'+
              'Change tree and throw that tally away?')){$('ty-tree').value=tyTree.id;return;}
  tyTree=treeById(id)||null; tyTally=0; tyPaint();}
function tyTap(){
  if(!tyTree){const e=$('ty-err');if(e)e.textContent='Lock the Lot and the Tree Number in first.';return;}
  tyTally++; tyPaint();}
function tyUndo(){ if(tyTally>0)tyTally--; tyPaint(); }
function tyPaint(){
  const n=$('ty-n'); if(n)n.textContent=tyTally;
  const cl=$('ty-clone'); if(cl)cl.textContent=tyTree?(tyTree.clone||'NOT RECORDED'):'—';
  const inf=$('ty-info');
  if(inf){
    if(!tyTree)inf.innerHTML=esc(tr('h_selecttree'));
    else{const L=treeLedger(tyTree.id);
      inf.innerHTML=cloneLabel(tyTree.clone)+'<br>'+esc(tr('ty_onstring'))+' <b>'+nf(L.current_tied_balance)+'</b>'+
        '<br>'+esc(tr('ty_untied'))+' <b>'+(L.untied_hanging_estimate===null?esc(tr('ty_nocensus')):nf(Math.max(0,L.untied_hanging_estimate)))+'</b>';}}
  const tap=$('ty-tap'); if(tap)tap.disabled=!tyTree;
  const und=$('ty-undo'); if(und)und.disabled=!(tyTally>0);
  const rope=$('ty-rope');
  if(rope){
    const need=ropeNeeded(tyTally), have=ropeOnHand();
    rope.innerHTML=tyTally
      ? ('This tree will draw <b>'+nf(need)+' m</b> of rope ('+ROPE_M_PER_FRUIT+' m per fruit) · store shows <b>'+
         nf(have)+' m</b>'+(have<need?' <span style="color:#b3261e;font-weight:800">— short, ask the Purchaser to key the rolls in</span>':''))
      : (esc(tr('ty_rope'))+' · '+esc(tr('ty_store'))+' <b>'+nf(have)+' m</b>');}
  const e=$('ty-err'); if(e&&tyTree&&tyTally)e.textContent='';
  tyRecent();}
function tyRecent(){
  const box=$('ty-recent'); if(!box)return;
  const me=(CFG&&CFG.worker)||'';
  const rows=EVENTS.filter(e=>e.type==='TIE'&&e.worker===me).sort((a,b)=>a.dt<b.dt?1:-1).slice(0,6);
  box.innerHTML=rows.length
    ? ('<div class="sec" style="margin-top:14px">Trees you finished</div>'+rows.map(e=>
        '<div class="lrow"><span><b>'+esc(e.tree)+'</b> · 🎗️ '+nf(e.n)+' tied · '+nf(e.ropeM||0)+' m rope'+
        '<br><span class="small">'+esc(e.dt)+(e.synced?'':' · queued')+'</span></span></div>').join(''))
    : '';}
async function tySave(){
  const err=$('ty-err'); if(err)err.textContent='';
  if(savingTie)return;
  if(!tyTree){if(err)err.textContent='Lock the Lot and the Tree Number in first.';return;}
  if(!(tyTally>0)){if(err)err.textContent='Tap the big button once for every fruit you tied.';return;}
  const L=treeLedger(tyTree.id);
  if(L.has_census&&L.untied_hanging_estimate!==null&&tyTally>L.untied_hanging_estimate&&
     !confirm('⚠ '+tyTree.id+' has about '+L.untied_hanging_estimate+' untied fruit left by the July census.\n'+
              'Tying '+tyTally+' takes it past that.\n\nSave anyway?'))return;
  const need=ropeNeeded(tyTally), have=ropeOnHand();
  if(have<need&&!confirm('⚠ The store shows only '+nf(have)+' m of rope and this needs '+nf(need)+' m.\n\n'+
     'Save the tying anyway? The rope balance will go negative until the Purchaser keys the rolls in.'))return;
  savingTie=true;
  const t=tyTree, n=tyTally;
  try{ await commitTieRound(t,n); } finally { savingTie=false; }
  tyTally=0; tyTree=null;
  const sel=$('ty-tree'); if(sel)sel.value='';
  tyPaint(); badge(); refreshTreeBoard(); renderTying(); renderMyLogs();
  refreshInventoryViews(); renderHub();
  toast('🎗️ '+n+' tied @ '+t.id+' · '+nf(ropeNeeded(n))+' m rope drawn'+(navigator.onLine?'':' (queued)'));}
function renderTally(){
  if(!$('tallycard'))return;
  tyBuildLots(); tyBuildTrees(); tyPaint();}

// ---- Counter B: the drop collection split --------------------------------------------
let dropKind='SECURED';
// v3.0 — the single SECURED/UNSECURED toggle became one toggle per grade row.
// Kept as a shim so any older call site sets the default for all three at once.
function pickDropKind(k){dropKind=k;
  if(DROP_KIND[k]&&typeof GKIND==='object')GRADE_ORDER.forEach(g=>{GKIND[g]=k;});
  if(typeof paintGrade==='function')GRADE_ORDER.forEach(paintGrade);}

// ---- the Tree Asset Board ------------------------------------------------------------
function boardHTML(t){
  if(!t)return '';
  const L=treeLedger(t.id);
  const est=L.untied_hanging_estimate;
  return '<div class="board">'+
    '<div class="bh">🌳 Tree asset board <span class="bsub">'+esc(t.id)+' · Lot '+esc(t.lot)+' · '+esc(cloneLabel(t.clone))+'</span></div>'+
    '<div class="bgrid">'+
      '<div class="bcell"><div class="bv">'+(L.has_census?nf(L.census_count):'—')+'</div><div class="bl">Census<br>July count</div></div>'+
      '<div class="bcell tie"><div class="bv">'+nf(L.total_fruits_tied)+'</div><div class="bl">Tied<br>to date</div></div>'+
      '<div class="bcell tie"><div class="bv">'+nf(L.current_tied_balance)+'</div><div class="bl">Still on<br>the string</div></div>'+
      '<div class="bcell '+(est===null?'muted':'')+'"><div class="bv">'+(est===null?'—':nf(Math.max(0,est)))+'</div><div class="bl">Untied<br>still hanging</div></div>'+
    '</div>'+
    '<div class="brow">Collected so far: <b>'+nf(L.total_dropped_collected)+'</b> fruit'+
      ' <span class="bmini">'+nf(L.secured_drops)+' secured · '+nf(L.total_untied_drops_collected)+' unsecured</span>'+
      (L.rotten_tied+L.rotten_untied?(' · rotten <b>'+nf(L.rotten_tied+L.rotten_untied)+'</b>'):'')+'</div>'+
    (est===null
      ? '<div class="bwarn">This tree was not in the July census, so the untied estimate cannot be worked out. Tying and drops are still counted exactly.</div>'
      : (est<0?'<div class="bwarn">More fruit has been tied and collected than the July census counted. The census undercounted this tree.</div>':''))+
    (L.current_tied_balance<0?'<div class="bwarn">More secured fruit has come off than was ever tied on this tree.</div>':'')+
    '</div>';}
// v3.0 — the read-only ledger board is an OWNER view. A worker on the collection
// screen sees the two counters and nothing else; the numbers they would have to
// interpret are exactly what slows a picking round down.
function canSeeBoard(){return FULL_ROLES.indexOf(myRole())>=0;}
function refreshTreeBoard(){
  if(!curTree)return;
  const b=$('assetboard'); if(b)b.innerHTML=canSeeBoard()?boardHTML(curTree):'';}

// ---- lot-level view of the whole wave -------------------------------------------------
function renderWave(){
  const box=$('wavebox'); if(!box)return;
  const rows=LOT_KEYS.map(lotLedger);
  const tot=rows.reduce((a,r)=>({trees:a.trees+r.trees,census_count:a.census_count+r.census_count,
    total_fruits_tied:a.total_fruits_tied+r.total_fruits_tied,
    current_tied_balance:a.current_tied_balance+r.current_tied_balance,
    total_dropped_collected:a.total_dropped_collected+r.total_dropped_collected,
    total_untied_drops_collected:a.total_untied_drops_collected+r.total_untied_drops_collected,
    untied_hanging_estimate:a.untied_hanging_estimate+r.untied_hanging_estimate,
    noCensus:a.noCensus+r.noCensus}),
    {trees:0,census_count:0,total_fruits_tied:0,current_tied_balance:0,total_dropped_collected:0,
     total_untied_drops_collected:0,untied_hanging_estimate:0,noCensus:0});
  box.innerHTML=
    '<div class="kpis" style="margin-bottom:8px">'+
    '<div class="kpi"><div class="v">'+nf(tot.current_tied_balance)+'</div><div class="l">on the string now</div></div>'+
    '<div class="kpi"><div class="v">'+nf(Math.max(0,tot.untied_hanging_estimate))+'</div><div class="l">untied still hanging<br>(estimate)</div></div>'+
    '<div class="kpi"><div class="v">'+nf(tot.total_dropped_collected)+'</div><div class="l">collected to date</div></div>'+
    '<div class="kpi"><div class="v">'+nf(tot.total_untied_drops_collected)+'</div><div class="l">of those, unsecured</div></div></div>'+
    '<div class="tblwrap"><table class="tbl"><tr><th>Lot</th><th class="num">Census</th><th class="num">Tied</th>'+
    '<th class="num">On string</th><th class="num">Untied left</th><th class="num">Collected</th></tr>'+
    rows.map(r=>'<tr><td><b>Lot '+r.lot+'</b><div class="exphint">'+r.trees+' trees'+
      (r.noCensus?(' · '+r.noCensus+' with no census'):'')+'</div></td>'+
      '<td class="num">'+nf(r.census_count)+'</td>'+
      '<td class="num">'+nf(r.total_fruits_tied)+'</td>'+
      '<td class="num '+(r.current_tied_balance<0?'lowq':'')+'"><b>'+nf(r.current_tied_balance)+'</b></td>'+
      '<td class="num">'+nf(Math.max(0,r.untied_hanging_estimate))+'</td>'+
      '<td class="num">'+nf(r.total_dropped_collected)+
      '<div class="exphint">'+nf(r.total_untied_drops_collected)+' unsecured</div></td></tr>').join('')+
    '<tr><td><b>TOTAL</b></td><td class="num"><b>'+nf(tot.census_count)+'</b></td>'+
    '<td class="num"><b>'+nf(tot.total_fruits_tied)+'</b></td>'+
    '<td class="num"><b>'+nf(tot.current_tied_balance)+'</b></td>'+
    '<td class="num"><b>'+nf(Math.max(0,tot.untied_hanging_estimate))+'</b></td>'+
    '<td class="num"><b>'+nf(tot.total_dropped_collected)+'</b></td></tr></table></div>'+
    '<p class="small"><b>Untied still hanging</b> is the July census less everything tied and everything '+
    'unsecured already collected. '+(tot.noCensus?('It leaves out the '+tot.noCensus+' trees that were never censused — '+
    'their fruit is real but the app will not invent a number for it.'):'')+'</p>'+
    ropeCardHTML();}
function ropeCardHTML(){
  const p=prodById(ROPE_PID); if(!p)return '';
  const have=onHand(p), used=usedOf(ROPE_PID);
  return '<div class="sec" style="margin-top:14px">🪢 Tying rope</div>'+
    '<div class="tblwrap"><table class="tbl">'+
    '<tr><td>Used on tying so far</td><td class="num"><b>'+nf(used)+'</b> m</td></tr>'+
    '<tr><td>Received into the store</td><td class="num">'+nf(recvOf(ROPE_PID))+' m</td></tr>'+
    '<tr><td>Balance</td><td class="num '+(have<0?'lowq':'')+'"><b>'+nf(have)+'</b> m</td></tr></table></div>'+
    (have<0?'<div class="cnote" style="color:#b3261e;font-weight:700">The rope balance is negative because no opening '+
      'stock has been keyed yet. The consumption is correct — ask the Purchaser to key the rolls in through '+
      '<b>Inventory → STOCK IN</b> and it corrects itself.</div>':'');}

// ---- the two save paths, rewritten for the split -------------------------------------
/**
 * v3.0 — Card A save. Every grade with a count above zero becomes its OWN immutable
 * DROP event carrying its own grade letter and its own secured flag, so the ledger
 * splits secured off the tied balance and unsecured off the untied estimate exactly
 * as before, and Marketing can price the same letters the worker counted. One tap on
 * SAVE, up to three rows — never one blended row that nobody can take apart later.
 */
async function saveDrop(){
  const err=$('g-err'); if(err)err.textContent='';
  if(!curTree||savingDrop)return;
  const tot=gTotal();
  if(!tot){if(err)err.textContent='Count at least one fruit before saving.';return;}
  savingDrop=true;
  try{
    const t=curTree;
    if(lastDrop.tree===t.id && (Date.now()-lastDrop.time)<120000){
      if(!confirm('⚠ '+t.id+' was already logged less than 2 minutes ago.\nSave AGAIN as a NEW collection?')){savingDrop=false;return;}}
    const L=treeLedger(t.id);
    const sec=GRADE_ORDER.filter(g=>GKIND[g]==='SECURED').reduce((a,g)=>a+(GCOUNT[g]||0),0);
    const uns=tot-sec;
    if(sec>0&&L.current_tied_balance>0&&sec>L.current_tied_balance&&
       !confirm('⚠ '+t.id+' has only '+L.current_tied_balance+' fruit still on the string.\n'+
                'Logging '+sec+' secured takes it below zero.\n\nSave anyway?')){savingDrop=false;return;}
    if(uns>0&&L.untied_hanging_estimate!==null&&L.untied_hanging_estimate>0&&uns>L.untied_hanging_estimate&&
       !confirm('⚠ '+t.id+' has about '+L.untied_hanging_estimate+' untied fruit left by the July census.\n'+
                'Logging '+uns+' unsecured takes it past that.\n\nSave anyway?')){savingDrop=false;return;}
    const stamp=now(), roundId=uuid();
    for(const g of GRADE_ORDER){
      const n=GCOUNT[g]||0; if(!(n>0))continue;
      const secured=(GKIND[g]==='SECURED');
      await persistEvent({uuid:uuid(),type:'DROP',dt:stamp,tree:t.id,lot:t.lot,clone:t.clone||'',
        qty:n,grade:g,secured:secured,dropKind:GKIND[g],pickId:roundId,
        estkg:+(n*(AVG_KG[t.clone]||1.6)).toFixed(1),
        worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});}
    lastDrop={tree:t.id,time:Date.now()};
    const after=treeLedger(t.id);
    const parts=GRADE_ORDER.filter(g=>GCOUNT[g]>0).map(g=>GCOUNT[g]+g);
    gClearAll();
    toast('✓ '+parts.join(' + ')+' @ '+t.id+' · '+nf(Math.max(0,after.current_tied_balance))+
      ' still on the string'+(navigator.onLine?'':' (queued)'));
    refreshTreeBoard();renderTying();renderWave();renderMyLogs();renderHub();
  } finally { savingDrop=false; }}

async function saveRotten(){
  const err=$('rot-err'); if(err)err.textContent='';
  if(!curTree||savingRot)return;
  if(!(rotQty>0)){err.textContent='Nothing to log — the rotten counter is on zero.';return;}
  if(!rotCause){err.textContent='Tag the damage cause — a rotten count without a cause cannot be acted on.';return;}
  if(rotTied===null){err.textContent='Say whether the fruit was tied or untied.';return;}
  const L=treeLedger(curTree.id);
  if(rotTied&&L.current_tied_balance>0&&rotQty>L.current_tied_balance&&
     !confirm('⚠ '+curTree.id+' has only '+L.current_tied_balance+' fruit still on the string.\nLog '+rotQty+' rotten anyway?'))return;
  savingRot=true;
  try{
    const t=curTree;
    await persistEvent({uuid:uuid(),type:'ROTTEN',dt:now(),tree:t.id,lot:t.lot,clone:t.clone||'',
      qty:rotQty,cause:rotCause,causeLabel:ROT_CAUSE[rotCause].label,tied:rotTied,
      estkg:+(rotQty*(AVG_KG[t.clone]||1.6)).toFixed(1),
      worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  } finally { savingRot=false; }
  const n=rotQty, c=ROT_CAUSE[rotCause].label, id=curTree.id, wasTied=rotTied;
  rotReset();
  badge();refreshTreeBoard();renderTying();renderWave();renderMyLogs();renderHub();
  toast('🍂 '+n+' rotten @ '+id+' · '+c+' · '+(wasTied?'was tied':'untied')+(navigator.onLine?'':' (queued)'));}

let rotTied=null;
function rotTie(v){rotTied=v;
  const a=$('rt-T'), b=$('rt-U'); if(a)a.classList.toggle('on',v===true); if(b)b.classList.toggle('on',v===false);
  const e=$('rot-err'); if(e)e.textContent='';}

// ---- tree selection now paints the board ----------------------------------------------
function selectTree(id){
  const t=treeById(id);
  if(!t){toast('Unknown tag: '+id,1);return;}
  curTree=t;$('t-id').textContent=t.id;$('t-clone').textContent=t.clone||'?';
  $('t-meta').textContent='Lot '+t.lot+' · '+cloneLabel(t.clone)+(t.census!=null?' · Census Jul: '+t.census+' fruit':'');
  curLot=t.lot; if($('h-lot').options.length){$('h-lot').value=t.lot;}
  $('picker').classList.add('hidden');$('treezone').classList.remove('hidden');
  renderGradeRows(); gClearAll();
  renderRotCauses(); rotReset();
  if($('g-err'))$('g-err').textContent='';
  refreshTreeBoard();
  if($('corrbtn')) $('corrbtn').style.display=canCorrect()?'':'none';}

// ---- the tying balance now follows the ledger, not raw drop totals --------------------
function tiedLoggedOf(tree){
  let n=0;
  EVENTS.filter(e=>e.type==='TASK_DONE'&&e.kind==='FTIE').forEach(e=>{
    (e.detail||[]).forEach(d=>{if(d.tree===tree)n+=+d.n||0;});});
  return n+tieRoundsOf(tree);}
function tiedBalance(tree){return tiedOf(tree)-securedDropsOf(tree)-rottenTiedOf(tree);}
function tiedTrees(){
  const set={};
  if(typeof TIE_MIGRATION!=='undefined')TIE_MIGRATION.forEach(r=>{if(r.t)set[r.t]=1;});
  if(TREE_STATS&&TREE_STATS.trees)Object.keys(TREE_STATS.trees).forEach(t=>{
    const v=TREE_STATS.trees[t]; if(v&&(+v.tied||+v.secured||+v.untied||+v.rotTied||+v.rotUntied))set[t]=1;});
  EVENTS.filter(e=>e.type==='TASK_DONE'&&e.kind==='FTIE').forEach(e=>{
    (e.detail||[]).forEach(d=>{if(d.tree)set[d.tree]=1;});});
  EVENTS.filter(e=>e.type==='TIE').forEach(e=>{if(e.tree)set[e.tree]=1;});
  return Object.keys(set).filter(id=>!!treeById(id)).sort();}

// ---- sync: tying rounds and their corrections ride their own key ---------------------
let tieWarned=false, tadjWarned=false;
function tieQueue(){return EVENTS.filter(e=>e.type==='TIE'&&!e.synced);}
function tieAdjQueue(){return EVENTS.filter(e=>e.type==='TIE_ADJUST'&&!e.synced);}
function q6(){return tieQueue().length+tieAdjQueue().length;}
async function pushTying(){
  return pushOwnKey(tieQueue(),'tying','tying',
    m=>{if(!tieWarned){tieWarned=true;toast(m,1);}},
    'Tying rounds kept on this phone — update the Apps Script to add the TYING_LOGS tab');}
async function pushTieAdj(){
  return pushOwnKey(tieAdjQueue(),'tieadj','tieadj',
    m=>{if(!tadjWarned){tadjWarned=true;toast(m,1);}},
    'Approved tying corrections kept on this phone — update the Apps Script');}

// ---- worker's own logs: drops, rotten AND tying rounds, all correctable ---------------
function myLogs(){
  const me=(CFG&&CFG.worker)||'';
  return EVENTS.filter(e=>(e.type==='DROP'||e.type==='ROTTEN'||e.type==='TIE')&&e.worker===me)
    .sort((a,b)=>a.dt<b.dt?1:-1).slice(0,18);}
function logLabel(e){
  if(e.type==='TIE')    return '🪢 '+nf(e.n)+' tied · '+nf(e.ropeM||0)+' m rope';
  if(e.type==='ROTTEN') return '🍂 '+nf(e.qty)+' rotten · '+esc(e.causeLabel||e.cause||'')+
    ' · '+(isTiedRotten(e)?'was tied':'untied');
  return (isSecuredDrop(e)?'🪢 ':'🍃 ')+nf(e.qty)+' '+(isSecuredDrop(e)?'secured':'unsecured')+
    ' · grade '+esc(e.grade||'');}
function logAdjOf(u){
  return EVENTS.filter(e=>(e.type==='DROP_ADJUST'||e.type==='ROTTEN_ADJUST'||e.type==='TIE_ADJUST')&&e.evUuid===u)
    .reduce((s,e)=>s+(+e.delta||0),0);}
function logQtyOf(e){return e.type==='TIE'?(+e.n||0):(+e.qty||0);}

function openLogCorrection(u){
  if(!canCorrect()){toast('Not permitted for your role',1);return;}
  const e=EVENTS.find(x=>x.uuid===u); if(!e){toast('Log not found',1);return;}
  corrEv=e; corrTree=treeById(e.tree)||{id:e.tree,lot:e.lot,no:0,clone:e.clone||''};
  corrClone=''; corrType='LOGQTY';
  $('cf-tree').textContent=e.tree;
  $('cf-current').innerHTML='Logged<br><b>'+logLabel(e)+'</b><br><span class="small">'+esc(e.dt)+'</span>';
  $('cf-types').classList.add('hidden');
  $('cf-clonewrap').classList.add('hidden');
  $('cf-censuswrap').classList.add('hidden');
  $('cf-logwrap').classList.remove('hidden');
  $('cf-logold').textContent=nf(logQtyOf(e))+(e.type==='TIE'?' tied':(e.type==='ROTTEN'?' rotten':' fruit'));
  $('cf-logqty').value='';
  $('cf-sub').textContent='You cannot edit a log. Send the correct number to the Owner — it only takes effect once the Owner approves it.';
  $('cf-note').value=''; $('cf-err').textContent='';
  $('corrmodal').classList.remove('hidden');}

// An approved correction never rewrites the original row. It files a signed delta of the
// SAME shape as the row it fixes, carrying the secured / tied flag so the ledger keeps
// splitting it correctly.
/* v3.17.2 — TWO GUARDS, both learned from live data on 5 Aug 2026.

   The farm's LOG_ADJUST tab held ELEVEN rows for SEVEN approved corrections: B-030's
   "one fruit less" had been applied three times and B-011's three times, so those two
   trees were short by 3 fruit each instead of 1. Nobody did anything wrong.

   Cause 1 — any phone that merely SAW an approved correction manufactured a compensating
   row for it, even a phone that had never held the original entry. A second-hand device
   was inventing adjustments for work it never did.
   Cause 2 — each re-make minted a fresh random uuid, and the Sheet dedupes on uuid. So
   the same correction arriving from a second phone looked like a brand-new adjustment
   and was appended instead of recognised.

   The old `EVENTS.some(e=>e.corrId===c.uuid)` guard is real but only protects ONE phone,
   and it is defeated the moment a selective clean-up removes the baked row — which is
   exactly what the ADMIN_CLEANUP row in this farm's audit trail shows happened.

   Guard 1: only the device that still holds the original entry may write its correction.
   Guard 2: the compensating row's id is DERIVED from the correction id, so if two
   devices ever do both write it, the Sheet upserts one row instead of appending two.
   Neither guard changes what a correction DOES — only how many times it can land. */
async function applyLogCorrection(c){
  if(c.ctype!=='LOGQTY'||!c.evUuid)return;
  if(EVENTS.some(e=>e.corrId===c.uuid))return;                 // idempotent across sync replays
  const base=EVENTS.find(e=>e.uuid===c.evUuid);
  if(!base)return;                                             // v3.17.2 guard 1
  const delta=+(Math.round(+c.newVal||0)-Math.round(+c.oldVal||0));
  if(!delta)return;
  const t=treeById(c.tree);
  const type=c.evType==='ROTTEN'?'ROTTEN_ADJUST':(c.evType==='TIE'?'TIE_ADJUST':'DROP_ADJUST');
  const rec={uuid:'ADJ-'+c.uuid,type:type,dt:now(),         // v3.17.2 guard 2
    evUuid:c.evUuid,corrId:c.uuid,tree:c.tree,lot:c.lot,clone:(base&&base.clone)||(t&&t.clone)||'',
    was:Math.round(+c.oldVal||0),now:Math.round(+c.newVal||0),delta:delta,
    estkg:+(delta*(AVG_KG[(t&&t.clone)]||1.6)).toFixed(1),
    reason:c.note||'',requestedBy:c.worker||'',approvedBy:CFG?CFG.worker:'',synced:false};
  if(type==='DROP_ADJUST')   rec.secured=base?isSecuredDrop(base):true;
  if(type==='ROTTEN_ADJUST') rec.tied   =base?isTiedRotten(base):true;
  if(type==='TIE_ADJUST')    rec.ropeM  =+(delta*ROPE_M_PER_FRUIT).toFixed(2);
  await persistEvent(rec);
  // a corrected tying round must correct the rope drawn with it
  if(type==='TIE_ADJUST'&&rec.ropeM){
    const rp=prodById(ROPE_PID);
    if(rp) await persistEvent({uuid:'ROPE-'+c.uuid,type:'STOCK_ADJUST',dt:now(),pid:ROPE_PID,pname:rp.name,
      ai:'',unit:rp.unit,delta:-rec.ropeM,systemQty:onHand(rp),counted:onHand(rp)-rec.ropeM,
      note:'Rope re-stated with an approved tying correction on '+c.tree,
      corrId:c.uuid,worker:CFG?CFG.worker:'',device:CFG?CFG.device:'',synced:false});}}

// ---- the tying matrix now reads the ledger --------------------------------------------
function tyingMatrix(){
  const byLot={};LOT_KEYS.forEach(L=>byLot[L]={lot:L,trees:0,tied:0,mig:0,logged:0,dropped:0,rotten:0,bal:0,kg:0});
  tiedTrees().forEach(id=>{
    const t=treeById(id); if(!t||!byLot[t.lot])return;
    const r=byLot[t.lot], L=treeLedger(id);
    r.trees++; r.tied+=L.total_fruits_tied; r.mig+=tiedMigOf(id); r.logged+=tiedLoggedOf(id);
    r.dropped+=L.secured_drops; r.rotten+=L.rotten_tied;
    r.bal+=L.current_tied_balance; r.kg+=Math.max(0,L.current_tied_balance)*(AVG_KG[t.clone]||1.6);});
  return LOT_KEYS.map(L=>byLot[L]).filter(r=>r.trees>0);}

// ---- Marketing: what is ready to sell, and what has been sold ------------------------
// Saleable weight comes from the drops already collected — the same events the harvest
// screen writes — so the two can never disagree.
function collectedRows(){
  const by={};
  EVENTS.filter(e=>e.type==='DROP').forEach(e=>{
    const k=(e.dt||'').slice(0,10)+'|'+(e.grade||'?');
    if(!by[k])by[k]={date:(e.dt||'').slice(0,10),grade:e.grade||'?',n:0,kg:0};
    by[k].n+=+e.qty||0; by[k].kg+=+e.estkg||0;});
  return Object.values(by).sort((a,b)=>a.date<b.date?1:-1);}
// v3.0 — "sold" now means anything that has left the farm: a free-text SALE or a
// weighed retailer DISPATCH. Both are counted here or the ready-to-sell figure lies.
function soldKg(){return EVENTS.filter(e=>e.type==='SALE').reduce((s,e)=>s+(+e.kg||0),0)
  + EVENTS.filter(e=>e.type==='DISPATCH').reduce((s,e)=>s+(+e.total_kg||0),0);}
function collectedKg(){return EVENTS.filter(e=>e.type==='DROP').reduce((s,e)=>s+(+e.estkg||0),0);}
function salesRows(){return EVENTS.filter(e=>e.type==='SALE').sort((a,b)=>a.dt<b.dt?1:-1);}
function salesTotal(){return EVENTS.filter(e=>e.type==='SALE').reduce((s,e)=>s+(+e.amount||0),0);}
let savingSale=false;
function saleCalc(){
  const kg=+$('sl-kg').value||0, pr=+$('sl-price').value||0;
  $('sl-amt').innerHTML=(kg&&pr)?('<b>'+rm(kg*pr)+'</b> — '+nf(kg)+' kg × '+rm(pr)+'/kg')
    :'Enter the weight and the price per kilo.';}
async function saveSale(){
  const err=$('sl-err'); err.textContent='';
  if(savingSale)return;
  const buyer=$('sl-buyer').value.trim(), kg=+$('sl-kg').value, pr=+$('sl-price').value;
  const grade=$('sl-grade').value, note=$('sl-note').value.trim();
  if(!buyer){err.textContent='Who is the buyer?';return;}
  if(!(kg>0)){err.textContent='Enter the weight sold in kilos.';return;}
  if(!(pr>0)){err.textContent='Enter the price per kilo.';return;}
  const avail=collectedKg()-soldKg();
  if(kg>avail&&!confirm('⚠ Only '+nf(avail)+' kg of collected fruit is unsold.\nSell '+nf(kg)+' kg anyway?'))return;
  savingSale=true;
  try{
    await persistEvent({uuid:uuid(),type:'SALE',dt:now(),buyer:buyer,grade:grade,kg:kg,
      pricePerKg:pr,amount:+(kg*pr).toFixed(2),note:note,
      worker:CFG.worker,device:CFG.device,synced:false});
  } finally { savingSale=false; }
  $('sl-buyer').value='';$('sl-kg').value='';$('sl-note').value='';saleCalc();
  badge();renderMarketing();renderHub();
  toast('✓ '+nf(kg)+' kg to '+buyer+' · '+rm(kg*pr));}
function renderMarketing(){
  const box=$('mktbox'); if(!box)return;
  const col=collectedKg(), sold=soldKg(), rows=salesRows();
  box.innerHTML=
    '<div class="kpis" style="margin-bottom:8px">'+
    '<div class="kpi"><div class="v">'+nf(Math.round(col))+'</div><div class="l">kg collected</div></div>'+
    '<div class="kpi"><div class="v">'+nf(Math.round(sold))+'</div><div class="l">kg sold</div></div>'+
    '<div class="kpi"><div class="v">'+nf(Math.round(col-sold))+'</div><div class="l">kg unsold</div></div>'+
    '<div class="kpi"><div class="v">'+(SHOW_VALUES?rm(salesTotal()):'—')+'</div><div class="l">sales value</div></div></div>'+
    (rows.length?('<div class="sec">Sales logged</div><div class="tblwrap"><table class="tbl">'+
      '<tr><th>Buyer</th><th class="num">Weight</th><th class="num">Value</th></tr>'+
      rows.slice(0,20).map(e=>'<tr><td><div class="pn">'+esc(e.buyer)+'</div>'+
        '<div class="pa">'+esc(e.dt)+' · grade '+esc(e.grade)+(e.synced?'':' · queued')+'</div></td>'+
        '<td class="num">'+nf(e.kg)+' kg<div class="exphint">'+rm(e.pricePerKg)+'/kg</div></td>'+
        '<td class="num"><b>'+(SHOW_VALUES?rm(e.amount):'—')+'</b></td></tr>').join('')+'</table></div>')
      :'<div class="alertnone">No sale logged yet.</div>')+
    '<div class="sec" style="margin-top:14px">Collected and ready</div>'+
    (collectedRows().length?('<div class="tblwrap" style="max-height:240px"><table class="tbl">'+
      '<tr><th>Day</th><th>Grade</th><th class="num">Fruit</th><th class="num">Est. kg</th></tr>'+
      collectedRows().slice(0,20).map(r=>'<tr><td>'+esc(r.date)+'</td><td>'+esc(r.grade)+'</td>'+
        '<td class="num">'+nf(r.n)+'</td><td class="num"><b>'+nf(Math.round(r.kg))+'</b></td></tr>').join('')+'</table></div>')
      :'<div class="alertnone">Nothing collected yet — sales become available as workers log drops.</div>')+
    '<p class="small">Weight is estimated from the clone averages the app already uses. Sales are logged '+
    'against fruit that has actually been collected, so the two can never disagree.</p>';}
let saleWarned=false;
function saleQueue(){return EVENTS.filter(e=>e.type==='SALE'&&!e.synced);}
function q7(){return saleQueue().length;}
async function pushSales(){
  return pushOwnKey(saleQueue(),'sales','sales',
    m=>{if(!saleWarned){saleWarned=true;toast(m,1);}},
    'Sales kept on this phone — update the Apps Script to add the SALES tab');}

// ================= v3.2 MARKETING · RETAILER RECORD CARD ==============================
// Option A, locked in. The Marketing tile opens on a LIST of retailer cards. Tapping one
// opens that retailer's isolated transaction profile: their details, their live prepaid
// credit, the Add Basket scale form, and their own invoices — nothing about any other
// buyer is on the screen while you are working on this one.
//
// Nothing here is a stored balance. `current_credit_balance_rm` is DERIVED from opening
// credit + top-ups − dispatches, so it can never drift from the deliveries behind it, and
// a mistake is corrected with a signed credit adjustment, never by editing history.

function canSetPrice(){return myRole()==='OWNER';}          // retailers, credit, labour rate
/* v3.11 — the three SHARED settings (price matrix, basket tare, added trees) are written by
   the Owner OR Marketing, because Marketing is the one on the phone when the morning market
   moves and the Owner is out in the lot. Retailer credit and the labour rate stay Owner-only:
   widening those would hand out the money controls, which is not what was asked for.
   Added trees are Owner-write in practice — the MASTER DB screen is Owner-only — but every
   role READS all three, which is the whole point of the shared-settings channel. */
function canSetShared(){return FULL_ROLES.indexOf(myRole())>=0;}
function canDispatch(){return FULL_ROLES.indexOf(myRole())>=0;}   // Owner + Marketing only
async function persistRetailers(){
  if(db){await put('kv',{k:'retailers',v:RETAILERS});await put('kv',{k:'retdirty',v:RET_DIRTY});}}
async function persistPrices(){
  if(db){await put('kv',{k:'cloneprice',v:CLONE_PRICE});
         await put('kv',{k:'pricemeta',v:PRICE_META});}}
async function persistBaskets(){
  if(db){await put('kv',{k:'baskets',v:BASKETS});await put('kv',{k:'tareok',v:TARE_VERIFIED});}}

// ---- the contract price matrix -------------------------------------------------------
/** Deep copy of a clone x grade table — the seed must never be mutated by an edit. */
function priceMatrixCopy(src){const o={};Object.keys(src||{}).forEach(c=>{o[c]=Object.assign({},src[c]);});return o;}
/** Only the letters that clone is actually sorted into. BT / B24 / 101 / UM have no C. */
function gradesFor(clone){return CLONE_GRADES[clone]||['A','B'];}
function hasGrade(clone,g){return gradesFor(clone).indexOf(g)>=0;}
function bandOf(clone,g){return (GRADE_BAND[clone]||{})[g]||null;}
function bandText(clone,g){
  const b=bandOf(clone,g); if(!b)return'';
  if(b.max==null)return '≥ '+nf(b.min)+' kg';
  if(!b.min)      return '< '+nf(b.max)+' kg';
  return nf(b.min)+' – <'+nf(b.max)+' kg';}
/** The same window, short enough to survive a half-width phone dropdown. */
function bandShort(clone,g){
  const b=bandOf(clone,g); if(!b)return'';
  if(b.max==null)return '≥'+nf(b.min)+'kg';
  if(!b.min)      return '<'+nf(b.max)+'kg';
  return nf(b.min)+'–'+nf(b.max)+'kg';}
/** Which letter an individual fruit of this weight falls in, for the scale hint. */
function gradeForWeight(clone,kg){
  kg=+kg||0; const gs=gradesFor(clone);
  for(let i=0;i<gs.length;i++){const b=bandOf(clone,gs[i]); if(!b)continue;
    if(kg>=b.min&&(b.max==null||kg<b.max))return gs[i];}
  return gs[gs.length-1]||'';}
/** Deep copy of the whole contract book — the seed must never be mutated by an edit. */
function contractBookCopy(src){
  const o={};
  Object.keys(src||{}).forEach(rid=>{o[rid]=priceMatrixCopy(src[rid]);});
  return o;}

/* ---- v3.6 · the multi-merchant contract engine ---------------------------------------
   Two kinds of buyer, and the difference matters commercially:

     CONTRACT  rates were negotiated and signed. They live in RET_CONTRACT under that
               merchant's id, and the Owner's daily market-trend panel does NOT reach
               them — otherwise a morning trend move would silently rewrite a signed
               contract and the farm would invoice at a rate nobody agreed to.
     SPOT      no contract. The invoice is built from CLONE_PRICE, the matrix the Owner
               moves every morning. 'Default Cash' is exactly this: a walk-in buyer at
               today's market rate.

   Every screen that shows money resolves through priceOf(clone, grade, retailerId).
   Called with no retailer it falls back to the spot matrix, which is what every
   pre-v3.6 call site did — so nothing that already worked changes meaning.            */
function pricingModeOf(id){
  const r=retailerById(id);
  if(!r)return 'SPOT';
  return String(r.pricing||'SPOT').toUpperCase()==='CONTRACT'?'CONTRACT':'SPOT';}
function isContractRetailer(id){return pricingModeOf(id)==='CONTRACT';}
/** That merchant's own book, created empty on first read so the editor has somewhere
 *  to write. Never returns the shared spot matrix by accident. */
function contractOf(id){
  if(!id)return null;
  if(!RET_CONTRACT[id])RET_CONTRACT[id]={};
  return RET_CONTRACT[id];}
/** The whole visible ladder for one merchant, used by the editor and the receipt. */
function priceTableFor(id){
  const out={};
  CLONE_SELL_ORDER.forEach(c=>{out[c]={};
    gradesFor(c).forEach(g=>{out[c][g]=priceOf(c,g,id);});});
  return out;}

/* Passed as the merchant when a screen must produce WEIGHT AND NOTHING ELSE — the
   worker's Morning Scale form. '' cannot be used for this: '' means "no merchant named",
   which correctly falls through to the spot matrix, and a worker's phone would then be
   holding live prices it is not entitled to. An explicit sentinel says what is meant. */
const NO_PRICE='__WEIGHT_ONLY__';

/** THE price lookup. Everything that touches money goes through here. */
function priceOf(clone,g,retailerId){
  if(retailerId===NO_PRICE)return 0;
  if(!hasGrade(clone,g))return 0;
  if(retailerId&&isContractRetailer(retailerId)){
    const row=(RET_CONTRACT[retailerId]||{})[clone]||{};
    const v=+(row[g]||0);
    if(v>0)return v;
    // A contract with a hole in it must NOT quietly fall through to the spot rate — that
    // is how a farm invoices Grade C at a price the buyer never agreed to. Zero here is
    // deliberate: the scale form refuses the line and names the missing rate.
    return 0;}
  const row=CLONE_PRICE[clone]||{}; return +(row[g]||0);}
/** The seeded figure, for the "reset to agreed rate" control in the editor. */
function basePriceOf(clone,g,retailerId){
  if(!hasGrade(clone,g))return 0;
  if(retailerId&&isContractRetailer(retailerId)){
    const row=(RETAILER_CONTRACT_SEED[retailerId]||{})[clone]||{};
    return +(row[g]||0);}
  const row=CLONE_PRICE_SEED[clone]||{}; return +(row[g]||0);}
async function persistContracts(){
  if(db)await put('kv',{k:'retcontract',v:RET_CONTRACT});}
async function persistLabourRate(){
  if(db){await put('kv',{k:'labrate',v:LABOUR_RATE});await put('kv',{k:'labrateok',v:LABOUR_RATE_OK});}}

// ---- baskets and tare ----------------------------------------------------------------
function basketById(id){return BASKETS.find(b=>String(b.id)===String(id))||BASKETS[0]||{id:'NONE',name:'Loose',tare_kg:0};}
function tareOf(id){return +(basketById(id).tare_kg||0);}

// ---- retailers and derived credit ----------------------------------------------------
function retailerById(id){return RETAILERS.find(r=>String(r.id)===String(id))||null;}
/** Everything still on the books — suspended included. Used by the master list. */
function listedRetailers(){return RETAILERS.filter(r=>String(r.status||'Active').toLowerCase()!=='deleted');}
/** Only those you may actually invoice today. A suspended buyer keeps their history
 *  but disappears from the dispatch list — nothing is ever deleted. */
function activeRetailers(){return RETAILERS.filter(r=>String(r.status||'Active')==='Active');}
function suspendedRetailers(){return RETAILERS.filter(r=>String(r.status||'Active')==='Suspended');}
function dispatchEvents(id){
  return EVENTS.filter(e=>e.type==='DISPATCH'&&(!id||String(e.retailer_id)===String(id)));}
function topupEvents(id){
  return EVENTS.filter(e=>e.type==='CREDIT_TOPUP'&&(!id||String(e.retailer_id)===String(id)));}
function retailerSpend(id){return dispatchEvents(id).reduce((s,e)=>s+(+e.total_value_rm||0),0);}
function retailerTopup(id){return topupEvents(id).reduce((s,e)=>s+(+e.amount_rm||0),0);}
/** The live credit figure, named exactly as the schema calls it. */
function retailerCredit(id){
  const r=retailerById(id); if(!r)return 0;
  return +((+r.opening_credit_rm||0)+retailerTopup(id)-retailerSpend(id)).toFixed(2);}
function retailerLedger(id){
  const r=retailerById(id); if(!r)return null;
  return {retailer_id:r.id, name:r.name, contact:r.contact||'',
    status:String(r.status||'Active'),
    pricing:pricingModeOf(id),
    opening_credit_rm:+r.opening_credit_rm||0,
    topped_up_rm:retailerTopup(id), invoiced_rm:retailerSpend(id),
    current_credit_balance_rm:retailerCredit(id),
    deliveries:dispatchEvents(id).length};}

// ---- invoice serialisation -----------------------------------------------------------
/** `INV-YYYYMMDD-XXX`, restarting at 001 each calendar day. */
function invoiceDay(dt){return String(dt||now()).slice(0,10).replace(/-/g,'');}
function invoicePrefix(dt){return INVOICE_PREFIX+'-'+invoiceDay(dt)+'-';}
function nextInvoiceSerial(dt){
  const pre=invoicePrefix(dt); let max=0;
  EVENTS.forEach(e=>{
    if(e.type!=='DISPATCH')return;
    const s=String(e.invoice_no||'');
    if(s.indexOf(pre)!==0)return;
    const n=parseInt(s.slice(pre.length),10);
    if(!isNaN(n)&&n>max)max=n;});
  return pre+String(max+1).padStart(3,'0');}
/** Two phones can both be offline at 07:00 and both allocate ...-003. The serial format
 *  is fixed by the buyer's paperwork so we do not mangle it — instead the ledger flags
 *  any serial that ended up on two different loads, and the Owner reissues one. */
function duplicateSerials(){
  const seen={}, dup={};
  dispatchEvents().forEach(e=>{const s=String(e.invoice_no||''); if(!s)return;
    if(seen[s]&&seen[s]!==e.uuid)dup[s]=true; else seen[s]=e.uuid;});
  return dup;}

/**
 * `marketing_delivery_ledger` — one immutable row per confirmed dispatch, oldest first,
 * carrying the credit balance as it stood AFTER that row. The balance is recomputed
 * here rather than read off the event, so a dispatch that syncs in late from another
 * phone slots into the right place in the running balance instead of corrupting it.
 */
function marketingDeliveryLedger(){
  const rows=EVENTS.filter(e=>e.type==='DISPATCH'||e.type==='CREDIT_TOPUP')
    .slice().sort((a,b)=>String(a.dt)<String(b.dt)?-1:(String(a.dt)>String(b.dt)?1:0));
  const bal={};
  RETAILERS.forEach(r=>{bal[r.id]=+r.opening_credit_rm||0;});
  const out=[];
  rows.forEach(e=>{
    const id=e.retailer_id;
    if(bal[id]===undefined)bal[id]=0;
    if(e.type==='CREDIT_TOPUP'){
      bal[id]=+(bal[id]+(+e.amount_rm||0)).toFixed(2);
      out.push({kind:'TOPUP',uuid:e.uuid,invoice_no:'',timestamp:e.dt,retailer_id:id,
        retailer_name:e.retailer_name||(retailerById(id)||{}).name||id,
        kg_A:0,kg_B:0,kg_C:0,total_kg:0,total_order_value_rm:-(+e.amount_rm||0),
        remaining_credit_balance_rm:bal[id],note:e.note||'',by:e.worker||'',
        over_credit:false,synced:!!e.synced});
      return;}
    bal[id]=+(bal[id]-(+e.total_value_rm||0)).toFixed(2);
    out.push({kind:'DISPATCH',uuid:e.uuid,invoice_no:e.invoice_no||'',timestamp:e.dt,retailer_id:id,
      retailer_name:e.retailer_name||(retailerById(id)||{}).name||id,
      kg_A:+e.kg_A||0,kg_B:+e.kg_B||0,kg_C:+e.kg_C||0,total_kg:+e.total_kg||0,
      total_order_value_rm:+e.total_value_rm||0,
      remaining_credit_balance_rm:bal[id],note:e.note||'',by:e.worker||'',
      over_credit:!!e.over_credit,synced:!!e.synced});});
  return out.reverse();}                                   // newest first for the screen
/** The true credit left after a given dispatch, recomputed — used on the receipt. */
function creditAfterUuid(u){
  const row=marketingDeliveryLedger().find(x=>x.uuid===u);
  return row?row.remaining_credit_balance_rm:0;}

// ======================= THE SCALE FORM ==============================================
// One line per basket load: clone, grade, basket type, how many baskets, the GROSS
// reading, and optionally how many fruits are in it. Tare comes off automatically.
let DLINES=[], DLSEQ=0, DNOTE='';
let OVR_OK=false, OVR_BY='', LAST_INVOICE_UUID='';
let MKT_SEL='';                       // '' = the retailer list; else the open record card
function newDispLine(){
  return {k:'L'+(++DLSEQ),clone:'MK',grade:'A',basket:'RED',baskets:1,gross:'',fruits:''};}
function dispLines(){ if(!DLINES.length)DLINES=[newDispLine()]; return DLINES; }
function dlFind(k){return DLINES.find(l=>l.k===k)||null;}

/** Everything money-related about one scale line, in one place.
 *  v3.6 — the price now depends on WHO is buying, so the merchant travels in. Omitted,
 *  it falls back to the retailer whose card is open, which is what every v3.1 call site
 *  meant when there was only one contract book. */
function lineCalc(l,retId){
  const rid=(retId===undefined?MKT_SEL:retId)||'';
  const baskets=Math.max(0,Math.floor(+l.baskets||0));
  const tare  =+((tareOf(l.basket)*baskets).toFixed(3));
  const gross =Math.max(0,+l.gross||0);
  const net   =+(Math.max(0,gross-tare).toFixed(2));
  const price =priceOf(l.clone,l.grade,rid);
  const value =+((net*price).toFixed(2));
  const fruits=Math.max(0,Math.floor(+l.fruits||0));
  const avg   =(fruits>0&&net>0)?+((net/fruits).toFixed(2)):0;
  const sugg  =avg>0?gradeForWeight(l.clone,avg):'';
  return {baskets,tare,gross,net,price,value,fruits,avg,sugg};}

/** v3.6 — totals for a set of scale lines priced against ONE merchant. `src` lets the
 *  worker's Morning Scale form and the Marketer's verification hub reuse the identical
 *  arithmetic instead of growing a second, drifting copy of it. */
function dispTotals(retId,src){
  let gross=0,tare=0,net=0,val=0,fruits=0;
  const byGrade={A:0,B:0,C:0}, lines=[];
  const rid=(retId===undefined?MKT_SEL:retId)||'';
  (src||dispLines()).forEach(l=>{
    const c=lineCalc(l,rid);
    if(!(c.net>0))return;
    gross+=c.gross; tare+=c.tare; net+=c.net; val+=c.value; fruits+=c.fruits;
    byGrade[l.grade]=+((byGrade[l.grade]||0)+c.net).toFixed(2);
    lines.push({clone:l.clone,clone_name:CLONE_NAME[l.clone]||l.clone,grade:l.grade,
      band:bandText(l.clone,l.grade),
      basket:l.basket,basket_name:basketById(l.basket).name,baskets:c.baskets,
      gross_kg:c.gross,tare_kg:c.tare,net_kg:c.net,
      price_rm:c.price,value_rm:c.value,fruits:c.fruits,avg_fruit_kg:c.avg});});
  return {lines:lines, fruit_count:fruits,
    total_gross_kg:+gross.toFixed(2), total_tare_kg:+tare.toFixed(2),
    total_kg:+net.toFixed(2), total_value_rm:+val.toFixed(2),
    kg_A:+(byGrade.A||0).toFixed(2), kg_B:+(byGrade.B||0).toFixed(2), kg_C:+(byGrade.C||0).toFixed(2)};}

function dlSet(k,field,v){
  const l=dlFind(k); if(!l)return;
  l[field]=v;
  if(field==='clone'&&!hasGrade(l.clone,l.grade))l.grade=gradesFor(l.clone)[0];
  if(field==='clone'||field==='basket'){renderDispLines();}
  dispCalc();}
function addDispLine(){ DLINES.push(newDispLine()); renderDispLines(); dispCalc(); }
function removeDispLine(k){
  DLINES=DLINES.filter(l=>l.k!==k);
  if(!DLINES.length)DLINES=[newDispLine()];
  renderDispLines(); dispCalc();}

function renderDispLines(){
  const box=$('dp-rows'); if(!box)return;
  box.innerHTML=dispLines().map((l,i)=>{
    const gs=gradesFor(l.clone);
    return '<div class="dline" id="dl-'+esc(l.k)+'">'+
      '<div class="dlhead"><span class="dltag">BASKET '+(i+1)+'</span>'+
      (dispLines().length>1?'<span class="dlx" onclick="removeDispLine(\''+esc(l.k)+'\')">remove</span>':'')+'</div>'+
      '<div class="dl3">'+
        '<div><label>Clone</label><select onchange="dlSet(\''+esc(l.k)+'\',\'clone\',this.value)">'+
          CLONE_SELL_ORDER.map(c=>'<option value="'+esc(c)+'"'+(c===l.clone?' selected':'')+'>'+
            esc(CLONE_NAME[c]||c)+' ('+esc(c)+')</option>').join('')+'</select></div>'+
        '<div><label>Grade</label><select onchange="dlSet(\''+esc(l.k)+'\',\'grade\',this.value)">'+
          gs.map(g=>'<option value="'+g+'"'+(g===l.grade?' selected':'')+'>'+g+' · '+
            esc(bandShort(l.clone,g))+'</option>').join('')+'</select></div>'+
      '</div>'+
      '<div class="dl3">'+
        '<div><label>Basket type</label><select onchange="dlSet(\''+esc(l.k)+'\',\'basket\',this.value)">'+
          BASKETS.map(b=>'<option value="'+esc(b.id)+'"'+(b.id===l.basket?' selected':'')+'>'+
            (b.ic?b.ic+' ':'')+esc(b.name)+' −'+nf(b.tare_kg)+' kg</option>').join('')+'</select></div>'+
        '<div><label>How many baskets</label><input type="number" min="0" step="1" inputmode="numeric" '+
          'value="'+esc(l.baskets)+'" oninput="dlSet(\''+esc(l.k)+'\',\'baskets\',this.value)"></div>'+
      '</div>'+
      '<div class="dl3">'+
        '<div><label>GROSS on scale (kg)</label><input type="number" min="0" step="any" inputmode="decimal" '+
          'placeholder="0.00" value="'+esc(l.gross)+'" oninput="dlSet(\''+esc(l.k)+'\',\'gross\',this.value)"></div>'+
        '<div><label>Fruit count (optional)</label><input type="number" min="0" step="1" inputmode="numeric" '+
          'placeholder="0" value="'+esc(l.fruits)+'" oninput="dlSet(\''+esc(l.k)+'\',\'fruits\',this.value)"></div>'+
      '</div>'+
      '<div class="dlnet" id="dln-'+esc(l.k)+'">—</div>'+
      '<div class="dlwarn" id="dlw-'+esc(l.k)+'"></div>'+
    '</div>';}).join('');}

function renderLineTotals(){
  dispLines().forEach(l=>{
    const c=lineCalc(l), n=$('dln-'+l.k), w=$('dlw-'+l.k);
    if(n)n.innerHTML='Gross '+nf(c.gross)+' kg − tare '+nf(c.tare)+' kg = NET <b>'+nf(c.net)+
      ' kg</b> × '+rm(c.price)+'/kg<span class="v">'+rm(c.value)+'</span>';
    if(w){
      const bits=[];
      if(!(c.price>0)&&c.net>0)
        bits.push('⚠ No '+(isContractRetailer(MKT_SEL)?'contract':'spot')+' rate for '+
                  esc(CLONE_NAME[l.clone]||l.clone)+' Grade '+l.grade+
                  (isContractRetailer(MKT_SEL)
                    ?(' in '+esc((retailerById(MKT_SEL)||{}).name||'')+'’s contract — the Owner sets it in PRICES & RETAILERS.')
                    :' — the Owner sets it in PRICES & RETAILERS.'));
      if(c.gross>0&&c.net<=0)
        bits.push('⚠ The basket tare is equal to or heavier than the gross reading — check the scale.');
      if(c.avg>0){
        bits.push('Average fruit '+nf(c.avg)+' kg → that falls in <b>Grade '+c.sugg+'</b>'+
          (c.sugg!==l.grade?' , not Grade '+l.grade+'. Re-check the sort before dispatching.':' ✓'));}
      w.innerHTML=bits.join('<br>');}});
  // the placeholder-tare warning is a standing condition, not a per-line one — it belongs
  // once above the lines, or it shouts the same sentence at every basket on the screen.
  const tw=$('dp-tarewarn');
  if(tw)tw.innerHTML=(!TARE_VERIFIED&&dispLines().some(l=>tareOf(l.basket)>0))
    ? '<div class="tarewarn">⚠ Basket tare weights are still the factory placeholders. Put an EMPTY '+
      'basket on the scale and set the real figures in PRICES &amp; RETAILERS — until then every net '+
      'weight on this screen may be wrong.</div>' : '';}

function dispCalc(){
  if(!MKT_SEL)return;
  renderLineTotals();
  const t=dispTotals(), id=MKT_SEL;
  const inv=$('dp-inv');
  if(inv)inv.innerHTML=(t.lines.length
      ? t.lines.map(x=>'<div class="ir"><span class="lbl">'+esc(x.clone_name)+' · Grade '+x.grade+
          ' — '+nf(x.net_kg)+' kg × '+rm(x.price_rm)+'</span><span>'+rm(x.value_rm)+'</span></div>').join('')
      : '<div class="ir"><span class="lbl">No weight keyed yet</span><span>—</span></div>')+
    '<div class="ir"><span class="lbl">Gross '+nf(t.total_gross_kg)+' kg − basket tare '+
      nf(t.total_tare_kg)+' kg</span><span>NET '+nf(t.total_kg)+' kg</span></div>'+
    '<div class="ir tot"><span>TOTAL INVOICE VALUE</span><span>'+rm(t.total_value_rm)+'</span></div>';
  const nb=$('dp-invno');
  if(nb)nb.innerHTML='Next invoice serial: <b>'+esc(nextInvoiceSerial())+'</b>';
  const cb=$('dp-credit'), ab=$('disp-alert'), go=$('dp-go');
  const before=retailerCredit(id), after=+((before-t.total_value_rm).toFixed(2));
  const r=retailerById(id)||{};
  const short=after<CREDIT_FLOOR_RM;
  if(cb){cb.className='credok'+(short?' credlow':'');
    cb.innerHTML='Credit now <b>'+rm(before)+'</b>'+
      (t.total_value_rm?(' → after this dispatch <b>'+rm(after)+'</b>'):'');}
  if(ab)ab.innerHTML=short
    ? '<div class="critbox flash">CRITICAL: Insufficient Retailer Credit for Dispatch!<br>'+
      '<span style="font-weight:700;font-size:11.5px">'+esc(r.name||id)+' holds '+rm(before)+
      ' but this load is worth '+rm(t.total_value_rm)+' — it would leave '+rm(after)+'.</span></div>'
    : '';
  renderOverrideBox(short,r,before,after,t.total_value_rm);
  if(go){
    const locked=short&&!OVR_OK;
    go.disabled=locked;
    go.textContent=locked?'🔒 LOCKED — CREDIT EXCEEDED'
      :(short?'✓ CONFIRM DISPATCH (OVERRIDE)':'✓ CONFIRM DISPATCH & INVOICE');}}

// ---- admin overdraft override --------------------------------------------------------
function renderOverrideBox(short,r,before,after,val){
  const box=$('dp-ovrbox'); if(!box)return;
  if(!short){box.innerHTML='';return;}
  if(OVR_OK){
    box.innerHTML='<div class="ovrok">🔓 ADMIN OVERRIDE ACTIVE — authorised by '+esc(OVR_BY)+
      '.<br><span style="font-weight:600">Confirming will take '+esc(r.name||'')+
      ' to '+rm(after)+' and flag the account as overdrawn until it is settled.</span></div>';
    return;}
  box.innerHTML='<div class="ovrbox">'+
    '<div style="font-weight:900;font-size:12.5px;color:#8c1d18">🔒 Checkout locked</div>'+
    '<div class="small" style="margin-top:4px">This load is worth '+rm(val)+' and '+esc(r.name||'')+
      ' only holds '+rm(before)+'. The Owner may release it by keying their 6-digit access key below; '+
      'the account then goes into negative tracking and shows as overdrawn everywhere.</div>'+
    '<label style="margin-top:8px">Admin Password Override</label>'+
    '<input type="password" id="dp-ovr" inputmode="numeric" maxlength="6" autocomplete="off" '+
      'placeholder="••••••" oninput="if(this.value.length===6)tryOverride()">'+
    '<div class="pinerr" id="dp-ovrerr"></div>'+
    '<button class="bigbtn ghost" style="margin-top:6px;padding:11px;font-size:13px" '+
      'onclick="tryOverride()">🔓 UNLOCK DISPATCH</button>'+
  '</div>';}
function tryOverride(){
  const el=$('dp-ovr'), er=$('dp-ovrerr'); if(!el)return;
  const k=findKey(String(el.value||'').trim());
  if(!k||k.role!=='OWNER'||String(k.status).toLowerCase()!=='active'){
    if(er)er.textContent='That is not an active Owner access key.';
    el.value=''; return;}
  OVR_OK=true; OVR_BY=k.name;
  toast('🔓 Override authorised by '+k.name);
  dispCalc();}
function clearOverride(){OVR_OK=false;OVR_BY='';}

// ======================= OPTION A · THE RECORD CARD ==================================
function openRetailerCard(id){
  if(!retailerById(id))return;
  MKT_SEL=id; clearOverride(); DLINES=[newDispLine()]; DNOTE='';
  renderDispatch();
  const s=$('scr-dash'); if(s)s.scrollTop=0;}
function backToRetailers(){ MKT_SEL=''; clearOverride(); renderDispatch();
  const s=$('scr-dash'); if(s)s.scrollTop=0;}

function renderDispatch(){
  const stage=$('dp-stage'); if(!stage)return;
  if(!canDispatch()){stage.innerHTML='';MKT_SEL='';return;}
  if(MKT_SEL&&!retailerById(MKT_SEL))MKT_SEL='';
  if(!MKT_SEL){stage.innerHTML=retailerListHtml();return;}
  stage.innerHTML=retailerCardHtml(MKT_SEL);
  renderDispLines();
  dispCalc();
  renderReceiptBox();}

function retailerListHtml(){
  const own=canSetPrice(), act=activeRetailers(), susp=suspendedRetailers();
  return '<div class="sec">🚚 Retailers — tap a card to weigh and invoice</div>'+
    (act.length? act.map(r=>{
        const c=retailerLedger(r.id), low=c.current_credit_balance_rm<CREDIT_FLOOR_RM;
        return '<div class="retcard'+(low?' over':'')+'" onclick="openRetailerCard(\''+esc(r.id)+'\')">'+
          '<div class="rc-top"><div><div class="rc-name">'+esc(r.name)+'</div>'+
            '<div class="rc-sub">'+esc(r.id)+' · '+esc(r.contact||'no contact')+'</div></div>'+
            '<span class="cstat '+(low?'r':'a')+'">'+(low?'OVERDRAWN':'ACTIVE')+'</span></div>'+
          '<div class="credtile'+(low?' over':'')+'"><div class="l">LIVE PREPAID CREDIT</div>'+
            '<div class="v">'+(SHOW_VALUES?rm(c.current_credit_balance_rm):'— — —')+'</div></div>'+
          '<div class="rc-foot">'+c.deliveries+' deliver'+(c.deliveries===1?'y':'ies')+
            ' · invoiced '+(SHOW_VALUES?rm(c.invoiced_rm):'—')+
            '<span class="rc-go">OPEN ›</span></div></div>';}).join('')
      :'<div class="alertnone">No active retailer yet.'+(own?' Tap ADD RETAILER below.':'')+'</div>')+
    (own?'<button class="bigbtn ghost" style="padding:13px;font-size:14px" onclick="openRetForm(\'\')">＋ ADD RETAILER</button>':'')+
    (susp.length?('<div class="sec" style="margin-top:15px">Suspended — history kept, cannot be invoiced</div>'+
      susp.map(r=>{const c=retailerLedger(r.id);
        return '<div class="retcard susp"><div class="rc-top"><div><div class="rc-name">'+esc(r.name)+'</div>'+
          '<div class="rc-sub">'+esc(r.id)+' · '+c.deliveries+' past deliver'+(c.deliveries===1?'y':'ies')+
          ' · credit '+(SHOW_VALUES?rm(c.current_credit_balance_rm):'—')+'</div></div>'+
          '<span class="cstat s">SUSPENDED</span></div>'+
          (own?'<div class="rc-foot"><span class="linkish" onclick="openRetForm(\''+esc(r.id)+
            '\')">reactivate or edit</span></div>':'')+'</div>';}).join(''))
      :'')+
    '<p class="small">A retailer is never deleted. Suspending takes them off this list but keeps every '+
    'invoice they ever received, so the ledger still adds up.</p>';}

/** v3.6 — which price book this screen is working from, stated before a single kg is
 *  keyed. The commonest costly mistake on a two-merchant farm is invoicing one buyer at
 *  the other's rates, and it is invisible unless the screen says so out loud. */
function contractBanner(id){
  const r=retailerById(id); if(!r)return '';
  const contract=isContractRetailer(id);
  const tbl=priceTableFor(id);
  const bits=CLONE_SELL_ORDER.filter(c=>gradesFor(c).some(g=>tbl[c][g]>0))
    .map(c=>esc(c)+' '+gradesFor(c).filter(g=>tbl[c][g]>0)
      .map(g=>g+' '+nf(tbl[c][g])).join(' / '));
  const holes=[];
  CLONE_SELL_ORDER.forEach(c=>gradesFor(c).forEach(g=>{if(!(tbl[c][g]>0))holes.push(c+' '+g);}));
  return '<div class="ctrbanner '+(contract?'ctr':'spot')+'">'+
    '<div class="ctrhead">'+(contract?'📜 CONTRACT PRICING':'📈 DAILY SPOT PRICING')+
      ' · '+esc(r.name)+'</div>'+
    '<div class="ctrbody">'+(contract
      ? 'These are '+esc(r.name)+'’s own negotiated rates. The Owner’s daily market-trend '+
        'panel does not move them.'
      : 'No contract on file — this load prices at today’s market rate from the Owner’s '+
        'trend panel, and it changes when the Owner changes it.')+'</div>'+
    (SHOW_VALUES&&bits.length?('<div class="ctrrates">'+bits.join(' · ')+' <span class="ctrunit">RM/kg</span></div>'):'')+
    (holes.length?('<div class="ctrhole">⚠ No rate for '+esc(holes.join(', '))+
      ' — a basket of those cannot be invoiced until the Owner sets it.</div>'):'')+
    '</div>';}

function retailerCardHtml(id){
  const r=retailerById(id), c=retailerLedger(id), own=canSetPrice();
  const low=c.current_credit_balance_rm<CREDIT_FLOOR_RM;
  const mine=dispatchEvents(id).slice()
    .sort((a,b)=>String(a.dt)<String(b.dt)?1:(String(a.dt)>String(b.dt)?-1:0)).slice(0,8);
  const dup=duplicateSerials();
  return '<div class="rc-back" onclick="backToRetailers()">‹ ALL RETAILERS</div>'+

    // ---- the profile head: who they are, what they hold ----
    '<div class="profile'+(low?' over':'')+'">'+
      '<div class="rc-name big">'+esc(r.name)+'</div>'+
      '<div class="rc-sub">'+esc(r.id)+' · '+esc(r.contact||'no contact recorded')+
        (r.status==='Suspended'?' · <b>SUSPENDED</b>':'')+'</div>'+
      '<div class="credtile big'+(low?' over':'')+'">'+
        '<div class="l">LIVE PREPAID CREDIT BALANCE</div>'+
        '<div class="v">'+(SHOW_VALUES?rm(c.current_credit_balance_rm):'— — —')+'</div>'+
        '<div class="w">opening '+rm(c.opening_credit_rm)+' + top-ups '+rm(c.topped_up_rm)+
          ' − invoiced '+rm(c.invoiced_rm)+'</div></div>'+
      (own?('<div class="rc-acts">'+
        '<span class="linkish" onclick="openRetForm(\''+esc(id)+'\')">✏️ edit details</span>'+
        '<span class="linkish" onclick="topUpRetailer(\''+esc(id)+'\')">＋ post credit top-up</span>'+
        '</div>'):'')+
    '</div>'+

    // ---- the scale form ----
    (r.status==='Suspended'
      ? '<div class="critbox" style="margin-top:14px">This retailer is suspended and cannot be invoiced. '+
        'Reactivate them in ✏️ edit details first.</div>'
      : ('<div class="sec" style="margin-top:15px">⚖️ Add basket — morning weighing</div>'+
    contractBanner(id)+
    '<div class="convnote" id="dp-invno">—</div>'+
    '<div id="disp-alert"></div>'+
    '<div id="dp-credit" class="credok">—</div>'+
    '<div id="dp-tarewarn"></div>'+
    '<div id="dp-rows"></div>'+
    '<button class="bigbtn ghost" style="padding:12px;font-size:13.5px" onclick="addDispLine()">＋ ADD ANOTHER BASKET</button>'+
    '<div class="invbox" id="dp-inv"></div>'+
    '<label>Note (optional)</label>'+
    '<input id="dp-note" placeholder="e.g. lorry BKS 4412, driver Amin" value="'+esc(DNOTE)+
      '" oninput="DNOTE=this.value">'+
    '<div id="dp-ovrbox"></div>'+
    '<div class="pinerr" id="dp-err"></div>'+
    '<button class="bigbtn" id="dp-go" onclick="saveDispatch()">✓ CONFIRM DISPATCH &amp; INVOICE</button>'+
    '<div id="dp-receipt"></div>'))+

    // ---- this retailer's own invoices, nobody else's ----
    '<div class="sec" style="margin-top:17px">🧾 '+esc(r.name)+'’s invoices</div>'+
    (mine.length?('<div class="tblwrap"><table class="tbl">'+
      '<tr><th>Invoice</th><th class="num">Net kg</th><th class="num">Value</th><th></th></tr>'+
      mine.map(e=>'<tr><td><div class="pn">'+
        (e.invoice_no?('<span class="invno">'+esc(e.invoice_no)+'</span>'):'—')+
        (e.over_credit?' <span class="cstat r">OVERRIDE</span>':'')+
        (dup[e.invoice_no]?' <span class="cstat r">DUP</span>':'')+'</div>'+
        '<div class="pa">'+esc(e.dt)+(e.synced?'':' · queued')+'</div></td>'+
        '<td class="num">'+nf(e.total_kg)+'</td>'+
        '<td class="num"><b>'+(SHOW_VALUES?rm(e.total_value_rm):'—')+'</b></td>'+
        '<td class="num"><span class="linkish" onclick="copyReceipt(\''+esc(e.uuid)+'\')">📋</span></td></tr>').join('')+
      '</table></div>')
      :'<div class="alertnone">No invoice for this retailer yet.</div>')+
    '<p class="small">Only this retailer’s transactions appear on this card. Every row is immutable — a '+
    'wrong weight is corrected with a credit adjustment, never by editing the invoice.</p>';}

// ---- confirm -------------------------------------------------------------------------
let savingDisp=false;
async function saveDispatch(){
  const err=$('dp-err'); if(err)err.textContent='';
  if(savingDisp)return;
  if(!canDispatch()){toast('Only the Owner or Marketing can dispatch',1);return;}
  const id=MKT_SEL, r=retailerById(id);
  if(!r){if(err)err.textContent='Open a retailer card first.';return;}
  if(String(r.status||'Active')!=='Active'){if(err)err.textContent='This retailer is suspended.';return;}
  const t=dispTotals();
  if(!(t.total_kg>0)){err.textContent='Key the gross scale reading for at least one basket.';return;}
  const unpriced=t.lines.filter(x=>!(x.price_rm>0));
  if(unpriced.length){err.textContent='No price is set for '+
    unpriced.map(x=>x.clone+' Grade '+x.grade).join(', ')+
    '. The Owner sets the per-KG prices in PRICES & RETAILERS.';return;}
  const avail=collectedKg()-soldKg();
  if(t.total_kg>avail&&!confirm('⚠ Only '+nf(Math.max(0,avail))+' kg of collected fruit is still undispatched.\n'+
     'Send '+nf(t.total_kg)+' kg anyway?'))return;
  const before=retailerCredit(id), after=+((before-t.total_value_rm).toFixed(2));
  const over=after<CREDIT_FLOOR_RM;
  if(over&&!OVR_OK){
    err.textContent='Credit exceeded. The Owner must key the 6-digit override to release this dispatch.';
    return;}
  if(over&&!confirm('ADMIN OVERRIDE — authorised by '+OVR_BY+'.\n\n'+r.name+' holds '+rm(before)+
    ' and this load is worth '+rm(t.total_value_rm)+'.\nConfirming leaves the account at '+rm(after)+
    ' (overdrawn).\n\nSend it?'))return;
  savingDisp=true;
  const u=uuid(), stamp=now(), serial=nextInvoiceSerial(stamp);
  try{
    await persistEvent({uuid:u,type:'DISPATCH',dt:stamp,
      invoice_no:serial,
      retailer_id:r.id, retailer_name:r.name, contact:r.contact||'',
      lines:t.lines, lines_json:JSON.stringify(t.lines), line_count:t.lines.length,
      kg_A:t.kg_A, kg_B:t.kg_B, kg_C:t.kg_C, fruit_count:t.fruit_count,
      total_gross_kg:t.total_gross_kg, total_tare_kg:t.total_tare_kg,
      total_kg:t.total_kg, total_value_rm:t.total_value_rm,
      credit_before_rm:before, credit_after_rm:after,
      over_credit:over, override_by:over?OVR_BY:'', override_at:over?stamp:'',
      note:DNOTE.trim(),
      worker:CFG.worker, workerId:CFG.uid||'', device:CFG.device, synced:false});
  } finally { savingDisp=false; }
  LAST_INVOICE_UUID=u;
  DLINES=[newDispLine()]; DNOTE='';
  clearOverride();
  badge(); renderDispatch(); renderMktLedger(); renderMarketing(); renderYieldAudit(); renderHub();
  toast('✓ '+serial+' · '+nf(t.total_kg)+' kg to '+r.name+' · '+rm(t.total_value_rm)+
    (navigator.onLine?'':' (queued)'));
  copyReceipt(u,true);}

// ======================= WHATSAPP RECEIPT ============================================
/** Robust clipboard write — the async API is blocked on plain http:// and inside some
 *  in-app browsers, so there is always the hidden-textarea fallback behind it. */
async function copyToClipboard(s){
  try{ if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(s);return true;} }catch(e){}
  try{
    const ta=document.createElement('textarea');
    ta.value=s; ta.setAttribute('readonly','');
    ta.style.position='fixed'; ta.style.top='0'; ta.style.left='0'; ta.style.opacity='0';
    document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0,s.length);
    const ok=document.execCommand('copy'); document.body.removeChild(ta); return ok;
  }catch(e){return false;}}

/** The lines of a dispatch, whether it was written by v3.1+ (clone lines) or v3.0
 *  (three blended A/B/C weights). An old row must still print a readable receipt. */
function receiptLines(e){
  if(Array.isArray(e.lines)&&e.lines.length)return e.lines;
  if(typeof e.lines_json==='string'&&e.lines_json){
    try{const p=JSON.parse(e.lines_json); if(Array.isArray(p)&&p.length)return p;}catch(x){}}
  return ['A','B','C'].filter(g=>+e['kg_'+g]>0).map(g=>({
    clone:'', clone_name:'Mixed', grade:g, band:'',
    basket:'', basket_name:'', baskets:0,
    gross_kg:+e['kg_'+g]||0, tare_kg:0, net_kg:+e['kg_'+g]||0,
    price_rm:+e['price_'+g]||0, value_rm:+e['value_'+g]||0, fruits:0, avg_fruit_kg:0}));}

function receiptText(e){
  if(!e)return '';
  const lines=receiptLines(e);
  const bal=creditAfterUuid(e.uuid);
  const L=[];
  L.push('🍈 *SUGUT DURIAN FARM* 🍈');
  L.push('━━━━━━━━━━━━━');
  L.push('🧾 Invoice: *'+(e.invoice_no||'—')+'*');
  L.push('🗓️ '+(e.dt||''));
  L.push('👤 Retailer: *'+(e.retailer_name||'')+'*'+(e.contact?(' ('+e.contact+')'):''));
  L.push('━━━━━━━━━━━━━');
  L.push('📦 *DELIVERY BREAKDOWN*');
  lines.forEach(x=>{
    L.push('• '+(x.clone_name||x.clone||'Mixed')+' · *Grade '+x.grade+'*'+
      (x.band?(' ('+x.band+')'):''));
    if(+x.tare_kg>0)
      L.push('   ⚖️ Gross '+nf(x.gross_kg)+' kg − tare '+nf(x.tare_kg)+' kg'+
        (x.basket_name?(' ('+x.baskets+'× '+x.basket_name+')'):''));
    L.push('   Net *'+nf(x.net_kg)+' kg* × '+rm(x.price_rm)+'/kg = *'+rm(x.value_rm)+'*'+
      (+x.fruits>0?('  · '+x.fruits+' fruits, avg '+nf(x.avg_fruit_kg)+' kg'):''));});
  L.push('━━━━━━━━━━━━━');
  if(+e.total_tare_kg>0)
    L.push('⚖️ Gross '+nf(e.total_gross_kg)+' kg − baskets '+nf(e.total_tare_kg)+' kg');
  L.push('⚖️ *TOTAL NET WEIGHT: '+nf(e.total_kg)+' kg*');
  L.push('💰 *TOTAL INVOICE: '+rm(e.total_value_rm)+'*');
  L.push('━━━━━━━━━━━━━');
  L.push('💳 Credit before: '+rm(e.credit_before_rm));
  L.push((bal<0?'🔴':'💳')+' *Credit balance: '+rm(bal)+'*');
  if(bal<CREDIT_FLOOR_RM)
    L.push('⚠️ *ACCOUNT OVERDRAWN — settlement required.*'+
      (e.override_by?(' Released by '+e.override_by+'.'):''));
  if(e.note)L.push('📝 Note: '+e.note);
  L.push('━━━━━━━━━━━━━');
  L.push('✅ Weighed & logged by '+(e.worker||'')+' · Sugut DMS');
  return L.join('\n');}

async function copyReceipt(u,quiet){
  const e=EVENTS.find(x=>x.uuid===u&&x.type==='DISPATCH');
  if(!e){toast('That invoice is not on this phone',1);return;}
  const txt=receiptText(e);
  const ok=await copyToClipboard(txt);
  if(ok){toast('📋 Receipt for '+(e.invoice_no||'')+' copied — paste it into WhatsApp');}
  else{
    const box=$('dp-receipt');
    if(box){box.innerHTML='<div class="sec" style="margin-top:12px">Receipt — copy this text</div>'+
      '<textarea class="rcpt" readonly onclick="this.select()">'+esc(txt)+'</textarea>'+
      '<div class="small">This browser blocked the clipboard. Tap the box, hold, and choose Copy.</div>';
      box.scrollIntoView({behavior:'smooth',block:'nearest'});}
    if(!quiet)toast('Clipboard blocked — the text is shown below',1);}}

function renderReceiptBox(){
  const box=$('dp-receipt'); if(!box)return;
  const e=LAST_INVOICE_UUID?EVENTS.find(x=>x.uuid===LAST_INVOICE_UUID):null;
  if(!e){box.innerHTML='';return;}
  box.innerHTML='<div class="lastinv">Last invoice <b>'+esc(e.invoice_no||'')+'</b> · '+
    esc(e.retailer_name||'')+' · '+nf(e.total_kg)+' kg · '+rm(e.total_value_rm)+'</div>'+
    '<button class="bigbtn wabtn" onclick="copyReceipt(\''+esc(e.uuid)+'\')">📋 Copy WhatsApp Receipt Text</button>';}

/* ======================================================================================
   v3.6 · PHOTO PROOF & THE THREE-WAY HANDSHAKE
   ======================================================================================
   Three people now sign for the same fruit, and no one of them can complete a sale alone:

     1  WORKER      weighs the baskets at the shed and PHOTOGRAPHS the scale display.
                    They key the reading, pick the merchant, and submit. They never see a
                    ringgit — the request carries weight and a photo, no money at all.
     2  MARKETER    opens the request, taps the photo, reads the scale in the picture,
                    and compares it with what was typed. Only then does Approve unlock.
     3  THE LEDGER  approval writes the ordinary immutable DISPATCH event — invoice
                    serial, credit deduction, WhatsApp receipt — exactly as a direct
                    dispatch does, so everything downstream already understands it.

   WHY THE REQUEST CARRIES NO MONEY. The value is worked out at APPROVAL, from the
   contract in force at that moment. A worker's phone therefore never holds a price, and
   a request that sits overnight cannot invoice at yesterday's rate by accident.

   The photo is a plain base64 string on the event. It is downscaled in the browser
   before it enters the queue — see compressPhoto() — because it has to travel
   worker phone -> Sheet -> marketer phone over a shared hotspot.
   ====================================================================================== */

/** Downscale + re-encode a camera photo until it fits PHOTO_MAX_CHARS.
 *  Returns a data URL string, or rejects with a message the field can act on. */
function compressPhoto(file){
  return new Promise((resolve,reject)=>{
    if(!file)return reject(tErr('e_needphoto','No photo selected.'));
    if(!/^image\//.test(file.type||''))return reject(tErr('e_notphoto','That file is not a photo.'));
    const fr=new FileReader();
    fr.onerror=()=>reject(tErr('e_photoread','The phone could not read that photo.'));
    fr.onload=()=>{
      const img=new Image();
      img.onerror=()=>reject(tErr('e_photoread','That photo could not be opened.'));
      img.onload=()=>{
        try{
          const scale=Math.min(1,PHOTO_MAX_PX/Math.max(img.width||1,img.height||1));
          const w=Math.max(1,Math.round((img.width||1)*scale));
          const h=Math.max(1,Math.round((img.height||1)*scale));
          const cv=document.createElement('canvas'); cv.width=w; cv.height=h;
          const cx=cv.getContext('2d');
          cx.fillStyle='#fff'; cx.fillRect(0,0,w,h);      // JPEG has no alpha; avoid black edges
          cx.drawImage(img,0,0,w,h);
          // Step the quality down until the string fits a spreadsheet cell. A photo of a
          // lit LCD in a dark shed compresses badly, so this loop is not decoration.
          let q=PHOTO_Q_START, out=cv.toDataURL('image/jpeg',q);
          while(out.length>PHOTO_MAX_CHARS&&q>PHOTO_Q_FLOOR){
            q=+(q-0.08).toFixed(2); out=cv.toDataURL('image/jpeg',q);}
          if(out.length>PHOTO_MAX_CHARS)
            return reject(tErr('e_photobig','That photo is too detailed to send. Take it again closer to the scale display.'));
          resolve(out);
        }catch(e){reject(tErr('e_photoread','This phone cannot resize photos. Try the built-in camera app.'));}};
      img.src=fr.result;};
    fr.readAsDataURL(file);});}

/** An Error that also carries the translation key for its message, so a field-facing
 *  failure can be shown in the worker's own language without the thrower knowing which
 *  language is active. */
function tErr(key,en){const e=new Error(en);e.tkey=key;return e;}

/** Roughly how big the stored string is, for the screens that say so. */
function photoKB(s){return s?Math.round(String(s).length/1024):0;}

/* ======================================================================================
   v3.8 · THE DIRECT-TOUCH MORNING SCALE
   ======================================================================================
   What changed and, more importantly, WHY.

   The v3.6/3.7 form was correct but it was a FORM: an instruction paragraph, an amber
   tare warning, then five dropdowns per basket. In the shed at 6am that is five modal
   drop menus opened with a wet thumb before a single kilogram is recorded. v3.8 keeps
   every rule underneath and changes only the surface:

     · no prose at the top — the worker lands on the first thing they must touch
     · clone / grade / basket are HORIZONTAL BUTTON ROWS; one tap, no menu, and the
       grade row is rebuilt from CLONE_GRADES so Musang King offers A/B/C while
       Black Thorn, B24, 101 and Udang Merah offer A/B and nothing else
     · the two numbers that matter are 30 px, bold, green, and open a numeric keypad
     · ONE BASKET PER ROW, always. "How many baskets" is gone — a row is a basket, and
       more baskets means more rows via [ ➕ ADD NEXT BASKET ]. This removes the single
       most expensive keying error on the old form: a gross reading for one basket with
       a basket count of three, which silently deducted triple tare.

   `baskets` stays on the line object at a hard 1 because lineCalc() multiplies the tare
   by it. It is no longer editable anywhere on this screen.
   ====================================================================================== */

// ---- the worker's Morning Scale Dispatch form ---------------------------------------
let WLINES=[], WLSEQ=0, W_RET='', W_PHOTO='', W_NOTE='', wSaving=false;
/* v3.9 - the lorry, and the correction chain.
   W_PLATE  the vehicle plate, compulsory. Uppercased on entry: a gate log that cannot be
            matched to a lorry is not a gate log.
   W_REDO   set only while FIXING a returned load: {uuid, attempt, ref}. Its presence is
            what locks the merchant and the clone, and what makes a new photo compulsory. */
let W_PLATE='', W_REDO=null;
/** v3.8 — the uuid of the load whose Scale Tally Gatepass is showing. '' = the entry form.
 *  This is module-level VIEW state, so it obeys the resetMarketingView() rule. */
let W_GATEPASS='';
function newWLine(){
  // baskets is fixed at 1 — see the block comment above.
  // v3.9 — `photo` is this basket's own picture. Compulsory: the load cannot be submitted
  // until every row has one, because a single photo of a lorry proves nothing about which
  // basket held which clone.
  return {k:'W'+(++WLSEQ),clone:'MK',grade:'A',basket:'RED',baskets:1,gross:'',fruits:'',photo:''};}
function wLines(){ if(!WLINES.length)WLINES=[newWLine()]; return WLINES; }
function wlFind(k){return WLINES.find(l=>l.k===k)||null;}
function wlSet(k,f,v){
  const l=wlFind(k); if(!l)return;
  if(f==='baskets')return;                 // v3.8 — one basket per row, not negotiable
  l[f]=v;
  // v3.9.2 — WHEN was this basket keyed? Stamped on the first real number that lands on
  // the row and never rewritten, so it records when the basket was actually weighed at the
  // scale rather than when the whole load was finally sent. A later correction to the same
  // basket keeps the original stamp; the correction itself is a new attempt with its own.
  if(!l.keyed_at&&(f==='gross'||f==='fruits')&&(+v>0))l.keyed_at=nowSec();
  if(f==='clone'&&!hasGrade(l.clone,l.grade))l.grade=gradesFor(l.clone)[0];
  // v3.8 — grade joins clone and basket: they are buttons now, so the active state has to
  // be repainted on every pick. The two number fields deliberately do NOT repaint, or the
  // keypad would close on each digit.
  if(f==='clone'||f==='basket'||f==='grade')renderWLines();
  wCalc(); wGate();}
function addWLine(){
  WLINES.push(newWLine()); renderWLines(); wCalc(); wGate();
  const rows=$('w-rows'); if(rows&&rows.lastElementChild)
    rows.lastElementChild.scrollIntoView({behavior:'smooth',block:'center'});}
function removeWLine(k){
  WLINES=WLINES.filter(l=>l.k!==k);
  if(!WLINES.length)WLINES=[newWLine()];
  renderWLines(); wCalc(); wGate();}
function setWRet(v){
  W_RET=v||'';
  const sel=$('w-ret'); if(sel&&sel.value!==W_RET)sel.value=W_RET;   // keep the shadow select honest
  renderWRetRow(); wCalc(); wGate();}

/** One horizontal selector row. `opts` is [{v,t,s}] — value, big label, small sub-label.
 *  Rendering is identical for clone, grade and basket so the three can never drift apart. */
function wSelRow(label,field,l,opts,cls){
  return '<div class="selwrap"><label class="sellbl">'+esc(label)+'</label>'+
    '<div class="selrow'+(cls?' '+cls:'')+'">'+
    opts.map(o=>'<div class="selbtn'+(String(o.v)===String(l[field])?' on':'')+'" '+
      'onclick="wlTap(\''+esc(l.k)+'\',\''+esc(field)+'\',\''+esc(String(o.v))+'\')">'+
      esc(o.t)+(o.s?'<span class="sb">'+esc(o.s)+'</span>':'')+'</div>').join('')+
    '</div></div>';}

/** One big-digit numeric cell. inputmode drives the on-screen keypad on both Android and
 *  iOS; `step` keeps the browser from rejecting a decimal gross reading. */
function wNumCell(l,field,label,unit,mode,ph,must){
  const empty=!(+l[field]>0);
  return '<div class="numcell'+(must&&empty?' req':'')+'"><label class="sellbl">'+esc(label)+
    (must?'<span class="reqchip">'+esc(tr('sc_required'))+'</span>':'')+'</label>'+
    // v3.9.1 — a stable id per field, so keepFocus() can put the thumb back where it was
    // after a repaint. Without an id the number fields were unrecoverable and tapping a
    // clone button closed the keyboard on a half-keyed weight.
    '<input class="bignum" id="wn-'+esc(l.k)+'-'+esc(field)+'" '+
      'type="number" min="0" step="'+(mode==='decimal'?'any':'1')+'" '+
      'inputmode="'+mode+'" placeholder="'+esc(ph)+'" value="'+esc(l[field])+'" '+
      'onfocus="this.select()" '+
      'oninput="wlSet(\''+esc(l.k)+'\',\''+esc(field)+'\',this.value)">'+
    (unit?'<span class="unit">'+esc(unit)+'</span>':'')+'</div>';}

/** The merchant picker, also a button row. A hidden <select id="w-ret"> is kept in step
 *  so every pre-v3.8 call site and deploy check that reads `w-ret`.value still works. */
function renderWRetRow(){
  const row=$('w-retrow'); if(!row)return;
  const act=activeRetailers();
  row.innerHTML=act.map(r=>'<div class="selbtn'+(W_RET===r.id?' on':'')+'" '+
    'onclick="retTap(\''+esc(r.id)+'\')">'+esc(r.name)+'</div>').join('');}

/** A worker may weigh; Owner and Marketing may too, so a one-person morning still works. */
function canWeigh(){const r=myRole();return r==='WORKER'||FULL_ROLES.indexOf(r)>=0;}

/** v3.9 — plates this farm has actually seen, newest first. Typing a plate with wet hands
 *  at 6 am is where the typos come from, so the app offers what it already knows. */
function recentPlates(n){
  const seen=[], out=[];
  EVENTS.filter(e=>e.type==='DISPATCH_REQ'&&e.vehicle_plate)
    .sort((a,b)=>String(b.dt).localeCompare(String(a.dt)))
    .forEach(e=>{const v=String(e.vehicle_plate).toUpperCase().trim();
      if(v&&seen.indexOf(v)<0){seen.push(v);out.push(v);}});
  return out.slice(0,n||4);}
/**
 * v3.9.1 — WHY THIS NO LONGER WRITES BACK INTO THE FIELD.
 *
 * It used to do `input.value = W_PLATE.toUpperCase()` on every keystroke. On a desktop that
 * is invisible. On an Android keyboard it is not: rewriting the value mid-word tears up
 * Gboard's composing buffer, so letters double, vanish, or the field empties itself. On iOS
 * it throws the caret to the end, so a worker correcting the middle of a plate cannot.
 *
 * The value is now left exactly as typed. `text-transform:uppercase` in the CSS shows it in
 * caps, W_PLATE holds the upper-case form for storage, and platePolish() tidies the visible
 * text ONCE on blur, when no keyboard is composing.
 */
function setPlate(v){
  W_PLATE=String(v||'').toUpperCase();
  // the red "not filled yet" outline has to clear on the FIRST character. It used to wait
  // for a full re-render that never came, so the box stayed red while the worker typed and
  // it looked as though nothing was going in.
  const i=$('w-plate'); if(i)i.classList.toggle('empty',!W_PLATE.trim());
  renderPlateRow(); wGate();}

/** Tidy the typed text once the keyboard has gone: caps, single spaces, trimmed. */
function platePolish(){
  const i=$('w-plate'); if(!i)return;
  const clean=String(i.value||'').toUpperCase().replace(/\s+/g,' ').trim();
  if(i.value!==clean)i.value=clean;
  W_PLATE=clean;
  i.classList.toggle('empty',!clean);
  renderPlateRow(); wGate();}

/** A chip tap is safe to write straight into the field — no keyboard is composing. */
function pickPlate(v){
  uiTap(()=>{
    const i=$('w-plate');
    if(i){i.value=String(v||'').toUpperCase();i.classList.remove('empty');}
    setPlate(v);});}

function renderPlateRow(){
  const row=$('w-plates'); if(!row)return;
  const list=recentPlates(4);
  row.innerHTML=list.length?list.map(v=>'<div class="plchip'+(W_PLATE===v?' on':'')+'" '+
    'onclick="pickPlate(\''+esc(v)+'\')">'+esc(v)+'</div>').join(''):'';}

/**
 * v3.9 — EVERY reason this load cannot be sent, in the worker's own language.
 *
 * One list, computed in one place, used by both the lock panel and the submit handler, so
 * the button and the explanation can never disagree with each other. Returning the reasons
 * rather than a boolean is the point: "SUBMIT IS LOCKED" on its own would be worse than the
 * old silent failure.
 */
function scaleBlockers(){
  const out=[], L=wLines();
  if(!W_PLATE.trim())out.push(tr('e_needplate'));
  const noW=[],noC=[],noP=[];
  L.forEach((l,i)=>{
    if(!(lineCalc(l,NO_PRICE).net>0))noW.push(i+1);
    if(!(Math.floor(+l.fruits||0)>0))noC.push(i+1);
    if(!l.photo)noP.push(i+1);});
  if(noW.length)out.push(tr('e_needbweight')+' '+noW.join(', '));
  if(noC.length)out.push(tr('e_needcount')+' '+noC.join(', '));
  if(noP.length)out.push(tr('e_needbphoto')+' '+noP.join(', '));
  if(!retailerById(W_RET))out.push(tr('e_pickmerchant'));
  return out;}

/** Paint the lock panel and the submit button from that one list. */
function wGate(){
  const box=$('w-gate'), go=$('w-go');
  if(!box||!go)return;
  const b=scaleBlockers();
  if(b.length){
    box.innerHTML='<div class="blockbox"><b>'+esc(tr('sc_locked'))+'</b><ul>'+
      b.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>';
    go.disabled=true;
  }else{
    const t=dispTotals(NO_PRICE,wLines());
    box.innerHTML='<div class="okbox">✓ '+t.lines.length+' '+esc(tr('sc_basket')).toLowerCase()+
      ' · '+t.fruit_count+' '+esc(tr('w_fruits'))+' · '+nf(t.total_kg)+' kg · '+esc(W_PLATE)+'</div>';
    go.disabled=false;}}

/**
 * v3.9.1 — repaint a panel WITHOUT throwing away the field somebody is typing in.
 *
 * The scale card is repainted by the sync path, by the queue badge and by any decision
 * arriving from another phone. At the office hotspot that can happen while a worker is
 * halfway through keying the lorry plate — the input is destroyed and recreated, the
 * keyboard closes, and it looks exactly like the app refusing to accept the plate.
 * The text itself was never lost (it lives in W_PLATE / WLINES); the focus was.
 */
/* v3.9.2 — TAPPING A BUTTON MUST CLOSE THE KEYBOARD, NOT REOPEN IT.
   keepFocus() was written for one case: a background sync repainting the card while a
   worker is mid-word. It was applied to every repaint, including the ones caused by
   tapping a clone / grade / basket button — so the keyboard sprang straight back open
   over the very buttons the worker was trying to reach next. On a 390 px phone the
   keyboard covers half the screen, which is why this read as "the other keys cannot be
   chosen". A deliberate tap is the one moment focus SHOULD move away. */
let UI_TAPPING=false;
function uiTap(fn){
  UI_TAPPING=true;
  try{
    const a=document.activeElement;
    // put the keyboard away so the buttons underneath it are reachable
    if(a&&a.blur&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'))a.blur();
    fn();
  } finally { UI_TAPPING=false; }}
function wlTap(k,f,v){uiTap(()=>wlSet(k,f,v));}
function retTap(v){uiTap(()=>setWRet(v));}
function addWLineTap(){uiTap(addWLine);}
function removeWLineTap(k){uiTap(()=>removeWLine(k));}

function keepFocus(rootId,paint){
  if(UI_TAPPING){paint();return;}          // a tap moved the focus on purpose
  const root=$(rootId);
  const a=document.activeElement;
  const inside=!!(root&&a&&a!==document.body&&root.contains(a)&&a.id);
  const id=inside?a.id:'';
  let st=null,en=null;
  if(inside){try{st=a.selectionStart;en=a.selectionEnd;}catch(e){}}
  paint();
  if(!id)return;
  const b=$(id); if(!b)return;
  try{
    b.focus({preventScroll:true});
    if(st!=null&&b.setSelectionRange)b.setSelectionRange(st,en==null?st:en);
  }catch(e){}}

function renderScaleCard(){
  const box=$('scalebox'); if(!box)return;
  if(!canWeigh()){box.innerHTML='';return;}

  // v3.8 · GATEPASS MODE. The instant a load is submitted the editable form, the basket
  // adder and the camera are gone and this panel becomes a read-only gatepass. It is also
  // how an older load is re-opened for a driver who wants to re-check the tally.
  if(W_GATEPASS&&reqById(W_GATEPASS)){
    box.innerHTML=gatepassHTML(W_GATEPASS)+waitingListHTML()+myRecentDecisions();
    const c=$('gp-card'); if(c)c.scrollIntoView({behavior:'smooth',block:'start'});
    return;}

  const act=activeRetailers(), fixing=!!W_REDO;
  // v3.9.1 — hold the caret across the repaint; see keepFocus() above.
  const HTML=
    // v3.9 — a returned load is the FIRST thing on the screen, not buried in a history list.
    returnedActionHTML()+
    // NO intro paragraph, NO amber tare banner. The worker lands on the buyer picker,
    // which is the first thing they must actually touch.
    (act.length?'':'<div class="critbox">'+esc(tr('sc_nomerchant'))+'</div>')+
    (fixing?'<div class="fixbar">'+
        esc(tr('rl_fixing').replace('%A',W_REDO.attempt).replace('%R',W_REDO.ref))+
        '<span class="s">'+esc(tr('rl_locked'))+'</span></div>':'')+

    '<div class="selwrap"><label class="sellbl">'+esc(tr('sc_towhich'))+'</label>'+
      '<div class="selrow'+(fixing?' locked':'')+'" id="w-retrow"></div></div>'+
    // shadow control — kept so anything that read w-ret before v3.8 still reads it
    '<select id="w-ret" style="display:none" onchange="setWRet(this.value)">'+
      '<option value="">'+esc(tr('sc_choose'))+'</option>'+
      act.map(r=>'<option value="'+esc(r.id)+'"'+(W_RET===r.id?' selected':'')+'>'+
        esc(r.name)+'</option>').join('')+'</select>'+

    // ---- v3.9 · the lorry, compulsory ----
    '<div class="selwrap"><label class="sellbl">'+esc(tr('sc_plate'))+
      '<span class="reqchip">'+esc(tr('sc_required'))+'</span></label>'+
      // v3.9.1 — a plate field on a real phone, not a desktop text box:
      //   autocapitalize=characters  the keyboard opens in CAPS, so no shift-hunting
      //   autocorrect / spellcheck off  iOS was "correcting" SS 4412 K into words
      //   autocomplete=off + name  stops the browser offering old form entries over it
      //   enterkeyhint=done  the return key closes the keyboard instead of doing nothing
      '<input id="w-plate" class="plate'+(W_PLATE.trim()?'':' empty')+'" type="text" '+
        'name="vehicleplate" placeholder="'+esc(tr('sc_plateph'))+'" value="'+esc(W_PLATE)+'" '+
        'autocomplete="off" autocapitalize="characters" autocorrect="off" '+
        'spellcheck="false" enterkeyhint="done" maxlength="14" '+
        'oninput="setPlate(this.value)" onblur="platePolish()">'+
      '<div class="platehint">'+esc(tr('sc_platerecent'))+'</div>'+
      '<div class="plchips" id="w-plates"></div></div>'+

    '<div id="w-rows"></div>'+
    '<button class="addnext" onclick="addWLineTap()">'+esc(tr('sc_addnext'))+'</button>'+
    '<div class="wtot" id="w-tot">—</div>'+

    '<div class="selwrap"><label class="sellbl">'+esc(tr('sc_note'))+'</label>'+
      '<input id="w-note" placeholder="'+esc(tr('sc_noteph'))+'" value="'+esc(W_NOTE)+
      '" oninput="W_NOTE=this.value"></div>'+
    '<div class="pinerr" id="w-err"></div>'+
    '<div id="w-gate"></div>'+
    '<button class="submitwide" id="w-go" onclick="submitScaleDispatch()">'+
      esc(fixing?(tr('rl_resend')+' '+W_REDO.attempt):tr('sc_submit'))+'</button>'+
    (fixing?'<button class="bigbtn ghost" style="margin-top:8px;padding:12px;font-size:13px" '+
      'onclick="abortResend()">← '+esc(tr('b_cancel'))+'</button>':'')+

    // The tare honesty note survives, but as a grey footnote at the BOTTOM — it is a
    // caveat on a number already recorded, not an instruction to read before starting.
    (TARE_VERIFIED?'':'<div class="scfoot">'+esc(tr('sc_tarefoot'))+'</div>')+
    // v3.11 — the worker's net weight is the office's tare subtracted from their gross. If
    // the office changes the tare they are entitled to know whose figure they are standing on.
    (settingStamp('baskets')?('<div class="scfoot">⚖️ '+esc(tr('st_baskets'))+' · '+
      esc(settingStamp('baskets'))+'</div>'):'')+

    waitingListHTML()+myRecentDecisions();
  keepFocus('scalebox',()=>{box.innerHTML=HTML;});
  renderWRetRow(); renderPlateRow(); renderWLines(); wCalc(); wGate();}

/** The retained gatepasses. Every row re-opens its own read-only card — which is the
 *  whole point: the driver can ask for the tally again after the form has been reset. */
function waitingListHTML(){
  const mine=pendingDispatches().filter(e=>!CFG||!CFG.uid||String(e.workerId||'')===String(CFG.uid||''));
  return '<div class="sec" style="margin-top:16px">'+esc(tr('sc_waiting'))+'</div>'+
    (mine.length
      ? '<div class="scfoot" style="margin:-2px 0 8px">'+esc(tr('gp_taphint'))+'</div>'+
        mine.map(e=>'<div class="reqrow tapp" onclick="openGatepass(\''+esc(e.uuid)+'\')">'+
          (e.photo_b64
            ? '<img class="reqthumb" src="'+e.photo_b64+'" onclick="event.stopPropagation();'+
              'showPhoto(\''+esc(e.uuid)+'\',\''+esc(tr('sc_photook'))+'\',1)">'
            : '<div class="reqthumb none">—</div>')+
          '<div class="reqmid"><b>'+nf(e.total_kg)+' kg</b> → '+esc(e.retailer_name||'')+
          (+e.attempt>1?(' <span class="attchip">'+esc(tr('rl_attempt'))+' '+(+e.attempt)+'</span>'):'')+
          '<div class="pa">'+esc(e.dt)+(e.vehicle_plate?(' · '+esc(e.vehicle_plate)):'')+'</div></div>'+
          '<span class="cstat '+(e.synced?'s':'r')+'">'+
            esc(tr(e.synced?'sc_pending':'sc_notsent'))+'</span>'+
          '<span class="gpgo">›</span></div>').join('')
      :'<div class="alertnone">'+esc(tr('sc_nothingwaiting'))+'</div>');}

/** Approved and returned loads, so a worker sees the outcome instead of a silence.
 *  v3.8 — these re-open their gatepass too; a returned load still has to be reconciled
 *  against whatever physically left the gate. */
function myRecentDecisions(){
  const mineIds={};
  EVENTS.forEach(e=>{if(e.type==='DISPATCH_REQ'&&(!CFG||!CFG.uid||String(e.workerId||'')===String(CFG.uid||'')))mineIds[e.uuid]=e;});
  const out=[], seen={};
  EVENTS.forEach(e=>{
    if(e.type==='DISPATCH'&&e.req_uuid&&mineIds[e.req_uuid]){
      seen[e.req_uuid]=1;
      out.push({req:e.req_uuid,dt:e.dt,ok:true,kg:+e.total_kg||0,who:e.verified_by||e.worker||'',
        name:e.retailer_name||'',why:''});}
    if(e.type==='DISPATCH_CANCEL'&&mineIds[e.targetUuid]){
      seen[e.targetUuid]=1;
      out.push({req:e.targetUuid,dt:e.dt,ok:false,cancelled:true,
        kg:+(mineIds[e.targetUuid].total_kg)||0,who:e.worker||'',
        name:mineIds[e.targetUuid].retailer_name||'',why:e.reason||''});}
    if(e.type==='DISPATCH_REJECT'&&mineIds[e.targetUuid]){
      seen[e.targetUuid]=1;
      out.push({req:e.targetUuid,dt:e.dt,ok:false,kg:+(mineIds[e.targetUuid].total_kg)||0,who:e.worker||'',
        name:mineIds[e.targetUuid].retailer_name||'',why:e.reason||''});}});
  // v3.8.1 — decisions taken on the marketer's phone. A local event above always wins, so
  // this only fills the gap that used to leave the worker staring at PENDING for ever.
  Object.keys(mineIds).forEach(u=>{
    if(seen[u])return;
    const d=REQ_DECIDED[u]; if(!d)return;
    const sup=supersededBy(u);
    out.push({req:u,dt:d.dt||mineIds[u].dt,ok:d.state==='APPROVED',
      cancelled:d.state==='CANCELLED',
      kg:d.total_kg||+(mineIds[u].total_kg)||0,who:d.by||'',
      name:d.retailer_name||mineIds[u].retailer_name||'',
      why:sup?(tr('rl_replaced')+' '+Math.max(2,Math.floor(+sup.attempt||2))):(d.reason||'')});});
  if(!out.length)return '';
  out.sort((a,b)=>String(b.dt).localeCompare(String(a.dt)));
  return '<div class="sec" style="margin-top:14px">'+esc(tr('sc_decided'))+'</div>'+
    out.slice(0,6).map(x=>'<div class="reqrow tapp" onclick="openGatepass(\''+esc(x.req)+'\')">'+
      '<div class="reqmid">'+
      '<b>'+nf(x.kg)+' kg</b> → '+esc(x.name)+'<div class="pa">'+esc(x.dt)+' · '+esc(x.who)+
      (x.why?(' · '+esc(x.why)):'')+'</div></div>'+
      '<span class="cstat '+(x.ok?'a':(x.cancelled?'c':'r'))+'">'+
        esc(tr(x.ok?'sc_approved':(x.cancelled?'rl_cancelled':'sc_returned')))+
      '</span><span class="gpgo">›</span></div>').join('');}

function renderWLines(){
  const box=$('w-rows'); if(!box)return;
  const HTML=wLines().map((l,i)=>{
    // The grade row is rebuilt from CLONE_GRADES every paint, so MK offers A/B/C and
    // BT / B24 / 101 / UM offer A/B. A clone can never present a grade it does not sell.
    const gs=gradesFor(l.clone);
    return '<div class="dline tight">'+
      '<div class="dlhead"><span class="dltag">'+esc(tr('sc_basket'))+' '+(i+1)+'</span>'+
      (wLines().length>1?'<span class="dlx" onclick="removeWLineTap(\''+esc(l.k)+'\')">'+
        esc(tr('b_remove'))+'</span>':'')+'</div>'+
      // clone codes and names are NEVER translated — they are the trade's own words
      wSelRow(tr('sc_clone'),'clone',l,
        CLONE_SELL_ORDER.map(c=>({v:c,t:c,s:CLONE_NAME[c]||c})),'clones')+
      // grade letters are NEVER translated — they reach the buyer's invoice
      wSelRow(tr('sc_grade'),'grade',l,
        gs.map(g=>({v:g,t:g,s:bandShort(l.clone,g)})),'grades')+
      wSelRow(tr('sc_baskettype'),'basket',l,
        BASKETS.map(b=>({v:b.id,t:(b.ic?b.ic+' ':'')+basketName(b),s:'−'+nf(b.tare_kg)+' kg'})),'baskets')+
      '<div class="numgrid">'+
        wNumCell(l,'gross',tr('sc_gross'),'kg','decimal','0.00')+
        wNumCell(l,'fruits',tr('sc_fruitcount'),'','numeric','0',true)+
      '</div>'+
      '<div class="dlnet" id="wln-'+esc(l.k)+'">—</div>'+
      // v3.9.2 — the worker can see the moment this basket was recorded
      (l.keyed_at?('<div class="keyedat">🕒 '+esc(tr('ts_keyed'))+' '+esc(hm(l.keyed_at))+
        (l.photo_at?(' · 📷 '+esc(hm(l.photo_at))):'')+'</div>'):'')+
      // v3.9 — one camera per basket. Green when done, red-dashed while missing, so a row
      // that is not yet proven is visible from across the shed.
      (l.photo
        ? '<label class="bcam done" for="wcam-'+esc(l.k)+'">'+
            '<img class="bth" src="'+l.photo+'" onclick="event.preventDefault();'+
              'event.stopPropagation();showPhoto(\''+esc(l.photo)+'\',\''+
              esc(tr('sc_basket'))+' '+(i+1)+'\')">'+
            '<div class="bct">✓ '+esc(tr('sc_basket'))+' '+(i+1)+' '+esc(tr('sc_basketdone'))+
              '<span class="s">'+photoKB(l.photo)+' KB · '+esc(tr('sc_phototap'))+'</span></div>'+
          '</label>'
        : '<label class="bcam miss" for="wcam-'+esc(l.k)+'">'+esc(tr('sc_basketphoto'))+' '+(i+1)+
            '<span class="s">'+esc(tr('sc_basketphotosub'))+'</span></label>')+
      '<input type="file" id="wcam-'+esc(l.k)+'" accept="image/*" capture="environment" '+
        'style="display:none" onchange="onBasketPhoto(\''+esc(l.k)+'\',this)">'+
    '</div>';}).join('');
  // same rule as the plate: tapping a clone button must not close the keyboard on a
  // half-keyed weight two fields below it.
  keepFocus('w-rows',()=>{box.innerHTML=HTML;});}
/** Basket names are farm objects, not chemistry — safe to translate, and they are the
 *  one thing on the scale form a worker picks by sight rather than by reading. */
function basketName(b){
  const k={RED:'bk_red',BLUE:'bk_blue',NONE:'bk_none'}[b.id];
  return k?tr(k,b.name):b.name;}

/** Weight only. Passing '' as the merchant forces every price to resolve to zero, which
 *  is the point: no ringgit figure can reach a worker's screen from this path. */
function wCalc(){
  wLines().forEach(l=>{
    const c=lineCalc(l,NO_PRICE), n=$('wln-'+l.k);
    if(n)n.innerHTML=esc(tr('sc_gross_calc'))+' '+nf(c.gross)+' kg − '+esc(tr('sc_tare_calc'))+' '+
      nf(c.tare)+' kg = '+esc(tr('sc_net_calc'))+' <b>'+nf(c.net)+' kg</b>'+
      (c.avg>0?('<span class="v">'+esc(tr('sc_avg'))+' '+nf(c.avg)+' kg → '+esc(tr('w_grade'))+' '+c.sugg+
        (c.sugg!==l.grade?' ⚠':' ✓')+'</span>'):'');});
  const tot=dispTotals(NO_PRICE,wLines()), el=$('w-tot');
  if(el)el.innerHTML=tot.total_kg>0
    ? esc(tr('sc_total'))+' <b>'+nf(tot.total_kg)+' kg</b> · '+tot.lines.length+' '+
      esc(tr('sc_basket')).toLowerCase()+(tot.fruit_count?(' · '+tot.fruit_count+' '+esc(tr('w_fruits'))):'')
    : esc(tr('sc_keyfirst'));}

/** v3.9 — the camera for ONE basket. Same compressor, same size ceiling; the picture is
 *  stored on the line rather than on the load. */
async function onBasketPhoto(k,input){
  const err=$('w-err'); if(err)err.textContent='';
  const f=input&&input.files&&input.files[0];
  input.value='';
  if(!f)return;
  const l=wlFind(k); if(!l)return;
  toast(tr('t_shrinking'));
  try{
    l.photo=await compressPhoto(f);
    l.photo_at=nowSec();                       // v3.9.2 — when the scale was photographed
    if(!l.keyed_at)l.keyed_at=l.photo_at;
    // basket 1's picture is ALSO the load-level photo, because every screen written before
    // v3.9 — the marketer's card, the DISPATCH_REQ tab, the daily audit — reads that field.
    if(wLines()[0]&&wLines()[0].k===k)W_PHOTO=l.photo;
    renderWLines(); wCalc(); wGate();
    toast(tr('t_photoon')+' · '+photoKB(l.photo)+' KB');
  }catch(e){const m=tr(e.tkey||'',e.message); if(err)err.textContent=m; toast(m,1);}}

async function onWPhoto(input){
  const err=$('w-err'); if(err)err.textContent='';
  const f=input&&input.files&&input.files[0];
  input.value='';                                   // so re-picking the same file re-fires
  if(!f)return;
  toast(tr('t_shrinking'));
  try{
    W_PHOTO=await compressPhoto(f);
    renderScaleCard();
    toast(tr('t_photoon')+' · '+photoKB(W_PHOTO)+' KB');
  }catch(e){ const m=tr(e.tkey||'',e.message); if(err)err.textContent=m; toast(m,1); }}
function clearWPhoto(){W_PHOTO='';renderScaleCard();}

async function submitScaleDispatch(){
  const err=$('w-err'); if(err)err.textContent='';
  if(wSaving)return;
  if(!canWeigh()){toast('You are not set up to weigh',1);return;}
  const r=retailerById(W_RET);
  if(!r){if(err)err.textContent=tr('e_pickmerchant');return;}
  if(String(r.status||'Active')!=='Active'){if(err)err.textContent=tr('e_suspended');return;}
  // v3.9 — ONE gate, the same list the lock panel shows. The button being enabled is not
  // trusted here: a stale render, or a call from anywhere else, must still be refused.
  const block=scaleBlockers();
  if(block.length){if(err)err.textContent=block[0];toast(block[0],1);return;}
  const tot=dispTotals(NO_PRICE,wLines());
  if(!(tot.total_kg>0)){if(err)err.textContent=tr('e_needweight');return;}
  wSaving=true;
  const u=uuid(), stamp=now();
  // hang each basket's own photo back onto its line, in order. dispTotals drops zero-weight
  // rows, so the lines are matched against the rows that actually produced them.
  const kept=wLines().filter(l=>lineCalc(l,NO_PRICE).net>0);
  const lines=tot.lines.map((x,i)=>({...x, basket_no:i+1,
    photo_b64:(kept[i]&&kept[i].photo)||'', has_photo:(kept[i]&&kept[i].photo)?1:0,
    // v3.9.2 — the per-basket clock. These ride inside lines_json, which already travels,
    // so recording them needed no new spreadsheet column and no backend deploy.
    keyed_at:(kept[i]&&kept[i].keyed_at)||'', photo_at:(kept[i]&&kept[i].photo_at)||''}));
  const stamps=lines.map(x=>x.keyed_at).filter(Boolean).sort();
  const first=lines.length?(lines[0].photo_b64||''):'';
  try{
    await persistEvent({uuid:u,type:'DISPATCH_REQ',dt:stamp,
      retailer_id:r.id, retailer_name:r.name, contact:r.contact||'',
      lines:lines, lines_json:JSON.stringify(lines), line_count:lines.length,
      kg_A:tot.kg_A, kg_B:tot.kg_B, kg_C:tot.kg_C, fruit_count:tot.fruit_count,
      total_gross_kg:tot.total_gross_kg, total_tare_kg:tot.total_tare_kg, total_kg:tot.total_kg,
      // the load-level photo is basket 1's, so every pre-v3.9 screen keeps working
      photo_b64:first, photo_kb:photoKB(first),
      vehicle_plate:W_PLATE.trim().toUpperCase(),
      // derived, not a new column: earliest and latest basket on this load
      first_keyed_at:stamps[0]||stamp, last_keyed_at:stamps[stamps.length-1]||stamp,
      submitted_at:nowSec(),
      // v3.9 — the correction chain. A fix is a NEW record that QUOTES the returned one;
      // the returned record itself is never touched.
      redo_of:(W_REDO?W_REDO.uuid:''), attempt:(W_REDO?W_REDO.attempt:1),
      note:W_NOTE.trim(),
      worker:CFG.worker, workerId:CFG.uid||'', device:CFG.device, synced:false});
  } finally { wSaving=false; }
  WLINES=[newWLine()]; W_PHOTO=''; W_NOTE=''; W_RET=''; W_PLATE=''; W_REDO=null;
  // v3.8 — LOCK. The panel becomes this load's gatepass immediately, before the worker
  // can touch anything else, because the driver is standing there waiting for the tally.
  W_GATEPASS=u;
  badge(); renderScaleCard(); renderVerify(); renderHub();
  toast('📋 '+nf(tot.total_kg)+' kg · '+tr('gp_head'));}

/* ======================================================================================
   v3.9 · FRUIT BACKLOG & TRACE
   ======================================================================================
   The link between the two halves of the morning. Daily fruit collection counts fruit IN;
   the Morning Scale counts fruit OUT. The difference is what is physically still sitting in
   the shed, and any clone x grade where MORE left the gate than was ever collected is a
   discrepancy the app names out loud instead of burying.

   IN   = DROP events            clone, grade, qty            (good fruit, counted per tree)
   OUT  = approved DISPATCH lines clone, grade, fruits        (only APPROVED — see below)
   BACKLOG = cumulative IN - OUT, carried day to day

   WHY ONLY APPROVED LOADS COUNT AS OUT. A returned or cancelled load never became a
   DISPATCH, so its fruit is still on the farm and still in this backlog. If pending
   requests were counted, a load bouncing between the worker and Marketing would remove
   fruit from the shed that is standing in the shed.

   WHY ROTTEN AND UNRIPE ARE EXCLUDED. They never became sellable stock. Counting them here
   would inflate the backlog above what is actually in the shed, which is the opposite of
   what this screen is for. They stay on the loss report.

   Nothing is stored. Recomputed from the append-only log every time the screen opens, so a
   late-syncing phone corrects the history instead of corrupting it.
   ====================================================================================== */

/** Every approved dispatch line, with the load it came from, for the OUT column. */
function dispatchedFruit(){
  const out=[];
  EVENTS.filter(e=>e.type==='DISPATCH').forEach(e=>{
    const req=e.req_uuid?reqById(e.req_uuid):null;
    (reqLines({lines:e.lines,lines_json:e.lines_json})||[]).forEach(x=>{
      const f=Math.max(0,Math.floor(+x.fruits||0)); if(!f)return;
      out.push({clone:x.clone||'?',grade:x.grade||'?',fruits:f,net_kg:+x.net_kg||0,
        dt:e.dt||'',ref:refOf(e.req_uuid||e.uuid),
        plate:(req&&req.vehicle_plate)||e.vehicle_plate||'',
        retailer:e.retailer_name||''});});});
  return out;}

/**
 * The whole reconciliation, per clone x grade. `upto` optionally cuts it off at a date.
 * Returns rows sorted by the farm's own selling order, plus a total.
 */
function fruitBacklog(upto){
  const cut=upto||'9999-12-31';
  const map={}, key=(c,g)=>c+'|'+g;
  const row=(c,g)=>{const k=key(c,g);
    if(!map[k])map[k]={clone:c,grade:g,clone_name:CLONE_NAME[c]||c,
      in:0,out:0,out_kg:0,trace:[]};
    return map[k];};

  EVENTS.filter(e=>e.type==='DROP'&&String(e.dt||'').slice(0,10)<=cut).forEach(e=>{
    const q=Math.max(0,Math.floor(+e.qty||0)); if(!q)return;
    const r=row(e.clone||'?',e.grade||'?');
    r.in+=q;
    r.trace.push({dt:e.dt,kind:'IN',n:q,what:e.tree||'',lot:e.lot||''});});

  dispatchedFruit().filter(x=>String(x.dt||'').slice(0,10)<=cut).forEach(x=>{
    const r=row(x.clone,x.grade);
    r.out+=x.fruits; r.out_kg+=x.net_kg;
    r.trace.push({dt:x.dt,kind:'OUT',n:x.fruits,kg:x.net_kg,
      what:x.ref,plate:x.plate,retailer:x.retailer});});

  const rows=Object.keys(map).map(k=>{
    const r=map[k];
    r.backlog=r.in-r.out;
    r.short=r.backlog<0;
    r.avg_kg=(r.out>0&&r.out_kg>0)?+(r.out_kg/r.out).toFixed(2):0;
    // a second, quieter flag: the average fruit dispatched sits outside the band its grade
    // claims. Not an error, but grading drifting is worth naming before it becomes a price.
    const band=bandOf(r.clone,r.grade);
    r.drift=!!(band&&r.avg_kg>0&&(r.avg_kg<band.min||(band.max!=null&&r.avg_kg>=band.max)));
    r.trace.sort((a,b)=>String(a.dt).localeCompare(String(b.dt)));
    return r;});
  rows.sort((a,b)=>{
    const ia=CLONE_SELL_ORDER.indexOf(a.clone), ib=CLONE_SELL_ORDER.indexOf(b.clone);
    if(ia!==ib)return (ia<0?99:ia)-(ib<0?99:ib);
    return String(a.grade).localeCompare(String(b.grade));});
  const tot=rows.reduce((t,r)=>({in:t.in+r.in,out:t.out+r.out,backlog:t.backlog+r.backlog}),
    {in:0,out:0,backlog:0});
  return {rows:rows,total:tot,short:rows.filter(r=>r.short)};}

let BL_OPEN='';
function blToggle(k){BL_OPEN=(BL_OPEN===k)?'':k;renderBacklog();}

function renderBacklog(){
  const box=$('backlogbox'); if(!box)return;
  const b=fruitBacklog(), full=SHOW_VALUES, today=todayStr();
  const inToday=EVENTS.filter(e=>e.type==='DROP'&&String(e.dt||'').slice(0,10)===today)
    .reduce((s,e)=>s+Math.max(0,Math.floor(+e.qty||0)),0);
  const outToday=dispatchedFruit().filter(x=>String(x.dt||'').slice(0,10)===today)
    .reduce((s,x)=>s+x.fruits,0);
  if(!b.rows.length){box.innerHTML='<div class="alertnone">'+esc(tr('bl_none'))+'</div>';return;}

  box.innerHTML=
    '<div class="kpis" style="margin-bottom:9px">'+
      '<div class="kpi"><div class="v">'+inToday+'</div><div class="l">'+esc(tr('bl_collected'))+'</div></div>'+
      '<div class="kpi"><div class="v">'+outToday+'</div><div class="l">'+esc(tr('bl_dispatched'))+'</div></div>'+
      '<div class="kpi'+(b.total.backlog<0?' bad':'')+'"><div class="v">'+b.total.backlog+
        '</div><div class="l">'+esc(tr('bl_inshed'))+'</div></div>'+
    '</div>'+
    (full?'<div class="scfoot" style="margin:0 0 7px">'+esc(tr('bl_tap'))+'</div>':'')+
    // `.full` removes the 340px inner scroll box. The backlog is a short list and expanding
    // a trace inside a nested scroller on a phone hides the totals underneath it.
    '<div class="tblwrap full"><table class="tbl bltbl">'+
    '<tr><th>'+esc(tr('bl_clonegrade'))+'</th><th>'+esc(tr('bl_in'))+'</th><th>'+
      esc(tr('bl_out'))+'</th><th>'+esc(tr('bl_backlog'))+'</th>'+(full?'<th></th>':'')+'</tr>'+
    b.rows.map(r=>{
      const k=r.clone+'|'+r.grade, open=BL_OPEN===k;
      return '<tr class="'+(full?'clickrow ':'')+(r.short?'alarm':'')+'"'+
        (full?(' onclick="blToggle(\''+esc(k)+'\')"'):'')+'>'+
        '<td><b>'+esc(r.clone)+' · '+esc(r.grade)+'</b><span class="cn">'+esc(r.clone_name)+'</span></td>'+
        '<td>'+r.in+'</td><td>'+r.out+'</td><td><b>'+r.backlog+'</b></td>'+
        (full?('<td>'+(r.short?'<span class="pill bad">'+esc(tr('bl_short'))+' '+Math.abs(r.backlog)+'</span>'
              :(r.drift?'<span class="pill warn">'+esc(tr('bl_check'))+'</span>'
                       :'<span class="pill ok">'+esc(tr('bl_ok'))+'</span>'))+'</td>'):'')+
      '</tr>'+
      ((full&&open)?('<tr><td colspan="5" class="expcell">'+blTrace(r)+'</td></tr>'):'');}).join('')+
    '<tr class="tot"><td>'+esc(tr('bl_total'))+'</td><td>'+b.total.in+'</td><td>'+b.total.out+
      '</td><td>'+b.total.backlog+'</td>'+(full?'<td></td>':'')+'</tr>'+
    '</table></div>'+
    '<div class="scfoot" style="margin-top:9px">'+esc(tr('bl_norot'))+'</div>';}

/** The audit trail for one clone x grade: every fruit in, every fruit out, named. */
function blTrace(r){
  const band=bandOf(r.clone,r.grade);
  return '<div class="trace">'+
    r.trace.slice(-14).map(t=>'<div class="trow'+(t.kind==='OUT'?' o':'')+'">'+
      '<span>'+esc(t.dt)+' · '+(t.kind==='IN'
        ? (esc(tr('bl_collected'))+' '+esc(t.what||t.lot||''))
        : (esc(tr('gp_ref'))+' '+esc(t.what)+' → '+esc(t.retailer||'')+
           (t.plate?(' · 🚚 '+esc(t.plate)):'')))+'</span>'+
      '<b>'+(t.kind==='IN'?'+':'−')+t.n+'</b></div>').join('')+
    '<div class="trow tt"><span><b>'+esc(tr('bl_inshed'))+'</b></span>'+
      '<b>'+r.backlog+' '+esc(tr('bl_fruits'))+'</b></div>'+
    (r.avg_kg>0?('<div class="trow"><span>'+esc(tr('bl_avg'))+'</span><b>'+nf(r.avg_kg)+' kg</b></div>'):'')+
    '</div>'+
    (r.short?('<div class="small" style="padding:2px 4px 0;color:#8c1d18;font-weight:800">'+
      Math.abs(r.backlog)+' × '+esc(r.clone)+' '+esc(r.grade)+' '+esc(tr('bl_shortnote'))+'</div>'):'')+
    (r.drift&&band?('<div class="small" style="padding:4px 4px 0">'+
      esc(tr('bl_drift').replace('%G',r.grade).replace('%C',CLONE_NAME[r.clone]||r.clone)
        .replace('%B',bandText(r.clone,r.grade)).replace('%V',nf(r.avg_kg)))+'</div>'):'');}

/* ======================================================================================
   v3.8 · THE SCALE TALLY GATEPASS
   ======================================================================================
   The physical handshake at the farm gate. A lorry driver signs for WHAT LEFT — baskets,
   fruit, kilograms per clone and grade — and for nothing else.

   GOVERNANCE, and this is the load-bearing rule of the whole feature:
   this card is built ONLY from weight and count fields. It never reads `price_rm`,
   `value_rm`, `total_value_rm`, a credit balance or an invoice serial, and a DISPATCH_REQ
   does not carry them in the first place (see the v3.6 note — value is computed at
   approval, from the contract in force then). The returned summary is a whitelist, and it
   is frozen, so a later edit cannot casually widen it into a price list on a worker's phone.
   ====================================================================================== */

/** Aggregate one submitted load into a driver-readable tally.
 *  Accepts a request uuid or the event itself. Returns null if the load is not on this
 *  phone yet. WEIGHT AND COUNT ONLY — see the block comment above. */
function gatepassSummary(src){
  const e=(typeof src==='string')?reqById(src):src;
  if(!e)return null;
  const lines=reqLines(e);
  let baskets=0,fruits=0,gross=0,tare=0,net=0;
  const byKey={}, order=[];
  lines.forEach(x=>{
    const nk=+x.net_kg||0;
    // a v3.8 row is one basket; a row migrated from an older phone may legitimately hold more
    const nb=Math.max(1,Math.floor(+x.baskets||1));
    const nf_=Math.max(0,Math.floor(+x.fruits||0));
    baskets+=nb; fruits+=nf_;
    gross+=(+x.gross_kg||nk); tare+=(+x.tare_kg||0); net+=nk;
    const clone=x.clone||'—', grade=x.grade||'—', k=clone+'|'+grade;
    if(!byKey[k]){
      byKey[k]={clone:clone,grade:grade,
        clone_name:x.clone_name||CLONE_NAME[clone]||clone,
        label:(CLONE_NAME[clone]||clone)+' '+tr('gp_grade')+' '+grade,
        baskets:0,fruits:0,net_kg:0};
      order.push(k);}
    const g=byKey[k]; g.baskets+=nb; g.fruits+=nf_; g.net_kg+=nk;});
  // heaviest clone first inside the farm's own selling order, then A before B before C
  order.sort((a,b)=>{
    const A=byKey[a],B=byKey[b];
    const ia=CLONE_SELL_ORDER.indexOf(A.clone), ib=CLONE_SELL_ORDER.indexOf(B.clone);
    if(ia!==ib)return (ia<0?99:ia)-(ib<0?99:ib);
    return String(A.grade).localeCompare(String(B.grade));});
  const groups=order.map(k=>{
    const g=byKey[k]; g.net_kg=+g.net_kg.toFixed(2); return g;});
  const d=reqDecision(e.uuid);
  // v3.9 — one entry per photographed basket, for the strip on the pass. Still weight and
  // count only: a photo is proof of a weighing, not a price.
  const photos=[];
  lines.forEach((x,i)=>{ const b=x.photo_b64||'';
    if(b)photos.push({basket_no:+x.basket_no||(i+1),net_kg:+x.net_kg||0,
      photo_kb:+x.photo_kb||photoKB(b),photo_b64:b,
      keyed_at:x.keyed_at||'',photo_at:x.photo_at||''}); });
  photos.sort((a,b)=>a.basket_no-b.basket_no);
  return Object.freeze({
    uuid:e.uuid,
    ref:String(e.uuid||'').replace(/-/g,'').slice(-6).toUpperCase(),
    vehicle_plate:String(e.vehicle_plate||'').toUpperCase(),
    // v3.9.2 — when the fruit was actually weighed, not just when the load was sent
    first_keyed_at:String(e.first_keyed_at||''),
    last_keyed_at:String(e.last_keyed_at||''),
    submitted_at:String(e.submitted_at||e.dt||''),
    keyed:lines.map((x,i)=>({basket_no:+x.basket_no||(i+1),
      keyed_at:x.keyed_at||'',photo_at:x.photo_at||'',net_kg:+x.net_kg||0})),
    attempt:Math.max(1,Math.floor(+e.attempt||1)),
    redo_of:String(e.redo_of||''),
    photos:photos,
    retailer_name:e.retailer_name||'',
    dt:e.dt||'',
    weighed_by:e.worker||'',
    status:d.state,
    basket_count:baskets,
    fruit_count:fruits,
    total_gross_kg:+gross.toFixed(2),
    total_tare_kg:+tare.toFixed(2),
    total_net_kg:+net.toFixed(2),
    groups:groups,
    note:e.note||'',
    photo_b64:e.photo_b64||'',
    synced:!!e.synced});}

/** The gatepass card. `gp-card` is the scroll anchor renderScaleCard() jumps to. */
function gatepassHTML(u){
  const s=gatepassSummary(u); if(!s)return '';
  const dead=supersededBy(s.uuid);
  const cls=s.status==='APPROVED'?'':(s.status==='CANCELLED'?' can':(s.status==='RETURNED'?' ret':' pend'));
  const stat=tr(s.status==='APPROVED'?'sc_approved'
    :(s.status==='CANCELLED'?'rl_cancelled':(s.status==='RETURNED'?'sc_returned':'sc_pending')));
  const fresh=s.status==='PENDING';
  const void_= !!dead || s.status==='CANCELLED';
  return '<div class="gpcard'+(void_?' dead':'')+'" id="gp-card">'+
    '<div class="gphead"><div class="gpt">'+esc(tr('gp_head'))+'</div>'+
      '<span class="gplock'+(void_?' void':cls)+'">'+
        esc(void_?tr(dead?'gp_superseded':'gp_cancelled'):(tr('gp_locked')+' · '+stat))+
        (s.attempt>1?(' · '+esc(tr('rl_attempt'))+' '+s.attempt):'')+'</span></div>'+

    // v3.9 — the lorry, big enough to read at arm's length. This IS the gate log.
    '<div class="gpplate">'+
      '<div><span class="gml">🚚 '+esc(tr('sc_plate'))+'</span>'+
        '<span class="plv">'+esc(s.vehicle_plate||'—')+'</span></div>'+
      '<div style="text-align:right"><span class="gml">'+esc(tr('gp_ref'))+'</span>'+
        '<b style="font-size:15px">'+esc(s.ref)+'</b></div>'+
    '</div>'+
    (dead?'<div class="deadbar">'+
      esc(tr('gp_supersededby').replace('%R',refOf(dead.uuid)))+'</div>':'')+

    '<div class="gpmeta">'+
      '<div><span class="gml">'+esc(tr('gp_merchant'))+'</span><b>'+esc(s.retailer_name||'—')+'</b></div>'+
    '</div>'+
    '<div class="gpmeta" style="padding-top:0">'+
      '<div><span class="gml">'+esc(tr('gp_time'))+'</span>'+esc(s.dt)+
        (s.first_keyed_at?('<br><span class="gwin">'+esc(tr('ts_window'))+' '+
          esc(hm(s.first_keyed_at))+' – '+esc(hm(s.last_keyed_at))+'</span>'):'')+
        (s.synced?'':' · '+esc(tr('sc_queued')))+'</div>'+
    '</div>'+

    '<div class="gpbig">'+
      '<div><span class="gbl">'+esc(tr('gp_baskets'))+'</span><b>'+s.basket_count+'</b></div>'+
      '<div><span class="gbl">'+esc(tr('gp_fruits'))+'</span><b>'+s.fruit_count+'</b></div>'+
      '<div><span class="gbl">'+esc(tr('gp_net'))+'</span><b>'+nf(s.total_net_kg)+
        '</b><span class="u">kg</span></div>'+
    '</div>'+

    '<div class="gpsec">'+tr('gp_tally')+'</div>'+
    '<div class="gptally">'+
      (s.groups.length
        ? s.groups.map(g=>'<div class="gprow">'+
            '<div class="gpg">'+esc(g.grade)+'</div>'+
            '<div class="gpn">'+esc(g.label)+
              '<span class="gps">'+g.baskets+' '+esc(tr('sc_basket')).toLowerCase()+
              (g.fruits?(' · '+g.fruits+' '+esc(tr('w_fruits'))):'')+'</span></div>'+
            '<div class="gpkg">'+nf(g.net_kg)+'<span>kg</span></div></div>').join('')
        : '<div class="alertnone">'+esc(tr('gp_nolines'))+'</div>')+
    '</div>'+

    '<div class="gptot"><span class="gtl">'+esc(tr('gp_net'))+'</span>'+
      '<span class="gtv">'+nf(s.total_net_kg)+' kg</span></div>'+
    '<div class="gpsub"><span>'+esc(tr('gp_gross'))+' '+nf(s.total_gross_kg)+' kg</span>'+
      '<span>'+esc(tr('gp_tare'))+' −'+nf(s.total_tare_kg)+' kg</span></div>'+

    // v3.9.2 — the gate log needs to say WHEN, basket by basket. A driver disputing a
    // load, or an Owner reading it back a week later, needs the weighing time and not
    // only the moment somebody pressed send.
    (s.keyed.some(x=>x.keyed_at)
      ? '<div class="gpsec">'+esc(tr('ts_head'))+'</div><div class="tblock">'+
        s.keyed.filter(x=>x.keyed_at).map(x=>'<div class="trow2">'+
          '<span>'+esc(tr('gp_basket'))+' '+x.basket_no+' · '+nf(x.net_kg)+' kg</span>'+
          '<b>'+esc(hm(x.keyed_at))+'</b></div>').join('')+
        '<div class="trow2 tsum"><span>'+esc(tr('ts_sent'))+'</span>'+
          '<b>'+esc(hm(s.submitted_at)||esc(s.dt))+'</b></div>'+
        '</div>'
      : '')+
    (s.note?'<div class="gpnote">'+esc(tr('gp_note'))+': '+esc(s.note)+'</div>':'')+
    (s.attempt>1&&s.redo_of
      ? '<div class="chain">'+esc(tr('gp_chain').replace('%A',s.attempt)
          .replace('%R',refOf(s.redo_of)))+'</div>' : '')+
    // v3.9 — one thumbnail per basket, so the driver can see every basket was photographed
    (s.photos.length
      ? '<div class="gpsec">'+esc(tr('gp_photos'))+'</div><div class="pstrip">'+
        s.photos.map(pp=>'<div class="pstile">'+
          '<img src="'+pp.photo_b64+'" onclick="showPhoto(\''+esc(pp.photo_b64)+'\',\''+
            esc(tr('gp_basket'))+' '+pp.basket_no+'\')">'+
          '<div class="pscap">'+esc(tr('gp_basket'))+' '+pp.basket_no+'<br>'+
            nf(pp.net_kg)+' kg'+(pp.keyed_at?('<br>'+esc(hm(pp.keyed_at).slice(0,5))):'')+
            '</div></div>').join('')+'</div>'
      : (s.photo_b64?'<img class="gpthumb" style="margin-top:11px" src="'+s.photo_b64+
        '" onclick="showPhoto(\''+esc(s.uuid)+'\',\''+esc(tr('sc_photook'))+'\',1)">':''))+

    // v3.8.1 — a load still sitting on this phone must SAY so. Before this it read
    // "PENDING" exactly like a load the office already had, and a failed upload was
    // invisible: the worker walked away believing Marketing had it.
    (s.synced?'':'<div class="notup">'+esc(tr('gp_notsent'))+'</div>')+
    '<div class="gpredact">'+esc(tr('gp_noprice'))+'</div>'+
    '<div class="gpacts">'+
      '<button class="submitwide" style="padding:18px 12px;font-size:15.5px" onclick="closeGatepass()">'+
        esc(tr(fresh?'gp_newload':'gp_close'))+'</button>'+
    '</div>'+
  '</div>';}

/* ======================================================================================
   v3.9 · FINISHING THE RETURNED-LOAD LOOP
   ======================================================================================
   Before this, RETURNED was a dead end. The word reached the worker's phone and stopped
   there, while the durian was still physically sitting at the shed or on the lorry. Two
   exits, and deliberately only two:

     FIX & RESEND  a NEW request that quotes the returned one through `redo_of`. The
                   returned record is never edited — the failed attempt stays visible for
                   ever, which is the whole point of an append-only log.
     CANCEL        the load is not going. No invoice, no credit movement; the fruit simply
                   stays counted as sitting in the shed.

   A worker may CANCEL but never APPROVE. Cancelling moves no money; approving does, and
   that stays with Marketing.

   MERCHANT AND CLONE ARE LOCKED on a correction. Both were agreed with the buyer before the
   lorry arrived, and letting a "fix" quietly become a different sale is exactly what an
   audit trail exists to prevent. If the buyer is wrong the worker cancels and starts clean.
   ====================================================================================== */

/** Loads this worker weighed that Marketing sent back and nobody has acted on yet. */
function myReturnedLoads(){
  return dispatchRequests()
    .filter(e=>!CFG||!CFG.uid||String(e.workerId||'')===String(CFG.uid||''))
    .filter(e=>reqDecision(e.uuid).state==='RETURNED')
    .filter(e=>!supersededBy(e.uuid))          // already fixed — no longer needs action
    .sort((a,b)=>String(b.dt).localeCompare(String(a.dt)));}

/** The later attempt that replaced this load, if there is one. */
function supersededBy(u){
  return dispatchRequests().find(e=>String(e.redo_of||'')===String(u))||null;}
/** The reason Marketing gave, from a local event or from the pulled-down decision. */
function returnReason(u){
  const ev=EVENTS.find(e=>e.type==='DISPATCH_REJECT'&&String(e.targetUuid||'')===String(u));
  if(ev)return {why:ev.reason||'',by:ev.worker||'',dt:ev.dt||''};
  const d=REQ_DECIDED[String(u)];
  return d?{why:d.reason||'',by:d.by||'',dt:d.dt||''}:{why:'',by:'',dt:''};}

/** The red panel at the top of the scale screen. A returned load must nag. */
function returnedActionHTML(){
  if(W_REDO)return '';                          // already working on one
  const q=myReturnedLoads(); if(!q.length)return '';
  return q.map(e=>{
    const r=returnReason(e.uuid);
    return '<div class="actbox"><div class="ah">↩ '+q.length+' '+
      esc(tr(q.length>1?'rl_headn':'rl_head'))+'</div>'+
      '<div class="rsn">'+(r.why?('“'+esc(r.why)+'”'):'—')+
        '<span class="s">'+esc(r.by)+' · '+esc(r.dt)+' · '+nf(e.total_kg)+' kg → '+
        esc(e.retailer_name||'')+' · '+esc(tr('gp_ref'))+' '+esc(refOf(e.uuid))+'</span></div>'+
      '<button class="submitwide" style="padding:17px 12px;font-size:14.5px" '+
        'onclick="startResend(\''+esc(e.uuid)+'\')">'+tr('rl_fix')+'</button>'+
      '<button class="bigbtn ghost" style="margin-top:8px;padding:14px;font-size:13.5px" '+
        'onclick="cancelLoad(\''+esc(e.uuid)+'\')">'+esc(tr('rl_cancel'))+'</button>'+
    '</div>';}).join('');}

/** The short human reference printed on a gatepass. */
function refOf(u){return String(u||'').replace(/-/g,'').slice(-6).toUpperCase();}

/**
 * Load a returned request back into the form for correction.
 * Weight, grade and the photos are editable. Merchant and clone are NOT — see the block
 * comment above. The photos are deliberately left BLANK: a resend that reuses the old
 * picture is just the same load again, and Marketing has already rejected that picture.
 */
function startResend(u){
  const e=reqById(u); if(!e){toast('That load is not on this phone',1);return;}
  const prev=Math.max(1,Math.floor(+e.attempt||1));
  W_REDO={uuid:u, attempt:prev+1, ref:refOf(u)};
  W_RET=e.retailer_id||'';
  W_PLATE=String(e.vehicle_plate||'').toUpperCase();
  W_NOTE=e.note||'';
  W_PHOTO=''; W_GATEPASS='';
  WLSEQ=0;
  WLINES=reqLines(e).map(x=>({k:'W'+(++WLSEQ),
    clone:x.clone||'MK', grade:x.grade||'A', basket:x.basket||'RED', baskets:1,
    gross:String(x.gross_kg!=null?x.gross_kg:''),
    fruits:String(x.fruits!=null?x.fruits:''),
    // v3.9.2 — a correction is a NEW weighing, so it gets a new clock. Carrying the old
    // stamp forward would date attempt 2 to when attempt 1 was weighed.
    keyed_at:'', photo_at:'',
    photo:''}));                                 // new pictures required, every basket
  if(!WLINES.length)WLINES=[newWLine()];
  renderScaleCard(); renderHub();
  toast(tr('rl_newphoto'),1);}

/** Walk away from a correction without sending it. Nothing is written. */
function abortResend(){
  W_REDO=null; WLINES=[newWLine()]; W_PHOTO=''; W_PLATE=''; W_NOTE=''; W_RET='';
  renderScaleCard(); renderHub();}

/**
 * Close a returned load for good. Rides the existing `audit` payload key exactly as
 * DISPATCH_REJECT does, so this needed no new backend plumbing at all.
 * No invoice, no credit movement — the fruit stays counted as shed backlog.
 */
async function cancelLoad(u){
  const e=reqById(u); if(!e)return;
  if(!confirm(tr('rl_cancelq')))return;
  const why=(prompt(tr('rl_cancelwhy'),'')||'').trim();
  if(!why){toast(tr('rl_cancelwhy'),1);return;}
  await persistEvent({uuid:uuid(),type:'DISPATCH_CANCEL',dt:now(),
    targetUuid:u, targetType:'DISPATCH_REQ', targetDt:e.dt||'',
    reason:why, worker:CFG.worker, workerId:CFG.uid||'', device:CFG.device, synced:false});
  badge(); renderScaleCard(); renderVerify(); renderHub();
  toast(tr('rl_cancelok'));}

/** Re-open a retained gatepass — the truck driver wants to check the load again. */
function openGatepass(u){
  if(!reqById(u)){toast('That load has not reached this phone yet',1);return;}
  W_GATEPASS=u; renderScaleCard();}
/** Leave gatepass mode and hand back a clean, empty entry form. */
function closeGatepass(){W_GATEPASS=''; renderScaleCard();
  const b=$('scalebox'); if(b)b.scrollIntoView({behavior:'smooth',block:'start'});}

// ---- the pending queue, derived from the ledger like everything else -----------------
/** A request is OPEN until a DISPATCH quotes its uuid or a DISPATCH_REJECT returns it.
 *  Derived, never stored — so a decision syncing in from the Marketer's phone closes the
 *  request on the worker's phone with no extra message type. */
function reqDecision(u){
  const ok=EVENTS.find(e=>e.type==='DISPATCH'&&String(e.req_uuid||'')===String(u));
  if(ok)return {state:'APPROVED',ev:ok,remote:null};
  const no=EVENTS.find(e=>e.type==='DISPATCH_REJECT'&&String(e.targetUuid||'')===String(u));
  if(no)return {state:'RETURNED',ev:no,remote:null};
  // v3.9 — a worker's own cancellation closes the load just as firmly.
  const cx=EVENTS.find(e=>e.type==='DISPATCH_CANCEL'&&String(e.targetUuid||'')===String(u));
  if(cx)return {state:'CANCELLED',ev:cx,remote:null};
  // v3.8.1 - decided on the marketer's phone and pulled down at the hotspot. A local
  // event always wins, so this can only ever ADD news, never contradict this phone's own.
  const d=REQ_DECIDED[String(u)];
  if(d&&(d.state==='APPROVED'||d.state==='RETURNED'||d.state==='CANCELLED'))
    return {state:d.state,ev:null,remote:d};
  return {state:'PENDING',ev:null,remote:null};}
function dispatchRequests(){return EVENTS.filter(e=>e.type==='DISPATCH_REQ');}
function pendingDispatches(){
  return dispatchRequests().filter(e=>reqDecision(e.uuid).state==='PENDING')
    .sort((a,b)=>String(a.dt).localeCompare(String(b.dt)));}
/** The name the brief uses. Same list, exposed so the schema reads as written. */
function pending_dispatches(){return pendingDispatches();}
function reqById(u){return dispatchRequests().find(e=>e.uuid===u)||null;}
/**
 * Re-price lines that have ALREADY been weighed.
 *
 * This is not the same job as dispTotals(), and conflating the two was a real bug: a
 * raw scale line carries `gross` + basket + count and has to have its tare taken off,
 * while a line on a submitted request is finished — `net_kg` is settled and the only
 * open question is what that weight is worth to THIS merchant. Running a finished line
 * back through the raw calculator reads `gross` as undefined and silently values the
 * whole load at zero, which looks exactly like an empty load.
 *
 * The worker's net weight is therefore never recomputed here, only re-priced. If the
 * marketer disputes the weight itself, the load is returned, not quietly adjusted.
 */
function repriceLines(lines,retId){
  let gross=0,tare=0,net=0,val=0,fruits=0;
  const byGrade={A:0,B:0,C:0}, out=[];
  (lines||[]).forEach(x=>{
    const nk=+x.net_kg||0; if(!(nk>0))return;
    const price=priceOf(x.clone,x.grade,retId);
    const value=+((nk*price).toFixed(2));
    gross+=(+x.gross_kg||nk); tare+=(+x.tare_kg||0); net+=nk; val+=value; fruits+=(+x.fruits||0);
    byGrade[x.grade]=+((byGrade[x.grade]||0)+nk).toFixed(2);
    // v3.10.1 — THE PHOTOS MUST NOT TRAVEL ON A PRICED LINE.
    // Since v3.9 each line carries its own ~28 KB picture. This function feeds the DISPATCH
    // event written at approval, whose `lines_json` goes into ONE spreadsheet cell — and
    // Google caps a cell at 50,000 characters. An eight-basket load produced 226,000. The
    // upload died with a bare "Failed to fetch" and the Owner could not approve anything.
    // The picture already lives on the DISPATCH_PHOTO tab keyed by req_uuid, and the
    // MKT_DISPATCH row records that req_uuid — which is exactly the v3.6 design: the
    // approved row POINTS AT the photo instead of carrying a second copy of it.
    const {photo_b64,photo_kb,...bare}=x;
    out.push({...bare, price_rm:price, value_rm:value,
      has_photo:(photo_b64?1:(x.has_photo||0)),
      clone_name:x.clone_name||CLONE_NAME[x.clone]||x.clone||'Mixed'});});
  return {lines:out, fruit_count:fruits,
    total_gross_kg:+gross.toFixed(2), total_tare_kg:+tare.toFixed(2),
    total_kg:+net.toFixed(2), total_value_rm:+val.toFixed(2),
    kg_A:+(byGrade.A||0).toFixed(2), kg_B:+(byGrade.B||0).toFixed(2), kg_C:+(byGrade.C||0).toFixed(2)};}

/** Scale lines off a request, tolerating the JSON round trip through the Sheet. */
function reqLines(e){
  if(!e)return [];
  if(Array.isArray(e.lines)&&e.lines.length)return e.lines;
  if(typeof e.lines_json==='string'&&e.lines_json){
    try{const p=JSON.parse(e.lines_json); if(Array.isArray(p))return p;}catch(x){}}
  return [];}

/* ======================================================================================
   v3.11 · SHARED SETTINGS — THE DIALS THE WHOLE FARM AGREES ON
   ======================================================================================
   WHAT WAS WRONG. `cloneprice`, `baskets` and `addtrees` were written to the editing phone's
   own storage and nothing ever sent them anywhere. So:
     · the Owner re-set the spot matrix each morning and Marketing invoiced Default Cash at
       whatever figure it happened to be holding;
     · the day the real basket tare is finally keyed, that phone becomes right and every
       other phone starts subtracting the wrong number from every load it weighs;
     · a tree added to the orchard could not be selected by the worker standing at it.

   WHO MAY WRITE. Whoever can already edit the screen: Owner and Marketing for the price
   matrix and the tare, Owner alone for the tree list. Not "Owner only" — Marketing has
   legitimately been able to set prices since v3.1 and taking that away would be a different
   change, made quietly.

   HOW A CLASH IS SETTLED. Newest `updated_at` wins, per setting, and the backend REFUSES an
   older write outright. Every screen that shows one of these values also shows who set it
   and when, so a worker whose arithmetic changes underneath them can see why.

   A SETTING IS NOT AN EVENT. This is the one thing in the system that is overwritten rather
   than appended. The append-only rule still governs the LOG; these are the farm's current
   dial positions, and history for them lives in the SETTINGS tab's own timestamps.
   ====================================================================================== */

/** Read the current value of a shared setting straight out of live state. */
function settingValue(k){
  if(k==='cloneprice')return CLONE_PRICE;
  if(k==='pricemeta') return PRICE_META;
  if(k==='baskets')   return BASKETS.map(b=>({id:b.id,name:b.name,tare_kg:+b.tare_kg||0,ic:b.ic}));
  if(k==='tareok')    return !!TARE_VERIFIED;
  if(k==='addtrees')  return ADDED_TREES;
  if(k==='agrodrafts')return AGRO_DRAFTS;
  if(k==='aialloc')   return AI_ALLOC;
  if(k==='newprods')  return NEW_PRODS;
  return null;}

/** Mark a setting as changed here and remember who did it. Called by every saver. */
async function markSetting(k){
  if(SETTINGS_KEYS.indexOf(k)<0)return;
  SET_META[k]={updated_at:nowSec(),updated_by:(CFG&&CFG.worker)||'',role:myRole()};
  SET_DIRTY[k]=true;
  if(db){await put('kv',{k:'setmeta',v:SET_META});await put('kv',{k:'setdirty',v:SET_DIRTY});}
  badge();}

function setUnsynced(){return Object.keys(SET_DIRTY).filter(k=>SET_DIRTY[k]).length;}

/** Everything this phone has changed and not yet shared. */
function settingsQueue(){
  const out={};
  Object.keys(SET_DIRTY).forEach(k=>{
    if(!SET_DIRTY[k]||SETTINGS_KEYS.indexOf(k)<0)return;
    const m=SET_META[k]||{};
    out[k]={value:settingValue(k),updated_at:m.updated_at||nowSec(),
      updated_by:m.updated_by||'',role:m.role||myRole(),device:(CFG&&CFG.device)||''};});
  return out;}

async function pushSettings(){
  const q=settingsQueue(); const n=Object.keys(q).length;
  if(!n||!CFG||!CFG.url||!navigator.onLine)return false;
  for(let attempt=1;attempt<=SYNC_TRIES;attempt++){
    try{
      const r=await fetchT(CFG.url,{method:'POST',body:JSON.stringify({settings:q}),
        headers:{'Content-Type':'text/plain;charset=utf-8'}});
      const j=await r.json();
      if(j&&j.ok&&j.settings){
        Object.keys(q).forEach(k=>{delete SET_DIRTY[k];});
        if(db)await put('kv',{k:'setdirty',v:SET_DIRTY});
        clearSyncFail('settings'); badge(); renderSync();
        // the backend refuses an edit older than what it already holds — say so rather
        // than letting the phone believe its figure is now the farm's figure
        if(Array.isArray(j.refused)&&j.refused.length)
          toast('⚠ '+tr('st_refused')+': '+j.refused.join(', '),1);
        return true;}
      noteSyncFail('settings',tr('sy_l_settings'),n,tr('sy_oldbackend'));
      return false;
    }catch(err){
      if(attempt<SYNC_TRIES)await new Promise(r=>setTimeout(r,SYNC_BACKOFF_MS));
      else noteSyncFail('settings',tr('sy_l_settings'),n,
        (err&&err.name==='AbortError')?tr('sy_timeout'):((err&&err.message)||'network'));}}
  return false;}

/**
 * Adopt the farm's settings. Per key: a newer stamp than ours replaces our value; ours
 * being newer, or dirty, keeps it. Returns the keys that actually changed, so the caller
 * can tell the person on this phone what moved under them.
 */
async function mergeSettings(map){
  if(!map||typeof map!=='object')return [];
  const changed=[];
  for(const k of SETTINGS_KEYS){
    const inc=map[k]; if(!inc||inc.value==null)continue;
    if(SET_DIRTY[k])continue;                       // our unpushed edit wins until it goes up
    const mine=(SET_META[k]||{}).updated_at||'';
    const theirs=String(inc.updated_at||'');
    if(!theirs)continue;
    if(mine&&theirs<=mine)continue;                 // ours is the same or newer
    if(await applySetting(k,inc.value)){
      SET_META[k]={updated_at:theirs,updated_by:String(inc.updated_by||''),
        role:String(inc.role||'')};
      changed.push(k);}}
  if(changed.length&&db)await put('kv',{k:'setmeta',v:SET_META});
  return changed;}

/** Write one incoming setting into live state and to disk. */
async function applySetting(k,v){
  try{
    if(k==='cloneprice'){
      if(!v||typeof v!=='object')return false;
      // OVERLAY the seed, never replace it — a clone or grade added in a later release must
      // appear immediately instead of arriving as RM 0 from an older phone's table.
      const merged=priceMatrixCopy(CLONE_PRICE_SEED);
      Object.keys(v).forEach(c=>{ if(!merged[c])return;
        Object.keys(v[c]||{}).forEach(g=>{ if(hasGrade(c,g))merged[c][g]=+v[c][g]||0; });});
      CLONE_PRICE=merged; if(db)await put('kv',{k:'cloneprice',v:CLONE_PRICE});
      return true;}
    if(k==='pricemeta'){
      if(!v||typeof v!=='object')return false;
      PRICE_META=v; if(db)await put('kv',{k:'pricemeta',v:PRICE_META}); return true;}
    if(k==='baskets'){
      if(!Array.isArray(v)||!v.length)return false;
      BASKETS=BASKET_SEED.map(seed=>{
        const got=v.find(x=>String(x.id)===String(seed.id));
        return got?{...seed,tare_kg:+got.tare_kg||0,name:got.name||seed.name}:{...seed};});
      if(db)await put('kv',{k:'baskets',v:BASKETS});
      return true;}
    if(k==='tareok'){
      TARE_VERIFIED=!!v; if(db)await put('kv',{k:'tareok',v:TARE_VERIFIED}); return true;}
    if(k==='addtrees'){
      if(!Array.isArray(v))return false;
      ADDED_TREES=v.filter(t=>t&&t.id);
      if(db)await put('kv',{k:'addtrees',v:ADDED_TREES});
      // the tree list is built at boot from TREE_MASTER + ADDED_TREES, so it has to be
      // rebuilt here or the new tree still cannot be picked on this phone
      if(typeof applyAddedTrees==='function')applyAddedTrees();
      return true;}

    /* --- v3.12 -------------------------------------------------------------------
       These three MERGE rather than replace. Replacement is right for a price matrix —
       there is one of it and the newest one wins. It is wrong here, because three
       different people write these three keys from three different phones on the same
       morning: the Owner issues a directive while the Purchaser is onboarding a drum of
       Fetto. Whole-object newest-wins would make one of them lose their morning's work.
       Merging per record, newest-per-record wins, converges to the same state on every
       phone no matter what order the pulls arrive in. -------------------------------- */
    if(k==='agrodrafts'){
      if(!Array.isArray(v))return false;
      const by={}; AGRO_DRAFTS.forEach(d=>{if(d&&d.uuid)by[d.uuid]=d;});
      v.forEach(d=>{ if(!d||!d.uuid)return;
        const mine=by[d.uuid];
        // a record with no stamp is older than one that has one; equal stamps keep ours
        if(!mine||String(d.at||'')>String(mine.at||''))by[d.uuid]=d;});
      AGRO_DRAFTS=Object.keys(by).map(u=>by[u])
        .sort((a,b)=>String(a.at||'')<String(b.at||'')?1:-1);
      if(db)await put('kv',{k:'agrodrafts',v:AGRO_DRAFTS});
      return true;}
    if(k==='aialloc'){
      if(!v||typeof v!=='object')return false;
      Object.keys(v).forEach(key=>{
        const inc=v[key]; if(!inc)return;
        const mine=AI_ALLOC[key];
        if(!mine||String(inc.at||'')>String(mine.at||''))AI_ALLOC[key]=inc;});
      if(db)await put('kv',{k:'aialloc',v:AI_ALLOC});
      return true;}
    if(k==='newprods'){
      if(!Array.isArray(v))return false;
      // union by nid. A catalogue item is never deleted, so union can never lose one —
      // the same landmine class as the empty-basket-list guard above.
      const by={}; NEW_PRODS.forEach(p=>{if(p&&p.nid)by[p.nid]=p;});
      v.forEach(p=>{ if(!p||!p.nid)return; if(!by[p.nid])by[p.nid]=p;});
      NEW_PRODS=Object.keys(by).map(n=>by[n]).sort((a,b)=>a.nid<b.nid?-1:1);
      if(db)await put('kv',{k:'newprods',v:NEW_PRODS});
      applyNewProducts();
      if(typeof refreshInventoryViews==='function')refreshInventoryViews();
      return true;}
  }catch(e){return false;}
  return false;}

/** "set by Amin · 06:12 today" — shown wherever one of these values is used. */
function settingStamp(k){
  const m=SET_META[k]; if(!m||!m.updated_at)return '';
  const d=String(m.updated_at).slice(0,10), t=hm(m.updated_at).slice(0,5);
  const when=(d===todayStr())?(tr('st_today')+' '+t):(d+' '+t);
  return tr('st_setby')+' '+(m.updated_by||'—')+' · '+when;}

/** The provenance strip shown under any value that came out of the shared channel.
 *  Three states, and the screen must never be ambiguous about which one it is in:
 *    · dirty  — edited here, still only on this phone  → loud amber, tells them to Send Data
 *    · stamped— arrived from the office / went up      → who set it and when
 *    · silent — never changed since setup              → the seed value
 *  This exists because the audit found the opposite: a price edited on one phone looked
 *  identical to a price the whole farm agreed on. */
function shareBox(keys){
  const ks=[].concat(keys);
  const dirty=ks.filter(k=>SET_DIRTY[k]);
  if(dirty.length)
    return '<div class="notup" style="margin:6px 0"><b>⚠ '+esc(tr('st_notshared'))+'</b> · '+
      esc(dirty.map(k=>tr('st_'+k,k)).join(', '))+
      '<div class="small" style="margin-top:4px">'+esc(tr('st_notsharednote'))+'</div></div>';
  const st=ks.map(k=>settingStamp(k)).filter(Boolean);
  if(!st.length)
    return '<div class="exphint" style="margin:6px 0">'+esc(tr('st_neverset'))+'</div>';
  return '<div class="exphint" style="margin:6px 0">✓ '+esc(st[0])+' · '+esc(tr('st_updated'))+'</div>';}

/* ======================================================================================
   v3.10 · OPTION B — A PHOTO IS FETCHED WHEN SOMEBODY OPENS IT
   ======================================================================================
   Photos were 88% of every sync and 100% of them travelled to phones that never opened
   one. They no longer come down with the bulk pull at all. The load list arrives carrying
   `has_photo` and `photo_kb`, so the marketer's screen can still say a photograph exists;
   the picture itself is pulled the moment they tap it.

   Marketing confirmed they always have coverage, which is what makes this safe. A worker
   is unaffected either way: their own photos never left their phone.
   ====================================================================================== */
const PHOTO_CACHE={};                       // req_uuid -> [{basket_no, photo_b64}], this session

/** Pull one load's pictures. Returns [] if the phone is offline or the Sheet has none. */
async function fetchPhotosFor(u){
  const key=String(u||''); if(!key)return [];
  if(PHOTO_CACHE[key])return PHOTO_CACHE[key];
  if(!CFG||!CFG.url||!navigator.onLine)return [];
  try{
    const r=await fetchT(CFG.url+'?photo='+encodeURIComponent(key),{},SYNC_TIMEOUT_MS);
    const j=await r.json();
    const list=(j&&j.ok&&Array.isArray(j.photos))?j.photos:[];
    PHOTO_CACHE[key]=list;
    // hang them back on the event in memory so the rest of the app is unchanged
    const e=reqById(key);
    if(e&&list.length){
      const byNo={}; list.forEach(pp=>{byNo[String(pp.basket_no)]=pp;});
      const lines=reqLines(e);
      e.lines=lines.map((L,i)=>{
        const hit=byNo[String(L.basket_no!=null?L.basket_no:(i+1))];
        return hit?{...L,photo_b64:hit.photo_b64,photo_kb:hit.photo_kb}:L;});
      if(!e.photo_b64&&e.lines[0])e.photo_b64=e.lines[0].photo_b64||'';}
    return list;
  }catch(err){return [];}}

/** The marketer tapped a load's photo. Get it, then open the lightbox. */
async function openReqPhoto(u,title){
  const e=reqById(u);
  if(e&&e.photo_b64){showPhoto(u,title,1);return;}
  if(!navigator.onLine){toast(tr('sy_photooffline'),1);return;}
  toast(tr('sy_photoget'));
  const list=await fetchPhotosFor(u);
  if(!list.length){toast(tr('sy_photonone'),1);return;}
  renderVerify();
  showPhoto(u,title,1);}

// ---- the photo lightbox --------------------------------------------------------------
// PHOTO_SEEN is what makes the audit real rather than a checkbox: Approve stays disabled
// until the Marketer has actually opened the picture at full size on this device.
let PHOTO_SEEN={};
function showPhoto(src,title,isUuid){
  let img=src;
  if(isUuid){const e=reqById(src); img=e?e.photo_b64:''; if(e)PHOTO_SEEN[e.uuid]=true;}
  if(!img){toast('That photo has not reached this phone yet — sync at the hotspot',1);return;}
  const box=$('lightbox'); if(!box)return;
  $('lb-title').textContent=title||'Scale photo';
  $('lb-img').src=img;
  box.classList.remove('hidden');
  if(isUuid)renderVerify();}
function closePhoto(){const b=$('lightbox');if(b)b.classList.add('hidden');const i=$('lb-img');if(i)i.src='';}

// ---- the Marketer's verification hub -------------------------------------------------
let VERIFY_SEL='', vSaving=false;
function openVerify(u){VERIFY_SEL=(VERIFY_SEL===u?'':u);renderVerify();}

function renderVerify(){
  const box=$('verifybox'); if(!box)return;
  if(!canDispatch()){box.innerHTML='';VERIFY_SEL='';return;}
  const q=pendingDispatches();
  box.innerHTML=
    '<div class="cnote">Every load a worker weighed, waiting on you. <b>Open the photo</b> and read the '+
      'scale in the picture against the figures beside it. Approve writes the invoice, takes the credit '+
      'down and copies the WhatsApp receipt — so it is checked here or it is not checked at all.</div>'+
    (q.length?q.map(e=>verifyCardHtml(e)).join('')
      :'<div class="alertnone">Nothing waiting. Workers submit loads from Daily Ops → MORNING SCALE.</div>')+
    verifyHistory();}

/**
 * v3.9 — WHAT THE WORKER ACTUALLY CHANGED between the returned attempt and this one.
 *
 * The case this exists to catch is a worker who resends without changing anything. Without
 * a diff, attempt 2 looks like a brand new load and the same error walks straight through.
 * Weight and count only — a marketer's screen may show money, but this comparison is about
 * the physical load, not its value.
 */
function attemptDiff(cur){
  const prev=cur&&cur.redo_of?reqById(cur.redo_of):null;
  if(!prev)return null;
  const a=reqLines(prev), b=reqLines(cur);
  const rows=[], sum=l=>l.reduce((s,x)=>s+(+x.gross_kg||0),0);
  const g0=+sum(a).toFixed(2), g1=+sum(b).toFixed(2);
  const n0=+prev.total_kg||0, n1=+cur.total_kg||0;
  const f0=+prev.fruit_count||0, f1=+cur.fruit_count||0;
  const push=(lbl,o,n,unit)=>rows.push({lbl,o,n,unit:unit||'',same:String(o)===String(n)});
  push(tr('vf_gross'),g0,g1,' kg');
  push(tr('vf_net'),n0,n1,' kg');
  push(tr('sc_fruitcount'),f0,f1,'');
  const p0=(a[0]||{}).photo_b64||prev.photo_b64||'', p1=(b[0]||{}).photo_b64||cur.photo_b64||'';
  // v3.10 — with photos fetched on demand, "both blank" means NOT LOADED, not "identical".
  // Reporting that as unchanged would tell a marketer the worker resent the same picture
  // when nobody has looked at either of them yet.
  const known=!!(p0&&p1);
  rows.push({lbl:tr('vf_photo'),o:'',
    n:known?tr(p0===p1?'vf_same':'vf_replaced'):tr('vf_photounknown'),
    unit:'',same:known&&p0===p1,photo:true,unknown:!known});
  const gr0=a.map(x=>x.clone+x.grade).join(','), gr1=b.map(x=>x.clone+x.grade).join(',');
  push(tr('sc_grade'),gr0,gr1,'');
  // a resend can only be called "nothing changed" if every row is KNOWN to be unchanged
  return {prev:prev, rows:rows, nothing:rows.every(r=>r.same&&!r.unknown),
    photoOld:p0, photoNew:p1, attempt:Math.max(2,Math.floor(+cur.attempt||2))};}

function verifyCardHtml(e){
  const open=VERIFY_SEL===e.uuid;
  const seen=!!PHOTO_SEEN[e.uuid];
  const att=Math.max(1,Math.floor(+e.attempt||1));
  const dif=att>1?attemptDiff(e):null;
  const rr=dif?returnReason(dif.prev.uuid):null;
  const t=repriceLines(reqLines(e),e.retailer_id);
  const before=retailerCredit(e.retailer_id), after=+((before-t.total_value_rm).toFixed(2));
  const short=after<CREDIT_FLOOR_RM;
  const unpriced=t.lines.filter(x=>!(x.price_rm>0));
  const r=retailerById(e.retailer_id);
  return '<div class="vcard'+(open?' open':'')+'">'+
    '<div class="vhead" onclick="openVerify(\''+esc(e.uuid)+'\')">'+
      (e.photo_b64?('<img class="reqthumb" src="'+e.photo_b64+'">')
        :(e.has_photo?'<div class="reqthumb tapload">📷<br>TAP</div>'
                     :'<div class="reqthumb none">no photo</div>'))+
      '<div class="reqmid"><b>'+nf(e.total_kg)+' kg</b> → '+esc(e.retailer_name||'')+
        '<div class="pa">'+esc(e.dt)+' · weighed by '+esc(e.worker||'')+
        (e.first_keyed_at?(' · 🕒 '+esc(hm(e.first_keyed_at))+'–'+esc(hm(e.last_keyed_at))):'')+
        (e.vehicle_plate?(' · 🚚 '+esc(e.vehicle_plate)):'')+(e.synced?'':' · queued')+'</div></div>'+
      (att>1?'<span class="attchip'+(att>=4?' hot':(att>=3?' warn':''))+'">'+
        esc(tr('vf_attempt'))+' '+att+'</span>':'')+
      '<span class="cstat '+(seen?'a':'s')+'">'+(seen?'PHOTO SEEN':'CHECK')+'</span>'+
    '</div>'+
    (!open?'':(
      // ---- the audit itself: photo on one side, what was typed on the other ----
      '<div class="vbody">'+
      // v3.9 — a correction is never audited as if it were a fresh load.
      (dif?('<div class="hist">'+esc(tr('vf_prevreturn').replace('%A',(dif.attempt-1)))+
          ' “'+esc((rr&&rr.why)||'')+'”</div>'+
        (dif.nothing?'<div class="nochg">'+esc(tr('vf_nochange'))+'</div>':'')+
        '<div class="chgbox"><div class="chgh">'+esc(tr('vf_changed'))+'</div>'+
        dif.rows.map(r=>'<div class="chg'+(r.same?' same':'')+'"><span>'+esc(r.lbl)+'</span>'+
          '<span>'+(r.same
            ? (r.photo?esc(String(r.n)):esc(String(r.n)+r.unit)+' — '+esc(tr('vf_same')))
            : (r.photo?('<b>'+esc(String(r.n))+'</b>')
               :('<s>'+esc(String(r.o)+r.unit)+'</s> → <b>'+esc(String(r.n)+r.unit)+'</b>')))+
          '</span></div>').join('')+'</div>'+
        // both pictures, side by side. This is how a genuine re-weigh is told from the
        // same photograph sent twice.
        (dif.photoOld||dif.photoNew
          ? '<div class="pair">'+
            '<div class="pp"><img class="ppim old" src="'+(dif.photoOld||'')+'" '+
              'onclick="showPhoto(\''+esc(dif.photoOld||'')+'\',\''+
              esc(tr('vf_before').replace('%A',(dif.attempt-1)))+'\')">'+
              '<div class="ppc">'+esc(tr('vf_before').replace('%A',(dif.attempt-1)))+'</div></div>'+
            '<div class="pp"><img class="ppim" src="'+(dif.photoNew||'')+'" '+
              'onclick="showPhoto(\''+esc(dif.photoNew||'')+'\',\''+esc(tr('vf_after'))+'\')">'+
              '<div class="ppc">'+esc(tr('vf_after'))+'</div></div></div>'
          : '')):'')+
      '<div class="vsplit">'+
        '<div class="vphoto">'+
          (e.photo_b64
            ? '<img class="photothumb big" src="'+e.photo_b64+'" onclick="showPhoto(\''+esc(e.uuid)+
              '\',\'Scale photo — '+esc(e.worker||'')+'\',1)">'+
              '<div class="photometa">Tap to enlarge · '+(+e.photo_kb||photoKB(e.photo_b64))+' KB</div>'
            // v3.10 — the picture is on the Sheet, not on this phone until you ask for it.
            : (e.has_photo
              ? '<div class="getphoto" onclick="openReqPhoto(\''+esc(e.uuid)+'\',\'Scale photo — '+
                  esc(e.worker||'')+'\')">📷 '+esc(tr('sy_photoopen'))+
                  '<span class="s">'+(+e.photo_kb||28)+' KB · '+esc(tr('sy_photowhy'))+'</span></div>'
              : '<div class="photonone">This load carries no photo. It was submitted by an older build — '+
                'check it against the worker directly before approving.</div>'))+
        '</div>'+
        '<div class="vfields">'+
          reqLines(e).map(x=>'<div class="vf"><span class="lbl">'+esc(x.clone_name||x.clone)+' · Grade '+
            esc(x.grade)+'</span><span>'+nf(x.gross_kg)+' gross − '+nf(x.tare_kg)+' tare = <b>'+
            nf(x.net_kg)+' kg</b>'+(x.fruits?(' · '+x.fruits+' fruits'):'')+'</span></div>').join('')+
          '<div class="vf tot"><span>TOTAL NET</span><span><b>'+nf(e.total_kg)+' kg</b></span></div>'+
          (e.note?('<div class="vf"><span class="lbl">Note</span><span>'+esc(e.note)+'</span></div>'):'')+
        '</div>'+
      '</div>'+
      contractBanner(e.retailer_id)+
      '<div class="invbox">'+
        t.lines.map(x=>'<div class="ir"><span class="lbl">'+esc(x.clone_name)+' · Grade '+x.grade+
          ' — '+nf(x.net_kg)+' kg × '+rm(x.price_rm)+'</span><span>'+rm(x.value_rm)+'</span></div>').join('')+
        '<div class="ir tot"><span>INVOICE VALUE</span><span>'+rm(t.total_value_rm)+'</span></div>'+
      '</div>'+
      '<div class="credok'+(short?' credlow':'')+'">Credit now <b>'+rm(before)+'</b> → after this '+
        'dispatch <b>'+rm(after)+'</b></div>'+
      (unpriced.length?('<div class="critbox">No rate on file for '+
        esc(unpriced.map(x=>x.clone+' Grade '+x.grade).join(', '))+' under '+esc((r||{}).name||'')+
        '’s price book. Set it in PRICES &amp; RETAILERS before approving.</div>'):'')+
      (short?('<div class="critbox flash">CRITICAL: Insufficient Retailer Credit for Dispatch!<br>'+
        '<span style="font-weight:700;font-size:11.5px">'+esc((r||{}).name||'')+' holds '+rm(before)+
        ' but this load is worth '+rm(t.total_value_rm)+'.</span></div>'):'')+
      (!seen?('<div class="mustsee">🔒 Open the photo first. Approve unlocks once you have looked at '+
        'the scale display on this phone.</div>'):'')+
      '<button class="bigbtn" '+((!seen||unpriced.length||short)?'disabled ':'')+
        'onclick="approveReq(\''+esc(e.uuid)+'\')">'+
        (!seen?'🔒 AUDIT THE PHOTO FIRST'
              :(unpriced.length?'🔒 MISSING PRICE'
              :(short?'🔒 CREDIT EXCEEDED — top up or dispatch from the retailer card'
              :'✓ APPROVE &amp; DISPATCH')))+'</button>'+
      '<button class="bigbtn ghost" style="margin-top:7px;padding:12px;font-size:13.5px" '+
        'onclick="rejectReq(\''+esc(e.uuid)+'\')">↩ RETURN TO WORKER</button>'+
      '</div>'));}

/** Recently decided loads stay visible for a day so a mistake is noticed while it is
 *  still fresh. The rows are read-only — a wrong approval is fixed with a credit top-up,
 *  never by unpicking the invoice. */
function verifyHistory(){
  const rows=dispatchRequests().map(e=>({e:e,d:reqDecision(e.uuid)}))
    .filter(x=>x.d.state!=='PENDING')
    .sort((a,b)=>String(b.e.dt).localeCompare(String(a.e.dt))).slice(0,10);
  if(!rows.length)return '';
  return '<div class="sec" style="margin-top:15px">Recently decided</div>'+
    rows.map(x=>'<div class="reqrow">'+
      (x.e.photo_b64?('<img class="reqthumb" src="'+x.e.photo_b64+'" onclick="showPhoto(\''+
        esc(x.e.uuid)+'\',\'Scale photo\',1)">'):'<div class="reqthumb none">no photo</div>')+
      '<div class="reqmid"><b>'+nf(x.e.total_kg)+' kg</b> → '+esc(x.e.retailer_name||'')+
      // v3.9 — `ev` is null when the decision was taken on ANOTHER phone and pulled down
      // into REQ_DECIDED (v3.8.1). Reading .reason off it crashed this whole panel the
      // first time a marketer opened it after a colleague decided a load. Caught by the
      // screenshot pass, not by a test — hence test 20.x below.
      '<div class="pa">'+esc(x.e.dt)+' · '+esc(x.e.worker||'')+
      (x.d.state==='APPROVED'&&x.d.ev&&x.d.ev.invoice_no?(' · '+esc(x.d.ev.invoice_no)):'')+
      (x.d.state!=='APPROVED'&&(decReason(x.d)?(' · '+esc(decReason(x.d))):''))+'</div></div>'+
      '<span class="cstat '+(x.d.state==='APPROVED'?'a':(x.d.state==='CANCELLED'?'c':'r'))+'">'+
      esc(x.d.state)+'</span></div>').join('');}
/** The reason on a decision, whichever phone it was taken on. */
function decReason(d){
  if(!d)return '';
  if(d.ev&&d.ev.reason)return d.ev.reason;
  if(d.remote&&d.remote.reason)return d.remote.reason;
  return '';}

/** THE handshake completing. Writes the ordinary DISPATCH event, so the invoice serial,
 *  the credit deduction, the delivery ledger, the yield audit and the WhatsApp receipt
 *  all behave exactly as they do for a direct dispatch — one code path downstream. */
async function approveReq(u){
  if(vSaving)return;
  if(!canDispatch()){toast('Only the Owner or Marketing can approve a dispatch',1);return;}
  const e=reqById(u); if(!e){toast('That load is not on this phone',1);return;}
  if(reqDecision(u).state!=='PENDING'){toast('That load has already been decided',1);renderVerify();return;}
  if(!PHOTO_SEEN[u]){toast('Open the photo and check it first',1);return;}
  const r=retailerById(e.retailer_id);
  if(!r){toast('That merchant is no longer on the list',1);return;}
  if(String(r.status||'Active')!=='Active'){toast('That merchant is suspended',1);return;}
  const t=repriceLines(reqLines(e),e.retailer_id);
  if(!(t.total_kg>0)){toast('This load has no weight on it',1);return;}
  if(t.lines.some(x=>!(x.price_rm>0))){toast('A rate is missing — set it in PRICES & RETAILERS',1);return;}
  const before=retailerCredit(e.retailer_id), after=+((before-t.total_value_rm).toFixed(2));
  if(after<CREDIT_FLOOR_RM){toast('Credit exceeded — top up, or dispatch from the retailer card with an Owner override',1);return;}
  if(!confirm('Approve '+nf(t.total_kg)+' kg to '+r.name+' for '+rm(t.total_value_rm)+'?\n\n'+
    'Weighed by '+(e.worker||'')+', photo checked by '+((CFG&&CFG.worker)||'')+'.\n'+
    'This writes the invoice and takes the credit down to '+rm(after)+'.'))return;
  vSaving=true;
  const du=uuid(), stamp=now(), serial=nextInvoiceSerial(stamp);
  try{
    await persistEvent({uuid:du,type:'DISPATCH',dt:stamp,
      invoice_no:serial,
      retailer_id:r.id, retailer_name:r.name, contact:r.contact||'',
      pricing:pricingModeOf(r.id),
      lines:t.lines, lines_json:JSON.stringify(t.lines), line_count:t.lines.length,
      kg_A:t.kg_A, kg_B:t.kg_B, kg_C:t.kg_C, fruit_count:t.fruit_count,
      total_gross_kg:t.total_gross_kg, total_tare_kg:t.total_tare_kg,
      total_kg:t.total_kg, total_value_rm:t.total_value_rm,
      credit_before_rm:before, credit_after_rm:after,
      over_credit:false, override_by:'', override_at:'',
      // the three signatures, on the row itself
      req_uuid:e.uuid, weighed_by:e.worker||'', weighed_at:e.dt,
      verified_by:CFG.worker, verified_at:stamp, photo_kb:+e.photo_kb||photoKB(e.photo_b64),
      note:e.note||'',
      worker:CFG.worker, workerId:CFG.uid||'', device:CFG.device, synced:false});
  } finally { vSaving=false; }
  LAST_INVOICE_UUID=du;
  VERIFY_SEL='';
  badge(); renderVerify(); renderDispatch(); renderMktLedger(); renderMarketing();
  renderYieldAudit(); renderScaleCard(); renderDailyAudit(); renderMatrix(); renderHub();
  toast('✓ '+serial+' · '+nf(t.total_kg)+' kg to '+r.name+' · '+rm(t.total_value_rm));
  copyReceipt(du,true);}

/** Returning a load is an EVENT with a written reason, not a deletion. The worker's
 *  original request stays on the record beside the reason it came back. */
async function rejectReq(u){
  if(!canDispatch()){toast('Only the Owner or Marketing can return a load',1);return;}
  const e=reqById(u); if(!e)return;
  if(reqDecision(u).state!=='PENDING'){toast('That load has already been decided',1);return;}
  const res=await askForm({
    title:'Return to '+(e.worker||'the worker'),
    sub:'Say what does not match, in the words you would use on the radio. The worker sees this and re-weighs.',
    f1:{label:'What is wrong',type:'text',value:'',placeholder:'e.g. photo shows 41.2 kg, form says 51.2'},
    ok:'↩ RETURN LOAD'});
  if(!res)return;
  const why=String(res.v1||'').trim();
  if(why.length<4){toast('Give the worker a reason they can act on',1);return;}
  await persistEvent({uuid:uuid(),type:'DISPATCH_REJECT',dt:now(),
    targetUuid:e.uuid, targetType:'DISPATCH_REQ', targetDt:e.dt, targetWorker:e.worker||'',
    detail:{kg:+e.total_kg||0,retailer:e.retailer_name||''},
    reason:why, worker:CFG.worker, workerId:CFG.uid||'', device:CFG.device, synced:false});
  VERIFY_SEL='';
  badge(); renderVerify(); renderScaleCard(); renderHub();
  toast('↩ Returned to '+(e.worker||'the worker'));}

// ---- sync: requests get their own payload key, per the v3.2 rule ---------------------
let dreqWarned=false;
function dreqQueue(){return EVENTS.filter(e=>e.type==='DISPATCH_REQ'&&!e.synced);}
/** NOTE the asymmetry with slimDispatch(): a worker's DISPATCH_REQ photos MUST travel —
 *  they are the proof being uploaded. saveDispatchReqs_ splits them into DISPATCH_PHOTO on
 *  arrival, one row per basket, so no single cell is ever overloaded. */
async function pushDispatchReqs(){
  return pushOwnKey(dreqQueue(),'dispatchreqs','dispatchreqs',
    m=>{if(!dreqWarned){dreqWarned=true;toast(m,1);}},
    'Scale photos kept on this phone — update the Apps Script to add the DISPATCH_REQ tab',
    tr('sy_l_scale'));}
/** Requests come back DOWN as well as up: the worker weighs on one phone and the
 *  Marketer audits on another, so without this the hub would only ever show loads
 *  weighed on the Marketer's own device — the v3.5 divergence bug, repeated. */
async function mergeDispatchReqs(list,photos){
  if(!Array.isArray(list)||!list.length)return 0;
  let n=0;
  for(const x of list){
    if(!x||!x.uuid)continue;
    if(EVENTS.some(e=>e.uuid===x.uuid))continue;
    const e={...x,type:'DISPATCH_REQ',synced:true,syncedAt:now()};
    if(typeof e.lines==='string'){try{e.lines=JSON.parse(e.lines);}catch(err){e.lines=[];}}
    if(typeof e.lines_json==='string'&&(!Array.isArray(e.lines)||!e.lines.length)){
      try{const p=JSON.parse(e.lines_json); if(Array.isArray(p))e.lines=p;}catch(err){}}
    // v3.9 — the basket photos travelled in their own tab, so hang them back on the lines
    // they belong to. Matched by basket_no, never by position: a line dropped in transit
    // would otherwise silently attach every photo to the wrong basket.
    const pl=(photos&&photos[e.uuid])||null;
    if(pl&&Array.isArray(e.lines)){
      const byNo={}; pl.forEach(pp=>{byNo[String(pp.basket_no)]=pp;});
      e.lines=e.lines.map((L,i)=>{
        const hit=byNo[String(L.basket_no!=null?L.basket_no:(i+1))];
        return hit?{...L,photo_b64:hit.photo_b64,photo_kb:hit.photo_kb}:L;});
      if(!e.photo_b64&&e.lines[0]&&e.lines[0].photo_b64)e.photo_b64=e.lines[0].photo_b64;}
    EVENTS.push(e); if(db)await put('events',e); n++;}
  if(n)rebuildLedgers();
  return n;}

/**
 * v3.8.1 - PULL THE DECISION DOWN.
 *
 * THE MONEY GUARD IS THE POINT OF THIS FUNCTION. An approved load's row on the Sheet
 * carries `invoice_no`, `total_value_rm`, `credit_before_rm` and `credit_after_rm`. Copying
 * the row wholesale would put live prices and a merchant's credit balance onto a farm
 * worker's phone, which is the one thing this whole design exists to prevent. Six fields
 * are copied by name and nothing else is even looked at.
 */
async function mergeDispatchDecisions(list){
  if(!Array.isArray(list)||!list.length)return 0;
  let n=0;
  for(const x of list){
    if(!x)continue;
    const u=String(x.req_uuid||'').trim(); if(!u)continue;
    // v3.9 — CANCELLED joined the vocabulary. The old two-way test folded it into
    // APPROVED, which would have told a worker that a load they cancelled had been sold.
    // Anything unrecognised still falls back to APPROVED, because the only way a row
    // reaches MKT_DISPATCH at all is by being approved.
    const raw=String(x.state||'').toUpperCase();
    const st=(raw==='RETURNED'||raw==='CANCELLED')?raw:'APPROVED';
    const cur=REQ_DECIDED[u];
    if(cur&&cur.state===st)continue;                 // already known, nothing new to say
    REQ_DECIDED[u]={state:st,
      dt:String(x.dt||''), by:String(x.by||''), reason:String(x.reason||''),
      total_kg:+x.total_kg||0, retailer_name:String(x.retailer_name||'')};
    n++;}
  if(n&&db)await put('kv',{k:'reqdecided',v:REQ_DECIDED});
  return n;}

/** How many of the decisions just pulled down belong to loads THIS phone weighed — which
 *  is the only number worth interrupting the worker about. */
function myNewDecisions(list){
  if(!Array.isArray(list))return 0;
  const mine={};
  EVENTS.forEach(e=>{if(e.type==='DISPATCH_REQ'&&
    (!CFG||!CFG.uid||String(e.workerId||'')===String(CFG.uid||'')))mine[e.uuid]=1;});
  return list.filter(x=>x&&mine[String(x.req_uuid||'').trim()]).length;}

/* ======================================================================================
   v3.6 · THE MULTI-MERCHANT SUMMARY LEDGER            Owner + Marketer only
   ======================================================================================
   Two views over the same append-only log, answering two different questions:

     DAILY AUDIT    "what happened yesterday?" - one row per day, chronological, with the
                    tying count, the good-vs-rotten split by cause, the kilos that left
                    the farm, who bought them, and the scale photo behind each load.
     MONTH LEDGER   "is this farm making money?" - a year/month grid of yield per clone,
                    revenue per merchant, material and labour spend per lot, and the
                    proportion of the store that was drawn down.

   Nothing here is stored. Both are computed from EVENTS every time the screen opens, so
   a late-syncing phone corrects the history instead of corrupting it.
   ====================================================================================== */

/** Moving average costing, done properly.
 *  Until v3.6 a stock-out was valued at the product's BASELINE unit price, which meant a
 *  drum bought cheaply in June and a drum bought dearly in August cost the same to issue.
 *  This walks every stock movement in date order and keeps a running (quantity, value)
 *  per product, so an issue is valued at the average of what is actually in the store at
 *  that moment - which is what "moving average" means and what an auditor expects.
 *  Returns the cost of each STOCK_OUT keyed by event uuid. */
function movingAvgCost(){
  const pos={};                                   // pid -> {q, v}
  INVENTORY_RECON.forEach(p=>{pos[p.id]={q:+p.stock||0,v:(+p.stock||0)*(+p.cpu||0)};});
  const rows=EVENTS.filter(e=>e.type==='STOCK_IN'||e.type==='STOCK_OUT'||e.type==='STOCK_ADJUST')
    .slice().sort((a,b)=>String(a.dt).localeCompare(String(b.dt)));
  const cost={}, avgAt={};
  rows.forEach(e=>{
    const pid=e.pid; if(!pid)return;
    if(!pos[pid]){const p=prodById(pid);pos[pid]={q:0,v:0};if(p){pos[pid].q=+p.stock||0;pos[pid].v=(+p.stock||0)*(+p.cpu||0);}}
    const P=pos[pid];
    const avg=P.q>0?(P.v/P.q):((prodById(pid)||{}).cpu||0);
    avgAt[e.uuid]=avg;
    if(e.type==='STOCK_IN'){
      const q=+e.qty||0, v=(e.cost!=null?+e.cost:q*avg);
      P.q+=q; P.v+=v;}
    else if(e.type==='STOCK_OUT'){
      const q=+e.qty||0, v=+(q*avg).toFixed(4);
      cost[e.uuid]=v;
      P.q=+(P.q-q).toFixed(4); P.v=+(P.v-v).toFixed(4);
      if(P.q<=0){P.q=Math.max(0,P.q);P.v=Math.max(0,P.v);}}   // an over-issue cannot leave negative value behind
    else {
      const d=+e.delta||0, v=(e.cost!=null?+e.cost:d*avg);
      P.q+=d; P.v+=v;}});
  return {cost:cost, avgAt:avgAt};}
/** What one stock-out actually cost the farm, moving-average first, baseline as fallback. */
function outCostOf(e,mac){
  if(mac&&mac.cost[e.uuid]!=null)return +mac.cost[e.uuid];
  const p=prodById(e.pid);
  return (e.cost!=null?+e.cost:(+e.qty||0)*((p&&p.cpu)||0));}

// ---- the tree-log day roll-up --------------------------------------------------------
/** Every field figure for one calendar day, with the corrections already applied.
 *  Corrections matter here: a day that was over-counted and then fixed must read as the
 *  fixed figure, or the daily audit disagrees with the tree balances on the same phone. */
function dayField(){
  const d={};
  // v3.7 — built from ROT_ORDER, never hardcoded. Adding a fifth loss cause is then a
  // pure data change in database.js with no edit anywhere in this file.
  const blankCauses=()=>{const c={OTHER:0};ROT_ORDER.forEach(k=>{c[k]=0;});return c;};
  const touch=k=>{if(!d[k])d[k]={day:k,tied:0,good:0,rotten:0,
    causes:blankCauses(),kg:0,dispatch_kg:0,dispatch_rm:0,
    loads:[],buyers:{}};return d[k];};
  EVENTS.forEach(e=>{
    const k=String(e.dt||'').slice(0,10); if(k.length!==10)return;
    if(e.type==='TIE')          touch(k).tied+=(+e.n||0);
    else if(e.type==='TIE_ADJUST')  touch(k).tied+=(+e.delta||0);
    else if(e.type==='DROP'){const r=touch(k);r.good+=(+e.qty||0);r.kg+=(+e.estkg||0);}
    else if(e.type==='DROP_ADJUST') touch(k).good+=(+e.delta||0);
    else if(e.type==='ROTTEN'){const r=touch(k);r.rotten+=(+e.qty||0);
      const c=ROT_CAUSE[e.cause]?e.cause:'OTHER'; r.causes[c]=(r.causes[c]||0)+(+e.qty||0);}
    else if(e.type==='ROTTEN_ADJUST'){const r=touch(k);r.rotten+=(+e.delta||0);
      const c=ROT_CAUSE[e.cause]?e.cause:'OTHER'; r.causes[c]=(r.causes[c]||0)+(+e.delta||0);}
    else if(e.type==='DISPATCH'){const r=touch(k);
      r.dispatch_kg+=(+e.total_kg||0); r.dispatch_rm+=(+e.total_value_rm||0);
      r.buyers[e.retailer_name||e.retailer_id||'—']=(r.buyers[e.retailer_name||e.retailer_id||'—']||0)+(+e.total_kg||0);
      r.loads.push(e);}});
  return Object.values(d).sort((a,b)=>b.day.localeCompare(a.day));}

/** The scale photo behind a dispatch, if the load came through the handshake. */
function photoForDispatch(e){
  if(!e||!e.req_uuid)return null;
  const q=reqById(e.req_uuid);
  return (q&&q.photo_b64)?q:null;}

let DAILY_LIMIT=14;
function moreDaily(){DAILY_LIMIT+=14;renderDailyAudit();}

function renderDailyAudit(){
  const box=$('dailybox'); if(!box)return;
  if(!roleAllows('dailyaudit')){box.innerHTML='';return;}
  const days=dayField();
  if(!days.length){box.innerHTML='<div class="alertnone">Nothing logged yet. This list fills itself from '+
    'the tying, harvest and dispatch records as the season runs.</div>';return;}
  const shown=days.slice(0,DAILY_LIMIT);
  const tot=days.reduce((a,r)=>({tied:a.tied+r.tied,good:a.good+r.good,rotten:a.rotten+r.rotten,
    kg:a.kg+r.dispatch_kg,rm:a.rm+r.dispatch_rm}),{tied:0,good:0,rotten:0,kg:0,rm:0});
  const lossPct=(tot.good+tot.rotten)>0?(tot.rotten/(tot.good+tot.rotten)*100):0;
  box.innerHTML=
    '<div class="kpis" style="margin-bottom:8px">'+
      '<div class="kpi"><div class="v">'+nf(tot.tied)+'</div><div class="l">counts tied</div></div>'+
      '<div class="kpi"><div class="v">'+nf(tot.good)+'</div><div class="l">good drops</div></div>'+
      '<div class="kpi'+(lossPct>15?' bad':'')+'"><div class="v">'+nf(tot.rotten)+'</div><div class="l">rotten · '+
        nf(lossPct)+'%</div></div>'+
      '<div class="kpi"><div class="v">'+nf(tot.kg)+'</div><div class="l">kg dispatched</div></div>'+
    '</div>'+
    '<div class="cnote">One row per day, newest first. <b>Tied</b> is what went onto the string that day; '+
      '<b>good</b> and <b>rotten</b> are what came off it. Approved corrections are already folded in, so '+
      'these figures agree with the tree balances. Tap 📷 to see the scale photo the load was invoiced from.</div>'+
    shown.map(r=>{
      const off=r.good+r.rotten;
      const pct=off>0?(r.rotten/off*100):0;
      const buyers=Object.keys(r.buyers);
      return '<div class="dayrow">'+
        '<div class="dayhead"><b>'+esc(r.day)+'</b>'+
          (pct>15?'<span class="cstat r">'+nf(pct)+'% LOSS</span>':(off?('<span class="cstat a">'+nf(pct)+'% loss</span>'):''))+
        '</div>'+
        '<div class="daygrid">'+
          '<div><span class="dl">tied</span><b>'+nf(r.tied)+'</b></div>'+
          '<div><span class="dl">good drops</span><b>'+nf(r.good)+'</b></div>'+
          '<div><span class="dl">rotten</span><b>'+nf(r.rotten)+'</b></div>'+
          '<div><span class="dl">net kg out</span><b>'+nf(r.dispatch_kg)+'</b></div>'+
        '</div>'+
        (r.rotten>0?('<div class="causerow">'+ROT_ORDER.filter(c=>r.causes[c])
          .map(c=>'<span class="causechip'+(ROT_KIND[c]==='PHYSIOLOGICAL'?' phys':'')+'">'+
            ROT_CAUSE[c].ic+' '+esc(ROT_CAUSE[c].label)+' '+nf(r.causes[c])+'</span>').join('')+
          (r.causes.OTHER?('<span class="causechip">❓ Unstated '+nf(r.causes.OTHER)+'</span>'):'')+
          '</div>'):'')+
        (buyers.length
          ? ('<div class="buyrow">→ '+buyers.map(b=>esc(b)+' '+nf(r.buyers[b])+' kg').join(' · ')+
             (SHOW_VALUES?(' <b>'+rm(r.dispatch_rm)+'</b>'):'')+'</div>'+
             '<div class="loadrow">'+r.loads.map(e=>{
               const ph=photoForDispatch(e);
               return '<span class="loadchip">'+
                 (ph?('<span class="linkish" onclick="showPhoto(\''+esc(ph.uuid)+'\',\'Scale photo — '+
                   esc(e.invoice_no||'')+'\',1)">📷</span> '):'<span class="nophoto" title="no photo — direct dispatch">▫</span> ')+
                 '<span class="linkish" onclick="copyReceipt(\''+esc(e.uuid)+'\')">'+
                 esc(e.invoice_no||'invoice')+'</span></span>';}).join('')+'</div>')
          : '<div class="buyrow dim">nothing dispatched this day</div>')+
      '</div>';}).join('')+
    (days.length>shown.length
      ? ('<button class="bigbtn ghost" style="padding:11px;font-size:13px" onclick="moreDaily()">SHOW '+
         Math.min(14,days.length-shown.length)+' MORE DAYS ('+(days.length-shown.length)+' left)</button>')
      : '')+
    '<p class="small">📷 opens the photo the worker took of the scale; ▫ marks a load dispatched directly '+
      'by Marketing without a worker submission, so it has no photo behind it. Tapping the invoice number '+
      'copies its WhatsApp receipt.</p>';}

// ---- the monthly / yearly matrix -----------------------------------------------------
/** Everything the month grid needs, in one pass. Months come from EVERY kind of activity,
 *  not just stock movements, so a month with harvest but no purchases still appears. */
function buildMonthMatrix(){
  const mac=movingAvgCost();
  const inv=buildLedgerSummary();               // opening / receipts / closing, per month
  const invBy={}; inv.months.forEach(m=>{invBy[m.key]=m;});
  const M={};
  const touch=k=>{if(!M[k])M[k]={key:k,year:k.slice(0,4),
      clone:{}, revenue:{}, revenue_total:0, kg_total:0, fruit:0, invoices:0,
      material:{A:0,B:0,C:0,'—':0}, labour:{A:0,B:0,C:0,'—':0}, manhours:0,
      tied:0, good:0, rotten:0};return M[k];};

  // yield + revenue, off the dispatch lines
  EVENTS.forEach(e=>{
    const k=String(e.dt||'').slice(0,7); if(k.length!==7)return;
    if(e.type==='TIE')             touch(k).tied+=(+e.n||0);
    else if(e.type==='TIE_ADJUST') touch(k).tied+=(+e.delta||0);
    else if(e.type==='DROP')       touch(k).good+=(+e.qty||0);
    else if(e.type==='DROP_ADJUST')touch(k).good+=(+e.delta||0);
    else if(e.type==='ROTTEN')     touch(k).rotten+=(+e.qty||0);
    else if(e.type==='ROTTEN_ADJUST')touch(k).rotten+=(+e.delta||0);
    else if(e.type==='DISPATCH'){
      const m=touch(k);
      m.invoices++; m.kg_total+=(+e.total_kg||0); m.fruit+=(+e.fruit_count||0);
      const nm=e.retailer_name||(retailerById(e.retailer_id)||{}).name||e.retailer_id||'—';
      m.revenue[nm]=+((m.revenue[nm]||0)+(+e.total_value_rm||0)).toFixed(2);
      m.revenue_total=+(m.revenue_total+(+e.total_value_rm||0)).toFixed(2);
      receiptLines(e).forEach(x=>{
        const c=x.clone||'—';
        m.clone[c]=+((m.clone[c]||0)+(+x.net_kg||0)).toFixed(2);});}
    else if(e.type==='STOCK_OUT'){
      const m=touch(k);
      const L=LOT_KEYS.indexOf(e.lot)>=0?e.lot:'—';
      m.material[L]=+(m.material[L]+outCostOf(e,mac)).toFixed(2);}});

  // labour: man-hours already logged since v2.6, now priced
  labourRows().forEach(r=>{
    const k=String(r.dt||'').slice(0,7); if(k.length!==7)return;
    const m=touch(k);
    const L=LOT_KEYS.indexOf(r.lot)>=0?r.lot:'—';
    m.labour[L]=+(m.labour[L]+(r.mh*LABOUR_RATE)).toFixed(2);
    m.manhours+=r.mh;});

  const months=Object.values(M).sort((a,b)=>a.key.localeCompare(b.key));
  months.forEach(m=>{
    const iv=invBy[m.key];
    // Rolling material drawdown:  (opening + receipts - closing) / (opening + receipts)
    // i.e. what proportion of everything that passed through the store was actually used.
    const openV=iv?iv.openVal:0, inV=iv?iv.inVal:0, closeV=iv?iv.closeVal:0;
    const avail=openV+inV;
    m.open_val=openV; m.in_val=inV; m.close_val=closeV;
    m.drawdown_pct=avail>0?+(((avail-closeV)/avail)*100).toFixed(1):0;
    m.material_total=+LOT_KEYS.concat(['—']).reduce((s,L)=>s+m.material[L],0).toFixed(2);
    m.labour_total  =+LOT_KEYS.concat(['—']).reduce((s,L)=>s+m.labour[L],0).toFixed(2);
    m.spend_total   =+(m.material_total+m.labour_total).toFixed(2);
    m.margin_rm     =+(m.revenue_total-m.spend_total).toFixed(2);
    m.label=MONTH_NAME[+m.key.slice(5,7)-1]+' '+m.year;});

  const years={};
  months.forEach(m=>{
    if(!years[m.year])years[m.year]={year:m.year,months:[],clone:{},revenue:{},
      revenue_total:0,kg_total:0,material_total:0,labour_total:0,spend_total:0,manhours:0,
      tied:0,good:0,rotten:0};
    const y=years[m.year];
    y.months.push(m);
    Object.keys(m.clone).forEach(c=>{y.clone[c]=+((y.clone[c]||0)+m.clone[c]).toFixed(2);});
    Object.keys(m.revenue).forEach(n=>{y.revenue[n]=+((y.revenue[n]||0)+m.revenue[n]).toFixed(2);});
    y.revenue_total=+(y.revenue_total+m.revenue_total).toFixed(2);
    y.kg_total+=m.kg_total; y.manhours+=m.manhours;
    y.material_total=+(y.material_total+m.material_total).toFixed(2);
    y.labour_total  =+(y.labour_total+m.labour_total).toFixed(2);
    y.spend_total   =+(y.spend_total+m.spend_total).toFixed(2);
    y.tied+=m.tied; y.good+=m.good; y.rotten+=m.rotten;});
  Object.values(years).forEach(y=>{y.margin_rm=+(y.revenue_total-y.spend_total).toFixed(2);});
  return {months:months.slice().reverse(),
          years:Object.values(years).sort((a,b)=>b.year.localeCompare(a.year))};}

let MTX_OPEN={};
function toggleMtx(k){MTX_OPEN[k]=!MTX_OPEN[k];renderMatrix();}

function renderMatrix(){
  const box=$('matrixbox'); if(!box)return;
  if(!roleAllows('matrixledger')){box.innerHTML='';return;}
  const d=buildMonthMatrix();
  if(!d.months.length){box.innerHTML='<div class="alertnone">No month has any activity yet. This grid '+
    'builds itself from the harvest, dispatch, stock and labour records.</div>';return;}
  const merchants=listedRetailers().map(r=>r.name);
  // a merchant that has been renamed still has revenue under the old name — show it
  d.months.forEach(m=>Object.keys(m.revenue).forEach(n=>{if(merchants.indexOf(n)<0)merchants.push(n);}));
  const clones=CLONE_SELL_ORDER.filter(c=>d.months.some(m=>m.clone[c]>0));

  box.innerHTML=
    (LABOUR_RATE_OK?'':'<div class="critbox">Labour is priced at the placeholder rate of '+rm(LABOUR_RATE)+
      ' per man-hour. Set the real rate in the LABOUR tab — until then every labour and margin figure '+
      'on this screen is indicative only.</div>')+
    '<div class="cnote">Sorted newest first. Tap a month to open its lot-by-lot spend and the merchant '+
      'revenue split. <b>Drawdown %</b> is how much of everything that passed through the store was '+
      'actually issued: (opening + receipts − closing) ÷ (opening + receipts).</div>'+

    // ---- the year roll-up ----
    d.years.map(y=>'<div class="yrbox"><div class="yrhead">'+esc(y.year)+
      '<span>'+(SHOW_VALUES?rm(y.revenue_total):'—')+' revenue</span></div>'+
      '<div class="yrgrid">'+
        '<div><span class="dl">net kg sold</span><b>'+nf(y.kg_total)+'</b></div>'+
        '<div><span class="dl">material</span><b>'+(SHOW_VALUES?rm(y.material_total):'—')+'</b></div>'+
        '<div><span class="dl">labour</span><b>'+(SHOW_VALUES?rm(y.labour_total):'—')+'</b></div>'+
        '<div class="'+(y.margin_rm<0?'neg':'pos')+'"><span class="dl">revenue − spend</span><b>'+
          (SHOW_VALUES?rm(y.margin_rm):'—')+'</b></div>'+
      '</div></div>').join('')+

    // ---- TABLE 1 — yield volume per clone ----
    '<div class="sec" style="margin-top:14px">🥭 Monthly yield volume — net KG per clone</div>'+
    '<div class="tblwrap"><table class="tbl">'+
    '<tr><th>Month</th>'+clones.map(c=>'<th class="num">'+esc(c)+'</th>').join('')+
      '<th class="num">TOTAL</th></tr>'+
    d.months.map(m=>'<tr><td><b>'+esc(m.label)+'</b></td>'+
      clones.map(c=>'<td class="num">'+(m.clone[c]?nf(m.clone[c]):'—')+'</td>').join('')+
      '<td class="num"><b>'+nf(m.kg_total)+'</b></td></tr>').join('')+
    '</table></div>'+

    // ---- TABLE 2 — revenue per merchant ----
    '<div class="sec" style="margin-top:14px">💰 Monthly revenue — RM per merchant</div>'+
    // Figures are shown WITHOUT the "RM" prefix and without sen: three merchants plus a
    // total is four money columns, and "RM 12,400.00" in every cell pushes the total off
    // the right edge of a phone. The unit is stated once, in the heading.
    (SHOW_VALUES?('<div class="tblwrap"><table class="tbl">'+
      '<tr><th>Month</th>'+merchants.map(n=>'<th class="num">'+esc(n)+'</th>').join('')+
        '<th class="num">TOTAL</th></tr>'+
      d.months.map(m=>'<tr><td><b>'+esc(m.label)+'</b></td>'+
        merchants.map(n=>'<td class="num">'+(m.revenue[n]?nf(Math.round(m.revenue[n])):'—')+'</td>').join('')+
        '<td class="num"><b>'+nf(Math.round(m.revenue_total))+'</b></td></tr>').join('')+
      '</table></div>'+
      '<div class="exphint">Ringgit, rounded to the nearest one. Swipe the table sideways if a '+
        'merchant is off the edge.</div>')
      :'<div class="alertnone">Money figures are hidden for your role.</div>')+

    // ---- TABLE 3 — spend per lot + drawdown, expandable ----
    '<div class="sec" style="margin-top:14px">🧾 Monthly spend per lot &amp; material drawdown</div>'+
    '<div class="tblwrap"><table class="tbl">'+
    '<tr><th>Month</th><th class="num">Material</th><th class="num">Labour</th>'+
      '<th class="num">Drawdown</th></tr>'+
    d.months.map(m=>{
      const open=!!MTX_OPEN[m.key];
      return '<tr class="clickrow" onclick="toggleMtx(\''+esc(m.key)+'\')">'+
        '<td><b>'+esc(m.label)+'</b><div class="exphint">'+(open?'▾ tap to close':'▸ tap for the lot split')+'</div></td>'+
        '<td class="num">'+(SHOW_VALUES?rm(m.material_total):'—')+'</td>'+
        '<td class="num">'+(SHOW_VALUES?rm(m.labour_total):'—')+
          '<div class="exphint">'+nf(m.manhours)+' man-h</div></td>'+
        '<td class="num '+(m.drawdown_pct>80?'lowq':'')+'"><b>'+nf(m.drawdown_pct)+'%</b></td></tr>'+
        (open?('<tr><td colspan="4" class="expcell">'+
          '<div class="tblwrap"><table class="tbl sub">'+
          '<tr><th>Lot</th><th class="num">Material</th><th class="num">Labour</th><th class="num">Total</th></tr>'+
          LOT_KEYS.concat(['—']).map(L=>{
            const mt=m.material[L]||0, lb=m.labour[L]||0;
            if(!mt&&!lb&&L==='—')return '';
            return '<tr><td><b>'+(L==='—'?'Not allocated':'Lot '+L)+'</b></td>'+
              '<td class="num">'+(SHOW_VALUES?rm(mt):'—')+'</td>'+
              '<td class="num">'+(SHOW_VALUES?rm(lb):'—')+'</td>'+
              '<td class="num"><b>'+(SHOW_VALUES?rm(mt+lb):'—')+'</b></td></tr>';}).join('')+
          '</table></div>'+
          '<div class="drawbox">Opening store '+(SHOW_VALUES?rm(m.open_val):'—')+
            ' + received '+(SHOW_VALUES?rm(m.in_val):'—')+
            ' − closing '+(SHOW_VALUES?rm(m.close_val):'—')+
            ' = <b>'+nf(m.drawdown_pct)+'%</b> drawn down.<br>'+
            '<span class="small">Issues are valued at the <b>moving average</b> cost of what was in the '+
            'store at the moment they were taken, not at a fixed list price.</span></div>'+
          '<div class="drawbox">Field that month: '+nf(m.tied)+' tied · '+nf(m.good)+' good · '+
            nf(m.rotten)+' rotten · '+m.invoices+' invoice'+(m.invoices===1?'':'s')+'</div>'+
          '</td></tr>'):'');}).join('')+
    '</table></div>'+
    '<p class="small">Every figure is recomputed from the append-only log each time this screen opens, so '+
      'a phone that syncs in late corrects the history rather than corrupting it. Material spend is '+
      'allocated to the lot the worker keyed on Stock Out; anything logged before per-lot allocation '+
      'existed sits under <b>Not allocated</b>.</p>';}

// ---- the ledger view (all retailers together) ----------------------------------------
function renderMktLedger(){
  const box=$('mktledgerbox'); if(!box)return;
  const rows=marketingDeliveryLedger();
  const dup=duplicateSerials();
  const cards=listedRetailers().map(r=>retailerLedger(r.id)).filter(Boolean);
  const broke=cards.filter(c=>c.current_credit_balance_rm<CREDIT_FLOOR_RM);
  box.innerHTML=
    (broke.length?('<div class="critbox">CRITICAL: Retailer account overdrawn — dispatch is locked '+
      'until the Owner overrides or credit is topped up.<br>'+
      '<span style="font-weight:700;font-size:11.5px">'+
      broke.map(c=>esc(c.name)+' — '+rm(c.current_credit_balance_rm)).join('<br>')+'</span></div>'):'')+
    '<div class="tblwrap"><table class="tbl">'+
    '<tr><th>Retailer</th><th class="num">Opening</th><th class="num">Invoiced</th><th class="num">Credit left</th></tr>'+
    cards.map(c=>'<tr><td><div class="pn">'+esc(c.name)+
      (c.status==='Suspended'?' <span class="cstat s">SUSPENDED</span>':'')+'</div><div class="pa">'+
      esc(c.contact||'')+' · '+c.deliveries+' deliver'+(c.deliveries===1?'y':'ies')+'</div></td>'+
      '<td class="num">'+(SHOW_VALUES?rm(c.opening_credit_rm+c.topped_up_rm):'—')+'</td>'+
      '<td class="num">'+(SHOW_VALUES?rm(c.invoiced_rm):'—')+'</td>'+
      '<td class="num '+(c.current_credit_balance_rm<CREDIT_FLOOR_RM?'lowq':'')+'"><b>'+
      (SHOW_VALUES?rm(c.current_credit_balance_rm):'—')+'</b></td></tr>').join('')+
    '</table></div>'+
    '<div class="sec" style="margin-top:14px">Delivery ledger — newest first</div>'+
    (rows.length?('<div class="tblwrap"><table class="tbl">'+
      '<tr><th>Invoice / retailer</th><th class="num">Net kg</th><th class="num">Order value</th><th class="num">Credit left</th></tr>'+
      rows.slice(0,60).map(x=>'<tr><td><div class="pn">'+
        (x.invoice_no?('<span class="invno">'+esc(x.invoice_no)+'</span> '):'')+esc(x.retailer_name)+
        (x.kind==='TOPUP'?' <span class="cstat a">TOP-UP</span>':'')+
        (x.over_credit?' <span class="cstat r">OVERRIDE</span>':'')+
        (dup[x.invoice_no]?' <span class="cstat r">DUPLICATE SERIAL</span>':'')+'</div>'+
        '<div class="pa">'+esc(x.timestamp)+(x.synced?'':' · queued')+
        (x.note?(' · '+esc(x.note)):'')+'</div>'+
        (x.kind==='DISPATCH'?('<div><span class="linkish" onclick="copyReceipt(\''+esc(x.uuid)+
          '\')">📋 copy WhatsApp receipt</span></div>'):'')+'</td>'+
        '<td class="num">'+(x.kind==='TOPUP'?'—':(nf(x.total_kg)+
          '<div class="exphint">A '+nf(x.kg_A)+' · B '+nf(x.kg_B)+
          (x.kg_C?(' · C '+nf(x.kg_C)):'')+'</div>'))+'</td>'+
        '<td class="num"><b>'+(SHOW_VALUES?rm(x.total_order_value_rm):'—')+'</b></td>'+
        '<td class="num '+(x.remaining_credit_balance_rm<CREDIT_FLOOR_RM?'lowq':'')+'">'+
        (SHOW_VALUES?rm(x.remaining_credit_balance_rm):'—')+'</td></tr>').join('')+'</table></div>')
      :'<div class="alertnone">No dispatch confirmed yet. Open a retailer card on the RETAILERS tab.</div>')+
    '<p class="small">Every row is immutable. A dispatch is never edited — if a weight was wrong, '+
    'the Owner posts a credit top-up with the reason, so the mistake and the fix both stay on the record.</p>';}

// ---- Owner-only price matrix, basket tare and retailer master ------------------------
// v3.6 — this screen now has a MERCHANT PICKER at the top. Choosing a contract buyer
// loads THEIR book and hides the trend controls (a trend move must never reach a signed
// contract). Choosing "Daily spot" loads CLONE_PRICE and the trend controls come back.
let PRICE_SEL='SPOT';                 // 'SPOT' or a retailer id
function setPriceSel(v){PRICE_SEL=v||'SPOT';renderPrices();}
/** The id the price grid is currently editing, or '' when it is the spot matrix. */
function priceSelId(){return PRICE_SEL==='SPOT'?'':PRICE_SEL;}

function renderPrices(){
  const box=$('pricebox'); if(!box)return;
  const own=canSetPrice();                 // retailer master + credit — Owner alone
  const shr=canSetShared();                // v3.11 · prices + tare — Owner or Marketing
  const rid=priceSelId(), contract=!!rid&&isContractRetailer(rid);
  const r=rid?retailerById(rid):null;
  if(rid&&!r){PRICE_SEL='SPOT';return renderPrices();}
  const cell=(c,g)=>{
    if(!hasGrade(c,g))return '<td class="num nogrd">—</td>';
    return '<td class="num">'+(shr
      ?('<input type="number" id="pr-'+esc(c)+'-'+g+'" min="0" step="0.01" inputmode="decimal" value="'+
        priceOf(c,g,rid)+'">')
      :('<b>'+rm(priceOf(c,g,rid))+'</b>'))+
      '<div class="exphint">'+esc(bandText(c,g))+'</div></td>';};
  const contractBuyers=listedRetailers().filter(x=>isContractRetailer(x.id));
  const spotBuyers=listedRetailers().filter(x=>!isContractRetailer(x.id));
  box.innerHTML=
    // ---- the merchant picker: whose book am I editing? ----
    '<div class="sec">Which price book?</div>'+
    '<select id="pr-who" onchange="setPriceSel(this.value)">'+
      '<option value="SPOT"'+(PRICE_SEL==='SPOT'?' selected':'')+'>📈 Daily spot market — used by '+
        (spotBuyers.length?esc(spotBuyers.map(x=>x.name).join(', ')):'no merchant yet')+'</option>'+
      contractBuyers.map(x=>'<option value="'+esc(x.id)+'"'+(PRICE_SEL===x.id?' selected':'')+
        '>📜 '+esc(x.name)+' — contract</option>').join('')+
    '</select>'+
    (contract
      ? '<div class="cnote"><b>'+esc(r.name)+'</b>’s negotiated contract, per KG of <b>net</b> weight. '+
        'These rates belong to this merchant alone — the daily market trend does not touch them, so a '+
        'morning price move can never rewrite a signed contract.</div>'
      : '<div class="cnote">The <b>daily spot market</b> matrix. Every merchant with no contract on file '+
        'invoices from this table, and the trend buttons below move it. Prices are per KG of <b>net</b> '+
        'weight. Black Thorn, B24, 101 and Udang Merah are two-grade clones — no Grade C anywhere.</div>')+
    // v3.11 — a contract lives on this phone only (it is not in the shared channel yet),
    // so only the SPOT matrix gets a share stamp. Saying otherwise would be a lie.
    (contract?'':shareBox(['cloneprice','pricemeta']))+
    // `full` — the 340px cap sliced the last clone's row in half, which reads as a broken
    // screen. Six clones is a short table; it does not need an inner scroller.
    '<div class="tblwrap full"><table class="tbl pmx">'+
    '<tr><th>Clone</th><th class="num">Grade A</th><th class="num">Grade B</th><th class="num">Grade C</th></tr>'+
    CLONE_SELL_ORDER.map(c=>'<tr><td><b>'+esc(CLONE_NAME[c]||c)+'</b><div class="exphint">'+esc(c)+
      ' · '+gradesFor(c).length+'-grade</div></td>'+cell(c,'A')+cell(c,'B')+cell(c,'C')+'</tr>').join('')+
    '</table></div>'+
    (shr?(
      // the trend modifier belongs to the SPOT book only — see the note above
      (contract?'':(
      '<div class="sec" style="margin-top:12px">📈 Daily market trend modifier</div>'+
      '<div class="small">Nudge every spot price in the table above before the lorry leaves. '+
        'Contract merchants are unaffected. Nothing is saved until you tap SAVE.</div>'+
      '<div class="trendrow">'+
        '<div class="trendbtn" onclick="trendNudge(-10)">−10%</div>'+
        '<div class="trendbtn" onclick="trendNudge(-5)">−5%</div>'+
        '<div class="trendbtn" onclick="trendNudge(5)">+5%</div>'+
        '<div class="trendbtn" onclick="trendNudge(10)">+10%</div>'+
      '</div>'+
      '<div class="trendrow">'+
        '<input type="number" id="pr-pct" step="0.5" inputmode="decimal" placeholder="custom %" style="flex:2">'+
        '<div class="trendbtn" onclick="trendNudge(+($(\'pr-pct\').value||0))">APPLY %</div>'+
      '</div>'))+
      '<div class="trendrow"><div class="trendbtn" onclick="trendReset()">RESET TO AGREED BASE</div></div>'+
      '<button class="bigbtn" style="margin-top:9px" onclick="savePrices()">✓ SAVE '+
        (contract?('CONTRACT — '+esc(r.name).toUpperCase()):'SPOT PRICE MATRIX')+'</button>')
      :'<div class="cnote">Only the Owner or Marketing can change a price. These are the figures '+
       'every invoice is built from, and whichever of them changes one, it reaches every phone.</div>')+

    // ---- the whole book at a glance, so two contracts can be compared side by side ----
    '<div class="sec" style="margin-top:16px">📊 All merchants — Grade A comparison</div>'+
    '<div class="tblwrap"><table class="tbl">'+
    '<tr><th>Merchant</th>'+CLONE_SELL_ORDER.filter(c=>c!=='TB')
      .map(c=>'<th class="num">'+esc(c)+'</th>').join('')+'</tr>'+
    listedRetailers().map(x=>'<tr><td><div class="pn">'+esc(x.name)+'</div>'+
      '<div class="pa">'+(isContractRetailer(x.id)?'📜 contract':'📈 spot')+'</div></td>'+
      CLONE_SELL_ORDER.filter(c=>c!=='TB').map(c=>{const p=priceOf(c,'A',x.id);
        return '<td class="num'+(p>0?'':' lowq')+'">'+(p>0?nf(p):'—')+'</td>';}).join('')+
      '</tr>').join('')+
    '</table></div>'+
    '<div class="exphint">Grade A, RM per net KG. A dash means no rate is on file for that clone — a '+
      'basket of it cannot be invoiced to that merchant until the Owner sets one.</div>'+

    '<div class="sec" style="margin-top:16px">⚖️ Basket tare</div>'+
    (TARE_VERIFIED?'':'<div class="critbox" style="margin-bottom:8px">These tare weights have NOT been '+
      'verified yet. Put an EMPTY basket on the scale, key the reading here, then tick the box — until '+
      'then every net weight may be wrong.</div>')+
    shareBox(['baskets','tareok'])+
    '<div class="tblwrap full"><table class="tbl"><tr><th>Basket</th><th class="num">Empty weight (kg)</th></tr>'+
    BASKETS.map(b=>'<tr><td><b>'+(b.ic?b.ic+' ':'')+esc(b.name)+'</b><div class="exphint">'+esc(b.id)+'</div></td>'+
      '<td class="num">'+(shr&&b.id!=='NONE'
        ?('<input type="number" id="bt-'+esc(b.id)+'" min="0" step="0.01" inputmode="decimal" value="'+
          (+b.tare_kg||0)+'" style="width:90px;text-align:right">')
        :('<b>'+nf(b.tare_kg)+' kg</b>'))+'</td></tr>').join('')+'</table></div>'+
    (shr?('<label style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:12.5px">'+
      '<input type="checkbox" id="bt-ok" '+(TARE_VERIFIED?'checked':'')+' style="width:auto">'+
      'I have weighed the empty baskets — these figures are real</label>'+
      '<button class="bigbtn ghost" style="margin-top:7px;padding:12px;font-size:13.5px" '+
        'onclick="saveBaskets()">✓ SAVE BASKET TARE</button>'):'')+

    '<div class="sec" style="margin-top:16px">Retailer master</div>'+
    '<div class="tblwrap"><table class="tbl">'+
    '<tr><th>Retailer</th><th class="num">Credit left</th><th class="num"></th></tr>'+
    listedRetailers().map(r=>{const c=retailerLedger(r.id);
      return '<tr><td><div class="pn">'+esc(r.name)+
        (c.status==='Suspended'?' <span class="cstat s">SUSPENDED</span>':'')+'</div>'+
        '<div class="pa">'+esc(r.id)+' · '+esc(r.contact||'no contact')+'</div></td>'+
        '<td class="num '+(c.current_credit_balance_rm<CREDIT_FLOOR_RM?'lowq':'')+'"><b>'+rm(c.current_credit_balance_rm)+'</b>'+
        '<div class="exphint">opening '+rm(c.opening_credit_rm)+'</div></td>'+
        '<td class="num">'+(own?('<span class="linkish" onclick="openRetForm(\''+esc(r.id)+'\')">edit</span>'+
          '<div><span class="linkish" onclick="topUpRetailer(\''+esc(r.id)+'\')">+ credit</span></div>'):'')+'</td></tr>';}).join('')+
    '</table></div>'+
    (own?'<button class="bigbtn ghost" style="margin-top:9px" onclick="openRetForm(\'\')">+ ADD RETAILER</button>':'')+
    '<p class="small">Credit left = opening credit + top-ups − everything invoiced. It is worked out from the '+
    'delivery ledger every time this screen opens, so it always agrees with the rows above it.</p>';}

/** Move every editable cell by a percentage — the daily market trend, applied in one tap.
 *  It only touches the INPUTS; nothing is committed until SAVE PRICE MATRIX. */
function trendNudge(pct){
  if(!canSetShared())return;
  pct=+pct||0; if(!pct){toast('Key a percentage first',1);return;}
  CLONE_SELL_ORDER.forEach(c=>gradesFor(c).forEach(g=>{
    const el=$('pr-'+c+'-'+g); if(!el)return;
    const v=+el.value||0;
    el.value=(Math.round(v*(1+pct/100)*100)/100).toFixed(2);}));
  toast((pct>0?'+':'')+pct+'% applied — tap SAVE to commit');}
function trendReset(){
  if(!canSetShared())return;
  const rid=priceSelId();
  CLONE_SELL_ORDER.forEach(c=>gradesFor(c).forEach(g=>{
    const el=$('pr-'+c+'-'+g); if(el)el.value=basePriceOf(c,g,rid).toFixed(2);}));
  toast('Back to the agreed base '+(rid?'contract':'matrix')+' — tap SAVE to commit');}
async function savePrices(){
  if(!canSetShared()){toast('Only the Owner or Marketing can set prices',1);return;}
  const rid=priceSelId();
  const next={};
  for(const c of CLONE_SELL_ORDER){
    next[c]={};
    for(const g of gradesFor(c)){
      const el=$('pr-'+c+'-'+g); const v=el?el.value:'';
      if(v===''||isNaN(+v)||+v<0){toast(c+' Grade '+g+' is not a valid figure',1);return;}
      next[c][g]=+(+v).toFixed(2);}}
  if(rid){
    // one merchant's contract — nothing else in the book is touched
    RET_CONTRACT[rid]=next;
    await persistContracts();
    RET_DIRTY=true; await persistRetailers();
    toast('✓ '+((retailerById(rid)||{}).name||rid)+'’s contract saved');
  } else {
    CLONE_PRICE=next;
    PRICE_META={at:now(),by:(CFG&&CFG.worker)||''};
    await persistPrices();
    // v3.11 — this used to stop here, on this phone, for ever.
    await markSetting('cloneprice'); await markSetting('pricemeta');
    toast('✓ '+tr('st_pricesaved'));}
  renderPrices(); renderDispatch(); renderVerify();}
async function saveBaskets(){
  if(!canSetShared()){toast('Only the Owner or Marketing can set the basket tare',1);return;}
  for(const b of BASKETS){
    if(b.id==='NONE'){b.tare_kg=0;continue;}
    const el=$('bt-'+b.id); if(!el)continue;
    const v=el.value;
    if(v===''||isNaN(+v)||+v<0){toast(b.name+' tare is not a valid figure',1);return;}
    b.tare_kg=+(+v).toFixed(2);}
  TARE_VERIFIED=!!($('bt-ok')&&$('bt-ok').checked);
  await persistBaskets();
  // v3.11 — tare comes off EVERY load on EVERY phone, so it has to travel.
  await markSetting('baskets'); await markSetting('tareok');
  renderPrices(); renderDispatch();
  toast('✓ '+tr('st_taresaved')+(TARE_VERIFIED?'':' — '+tr('st_stillunver')));}

// ======================= THE RETAILER RECORD FORM ====================================
// Replaces the chain of grey browser prompts. Same modal shell as the staff key form,
// so the two master-data screens behave identically. Opening credit is editable here —
// it is a settings figure, not money that has moved. Money that has moved is corrected
// with a credit top-up, which is an EVENT and keeps its own audit trail.
let editingRet=null, retFormStatus='Active', retFormPricing='SPOT';
function pickRetStatus(s){
  retFormStatus=s;
  const a=$('rf-active'), b=$('rf-susp');
  if(a)a.className=(s==='Active'?'on':'');
  if(b)b.className=(s==='Suspended'?'on':'');}
/** v3.6 — CONTRACT or SPOT. Switching an existing merchant to CONTRACT seeds their book
 *  from the spot matrix so it is never empty, which would silently price them at RM 0. */
function pickRetPricing(p){
  retFormPricing=(String(p).toUpperCase()==='CONTRACT')?'CONTRACT':'SPOT';
  const a=$('rf-spot'), b=$('rf-contract');
  if(a)a.className=(retFormPricing==='SPOT'?'on':'');
  if(b)b.className=(retFormPricing==='CONTRACT'?'on':'');
  const n=$('rf-pricenote');
  if(n)n.innerHTML=retFormPricing==='CONTRACT'
    ? 'Their own negotiated rates. Set them in the price book picker after saving — the Owner’s daily trend will not move them.'
    : 'Invoices at today’s market rate from the Owner’s spot matrix, and changes when the Owner changes it.';}
function openRetForm(id){
  if(!canSetPrice()){toast('Only the Owner can add or edit a retailer',1);return;}
  const r=id?retailerById(id):null;
  editingRet=r?r.id:null;
  $('rf-title').textContent=r?('Edit '+r.name):'Add retailer';
  $('rf-sub').textContent=r?'Change anything here. The live balance stays derived from the deliveries.'
                           :'Name them, give them an opening credit, done.';
  $('rf-name').value=r?r.name:'';
  $('rf-con').value =r?(r.contact||''):'';
  $('rf-open').value=r?(+r.opening_credit_rm||0).toFixed(2):'15000.00';
  pickRetStatus(r?String(r.status||'Active'):'Active');
  pickRetPricing(r?pricingModeOf(r.id):'SPOT');
  $('rf-err').textContent='';
  const d=$('rf-derived');
  if(r){const c=retailerLedger(r.id);
    d.classList.remove('hidden');
    d.innerHTML='Topped up '+rm(c.topped_up_rm)+' · invoiced '+rm(c.invoiced_rm)+'<br>'+
      'Credit left right now <b>'+rm(c.current_credit_balance_rm)+'</b><br>'+
      '<span style="font-size:10.5px">This figure is worked out from the delivery ledger every time it is '+
      'shown — never typed, never stored, so it cannot drift. To move it, post a credit top-up.</span>';}
  else d.classList.add('hidden');
  $('rf-extra').innerHTML=r
    ? '<button class="bigbtn ghost" style="padding:12px;font-size:13.5px" onclick="topUpRetailer(\''+
        esc(r.id)+'\',1)">＋ POST A CREDIT TOP-UP</button>'
    : '';
  $('retmodal').classList.remove('hidden');
  setTimeout(()=>{const n=$('rf-name');if(n)n.focus();},80);}
function closeRetForm(){$('retmodal').classList.add('hidden');editingRet=null;}
async function saveRetForm(){
  if(!canSetPrice()){toast('Only the Owner can add or edit a retailer',1);return;}
  const err=m=>{$('rf-err').textContent=m;};
  const name=$('rf-name').value.trim();
  const con =$('rf-con').value.trim();
  const open=$('rf-open').value;
  if(name.length<2)return err('Enter the retailer’s name.');
  if(RETAILERS.some(r=>r.name.trim().toLowerCase()===name.toLowerCase()&&r.id!==editingRet))
    return err('There is already a retailer named '+name+'.');
  if(open===''||isNaN(+open)||+open<0)return err('Opening credit must be a figure of zero or more.');
  let newId=editingRet;
  if(editingRet){
    const r=retailerById(editingRet);
    r.name=name; r.contact=con;
    r.opening_credit_rm=+(+open).toFixed(2);
    r.status=retFormStatus;
    r.pricing=retFormPricing;
  } else {
    let n=1; while(RETAILERS.some(r=>r.id==='RT-'+String(n).padStart(2,'0')))n++;
    newId='RT-'+String(n).padStart(2,'0');
    RETAILERS.push({id:newId,name:name,contact:con,
      opening_credit_rm:+(+open).toFixed(2),status:retFormStatus,pricing:retFormPricing});}
  // A merchant switched to CONTRACT with an empty book would price every basket at RM 0
  // and the scale form would refuse every line. Seed their book from the spot matrix so
  // it opens at today's rates and the Owner edits from there.
  if(retFormPricing==='CONTRACT'&&newId&&!Object.keys(RET_CONTRACT[newId]||{}).length){
    RET_CONTRACT[newId]=priceMatrixCopy(RETAILER_CONTRACT_SEED[newId]||CLONE_PRICE);
    await persistContracts();}
  RET_DIRTY=true; await persistRetailers();
  closeRetForm();
  if(MKT_SEL&&!activeRetailers().some(r=>r.id===MKT_SEL))MKT_SEL='';
  renderDispatch(); renderPrices(); renderMktLedger(); renderVerify();
  toast('✓ Retailer saved'+(retFormPricing==='CONTRACT'?' — set their contract rates in the price book':''));}

/** A top-up is an EVENT, not an edit — the credit line has the same audit trail as a
 *  delivery, so a wrong opening figure and its fix both stay on the record. */
async function topUpRetailer(id,fromForm){
  if(!canSetPrice()){toast('Only the Owner can add credit',1);return;}
  const r=retailerById(id); if(!r)return;
  if(fromForm)closeRetForm();
  const res=await askForm({
    title:'Credit top-up — '+r.name,
    sub:'Payment received, or a correction. A minus figure takes credit back. This writes an audit row; it never edits an invoice.',
    f1:{label:'Amount (RM)',type:'number',value:'',placeholder:'e.g. 5000'},
    f2:{label:'Reason',type:'text',value:'',placeholder:'e.g. bank-in 3 Aug, ref 8842'},
    ok:'＋ POST CREDIT'});
  if(!res)return;
  const v=res.v1;
  if(v===''||isNaN(+v)||+v===0){toast('That is not a usable figure',1);return;}
  if(!res.v2.trim()){toast('A reason is required for a credit movement',1);return;}
  await persistEvent({uuid:uuid(),type:'CREDIT_TOPUP',dt:now(),
    retailer_id:r.id,retailer_name:r.name,amount_rm:+(+v).toFixed(2),note:res.v2.trim(),
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  badge(); renderPrices(); renderDispatch(); renderMktLedger();
  toast('✓ '+rm(+v)+' credit posted to '+r.name);}

// ======================= v3.2 DUAL-SIGNATURE YIELD AUDIT =============================
// Two signatures on the same night's fruit: the worker who COUNTED it at the tree, and
// the marketer who WEIGHED it at the shed. Divide the weight by the count and you get the
// average fruit. Outside 0.8–4.0 kg that is not a durian, it is a discrepancy — and the
// direction of the error says where to look.
function ydPad(n){return String(n).padStart(2,'0');}
function prevDayStr(d){
  const t=new Date(d+'T00:00:00');
  if(isNaN(t.getTime()))return d;
  t.setDate(t.getDate()-1);
  return t.getFullYear()+'-'+ydPad(t.getMonth()+1)+'-'+ydPad(t.getDate());}

function yieldAudit(){
  const days={};
  EVENTS.filter(e=>e.type==='DISPATCH').forEach(e=>{
    const d=String(e.dt||'').slice(0,10); if(d.length!==10)return;
    const row=days[d]||(days[d]={kg:0,value:0,invoices:[],scale:{},declared:0});
    row.kg=+((row.kg+(+e.total_kg||0)).toFixed(2));
    row.value=+((row.value+(+e.total_value_rm||0)).toFixed(2));
    row.declared+=(+e.fruit_count||0);
    if(e.invoice_no)row.invoices.push(e.invoice_no);
    if(e.worker)row.scale[e.worker]=1;});
  const acks={};
  EVENTS.filter(e=>e.type==='YIELD_ACK').forEach(e=>{acks[e.day]=e;});
  return Object.keys(days).sort().reverse().map(d=>{
    const row=days[d];
    const from=prevDayStr(d)+' '+ydPad(YIELD_WINDOW_HOUR)+':00';
    const to  =d+' '+ydPad(YIELD_WINDOW_HOUR)+':00';
    const drops=EVENTS.filter(e=>e.type==='DROP'&&String(e.dt)>=from&&String(e.dt)<to);
    const fruits=drops.reduce((s,e)=>s+(+e.qty||0),0);
    const field={}; drops.forEach(e=>{if(e.worker)field[e.worker]=1;});
    // Classify on the RAW ratio, display the rounded one. Rounding first let
    // 150 kg / 188 fruits (0.7978 kg) round up to 0.80 and slip past the floor.
    const avgRaw=fruits>0?(row.kg/fruits):0;
    const avg=fruits>0?+(avgRaw.toFixed(2)):0;
    let status='OK', why='';
    if(!fruits){
      status='UNMATCHED';
      why=nf(row.kg)+' kg left the farm but NO harvest count was logged for that night at all. '+
          'Either the collection was never keyed in, or fruit moved without ever being counted at a tree.';}
    else if(avgRaw<YIELD_MIN_KG){
      status='LOW';
      why=fruits+' fruits were counted in the orchard but only '+nf(row.kg)+' kg reached the scale — '+
          'that averages '+nf(avg)+' kg a fruit, below the '+nf(YIELD_MIN_KG)+' kg floor. Fruit is going '+
          'missing between the tree and the weighing shed, or the field count was inflated.';}
    else if(avgRaw>YIELD_MAX_KG){
      status='HIGH';
      why=nf(row.kg)+' kg was weighed out against only '+fruits+' counted fruits — '+nf(avg)+
          ' kg a fruit, above the '+nf(YIELD_MAX_KG)+' kg ceiling. Fruit reached the scale that was '+
          'never logged at a tree, or the field count was under-reported.';}
    const ack=acks[d]||null;
    return {day:d, dispatch_kg:row.kg, value_rm:row.value, invoices:row.invoices,
      window_from:from, window_to:to,
      harvest_fruits:fruits, declared_fruits:row.declared,
      avg_fruit_kg:avg, status:status, why:why,
      signed_field:Object.keys(field), signed_scale:Object.keys(row.scale),
      acknowledged:!!ack, ack_reason:ack?ack.reason:'', ack_by:ack?ack.worker:'', ack_at:ack?ack.dt:''};});}

/** Open mismatches — what the Owner still has to answer for. */
function yieldFlags(){return yieldAudit().filter(r=>r.status!=='OK'&&!r.acknowledged);}

function renderYieldAudit(){
  const box=$('yieldbox');
  const strip=$('yieldstrip');
  const flags=yieldFlags();
  if(strip)strip.innerHTML=(flags.length&&myRole()==='OWNER')
    ? '<div class="critbox" style="text-align:left">⚠ YIELD COUNT vs WEIGHT MISMATCH — '+flags.length+
      ' day'+(flags.length>1?'s':'')+' unresolved<br><span style="font-weight:700;font-size:11.5px">'+
      flags.slice(0,3).map(f=>esc(f.day)+' · '+(f.status==='UNMATCHED'?'no field count':
        (nf(f.avg_fruit_kg)+' kg per fruit'))).join('<br>')+
      '</span><div style="margin-top:6px"><span class="linkish" onclick="goYieldAudit()">open the yield audit ›</span></div></div>'
    : '';
  if(!box)return;
  if(myRole()!=='OWNER'){box.innerHTML='<div class="alertnone">Owner only.</div>';return;}
  const rows=yieldAudit();
  box.innerHTML=
    '<div class="cnote">Every morning’s weighed-out kilos divided by the fruit counted in the orchard the '+
      'night before (noon to noon). A real durian averages <b>'+nf(YIELD_MIN_KG)+'–'+nf(YIELD_MAX_KG)+
      ' kg</b>. Outside that, the two signatures disagree and somebody has to explain why.</div>'+
    (flags.length
      ? '<div class="critbox">⚠ '+flags.length+' unresolved mismatch'+(flags.length>1?'es':'')+'</div>'
      : '<div class="okbox">✓ Every dispatched day reconciles against its harvest count.</div>')+
    (rows.length? rows.map(r=>{
        const bad=r.status!=='OK';
        return '<div class="ycard'+(bad&&!r.acknowledged?' bad':(bad?' answered':''))+'">'+
          '<div class="rc-top"><div class="yday">'+esc(r.day)+'<div class="pa">night of '+
            esc(r.window_from.slice(0,10))+' → morning of '+esc(r.day)+'</div></div>'+
            (r.status==='OK'?'<span class="cstat a">OK</span>'
              :(r.acknowledged?'<span class="cstat p">ANSWERED</span>'
                :'<span class="cstat r">'+r.status+'</span>'))+'</div>'+
          '<div class="ygrid">'+
            '<div><div class="l">COUNTED</div><div class="v">'+nf(r.harvest_fruits)+'</div><div class="u">fruits</div></div>'+
            '<div><div class="l">WEIGHED</div><div class="v">'+nf(r.dispatch_kg)+'</div><div class="u">kg</div></div>'+
            '<div><div class="l">AVG FRUIT</div><div class="v'+(bad?' bad':'')+'">'+
              (r.harvest_fruits?nf(r.avg_fruit_kg):'—')+'</div><div class="u">kg each</div></div>'+
          '</div>'+
          (bad?('<div class="ymsg">'+esc(r.why)+'</div>'):'')+
          '<div class="ysig">✍️ counted by <b>'+esc(r.signed_field.join(', ')||'nobody')+
            '</b> · weighed by <b>'+esc(r.signed_scale.join(', ')||'—')+'</b>'+
            (r.invoices.length?('<br>'+esc(r.invoices.join(', '))):'')+'</div>'+
          (r.acknowledged?('<div class="yack">Answered by '+esc(r.ack_by)+' on '+esc(r.ack_at)+
            ': “'+esc(r.ack_reason)+'”</div>'):'')+
          (bad&&!r.acknowledged?('<button class="bigbtn ghost" style="padding:11px;font-size:13px;margin-top:9px" '+
            'onclick="acknowledgeYield(\''+esc(r.day)+'\')">✍️ RECORD THE EXPLANATION</button>'):'')+
        '</div>';}).join('')
      :'<div class="alertnone">Nothing to audit yet — no dispatch has been confirmed.</div>')+
    '<p class="small">An alert is never cleared by editing a figure. The Owner records the explanation and '+
    'both the alert and the answer stay on the record for good.</p>;'.slice(0,-1);}

function goYieldAudit(){ openModule('admin','yield'); }

async function acknowledgeYield(day){
  if(myRole()!=='OWNER'){toast('Only the Owner can answer a yield alert',1);return;}
  const row=yieldAudit().find(r=>r.day===day); if(!row)return;
  const res=await askForm({
    title:'Yield mismatch — '+day,
    sub:row.why,
    f1:{label:'What actually happened?',type:'text',value:'',
        placeholder:'e.g. 120 fruits held back overnight for the Sunday load'},
    ok:'✍️ RECORD THE EXPLANATION'});
  if(!res)return;
  if(!res.v1.trim()){toast('An explanation is required',1);return;}
  await persistEvent({uuid:uuid(),type:'YIELD_ACK',dt:now(),day:day,
    dispatch_kg:row.dispatch_kg,harvest_fruits:row.harvest_fruits,avg_fruit_kg:row.avg_fruit_kg,
    flag:row.status,reason:res.v1.trim(),
    signed_field:row.signed_field.join(', '),signed_scale:row.signed_scale.join(', '),
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  badge(); renderYieldAudit(); renderHub();
  toast('✓ Explanation recorded against '+day);}

// ---- sync: dispatches, the retailer master and the audit trail each ride their own key
let dispWarned=false, retWarned=false, audWarned=false;
function dispQueue(){return EVENTS.filter(e=>(e.type==='DISPATCH'||e.type==='CREDIT_TOPUP')&&!e.synced);}
function q8(){return dispQueue().length;}
/** v3.2 — LOG_VOID and YIELD_ACK are the anti-manipulation trail. They ride their OWN key
 *  so a backend that predates v3.2 simply keeps them queued instead of failing the whole
 *  upload the way an unknown type in the generic `events` batch would. */
function auditQueue(){return EVENTS.filter(e=>
  (e.type==='LOG_VOID'||e.type==='YIELD_ACK'||e.type==='ADMIN_PURGE'||e.type==='ADMIN_CLEANUP'
   // v3.6 — a returned load is an audit row, not a deletion. It rides the existing audit
   // key so no backend change is needed for the reject path.
   ||e.type==='DISPATCH_REJECT'
   // v3.9 — a worker's cancellation is the same shape as a return: targetUuid + reason.
   // Riding the same key is why closing the loop needed no new backend plumbing.
   ||e.type==='DISPATCH_CANCEL')&&!e.synced);}
function q9(){return auditQueue().length;}
/**
 * v3.10.1 — strip the basket photos out of a dispatch on its way up.
 *
 * A DISPATCH approved by v3.9 or v3.10.0 has ~28 KB of base64 on every line, so an
 * eight-basket load is a 442 KB upload whose lines_json is 226,000 characters against a
 * 50,000-character cell cap. It failed with a bare "Failed to fetch" and stayed queued for
 * ever. Records already sitting in that state are rescued here, on the wire, without
 * rewriting the append-only log.
 *
 * Nothing is lost: the pictures live on DISPATCH_PHOTO keyed by req_uuid, and this row
 * records that req_uuid. That was the v3.6 design all along — the approved row POINTS AT
 * the photo instead of carrying a second copy.
 */
function slimDispatch(e){
  const out={...e};
  const lines=Array.isArray(e.lines)?e.lines
    :(typeof e.lines_json==='string'?(()=>{try{return JSON.parse(e.lines_json);}catch(x){return null;}})():null);
  if(Array.isArray(lines)){
    const clean=lines.map(x=>{const {photo_b64,photo_kb,...bare}=x||{};
      return photo_b64?{...bare,has_photo:1}:bare;});
    out.lines=clean; out.lines_json=JSON.stringify(clean);}
  // the load-level copy is not needed either — DISPATCH_REQ already holds basket 1's
  if(out.photo_b64)out.photo_b64='';
  return out;}

async function pushDispatch(){
  return pushOwnKey(dispQueue(),'dispatch','dispatch',
    m=>{if(!dispWarned){dispWarned=true;toast(m,1);}},
    'Dispatches kept on this phone — update the Apps Script to add the MKT_DISPATCH tab',
    tr('sy_l_dispatch'), slimDispatch);}
async function pushAudit(){
  return pushOwnKey(auditQueue(),'audit','audit',
    m=>{if(!audWarned){audWarned=true;toast(m,1);}},
    'Audit trail kept on this phone — update the Apps Script to add the AUDIT_LOG tab',
    tr('sy_l_audit'));}
async function pushRetailers(){
  if(!RET_DIRTY||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    // v3.6 — the contract book rides with the merchant row as JSON, the same way the
    // dispatch line breakdown does, because a spreadsheet cell cannot hold a nested table.
    const payload=RETAILERS.map(r=>({...r,
      pricing:pricingModeOf(r.id),
      current_credit_balance_rm:retailerCredit(r.id),
      contract:isContractRetailer(r.id)?JSON.stringify(RET_CONTRACT[r.id]||{}):''}));
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({retailers:payload}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j.retailers){RET_DIRTY=false;await persistRetailers();return true;}
    if(!retWarned){retWarned=true;
      toast('Retailer master kept on this phone — update the Apps Script to add the RETAILERS tab',1);}
    return false;
  }catch(e){return false;}}
/** The sheet is the master once a retailer list has been pushed — unless this phone
 *  holds an unpushed edit, exactly like the staff registry (local dirty always wins). */
async function mergeRetailers(list){
  if(RET_DIRTY)return;
  const rows=list.filter(x=>x&&(x.id||x.name)).map(x=>({
    id:String(x.id||x.name).trim(), name:String(x.name||x.id).trim(),
    contact:String(x.contact||''), opening_credit_rm:+x.opening_credit_rm||0,
    status:String(x.status||'Active'),
    // v3.6 — a backend that predates the PriceProfile column sends nothing here. Falling
    // back to SPOT would quietly move a contract merchant onto the daily trend, so the
    // local mode is kept whenever the sheet has no opinion.
    pricing:String(x.pricing||pricingModeOf(String(x.id||x.name).trim())||'SPOT').toUpperCase()}));
  if(!rows.length)return;
  RETAILERS=rows;
  // ...and the same rule for the contract book itself: an empty payload never wipes a
  // book this phone already holds.
  list.forEach(x=>{
    const id=String(x.id||x.name).trim();
    let book=x.contract;
    if(typeof book==='string'&&book){try{book=JSON.parse(book);}catch(e){book=null;}}
    if(!book||typeof book!=='object'||!Object.keys(book).length)return;
    if(!RET_CONTRACT[id])RET_CONTRACT[id]={};
    Object.keys(book).forEach(c=>{ if(!CLONE_GRADES[c])return;
      if(!RET_CONTRACT[id][c])RET_CONTRACT[id][c]={};
      Object.keys(book[c]||{}).forEach(g=>{ if(hasGrade(c,g))RET_CONTRACT[id][c][g]=+book[c][g]||0;});});});
  await persistContracts();
  await persistRetailers();}

// ======================= a small reusable ask-form ===================================
// Replaces the grey browser prompt() chains. One or two fields, a real Cancel, and a
// promise so the calling code reads top to bottom.
let _askResolve=null;
function askForm(o){
  return new Promise(res=>{
    _askResolve=res;
    $('ak-title').textContent=o.title||'';
    $('ak-sub').textContent=o.sub||'';
    const f1=o.f1||{label:'Value',type:'text',value:'',placeholder:''};
    $('ak-lab1').textContent=f1.label||'';
    const i1=$('ak-in1');
    i1.type=f1.type||'text'; i1.value=f1.value||''; i1.placeholder=f1.placeholder||'';
    i1.inputMode=(f1.type==='number')?'decimal':'text';
    const w2=$('ak-wrap2');
    if(o.f2){ w2.classList.remove('hidden');
      $('ak-lab2').textContent=o.f2.label||'';
      const i2=$('ak-in2'); i2.type=o.f2.type||'text'; i2.value=o.f2.value||'';
      i2.placeholder=o.f2.placeholder||''; }
    else w2.classList.add('hidden');
    $('ak-ok').textContent=o.ok||'✓ SAVE';
    $('askmodal').classList.remove('hidden');
    setTimeout(()=>i1.focus(),80);});}
function askDone(ok){
  $('askmodal').classList.add('hidden');
  const r=_askResolve; _askResolve=null;
  if(!r)return;
  r(ok?{v1:String($('ak-in1').value||''),v2:String($('ak-in2').value||'')}:null);}

/* ============================================================================
   SELF-CONTAINED QR ENCODER — byte mode, versions 1-10, EC level L or M.
   No CDN, no dependency: the office hotspot may be the only connection the farm
   has, and a QR that silently fails to draw because a script did not load is
   worse than no QR at all.
   ============================================================================ */
var QR=(function(){
  // ---- GF(256) with the QR primitive polynomial 0x11D ----
  var EXP=new Array(512), LOG=new Array(256);
  (function(){ var x=1;
    for(var i=0;i<255;i++){ EXP[i]=x; LOG[x]=i; x<<=1; if(x&0x100)x^=0x11D; }
    for(var j=255;j<512;j++)EXP[j]=EXP[j-255]; })();
  function gmul(a,b){ return (a===0||b===0)?0:EXP[LOG[a]+LOG[b]]; }
  function rsPoly(n){ var p=[1];
    for(var i=0;i<n;i++){ var q=[];
      for(var j=0;j<=p.length;j++){
        var v=0;
        if(j<p.length)v^=p[j];
        if(j>0)v^=gmul(p[j-1],EXP[i]);
        q[j]=v; }
      p=q; }
    return p; }
  function rsEncode(data,ecLen){
    var gen=rsPoly(ecLen), res=new Array(ecLen).fill(0);
    for(var i=0;i<data.length;i++){
      var factor=data[i]^res[0];
      res.shift(); res.push(0);
      for(var j=0;j<ecLen;j++)res[j]^=gmul(gen[j+1]!==undefined?gen[j+1]:0,factor);
    }
    return res; }

  // ---- per-version tables, EC level L then M ----
  // [ecPerBlock, blocksG1, dataPerBlockG1, blocksG2, dataPerBlockG2]
  var RS={
    L:[null,[7,1,19,0,0],[10,1,34,0,0],[15,1,55,0,0],[20,1,80,0,0],[26,1,108,0,0],
       [18,2,68,0,0],[20,2,78,0,0],[24,2,97,0,0],[30,2,116,0,0],[18,2,68,2,69]],
    M:[null,[10,1,16,0,0],[16,1,28,0,0],[26,1,44,0,0],[18,2,32,0,0],[24,2,43,0,0],
       [16,4,27,0,0],[18,4,31,0,0],[22,2,38,2,39],[22,3,36,2,37],[26,4,43,1,44]]
  };
  var CAP={ L:[0,17,32,53,78,106,134,154,192,230,271],
            M:[0,14,26,42,62,84,106,122,152,180,213] };
  var ALIGN=[null,[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]];
  var ECBITS={L:1,M:0};                      // the 2-bit EC indicator used in format info

  function bchFormat(fmt){
    var d=fmt<<10;
    for(var i=4;i>=0;i--) if(d&(1<<(i+10))) d^=0x537<<i;   // G(x)=0x537
    return ((fmt<<10)|d)^0x5412; }
  function bchVersion(v){
    var d=v<<12;
    for(var i=5;i>=0;i--) if(d&(1<<(i+12))) d^=0x1F25<<i;  // G(x)=0x1F25
    return (v<<12)|d; }

  function utf8Bytes(s){
    var out=[];
    for(var i=0;i<s.length;i++){
      var c=s.charCodeAt(i);
      if(c<0x80)out.push(c);
      else if(c<0x800){out.push(0xC0|(c>>6),0x80|(c&63));}
      else if(c>=0xD800&&c<0xDC00&&i+1<s.length){
        var c2=s.charCodeAt(++i), cp=0x10000+((c-0xD800)<<10)+(c2-0xDC00);
        out.push(0xF0|(cp>>18),0x80|((cp>>12)&63),0x80|((cp>>6)&63),0x80|(cp&63));}
      else {out.push(0xE0|(c>>12),0x80|((c>>6)&63),0x80|(c&63));}
    }
    return out; }

  /** Build the module matrix for `text`. Returns {size, modules:[[bool]]}. */
  function encode(text,ecl){
    ecl=ecl||'M';
    var bytes=utf8Bytes(text), ver=0;
    for(var v=1;v<=10;v++) if(CAP[ecl][v]>=bytes.length){ver=v;break;}
    if(!ver){ if(ecl!=='L')return encode(text,'L');
              throw new Error('URL too long for this encoder ('+bytes.length+' bytes)'); }

    // ---- bit stream: mode 0100 + count + data + terminator + pad ----
    var bits=[];
    function push(val,len){ for(var i=len-1;i>=0;i--)bits.push((val>>i)&1); }
    push(4,4);
    push(bytes.length, ver<10?8:16);
    for(var i=0;i<bytes.length;i++)push(bytes[i],8);
    var t=RS[ecl][ver], totalData=t[1]*t[2]+t[3]*t[4], capBits=totalData*8;
    for(var k=0;k<4&&bits.length<capBits;k++)bits.push(0);       // terminator
    while(bits.length%8)bits.push(0);
    var pads=[0xEC,0x11], pi=0;
    while(bits.length<capBits){ push(pads[pi++%2],8); }
    var data=[];
    for(var b=0;b<bits.length;b+=8){
      var byte=0; for(var q=0;q<8;q++)byte=(byte<<1)|bits[b+q];
      data.push(byte); }

    // ---- split into blocks, compute EC, interleave ----
    var blocks=[], ecs=[], off=0, nb=t[1]+t[3];
    for(var bi=0;bi<nb;bi++){
      var len=bi<t[1]?t[2]:t[4];
      var chunk=data.slice(off,off+len); off+=len;
      blocks.push(chunk); ecs.push(rsEncode(chunk,t[0])); }
    var maxD=Math.max(t[2],t[4]), out=[];
    for(var c=0;c<maxD;c++) for(var bb=0;bb<nb;bb++) if(c<blocks[bb].length)out.push(blocks[bb][c]);
    for(var c2=0;c2<t[0];c2++) for(var b2=0;b2<nb;b2++) out.push(ecs[b2][c2]);

    // ---- matrix ----
    var size=ver*4+17;
    var m=[], reserved=[];
    for(var y=0;y<size;y++){ m.push(new Array(size).fill(0)); reserved.push(new Array(size).fill(0)); }
    function setF(x,y,val){ if(x<0||y<0||x>=size||y>=size)return; m[y][x]=val?1:0; reserved[y][x]=1; }
    function finder(cx,cy){
      for(var dy=-1;dy<=7;dy++)for(var dx=-1;dx<=7;dx++){
        var x=cx+dx,y=cy+dy;
        if(x<0||y<0||x>=size||y>=size)continue;
        var on=(dx>=0&&dx<=6&&(dy===0||dy===6))||(dy>=0&&dy<=6&&(dx===0||dx===6))||
               (dx>=2&&dx<=4&&dy>=2&&dy<=4);
        setF(x,y,on); } }
    finder(0,0); finder(size-7,0); finder(0,size-7);
    for(var a=8;a<size-8;a++){ setF(a,6,a%2===0); setF(6,a,a%2===0); }   // timing
    var ac=ALIGN[ver];
    for(var i1=0;i1<ac.length;i1++)for(var j1=0;j1<ac.length;j1++){
      var ax=ac[i1], ay=ac[j1];
      if((ax<=8&&ay<=8)||(ax<=8&&ay>=size-9)||(ax>=size-9&&ay<=8))continue;
      for(var dy2=-2;dy2<=2;dy2++)for(var dx2=-2;dx2<=2;dx2++)
        setF(ax+dx2,ay+dy2, Math.max(Math.abs(dx2),Math.abs(dy2))!==1); }
    setF(8,size-8,1);                                                   // dark module
    for(var r=0;r<9;r++){ if(r!==6){setF(r,8,0);setF(8,r,0);} }          // format areas
    setF(8,6,0); setF(6,8,0);
    for(var r2=0;r2<8;r2++){ setF(size-1-r2,8,0); setF(8,size-1-r2,0); }
    if(ver>=7){ for(var v2=0;v2<18;v2++){
      setF(Math.floor(v2/3), size-11+(v2%3), 0);
      setF(size-11+(v2%3), Math.floor(v2/3), 0); } }

    // ---- zig-zag data placement ----
    var idx=0, bitPos=0, upward=true;
    for(var col=size-1;col>0;col-=2){
      if(col===6)col--;                                   // skip the vertical timing column
      for(var rr=0;rr<size;rr++){
        var yy=upward?(size-1-rr):rr;
        for(var cc=0;cc<2;cc++){
          var xx=col-cc;
          if(reserved[yy][xx])continue;
          var bit=0;
          if(idx<out.length){ bit=(out[idx]>>(7-bitPos))&1;
            bitPos++; if(bitPos===8){bitPos=0;idx++;} }
          m[yy][xx]=bit; } }
      upward=!upward; }

    // ---- masking: apply each, score, keep the best ----
    function maskFn(k,x,y){
      switch(k){
        case 0: return (x+y)%2===0;
        case 1: return y%2===0;
        case 2: return x%3===0;
        case 3: return (x+y)%3===0;
        case 4: return (Math.floor(y/2)+Math.floor(x/3))%2===0;
        case 5: return ((x*y)%2)+((x*y)%3)===0;
        case 6: return (((x*y)%2)+((x*y)%3))%2===0;
        case 7: return (((x+y)%2)+((x*y)%3))%2===0; } }
    function penalty(g){
      var p=0,n=size,i,j,run,last,dark=0;
      for(i=0;i<n;i++){ run=1;last=g[i][0];
        for(j=1;j<n;j++){ if(g[i][j]===last)run++; else {if(run>=5)p+=3+(run-5);run=1;last=g[i][j];} }
        if(run>=5)p+=3+(run-5); }
      for(j=0;j<n;j++){ run=1;last=g[0][j];
        for(i=1;i<n;i++){ if(g[i][j]===last)run++; else {if(run>=5)p+=3+(run-5);run=1;last=g[i][j];} }
        if(run>=5)p+=3+(run-5); }
      for(i=0;i<n-1;i++)for(j=0;j<n-1;j++){
        var s=g[i][j]+g[i][j+1]+g[i+1][j]+g[i+1][j+1];
        if(s===0||s===4)p+=3; }
      var pat=[1,0,1,1,1,0,1,0,0,0,0];
      function match(get){ var c=0;
        for(var a2=0;a2+11<=n;a2++){ var okk=true;
          for(var b3=0;b3<11;b3++) if(get(a2+b3)!==pat[b3]){okk=false;break;}
          if(okk)c++; }
        return c; }
      for(i=0;i<n;i++){ p+=40*match(function(z){return g[i][z];});
                        p+=40*match(function(z){return g[z][i];}); }
      for(i=0;i<n;i++)for(j=0;j<n;j++)dark+=g[i][j];
      p+=10*Math.floor(Math.abs(dark*100/(n*n)-50)/5);
      return p; }

    var best=null,bestScore=Infinity,bestMask=0;
    for(var mk=0;mk<8;mk++){
      var g2=[];
      for(var y3=0;y3<size;y3++){ g2.push(m[y3].slice());
        for(var x3=0;x3<size;x3++) if(!reserved[y3][x3]&&maskFn(mk,x3,y3)) g2[y3][x3]^=1; }
      // format info for this mask
      var fmt=bchFormat((ECBITS[ecl]<<3)|mk);
      for(var f=0;f<15;f++){
        var bit2=(fmt>>f)&1;
        if(f<6)g2[f][8]=bit2; else if(f===6)g2[7][8]=bit2; else if(f===7)g2[8][8]=bit2;
        else if(f===8)g2[8][7]=bit2; else g2[8][14-f]=bit2;
        if(f<8)g2[8][size-1-f]=bit2; else g2[size-15+f][8]=bit2; }
      g2[size-8][8]=1;                                        // dark module survives masking
      if(ver>=7){ var vi=bchVersion(ver);
        for(var v3=0;v3<18;v3++){ var bit3=(vi>>v3)&1;
          g2[Math.floor(v3/3)][size-11+(v3%3)]=bit3;
          g2[size-11+(v3%3)][Math.floor(v3/3)]=bit3; } }
      var sc=penalty(g2);
      if(sc<bestScore){bestScore=sc;best=g2;bestMask=mk;} }
    return {size:size,version:ver,ec:ecl,mask:bestMask,modules:best}; }

  /** Crisp SVG at any print size — scales without blurring, unlike a canvas bitmap. */
  function svg(text,opts){
    opts=opts||{};
    var q=(opts.quiet===undefined)?4:opts.quiet, px=opts.scale||8;
    var r=encode(text,opts.ec||'M'), n=r.size, total=(n+q*2)*px;
    var d='';
    for(var y=0;y<n;y++)for(var x=0;x<n;x++)
      if(r.modules[y][x]) d+='M'+((x+q)*px)+' '+((y+q)*px)+'h'+px+'v'+px+'h-'+px+'z';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="'+total+'" height="'+total+
      '" viewBox="0 0 '+total+' '+total+'" shape-rendering="crispEdges">'+
      '<rect width="'+total+'" height="'+total+'" fill="#fff"/>'+
      '<path d="'+d+'" fill="#000"/></svg>'; }

  return {encode:encode, svg:svg};
})();


// ############################################################################
// ##  v3.3 — OWNER MASTER DATABASE CONTROL                                   ##
// ##  Full CRUD for the Owner across every local log, PLUS the backdate       ##
// ##  engine, orchard expansion, trial purge and the offline QR distributor.  ##
// ##                                                                          ##
// ##  HOW "DELETE" WORKS HERE, AND WHY.                                       ##
// ##  Every row also lives in the Google Sheet and on the workers' phones. A  ##
// ##  local-only erase would leave your phone saying tree B-045 has 0 tied    ##
// ##  while the worker's phone still says 24 — the two devices would never    ##
// ##  agree again. So a delete writes a SIGNED REVERSAL of the same shape the ##
// ##  approved-correction path already uses (DROP_ADJUST / ROTTEN_ADJUST /    ##
// ##  TIE_ADJUST / STOCK_ADJUST). The row instantly stops counting in every   ##
// ##  total on every screen, the reversal syncs to the Sheet and to every     ##
// ##  phone, and last week's yield alerts cannot quietly rewrite themselves.  ##
// ##  It behaves exactly like a delete; it just cannot desynchronise.         ##
// ############################################################################

function canMasterAdmin(){return myRole()==='OWNER';}
let MDB_SEC='data', MDB_LOG='harvest', MDB_EDIT='';
// the next tree number to offer. Held here, NOT in the input, because saving a tree
// re-renders the whole section and would wipe anything written straight to the field.
let MDB_NEXT_NO='', MDB_NEXT_LOT='A';
// The backdate forms remember which lot and tree you were on. Saving a round re-renders
// the section, and without this the Owner would have to re-pick the lot and the tree for
// every single one of a long run of historical rounds on the SAME tree.
let MDB_BK={tieLot:'',tieTree:'',drLot:'',drTree:'',rtLot:'',rtTree:''};

// ---- reading a row's live state ------------------------------------------------------
/** Every signed reversal/correction aimed at this row. */
function adjustsFor(u){
  return EVENTS.filter(e=>e.evUuid===u&&
    (e.type==='DROP_ADJUST'||e.type==='ROTTEN_ADJUST'||e.type==='TIE_ADJUST'||e.type==='STOCK_ADJUST'));}
/** What the row counts as RIGHT NOW: what was keyed, plus every signed adjustment. */
function rowLiveQty(e){
  return logQtyOf(e)+adjustsFor(e.uuid).reduce((s,a)=>s+(+a.delta||0),0)*
    ((e.type==='STOCK_OUT')?-1:1);}
function rowIsVoided(e){return EVENTS.some(a=>a.evUuid===e.uuid&&a.adminVoid);}
function rowWasEdited(e){return EVENTS.some(a=>a.evUuid===e.uuid&&a.adminEdit);}

/**
 * THE one place an Owner edit or delete becomes events. Emits the same signed shapes the
 * approved-correction path emits, so every ledger in the app already accounts for them
 * and not one aggregate had to be touched to make this work.
 */
async function writeAdjust(e,newQty,reason,isVoid){
  const oldQty=rowLiveQty(e);
  const delta=+(Math.round(newQty)-Math.round(oldQty));
  if(!delta&&!isVoid)return false;
  const stamp=now(), tag={adminEdit:!isVoid,adminVoid:!!isVoid,
    reason:reason, approvedBy:CFG.worker, requestedBy:CFG.worker,
    device:CFG.device, worker:CFG.worker, synced:false};

  if(e.type==='DROP'||e.type==='ROTTEN'){
    const t=treeById(e.tree);
    const type=e.type==='ROTTEN'?'ROTTEN_ADJUST':'DROP_ADJUST';
    const rec=Object.assign({uuid:uuid(),type:type,dt:stamp,evUuid:e.uuid,
      tree:e.tree,lot:e.lot,clone:e.clone||(t&&t.clone)||'',
      was:Math.round(oldQty),now:Math.round(newQty),delta:delta,
      estkg:+(delta*(AVG_KG[(t&&t.clone)]||1.6)).toFixed(1)},tag);
    if(type==='DROP_ADJUST')   rec.secured=isSecuredDrop(e);
    if(type==='ROTTEN_ADJUST') rec.tied   =isTiedRotten(e);
    await persistEvent(rec);
    return true;}

  if(e.type==='TIE'){
    const t=treeById(e.tree);
    const rec=Object.assign({uuid:uuid(),type:'TIE_ADJUST',dt:stamp,evUuid:e.uuid,
      tree:e.tree,lot:e.lot,clone:e.clone||(t&&t.clone)||'',
      was:Math.round(oldQty),now:Math.round(newQty),delta:delta,
      ropeM:+(delta*ROPE_M_PER_FRUIT).toFixed(2)},tag);
    await persistEvent(rec);
    // a tying round that is reversed must give its rope back, or the store never balances
    const rp=prodById(ROPE_PID);
    if(rp&&rec.ropeM) await persistEvent({uuid:uuid(),type:'STOCK_ADJUST',dt:stamp,
      pid:ROPE_PID,pname:rp.name,ai:'',unit:rp.unit,delta:-rec.ropeM,
      systemQty:onHand(rp),counted:onHand(rp)-rec.ropeM,
      note:'Rope re-stated with an Owner '+(isVoid?'void':'edit')+' of tying on '+e.tree+' — '+reason,
      evUuid:e.uuid,adminEdit:!isVoid,adminVoid:!!isVoid,
      worker:CFG.worker,device:CFG.device,synced:false});
    return true;}

  if(e.type==='STOCK_IN'||e.type==='STOCK_OUT'){
    const p=prodById(e.pid);
    // stock OUT leaving the store is a negative movement, so reversing it ADDS back
    const signed=(e.type==='STOCK_OUT')?-delta:delta;
    await persistEvent(Object.assign({uuid:uuid(),type:'STOCK_ADJUST',dt:stamp,
      pid:e.pid,pname:e.pname||'',ai:e.ai||'',unit:e.unit||'',
      delta:signed, systemQty:p?onHand(p):0, counted:(p?onHand(p):0)+signed,
      note:'Owner '+(isVoid?'void':'edit')+' of '+e.type+' — '+reason,
      evUuid:e.uuid},tag));
    return true;}

  toast('That row type cannot be adjusted',1);
  return false;}

// ---- the three log tables ------------------------------------------------------------
const MDB_LOGS={
  harvest  :{t:'harvest_log',   ic:'🥭', types:['DROP','ROTTEN'],       unit:'fruits'},
  tying    :{t:'tying_log',     ic:'🎗️', types:['TIE'],                 unit:'fruits'},
  inventory:{t:'inventory_ledger',ic:'📦',types:['STOCK_IN','STOCK_OUT'],unit:''}
};
function mdbRows(kind){
  const def=MDB_LOGS[kind]||MDB_LOGS.harvest;
  return EVENTS.filter(e=>def.types.indexOf(e.type)>=0)
    .slice().sort((a,b)=>String(a.dt)<String(b.dt)?1:(String(a.dt)>String(b.dt)?-1:0));}
function mdbRowLabel(e){
  if(e.type==='DROP')     return '🥭 '+(e.clone||'?')+' Grade '+(e.grade||'?')+' @ '+e.tree+
                                 (isSecuredDrop(e)?'':' · untied');
  if(e.type==='ROTTEN')   return '🍂 rotten @ '+e.tree+(e.causeLabel?(' · '+e.causeLabel):'');
  if(e.type==='TIE')      return '🎗️ tied @ '+e.tree+' · '+nf(e.ropeM||0)+' m rope';
  if(e.type==='STOCK_IN') return '📦← '+(e.pname||'')+(e.ref?(' · '+e.ref):'');
  if(e.type==='STOCK_OUT')return '📦→ '+(e.pname||'')+(e.lot?(' · Lot '+e.lot):'');
  return e.type;}

function mdbSec(s){MDB_SEC=s;MDB_EDIT='';CLN.sel={};CLN.unlocked=false;renderMasterDB();}
function mdbPickLog(k){MDB_LOG=k;MDB_EDIT='';renderMasterDB();}
function mdbEditRow(u){if(!canMasterAdmin())return;MDB_EDIT=u;renderMasterDB();}
function mdbCancelEdit(){MDB_EDIT='';renderMasterDB();}

async function mdbSaveEdit(u){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  const e=EVENTS.find(x=>x.uuid===u); if(!e)return;
  const el=$('mdb-q-'+u), rl=$('mdb-r-'+u);
  const v=el?el.value:'', reason=rl?String(rl.value||'').trim():'';
  if(v===''||isNaN(+v)||+v<0){toast('That is not a valid figure',1);return;}
  if(!reason){toast('A reason is required — it travels with the correction',1);return;}
  const changed=await writeAdjust(e,+v,reason,false);
  MDB_EDIT='';
  if(changed){rebuildLedgers();badge();refreshEverything();toast('✓ Row corrected to '+nf(+v));}
  else {renderMasterDB();toast('Nothing changed');}}

async function mdbDeleteRow(u){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  const e=EVENTS.find(x=>x.uuid===u); if(!e)return;
  if(rowIsVoided(e)){toast('That row is already voided',1);return;}
  const res=await askForm({
    title:'Delete this row',
    sub:mdbRowLabel(e)+' · '+nf(rowLiveQty(e))+' — recorded '+e.dt+' by '+(e.worker||'?')+
        '. It will stop counting everywhere immediately. A signed reversal syncs to the Sheet and to '+
        'every phone so no device is left disagreeing.',
    f1:{label:'Reason for deleting',type:'text',value:'',placeholder:'e.g. keyed against the wrong tree'},
    ok:'🗑️ DELETE THIS ROW'});
  if(!res)return;
  if(!res.v1.trim()){toast('A reason is required',1);return;}
  await writeAdjust(e,0,res.v1.trim(),true);
  rebuildLedgers();badge();refreshEverything();
  toast('✓ Row deleted — it now counts as zero everywhere');}

/** After any master edit, every screen that shows a total has to be redrawn. */
function refreshEverything(){
  try{
    renderMasterDB();renderDash&&renderDash();renderTying&&renderTying();
    renderStock&&renderStock();renderAlerts&&renderAlerts();renderMktLedger&&renderMktLedger();
    renderYieldAudit&&renderYieldAudit();renderWave&&renderWave();renderMyLogs&&renderMyLogs();
    refreshTreeBoard&&refreshTreeBoard();renderHub&&renderHub();renderSync&&renderSync();
  }catch(x){}}

// ---- 2. HISTORICAL BACKDATE ENGINE ---------------------------------------------------
// Work done before the app existed still has to reach the ledger, or every tree balance
// starts wrong. Backdated rows carry the date the work HAPPENED plus `enteredAt`, the
// moment it was keyed — so a row entered three weeks late can never be mistaken for one
// logged in the field that morning.
function mdbDtValue(id){
  const el=$(id); if(!el||!el.value)return '';
  return String(el.value).replace('T',' ').slice(0,16);}
function mdbBkKey(sel){return sel==='bk-tie-lot'?'tie':(sel==='bk-rt-lot'?'rt':'dr');}
function mdbBackLots(sel,treeSel){
  const s=$(sel); if(!s)return;
  const k=mdbBkKey(sel), want=MDB_BK[k+'Lot']||LOTS[0];
  s.innerHTML=LOTS.map(l=>'<option value="'+l+'"'+(l===want?' selected':'')+'>Lot '+l+
    ' ('+treesInLot(l).length+' trees)</option>').join('');
  s.value=want;
  mdbBackTrees(sel,treeSel);}
function mdbBackTrees(sel,treeSel){
  const s=$(sel), t=$(treeSel); if(!s||!t)return;
  const k=mdbBkKey(sel);
  MDB_BK[k+'Lot']=s.value;
  const keep=MDB_BK[k+'Tree'];
  t.innerHTML='<option value="">— select tree —</option>'+treesInLot(s.value).map(x=>
    '<option value="'+x.id+'">'+x.id+' · Tree '+x.no+' · '+(x.clone||'?')+'</option>').join('');
  if(keep&&treesInLot(s.value).some(x=>x.id===keep)) t.value=keep; else MDB_BK[k+'Tree']='';
  t.onchange=function(){MDB_BK[k+'Tree']=t.value;};}

async function mdbBackTie(){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  const err=$('bk-tie-err'); err.textContent='';
  const id=$('bk-tie-tree').value, n=Math.floor(+$('bk-tie-n').value||0), dt=mdbDtValue('bk-tie-dt');
  const note=String($('bk-tie-note').value||'').trim();
  if(!id)  return err.textContent='Choose the tree this tying round was done on.';
  if(!(n>0))return err.textContent='How many fruits were tied? Must be more than zero.';
  if(!dt)  return err.textContent='Choose the date and time the tying was actually done.';
  if(dt>now()) return err.textContent='That is in the future. The backdate engine is for work already done.';
  const t=treeById(id); if(!t)return err.textContent='That tree is not in the census.';
  const need=ropeNeeded(n), rid=uuid();
  await persistEvent({uuid:uuid(),type:'TIE',dt:dt,tree:t.id,lot:t.lot,clone:t.clone||'',
    n:n,ropeM:need,roundId:rid,
    backdated:true,enteredAt:now(),note:note,
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  const rp=prodById(ROPE_PID);
  if(rp&&need>0) await persistEvent({uuid:uuid(),type:'STOCK_OUT',dt:dt,pid:ROPE_PID,pname:rp.name,
    ai:'',qty:need,unit:rp.unit,lot:t.lot,set:'Fruit tying (backdated)',
    cost:+(need*(rp.cpu||0)).toFixed(2),roundId:rid,tree:t.id,
    backdated:true,enteredAt:now(),
    worker:CFG.worker,device:CFG.device,synced:false});
  MDB_BK.tieLot=t.lot; MDB_BK.tieTree=t.id;      // stay on this tree for the next round
  $('bk-tie-n').value=''; $('bk-tie-note').value='';
  rebuildLedgers();badge();refreshEverything();
  toast('✓ '+n+' tied on '+t.id+' backdated to '+dt);}

async function mdbBackDrop(){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  const err=$('bk-dr-err'); err.textContent='';
  const id=$('bk-dr-tree').value, n=Math.floor(+$('bk-dr-n').value||0), dt=mdbDtValue('bk-dr-dt');
  const grade=$('bk-dr-grade').value, kind=$('bk-dr-kind').value;
  if(!id)  return err.textContent='Choose the tree these fruits were collected from.';
  if(!(n>0))return err.textContent='How many fruits were collected? Must be more than zero.';
  if(!dt)  return err.textContent='Choose the date and time the collection was actually done.';
  if(dt>now()) return err.textContent='That is in the future. The backdate engine is for work already done.';
  const t=treeById(id); if(!t)return err.textContent='That tree is not in the census.';
  if(!hasGrade(t.clone||'MK',grade))
    return err.textContent=(CLONE_NAME[t.clone]||t.clone)+' is not sorted into Grade '+grade+'.';
  await persistEvent({uuid:uuid(),type:'DROP',dt:dt,tree:t.id,lot:t.lot,clone:t.clone||'',
    qty:n,grade:grade,estkg:+(n*(AVG_KG[t.clone]||1.6)).toFixed(1),
    secured:kind==='SECURED',dropKind:kind,pickId:uuid(),
    backdated:true,enteredAt:now(),
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  MDB_BK.drLot=t.lot; MDB_BK.drTree=t.id;
  $('bk-dr-n').value='';
  rebuildLedgers();badge();refreshEverything();
  toast('✓ '+n+' Grade '+grade+' from '+t.id+' backdated to '+dt);}

async function mdbBackRotten(){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  const err=$('bk-rt-err'); err.textContent='';
  const id=$('bk-rt-tree').value, n=Math.floor(+$('bk-rt-n').value||0), dt=mdbDtValue('bk-rt-dt');
  const cause=$('bk-rt-cause').value, tied=$('bk-rt-tied').value==='TIED';
  if(!id)  return err.textContent='Choose the tree these rotten fruits came from.';
  if(!(n>0))return err.textContent='How many rotten fruits? Must be more than zero.';
  if(!cause||!ROT_CAUSE[cause])
    return err.textContent='Tag the damage cause — a rotten count without a cause cannot be acted on.';
  if(!dt)  return err.textContent='Choose the date and time the rotten fruit was found.';
  if(dt>now()) return err.textContent='That is in the future. The backdate engine is for work already done.';
  const t=treeById(id); if(!t)return err.textContent='That tree is not in the census.';
  // the same sanity check the live rotten card applies, but against the balance as it
  // stood ON THAT DAY, not today — a backdated loss must be judged against its own moment
  if(tied){
    const balThen=tiedAsOf(t.id,dt)-droppedAsOf(t.id,dt);
    if(balThen>0&&n>balThen&&!confirm('⚠ On '+dt.slice(0,10)+', '+t.id+' had only '+nf(balThen)+
       ' fruit still on the string.\nLog '+n+' rotten anyway?'))return;}
  await persistEvent({uuid:uuid(),type:'ROTTEN',dt:dt,tree:t.id,lot:t.lot,clone:t.clone||'',
    qty:n,cause:cause,causeLabel:ROT_CAUSE[cause].label,tied:tied,
    estkg:+(n*(AVG_KG[t.clone]||1.6)).toFixed(1),
    backdated:true,enteredAt:now(),
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
  MDB_BK.rtLot=t.lot; MDB_BK.rtTree=t.id;
  $('bk-rt-n').value='';
  rebuildLedgers();badge();refreshEverything();
  toast('🍂 '+n+' rotten @ '+t.id+' · '+ROT_CAUSE[cause].label+' backdated to '+dt);}

/** What the tree's figures were on a given date — so a backdated loss is checked against
 *  the balance as it stood THEN, not against today's. */
function tiedAsOf(tree,dt){
  return (typeof tiedMigOf==='function'?tiedMigOf(tree):0)
    + EVENTS.filter(e=>e.type==='TIE'&&e.tree===tree&&String(e.dt)<=dt)
        .reduce((s,e)=>s+(+e.n||0),0)
    + EVENTS.filter(e=>e.type==='TIE_ADJUST'&&e.tree===tree&&String(e.dt)<=dt)
        .reduce((s,e)=>s+(+e.delta||0),0);}
function droppedAsOf(tree,dt){
  return EVENTS.filter(e=>e.type==='DROP'&&e.tree===tree&&isSecuredDrop(e)&&String(e.dt)<=dt)
        .reduce((s,e)=>s+(+e.qty||0),0)
    + EVENTS.filter(e=>e.type==='ROTTEN'&&e.tree===tree&&isTiedRotten(e)&&String(e.dt)<=dt)
        .reduce((s,e)=>s+(+e.qty||0),0);}

// ---- 3. DYNAMIC ORCHARD EXPANSION ----------------------------------------------------
// New trees are appended to the SAME census array every dropdown reads, so a tree added
// here is instantly pickable on the worker's collection and tying screens. It is stored
// separately in kv and re-applied on every boot, because TREE_MASTER itself ships inside
// database.js and is replaced whenever the app is upgraded.
async function persistAddedTrees(){
  if(db)await put('kv',{k:'addtrees',v:ADDED_TREES});
  // v3.11 — a tree only this phone knows about cannot be logged against by the worker
  // standing at it. Every add and every removal is shared.
  await markSetting('addtrees'); }
function applyAddedTrees(){
  let n=0;
  ADDED_TREES.forEach(t=>{
    if(TREE_MASTER.some(x=>x.id===t.id))return;
    TREE_MASTER.push({id:t.id,lot:t.lot,no:+t.no,clone:t.clone||'',census:null,added:true});n++;});
  if(n){ TREE_MASTER.sort((a,b)=>a.lot<b.lot?-1:(a.lot>b.lot?1:(a.no-b.no)));
         if(typeof recalcCensusTotals==='function')recalcCensusTotals(); }
  return n;}
function treeHasHistory(id){
  return EVENTS.some(e=>e.tree===id);}

async function mdbAddTree(){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  const err=$('at-err'); err.textContent='';
  const lot=$('at-lot').value, no=Math.floor(+$('at-no').value||0), clone=$('at-clone').value;
  if(LOTS.indexOf(lot)<0) return err.textContent='Choose Lot A, B or C.';
  if(!(no>0&&no<1000))    return err.textContent='Tree number must be between 1 and 999.';
  const id=lot+'-'+String(no).padStart(3,'0');
  if(TREE_MASTER.some(t=>t.id===id))
    return err.textContent=id+' already exists in the census.';
  ADDED_TREES.push({id:id,lot:lot,no:no,clone:clone,addedBy:CFG.worker,addedAt:now()});
  await persistAddedTrees();
  applyAddedTrees();
  MDB_NEXT_LOT=lot; MDB_NEXT_NO=String(no+1);          // next spot, ready for a fast run of 20
  rebuildLedgers();
  rebuildAllTreePickers();
  refreshEverything();
  toast('✓ '+id+' added — now '+TREE_MASTER.length+' trees, live in every dropdown');}

async function mdbRemoveTree(id){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  if(treeHasHistory(id)){toast('That tree already has logged work — it cannot be removed',1);return;}
  if(!confirm('Remove '+id+' from the census?\n\nIt has no logged work, so nothing is lost.'))return;
  ADDED_TREES=ADDED_TREES.filter(t=>t.id!==id);
  const i=TREE_MASTER.findIndex(t=>t.id===id);
  if(i>=0)TREE_MASTER.splice(i,1);
  await persistAddedTrees();
  if(typeof recalcCensusTotals==='function')recalcCensusTotals();
  rebuildLedgers(); rebuildAllTreePickers(); refreshEverything();
  toast('✓ '+id+' removed — now '+TREE_MASTER.length+' trees');}

/** Every screen that caches a tree list has to be rebuilt, or a new tree is invisible
 *  on exactly the screens the workers use. */
function rebuildAllTreePickers(){
  try{
    if(typeof buildLotSelect==='function')buildLotSelect();
    if(typeof tyBuildLots==='function'){const s=$('ty-lot');if(s)s.innerHTML='';tyBuildLots();}
    if(typeof tyBuildTrees==='function')tyBuildTrees();
    if(typeof buildTreeSelect==='function')buildTreeSelect();
    mdbBackLots('bk-tie-lot','bk-tie-tree');
    mdbBackLots('bk-dr-lot','bk-dr-tree');
    mdbBackLots('bk-rt-lot','bk-rt-tree');
  }catch(x){}}

// ---- 4. SELECTIVE CLEAN-UP (replaces the blanket purge) ------------------------------
// The farm's imported data and the Owner's test entries live in the same log, so a
// wipe-everything button is the wrong instrument: it cannot tell them apart. This screen
// filters the log down, lets the Owner tick exactly the rows that were tests, shows what
// removing them does to the balances, and only then removes them.
//
// The imported master data is safe from this screen BY CONSTRUCTION: the 959-fruit tying
// opening balance, the 171-tree census and the opening stock are constants inside
// database.js, not events, so nothing here can reach them.
let CLN={from:'',to:'',types:[],who:'',dev:'',sel:{},unlocked:false};

const CLN_TYPES=[
  {k:'DROP',       t:'Fruit drops'},
  {k:'ROTTEN',     t:'Rotten logs'},
  {k:'TIE',        t:'Tying rounds'},
  {k:'STOCK_IN',   t:'Stock in'},
  {k:'STOCK_OUT',  t:'Stock out'},
  {k:'STOCK_ADJUST',t:'Stock-take'},
  {k:'DISPATCH',   t:'Dispatches'},
  {k:'CREDIT_TOPUP',t:'Credit top-ups'},
  {k:'SALE',       t:'Other sales'},
  {k:'TASK_DONE',  t:'Task done'},
  {k:'ADJ',        t:'Signed corrections'},
  {k:'CORR',       t:'Correction requests'}
];
const CLN_ADJ=['DROP_ADJUST','ROTTEN_ADJUST','TIE_ADJUST'];
function clnTypeMatch(type){
  if(!CLN.types.length)return true;
  if(CLN.types.indexOf('ADJ')>=0&&CLN_ADJ.indexOf(type)>=0)return true;
  return CLN.types.indexOf(type)>=0;}

/** Every row the filters currently let through, events and correction requests together. */
function cleanupRows(){
  const out=[];
  const push=(o)=>{
    if(CLN.from&&String(o.dt).slice(0,10)<CLN.from)return;
    if(CLN.to  &&String(o.dt).slice(0,10)>CLN.to)  return;
    if(CLN.who &&String(o.who||'')!==CLN.who)return;
    if(CLN.dev &&String(o.dev||'')!==CLN.dev)return;
    out.push(o);};
  EVENTS.forEach(e=>{
    if(e.type==='ADMIN_PURGE'||e.type==='ADMIN_CLEANUP')return;   // the audit trail is not junk
    if(!clnTypeMatch(e.type))return;
    push({kind:'EV',uuid:e.uuid,dt:e.dt||'',type:e.type,label:describeEvent(e),
      qty:logQtyOf(e),who:e.worker||'',dev:e.device||'',synced:!!e.synced,
      backdated:!!e.backdated,ev:e});});
  if(!CLN.types.length||CLN.types.indexOf('CORR')>=0){
    CORRECTIONS.forEach(c=>push({kind:'CORR',uuid:c.uuid,dt:c.dt||'',type:'CORR',
      label:'📝 correction request · '+(c.tree||'')+' · '+String(c.status||'').toUpperCase(),
      qty:0,who:c.requestedBy||c.worker||'',dev:c.device||'',synced:!!c.synced,ev:c}));}
  return out.sort((a,b)=>String(a.dt)<String(b.dt)?1:(String(a.dt)>String(b.dt)?-1:0));}

function clnPeople(){const s={};EVENTS.forEach(e=>{if(e.worker)s[e.worker]=1;});return Object.keys(s).sort();}
function clnDevices(){const s={};EVENTS.forEach(e=>{if(e.device)s[e.device]=1;});return Object.keys(s).sort();}

/**
 * Removing a tying round without its rope leaves rope consumed for nothing, and removing a
 * row while a signed correction still points at it leaves that correction skewing the
 * ledger for ever. So the selection quietly grows to include what it depends on, and the
 * screen says how many were added.
 */
function cleanupExpand(ids){
  const set={}; ids.forEach(u=>set[u]=1);
  const rounds={};
  EVENTS.forEach(e=>{ if(set[e.uuid]&&e.type==='TIE'&&e.roundId)rounds[e.roundId]=1; });
  let added=0;
  EVENTS.forEach(e=>{
    if(set[e.uuid])return;
    if(e.evUuid&&set[e.evUuid]){set[e.uuid]=1;added++;return;}          // its corrections
    if(e.roundId&&rounds[e.roundId]){set[e.uuid]=1;added++;return;}     // the rope it drew
  });
  return {ids:Object.keys(set), added:added};}

/** What the balances lose if these rows go — shown BEFORE anything is removed. */
function cleanupImpact(ids){
  const set={}; ids.forEach(u=>set[u]=1);
  const im={rows:ids.length,tied:0,collected:0,rotten:0,stockIn:0,stockOut:0,
            dispatchKg:0,dispatchRM:0,topupRM:0,corr:0,synced:0,trees:{}};
  EVENTS.forEach(e=>{
    if(!set[e.uuid])return;
    if(e.synced)im.synced++;
    if(e.tree)im.trees[e.tree]=1;
    if(e.type==='TIE')          im.tied      +=+e.n||0;
    if(e.type==='TIE_ADJUST')   im.tied      +=+e.delta||0;
    if(e.type==='DROP')         im.collected +=+e.qty||0;
    if(e.type==='DROP_ADJUST')  im.collected +=+e.delta||0;
    if(e.type==='ROTTEN')       im.rotten    +=+e.qty||0;
    if(e.type==='ROTTEN_ADJUST')im.rotten    +=+e.delta||0;
    if(e.type==='STOCK_IN')     im.stockIn++;
    if(e.type==='STOCK_OUT')    im.stockOut++;
    if(e.type==='DISPATCH'){    im.dispatchKg+=+e.total_kg||0; im.dispatchRM+=+e.total_value_rm||0; }
    if(e.type==='CREDIT_TOPUP') im.topupRM   +=+e.amount_rm||0;});
  CORRECTIONS.forEach(c=>{if(set[c.uuid])im.corr++;});
  im.treeCount=Object.keys(im.trees).length;
  return im;}

// ---- selection plumbing --------------------------------------------------------------
function clnSelCount(){return Object.keys(CLN.sel).length;}
function clnToggle(u){ if(CLN.sel[u])delete CLN.sel[u]; else CLN.sel[u]=1; renderMasterDB(); }
function clnSelectShown(){ cleanupRows().forEach(r=>CLN.sel[r.uuid]=1); renderMasterDB(); }
function clnClearSel(){ CLN.sel={}; renderMasterDB(); }
function clnSetFilter(f,v){ CLN[f]=v; renderMasterDB(); }
function clnToggleType(k){
  const i=CLN.types.indexOf(k);
  if(i>=0)CLN.types.splice(i,1); else CLN.types.push(k);
  renderMasterDB();}
function clnResetFilters(){ CLN.from='';CLN.to='';CLN.types=[];CLN.who='';CLN.dev=''; renderMasterDB(); }
function clnUnlock(){
  const el=$('cln-key'); if(!el)return;
  const k=findKey(String(el.value||'').trim());
  if(!k||k.role!=='OWNER'||String(k.status).toLowerCase()!=='active'){
    const e=$('cln-keyerr'); if(e)e.textContent='That is not an active Owner access key.';
    el.value=''; return;}
  CLN.unlocked=true; toast('🔓 Clean-up unlocked'); renderMasterDB();}

async function cleanupDelete(){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  if(!CLN.unlocked){toast('Unlock with the Owner key first',1);return;}
  const picked=Object.keys(CLN.sel);
  if(!picked.length){toast('Nothing ticked yet',1);return;}
  const ex=cleanupExpand(picked), im=cleanupImpact(ex.ids);
  const lines=['Remove '+ex.ids.length+' record'+(ex.ids.length===1?'':'s')+' from this phone?'];
  if(ex.added)lines.push('('+ex.added+' linked row'+(ex.added===1?'':'s')+' added automatically — '+
    'rope drawn by a tying round, and any correction pointing at a row you ticked.)');
  lines.push('');
  if(im.tied)      lines.push('• '+nf(im.tied)+' tied fruit come off the tied balance');
  if(im.collected) lines.push('• '+nf(im.collected)+' collected fruit removed');
  if(im.rotten)    lines.push('• '+nf(im.rotten)+' rotten fruit removed');
  if(im.stockIn||im.stockOut)lines.push('• '+(im.stockIn+im.stockOut)+' stock movements reversed');
  if(im.dispatchKg)lines.push('• '+nf(im.dispatchKg)+' kg / '+rm(im.dispatchRM)+' of dispatches removed');
  if(im.topupRM)   lines.push('• '+rm(im.topupRM)+' of credit top-ups removed');
  if(im.corr)      lines.push('• '+im.corr+' correction request'+(im.corr===1?'':'s')+' removed');
  if(im.synced)    lines.push('','⚠ '+im.synced+' of these already reached the Google Sheet. They will '+
    'still be in the Sheet afterwards — delete those rows there too.');
  lines.push('','This cannot be undone on this phone.');
  if(!confirm(lines.join('\n')))return;

  const set={}; ex.ids.forEach(u=>set[u]=1);
  const gone=EVENTS.filter(e=>set[e.uuid]);
  const goneCorr=CORRECTIONS.filter(c=>set[c.uuid]);
  const summary=[];
  const byType={}; gone.forEach(e=>{byType[e.type]=(byType[e.type]||0)+1;});
  Object.keys(byType).forEach(t=>summary.push(t+': '+byType[t]));
  if(goneCorr.length)summary.push('CORRECTION: '+goneCorr.length);

  EVENTS=EVENTS.filter(e=>!set[e.uuid]);
  CORRECTIONS=CORRECTIONS.filter(c=>!set[c.uuid]);
  if(db){
    for(const e of gone)      {try{await del('events',e.uuid);}catch(x){}}
    for(const c of goneCorr)  {try{await del('corrections',c.uuid);}catch(x){}}}

  // one audit row for the whole batch — a clean-up should never be invisible
  // The AUDIT_LOG tab writes only the columns it knows by name, so anything not in its
  // header would be silently dropped. Everything that matters therefore goes into `reason`,
  // which IS written verbatim — that way the Sheet keeps the whole story and no Apps Script
  // update is needed to record a clean-up properly.
  const filterTxt='from '+(CLN.from||'any')+' to '+(CLN.to||'any')+
    ' · types '+(CLN.types.length?CLN.types.join(','):'all')+
    ' · by '+(CLN.who||'anyone')+' · device '+(CLN.dev||'any');
  await persistEvent({uuid:uuid(),type:'ADMIN_CLEANUP',dt:now(),
    removed:ex.ids.length, auto_linked:ex.added, was_synced:im.synced,
    detail:summary.join(' · '),
    filter:filterTxt,
    reason:'Selective trial-data clean-up — '+ex.ids.length+' removed'+
      (ex.added?(' ('+ex.added+' auto-linked)'):'')+
      (im.synced?(', '+im.synced+' of them already in the Sheet'):'')+
      ' · '+summary.join(', ')+' · filter: '+filterTxt,
    worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});

  CLN.sel={};
  rebuildLedgers(); rebuildAllTreePickers(); refreshEverything(); badge();
  toast('✓ '+ex.ids.length+' record'+(ex.ids.length===1?'':'s')+' removed');}

function mdbCleanHtml(){
  const rows=cleanupRows(), n=clnSelCount();
  const ex=n?cleanupExpand(Object.keys(CLN.sel)):{ids:[],added:0};
  const im=n?cleanupImpact(ex.ids):null;
  const people=clnPeople(), devs=clnDevices();
  const shownSel=rows.filter(r=>CLN.sel[r.uuid]).length;
  return '<div class="cnote">Filter the log down, tick the rows that were tests, and remove just those. '+
      'Your imported data cannot be reached from here — the <b>959-fruit tying opening balance</b>, the '+
      '<b>171-tree census</b> and the <b>opening stock</b> live in the app\u2019s own data file, not in this '+
      'log, so no tick box can touch them.</div>'+

    '<div class="sec" style="margin-top:12px">1 · Narrow it down</div>'+
    '<div class="dl3">'+
      '<div><label>From date</label><input type="date" id="cln-from" value="'+esc(CLN.from)+
        '" onchange="clnSetFilter(\'from\',this.value)"></div>'+
      '<div><label>To date</label><input type="date" id="cln-to" value="'+esc(CLN.to)+
        '" onchange="clnSetFilter(\'to\',this.value)"></div>'+
    '</div>'+
    '<label>Record type — tap to include, leave all off for everything</label>'+
    '<div class="clnchips">'+CLN_TYPES.map(t=>
      '<div class="'+(CLN.types.indexOf(t.k)>=0?'on':'')+'" onclick="clnToggleType(\''+t.k+'\')">'+
      esc(t.t)+'</div>').join('')+'</div>'+
    '<div class="dl3">'+
      '<div><label>Keyed by</label><select onchange="clnSetFilter(\'who\',this.value)">'+
        '<option value="">anyone</option>'+people.map(p=>'<option value="'+esc(p)+'"'+
          (p===CLN.who?' selected':'')+'>'+esc(p)+'</option>').join('')+'</select></div>'+
      '<div><label>From device</label><select onchange="clnSetFilter(\'dev\',this.value)">'+
        '<option value="">any</option>'+devs.map(d=>'<option value="'+esc(d)+'"'+
          (d===CLN.dev?' selected':'')+'>'+esc(d)+'</option>').join('')+'</select></div>'+
    '</div>'+
    '<div style="display:flex;gap:7px;margin-top:8px">'+
      '<button class="bigbtn ghost" style="padding:10px;font-size:12.5px" onclick="clnResetFilters()">RESET FILTERS</button>'+
      '<button class="bigbtn ghost" style="padding:10px;font-size:12.5px" onclick="clnSelectShown()">TICK ALL '+rows.length+' SHOWN</button>'+
    '</div>'+

    '<div class="sec" style="margin-top:14px">2 · Tick what was a test</div>'+
    '<div class="clnbar"><b>'+rows.length+'</b> row'+(rows.length===1?'':'s')+' shown · <b>'+n+
      '</b> ticked'+(n?(' <span class="linkish" onclick="clnClearSel()">clear</span>'):'')+'</div>'+
    (rows.length?('<div class="tblwrap"><table class="tbl">'+
      rows.slice(0,150).map(r=>'<tr class="'+(CLN.sel[r.uuid]?'picked':'')+'" onclick="clnToggle(\''+
        esc(r.uuid)+'\')"><td style="width:34px" class="num">'+
        '<span class="clnbox'+(CLN.sel[r.uuid]?' on':'')+'">'+(CLN.sel[r.uuid]?'✓':'')+'</span></td>'+
        '<td><div class="pn">'+esc(r.label)+
          (r.backdated?' <span class="cstat a">BACKDATED</span>':'')+'</div>'+
        '<div class="pa">'+esc(r.dt)+' · '+esc(r.who||'?')+' · '+esc(r.dev||'?')+
          (r.synced?' · <b>in the Sheet</b>':' · queued')+'</div></td>'+
        '<td class="num">'+(r.qty?nf(r.qty):'')+'</td></tr>').join('')+'</table></div>'+
      (rows.length>150?('<div class="exphint">Showing the newest 150 of '+rows.length+
        ' — narrow the dates to see the rest.</div>'):''))
      :'<div class="alertnone">No rows match these filters.</div>')+

    (n?('<div class="sec" style="margin-top:14px">3 · What removing them does</div>'+
      (ex.added?('<div class="tarewarn">'+ex.added+' linked row'+(ex.added===1?'':'s')+
        ' will go too — the rope a ticked tying round drew, and any signed correction pointing at a '+
        'ticked row. Leaving those behind would skew the ledger.</div>'):'')+
      '<div class="tblwrap full"><table class="tbl">'+
      '<tr><td><b>Records removed</b></td><td class="num"><b>'+ex.ids.length+'</b></td></tr>'+
      (im.tied?      '<tr><td>Tied balance falls by</td><td class="num">'+nf(im.tied)+' fruit</td></tr>':'')+
      (im.collected? '<tr><td>Collected fruit removed</td><td class="num">'+nf(im.collected)+'</td></tr>':'')+
      (im.rotten?    '<tr><td>Rotten fruit removed</td><td class="num">'+nf(im.rotten)+'</td></tr>':'')+
      (im.stockIn+im.stockOut?'<tr><td>Stock movements reversed</td><td class="num">'+
        (im.stockIn+im.stockOut)+'</td></tr>':'')+
      (im.dispatchKg?'<tr><td>Dispatches removed</td><td class="num">'+nf(im.dispatchKg)+' kg · '+
        rm(im.dispatchRM)+'</td></tr>':'')+
      (im.topupRM?   '<tr><td>Credit top-ups removed</td><td class="num">'+rm(im.topupRM)+'</td></tr>':'')+
      (im.corr?      '<tr><td>Correction requests removed</td><td class="num">'+im.corr+'</td></tr>':'')+
      (im.treeCount? '<tr><td>Trees affected</td><td class="num">'+im.treeCount+'</td></tr>':'')+
      '</table></div>'+
      (im.synced?('<div class="critbox"><b>'+im.synced+'</b> of these already reached the Google Sheet. '+
        'Removing them here cleans this phone only — delete those rows in the Sheet as well, or the next '+
        'person to open it will still see them.</div>'):
        '<div class="okbox">None of these have reached the Google Sheet yet, so removing them here is the '+
        'end of it — nothing to clean up in the Sheet.</div>')+

      '<div class="sec" style="margin-top:13px">4 · Confirm</div>'+
      (CLN.unlocked
        ? ('<div class="ovrok" style="margin-top:0">🔓 Unlocked — you can remove batches until you leave '+
            'this screen.</div>'+
           '<button class="bigbtn danger" onclick="cleanupDelete()">🗑️ REMOVE THE '+ex.ids.length+
            ' TICKED RECORD'+(ex.ids.length===1?'':'S')+'</button>')
        : ('<label>Owner 6-digit access key</label>'+
           '<input id="cln-key" type="password" inputmode="numeric" maxlength="6" autocomplete="off" '+
             'placeholder="••••••" style="letter-spacing:9px;font-size:19px;text-align:center;font-weight:800" '+
             'oninput="if(this.value.length===6)clnUnlock()">'+
           '<div class="pinerr" id="cln-keyerr"></div>'+
           '<button class="bigbtn ghost" onclick="clnUnlock()">🔓 UNLOCK CLEAN-UP</button>'))+
      '<p class="small">Ticked rows are removed outright — no strike-through, no leftover reversal rows. '+
      'One summary line is recorded saying how many went, who removed them and what the filters were, so a '+
      'clean-up is never invisible.</p>')
     :'<div class="small" style="margin-top:12px">Tick at least one row to see what removing it would do.</div>');}

// ---- 5. QR DISTRIBUTION --------------------------------------------------------------
// The URL defaults to wherever this page is being served from, so it is right without
// anybody configuring anything. The encoder is built in — no CDN — because the office
// hotspot may be the only signal on the farm and a QR that fails to draw is useless.
function appUrlDefault(){
  try{
    const l=location;
    if(l.protocol==='file:')return '';
    return l.origin+l.pathname;
  }catch(x){return '';}}
async function persistAppUrl(){ if(db)await put('kv',{k:'appurl',v:APP_URL}); }
async function mdbSaveUrl(){
  if(!canMasterAdmin()){toast('Owner only',1);return;}
  const v=String(($('qr-url')||{}).value||'').trim();
  if(!v){toast('Key the address workers should open',1);return;}
  if(!/^https?:\/\//i.test(v)){toast('The address must start with http:// or https://',1);return;}
  APP_URL=v; await persistAppUrl(); renderMasterDB(); toast('✓ App address saved');}
function mdbQrHtml(){
  const url=APP_URL||appUrlDefault();
  if(!url) return '<div class="critbox">No app address set yet. This page is open from a file, so there '+
    'is nothing to point a QR code at. Key the web address workers should open, then tap SAVE.</div>';
  let svg='';
  try{ svg=QR.svg(url,{scale:7,ec:'M'}); }
  catch(x){ return '<div class="critbox">That address is too long to fit in a QR code ('+
    url.length+' characters). Use a shorter link.</div>'; }
  return '<div class="qrbox">'+svg+'</div>'+
    '<div class="qrurl">'+esc(url)+'</div>';}
async function mdbCopyUrl(){
  const url=APP_URL||appUrlDefault(); if(!url)return;
  const ok=await copyToClipboard(url);
  toast(ok?'📋 Address copied':'Clipboard blocked — read it off the screen',ok?0:1);}
function mdbPrintQr(){
  const url=APP_URL||appUrlDefault(); if(!url)return;
  let svg=''; try{ svg=QR.svg(url,{scale:12,ec:'M'}); }catch(x){toast('Address too long',1);return;}
  const w=window.open('','_blank');
  if(!w){toast('Your browser blocked the print window',1);return;}
  w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Sugut DMS — scan to install</title>'+
    '<style>body{font-family:system-ui,sans-serif;text-align:center;padding:26px;color:#1b4620}'+
    'h1{font-size:20px;margin:0 0 2px}p{font-size:13px;color:#5b6b58;margin:2px 0 16px}'+
    'code{font-size:12px;word-break:break-all;color:#22331f}svg{max-width:82vw;height:auto}</style></head><body>'+
    '<h1>Sugut Durian Farm — DMS</h1><p>Scan with the phone camera to open the app, then '+
    'choose <b>Add to Home screen</b></p>'+svg+'<p><code>'+esc(url)+'</code></p></body></html>');
  w.document.close();}

// ---- THE PANEL -----------------------------------------------------------------------
// SECURITY: for any role other than OWNER this writes an EMPTY STRING. No table, no form,
// no button, no onclick handler for the CRUD, the purge, the tree form or the QR ever
// enters the DOM. Every mutating function above independently re-checks canMasterAdmin(),
// so reaching one from the console achieves nothing either.
const MDB_SECTIONS=[['data','🗂️ DATA'],['back','🕓 BACKDATE'],['trees','🌳 TREES'],
                    ['purge','🗳️ CLEAN UP'],['qr','📱 QR']];
function renderMasterDB(){
  const box=$('masterdbbox'); if(!box)return;
  if(!canMasterAdmin()){ box.innerHTML=''; return; }        // stripped from the DOM entirely
  box.innerHTML=
    '<div class="mdbnav">'+MDB_SECTIONS.map(([k,t])=>
      '<div class="'+(k===MDB_SEC?'on':'')+'" onclick="mdbSec(\''+k+'\')">'+t+'</div>').join('')+'</div>'+
    (MDB_SEC==='data' ? mdbDataHtml()
    :MDB_SEC==='back' ? mdbBackHtml()
    :MDB_SEC==='trees'? mdbTreesHtml()
    :MDB_SEC==='purge'? mdbCleanHtml()
    :                   mdbQrSectionHtml());
  if(MDB_SEC==='back'){ mdbBackLots('bk-tie-lot','bk-tie-tree');
                        mdbBackLots('bk-dr-lot','bk-dr-tree');
                        mdbBackLots('bk-rt-lot','bk-rt-tree'); }}

function mdbDataHtml(){
  const def=MDB_LOGS[MDB_LOG], rows=mdbRows(MDB_LOG);
  return '<div class="cnote">Full read / edit / delete across every local log. An edit or a delete '+
      'writes a <b>signed reversal</b> that syncs to the Google Sheet and to every phone, so the row '+
      'stops counting everywhere at once and no two devices are ever left disagreeing.</div>'+
    '<div class="mdbtabs">'+Object.keys(MDB_LOGS).map(k=>
      '<div class="'+(k===MDB_LOG?'on':'')+'" onclick="mdbPickLog(\''+k+'\')">'+
      MDB_LOGS[k].ic+' '+MDB_LOGS[k].t+'</div>').join('')+'</div>'+
    '<div class="exphint" style="margin:7px 0">'+rows.length+' row'+(rows.length===1?'':'s')+
      ' · newest first · showing up to 80</div>'+
    (rows.length?('<div class="tblwrap"><table class="tbl mdbt">'+
      '<tr><th>Row</th><th class="num">Qty</th><th class="num">Actions</th></tr>'+
      rows.slice(0,80).map(e=>{
        const voided=rowIsVoided(e), edited=rowWasEdited(e), live=rowLiveQty(e);
        if(MDB_EDIT===e.uuid){
          return '<tr class="edit"><td colspan="3">'+
            '<div class="pn">'+esc(mdbRowLabel(e))+'</div>'+
            '<div class="pa">'+esc(e.dt)+' · '+esc(e.worker||'?')+'</div>'+
            '<div class="dl3" style="margin-top:8px">'+
              '<div><label>Correct quantity ('+esc(def.unit||e.unit||'')+')</label>'+
                '<input type="number" min="0" step="any" inputmode="decimal" id="mdb-q-'+esc(e.uuid)+
                '" value="'+live+'"></div>'+
              '<div><label>Reason</label><input id="mdb-r-'+esc(e.uuid)+
                '" placeholder="e.g. miscounted"></div>'+
            '</div>'+
            '<div style="display:flex;gap:7px;margin-top:8px">'+
              '<button class="bigbtn" style="padding:11px;font-size:13px" onclick="mdbSaveEdit(\''+esc(e.uuid)+
                '\')">✓ SAVE CORRECTION</button>'+
              '<button class="bigbtn ghost" style="padding:11px;font-size:13px" onclick="mdbCancelEdit()">CANCEL</button>'+
            '</div></td></tr>';}
        return '<tr'+(voided?' class="void"':'')+'><td>'+
          '<div class="pn">'+esc(mdbRowLabel(e))+
            (voided?' <span class="cstat r">DELETED</span>':'')+
            (!voided&&edited?' <span class="cstat p">EDITED</span>':'')+
            (e.backdated?' <span class="cstat a">BACKDATED</span>':'')+'</div>'+
          '<div class="pa">'+esc(e.dt)+' · '+esc(e.worker||'?')+(e.synced?'':' · queued')+
            (e.backdated&&e.enteredAt?(' · keyed '+esc(e.enteredAt)):'')+'</div></td>'+
          '<td class="num"><b>'+nf(live)+'</b>'+
            (live!==logQtyOf(e)?('<div class="exphint">was '+nf(logQtyOf(e))+'</div>'):'')+'</td>'+
          '<td class="num nowrap">'+
            (voided?'<span class="exphint">voided</span>'
              :('<span class="mdbbtn" onclick="mdbEditRow(\''+esc(e.uuid)+'\')">✏️ Edit</span>'+
                '<span class="mdbbtn del" onclick="mdbDeleteRow(\''+esc(e.uuid)+'\')">🗑️ Delete</span>'))+
          '</td></tr>';}).join('')+'</table></div>')
      :'<div class="alertnone">No rows in this log yet.</div>')+
    '<p class="small">A deleted row stays visible here, struck through and marked DELETED, and counts as '+
    'zero in every total. That is what lets you prove later what was removed and why.</p>';}

function mdbBackHtml(){
  const today=todayStr();
  return '<div class="cnote">For work finished <b>before</b> the app was in use. The row carries the date '+
      'the work actually happened, plus the moment you keyed it, so a late entry can never be mistaken '+
      'for one logged live in the field.</div>'+

    '<div class="sec" style="margin-top:13px">🎗️ Backdate a tying round</div>'+
    '<div class="dl3">'+
      '<div><label>Lot</label><select id="bk-tie-lot" onchange="mdbBackTrees(\'bk-tie-lot\',\'bk-tie-tree\')"></select></div>'+
      '<div><label>Fruits tied</label><input type="number" min="1" step="1" inputmode="numeric" id="bk-tie-n" placeholder="0"></div>'+
    '</div>'+
    '<label>Tree</label><select id="bk-tie-tree"></select>'+
    '<label>Date &amp; time the tying was done</label>'+
    '<input type="datetime-local" id="bk-tie-dt" value="'+esc(today)+'T08:00" max="'+esc(today)+'T23:59">'+
    '<label>Note (optional)</label><input id="bk-tie-note" placeholder="e.g. from the 21 July field book">'+
    '<div class="pinerr" id="bk-tie-err"></div>'+
    '<button class="bigbtn tie" onclick="mdbBackTie()">🕓 LOG THIS HISTORICAL TYING ROUND</button>'+
    '<p class="small">Rope is deducted at '+nf(ROPE_M_PER_FRUIT)+' m a fruit and dated to the same day, '+
      'so the store balance follows the history instead of jumping today.</p>'+

    '<div class="sec" style="margin-top:17px">🥭 Backdate a collection</div>'+
    '<div class="dl3">'+
      '<div><label>Lot</label><select id="bk-dr-lot" onchange="mdbBackTrees(\'bk-dr-lot\',\'bk-dr-tree\')"></select></div>'+
      '<div><label>Fruits collected</label><input type="number" min="1" step="1" inputmode="numeric" id="bk-dr-n" placeholder="0"></div>'+
    '</div>'+
    '<label>Tree</label><select id="bk-dr-tree"></select>'+
    '<div class="dl3">'+
      '<div><label>Grade</label><select id="bk-dr-grade">'+
        GRADE_ORDER.map(g=>'<option value="'+g+'">Grade '+g+'</option>').join('')+'</select></div>'+
      '<div><label>Was it tied?</label><select id="bk-dr-kind">'+
        '<option value="SECURED">🪢 Secured — string still on</option>'+
        '<option value="UNSECURED">🍃 Unsecured — early drop</option></select></div>'+
    '</div>'+
    '<label>Date &amp; time of the collection</label>'+
    '<input type="datetime-local" id="bk-dr-dt" value="'+esc(today)+'T07:00" max="'+esc(today)+'T23:59">'+
    '<div class="pinerr" id="bk-dr-err"></div>'+
    '<button class="bigbtn" onclick="mdbBackDrop()">🕓 LOG THIS HISTORICAL COLLECTION</button>'+

    '<div class="sec" style="margin-top:17px">🍂 Backdate a fruit loss</div>'+
    '<div class="dl3">'+
      '<div><label>Lot</label><select id="bk-rt-lot" onchange="mdbBackTrees(\'bk-rt-lot\',\'bk-rt-tree\')"></select></div>'+
      '<div><label>Fruits lost</label><input type="number" min="1" step="1" inputmode="numeric" id="bk-rt-n" placeholder="0"></div>'+
    '</div>'+
    '<label>Tree</label><select id="bk-rt-tree"></select>'+
    '<label>Loss cause</label><select id="bk-rt-cause">'+
      ROT_ORDER.map(c=>'<option value="'+esc(c)+'">'+ROT_CAUSE[c].ic+' '+
        esc(causeLabel(c))+' — '+esc(causeNote(c))+'</option>').join('')+'</select>'+
    '<label>Was the fruit tied?</label><select id="bk-rt-tied">'+
      '<option value="TIED">🪢 Was tied — comes off the tied balance</option>'+
      '<option value="UNTIED">🍃 Untied — an early loss, never on a string</option></select>'+
    '<label>Date &amp; time the rotten fruit was found</label>'+
    '<input type="datetime-local" id="bk-rt-dt" value="'+esc(today)+'T07:00" max="'+esc(today)+'T23:59">'+
    '<div class="pinerr" id="bk-rt-err"></div>'+
    '<button class="bigbtn rot" onclick="mdbBackRotten()">🕓 LOG THIS HISTORICAL ROTTEN LOSS</button>'+
    '<p class="small">A tied rotten fruit comes off that tree\u2019s tied balance; an untied one never was on '+
      'a string, so it only reduces the hanging estimate. The check against the tied balance is made '+
      'against the balance as it stood <b>on that date</b>, not today\u2019s.</p>';}

function mdbTreesHtml(){
  const byLot={};LOTS.forEach(l=>byLot[l]=treesInLot(l).length);
  return '<div class="cnote">A tree added here goes straight into the same census array every screen '+
      'reads, so it is pickable on the worker collection and tying dropdowns the moment you save it.</div>'+
    '<div class="ygrid" style="margin-top:10px">'+LOTS.map(l=>
      '<div><div class="l">LOT '+l+'</div><div class="v">'+byLot[l]+'</div><div class="u">trees</div></div>').join('')+
    '</div>'+
    '<div class="exphint" style="margin:8px 0 0">Census total: <b>'+TREE_MASTER.length+' trees</b>'+
      (ADDED_TREES.length?(' · '+ADDED_TREES.length+' added by you'):'')+'</div>'+
    // v3.11 — the census used to grow on this phone alone. A worker standing at C-072 could
    // not log it because their dropdown had never heard of it. The share stamp is how the
    // Owner knows the tree actually reached the shed.
    shareBox(['addtrees'])+

    '<div class="sec" style="margin-top:14px">➕ Add a tree</div>'+
    '<div class="dl3">'+
      '<div><label>Lot</label><select id="at-lot">'+
        LOTS.map(l=>'<option value="'+l+'"'+(l===MDB_NEXT_LOT?' selected':'')+'>Lot '+l+'</option>').join('')+
        '</select></div>'+
      '<div><label>Tree number</label><input type="number" min="1" max="999" step="1" inputmode="numeric" '+
        'id="at-no" placeholder="e.g. 67" value="'+esc(MDB_NEXT_NO)+'"></div>'+
    '</div>'+
    '<label>Clone</label><select id="at-clone">'+
      CLONE_SELL_ORDER.map(c=>'<option value="'+esc(c)+'">'+esc(CLONE_NAME[c]||c)+' ('+esc(c)+')</option>').join('')+
      '<option value="">Not recorded yet</option></select>'+
    '<div class="pinerr" id="at-err"></div>'+
    '<button class="bigbtn" onclick="mdbAddTree()">🌳 ADD TREE TO CENSUS</button>'+
    '<p class="small">The tree number box steps up by one after each save, so keying a run of 20 new '+
      'planting spots is twenty taps, not twenty forms.</p>'+

    (ADDED_TREES.length?('<div class="sec" style="margin-top:16px">Trees you have added</div>'+
      '<div class="tblwrap full"><table class="tbl">'+
      '<tr><th>Tree</th><th>Clone</th><th class="num"></th></tr>'+
      ADDED_TREES.slice().sort((a,b)=>a.id<b.id?-1:1).map(t=>{
        const used=treeHasHistory(t.id);
        return '<tr><td><div class="pn">'+esc(t.id)+'</div><div class="pa">added '+esc(t.addedAt||'')+
          ' by '+esc(t.addedBy||'')+'</div></td>'+
          '<td>'+esc(CLONE_NAME[t.clone]||t.clone||'—')+'</td>'+
          '<td class="num">'+(used
            ?'<span class="exphint">has work logged</span>'
            :'<span class="mdbbtn del" onclick="mdbRemoveTree(\''+esc(t.id)+'\')">remove</span>')+
          '</td></tr>';}).join('')+'</table></div>'+
      '<p class="small">A tree can only be removed while it has no logged work. Once a fruit has been '+
        'tied or collected on it, it stays — removing it would orphan that history.</p>')
     :'');}

function mdbQrSectionHtml(){
  const url=APP_URL||appUrlDefault();
  return '<div class="cnote">Point a new worker’s camera at this code to open the app, then have them '+
      'choose <b>Add to Home screen</b>. The code is drawn on the phone itself — no internet needed to '+
      'produce it, so it still works at the office hotspot with the signal down.</div>'+
    '<label style="margin-top:11px">App address workers should open</label>'+
    '<input id="qr-url" value="'+esc(url)+'" placeholder="https://…" autocomplete="off">'+
    '<div style="display:flex;gap:7px;margin-top:8px">'+
      '<button class="bigbtn" style="padding:11px;font-size:13px" onclick="mdbSaveUrl()">✓ SAVE</button>'+
      '<button class="bigbtn ghost" style="padding:11px;font-size:13px" onclick="mdbCopyUrl()">📋 COPY</button>'+
    '</div>'+
    mdbQrHtml()+
    (url?'<button class="bigbtn ghost" onclick="mdbPrintQr()">🖨️ OPEN A BIG VERSION TO PRINT OR SHOW</button>':'')+
    '<p class="small">The address defaults to wherever this page is being served from, so it is usually '+
      'already correct. Change it only if the workers should open a different link.</p>';}

/* ======================================================================================
   v3.12.0 · THE SEASONAL AGRONOMY MATRIX AND ITS CLOSED LOOP
   ======================================================================================
   Three people, three phones, one job, and until now three pieces of paper between them.

       OWNER      prescribes an ACTIVE INGREDIENT and a concentration per 1,000 L tank.
                  He never names a brand — brands change with what Sandakan can get.
       PURCHASER  reads the prescription, picks the brand in the store that carries that
                  ingredient, and LOCKS its moving average cost onto the task card.
       WORKER     reads the brand, the method target and the dilution, mixes N tanks, and
                  logs what was actually mixed.

   That last action is the one that closes the loop: it deducts the stock, prices it at
   the cost the Purchaser locked, and posts the RM to the lot's ledger, from which the
   daily, monthly and yearly costing summaries are derived. Nobody re-keys anything.

   THE ANCHOR, restated where the arithmetic lives: a spray dose is per TANK_L = 1,000 L.
       deduct = dose x tanks_mixed          (tanks may be fractional: 3.5 is legal)
       cost   = deduct x locked_MAC
   Manuring is the one exception and carries basis 'PER_TREE' explicitly:
       deduct = dose x trees_treated
   ====================================================================================== */

/* ---- new products onboarded by the Purchaser ---------------------------------------
   These are folded into the SAME array every dropdown, every ledger and every valuation
   already reads — exactly the pattern applyAddedTrees() uses for the census. It has to be
   re-applied on every boot and after every pull, because INVENTORY_RECON ships inside
   database.js and is replaced wholesale whenever the app is upgraded.

   The id has to be a number, because prodById() compares numerically and every event ever
   written stores a numeric pid. It is derived from the record's own uuid so that all four
   phones independently compute the SAME id for the same product without talking to each
   other. A collision is resolved by walking up, deterministically, in nid order — so every
   phone resolves it the same way too. */
function newProdId(nid){
  const h=String(nid).replace(/-/g,'').slice(0,6);
  const n=parseInt(h,16); return 10000000+(isNaN(n)?0:n);}
function applyNewProducts(){
  let n=0;
  NEW_PRODS.slice().sort((a,b)=>String(a.nid)<String(b.nid)?-1:1).forEach(np=>{
    if(!np||!np.nid)return;
    if(INVENTORY_RECON.some(p=>p.nid===np.nid))return;      // already folded in
    let id=newProdId(np.nid);
    while(INVENTORY_RECON.some(p=>p.id===id))id++;          // deterministic collision walk
    INVENTORY_RECON.push({
      id:id, nid:np.nid, name:np.name,
      active_ingredient:np.ai||'(confirm — see label)',
      cat:np.cat||'Foliar', container:np.container||'unit', unit:np.unit||'ml',
      unit_multiplier:+np.mult||1, unit_price:+np.price||0,
      cpu:(+np.mult>0?+((+np.price||0)/(+np.mult)).toFixed(6):0),
      min_stock_threshold:+np.min||0,
      // A newly onboarded item opens at ZERO. Stock arrives through the Stock In log with
      // an invoice against it, like every other receipt. Seeding an opening quantity here
      // would put material into the valuation that no invoice ever paid for.
      stock:0, onboarded:true, by:np.by||'', at:np.at||''});
    n++;});
  return n;}

/* ---- the current moving average, for locking onto an allocation ---------------------
   Same walk as movingAvgCost(), but it returns the CLOSING position rather than the cost
   of each issue, because what the Purchaser locks is today's average, not yesterday's. */
function macPositions(){
  const pos={};
  INVENTORY_RECON.forEach(p=>{pos[p.id]={q:+p.stock||0,v:(+p.stock||0)*(+p.cpu||0)};});
  EVENTS.filter(e=>e.type==='STOCK_IN'||e.type==='STOCK_OUT'||e.type==='STOCK_ADJUST')
    .slice().sort((a,b)=>String(a.dt).localeCompare(String(b.dt)))
    .forEach(e=>{
      const pid=e.pid; if(!pid)return;
      if(!pos[pid])pos[pid]={q:0,v:0};
      const P=pos[pid], avg=P.q>0?(P.v/P.q):((prodById(pid)||{}).cpu||0);
      if(e.type==='STOCK_IN'){const q=+e.qty||0;P.q+=q;P.v+=(e.cost!=null?+e.cost:q*avg);}
      else if(e.type==='STOCK_OUT'){const q=+e.qty||0,v=q*avg;
        P.q=+(P.q-q).toFixed(4);P.v=+(P.v-v).toFixed(4);
        if(P.q<=0){P.q=Math.max(0,P.q);P.v=Math.max(0,P.v);}}
      else {const d=+e.delta||0;P.q+=d;P.v+=(e.cost!=null?+e.cost:d*avg);}});
  return pos;}
function currentMAC(pid){
  const p=prodById(pid); if(!p)return 0;
  const P=macPositions()[pid];
  if(P&&P.q>0)return +(P.v/P.q).toFixed(6);
  return +(p.cpu||0);}

/* ---- persistence: all three ride the shared-settings channel ----------------------- */
async function persistDrafts(){
  if(db)await put('kv',{k:'agrodrafts',v:AGRO_DRAFTS});
  await markSetting('agrodrafts');}
async function persistAlloc(){
  if(db)await put('kv',{k:'aialloc',v:AI_ALLOC});
  await markSetting('aialloc');}
async function persistNewProds(){
  if(db)await put('kv',{k:'newprods',v:NEW_PRODS});
  await markSetting('newprods');}

/* ---- the three-state weather ------------------------------------------------------
   WX3 is what the Owner sets. WEATHER stays exactly what it was — a two-state flag the
   whole v2.6 rain-fastness engine already understands — and is DERIVED from WX3. Nothing
   downstream had to learn a third state. */
function wx3Rec(k){return WX3_MODES.find(w=>w.k===(k||WX3))||WX3_MODES[0];}
async function setWx3(k){
  if(!WX3_MODES.some(w=>w.k===k))return;
  WX3=k; if(db)await put('kv',{k:'wx3',v:WX3});
  await setWeather(wx3Rec(k).wx);                 // keeps the existing engine in step
  renderAgroMatrix();renderOpsTasks();}

/* ---- the draft model --------------------------------------------------------------- */
function draftById(u){return AGRO_DRAFTS.find(d=>d.uuid===u)||null;}
function draftMethodList(prog){return prog==='MANURE'?MANURE_METHODS:SPRAY_METHODS;}
/* v3.12 FIX (found on a screenshot, not by a test) — a directive stores the English
   label it was issued with. Reading that label back onto a Malay phone produced a card
   that was half Malay and half English. Every one of these reads the KEY and translates
   it now, so the crew's card is in their language whoever issued it. */
function stageLabelT(k){return tr('sg_'+k,(SEASON_STAGES.find(s=>s.k===k)||{}).t||k);}
function wxLabelT(k){return tr('wx3_'+k,(WX3_MODES.find(w=>w.k===k)||{}).t||k);}
function methodLabelT(prog,k){return tr('mt_'+k,(methodRec(prog,k)||{}).t||k);}
function methodDescT(prog,k){return tr('mt_'+k+'_d',(methodRec(prog,k)||{}).d||'');}
function slotLabelT(k){return tr('sl_'+k,(slotRec(k)||{}).t||k);}
function methodRec(prog,k){return draftMethodList(prog).find(m=>m.k===k)||draftMethodList(prog)[0];}
function stageRec(k){return SEASON_STAGES.find(s=>s.k===k)||SEASON_STAGES[0];}
function slotRec(k){return COMBO_SLOTS.find(s=>s.k===k)||null;}
/** Only the slots the Owner actually filled. An empty slot is not a line. */
function draftLines(d){
  if(!d||!d.slots)return [];
  return COMBO_SLOTS.map(s=>d.slots[s.k]).filter(x=>x&&x.ai&&+x.dose>0);}
function allocKey(u,slotK){return u+'|'+slotK;}
/* v3.12 FIX — a brand can be allocated while the store holds none of it (the Purchaser
   may be about to order it). That is allowed, but it must never be silent: the crew
   would otherwise be sent out for a product that is not on the shelf. */
function allocShort(u,slotK){
  const a=AI_ALLOC[allocKey(u,slotK)]; if(!a)return false;
  const p=prodById(a.pid); if(!p)return false;
  return onHand(p) < (+a.dose||0);}
function allocOf(u,slotK){return AI_ALLOC[allocKey(u,slotK)]||null;}
/** A directive is runnable only when EVERY filled slot has a brand behind it. Half an
 *  allocation is worse than none: it would deduct four of five products and quietly
 *  under-cost the job. */
function draftReady(d){
  const ls=draftLines(d);
  return ls.length>0&&ls.every(l=>{const a=allocOf(d.uuid,l.slot);return a&&a.pid;});}
function draftAllocCount(d){
  const ls=draftLines(d);
  return {n:ls.filter(l=>{const a=allocOf(d.uuid,l.slot);return a&&a.pid;}).length,of:ls.length};}
function issuedDrafts(){return AGRO_DRAFTS.filter(d=>d.status==='ISSUED');}
/** Slots waiting on the Purchaser, farm-wide — this is the number on the tile. */
function unallocatedSlots(){
  let n=0; issuedDrafts().forEach(d=>{const c=draftAllocCount(d);n+=(c.of-c.n);});
  return n;}
/** The active ingredients a slot may offer, ranked so unconfirmed chemistry sorts last.
 *  The app never invents an active ingredient it does not hold. */
function slotAIs(slotK){
  const s=slotRec(slotK); if(!s)return [];
  const seen={},out=[];
  INVENTORY_RECON.forEach(p=>{
    if(s.cats.indexOf(p.cat)<0)return;
    const ai=String(p.active_ingredient||'').trim()||'(not recorded)';
    if(!seen[ai]){seen[ai]={ai:ai,n:0,units:{}};out.push(seen[ai]);}
    seen[ai].n++; seen[ai].units[p.unit]=(seen[ai].units[p.unit]||0)+1;});
  const unk=x=>(x.ai.indexOf('(confirm')===0||x.ai==='(not recorded)')?1:0;
  return out.sort((a,b)=>(unk(a)-unk(b))||a.ai.localeCompare(b.ai));}
/** Brands in the store carrying one ingredient, IN THE PRESCRIBED UNIT. The unit filter
 *  is deliberate: 500 ml of a product sold in grams is not a conversion this app is
 *  entitled to guess. Anything in a different unit is listed separately and refused. */
function brandsFor(slotK,ai,unit){
  const s=slotRec(slotK); if(!s)return {match:[],other:[]};
  const all=INVENTORY_RECON.filter(p=>s.cats.indexOf(p.cat)>=0&&
    String(p.active_ingredient||'').trim()===String(ai||'').trim());
  return {match:all.filter(p=>p.unit===unit).sort((a,b)=>onHand(b)-onHand(a)),
          other:all.filter(p=>p.unit!==unit)};}

/* ======================= OWNER · the five-slot seasonal builder ======================= */
let AM={uuid:'',program:'SPRAY',method:'WHOLE',stage:'FSET',wx:'DRY',scope:'ALL',name:'',slots:{},tmpl:'',due:''};
function amBasis(){return AM.program==='MANURE'?'PER_TREE':'PER_1000L';}
function amUnitLabel(){return amBasis()==='PER_1000L'?('per '+nf(TANK_L)+' L tank'):'per tree';}
function amReset(){
  AM={uuid:'',program:'SPRAY',method:'WHOLE',stage:'FSET',wx:WX3,scope:'ALL',name:'',slots:{},
      tmpl:'',due:suggestDue()};
  if($('am-name'))$('am-name').value='';
  if($('am-due'))$('am-due').value=AM.due;
  renderAgroMatrix();}
function amSetProgram(k){
  if(AM.program===k)return;
  AM.program=k;
  AM.method=draftMethodList(k)[0].k;
  // Manuring is broadcast: a pesticide or fungicide slot has no meaning in a dry
  // broadcast, so those two are dropped rather than silently carried over.
  if(k==='MANURE'){delete AM.slots.PEST;delete AM.slots.FUNG;}
  renderAgroMatrix();}
function amSetField(f,v){AM[f]=v;renderAgroMatrix();}
function amScope(s){AM.scope=s;renderAgroMatrix();}
function amSlotAI(k){
  const v=$('ams-ai-'+k).value;
  if(!v){delete AM.slots[k];renderAgroMatrix();return;}
  const cur=AM.slots[k]||{};
  const info=slotAIs(k).find(a=>a.ai===v);
  const units=info?Object.keys(info.units).sort((a,b)=>info.units[b]-info.units[a]):['ml'];
  AM.slots[k]={slot:k,ai:v,unit:(cur.ai===v&&cur.unit)?cur.unit:units[0],dose:+cur.dose||0};
  renderAgroMatrix();}
function amSlotUnit(k){const s=AM.slots[k];if(!s)return;s.unit=$('ams-unit-'+k).value;renderAgroMatrix();}
function amSlotDose(k){const s=AM.slots[k];if(!s)return;s.dose=+$('ams-dose-'+k).value||0;
  $('am-count').textContent=String(COMBO_SLOTS.map(x=>AM.slots[x.k]).filter(x=>x&&x.ai&&+x.dose>0).length);}
function amSlotsHTML(){
  const slots=COMBO_SLOTS.filter(s=>!(AM.program==='MANURE'&&(s.k==='PEST'||s.k==='FUNG')));
  return slots.map(s=>{
    const cur=AM.slots[s.k]||{};
    const ais=slotAIs(s.k);
    const info=ais.find(a=>a.ai===cur.ai);
    const units=info?Object.keys(info.units).sort((a,b)=>info.units[b]-info.units[a]):[];
    const cls=cur.ai?rainClass(cur.ai):null;
    // v3.13 — the per-slot description was sub-text on a control that is already
    // labelled. Deleted, along with every other caption on this screen.
    return '<div class="slotbox'+(cur.ai&&+cur.dose>0?' filled':'')+'">'+
      '<div class="slothead"><span>'+s.ic+' <b>'+esc(slotLabelT(s.k))+'</b></span></div>'+
      '<select id="ams-ai-'+s.k+'" onchange="amSlotAI(\''+s.k+'\')">'+
        '<option value="">— not used in this combo —</option>'+
        ais.map(a=>'<option value="'+esc(a.ai)+'"'+(a.ai===cur.ai?' selected':'')+'>'+
          esc(a.ai)+' ('+a.n+' brand'+(a.n>1?'s':'')+' in store)</option>').join('')+
      '</select>'+
      (cur.ai
        // the tag stays (one word, it earns its place); the sentence explaining it does not
        ?('<div class="small" style="margin-top:5px">'+aiTagHTML(cls)+
            (WX3!=='DRY'&&cls.k==='CONTACT'?'<b style="color:#b3261e">RAIN FORECAST</b>':'')+'</div>'+
          '<div class="slotrow">'+
            // "Concentration" wrapped the 1,000 L minitag onto a second line. "Dose" is the
            // word the programme sheet itself uses and it keeps the anchor on one line.
            '<div><label>'+esc(tr('ag_doselbl'))+' <span class="minitag">'+esc(amUnitLabel())+'</span></label>'+
              '<input type="number" id="ams-dose-'+s.k+'" min="0" step="any" inputmode="decimal" '+
                'value="'+(cur.dose||'')+'" oninput="amSlotDose(\''+s.k+'\')"></div>'+
            '<div><label>'+esc(tr('ag_unitlbl'))+'</label><select id="ams-unit-'+s.k+'" onchange="amSlotUnit(\''+s.k+'\')">'+
              units.map(u=>'<option'+(u===cur.unit?' selected':'')+'>'+esc(u)+'</option>').join('')+
            '</select></div>'+
          '</div>')
        :'')+
      '</div>';}).join('');}
function amTemplatesHTML(){
  // v3.13 — the chip strip became a grid of large toggle buttons. The one the Owner
  // loaded stays lit in solid navy, so the screen answers "which template is this?"
  // without a caption underneath it saying so.
  const meth=methodRec(AM.program,AM.method);
  const today=todayStr();
  const dist=ph=>{const d=String(ph.plan||''); if(!d)return 9e9;
    return Math.abs(new Date(d)-new Date(today))/86400000;};
  const hits=allPhases().filter(ph=>{
    if(AM.program==='MANURE')return ph.mode==='SOIL';
    if(WX3==='HEAVY')return ph.mode==='DRENCH'||ph.mode==='SOIL';
    return ph.mode===meth.mode||ph.mode==='SPRAY'||ph.mode==='LEAF';})
    .sort((a,b)=>dist(a)-dist(b)).slice(0,6);
  if(!hits.length)return '';
  return '<div class="tgrid">'+hits.map(ph=>
    '<div class="tbtn'+(AM.tmpl===ph.id?' on':'')+'" onclick="amLoadTemplate(\''+esc(ph.id)+'\')">'+
      '<span class="tm">'+esc(monthLabel(ph.month))+'</span>'+
      '<span class="ts2">'+esc(ph.set)+'</span></div>').join('')+'</div>';}
function amLoadTemplate(id){
  const ph=allPhases().find(p=>p.id===id); if(!ph)return;
  AM.slots={};
  (ph.lines||[]).forEach(l=>{
    const p=prodById(l.pid); if(!p)return;
    const ai=aiFor(l.pid,l.ai).replace(' (per programme sheet)','');
    // place the line in the first slot whose categories accept this product
    const s=COMBO_SLOTS.find(x=>x.cats.indexOf(p.cat)>=0&&!AM.slots[x.k]);
    if(!s)return;
    AM.slots[s.k]={slot:s.k,ai:ai,unit:l.unit||p.unit,dose:+l.qty||0};});
  AM.tmpl=id;
  // the sheet's own plan date for this set is the best suggestion there is
  if(ph.plan){AM.due=String(ph.plan).slice(0,10); if($('am-due'))$('am-due').value=AM.due;}
  if(!AM.name)AM.name=monthLabel(ph.month)+' · '+ph.set;
  if($('am-name'))$('am-name').value=AM.name;
  renderAgroMatrix();}
function renderAgroMatrix(){
  const box=$('am-slots'); if(!box)return;
  if(!roleAllows('agromatrix')){box.innerHTML='';$('am-list').innerHTML='';return;}
  // program segments
  AGRO_PROGRAMS.forEach(p=>{const el=$('amp-'+p.k);if(el)el.classList.toggle('on',AM.program===p.k);});
  // method options follow the program
  const ms=draftMethodList(AM.program);
  if(!ms.some(m=>m.k===AM.method))AM.method=ms[0].k;
  $('am-method').innerHTML=ms.map(m=>'<option value="'+m.k+'"'+(m.k===AM.method?' selected':'')+'>'+esc(m.t)+'</option>').join('');
  $('am-stage').innerHTML=SEASON_STAGES.map(s=>'<option value="'+s.k+'"'+(s.k===AM.stage?' selected':'')+'>'+s.ic+' '+esc(s.t)+'</option>').join('');
  $('am-wx').innerHTML=WX3_MODES.map(w=>'<option value="'+w.k+'"'+(w.k===WX3?' selected':'')+'>'+w.ic+' '+esc(w.t)+'</option>').join('');
  LOT_KEYS.concat(['ALL']).forEach(L=>{const el=$('amL-'+L);if(el)el.classList.toggle('on',AM.scope===L);});
  // v3.13 — the stage-advice paragraph and the blue 1,000 L banner are gone. STAGE_ADVICE
  // is still in database.js, unrendered, so it costs nothing to put back if it is wanted.
  $('am-tmpl').innerHTML=amTemplatesHTML();
  if($('am-due')&&!$('am-due').value){AM.due=AM.due||suggestDue();$('am-due').value=AM.due;}
  box.innerHTML=amSlotsHTML();
  $('am-count').textContent=String(draftLines({slots:AM.slots}).length);
  $('am-savelbl').textContent=AM.uuid?tr('ag_savechanges'):tr('ag_savecombo');
  renderDraftList();}
function amValidate(){
  const err=$('am-err'); err.textContent='';
  const name=($('am-name')?$('am-name').value:'').trim();
  if(!name){err.textContent='Give the combo a name the crew will recognise.';return null;}
  const lines=COMBO_SLOTS.map(s=>AM.slots[s.k]).filter(x=>x&&x.ai&&+x.dose>0);
  // the HALF-FILLED slot is checked FIRST. An ingredient chosen with no dose keyed is a
  // more specific mistake than an empty form, and telling that person "fill at least one
  // slot" when they have just filled one is the kind of message that gets an app blamed.
  const bad=COMBO_SLOTS.map(s=>AM.slots[s.k]).find(x=>x&&x.ai&&!(+x.dose>0));
  if(bad){err.textContent='"'+bad.ai+'" has no concentration. Key it, or set that slot back to "not used".';return null;}
  /* v3.12 FIX (screenshot) — several ingredients appear under more than one slot's
     categories, so it is easy to pick the SAME one into Foliar, Biostimulant and TE
     without noticing. Every slot deducts separately, so that combo would put three
     doses of one product into a single tank. Refused, and named. */
  const seenAI={};
  for(const l of lines){
    const key=String(l.ai).toLowerCase();
    if(seenAI[key]){
      err.textContent='"'+l.ai+'" is in two slots ('+slotLabelT(seenAI[key])+' and '+
        slotLabelT(l.slot)+'). That would put a double dose of the same product in one tank. '+
        'Add the doses together into one slot, or choose a different ingredient.';
      return null;}
    seenAI[key]=l.slot;}
  if(!lines.length){err.textContent='Fill at least one of the five component slots.';return null;}
  const due=($('am-due')?$('am-due').value:'')||AM.due;
  if(!due){err.textContent=tr('dt_needdue');return null;}
  AM.due=due; AM.name=name;
  return lines;}
async function amSave(issue){
  const lines=amValidate(); if(!lines)return;
  const old=AM.uuid?draftById(AM.uuid):null;
  if(old&&old.status==='ISSUED'&&!issue&&
     !confirm('This directive is already out with the crew.\nSaving will update what they see. Continue?'))return;
  const meth=methodRec(AM.program,AM.method);
  const rec={
    uuid:old?old.uuid:uuid(),
    code:old?old.code:('DIR-'+String(AGRO_DRAFTS.length+1).padStart(3,'0')),
    name:AM.name, program:AM.program, method:AM.method, methodLabel:meth.t,
    mode:meth.mode,                       // maps onto the existing v2.6 mode vocabulary
    stage:AM.stage, stageLabel:stageRec(AM.stage).t,
    wx:WX3, wxLabel:wx3Rec().t,
    basis:amBasis(), tankL:TANK_L, scope:AM.scope,
    due:AM.due,                       // v3.15 — the date this must be finished by
    // v3.14 — the litres-per-tree rate IN FORCE when this was issued. Stamped, so
    // editing the constant later cannot rewrite a job already done against it.
    lpt:(methodRec(AM.program,AM.method)||{}).lpt||0,
    slots:{}, status:issue?'ISSUED':(old?old.status:'DRAFT'),
    by:(CFG&&CFG.worker)||'', at:nowSec(),
    issuedAt:issue?nowSec():(old?old.issuedAt:''),
    issuedBy:issue?((CFG&&CFG.worker)||''):(old?old.issuedBy:'')};
  lines.forEach(l=>{rec.slots[l.slot]={slot:l.slot,ai:l.ai,unit:l.unit,dose:+l.dose};});
  if(old)AGRO_DRAFTS[AGRO_DRAFTS.indexOf(old)]=rec; else AGRO_DRAFTS.unshift(rec);
  await persistDrafts();
  AM.uuid=''; if($('am-name'))$('am-name').value=''; AM.slots={}; AM.name=''; AM.tmpl='';
  AM.due=suggestDue(); if($('am-due'))$('am-due').value=AM.due;
  toast(issue?('📣 '+rec.name+' issued — Sandakan now sees it under AI ➔ BRAND')
             :('✓ '+rec.name+' saved to the matrix'));
  renderAgroMatrix();renderAllocCard();renderOpsTasks();renderHub();badge();}
async function amIssue(){await amSave(true);}
function amEdit(u){
  const d=draftById(u); if(!d)return;
  AM={uuid:d.uuid,program:d.program,method:d.method,stage:d.stage,wx:d.wx,scope:d.scope,
      name:d.name,slots:JSON.parse(JSON.stringify(d.slots||{})),tmpl:'',due:d.due||suggestDue()};
  if($('am-name'))$('am-name').value=d.name;
  if($('am-due'))$('am-due').value=AM.due;
  renderAgroMatrix();
  const el=$('agromatrix'); if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}
async function amIssueExisting(u){
  const d=draftById(u); if(!d)return;
  d.status='ISSUED'; d.issuedAt=nowSec(); d.issuedBy=(CFG&&CFG.worker)||''; d.at=nowSec();
  await persistDrafts();
  toast('📣 '+d.name+' issued to the farm');
  renderAgroMatrix();renderAllocCard();renderOpsTasks();renderHub();badge();}
async function amClose(u){
  const d=draftById(u); if(!d)return;
  if(!confirm('Close "'+d.name+'"?\nIt leaves the crew\'s task list. Everything already logged against it stays in the ledger.'))return;
  d.status='CLOSED'; d.at=nowSec();
  await persistDrafts();
  toast('Directive closed');
  renderAgroMatrix();renderAllocCard();renderOpsTasks();renderHub();badge();}
async function amDelete(u){
  const d=draftById(u); if(!d)return;
  if(EVENTS.some(e=>e.progId===u)){toast('Work has been logged against this — close it instead',1);return;}
  if(!confirm('Delete "'+d.name+'" from the matrix?'))return;
  // a tombstone, not a splice: a plain removal would be re-added by the next phone that
  // syncs its own copy back up, which is how a "deleted" record resurrects itself
  d.deleted=true; d.status='CLOSED'; d.at=nowSec();
  AGRO_DRAFTS=AGRO_DRAFTS.filter(x=>x.uuid!==u).concat([d]);
  await persistDrafts();
  toast('Deleted');
  renderAgroMatrix();renderAllocCard();renderOpsTasks();}
function draftRowHTML(d,forAlloc){
  const c=draftAllocCount(d);
  const ready=c.of>0&&c.n===c.of;
  const st=d.status==='ISSUED'?(ready?'ISSUED':'AWAITING BRANDS'):(d.status==='CLOSED'?tr('ag_closed'):tr('ag_draft'));
  // .a is GREEN in this stylesheet and .p is AMBER - checked, not assumed
  const stc=d.status==='ISSUED'?(ready?'g':'p'):'c';
  return '<div class="crow"><div class="ch">'+
    '<div><div class="ctree">'+esc(d.code)+' · '+esc(d.name)+'</div>'+
    // parenthesised deliberately: the v3.8.1 toast that printed the literal word "false"
    // was exactly this shape — an unparenthesised ternary inside a concatenation
    '<div class="cwho">'+esc(d.program==='MANURE'?'🪣 Manuring':'💦 Spraying')+
      ' · '+esc(methodLabelT(d.program,d.method))+'<br>'+esc(stageLabelT(d.stage))+' · '+esc(wxLabelT(d.wx))+
      ' · '+(d.scope==='ALL'?'whole farm':'Lot '+esc(d.scope))+
      '<br>'+esc(tr('dt_due'))+' <b>'+esc(dateShort(d.due))+'</b>'+
      '<br>by '+esc(d.by)+' · '+esc(String(d.at).slice(0,16).replace('T',' '))+'</div></div>'+
    '<span class="cstat '+stc+'">'+esc(st)+'</span></div>'+
    '<div class="cchange">'+draftLines(d).map(l=>{
      const a=allocOf(d.uuid,l.slot);
      return '<b>'+esc(slotRec(l.slot).ic+' '+l.ai)+'</b> '+nf(l.dose)+' '+esc(l.unit)+
        ' → '+(a?esc(a.pname):'<i style="color:#b3261e">'+esc(tr('ag_nobrand'))+'</i>');}).join('<br>')+'</div>'+
    (forAlloc?'':'<div class="cacts">'+
      (d.status!=='CLOSED'?'<button class="no" style="background:#e8f0fe;color:#123a71" onclick="amEdit(\''+d.uuid+'\')">✏️ EDIT</button>':'')+
      (d.status==='DRAFT'?'<button class="ok" onclick="amIssueExisting(\''+d.uuid+'\')">'+esc(tr('ag_pubbtn'))+'</button>':'')+
      (d.status==='ISSUED'?'<button class="no" onclick="amClose(\''+d.uuid+'\')">CLOSE</button>':'')+
      (d.status!=='ISSUED'?'<button class="no" onclick="amDelete(\''+d.uuid+'\')">🗑 DELETE</button>':'')+
      '</div>')+
    '</div>';}
function renderDraftList(){
  const box=$('am-list'); if(!box)return;
  const live=AGRO_DRAFTS.filter(d=>!d.deleted);
  box.innerHTML=live.length?live.map(d=>draftRowHTML(d,false)).join('')
    // v3.13 — the empty state was the last paragraph left on this screen. An empty list
    // does not need three sentences of instruction; the form is directly above it.
    :'<div class="alertnone">—</div>';}

/* ================= PURCHASER · brand allocation + product onboarding ================= */
/* ======================================================================================
   v3.13 · HORIZONTAL SPLIT-CARDS FOR THE PURCHASER
   ======================================================================================
   Left: the active ingredient the Owner asked for, in a green badge, with its dose.
   Right: one large touch dropdown holding the brands in the store that carry it.
   That is the whole screen. The explanatory paragraph is gone — the two halves of the
   card say what the job is better than a paragraph above them ever did.

   No currency reaches this view for the Purchaser. Owner and Marketing get a single
   compact cost chip, because they are the roles entitled to see it and they use this
   screen to check what a job will cost before the crew go out.
   ====================================================================================== */
function renderAllocCard(){
  const box=$('alloclist'); if(!box)return;
  if(!roleAllows('alloccard')){box.innerHTML='';return;}
  const live=issuedDrafts().filter(d=>!d.deleted);
  if(!live.length){box.innerHTML='<div class="alertnone">'+esc(tr('ag_nodir'))+'</div>';return;}
  box.innerHTML=live.map(d=>{
    const rows=draftLines(d).map(l=>{
      const a=allocOf(d.uuid,l.slot), s=slotRec(l.slot);
      const b=brandsFor(l.slot,l.ai,l.unit);
      const short=allocShort(d.uuid,l.slot);
      // v3.13 fix (screenshot): "Abamectin (Envoy) · 6,000 ml" was clipped to
      // "Abamectin (I" in the collapsed select, which is the state people actually read.
      // Options carry the BRAND only; the quantity moves under the select, where it has
      // the full width of the column.
      const opts='<option value="">—</option>'+
        b.match.map(p=>'<option value="'+p.id+'"'+(a&&a.pid===p.id?' selected':'')+'>'+
          esc(p.name)+'</option>').join('');
      return '<div class="splitcard'+(a&&a.pid?' done':'')+(short?' short':'')+'">'+

        // ---- left half: what was asked for ----
        '<div class="sc-l">'+
          // the catalogue appends notes to some ingredients ("Boscalid + Dimoxystrobin ·
          // fruit-contact, 14-day PHI"). The badge carries the INGREDIENT; the note is a
          // note, and putting it in the badge made it four lines tall.
          '<span class="aibadge" title="'+esc(l.ai)+'">'+esc(s.ic)+' '+
            esc(String(l.ai).split(' · ')[0])+'</span>'+
          '<span class="scdose"><b>'+nf(l.dose)+'</b> '+esc(l.unit)+'</span>'+
        '</div>'+

        // ---- right half: what the store will supply ----
        '<div class="sc-r">'+
          (b.match.length
            ?('<select class="scsel" onchange="allocPick(\''+d.uuid+'\',\''+l.slot+'\',this.value)">'+opts+'</select>'+
              (a&&a.pid
                // the select already names the brand — repeating it under itself was noise
                ?('<div class="sclock">🔒 '+nf(onHand(prodById(a.pid))||0)+' '+esc(a.unit)+
                    (SHOW_VALUES?('<span class="scrm">'+rm(a.mac)+'/'+esc(a.unit)+'</span>'):'')+'</div>')
                :'')+
              (short?'<div class="scshort">'+esc(tr('ag_short'))+'</div>':''))
            :('<div class="scnone">'+esc(tr('pu_nostock'))+' · '+esc(l.unit)+
               (b.other.length?('<br>'+esc(b.other.map(p=>p.name+' ('+p.unit+')').join(', '))):'')+'</div>'))+
        '</div>'+
      '</div>';}).join('');
    const c=draftAllocCount(d);
    return '<div class="acard"><div class="ahdr">'+
      '<div class="atitle">'+esc(d.code)+' · '+esc(d.name)+
        '<span class="ameth">'+esc(physMethodT(d.program,d.method))+
        ' · '+esc(d.basis==='PER_1000L'?tr('w13_perTank'):tr('w13_perTree'))+'</span></div>'+
      '<span class="cstat '+(c.n===c.of?'g':'p')+'">'+c.n+'/'+c.of+'</span></div>'+
      rows+'</div>';}).join('');}

async function allocPick(u,slotK,pidStr){
  const d=draftById(u); if(!d)return;
  const line=draftLines(d).find(l=>l.slot===slotK); if(!line)return;
  const key=allocKey(u,slotK);
  if(!pidStr){delete AI_ALLOC[key];await persistAlloc();renderAllocCard();renderOpsTasks();renderHub();return;}
  const p=prodById(+pidStr); if(!p){toast('Product not found',1);return;}
  if(p.unit!==line.unit){toast('That brand is sold in '+p.unit+', the recipe is in '+line.unit+' — refused',1);return;}
  const mac=currentMAC(p.id);
  AI_ALLOC[key]={draft:u,slot:slotK,ai:line.ai,pid:p.id,pname:p.name,unit:p.unit,
    container:p.container,unit_multiplier:+p.unit_multiplier||1,
    mac:mac, dose:+line.dose, basis:d.basis,
    by:(CFG&&CFG.worker)||'', at:nowSec()};
  await persistAlloc();
  toast('🔒 '+p.name+' locked'+(SHOW_VALUES?(' at '+rm(mac)+'/'+p.unit):''));
  renderAllocCard();renderOpsTasks();renderHub();badge();}

/* ---- dynamic product onboarding ---------------------------------------------------- */
function obUnitChange(){
  const u=ONBOARD_UNITS.find(x=>x.k===$('ob-unit').value)||ONBOARD_UNITS[0];
  $('ob-container').innerHTML=u.containers.map(c=>'<option value="'+esc(c[0])+'" data-m="'+c[1]+'">'+esc(c[0])+'</option>').join('');
  obContainerChange();}
function obContainerChange(){
  const sel=$('ob-container'), o=sel.options[sel.selectedIndex];
  if(o)$('ob-mult').value=o.getAttribute('data-m')||1;
  obCalc();}
function obCalc(){
  const mult=+$('ob-mult').value||0, price=+$('ob-price').value||0, u=$('ob-unit').value;
  $('ob-conv').innerHTML=mult>0
    ?('1 '+esc($('ob-container').value)+' = <b>'+nf(mult)+' '+esc(u)+'</b>'+
      (price>0?(' · cost per '+esc(u)+' = <b>'+rm(price/mult)+'</b>'):''))
    :'Key how much one container holds in '+esc(u)+'.';}
function renderOnboard(){
  const box=$('oblist'); if(!box)return;
  if(!roleAllows('onboardcard')){box.innerHTML='';return;}
  if(!$('ob-unit').innerHTML){
    $('ob-unit').innerHTML=ONBOARD_UNITS.map(u=>'<option value="'+u.k+'">'+esc(u.t)+'</option>').join('');
    $('ob-cat').innerHTML=['Pesticide','Fungicide','Foliar','Powder','Growth Reg','Herbicide','Fertiliser','Consumable']
      .map(c=>'<option>'+esc(c)+'</option>').join('');
    obUnitChange();}
  // the ingredient dropdown offers every AI the catalogue already knows, plus free text
  const seen={};INVENTORY_RECON.forEach(p=>{const a=String(p.active_ingredient||'').trim();
    if(a&&a.indexOf('(confirm')<0)seen[a]=1;});
  const cur=$('ob-ai').value;
  $('ob-ai').innerHTML='<option value="">— type a new ingredient below —</option>'+
    Object.keys(seen).sort().map(a=>'<option'+(a===cur?' selected':'')+'>'+esc(a)+'</option>').join('');
  box.innerHTML=NEW_PRODS.length
    ?('<div class="sec" style="margin-top:14px">Onboarded by the farm — '+NEW_PRODS.length+' item'+(NEW_PRODS.length>1?'s':'')+'</div>'+
      NEW_PRODS.slice().reverse().map(p=>{
        const live=INVENTORY_RECON.find(x=>x.nid===p.nid);
        return '<div class="lrow"><span><b>'+esc(p.name)+'</b><br><span class="small">'+esc(p.ai||'—')+
          ' · 1 '+esc(p.container)+' = '+nf(p.mult)+' '+esc(p.unit)+
          '<br>added by '+esc(p.by)+' · '+esc(String(p.at).slice(0,16).replace('T',' '))+'</span></span>'+
          '<span style="text-align:right;font-weight:800">'+(live?nf(onHand(live)):'0')+' '+esc(p.unit)+
          '<br><span class="small">on hand</span></span></div>';}).join(''))
    :'<div class="small" style="margin-top:12px">Nothing onboarded yet. Anything you add here appears on every phone the next time they sync, and can be received against an invoice on the Stock In screen straight away.</div>';}
async function obSave(){
  const err=$('ob-err'); err.textContent='';
  if(!roleAllows('onboardcard')){err.textContent='You are not allowed to change the catalogue.';return;}
  const name=$('ob-name').value.trim();
  const ai=($('ob-ai').value||$('ob-ainew').value||'').trim();
  const unit=$('ob-unit').value, container=$('ob-container').value;
  const mult=+$('ob-mult').value||0, price=+$('ob-price').value||0, min=+$('ob-min').value||0;
  const cat=$('ob-cat').value;
  if(!name)return err.textContent='Key the brand name exactly as it is printed on the label.';
  if(INVENTORY_RECON.some(p=>String(p.name).trim().toLowerCase()===name.toLowerCase()))
    return err.textContent='"'+name+'" is already in the catalogue.';
  if(!ai)return err.textContent='Link it to an active ingredient — pick one or type the new one.';
  if(!(mult>0))return err.textContent='Key how much one '+container+' holds, in '+unit+'.';
  const rec={nid:uuid(),name:name,ai:ai,cat:cat,unit:unit,container:container,
    mult:mult,price:price,min:min,by:(CFG&&CFG.worker)||'',at:nowSec()};
  NEW_PRODS.push(rec);
  await persistNewProds();
  applyNewProducts();
  $('ob-name').value='';$('ob-ainew').value='';$('ob-price').value='';$('ob-min').value='';
  refreshInventoryViews();renderOnboard();renderAllocCard();
  toast('✓ '+name+' is now in the store catalogue — receive it on Stock In against an invoice');}

/* ===================== WORKER · the operational directive + the run ==================== */
/** Directives this person still has work outstanding on. A directive with no brand behind
 *  it is still SHOWN — with the reason — because a blank task list is what made the crew
 *  ring the office. They can see it is coming and see who they are waiting for. */
function myDirectives(){
  // v3.14 — a lot leaves the list when every TREE in it is done, not when the first
  // gram of chemical is logged against it. That single change is what makes "I did
  // half of Lot C, I will finish tomorrow" expressible at all.
  return issuedDrafts().filter(d=>!d.deleted&&dirLotsLeft(d).length>0);}
/* ======================================================================================
   v3.13.0 · THE BRAND-ONLY WORKER CARD
   ======================================================================================
   The crew do not need chemistry and asking them to read it was a wall of text between
   them and the job. This card carries THREE facts at the top — the date, the task name,
   and where to point the lance — then one spacious row per drum: the brand on the label
   and how much of it goes into a 1,000 L tank. Nothing else.

   REMOVED from this screen, deliberately and completely: the active ingredient, the
   product class (Pesticide / Fungicide / …), the slot name, the rain-fastness tag, and
   the PHI product name.

   KEPT, equally deliberately: ONE plain-language safety line. A residue cut-off is not a
   technicality — fruit sprayed inside it cannot be sold. It names no chemical, so it adds
   no complexity, and it is the difference between a clean load and a rejected one.
   ====================================================================================== */

/** True when the person reading is a field worker, who sees no chemistry at all. */
function hideChem(){return myRole()==='WORKER';}

/* ======================================================================================
   v3.14.0 · COUNT TREES, NOT TANKS
   ======================================================================================
   The crew work tree by tree, so the number they actually know is how many trees they
   got through. Everything else follows from it:

       litres = trees x litres_per_tree(method)      tanks = litres / 1,000
       deduct = dose x tanks        (a spray)
       deduct = dose x trees        (a broadcast - no water is mixed at all)

   Two consequences fall out for free, and both were real problems:

     · ONE completion covers every lot touched that day. Before this, a crew who did two
       lots filed the form twice and keyed crew-and-hours twice, so 3 men x 6 hours was
       recorded as 36 man-hours instead of 18. Man-hours are now entered ONCE and split
       across the lots by tree count.

     · PARTIAL work is the normal case, not an edge case. 30 of 65 trees is just a number
       lower than the lot total; the lot stays on the list showing what is left, and it
       marks itself finished when the count reaches the total. There is no "finished /
       not finished" button to remember, because the tree count already answers it.
   ====================================================================================== */

/** Man-hours for one row. Rows written before v3.14 have no `manHours` and carry the
 *  whole crew x hours, which for them is correct - so nothing historical moves. */
function mhOf(e){
  if(e&&e.manHours!=null)return +e.manHours||0;
  return (+((e||{}).crew)||0)*(+((e||{}).hours)||0);}

/** Split a total across weights so the parts ALWAYS re-add to the total. The last
 *  weighted part carries the rounding remainder - otherwise three 2-decimal shares of
 *  18 come to 17.99 and the labour report is quietly short every single time. */
function splitExact(total,weights){
  const sum=weights.reduce((a,b)=>a+(+b||0),0);
  if(!(sum>0))return weights.map(()=>0);
  const out=weights.map(w=>Math.round(total*(+w||0)/sum*100)/100);
  const drift=+(total-out.reduce((a,b)=>a+b,0)).toFixed(2);
  for(let i=out.length-1;i>=0;i--){ if(+weights[i]>0){out[i]=+(out[i]+drift).toFixed(2);break;} }
  return out;}

/** Litres of spray mix one tree takes under this directive's method. Read from the
 *  directive itself when it carries one, so changing the constant later can never
 *  rewrite a job that has already been done. */
function lptOf(d){
  if(!d)return 0;
  if(d.lpt!=null)return +d.lpt||0;
  const m=methodRec(d.program,d.method);
  return (m&&m.lpt!=null)?+m.lpt:0;}
/** A broadcast mixes no water; its dose is per tree and there is no tank at all. */
function usesWater(d){return d&&d.basis==='PER_1000L'&&lptOf(d)>0;}

/* ---- how much of a directive is already done ---------------------------------------
   A completion writes one STOCK_OUT row PER PRODUCT per lot, all sharing one replyId.
   Counting `treesDone` off every row would multiply the progress by the number of
   products in the recipe, so progress is counted once per (replyId, lot) pair. */
function dirProgress(u,lot){
  const seen={}; let trees=0;
  EVENTS.forEach(e=>{
    if(e.type!=='STOCK_OUT'||!e.dirRun||e.progId!==u||e.lot!==lot)return;
    const k=(e.replyId||e.uuid)+'|'+e.lot;
    if(seen[k])return; seen[k]=1;
    // a row written before v3.14 has no tree count; it was a whole-lot completion, so
    // it counts as the whole lot rather than as zero progress
    trees+=(e.treesDone!=null)?(+e.treesDone||0):treesInLot(lot).length;});
  return trees;}
function lotTreeTotal(lot){return treesInLot(lot).length;}
function lotFinished(u,lot){return dirProgress(u,lot)>=lotTreeTotal(lot);}
function lotsOfDirective(d){return d.scope==='ALL'?LOT_KEYS.slice():[d.scope];}

/* ======================================================================================
   v3.15.0 · THE DATE A PROGRAMME MUST BE FINISHED BY
   ======================================================================================
   Until now a directive had no date at all, so "late" could not be said, and a monthly
   record would have had nothing to count. One date per programme fixes both:

     · the crew get ONE coloured strip — days left, due today, or days late — and the
       most overdue job sorts to the top of their list, so nobody has to decide what
       to do first;
     · the Owner gets a month and year record built entirely from that date against the
       date the last lot was actually finished.

   The date is SUGGESTED from the programme sheet's own plan dates, so in the normal case
   the Owner accepts it rather than keying one. ==================================== */

/** The nearest plan date on the programme sheet that has not gone past, else a week out. */
function suggestDue(){
  const t=todayStr();
  const future=allPhases().map(p=>String(p.plan||'')).filter(x=>x&&x>=t).sort();
  if(future.length)return future[0];
  return ymd(addDays(dayStart(new Date()),7));}

/** Whole days from today to the due date. Negative means overdue. */
function dueDays(d){
  if(!d||!d.due)return null;
  const due=parseDay(d.due); if(!due)return null;
  return Math.round((due-dayStart(new Date()))/86400000);}

/** How the date is presented, in one place, so the crew card, the sort order, the tile
 *  badge and the record can never disagree with each other. */
function dueState(d){
  const n=dueDays(d);
  if(n===null)return {k:'none',cls:'ok',txt:tr('dt_nodate'),days:null,rank:9e6};
  if(n<0)      return {k:'late', cls:'late',txt:tr('dt_late').replace('{n}',String(-n)),days:n,rank:-1e6+n};
  if(n===0)    return {k:'today',cls:'soon',txt:tr('dt_today'),days:0,rank:0};
  if(n===1)    return {k:'soon', cls:'soon',txt:tr('dt_tomorrow'),days:1,rank:1};
  return {k:'ok',cls:'ok',txt:tr('dt_left').replace('{n}',String(n)),days:n,rank:n};}

/** Every lot done. */
function dirAllDone(d){return d&&lotsOfDirective(d).every(L=>lotFinished(d.uuid,L));}
/** The day the LAST lot was finished — derived from the events, never stored twice. */
function dirDoneDate(d){
  if(!dirAllDone(d))return '';
  let last='';
  EVENTS.forEach(e=>{ if(e.type==='STOCK_OUT'&&e.dirRun&&e.progId===d.uuid){
    const day=String(e.dt||'').slice(0,10); if(day>last)last=day;}});
  return last;}

/** One programme's standing, for the record. Four states that never overlap. */
function dirRecord(d){
  const due=d.due||'', done=dirDoneDate(d);
  if(done){
    const late=due?Math.round((parseDay(done)-parseDay(due))/86400000):0;
    if(!due)      return {k:'DONE', late:0, done:done,
                          chip:tr('rp_ontimechip'), cls:'ok', scored:false};
    if(late>0)    return {k:'LATE', late:late, done:done,
                          chip:tr('rp_latechip').replace('{n}',String(late)), cls:'late', scored:true};
    if(late<0)    return {k:'ONTIME', late:late, done:done,
                          chip:tr('rp_earlychip').replace('{n}',String(-late)), cls:'ok', scored:true};
    return {k:'ONTIME', late:0, done:done, chip:tr('rp_ontimechip'), cls:'ok', scored:true};}
  const st=dueState(d);
  return {k:(st.k==='late')?'OVERDUE':'OPEN', late:st.days!=null?-st.days:0, done:'',
    chip:st.txt, cls:(st.k==='late')?'late':(st.k==='today'?'now':'open'), scored:false};}

/** Issued programmes past their date with work still outstanding — the badge number. */
function overdueDirectives(){
  return issuedDrafts().filter(d=>!d.deleted&&!dirAllDone(d)&&dueState(d).k==='late');}
function dirLotsLeft(d){return lotsOfDirective(d).filter(L=>!lotFinished(d.uuid,L));}


/** "4 August 2026" / "4 Ogos 2026" — the date row on the worker's card. */
function dateLong(d){
  d=d||new Date();
  const M=(LANG==='ms')?MONTH_LONG_MS:MONTH_LONG_EN;
  return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear();}

/** "8 Ogos" — the compact form used on the deadline strip and in the record. */
function dateShort(iso){
  const d=parseDay(iso); if(!d)return '—';
  const M=(LANG==='ms')?MONTH_LONG_MS:MONTH_LONG_EN;
  return d.getDate()+' '+M[d.getMonth()].slice(0,3);}

/** The physical instruction: what to point the lance at. No agronomy vocabulary. */
function physMethodT(prog,k){return tr('pm_'+k,methodLabelT(prog,k));}

function directiveCardsHTML(){
  // v3.15 — the most overdue job first, the furthest away last. The crew should never
  // have to work out which of four cards to do today.
  const ds=myDirectives().slice().sort((a,b)=>dueState(a).rank-dueState(b).rank);
  if(!ds.length)return '';
  const wf=(typeof wetFlag==='function')?wetFlag():{wet:false,text:''};
  const today=dateLong(new Date());
  return ds.map(d=>{
    const ready=draftReady(d), c=draftAllocCount(d);
    const spray=(d.mode==='SPRAY'||d.mode==='LEAF');
    // the PHI check still runs on the real product; only its WORDING is de-chemicalised
    const phi=draftLines(d).some(l=>{const a=allocOf(d.uuid,l.slot);
      return a&&PHI_PRODUCTS[(prodById(a.pid)||{}).name];});
    const per=(d.basis==='PER_1000L')?tr('w13_perTank'):tr('w13_perTree');
    const ds2=dueState(d);
    // the header takes the colour of the deadline, so the card reads at arm's length
    const urg=(ds2.k==='late')?' late':((ds2.k==='today'||ds2.k==='soon')?' soon':'');

    return '<div class="wcard'+(ready?'':' waiting')+urg+'">'+

      // ---- 1. the three-row header, high contrast, nothing else competing ----
      '<div class="whdr">'+
        '<div class="wrow"><span class="wl">'+esc(tr('w13_date'))+'</span>'+
          '<span class="wv">'+esc(today)+'</span></div>'+
        '<div class="wrow"><span class="wl">'+esc(tr('w13_task'))+'</span>'+
          '<span class="wv">'+esc(d.name)+'</span></div>'+
        '<div class="wrow tall"><span class="wl">'+esc(tr('w13_method'))+'</span>'+
          '<span class="wv big">'+esc(d.program==='MANURE'?'🪣 ':'💦 ')+
            esc(physMethodT(d.program,d.method))+'</span></div>'+
      '</div>'+

      // ---- 1b. ONE coloured strip: days left, due today, or days late ----
      (ds2.k!=='none'
        ?('<div class="duebar '+ds2.cls+'"><span>'+esc(ds2.txt)+'</span>'+
            '<span class="dd">'+esc(tr('dt_by'))+' '+esc(dateShort(d.due))+'</span></div>')
        :'')+

      // ---- 2. safety, in words a person can act on, naming no chemical ----
      (phi?'<div class="wsafe">'+esc(tr('w13_nospray'))+'</div>':'')+
      (WX3==='HEAVY'&&spray?'<div class="wsafe amber">'+esc(tr('w13_norain'))+'</div>':'')+
      (wf.wet&&spray?'<div class="wsafe amber">'+esc(tr('w13_wetleaf'))+'</div>':'')+

      // ---- 3. the recipe: one spacious row per drum, brand and dose only ----
      (ready
        // v3.13 fix (screenshot): "per 1,000 L tank" was printed on every one of five
        // rows. Five copies of the same sentence is the text wall this release exists to
        // remove. It is stated ONCE, in the heading the rows sit under.
        ?('<div class="wsec">'+esc(d.basis==='PER_1000L'?tr('w13_recipeTank'):tr('w13_recipeTree'))+'</div>'+
          draftLines(d).map(l=>{
            const a=allocOf(d.uuid,l.slot);
            const short=allocShort(d.uuid,l.slot);
            return '<div class="witem'+(short?' short':'')+'">'+
              '<div class="wname">'+esc(a.pname)+
                // Owner and Marketing stand in for the crew occasionally and DO need the
                // chemistry; the worker never sees this line.
                (hideChem()?'':'<span class="wai">'+esc(l.ai)+'</span>')+
                (short?'<span class="wshort">'+esc(tr('ag_short'))+'</span>':'')+
              '</div>'+
              '<div class="wdose"><b>'+nf(l.dose)+'</b> '+esc(l.unit)+'</div>'+
            '</div>';}).join(''))
        :'')+

      // ---- 4. one full-width action, or the reason there isn't one ----
      (ready
        // v3.14 — a chip that says "LOT A" cannot say "30 of 65". The crew need to see
        // how far in they are, per lot, before they decide what to do next.
        ?('<div class="wprog">'+lotsOfDirective(d).map(L=>{
              const t=lotTreeTotal(L), n=Math.min(dirProgress(d.uuid,L),t);
              const pct=t?Math.round(n/t*100):0, fin=n>=t;
              return '<div class="pg'+(fin?' fin':'')+'">'+
                '<span class="pgl">LOT '+L+'</span>'+
                '<span class="pgbar"><i style="width:'+pct+'%"></i></span>'+
                '<span class="pgn">'+n+'/'+t+'</span></div>';}).join('')+'</div>'+
          '<button class="wbtn" onclick="openRun(\''+d.uuid+'\')">'+esc(tr('w13_markdone'))+'</button>')
        :('<div class="wwait">'+esc(tr('ag_await'))+'</div>'))+
      '</div>';}).join('');}

/* ======================================================================================
   v3.13.0 · TWO NUMBER PADS, THEN THE STORE TALLIES ITSELF
   ======================================================================================
   The old form asked for five things. This one asks for two numbers:

       1. how many 1,000 L tanks were mixed        (decimals allowed - 3.5 is legal)
       2. confirm the total taken out of the store (ml/gm)

   The second is not busywork. The app already knows what the recipe needs; making the
   crew state what they actually carried out of the store is a second pair of eyes on the
   count, and a gap between the two is the earliest signal the farm gets that something
   is being over-drawn. A gap does not block the save - it asks once, out loud.

   The lot chips appear ONLY when the app genuinely cannot know the answer (a whole-farm
   directive with more than one lot left). Crew and hours carry over from last time and
   are asked for once, on a person's first ever run, because man-hours are the whole
   labour report and defaulting them to a made-up number would quietly falsify it.

   THE TALLY, unchanged from v3.12 and still the only thing that touches stock:
       deduct = dose x tanks        cost = deduct x the cost the Purchaser locked
   ====================================================================================== */
let RUN=null, RUN_TREES={}, runSaving=false, RUN_CREWOPEN=false;

/** The arithmetic chain for ONE lot, from the tree count the crew keyed. */
function runLot1(d,L){
  const total=lotTreeTotal(L), already=Math.min(dirProgress(d.uuid,L),total);
  const left=Math.max(0,total-already);
  const keyed=Math.max(0,Math.min(+RUN_TREES[L]||0,left));
  const lpt=lptOf(d), water=usesWater(d);
  const litres=water?+(keyed*lpt).toFixed(1):0;
  const tanks =water?+(litres/TANK_L).toFixed(4):0;
  return {lot:L,total:total,already:already,left:left,trees:keyed,
    lpt:lpt,water:water,litres:litres,tanks:tanks,
    mult:water?tanks:keyed,                       // what the dose is multiplied by
    finished:(already+keyed)>=total};}

/** Every lot of this directive, plus the day's totals. */
function runPlan(){
  if(!RUN)return {lots:[],active:[],trees:0,tanks:0,items:[],total:0,byUnit:{}};
  const lots=lotsOfDirective(RUN).map(L=>runLot1(RUN,L));
  const active=lots.filter(x=>x.trees>0);
  const items=[], byUnit={}; let total=0;
  draftLines(RUN).forEach(l=>{
    const a=allocOf(RUN.uuid,l.slot); if(!a)return;
    const q=+(l.dose*active.reduce((s,x)=>s+x.mult,0)).toFixed(2);
    total+=q; byUnit[a.unit]=+((byUnit[a.unit]||0)+q).toFixed(2);
    const p=prodById(a.pid);
    items.push({line:l,alloc:a,prod:p,qty:q,onHand:p?onHand(p):0});});
  return {lots:lots,active:active,
    trees:active.reduce((s,x)=>s+x.trees,0),
    tanks:+active.reduce((s,x)=>s+x.tanks,0).toFixed(4),
    items:items,total:+total.toFixed(2),byUnit:byUnit};}

function openRun(u){
  const d=draftById(u); if(!d){toast('Directive not found',1);return;}
  if(!draftReady(d)){toast(tr('ag_await'),1);return;}
  RUN=d; RUN_TREES={};
  $('run-head').textContent=tr('w13_confirmhead');
  $('run-task').textContent=d.name;
  $('run-method').textContent=(d.program==='MANURE'?'🪣 ':'💦 ')+physMethodT(d.program,d.method);
  RUN_CREWOPEN=!(LAST_CREW&&+LAST_CREW.crew>0&&+LAST_CREW.hours>0);
  $('run-crew').value=(LAST_CREW&&LAST_CREW.crew)||'';
  $('run-hours').value=(LAST_CREW&&LAST_CREW.hours)||'';
  $('run-err').textContent='';
  $('runmodal').classList.remove('hidden');
  runCalc();}
function closeRun(){$('runmodal').classList.add('hidden');RUN=null;RUN_TREES={};RUN_CREWOPEN=false;}
function runSetTrees(L,v){
  // recalc only — a full re-render here would destroy the input the person is typing in,
  // which is exactly the bug that shipped in v3.9.1 and was caught by a focus test
  RUN_TREES[L]=v; runCalc(true);}
/** "ALL" fills in whatever is left of that lot — the commonest case, in one tap. */
function runFillLot(L){
  if(!RUN)return;
  const x=runLot1(RUN,L); RUN_TREES[L]=x.left; runRender();}
function runClearLot(L){delete RUN_TREES[L];runRender();}
function runCrewOpen(){RUN_CREWOPEN=true;runRender();}

/** The rate strip — the one number the whole calculation hangs on, said out loud. */
function runRateHTML(){
  const d=RUN; if(!d)return '';
  const lpt=lptOf(d);
  return '<div class="rate"><div class="rl">'+esc(tr('t14_rate'))+'</div>'+
    '<div class="rv">'+(usesWater(d)?(nf(lpt)+' '+esc(tr('t14_lpt'))):esc(tr('t14_pertree')))+'</div>'+
    '<div class="rs">'+esc(usesWater(d)
      ? tr('t14_covers').replace('{n}',String(Math.floor(TANK_L/(lpt||1))))
      : tr('t14_nowater'))+'</div></div>';}

function runRender(){
  if(!RUN)return;
  const d=RUN, pl=runPlan();
  $('run-rate').innerHTML=runRateHTML();
  $('run-lots').innerHTML=pl.lots.map(x=>{
    const cum=x.already+x.trees, pct=x.total?Math.round(cum/x.total*100):0;
    const tag = (!x.trees&&!x.already) ? '<span class="lrtag todo">'+esc(tr('t14_nottouched'))+'</span>'
              : (cum>=x.total ? '<span class="lrtag doing">'+esc(tr('t14_finished'))+'</span>'
                              : '<span class="lrtag part">'+esc(tr('t14_carry'))+'</span>');
    const cls = (!x.trees&&!x.already) ? '' : (cum>=x.total?'active':'part');
    return '<div class="lotrow '+cls+'" data-l="'+x.lot+'">'+
      '<div class="lrhead"><span class="lrname">LOT '+x.lot+
        '<span class="lrsub">'+cum+' / '+x.total+' '+esc(tr('t14_trees'))+
          (x.already?(' · '+x.already+' '+esc(tr('t14_donebefore'))):'')+
          (x.left-x.trees>0?(' · '+esc(tr('t14_left'))+' '+(x.left-x.trees)):'')+
        '</span></span>'+tag+'</div>'+
      '<div class="bar2"><i class="'+(cum>=x.total?'':'amber')+'" style="width:'+pct+'%"></i></div>'+
      (x.left>0
        ?('<div class="lrbody">'+
            '<div class="lrlbl">'+esc(tr('t14_treestoday'))+'</div>'+
            '<input class="tree" type="number" min="0" step="1" inputmode="numeric" placeholder="0" '+
              'value="'+esc(RUN_TREES[x.lot]==null?'':RUN_TREES[x.lot])+'" '+
              'oninput="runSetTrees(\''+x.lot+'\',this.value)">'+
            '<div class="quick">'+
              '<div onclick="runFillLot(\''+x.lot+'\')">'+esc(tr('t14_all'))+' '+x.left+'</div>'+
              '<div onclick="runClearLot(\''+x.lot+'\')">'+esc(tr('t14_none'))+'</div>'+
            '</div>'+
            // BOTH are rendered and toggled by runCalc(). Swapping one for the other on
            // every keystroke would mean re-rendering the row, which destroys the input
            // the person is typing in — the v3.9.1 bug, in a new place.
            '<div class="chain" style="display:'+(x.trees>0?'':'none')+'">'+runChainHTML(x)+'</div>'+
            '<div class="lrskip" style="display:'+(x.trees>0?'none':'')+'">'+esc(tr('t14_empty'))+'</div>'+
          '</div>')
        :'')+
      '</div>';}).join('');
  runCalc(true);}

/** trees × litres = litres → tanks → what leaves the store. Shown, not hidden. */
function runChainHTML(x){
  const d=RUN, lines=draftLines(d).map(l=>{
    const a=allocOf(d.uuid,l.slot); if(!a)return '';
    return esc(a.pname)+' <b>'+nf(l.dose*x.mult)+'</b> '+esc(a.unit);}).filter(Boolean).join(' · ');
  if(!x.water)
    return x.trees+' '+esc(tr('t14_trees'))+' <span class="arrow">➜</span> '+
      esc(tr('t14_pertree'))+'<span class="fin">'+lines+'</span>';
  return x.trees+' '+esc(tr('t14_trees'))+' <span class="arrow">×</span> '+nf(x.lpt)+' L '+
    '<span class="arrow">=</span> '+nf(x.litres)+' L <span class="arrow">➜</span> <b>'+
    nf(x.tanks)+' '+esc(LANG==='ms'?'tangki':'tanks')+'</b><span class="fin">'+lines+'</span>';}

function runCalc(skipRender){
  if(!RUN)return;
  if(!skipRender&&$('run-lots')&&!$('run-lots').innerHTML){runRender();return;}
  const d=RUN, pl=runPlan();
  // refresh only the live chain lines, so typing never tears up the focused input
  pl.lots.forEach(x=>{
    const row=document.querySelector('#run-lots .lotrow[data-l="'+x.lot+'"]');
    if(!row)return;
    const box=row.querySelector('.chain'), skip=row.querySelector('.lrskip');
    if(box){box.innerHTML=runChainHTML(x);box.style.display=x.trees>0?'':'none';}
    if(skip)skip.style.display=x.trees>0?'none':'';
    // the header counters move as they type, without touching the input itself
    const sub=row.querySelector('.lrsub'), bar=row.querySelector('.bar2 i'),
          tag=row.querySelector('.lrtag');
    const cum=x.already+x.trees, fin=cum>=x.total;
    if(sub)sub.innerHTML=cum+' / '+x.total+' '+esc(tr('t14_trees'))+
      (x.already?(' · '+x.already+' '+esc(tr('t14_donebefore'))):'')+
      (x.left-x.trees>0?(' · '+esc(tr('t14_left'))+' '+(x.left-x.trees)):'');
    if(bar){bar.style.width=(x.total?Math.round(cum/x.total*100):0)+'%';
            bar.className=fin?'':'amber';}
    if(tag&&(x.trees||x.already)){
      tag.className='lrtag '+(fin?'doing':'part');
      tag.textContent=fin?tr('t14_finished'):tr('t14_carry');}
    row.className='lotrow'+((x.trees||x.already)?(fin?' active':' part'):'')+'';
    row.setAttribute('data-l',x.lot);});
  const parts=Object.keys(pl.byUnit).map(u=>nf(pl.byUnit[u])+' '+u);
  $('run-tot').innerHTML=pl.trees>0
    ?('<b>'+pl.trees+' '+esc(tr('t14_trees'))+'</b>'+
      (usesWater(d)?(' · <b>'+nf(pl.tanks)+' '+esc(LANG==='ms'?'tangki':'tanks')+'</b>'):'')+
      ' · '+pl.active.length+' lot'+
      '<span class="sub">'+pl.active.map(x=>'Lot '+x.lot+' '+x.trees).join(' · ')+'</span>'+
      '<span class="sub">'+esc(tr('ag_deduct'))+': '+esc(parts.join(' + '))+'</span>')
    :esc(tr('t14_keytrees'));
  $('run-items').innerHTML=pl.items.map(it=>
    '<div class="ritem'+(it.onHand<it.qty?' short':'')+'">'+
      '<span class="rn">'+esc(it.alloc.pname)+'</span>'+
      '<span class="rq"><b>'+nf(it.qty)+'</b> '+esc(it.alloc.unit)+'</span></div>').join('');
  // labour: keyed once, split by trees, and the parts always re-add to the whole
  $('run-crewwrap').style.display=RUN_CREWOPEN?'':'none';
  $('run-crewline').style.display=RUN_CREWOPEN?'none':'';
  const c=+$('run-crew').value||0, h=+$('run-hours').value||0;
  const shares=splitExact(c*h,pl.active.map(x=>x.trees));
  $('run-crewline').innerHTML=(c&&h)
    ?(esc(tr('w13_crew'))+' <b>'+c+'</b> · '+esc(tr('w13_hrs'))+' <b>'+nf(h)+'</b>'+
      ' <span class="chg" onclick="runCrewOpen()">'+esc(tr('w13_change'))+'</span>')
    :'';
  $('run-mh').innerHTML=(c&&h&&pl.active.length)
    ?('<b>'+nf(c*h)+'</b> '+esc(tr('t14_mhonce'))+'<br>'+
      pl.active.map((x,i)=>'Lot '+x.lot+' '+nf(shares[i])).join(' · '))
    :'';
  $('run-save').disabled=!(pl.trees>0);}

async function submitRun(){
  const err=$('run-err'); err.textContent='';
  if(!RUN||runSaving)return;
  const d=RUN, pl=runPlan();
  if(!(pl.trees>0))return err.textContent=tr('t14_keytrees');
  // a count above what the lot has left is a typo, and it would over-draw the store
  const over=pl.lots.find(x=>(+RUN_TREES[x.lot]||0)>x.left);
  if(over)return err.textContent='Lot '+over.lot+' — '+tr('t14_toomany')+' ('+over.left+')';
  if(!draftReady(d))return err.textContent='A brand has been removed from this directive. Ask Sandakan to re-allocate.';
  const crew=Math.round(+$('run-crew').value||0), hours=+$('run-hours').value||0;
  if(!(crew>0&&hours>0)){RUN_CREWOPEN=true;runRender();return err.textContent=tr('w13_keycrew');}

  for(const it of pl.items){
    const phi=PHI_PRODUCTS[(it.prod||{}).name]; if(!phi)continue;
    const days=Math.ceil((PEAK_DATE-new Date())/86400000);
    if(days>=0&&days<phi&&!confirm('⚠ '+tr('w13_nospray')+'\n\n'+it.alloc.pname+' · '+phi+' days\n'+
      'Peak drop 21-22 Aug is in '+days+' day(s).\n\nSave anyway?'))return;}

  runSaving=true;
  const stamp=now(), rid=uuid();
  // ONE filing, one man-hour figure, split across the lots it covered
  const shares=splitExact(crew*hours,pl.active.map(x=>x.trees));
  try{
    for(let i=0;i<pl.active.length;i++){
      const x=pl.active[i];
      for(const l of draftLines(d)){
        const a=allocOf(d.uuid,l.slot); if(!a)continue;
        const q=+(l.dose*x.mult).toFixed(2); if(!(q>0))continue;
        await persistEvent({uuid:uuid(),type:'STOCK_OUT',dt:stamp,
          pid:a.pid,pname:a.pname,ai:l.ai,qty:q,unit:a.unit,lot:x.lot,
          set:d.code+' - '+d.name,
          cost:+(q*(+a.mac||0)).toFixed(2), mac:+a.mac||0,
          progId:d.uuid, progSet:d.code+' · '+d.name, replyId:rid,
          dirRun:true, dirCode:d.code, dirMethod:d.methodLabel, dirStage:d.stageLabel,
          dirProgram:d.program, slot:l.slot, dose:+l.dose, basis:d.basis,
          // the tree count is the source figure; litres and tanks are derived FROM it
          treesDone:x.trees, treesInLot:x.total, lptUsed:x.lpt,
          litres:x.litres, tanks:x.water?+x.tanks.toFixed(3):0,
          trees:x.water?0:x.trees, water:x.litres, waterKeyed:false, tankL:TANK_L,
          lotFinished:x.finished, lotsInReport:pl.active.length,
          // crew and hours stay TRUE on every row; only the man-hour SHARE differs, so
          // the record never lies about how many people were actually on the job
          crew:crew, hours:hours, manHours:shares[i],
          worker:CFG.worker, device:CFG.device, synced:false});}}
  } finally { runSaving=false; }
  LAST_CREW={crew:crew,hours:hours}; if(db)await put('kv',{k:'lastcrew',v:LAST_CREW});
  const n=pl.trees, lots=pl.active.map(x=>x.lot).join(', ');
  closeRun();
  toast(tr('t14_saved')+' · '+n+' '+tr('t14_trees')+' · Lot '+lots);
  refreshInventoryViews();renderOpsTasks();renderOpsHistory();renderRunCost();
  renderProgRecord();renderAllocCard();renderLabour();renderHub();badge();}

/* ================= OWNER / MARKETER · daily, monthly, yearly run costing ==============
   Derived, never stored. Every figure below is re-read from the event log each time this
   renders, so it can never drift from the stock movements that produced it. */
function runCostRollup(){
  const mac=movingAvgCost();
  const today=todayStr(), month=today.slice(0,7), year=today.slice(0,4);
  const blank=()=>{const o={total:0,runs:{},labour:0};LOT_KEYS.forEach(L=>o[L]=0);return o;};
  const out={day:blank(),month:blank(),year:blank()};
  const byMonth={};
  EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.dirRun).forEach(e=>{
    const dt=String(e.dt||''), d=dt.slice(0,10), mo=dt.slice(0,7), yr=dt.slice(0,4);
    const v=outCostOf(e,mac), L=e.lot||'';
    const hit=[];
    if(d===today)hit.push(out.day);
    if(mo===month)hit.push(out.month);
    if(yr===year)hit.push(out.year);
    hit.forEach(o=>{o.total+=v; if(o[L]!=null)o[L]+=v; o.runs[e.replyId]=1;});
    if(!byMonth[mo])byMonth[mo]={mo:mo,total:0,runs:{},tanks:{}};
    byMonth[mo].total+=v; byMonth[mo].runs[e.replyId]=1;
    byMonth[mo].tanks[e.replyId]=+e.tanks||0;});
  return {day:out.day,month:out.month,year:out.year,
    months:Object.keys(byMonth).sort().reverse().map(k=>byMonth[k])};}
function renderRunCost(){
  const box=$('runcostbox'); if(!box)return;
  if(!roleAllows('runcostcard')||!SHOW_VALUES){box.innerHTML='';return;}
  const r=runCostRollup();
  const tile=(lbl,o)=>'<div class="kpi"><div class="v">'+rm(o.total)+'</div>'+
    '<div class="l">'+esc(lbl)+' · '+Object.keys(o.runs).length+' run'+(Object.keys(o.runs).length===1?'':'s')+'</div></div>';
  const lotRow=(lbl,o)=>'<tr><td><b>'+esc(lbl)+'</b></td>'+
    LOT_KEYS.map(L=>'<td class="num">'+rm(o[L])+'</td>').join('')+
    '<td class="num"><b>'+rm(o.total)+'</b></td></tr>';
  box.innerHTML=
    '<div class="kpis k3">'+tile(tr('rn_today'),r.day)+tile(tr('rn_month'),r.month)+tile(tr('rn_year'),r.year)+'</div>'+
    '<div class="tblwrap full"><table class="tbl">'+
      '<tr><th>Period</th>'+LOT_KEYS.map(L=>'<th class="num">Lot '+L+'</th>').join('')+'<th class="num">Total</th></tr>'+
      lotRow(tr('rn_today'),r.day)+lotRow(tr('rn_month'),r.month)+lotRow(tr('rn_year'),r.year)+
    '</table></div>'+
    (r.months.length
      ?('<div class="sec" style="margin-top:14px">Month by month</div><div class="tblwrap full"><table class="tbl">'+
        '<tr><th>Month</th><th class="num">Runs</th><th class="num">Tanks</th><th class="num">Material cost</th></tr>'+
        r.months.map(m=>'<tr><td>'+esc(m.mo)+'</td><td class="num">'+Object.keys(m.runs).length+'</td>'+
          '<td class="num">'+nf(Object.keys(m.tanks).reduce((s,k)=>s+m.tanks[k],0))+'</td>'+
          '<td class="num">'+rm(m.total)+'</td></tr>').join('')+'</table></div>')
      :'<div class="small" style="margin-top:12px">No directive has been run yet. The moment a worker secures a work log, it lands here.</div>')+
    '<p class="small" style="margin-top:10px">Every figure is re-read from the stock ledger each time this screen opens — it is derived, never stored, so it cannot drift from the material that actually left the store. Cost is the moving average at the moment of issue.</p>';}

/* ======================================================================================
   v3.15 · THE PROGRAMME RECORD — monthly and yearly
   ======================================================================================
   Every figure here is DERIVED: the due date off the directive, the completion date off
   the stock-out rows it produced. Nothing is stored twice, so the record can never drift
   from the work that actually happened.

   Four buckets that do not overlap, because they need different action:
       finished on time · finished late · not finished · (of those, how many already late)
   "Finished late" and "still not done and past its date" were deliberately NOT added into
   one number — one is a lesson, the other is a job somebody has to go and do today.
   ====================================================================================== */
let RP_MONTH='';

/** A programme belongs to the month of the date it had to be finished by. */
function dirMonth(d){
  const x=d.due||String(d.issuedAt||d.at||'').slice(0,10);
  return String(x).slice(0,7);}
function recordDirectives(){
  return AGRO_DRAFTS.filter(d=>!d.deleted&&d.status!=='DRAFT'&&dirMonth(d));}
function recordMonths(){
  return [...new Set(recordDirectives().map(dirMonth))].sort().reverse();}
function monthNameOf(mo){
  const M=(LANG==='ms')?MONTH_LONG_MS:MONTH_LONG_EN;
  const i=+String(mo).slice(5,7)-1;
  return (M[i]||mo)+' '+String(mo).slice(0,4);}

function recordRollup(mo){
  const rows=recordDirectives().filter(d=>dirMonth(d)===mo)
    .map(d=>({d:d,r:dirRecord(d)}))
    .sort((a,b)=>String(a.d.due||'').localeCompare(String(b.d.due||'')));
  return {rows:rows,
    issued:rows.length,
    ontime:rows.filter(x=>x.r.k==='ONTIME').length,
    latedone:rows.filter(x=>x.r.k==='LATE').length,
    open:rows.filter(x=>x.r.k==='OPEN'||x.r.k==='OVERDUE').length,
    overdue:rows.filter(x=>x.r.k==='OVERDUE').length};}

function renderProgRecord(){
  const box=$('progrecordbox'); if(!box)return;
  if(!roleAllows('progrecord')){box.innerHTML='';return;}
  const months=recordMonths();
  if(!months.length){box.innerHTML='<div class="alertnone">'+esc(tr('rp_none'))+'</div>';return;}
  if(!RP_MONTH||months.indexOf(RP_MONTH)<0)RP_MONTH=months[0];
  const m=recordRollup(RP_MONTH);

  // month strip
  let h='<div class="mo">'+months.map(k=>
    '<div class="'+(k===RP_MONTH?'on':'')+'" onclick="rpMonth(\''+k+'\')">'+
    esc(monthNameOf(k))+'</div>').join('')+'</div>';

  // four non-overlapping counts
  h+='<div class="kpis">'+
    '<div class="kpi"><div class="v">'+m.issued+'</div><div class="l">'+esc(tr('rp_issued'))+'</div></div>'+
    '<div class="kpi kg"><div class="v">'+m.ontime+'</div><div class="l">'+esc(tr('rp_ontime'))+'</div></div>'+
    '<div class="kpi kr"><div class="v">'+m.latedone+'</div><div class="l">'+esc(tr('rp_latedone'))+'</div></div>'+
    '<div class="kpi ka"><div class="v">'+m.open+'</div><div class="l">'+esc(tr('rp_open'))+
      (m.overdue?('<span class="sub2">'+esc(tr('rp_overdue').replace('{n}',String(m.overdue)))+'</span>'):'')+
    '</div></div></div>';

  // the month's programmes
  h+='<div class="sec" style="margin-top:14px">'+esc(tr('rp_thismonth'))+'</div>';
  h+=m.rows.length?m.rows.map(x=>{
      const cost=dirCostOf(x.d.uuid);
      return '<div class="mrow"><span class="mn">'+esc(x.d.code)+' · '+esc(x.d.name)+
        '<span class="ms2">'+esc(tr('dt_due'))+' '+esc(dateShort(x.d.due))+
          ' · '+(x.r.done?(esc(tr('rp_done'))+' '+esc(dateShort(x.r.done))):esc(tr('rp_notdone')))+
          (SHOW_VALUES&&cost>0?(' · '+rm(cost)):'')+'</span></span>'+
        '<span class="chip '+x.r.cls+'">'+esc(x.r.chip)+'</span></div>';}).join('')
    :'<div class="alertnone">'+esc(tr('rp_none'))+'</div>';

  // the year, month by month
  const yr=RP_MONTH.slice(0,4);
  const byMo={};
  recordDirectives().filter(d=>dirMonth(d).slice(0,4)===yr).forEach(d=>{
    const k=dirMonth(d), r=dirRecord(d);
    if(!byMo[k])byMo[k]={n:0,ok:0,late:0};
    byMo[k].n++;
    if(r.k==='ONTIME')byMo[k].ok++; else if(r.k==='LATE')byMo[k].late++;});
  const keys=Object.keys(byMo).sort();
  let tn=0,tok=0,tl=0;
  h+='<div class="sec" style="margin-top:16px">'+esc(tr('rp_year'))+' '+esc(yr)+'</div>'+
    '<div class="tblwrap full"><table class="tbl"><tr>'+
      '<th>'+esc(tr('rp_mo'))+'</th><th class="num">'+esc(tr('rp_out'))+'</th>'+
      '<th class="num">'+esc(tr('rp_ok'))+'</th><th class="num">'+esc(tr('rp_lt'))+'</th>'+
      '<th class="num">%</th></tr>'+
    keys.map(k=>{const b=byMo[k];tn+=b.n;tok+=b.ok;tl+=b.late;
      const fin=b.ok+b.late, pct=fin?Math.round(b.ok/fin*100):null;
      return '<tr><td>'+esc(monthNameOf(k).split(' ')[0])+'</td><td class="num">'+b.n+'</td>'+
        '<td class="num" style="color:var(--green)">'+b.ok+'</td>'+
        '<td class="num"'+(b.late?' style="color:#b3261e"':'')+'>'+b.late+'</td>'+
        '<td class="num">'+(pct==null?'—':pct+'%')+'</td></tr>';}).join('')+
    '<tr class="totrow"><td><b>'+esc(tr('rp_total'))+'</b></td><td class="num"><b>'+tn+'</b></td>'+
      '<td class="num" style="color:var(--green)"><b>'+tok+'</b></td>'+
      '<td class="num" style="color:#b3261e"><b>'+tl+'</b></td>'+
      '<td class="num"><b>'+((tok+tl)?(Math.round(tok/(tok+tl)*100)+'%'):'—')+'</b></td></tr>'+
    '</table></div>';
  // v3.15 FIX (screenshot) — with nothing finished yet, "0%" reads as "we failed
  // everything" when it actually means "nothing has been scored". Say that instead.
  const fin=tok+tl;
  h+='<div class="sec" style="margin-top:13px">'+esc(tr('rp_yearpct'))+'</div>';
  if(fin){
    const pct=Math.round(tok/fin*100);
    h+='<div class="pctbar"><i style="width:'+pct+'%"></i></div>'+
       '<div class="exphint" style="margin-top:5px"><b>'+pct+'%</b> '+esc(tr('rp_pct'))+
       ' ('+fin+').</div>';
  } else {
    h+='<div class="exphint">'+esc(tr('rp_noscore'))+'</div>';
  }
  h+='<p class="small" style="margin-top:9px">'+esc(tr('rp_scored'))+'</p>';
  box.innerHTML=h;}
function rpMonth(k){RP_MONTH=k;renderProgRecord();}

/** What one directive's runs cost, straight off the ledger. */
function dirCostOf(u){
  const mac=movingAvgCost();
  return EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.dirRun&&e.progId===u)
    .reduce((s,e)=>s+outCostOf(e,mac),0);}


/* ======================================================================================
   v3.16 · WORKSPACE ISOLATION PASS
   ======================================================================================
   Three things live here:
     1. logTreeVisit()  — ONE commit for a whole tree visit (was two save buttons).
     2. The Owner's Executive Summary maths: variance, rain, drawdown, drop forecast and
        the prepaid-credit recommendation.
     3. renderCmdExec() — the only new painter Tile F needs; its other two tabs reuse
        panels the agro and admin tiles already render.
   Nothing in here re-implements an existing calculation. Every figure is read from the
   same ledgers the rest of the app reads, so a number shown here cannot disagree with the
   screen it came from.
   ====================================================================================== */

/* ---------- 1 · ONE UNIFIED COMMIT FOR THE WHOLE TREE VISIT --------------------------
   Card A had "SAVE GOOD FRUIT" and Card B had "LOG FRUIT LOST". At a tree with both good
   and rotten fruit the worker pressed save twice, and a visit where only the first press
   happened was indistinguishable from a finished one. Both cards now commit together
   under a single visitId, so a visit is atomic in the ledger as well as on the screen.

   The two originals are kept below, unreferenced by any button, because saveDrop() and
   saveRotten() are called by name in the existing test suite. They are not a second write
   path — logTreeVisit() does its own persisting and never calls them. */
let savingVisit=false;

/** The one-line summary under the unified button. Mirrors what will actually be saved. */
function visitSumPaint(){
  const box=$('visit-sum'); if(!box)return;
  const g=gTotal(), r=(typeof rotQty==='number'?rotQty:0);
  if(!g&&!r){box.className='gtot zero';box.textContent=tr('cv_none','Nothing counted yet.');return;}
  box.className='gtot';
  const bits=[];
  if(g)bits.push(g+' '+tr('cv_good','good'));
  if(r)bits.push(r+' '+tr('cv_lost','lost'));
  box.textContent=bits.join('  ·  ');}

/** Everything the visit is about to write, validated before a single event is persisted. */
function visitBlockers(){
  const out=[];
  const g=gTotal(), r=(typeof rotQty==='number'?rotQty:0);
  if(!curTree)out.push(tr('cv_notree','Pick a tree first.'));
  if(!g&&!r)out.push(tr('cv_nothing','Count some good fruit, or some lost fruit, before saving.'));
  if(r>0&&!rotCause)out.push(tr('cv_nocause','Tag the damage cause — a loss count without a cause cannot be acted on.'));
  if(r>0&&rotTied===null)out.push(tr('cv_notied','Say whether the lost fruit was tied or untied.'));
  return out;}

async function logTreeVisit(){
  const err=$('visit-err'); if(err)err.textContent='';
  if(savingVisit)return;
  const blockers=visitBlockers();
  if(blockers.length){if(err)err.textContent=blockers[0];return;}

  const t=curTree;
  const good=gTotal(), lost=rotQty;
  const L=treeLedger(t.id);

  // ---- guards. Secured drops and tied rotten BOTH come off the string, so they are
  // checked against the balance TOGETHER. Asking twice about the same balance is exactly
  // the double-prompt the two-button design produced.
  const sec=GRADE_ORDER.filter(g=>GKIND[g]==='SECURED').reduce((a,g)=>a+(GCOUNT[g]||0),0);
  const uns=good-sec;
  const offString=sec+((lost>0&&rotTied)?lost:0);
  if(offString>0&&L.current_tied_balance>0&&offString>L.current_tied_balance&&
     !confirm('⚠ '+t.id+' has only '+L.current_tied_balance+' fruit still on the string.\n'+
              'This visit takes '+offString+' off it.\n\nSave anyway?'))return;
  const offUntied=uns+((lost>0&&!rotTied)?lost:0);
  if(offUntied>0&&L.untied_hanging_estimate!==null&&L.untied_hanging_estimate>0&&
     offUntied>L.untied_hanging_estimate&&
     !confirm('⚠ '+t.id+' has about '+L.untied_hanging_estimate+' untied fruit left by the July census.\n'+
              'This visit logs '+offUntied+' untied.\n\nSave anyway?'))return;
  if(lastDrop.tree===t.id && (Date.now()-lastDrop.time)<120000 &&
     !confirm('⚠ '+t.id+' was already logged less than 2 minutes ago.\nSave AGAIN as a NEW visit?'))return;

  savingVisit=true;
  try{
    // One stamp, one visitId. pickId keeps its v3.0 meaning so every existing reader of a
    // DROP row — the audit, the trace, the yield check — carries on working unchanged.
    const stamp=now(), visitId=uuid();
    for(const g of GRADE_ORDER){
      const n=GCOUNT[g]||0; if(!(n>0))continue;
      await persistEvent({uuid:uuid(),type:'DROP',dt:stamp,tree:t.id,lot:t.lot,clone:t.clone||'',
        qty:n,grade:g,secured:(GKIND[g]==='SECURED'),dropKind:GKIND[g],
        pickId:visitId,visitId:visitId,
        estkg:+(n*(AVG_KG[t.clone]||1.6)).toFixed(1),
        worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});}
    if(lost>0){
      await persistEvent({uuid:uuid(),type:'ROTTEN',dt:stamp,tree:t.id,lot:t.lot,clone:t.clone||'',
        qty:lost,cause:rotCause,causeLabel:ROT_CAUSE[rotCause].label,tied:rotTied,
        pickId:visitId,visitId:visitId,
        estkg:+(lost*(AVG_KG[t.clone]||1.6)).toFixed(1),
        worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});}
    lastDrop={tree:t.id,time:Date.now()};

    const after=treeLedger(t.id);
    const parts=[];
    if(good)parts.push(GRADE_ORDER.filter(g=>GCOUNT[g]>0).map(g=>GCOUNT[g]+g).join(' + '));
    if(lost)parts.push('🍂 '+lost+' '+ROT_CAUSE[rotCause].label);
    gClearAll(); rotReset(); visitSumPaint();
    badge();
    toast('✅ '+parts.join('  ·  ')+' @ '+t.id+' · '+
      nf(Math.max(0,after.current_tied_balance))+' still on the string'+
      (navigator.onLine?'':' (queued)'));
    refreshTreeBoard();renderTying();renderWave();renderMyLogs();renderHub();
  } finally { savingVisit=false; }}

/* ---------- 2 · EXECUTIVE SUMMARY MATHS --------------------------------------------- */

/** Unsecured drops on ONE tree in ONE day that mean the string work is not holding. */
const VARIANCE_UNSEC_MIN=3;

/** Per-tree unsecured drops for a day, biggest first. Reads DROP rows only. */
function varianceRows(dstr){
  const day=dstr||todayStr(), by={};
  EVENTS.forEach(e=>{
    if(e.type!=='DROP')return;
    if(String(e.dt||'').slice(0,10)!==day)return;
    if(isSecuredDrop(e))return;            // secured fruit was tied; it is not a variance
    const k=e.tree; if(!k)return;
    if(!by[k])by[k]={tree:k,lot:e.lot||'',clone:e.clone||'',unsecured:0};
    by[k].unsecured+=(+e.qty||0);});
  return Object.values(by).sort((a,b)=>b.unsecured-a.unsecured);}

/** Only the trees at or past the threshold — this is what flashes and what badges. */
function varianceAlerts(dstr){
  return varianceRows(dstr).filter(r=>r.unsecured>=VARIANCE_UNSEC_MIN);}

/** Fruit dropped per day over the last N days. The forecast's only empirical input. */
function recentDropRate(days){
  const d=days||7;
  const from=ymd(addDays(dayStart(new Date()),-(d-1)));
  let n=0;
  EVENTS.forEach(e=>{
    if(e.type!=='DROP')return;
    if(String(e.dt||'').slice(0,10)>=from)n+=(+e.qty||0);});
  return {days:d,fruit:n,perDay:+(n/d).toFixed(1)};}

/** Average RM actually realised per kg, from dispatches that have already been priced.
 *  Returns null when nothing has been dispatched yet — the forecast then says so rather
 *  than inventing a price, exactly as the agronomy code refuses to invent a conversion. */
function avgRealisedRM(){
  let kg=0,rm=0;
  EVENTS.forEach(e=>{
    if(e.type!=='DISPATCH')return;
    kg+=(+e.total_kg||0); rm+=(+e.total_value_rm||0);});
  return kg>0?+(rm/kg).toFixed(2):null;}

/** The next wave: how much is still hanging, how fast it is coming, and when it peaks. */
function dropForecast(){
  let onString=0,untied=0,noCensus=0;
  LOT_KEYS.forEach(L=>{
    const l=lotLedger(L);
    onString+=Math.max(0,l.current_tied_balance);
    untied  +=Math.max(0,l.untied_hanging_estimate);
    noCensus+=l.noCensus;});
  const r7=recentDropRate(7);
  const toPeak=Math.ceil((PEAK_DATE-dayStart(new Date()))/86400000);
  const hanging=onString+untied;
  // next7 can never exceed what is actually still on the trees — a run rate extrapolated
  // past the crop is how a forecast ends up promising fruit that does not exist.
  const next7=Math.min(hanging,Math.round(r7.perDay*7));
  let kgSum=0,n=0;
  TREE_MASTER.forEach(t=>{kgSum+=(AVG_KG[t.clone]||1.6);n++;});
  const kgPerFruit=n?+(kgSum/n).toFixed(2):1.6;
  return {onString:onString,untied:untied,hanging:hanging,noCensus:noCensus,
    perDay:r7.perDay,window:r7.days,next7:next7,
    kgPerFruit:kgPerFruit,next7Kg:+(next7*kgPerFruit).toFixed(1),
    toPeak:toPeak,
    inWave:(toPeak<=14&&toPeak>=-14),
    known:(r7.fruit>0),                     // no drops logged yet = no rate to project from
    derived:true};}

/** What each contract merchant's prepaid pool should be carrying into the coming wave.
 *  Share of the wave is each merchant's share of what they have ACTUALLY bought, not an
 *  even split — Roll and Seng Kee do not take the same volume. */
function creditAdvice(){
  const f=dropForecast(), rate=avgRealisedRM();
  const live=RETAILERS.filter(r=>String(r.status||'Active').toLowerCase()==='active'&&
                                 String(r.pricing||'').toUpperCase()==='CONTRACT');
  if(!live.length)return [];
  const spend={}; let tot=0;
  live.forEach(r=>{const s=retailerSpend(r.id); spend[r.id]=s; tot+=s;});
  return live.map(r=>{
    const share=tot>0?spend[r.id]/tot:1/live.length;
    const kg=+(f.next7Kg*share).toFixed(1);
    const known=(rate!==null&&f.known);
    const need=known?Math.round(kg*rate):null;
    const bal=retailerCredit(r.id);
    // 25% headroom, rounded up to the nearest RM1,000, never below the opening pool.
    const target=known?Math.max(+r.opening_credit_rm||0,Math.ceil((need*1.25)/1000)*1000):null;
    // v3.16 — a pool that is ALREADY negative has not "run out mid-wave", it ran out
    // some time ago and the merchant is taking fruit on arrears. Screenshot review caught
    // the single message covering both; they need different words and different urgency.
    return {id:r.id,name:r.name,known:known,
      share:+(share*100).toFixed(1),kg:kg,need:need,balance:bal,target:target,
      arrears:bal<0?Math.round(-bal):0,
      overdrawn:bal<0,
      topup:(known&&target>bal)?Math.round(target-bal):0,
      raise:(known&&bal<need)};});}

/* The brief writes material drawdown as ((Opening + Receipts - Closing) / Peak) * 100.
   Receipts are never negative, so the highest value the store holds in a month IS
   Opening + Receipts — the brief's Peak and buildMonthMatrix()'s existing denominator are
   the same number. drawdown_pct is therefore already the briefed figure; this function
   exists so that equivalence is stated in code and asserted by a test, rather than being
   a claim in a comment. It is deliberately NOT a second, differently-rounded metric. */
function peakDrawdownPct(m){
  const open=+m.open_val||0, rec=+m.in_val||0, close=+m.close_val||0;
  const peak=Math.max(open,open+rec);
  return peak>0?+(((open+rec-close)/peak)*100).toFixed(1):0;}

/* ---------- 3 · THE PAINTER ---------------------------------------------------------- */
function renderCmdExec(){
  const box=$('cmdexecbox'); if(!box)return;
  if(!roleAllows('cmdexec')){box.innerHTML='';return;}   // no markup at all for anyone else
  const H=[];

  // ---- daily tree variance ----------------------------------------------------------
  const va=varianceAlerts();
  if(va.length){
    H.push('<div class="varalert"><div class="vh">⚠ '+va.length+' '+
      esc(tr('ex_varhead','tree(s) dropping unsecured fruit today'))+'</div>'+
      '<div class="vb">'+va.slice(0,8).map(r=>esc(r.tree)+' · <b>'+nf(r.unsecured)+'</b> '+
        esc(tr('ex_unsec','unsecured'))+(r.clone?' · '+esc(r.clone):'')).join('<br>')+
      (va.length>8?'<br>… +'+(va.length-8)+' more':'')+
      '<br><br>'+VARIANCE_UNSEC_MIN+' '+esc(tr('ex_varwhy',
        'or more unsecured drops on one tree in one day means the string work is not holding. Check the tying on these trees before the wave.'))+
      '</div></div>');
  } else {
    H.push('<div class="varalert calm"><div class="vh">✓ '+
      esc(tr('ex_varok','No tree is over the unsecured-drop limit today'))+'</div>'+
      '<div class="vb">'+esc(tr('ex_varoka','Fewer than'))+' '+VARIANCE_UNSEC_MIN+' '+
      esc(tr('ex_varokb','unsecured drops on every tree logged so far.'))+'</div></div>');}

  // ---- rain ------------------------------------------------------------------------
  const w=wetFlag();
  H.push('<div class="exsub">'+esc(tr('ex_rain','Rain'))+'</div>');
  H.push('<div class="'+(w.wet?'varalert':'varalert calm')+'">'+
    '<div class="vh">'+(w.wet?'🌧️ ':'✓ ')+nf(w.mm)+' mm / '+RAIN_WET_DAYS+' '+
      esc(tr('ex_days','days'))+'</div>'+
    '<div class="vb">'+(w.wet
      ? esc(tr('ex_wet_a','Above the'))+' '+RAIN_WET_MM+' '+esc(tr('ex_wet','mm moisture line — wet canopy, wash-off and root-rot pressure. Hold contact sprays.'))
      : esc(tr('ex_dry_a','Under the'))+' '+RAIN_WET_MM+' '+esc(tr('ex_dry','mm moisture line. Spray windows are open.')))+
    '</div></div>');

  // ---- the drop forecast -------------------------------------------------------------
  const f=dropForecast();
  H.push('<div class="exsub">'+esc(tr('ex_fcast','Drop forecast'))+'</div>');
  if(!f.known){
    H.push('<div class="fcast"><div class="fh">'+esc(tr('ex_norate','No drop rate yet'))+'</div>'+
      '<div class="fb">'+esc(tr('ex_norateb','Nothing has been collected in the last 7 days, so there is no run rate to project from. '+
      'The forecast appears as soon as the crew log a day of drops.'))+'</div></div>');
  } else {
    H.push('<div class="fcast"><div class="fh">'+
      (f.inWave?'🌊 ':'📈 ')+
      esc(tr('ex_next7','Next 7 days'))+': ≈ '+nf(f.next7)+' '+esc(tr('ex_fruit','fruit'))+
      ' · ≈ '+nf(f.next7Kg)+' kg</div>'+
      '<div class="fb">'+
      esc(tr('ex_rate','Running at'))+' ≈ '+nf(f.perDay)+' '+esc(tr('ex_perday','fruit a day'))+
      ' · '+nf(f.hanging)+' '+esc(tr('ex_stillon','still on the trees'))+
      ' ('+nf(f.onString)+' '+esc(tr('ex_tied','tied'))+', '+nf(f.untied)+' '+esc(tr('ex_untied','untied'))+')'+
      '<br>'+(f.toPeak>0
        ? esc(tr('ex_topeak','Projected peak in'))+' <b>'+f.toPeak+' '+esc(tr('ex_days','days'))+'</b>'
        : esc(tr('ex_pastpeak','Past the projected peak date')))+
      (f.inWave?(' — <b>'+esc(tr('ex_inwave','wave window open'))+'</b>'):'')+
      (f.noCensus?('<br>'+esc(tr('ex_nocensus','Leaves out'))+' '+f.noCensus+' '+
        esc(tr('ex_nocensusb','trees that were never censused'))):'')+
      '<br><span class="minitag">'+esc(tr('w_derived','DERIVED'))+'</span> '+
      esc(tr('ex_derived','every ≈ figure is computed from the run rate and the census, not keyed by anyone'))+
      '</div></div>');}

  // ---- prepaid credit recommendation --------------------------------------------------
  const ca=creditAdvice();
  if(ca.length){
    H.push('<div class="exsub">'+esc(tr('ex_credit','Prepaid credit for the coming wave'))+'</div>');
    ca.forEach(c=>{
      if(!c.known){
        H.push('<div class="credrec"><div class="fh">'+esc(c.name)+'</div>'+
          '<div class="fb">'+esc(tr('ex_credunknown','No dispatch history priced yet, so no ceiling can be recommended without guessing a price per kg.'))+
          '<br>'+esc(tr('ex_balance','Balance now'))+': <b>RM '+nf(c.balance)+'</b></div></div>');
        return;}
      H.push('<div class="credrec'+(c.overdrawn?' hot':'')+'"><div class="fh">'+
        (c.overdrawn?'🛑 ':(c.raise?'⚠ ':'✓ '))+esc(c.name)+
        (c.topup>0
          ? ' — '+esc(tr('ex_topup','top up by'))+' <b>RM '+nf(c.topup)+'</b>'
          : ' — '+esc(tr('ex_credok','covers the wave')))+
        '</div>'+
        '<div class="fb">'+
        esc(tr('ex_share','Takes'))+' '+nf(c.share)+'% '+esc(tr('ex_ofvolume','of dispatched value'))+
        ' → ≈ '+nf(c.kg)+' kg '+esc(tr('ex_next7low','over the next 7 days'))+
        ' ≈ <b>RM '+nf(c.need)+'</b><br>'+
        esc(tr('ex_balance','Balance now'))+': <b>RM '+nf(c.balance)+'</b> · '+
        esc(tr('ex_target','recommended ceiling'))+' <b>RM '+nf(c.target)+'</b>'+
        (c.overdrawn
          ? ('<br><b>'+esc(tr('ex_credarrears','Already overdrawn'))+' — RM '+nf(c.arrears)+' '+
             esc(tr('ex_credarrears2','of fruit has gone out against a pool that is empty. The top-up above clears that first, then funds the wave.'))+'</b>')
          : (c.raise?('<br><b>'+esc(tr('ex_credshort','The pool runs out mid-wave at the current rate.'))+'</b>'):''))+
        '</div></div>');});}

  // ---- the month matrix: retailer revenue + material drawdown -------------------------
  const mm=buildMonthMatrix();
  const m=mm.months[0];
  H.push('<div class="exsub">'+esc(tr('ex_month','This month'))+
    (m?' · '+esc(m.label):'')+'</div>');
  if(!m){
    H.push('<div class="vb">'+esc(tr('ex_nomonth','No dispatches or stock movements recorded yet.'))+'</div>');
  } else {
    const names=Object.keys(m.revenue).sort((a,b)=>m.revenue[b]-m.revenue[a]);
    H.push(names.length
      ? names.map(nm=>'<div class="exrow"><span class="k">'+esc(nm)+'</span>'+
          '<span class="v">RM '+nf(m.revenue[nm])+'</span></div>').join('')
      : '<div class="exrow"><span class="k">'+esc(tr('ex_norev','No retailer revenue yet'))+'</span><span class="v">—</span></div>');
    H.push('<div class="exrow"><span class="k">'+esc(tr('ex_revtot','Revenue total'))+'</span>'+
      '<span class="v">RM '+nf(m.revenue_total)+'</span></div>');
    H.push('<div class="exrow"><span class="k">'+esc(tr('ex_spend','Material + labour'))+'</span>'+
      '<span class="v">RM '+nf(m.spend_total)+'</span></div>');
    H.push('<div class="exrow"><span class="k">'+esc(tr('ex_margin','Margin'))+'</span>'+
      '<span class="v">RM '+nf(m.margin_rm)+'</span></div>');
    H.push('<div class="exrow"><span class="k">'+esc(tr('ex_draw','Material drawdown'))+
      '<br><span class="minitag">(OPEN + IN − CLOSE) / PEAK</span></span>'+
      '<span class="v">'+nf(peakDrawdownPct(m))+'%</span></div>');
    H.push('<div class="exrow"><span class="k">'+esc(tr('ex_kg','Dispatched'))+'</span>'+
      '<span class="v">'+nf(m.kg_total)+' kg · '+nf(m.invoices)+' '+esc(tr('ex_inv','invoices'))+'</span></div>');}

  box.innerHTML=H.join('');}

/* =====================================================================================
   v3.17 · TILE F TAB 1 — WHAT NEEDS THE OWNER TODAY
   =====================================================================================
   The Executive Summary says what the farm IS. This says what the Owner has to DO, and
   it is deliberately the first tab: opening the app should answer "is anything on fire"
   before it answers anything else.

   Two rules run through every row:
     1. Status is COLOUR + ICON + WORD. Never colour alone. The amber in this palette
        measures 2.09:1 against a white card - a phone in the sun, held by a man who may
        be colour-blind, cannot read a bare amber pill. So every count carries a word.
     2. Every row names the exact screen that fixes it, and tapping the row goes there.
        A dashboard that tells you something is wrong but not where to fix it has moved
        the problem, not solved it.
   ===================================================================================== */

/** Everything waiting on the Owner, worst first. Each entry knows where it is fixed. */
function needsYou(){
  const out=[];
  const push=(k,ic,n,head,sub,word,mod,tab)=>{
    if(!n)return;
    out.push({k:k,ic:ic,n:n,head:head,sub:sub,word:word,mod:mod,tab:tab});};

  // 1. a tree bleeding unsecured fruit - it costs money today, not next week
  const va=(typeof varianceAlerts==='function')?varianceAlerts():[];
  push('crit','⚠',va.length,tr('cd_a_trees'),tr('cd_s_trees'),tr('cd_w_trees'),'cmd','exec');

  // 2. a programme past its date with work still outstanding
  const od=(typeof overdueDirectives==='function')?overdueDirectives():[];
  push('crit','⏰',od.length,tr('cd_a_late'),
    od.slice(0,3).map(d=>String(d.set||d.name||'')).filter(Boolean).join(' · ')||tr('cd_s_late'),
    tr('cd_w_late'),'reports','record');

  // 3. a weighed load whose credit cannot move until the Owner has looked at the photo
  const pd=(typeof pendingDispatches==='function')?pendingDispatches():[];
  push('crit','📷',pd.length,tr('cd_a_hold'),tr('cd_s_hold'),tr('cd_w_hold'),'mkt','verify');

  // 4. an active ingredient with no brand behind it - this stops the crew dead
  const ua=(typeof unallocatedSlots==='function')?unallocatedSlots():0;
  push('warnr','🔗',ua,tr('cd_a_wait'),tr('cd_s_wait'),tr('cd_w_wait'),'inv','alloc');

  // 5. short for a programme already issued, then merely low
  const ps=(typeof programShortages==='function')?programShortages():[];
  push('warnr','🧪',ps.length,tr('cd_a_short'),tr('cd_s_short'),tr('cd_w_short'),'inv','lvl');
  const ls=(typeof lowStock==='function')?lowStock():[];
  push('warnr','📉',Math.max(0,ls.length-ps.length),tr('cd_a_low'),tr('cd_s_low'),
    tr('cd_w_low'),'inv','lvl');

  // 6. a merchant whose prepaid pool runs dry mid-wave
  const cr=(typeof creditAdvice==='function')?creditAdvice().filter(c=>c.raise||c.overdrawn):[];
  push('warnr','💳',cr.length,tr('cd_a_credit'),
    cr.map(c=>String(c.name||'')).filter(Boolean).join(' · ')||tr('cd_s_credit'),
    tr('cd_w_credit'),'cmd','exec');

  // 7. a tree record frozen until the Owner decides
  const pc=(typeof CORRECTIONS!=='undefined')
    ? CORRECTIONS.filter(c=>c.status==='PENDING') : [];
  push('info','✏️',pc.length,tr('cd_a_corr'),tr('cd_s_corr'),tr('cd_w_new'),'admin','corr');

  // 8. a phone that has gone quiet - every figure above it is incomplete while it is
  const st=phoneFreshness().filter(p=>p.state==='r');
  push('info','📵',st.length,tr('cd_a_stale'),
    st.map(p=>p.who).join(' · ')||tr('cd_s_stale'),tr('cd_w_stale'),'admin','reg');

  return out;}

/** When each phone last put a row into the ledger. A quiet phone is not a quiet farm. */
function phoneFreshness(){
  const last={};
  EVENTS.forEach(e=>{
    const d=e.device||'—', t=String(e.dt||'');
    if(t.length<10)return;
    if(!last[d]||t>last[d].dt)last[d]={dt:t,who:e.worker||''};});
  const nowMs=Date.parse(now())||Date.now();
  return Object.keys(last).sort().map(d=>{
    const t=Date.parse(last[d].dt);
    const mins=isFinite(t)?Math.max(0,Math.round((nowMs-t)/60000)):null;
    let state='g', txt=tr('cd_never');
    if(mins!=null){
      txt = mins<60 ? (mins+' '+tr('cd_minago'))
          : mins<1440 ? (Math.round(mins/60)+' '+tr('cd_hourago'))
          : (Math.round(mins/1440)+' '+tr('cd_dayago'));
      state = mins>=2880 ? 'r' : (mins>=1440 ? 'a' : 'g');}
    else state='r';
    return {device:d,who:last[d].who||d,dt:last[d].dt,mins:mins,state:state,txt:txt};});}

/** One calendar day of everything, keyed YYYY-MM-DD. Built once, read by both tabs. */
function dayRoll(){
  const mac=movingAvgCost();
  const D={};
  const touch=k=>{if(!D[k])D[k]={day:k,fruit:0,rotten:0,tied:0,kg:0,rm_in:0,rm_out:0,mh:0,
    lot:{},grade:{}};return D[k];};
  EVENTS.forEach(e=>{
    const k=String(e.dt||'').slice(0,10); if(k.length!==10)return;
    if(e.type==='DROP'){const r=touch(k);const q=+e.qty||0;
      r.fruit+=q;
      if(LOT_KEYS.indexOf(e.lot)>=0)r.lot[e.lot]=(r.lot[e.lot]||0)+q;
      if(e.grade)r.grade[e.grade]=(r.grade[e.grade]||0)+q;}
    else if(e.type==='DROP_ADJUST'){const r=touch(k);const d=+e.delta||0;
      r.fruit+=d;
      if(LOT_KEYS.indexOf(e.lot)>=0)r.lot[e.lot]=(r.lot[e.lot]||0)+d;}
    else if(e.type==='ROTTEN')       touch(k).rotten+=(+e.qty||0);
    else if(e.type==='ROTTEN_ADJUST')touch(k).rotten+=(+e.delta||0);
    else if(e.type==='TIE')          touch(k).tied+=(+e.n||0);
    else if(e.type==='TIE_ADJUST')   touch(k).tied+=(+e.delta||0);
    else if(e.type==='DISPATCH'){const r=touch(k);
      r.kg+=(+e.total_kg||0); r.rm_in+=(+e.total_value_rm||0);}
    else if(e.type==='STOCK_OUT')    touch(k).rm_out+=outCostOf(e,mac);});
  labourRows().forEach(r=>{
    const k=String(r.dt||'').slice(0,10); if(k.length!==10)return;
    touch(k).mh+=(+r.mh||0);});
  return D;}

/** dd of a Date, as the ledger writes it. */
function dkey(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+
         String(d.getDate()).padStart(2,'0');}
function dayShiftKey(baseKey,n){
  const p=String(baseKey).split('-');
  const d=new Date(+p[0],+p[1]-1,+p[2]);
  d.setDate(d.getDate()+n);
  return dkey(d);}
function monthShort(i){
  const L=(LANG==='ms'&&typeof MONTH_LONG_MS!=='undefined')?MONTH_LONG_MS:MONTH_LONG_EN;
  return String(L[i]||'').slice(0,3);}

function renderCmdToday(){
  const box=$('cmdtodaybox'); if(!box)return;
  if(!roleAllows('cmdtoday')){box.innerHTML='';return;}   // no markup at all for anyone else
  const H=[];
  const D=dayRoll(), tk=todayStr(), yk=dayShiftKey(tk,-1);
  const t=D[tk]||{fruit:0,kg:0,rm_in:0,rm_out:0}, y=D[yk]||null;

  // ---- band 1: what needs you ---------------------------------------------------------
  const items=needsYou();
  H.push('<div class="exsub">'+(items.length?'⚠ ':'✓ ')+esc(tr('cd_needs'))+
    (items.length?(' · '+items.length):'')+'</div>');
  H.push(items.length
    ? '<div class="cdact">'+items.map(a=>
        '<div class="cdrow '+a.k+'" onclick="openModule(\''+a.mod+'\',\''+a.tab+'\')">'+
          '<span class="ic">'+a.ic+'</span>'+
          '<span class="tx"><span class="h">'+esc(a.head)+'</span>'+
            '<span class="s">'+esc(a.sub)+'</span>'+
            '<span class="go">'+esc(goLabel(a.mod,a.tab))+' &rsaquo;</span></span>'+
          // colour + ICON + WORD. Never colour on its own.
          '<span class="cnt">'+nf(a.n)+' '+esc(a.word)+'</span>'+
        '</div>').join('')+'</div>'
    : '<div class="cdclear"><div class="b">✓</div><div class="t">'+esc(tr('cd_clear'))+'</div>'+
      '<div class="s">'+esc(tr('cd_clearsub'))+'</div></div>');

  // ---- band 2: today ------------------------------------------------------------------
  const dl=(a,b,unit)=>{
    if(!y)return '<div class="d fl">'+esc(tr('cd_noyest'))+'</div>';
    const d=a-b;
    if(Math.abs(d)<0.005)return '<div class="d fl">= '+esc(tr('cd_vsyest'))+'</div>';
    return '<div class="d '+(d>0?'up':'dn')+'">'+(d>0?'▲ +':'▼ −')+nf(Math.abs(d))+
      (unit||'')+' '+esc(tr('cd_vsyest'))+'</div>';};
  H.push('<div class="exsub">'+esc(tr('cd_today'))+'</div>');
  H.push('<div class="cdtiles">'+
    '<div class="cdt"><div class="v">'+nf(t.fruit)+'</div><div class="l">'+esc(tr('cd_fruit'))+'</div>'+
      dl(t.fruit,y?y.fruit:0,'')+'</div>'+
    '<div class="cdt"><div class="v">'+nf(t.kg)+'<u> kg</u></div><div class="l">'+esc(tr('cd_kgout'))+'</div>'+
      dl(t.kg,y?y.kg:0,' kg')+'</div>'+
    '<div class="cdt"><div class="v">'+(SHOW_VALUES?rm(t.rm_in):'—')+'</div><div class="l">'+
      esc(tr('cd_rmin'))+'</div>'+(SHOW_VALUES?dl(t.rm_in,y?y.rm_in:0,''):'')+'</div>'+
    '<div class="cdt"><div class="v">'+(SHOW_VALUES?rm(t.rm_out):'—')+'</div><div class="l">'+
      esc(tr('cd_rmout'))+'</div>'+(SHOW_VALUES?dl(t.rm_out,y?y.rm_out:0,''):'')+'</div>'+
    '</div>');

  // ---- band 3: the crop right now ------------------------------------------------------
  const f=dropForecast();
  H.push('<div class="exsub">'+esc(tr('cd_crop'))+'</div>');
  if(!f.hanging&&!f.onString){
    H.push('<div class="alertnone">'+esc(tr('cd_nocrop'))+'</div>');
  } else {
    const shed=Math.max(0,shedCount());
    const top=Math.max(f.onString,f.untied,shed,1);
    const bar=(lab,v,col,unit)=>'<div class="cdcrop"><span class="cl">'+esc(lab)+'</span>'+
      '<span class="cb"><i style="width:'+Math.max(2,Math.round(v/top*100))+'%;background:'+col+'"></i></span>'+
      '<span class="cv">'+nf(v)+'<u> '+esc(unit)+'</u></span></div>';
    H.push(bar(tr('cd_onstring'),f.onString,'var(--green)',tr('cd_fruitu')));
    H.push(bar(tr('cd_untied'),  f.untied,  'var(--amber)',tr('cd_est')));
    H.push(bar(tr('cd_shed'),    shed,      'var(--navy)', tr('cd_fruitu')));
    H.push('<div class="cdcrop" style="border-top:1px solid var(--line);margin-top:4px;padding-top:10px">'+
      '<span class="cl">'+esc(tr('cd_peak'))+'</span>'+
      '<span class="cb"><i style="width:'+Math.max(2,Math.min(100,Math.round((30-Math.min(30,Math.abs(f.toPeak)))/30*100)))+
        '%;background:var(--warn)"></i></span>'+
      '<span class="cv">'+(f.toPeak>0?nf(f.toPeak):'—')+'<u> '+
        esc(f.toPeak>0?tr('cd_days'):tr('cd_past'))+'</u></span></div>');}

  // ---- band 4: this month --------------------------------------------------------------
  const mm=buildMonthMatrix(), m=mm.months[0];
  H.push('<div class="exsub">'+esc(tr('cd_month'))+
    (m?(' · '+esc(monthLabelLocal(m.key))):'')+'</div>');
  if(!m){H.push('<div class="alertnone">'+esc(tr('cd_nomonth'))+'</div>');}
  else{
    H.push('<table class="cbtb">'+
      '<tr><td>'+esc(tr('cd_sold'))+'<u>'+nf(m.kg_total)+' kg · '+nf(m.invoices)+' '+
        esc(tr('ex_inv'))+'</u></td><td class="cbup">'+(SHOW_VALUES?rm(m.revenue_total):'—')+'</td></tr>'+
      '<tr><td>'+esc(tr('cd_material'))+'<u>'+esc(tr('cd_matsub'))+'</u></td>'+
        '<td>'+(SHOW_VALUES?('− '+rm(m.material_total)):'—')+'</td></tr>'+
      '<tr><td>'+esc(tr('cd_labour'))+'<u>'+nf(m.manhours)+' '+esc(tr('cd_labsub'))+
        (LABOUR_RATE_OK?'':' · '+esc(tr('cd_rateoff')))+'</u></td>'+
        '<td>'+(SHOW_VALUES?('− '+rm(m.labour_total)):'—')+'</td></tr>'+
      '<tr class="tot"><td>'+esc(tr('cd_left'))+'</td><td class="'+(m.margin_rm<0?'cbdn':'cbup')+'">'+
        (SHOW_VALUES?rm(m.margin_rm):'—')+'</td></tr>'+
      '</table>');
    const pr=progCounts(m.key);
    H.push('<div class="cdtiles t3" style="margin-top:8px">'+
      '<div class="cdt"><div class="v">'+nf(pr.issued)+'</div><div class="l">'+esc(tr('cd_progout'))+'</div></div>'+
      '<div class="cdt"><div class="v" style="color:var(--green)">'+nf(pr.ontime)+'</div><div class="l">'+
        esc(tr('cd_ontime'))+'</div></div>'+
      '<div class="cdt"><div class="v" style="color:'+(pr.late?'var(--warn)':'var(--muted)')+'">'+
        nf(pr.late)+'</div><div class="l">'+esc(tr('cd_late'))+'</div></div>'+
      '</div>');}

  // ---- band 5: phones ------------------------------------------------------------------
  const ph=phoneFreshness();
  if(ph.length){
    H.push('<div class="exsub">'+esc(tr('cd_phones'))+'</div>');
    H.push(ph.map(p=>'<div class="cdph"><span class="cddot '+p.state+'"></span>'+
      '<span class="n">'+esc(p.who)+'<u>'+esc(p.device)+'</u></span>'+
      '<span class="st '+p.state+'">'+(p.state==='g'?'✓ ':'⚠ ')+esc(p.txt)+'</span></div>').join(''));}

  box.innerHTML=H.join('');}

/** "August 2026" / "Ogos 2026", in the reader's language rather than the ledger's. */
function monthLabelLocal(key){
  const L=(LANG==='ms'&&typeof MONTH_LONG_MS!=='undefined')?MONTH_LONG_MS:MONTH_LONG_EN;
  return (L[+String(key).slice(5,7)-1]||'')+' '+String(key).slice(0,4);}

/** The tile + section a "go and fix it" row points at, in the person's own language. */
function goLabel(mod,tab){
  const m=MODULES[mod]; if(!m)return '';
  const t=(m.tabs||[]).find(x=>x.k===tab);
  return (m.ic||'')+' '+moduleLabel(m)+(t?(' ▸ '+tabLabel(t)):'');}

/** Fruit collected but not yet dispatched. Reuses the backlog maths, never re-derives it. */
function shedCount(){
  let good=0,out=0;
  EVENTS.forEach(e=>{
    if(e.type==='DROP')             good+=(+e.qty||0);
    else if(e.type==='DROP_ADJUST') good+=(+e.delta||0);
    else if(e.type==='DISPATCH')    out +=(+e.fruit_count||0);});
  return Math.max(0,good-out);}

/** Issued / on time / late / open for one YYYY-MM, straight off the programme record. */
function progCounts(monthKey){
  const out={issued:0,ontime:0,late:0,open:0};
  if(typeof recordDirectives!=='function')return out;
  recordDirectives().forEach(d=>{
    if(typeof dirMonth==='function'&&dirMonth(d)!==monthKey)return;
    out.issued++;
    const done=(typeof dirAllDone==='function')&&dirAllDone(d);
    if(!done){out.open++;return;}
    const dd=(typeof dirDoneDate==='function')?dirDoneDate(d):null;
    if(dd&&d.due&&String(dd)>String(d.due))out.late++; else out.ontime++;});
  return out;}

/* =====================================================================================
   v3.17 · TILE F TAB 3 — COMPARE
   =====================================================================================
   One question the rest of the app cannot answer: is this better or worse than before?

   The trap this code exists to avoid is the unfair comparison. On the 5th of the month,
   month-to-date against the WHOLE of last month prints a red -57% that means nothing but
   "the month is not finished". So the previous period is always cut to the SAME NUMBER
   OF DAYS, and the screen says which days it used.

   The second trap is the confident zero. With nothing to compare against, this prints
   "no comparison yet - first period on record", never 0%.
   ===================================================================================== */
let CMP_PER='7', CMP_MET='fruit', CMP_NUM=false, CMP_PICK=null;
const CMP_MEASURES={
  fruit:{lab:'cb_l_fruit',chip:'cb_fruit',ic:'🥭',money:0,good:'up',unit:''},
  kg   :{lab:'cb_l_kg',   chip:'cb_kg',   ic:'⚖️',money:0,good:'up',unit:' kg'},
  rm_in:{lab:'cb_l_in',   chip:'cb_in',   ic:'💰',money:1,good:'up',unit:''},
  rm_out:{lab:'cb_l_mat', chip:'cb_mat',  ic:'🧪',money:1,good:'dn',unit:''}
};
function cmpSetPeriod(p){CMP_PER=p;CMP_PICK=null;renderCmdCompare();}
function cmpSetMeasure(m){CMP_MET=m;CMP_PICK=null;renderCmdCompare();}
function cmpToggleNum(){CMP_NUM=!CMP_NUM;renderCmdCompare();}
function cmpPick(i){CMP_PICK=(CMP_PICK===i?null:i);renderCmdCompare();}

/** The day keys of this period and of a LIKE-FOR-LIKE previous one. */
function cmpSlice(){
  const tk=todayStr();
  const y=+tk.slice(0,4), mo=+tk.slice(5,7), da=+tk.slice(8,10);
  if(CMP_PER==='7'){
    const now=[],prev=[];
    for(let i=6;i>=0;i--)now.push(dayShiftKey(tk,-i));
    for(let i=13;i>=7;i--)prev.push(dayShiftKey(tk,-i));
    return {now:now,prev:prev,grain:'day',vs:tr('cb_vs7'),
      span:now[0]+' → '+now[now.length-1]};}
  if(CMP_PER==='M'){
    const now=[],prev=[];
    const pm=mo===1?12:mo-1, py=mo===1?y-1:y;
    const pmDays=new Date(py,pm,0).getDate();
    for(let d=1;d<=da;d++){
      now.push(y+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0'));
      // a 31st compared against a month that has 30 days simply has no partner day
      if(d<=pmDays)prev.push(py+'-'+String(pm).padStart(2,'0')+'-'+String(d).padStart(2,'0'));}
    return {now:now,prev:prev,grain:'day',vs:tr('cb_vsm'),
      span:'1–'+da+' '+monthShort(mo-1)+' · '+
        tr('cb_ofdays').replace('{d}',da).replace('{n}',new Date(y,mo,0).getDate())};}
  // season = this calendar year to date, against the same span of last year
  const now=[],prev=[];
  const jan=new Date(y,0,1), todayD=new Date(y,mo-1,da);
  for(let d=new Date(jan); d<=todayD; d.setDate(d.getDate()+1))now.push(dkey(d));
  const janP=new Date(y-1,0,1), endP=new Date(y-1,mo-1,da);
  for(let d=new Date(janP); d<=endP; d.setDate(d.getDate()+1))prev.push(dkey(d));
  return {now:now,prev:prev,grain:'month',vs:tr('cb_vss'),
    span:now[0]+' → '+now[now.length-1]+' · '+now.length+' '+tr('cd_days')};}

function cmpSum(D,keys,field){
  let t=0; keys.forEach(k=>{const r=D[k]; if(r)t+=(+r[field]||0);}); return t;}
function cmpPct(a,b){ if(!b)return null; return Math.round((a-b)/b*1000)/10; }
function cmpNiceTop(n){
  if(!(n>0))return 1;
  const p=Math.pow(10,Math.floor(Math.log10(n)));
  return Math.ceil(n/p*2)/2*p;}

function renderCmdCompare(){
  const box=$('cmdcomparebox'); if(!box)return;
  if(!roleAllows('cmdcompare')){box.innerHTML='';return;}
  const M=CMP_MEASURES[CMP_MET]||CMP_MEASURES.fruit;
  const D=dayRoll(), S=cmpSlice();
  const H=[];
  const fmt=v=>M.money?(SHOW_VALUES?rm(v):'—'):(nf(v)+M.unit);

  // ---- the two filter rows, one above the other, above everything they change --------
  const per=[['7','cb_7','cb_7s'],['M','cb_m','cb_ss'],['S','cb_s','cb_ss']];
  H.push('<div class="cbchips">'+per.map(p=>
    '<div class="'+(CMP_PER===p[0]?'on':'')+'" onclick="cmpSetPeriod(\''+p[0]+'\')">'+
      esc(tr(p[1]))+'</div>').join('')+'</div>');
  H.push('<div class="cbchips m">'+Object.keys(CMP_MEASURES).map(k=>{
    const x=CMP_MEASURES[k];
    if(x.money&&!SHOW_VALUES)return '';       // a role without money never sees the chip
    return '<div class="'+(CMP_MET===k?'on':'')+'" onclick="cmpSetMeasure(\''+k+'\')">'+
      x.ic+' '+esc(tr(x.chip))+'</div>';}).join('')+'</div>');

  const nowV=cmpSum(D,S.now,CMP_MET), prevV=cmpSum(D,S.prev,CMP_MET);
  const anything=S.now.some(k=>D[k]);

  if(!anything){
    H.push('<div class="alertnone" style="margin-top:10px">'+esc(tr('cb_nodata'))+'</div>');
    box.innerHTML=H.join(''); return;}

  // ---- the headline and its honest delta ---------------------------------------------
  const p=cmpPct(nowV,prevV);
  let dCls='fl', dTxt='— '+tr('cb_nocmp');
  if(p!==null){
    const better=(M.good==='up')?p>=0:p<=0;
    dCls=Math.abs(p)<0.5?'fl':(better?'up':'dn');
    dTxt=(p>0?'▲ +':p<0?'▼ −':'= ')+Math.abs(p)+'%';}
  H.push('<div class="cbhero"><div class="lab">'+esc(tr(M.lab))+'</div>'+
    '<div class="v">'+fmt(nowV)+'</div>'+
    '<div class="cbdl"><span class="cbdel '+dCls+'">'+esc(dTxt)+'</span>'+
      '<span class="vs">'+esc(p===null?tr('cb_first'):S.vs)+'</span></div>'+
    '<div class="cbspan">📅 '+esc(S.span)+'</div></div>');

  // ---- the bars ------------------------------------------------------------------------
  let ser;
  if(S.grain==='month'){
    const by={};
    S.now.forEach(k=>{const mk=k.slice(0,7); if(!by[mk])by[mk]={v:0,k:mk}; if(D[k])by[mk].v+=(+D[k][CMP_MET]||0);});
    ser=Object.keys(by).sort().map(mk=>({v:by[mk].v,lab:monthShort(+mk.slice(5,7)-1),
      full:monthShort(+mk.slice(5,7)-1)+' '+mk.slice(0,4),now:mk===todayStr().slice(0,7)}));
  } else {
    ser=S.now.map(k=>({v:D[k]?(+D[k][CMP_MET]||0):0,
      lab:(S.now.length<=10?(+k.slice(8,10)+''):((+k.slice(8,10))%5===0||+k.slice(8,10)===1?k.slice(8,10):'')),
      full:(+k.slice(8,10))+' '+monthShort(+k.slice(5,7)-1),
      now:k===todayStr()}));}
  const top=cmpNiceTop(Math.max.apply(null,ser.map(x=>x.v).concat([0])));
  H.push('<div class="cbchart"><div class="cbplot" id="cbplot">'+
    [0,0.5,1].map(fr=>'<div class="cbgl" style="bottom:'+(fr*100)+'%"><b>'+
      (fr===0?'0':(top*fr>=1000?Math.round(top*fr/1000)+'k':nf(Math.round(top*fr))))+'</b></div>').join('')+
    '<div class="cbbars" id="cbbars">'+ser.map((x,i)=>
      '<div class="cbb'+(x.now?' now':'')+(CMP_PICK!==null&&CMP_PICK!==i?' dim':'')+
        '" onclick="cmpPick('+i+')"><i style="height:'+
        (x.v>0?Math.max(1.5,x.v/top*100):0)+'%"></i></div>').join('')+
    '</div></div>'+
    '<div class="cbx">'+ser.map(x=>'<span>'+esc(x.lab)+'</span>').join('')+'</div>'+
    '<div class="cbfoot"><span class="k">'+
      (CMP_PICK!==null&&ser[CMP_PICK]
        ? ('<b>'+esc(ser[CMP_PICK].full)+'</b> · '+fmt(ser[CMP_PICK].v))
        : esc(S.grain==='month'?tr('cb_tapm'):tr('cb_tap')))+'</span>'+
      '<button class="cbtog" onclick="cmpToggleNum()">'+
        esc(CMP_NUM?tr('cb_showchart'):tr('cb_shownum'))+'</button></div>'+
    (CMP_NUM
      ? ('<table class="cbtb" style="border:none;margin-top:9px"><tr><th>'+esc(tr('cb_when'))+
         '</th><th>'+esc(tr(M.lab))+'</th></tr>'+
         ser.map(x=>'<tr><td>'+esc(x.full)+'</td><td>'+fmt(x.v)+'</td></tr>').join('')+
         '<tr class="tot"><td>'+esc(tr('cb_total'))+'</td><td>'+fmt(nowV)+'</td></tr></table>')
      : '')+
    '</div>');

  // ---- money, this period against the one before ---------------------------------------
  if(SHOW_VALUES){
    // Three columns, not four. Four columns of RM on a 430px phone crushed the label
    // into one word per line — caught on the screenshot, not by any assertion. The
    // previous period rides under the current one, which is also how it reads aloud:
    // "eight thousand nine hundred, against five thousand before."
    const hadPrev=S.prev.some(k=>D[k]);
    const row=(lab,sub,f,sign)=>{
      const a=cmpSum(D,S.now,f), b=cmpSum(D,S.prev,f), d=cmpPct(a,b);
      const better=sign>0?(d>=0):(d<=0);
      return '<tr><td>'+esc(lab)+'<u>'+esc(sub)+'</u></td>'+
        '<td>'+(sign<0?'− ':'')+rm(a)+
          (hadPrev?('<u>'+esc(tr('cb_before'))+' '+(b?((sign<0?'− ':'')+rm(b)):'—')+'</u>'):'')+'</td>'+
        (hadPrev?('<td class="'+(d===null?'cbfl':(better?'cbup':'cbdn'))+'">'+
          (d===null?'—':(d>0?'+':'')+d+'%')+'</td>'):'')+'</tr>';};
    const labNow=cmpSum(D,S.now,'mh')*LABOUR_RATE, labPrev=cmpSum(D,S.prev,'mh')*LABOUR_RATE;
    const netNow=cmpSum(D,S.now,'rm_in')-cmpSum(D,S.now,'rm_out')-labNow;
    const netPrev=cmpSum(D,S.prev,'rm_in')-cmpSum(D,S.prev,'rm_out')-labPrev;
    const nd=cmpPct(netNow,netPrev);
    H.push('<div class="exsub">'+esc(tr('cb_money'))+'</div>');
    const ld=cmpPct(labNow,labPrev);
    H.push((LABOUR_RATE_OK?'':'<div class="critbox" style="font-size:11.5px;line-height:1.5">'+
        esc(tr('cd_labour'))+' '+rm(LABOUR_RATE)+'/h — '+esc(tr('cd_ratewarn'))+'</div>')+
      '<table class="cbtb"><tr><th>&nbsp;</th><th>'+esc(tr('cb_thisper'))+'</th>'+
        (hadPrev?('<th>'+esc(tr('cb_change'))+'</th>'):'')+'</tr>'+
      row(tr('cd_sold'),tr('cd_soldsub'),'rm_in',1)+
      row(tr('cd_material'),tr('cd_matsub'),'rm_out',-1)+
      '<tr><td>'+esc(tr('cd_labour'))+'<u>'+nf(cmpSum(D,S.now,'mh'))+' '+esc(tr('cd_labsub'))+'</u></td>'+
        '<td>− '+rm(labNow)+(hadPrev?('<u>'+esc(tr('cb_before'))+' '+(labPrev?'− '+rm(labPrev):'—')+'</u>'):'')+'</td>'+
        (hadPrev?('<td class="cbfl">'+(ld===null?'—':(ld>0?'+':'')+ld+'%')+'</td>'):'')+'</tr>'+
      '<tr class="tot"><td>'+esc(tr('cd_left'))+'</td>'+
        '<td class="'+(netNow<0?'cbdn':'cbup')+'">'+rm(netNow)+
          (hadPrev?('<u>'+esc(tr('cb_before'))+' '+(netPrev?rm(netPrev):'—')+'</u>'):'')+'</td>'+
        (hadPrev?('<td class="'+(nd===null?'cbfl':nd>=0?'cbup':'cbdn')+'">'+
          (nd===null?'—':(nd>0?'+':'')+nd+'%')+'</td>'):'')+'</tr></table>');}

  // ---- grade mix and rotten -------------------------------------------------------------
  const gTot={}, gAll=(GRADE_ORDER||['A','B','C']);
  let gSum=0;
  S.now.forEach(k=>{const r=D[k]; if(!r)return;
    gAll.forEach(g=>{const v=+(r.grade[g]||0); gTot[g]=(gTot[g]||0)+v; gSum+=v;});});
  const rotNow=cmpSum(D,S.now,'rotten'), goodNow=cmpSum(D,S.now,'fruit');
  const rotPrev=cmpSum(D,S.prev,'rotten'), goodPrev=cmpSum(D,S.prev,'fruit');
  const offNow=goodNow+rotNow, offPrev=goodPrev+rotPrev;
  if(offNow>0){
    const pctRotNow=+(rotNow/offNow*100).toFixed(1);
    const pctRotPrev=offPrev>0?+(rotPrev/offPrev*100).toFixed(1):null;
    const cols={A:'var(--green)',B:'var(--navy)',C:'var(--amber)'};
    const segs=gAll.filter(g=>gTot[g]>0).map(g=>({g:g,v:gTot[g]}));
    const segTot=segs.reduce((s,x)=>s+x.v,0)+rotNow;
    H.push('<div class="exsub">'+esc(tr('cb_grade'))+'</div>');
    if(segTot>0){
      H.push('<div class="cbmix">'+
        segs.map(s=>'<i class="'+(s.g==='C'?'am':'')+'" style="width:'+(s.v/segTot*100)+
          '%;background:'+(cols[s.g]||'var(--muted)')+'"><b>'+Math.round(s.v/segTot*100)+'%</b></i>').join('')+
        (rotNow>0?('<i style="width:'+(rotNow/segTot*100)+'%;background:var(--warn)"><b>'+
          Math.round(rotNow/segTot*100)+'%</b></i>'):'')+
        '</div>'+
        '<div class="cbleg">'+
          gAll.filter(g=>gTot[g]>0).map(g=>'<span><i style="background:'+(cols[g]||'var(--muted)')+
            '"></i>'+esc(tr('cb_g'+g.toLowerCase(),'Grade '+g))+'</span>').join('')+
          (rotNow>0?('<span><i style="background:var(--warn)"></i>'+esc(tr('cb_rot'))+'</span>'):'')+
        '</div>');}
    const chg=pctRotPrev===null?null:+(pctRotNow-pctRotPrev).toFixed(1);
    H.push('<table class="cbtb" style="margin-top:9px">'+
      '<tr><td>'+esc(tr('cb_rotnow'))+'</td><td>'+pctRotNow+'%</td></tr>'+
      '<tr><td>'+esc(tr('cb_rotprev'))+'</td><td class="cbfl">'+
        (pctRotPrev===null?esc(tr('cb_norec')):pctRotPrev+'%')+'</td></tr>'+
      '<tr class="tot"><td>'+esc(tr('cb_rotchg'))+'</td>'+
        '<td class="'+(chg===null?'cbfl':chg<=0?'cbup':'cbdn')+'">'+
          (chg===null?'—':((chg>0?'▲ +':chg<0?'▼ −':'= ')+Math.abs(chg)+' '+esc(tr('cb_points'))))+
        '</td></tr></table>');}

  // ---- by lot ---------------------------------------------------------------------------
  const lotNow={}, lotPrev={};
  LOT_KEYS.forEach(L=>{lotNow[L]=0;lotPrev[L]=0;});
  S.now.forEach(k=>{const r=D[k]; if(r)LOT_KEYS.forEach(L=>{lotNow[L]+=(+r.lot[L]||0);});});
  S.prev.forEach(k=>{const r=D[k]; if(r)LOT_KEYS.forEach(L=>{lotPrev[L]+=(+r.lot[L]||0);});});
  const lotSum=LOT_KEYS.reduce((s,L)=>s+lotNow[L],0);
  if(lotSum>0){
    H.push('<div class="exsub">'+esc(tr('cb_bylot'))+'</div>');
    H.push('<table class="cbtb"><tr><th>'+esc(tr('cb_lot'))+'</th><th>'+esc(tr('cb_fruit'))+
      '</th><th>'+esc(tr('cb_share'))+'</th><th>'+esc(tr('cb_change'))+'</th></tr>'+
      LOT_KEYS.map(L=>{const d=cmpPct(lotNow[L],lotPrev[L]);
        return '<tr><td>'+esc(tr('cb_lot'))+' '+esc(L)+'</td><td>'+nf(lotNow[L])+'</td>'+
          '<td class="cbfl">'+Math.round(lotNow[L]/lotSum*100)+'%</td>'+
          '<td class="'+(d===null?'cbfl':d>=0?'cbup':'cbdn')+'">'+
            (d===null?'—':(d>0?'+':'')+d+'%')+'</td></tr>';}).join('')+
      '<tr class="tot"><td>'+esc(tr('cb_total'))+'</td><td>'+nf(lotSum)+'</td><td>100%</td><td>&nbsp;</td></tr>'+
      '</table>');}

  // ---- programmes ------------------------------------------------------------------------
  const months={}; S.now.forEach(k=>{months[k.slice(0,7)]=1;});
  const pc={issued:0,ontime:0,late:0,open:0};
  Object.keys(months).forEach(mk=>{const c=progCounts(mk);
    pc.issued+=c.issued;pc.ontime+=c.ontime;pc.late+=c.late;pc.open+=c.open;});
  if(pc.issued){
    const done=pc.ontime+pc.late;
    const otp=done?Math.round(pc.ontime/done*100):null;
    H.push('<div class="exsub">'+esc(tr('cb_prog'))+'</div>');
    H.push('<table class="cbtb">'+
      '<tr><td>'+esc(tr('cb_issued'))+'</td><td>'+nf(pc.issued)+'</td></tr>'+
      '<tr><td>'+esc(tr('cb_pon'))+'</td><td class="cbup">'+nf(pc.ontime)+'</td></tr>'+
      '<tr><td>'+esc(tr('cb_plate'))+'</td><td class="'+(pc.late?'cbdn':'cbfl')+'">'+nf(pc.late)+'</td></tr>'+
      '<tr><td>'+esc(tr('cb_popen'))+'</td><td class="cbfl">'+nf(pc.open)+'</td></tr>'+
      // a percentage with nothing behind it is a lie told in numbers - say so in words
      '<tr class="tot"><td>'+esc(tr('cb_ppct'))+'</td><td class="'+
        (otp===null?'cbfl':otp>=80?'cbup':'cbdn')+'">'+
        (otp===null?esc(tr('cb_noscore')):otp+'%')+'</td></tr></table>');}

  H.push('<p class="small" style="margin-top:10px">'+esc(tr('cb_derived'))+'</p>');
  box.innerHTML=H.join('');

  // the tooltip is positioned after paint, because it needs the bar's real geometry
  if(CMP_PICK!==null&&ser[CMP_PICK]){
    const plot=$('cbplot'), bars=$('cbbars');
    if(plot&&bars&&bars.children[CMP_PICK]){
      const tip=document.createElement('div'); tip.className='cbtip';
      tip.innerHTML=fmt(ser[CMP_PICK].v)+'<u>'+esc(ser[CMP_PICK].full)+'</u>';
      plot.appendChild(tip);
      const b=bars.children[CMP_PICK].getBoundingClientRect(), pr=plot.getBoundingClientRect();
      let L=b.left-pr.left+b.width/2-tip.offsetWidth/2;
      tip.style.left=Math.max(0,Math.min(L,pr.width-tip.offsetWidth))+'px';
      tip.style.bottom=Math.min(ser[CMP_PICK].v/top*100+4,74)+'%';}}}

/* v3.17.2 — the one-time clear-out of rows this phone should never have made.

   Narrow on purpose. A row is removed only if ALL of these are true:
     · it has NOT been uploaded (anything in the Google Sheet is untouchable, always)
     · it carries a corrId, so it was machine-made from an approved correction
     · this phone does NOT hold the original entry it claims to be correcting
   A row keyed by a person, and every row on the phone that actually did the work,
   fails at least one of those tests and is left exactly where it is.

   The removal itself is written to the audit trail, like every other removal in this
   app. A repair that hides itself is how a ledger stops being one. */
async function repairPhantomBakes(){
  const kv=(await all('kv'))||[];
  if(kv.some(x=>x.k==='bakefix'&&x.v))return 0;                  // runs once, ever
  const ADJ={DROP_ADJUST:1,ROTTEN_ADJUST:1,TIE_ADJUST:1};
  const phantom=EVENTS.filter(e=>!e.synced&&e.corrId&&ADJ[e.type]&&
    !EVENTS.some(b=>b.uuid===e.evUuid));
  const cid={}; phantom.forEach(e=>{cid[e.corrId]=1;});
  // the rope re-statement that rides with a tying correction goes with its parent
  const rope=EVENTS.filter(e=>!e.synced&&e.type==='STOCK_ADJUST'&&e.corrId&&cid[e.corrId]);
  const kill=phantom.concat(rope);
  if(!kill.length){await put('kv',{k:'bakefix',v:true});return 0;}
  await persistEvent({uuid:uuid(),type:'ADMIN_CLEANUP',dt:now(),removed:kill.length,
    detail:'v3.17.2 repair - '+kill.length+' adjustment rows this phone re-made for corrections '+
           'whose original entry it does not hold. None had been uploaded.',
    worker:(CFG&&CFG.worker)||'',workerId:(CFG&&CFG.uid)||'',device:(CFG&&CFG.device)||'',synced:false});
  for(const e of kill){EVENTS=EVENTS.filter(x=>x.uuid!==e.uuid); if(db)await del('events',e.uuid);}
  await put('kv',{k:'bakefix',v:true});
  rebuildLedgers();
  return kill.length;}

// ================= boot =================
(async function(){
  await initStore();
  const repaired=await repairPhantomBakes();
  if(repaired)setTimeout(()=>toast('🧹 '+repaired+' duplicate correction rows cleared from this phone',0),1200);
  // spray set options
  const ss=$('sset');SPRAY_SETS.forEach(s=>{const o=document.createElement('option');o.textContent=s;ss.appendChild(o);});
  renderInOpts();renderOutOpts();renderStOpts();renderAlerts();   // inventory master ready before first paint
  renderTimeline();renderOpsTasks();renderProgCheck();          // v2.5 programme views
  renderV26();                                                    // v2.6 weather, blueprint, tasks, labour
  badge();netUpdate();
  if(LOCKED){showLock(false);return;}                 // revoked device stays locked forever
  if(!CFG||!CFG.key||!CFG.worker){showLogin();}       // access key gate
  else if(!CFG.url||!CFG.device){applyRole();showSetup();}
  else {applyRole();goHome();refreshMasters();}
})();
