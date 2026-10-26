const fs=require('fs'),vm=require('vm'),assert=require('assert');
const gs=process.argv[2]||'entrega/Code_Clientes_34.gs';
const source=fs.readFileSync(gs,'utf8');
function sheet(rows){return {rows,getLastRow:()=>rows.length,getDataRange:()=>({getValues:()=>rows.map(r=>r.slice())}),getRange:(r,c,n=1,m=1)=>({getValues:()=>rows.slice(r-1,r-1+n).map(x=>x.slice(c-1,c-1+m)),getValue:()=>rows[r-1][c-1],setValues:vs=>vs.forEach((row,i)=>row.forEach((v,j)=>rows[r-1+i][c-1+j]=v))}),appendRow:r=>rows.push(r),deleteRow:r=>rows.splice(r-1,1)};}
const cliente=['C1','Ana','CF','111','222','Direccion',100,0,'SI','fecha original'];
const sheets={Clientes:sheet([['ClienteId'],cliente]),Ventas:sheet([['Cliente','NIT']])};
const config={CLIENTES:'Clientes',VENTAS:'Ventas',PEDIDOS:'Pedidos',CREDITOS:'Creditos',ABONOS:'Abonos',DEVOLUCIONES:'Devoluciones',DOCUMENTOS_VENTA:'Documentos',PAGOS_RESERVA:'PagosReserva'};
const ss={getSheetByName:n=>sheets[n]||null};let released=0;
const c=vm.createContext({CONFIG:config,auth_:()=>{},hoja_:n=>sheets[n],num_:v=>Number(v)||0,op_:()=> 'C2',SpreadsheetApp:{getActiveSpreadsheet:()=>ss},hojaOCrea_:(ss,n)=>sheets[n]||(sheets[n]=sheet([])),cab_:(s,h)=>{if(!s.rows.length)s.rows.push(h)},LockService:{getDocumentLock:()=>({waitLock(){},releaseLock(){released++}})}});
vm.runInContext(source.slice(source.indexOf('function nitIdentificadorCliente_('),source.indexOf('function registrarCreditoVenta_(')),c);
sheets.Ventas.rows.push(['Ana','CF']);
assert.throws(()=>c.eliminarCliente_('t',{clienteId:'C1'}),/No se puede eliminar/);
c.guardarCliente_('t',{clienteId:'C1',nombre:'Ana Nueva',nit:'123',limiteCredito:300});
assert.equal(cliente[1],'Ana Nueva');assert.equal(cliente[0],'C1');assert.equal(cliente[9],'fecha original');assert.equal(sheets.Clientes.rows.length,2);
assert.throws(()=>c.eliminarCliente_('t',{clienteId:'C1'}),/No se puede eliminar/);
sheets.Ventas.rows.pop();
for(const key of ['Creditos','Abonos','Pedidos','PagosReserva','Devoluciones','Documentos']){
 sheets[key]=sheet([['ClienteId','Cliente','NIT'],['C1','','']]);assert.throws(()=>c.eliminarCliente_('t',{clienteId:'C1'}));delete sheets[key];
}
cliente[7]=10;assert.throws(()=>c.eliminarCliente_('t',{clienteId:'C1'}));cliente[7]=0;
sheets.Ventas.rows.push(['Otro','CF']);c.eliminarCliente_('t',{clienteId:'C1'});assert.equal(sheets.Clientes.rows.length,1);assert(released>0);
const html=fs.readFileSync('entrega/index.html','utf8'),els={};
for(const id of ['cliId','cliNombre','cliNit','cliTelefono','cliWhatsapp','cliDireccion','cliLimite','cliEdicion','cliGuardar','listaClientes'])els[id]={value:'',focus(){}};
let cb,request;const ui=vm.createContext({$:id=>els[id],SESION:{rol:'ADMIN'},esc:v=>v,Q:v=>v,msg(){},confirm:()=>true,api:(a,p,f)=>{request={a,p};cb=f},cargarClientesPos(){}});
vm.runInContext(html.slice(html.indexOf('let CLIENTES_LISTA=[];'),html.indexOf('function cargarCreditos(){')),ui);
ui.cargarClientes();cb({ok:true,clientes:[{clienteId:'C1',nombre:'Ana',nit:'CF',limiteCredito:12}]});ui.editarClienteUI(0);assert.equal(els.cliId.value,'C1');
ui.guardarClienteUI();assert.equal(request.p.clienteId,'C1');cb({ok:false,error:'error'});assert.equal(els.cliId.value,'C1');ui.limpiarClienteUI();assert.equal(els.cliId.value,'');assert.equal(els.cliLimite.value,'0');
console.log('OK edicion conserva ID/saldo/fecha, aliases bloquean borrado, movimientos y saldo protegidos, C/F ajeno permite eliminar y UI edita por ID.');
