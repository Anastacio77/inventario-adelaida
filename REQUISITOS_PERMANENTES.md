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
