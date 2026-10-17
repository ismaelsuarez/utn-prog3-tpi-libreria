// Registro y edición de clientes sin perder los IDs ni el historial de ventas.
(function () {
  "use strict";

  window.Libreria.almacen.inicializar();
  const almacen = window.Libreria.almacen;
  const interfaz = window.Libreria.interfaz;
  const texto = window.Libreria.texto;
  const logica = window.Libreria.clientes;

  const formulario = document.getElementById("form-cliente");
  const mensajeError = document.getElementById("mensaje-error");
  const mensajeEstado = document.getElementById("mensaje-estado");
  const cuerpoFilas = document.getElementById("filas-clientes");
  const mensajeVacio = document.getElementById("clientes-vacio");
  const tabla = document.getElementById("tabla-clientes");
  const plantillaFila = document.getElementById("plantilla-fila-cliente");

  const dialogo = document.getElementById("dialogo-editar-cliente");
  const formularioEdicion = document.getElementById("form-editar-cliente");
  const errorEdicion = document.getElementById("mensaje-error-edicion");
  const CAMPOS = ["nombre", "email", "telefono"];
  let clienteEnEdicion = null;

  // Evita duplicar validaciones entre el formulario de alta y el modal.
  function controlDe(campo, edicion) {
    return document.getElementById((edicion ? "editar-cliente-" : "cliente-") + campo);
  }

  function slotDe(campo, edicion) {
    return document.getElementById((edicion ? "error-editar-cliente-" : "error-cliente-") + campo);
  }

  function pintarCliente(cliente) {
    const fila = plantillaFila.content.firstElementChild.cloneNode(true);
    fila.dataset.clienteId = cliente.id;
    fila.querySelector('[data-campo="nombre"]').textContent = cliente.nombreCompleto;
    fila.querySelector('[data-campo="email"]').textContent = cliente.email;
    fila.querySelector('[data-campo="telefono"]').textContent = cliente.telefono || "—";
    const boton = fila.querySelector('[data-accion="editar-cliente"]');
    boton.dataset.clienteId = cliente.id;
    boton.setAttribute("aria-label", "Editar datos de " + cliente.nombreCompleto);
    cuerpoFilas.appendChild(fila);
  }

  function renderizarListado() {
    const clientes = almacen.obtenerClientes();
    interfaz.vaciarNodo(cuerpoFilas);
    clientes.forEach(pintarCliente);
    const vacio = clientes.length === 0;
    tabla.hidden = vacio;
    mensajeVacio.hidden = !vacio;
  }

  function leerDatos(edicion) {
    return {
      nombreCompleto: controlDe("nombre", edicion).value,
      email: controlDe("email", edicion).value,
      telefono: controlDe("telefono", edicion).value
    };
  }

  function normalizarDatos(datos) {
    return {
      nombreCompleto: datos.nombreCompleto.trim(),
      email: texto.normalizarEmail(datos.email),
      telefono: datos.telefono.trim().replace(/\s+/g, " ")
    };
  }

  function limpiarErrores(edicion) {
    CAMPOS.forEach(function (campo) {
      slotDe(campo, edicion).textContent = "";
      controlDe(campo, edicion).removeAttribute("aria-invalid");
    });
    interfaz.ocultarMensaje(edicion ? errorEdicion : mensajeError);
    if (!edicion) interfaz.ocultarMensaje(mensajeEstado);
  }

  function mostrarErrores(errores, edicion) {
    errores.forEach(function (error) {
      const slot = slotDe(error.campo, edicion);
      const control = controlDe(error.campo, edicion);
      if (slot) interfaz.mostrarMensaje(slot, error.mensaje);
      if (control) control.setAttribute("aria-invalid", "true");
    });
    interfaz.mostrarMensaje(edicion ? errorEdicion : mensajeError,
      "Revisá los campos marcados. No se " + (edicion ? "guardaron los cambios." : "registró el cliente."));
    const primero = controlDe(errores[0].campo, edicion);
    if (primero) primero.focus();
  }

  // Alta: se mantiene independiente de la edición.
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores(false);
    try {
      const datos = leerDatos(false);
      const errores = logica.validarCliente(datos, almacen.obtenerClientes());
      if (errores.length) return mostrarErrores(errores, false);
      almacen.agregarCliente(normalizarDatos(datos));
      renderizarListado();
      formulario.reset();
      interfaz.mostrarMensaje(mensajeEstado, "Cliente registrado correctamente.");
    } catch (error) {
      interfaz.mostrarMensaje(mensajeError, "No se pudo guardar el cliente. Comprobá el almacenamiento e intentá nuevamente.");
    }
  });

  function abrirEdicion(id) {
    try {
      const cliente = almacen.obtenerClientes().find(function (registro) {
        return registro.id === id;
      });
      if (!cliente) {
        interfaz.mostrarMensaje(mensajeError, "No se encontró ese cliente. Actualizá la página e intentá nuevamente.");
        return;
      }
      clienteEnEdicion = id;
      limpiarErrores(true);
      controlDe("nombre", true).value = cliente.nombreCompleto || "";
      controlDe("email", true).value = cliente.email || "";
      controlDe("telefono", true).value = cliente.telefono || "";
      if (!dialogo.open) dialogo.showModal();
      controlDe("nombre", true).focus();
    } catch (error) {
      clienteEnEdicion = null;
      interfaz.mostrarMensaje(mensajeError, "No se pudo abrir la edición. Intentá nuevamente.");
    }
  }

  cuerpoFilas.addEventListener("click", function (evento) {
    const boton = evento.target.closest('[data-accion="editar-cliente"]');
    if (!boton) return;
    interfaz.ocultarMensaje(mensajeError);
    interfaz.ocultarMensaje(mensajeEstado);
    abrirEdicion(boton.dataset.clienteId);
  });

  function cerrarEdicion() {
    if (dialogo.open) dialogo.close();
  }

  document.getElementById("cancelar-edicion-cliente").addEventListener("click", cerrarEdicion);
  document.getElementById("cerrar-edicion-cliente").addEventListener("click", cerrarEdicion);
  dialogo.addEventListener("click", function (evento) {
    if (evento.target === dialogo) cerrarEdicion();
  });
  dialogo.addEventListener("close", function () {
    clienteEnEdicion = null;
    limpiarErrores(true);
  });

  formularioEdicion.addEventListener("submit", function (evento) {
    evento.preventDefault();
    limpiarErrores(true);
    if (!clienteEnEdicion) return;
    try {
      const datos = leerDatos(true);
      // Al editar, el correo actual no se considera un duplicado propio.
      const errores = logica.validarCliente(datos, almacen.obtenerClientes(), clienteEnEdicion);
      if (errores.length) return mostrarErrores(errores, true);
      const idActualizado = clienteEnEdicion;
      almacen.actualizarCliente(idActualizado, normalizarDatos(datos));
      renderizarListado();
      cerrarEdicion();
      interfaz.mostrarMensaje(mensajeEstado, "Los datos del cliente se actualizaron correctamente.");
      const botonActualizado = Array.from(cuerpoFilas.querySelectorAll('[data-accion="editar-cliente"]'))
        .find(function (boton) { return boton.dataset.clienteId === idActualizado; });
      if (botonActualizado) botonActualizado.focus();
    } catch (error) {
      interfaz.mostrarMensaje(errorEdicion,
        "No se pudieron guardar los cambios. Verificá el almacenamiento e intentá nuevamente.");
    }
  });

  try {
    renderizarListado();
  } catch (error) {
    interfaz.mostrarMensaje(mensajeError, "No se pudo cargar el directorio de clientes.");
  }
})();
