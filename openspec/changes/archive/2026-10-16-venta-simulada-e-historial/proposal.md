# Proposal

## Why

Ventas e Historial todavía muestran ejemplos fijos, aunque C-04 ya permite registrar libros y clientes. C-05 completa el ejercicio 5 (20 puntos): componer una venta, conservar sus importes históricos y consultarla después, sin depender del catálogo actual.

## What Changes

- Generar los selectores desde el almacén, incluyendo las altas de C-04; agregar, cambiar y quitar renglones antes de confirmar.
- Sumar cantidades cuando se agrega un libro repetido, sin crear otra fila; validar cliente y libros existentes y cantidades enteras positivas.
- Redondear el precio unitario al centavo antes de multiplicar, con mitades hacia arriba y sin modificar el catálogo. El precio 1500,125 se vende a 1500,13: dos unidades cuestan 3000,26. Usar el mismo unitario en pantalla, cálculos e instantánea.
- Confirmar solamente ventas válidas, copiar los datos del cliente y de los libros, asignar identificador y fecha ISO y persistir en `libreria.ventas`. Limpiar el formulario únicamente tras el guardado satisfactorio; conservarlo y mostrar error si falla.
- Consultar listado y detalle histórico en la misma página, sin edición ni eliminación; mostrar la fecha como `dd/mm/aaaa HH:mm` en la hora local del navegador.
- Sustituir las maquetas y cubrir cálculos, instantáneas, persistencia y los recorridos de Ventas/Historial con pruebas y comprobaciones de navegador.

## Capabilities

### New Capabilities

Ninguna: se amplían capacidades existentes.

### Modified Capabilities

- `ventas`: composición real, repetidos acumulados, cálculos monetarios, validación y confirmación con instantánea.
- `historial`: consulta de ventas persistidas, fecha local y detalle independiente del catálogo.
- `datos-locales`: lectura y alta de ventas con identificador, copias independientes y persistencia, conservando los contratos de libros y clientes.

## Impact

- Nuevos `js/logica/ventas.js`, `js/paginas/ventas.js`, `js/paginas/historial.js` y pruebas de lógica de ventas; extensión de `js/almacen.js` y sus pruebas.
- Actualización de `ventas.html` e `historial.html`, reutilizando plantillas, enganches y `js/interfaz.js`; ajustes de CSS solo si los controles reales los requieren. README con estado y resultados realmente observados de C-05.
- Sin dependencias ni cambios de firmas existentes. Scripts clásicos, lógica sin DOM, almacenamiento concentrado en el almacén y presentación segura mediante texto.
- Fuera de alcance: stock, cobros, edición/borrado de registros, cambios del alta de libros/clientes y consolidación global del almacenamiento (PA-04/PA-05). C-06 conserva la verificación general y la preparación de entrega.
- Trazabilidad: `CHANGES.md` C-05; US-011 a US-014; RN-VE-01 a RN-VE-16 y RN-HI-01 a RN-HI-04. Dependencia: C-04 archivado. La propuesta no ejecuta implementación ni pruebas funcionales.
