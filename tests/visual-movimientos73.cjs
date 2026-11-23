const fs=require('fs'),{chromium}=require('playwright');
(async()=>{
 const html=fs.readFileSync('Cloudflare/index.html','utf8'),card=html.slice(html.indexOf('<div id="historialMovimientosCard73"'),html.indexOf('<div id="inventarioCurvasCard"'));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<html><head>'+html.match(/<style[^>]*>[\s\S]*?<\/style>/)[0]+'</head><body>'+card+'</body></html>');
 await page.addScriptTag({content:`const SESION={usuario:'admin'},TOKEN='demo',SUCURSAL='LAPAZ';let CATALOGO_POS=[],CATALOGO_POS_TS=0;const $=id=>document.getElementById(id),esc=s=>String(s||'').replaceAll('<','&lt;').replaceAll('>','&gt;'),msg=(id,s)=>$(id).textContent=s;function api(a,p,cb){cb({ok:true,total:1,siguiente:null,sucursal:'LAPAZ',pendientes:[],movimientos:[{clave:'2-demo',fila:2,fecha:'22/11/2026 17:00',operacion:'SAL-PRUEBA',codigo:'SKU-NEGRO-40',descripcion:'Marca Modelo Negro 40',tipo:'SALIDA',cantidad:2,antes:5,despues:3,usuario:'bodega',sucursal:'LAPAZ',nota:'Salida duplicada',estado:'REGISTRADO',puedeAnular:true}]});}`+html.slice(html.indexOf('const HM73='),html.indexOf('let SALIDA_ENVIANDO='))});
 await page.getByRole('button',{name:'Consultar movimientos'}).click();await page.getByRole('button',{name:'Revisar / anular'}).click();
 if(!(await page.locator('#hmDetalle73').innerText()).includes('SKU-NEGRO-40'))throw Error('Detalle no visible');
 await page.screenshot({path:'visual-movimientos73-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'visual-movimientos73-mobile.png',fullPage:true});
 if(errors.length)throw Error(errors.join('\n'));await browser.close();console.log('OK render escritorio/movil y seleccion de salida, sin errores JS.');
})().catch(e=>{console.error(e);process.exit(1)});
