# Spec Delta

## ADDED Requirements

### Requirement: Listado generado desde los datos

El listado del Catálogo SHALL generarse con JavaScript a partir de los datos del Almacén, mostrando de cada libro su título como encabezado de la tarjeta y su ISBN, editorial, género, autores y precio, con la editorial, el género y los autores resueltos por su identificador. Los datos SHALL insertarse en el documento como texto.

#### Scenario: Al abrir la vista

- **WHEN** el operador abre el Catálogo
- **THEN** las tarjetas se generan desde los datos del Almacén, una por libro, con sus relaciones resueltas

#### Scenario: Datos con marcas de texto

- **WHEN** un título o nombre de los datos contiene caracteres propios de HTML (por ejemplo `<` o `&`)
- **THEN** se muestran como texto literal, sin interpretarse como marcado

#### Scenario: Cambio en los datos

- **WHEN** el conjunto de libros del Almacén cambia
- **THEN** el listado refleja el conjunto vigente al abrir la vista

### Requirement: Catálogo vacío

Cuando el Almacén no tiene libros, el Catálogo SHALL mostrar el mensaje de lista vacía en lugar del listado.

#### Scenario: Almacén sin libros

- **WHEN** el Almacén no contiene ningún libro
- **THEN** el listado no se muestra y aparece el mensaje de lista vacía

#### Scenario: Búsqueda sin resultados se distingue del vacío

- **WHEN** hay libros pero ninguno coincide con la búsqueda
- **THEN** se muestra el mensaje de búsqueda sin resultados, no el de lista vacía
