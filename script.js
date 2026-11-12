const WHATSAPP = '5491123935032';
document.documentElement.classList.add('js');

/* ---------- Header y footer compartidos ---------- */
const PAGES = [
  ['index.html', 'Inicio'],
  ['acerca.html', 'Acerca de mí'],
  ['capacitaciones.html', 'Capacitaciones'],
  ['servicios.html', 'Servicios'],
  ['disenos.html', 'Diseños']
];
const current = location.pathname.split('/').pop() || 'index.html';
const links = PAGES.map(([href, label]) =>
  `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');

document.getElementById('site-header').outerHTML = `
<header class="nav" id="nav">
  <a href="index.html" class="brand">Chami's</a>
  <button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><i></i><i></i></button>
  <nav id="menu">${links}<a href="turnos.html" class="btn btn-sm">Reservar turno</a></nav>
</header>`;

document.getElementById('site-footer').outerHTML = `
<footer class="footer">
  <div class="footer-grid">
    <div>
      <p class="brand-f">Chami's</p>
      <p>Salón de uñas &amp; academia</p>
    </div>
    <div>
      <h4>Secciones</h4>
      ${links}
      <a href="turnos.html">Reservar turno</a>
    </div>
    <div>
      <h4>Contacto</h4>
      <a href="https://maps.app.goo.gl/R1pu4hSwa3r86zEV9" target="_blank" rel="noopener">Av. Alte Brown 3444, Temperley</a>
      <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener">WhatsApp 11 2393-5032</a>
      <a href="https://www.instagram.com/chamis.nails/" target="_blank" rel="noopener">@chamis.nails</a>
    </div>
  </div>
  <p class="copy">© ${new Date().getFullYear()} Chami's · Temperley, Buenos Aires</p>
</footer>
<a class="wa-float" href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">WhatsApp</a>`;

/* ---------- Navegación ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const alwaysSolid = document.body.classList.contains('inner');
const onScroll = () => nav.classList.toggle('solid', alwaysSolid || window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

/* ---------- Servicios (página servicios.html) ---------- */
const list = document.getElementById('services-list');
if (list) {
  const money = p => (p == null ? 'Consultar' : '$' + p.toLocaleString('es-AR'));
  list.innerHTML = SERVICES.map(s => `
    <article class="service">
      <div>
        <h3>${s.name}</h3>
        <p>${s.description}</p>
      </div>
      <div class="price">${money(s.price)}</div>
      <a class="link" href="turnos.html?servicio=${encodeURIComponent(s.name)}">Reservar</a>
    </article>`).join('');
}

/* ---------- Galería con ampliación (disenos.html) ---------- */
const gallery = document.querySelector('.gallery');
if (gallery) {
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.innerHTML = '<button aria-label="Cerrar">×</button><img alt="">';
  document.body.appendChild(box);
  const big = box.querySelector('img');
  const cards = [...gallery.querySelectorAll('figure')];
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); setTimeout(() => { e.target.style.transitionDelay = ''; }, 1000); } }), { threshold: .15 })
    : null;
  cards.forEach((c, i) => { c.style.transitionDelay = (i % 4) * 90 + 'ms'; io ? io.observe(c) : c.classList.add('in'); });
  gallery.querySelectorAll('img').forEach(img =>
    img.addEventListener('click', () => { big.src = img.src; big.alt = img.alt; box.hidden = false; }));
  box.addEventListener('click', () => { box.hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') box.hidden = true; });
}

/* ---------- Formulario de turnos (turnos.html) ---------- */
const form = document.getElementById('form');
if (form) {
  const servicio = document.getElementById('servicio');
  const fecha = document.getElementById('fecha');
  const hora = document.getElementById('hora');
  const fechaHora = document.getElementById('fechaHora');
  const error = document.getElementById('error');

  // Opciones de turnos desde services-data.js
  servicio.querySelector('optgroup[label="Turnos de uñas"]').innerHTML =
    SERVICES.map(s => `<option>${s.name}</option>`).join('');

  const esCurso = () => servicio.value.startsWith('Curso:');
  function toggleFechaHora() {
    fechaHora.hidden = esCurso();
    if (esCurso()) { fecha.value = ''; hora.value = ''; }
  }
  servicio.addEventListener('change', toggleFechaHora);

  // Preselección desde otras páginas: turnos.html?servicio=...
  const pre = new URLSearchParams(location.search).get('servicio');
  if (pre) { servicio.value = pre; toggleFechaHora(); }

  fecha.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const msg = document.getElementById('msg').value.trim();
    if (!nombre || !servicio.value) { error.hidden = false; return; }
    error.hidden = true;

    let dia = '';
    if (fecha.value) { const [y, m, d] = fecha.value.split('-'); dia = `${d}/${m}/${y}`; }

    const lineas = [
      'Hola Yamila! Quiero reservar:',
      `• Nombre: ${nombre}`,
      `• Servicio: ${servicio.value}`,
      dia && `• Día preferido: ${dia}`,
      hora.value && `• Horario: ${hora.value}`,
      msg && `• Comentarios: ${msg}`
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
  });
}