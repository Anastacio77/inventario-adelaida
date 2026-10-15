# Recuperacion de catalogo 22

Version coordinada: 2026.10.14-CATALOGO-22. Instalar el Apps Script privado y los tres archivos Cloudflare del paquete antes de recuperar una carga.

En +Producto, Bodega Principal, con el mismo usuario: Recuperar carga pendiente y Reanudar / consultar la misma carga. Conserva ID y filas. No reimportar ni limpiar.

Catalogo guarda bloques de 25 referencias y reconcilia cada escritura por codigo. Repara QR y filas de existencia ausentes con cero; conserva stocks y niveles de precios ya guardados. En recuperaciones antiguas completa niveles ausentes usando las opciones del borrador. Rechaza referencias incompatibles, propietarios distintos o cantidades positivas. Compras e inventario inicial mantienen sus controles anteriores. Modelos convertidos previamente en fechas requieren revision.

Pruebas: node tests/recuperacion-catalogo.cjs /ruta/Code_Recuperacion_Catalogo_22.gs; ejecutar tambien prioridad-proveedor y traslados-multiples. Servicios de Sheets simulados; pendiente verificar la carga real despues de instalar. El GS se distribuye en privado.
