# Spec Delta

## Purpose

Permite al operador consultar las ventas confirmadas y revisar el detalle de cada una.

## ADDED Requirements

### Requirement: Listado de ventas
La vista Historial SHALL mostrar las ventas en una tabla con las columnas identificador, fecha, cliente y total.

#### Scenario: Columnas del listado
- **WHEN** el operador abre la vista Historial
- **THEN** la tabla de ventas tiene las columnas identificador, fecha, cliente y total

#### Scenario: Total con dos decimales
- **WHEN** el operador mira el total de una venta
- **THEN** el importe se presenta con dos decimales

### Requirement: Acceso al detalle de una venta
Cada venta del listado SHALL ofrecer un control para consultar su detalle, y el detalle SHALL mostrarse en la misma página.

#### Scenario: Control de acceso al detalle
- **WHEN** el operador mira una venta del listado
- **THEN** encuentra un botón para ver su detalle, identificado con esa venta

#### Scenario: Detalle en la misma página
- **WHEN** se muestra el detalle de una venta
- **THEN** aparece en la vista Historial, sin abrir otra página

### Requirement: Contenido del detalle de una venta
El detalle SHALL identificar la venta consultada y SHALL mostrar sus renglones en una tabla con las columnas libro, cantidad, precio unitario y subtotal, junto con el total.

#### Scenario: Renglones del detalle
- **WHEN** el operador mira el detalle de una venta
- **THEN** ve a qué venta corresponde, una tabla con libro, cantidad, precio unitario y subtotal de cada renglón, y el total

### Requirement: Ventas no modificables
La vista Historial no SHALL ofrecer controles para editar ni para eliminar ventas.

#### Scenario: Ausencia de controles de edición
- **WHEN** el operador revisa el listado y el detalle de una venta
- **THEN** no encuentra ningún control para editarla ni para eliminarla
