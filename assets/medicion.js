/* Medición de visitas con Google Analytics 4, solo con el consentimiento de la persona.
   Mientras no acepte, no se carga ningún código de Google ni se instalan cookies. */
(function(){
  var GA_ID = '';
  var KEY = 'dlc-consentimiento';
  var en = (document.documentElement.lang || '').slice(0,2) === 'en';
  var T = en ? {
    msg: 'We use Google Analytics cookies only to learn how many people visit this site and which pages they read. You may accept or decline them.',
    ok: 'Accept', no: 'Decline', more: 'Privacy notice', link: '/aviso-de-privacidad/'
  } : {
    msg: 'Utilizamos cookies de Google Analytics únicamente para conocer cuántas personas visitan este sitio y qué páginas consultan. Usted puede aceptarlas o rechazarlas.',
    ok: 'Aceptar', no: 'Rechazar', more: 'Aviso de privacidad', link: '/aviso-de-privacidad/'
  };

  function get(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function set(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

  var loaded = false;
  function load(){
    if (loaded || !/^G-[A-Z0-9]+$/.test(GA_ID)) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // Clics en WhatsApp, llamada y correo
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !window.gtag || !loaded) return;
    var h = a.getAttribute('href'), ev = null;
    if (/^https:\/\/wa\.me\//.test(h)) ev = 'clic_whatsapp';
    else if (/^tel:/.test(h)) ev = 'clic_llamada';
    else if (/^mailto:/.test(h)) ev = 'clic_correo';
    if (ev) gtag('event', ev, { pagina: location.pathname, texto: (a.textContent || '').trim().slice(0,60) });
  }, true);

  function banner(){
    if (document.getElementById('dlc-cookies')) return;
    var st = document.createElement('style');
    st.textContent = '#dlc-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:620px;margin-inline:auto;background:#22272e;color:#fff;border-radius:14px;padding:18px 20px;box-shadow:0 10px 30px rgba(0,0,0,.25);font:15px/1.55 "Nunito Sans","Avenir Next","Segoe UI",system-ui,sans-serif}'
      + '#dlc-cookies p{margin:0 0 14px}#dlc-cookies a{color:#fff}'
      + '#dlc-cookies .b{display:flex;flex-wrap:wrap;gap:10px;align-items:center}'
      + '#dlc-cookies button{font:inherit;border-radius:999px;padding:8px 18px;cursor:pointer;border:1px solid rgba(255,255,255,.5);background:transparent;color:#fff}'
      + '#dlc-cookies button.ok{background:#fff;color:#22272e;border-color:#fff}'
      + '#dlc-cookies button:focus-visible{outline:2px solid #6fa3d4;outline-offset:2px}';
    document.head.appendChild(st);
    var d = document.createElement('div');
    d.id = 'dlc-cookies';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-live', 'polite');
    d.setAttribute('aria-label', en ? 'Cookies' : 'Cookies');
    d.innerHTML = '<p>' + T.msg + ' <a href="' + T.link + '">' + T.more + '</a></p>'
      + '<div class="b"><button type="button" class="ok">' + T.ok + '</button><button type="button" class="no">' + T.no + '</button></div>';
    document.body.appendChild(d);
    d.querySelector('.ok').onclick = function(){ set('si'); d.remove(); load(); };
    d.querySelector('.no').onclick = function(){ set('no'); d.remove(); };
  }

  // Enlace para cambiar la preferencia, en el aviso de privacidad
  window.dlcPreferencias = function(){ try { localStorage.removeItem(KEY); } catch(e){} banner(); };

  if (!/^G-[A-Z0-9]+$/.test(GA_ID)) return;
  var c = get();
  if (c === 'si') load();
  else if (c !== 'no') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner);
    else banner();
  }
})();
