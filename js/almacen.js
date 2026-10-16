(function (raiz) {
  "use strict";

  // Escritura:
  //   agregarLibro(libro)    - registra un libro (C-04, alta-de-libros-y-clientes).
  //   agregarCliente(cliente)- registra un cliente (C-04, alta-de-libros-y-clientes).
  //   agregarVenta(venta)    - registra una venta confirmada. Se implementa en C-05 (venta-simulada-e-historial).

  const datos = (typeof module !== "undefined" && module.exports)
    ? require("./datos/datos-iniciales.js")
    : raiz.Libreria.datos;

  const CLAVE_LIBROS = "libreria.libros";
  const CLAVE_CLIENTES = "libreria.clientes";

  // Punto de inyección del storage: toda lectura y escritura pasan por
  // obtenerStorage(). Cuando no hay storage disponible (Node en las pruebas)
  // el almacén opera en memoria sobre esta reserva.
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
      return [];
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
    agregarVenta: function () {
      throw new Error("agregarVenta: pendiente de implementación (C-05 venta-simulada-e-historial)");
    }
  };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.almacen = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
