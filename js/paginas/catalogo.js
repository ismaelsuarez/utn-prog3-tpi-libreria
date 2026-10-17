// Genera las tarjetas del Catálogo desde el Almacén y filtra por título.
// Reemplaza al script de maqueta del change estructura-y-pantallas-html (C-01).
(function () {
  "use strict";

  window.Libreria.almacen.inicializar();
  const almacen = window.Libreria.almacen;
  const interfaz = window.Libreria.interfaz;
  const logica = window.Libreria.catalogo;

  const formulario = document.getElementById("form-busqueda");
  const campoBusqueda = document.getElementById("busqueda-titulo");
  const lista = document.getElementById("lista-catalogo");
  const mensajeVacio = document.getElementById("catalogo-vacio");
  const mensajeSinResultados = document.getElementById("catalogo-sin-resultados");
  const plantilla = document.getElementById("plantilla-tarjeta-libro");

  const libros = almacen.obtenerLibros();
  const editoriales = almacen.obtenerEditoriales();
  const generos = almacen.obtenerGeneros();
  const autores = almacen.obtenerAutores();

  function pintarLibro(libro) {
    const tarjeta = plantilla.content.firstElementChild.cloneNode(true);
    tarjeta.querySelector('[data-campo="titulo"]').textContent = libro.titulo;
    tarjeta.querySelector('[data-campo="isbn"]').textContent = libro.isbn;
    tarjeta.querySelector('[data-campo="editorial"]').textContent =
      logica.resolverEditorial(editoriales, libro.editorialId);
    tarjeta.querySelector('[data-campo="genero"]').textContent =
      logica.resolverGenero(generos, libro.generoId);
    tarjeta.querySelector('[data-campo="autores"]').textContent =
      logica.resolverAutores(autores, libro.autorIds);
    tarjeta.querySelector('[data-campo="precio"]').textContent =
      interfaz.formatearImporte(libro.precio);
    lista.appendChild(tarjeta);
  }

  function actualizar() {
    const coincidencias = logica.filtrarPorTitulo(libros, campoBusqueda.value);

    interfaz.vaciarNodo(lista);
    coincidencias.forEach(pintarLibro);

    const estado = logica.estadoDelListado(libros.length, coincidencias.length);
    lista.hidden = estado !== "con-resultados";
    mensajeVacio.hidden = estado !== "vacio";
    mensajeSinResultados.hidden = estado !== "sin-resultados";
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    actualizar();
  });

  campoBusqueda.addEventListener("input", actualizar);

  actualizar();
})();
