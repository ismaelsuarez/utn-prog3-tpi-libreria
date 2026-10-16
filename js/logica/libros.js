(function (raiz) {
  "use strict";

  // Lógica pura del alta de libros (RN-LI-01 a RN-LI-11).
  // No toca el DOM ni el almacenamiento del navegador (reglas 6 y 7):
  // se prueba con node --test.
  // Recibe los catálogos como datos para no acoplarse al Almacén ni a la vista.

  const texto = (typeof module !== "undefined" && module.exports)
    ? require("./texto.js")
    : raiz.Libreria.texto;

  function aCadena(valor) {
    return valor === null || valor === undefined ? "" : String(valor);
  }

  function validarLibro(datos, libros, catalogos) {
    const errores = [];
    const registro = datos || {};
    const conjuntoLibros = Array.isArray(libros) ? libros : [];
    const material = catalogos || {};
    const editoriales = Array.isArray(material.editoriales) ? material.editoriales : [];
    const generos = Array.isArray(material.generos) ? material.generos : [];
    const autores = Array.isArray(material.autores) ? material.autores : [];

    // RN-LI-09: el género es opcional; vacío o ausente se guarda como null.
    if (aCadena(registro.generoId).trim() === "") {
      registro.generoId = null;
    }

    // RN-LI-01
    if (aCadena(registro.titulo).trim() === "") {
      errores.push({ campo: "titulo", mensaje: "El título es obligatorio." });
    }

    // RN-LI-02, RN-LI-03 y RN-LI-04: se comparan los ISBN sin separadores y
    // sin validar el dígito de control.
    const isbn = texto.normalizarIsbn(aCadena(registro.isbn));
    if (isbn === "") {
      errores.push({ campo: "isbn", mensaje: "El ISBN es obligatorio." });
    } else if (
      conjuntoLibros.some(function (libro) {
        return texto.normalizarIsbn(aCadena(libro.isbn)) === isbn;
      })
    ) {
      errores.push({ campo: "isbn", mensaje: "Ese ISBN ya está registrado." });
    }

    // RN-LI-05
    const precioTexto = aCadena(registro.precio).trim();
    const precio = precioTexto === "" ? NaN : Number(precioTexto);
    if (Number.isNaN(precio)) {
      errores.push({ campo: "precio", mensaje: "El precio debe ser un valor numérico." });
    } else if (precio <= 0) {
      errores.push({ campo: "precio", mensaje: "El precio debe ser mayor que cero." });
    }

    // RN-LI-06
    const editorialId = aCadena(registro.editorialId).trim();
    if (editorialId === "") {
      errores.push({ campo: "editorial", mensaje: "Debes elegir una editorial." });
    } else if (
      !editoriales.some(function (editorial) {
        return editorial.id === editorialId;
      })
    ) {
      errores.push({ campo: "editorial", mensaje: "La editorial elegida no existe en los datos." });
    }

    // RN-LI-07 y RN-LI-08: un solo error para todo el grupo.
    const autorIds = Array.isArray(registro.autorIds) ? registro.autorIds : [];
    if (autorIds.length === 0) {
      errores.push({ campo: "autores", mensaje: "Debes seleccionar al menos un autor." });
    } else if (
      autorIds.some(function (autorId) {
        return !autores.some(function (autor) {
          return autor.id === autorId;
        });
      })
    ) {
      errores.push({ campo: "autores", mensaje: "Hay autores que no existen en los datos." });
    }

    // RN-LI-09: solo se valida el género si vino asignado.
    const generoId = registro.generoId;
    if (
      generoId !== null &&
      generoId !== undefined &&
      !generos.some(function (genero) {
        return genero.id === generoId;
      })
    ) {
      errores.push({ campo: "genero", mensaje: "El género elegido no existe en los datos." });
    }

    return errores;
  }

  const api = { validarLibro };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.libros = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
