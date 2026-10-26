/* Genera las páginas de materias y de artículos, el índice de noticias y el mapa del sitio.
   Uso: node build.js  (ejecutar después de modificar noticias.js o areas.js) */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE = 'https://deleoncordero.com.mx';
const load = (f, key) => { const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, f), 'utf8'))(w); return w[key]; };
const AREAS = load('areas.js', 'AREAS');
const FAQ = load('faq.js', 'FAQ') || {};
const ARTICLES = load('noticias.js', 'ARTICLES').filter(a => a.cuerpo && a.cuerpo.length);

const MSLUG = {amparo:'amparo', civil:'derecho-civil', mercantil:'derecho-mercantil', familiar:'derecho-familiar', agrario:'derecho-agrario', masc:'mediacion'};
const MTITLE = {
  amparo: 'Abogados de amparo en Zapopan y Guadalajara',
  civil: 'Abogados en derecho civil en Zapopan y Guadalajara',
  mercantil: 'Abogados en derecho mercantil y cobro de adeudos en Zapopan y Guadalajara',
  familiar: 'Abogados en derecho familiar en Zapopan y Guadalajara',
  agrario: 'Abogados en derecho agrario en Jalisco',
  masc: 'Mediación y mecanismos alternativos de solución de controversias en Zapopan'
};
const MESES = {enero:'01',febrero:'02',marzo:'03',abril:'04',mayo:'05',junio:'06',julio:'07',agosto:'08',septiembre:'09',octubre:'10',noviembre:'11',diciembre:'12'};

const esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const slugOf = t => t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').split('-').slice(0,10).join('-').replace(/(-(en|de|la|el|y|los|las|del|a|para|por|con))+$/,'');
const isoOf = f => { const m = /(\d{1,2}) de ([a-záéíóú]+) de (\d{4})/i.exec(f || ''); return m ? `${m[3]}-${MESES[m[2].toLowerCase()]}-${m[1].padStart(2,'0')}` : new Date().toISOString().slice(0,10); };
const areaOf = id => AREAS.find(a => a.id === id);
const arrow = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M2 9h14M10 3l6 6-6 6"/></svg>';

// Slugs únicos de artículos
const used = {};
ARTICLES.forEach(a => { let s = slugOf(a.titulo), k = s, n = 2; while (used[k]) k = s + '-' + n++; used[k] = 1; a.slug = k; a.iso = isoOf(a.fecha); });

function page({title, description, canonical, ogImage, jsonld, hero, content, current}){
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage || SITE + '/img/equipo/socios.jpg'}">
<meta name="theme-color" content="#22272e">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,600&display=swap">
<link rel="stylesheet" href="/assets/sub.css">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="De León Cordero Abogados, inicio"><img src="/img/logo.svg" alt="De León Cordero"><span>ABOGADOS</span></a>
    <nav aria-label="Principal"><a href="/">Inicio</a><a href="/#firma">Firma</a><a href="/#practicas"${current==='materias'?' aria-current="page"':''}>Prácticas</a><a href="/noticias/"${current==='noticias'?' aria-current="page"':''}>Noticias</a><a href="/#contacto">Contacto</a></nav>
    <a class="cta" href="https://wa.me/523314196669" target="_blank" rel="noopener">Agendar consulta</a>
  </div>
</header>
<section class="hero"><div class="narrow">${hero}</div></section>
<main><div class="narrow">${content}
<aside class="box">
  <h2>¿Necesita orientación sobre su asunto?</h2>
  <p>Agende una consulta en nuestra oficina en Zapopan, de lunes a viernes, de 9:00 a 14:00 y de 16:00 a 19:00, previa cita.</p>
  <div class="actions"><a class="pill solid" href="https://wa.me/523314196669" target="_blank" rel="noopener">Escribir por WhatsApp ${arrow}</a><a class="pill" href="tel:+523330700588">Llamar al 33 3070 0588</a></div>
</aside>
</div></main>
<footer>
  <div class="wrap">
    <a class="brand" href="/"><img src="/img/logo.svg" alt="De León Cordero"><span>ABOGADOS</span></a>
    <nav aria-label="Pie"><a href="/#firma">Firma</a><a href="/#practicas">Prácticas</a><a href="/noticias/">Noticias</a><a href="/#contacto">Contacto</a><a href="https://www.linkedin.com/in/mariodeleoncordero" target="_blank" rel="noopener me" aria-label="Mario Alberto de León Cordero en LinkedIn">LinkedIn</a><a href="https://www.facebook.com/profile.php?id=61595817688398" target="_blank" rel="noopener" aria-label="De León Cordero Abogados en Facebook">Facebook</a></nav>
    <span class="mat">${AREAS.map(a => `<a href="/materias/${MSLUG[a.id]}/">${esc(a.t)}</a>`).join(' · ')}</span>
    <span>Paseo de los Robles 4099, Colonia San Wenceslao, Zapopan, Jalisco · Teléfono 33 3070 0588 · asistente@dlcm.mx</span>
    <span>© ${new Date().getFullYear()} De León Cordero Abogados</span>
  </div>
</footer>
</body>
</html>
`;
}

const ORG = {"@type":"LegalService","name":"De León Cordero Abogados","url":SITE + '/',"telephone":"+52 33 3070 0588","sameAs":["https://www.facebook.com/profile.php?id=61595817688398"],"address":{"@type":"PostalAddress","streetAddress":"Paseo de los Robles 4099, Colonia San Wenceslao","addressLocality":"Zapopan","addressRegion":"Jalisco","postalCode":"45110","addressCountry":"MX"}};

function bodyHtml(cuerpo){
  return cuerpo.map(p => p.startsWith('## ') ? `<h2>${esc(p.slice(3))}</h2>` : p.startsWith('> ') ? `<p class="jur">${esc(p.slice(2))}</p>` : `<p>${esc(p)}</p>`).join('\n');
}
function card(a){
  return `<a class="card" href="/noticias/${a.slug}/"><span class="cat"><i class="dia"></i>${esc(areaOf(a.m).short)}</span><h2>${esc(a.titulo)}</h2><p>${esc(a.resumen)}</p><span class="date">${esc(a.fecha)}</span></a>`;
}
function write(rel, html){ const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), {recursive:true}); fs.writeFileSync(f, html); }

// Limpia páginas generadas anteriormente
for (const dir of ['materias','noticias']) fs.rmSync(path.join(ROOT, dir), {recursive:true, force:true});

const urls = [{loc: SITE + '/', lastmod: ARTICLES.length ? ARTICLES.map(a => a.iso).sort().pop() : new Date().toISOString().slice(0,10), pri:'1.0'}];
// Versión en inglés de la página principal (en/index.html)
urls.push({loc: SITE + '/en/', lastmod: urls[0].lastmod, pri:'0.9'});

// Materias
AREAS.forEach(a => {
  const slug = MSLUG[a.id], canonical = `${SITE}/materias/${slug}/`;
  const arts = ARTICLES.filter(x => x.m === a.id);
  const faqs = FAQ[a.id] || [];
  const content = `<div class="body">
<p>${esc(a.d)}</p>
<h2>Asuntos que atendemos</h2>
</div>
<ul class="list">${a.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
${faqs.length ? `<section class="faq"><h2>Preguntas frecuentes</h2>${faqs.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</section>` : ''}
${arts.length ? `<section class="related"><h2>Artículos sobre ${esc(a.short.toLowerCase())}</h2><div class="cards">${arts.map(card).join('')}</div></section>` : ''}`;
  write(`materias/${slug}/index.html`, page({
    title: `${MTITLE[a.id]} | De León Cordero Abogados`,
    description: `${a.s} De León Cordero Abogados, despacho en Zapopan, Jalisco.`,
    canonical, current:'materias',
    jsonld: {"@context":"https://schema.org","@graph":[{"@type":"Service","name":a.t,"serviceType":a.t,"areaServed":["Zapopan","Guadalajara","Jalisco"],"provider":ORG,"url":canonical}].concat(faqs.length ? [{"@type":"FAQPage","url":canonical,"mainEntity":faqs.map(f => ({"@type":"Question","name":f.q,"acceptedAnswer":{"@type":"Answer","text":f.a}}))}] : [])},
    hero: `<p class="eyebrow"><i class="dia"></i>Prácticas</p><h1>${esc(MTITLE[a.id])}</h1><p class="lead">${esc(a.s)}</p>`,
    content
  }));
  urls.push({loc: canonical, lastmod: arts.length ? arts.map(x => x.iso).sort().pop() : urls[0].lastmod, pri:'0.8'});
});

// Artículos
ARTICLES.forEach(a => {
  const canonical = `${SITE}/noticias/${a.slug}/`, area = areaOf(a.m);
  const others = ARTICLES.filter(x => x !== a && x.m === a.m).slice(0, 3);
  const content = `<article class="body">
${bodyHtml(a.cuerpo)}
</article>
${a.fuentes && a.fuentes.length ? `<section class="src"><h2>Fuentes</h2><ul>${a.fuentes.map(f => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.nombre)}</a></li>`).join('')}</ul></section>` : ''}
<section class="related"><h2>Siga leyendo</h2><ul><li><a href="/materias/${MSLUG[a.m]}/">${esc(MTITLE[a.m])}</a></li>${others.map(o => `<li><a href="/noticias/${o.slug}/">${esc(o.titulo)}</a></li>`).join('')}<li><a href="/noticias/">Todas las noticias y artículos</a></li></ul></section>`;
  write(`noticias/${a.slug}/index.html`, page({
    title: `${a.titulo} | De León Cordero Abogados`,
    description: a.resumen, canonical, current:'noticias',
    jsonld: {"@context":"https://schema.org","@type":"Article","headline":a.titulo,"description":a.resumen,"datePublished":a.iso,"dateModified":a.iso,"inLanguage":"es-MX","mainEntityOfPage":canonical,"author":{"@type":"Organization","name":"De León Cordero Abogados","url":SITE + '/'},"publisher":{"@type":"Organization","name":"De León Cordero Abogados","logo":{"@type":"ImageObject","url":SITE + '/img/logotipo.png'}},"image":SITE + '/img/equipo/socios.jpg'},
    hero: `<p class="eyebrow"><i class="dia"></i>${esc(area.short)}</p><h1>${esc(a.titulo)}</h1><p class="lead">${esc(a.resumen)}</p><p class="meta">${esc(a.fecha)} · De León Cordero Abogados</p>`,
    content
  }));
  urls.push({loc: canonical, lastmod: a.iso, pri:'0.7'});
});

// Índice de noticias
write('noticias/index.html', page({
  title: 'Noticias y artículos jurídicos | De León Cordero Abogados',
  description: 'Análisis de reformas, criterios de la Suprema Corte de Justicia de la Nación y orientación práctica en amparo, derecho civil, mercantil, familiar, agrario y mediación.',
  canonical: `${SITE}/noticias/`, current:'noticias',
  jsonld: {"@context":"https://schema.org","@type":"CollectionPage","name":"Noticias y artículos","url":`${SITE}/noticias/`,"publisher":ORG},
  hero: `<p class="eyebrow"><i class="dia"></i>Noticias</p><h1>Noticias y artículos</h1><p class="lead">Análisis de reformas, criterios de la Suprema Corte de Justicia de la Nación y orientación práctica en cada una de nuestras materias.</p>`,
  content: `<div class="cards">${ARTICLES.map(card).join('')}</div>`
}));
urls.push({loc: `${SITE}/noticias/`, lastmod: urls[0].lastmod, pri:'0.8'});

// Mapa del sitio
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.pri}</priority></url>`).join('\n')}
</urlset>
`);
console.log(`Generadas ${AREAS.length} páginas de materias, ${ARTICLES.length} artículos y ${urls.length} direcciones en el mapa del sitio.`);
