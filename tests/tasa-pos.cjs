const fs=require('fs'),vm=require('vm'),a=require('assert');
const gs=fs.readFileSync(process.argv[2]||'entrega/Code_Tasa_POS_61.gs','utf8'),html=fs.readFileSync(process.argv[3]||'entrega/index.html','utf8');
function sheet(){const rows=[];return {rows,getLastRow:()=>rows.length,getLastColumn:()=>30,appendRow:v=>rows.push(v),getRange:(r,c,n=1,m=1)=>({setValues(v){v.forEach((row,i)=>{rows[r-1+i]??=[];row.forEach((val,j)=>rows[r-1+i][c-1+j]=val);});},setValue(v){rows[r-1]??=[];rows[r-1][c-1]=v;},getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>rows[r-1+i]?.[c-1+j]??''))})};}
const ped=sheet(),det=sheet();ped.appendRow([]);det.appendRow([]);let seq=0,general=.43;
const c={CONFIG:{PEDIDOS:'PED',DETALLE_PEDIDOS:'DET',PRODUCTOS:'PROD'},auth_:()=>({rol:'ADMIN',usuario:'admin'}),sucursalUso_:()=> 'La Paz',resolverVendedor_:()=>'',hoja_:n=>n==='PED'?ped:det,localizaProducto_:()=>({valores:['SKU','M','X','C','N','40',10,20,100,0,'','SI','','INDIVIDUAL','']}),existenciaSucursal_:()=>({existencia:100}),precioVentaBase_:()=>10,num_:n=>Number(n)||0,norm_:n=>String(n).toUpperCase(),calcularPromocion_:()=>({descuento:0}),op_:()=> 'PED'+(++seq),fmtFecha_:()=>'',asegurarReservas_(){},asegurarColumnas_(){},obtenerDivisa_:codigo=>({codigo,tipoCambio:codigo==='GTQ'?1:general,simbolo:codigo==='GTQ'?'Q':'M$'}),SpreadsheetApp:{getActiveSpreadsheet:()=>({getSheetByName:()=>null})},puedeVerPedido_:()=>true};
vm.createContext(c);vm.runInContext(gs.slice(gs.indexOf('function tasaNegociadaEntrada_('),gs.indexOf('function puedeVerPedido_(')),c);
const params={moneda:'MXN',tasaNegociada:'.5',items:[{codigo:'SKU',cantidad:1,precioVenta:215}]};
const p=c.guardarPedido_('token',params);a.equal(p.tasaNegociada.tipoCambio,.5);a.equal(ped.rows[1].length,30);a.equal(ped.rows[1][27],'MXN');a.equal(ped.rows[1][28],.5);a.equal(ped.rows[1][29],'M$');a.equal(ped.rows[1][9],215);
general=.7;a.equal(c.tasaPedidoGuardada_(p.numeroPedido).tipoCambio,.5);a.equal(c.divisaVentaPedido_({}, {numeroPedido:p.numeroPedido,tasaNegociada:'.1'},'MXN').tipoCambio,.5);
a.equal(c.divisaVentaPedido_({}, {moneda:'MXN',tasaNegociada:'.45'},'MXN').tipoCambio,.45);a.equal(c.divisaVentaPedido_({}, {moneda:'MXN'},'MXN').tipoCambio,.7);
for(const x of ['0','-1','Infinity','abc'])a.throws(()=>c.guardarPedido_('t',{...params,tasaNegociada:x}),/Tasa/);a.equal(ped.rows.length,2);a.throws(()=>c.tasaNegociadaEntrada_({moneda:'GTQ',tasaNegociada:2}),/GTQ/);
// Reserve calls the same order creation and keeps columns 28..30 intact.
Object.assign(c,{actualizarReservasVencidas_(){},fechaVencimientoReserva_:()=>new Date(),LockService:{getDocumentLock:()=>({waitLock(){},releaseLock(){}})},validarDisponibilidadReserva_(){},requerimientosReserva_:()=>({})});
vm.runInContext(gs.slice(gs.indexOf('function reservarPedido_('),gs.indexOf('function actualizarPedido_(')),c);
const reserva=c.reservarPedido_('t',{...params,cliente:'Cliente',duracion:8});a.equal(c.tasaPedidoGuardada_(reserva.numeroPedido).tipoCambio,.5);a.equal(ped.rows[2][6],'RESERVADO');
const fields={posMoneda:{value:'MXN'},posTasaNegociada:{value:'.5'}};const ui={$:id=>fields[id],divisaActual:codigo=>({codigo,simbolo:'M$',tipoCambio:.43}),msg(){}};vm.createContext(ui);vm.runInContext(html.slice(html.indexOf('function cambiarMonedaPagoPos('),html.indexOf('function actualizarPago(){')),ui);
a.equal(ui.divisaCobroPos().tipoCambio,.5);a(ui.validarTasaPos());fields.posTasaNegociada.value='';a.equal(ui.divisaCobroPos().tipoCambio,.43);fields.posTasaNegociada.value='-1';a(!ui.validarTasaPos());
Object.assign(fields,{posMetodo:{value:'EFECTIVO'},posEfectivo:{value:600},posCambioMoneda:{value:'GTQ'},posCambio:{},divisaInfo:{},efectivoEtiqueta:{},efectivoBox:{classList:{toggle(){}}},cambioMonedaBox:{classList:{toggle(){}}},cambioBox:{classList:{toggle(){}}}});
ui.total=()=>({total:215});ui.llenarCambioMoneda=()=>{};ui.divisaActual=codigo=>({codigo,simbolo:codigo==='GTQ'?'Q':'M$',tipoCambio:codigo==='GTQ'?1:.43});
vm.runInContext(html.slice(html.indexOf('function actualizarPago(){'),html.indexOf('function cobrar(){')),ui);
fields.posTasaNegociada.value='.5';ui.actualizarPago();a(fields.divisaInfo.textContent.includes('430.00'));a.equal(fields.posCambio.textContent,'Q85.00 GTQ');
fields.posCambioMoneda.value='MXN';ui.actualizarCambio();a.equal(fields.posCambio.textContent,'M$170.00 MXN');ui.cambiarMonedaPagoPos();a.equal(fields.posTasaNegociada.value,'');a(fields.divisaInfo.textContent.includes('500.00'));
a(html.includes('tasaNegociada:tasaNegociadaPos()'));a(html.includes("value=b.tasaNegociada??''"));
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);new vm.Script(gs);new vm.Script(fs.readFileSync('entrega/sw.js','utf8'));
console.log('OK POS: tasa general/negociada, guardado en fila de pedido, reserva, cobro servidor y sintaxis');
