(function (raiz) {
  "use strict";

  const texto = (typeof module !== "undefined" && module.exports)
    ? require("./texto.js")
    : raiz.Libreria.texto;

  function filtrarPorTitulo(libros, textoBuscado) {
    const buscado = texto.normalizarTexto(textoBuscado);
    return libros.filter(function (libro) {
      return texto.normalizarTexto(libro.titulo).includes(buscado);
    });
  }

  function resolverEditorial(editoriales, editorialId) {
    const editorial = editoriales.find(function (item) {
      return item.id === editorialId;
    });
    return editorial ? editorial.nombre : "";
  }

  function resolverGenero(generos, generoId) {
    if (generoId === null || generoId === undefined) {
      return "Sin clasificar";
    }
    const genero = generos.find(function (item) {
      return item.id === generoId;
    });
    return genero ? genero.nombre : "Sin clasificar";
  }

  function resolverAutores(autores, autorIds) {
    return autorIds
      .map(function (autorId) {
        const autor = autores.find(function (item) {
          return item.id === autorId;
        });
        return autor ? autor.nombre : "";
      })
      .filter(function (nombre) {
        return nombre !== "";
      })
      .join(", ");
  }

  function estadoDelListado(totalLibros, coincidencias) {
    if (totalLibros === 0) {
      return "vacio";
    }
    if (coincidencias === 0) {
      return "sin-resultados";
    }
    return "con-resultados";
  }

  const api = { filtrarPorTitulo, resolverEditorial, resolverGenero, resolverAutores, estadoDelListado };

  raiz.Libreria = raiz.Libreria || {};
  raiz.Libreria.catalogo = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
