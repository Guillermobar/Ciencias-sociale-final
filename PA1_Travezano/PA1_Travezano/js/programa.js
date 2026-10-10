document.addEventListener('DOMContentLoaded', () => {
  if (typeof M === 'undefined') {
    return;
  }

  const enlaces = document.querySelectorAll('.tabs .tab a');

  const marcarSeleccion = (idActivo) => {
    enlaces.forEach((a) => {
      a.setAttribute('aria-selected', String(a.getAttribute('href') === `#${idActivo}`));
    });
  };

  M.Tabs.init(document.querySelectorAll('.tabs'), {
    onShow: (panel) => marcarSeleccion(panel.id)
  });

  const activo = document.querySelector('.tabs .tab a.active');
  if (activo) {
    marcarSeleccion(activo.getAttribute('href').slice(1));
  }

  document.querySelector('.tabs').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') {
      return;
    }
    const lista = Array.from(enlaces);
    const i = lista.indexOf(document.activeElement);
    if (i === -1) {
      return;
    }
    e.preventDefault();
    const paso = e.key === 'ArrowRight' ? 1 : -1;
    const siguiente = lista[(i + paso + lista.length) % lista.length];
    siguiente.focus();
    siguiente.click();
  });

  M.Collapsible.init(document.querySelectorAll('.collapsible'), {
    accordion: false,
    onOpenStart: (li) => {
      li.querySelector('.collapsible-header').setAttribute('aria-expanded', 'true');
    },
    onCloseStart: (li) => {
      li.querySelector('.collapsible-header').setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('.collapsible-header').forEach((cabecera) => {
    cabecera.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        cabecera.click();
      }
    });
  });

  const boton = document.getElementById('copiar');
  const estado = document.getElementById('estado');

  const avisar = (mensaje) => {
    estado.textContent = '';
    setTimeout(() => {
      estado.textContent = mensaje;
    }, 50);
    M.toast({ html: mensaje, classes: 'toast-sticker', displayLength: 3500 });
  };

  const copiarRespaldo = (texto) => {
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(campo);
    return ok;
  };

  if (boton) {
    boton.addEventListener('click', async () => {
      const url = window.location.href.split('#')[0];
      try {
        await navigator.clipboard.writeText(url);
        avisar('Enlace copiado');
      } catch (err) {
        avisar(copiarRespaldo(url) ? 'Enlace copiado' : 'No pudimos copiar el enlace. Cópialo desde la barra de direcciones.');
      }
    });
  }
});
