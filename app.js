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
const APP_VERSION = 'v3.5.1';   // v3.5.1 — Sync screen now says WHY a total is what it is; empty stats payload no longer adopted

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
    RET_DIRTY=false;
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
    const rdt=kv.find(x=>x.k==='retdirty'); RET_DIRTY=!!(rdt&&rdt.v);
    const at=kv.find(x=>x.k==='addtrees'); if(at&&Array.isArray(at.v)) ADDED_TREES=at.v;
    const au=kv.find(x=>x.k==='appurl');   if(au&&au.v) APP_URL=String(au.v);
    const ts=kv.find(x=>x.k==='treestats'); if(ts&&ts.v&&ts.v.trees) TREE_STATS=ts.v;
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
  }
  else { EVENTS=mem.events; CFG=mem.config; CORRECTIONS=mem.corrections; }
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
function badge(){$('qbadge').textContent=pending()+corrUnsynced()+q4();}
function netUpdate(){const on=navigator.onLine;const p=$('netpill');p.textContent=on?'● ONLINE':'● OFFLINE';p.className='pill'+(on?' on':'');
  const q=pending()+corrUnsynced()+q4();
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
// ================= v2.5 SIX-MODULE HUB + CLEAN SUB-TAB BARS =================
// Six major sections, each a big tile. A module with more than one section shows a
// sub-tab bar pinned under the header. Two independent gates decide what a person
// sees: HUB_ORDER (which tiles they are given) and roleAllows() (which panels may
// render at all) — so calling straight into a module exposes nothing extra.
const SCREENS=['home','harvest','stock','sync','dash'];
const FULL_ROLES=['OWNER','MARKETING'];
const MODULES={
  // v3.0 — tying has LEFT this module. The collection screen is now two cards only:
  // Card A good fruit by grade, Card B rotten loss. Nothing else competes for the
  // worker's thumb while fruit is being counted.
  harvest:{ic:'🥭',name:'Harvest',sub:'grade A/B/C, rotten',
    tabs:[{k:'log', t:'COLLECT',   scr:'harvest',panels:[]},
          {k:'wave',t:'THE WAVE',  scr:'dash',panels:['wavecard'],roles:FULL_ROLES},
          {k:'today',t:'FARM TODAY',scr:'dash',panels:['yieldstrip','kpis','phibox','lotcard','mktcard','dashnote'],roles:FULL_ROLES}]},
  // v3.0 — the tying tracker is its own tile. Hidden from the Sandakan Purchaser.
  tying:{ic:'🎗️',name:'Fruit Tying Tracker',sub:'tally clicker, rope, balances',
    tabs:[{k:'tally',t:'TALLY CLICKER',scr:'dash',panels:['tallycard']},
          {k:'bal',  t:'BALANCES',     scr:'dash',panels:['tyingcard'],roles:FULL_ROLES}]},
  ops:{ic:'📋',name:'Daily Ops',sub:'tasks, replies, stock out',
    tabs:[{k:'tasks',t:"TODAY'S TASKS",scr:'dash',panels:['opstasks','opsgeneral','opshistory']},
          {k:'out',  t:'STOCK OUT',    scr:'stock',panels:['pnl-out','onhandcard']},
          {k:'assign',t:'ASSIGN WORK', scr:'dash',panels:['opsassign'],roles:FULL_ROLES}]},
  agro:{ic:'🌱',name:'Agronomist',sub:'month timeline, weather, record',
    tabs:[{k:'month',t:'THIS MONTH',scr:'dash',panels:['agromonth'],  roles:FULL_ROLES},
          {k:'wx',   t:'WEATHER',   scr:'dash',panels:['agroweather','agrorain'],roles:FULL_ROLES},
          {k:'rec',  t:'RECORD',    scr:'dash',panels:['agrorecord'], roles:FULL_ROLES}]},
  inv:{ic:'📦',name:'Inventory',sub:'stock in, alerts, levels',
    tabs:[{k:'in',  t:'STOCK IN',     scr:'stock',panels:['alertcenter','pnl-in','onhandcard'],roles:['OWNER','MARKETING','PURCHASER']},
          {k:'chk', t:'PROGRAM CHECK',scr:'dash', panels:['progcheck'],                        roles:['OWNER','MARKETING','PURCHASER']},
          {k:'next',t:'NEXT PHASE',   scr:'dash', panels:['progready'],                        roles:['OWNER','MARKETING','PURCHASER']},
          {k:'out', t:'STOCK OUT',    scr:'stock',panels:['pnl-out','onhandcard'],             roles:FULL_ROLES},
          {k:'lvl', t:'STOCK LEVEL',  scr:'dash', panels:['invcc'],                            roles:FULL_ROLES},
          {k:'take',t:'STOCK-TAKE',   scr:'dash', panels:['stocktake'],                        roles:FULL_ROLES}]},
  // v3.0 — Marketing is now the morning dispatch desk: weigh the baskets, invoice the
  // retailer, watch the credit come down. Owner and Marketing only.
  mkt:{ic:'🚚',name:'Marketing',sub:'dispatch, retailer credit',
    tabs:[{k:'disp',  t:'RETAILERS',          scr:'dash',panels:['dispatchcard'],roles:FULL_ROLES},
          {k:'ledger',t:'DELIVERY LEDGER',    scr:'dash',panels:['mktledger'],  roles:FULL_ROLES},
          {k:'price', t:'PRICES & RETAILERS', scr:'dash',panels:['pricecard'],  roles:FULL_ROLES},
          {k:'sell',  t:'OTHER SALES',        scr:'dash',panels:['mktpanel'],   roles:FULL_ROLES}]},
  costadmin:{ic:'💰',name:'Costing / Admin',sub:'ledger, labour, staff keys',
    tabs:[{k:'sum',   t:'COSTING',    scr:'dash',panels:['ledgercard'],roles:FULL_ROLES},
          {k:'labour',t:'LABOUR',     scr:'dash',panels:['labourcard'],roles:FULL_ROLES},
          {k:'corr',  t:'ADJUSTMENTS',scr:'dash',panels:['corrpanel'], roles:FULL_ROLES},
          // v3.2 — the dual-signature yield audit is the Owner's alone. Marketing weighs
          // the fruit, so Marketing does not get to mark its own homework.
          {k:'yield', t:'YIELD AUDIT', scr:'dash',panels:['yieldaudit'],roles:['OWNER']},
          // v3.3 — the Owner's master override suite. OWNER only, and the panel renders
          // an empty string for anyone else so none of its markup reaches the DOM.
          {k:'master',t:'🔐 MASTER DB',scr:'dash',panels:['masterdb'], roles:['OWNER']},
          {k:'reg',   t:'STAFF',      scr:'dash',panels:['keyspanel'], roles:FULL_ROLES}]}
};
// Option C — six big tiles, in this order. The role gate is applied here AND again in
// roleAllows(), so calling straight into a module still exposes nothing extra.
const HUB_ORDER={
  OWNER:    ['harvest','tying','inv','agro','ops','mkt','costadmin'],   // unrestricted
  MARKETING:['harvest','tying','inv','agro','ops','mkt','costadmin'],
  WORKER:   ['harvest','tying','ops'],  // Harvest + Fruit Tying + Daily Ops ONLY
  PURCHASER:['inv']                     // Inventory ONLY — no harvest, no tying, no money
};
const HUB_PANELS=['kpis','phibox','lotcard','mktcard','dashnote','invcc','ledgercard','stocktake',
  'corrpanel','keyspanel','alertcenter','pnl-in','pnl-out','onhandcard',
  'opstasks','opshistory','agrophases','agroproj','progcheck',
  'opsgeneral','opsassign','labourcard','agroweather','progready',
  'agrorain','agromonth','agrorecord','tyingcard','wavecard','mktpanel',
  'tallycard','dispatchcard','mktledger','pricecard','yieldaudit','yieldstrip','masterdb'];
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
    // v3.2 — the yield audit names who counted and who weighed. Owner only.
    case 'yieldaudit': case 'yieldstrip': return myRole()==='OWNER';
    case 'masterdb': return myRole()==='OWNER';
    case 'onhandcard':                 return true;
    case 'invcc': case 'ledgercard': case 'stocktake': case 'corrpanel': case 'keyspanel':
    case 'kpis': case 'phibox': case 'lotcard':
    case 'mktcard': case 'dashnote':   return full;
    default: return true;
  }
}
function tileBadge(k){
  if(k==='inv'){const n=programShortages().length||lowStock().length;
    return n?{t:(programShortages().length?programShortages().length+' SHORT':n+' LOW')}:null;}
  if(k==='ops'){const n=myTasks().length+myGeneralTasks().length;return n?{t:n+' TASK'+(n>1?'S':'')}:null;}
  if(k==='agro'){
    if(WEATHER==='RAINY'){const risky=activePrograms().filter(r=>{const a=weatherAdvice(r,r.lines);return a&&!a.ok;});
      if(risky.length)return {t:'🌧️ '+risky.length+' AT RISK'};}
    const n=activePrograms().length;return n?{t:n+' ACTIVE',amber:1}:null;}
  if(k==='costadmin'){
    // v3.2 — an unresolved yield mismatch outranks a pending correction: it is the one
    // that means fruit may be walking off the farm.
    const y=(typeof yieldFlags==='function'&&myRole()==='OWNER')?yieldFlags().length:0;
    if(y)return {t:y+' YIELD ALERT'+(y>1?'S':'')};
    const n=CORRECTIONS.filter(c=>String(c.status).toUpperCase()==='PENDING').length;
    return n?{t:n+' PENDING',amber:1}:null;}
  if(k==='mkt'){const kg=Math.round(collectedKg()-soldKg());
    return kg>0?{t:nf(kg)+' KG READY',amber:1}:null;}
  if(k==='harvest'){const b=LOT_KEYS.reduce((s,L)=>s+lotLedger(L).current_tied_balance,0);
    return b>0?{t:nf(b)+' ON STRING'}:null;}
  if(k==='tying'){
    const rope=ropeOnHand();
    if(rope<0)return {t:'ROPE SHORT'};                       // red, flashing — key the rolls in
    const today=todayStr();
    const n=EVENTS.filter(e=>e.type==='TIE'&&String(e.dt||'').slice(0,10)===today)
      .reduce((a,e)=>a+(+e.n||0),0);
    return n?{t:nf(n)+' TIED TODAY',amber:1}:null;}
  return null;}
function renderHub(){
  if(!$('hubtiles'))return;
  $('hub-name').textContent=(CFG&&CFG.worker)||'—';
  $('hub-role').textContent=ROLE_LABEL[myRole()]||myRole();
  $('hub-dev').innerHTML=((CFG&&CFG.device)||'—')+'<br>'+APP_VERSION;
  $('hubtiles').innerHTML=hubTiles().map(k=>{
    const m=MODULES[k];if(!m)return '';
    const b=tileBadge(k);
    return '<div class="tile" onclick="openModule(\''+k+'\')"><span class="ti">'+m.ic+'</span>'+
      '<div class="tn">'+esc(m.name)+'</div><div class="ts">'+esc(m.sub)+'</div>'+
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
  curModule=null;curTab=null;
  hideAllPanels();
  $('subbar').classList.add('hidden');$('subbar').innerHTML='';
  showScreen('home');
  $('backbtn').classList.add('hidden');
  $('ttl').textContent='Sugut DMS';
  renderHub();}
function hubBack(){
  if(!CFG||!CFG.key||!CFG.worker){showLogin();return;}    // v2.5.1: tapping the title never bypasses login
  if($('scr-home').classList.contains('hidden')) goHome(); }
function openModule(k,tabKey){
  const m=MODULES[k];
  if(!m||hubTiles().indexOf(k)<0){goHome();return;}
  const tabs=tabsFor(k);
  if(!tabs.length){goHome();return;}
  const tab=tabs.find(t=>t.k===tabKey)||tabs[0];
  curModule=k;curTab=tab.k;
  hideAllPanels();
  (tab.panels||[]).forEach(id=>{const el=$(id);if(!el||!roleAllows(id))return;
    if(id==='phibox'){el.dataset.dashhide='';return;}
    el.style.display='';});
  showScreen(tab.scr);
  $('backbtn').classList.remove('hidden');
  $('ttl').textContent=m.name;
  // sub-tab bar, pinned under the header — hidden when a module has only one section
  const sb=$('subbar');
  if(tabs.length>1){sb.classList.remove('hidden');
    sb.innerHTML=tabs.map(t=>'<div class="'+(t.k===tab.k?'on':'')+'" onclick="openModule(\''+k+'\',\''+t.k+'\')">'+esc(t.t)+'</div>').join('');
    // v3.3.2 — Costing/Admin now has six tabs and the last ones sit off the right edge of a
    // phone. Without this you have to already know to swipe sideways to find them, which is
    // exactly the tab a first-time Owner is looking for.
    const act=sb.querySelector('.on');
    if(act&&act.scrollIntoView)try{act.scrollIntoView({block:'nearest',inline:'center'});}catch(x){}
    if(sb.scrollWidth>sb.clientWidth+4)sb.classList.add('scrolls'); else sb.classList.remove('scrolls');}
  else {sb.classList.add('hidden');sb.innerHTML='';}
  renderForTab(k,tab.k);
  $('scr-'+tab.scr).scrollTop=0;}
function renderV26(){renderWeather();renderGeneralTasks();renderAssign();
  renderLabour();renderReady();renderRain();renderTimeline();renderRecord();
  renderTying();renderMyLogs();renderRotCauses();renderWave();renderMarketing();
  renderGradeRows();renderTally();renderDispatch();renderMktLedger();renderPrices();
  renderYieldAudit();renderMasterDB();}
function renderForTab(k,t){
  if(k==='harvest'&&t==='log'){buildLotSelect();renderMyCorrections();renderMyLogs();renderRotCauses();
    renderGradeRows();refreshTreeBoard();}
  if(k==='harvest'&&t==='wave')renderWave();
  if(k==='harvest'&&t==='today')renderDash();
  if(k==='tying'&&t==='tally')renderTally();
  if(k==='tying'&&t==='bal')renderTying();
  if(k==='ops'&&t==='tasks'){renderOpsTasks();renderGeneralTasks();renderOpsHistory();}
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
  if(k==='mkt'&&t==='ledger')renderMktLedger();
  if(k==='mkt'&&t==='price')renderPrices();
  if(k==='costadmin'&&t==='yield')renderYieldAudit();
  if(k==='costadmin'&&t==='master')renderMasterDB();
  if(k==='mkt'&&t==='sell')renderMarketing();
  if(k==='costadmin'&&t==='sum')renderLedgerSummary();
  if(k==='costadmin'&&t==='labour')renderLabour();
  if(k==='costadmin'&&t==='corr')renderCorrections();
  if(k==='costadmin'&&t==='reg')renderKeys();}
/** v3.2 — a session ALWAYS starts on the retailer list. Without this, logging out and
 *  back in — possibly as a different person — left the previous user's open retailer
 *  card, their half-keyed baskets and any granted overdraft override on the screen. */
function resetMarketingView(){
  if(typeof MKT_SEL!=='undefined')MKT_SEL='';
  if(typeof DLINES!=='undefined')DLINES=[];
  if(typeof DNOTE!=='undefined')DNOTE='';
  if(typeof clearOverride==='function')clearOverride();
  if(typeof LAST_INVOICE_UUID!=='undefined')LAST_INVOICE_UUID='';}
function applyRole(){
  resetMarketingView();
  const r=myRole();
  const full=FULL_ROLES.indexOf(r)>=0;
  SHOW_VALUES=full;                                   // gates every RM figure in the app
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
  ledger:'costadmin',admin:'costadmin',mkt:'mkt',tie:'tying',tying:'tying'};
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
  if(!w){$('pinerr').textContent='Wrong key. Try again.';pin='';setTimeout(renderPin,600);return;}
  if(String(w.status).toLowerCase()!=='active'){$('pinerr').textContent='This key is deactivated. Contact owner.';pin='';setTimeout(renderPin,900);return;}
  CFG=Object.assign({},CFG||{},{worker:w.name,role:w.role,key:w.key,uid:w.id});
  await persistCfg();pin='';
  toast('Welcome, '+w.name);
  applyRole();
  $('nav-home').style.display='';$('nav-sync').style.display='';
  if(!CFG.url||!CFG.device) showSetup(); else goHome();}
function showLogin(){SCREENS.forEach(x=>$('scr-'+x).classList.add('hidden'));
  $('nav-home').style.display='none';$('nav-sync').style.display='none';
  $('backbtn').classList.add('hidden');$('ttl').textContent='Sugut DMS';
  $('scr-setup').classList.add('hidden');$('scr-login').classList.remove('hidden');$('ttl').textContent='Login';buildKeypad();}
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
  EVENTS=[];CORRECTIONS=[];TREE_FIX={};CFG=null;
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
async function refreshMasters(){
  if(!CFG||!CFG.url||!navigator.onLine)return null;
  let got={tasks:0,programs:0};
  try{
    const r=await fetch(CFG.url);const j=await r.json();
    // corrections are merged only AFTER the kill switch has cleared this device
    const inCorr=(j&&j.ok&&Array.isArray(j.corrections))?j.corrections:null;
    const inProg=(j&&j.ok&&Array.isArray(j.programs))?j.programs:null;
    const inTask=(j&&j.ok&&Array.isArray(j.tasks))?j.tasks:null;
    const inRet =(j&&j.ok&&Array.isArray(j.retailers))?j.retailers:null;
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
  s.innerHTML='<option value="">— select tree —</option>'+treesInLot(curLot).map(t=>
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
  const box=$('g-tot'); if(!box)return;
  const tot=gTotal();
  if(!tot){box.className='gtot zero';box.textContent='Nothing counted yet.';return;}
  box.className='gtot';
  const parts=GRADE_ORDER.filter(g=>GCOUNT[g]>0)
    .map(g=>GCOUNT[g]+' × '+g+' ('+(GKIND[g]==='SECURED'?'secured':'unsecured')+')');
  box.innerHTML=tot+' fruit — '+parts.join(' · ');}
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
    o.textContent=p.name+' · '+(p.active_ingredient||'—');sel.appendChild(o);});
  if(!sel.options.length){const o=document.createElement('option');o.value='';o.textContent='— no match —';sel.appendChild(o);}
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
function renderOutOpts(){fillProdSelect('out-prod','out-search');onOutProd();}
function onOutProd(){const p=prodById($('out-prod').value);
  $('out-ai').textContent=p?(p.active_ingredient||'—'):'—';
  $('out-unitlbl').textContent=p?p.unit:'ml/gm';
  $('out-onhand').innerHTML=p?('on hand<br><b>'+nf(onHand(p))+' '+esc(p.unit)+'</b>'):'—';
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
  const list=INVENTORY_RECON.filter(p=>matchProd(p,q));
  $('stocklist').innerHTML=list.length?list.map(p=>{
    const oh=onHand(p),low=isLow(p);
    const right=nf(oh)+' '+esc(p.unit)+(low?' ⚠':'')+(SHOW_VALUES?('<br><span class="small">'+rm(valueOf(p))+'</span>'):'');
    return '<div class="lrow"><span><b>'+esc(p.name)+'</b><br><span class="small" style="color:#26418f">'+esc(p.active_ingredient||'—')+'</span></span>'+
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
    '<div class="ai">'+esc(p.active_ingredient||'—')+'</div>'+
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

function renderSync(){
  $('cfginfo').innerHTML=(CFG?('Worker: <b>'+(CFG.worker||'—')+'</b> <span class="small">('+(CFG.role||'')+')</span> · Device: <b>'+(CFG.device||'—')+'</b><br>Sync URL: '+(CFG.url?'<b>set ✓</b>':'<span style="color:#b3261e">not set — edit settings</span>')):'')+'<br>App version: <b>'+APP_VERSION+'</b> · <span class="linkish" onclick="logout()">log out</span>';
  const sh=$('synchealth'); if(sh)sh.innerHTML=syncHealthHtml();
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
  const b=$('syncbtn');const n=pending()+corrUnsynced()+q4();
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
  await pushDispatch();                       // then retailer dispatches + credit top-ups
  await pushAudit();                          // then the anti-manipulation audit trail
  // Anything with its own payload key MUST also be excluded here, or it goes up twice.
  const batch=EVENTS.filter(e=>!e.synced&&e.type!=='STOCK_ADJUST'&&e.type!=='TASK_DONE'
    &&e.type!=='ROTTEN'&&e.type!=='DROP_ADJUST'&&e.type!=='ROTTEN_ADJUST'
    &&e.type!=='TIE'&&e.type!=='TIE_ADJUST'&&e.type!=='SALE'
    &&e.type!=='DISPATCH'&&e.type!=='CREDIT_TOPUP'
    &&e.type!=='LOG_VOID'&&e.type!=='YIELD_ACK'&&e.type!=='ADMIN_PURGE'&&e.type!=='ADMIN_CLEANUP');
  if(!batch.length){
    const got=await refreshMasters();renderSync();
    if(!auto){                       // the person pressed the button — always answer them
      const nn=got?(got.tasks+got.programs):0;
      toast(nn?('✓ '+nn+' new job'+(nn>1?'s':'')+' received from the Owner')
              :(got?'✓ Up to date — nothing new from the Owner':'Could not reach the Google Sheet',!got));}
    return;}
  syncing=true;const b=$('syncbtn');b.textContent='Uploading '+batch.length+'…';
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({events:batch}),
      headers:{'Content-Type':'text/plain;charset=utf-8'}}); // text/plain avoids CORS preflight for Apps Script
    const j=await r.json();
    if(j&&j.ok){for(const e of batch){e.synced=true;e.syncedAt=now();if(db)await put('events',e);}rebuildLedgers();badge();renderSync();
      toast('✓ '+batch.length+' events synced to Google Sheets');
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
    if(!seen[k]){seen[k]={k:k,dt:e.dt,lot:e.lot,prog:e.progSet||'',worker:e.worker,tanks:e.tanks,water:e.water,n:0,cost:0};groups.push(seen[k]);}
    seen[k].n++;seen[k].cost+=(+e.cost||0);});
  box.innerHTML=groups.length?groups.slice(0,12).map(g=>
    '<div class="lrow"><span><b>'+esc(g.prog||'programme')+'</b> · Lot '+esc(g.lot)+
    '<br><span class="small">'+esc(g.dt)+' · '+esc(g.worker)+' · '+nf(g.tanks)+' tank(s) · '+nf(g.water)+' L water</span></span>'+
    '<span style="text-align:right;font-weight:800">'+g.n+' item'+(g.n>1?'s':'')+
    (SHOW_VALUES?('<br><span class="small">'+rm(g.cost)+'</span>'):'')+'</span></div>').join('')
    :'<div class="small">No completion reply sent from this phone yet.</div>';}

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
    :'<div class="alertnone">No general task waiting.</div>';}

// ---- 5. worker reply for a general task: structure enforced per job type ------------
let grTask=null, grLotVal='', grRows=[];
function openGeneral(u){
  const t=taskById(u); if(!t){toast('Task not found',1);return;}
  grTask=t; grLotVal=''; grRows=[];
  $('gr-sub').textContent='Set by the Owner and cannot be changed here. Report what was actually done.';
  $('gr-task').textContent=t.kindLabel;
  $('gr-mode').innerHTML=(t.scope==='ALL'?'whole farm':'Lot '+esc(t.scope))+'<br>'+phaseClock(t).text;
  LOT_KEYS.forEach(L=>$('gl-'+L).classList.toggle('on',false));
  const perTree=(t.need==='TREE_COUNT');
  $('gr-countwrap').style.display='';
  $('gr-countlbl').textContent=perTree?('Count per tree — '+t.countLabel):('Trees covered');
  $('gr-counthint').textContent=perTree
    ?'Add one line per tree you worked on. The tree number is the number printed on the QR tag.'
    :'Enter how many trees were covered in this lot.';
  $('gr-crew').value='';$('gr-hours').value='';$('gr-err').textContent='';
  grRows=[perTree?{tree:'',n:''}:{tree:'—',n:''}];
  renderGrRows();
  $('genmodal').classList.remove('hidden');}
function closeGeneral(){$('genmodal').classList.add('hidden');grTask=null;grRows=[];}
function grLot(L){grLotVal=L;LOT_KEYS.forEach(k=>$('gl-'+k).classList.toggle('on',k===L));renderGrRows();}
function grAddRow(){grRows.push({tree:'',n:''});renderGrRows();}
function grDropRow(i){grRows.splice(i,1);if(!grRows.length)grRows.push({tree:'',n:''});renderGrRows();}
function grSet(i,f,v){grRows[i][f]=v;grCalc();}
function renderGrRows(){
  const perTree=grTask&&grTask.need==='TREE_COUNT';
  const lot=grLotVal||(grTask&&grTask.scope!=='ALL'?grTask.scope:'');
  const trees=lot?treesInLot(lot):[];
  $('gr-rows').innerHTML=grRows.map((r,i)=>{
    const sel=perTree
      ?('<select onchange="grSet('+i+',\'tree\',this.value)"><option value="">'+
        (lot?'pick tree…':'pick the lot first')+'</option>'+
        trees.map(t=>'<option value="'+t.id+'"'+(r.tree===t.id?' selected':'')+'>'+esc(t.id)+' · '+esc(cloneLabel(t.clone))+'</option>').join('')+'</select>')
      :'<span class="small" style="flex:1">Trees covered in Lot '+esc(lot||'—')+'</span>';
    return '<div class="trcount">'+sel+
      '<input type="number" min="0" step="1" inputmode="numeric" placeholder="'+esc(perTree?grTask.countLabel:'trees')+
      '" value="'+esc(r.n)+'" oninput="grSet('+i+',\'n\',this.value)">'+
      (perTree?'<span class="x" onclick="grDropRow('+i+')">✕</span>':'')+'</div>';}).join('');
  $('gr-rows').nextElementSibling.style.display=perTree?'':'none';
  grCalc();}
function grTotal(){return grRows.reduce((s,r)=>s+(+r.n||0),0);}
function grCalc(){
  if(!grTask)return;
  const tot=grTotal(), crew=+$('gr-crew').value||0, hrs=+$('gr-hours').value||0;
  $('gr-total').innerHTML='<b>'+nf(tot)+'</b> '+esc(grTask.countLabel)+' across <b>'+
    grRows.filter(r=>+r.n>0).length+'</b> entry(ies)';
  $('gr-labour').innerHTML=crew&&hrs
    ?('<b>'+nf(crew*hrs)+'</b> man-hours ('+crew+' worker'+(crew>1?'s':'')+' × '+nf(hrs)+' h)')
    :'Enter the crew size and hours so the month’s labour total is real.';}
let genSaving=false;
async function submitGeneral(){
  const err=$('gr-err');err.textContent='';
  if(!grTask||genSaving)return;
  const perTree=grTask.need==='TREE_COUNT';
  if(!grLotVal){err.textContent='Select the lot this work was done in.';return;}
  const rows=grRows.filter(r=>+r.n>0);
  if(!rows.length){err.textContent=perTree?('Add at least one tree with a '+grTask.countLabel+' count.')
                                          :'Enter how many trees were covered.';return;}
  if(perTree){
    if(rows.some(r=>!r.tree)){err.textContent='Every line needs a tree number.';return;}
    const ids=rows.map(r=>r.tree);
    if(new Set(ids).size!==ids.length){err.textContent='The same tree is entered twice.';return;}
    const wrong=rows.find(r=>{const t=treeById(r.tree);return !t||t.lot!==grLotVal;});
    if(wrong){err.textContent=wrong.tree+' is not in Lot '+grLotVal+'.';return;}}
  const crew=Math.round(+$('gr-crew').value||0), hours=+$('gr-hours').value;
  if(!(crew>0)){err.textContent='Enter how many workers were on the job.';return;}
  if(!(hours>0)){err.textContent='Enter the hours worked per worker.';return;}
  if(tasksDoneLots(grTask.uuid).indexOf(grLotVal)>=0&&
     !confirm('Lot '+grLotVal+' was already reported for this task.\nSend another report anyway?'))return;
  genSaving=true;
  const stamp=now(), tot=rows.reduce((s,r)=>s+(+r.n||0),0), lot=grLotVal, kl=grTask.kindLabel;
  try{
    await persistEvent({uuid:uuid(),type:'TASK_DONE',dt:stamp,taskId:grTask.uuid,
      kind:grTask.kind,kindLabel:grTask.kindLabel,need:grTask.need,
      lot:lot,count:tot,countLabel:grTask.countLabel,unit:grTask.unit,
      trees:rows.length,detail:rows.map(r=>({tree:r.tree,n:+r.n||0})),
      crew:crew,hours:hours,manHours:+(crew*hours).toFixed(2),
      worker:CFG.worker,device:CFG.device,synced:false});
  } finally { genSaving=false; }
  closeGeneral();
  toast('✓ '+kl+' reported · '+nf(tot)+' logged in Lot '+lot);
  renderGeneralTasks();renderAssign();renderLabour();renderHub();}

// ---- 6. labour roll-up ---------------------------------------------------------------
function labourRows(){
  const out=[];
  EVENTS.filter(e=>e.type==='TASK_DONE').forEach(e=>out.push({dt:e.dt,what:e.kindLabel,lot:e.lot,
    crew:+e.crew||0,hours:+e.hours||0,mh:(+e.crew||0)*(+e.hours||0),worker:e.worker}));
  const seen={};
  EVENTS.filter(e=>e.type==='STOCK_OUT'&&e.progId&&e.hours).forEach(e=>{
    const k=e.replyId||(e.progId+'|'+e.lot+'|'+e.dt); if(seen[k])return; seen[k]=1;   // one reply = many rows
    out.push({dt:e.dt,what:e.progSet||'programme',lot:e.lot,crew:+e.crew||0,hours:+e.hours||0,
      mh:(+e.crew||0)*(+e.hours||0),worker:e.worker});});
  return out.sort((a,b)=>String(b.dt).localeCompare(String(a.dt)));}
function labourByMonth(){
  const m={};
  labourRows().forEach(r=>{const k=String(r.dt).slice(0,7);
    if(!m[k])m[k]={k:k,mh:0,n:0};m[k].mh+=r.mh;m[k].n++;});
  return Object.values(m).sort((a,b)=>b.k.localeCompare(a.k));}
function renderLabour(){
  const box=$('labourbox'); if(!box)return;
  const rows=labourRows(), months=labourByMonth();
  if(!rows.length){box.innerHTML='<div class="small">No labour logged yet. Every completion reply now asks for the crew size and hours.</div>';return;}
  box.innerHTML='<div class="tblwrap"><table class="tbl">'+
    '<tr><th>Month</th><th class="num">Reports</th><th class="num">Man-hours</th></tr>'+
    months.map(m=>'<tr><td><b>'+esc(m.k)+'</b></td><td class="num">'+m.n+'</td><td class="num"><b>'+nf(m.mh)+'</b></td></tr>').join('')+
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
  const x=$('rot-extra'); if(x)x.classList.toggle('hidden',!(rotQty>0));}
function rotPick(c){rotCause=c;
  const sel=$('rot-cause'); if(sel&&sel.value!==c)sel.value=c;
  if($('rot-err'))$('rot-err').textContent='';}
function rotPickSel(){rotPick($('rot-cause').value);}
function renderRotCauses(){
  const sel=$('rot-cause'); if(!sel)return;
  sel.innerHTML='<option value="">— choose the damage cause —</option>'+
    ROT_ORDER.map(k=>'<option value="'+k+'">'+ROT_CAUSE[k].ic+' '+esc(ROT_CAUSE[k].label)+
      ' — '+esc(ROT_CAUSE[k].note)+'</option>').join('');
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
async function pushOwnKey(batch,key,flag,warnSetter,warnMsg){
  if(!batch.length||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    const body={}; body[key]=batch;
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify(body),
      headers:{'Content-Type':'text/plain;charset=utf-8'}});
    const j=await r.json();
    if(j&&j.ok&&j[flag]){for(const e of batch){e.synced=true;e.syncedAt=now();if(db)await put('events',e);}badge();return true;}
    warnSetter(warnMsg);
    return false;
  }catch(e){return false;}}
async function pushRotten(){
  return pushOwnKey(rottenQueue(),'rotten','rotten',
    m=>{if(!rotWarned){rotWarned=true;toast(m,1);}},
    'Rotten fruit logs kept on this phone — update the Apps Script to add the ROTTEN_LOGS tab');}
async function pushLogAdj(){
  return pushOwnKey(logAdjQueue(),'logadj','logadj',
    m=>{if(!ladjWarned){ladjWarned=true;toast(m,1);}},
    'Approved log corrections kept on this phone — update the Apps Script to add the LOG_ADJUST tab');}

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
    :'<div class="alertnone">No task waiting. The Owner has not activated a set, or every lot has already been reported.</div>';}


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
  s.innerHTML='<option value="">— select tree —</option>'+treesInLot(tyLot).map(t=>
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
    if(!tyTree)inf.innerHTML='select a tree';
    else{const L=treeLedger(tyTree.id);
      inf.innerHTML=cloneLabel(tyTree.clone)+'<br>On the string now: <b>'+nf(L.current_tied_balance)+'</b>'+
        '<br>Untied still hanging: <b>'+(L.untied_hanging_estimate===null?'no census':nf(Math.max(0,L.untied_hanging_estimate)))+'</b>';}}
  const tap=$('ty-tap'); if(tap)tap.disabled=!tyTree;
  const und=$('ty-undo'); if(und)und.disabled=!(tyTally>0);
  const rope=$('ty-rope');
  if(rope){
    const need=ropeNeeded(tyTally), have=ropeOnHand();
    rope.innerHTML=tyTally
      ? ('This tree will draw <b>'+nf(need)+' m</b> of rope ('+ROPE_M_PER_FRUIT+' m per fruit) · store shows <b>'+
         nf(have)+' m</b>'+(have<need?' <span style="color:#b3261e;font-weight:800">— short, ask the Purchaser to key the rolls in</span>':''))
      : ('Every fruit tied draws <b>'+ROPE_M_PER_FRUIT+' m</b> of rope out of the store automatically · store shows <b>'+nf(have)+' m</b>');}
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
async function applyLogCorrection(c){
  if(c.ctype!=='LOGQTY'||!c.evUuid)return;
  if(EVENTS.some(e=>e.corrId===c.uuid))return;                 // idempotent across sync replays
  const base=EVENTS.find(e=>e.uuid===c.evUuid);
  const delta=+(Math.round(+c.newVal||0)-Math.round(+c.oldVal||0));
  if(!delta)return;
  const t=treeById(c.tree);
  const type=c.evType==='ROTTEN'?'ROTTEN_ADJUST':(c.evType==='TIE'?'TIE_ADJUST':'DROP_ADJUST');
  const rec={uuid:uuid(),type:type,dt:now(),
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
    if(rp) await persistEvent({uuid:uuid(),type:'STOCK_ADJUST',dt:now(),pid:ROPE_PID,pname:rp.name,
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

function canSetPrice(){return myRole()==='OWNER';}          // prices are the Owner's alone
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
/** THE price lookup. Everything that touches money goes through here.
 *  One contract book applies to every retailer — the alliance rates agreed with Roll.
 *  A second buyer on different rates would need a per-retailer override; that is a
 *  deliberate next module, not something half-built here. */
function priceOf(clone,g){
  if(!hasGrade(clone,g))return 0;
  const row=CLONE_PRICE[clone]||{}; return +(row[g]||0);}
function basePriceOf(clone,g){
  if(!hasGrade(clone,g))return 0;
  const row=CLONE_PRICE_SEED[clone]||{}; return +(row[g]||0);}

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

/** Everything money-related about one scale line, in one place. */
function lineCalc(l){
  const baskets=Math.max(0,Math.floor(+l.baskets||0));
  const tare  =+((tareOf(l.basket)*baskets).toFixed(3));
  const gross =Math.max(0,+l.gross||0);
  const net   =+(Math.max(0,gross-tare).toFixed(2));
  const price =priceOf(l.clone,l.grade);
  const value =+((net*price).toFixed(2));
  const fruits=Math.max(0,Math.floor(+l.fruits||0));
  const avg   =(fruits>0&&net>0)?+((net/fruits).toFixed(2)):0;
  const sugg  =avg>0?gradeForWeight(l.clone,avg):'';
  return {baskets,tare,gross,net,price,value,fruits,avg,sugg};}

function dispTotals(){
  let gross=0,tare=0,net=0,val=0,fruits=0;
  const byGrade={A:0,B:0,C:0}, lines=[];
  dispLines().forEach(l=>{
    const c=lineCalc(l);
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
        bits.push('⚠ No price set for '+esc(CLONE_NAME[l.clone]||l.clone)+' Grade '+l.grade+
                  ' — the Owner sets it in PRICES & RETAILERS.');
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
function renderPrices(){
  const box=$('pricebox'); if(!box)return;
  const own=canSetPrice();
  const cell=(c,g)=>{
    if(!hasGrade(c,g))return '<td class="num nogrd">—</td>';
    return '<td class="num">'+(own
      ?('<input type="number" id="pr-'+esc(c)+'-'+g+'" min="0" step="0.01" inputmode="decimal" value="'+
        priceOf(c,g)+'">')
      :('<b>'+rm(priceOf(c,g))+'</b>'))+
      '<div class="exphint">'+esc(bandText(c,g))+'</div></td>';};
  box.innerHTML=
    '<div class="cnote">Contract price book — the alliance rates agreed with <b>Roll</b>, applied to every '+
      'retailer. Prices are per KG of <b>net</b> weight. Black Thorn, B24, 101 and Udang Merah are '+
      'two-grade clones — they have no Grade C anywhere in the system.</div>'+
    (PRICE_META.at?('<div class="exphint" style="margin:6px 0">Last changed '+esc(PRICE_META.at)+
      (PRICE_META.by?(' by '+esc(PRICE_META.by)):'')+'</div>'):'')+
    '<div class="tblwrap"><table class="tbl pmx">'+
    '<tr><th>Clone</th><th class="num">Grade A</th><th class="num">Grade B</th><th class="num">Grade C</th></tr>'+
    CLONE_SELL_ORDER.map(c=>'<tr><td><b>'+esc(CLONE_NAME[c]||c)+'</b><div class="exphint">'+esc(c)+
      ' · '+gradesFor(c).length+'-grade</div></td>'+cell(c,'A')+cell(c,'B')+cell(c,'C')+'</tr>').join('')+
    '</table></div>'+
    (own?(
      '<div class="sec" style="margin-top:12px">📈 Daily market trend modifier</div>'+
      '<div class="small">Nudge every price in the table above before the lorry leaves. '+
        'Nothing is saved until you tap SAVE.</div>'+
      '<div class="trendrow">'+
        '<div class="trendbtn" onclick="trendNudge(-10)">−10%</div>'+
        '<div class="trendbtn" onclick="trendNudge(-5)">−5%</div>'+
        '<div class="trendbtn" onclick="trendNudge(5)">+5%</div>'+
        '<div class="trendbtn" onclick="trendNudge(10)">+10%</div>'+
      '</div>'+
      '<div class="trendrow">'+
        '<input type="number" id="pr-pct" step="0.5" inputmode="decimal" placeholder="custom %" style="flex:2">'+
        '<div class="trendbtn" onclick="trendNudge(+($(\'pr-pct\').value||0))">APPLY %</div>'+
        '<div class="trendbtn" onclick="trendReset()">RESET TO AGREED BASE</div>'+
      '</div>'+
      '<button class="bigbtn" style="margin-top:9px" onclick="savePrices()">✓ SAVE PRICE MATRIX</button>')
      :'<div class="cnote">Only the Owner can change a price. These are the figures every invoice is built from.</div>')+

    '<div class="sec" style="margin-top:16px">⚖️ Basket tare</div>'+
    (TARE_VERIFIED?'':'<div class="critbox" style="margin-bottom:8px">These tare weights have NOT been '+
      'verified yet. Put an EMPTY basket on the scale, key the reading here, then tick the box — until '+
      'then every net weight may be wrong.</div>')+
    '<div class="tblwrap"><table class="tbl"><tr><th>Basket</th><th class="num">Empty weight (kg)</th></tr>'+
    BASKETS.map(b=>'<tr><td><b>'+(b.ic?b.ic+' ':'')+esc(b.name)+'</b><div class="exphint">'+esc(b.id)+'</div></td>'+
      '<td class="num">'+(own&&b.id!=='NONE'
        ?('<input type="number" id="bt-'+esc(b.id)+'" min="0" step="0.01" inputmode="decimal" value="'+
          (+b.tare_kg||0)+'" style="width:90px;text-align:right">')
        :('<b>'+nf(b.tare_kg)+' kg</b>'))+'</td></tr>').join('')+'</table></div>'+
    (own?('<label style="display:flex;align-items:center;gap:8px;margin-top:8px;font-size:12.5px">'+
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
  if(!canSetPrice())return;
  pct=+pct||0; if(!pct){toast('Key a percentage first',1);return;}
  CLONE_SELL_ORDER.forEach(c=>gradesFor(c).forEach(g=>{
    const el=$('pr-'+c+'-'+g); if(!el)return;
    const v=+el.value||0;
    el.value=(Math.round(v*(1+pct/100)*100)/100).toFixed(2);}));
  toast((pct>0?'+':'')+pct+'% applied — tap SAVE to commit');}
function trendReset(){
  if(!canSetPrice())return;
  CLONE_SELL_ORDER.forEach(c=>gradesFor(c).forEach(g=>{
    const el=$('pr-'+c+'-'+g); if(el)el.value=basePriceOf(c,g).toFixed(2);}));
  toast('Back to the agreed base matrix — tap SAVE to commit');}
async function savePrices(){
  if(!canSetPrice()){toast('Only the Owner can set prices',1);return;}
  const next={};
  for(const c of CLONE_SELL_ORDER){
    next[c]={};
    for(const g of gradesFor(c)){
      const el=$('pr-'+c+'-'+g); const v=el?el.value:'';
      if(v===''||isNaN(+v)||+v<0){toast(c+' Grade '+g+' is not a valid figure',1);return;}
      next[c][g]=+(+v).toFixed(2);}}
  CLONE_PRICE=next;
  PRICE_META={at:now(),by:(CFG&&CFG.worker)||''};
  await persistPrices();
  renderPrices(); renderDispatch();
  toast('✓ Price matrix saved');}
async function saveBaskets(){
  if(!canSetPrice()){toast('Only the Owner can set the basket tare',1);return;}
  for(const b of BASKETS){
    if(b.id==='NONE'){b.tare_kg=0;continue;}
    const el=$('bt-'+b.id); if(!el)continue;
    const v=el.value;
    if(v===''||isNaN(+v)||+v<0){toast(b.name+' tare is not a valid figure',1);return;}
    b.tare_kg=+(+v).toFixed(2);}
  TARE_VERIFIED=!!($('bt-ok')&&$('bt-ok').checked);
  await persistBaskets();
  renderPrices(); renderDispatch();
  toast('✓ Basket tare saved'+(TARE_VERIFIED?'':' — still marked unverified'));}

// ======================= THE RETAILER RECORD FORM ====================================
// Replaces the chain of grey browser prompts. Same modal shell as the staff key form,
// so the two master-data screens behave identically. Opening credit is editable here —
// it is a settings figure, not money that has moved. Money that has moved is corrected
// with a credit top-up, which is an EVENT and keeps its own audit trail.
let editingRet=null, retFormStatus='Active';
function pickRetStatus(s){
  retFormStatus=s;
  const a=$('rf-active'), b=$('rf-susp');
  if(a)a.className=(s==='Active'?'on':'');
  if(b)b.className=(s==='Suspended'?'on':'');}
function openRetForm(id){
  if(!canSetPrice()){toast('Only the Owner can add or edit a retailer',1);return;}
  const r=id?retailerById(id):null;
  editingRet=r?r.id:null;
  $('rf-title').textContent=r?('Edit '+r.name):'Add retailer';
  $('rf-sub').textContent=r?'Change anything here. The live balance stays derived from the deliveries.'
                           :'Name them, give them an opening credit, done.';
  $('rf-name').value=r?r.name:'';
  $('rf-con').value =r?(r.contact||''):'';
  $('rf-open').value=r?(+r.opening_credit_rm||0).toFixed(2):'10000.00';
  pickRetStatus(r?String(r.status||'Active'):'Active');
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
  if(editingRet){
    const r=retailerById(editingRet);
    r.name=name; r.contact=con;
    r.opening_credit_rm=+(+open).toFixed(2);
    r.status=retFormStatus;
  } else {
    let n=1; while(RETAILERS.some(r=>r.id==='RT-'+String(n).padStart(2,'0')))n++;
    RETAILERS.push({id:'RT-'+String(n).padStart(2,'0'),name:name,contact:con,
      opening_credit_rm:+(+open).toFixed(2),status:retFormStatus});}
  RET_DIRTY=true; await persistRetailers();
  closeRetForm();
  if(MKT_SEL&&!activeRetailers().some(r=>r.id===MKT_SEL))MKT_SEL='';
  renderDispatch(); renderPrices(); renderMktLedger();
  toast('✓ Retailer saved');}

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

function goYieldAudit(){ openModule('costadmin','yield'); }

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
  (e.type==='LOG_VOID'||e.type==='YIELD_ACK'||e.type==='ADMIN_PURGE'||e.type==='ADMIN_CLEANUP')&&!e.synced);}
function q9(){return auditQueue().length;}
async function pushDispatch(){
  return pushOwnKey(dispQueue(),'dispatch','dispatch',
    m=>{if(!dispWarned){dispWarned=true;toast(m,1);}},
    'Dispatches kept on this phone — update the Apps Script to add the MKT_DISPATCH tab');}
async function pushAudit(){
  return pushOwnKey(auditQueue(),'audit','audit',
    m=>{if(!audWarned){audWarned=true;toast(m,1);}},
    'Audit trail kept on this phone — update the Apps Script to add the AUDIT_LOG tab');}
async function pushRetailers(){
  if(!RET_DIRTY||!CFG||!CFG.url||!navigator.onLine)return false;
  try{
    const r=await fetch(CFG.url,{method:'POST',body:JSON.stringify({retailers:RETAILERS}),
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
    status:String(x.status||'Active')}));
  if(!rows.length)return;
  RETAILERS=rows; await persistRetailers();}

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
async function persistAddedTrees(){ if(db)await put('kv',{k:'addtrees',v:ADDED_TREES}); }
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

    '<div class="sec" style="margin-top:17px">🍂 Backdate a rotten loss</div>'+
    '<div class="dl3">'+
      '<div><label>Lot</label><select id="bk-rt-lot" onchange="mdbBackTrees(\'bk-rt-lot\',\'bk-rt-tree\')"></select></div>'+
      '<div><label>Rotten fruits</label><input type="number" min="1" step="1" inputmode="numeric" id="bk-rt-n" placeholder="0"></div>'+
    '</div>'+
    '<label>Tree</label><select id="bk-rt-tree"></select>'+
    '<label>Damage cause</label><select id="bk-rt-cause">'+
      Object.keys(ROT_CAUSE).map(c=>'<option value="'+esc(c)+'">'+ROT_CAUSE[c].ic+' '+
        esc(ROT_CAUSE[c].label)+' — '+esc(ROT_CAUSE[c].note)+'</option>').join('')+'</select>'+
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
      '<div class="tblwrap"><table class="tbl">'+
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

// ================= boot =================
(async function(){
  await initStore();
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
