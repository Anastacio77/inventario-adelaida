const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const gs=fs.readFileSync(process.argv[2]||'entrega/Code_Stock_Sucursales_72.gs','utf8');
const html=fs.readFileSync(process.argv[3]||'entrega/index.html','utf8');
function fixture(){
 let writes=0,fail=0,role='ADMIN',seq=0;
 const sheets={};
 function sh(name,rows=[['header']]){return sheets[name]={name,rows,getName(){return name},getLastRow(){return this.rows.length},getLastColumn(){return Math.max(...this.rows.map(r=>r.length),1)},getMaxRows:()=>10000,appendRow(r){this.rows.push(r.slice())},getRange(r,c,n=1,m=1){return {getValue:()=>this.rows[r-1]?.[c-1]??'',getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>this.rows[r+i-1]?.[c+j-1]??'')),setValues:v=>v.forEach((row,i)=>row.forEach((val,j)=>{if(++writes===fail)throw Error('Interrupcion simulada');this.rows[r+i-1]??=[];this.rows[r+i-1][c+j-1]=val;})),setValue:v=>{if(++writes===fail)throw Error('Interrupcion simulada');this.rows[r-1]??=[];this.rows[r-1][c-1]=v;}}}};}
 sh('Movimientos');sh('Productos');sh('ExistenciasSucursales');sh('Lotes');
 const config={MOV:'Movimientos',PRODUCTOS:'Productos',EXISTENCIAS:'ExistenciasSucursales',LOTES:'Lotes'};
 const ctx={console,Date,Utilities:{DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(a,s)=>crypto.createHash(a).update(s).digest(),base64EncodeWebSafe:b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_'),formatDate:d=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Guatemala',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)},SpreadsheetApp:{getActiveSpreadsheet:()=>({getSheetByName:n=>sheets[n],insertSheet:n=>sh(n,[])}),flush(){}},LockService:{getDocumentLock:()=>({waitLock(){},releaseLock(){}})}};
 vm.createContext(ctx);new vm.Script(gs);vm.runInContext(gs,ctx);
 Object.assign(ctx,{auth_:(t,roles)=>{if(roles&&!roles.includes(role))throw Error('No autorizado');return {rol:role,usuario:'admin',permisos:role==='BODEGA'?['MOV_INVENTARIO']:[]}},sucursalUso_:(s,v)=>{if(v&&v!=='LAPAZ')throw Error('Sucursal no autorizada');return 'LAPAZ'},tz_:()=> 'America/Guatemala',hoja_:n=>sheets[n],localizaProducto_:()=>({fila:2,valores:sheets.Productos.rows[1]}),asegurarColumnas_(){},op_:p=>p+'-'+(++seq)});
 const f=[new Date('2026-11-22T23:00:00Z'),'SAL-OLD','SKU','Marca','Modelo','Negro','40','SALIDA',2,5,3,100,200,'bodega','Duplicada por error · Lotes LOT-A:2','LAPAZ'];
 sheets.Movimientos.appendRow(f);sheets.Productos.appendRow(['SKU','','','','','','','',4]);
 sheets.ExistenciasSucursales.appendRow(['SKU','LAPAZ',3,0,'']);sheets.ExistenciasSucursales.appendRow(['SKU','MEGA',1,0,'']);
 sheets.Lotes.appendRow(['LOT-A','SKU',new Date('2026-11-01'),'LAPAZ',5,3,30,'CORRIDA','D']);sheets.Lotes.appendRow(['LOT-B','SKU',new Date('2026-11-01'),'MEGA',1,1,30]);
 const history=p=>ctx.historialMovimientos73_('t',p||{}),request=()=>({clave:history().movimientos[0].clave,motivo:'Salida duplicada confirmada',sucursal:'LAPAZ'}),save=p=>ctx.anularSalida73_('t',p);
 return {ctx,sheets,history,request,save,setFail:n=>{fail=n;writes=0},role:r=>role=r};
}
let t=fixture(),p=t.request(),original=JSON.stringify(t.sheets.Movimientos.rows[1]);
assert.equal(t.history({codigo:'sku',usuario:'bodega',desde:'2026-11-22',hasta:'2026-11-22',tipo:'SALIDA'}).total,1);
assert.equal(t.history({codigo:'otro'}).total,0);assert.throws(()=>t.history({sucursal:'MEGA'}));
t.role('VENDEDOR');assert.throws(()=>t.history(),/permiso/);assert.throws(()=>t.save(p),/autorizado/);t.role('BODEGA');assert.equal(t.history().total,1);assert(!t.history().movimientos[0].puedeAnular);t.role('ADMIN');
assert(p.clave.endsWith('='),'Apps Script SHA256 Base64 includes padding');
let r=t.save(p);assert(r.ok,r.error);assert.equal(r.costoRestaurado,60);assert.equal(t.sheets.Lotes.rows[1][5],5);assert.equal(t.sheets.ExistenciasSucursales.rows[1][2],5);assert.equal(t.sheets.Productos.rows[1][8],6);assert.equal(t.sheets.Movimientos.rows.length,3);assert.equal(JSON.stringify(t.sheets.Movimientos.rows[1]),original);assert(t.save(p).yaProcesado);assert.equal(t.sheets.Movimientos.rows.length,3);assert(!t.history().movimientos.find(m=>m.tipo==='SALIDA').puedeAnular);
// Moving the original row or editing its note never permits a second reversal.
t.sheets.Movimientos.rows[1][14]+=' anotacion posterior';
const nuevaClave=t.history().movimientos.find(m=>m.tipo==='SALIDA').clave;
assert(t.save({...p,clave:nuevaClave}).yaProcesado);assert.equal(t.sheets.ExistenciasSucursales.rows[1][2],5);
for(let fail=1;fail<=44;fail++){
 t=fixture();p=t.request();t.setFail(fail);r=t.save(p);t.setFail(0);
 if(!r.ok){assert(r.requiereRevision);assert.throws(()=>t.ctx.miBloquearEscritura73_('venta'),/pendiente/);assert(!t.save({...p,motivo:'Motivo modificado'}).ok);r=t.save(p);assert(r.ok,r.error);}
 assert(t.save(p).yaProcesado);assert.equal(t.sheets.Movimientos.rows.length,3);assert.equal(t.sheets.Lotes.rows[1][5],5);assert.equal(t.sheets.ExistenciasSucursales.rows[1][2],5);assert.equal(t.sheets.Productos.rows[1][8],6);t.ctx.miBloquearEscritura73_('venta');
}
for(const change of [s=>s.Movimientos.rows[1][7]='VENTA',s=>s.Movimientos.rows[1][14]='sin lotes',s=>s.Lotes.rows[1][5]=1,s=>s.Lotes.rows.push(s.Lotes.rows[1].slice()),s=>s.Productos.rows[1][8]=99]){
 t=fixture();change(t.sheets);p=t.request();const snap=JSON.stringify(t.sheets.Lotes.rows);r=t.save(p);assert(!r.ok&&r.sinCambios);assert.equal(JSON.stringify(t.sheets.Lotes.rows),snap);assert.equal(t.sheets.Movimientos.rows.length,2);
}
t=fixture();p=t.request();t.sheets.Movimientos.rows[1][13]='otro';assert(!t.save(p).ok);
t=fixture();p=t.request();t.setFail(4);assert(!t.save(p).ok);t.setFail(0);t.sheets.ExistenciasSucursales.rows[1][2]=999;assert(!t.save(p).ok);assert.equal(t.sheets.ExistenciasSucursales.rows[1][2],999);
t=fixture();t.sheets.Movimientos.rows[1][7]='SALIDA CURVA';assert(t.save(t.request()).ok);
// Frontend: double click, durable same payload after timeout, safe HTML, explicit selection.
const ids={};for(const id of ['hmCodigo73','hmUsuario73','hmDesde73','hmHasta73','hmTipo73','hmSucursal73','hmBuscar73','hmMensaje73','hmTabla73','hmMas73','hmAnulacion73','hmDetalle73','hmMotivo73','hmConfirmar73'])ids[id]={value:'',textContent:'',innerHTML:'',hidden:false};
let cb;const calls=[],storage=new Map(),ui={SESION:{usuario:'admin',token:'TOKEN'},SUCURSAL:'LAPAZ',CATALOGO_POS:[],CATALOGO_POS_TS:0,$:id=>ids[id],msg:(id,s)=>ids[id].textContent=s,confirm:()=>true,esc:s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;'),localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},api:(a,p,f)=>{calls.push({a,p:{...p}});cb=f}};
ui.TOKEN='TOKEN';vm.createContext(ui);vm.runInContext(html.slice(html.indexOf('const HM73='),html.indexOf('let SALIDA_ENVIANDO=')),ui);
ui.cargarMovimientos73();t=fixture();const lista=t.history();lista.movimientos[0].nota='<img onerror=bad>';cb(lista);assert(ids.hmTabla73.innerHTML.includes('&lt;img'));ui.seleccionarMovimiento73(0);ids.hmMotivo73.value='Duplicada por error';ui.anularMovimiento73();ui.anularMovimiento73();assert.equal(calls.length,2);assert.equal(storage.size,1);cb({ok:false,error:'Tiempo agotado'});ui.anularMovimiento73();assert.deepEqual(calls[1].p,calls[2].p);cb({ok:true,documento:'AN1',codigo:'SKU',cantidad:2,existencia:5});assert.equal(storage.size,0);assert(ids.hmAnulacion73.hidden);
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);
console.log('OK historial filtros/permisos, reversa exacta de lotes, idempotencia, 44 cortes simulados, bloqueo pendiente/conflictos, original inmutable, curva por fila y UI segura/reintento.');

for(const separador of [' · Lotes ','·Lotes ',' • Lotes ',' \u00b7\u00a0Lotes\u00a0',' Lotes ']){
 const caso=fixture();caso.sheets.Movimientos.rows[1][14]='Regalo para abuelo Jano'+separador+'LOT-A:2';
 const solicitud=caso.request(),res=caso.save(solicitud);assert(res.ok,res.error);assert(caso.save(solicitud).yaProcesado);assert.equal(caso.sheets.ExistenciasSucursales.rows[1][2],5);
}
const caso=fixture();assert.equal(caso.ctx.miLeerLotes75_('Regalo para abuelo Jano · Lotes LOT-20261118-173029-972:1')[0].id,'LOT-20261118-173029-972');
assert.throws(()=>caso.ctx.miLeerLotes75_('Regalo para abuelo Jano'));
assert.throws(()=>caso.ctx.miLeerLotes75_('Lotes LOT-A:1 texto ajeno'));
console.log('OK lectura lotes: nota de captura, espacios variables/NBSP, delimitadores y repeticion sin duplicar.');
