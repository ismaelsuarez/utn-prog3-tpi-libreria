# Spec Delta

## ADDED Requirements

### Requirement: Persistencia de libros y clientes en el navegador

El Almacén SHALL leer y escribir los libros y los clientes en `localStorage` del navegador, bajo las claves `libreria.libros` y `libreria.clientes`. El acceso a `localStorage` SHALL concentrarse en el componente de almacén: ningún script de página ni función de lógica accede directamente. Cuando el entorno no ofrece `localStorage` (por ejemplo Node en las pruebas), el Almacén SHALL operar en memoria con los datos iniciales.

#### Scenario: Escritura bajo la clave correspondiente

- **WHEN** se registra un libro o un cliente por primera vez
- **THEN** la lista completa queda guardada en `localStorage` bajo `libreria.libros` o `libreria.clientes`, según la entidad

#### Scenario: Acceso concentrado

- **WHEN** se revisa el código del proyecto
- **THEN** `localStorage` solo aparece en el componente de almacén, no en la lógica ni en los scripts de página

#### Scenario: Entorno sin `localStorage`

- **WHEN** el almacén se usa en un entorno sin `localStorage` (las pruebas de Node)
- **THEN** las lecturas y altas funcionan en memoria sobre los datos iniciales, sin errores

### Requirement: Lectura que prioriza lo guardado con carga provisoria de ejemplos

`obtenerLibros` y `obtenerClientes` SHALL devolver lo guardado en `localStorage` cuando la clave existe y contiene un arreglo JSON válido; en caso contrario (clave ausente o contenido ilegible) SHALL devolver los datos iniciales de ejemplo sin modificar el almacenamiento: la lectura no siembra la clave. La consolidación de esta carga provisoria queda para el change de verificación y documentación.

#### Scenario: Clave ausente

- **WHEN** se lee una clave que no existe todavía
- **THEN** se devuelven los datos iniciales de ejemplo y la clave no se escribe

#### Scenario: Contenido ilegible

- **WHEN** el contenido de la clave no es un arreglo JSON válido
- **THEN** se devuelven los datos iniciales de ejemplo y el contenido alterado no se sobrescribe por la lectura

#### Scenario: Contenido guardado

- **WHEN** ya se registraron libros o clientes en una sesión anterior
- **THEN** al abrir cualquier página se leen esos registros guardados, sin duplicar los ejemplos

### Requirement: Registro con identificador nuevo en el Almacén

Al registrar un libro o un cliente, el Almacén SHALL asignar un identificador nuevo con el esquema de prefijo más contador de al menos dos dígitos (`lib-07`, `cli-04`, …), copiar los datos recibidos (incluida una copia de la lista de autores en el libro), agregar el registro a la lista completa y persistirla, y devolver el registro almacenado. El Almacén no valida ni normaliza: la validación es responsabilidad del formulario. No se ofrecen operaciones de edición ni borrado.

#### Scenario: Identificador siguiente

- **WHEN** se registra un libro con los seis ejemplos existentes, o un cliente con los tres ejemplos existentes
- **THEN** el registro nuevo recibe `lib-07` o `cli-04` respectivamente

#### Scenario: Alta sobre una clave ausente

- **WHEN** se registra un libro o cliente cuando la clave de `localStorage` todavía no existe
- **THEN** se persisten los ejemplos más el registro nuevo, sin perder datos

#### Scenario: Devolución del registro almacenado

- **WHEN** la operación de registro termina correctamente
- **THEN** devuelve el libro o cliente ya almacenado, con su identificador asignado y su lista de autores copiada
