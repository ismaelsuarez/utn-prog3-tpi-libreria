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

test("agregarVenta sigue lanzando Error pendiente de C-05", () => {
  assert.throws(() => almacen.agregarVenta({}), Error);
  assert.throws(() => almacen.agregarVenta({}), /C-05/);
});

test("el entorno de pruebas no ofrece localStorage: el almacén opera en memoria", () => {
  assert.equal(typeof globalThis.localStorage, "undefined", "localStorage no debe existir en el entorno de pruebas");
  assert.equal(almacen.obtenerVentas().length, 0);
});

// --- Lectura que prioriza lo guardado (punto de inyección del storage) ---

function crearStorage(contenidoInicial) {
  const claves = Object.assign({}, contenidoInicial);
  return {
    escrituras: [],
    contenido: claves,
    getItem: function (clave) {
      return Object.prototype.hasOwnProperty.call(claves, clave) ? claves[clave] : null;
    },
    setItem: function (clave, valor) {
      this.escrituras.push(clave);
      claves[clave] = String(valor);
    }
  };
}

test("obtenerLibros y obtenerClientes priorizan la clave guardada", () => {
  const librosGuardados = [{ id: "lib-77", titulo: "Guardado la noche anterior", isbn: "978-987-000-077-6", precio: 999, editorialId: "edi-01", generoId: null, autorIds: ["aut-01"] }];
  const clientesGuardados = [{ id: "cli-77", nombreCompleto: "Guardado Cliente", email: "guardado@correo.test" }];
  const storage = crearStorage({
    "libreria.libros": JSON.stringify(librosGuardados),
    "libreria.clientes": JSON.stringify(clientesGuardados)
  });

  globalThis.localStorage = storage;
  try {
    const libros = almacen.obtenerLibros();
    assert.equal(libros.length, 1, "debería devolver lo guardado y no los seis ejemplos");
    assert.equal(libros[0].titulo, "Guardado la noche anterior");
    assert.equal(libros[0].autorIds.length, 1, "los autorIds deben conservarse");

    const clientes = almacen.obtenerClientes();
    assert.equal(clientes.length, 1);
    assert.equal(clientes[0].email, "guardado@correo.test");

    assert.deepEqual(storage.escrituras, [], "la lectura nunca debe escribir (sin siembra)");
  } finally {
    delete globalThis.localStorage;
  }
});

test("una clave ausente devuelve los ejemplos sin sembrarla", () => {
  const storage = crearStorage({});

  globalThis.localStorage = storage;
  try {
    assert.equal(almacen.obtenerLibros().length, datos.libros.length);
    assert.equal(almacen.obtenerClientes().length, datos.clientes.length);
    assert.deepEqual(storage.escrituras, [], "la lectura no debe escribir");
    assert.equal(storage.contenido["libreria.libros"], undefined, "la clave no debe crearse al leer");
  } finally {
    delete globalThis.localStorage;
  }
});

test("un contenido ilegible devuelve los ejemplos sin sobrescribirlo", () => {
  const storage = crearStorage({
    "libreria.libros": "{esto no es un arreglo json",
    "libreria.clientes": JSON.stringify({ forma: "de objeto, no de arreglo" })
  });

  globalThis.localStorage = storage;
  try {
    assert.equal(almacen.obtenerLibros().length, datos.libros.length);
    assert.equal(almacen.obtenerClientes().length, datos.clientes.length);
    assert.deepEqual(storage.escrituras, [], "la lectura no debe escribir");
    assert.equal(storage.contenido["libreria.libros"], "{esto no es un arreglo json", "no se sobrescribe lo ilegible");
  } finally {
    delete globalThis.localStorage;
  }
});

// --- Altas: van al final del archivo porque modifican el estado compartido ---

test("agregarLibro da de alta sobre los ejemplos, asigna lib-07 y devuelve el registro", () => {
  const antes = almacen.obtenerLibros();
  assert.equal(antes.length, datos.libros.length, "se parte de los seis ejemplos (clave ausente)");

  const entrada = {
    titulo: "La torre de los sueños",
    isbn: "978-987-000-088-3",
    precio: 1750.5,
    editorialId: "edi-01",
    generoId: "gen-01",
    autorIds: ["aut-01", "aut-03"]
  };

  const guardado = almacen.agregarLibro(entrada);

  assert.equal(guardado.id, "lib-07", "el id sigue el esquema prefijo + contador");
  assert.equal(guardado.titulo, entrada.titulo);
  assert.deepEqual(
    almacen.obtenerLibros().map((libro) => libro.id),
    datos.libros.map((libro) => libro.id).concat(["lib-07"]),
    "quedan los ejemplos más el registro nuevo, sin perder datos"
  );

  // Ni lo devuelto ni lo de entrada comparten referencias con lo almacenado.
  guardado.autorIds.push("aut-99");
  entrada.autorIds.push("aut-02");
  const releido = almacen.obtenerLibros().find((libro) => libro.id === "lib-07");
  assert.deepEqual(releido.autorIds, ["aut-01", "aut-03"], "la lista de autores debe venir copiada");
  assert.equal(releido.titulo, "La torre de los sueños");
});

test("una segunda alta de libro continúa el contador", () => {
  const antes = almacen.obtenerLibros();
  const guardado = almacen.agregarLibro({
    titulo: "Cuaderno de bitácora",
    isbn: "978-987-000-087-6",
    precio: 900,
    editorialId: "edi-02",
    generoId: null,
    autorIds: ["aut-02"]
  });

  assert.equal(guardado.id, "lib-" + String(antes.length + 1).padStart(2, "0"));
  assert.ok(almacen.obtenerLibros().some((libro) => libro.id === guardado.id), "el registro nuevo debe verse en la lectura");
});

test("agregarCliente da de alta sobre los ejemplos, asigna cli-04 y devuelve el registro", () => {
  const antes = almacen.obtenerClientes();
  assert.equal(antes.length, datos.clientes.length, "se parte de los tres ejemplos (clave ausente)");

  const guardado = almacen.agregarCliente({
    nombreCompleto: "Bruno Lagos",
    email: "bruno.lagos@correo.test"
  });

  assert.equal(guardado.id, "cli-04", "el id sigue el esquema prefijo + contador");
  assert.deepEqual(
    almacen.obtenerClientes().map((cliente) => cliente.id),
    datos.clientes.map((cliente) => cliente.id).concat(["cli-04"]),
    "quedan los ejemplos más el registro nuevo, sin perder datos"
  );

  guardado.email = "alterado@correo.test";
  const releido = almacen.obtenerClientes().find((cliente) => cliente.id === "cli-04");
  assert.equal(releido.email, "bruno.lagos@correo.test", "lo devuelto es una copia de lo almacenado");
});

test("una segunda alta de cliente continúa el contador", () => {
  const antes = almacen.obtenerClientes();
  const guardado = almacen.agregarCliente({
    nombreCompleto: "Cira Ledesma",
    email: "cira.ledesma@correo.test"
  });

  assert.equal(guardado.id, "cli-" + String(antes.length + 1).padStart(2, "0"));
  assert.ok(almacen.obtenerClientes().some((cliente) => cliente.id === guardado.id), "el registro nuevo debe verse en la lectura");
});

test("el almacén no valida ni normaliza: guarda los datos tal como llegan", () => {
  const guardado = almacen.agregarLibro({
    titulo: "  Con espacios  ",
    isbn: " 978 987 000 111 1 ",
    precio: "treinta",
    editorialId: "edi-inexistente",
    generoId: "",
    autorIds: []
  });

  assert.equal(guardado.titulo, "  Con espacios  ", "no recorta el título");
  assert.equal(guardado.precio, "treinta", "no convierte el precio");
  assert.equal(guardado.editorialId, "edi-inexistente", "no comprueba la editorial");
  assert.equal(guardado.generoId, "", "no normaliza el género");
  assert.ok(almacen.obtenerLibros().some((libro) => libro.id === guardado.id));
});
