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

- Navegacion POS: al entrar mostrar inicio de vistaPos arriba y mover el mismo menu tabs debajo de POS, sin clonar botones ni perder permisos/handlers. Acceso Otros modulos arriba para desplazar al menu y sucursal actual visible. En otros modulos restaurar tabs a su ancla original. Preservar carrito al navegar. Ejecutar tests/interfaz-pos.cjs.

- PDF escritorio: ruta separada de movil. Preparar PDF real antes de habilitar Vista previa PDF / Imprimir / Descargar PDF; abrir PDF Blob desde gesto de usuario y conservar URL mientras visor lo usa, sin imprimir automaticamente iframe temporal. Mac puede descargar y abrir archivo fisico desde Descargas en Vista Previa. No modificar rama Android/iPhone/iPad confirmada. Ejecutar tests/pdf-escritorio.cjs y tests/pdf-movil.cjs; comparar rama movil con version 54.

- Ingreso masivo COMPRA: columna informativa Costo + flete / unidad junto a costo; repartir flete por unidades totales, recalcular al editar flete/costo/cantidades/filas. No modificar BM_COLS, payload, costo base, precios de venta ni total del proveedor. Conservar importaciones y ocultar en otros modos. Ejecutar tests/costo-flete.cjs.

- Pedido y comprobante de venta: selector Ver precios en convierte visualmente precio unitario, subtotales, descuento y total; mismo HTML se imprime/exporta PDF. No alterar datos GTQ ni divisa/importe de cobro. GTQ por defecto, tasas positivas, conservar tasa historica si coincide divisa de pago de venta, otras segun configuracion actual. Otros documentos mantienen Q. Ejecutar tests/vista-divisa.cjs.

- Vista de precios en divisa: importes de pedido/comprobante muestran solo simbolo y numero, sin repetir codigo MXN/USD en cada celda o total. Moneda y tasa se indican una vez en encabezado. Mantener conversion y cobro intactos.

- Historial de ventas: ticketHistorial incluye Ver precios en para reimpresion/PDF en Q o divisa. Reimprimir abre comprobante y selector antes de imprimir; usuario elige formato. No mutar venta/cobro ni perder formato de simbolo sin codigo repetido. Probar historial en tests/vista-divisa.cjs.

- Tasa negociada por pedido: guardar en servidor por numero, moneda/tasa/simbolo propios sin cambiar Divisas. Pendiente/reservado con permisos y sucursal, lock y revision contra cambios concurrentes; GTQ=1 y tasas finitas positivas. Conservar consulta, reimpresion, saldo/cambio y venta en misma divisa; tasa servidor, nunca tasa enviada por cliente. Bloquear cambios completados/procesando, conservar vinculo numeroPedido para historial de venta. Pruebas tests/tasa-pedido.cjs y tests/vista-divisa.cjs.
