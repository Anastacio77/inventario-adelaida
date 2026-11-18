# Comercial Adelaida - Contabilidad general 68

Version: 2026.11.18-CONTABILIDAD-GENERAL-68.

## Instalacion

1. En el proyecto Apps Script original, reemplazar todo Codigo.gs por Code_Contabilidad_General_68.gs. Guardar e implementar una Nueva version, conservando la URL /exec y la hoja actual.
2. Subir los cinco archivos de Cloudflare/ del ZIP al proyecto Cloudflare actual. GitHub no despliega Cloudflare automaticamente.
3. Entrar como administrador: Otros modulos > Contabilidad general. Las hojas contables se crean al confirmar la primera operacion. No ejecutar funciones de recuperacion ni crear otra hoja.
4. Se puede instalar directamente el paquete completo 68. Incluye Gestion financiera 67 y los cambios anteriores.

## Primera configuracion

- Elegir sucursal. Confirmar una sola vez la fecha inicial de importacion del POS. Es fija para impedir reimportaciones de periodos distintos.
- Registrar una poliza de APERTURA con los saldos anteriores a esa fecha: activos al Debe, obligaciones/capital al Haber segun corresponda. Debe y Haber tienen que cuadrar. No registrar como ingreso el saldo inicial.
- No duplicar los saldos iniciales de bancos que se importen desde Gestion financiera; comprobar las polizas APERTURA de esos bancos. Los bancos con apertura anterior a la fecha de importacion requieren saldo de apertura contable revisado.
- Confirmar la regla tributaria: pequeno contribuyente, vigencia el primer dia del mes y porcentaje revisado. El formulario propone 5%; hasta confirmar no calcula/provisiona automaticamente el impuesto. La regla se comparte entre sucursales y las vigencias ya provisionadas no se modifican retroactivamente.
- Repetir apertura/fecha inicial para las demas sucursales. El consolidado solo incluye las sucursales contabilizadas. No elimina saldos internos por si solo.

## Plan y polizas

Plan inicial: activos, pasivos, capital, ingresos, gastos y costo de ventas. Se pueden agregar grupos y cuentas con naturaleza deudora/acreedora. Cada cuenta nueva hereda el tipo del grupo padre. Los grupos no reciben asientos.

Las polizas manuales, de apertura y de ajuste admiten 2 a 20 lineas. Cada linea tiene solo Debe o Haber, importes positivos con hasta dos decimales. Las lineas de la cuenta 1102 requieren identificar el banco. Los asientos descuadrados se rechazan en el servidor.

No se borran ni sobrescriben polizas confirmadas. Usar Reversar con fecha de periodo abierto y motivo, o una poliza de ajuste. El original y la reversa permanecen en diario/mayor. Una poliza no se reversa dos veces.

Una poliza manual puede sustituir una fuente pendiente seleccionada expresamente: debe contabilizar toda esa operacion y usar su fecha. Si la fuente pertenece a un periodo cerrado, usar AJUSTE en un periodo abierto. Esto evita que la sincronizacion vuelva a contabilizar la misma fuente.

## Generacion automatica desde el POS

Se generan al abrir el modulo con Sincronizar automaticamente marcado, o al pulsar Sincronizar operaciones POS. No agrega demoras ni cambia el proceso existente de cobro/recepcion en el POS. Cada lote contabiliza hasta cinco polizas, conservando solicitudes ante interrupciones; cada ciclo de pantalla procesa hasta diez lotes y muestra lo que falte para continuar.

- Venta: clientes por cobrar contra ventas. El cobro se registra aparte contra clientes; una venta a credito queda con saldo pendiente.
- Cobros y abonos: efectivo contra caja; tarjeta/transferencia/cheque contra fondos bancarios por identificar. No vuelve a reconocer ingreso al cobrar una deuda.
- Reservas: anticipo recibido contra anticipos de clientes; al completar el pedido se aplica contra la cuenta del cliente.
- Costo vendido: costo FIFO real del detalle de lotes contra inventario. Si falta costo, aparece revision; no se inventa un costo.
- Compra: se contabiliza mercaderia realmente recibida por lote, incluso recepcion parcial. Debita inventario y acredita proveedor por su costo; el flete incluido en el lote acredita fletes por pagar. Una orden solo enviada no incrementa inventario contable.
- Pago a proveedor: cancela proveedores; no vuelve a registrar la compra. Descuentos no monetarios se dejan para revision/manual, no se tratan como pago bancario.
- Comision: gasto y obligacion al devengarse; el pago confirmado cancela la obligacion.
- Gastos, otros ingresos y transferencias de Gestion financiera: se contabilizan desde movimientos confirmados, sin duplicar su movimiento de caja asociado.
- Para pagar el flete previamente incorporado al inventario, elegir en Gestion financiera la categoria **Pago flete de compra**; cancela la cuenta 2104, no vuelve a gastar el flete. **Pago impuesto PC** cancela la cuenta 2105. La categoria Transporte ordinaria sigue siendo gasto operativo.
- Para identificar banco en cobros/pagos anteriores: Gestion financiera > Vincular cobro o pago existente. Contablemente mueve fondos por identificar hacia/desde el banco identificado, sin volver a registrar la venta/gasto.
- Movimientos de caja no identificados se registran contra aportes/retiros por clasificar y se marcan para revision. Los saldos iniciales diarios de caja no se vuelven a sumar como ingresos.

Devoluciones/cambios, ajustes/retiros de inventario, traslados y casos ambiguos requieren poliza manual segun documento y costo real. Se muestran en Revisiones. Vincular el ID de la poliza y una explicacion para dejar constancia de la revision. Cuando un documento ya contabilizado cambia, se avisa y se conserva la poliza original; hacer el ajuste correspondiente. No se modifica inventario ni el documento original desde Contabilidad.

## Libros y estados

- Diario: por fecha, poliza y lineas, con referencia/usuario y reversas.
- Mayor: seleccionar cuenta; saldo anterior, Debe/Haber y saldo acumulado del rango.
- Balanza: saldo inicial, movimientos y saldo final D-H por cuenta. Un saldo acreedor se representa negativo en estas columnas D-H.
- Balance general: activos, pasivos, capital y resultado acumulado aun no trasladado, a la fecha Hasta. La diferencia debe ser cero.
- Resultados: ingresos menos costos y gastos del rango Desde/Hasta. Los saldos anteriores no son ingreso del periodo.
- Consolidado: suma los asientos de las sucursales contabilizadas. Revisar apertura y fuentes de cada sucursal y registrar eliminaciones internas que correspondan.
- Excel: .xlsx real con columnas y alcance/periodo. PDF usa el motor existente de escritorio/telefonos. No se cambio la ruta de impresion movil.

Los estados son provisionales hasta completar apertura, sincronizacion, clasificaciones y revisiones. Solo reflejan asientos confirmados; no son una certificacion ni una declaracion SAT.

## Impuestos - pequeno contribuyente confirmado por el usuario

El calculo usa la cuenta 4101 Ventas del mes. La tarifa confirmada se aplica sobre la base contabilizada, sin descontar gastos y sin acreditar IVA de compras. Las cifras de un rango parcial muestran lo contabilizado hasta Hasta; para provisionar, seleccionar fin de mes o la fecha actual si es el mes en curso.

Contabilizar / ajustar provision genera solo la diferencia entre el impuesto calculado y el gasto de impuesto ya provisionado en ese mes. No duplica una provision al repetirla. La contrapartida es impuesto PC por pagar (2105).

Retenciones: registrar la constancia con poliza (1108), y aplicar contra impuesto por pagar con su asiento. El saldo de retenciones mostrado es movimiento D-H del mes; el saldo de impuesto por pagar incluye las aplicaciones/pagos contabilizados. No simula retenciones, no decide su procedencia ni genera pagos.

Esta implementacion usa el regimen PC confirmado. No aplica de forma silenciosa IVA general del 12%, no maneja automaticamente otros impuestos/regimenes ni envia FEL o declaraciones SAT.

Referencia SAT consultada: https://portal.sat.gob.gt/portal/descarga/1817/orientacion-legal-y-derechos-de-contribuyentes/11584/regimen-del-pequeno-contribuyente.pdf
La referencia explica 5% mensual sobre ingresos brutos y que la factura PC no genera credito fiscal. La configuracion y documentacion fiscal efectiva del negocio deben coincidir antes de usar las cifras para una declaracion.

## Conciliacion bancaria

1. Crear/identificar el banco en Gestion financiera; seleccionar el banco y el mes de Hasta.
2. Descargar plantilla. Importar CSV o XLSX en GTQ, hasta 1000 filas, por lotes ordenados de 20. Columnas: id, fecha, referencia, descripcion, salida, entrada. Fecha como texto AAAA-MM-DD. ID estable/unico del banco por transaccion; usar texto para numeros largos. No incluir saldo inicial como transaccion.
3. Guardar los saldos inicial/final del extracto. El control Inicial + entradas - salidas - final debe ser cero. Cero en diferencia ajustada no sustituye revisar los pendientes.
4. Seleccionar movimiento del extracto y su linea contable del mismo banco, mes, signo e importe exactos. Cada linea se cruza una vez. Se puede deshacer el cruce con auditoria.
5. Registrar con poliza las comisiones/intereses/otros movimientos bancarios faltantes en libros antes de cruzarlos. Los saldos de apertura no se cruzan como transacciones.

No se conecta a la banca ni ejecuta transferencias. Un archivo repetido con IDs ya importados se rechaza; un reintento de la misma solicitud confirmada devuelve el resultado sin repetir filas.

## Interrupciones y cierres

Durante la operacion aparece Procesando. Ante Tiempo agotado usar Consultar/reanudar la misma solicitud; conserva ID, datos y cola de importacion. No reenviar como solicitud nueva. La cola avanza solo tras confirmacion. Si falla sin cambios un lote de extracto, puede descartarse ese lote y los no enviados, corregir el archivo restante y cargarlo. Los lotes ya confirmados permanecen. Nunca se descarta una respuesta incierta.

El diario se confirma mediante plan persistente antes de escribir. Una interrupcion real bloquea nuevos registros contables hasta completar la misma solicitud; un conflicto con celdas modificadas requiere revision y no se sobrescribe. Los saldos/reportes de una sucursal con operacion pendiente se ocultan hasta confirmar.

Cerrar periodo solo admite meses anteriores al actual, sin fuentes/revisiones pendientes y con provision tributaria configurada/al dia. Impide nuevos asientos/reversas retroactivos de esa sucursal; no borra asientos ni realiza por si solo un cierre anual de resultados. Las correcciones posteriores van en un periodo abierto.

## Privacidad y pruebas

Code_Contabilidad_General_68.gs es privado. Solo copiar en Apps Script; no subir a GitHub/Cloudflare. Los cinco archivos Cloudflare/ son los publicos.

Pruebas locales: doble partida, FIFO/flete, cobros y anticipos, CXC/CXP, comisiones, impuestos y retenciones, reversas, diferencias de fuentes, libros y estados, consolidado, conciliacion, cierres, idempotencia, interrupciones/conflictos y comportamiento de interfaz con datos simulados. Incluye regresiones del sistema. No se realizaron operaciones reales ni despliegue en la cuenta del usuario. La interfaz se verifico con simulaciones de DOM; no se completo una prueba visual de navegador en este entorno.
