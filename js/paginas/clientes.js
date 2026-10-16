// Genera el listado de clientes desde el Almacén y registra altas válidas
// sin recargar la página.
// Reemplaza al script de maqueta del change estructura-y-pantallas-html (C-01).
(function () {
  "use strict";

  const almacen = window.Libreria.almacen;
  const interfaz = window.Libreria.interfaz;
  const texto = window.Libreria.texto;
  const logica = window.Libreria.clientes;

  const formulario = document.getElementById("form-cliente");
  const campoNombre = document.getElementById("cliente-nombre");
  const campoEmail = document.getElementById("cliente-email");
  const mensajeError = document.getElementById("mensaje-error");
  const mensajeEstado = document.getElementById("mensaje-estado");
  const cuerpoFilas = document.getElementById("filas-clientes");
  const mensajeVacio = document.getElementById("clientes-vacio");
  const tabla = document.getElementById("tabla-clientes");
  const plantillaFila = document.getElementById("plantilla-fila-cliente");

  // Cada clave mapea 1:1 con su slot #error-cliente-<campo> del HTML.
  const CAMPOS = ["nombre", "email"];

  function controlDe(campo) {
    return document.getElementById("cliente-" + campo);
  }

  function slotDe(campo) {
    return document.getElementById("error-cliente-" + campo);
  }

  function pintarCliente(cliente) {
    const fila = plantillaFila.content.firstElementChild.cloneNode(true);
    fila.querySelector('[data-campo="nombre"]').textContent = cliente.nombreCompleto;
    fila.querySelector('[data-campo="email"]').textContent = cliente.email;
    cuerpoFilas.appendChild(fila);
  }

  function renderizarListado() {
    const clientes = almacen.obtenerClientes();

    interfaz.vaciarNodo(cuerpoFilas);
    clientes.forEach(function (cliente) {
      pintarCliente(cliente);
    });

    const vacio = clientes.length === 0;
    tabla.hidden = vacio;
    mensajeVacio.hidden = !vacio;
  }

  function leerDatosDelFormulario() {
    return {
      nombreCompleto: campoNombre.value,
      email: campoEmail.value
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

    interfaz.mostrarMensaje(mensajeError, "Revisa los campos marcados: no se registró el cliente.");

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
    const errores = logica.validarCliente(datos, almacen.obtenerClientes());

    if (errores.length > 0) {
      mostrarErrores(errores);
      return;
    }

    almacen.agregarCliente({
      nombreCompleto: datos.nombreCompleto.trim(),
      email: texto.normalizarEmail(datos.email)
    });

    renderizarListado();
    formulario.reset();
    interfaz.mostrarMensaje(mensajeEstado, "Cliente registrado correctamente.");
  });

  renderizarListado();
})();
