"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const datos = require("../js/datos/datos-iniciales.js");
const libros = require("../js/logica/libros.js");

const catalogos = {
  editoriales: datos.editoriales,
  generos: datos.generos,
  autores: datos.autores
};

// Registro completo y válido: ninguno de sus datos coincide con los ejemplos.
function datosValidos() {
  return {
    titulo: "El taller de las traducciones",
    isbn: "978-987-000-099-9",
    precio: 1490,
    editorialId: "edi-02",
    generoId: "gen-02",
    autorIds: ["aut-02", "aut-03"]
  };
}

function validar(registro, conjuntoDeLibros) {
  return libros.validarLibro(registro, conjuntoDeLibros || datos.libros, catalogos);
}

// Exige UN SOLO error, en el campo esperado y con la forma {campo, mensaje}:
// así cada rechazo queda aislado (un error por campo) y sin colaterales.
function assertUnicoError(registro, campo, conjuntoDeLibros) {
  const errores = validar(registro, conjuntoDeLibros);
  assert.equal(
    errores.length,
    1,
    `se esperaba un solo error, hubo ${errores.length}: ${JSON.stringify(errores)}`
  );
  assert.equal(errores[0].campo, campo, `el error debería señalar «${campo}»`);
  assert.deepEqual(Object.keys(errores[0]).sort(), ["campo", "mensaje"]);
  assert.equal(typeof errores[0].mensaje, "string");
  assert.ok(errores[0].mensaje.trim() !== "", "el mensaje no puede quedar vacío");
  return errores[0];
}

test("rechaza el título vacío", () => {
  const registro = datosValidos();
  registro.titulo = "";
  assertUnicoError(registro, "titulo");
});

test("rechaza el ISBN vacío", () => {
  const registro = datosValidos();
  registro.isbn = "";
  assertUnicoError(registro, "isbn");
});

test("rechaza un ISBN existente escrito con separadores distintos", () => {
  const registro = datosValidos();
  // Mismo ISBN que el ejemplo lib-01 (978-987-000-001-1), solo con espacios.
  registro.isbn = "978 987 000 001 1";
  assertUnicoError(registro, "isbn");
});

test("rechaza un precio no numérico", () => {
  const registro = datosValidos();
  registro.precio = "mil quinientos";
  assertUnicoError(registro, "precio");
});

test("rechaza un precio igual a cero", () => {
  const registro = datosValidos();
  registro.precio = 0;
  assertUnicoError(registro, "precio");
});

test("rechaza un precio negativo", () => {
  const registro = datosValidos();
  registro.precio = -250;
  assertUnicoError(registro, "precio");
});

test("rechaza la editorial vacía", () => {
  const registro = datosValidos();
  registro.editorialId = "";
  assertUnicoError(registro, "editorial");
});

test("rechaza una editorial desconocida", () => {
  const registro = datosValidos();
  registro.editorialId = "edi-99";
  assertUnicoError(registro, "editorial");
});

test("rechaza un libro sin autores seleccionados", () => {
  const registro = datosValidos();
  registro.autorIds = [];
  assertUnicoError(registro, "autores");
});

test("rechaza un autor desconocido sin señalar también los autores válidos", () => {
  const registro = datosValidos();
  registro.autorIds = ["aut-01", "aut-99"];
  assertUnicoError(registro, "autores");
});

test("rechaza un género desconocido", () => {
  const registro = datosValidos();
  registro.generoId = "gen-99";
  assertUnicoError(registro, "genero");
});

test("el género vacío es opcional: no produce errores y se guarda como null", () => {
  const registro = datosValidos();
  registro.generoId = "";
  assert.deepEqual(validar(registro), []);
  assert.equal(registro.generoId, null, "el género vacío debería quedar como null");
});

test("un libro válido no produce ningún error ni altera sus datos", () => {
  const registro = datosValidos();
  const antes = Object.assign({}, registro, { autorIds: registro.autorIds.slice() });

  assert.deepEqual(validar(registro), []);
  assert.deepEqual(registro, antes, "validar no debería modificar un registro ya correcto");
});

// --- Ampliación: segunda vuelta de casos por cada comportamiento ---

test("rechaza el título formado solo por espacios", () => {
  const registro = datosValidos();
  registro.titulo = "     ";
  assertUnicoError(registro, "titulo");
});

test("rechaza el ISBN formado solo por separadores", () => {
  const registro = datosValidos();
  registro.isbn = "   -  - ";
  assertUnicoError(registro, "isbn");
});

test("rechaza un ISBN existente con el mismo formato que el guardado", () => {
  const registro = datosValidos();
  registro.isbn = "978-987-000-003-5"; // igual que lib-03
  assertUnicoError(registro, "isbn");
});

test("detecta el duplicado aunque el ISBN guardado tenga espacios y el nuevo guiones", () => {
  const registro = datosValidos();
  registro.isbn = "978-987-000-005-9";
  const guardados = [{ id: "lib-88", isbn: "978 987 000 005 9", autorIds: [] }];
  assertUnicoError(registro, "isbn", guardados);
});

test("rechaza un precio vacío y uno con coma decimal", () => {
  const vacio = datosValidos();
  vacio.precio = "";
  assertUnicoError(vacio, "precio");

  const conComa = datosValidos();
  conComa.precio = "14,90";
  assertUnicoError(conComa, "precio");
});

test("rechaza la editorial formada solo por espacios", () => {
  const registro = datosValidos();
  registro.editorialId = "   ";
  assertUnicoError(registro, "editorial");
});

test("rechaza un libro cuya lista de autores no viene en el registro", () => {
  const registro = datosValidos();
  delete registro.autorIds;
  assertUnicoError(registro, "autores");
});

test("acepta el género null y el género ausente, dejándolo como null", () => {
  const nulo = datosValidos();
  nulo.generoId = null;
  assert.deepEqual(validar(nulo), []);
  assert.equal(nulo.generoId, null);

  const ausente = datosValidos();
  delete ausente.generoId;
  assert.deepEqual(validar(ausente), []);
  assert.equal(ausente.generoId, null, "el género ausente debería quedar como null");
});

test("acumula un error por cada campo rechazado sin registrar nada", () => {
  const registro = datosValidos();
  registro.titulo = "";
  registro.precio = 0;

  const errores = validar(registro);
  assert.equal(errores.length, 2, JSON.stringify(errores));
  assert.deepEqual(
    errores.map((error) => error.campo).sort(),
    ["precio", "titulo"],
    "debería señalar exactamente título y precio"
  );
});
