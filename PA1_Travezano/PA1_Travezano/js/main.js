(() => {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  if (toggle && menu) {
    const texto = toggle.querySelector('.nav-toggle-text');
    const abrir = (valor) => {
      toggle.setAttribute('aria-expanded', String(valor));
      menu.classList.toggle('is-open', valor);
      texto.textContent = valor ? 'Cerrar' : 'Menú';
    };

    toggle.addEventListener('click', () => {
      abrir(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        abrir(false);
        toggle.focus();
      }
    });

    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        abrir(false);
      }
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
      if (e.matches) {
        abrir(false);
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const preguntas = [
    {
      curso: 'Sociedad y territorio andino',
      etapa: 'Año 1, ciclo I',
      anio: 1,
      texto: 'Conversas con familias que llegaron a la ciudad y trazas el mapa de su viaje para entender qué las impulsó a partir y qué las atrajo hasta aquí.'
    },
    {
      curso: 'Políticas públicas',
      etapa: 'Año 2, ciclo III',
      anio: 2,
      texto: 'Sigues una decisión real, desde que es una idea hasta que llega al presupuesto, y descubres quién fue escuchado y quién quedó fuera.'
    },
    {
      curso: 'Metodología cuantitativa',
      etapa: 'Año 2, ciclo IV',
      anio: 2,
      texto: 'Armas una encuesta, la aplicas en un barrio y transformas las respuestas en gráficos que cualquier vecino puede interpretar.'
    },
    {
      curso: 'Comunicación y cultura',
      etapa: 'Año 1, ciclo II',
      anio: 1,
      texto: 'Sigues el recorrido de una fiesta, un saludo o una receta a través de las generaciones y observas qué cambia por el camino.'
    },
    {
      curso: 'Evaluación de impacto',
      etapa: 'Año 3, ciclo VI',
      anio: 3,
      texto: 'Contrastas lo que un proyecto prometía con lo que de verdad cambió, y aprendes a demostrarlo con evidencia.'
    }
  ];

  const chips = document.querySelectorAll('.q-chip[data-i]');
  const azar = document.querySelector('.q-chip[data-random]');
  const salida = document.getElementById('respuesta');
  let actual = -1;

  if (chips.length && salida) {
    const mostrar = (i) => {
      const p = preguntas[i];
      actual = i;

      chips.forEach((chip, n) => {
        chip.setAttribute('aria-pressed', String(n === i));
      });

      const meta = document.createElement('p');
      meta.className = 'bubble-meta';
      meta.textContent = `${p.curso}, ${p.etapa}`;

      const cuerpo = document.createElement('p');
      cuerpo.textContent = p.texto;

      const enlace = document.createElement('p');
      const a = document.createElement('a');
      a.href = `programa.html#anio-${p.anio}`;
      a.textContent = `Revisar el año ${p.anio} del plan`;
      enlace.appendChild(a);

      salida.replaceChildren(meta, cuerpo, enlace);
      salida.classList.remove('pop');
      void salida.offsetWidth;
      salida.classList.add('pop');
    };

    chips.forEach((chip, n) => {
      chip.addEventListener('click', () => mostrar(n));
    });

    if (azar) {
      azar.addEventListener('click', () => {
        let n = actual;
        while (n === actual) {
          n = Math.floor(Math.random() * preguntas.length);
        }
        mostrar(n);
      });
    }
  }

  const cinta = document.querySelector('.marquee');
  const botonCinta = document.querySelector('.marquee-btn');

  if (cinta && botonCinta) {
    botonCinta.addEventListener('click', () => {
      const pausada = cinta.classList.toggle('is-paused');
      botonCinta.textContent = pausada ? 'Reanudar movimiento' : 'Detener movimiento';
    });
  }

  const contadores = document.querySelectorAll('[data-count]');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const formatear = (n, original) => (original.includes(' ') ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));

  if (contadores.length && 'IntersectionObserver' in window && !reducido) {
    const animar = (el) => {
      const meta = Number(el.dataset.count);
      const original = el.textContent;
      const inicio = performance.now();
      const duracion = 1200;
      const paso = (ahora) => {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const suave = 1 - Math.pow(1 - t, 3);
        el.textContent = formatear(Math.round(meta * suave), original);
        if (t < 1) {
          requestAnimationFrame(paso);
        }
      };
      requestAnimationFrame(paso);
    };

    const vigia = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          animar(entrada.target);
          vigia.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.6 });

    contadores.forEach((el) => vigia.observe(el));
  }

  const puedePuntero = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (puedePuntero && !reducido) {
    const punto = document.createElement('div');
    punto.className = 'cursor';
    punto.setAttribute('aria-hidden', 'true');
    document.body.appendChild(punto);

    let x = -100;
    let y = -100;
    let px = -100;
    let py = -100;
    let corriendo = false;

    const mover = () => {
      px += (x - px) * 0.2;
      py += (y - py) * 0.2;
      punto.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      if (Math.abs(x - px) > 0.1 || Math.abs(y - py) > 0.1) {
        requestAnimationFrame(mover);
      } else {
        corriendo = false;
      }
    };

    document.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
      punto.classList.add('is-visible');
      if (!corriendo) {
        corriendo = true;
        requestAnimationFrame(mover);
      }
      const activo = e.target.closest && e.target.closest('a, button, input, select, textarea, label, [role="button"], [tabindex]:not([tabindex="-1"])');
      punto.classList.toggle('is-active', Boolean(activo));
    });

    document.addEventListener('mousedown', () => punto.classList.add('is-down'));
    document.addEventListener('mouseup', () => punto.classList.remove('is-down'));
    document.documentElement.addEventListener('mouseleave', () => punto.classList.remove('is-visible'));
  }
})();
