# Proposal

## Why

El Ejercicio 2 del TPI (20 puntos: coherencia y organización 8; adaptación 8; accesibilidad básica 4) exige dar identidad visual, disposición adaptable y accesibilidad básica a las cinco vistas que C-01 dejó maquetadas sin estilo. Sin este change el hito de la Etapa 1 (C-01 + C-02) no se completa: las páginas se ven sin CSS y no se puede anticipar el caso manual CM-8 (teclado y anchos de 320 px y 1280 px).

## What Changes

- Se completan las tres hojas de estilo enlazadas en las cinco páginas, sin tocar el marcado de C-01 (salvo ajustes mínimos de clases, acordados con el Integrante A): `css/base.css` (variables de paleta, tipografía, espaciado y radios; reinicio mínimo; estilo de `:focus-visible`), `css/disposicion.css` (encabezado, navegación, grillas y cortes para 320 px y 1280 px) y `css/componentes.css` (tarjetas, formularios, botones, tablas, mensajes y marca de maqueta).
- Se cierra PA-03 con la paleta «verde biblioteca + crema» (verde bosque primario, acento dorado, fondos crema; solo modo claro) y tipografía del sistema (sin `@font-face` ni archivos de fuente binarios; monoespaciada del sistema para ISBN e importes).
- Toda la organización usa Flexbox o Grid, con mobile-first y un punto de corte único; a 320 px y a 1280 px no hay desplazamiento horizontal de la página y las tablas se desplazan dentro de su propio contenedor.
- Se estilizan foco visible, objetivos táctiles suficientes y mensajes de error/correcto/vacío diferenciados por texto además del color.
- Se registra la decisión de identidad visual como DD-15 en `knowledge-base/09_decisiones_y_supuestos.md` y PA-03 queda «Resuelta» en `knowledge-base/10_preguntas_abiertas.md`.

Fuera de este change: cualquier JavaScript (C-03 a C-05), cambios estructurales de marcado, modo oscuro, imágenes ajenas y la verificación formal de CM-8 en el README (C-06).

## Capabilities

### New Capabilities

- `presentacion`: identidad visual coherente, disposición adaptable (Flexbox/Grid, 320 px y 1280 px) y accesibilidad básica visible (foco, mensajes con texto, objetivos táctiles) de las cinco vistas, con CSS propio y local.

### Modified Capabilities

Ninguna. El marcado de C-01 no cambia a nivel de requisitos y las capacidades existentes (`estructura-y-navegacion`, `formularios-y-mensajes`, `catalogo`, `libros`, `clientes`, `ventas`, `historial`) no alteran su comportamiento: este change agrega presentación sobre ellas.

## Impact

- **Archivos modificados**: `css/base.css`, `css/disposicion.css`, `css/componentes.css` (vacíos → completos). Posibles ajustes mínimos de clases en los cinco HTML, solo si hiciera falta y coordinados con el Integrante A.
- **Documentación a actualizar**: `knowledge-base/09_decisiones_y_supuestos.md` (nueva DD-15), `knowledge-base/10_preguntas_abiertas.md` (PA-03 resuelta).
- **Changes dependientes**: C-06 consume el resultado en CM-8 y en la entrega; C-03 a C-05 heredan el estilo de las clases de C-01 sin esfuerzo.
- **Dependencias**: C-01 archivado (`estructura-y-pantallas-html`).
- **Pruebas**: sin lógica pura no hay tests con `node --test`; la verificación es manual en las cinco páginas a 320 px y 1280 px y por teclado (reglas duras 11 y 12: solo CSS propio, nada de librerías).
