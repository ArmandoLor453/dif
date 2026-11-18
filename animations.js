const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const FOTOS = {
  adultos: ["img/fotos/adultos.jpg", "Dos mujeres adultas mayores conversando en un parque", "Personas adultas mayores: convivencia y bienestar"],
  ninez: ["img/fotos/ninez.jpg", "Niñas con uniforme escolar en un parque", "Niñas y niños: educación y protección"],
  nutricion: ["img/fotos/nutricion.jpg", "Alimentos frescos con apio, camarón y limón", "Nutrición: una alimentación sana para la familia"],
  cocina: ["img/fotos/cocina.jpg", "Frutas y verduras en una cocina", "Cocina saludable y buenos hábitos"],
  diabetes: ["img/fotos/diabetes.jpg", "Medidor de glucosa para personas con diabetes", "Salud: prevención y cuidado de la diabetes"],
  rehabilitacion: ["img/fotos/rehabilitacion.jpg", "Silla de ruedas acuática en una alberca", "Rehabilitación e inclusión de personas con discapacidad"],
  juridico: ["img/fotos/juridico.jpg", "Mazo de juez sobre un escritorio", "Asistencia jurídica y defensa de derechos"],
  finanzas: ["img/fotos/finanzas.jpg", "Calculadora sobre un escritorio", "Administración y manejo responsable de los recursos"],
  informatica: ["img/fotos/informatica.jpg", "Teclado de laptop retroiluminado", "Equipos, sistemas y soporte tecnológico"],
};

const FOTOS_POR_PAGINA = {
  "unidad-adultos-mayores": ["adultos"],
  "unidad-centros-educativos": ["ninez"],
  "unidad-prevencion-bienestar-familiar": ["ninez"],
  "procuraduria-proteccion": ["ninez"],
  "unidad-proteccion-derechos-vulnerables": ["ninez"],
  "unidad-servicios-nutricionales": ["nutricion", "cocina"],
  "unidad-centro-diabetes": ["diabetes"],
  "unidad-rehabilitacion-integracion-social": ["rehabilitacion"],
  "asuntos-juridicos": ["juridico"],
  "unidad-asistencia-juridica-familiar": ["juridico"],
  "unidad-contenciosa-laboral": ["juridico"],
  "unidad-investigadora": ["juridico"],
  "unidad-substanciadora-resolutora": ["juridico"],
  "administracion-finanzas": ["finanzas"],
  "unidad-contabilidad": ["finanzas"],
  "procuracion-fondos": ["finanzas"],
  "unidad-informatica": ["informatica"],
  "servicios-salud-educativos": ["diabetes", "nutricion", "ninez", "adultos"],
  "consejeria-mujer-grupos-vulnerables": ["adultos", "rehabilitacion"],
};

function crearFoto(clave) {
  const [src, alt, texto] = FOTOS[clave];
  const figura = document.createElement("figure");
  figura.className = "foto-destacada";
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  const pie = document.createElement("figcaption");
  pie.textContent = texto;
  figura.append(img, pie);
  return figura;
}

function insertarFotos() {
  const panel = document.querySelector("article.panel");
  if (!panel) return;
  const pagina = location.pathname.split("/").pop().replace(".html", "");
  const claves = FOTOS_POR_PAGINA[pagina];
  if (!claves || panel.querySelector(".foto-destacada")) return;

  let bloque;
  if (claves.length === 1) {
    bloque = crearFoto(claves[0]);
  } else {
    bloque = document.createElement("div");
    bloque.className = "fotos-franja";
    claves.forEach((clave) => bloque.append(crearFoto(clave)));
  }
  panel.prepend(bloque);
}

function agregarEnlaceCreditos() {
  const pie = document.querySelector(".pie");
  if (!pie || pie.querySelector(".enlace-pie")) return;
  const parrafo = document.createElement("p");
  parrafo.innerHTML = '<a class="enlace-pie" href="creditos.html">Créditos de imágenes</a>';
  pie.append(parrafo);
}

function mapasDeCentros() {
  const marco = document.querySelector("#mapa-centros iframe");
  const enlace = document.querySelector("#mapa-centros-enlace");
  if (!marco) return;
  document.querySelectorAll(".ver-mapa").forEach((boton) => {
    boton.addEventListener("click", () => {
      const consulta = encodeURIComponent(boton.dataset.mapa);
      marco.src = `https://www.google.com/maps?q=${consulta}&output=embed`;
      if (enlace) enlace.href = `https://www.google.com/maps/search/?api=1&query=${consulta}`;
      document.querySelectorAll(".ver-mapa").forEach((b) => b.classList.toggle("activo", b === boton));
      marco.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  });
}

function barraProgreso() {
  const barra = document.createElement("div");
  barra.className = "barra-progreso";
  barra.setAttribute("aria-hidden", "true");
  document.body.prepend(barra);
  return barra;
}

function botonSubir() {
  const boton = document.createElement("button");
  boton.className = "subir";
  boton.type = "button";
  boton.setAttribute("aria-label", "Volver arriba");
  boton.textContent = "↑";
  boton.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  );
  document.body.append(boton);
  return boton;
}

function efectosDeScroll() {
  const barra = barraProgreso();
  const subir = botonSubir();
  const topbar = document.querySelector(".topbar");
  const hero = document.querySelector(".hero");
  let ultimo = window.scrollY;
  let pendiente = false;

  const actualizar = () => {
    pendiente = false;
    const y = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.transform = `scaleX(${total > 0 ? Math.min(y / total, 1) : 0})`;
    subir.classList.toggle("visible", y > 500);

    if (topbar) {
      topbar.classList.toggle("compacta", y > 10);
      topbar.classList.toggle("oculta", y > ultimo && y > 300);
    }
    if (hero && !reduceMotion && y < window.innerHeight) {
      hero.style.setProperty("--parallax", `${Math.round(y * 0.25)}px`);
    }
    ultimo = y;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(actualizar);
      }
    },
    { passive: true }
  );
  actualizar();
}

function animarContadores() {
  const contadores = document.querySelectorAll("[data-contador]");
  if (!contadores.length) return;

  const animar = (el) => {
    const meta = Number(el.dataset.contador);
    if (reduceMotion) {
      el.textContent = meta;
      return;
    }
    const duracion = 1400;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(meta * suave);
      if (t < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          animar(entrada.target);
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  contadores.forEach((el) => {
    if (!reduceMotion) el.textContent = "0";
    observador.observe(el);
  });
}

function inclinarTarjetas() {
  if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
  document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    tarjeta.addEventListener("mouseenter", () => tarjeta.classList.add("inclinable"));
    tarjeta.addEventListener("mousemove", (e) => {
      const r = tarjeta.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tarjeta.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
      tarjeta.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    });
    tarjeta.addEventListener("mouseleave", () => {
      tarjeta.style.setProperty("--ry", "0deg");
      tarjeta.style.setProperty("--rx", "0deg");
    });
  });
}

function visorDeImagenes() {
  const imagenes = document.querySelectorAll(".galeria img, .foto-destacada img");
  if (!imagenes.length) return;

  let visor = null;
  const alTeclear = (e) => {
    if (e.key === "Escape") cerrar();
  };
  const cerrar = () => {
    if (!visor) return;
    const actual = visor;
    visor = null;
    actual.classList.remove("abierto");
    document.removeEventListener("keydown", alTeclear);
    setTimeout(() => actual.remove(), reduceMotion ? 0 : 250);
  };
  const abrir = (img) => {
    if (visor) return;
    visor = document.createElement("div");
    visor.className = "visor";
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-modal", "true");
    visor.setAttribute("aria-label", img.alt || "Imagen ampliada");

    const grande = document.createElement("img");
    grande.src = img.currentSrc || img.src;
    grande.alt = img.alt;
    const texto = document.createElement("p");
    const pie = img.closest("figure")?.querySelector("figcaption");
    texto.textContent = pie ? pie.textContent : img.alt;
    const cierre = document.createElement("button");
    cierre.type = "button";
    cierre.setAttribute("aria-label", "Cerrar");
    cierre.textContent = "×";

    visor.append(grande, texto, cierre);
    visor.addEventListener("click", (e) => {
      if (e.target !== grande) cerrar();
    });
    document.body.append(visor);
    document.addEventListener("keydown", alTeclear);
    requestAnimationFrame(() => visor && visor.classList.add("abierto"));
    cierre.focus();
  };

  imagenes.forEach((img) => img.addEventListener("click", () => abrir(img)));
}

const observadorListas = new IntersectionObserver(
  (entradas, obs) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        obs.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.2 }
);

function particulasHero() {
  const hero = document.querySelector(".hero");
  if (!hero || reduceMotion) return;
  for (let i = 0; i < 14; i++) {
    const p = document.createElement("span");
    p.className = "particula";
    const tam = 4 + Math.random() * 8;
    p.style.cssText = `left:${Math.random() * 100}%;width:${tam}px;height:${tam}px;` +
      `animation-duration:${7 + Math.random() * 8}s;animation-delay:${-Math.random() * 12}s`;
    p.setAttribute("aria-hidden", "true");
    hero.append(p);
  }
}

function ondasEnBotones() {
  if (reduceMotion) return;
  document.querySelectorAll(".boton").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const r = boton.getBoundingClientRect();
      const onda = document.createElement("span");
      onda.className = "onda";
      onda.style.left = `${e.clientX - r.left}px`;
      onda.style.top = `${e.clientY - r.top}px`;
      boton.append(onda);
      onda.addEventListener("animationend", () => onda.remove());
    });
  });
}

function luzEnSubareas() {
  if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
  document.querySelectorAll(".subarea").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

function transicionEntrePaginas() {
  if (reduceMotion) return;
  window.addEventListener("pageshow", () => document.body.classList.remove("saliendo"));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute("href");
    if (a.target === "_blank" || !href || /^(#|mailto:|tel:|https?:)/i.test(href)) return;
    e.preventDefault();
    document.body.classList.add("saliendo");
    setTimeout(() => { location.href = a.href; }, 220);
  });
}

function revelarElementos() {
  const elementos = document.querySelectorAll(
    ".hero-texto, .banner-texto, .titulo-seccion, .intro, .tarjeta, .caja, .panel, .subarea, .cifra, .acordeon details, .foto-destacada, .mapa, .galeria figure"
  );
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  document.querySelectorAll(".lista").forEach((lista) => {
    lista.classList.add("en-cascada", "animable-lista");
    [...lista.children].forEach((li, n) => li.style.setProperty("--i", Math.min(n, 8)));
    observadorListas.observe(lista);
  });

  elementos.forEach((el, i) => {
    el.classList.add("animable");
    if (el.classList.contains("caja")) {
      el.classList.add(i % 2 === 0 ? "desde-izquierda" : "desde-derecha");
    }
    el.style.setProperty("--retraso-animacion", `${Math.min(i % 6, 5) * 90}ms`);
  });

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  elementos.forEach((el) => observador.observe(el));
}

insertarFotos();
agregarEnlaceCreditos();
mapasDeCentros();
efectosDeScroll();
animarContadores();
inclinarTarjetas();
visorDeImagenes();
particulasHero();
ondasEnBotones();
luzEnSubareas();
transicionEntrePaginas();
revelarElementos();
