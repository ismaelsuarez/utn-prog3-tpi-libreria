# estructura-y-navegacion Specification

## Purpose

Define la página de entrada, las cinco vistas de la librería y la navegación entre ellas, de modo que cualquier operación sea alcanzable desde cualquier página abriendo el proyecto directamente en el navegador.

## Requirements

### Requirement: Página de entrada
El proyecto SHALL tener `index.html` como página de entrada, y esa página SHALL mostrar la vista Catálogo.

#### Scenario: Apertura del proyecto
- **WHEN** el operador abre `index.html` en el navegador
- **THEN** se muestra la vista Catálogo con el título de la librería

### Requirement: Apertura sin servidor
Todas las páginas SHALL funcionar abiertas directamente desde el sistema de archivos, sin servidor, sin npm y sin conexión a Internet, y no SHALL cargar ningún recurso externo al proyecto.

#### Scenario: Apertura desde el sistema de archivos
- **WHEN** el operador abre cualquiera de las páginas con doble clic desde la carpeta del proyecto
- **THEN** la página se muestra completa y la consola del navegador no registra errores

#### Scenario: Sin recursos externos
- **WHEN** se revisan los recursos que solicita cualquier página
- **THEN** todos pertenecen a la carpeta del proyecto y ninguno proviene de otra dirección

### Requirement: Cinco vistas
El proyecto SHALL ofrecer cinco vistas, cada una en su propia página: Catálogo, Libros, Clientes, Ventas e Historial.

#### Scenario: Existencia de las vistas
- **WHEN** el operador recorre la navegación
- **THEN** puede llegar a las vistas Catálogo, Libros, Clientes, Ventas e Historial

### Requirement: Navegación entre vistas
Cada página SHALL incluir una navegación con enlaces a las cinco vistas, en el mismo orden en todas las páginas, y SHALL indicar cuál es la vista actual de un modo que no dependa solo del color.

#### Scenario: Navegación desde cualquier página
- **WHEN** el operador está en cualquier vista y elige el enlace de otra
- **THEN** se abre la página de la vista elegida

#### Scenario: Indicación de la vista actual
- **WHEN** el operador está en la vista Ventas
- **THEN** el enlace Ventas de la navegación está marcado como la página actual y los demás no

### Requirement: Regiones semánticas
Cada página SHALL estructurarse con encabezado, navegación, contenido principal y pie mediante etiquetas semánticas, y SHALL tener un único título principal que nombre la vista.

#### Scenario: Estructura de una página
- **WHEN** se inspecciona cualquier página
- **THEN** contiene un encabezado, una navegación, un contenido principal y un pie, cada uno con su etiqueta semántica, y exactamente un título principal

#### Scenario: Título del documento
- **WHEN** el operador tiene varias vistas abiertas en pestañas
- **THEN** el título de cada pestaña nombra la vista y la librería

### Requirement: Identificación de maquetas
Todo control cuya operación todavía no esté implementada SHALL identificarse visiblemente con texto como maqueta, y el README SHALL indicar qué pantallas son maquetas y qué interacciones ya funcionan.

#### Scenario: Control aún no funcional
- **WHEN** el operador ve un formulario o un botón cuya operación no está implementada
- **THEN** un texto visible junto a ese control indica que es una maqueta

#### Scenario: Estado declarado en el README
- **WHEN** el docente lee el README durante la Etapa 1
- **THEN** encuentra la lista de pantallas que son maquetas y la lista de interacciones que ya funcionan
