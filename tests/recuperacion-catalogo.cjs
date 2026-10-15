const fs=require('fs'),vm=require('vm'),assert=require('assert');
const b=fs.readFileSync(process.argv[2]||'entrega/Code_Recuperacion_ID_23.gs','utf8');
const source=b.slice(b.indexOf('function masivoEspacio_('),b.indexOf('function masivoConfirmar_('));
class Sheet{
 constructor(rows){this.rows=rows;this.fail=false;}
 getLastRow(){return this.rows.length;}
 getMaxRows(){return 10000;}
 insertRowsAfter(){}
 getDataRange(){return {getValues:()=>this.rows.map(r=>r.slice())};}
 appendRow(r){this.rows.push(r.slice());}
 getRange(row,col,n=1,m=1){const s=this;return {setNumberFormat(){return this;},setValue(v){return this.setValues([[v]]);},setFormula(v){return this.setValue(v);},setValues(values){if(s.fail){s.fail=false;throw Error('interrupted');}for(let i=0;i<n;i++){s.rows[row+i-1]??=[];for(let j=0;j<m;j++)s.rows[row+i-1][col+j-1]=values[i][j];}return this;}};}
}
function scenario(){
 const xs=Array.from({length:103},(_,i)=>({codigo:'C'+i,marca:'FAMA',modelo:'22 01',color:'NEGRO',talla:String(i),tipo:'CORRIDA',escala:'E',cantidad:0,costo:135,precio:200,stockMinimo:2,ubicacion:'',categoria:''}));
 const product=x=>[x.codigo,x.marca,x.modelo,x.categoria,x.color,x.talla,x.costo,x.precio,0,x.stockMinimo,x.ubicacion,'SI','',x.tipo,x.escala,'SI'];
 const id='IM-1234567890';const log=new Sheet([['header'],...xs.map((x,i)=>[id,'admin','Bodega Principal',i,JSON.stringify(x),'PREPARADO']),[id,'admin','Bodega Principal',-1,'','EN_PROCESO','']]);
 const products=new Sheet([['header'],...xs.slice(0,98).map(product)]),ex=new Sheet([['header'],['C0','Bodega Principal',7,2,'']]),prices=new Sheet([['header'],['C0','P1','FIJO',333,'']]);let locks=0;
 const c={masivoAuth_:()=>({ses:{usuario:'admin'},suc:'Bodega Principal'}),LockService:{getDocumentLock:()=>({waitLock(){locks++;},releaseLock(){locks--;}})},masivoHoja_:()=>log,masivoFila_:x=>x,asegurarInventariableProductos_:()=>products,norm_:x=>String(x).toUpperCase(),inventariableProducto_:()=> 'SI',validarPreciosNuevos_:x=>JSON.parse(x),SpreadsheetApp:{flush(){}},qr_:x=>'qr/'+x,hoja_:()=>ex,CONFIG:{EXISTENCIAS:'Ex'},sucursalesActivas_:()=>['Bodega Principal','Sucursal'],preciosHojas_:()=>({p:prices})};vm.createContext(c);vm.runInContext(source,c);
 const p={modo:'CATALOGO',id,total:103,precios:JSON.stringify([{id:'P1',modo:'PORCENTAJE',valor:30,costoReferencia:''}])};return {c,p,log,products,ex,prices,xs,locks:()=>locks};
}
let t=scenario(),r,calls=0;do{r=t.c.masivoCatalogoBloque_(t.p);calls++;}while(r.pendiente);
assert.equal(calls,5);assert.equal(r.referencias,103);assert.equal(t.products.rows.length,104);assert.equal(t.ex.rows.length,207);assert.equal(t.ex.rows[1][2],7);assert.equal(t.prices.rows[1][3],333);assert.equal(t.prices.rows.length,104);assert.equal(t.locks(),0);
const sizes=[t.products.rows.length,t.ex.rows.length,t.prices.rows.length];t.c.masivoCatalogoBloque_(t.p);assert.deepEqual([t.products.rows.length,t.ex.rows.length,t.prices.rows.length],sizes);
t=scenario();t.ex.fail=true;assert.throws(()=>t.c.masivoCatalogoBloque_(t.p),/interrupted/);assert.equal(t.locks(),0);do{r=t.c.masivoCatalogoBloque_(t.p);}while(r.pendiente);assert.equal(t.products.rows.length,104);assert.equal(t.ex.rows.length,207);
t=scenario();t.log.rows[1][1]='other';assert.throws(()=>t.c.masivoCatalogoBloque_(t.p),/otro usuario/);
t=scenario();let x=JSON.parse(t.log.rows[1][4]);x.cantidad=1;t.log.rows[1][4]=JSON.stringify(x);assert.throws(()=>t.c.masivoCatalogoBloque_(t.p),/sin existencias/);assert.equal(t.products.rows.length,99);
t=scenario();t.products.rows[1][1]='OTHER';assert.throws(()=>t.c.masivoCatalogoBloque_(t.p),/incompatible/);assert.equal(t.products.rows.length,99);
console.log('OK legacy partial recovery, batches, retry after interruption, preserved stock/prices, ownership and incompatible inputs');
// Recovery must also work without any browser draft or previous session token.
const recovery=b.slice(b.indexOf('function masivoRecuperar_('),b.indexOf('function masivoEspacio_('));
t=scenario();t.c.SpreadsheetApp.getActiveSpreadsheet=()=>({getSheetByName:()=>t.log});vm.runInContext(recovery,t.c);
r=t.c.masivoRecuperar_(t.p);assert.equal(r.carga.id,t.p.id);assert.equal(r.carga.filas.length,103);assert.equal(r.carga.opciones.modo,'CATALOGO');assert.equal(r.preciosRecuperados,false);assert.equal(r.carga.opciones.precios,'[]');
t.c.masivoCatalogoBloque_(t.p);r=t.c.masivoRecuperar_(t.p);assert.equal(r.preciosRecuperados,true);assert.equal(r.carga.precios[0].valor,30);
t.log.rows[1][1]='other';assert.throws(()=>t.c.masivoRecuperar_(t.p),/mismo usuario/);
t.log.rows[1][1]='admin';t.log.rows[1][4]=JSON.stringify({...t.xs[0],cantidad:1});assert.throws(()=>t.c.masivoRecuperar_(t.p),/sin existencias/);
assert.throws(()=>t.c.masivoRecuperar_({...t.p,id:'IM-not-existing'}),/No se encontro/);
console.log('OK recovery by ID without browser draft, stored prices, ownership and catalog-only restriction');
