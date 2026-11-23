# Requisitos que deben conservarse

Toda actualización debe partir de la última versión entregada, preservar las funciones existentes y mantener iguales las versiones de HTML y Apps Script.

- Nueva compra: productos y corridas asociados al proveedor seleccionado primero. Cambiar de proveedor debe recalcular el orden. Asociaciones explícitas y compras históricas; no inferir la relación por marca.
- Traslados: múltiples referencias en un número único, impresión completa, recepción conjunta, borrador, reintentos sin duplicación y reversión de fallos.
- Conservar importación XML/Excel/CSV, catálogo sin stock, precios con nombres y porcentajes, flete separado del proveedor, descuento de administrador y exportación Excel con QR.
- Mantener texto protegido y flujo de impresión móvil.

Antes de entregar ejecutar:

```sh
node tests/prioridad-proveedor.cjs index.html
node tests/traslados-multiples.cjs index.html /ruta/al/Code.gs
```

El archivo Apps Script se distribuye en el paquete privado; no publicar credenciales en GitHub. Verificar también la sintaxis de todos los scripts y entregar el paquete completo de Cloudflare y Apps Script.

- SKU: para referencias nuevas usar iniciales de palabras de color separadas por diagonal o espacios (Black/coral BC, Black gray BG). Una palabra mantiene dos letras. Conservar codigos y QR existentes y reutilizar la referencia exacta al importar. Mantener validacion cuando dos colores comparten iniciales; no combinar productos automaticamente.
- Conservar catalogo por bloques de 25, recuperacion por ID desde servidor y actualizacion de precios de cargas completadas con vista previa y permisos de administrador.
- Ejecutar tambien tests/sku-colores.cjs, tests/recuperacion-catalogo.cjs y tests/precios-carga.cjs con la ruta del Apps Script vigente.

- Correccion de costos de compras recibidas: ADMIN, vista previa vigente, cantidades intactas, flete separado, conservar abonos, auditoria con plan anterior/nuevo, reintento sin duplicacion y reanudacion de pendientes. Detener ante lotes consumidos/trasladados o inconsistencias. Ejecutar tests/corregir-costos-compra.cjs con el GS vigente.

- POS: seleccionar Unitario por defecto al agregar una referencia sin nivel previo; actualizar importe, base y selector juntos. Conservar elecciones manuales y niveles de pedidos existentes. Ejecutar tests/pos-unitario.cjs.

- Compras: limpiar automaticamente la carga masiva solo tras confirmar orden creada, conservar numero/ID en comprobante, no descartar pendientes/errores ni una nueva carga al recibir otra orden. Limpiar formulario de recepcion tras exito. Ejecutar tests/limpieza-compras.cjs.

- La limpieza automatica tambien debe aplicarse a +Producto / Catalogo maestro cuando el servidor confirma COMPLETADO: vaciar tabla/borrador, conservar precios y comprobante con ID. Nunca limpiar por respuestas pendientes o errores.

- Traslados: incluir categoria, tipo y escala de cada codigo desde el maestro al listar/reimprimir. No depender del stock o catalogo disponible en origen ni tomar atributos de otra referencia. Conservar productos individuales reales. Ejecutar tests/escala-traslados.cjs.

- Buscador de Traslados: tocar sugerencias agrega directamente al conjunto y mantiene filtro/lista abierta como POS. Permitir varias tallas y sumar repetidos con control de stock. Conservar botones manuales y bloqueos de envio/reintento. Ejecutar tests/selector-traslados.cjs.

- Clientes: C/F, CF y consumidor final no son identificadores unicos. Guardar clientes distintos sin reemplazarlos; edicion explicita por ID conserva saldo. Creditos no deben compartir cliente por C/F ni por nombre cuando hay NIT distintos. Ejecutar tests/clientes-cf.cjs con GS vigente.

- Clientes: limpiar formulario y restablecer limite a cero solo tras guardado exitoso; conservar datos en error y bloquear guardados simultaneos.

- Clientes: acciones Editar y Eliminar por ID; conservar saldo y fecha de creacion, bloquear NIT de otro cliente. Eliminar solo sin saldo ni ventas, pedidos, creditos, abonos, devoluciones o reservas; validar en servidor y conservar identidades anteriores para comprobar movimientos tras cambiar nombre/NIT. Confirmar antes de eliminar. Ejecutar tests/clientes-edicion.cjs.

- Documentos moviles: preparar PDF en visor comun antes del gesto de compartir; compartir archivo application/pdf y ofrecer Descargar PDF cuando no hay Web Share de archivos. Conservar Imprimir/Abrir/Cerrar, evitar doble generacion, permitir reintento y no descargar al cancelar compartir. Incluir html2pdf.bundle.min.js y sus licencias en despliegue. Ejecutar tests/pdf-movil.cjs.

- PDF movil: mantener iframe de documento de 816px dentro de contenedor desplazable, capturar sin scrollX/scrollY y con viewport completo para evitar recortes laterales. En movil, Imprimir abre el PDF ya preparado dentro del gesto del usuario y explica elegir Imprimir en el visor del telefono; mantener boton deshabilitado hasta PDF listo. No usar window.print de la PWA como accion principal: usuario confirmo que no responde en apps instaladas Android/iPhone. La pestaña HTML se conserva como opcion secundaria. Conservar descarga/compartir y formato de papel.

- Traslados: mostrar columna Existencia en origen junto a cada producto seleccionado, separada de Cantidad a trasladar. Conservar cantidades, controles de stock, seleccion multiple y flujo de impresion/PDF confirmado por el usuario.

- Traslados: ante lock timeout conservar ID/lista/destino y permitir reintento con el mismo ID; nunca generar nueva solicitud por bloqueo ocupado. Servidor devuelve error reintentable sin escribir si no obtiene lock. Asegurar cabecera de traslados una sola vez en operacion multiple, no por referencia. Mantener rollback y deduplicacion.

- Traslados: cada fila incluye Trasladar todo para fijar cantidad a la existencia de esa referencia; no despacha automaticamente ni modifica otras filas. Bloquear durante envio o solicitud pendiente, validar origen y existencia positiva. Confirmacion conjunta con Despachar traslado.

- CRITICO: nunca clearContents de hojas completas para restituir traslados. Combinar formulas originales (incluidas IMAGE) con valores, escribir primero y limpiar solo filas agregadas despues de verificar escritura. Si falla, detener y exigir revision. ControlTraslados debe persistir EN_PROCESO antes de escribir y bloquear reintentos inciertos. Comprobar todas las referencias/cantidades antes de devolver duplicadoEvitado. Prevalidar catalogo antes de mutar. Ejecutar tests/restauracion-segura.cjs y tests/traslados-multiples.cjs con GS vigente.
- Recuperaciones de datos: comparar archivo actual y respaldo; conservar movimientos posteriores, reconstruir stock desde existencias actuales, validar estado antes de escribir, hacer copia previa y nunca despachar de nuevo un traslado ya registrado. Los planes privados con datos del negocio no se publican en GitHub.

- Compras: correccion de costos tambien para PENDIENTE con cero recepcion. Cambiar solo costos/subtotales de detalle y total de orden; no tocar Productos, Lotes ni Existencias. Conservar flete/cantidades y abonos; actualizar CXP solo si ya existe, no crearla anticipadamente. ADMIN, vista previa vigente, auditoria reanudable e idempotencia. Bloquear parciales y recepcion mientras haya correccion pendiente. Ejecutar tests/costos-pendientes.cjs y tests/sugerencias-costos-pendientes.cjs, ademas de correcciones recibidas.

- Correcciones de costos: comparar fechas de Sheets por valor ISO, tanto en planes nuevos como al reanudar JSON persistido; conservar firma/ID del plan pendiente. No confundir instancias Date distintas con cambios reales. Bloquear vencimientos realmente modificados. Mantener pruebas de fechas en tests/costos-pendientes.cjs.

- Compras: mostrar total pares / unidades junto al monto en lista, historial del proveedor y comprobante. En correccion de costos distinguir total de orden y cantidad afectada, calculados desde cantidades de detalle, nunca por numero de referencias ni monto. Leer detalle una vez por lista y conservar filtros por sucursal/proveedor/estado. Ejecutar tests/cantidades-compras.cjs con GS vigente.

- Recepcion de compras: espera de 180s, bloqueo de doble clic y consulta de detalle tras timeout/conexion perdida sin reenviar escritura. Confirmar cantidades antes de mostrar exito y distinguir total recibido de recibido en este intento. En reintento de RECIBIDA comprobar detalle y devolver total; bloquear discrepancias. Escribir estado RECIBIDA solo despues de cuenta por pagar y metadatos. Mantener pruebas tests/recepcion-verificada.cjs.

- Inventario y Stock global: filtros multiples Marca/Modelo/Color/Talla/Categoria con casillas y busqueda; OR dentro de cada campo y AND entre campos. Sin seleccion equivale a todos, conservar lista abierta al marcar, limpiar uno/todos y mantener seleccion disponible al actualizar. CSV e impresion deben usar la misma lista filtrada y encabezado con todas las opciones. Conservar sucursal, solo existencia y stock bajo. Ejecutar tests/filtros-multiples.cjs.

- Inventario y Stock global: boton Exportar Excel debe generar XLSX real (no CSV renombrado), con columnas separadas, encabezado/codigo destacado, bordes, anchos legibles, fila congelada y autofiltro. Cantidades numericas y codigos/modelos/tallas como texto; conservar acentos y filtros seleccionados. No modificar exportacion Productos con QR. Ejecutar tests/excel-ordenado.cjs.

- Divisas: Editar / actualizar carga todos los campos y bloquea cambiar codigo durante edicion. Guardar actualiza por codigo sin duplicar, ADMIN y lock para creacion/edicion/eliminacion. Eliminar confirma y retira de cobros con Activa=NO conservando historial; GTQ no se elimina y tasa base siempre 1. Bloquear envios simultaneos, conservar campos en error, limpiar tras exito y recargar opciones POS/pedidos. Ejecutar tests/divisas-editar.cjs.

- Todo documento exportable a hoja de calculo debe descargar XLSX real: compras con metadatos/proveedor/NIT, detalle en columnas, costos y cantidades numericas, total pares/unidades y flete separado; Inventario, Stock global y plantilla masiva tambien XLSX. Productos mantiene QR incrustado. En compras autofiltro solo sobre detalle, encabezado destacado y congelado en fila correcta; metadatos y totales fuera del filtro. CSV/TSV siguen admitidos para importar. Ejecutar tests/excel-compras.cjs y tests/excel-ordenado.cjs.

- Compras nuevas (manuales y masivas): BORRADOR -> ENVIADA -> PARCIAL/RECIBIDA. BORRADOR permite modificar proveedor/referencias/cantidades/costos/flete/condiciones/nota con mismo numero y revision vigente; Anular conserva historial sin inventario/CXP; no borrar fisicamente. Marcar enviada es registro manual del envio al proveedor, sin mensajeria automatica. No recibir BORRADOR ni ANULADA. PENDIENTE historica sigue recibible sin migrar datos. ADMIN/BODEGA, validacion de sucursal y lock. EdicionesCompras persiste plan antes de escribir, reanudar por mismo usuario, validar celdas antes/nuevo y bloquear recepcion/acciones ante pendiente; nunca vaciar hojas completas ni tocar otras ordenes. Probar tests/compras-borrador.cjs.

- Pagos a proveedor: mostrar procesando/exito/error junto a la cuenta, bloquear doble clic y conservar ID de solicitud tras respuestas inciertas. Servidor ADMIN/CAJERO, sucursal, lock, saldo vigente y caja abierta antes de mutaciones; plan ControlPagosProveedor persistido antes de escribir y reanudable por mismo usuario/ID/monto/metodo, sin duplicar abono ni retiro. Actualizar saldo/estado CXP y estadoPago de compra (sin cambiar estado de recepcion), PAGADA a saldo cero y PARCIAL en abono. Detener ante conflicto y bloquear descuentos mientras pago pendiente. Pruebas tests/pagos-proveedor.cjs.

- POS: opcion MANUAL / poner precio en Elegir precio solo ADMIN; mostrar costo minimo y editar Precio venta. Base manual es costo maestro actual incluido flete, elevado al centavo si tiene precision adicional. Guardar valida rol y piso contra costo del servidor; no confiar en base/costo enviado por cliente. Mantener seleccion manual al recargar precios y niveles comunes/default unitario intactos; no modificar catalogo ni precio de otras referencias. Ejecutar tests/precio-manual.cjs y tests/pos-unitario.cjs.

- Navegacion POS hasta 68 (sustituida por interfaz modular 69 autorizada): al entrar mostrar inicio de vistaPos arriba y mover el mismo menu tabs debajo de POS, sin clonar botones ni perder permisos/handlers. Acceso Otros modulos arriba para desplazar al menu y sucursal actual visible. En otros modulos restaurar tabs a su ancla original. Preservar carrito al navegar. Ejecutar tests/interfaz-pos.cjs.

- PDF escritorio: ruta separada de movil. Preparar PDF real antes de habilitar Vista previa PDF / Imprimir / Descargar PDF; abrir PDF Blob desde gesto de usuario y conservar URL mientras visor lo usa, sin imprimir automaticamente iframe temporal. Mac puede descargar y abrir archivo fisico desde Descargas en Vista Previa. No modificar rama Android/iPhone/iPad confirmada. Ejecutar tests/pdf-escritorio.cjs y tests/pdf-movil.cjs; comparar rama movil con version 54.

- Ingreso masivo COMPRA: columna informativa Costo + flete / unidad junto a costo; repartir flete por unidades totales, recalcular al editar flete/costo/cantidades/filas. No modificar BM_COLS, payload, costo base, precios de venta ni total del proveedor. Conservar importaciones y ocultar en otros modos. Ejecutar tests/costo-flete.cjs.

- Pedido y comprobante de venta: selector Ver precios en convierte visualmente precio unitario, subtotales, descuento y total; mismo HTML se imprime/exporta PDF. No alterar datos GTQ ni divisa/importe de cobro. GTQ por defecto, tasas positivas, conservar tasa historica si coincide divisa de pago de venta, otras segun configuracion actual. Otros documentos mantienen Q. Ejecutar tests/vista-divisa.cjs.

- Vista de precios en divisa: importes de pedido/comprobante muestran solo simbolo y numero, sin repetir codigo MXN/USD en cada celda o total. Moneda y tasa se indican una vez en encabezado. Mantener conversion y cobro intactos.

- Historial de ventas: ticketHistorial incluye Ver precios en para reimpresion/PDF en Q o divisa. Reimprimir abre comprobante y selector antes de imprimir; usuario elige formato. No mutar venta/cobro ni perder formato de simbolo sin codigo repetido. Probar historial en tests/vista-divisa.cjs.

- Tasa negociada por pedido: guardar en servidor por numero, moneda/tasa/simbolo propios sin cambiar Divisas. Pendiente/reservado con permisos y sucursal, lock y revision contra cambios concurrentes; GTQ=1 y tasas finitas positivas. Conservar consulta, reimpresion, saldo/cambio y venta en misma divisa; tasa servidor, nunca tasa enviada por cliente. Bloquear cambios completados/procesando, conservar vinculo numeroPedido para historial de venta. Pruebas tests/tasa-pedido.cjs y tests/vista-divisa.cjs.

- POS: Tipo de cambio negociado opcional junto a Divisa de pago. Vacio usa tasa general; positivo finito y GTQ=1 validado en servidor. Aplicar a total divisa/efectivo/cambio y guardar tasa historica de venta. Guardar/reservar desde POS persiste moneda/tasa/simbolo en columnas 28..30 de la misma fila Pedidos; TasasPedidos posterior prevalece. Mantener tasa al alternar borradores en espera; limpiar en nueva operacion/cambio de divisa, no alterar Divisas. Cobro de pedido existente ignora tasa enviada y usa la guardada. Probar tests/tasa-pos.cjs, tests/tasa-pedido.cjs y tests/vista-divisa.cjs.

- Comisiones: filtro vendedor/estado en sucursal actual, vendedores solo datos propios; totales completos aunque tabla limite 200. Pago ADMIN de hasta 20 comisiones pendientes del mismo vendedor con firmas vigentes, monto calculado servidor y centavos, sin pagar duplicadas. Efectivo requiere caja abierta y retiro; transferencia solo registra pago externo sin retiro. ControlPagosComisiones persiste plan antes de mutar, mismo ID/datos/usuario al reanudar, validar celdas antes/nuevo, no sobrescribir conflictos. Guardar estado/fecha/comprobante/metodo/usuario e historial, mostrar EN_PROCESO hasta confirmar y bloquear doble clic. Preservar ID local y recuperable del servidor. Probar tests/comisiones-pagos.cjs.

- Salidas Inventario: avisos junto a boton Procesando/Completada, bloquear doble clic individual y curva. ID persistido por usuario/sucursal/tipo y servidor bajo lock; reintento usa mismo payload/ID, completada devuelve resultado sin repetir FIFO/stock/movimientos. ControlSalidasInventario EN_PROCESO antes de mutacion; interrupcion real REVISION bloquea reejecucion/nueva salida, no improvisar rollback de hojas. Validacion sin mutaciones permite corregir campos; errores inciertos conservan ID. Limpiar cantidad/seleccion solo tras confirmacion, conservar historial previo. Ejecutar tests/salidas-seguras.cjs.

- Traslados: resumen visible sobre Despachar traslado con numero de referencias seleccionadas y suma de cantidades (pares/unidades). Recalcular desde TRAS_PRODUCTOS al agregar/quitar/editar/Trasladar todo/restaurar y limpiar tras confirmacion; no modificar payload ni cantidades por mostrar el resumen.

- Traslado: limpiar lista, destino, nota, buscador, selector y cantidades solo tras confirmacion de despacho, conservar comprobante y dejar listo para otro. Tras timeout consultar estado en lectura sin reenviar mutaciones; verificar control COMPLETADO y todas las filas/codigos/cantidades/origen/destino antes de limpiar. Boton consulta pendiente y recuperacion de borrador; consultas limitadas ante bloqueo. Nunca limpiar pendiente, parcial, revision, otra sucursal o lista nueva por respuesta tardia. Probar tests/limpieza-traslado.cjs.

- Producto INDIVIDUAL: talla opcional/vacia, escala vacia en alta individual e ingreso masivo (tambien una referencia manual sin tallas). CORRIDA mantiene talla/escala obligatorias y validacion de escala. Codigo nuevo sin talla modelo-color sin guion final; exactos historicos conservan SKU/QR. No introducir tallas ficticias ni cambiar referencias existentes. Catalogo mantiene cantidad cero; COMPRA/INICIAL cantidad positiva. Validar cliente y servidor con tests/individual-sin-talla.cjs.


- Gestion financiera: modulo exclusivo ADMIN, sucursal actual, GTQ. Cuentas bancarias con saldo inicial separado de ingresos; gastos/otros ingresos y transferencias banco/caja, caja abierta obligatoria al registrar efectivo. Saldos bancarios calculados en centavos desde saldo inicial y movimientos COMPLETADOS. Resumen mensual consulta ventas, compras enviadas/recibidas, cobros/anticipos, pagos proveedores, comisiones COMPLETADAS y saldos actuales CXC/CXP; no anunciar utilidad contable ni flujo completo. Vincular fuentes bancarias existentes solo una vez, monto obtenido servidor, sin duplicar resumen; excluir credito/saldo a favor como cobros. ControlFinanzas guarda plan antes de mutaciones, lock, mismo ID/payload/usuario/sucursal para reanudar, validar todas las celdas antes/despues y rechazar conflictos sin sobrescribir. UI bloquea doble clic, conserva solicitud tras timeout y confirma antes de limpiar. Excel XLSX y PDF por motor existente. Mantener privado Code_Gestion_Financiera_67.gs. Probar tests/gestion-financiera.cjs y regresiones.



- Contabilidad general 68: exclusiva ADMIN, partida doble en GTQ, plan jerarquico con cuentas de movimiento, 2-20 lineas Debe=Haber al centavo. Polizas confirmadas inmutables, correcciones con ajuste/reversa unica en periodo abierto; no modificar POS/inventario desde contabilidad. ContInicio fijo por sucursal y apertura revisada, bancos iniciales sin ingreso. Generacion automatica al abrir/sincronizar por lotes de hasta cinco polizas: ventas/CXC, cobros, anticipos/aplicacion, costo FIFO, compras por lote recibido con flete separado de proveedor, abonos CXP, comisiones devengadas/pagadas, movimientos financieros confirmados. Evitar duplicar MovimientosCaja ligados; descuentos no monetarios y devoluciones/ajustes/traslados ambiguos a revision manual. Fuente+firma estable: no repetir, no sobrescribir si documento cambia; permitir sustitucion manual de fuente y vincular poliza que resuelve revision. Categoria Pago flete de compra cancela 2104; Pago impuesto PC cancela 2105. Diario, mayor con apertura del rango, balanza, balance y resultados por sucursal/consolidado de asientos confirmados. Cifras provisionales si faltan apertura/fuentes/revisiones; consolidado no elimina saldos internos automaticamente. Pequeno contribuyente confirmado, regla versionada/explicita (propuesta 5%, nunca IVA general 12% ni credito fiscal compras), base cuenta Ventas; provision incremental sin duplicar en fin de mes/fecha actual, retenciones documentadas manualmente y pagos contra pasivo; no SAT/FEL/declaracion automatica. Conciliacion CSV/XLSX GTQ ID estable, importacion persistente lotes de 20, estados de cuenta con control saldos, cruce unico banco/mes/signo/monto exacto, deshacer auditado, apertura no conciliable. ControlContabilidad persiste antes de escribir, lock global, reanudar mismo ID/datos/usuario/sucursal, validar todos los rangos antes de escribir y no sobrescribir conflictos. Ocultar saldos de operacion pendiente; UI bloquea doble clic, conserva cola tras timeout, no descarta incertidumbre. Cierre mensual solo terminado/revisado/provisionado, bloquea retroactivos, no borra ni cierre anual automatico. Mantener archivo GS privado y motor PDF movil/escritorio intacto. Ejecutar tests/contabilidad-general.cjs, tests/contabilidad-interfaz.cjs y regresiones.


- Interfaz modular 69: por solicitud del usuario, sustituir menu plano y menu debajo de POS por sidebar de computadora y desplegable nativo movil. Un modulo/una opcion visibles, encabezado y sucursal actual; conservar los mismos nodos, IDs, handlers, permisos, carrito y formularios pendientes. Ocultar solo con nav69-inactivo, sin borrar datos ni cambiar oculto funcional. Secciones en Compras, Inventario, Producto, Traslados, Clientes, Contabilidad y demas modulos; detalle/recepcion/comprobantes deben activarse al abrir y volver a operacion al cerrarse. Carga masiva compartida conserva nodo/datos al pasar Producto/Compras. Menu respeta oculto por rol y funciona tras cerrar/iniciar sesion y cambio de pantalla. No cambiar caja, stock, asientos, cobros ni motor PDF. Probar tests/interfaz-modular.cjs y regresiones.


- Pedido en pestana 70: Guardar pedido y confirmar reserva desde POS reservan nueva pestana dentro del clic, cargan comprobante desde detalle confirmado del servidor sin mostrar tarjetas ni overlay en el POS. Boton de consulta/reapertura cuando popup bloqueado/cerrado/fallo de lectura, solo API detallepedido, nunca repetir guardarpedido/reservarpedido para imprimir. Alternativa Blob HTML completo desde gesto directo sin depender del WindowProxy en PWA. Vista autosuficiente sin API/token/opener, puede imprimir con mismos motores movil/escritorio serializados y recurso PDF absoluto; no modificar funciones originales, papel/PDF/compartir. Conservar selector de moneda y tasa negociada mediante copias de solo lectura; reserva incluye pedido y comprobante de anticipo. Bloquear doble clic mientras guarda, liberar al confirmar, limpiar POS solo si mismo usuario/sucursal/borrador/formulario; no borrar otra captura por respuesta tardia. Documento independiente de main POS tras cargar. Errores/timeout conservan formulario y advierten consultar Pedidos; reintentos de impresion no escriben. Servidor solo cambia version. Probar tests/pedido-pestana.cjs y regresiones.


- Interfaz intuitiva 71: partir de 70 y conservar todos sus comprobantes independientes. Agrupar los botones originales en desplegables Ventas/Mercaderia/Finanzas/Administracion; no clonar botones ni cambiar permisos, ocultar grupos vacios y atajos por permisos reales. Inicio con Nueva venta/Nuevo pedido (borrador previo en espera), Recibir compra y Nuevo traslado; pendientes enlazados a las vistas existentes, importes CXC/CXP rotulados como saldos. POS en columnas escritorio, buscador/catalogo local con existencia y maximo 24 referencias a izquierda, pedido/total/cobro a derecha, agregar siempre por handler original con validacion de stock; en movil alternar productos/pedido mediante barra de cantidad/total, sin duplicar formulario. Intencion venta/pedido/reserva resalta solo la accion permitida, no altera cobro ni elimina datos. Mas detalles mueve campos opcionales originales sin clonarlos; asteriscos informativos solo en campos realmente obligatorios, nunca talla obligatoria en INDIVIDUAL. Compras/traslados: Preparar -> Revisar -> Confirmar sin escrituras hasta Confirmar; resumen read-only con cantidades y flete separado de proveedor, preservar datos al volver, detectar cambios de firma/usuario/sucursal antes de ejecutar handlers existentes; respetar bloqueos/IDs/consultas pendientes y limpiar paso solo tras limpieza confirmada del flujo original. Mensajes visibles y accesibles; distinguir Pendiente de recibir y Pendiente de pago; filtro local de compras no cambia enum/servidor. Ver documento aparte/PDF compartible en pestana Blob sin token/API/opener, mismos motores PDF originales. No cambiar reglas de stock/caja/costos/asientos; backend solo version. Probar tests/interfaz-intuitiva.cjs, tests/interfaz-modular.cjs, tests/pedido-pestana.cjs y regresiones completas.

## 72 - Disponibilidad en otras sucursales
- En POS, al consultar/agregar/escanear un SKU agotado en la sucursal actual, indicar las sucursales activas con stock positivo y sus cantidades para el mismo SKU/talla exactos.
- Mostrar el detalle en sugerencias agotadas y aviso bajo el buscador. No cambiar sucursal, no usar stock ajeno para vender y no escribir en inventario.
- Consulta autenticada, agrupada, una lectura de existencias por lote y cache breve. Nunca confundir error de consulta con cero disponibilidad; descartar respuestas de busqueda/sucursal/sesion anteriores.
- Conservar interfaz 71, carrito, permisos, seleccion multiple, precios, FIFO y motores PDF existentes.


## 73 - Historial y anulacion de salidas
- Historial por codigo, fechas, sucursal autorizada, usuario y tipo, paginado.
- Anular exclusivamente salidas manuales como ADMIN, con motivo y confirmacion. Conservar original y crear movimiento inverso; restaurar lotes/existencias una sola vez mediante control duradero.
- Reanudar la misma solicitud ante tiempo agotado; bloquear conflictos y otras escrituras si queda pendiente. No restaurar salidas sin lotes recuperables.
- Movimientos manuales y sus anulaciones requieren revision contable; no crear reversas aisladas si el original no se contabilizo.
- Conservar todas las mejoras 66-72 y pruebas de pedidos/pagos/divisas/contabilidad.


## 76 - Ajuste de entrada
- Solo ADMIN: cantidad positiva, costo explicito, motivo y referencia opcional; lote unico y movimiento AJUSTE ENTRADA con cantidades antes/despues. Sin cambiar precios ni pagos a proveedores.
- ControlAjustesEntrada duradero, mismo ID al reintentar, solicitud inmutable y bloqueo de escrituras hasta resolver conflictos; no duplicar lotes ni existencias.
- Mercancia nueva por Compras; correccion de salidas por Anular salida; ajustes pendientes de revision contable.


## 77 - Acceso Ajustes en Inventario
- Pestana Ajustes con buscador y formularios originales de entrada/salida, sin desplazarse por precios/atributos; conservar datos y handlers.
- Consultar un producto desde Ajustes conserva la opcion activa. Ficha completa disponible en Consultar / movimientos.
- Conservar permiso MOV_INVENTARIO, entrada solo ADMIN y protecciones de 76.
