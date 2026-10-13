# TPI: frontend de una librería — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin volver a sincronizar ambos archivos.

Trabajo Práctico Integrador de Programación III (Tecnicatura Universitaria en
Programación a Distancia, UTN). Frontend estático de una librería: catálogo,
alta de libros y clientes, venta simulada e historial, con datos en el
navegador. Consigna: `docs/Repaso Primer Parcial.pdf`.

Integrantes: Avalos Pablo, Blangetti Sofia, Suarez Ismael.

---

## Stack Tecnológico

| Capa | Tecnologías | Observaciones |
|---|---|---|
| Estructura | HTML5 semántico | Varias páginas, una por vista; `index.html` es la entrada |
| Presentación | CSS propio en archivos externos | Flexbox o Grid; sin frameworks ni CDNs; tipografías e imágenes locales |
| Comportamiento | JavaScript nativo (scripts clásicos) | Sin librerías; sin `type="module"` |
| Persistencia | `localStorage` del navegador | Libros, clientes y ventas |
| Verificación de desarrollo | `node --test` (runner integrado de Node) | Solo durante el desarrollo; se excluye de la entrega |
| Verificación de entrega | Casos manuales en el navegador | Ocho casos (CM-1 a CM-8) registrados en el README |

No hay npm, empaquetador, transpilador, API, base de datos ni servidor. El
proyecto se abre directamente desde `file://`.

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

### Comandos

```bash
# Abrir el proyecto: abrir index.html en el navegador (sin servidor ni npm)

# Pruebas automatizadas de la lógica pura
node --test tests/
```

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leer el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---|---|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Propósito, alcance por ejercicio, etapas y fuera de alcance |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack, arquitectura multipágina, vistas |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Operador único, capacidades por recurso, accesibilidad |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, venta como instantánea, claves de `localStorage`, datos iniciales |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-XX-NN) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica y casos manuales CM-1 a CM-8 |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos extremo a extremo, incluido el precio histórico |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Estructura de directorios, carga de scripts, exportación dual, verificación |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones DD-01 a DD-09 y supuestos a validar |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | Inconsistencias y preguntas abiertas a resolver ANTES de codificar |

Pendiente de prioridad **Alta** en `10_preguntas_abiertas.md`:

- **PA-02**: fechas y canal de entrega; los comunica el docente por separado.

Cada change resuelve en su `/opsx:explore` las preguntas abiertas que lo
bloquean (columna «Bloquea» de ese archivo).

---

## Skills Disponibles

Fuente de verdad: `.atl/skill-registry.md`. Solo se listan las skills que
aplican a este stack; las de React, Python, SQL, Docker o Go del registro no
corresponden a este proyecto.

| Agente | Rol | Skills que carga |
|---|---|---|
| **Maquetado** | HTML semántico, formularios, tablas, estados | `accessibility` |
| **Presentación** | CSS propio, adaptación a 320 px y 1280 px, foco | `responsive-design` (solo su parte de CSS puro), `accessibility` |
| **Lógica y datos** | Funciones puras, almacén, `localStorage`, pruebas | `tdd`, `security-best-practices` |
| **Documentación y entrega** | README, casos manuales, armado de la entrega | `cognitive-doc-design`, `work-unit-commits` |
| **Orquestación** | SDD / OPSX / documentación de fundación | `kb-creator`, `roadmap-generator`, `agents-md-generator`, `skill-registry` |

Cargar la skill correspondiente al contexto ANTES de escribir código.

> El orquestador resuelve cada skill desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado). El registro es un índice de rutas: los subagentes leen el `SKILL.md` completo desde la ruta indicada. Esta tabla solo relaciona skill y rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 6 changes en 3 fases, uno por ejercicio de la consigna (100 puntos).
- **Camino crítico** (5): `C-01 → C-03 → C-04 → C-05 → C-06`. C-02 avanza en paralelo y se une en C-06.
- **Hito 1 (Etapa 1, maqueta)**: C-01 + C-02.
- **Primer change**: `C-01` (`estructura-y-pantallas-html`).

| Change | Nombre | Depende de | Ejercicio |
|---|---|---|---|
| C-01 | `estructura-y-pantallas-html` | ninguna | 1 (20 puntos) |
| C-02 | `presentacion-css-y-uso-adaptable` | C-01 | 2 (20 puntos) |
| C-03 | `datos-locales-catalogo-y-filtro` | C-01 | 3 (15 puntos) |
| C-04 | `alta-de-libros-y-clientes` | C-03 | 4 (15 puntos) |
| C-05 | `venta-simulada-e-historial` | C-04 | 5 (20 puntos) |
| C-06 | `persistencia-verificacion-y-documentacion` | C-05, C-02 | 6 (10 puntos) |

No se crean changes adicionales: lo transversal se incluye en alguno de los seis.

**Antes de cualquier `/opsx:propose`**: leer [CHANGES.md](CHANGES.md), identificar las dependencias del change y los archivos de «Leer antes».

---

## Reglas Duras (específicas del proyecto)

> Reglas globales ya definidas en `~/.claude/CLAUDE.md` (orquestador, gobernanza, TDD, engram, commits convencionales sin coautoría de IA): el proyecto las hereda. Aquí viven solo las reglas **específicas de este proyecto**.

Son contrato; romperlas es un defecto. Las reglas 1 a 4 provienen de la
consigna: incumplirlas se informa en la evaluación.

1. **NUNCA** usar librerías, frameworks ni CDNs de CSS o JavaScript → todo recurso (estilos, scripts, tipografías, imágenes) es propio y local.
2. **NUNCA** usar `<script type="module">` ni `import`/`export` → scripts clásicos con el espacio de nombres `Libreria` y exportación dual, porque el proyecto se abre desde `file://`.
3. **NUNCA** agregar `package.json`, dependencias ni herramientas de compilación → las pruebas usan `node --test` en `tests/`, carpeta excluida de la entrega.
4. **NUNCA** usar `fetch`, API ni servidor → los datos salen de `js/datos/` y de `localStorage`.
5. **NUNCA** insertar datos de usuario con `innerHTML` → usar `textContent` o creación de nodos.
6. **NUNCA** tocar el DOM dentro de `js/logica/` → allí solo funciones puras; el DOM vive en `js/paginas/` y `js/interfaz.js`.
7. **NUNCA** acceder a `localStorage` fuera de `js/almacen.js` → toda lectura y escritura pasa por el almacén.
8. **NUNCA** leer del catálogo el precio de una venta confirmada → la venta guarda copia del precio unitario y de los datos descriptivos.
9. **NUNCA** agregar edición o borrado de registros, gestión de stock ni cobros → el alcance es el de la consigna.
10. **NUNCA** marcar un caso manual como aprobado sin ejecutarlo → el README registra el resultado realmente observado; si falla o queda pendiente, se registra el comportamiento real.
11. **NUNCA** dar por terminada una vista sin comprobarla a 320 px y a 1280 px, con teclado y foco visible → sin desplazamiento horizontal de la página; las tablas se desplazan dentro de su contenedor.
12. **NUNCA** aplicar de `responsive-design` nada que requiera librerías → solo su parte de CSS puro.
13. **Idioma**: código (nombres de archivos, funciones y propiedades), interfaz y documentación en español neutro. Esta regla reemplaza, para este proyecto, el valor por defecto global de artefactos en inglés.
14. **NUNCA** usar `var` en JavaScript → declarar con `const` por defecto y con `let` solo cuando la variable se reasigna. Cada script clásico mantiene su código dentro de una función envolvente, porque `const` y `let` de nivel superior comparten un mismo ámbito entre los scripts de la página y dos declaraciones con el mismo nombre producen un error.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:explore <nombre>                        → resolver las preguntas abiertas del change
4. /opsx:propose <nombre>                        → proposal + design + specs + tasks
5. /opsx:apply <nombre>                          → implementar las tasks cargando skills
6. /opsx:archive <nombre> + marcar [x]           → cerrar el change en CHANGES.md
```

- La lógica pura se escribe con pruebas primero (`node --test`); el DOM y
  `localStorage` se verifican con los casos manuales.
- El repositorio git se crea cuando exista al menos la estructura del
  proyecto y el `README.md` (DD-07).
- No forman parte de la entrega: `tests/`, `docs/`, `discovery/`,
  `knowledge-base/`, `openspec/`, `.atl/`, `.claude/`, `CHANGES.md`,
  `AGENTS.md`, `CLAUDE.md` y `.active-orchestrator-state.json`.

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
