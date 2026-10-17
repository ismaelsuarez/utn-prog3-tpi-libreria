# Spec Delta

## ADDED Requirements

### Requirement: Lectura y persistencia de ventas
El almacén SHALL recuperar y agregar ventas mediante su interfaz existente, usando exclusivamente la clave `libreria.ventas`. Una clave ausente SHALL representar una lista vacía; leerla no SHALL escribir datos. Registrar una venta válida SHALL conservar las anteriores y persistir la lista completa sin tocar libros ni clientes.

#### Scenario: Primera venta
- **WHEN** se registra la primera venta y no existe `libreria.ventas`
- **THEN** se guarda una lista con esa venta bajo dicha clave, sin sembrar ni modificar otras claves

#### Scenario: Ventas anteriores conservadas
- **WHEN** se registra una segunda venta
- **THEN** quedan ambas ventas en orden de registro y las lecturas posteriores no duplican ninguna

#### Scenario: Lectura sin siembra
- **WHEN** se consulta la lista sin clave de ventas
- **THEN** se obtiene una lista vacía y no se produce ninguna escritura

### Requirement: Identificador asignado al registrar la venta
El almacén SHALL ser la única autoridad que asigna el identificador persistido de cada venta, con prefijo `ven-` y contador de al menos dos dígitos superior al máximo existente. El alta SHALL devolver el registro guardado con ese identificador y no SHALL ofrecer edición ni eliminación.

#### Scenario: Identificadores sucesivos
- **WHEN** se registran dos ventas desde una lista vacía
- **THEN** reciben `ven-01` y `ven-02`, respectivamente

#### Scenario: Contador basado en el máximo
- **WHEN** las ventas existentes incluyen `ven-02` y `ven-07` y se registra otra
- **THEN** la nueva venta recibe `ven-08`, sin reutilizar identificadores

### Requirement: Copias independientes de ventas
El almacén SHALL copiar los datos de la venta, incluyendo el objeto cliente, el arreglo de renglones y cada renglón, tanto al registrar como al devolver registros. Modificar una entrada o una respuesta no SHALL alterar otras lecturas ni los datos guardados.

#### Scenario: Mutación de entrada o respuesta del alta
- **WHEN** después de registrar se modifican el cliente o los renglones de la entrada o del registro devuelto
- **THEN** una lectura nueva conserva los datos originalmente guardados

#### Scenario: Mutación de una lectura
- **WHEN** se cambia el precio de un renglón o se elimina una fila de una lista de ventas leída
- **THEN** otra lectura devuelve la venta íntegra con sus importes originales

### Requirement: Compatibilidad y errores del almacenamiento de ventas
Las operaciones de ventas SHALL conservar el modo en memoria cuando Node no ofrece almacenamiento y no SHALL alterar los contratos de libros y clientes. En el navegador, la imposibilidad de persistir SHALL informarse al llamador como fallo, sin sustituirla por un éxito en memoria. Los errores de lectura o escritura SHALL permitir a la interfaz conservar el borrador.

#### Scenario: Pruebas sin almacenamiento
- **WHEN** se usa el almacén en Node sin `localStorage`
- **THEN** se pueden agregar y consultar ventas en memoria con identificadores y copias independientes

#### Scenario: Escritura rechazada
- **WHEN** el navegador rechaza la escritura de la lista de ventas
- **THEN** el alta comunica el error y no devuelve una venta como si hubiera sido guardada

#### Scenario: Acceso bloqueado en navegador
- **WHEN** el navegador no permite acceder al almacenamiento necesario para confirmar
- **THEN** el alta comunica que no pudo persistir y no presenta la reserva en memoria como guardado duradero

#### Scenario: Contratos existentes conservados
- **WHEN** se registran o consultan libros y clientes después de incorporar ventas
- **THEN** se conservan sus firmas, claves, normalización, datos, identificadores y comportamiento previo
