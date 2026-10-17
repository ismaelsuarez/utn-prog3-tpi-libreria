# Spec Delta

## ADDED Requirements

### Requirement: Selección desde los registros vigentes
La vista Ventas SHALL obtener clientes y libros del almacén al abrirse, incluyendo las altas anteriores, sin conservar opciones ni renglones ficticios de la maqueta.

#### Scenario: Altas disponibles para vender
- **WHEN** se registra un libro o cliente y después se abre Ventas
- **THEN** el registro nuevo aparece en el selector correspondiente (CM-2 y CM-3)

#### Scenario: Borrador inicial vacío
- **WHEN** se abre Ventas
- **THEN** no hay cliente seleccionado ni renglones, se informa el estado vacío y el total es $ 0,00

### Requirement: Renglones válidos y repetidos acumulados
La venta SHALL admitir únicamente libros existentes y cantidades enteras positivas. Agregar un libro repetido SHALL sumar la cantidad al renglón existente, sin crear otra fila ni modificar otros renglones. Una entrada rechazada SHALL conservar el borrador anterior y mostrar un error.

#### Scenario: Primer renglón válido
- **WHEN** se agrega un libro existente con cantidad 2
- **THEN** aparece un renglón de ese libro con cantidad 2 y sus importes

#### Scenario: Repetido acumulado
- **WHEN** un libro tiene cantidad 2 y se agrega nuevamente con cantidad 1
- **THEN** queda una sola fila de ese libro con cantidad 3 y se recalculan subtotal y total

#### Scenario: Cantidades rechazadas
- **WHEN** se intenta agregar una cantidad vacía, cero, negativa o decimal
- **THEN** se muestra un error y no cambia la venta (CM-4)

#### Scenario: Libro inexistente
- **WHEN** se intenta agregar un identificador de libro ausente del catálogo
- **THEN** se informa el error sin agregar ni modificar renglones

### Requirement: Cambios del borrador antes de confirmar
El operador SHALL poder cambiar cantidades y quitar renglones antes de confirmar. Cada cambio válido SHALL actualizar los importes; una cantidad inválida SHALL impedir confirmar mientras el control siga inválido, sin guardar una venta distinta de la mostrada.

#### Scenario: Cantidad modificada
- **WHEN** un renglón de precio unitario 1500 cambia de cantidad 2 a 3
- **THEN** muestra subtotal 4500 y el total refleja el cambio

#### Scenario: Cambio inválido
- **WHEN** se escribe cero, un negativo, un decimal o vacío en la cantidad de una fila
- **THEN** se marca el error y no se confirma hasta corregirlo o quitar esa fila

#### Scenario: Quitar el último renglón
- **WHEN** se quita el único renglón del borrador
- **THEN** aparece el estado vacío, el total es $ 0,00 y no se puede confirmar

### Requirement: Precio unitario redondeado antes del cálculo
La venta SHALL redondear el precio del catálogo al centavo antes de multiplicar, con mitades hacia arriba para precios positivos. Ese mismo unitario SHALL usarse para mostrar, calcular y guardar la venta, sin modificar el precio original del catálogo.

#### Scenario: Mitad de centavo confirmada
- **WHEN** se venden 2 unidades de un libro cuyo precio de catálogo es 1500,125
- **THEN** el precio unitario de venta es 1500,13 y el subtotal es 3000,26; el catálogo conserva 1500,125

#### Scenario: Mitad no representable exactamente en binario
- **WHEN** se vende una unidad de un libro de precio 1,005
- **THEN** el unitario y subtotal de venta son 1,01

#### Scenario: Redondeo hacia abajo
- **WHEN** se venden 2 unidades a precio de catálogo 10,124
- **THEN** el unitario es 10,12 y el subtotal es 20,24

### Requirement: Subtotales y total monetarios coherentes
La venta SHALL calcular cada subtotal como cantidad por unitario redondeado y el total como suma de subtotales, sin residuos visibles de punto flotante. Todos los importes SHALL mostrarse con dos decimales. Entradas no finitas o cálculos fuera del rango entero seguro de centavos SHALL rechazarse, sin confirmar importes corruptos.

#### Scenario: Venta de referencia
- **WHEN** se componen 2 unidades a 1500 y 1 unidad a 2000
- **THEN** los subtotales son 3000 y 2000 y el total es 5000, mostrados con dos decimales (CM-5)

#### Scenario: Suma decimal exacta al centavo
- **WHEN** se componen 3 unidades a 0,10 y 1 unidad a 0,20
- **THEN** los subtotales son 0,30 y 0,20 y el total visible y guardado es 0,50

#### Scenario: Precio no utilizable
- **WHEN** un libro tiene un precio no numérico, no finito o menor o igual que cero
- **THEN** se rechaza su incorporación y no se confirma una venta que lo incluya

#### Scenario: Rango inseguro
- **WHEN** una cantidad, una acumulación de cantidades, un subtotal o un total no puede representarse con enteros seguros en su unidad de cálculo
- **THEN** se informa el error sin persistir ni sustituir los últimos valores válidos

### Requirement: Confirmación validada con instantánea
La confirmación SHALL requerir cliente existente, al menos un renglón, libros existentes y cantidades e importes válidos. La venta SHALL conservar fecha ISO del momento de confirmación, copia de id, nombre y email del cliente, copia de identificador, título, ISBN, cantidad, unitario y subtotal por libro, y total. Ninguna copia SHALL compartir referencias mutables con sus entradas.

#### Scenario: Sin cliente o sin renglones
- **WHEN** se confirma sin cliente, con cliente inexistente o sin renglones
- **THEN** se informa el error y no se registra ninguna venta (CM-4)

#### Scenario: Venta confirmada completa
- **WHEN** se confirma una venta válida
- **THEN** queda guardada con identificador único, fecha ISO, datos del cliente, renglones e importes confirmados

#### Scenario: Independencia de las entradas
- **WHEN** después de construir la venta cambian el nombre del cliente, el título, ISBN o precio del libro, o el borrador original
- **THEN** la venta conserva los datos e importes que copió

### Requirement: Resultado accesible y conservación ante fallo
La interfaz SHALL limpiar cliente y renglones y anunciar éxito solo después de guardar la venta. Ante error de lectura o escritura SHALL informar el fallo y conservar el borrador, sin anunciar persistencia exitosa. Los errores de entrada SHALL identificar el control y permitir su corrección por teclado; los datos de usuario SHALL mostrarse como texto.

#### Scenario: Nueva venta tras el éxito
- **WHEN** el guardado termina correctamente
- **THEN** se anuncia el resultado, queda un borrador vacío con total $ 0,00 y el mismo envío no vuelve a registrar sus renglones

#### Scenario: Fallo de almacenamiento
- **WHEN** falla el acceso o la escritura del almacenamiento al confirmar
- **THEN** no se anuncia éxito, el cliente y los renglones permanecen y puede reintentarse el guardado

#### Scenario: Corrección accesible
- **WHEN** un envío contiene un campo inválido
- **THEN** se muestra texto de error asociado, se identifica el control inválido y se enfoca el primer error corregible sin recargar la página
