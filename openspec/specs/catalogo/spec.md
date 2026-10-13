# catalogo Specification

## Purpose

Presenta al operador los libros de la librería con sus datos y le permite encontrarlos escribiendo parte del título.

## Requirements

### Requirement: Contenido de la vista Catálogo
La vista Catálogo SHALL mostrar el título de la librería, un buscador por título y el listado de libros.

#### Scenario: Elementos de la vista
- **WHEN** el operador abre la vista Catálogo
- **THEN** ve el título de la librería, un campo de búsqueda por título con su etiqueta y el listado de libros

### Requirement: Datos de cada libro
Cada libro del listado SHALL mostrarse como una tarjeta con título, ISBN, editorial, género, autores y precio. El título SHALL ser el encabezado de la tarjeta y los demás datos SHALL estar identificados con su nombre.

#### Scenario: Libro completo
- **WHEN** el operador mira la tarjeta de un libro
- **THEN** ve su título como encabezado de la tarjeta y su ISBN, editorial, género, autores y precio, cada uno con su nombre

#### Scenario: Libro con varios autores
- **WHEN** un libro tiene más de un autor
- **THEN** la tarjeta muestra todos sus autores

#### Scenario: Precio con dos decimales
- **WHEN** el operador mira el precio de un libro
- **THEN** el importe se presenta con dos decimales

### Requirement: Libro sin género
Cuando un libro no tiene género asignado, su tarjeta SHALL mostrar el texto «Sin clasificar» en el lugar del género.

#### Scenario: Libro sin género asignado
- **WHEN** el listado incluye un libro sin género
- **THEN** su tarjeta muestra «Sin clasificar» como género

### Requirement: Filtro por título
El buscador SHALL mostrar solo los libros cuyo título contiene el texto buscado, sin distinguir mayúsculas de minúsculas, con coincidencias parciales y sin considerar los espacios de los extremos del texto buscado.

#### Scenario: Coincidencia parcial sin distinguir mayúsculas
- **WHEN** el operador escribe en mayúsculas una parte del título de un libro
- **THEN** el listado muestra ese libro y oculta los que no contienen ese texto en el título

#### Scenario: Espacios en los extremos
- **WHEN** el operador escribe una parte de un título con espacios antes y después
- **THEN** el resultado es el mismo que sin esos espacios

### Requirement: Búsqueda vacía
Cuando el texto buscado está vacío o contiene solo espacios, el Catálogo SHALL mostrar todos los libros.

#### Scenario: Borrado de la búsqueda
- **WHEN** el operador borra el texto del buscador después de haber filtrado
- **THEN** el listado vuelve a mostrar todos los libros

### Requirement: Búsqueda sin resultados
Cuando ningún título contiene el texto buscado, el Catálogo SHALL mostrar un mensaje de texto que lo indique en lugar del listado.

#### Scenario: Texto inexistente
- **WHEN** el operador escribe un texto que no aparece en ningún título
- **THEN** no se muestra ningún libro y aparece un mensaje que indica que no hay resultados para esa búsqueda

#### Scenario: Vuelta a tener resultados
- **WHEN** el operador corrige la búsqueda y vuelve a haber coincidencias
- **THEN** el mensaje de búsqueda sin resultados deja de mostrarse
