"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

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

test("agregarVenta persiste la primera venta sin tocar libros ni clientes", () => {
  const storage = crearStorage({ "libreria.libros": "[]", "libreria.clientes": "[]" });
  globalThis.localStorage = storage;
  try {
    assert.deepEqual(almacen.obtenerVentas(), []);
    assert.deepEqual(storage.escrituras, [], "leer no siembra la clave");
    const venta = crearVenta();
    const guardada = almacen.agregarVenta(venta);
    assert.equal(guardada.id, "ven-01");
    assert.deepEqual(guardada.cliente, venta.cliente);
    assert.deepEqual(guardada.renglones, venta.renglones);
    assert.equal(guardada.fecha, venta.fecha);
    assert.equal(guardada.total, 3000);
    assert.deepEqual(JSON.parse(storage.contenido["libreria.ventas"]), [guardada]);
    assert.deepEqual(almacen.obtenerVentas(), [guardada]);
    assert.deepEqual(storage.escrituras, ["libreria.ventas"]);
    assert.equal(storage.contenido["libreria.libros"], "[]");
    assert.equal(storage.contenido["libreria.clientes"], "[]");
  } finally {
    delete globalThis.localStorage;
  }
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


function crearVenta() {
  return {
    fecha: "2026-10-16T14:30:00.000Z",
    cliente: { id: "cli-01", nombreCompleto: "Cliente de prueba", email: "cliente@correo.test" },
    renglones: [{ libroId: "lib-01", titulo: "Libro de prueba", isbn: "978-987-000-001-1", cantidad: 2, precioUnitario: 1500, subtotal: 3000 }],
    total: 3000
  };
}

test("las ventas se agregan en orden con ID propio y sin duplicar al leer", () => {
  const storage = crearStorage({});
  globalThis.localStorage = storage;
  try {
    const primera = almacen.agregarVenta(crearVenta());
    const entrada = crearVenta();
    entrada.id = "ven-999";
    entrada.total = 0;
    entrada.renglones[0].precioUnitario = 0;
    entrada.renglones[0].subtotal = 0;
    const segunda = almacen.agregarVenta(entrada);
    assert.equal(segunda.id, "ven-02", "el ID externo no reemplaza al asignado");
    assert.equal(segunda.total, 0, "el almacén no cambia importes validados por la lógica");
    assert.deepEqual(almacen.obtenerVentas(), [primera, segunda]);
    assert.deepEqual(almacen.obtenerVentas(), [primera, segunda]);
    assert.deepEqual(storage.escrituras, ["libreria.ventas", "libreria.ventas"]);
  } finally {
    delete globalThis.localStorage;
  }
});

test("el ID de venta continúa el máximo guardado y no la cantidad de ventas", () => {
  const anteriores = [Object.assign(crearVenta(), { id: "ven-02" }), Object.assign(crearVenta(), { id: "ven-07" })];
  const storage = crearStorage({ "libreria.ventas": JSON.stringify(anteriores) });
  globalThis.localStorage = storage;
  try {
    const guardada = almacen.agregarVenta(crearVenta());
    assert.equal(guardada.id, "ven-08");
    assert.deepEqual(almacen.obtenerVentas(), anteriores.concat([guardada]));
    assert.deepEqual(storage.escrituras, ["libreria.ventas"]);
  } finally {
    delete globalThis.localStorage;
  }
});


// Cada contexto ejecuta el script público con su propia reserva en memoria.
function cargarAlmacenEnNode() {
  const contexto = { module: { exports: {} }, require: () => datos };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../js/almacen.js"), "utf8"), contexto);
  return contexto.module.exports;
}

test("las ventas en memoria aíslan entrada y respuesta del alta", () => {
  const aislado = cargarAlmacenEnNode();
  const entrada = crearVenta();
  const guardada = aislado.agregarVenta(entrada);
  entrada.cliente.nombreCompleto = "Nombre alterado";
  entrada.renglones[0].precioUnitario = 9000;
  entrada.renglones.push(Object.assign({}, entrada.renglones[0]));
  guardada.cliente.email = "otro@correo.test";
  guardada.renglones[0].titulo = "Título alterado";
  guardada.total = 999;
  const releida = aislado.obtenerVentas()[0];
  assert.equal(releida.cliente.nombreCompleto, "Cliente de prueba");
  assert.equal(releida.cliente.email, "cliente@correo.test");
  assert.equal(releida.renglones.length, 1);
  assert.equal(releida.renglones[0].precioUnitario, 1500);
  assert.equal(releida.renglones[0].titulo, "Libro de prueba");
  assert.equal(releida.total, 3000);
});

test("las lecturas de ventas en memoria devuelven copias independientes", () => {
  const aislado = cargarAlmacenEnNode();
  const primera = aislado.agregarVenta(crearVenta());
  const segunda = aislado.agregarVenta(crearVenta());
  assert.equal(primera.id, "ven-01");
  assert.equal(segunda.id, "ven-02");
  const lectura = aislado.obtenerVentas();
  lectura[0].cliente.id = "cli-99";
  lectura[0].renglones[0].subtotal = 123;
  lectura[0].renglones.length = 0;
  lectura.pop();
  const releida = aislado.obtenerVentas();
  assert.equal(releida.length, 2);
  assert.equal(releida[0].cliente.id, "cli-01");
  assert.equal(releida[0].renglones.length, 1);
  assert.equal(releida[0].renglones[0].subtotal, 3000);
  assert.equal(releida[1].total, 3000);
});

test("ventas con JSON ilegible no se leen como vacías ni se sobrescriben", () => {
  const storage = crearStorage({ "libreria.ventas": "{contenido ilegible" });
  globalThis.localStorage = storage;
  try {
    assert.throws(() => almacen.obtenerVentas());
    assert.throws(() => almacen.agregarVenta(crearVenta()));
    assert.equal(storage.contenido["libreria.ventas"], "{contenido ilegible");
    assert.deepEqual(storage.escrituras, []);
  } finally {
    delete globalThis.localStorage;
  }
});

test("ventas con estructura ilegible conservan exactamente el contenido guardado", () => {
  const contenidos = ["null", "{}", "[null]", "[{}]", '[{"cliente":null,"renglones":[]}]', '[{"cliente":{},"renglones":[null]}]'];
  for (const crudo of contenidos) {
    const storage = crearStorage({ "libreria.ventas": crudo });
    globalThis.localStorage = storage;
    try {
      assert.throws(() => almacen.obtenerVentas(), `debe rechazar ${crudo}`);
      assert.throws(() => almacen.agregarVenta(crearVenta()), `no debe agregar sobre ${crudo}`);
      assert.equal(storage.contenido["libreria.ventas"], crudo);
      assert.deepEqual(storage.escrituras, []);
    } finally {
      delete globalThis.localStorage;
    }
  }
});

function cargarAlmacenEnNavegador(ventana) {
  ventana.Libreria = { datos };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../js/almacen.js"), "utf8"), { window: ventana });
  return ventana.Libreria.almacen;
}

test("sin almacenamiento en navegador las ventas fallan en lugar de usar memoria", () => {
  const aislado = cargarAlmacenEnNavegador({});
  assert.throws(() => aislado.obtenerVentas(), /almacenamiento/);
  assert.throws(() => aislado.agregarVenta(crearVenta()), /almacenamiento/);
  assert.throws(() => aislado.obtenerVentas(), /almacenamiento/);
  assert.equal(aislado.obtenerLibros().length, datos.libros.length, "se conserva el fallback de libros");
  assert.equal(aislado.obtenerClientes().length, datos.clientes.length, "se conserva el fallback de clientes");
});

test("el acceso bloqueado al storage de navegador se propaga sin cambiar libros o clientes", () => {
  const fallo = new Error("Acceso al almacenamiento bloqueado");
  const ventana = {};
  Object.defineProperty(ventana, "localStorage", { get: () => { throw fallo; } });
  const aislado = cargarAlmacenEnNavegador(ventana);
  assert.throws(() => aislado.obtenerVentas(), (error) => error === fallo);
  assert.throws(() => aislado.agregarVenta(crearVenta()), (error) => error === fallo);
  assert.equal(aislado.obtenerLibros().length, datos.libros.length);
  assert.equal(aislado.obtenerClientes().length, datos.clientes.length);
});

test("un error al leer ventas se propaga y no intenta escribir", () => {
  const fallo = new Error("Lectura rechazada");
  const storage = crearStorage({ "libreria.ventas": "[]" });
  storage.getItem = () => { throw fallo; };
  const aislado = cargarAlmacenEnNavegador({ localStorage: storage });
  assert.throws(() => aislado.obtenerVentas(), (error) => error === fallo);
  assert.throws(() => aislado.agregarVenta(crearVenta()), (error) => error === fallo);
  assert.equal(storage.contenido["libreria.ventas"], "[]");
  assert.deepEqual(storage.escrituras, []);
});

test("escritura fallida conserva ventas y entrada y el reintento no duplica registros", () => {
  const anterior = Object.assign(crearVenta(), { id: "ven-01" });
  const crudo = JSON.stringify([anterior]);
  const storage = crearStorage({ "libreria.ventas": crudo });
  const escribir = storage.setItem;
  const fallo = new Error("Cuota de almacenamiento agotada");
  storage.setItem = () => { throw fallo; };
  const aislado = cargarAlmacenEnNavegador({ localStorage: storage });
  const entrada = crearVenta();
  const antes = JSON.stringify(entrada);
  assert.throws(() => aislado.agregarVenta(entrada), (error) => error === fallo);
  assert.equal(JSON.stringify(entrada), antes);
  assert.equal(storage.contenido["libreria.ventas"], crudo);
  assert.deepEqual(storage.escrituras, []);
  assert.equal(aislado.obtenerVentas().length, 1);
  storage.setItem = escribir;
  const guardada = aislado.agregarVenta(entrada);
  assert.equal(guardada.id, "ven-02");
  assert.equal(aislado.obtenerVentas().length, 2);
  assert.deepEqual(storage.escrituras, ["libreria.ventas"]);
});

test("una interfaz de almacenamiento incompleta no activa la reserva de ventas", () => {
  const aislado = cargarAlmacenEnNavegador({ localStorage: { getItem: () => null } });
  assert.throws(() => aislado.obtenerVentas(), /almacenamiento/);
  assert.throws(() => aislado.agregarVenta(crearVenta()), /almacenamiento/);
});
