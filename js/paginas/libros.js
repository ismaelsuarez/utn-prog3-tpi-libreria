// Genera los selectores, las casillas de autores y el listado de libros desde
// el Almacén, y registra altas válidas sin recargar la página.
// Reemplaza al script de maqueta del change estructura-y-pantallas-html (C-01).
(function () {
  "use strict";

  window.Libreria.almacen.inicializar();
  const almacen = window.Libreria.almacen;
  const interfaz = window.Libreria.interfaz;
  const catalogo = window.Libreria.catalogo;
  const logica = window.Libreria.libros;

  const formulario = document.getElementById("form-libro");
  const campoTitulo = document.getElementById("libro-titulo");
  const campoIsbn = document.getElementById("libro-isbn");
  const campoPrecio = document.getElementById("libro-precio");
  const campoEditorial = document.getElementById("libro-editorial");
  const campoGenero = document.getElementById("libro-genero");
  const grupoAutores = document.getElementById("libro-autores");
  const mensajeError = document.getElementById("mensaje-error");
  const mensajeEstado = document.getElementById("mensaje-estado");
  const cuerpoFilas = document.getElementById("filas-libros");
  const mensajeVacio = document.getElementById("libros-vacio");
  const tabla = document.getElementById("tabla-libros");
  const plantillaFila = document.getElementById("plantilla-fila-libro");
  const plantillaAutor = document.getElementById("plantilla-opcion-autor");

  // Cada clave mapea 1:1 con su slot #error-libro-<campo> del HTML.
  const CAMPOS = ["titulo", "isbn", "precio", "editorial", "genero", "autores"];

  function controlDe(campo) {
    if (campo === "autores") {
      return grupoAutores.querySelector("input");
    }
    return document.getElementById("libro-" + campo);
  }

  function slotDe(campo) {
    return document.getElementById("error-libro-" + campo);
  }

  function generarOpciones(select, primerTexto, registros) {
    interfaz.vaciarNodo(select);

    const primera = document.createElement("option");
    primera.value = "";
    primera.textContent = primerTexto;
    select.appendChild(primera);

    registros.forEach(function (registro) {
      const opcion = document.createElement("option");
      opcion.value = registro.id;
      opcion.textContent = registro.nombre;
      select.appendChild(opcion);
    });
  }

  function generarCasillasDeAutores(autores) {
    // Se conserva el <legend> del fieldset.
    Array.from(grupoAutores.children).forEach(function (hijo) {
      if (hijo.tagName !== "LEGEND") {
        grupoAutores.removeChild(hijo);
      }
    });

    autores.forEach(function (autor) {
      const casilla = plantillaAutor.content.firstElementChild.cloneNode(true);
      casilla.querySelector("input").value = autor.id;
      casilla.querySelector('[data-campo="nombre"]').textContent = autor.nombre;
      grupoAutores.appendChild(casilla);
    });
  }

  function pintarLibro(libro, editoriales, generos, autores) {
    const fila = plantillaFila.content.firstElementChild.cloneNode(true);
    fila.querySelector('[data-campo="titulo"]').textContent = libro.titulo;
    fila.querySelector('[data-campo="isbn"]').textContent = libro.isbn;
    fila.querySelector('[data-campo="editorial"]').textContent =
      catalogo.resolverEditorial(editoriales, libro.editorialId);
    fila.querySelector('[data-campo="genero"]').textContent =
      catalogo.resolverGenero(generos, libro.generoId);
    fila.querySelector('[data-campo="autores"]').textContent =
      catalogo.resolverAutores(autores, libro.autorIds);
    fila.querySelector('[data-campo="precio"]').textContent =
      interfaz.formatearImporte(libro.precio);
    cuerpoFilas.appendChild(fila);
  }

  function renderizarListado() {
    const libros = almacen.obtenerLibros();
    const editoriales = almacen.obtenerEditoriales();
    const generos = almacen.obtenerGeneros();
    const autores = almacen.obtenerAutores();

    interfaz.vaciarNodo(cuerpoFilas);
    libros.forEach(function (libro) {
      pintarLibro(libro, editoriales, generos, autores);
    });

    const vacio = libros.length === 0;
    tabla.hidden = vacio;
    mensajeVacio.hidden = !vacio;
  }

  function leerDatosDelFormulario() {
    const marcadas = Array.from(grupoAutores.querySelectorAll('input[name="autores"]:checked'));
    return {
      titulo: campoTitulo.value,
      isbn: campoIsbn.value,
      precio: campoPrecio.value,
      editorialId: campoEditorial.value,
      generoId: campoGenero.value,
      autorIds: marcadas.map(function (casilla) {
        return casilla.value;
      })
    };
  }

  function limpiarErrores() {
    CAMPOS.forEach(function (campo) {
      const slot = slotDe(campo);
      if (slot) {
        slot.textContent = "";
      }
      const control = controlDe(campo);
      if (control) {
        control.removeAttribute("aria-invalid");
      }
    });
    interfaz.ocultarMensaje(mensajeError);
    interfaz.ocultarMensaje(mensajeEstado);
  }

  function mostrarErrores(errores) {
    errores.forEach(function (error) {
      const slot = slotDe(error.campo);
      if (slot) {
        interfaz.mostrarMensaje(slot, error.mensaje);
      }
      const control = controlDe(error.campo);
      if (control) {
        control.setAttribute("aria-invalid", "true");
      }
    });

    interfaz.mostrarMensaje(mensajeError, "Revisa los campos marcados: no se registró el libro.");

    const primero = controlDe(errores[0].campo);
    if (primero) {
      primero.focus();
    }
  }

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores();

    // Se relee el almacén en cada envío para detectar duplicados de la sesión.
    const datos = leerDatosDelFormulario();
    const errores = logica.validarLibro(datos, almacen.obtenerLibros(), {
      editoriales: almacen.obtenerEditoriales(),
      generos: almacen.obtenerGeneros(),
      autores: almacen.obtenerAutores()
    });

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    almacen.agregarLibro({
      titulo: datos.titulo.trim(),
      isbn: datos.isbn.trim(),
      precio: Number(datos.precio),
      editorialId: datos.editorialId,
      generoId: datos.generoId || null,
      autorIds: datos.autorIds.slice()
    });

    renderizarListado();
    formulario.reset();
    interfaz.mostrarMensaje(mensajeEstado, "Libro registrado correctamente.");
  });

  generarOpciones(campoEditorial, "Elegir una editorial", almacen.obtenerEditoriales());
  generarOpciones(campoGenero, "Sin clasificar", almacen.obtenerGeneros());
  generarCasillasDeAutores(almacen.obtenerAutores());
  renderizarListado();
})();
