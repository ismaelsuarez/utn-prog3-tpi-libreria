# Spec Delta

## MODIFIED Requirements

### Requirement: Lectura que prioriza lo guardado con carga provisoria de ejemplos

`obtenerLibros`, `obtenerClientes` y `obtenerVentas` SHALL devolver lo guardado en `localStorage` cuando la clave existe y contiene un arreglo JSON válido; en caso contrario (clave ausente o contenido ilegible) SHALL devolver los datos iniciales de ejemplo —o la lista vacía, en el caso de ventas— sin modificar el almacenamiento: la lectura no siembra la clave. El almacén SHALL exponer una operación de inicialización, invocada al comienzo de cada script de página, que siembra únicamente las claves ausentes en el primer inicio: `libreria.libros` y `libreria.clientes` con sus datos iniciales de ejemplo y `libreria.ventas` con una lista vacía. «Primer inicio» equivale a la ausencia de la clave correspondiente; no existe una clave marcadora adicional. Las claves presentes se respetan: un arreglo JSON válido no se sobrescribe ni se duplica, y un contenido ilegible se conserva intacto. La inicialización SHALL ser idempotente: volver a ejecutarla no duplica datos. Un fallo al escribir la siembra no SHALL interrumpir la carga de la página: el almacén degrada a su reserva en memoria para esa sesión.

#### Scenario: Clave ausente

- **WHEN** se lee una clave que no existe todavía, sin haber ejecutado la inicialización
- **THEN** se devuelven los datos iniciales de ejemplo —o la lista vacía para ventas— y la clave no se escribe

#### Scenario: Contenido ilegible

- **WHEN** el contenido de la clave no es un arreglo JSON válido
- **THEN** se devuelven los datos iniciales de ejemplo y tanto la lectura como la inicialización conservan el contenido alterado sin sobrescribirlo; un alta posterior sí reemplaza la lista completa

#### Scenario: Contenido guardado

- **WHEN** ya se registraron libros, clientes o ventas en una sesión anterior
- **THEN** al abrir cualquier página se leen esos registros guardados, sin duplicar los ejemplos ni las ventas

#### Scenario: Primer inicio siembra las tres claves

- **WHEN** el almacenamiento no tiene ninguna de las tres claves y se ejecuta la inicialización
- **THEN** se escriben `libreria.libros` y `libreria.clientes` con sus datos iniciales de ejemplo y `libreria.ventas` con una lista vacía, y las lecturas devuelven esos datos

#### Scenario: Reapertura sin duplicados

- **WHEN** las tres claves existen con arreglos JSON válidos y se vuelve a ejecutar la inicialización
- **THEN** no se escribe ninguna clave y las lecturas devuelven lo guardado, sin agregar de nuevo los ejemplos ni duplicar ventas

#### Scenario: Clave parcial solo siembra la ausente

- **WHEN** existe únicamente una de las tres claves con contenido válido y se ejecuta la inicialización
- **THEN** solo se siembra la clave ausente y la clave existente conserva su contenido sin sobrescritura

#### Scenario: Fallo de escritura durante la siembra

- **WHEN** el navegador rechaza la escritura de una clave durante la inicialización
- **THEN** la página termina de cargar sin errores y el almacén responde en memoria para esa sesión, sin presentar la siembra como guardada duradero
