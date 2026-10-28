const fs=require('fs'),vm=require('vm'),assert=require('assert');
const recSource=fs.readFileSync(process.argv[2]||'entrega/Recuperar_Productos_42.gs','utf8');const temp=vm.createContext({});vm.runInContext(recSource,temp);const plan=JSON.parse(vm.runInContext('JSON.stringify(RECUPERACION_42)',temp));const data={Productos:[plan.encabezado,...plan.remanente]};for(const [name,spec]of Object.entries(plan.tablas)){const cols=Math.max(...spec.columnas)+1;data[name]=[Array(cols).fill('Cabecera'),...spec.filas.map(r=>{const x=Array(cols).fill('');spec.columnas.forEach((col,i)=>x[col]=r[i]);return x;})];}
const sheets={},properties={};let copies=0,writes=0,failAt=2;
function sheet(rows){rows=structuredClone(rows).map(r=>r.map(v=>v==null?'':v));return {rows,getDataRange(){return {getValues:()=>rows.map(r=>r.map(v=>typeof v==='string'&&v.startsWith('=')?{cellImage:true}:v)),getFormulas:()=>rows.map(r=>r.map(v=>typeof v==='string'&&v.startsWith('=')?v:''))}},getRange(row,col,n,m){return {setNumberFormat(){},setValues(vs){writes++;if(writes===failAt)throw Error('interrupcion simulada');vs.forEach((r,i)=>{while(rows.length<row+i)rows.push(Array(16).fill(''));r.forEach((v,j)=>rows[row-1+i][col-1+j]=v)})}}}};}
for(const [n,r]of Object.entries(data))sheets[n]=sheet(r);
const ss={getSheetByName:n=>sheets[n],getId:()=> 'ORIGINAL',getName:()=> 'Inventario',copy(){copies++;return {getId:()=> 'BACKUP'}}};
const ctx=vm.createContext({SpreadsheetApp:{getActiveSpreadsheet:()=>ss,flush(){}},Logger:{log(){}},LockService:{getDocumentLock:()=>({waitLock(){},releaseLock(){}})},PropertiesService:{getDocumentProperties:()=>({getProperty:k=>properties[k],setProperty:(k,v)=>properties[k]=v})}});
vm.runInContext(recSource,ctx);
const other=JSON.stringify(Object.fromEntries(Object.entries(sheets).filter(([k])=>k!=='Productos').map(([k,s])=>[k,s.rows])));
let r=ctx.revisarRecuperacion42();assert.equal(r.productosActuales,1);assert.equal(writes,0);assert.equal(copies,0);
sheets.ExistenciasSucursales.rows[1][2]++;assert.throws(()=>ctx.recuperarProductos42(),/cambiaron/);assert.equal(writes,0);assert.equal(copies,0);sheets.ExistenciasSucursales.rows[1][2]--;
assert.throws(()=>ctx.recuperarProductos42(),/interrupcion/);assert.equal(copies,1);assert.equal(sheets.Productos.rows.length,26);
failAt=-1;r=ctx.recuperarProductos42();assert.equal(r.productosActuales,627);assert.equal(copies,1);assert.equal(sheets.Productos.rows.length,628);
assert.equal(sheets.Productos.rows.slice(1).reduce((a,r)=>a+Number(r[8]),0),4586);
assert.equal(JSON.stringify(Object.fromEntries(Object.entries(sheets).filter(([k])=>k!=='Productos').map(([k,s])=>[k,s.rows]))),other);
const savedWrites=writes;ctx.recuperarProductos42();assert.equal(writes,savedWrites);
assert.equal(sheets.Productos.rows.find(r=>r[0]==='PT0177-NE-36')[8],0);assert(sheets.Productos.rows[1][12].startsWith('=IMAGE('));
console.log('OK recuperacion 627/4586, copia previa, bloqueo si cambian datos, interrupcion/reanudacion, QR y otros registros intactos, repeticion sin escrituras.');
