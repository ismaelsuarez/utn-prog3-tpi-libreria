# Spec Delta

## Purpose

Representa los datos de la librería (editoriales, géneros, autores, libros y clientes) como arreglos de objetos con identificadores estables y datos iniciales de ejemplo, y concentra su consulta en un único punto de lectura al que acceden todas las vistas.

## ADDED Requirements

### Requirement: Identificadores estables

Toda entidad del modelo (editorial, género, autor, libro y cliente) SHALL tener un identificador de texto único, de forma prefijo más contador (por ejemplo `edi-01`, `lib-03`), que NO cambie una vez asignado y NO dependa de servicios externos.

#### Scenario: Cada entidad tiene su identificador

- **WHEN** se inspecciona cualquier registro de los datos iniciales
- **THEN** posee un identificador de texto único que lo distingue dentro de su entidad

#### Scenario: El esquema no depende de servicios del navegador

- **WHEN** el proyecto se abre desde el sistema de archivos (`file://`)
- **THEN** los identificadores pueden generarse y leerse sin usar servicios de contexto seguro ni conexión

### Requirement: Datos iniciales de ejemplo

Los datos iniciales SHALL incluir al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios. Cada libro SHALL referenciar una editorial existente y al menos un autor existente; el género SHALL ser opcional y, cuando exista, referenciar un género existente.

#### Scenario: Mínimos exigidos

- **WHEN** se cuentan los registros de datos iniciales
- **THEN** hay al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes, todos ficticios

#### Scenario: Relaciones existentes

- **WHEN** se recorre cada libro de los datos iniciales
- **THEN** su editorial, su género (si lo tiene) y todos sus autores existen en los datos

#### Scenario: Casos exigidos por los casos manuales

- **WHEN** se revisa el conjunto inicial
- **THEN** incluye al menos un libro sin género, al menos un libro con más de un autor y libros con precios 1500 y 2000

### Requirement: Lectura centralizada en el Almacén

Las vistas SHALL obtener los datos mediante un único componente de almacén que expone operaciones de lectura de libros, clientes, ventas, editoriales, géneros y autores. Ningún script de página SHALL leer los arreglos de datos directamente.

#### Scenario: El Catálogo lee a través del almacén

- **WHEN** la vista Catálogo necesita el listado de libros
- **THEN** lo obtiene mediante el almacén, sin acceder a los datos iniciales en forma directa

#### Scenario: La interfaz de lectura es estable

- **WHEN** se consulta al almacén por libros, clientes, ventas, editoriales, géneros o autores
- **THEN** cada operación devuelve el conjunto correspondiente listo para usar, con la misma forma de datos en todas las páginas

### Requirement: Normalización compartida

El proyecto SHALL proveer reglas compartidas de normalización: el texto de búsqueda se recorta y se compara sin distinguir mayúsculas de minúsculas, el ISBN se compara sin espacios ni guiones, y el email se recorta y se pasa a minúsculas.

#### Scenario: Texto de búsqueda normalizado

- **WHEN** se normaliza un texto con espacios en los extremos y mezcla de mayúsculas
- **THEN** se obtiene el texto sin esos espacios y en minúsculas

#### Scenario: ISBN normalizado

- **WHEN** se normaliza un ISBN con espacios y guiones
- **THEN** se obtiene el mismo ISBN sin espacios ni guiones

#### Scenario: Email normalizado

- **WHEN** se normaliza un email con espacios exteriores y mayúsculas
- **THEN** se obtiene el email sin esos espacios y en minúsculas
