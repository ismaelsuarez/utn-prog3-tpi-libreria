# libros Specification

## Purpose

Permite al operador registrar libros de la librería y consultar el listado de los libros registrados.

## Requirements

### Requirement: Formulario de alta de libro
La vista Libros SHALL presentar un formulario de alta con los campos título, ISBN, precio, editorial, género y autores, y un botón para registrar el libro.

#### Scenario: Campos del formulario
- **WHEN** el operador abre la vista Libros
- **THEN** ve un formulario con los campos título, ISBN, precio, editorial, género y autores, y un botón para registrar el libro

### Requirement: Selección de editorial y de género
El formulario SHALL ofrecer la editorial y el género mediante listas desplegables, y la lista de género SHALL incluir la opción «Sin clasificar», que representa la ausencia de género.

#### Scenario: Opción sin género
- **WHEN** el operador despliega la lista de género
- **THEN** encuentra la opción «Sin clasificar» junto a los géneros disponibles

#### Scenario: Lista de editoriales
- **WHEN** el operador despliega la lista de editorial
- **THEN** ve las editoriales disponibles

### Requirement: Selección de autores
El formulario SHALL permitir seleccionar uno o más autores mediante una casilla por cada autor disponible.

#### Scenario: Varios autores
- **WHEN** el operador marca las casillas de dos autores
- **THEN** ambos quedan seleccionados al mismo tiempo

#### Scenario: Selección con teclado
- **WHEN** el operador recorre el grupo de autores con el teclado
- **THEN** puede marcar y desmarcar cada casilla sin usar el ratón

### Requirement: Listado de libros registrados
La vista Libros SHALL mostrar los libros registrados en una tabla con las columnas título, ISBN, editorial, género, autores y precio.

#### Scenario: Columnas del listado
- **WHEN** el operador mira el listado de libros
- **THEN** la tabla tiene las columnas título, ISBN, editorial, género, autores y precio

#### Scenario: Libro sin género en el listado
- **WHEN** el listado incluye un libro sin género asignado
- **THEN** la columna género de ese libro muestra «Sin clasificar»
