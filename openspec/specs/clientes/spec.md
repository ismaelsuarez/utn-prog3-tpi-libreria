# clientes Specification

## Purpose

Permite al operador registrar clientes de la librería y consultar el listado de los clientes registrados.

## Requirements

### Requirement: Formulario de alta de cliente
La vista Clientes SHALL presentar un formulario de alta con los campos nombre completo y email, sin un campo de apellido separado, y un botón para registrar el cliente.

#### Scenario: Campos del formulario
- **WHEN** el operador abre la vista Clientes
- **THEN** ve un formulario con los campos nombre completo y email, y un botón para registrar el cliente

#### Scenario: Nombre en un solo campo
- **WHEN** el operador busca dónde escribir el apellido
- **THEN** encuentra un único campo para el nombre completo

### Requirement: Listado de clientes registrados
La vista Clientes SHALL mostrar los clientes registrados en una tabla con las columnas nombre completo y email.

#### Scenario: Columnas del listado
- **WHEN** el operador mira el listado de clientes
- **THEN** la tabla tiene las columnas nombre completo y email
