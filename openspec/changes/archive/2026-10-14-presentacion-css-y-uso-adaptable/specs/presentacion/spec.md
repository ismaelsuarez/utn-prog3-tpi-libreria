# Spec Delta

## Purpose

Capacidad transversal de presentación de las cinco vistas: identidad visual coherente con CSS propio y local, disposición adaptable con Flexbox o Grid entre 320 px y 1280 px, y señales de accesibilidad visible (foco, mensajes con texto, objetivos táctiles), sin librerías ni recursos externos.

## ADDED Requirements

### Requirement: Identidad visual coherente
El sistema SHALL definir la identidad visual (color, tipografía y espaciado) una sola vez en hojas de estilo externas propias y la SHALL aplicar a las cinco vistas reutilizando clases para los elementos equivalentes.

#### Scenario: Definición única del sistema visual
- **WHEN** se revisan las hojas de estilo del proyecto
- **THEN** los colores, la tipografía y los espaciados se declaran como variables reutilizables en la hoja base, y los componentes las consumen sin repetir valores sueltos

#### Scenario: Elementos equivalentes entre vistas
- **WHEN** se comparan elementos equivalentes, por ejemplo el botón de envío del formulario de Libros con el del formulario de Clientes
- **THEN** comparten apariencia, y los distintos tipos de componente (tarjeta, formulario, tabla, mensaje) se distinguen entre sí de forma consistente en todas las vistas

#### Scenario: Recursos propios
- **WHEN** se inspeccionan las páginas y las hojas de estilo
- **THEN** no hay librerías, frameworks ni CDNs de CSS, y la tipografía proviene del sistema o de archivos locales del proyecto

### Requirement: Organización del CSS en tres hojas
El CSS SHALL vivir en tres hojas externas enlazadas en las cinco páginas, con responsabilidades fijas: base (variables, reinicio mínimo y foco), disposición (encabezado, navegación, grillas y cortes) y componentes (tarjetas, formularios, botones, tablas y mensajes).

#### Scenario: Enlace en todas las páginas
- **WHEN** se abre cualquiera de las cinco páginas
- **THEN** las tres hojas están enlazadas y se cargan en orden: base, disposición y componentes

#### Scenario: Contenido de la hoja base
- **WHEN** se lee la hoja base
- **THEN** contiene las variables del sistema visual, un reinicio mínimo y el estilo de foco visible de todos los controles

### Requirement: Disposición con Flexbox o Grid
El encabezado, la navegación y los listados SHALL organizarse con Flexbox o Grid, de modo que el contenido se reordene sin romperse entre 320 px y 1280 px.

#### Scenario: Navegación a 320 px
- **WHEN** el navegador tiene 320 px de ancho y se ve cualquier página
- **THEN** el encabezado y la navegación siguen siendo legibles y usables, aunque los enlaces puedan distribuirse en varias líneas

#### Scenario: Listado de tarjetas a 1280 px
- **WHEN** el navegador tiene 1280 px de ancho y se ve el Catálogo
- **THEN** las tarjetas se distribuyen en varias columnas aprovechando el ancho disponible

### Requirement: Sin desplazamiento horizontal de la página
A 320 px y a 1280 px los textos y los controles SHALL ser legibles y la página SHALL caber en el ancho del navegador sin desplazamiento horizontal del documento.

#### Scenario: Página a 320 px
- **WHEN** se abre cualquiera de las cinco páginas en un navegador de 320 px de ancho
- **THEN** no hay desplazamiento horizontal del documento y todo el texto y control se puede leer y operar

#### Scenario: Página a 1280 px
- **WHEN** se abren las páginas en un navegador de 1280 px de ancho
- **THEN** el contenido aprovecha el ancho disponible sin estirarse sin control

### Requirement: Desplazamiento propio de las tablas
Cada tabla envuelta en su contenedor SHALL desplazarse horizontalmente dentro de ese contenedor cuando necesite más ancho que la página, sin provocar desplazamiento del documento.

#### Scenario: Tabla ancha a 320 px
- **WHEN** a 320 px una tabla, por ejemplo la de Libros, necesita más ancho que su contenedor
- **THEN** el contenedor permite desplazar la tabla horizontalmente por su cuenta y la página en su conjunto no se desplaza lateralmente

### Requirement: Foco visible y orden de tabulación coherente
Todos los controles SHALL mostrar un indicador de foco visible al recorrerlos con el teclado, y la presentación SHALL conservar el orden visual coherente con el orden del marcado.

#### Scenario: Recorrido por teclado
- **WHEN** el operador recorre una página con Tab y Shift+Tab
- **THEN** cada control alcanzado muestra un contorno de foco claramente visible sobre cualquier fondo de la interfaz

#### Scenario: Orden visual y de tabulación
- **WHEN** se compara el orden visual de los controles con el orden en que los alcanza el teclado
- **THEN** coinciden, porque la presentación no reordena elementos enfocables respecto del orden del marcado

### Requirement: Estados expresados con elementos no cromáticos
Los mensajes de error, correcto y vacío, y la marca de maqueta, SHALL distinguirse entre sí con elementos que no dependen solo del color (texto, icono o trazo).

#### Scenario: Mensaje de error
- **WHEN** se muestra un mensaje de operación rechazada o de error de campo
- **THEN** el mensaje incluye texto explicativo y un elemento no cromático —por ejemplo un trazo lateral o un símbolo— que lo identifica aunque no se perciba el color

#### Scenario: Marca de maqueta
- **WHEN** se ve una región cuya operación todavía no funciona
- **THEN** la marca de maqueta es visible y diferenciable del resto del contenido

### Requirement: Objetivos táctiles y contraste legible
Los botones y demás controles SHALL tener un área de activación suficiente y el texto SHALL presentar contraste legible sobre su fondo.

#### Scenario: Área de activación de los botones
- **WHEN** se miden los botones, por ejemplo el primario de confirmación de venta
- **THEN** su altura efectiva alcanza al menos 2,75 rem (44 px)

#### Scenario: Contraste del texto
- **WHEN** se revisa el texto sobre sus fondos: cuerpo sobre fondo crema, texto del botón primario sobre verde, mensajes sobre sus fondos tintados
- **THEN** cada combinación alcanza una razón de contraste de al menos 4,5:1 para texto normal
