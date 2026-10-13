# ventas Specification

## Purpose

Permite al operador componer una venta simulada eligiendo un cliente y los libros con sus cantidades, y ver su importe antes de confirmarla.

## Requirements

### Requirement: Selección de cliente
La vista Ventas SHALL presentar una lista desplegable para elegir el cliente de la venta.

#### Scenario: Lista de clientes
- **WHEN** el operador abre la vista Ventas
- **THEN** ve una lista desplegable con su etiqueta para elegir el cliente

### Requirement: Composición de renglones
La vista Ventas SHALL presentar una lista desplegable de libros, un campo de cantidad y un botón para agregar el renglón a la venta.

#### Scenario: Controles para agregar un renglón
- **WHEN** el operador quiere agregar un libro a la venta
- **THEN** dispone de una lista de libros, un campo de cantidad y un botón para agregar el renglón

### Requirement: Tabla de renglones
La vista Ventas SHALL mostrar los renglones de la venta en una tabla con las columnas libro, cantidad, precio unitario y subtotal, y cada renglón SHALL ofrecer un control para cambiar su cantidad y otro para quitarlo.

#### Scenario: Columnas de los renglones
- **WHEN** el operador mira los renglones de la venta
- **THEN** la tabla tiene las columnas libro, cantidad, precio unitario y subtotal

#### Scenario: Controles de un renglón
- **WHEN** el operador mira un renglón de la venta
- **THEN** encuentra un control para cambiar su cantidad y un botón para quitarlo, identificados con el libro al que corresponden

#### Scenario: Importes con dos decimales
- **WHEN** el operador mira el precio unitario y el subtotal de un renglón
- **THEN** ambos importes se presentan con dos decimales

### Requirement: Resumen de la venta
La vista Ventas SHALL mostrar un resumen con el total de la venta, presentado con dos decimales, y un botón para confirmarla.

#### Scenario: Total y confirmación
- **WHEN** el operador mira el resumen de la venta
- **THEN** ve el total con dos decimales y un botón para confirmar la venta
