(function (raiz) {
  "use strict";

  // Escritura:
  //   agregarLibro(libro)    - registra un libro (C-04, alta-de-libros-y-clientes).
  //   agregarCliente(cliente)- registra un cliente (C-04, alta-de-libros-y-clientes).
  //   agregarVenta(venta)    - recibe una instantánea validada, asigna ven-XX y
  //                            devuelve una copia independiente de lo guardado.
  // Las ventas no validan reglas de negocio ni normalizan importes. Los fallos
  // de almacenamiento se propagan; solo Node sin storage usa memoria. La UI
  // debe conservar el borrador hasta que agregarVenta termine correctamente.

  const datos = (typeof module !== "undefined" && module.exports)
    ? require("./datos/datos-iniciales.js")
    : raiz.Libreria.datos;

  const CLAVE_LIBROS = "libreria.libros";
  const CLAVE_CLIENTES = "libreria.clientes";
  const CLAVE_VENTAS = "libreria.ventas";

  // Punto de inyección del storage: toda lectura y escritura pasan por
  // obtenerStorage() para libros/clientes y obtenerStorageVentas() para ventas.
  // Cuando no hay storage en Node, el almacén usa esta reserva en memoria.
  const memoria = {};

  function obtenerStorage() {
    try {
      const storage = raiz.localStorage;
      if (storage && typeof storage.getItem === "function" && typeof storage.setItem === "function") {
        return storage;
      }
    } catch (error) {
      // Acceso bloqueado por el navegador: se usa la reserva en memoria.
    }
    return null;
  }

  function copiarLibro(libro) {
    return Object.assign({}, libro, { autorIds: libro.autorIds.slice() });
  }

  function copiarRegistro(registro) {
    return Object.assign({}, registro);
  }

  function esObjeto(valor) {
    return valor !== null && typeof valor === "object" && !Array.isArray(valor);
  }

  function copiarVenta(venta) {
    // Solo comprueba la estructura necesaria para copiar; no reglas de negocio.
    if (!esObjeto(venta) || !esObjeto(venta.cliente) ||
        !Array.isArray(venta.renglones) || !venta.renglones.every(esObjeto)) {
      throw new Error("La venta no tiene una estructura válida.");
    }
    return Object.assign({}, venta, {
      cliente: copiarRegistro(venta.cliente),
      renglones: venta.renglones.map(copiarRegistro)
    });
  }

  function obtenerStorageVentas() {
    // En navegador no se anuncia persistencia cuando el acceso está bloqueado.
    const storage = raiz.localStorage;
    if (storage && typeof storage.getItem === "function" && typeof storage.setItem === "function") {
      return storage;
    }
    if (typeof window !== "undefined" || (storage !== null && storage !== undefined)) {
      throw new Error("El almacenamiento de ventas no está disponible.");
    }
    return null;
  }

  // A diferencia de libros/clientes, las ventas ilegibles no se reemplazan.
  function leerVentas(storage) {
    if (!storage) {
      return (memoria[CLAVE_VENTAS] || []).map(copiarVenta);
    }
    const crudo = storage.getItem(CLAVE_VENTAS);
    if (crudo === null || crudo === undefined) {
      return [];
    }
    const lista = JSON.parse(crudo);
    if (!Array.isArray(lista)) {
      throw new Error("Las ventas guardadas no contienen una lista válida.");
    }
    return lista.map(copiarVenta);
  }

  // Lee la clave guardada; si falta, no es un arreglo JSON válido o no hay
  // storage, devuelve los ejemplos. Nunca escribe: la lectura no siembra.
  function leerLista(clave, ejemplos, copia) {
    const storage = obtenerStorage();
    if (storage) {
      const crudo = storage.getItem(clave);
      if (crudo !== null && crudo !== undefined) {
        try {
          const parseado = JSON.parse(crudo);
          if (Array.isArray(parseado)) {
            return parseado.map(copia);
          }
        } catch (error) {
          // Contenido ilegible: carga provisoria (PA-04); no se sobrescribe.
        }
      }
      return ejemplos.map(copia);
    }
    if (Object.prototype.hasOwnProperty.call(memoria, clave)) {
      return memoria[clave].map(copia);
    }
    return ejemplos.map(copia);
  }

  // Escribe la lista completa en la clave correspondiente.
  function escribirLista(clave, lista) {
    const storage = obtenerStorage();
    if (storage) {
      storage.setItem(clave, JSON.stringify(lista));
      return;
    }
    memoria[clave] = lista;
  }

  // Esquema D1: prefijo + contador de al menos dos dígitos (lib-07, cli-04).
  function siguienteId(lista, prefijo) {
    let maximo = 0;
    lista.forEach(function (registro) {
      if (registro && typeof registro.id === "string" && registro.id.indexOf(prefijo + "-") === 0) {
        const numero = Number(registro.id.slice(prefijo.length + 1));
        if (Number.isInteger(numero) && numero > maximo) {
          maximo = numero;
        }
      }
    });
    return prefijo + "-" + String(maximo + 1).padStart(2, "0");
  }

  const api = {
    obtenerLibros: function () {
      return leerLista(CLAVE_LIBROS, datos.libros, copiarLibro);
    },
    obtenerClientes: function () {
      return leerLista(CLAVE_CLIENTES, datos.clientes, copiarRegistro);
    },
    obtenerVentas: function () {
      return leerVentas(obtenerStorageVentas());
    },
    obtenerEditoriales: function () {
      return datos.editoriales.map(copiarRegistro);
    },
    obtenerGeneros: function () {
      return datos.generos.map(copiarRegistro);
    },
    obtenerAutores: function () {
      return datos.autores.map(copiarRegistro);
    },
    agregarLibro: function (libro) {
      // El Almacén no valida ni normaliza: eso le corresponde al formulario.
      const entrada = libro || {};
      const lista = leerLista(CLAVE_LIBROS, datos.libros, copiarLibro);
      const registro = Object.assign({}, entrada, {
        id: siguienteId(lista, "lib"),
        autorIds: Array.isArray(entrada.autorIds) ? entrada.autorIds.slice() : []
      });
      escribirLista(CLAVE_LIBROS, lista.concat([registro]));
      return copiarLibro(registro);
    },
    agregarCliente: function (cliente) {
      const entrada = cliente || {};
      const lista = leerLista(CLAVE_CLIENTES, datos.clientes, copiarRegistro);
      const registro = Object.assign({}, entrada, {
        id: siguienteId(lista, "cli")
      });
      escribirLista(CLAVE_CLIENTES, lista.concat([registro]));
      return copiarRegistro(registro);
    },
    agregarVenta: function (venta) {
      const storage = obtenerStorageVentas();
      const lista = leerVentas(storage);
      const registro = Object.assign(copiarVenta(venta), { id: siguienteId(lista, "ven") });
      const actualizada = lista.concat([registro]);
      if (storage) {
        storage.setItem(CLAVE_VENTAS, JSON.stringify(actualizada));
      } else {
        memoria[CLAVE_VENTAS] = actualizada;
      }
      return copiarVenta(registro);
    }
  };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.almacen = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
