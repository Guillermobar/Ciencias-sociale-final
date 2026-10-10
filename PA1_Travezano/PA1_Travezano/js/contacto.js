(() => {
  const form = document.getElementById('form-contacto');
  if (!form) {
    return;
  }

  const resumen = document.getElementById('resumen');
  const enviar = document.getElementById('enviar');
  const spinner = enviar.querySelector('.spinner-border');
  const textoEnviar = enviar.querySelector('.enviar-texto');
  const mensaje = document.getElementById('mensaje');
  const contador = document.getElementById('mensaje-contador');

  const soloLetras = /^[\p{L}][\p{L}\s'’-]+$/u;

  const reglas = {
    nombres: (el) => {
      const v = el.value.trim();
      if (!v) {
        return 'Falta tu nombre. Escríbelo para continuar.';
      }
      if (!soloLetras.test(v)) {
        return 'Escribe solo letras y espacios, mínimo 2 letras.';
      }
      return '';
    },
    apellidos: (el) => {
      const v = el.value.trim();
      if (!v) {
        return 'Faltan tus apellidos. Escríbelos para continuar.';
      }
      if (!soloLetras.test(v)) {
        return 'Escribe solo letras y espacios, mínimo 2 letras.';
      }
      return '';
    },
    correo: (el) => {
      const v = el.value.trim();
      if (!v) {
        return 'Falta tu correo electrónico.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return 'Ese correo no parece válido. Usa el formato nombre@dominio.com.';
      }
      return '';
    },
    celular: (el) => {
      const v = el.value.replace(/\s/g, '');
      if (!v) {
        return 'Falta tu número de celular.';
      }
      if (!/^9\d{8}$/.test(v)) {
        return 'El celular debe tener 9 dígitos y empezar con 9. Ejemplo: 987654321.';
      }
      return '';
    },
    interes: (el) => (el.value ? '' : 'Selecciona un tema para dirigir tu consulta.'),
    mensaje: (el) => {
      const largo = el.value.trim().length;
      if (largo === 0) {
        return 'Falta tu mensaje. Cuéntanos qué necesitas.';
      }
      if (largo < 10) {
        return `Tu mensaje tiene ${largo} caracteres. Necesitamos al menos 10 para poder ayudarte.`;
      }
      return '';
    },
    acepto: (el) => (el.checked ? '' : 'Marca esta casilla para que podamos contestarte.')
  };

  const campos = Array.from(form.querySelectorAll('[name]'));

  const etiquetaDe = (el) => {
    if (el.dataset.label) {
      return el.dataset.label;
    }
    const etiqueta = form.querySelector(`label[for="${el.id}"]`);
    return etiqueta ? etiqueta.textContent.trim() : el.name;
  };

  const mostrar = (el, error) => {
    const aviso = document.getElementById(`${el.id}-error`);
    const esCasilla = el.type === 'checkbox';
    aviso.textContent = error;
    el.classList.toggle('is-invalid', Boolean(error));
    el.classList.toggle('is-valid', !error && !esCasilla);
    el.setAttribute('aria-invalid', error ? 'true' : 'false');
  };

  const validar = (el) => {
    const error = reglas[el.name](el);
    mostrar(el, error);
    return error;
  };

  const actualizarContador = () => {
    contador.textContent = `${mensaje.value.length} de 400 caracteres`;
  };

  const ocultarResumen = () => {
    resumen.hidden = true;
    resumen.replaceChildren();
  };

  const mostrarResumen = (errores) => {
    const titulo = document.createElement('h2');
    titulo.textContent = errores.length === 1
      ? 'Hay 1 campo por corregir'
      : `Hay ${errores.length} campos por corregir`;

    const lista = document.createElement('ul');
    errores.forEach(({ el, error }) => {
      const item = document.createElement('li');
      const enlace = document.createElement('a');
      enlace.href = `#${el.id}`;
      enlace.textContent = `${etiquetaDe(el)}: ${error}`;
      enlace.addEventListener('click', (e) => {
        e.preventDefault();
        el.focus();
      });
      item.appendChild(enlace);
      lista.appendChild(item);
    });

    resumen.replaceChildren(titulo, lista);
    resumen.hidden = false;
    resumen.focus();
  };

  const limpiarEstado = () => {
    campos.forEach((el) => {
      el.classList.remove('is-invalid', 'is-valid');
      el.removeAttribute('aria-invalid');
      document.getElementById(`${el.id}-error`).textContent = '';
    });
    ocultarResumen();
  };

  campos.forEach((el) => {
    el.addEventListener('blur', () => {
      if (el.type === 'checkbox' || el.value !== '' || el.classList.contains('is-invalid')) {
        validar(el);
      }
    });

    const evento = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(evento, () => {
      if (el.name === 'celular') {
        el.value = el.value.replace(/[^\d\s]/g, '');
      }
      if (el.classList.contains('is-invalid')) {
        validar(el);
      }
    });
  });

  mensaje.addEventListener('input', actualizarContador);

  form.addEventListener('reset', () => {
    limpiarEstado();
    setTimeout(actualizarContador, 0);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const errores = [];
    campos.forEach((el) => {
      const error = validar(el);
      if (error) {
        errores.push({ el, error });
      }
    });

    if (errores.length) {
      mostrarResumen(errores);
      return;
    }

    ocultarResumen();
    enviar.disabled = true;
    enviar.setAttribute('aria-busy', 'true');
    spinner.hidden = false;
    textoEnviar.textContent = 'Enviando…';

    const nombre = form.elements.nombres.value.trim();
    const correo = form.elements.correo.value.trim();

    setTimeout(() => {
      enviar.disabled = false;
      enviar.removeAttribute('aria-busy');
      spinner.hidden = true;
      textoEnviar.textContent = 'Enviar consulta';

      document.getElementById('ok-nombre').textContent = nombre;
      document.getElementById('ok-correo').textContent = correo;

      form.reset();

      const modal = document.getElementById('modal-ok');
      if (window.bootstrap && modal) {
        window.bootstrap.Modal.getOrCreateInstance(modal).show();
      }
    }, 1200);
  });
})();
