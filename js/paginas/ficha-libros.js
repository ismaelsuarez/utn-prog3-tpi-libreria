/* Fichas de lectura del catálogo — JavaScript nativo.
  No modifica la lógica del catálogo ni los registros del Almacén.
   Funciona con tarjetas regeneradas al filtrar o registrar libros. */
(function () {
  "use strict";

  const listado = document.getElementById("lista-catalogo");
  const dialogo = document.getElementById("ficha-libro");
  if (!listado || !dialogo) return;

  // Sinopsis ILUSTRATIVAS (no proceden de las editoriales).
  const sinopsisMuestra = {
    "El faro de los vientos": "En una pequeña ciudad costera, las historias de quienes viven alrededor de un antiguo faro se entrelazan cuando un hallazgo inesperado despierta recuerdos que parecían olvidados. Una novela sobre los vínculos, la memoria y la posibilidad de empezar de nuevo.",
    "Cartas desde el sur": "Un intercambio de cartas une a personas separadas por la distancia. Entre recuerdos familiares y decisiones difíciles, cada mensaje revela una nueva mirada sobre el pasado.",
    "Mapas para perderse": "Un recorrido por los lugares que habitamos, los caminos que elegimos y las formas en que construimos nuestra identidad a partir de los viajes.",
    "La casa del río": "Una vieja casa junto al río guarda los recuerdos de distintas generaciones. Sus habitantes intentan entender qué significa pertenecer a un lugar.",
    "Breve historia del silencio": "Una reflexión sobre los momentos de silencio que atravesamos en la vida cotidiana, la literatura y las relaciones humanas.",
    "Los días contados": "Un personaje que vive pendiente del calendario comienza a reconsiderar sus prioridades cuando una noticia inesperada altera su rutina."
  };

  const nombresPortadas = {
    "El faro de los vientos": "Faro_Vientos.png",
    "Cartas desde el sur": "Cartas_Sur.png",
    "Mapas para perderse": "Mapas.png",
    "La casa del río": "Casa_Rio.png",
    "Breve historia del silencio": "Breve_Historia.png",
    "Los días contados": "Dias_Contados.png"
  };


  function escribir(id, valor) {
    document.getElementById(id).textContent = valor || "";
  }

  function textoEn(tarjeta, campo) {
    const elemento = tarjeta.querySelector('[data-campo="' + campo + '"]');
    return elemento ? elemento.textContent.trim() : "";
  }

  function generoClase(nombre) {
    const genero = nombre.toLocaleLowerCase("es").trim();
    if (genero === "novela") return "novela";
    if (genero === "ensayo") return "ensayo";
    return "sin-clasificar";
  }

  function buscarRegistro(titulo) {
    const lib = window.Libreria;
    if (!lib || !lib.almacen) return null;
    return lib.almacen.obtenerLibros().find(function (item) {
      return item.isbn === titulo || item.titulo === titulo;
    }) || null;
  }

  function prepararTarjeta(tarjeta) {
    const articulo = tarjeta.querySelector(".tarjeta") || tarjeta;
    if (!articulo || articulo.dataset.fichaPreparada === "si") return;
    articulo.dataset.fichaPreparada = "si";

    const titulo = textoEn(articulo, "titulo");
    const genero = textoEn(articulo, "genero");
    const tipo = generoClase(genero);
    const etiqueta = articulo.querySelector(".tarjeta__genero");
    const portada = articulo.querySelector(".tarjeta__portada");
    if (etiqueta) etiqueta.classList.add("tarjeta__genero--" + tipo);
    if (portada) portada.classList.add("tarjeta__portada--" + tipo);

    const fallback = articulo.querySelector(".tarjeta__portada-fallback span");
    if (fallback) fallback.textContent = titulo;

    // Portadas: las fotos son opcionales, nunca ocultamos la cubierta de respaldo.
    const img = articulo.querySelector(".tarjeta__imagen");
    const registro = buscarRegistro(textoEn(articulo, "isbn"));

    if (img) {
      const ruta = registro && (registro.imagen || registro.portada);
      const conocida = nombresPortadas[titulo];

      img.onload = function () {
        img.hidden = false;
      };

      if (conocida) {
        img.src = "img/Portadas/" + conocida;
      } else if (ruta) {
        img.src = ruta;
      }

      img.alt = "Portada del libro " + titulo;

      img.onerror = function () {
        img.hidden = true;
      };

      if (img.complete && !img.naturalWidth) {
        img.hidden = true;
      }
    }


    if (!articulo.querySelector(".ficha-abrir")) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "ficha-abrir";
      boton.textContent = "Ver sinopsis ↗";
      boton.setAttribute("aria-label", "Ver sinopsis de " + titulo);
      (articulo.querySelector(".tarjeta__contenido") || articulo).appendChild(boton);
    }
  }

  function sincronizarTarjetas() {
    listado.querySelectorAll(":scope > li").forEach(prepararTarjeta);
  }

  function abrirFicha(tarjeta) {
    const titulo = textoEn(tarjeta, "titulo");
    const autor = textoEn(tarjeta, "autores");
    const genero = textoEn(tarjeta, "genero") || "Sin clasificar";
    const editorial = textoEn(tarjeta, "editorial");
    const isbn = textoEn(tarjeta, "isbn");
    const precio = textoEn(tarjeta, "precio");
    const registro = buscarRegistro(isbn);
    const sinopsisReal = registro && (registro.sinopsis || registro.descripcion);
    const sinopsis = sinopsisReal || sinopsisMuestra[titulo] || "Este libro todavía no tiene una sinopsis cargada.";
    const deMuestra = !sinopsisReal && Boolean(sinopsisMuestra[titulo]);

    escribir("ficha-titulo", titulo);
    escribir("ficha-cubierta-titulo", titulo);
    escribir("ficha-cubierta-editorial", editorial);
    escribir("ficha-cubierta-autor", autor);
    escribir("ficha-autor", autor ? "por " + autor : "Autor no informado");
    escribir("ficha-genero", (genero === "Novela" ? "▣ " : genero === "Ensayo" ? "✎ " : "◇ ") + genero.toUpperCase());
    escribir("ficha-genero-texto", genero);
    escribir("ficha-editorial", editorial);
    escribir("ficha-isbn", isbn);
    escribir("ficha-precio", precio);
    escribir("ficha-sinopsis", sinopsis);
    document.getElementById("ficha-advertencia").hidden = !deMuestra;

    const etiqueta = document.getElementById("ficha-genero");
    etiqueta.className = "ficha-category ficha-category--" + generoClase(genero);
    const cubierta = document.getElementById("ficha-portada");
    cubierta.style.background = getComputedStyle(tarjeta.querySelector(".tarjeta__portada") || tarjeta).backgroundImage;
    const imagenOriginal = tarjeta.querySelector(".tarjeta__imagen");
    const imagenModal = document.getElementById("ficha-portada-imagen");
    const hayImagen = imagenOriginal && !imagenOriginal.hidden && imagenOriginal.complete && imagenOriginal.naturalWidth > 0;
    imagenModal.hidden = !hayImagen;
    if (hayImagen) imagenModal.src = imagenOriginal.src;
    else imagenModal.removeAttribute("src");
    document.getElementById("ficha-cubierta-hint").textContent = hayImagen ? "Portada del libro" : "Cubierta ilustrativa de ejemplo";

    // Nunca abrir la ficha al cargar o volver a index.html: solo en click.
    if (!dialogo.open) dialogo.showModal();
  }
  // Solo se abre a pedido del usuario, nunca al entrar ni volver al catálogo.
  // Delegación: el botón también funciona en tarjetas creadas tras una búsqueda.
  listado.addEventListener("click", function (evento) {
    const boton = evento.target.closest(".ficha-abrir");
    if (!boton || !listado.contains(boton)) return;
    const tarjeta = boton.closest(".tarjeta");
    if (!tarjeta) return;
    abrirFicha(tarjeta);
  });

  const cerrar = function () { if (dialogo.open) dialogo.close(); };
  document.getElementById("cerrar-ficha").addEventListener("click", cerrar);
  document.getElementById("volver-catalogo").addEventListener("click", cerrar);
  dialogo.addEventListener("click", function (evento) {
    if (evento.target === dialogo) cerrar();
  });

  // Observar solamente inserciones/borrados directos: evita ciclos por el propio botón.
  new MutationObserver(sincronizarTarjetas).observe(listado, { childList: true });
  sincronizarTarjetas();
})();
