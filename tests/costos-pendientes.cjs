const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const backend=fs.readFileSync(process.argv[2]||'entrega/Code_Costos_Pendientes_43.gs','utf8');
const source=backend.slice(backend.indexOf("PERMISO_ACCION.corregircostoscompra='COMPRAS';"),backend.indexOf('function recibirCompra_(token,p){'));
class Sheet{constructor(rows){this.rows=rows;}getDataRange(){return{getValues:()=>this.rows.map(r=>r.slice())}}getLastRow(){return this.rows.length}appendRow(r){this.rows.push(r.slice())}getRange(row,col,n=1,m=1){const s=this;return{getValue:()=>s.rows[row-1]?.[col-1],setValue(v){return this.setValues([[v]])},setValues(v){if(s.fail&&--s.fail===0)throw Error('interrupted');for(let i=0;i<n;i++)for(let j=0;j<m;j++)s.rows[row+i-1][col+j-1]=v[i][j];return this}}}}
function setup(){const nc='COM-20261030-112402-879CB29C',cab=Array(19).fill('');Object.assign(cab,{1:nc,4:'Bodega Principal',5:'PENDIENTE',6:56659.75,7:0,8:56659.75,13:'CREDITO',14:30,16:'PENDIENTE',18:1340});const det=[['header']],prod=[['header']],ed=[];
 function add(model,color,talla,q,cost){const codigo=model+'-'+color.replace(/ /g,'')+'-'+talla;det.push(['date',nc,codigo,'description',q,cost,q*cost,0]);const p=Array(16).fill('');Object.assign(p,{0:codigo,2:model,4:color,5:talla,6:5,8:10,13:'CORRIDA',14:talla>=37?'E':talla>=33?'D':'C'});prod.push(p);if(talla>=43&&talla<=45&&['PT0016','PT0021'].includes(model))ed.push({codigo,costo:cost+1});}
 [6,6,6,6,12,12].forEach((q,i)=>add('PT0123','Negra Suela beige',27+i,q,32));[24,24].forEach((q,i)=>add('PT0123','Negra Suela beige',33+i,q,32));[36,36].forEach((q,i)=>add('PT0016','Negra Suela beige',35+i,q,46.75));[72,108,216,216,144,60,40,40,10].forEach((q,i)=>add('PT0016','Negra Suela beige',37+i,q,46.75));[30,30,30,20,20,10,5].forEach((q,i)=>add('PT0021','Blanca Suela Roja',38+i,q,54.25));
 const sheets={Compras:new Sheet([['header'],cab]),Detalle:new Sheet(det),Productos:new Sheet(prod),Lotes:new Sheet([['header'],['lote existente','OTRO','date','Sucursal',10,10,5]]),CXP:new Sheet([['header']])};let admin=true;
 const ctx=vm.createContext({PERMISO_ACCION:{},CONFIG:{COMPRAS:'Compras',DETALLE_COMPRAS:'Detalle',PRODUCTOS:'Productos',LOTES:'Lotes',CUENTAS_PAGAR:'CXP'},auth_:()=>{if(!admin)throw Error('ADMIN');return{usuario:'admin'}},sucursalUso_:(s,x)=>x,hoja_:n=>sheets[n],LockService:{getDocumentLock:()=>({waitLock(){},releaseLock(){}})},SpreadsheetApp:{getActiveSpreadsheet:()=>({getSheetByName:n=>sheets[n]||null,insertSheet:n=>(sheets[n]=new Sheet([]))}),flush(){}},Utilities:{DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(a,s)=>Array.from(crypto.createHash(a).update(s).digest())}});vm.runInContext(source,ctx);
 return {ctx,sheets,ed,p:{numeroCompra:nc,costos:JSON.stringify(ed),guardar:'NO',idSolicitud:'CC-pendiente-123'},setAdmin:v=>admin=v};}
let t=setup();const stock=JSON.stringify([t.sheets.Productos.rows,t.sheets.Lotes.rows]);let r=t.ctx.corregirCostosCompra_(t.p);assert.equal(r.total,56764.75);assert.equal(r.diferencia,105);assert.equal(r.detalles.length,5);assert.equal(r.cuentaPorPagarActualizada,false);assert.equal(t.sheets.Compras.rows[1][8],56659.75);
const apply={...t.p,guardar:'SI',firma:r.firma};r=t.ctx.corregirCostosCompra_(apply);assert.equal(t.sheets.Compras.rows[1][8],56764.75);assert.equal(t.sheets.Compras.rows[1][5],'PENDIENTE');assert.equal(t.sheets.Compras.rows[1][18],1340);assert.equal(t.sheets.CXP.rows.length,1);assert.equal(JSON.stringify([t.sheets.Productos.rows,t.sheets.Lotes.rows]),stock);assert(t.sheets.Detalle.rows.slice(1).every(x=>x[7]===0));assert.equal(t.sheets.Detalle.rows.slice(1).find(x=>x[2].endsWith('-42')&&x[2].startsWith('PT0016'))[5],46.75);assert.equal(t.sheets.Detalle.rows.slice(1).find(x=>x[2].endsWith('-36')&&x[2].startsWith('PT0016'))[5],46.75);t.ctx.corregirCostosCompra_(apply);assert.equal(t.sheets.Compras.rows[1][8],56764.75);
t=setup();r=t.ctx.corregirCostosCompra_(t.p);t.sheets.Detalle.rows[1][7]=1;assert.throws(()=>t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma}),/parcial/);
t=setup();r=t.ctx.corregirCostosCompra_(t.p);t.sheets.Compras.rows[1][18]=1400;assert.throws(()=>t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma}),/cambio/);
t=setup();r=t.ctx.corregirCostosCompra_(t.p);t.sheets.Detalle.fail=3;assert.throws(()=>t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma}),/interrupted/);r=t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma});assert.equal(r.total,56764.75);
t=setup();const cxp=Array(14).fill('');Object.assign(cxp,{1:'CXP-p',2:t.p.numeroCompra,9:56659.75,10:55659.75,11:'PARCIAL'});t.sheets.CXP.rows.push(cxp);r=t.ctx.corregirCostosCompra_(t.p);t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma});assert.equal(cxp[10],55764.75);
t=setup();t.setAdmin(false);assert.throws(()=>t.ctx.corregirCostosCompra_(t.p),/ADMIN/);
console.log('OK pendiente: 5 referencias, +105/56764.75, sin inventario ni nueva CXP, flete conservado, parcial bloqueada, vista previa vigente, reanudacion, abonos y ADMIN.');

// Sheets returns a new Date instance on each read; journal JSON stores ISO strings.
const originalRange=Sheet.prototype.getRange;
Sheet.prototype.getRange=function(...args){const r=originalRange.apply(this,args),get=r.getValue; r.getValue=()=>{const v=get();return v instanceof Date?new Date(v.getTime()):v;};return r;};
t=setup();t.sheets.Compras.rows[1][15]=new Date('2026-11-29T17:24:00.000Z');
r=t.ctx.corregirCostosCompra_(t.p);
const datedApply={...t.p,guardar:'SI',firma:r.firma};
t.ctx.corregirCostosCompra_(datedApply);
assert.equal(t.sheets.Compras.rows[1][8],56764.75);
// Persisted pending plan must resume, without changing its original signature.
t=setup();t.sheets.Compras.rows[1][15]=new Date('2026-11-29T17:24:00.000Z');r=t.ctx.corregirCostosCompra_(t.p);
t.sheets.Detalle.fail=3;assert.throws(()=>t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma}),/interrupted/);
const savedPlan=JSON.parse(t.sheets.CorreccionesCostosCompras.rows[1][5]);
assert.equal(savedPlan.guards.find(x=>x.sheet==='Compras'&&x.col===16).value,'2026-11-29T17:24:00.000Z');
t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma});assert.equal(t.sheets.Compras.rows[1][8],56764.75);
// A genuinely changed due date still blocks all pending writes.
t=setup();t.sheets.Compras.rows[1][15]=new Date('2026-11-29T17:24:00.000Z');r=t.ctx.corregirCostosCompra_(t.p);
t.sheets.Detalle.fail=1;assert.throws(()=>t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma}),/interrupted/);
t.sheets.Compras.rows[1][15]=new Date('2026-11-30T17:24:00.000Z');
assert.throws(()=>t.ctx.corregirCostosCompra_({...t.p,guardar:'SI',firma:r.firma}),/inventario cambiaron/);
assert.equal(t.sheets.Compras.rows[1][8],56659.75);
console.log('OK fechas Sheets: instancias nuevas, plan JSON reanudable y vencimiento realmente cambiado bloqueado.');
