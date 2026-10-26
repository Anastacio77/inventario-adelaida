const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('entrega/index.html','utf8');
const fn=source.slice(source.indexOf('function imprimirDocumentoHTML('),source.indexOf('function imprimirTicket('));
async function run(canShare=true,fail=false){
 const nodes=[],timers=[],urls=[],shared=[];let options,printed=0,downloads=0;
 const ticket={scrollHeight:100,textContent:'ORDEN DE COMPRA COM-20261026-123456-TEST'};
 const paper={};
 const doc={open(){},write(){},close(){},getElementById:()=>paper,querySelector:()=>ticket,documentElement:{outerHTML:'<html><body>Documento</body></html>'},fonts:{ready:Promise.resolve()},images:[]};
 const worker={set:o=>{options=o;return worker},from:x=>{assert.equal(x,ticket);return worker},outputPdf:async type=>{assert.equal(type,'blob');if(fail)throw Error('render');return new Blob(['%PDF-'+ 'x'.repeat(120)],{type:'application/pdf'})}};
 function el(tag){const n={tag,style:{},children:[],appendChild(x){this.children.push(x)},setAttribute(){},remove(){this.removed=true},click(){downloads++}};nodes.push(n);return n;}
 const iframe=el('iframe');iframe.contentDocument=doc;iframe.contentWindow={document:doc,html2pdf:()=>worker,focus(){},print(){printed++},addEventListener(){}};
 const document={body:el('body'),createElement:tag=>tag==='iframe'?iframe:el(tag)};
 const ctx=vm.createContext({document,navigator:{userAgent:'Android',canShare:()=>canShare,share:p=>{shared.push(p);return Promise.resolve()}},location:{href:'https://app.example.com/'},window:{open(){}},URL:{createObjectURL:b=>{urls.push(b);return 'blob:pdf'},revokeObjectURL(){}},Blob,File,Date,Promise,alert(){},setTimeout:(f,ms)=>{if(ms===500)timers.push(f);return 1},clearTimeout(){}});
 vm.runInContext(fn,ctx);ctx.imprimirDocumentoHTML('<h2>COMPRA</h2>');
 const button=name=>nodes.find(n=>n.textContent===name);
 assert(button('Preparando PDF...').disabled);await timers.shift()();
 if(fail){assert(button('Reintentar PDF'));assert(button('Descargar PDF').disabled);return;}
 assert(!button('Compartir PDF').disabled);assert.equal(options.jsPDF.orientation,'landscape');assert(options.pagebreak.avoid.includes('tr'));
 button('Compartir PDF').onclick();await Promise.resolve();
 if(canShare){assert.equal(shared.length,1);assert.equal(shared[0].files[0].type,'application/pdf');assert(shared[0].files[0].name.startsWith('COM-'));assert.equal(downloads,0);}else{assert.equal(shared.length,0);assert.equal(downloads,1);}
 button('Descargar PDF').onclick();assert(urls.length>0);button('Imprimir').onclick();assert.equal(printed,1);button('Cerrar').onclick();assert(iframe.removed);
}
(async()=>{await run();await run(false);await run(true,true);console.log('OK PDF movil: archivo PDF, nombre de documento, compartir, descarga alternativa, error/reintento, impresion y cierre.');})();
