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
const APP_VERSION = 'v2.9.0';   // v2.9.0 — Option C six tiles, tree ledger, dual counters, untied wave, rope

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
  }
  else { EVENTS=mem.events; CFG=mem.config; CORRECTIONS=mem.corrections; }
  KEYS.forEach(k=>{if(!k.id)k.id=newUid();});   // registries saved by v2.0 had no ids
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
  (typeof q7==='function'?q7():0);}
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
  harvest:{ic:'🥭',name:'Harvest',sub:'tie, drop, rotten',
    tabs:[{k:'log', t:'TREE BOARD',scr:'harvest',panels:[]},
          {k:'wave',t:'THE WAVE',  scr:'dash',panels:['wavecard'],roles:FULL_ROLES},
          {k:'tie', t:'TYING',     scr:'dash',panels:['tyingcard'],roles:FULL_ROLES},
          {k:'today',t:'FARM TODAY',scr:'dash',panels:['kpis','phibox','lotcard','mktcard','dashnote'],roles:FULL_ROLES}]},
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
  mkt:{ic:'🚚',name:'Marketing',sub:'ready to sell, sales value',
    tabs:[{k:'sell',t:'SALES',    scr:'dash',panels:['mktpanel'],roles:FULL_ROLES}]},
  costadmin:{ic:'💰',name:'Costing / Admin',sub:'ledger, labour, staff keys',
    tabs:[{k:'sum',   t:'COSTING',    scr:'dash',panels:['ledgercard'],roles:FULL_ROLES},
          {k:'labour',t:'LABOUR',     scr:'dash',panels:['labourcard'],roles:FULL_ROLES},
          {k:'corr',  t:'ADJUSTMENTS',scr:'dash',panels:['corrpanel'], roles:FULL_ROLES},
          {k:'reg',   t:'STAFF',      scr:'dash',panels:['keyspanel'], roles:FULL_ROLES}]}
};
// Option C — six big tiles, in this order. The role gate is applied here AND again in
// roleAllows(), so calling straight into a module still exposes nothing extra.
const HUB_ORDER={
  OWNER:    ['harvest','inv','agro','ops','mkt','costadmin'],   // unrestricted
  MARKETING:['harvest','inv','agro','ops','mkt','costadmin'],
  WORKER:   ['harvest','ops'],          // Harvest + Daily Ops ONLY
  PURCHASER:['inv']                     // Inventory ONLY — stock in + low-stock alerts
};
const HUB_PANELS=['kpis','phibox','lotcard','mktcard','dashnote','invcc','ledgercard','stocktake',
  'corrpanel','keyspanel','alertcenter','pnl-in','pnl-out','onhandcard',
  'opstasks','opshistory','agrophases','agroproj','progcheck',
  'opsgeneral','opsassign','labourcard','agroweather','progready',
  'agrorain','agromonth','agrorecord','tyingcard','wavecard','mktpanel'];
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
  if(k==='costadmin'){const n=CORRECTIONS.filter(c=>String(c.status).toUpperCase()==='PENDING').length;
    return n?{t:n+' PENDING',amber:1}:null;}
  if(k==='mkt'){const kg=Math.round(collectedKg()-soldKg());
    return kg>0?{t:nf(kg)+' KG READY',amber:1}:null;}
  if(k==='harvest'){const b=LOT_KEYS.reduce((s,L)=>s+lotLedger(L).current_tied_balance,0);
    return b>0?{t:nf(b)+' ON STRING'}:null;}
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
    sb.innerHTML=tabs.map(t=>'<div class="'+(t.k===tab.k?'on':'')+'" onclick="openModule(\''+k+'\',\''+t.k+'\')">'+esc(t.t)+'</div>').join('');}
  else {sb.classList.add('hidden');sb.innerHTML='';}
  renderForTab(k,tab.k);
  $('scr-'+tab.scr).scrollTop=0;}
function renderV26(){renderWeather();renderGeneralTasks();renderAssign();
  renderLabour();renderReady();renderRain();renderTimeline();renderRecord();
  renderTying();renderMyLogs();renderRotCauses();renderWave();renderMarketing();}
function renderForTab(k,t){
  if(k==='harvest'&&t==='log'){buildLotSelect();renderMyCorrections();renderMyLogs();renderRotCauses();refreshTreeBoard();}
  if(k==='harvest'&&t==='wave')renderWave();
  if(k==='harvest'&&t==='tie')renderTying();
  if(k==='harvest'&&t==='today')renderDash();
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
  if(k==='mkt')renderMarketing();
  if(k==='costadmin'&&t==='sum')renderLedgerSummary();
  if(k==='costadmin'&&t==='labour')renderLabour();
  if(k==='costadmin'&&t==='corr')renderCorrections();
  if(k==='costadmin'&&t==='reg')renderKeys();}
function applyRole(){
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
  ledger:'costadmin',admin:'costadmin',mkt:'mkt'};
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
function bump(d){qty=Math.max(1,qty+d);$('qty').textContent=qty;}
function resetQty(){qty=1;$('qty').textContent=1;}
function setGrade(i){grade=['A','B','C'][i];[...$('grades').children].forEach((el,j)=>el.classList.toggle('on',j===i));}
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
function renderSync(){
  $('cfginfo').innerHTML=(CFG?('Worker: <b>'+(CFG.worker||'—')+'</b> <span class="small">('+(CFG.role||'')+')</span> · Device: <b>'+(CFG.device||'—')+'</b><br>Sync URL: '+(CFG.url?'<b>set ✓</b>':'<span style="color:#b3261e">not set — edit settings</span>')):'')+'<br>App version: <b>'+APP_VERSION+'</b> · <span class="linkish" onclick="logout()">log out</span>';
  const L=$('ledger');
  L.innerHTML=EVENTS.length?[...EVENTS].reverse().slice(0,60).map(e=>{
    let d;
    if(e.type==='DROP') d='🥭 '+e.qty+'× '+(e.clone||'?')+' @ '+e.tree;
    else if(e.type==='STOCK_OUT') d='📦→ '+e.qty+' '+e.unit+' '+e.pname+(e.lot?(' · Lot '+e.lot):'')+(e.progSet?(' · '+e.progSet):'');
    else if(e.type==='STOCK_IN') d='📦← '+e.qty+' '+esc(e.unit||'')+' '+esc(e.pname||'')+(e.ref?(' · '+esc(e.ref)):'');
    else if(e.type==='STOCK_ADJUST') d='🧾 stock-take '+((e.delta||0)<0?'':'+')+e.delta+' '+e.unit+' '+e.pname;
    else if(e.type==='TASK_DONE') d='🛠️ '+esc(e.kindLabel||e.kind||'task')+' · Lot '+esc(e.lot||'')+
      (e.count?(' · '+e.count+' '+esc(e.countLabel||'items')):'')+' · '+nf(e.hours*e.crew)+' man-h';
    else d=e.type;
    const right=e.synced
      ? '<span class="tag s">SYNCED</span>'
      : '<span style="display:flex;align-items:center;gap:6px"><span class="tag q">QUEUED</span><span onclick="removeEvent(\''+e.uuid+'\')" style="color:#b3261e;font-weight:800;font-size:15px;padding:2px 8px;border:1.5px solid #f1c3bf;border-radius:9px;cursor:pointer">✕</span></span>';
    return '<div class="lrow"><span>'+d+'<br><span class="small">'+e.dt+' · '+e.worker+'</span></span>'+right+'</div>';}).join('')
  :'<div class="small">No events yet.</div>';
  // v2.6.1 — a phone with an empty queue still needs to PULL the Owner's new work.
  // The button used to disable itself here, which left a worker with no way to ask.
  const b=$('syncbtn');const n=pending()+corrUnsynced()+q4();
  b.disabled=false;
  b.textContent=n?('⇧ SYNC '+n+' ITEM'+(n>1?'S':'')+' NOW'):'⇩ CHECK FOR NEW WORK';}
async function removeEvent(u){
  const e=EVENTS.find(x=>x.uuid===u);
  if(!e||e.synced)return; // synced events can never be removed from the phone
  const d=e.type==='DROP'?(e.qty+'× '+(e.clone||'?')+' @ '+e.tree):(e.qty+' '+(e.unit||'')+' '+(e.pname||''));
  if(!confirm('Delete this entry (not yet synced)?\n'+d))return;
  EVENTS=EVENTS.filter(x=>x.uuid!==u);
  if(db)await del('events',u); else mem.events=EVENTS;
  badge();renderSync();toast('Entry deleted');}
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
      for(const e of batch){e.synced=true;if(db)await put('events',e);}
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
  const batch=EVENTS.filter(e=>!e.synced&&e.type!=='STOCK_ADJUST'&&e.type!=='TASK_DONE'
    &&e.type!=='ROTTEN'&&e.type!=='DROP_ADJUST'&&e.type!=='ROTTEN_ADJUST'
    &&e.type!=='TIE'&&e.type!=='TIE_ADJUST'&&e.type!=='SALE');
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
    if(j&&j.ok){for(const e of batch){e.synced=true;if(db)await put('events',e);}rebuildLedgers();badge();renderSync();
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
    if(j&&j.ok&&j.tasklogs){for(const e of batch){e.synced=true;if(db)await put('events',e);}badge();return true;}
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
let rotQty=1, rotCause='';
function rotBump(d){rotQty=Math.max(1,rotQty+d);$('rot-n').textContent=rotQty;}
function rotReset(){rotQty=1;$('rot-n').textContent=1;}
function rotPick(c){rotCause=c;
  ROT_ORDER.forEach(k=>$('rc-'+k).classList.toggle('on',k===c));
  $('rot-err').textContent='';}
function renderRotCauses(){
  const box=$('rot-causes'); if(!box)return;
  box.innerHTML=ROT_ORDER.map(k=>'<div id="rc-'+k+'" onclick="rotPick(\''+k+'\')">'+ROT_CAUSE[k].ic+' '+
    esc(ROT_CAUSE[k].label)+'<span class="csub">'+esc(ROT_CAUSE[k].note)+'</span></div>').join('');}
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
           :'<span class="linkish" onclick="openLogCorrection(\''+e.uuid+'\')">Request correction</span>')+
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
    if(j&&j.ok&&j[flag]){for(const e of batch){e.synced=true;if(db)await put('events',e);}badge();return true;}
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
  return EVENTS.filter(e=>e.type==='DROP'&&e.tree===tree&&isSecuredDrop(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='DROP_ADJUST'&&e.tree===tree&&e.secured!==false).reduce((s,e)=>s+(+e.delta||0),0);}
function untiedDropsOf(tree){
  return EVENTS.filter(e=>e.type==='DROP'&&e.tree===tree&&!isSecuredDrop(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='DROP_ADJUST'&&e.tree===tree&&e.secured===false).reduce((s,e)=>s+(+e.delta||0),0);}
function totalDroppedOf(tree){return securedDropsOf(tree)+untiedDropsOf(tree);}
// Rotten fruit is classified the same way — a rotten fruit that was tied frees its string.
function isTiedRotten(e){return e.tied!==false;}
function rottenTiedOf(tree){
  return EVENTS.filter(e=>e.type==='ROTTEN'&&e.tree===tree&&isTiedRotten(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='ROTTEN_ADJUST'&&e.tree===tree&&e.tied!==false).reduce((s,e)=>s+(+e.delta||0),0);}
function rottenUntiedOf(tree){
  return EVENTS.filter(e=>e.type==='ROTTEN'&&e.tree===tree&&!isTiedRotten(e)).reduce((s,e)=>s+(+e.qty||0),0)
       + EVENTS.filter(e=>e.type==='ROTTEN_ADJUST'&&e.tree===tree&&e.tied===false).reduce((s,e)=>s+(+e.delta||0),0);}
// Counter A writes TIE events; the Owner-assigned Fruit tying task still writes TASK_DONE.
function tieRoundsOf(tree){
  return EVENTS.filter(e=>e.type==='TIE'&&e.tree===tree).reduce((s,e)=>s+(+e.n||0),0)
       + EVENTS.filter(e=>e.type==='TIE_ADJUST'&&e.tree===tree).reduce((s,e)=>s+(+e.delta||0),0);}

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

// ---- Counter A: continuous tying rounds ----------------------------------------------
let tieQty=1, savingTie=false;
function tieBump(d){tieQty=Math.max(1,tieQty+d);if($('tie-n'))$('tie-n').textContent=tieQty;ropeHint();}
function tieReset(){tieQty=1;if($('tie-n'))$('tie-n').textContent=1;ropeHint();}
function ropeNeeded(n){return +((+n||0)*ROPE_M_PER_FRUIT).toFixed(2);}
function ropeOnHand(){const p=prodById(ROPE_PID);return p?onHand(p):0;}
function ropeHint(){
  const box=$('tie-rope'); if(!box)return;
  const need=ropeNeeded(tieQty), have=ropeOnHand();
  box.innerHTML='Uses <b>'+nf(need)+' m</b> of rope ('+ROPE_M_PER_FRUIT+' m per fruit) · store shows <b>'+
    nf(have)+' m</b>'+(have<need?' <span style="color:#b3261e;font-weight:800">— short, ask the Purchaser to key the rolls in</span>':'');}
async function saveTieRound(){
  const err=$('tie-err'); if(err)err.textContent='';
  if(!curTree||savingTie)return;
  if(!(tieQty>0)){if(err)err.textContent='Enter how many fruits were tied.';return;}
  const L=treeLedger(curTree.id);
  if(L.has_census&&L.untied_hanging_estimate!==null&&tieQty>L.untied_hanging_estimate&&
     !confirm('⚠ '+curTree.id+' has about '+L.untied_hanging_estimate+' untied fruit left by the July census.\n'+
              'Tying '+tieQty+' takes it past that.\n\nSave anyway?'))return;
  const need=ropeNeeded(tieQty), have=ropeOnHand();
  if(have<need&&!confirm('⚠ The store shows only '+nf(have)+' m of rope and this needs '+nf(need)+' m.\n\n'+
     'Log the tying anyway? The rope balance will go negative until the Purchaser keys the rolls in.'))return;
  savingTie=true;
  const stamp=now(), rid=uuid(), t=curTree;
  try{
    await persistEvent({uuid:uuid(),type:'TIE',dt:stamp,tree:t.id,lot:t.lot,clone:t.clone||'',
      n:tieQty,ropeM:need,roundId:rid,
      worker:CFG.worker,workerId:CFG.uid||'',device:CFG.device,synced:false});
    const rp=prodById(ROPE_PID);
    if(rp&&need>0) await persistEvent({uuid:uuid(),type:'STOCK_OUT',dt:stamp,pid:ROPE_PID,pname:rp.name,
      ai:'',qty:need,unit:rp.unit,lot:t.lot,set:'Fruit tying',
      cost:+(need*(rp.cpu||0)).toFixed(2),roundId:rid,tree:t.id,
      worker:CFG.worker,device:CFG.device,synced:false});
  } finally { savingTie=false; }
  const n=tieQty, id=t.id;
  tieQty=1; if($('tie-n'))$('tie-n').textContent=1;
  badge(); refreshTreeBoard(); renderTying(); renderMyLogs(); refreshInventoryViews(); renderHub();
  toast('🪢 '+n+' tied @ '+id+' · '+nf(need)+' m rope used'+(navigator.onLine?'':' (queued)'));}

// ---- Counter B: the drop collection split --------------------------------------------
let dropKind='SECURED';
function pickDropKind(k){dropKind=k;
  DROP_ORDER.forEach(x=>{const el=$('dk-'+x);if(el)el.classList.toggle('on',x===k);});
  const h=$('drop-hint');
  if(h)h.innerHTML=DROP_KIND[k].ic+' <b>'+esc(DROP_KIND[k].label)+'</b> — '+esc(DROP_KIND[k].note)+
    (k==='SECURED'?'. Comes off the tied balance.':'. Comes off the untied estimate — it was never tied.');}

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
function refreshTreeBoard(){
  if(!curTree)return;
  const b=$('assetboard'); if(b)b.innerHTML=boardHTML(curTree);
  ropeHint();}

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
async function saveDrop(){
  if(!curTree||savingDrop)return;
  savingDrop=true;
  try{
    const t=curTree, secured=(dropKind==='SECURED');
    if(lastDrop.tree===t.id && (Date.now()-lastDrop.time)<120000){
      if(!confirm('⚠ '+t.id+' was already logged less than 2 minutes ago.\nSave AGAIN as a NEW drop?')){savingDrop=false;return;}}
    const L=treeLedger(t.id);
    if(secured&&L.current_tied_balance>0&&qty>L.current_tied_balance&&
       !confirm('⚠ '+t.id+' has only '+L.current_tied_balance+' fruit still on the string.\n'+
                'Logging '+qty+' secured takes it below zero.\n\nSave anyway?')){savingDrop=false;return;}
    if(!secured&&L.untied_hanging_estimate!==null&&L.untied_hanging_estimate>0&&qty>L.untied_hanging_estimate&&
       !confirm('⚠ '+t.id+' has about '+L.untied_hanging_estimate+' untied fruit left by the July census.\n'+
                'Logging '+qty+' unsecured takes it past that.\n\nSave anyway?')){savingDrop=false;return;}
    await persistEvent({uuid:uuid(),type:'DROP',dt:now(),tree:t.id,lot:t.lot,clone:t.clone||'',qty,grade,
      secured:secured,dropKind:dropKind,
      estkg:+(qty*(AVG_KG[t.clone]||1.6)).toFixed(1),worker:CFG.worker,device:CFG.device,synced:false});
    lastDrop={tree:t.id,time:Date.now()};
    const after=treeLedger(t.id);
    toast('✓ '+qty+' '+(secured?'secured':'unsecured')+' @ '+t.id+' · '+
      (secured?(nf(Math.max(0,after.current_tied_balance))+' still on the string')
              :(after.untied_hanging_estimate===null?'no census on this tree':nf(Math.max(0,after.untied_hanging_estimate))+' untied left'))+
      (navigator.onLine?'':' (queued)'));
    refreshTreeBoard();renderTying();renderWave();renderMyLogs();renderHub();
  } finally { savingDrop=false; }}

async function saveRotten(){
  const err=$('rot-err'); if(err)err.textContent='';
  if(!curTree||savingRot)return;
  if(!rotCause){err.textContent='Choose why the fruit was lost — a rotten count without a cause cannot be acted on.';return;}
  if(rotTied===null){err.textContent='Say whether the fruit was tied or untied.';return;}
  if(!(rotQty>0)){err.textContent='Enter how many fruits were lost.';return;}
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
  rotQty=1;rotCause='';rotTied=null;
  if($('rot-n'))$('rot-n').textContent=1;
  ROT_ORDER.forEach(k=>{const el=$('rc-'+k);if(el)el.classList.remove('on');});
  ['T','U'].forEach(k=>{const el=$('rt-'+k);if(el)el.classList.remove('on');});
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
  qty=1;$('qty').textContent=1;setGrade(0);pickDropKind('SECURED');
  tieQty=1; if($('tie-n'))$('tie-n').textContent=1;
  rotQty=1;rotCause='';rotTied=null;
  if($('rot-n'))$('rot-n').textContent=1;
  renderRotCauses();
  ['T','U'].forEach(k=>{const el=$('rt-'+k);if(el)el.classList.remove('on');});
  if($('rot-err'))$('rot-err').textContent='';
  if($('tie-err'))$('tie-err').textContent='';
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
function soldKg(){return EVENTS.filter(e=>e.type==='SALE').reduce((s,e)=>s+(+e.kg||0),0);}
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
