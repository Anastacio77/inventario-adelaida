const fs=require('fs'),vm=require('vm'),assert=require('assert');const html=fs.readFileSync(process.argv[2]||'entrega/index.html','utf8');
const nodes={};function select(id){const s={id,options:[],value:'',add(o){this.options.push(o)},dispatchEvent(){this.events=(this.events||0)+1;},insertAdjacentElement(pos,d){nodes[d.id]=d}};Object.defineProperty(s,'selectedOptions',{get(){return s.options.filter(o=>o.selected)}});Object.defineProperty(s,'innerHTML',{set(){s.options=[]}});return nodes[id]=s;}
for(const pre of ['inventarioFiltro','stockFiltro'])for(const c of ['Marca','Modelo','Color','Talla','Categoria'])select(pre+c);
for(const id of ['inventarioListaQ','stockGlobalQ','stockFiltroSucursal','inventarioSoloExistencia','inventarioSoloStockBajo','stockSoloExistencia'])nodes[id]={value:'',checked:false};
const data=[{codigo:'A',marca:'Hercules',modelo:'PT1',color:'Negro',talla:'43',categoria:'Bota',total:8,stockMinimo:10,porSucursal:{Terminal:8}},{codigo:'B',marca:'Linda',modelo:'PT2',color:'Azul',talla:44,categoria:'Tenis',total:2,stockMinimo:1,porSucursal:{Terminal:0}},{codigo:'C',marca:'Otra',modelo:'PT3',color:'Negro',talla:43,categoria:'Bota',total:0,stockMinimo:5,porSucursal:{Terminal:0}}];
const context=vm.createContext({$:id=>nodes[id],L:v=>String(v||'').toUpperCase(),esc:v=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;'),Option:function(text,value){this.text=text;this.value=value;this.selected=false;},Event:function(type){this.type=type},document:{createElement(){const input={value:'',parentElement:{querySelectorAll:()=>[]}},summary={textContent:''};return{open:false,innerHTML:'',querySelector:s=>s==='summary'?summary:input}}},INVENTARIO_LISTA_CACHE:data,STOCK_GLOBAL_CACHE:data});
vm.runInContext(html.slice(html.indexOf('const FILTROS_PRODUCTO_CAMPOS='),html.indexOf('function prepararFiltrosInventario(){')),context);
vm.runInContext(html.slice(html.indexOf('function obtenerInventarioSucursalFiltrado(){'),html.indexOf('function cargarInventarioSucursal(')),context);
vm.runInContext(html.slice(html.indexOf('function obtenerStockGlobalFiltrado(){'),html.indexOf('function prepararFilasStockGlobalTicket(')),context);
for(const pre of ['inventarioFiltro','stockFiltro'])context.prepararFiltrosMultiplesProducto(pre,data);
function choose(pre,field,values){nodes[pre+field].options.forEach(o=>o.selected=values.includes(o.value));}
choose('inventarioFiltro','Marca',['Hercules','Linda']);assert.equal(context.obtenerInventarioSucursalFiltrado().length,2);
choose('inventarioFiltro','Talla',['43','44']);choose('inventarioFiltro','Categoria',['Bota']);assert.equal(context.obtenerInventarioSucursalFiltrado()[0].codigo,'A');
choose('inventarioFiltro','Categoria',['Tenis']);assert.equal(context.obtenerInventarioSucursalFiltrado()[0].codigo,'B');
choose('inventarioFiltro','Color',['Negro']);assert.equal(context.obtenerInventarioSucursalFiltrado().length,0);
context.limpiarFiltrosMultiplesProducto('inventarioFiltro');nodes.inventarioSoloStockBajo.checked=true;assert.equal(context.obtenerInventarioSucursalFiltrado().length,2);nodes.inventarioSoloStockBajo.checked=false;
nodes.inventarioFiltroMarcaMulti.open=true;context.cambiarFiltroMultiple('inventarioFiltroMarca',0,true);assert(nodes.inventarioFiltroMarcaMulti.open);assert.equal(nodes.inventarioFiltroMarca.events,1);
context.prepararFiltrosMultiplesProducto('inventarioFiltro',data);assert.equal(context.valoresFiltroMultiple('inventarioFiltroMarca').length,1);assert(nodes.inventarioFiltroMarcaMulti.open);
assert(context.resumenFiltrosProducto('inventarioFiltro').includes('Marca: '));context.vaciarFiltroMultiple('inventarioFiltroMarca');assert.equal(context.valoresFiltroMultiple('inventarioFiltroMarca').length,0);
choose('stockFiltro','Marca',['Hercules','Linda']);choose('stockFiltro','Talla',['43','44']);assert.equal(context.obtenerStockGlobalFiltrado().length,2);nodes.stockSoloExistencia.checked=true;nodes.stockFiltroSucursal.value='Terminal';assert.equal(context.obtenerStockGlobalFiltrado()[0].codigo,'A');assert.equal(context.obtenerStockGlobalFiltrado().length,1);
// Generated event handlers compile, including quoted IDs.
const panel=nodes.stockFiltroMarcaMulti.innerHTML;for(const m of panel.matchAll(/(?:onclick|onchange)="([^"]*)"/g))new vm.Script(m[1]);
assert(html.includes("const filtros=resumenFiltrosProducto('inventarioFiltro')"));assert(html.includes("valoresFiltroMultiple('stockFiltroCategoria').join(', ')"));
console.log('OK filtros: OR por campo, AND entre campos, tallas numericas, categoria, stock/sucursal, quitar seleccion, recarga conserva seleccion, lista abierta y encabezados impresos.');
