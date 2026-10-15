"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const datos = require("../js/datos/datos-iniciales.js");

test("mínimos exigidos por la consigna", () => {
  assert.ok(datos.libros.length >= 6, "al menos 6 libros");
  assert.ok(datos.editoriales.length >= 2, "al menos 2 editoriales");
  assert.ok(datos.generos.length >= 2, "al menos 2 géneros");
  assert.ok(datos.autores.length >= 3, "al menos 3 autores");
  assert.ok(datos.clientes.length >= 3, "al menos 3 clientes");
});

test("los identificadores son únicos dentro de cada entidad", () => {
  const colecciones = ["editoriales", "generos", "autores", "libros", "clientes"];
  colecciones.forEach((nombre) => {
    const ids = datos[nombre].map((registro) => registro.id);
    assert.equal(new Set(ids).size, ids.length, `IDs duplicados en ${nombre}`);
  });
});

test("los identificadores siguen el esquema prefijo + contador", () => {
  const esperado = {
    editoriales: "edi",
    generos: "gen",
    autores: "aut",
    libros: "lib",
    clientes: "cli"
  };
  Object.keys(esperado).forEach((nombre) => {
    datos[nombre].forEach((registro) => {
      assert.match(registro.id, new RegExp(`^${esperado[nombre]}-\\d{2}$`), `${nombre}: ${registro.id}`);
    });
  });
});

test("cada libro referencia editorial, género opcional y autores existentes", () => {
  const editoriales = new Set(datos.editoriales.map((e) => e.id));
  const generos = new Set(datos.generos.map((g) => g.id));
  const autores = new Set(datos.autores.map((a) => a.id));

  datos.libros.forEach((libro) => {
    assert.ok(editoriales.has(libro.editorialId), `${libro.id}: editorial inexistente`);
    if (libro.generoId !== null) {
      assert.ok(generos.has(libro.generoId), `${libro.id}: género inexistente`);
    }
    assert.ok(libro.autorIds.length >= 1, `${libro.id}: sin autores`);
    libro.autorIds.forEach((autorId) => {
      assert.ok(autores.has(autorId), `${libro.id}: autor inexistente`);
    });
  });
});

test("el conjunto inicial incluye los casos exigidos", () => {
  assert.ok(datos.libros.some((l) => l.generoId === null), "libro sin género");
  assert.ok(datos.libros.some((l) => l.autorIds.length > 1), "libro con más de un autor");
  assert.ok(datos.libros.some((l) => l.precio === 1500), "libro con precio 1500");
  assert.ok(datos.libros.some((l) => l.precio === 2000), "libro con precio 2000");
});

test("las entidades tienen sus propiedades según el modelo", () => {
  datos.libros.forEach((libro) => {
    ["id", "titulo", "isbn", "precio", "editorialId", "generoId", "autorIds"].forEach((propiedad) => {
      assert.ok(propiedad in libro, `libro ${libro.id} sin ${propiedad}`);
    });
    assert.equal(typeof libro.precio, "number");
    assert.ok(libro.precio > 0, `${libro.id}: precio mayor que cero`);
  });
  datos.clientes.forEach((cliente) => {
    assert.ok("id" in cliente && "nombreCompleto" in cliente && "email" in cliente, `cliente ${cliente.id}`);
  });
});
