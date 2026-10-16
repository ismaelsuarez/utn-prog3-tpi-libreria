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

### Requirement: Validación del alta de cliente

El sistema SHALL rechazar el registro de un cliente cuando el nombre completo esté vacío, el email esté vacío, el email no tenga un formato válido (estructura de texto, arroba y dominio con punto, verificada después de recortarlo y pasarlo a minúsculas) o ya exista otro cliente con el mismo email (comparado sin espacios exteriores y sin distinguir mayúsculas de minúsculas).

#### Scenario: Nombre completo vacío

- **WHEN** el operador envía el formulario con el nombre completo vacío o solo con espacios
- **THEN** el sistema rechaza el registro y señala el nombre

#### Scenario: Email vacío

- **WHEN** el operador envía el formulario con el email vacío
- **THEN** el sistema rechaza el registro y señala el email

#### Scenario: Email con formato inválido

- **WHEN** el operador envía un email sin arroba, sin punto en el dominio o con espacios intermedios
- **THEN** el sistema rechaza el registro y señala el email

#### Scenario: Email ya registrado con mayúsculas o espacios exteriores

- **WHEN** el operador registra un cliente con un email que coincide con el de otro cliente solo en mayúsculas o en espacios de los extremos (por ejemplo ` Laura.Mendoza@Correo.Test ` frente a `laura.mendoza@correo.test`)
- **THEN** el sistema rechaza el registro como email repetido

### Requirement: Errores por campo sin registrar el cliente

El formulario de cliente SHALL mostrar un mensaje de error junto a cada campo rechazado, pudiendo acumular varios mensajes a la vez, y SHALL registrar el cliente solo cuando todas las comprobaciones pasan. Mientras haya errores no se escribe nada en el almacén.

#### Scenario: Varios errores a la vez

- **WHEN** el operador envía un formulario con nombre vacío y email sin arroba
- **THEN** se muestran los dos mensajes, cada uno junto a su campo, y no se registra ningún cliente

#### Scenario: Sin errores

- **WHEN** el operador envía un formulario que pasa todas las comprobaciones
- **THEN** no se muestra ningún mensaje de error y el cliente se registra

### Requirement: Listado de clientes generado desde el Almacén

El listado de clientes SHALL generarse con JavaScript a partir de los datos del Almacén, mostrando nombre completo y email. Si no hay clientes registrados se muestra un mensaje de lista vacía.

#### Scenario: Listado con los clientes vigentes

- **WHEN** el operador abre la vista Clientes
- **THEN** las filas de la tabla se generan desde el Almacén con el nombre y el email de cada cliente

#### Scenario: Sin clientes registrados

- **WHEN** no hay clientes en el Almacén
- **THEN** la tabla se oculta o queda vacía y se muestra el mensaje de lista vacía

### Requirement: Efecto del alta de cliente

Al registrar un cliente válido, el sistema SHALL persistirlo en el Almacén, actualizar el listado sin recargar la página, limpiar el formulario para un nuevo registro y mostrar un mensaje de operación correcta. El cliente quedará visible en las demás páginas (por ejemplo la de Ventas) cuando éstas se abran.

#### Scenario: Alta correcta en la página

- **WHEN** el operador envía un cliente válido
- **THEN** el cliente aparece en el listado de la misma página, el formulario queda limpio y se muestra el mensaje de éxito sin recargar

#### Scenario: Cliente nuevo en otra vista

- **WHEN** el operador registra un cliente y después abre otra vista que lista clientes
- **THEN** esa vista incluye al cliente recién registrado

#### Scenario: Duplicado dentro de la misma sesión

- **WHEN** el operador registra dos veces el mismo email sin recargar la página
- **THEN** el segundo envío se rechaza como email repetido
