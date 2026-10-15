"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const almacen = require("../js/almacen.js");
const datos = require("../js/datos/datos-iniciales.js");

test("las seis lecturas devuelven los datos iniciales con su forma", () => {
  assert.equal(almacen.obtenerLibros().length, datos.libros.length);
  assert.equal(almacen.obtenerClientes().length, datos.clientes.length);
  assert.equal(almacen.obtenerEditoriales().length, datos.editoriales.length);
  assert.equal(almacen.obtenerGeneros().length, datos.generos.length);
  assert.equal(almacen.obtenerAutores().length, datos.autores.length);
  assert.deepEqual(almacen.obtenerVentas(), []);

  const libro = almacen.obtenerLibros()[0];
  ["id", "titulo", "isbn", "precio", "editorialId", "generoId", "autorIds"].forEach((propiedad) => {
    assert.ok(propiedad in libro, `libro sin ${propiedad}`);
  });

  const cliente = almacen.obtenerClientes()[0];
  ["id", "nombreCompleto", "email"].forEach((propiedad) => {
    assert.ok(propiedad in cliente, `cliente sin ${propiedad}`);
  });
});

test("las lecturas devuelven copias: mutar el resultado no altera los datos iniciales", () => {
  const libros = almacen.obtenerLibros();
  const longitudInicial = libros.length;

  libros[0].titulo = "Título alterado";
  libros[0].autorIds.push("aut-99");
  libros.push({ id: "lib-99" });

  const deNuevo = almacen.obtenerLibros();
  assert.equal(deNuevo.length, longitudInicial);
  assert.notEqual(deNuevo[0].titulo, "Título alterado");
  assert.equal(deNuevo[0].titulo, datos.libros[0].titulo);
  assert.equal(deNuevo[0].autorIds.includes("aut-99"), false);

  const clientes = almacen.obtenerClientes();
  clientes[0].email = "alterado@correo.test";
  assert.equal(almacen.obtenerClientes()[0].email, datos.clientes[0].email);
});

test("agregarLibro, agregarCliente y agregarVenta lanzan Error pendiente", () => {
  assert.throws(() => almacen.agregarLibro({}), Error);
  assert.throws(() => almacen.agregarCliente({}), Error);
  assert.throws(() => almacen.agregarVenta({}), Error);
  assert.throws(() => almacen.agregarLibro({}), /C-04/);
  assert.throws(() => almacen.agregarVenta({}), /C-05/);
});

test("el almacén no toca localStorage en este change", () => {
  assert.equal(typeof globalThis.localStorage, "undefined", "localStorage no debe existir en el entorno de pruebas");
  assert.equal(almacen.obtenerVentas().length, 0);
});
