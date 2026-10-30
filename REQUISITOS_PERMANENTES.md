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
