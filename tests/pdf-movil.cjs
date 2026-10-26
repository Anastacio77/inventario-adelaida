const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('entrega/index.html','utf8');
const fn=source.slice(source.indexOf('function imprimirDocumentoHTML('),source.indexOf('function imprimirTicket('));
async function run(canShare=true,fail=false){
 const nodes=[],timers=[],urls=[],shared=[];let options,printed=0,downloads=0,popupHTML='',opened=0,afterprint;
 const ticket={scrollHeight:100,textContent:'ORDEN DE COMPRA COM-20261026-123456-TEST',cloneNode(){return {...this}}};
 const paper={};
 const doc={open(){},write(){},close(){},getElementById:()=>paper,querySelector:()=>ticket,querySelectorAll:()=>[{textContent:'.ticket{font-family:monospace}'}],documentElement:{outerHTML:'<html><head></head><body>Documento</body></html>',cloneNode(){return {outerHTML:this.outerHTML,querySelectorAll:()=>[]}}},fonts:{ready:Promise.resolve()},images:[]};
 const worker={set:o=>{options=o;return worker},from:x=>{assert.equal(x,ticket);return worker},outputPdf:async type=>{assert.equal(type,'blob');if(fail)throw Error('render');return new Blob(['%PDF-'+ 'x'.repeat(120)],{type:'application/pdf'})}};
 function el(tag){const n={tag,style:{},children:[],appendChild(x){this.children.push(x)},setAttribute(){},remove(){this.removed=true},click(){downloads++},attachShadow(){this.shadow={children:[],appendChild(x){this.children.push(x)}};return this.shadow}};nodes.push(n);return n;}
 const iframe=el('iframe');iframe.contentDocument=doc;iframe.contentWindow={document:doc,html2pdf:()=>worker,scrollTo(){},focus(){},print(){printed++},addEventListener(){}};
 const document={head:el('head'),body:el('body'),createElement:tag=>tag==='iframe'?iframe:el(tag)};
 const ctx=vm.createContext({document,navigator:{userAgent:'Android',canShare:()=>canShare,share:p=>{shared.push(p);return Promise.resolve()}},location:{href:'https://app.example.com/'},window:{focus(){},print(){printed++},addEventListener:(name,f)=>{afterprint=f},removeEventListener(){},open(url){opened++;assert(['about:blank','blob:pdf'].includes(url));return {document:{open(){},write:s=>{popupHTML=s},close(){}},focus(){},print(){printed++}}}},URL:{createObjectURL:b=>{urls.push(b);return 'blob:pdf'},revokeObjectURL(){}},Blob,File,Date,Promise,alert(){},setTimeout:(f,ms)=>{if(ms===500)timers.push(f);return 1},clearTimeout(){}});
 vm.runInContext(fn,ctx);ctx.imprimirDocumentoHTML('<h2>COMPRA</h2>');
 const button=name=>nodes.find(n=>n.textContent===name);
 assert(button('Preparando PDF...').disabled);await timers.shift()();
 if(fail){assert(button('Reintentar PDF'));assert(button('Descargar PDF').disabled);return;}
 assert(!button('Compartir PDF').disabled);assert.equal(options.jsPDF.orientation,'landscape');assert(options.pagebreak.avoid.includes('tr'));assert.equal(options.html2canvas.scrollX,0);assert.equal(options.html2canvas.scrollY,0);assert(iframe.style.cssText.includes('min-width:816px'));
 button('Compartir PDF').onclick();await Promise.resolve();
 if(canShare){assert.equal(shared.length,1);assert.equal(shared[0].files[0].type,'application/pdf');assert(shared[0].files[0].name.startsWith('COM-'));assert.equal(downloads,0);}else{assert.equal(shared.length,0);assert.equal(downloads,1);}
 button('Descargar PDF').onclick();assert(urls.length>0);button('Imprimir').onclick();assert.equal(printed,1);assert.equal(opened,0);const host=nodes.find(n=>n.id==='adelaidaImpresionMovil');assert(host.shadow.children.length===2);button('Imprimir').onclick();assert.equal(printed,1);afterprint();assert(host.removed);button('Imprimir PDF').onclick();assert.equal(opened,1);button('Abrir en otra pesta\u00f1a').onclick();assert(popupHTML.includes('window.print()'));assert(popupHTML.includes('width=816'));button('Cerrar').onclick();assert(iframe.removed);
}
(async()=>{await run();await run(false);await run(true,true);console.log('OK PDF movil: archivo PDF, nombre de documento, compartir, descarga alternativa, error/reintento, impresion y cierre.');})();
