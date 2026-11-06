// ===== Navbar + Footer (مكتوبين مرة وحدة، يظهرو في الصفحتين) =====
const NAV_LINKS = [['About', 'about'], ['Fields', 'fields'], ['Why join', 'benefits'], ['Games', 'games'], ['Team', 'team']];
const LOGO = '<a class="logo" href="index.html" aria-label="OTC One Tech Crew, home"><img src="img/OTC.png" alt="" width="42" height="44"><span>OTC<small>One Tech Crew</small></span></a>';

document.getElementById('site-header').innerHTML = `<header class="nav"><div class="wrap nav__in">${LOGO}
<button class="burger" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><i></i><i></i><i></i></button>
<nav id="menu" class="menu" aria-label="Main"><ul>${NAV_LINKS.map(([t, id]) => `<li><a href="index.html#${id}">${t}</a></li>`).join('')}</ul>
<button class="theme" id="theme" type="button" aria-label="Switch to dark mode" aria-pressed="false"><svg class="moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
<a class="btn btn--p btn--s" href="register.html">Join the crew</a></nav></div></header>`;

document.getElementById('site-footer').innerHTML = `<footer class="foot"><div class="wrap">
<p class="foot__label">Find us</p>
<ul class="pills">
<li><a class="pill pill--main" href="register.html">Join the crew</a></li>
<li><a class="pill" href="https://www.linkedin.com/in/one-tech-crew-41b414417" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
<li><a class="pill" href="https://www.instagram.com/one_tech_crew/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
<li><a class="pill" href="https://www.facebook.com/onetechcrew/" target="_blank" rel="noopener noreferrer">Facebook</a></li>

<li><a class="pill" href="https://www.tiktok.com/@onetechcrew?_r=1&_t=ZS-9BBd0BbH2LE" target="_blank" rel="noopener noreferrer">TikTok</a></li>
<!-- <li><a class="pill" href="https://github.com/USERNAME" target="_blank" rel="noopener noreferrer">GitHub</a></li> 
<li><a class="pill" href="mailto:contact@example.com">contact@example.com</a></li> -->

</ul>
<p class="foot__copy">&copy; ${new Date().getFullYear()} One Tech Crew. All rights reserved.</p>
</div></footer>`;

const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ===== حالة التسجيل في الشارة =====
const badge = document.getElementById('status-badge');
if (badge) {
  badge.className = 'badge ' + (REGISTRATION_OPEN ? 'badge--open' : 'badge--closed');
  badge.querySelector('span').textContent = REGISTRATION_OPEN ? 'Recruitment is open' : 'Recruitment is closed';
}

// ===== الفريق (من data.js) =====
function mk(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text; // textContent = آمن
  return n;
}
function person([name, role, photo, link], big) {
  const li = mk('li', big ? 'person person--lg' : 'person');
  const av = mk('div', 'avatar');
  av.setAttribute('aria-hidden', 'true');
  if (photo) { const im = mk('img'); im.src = photo; im.alt = ''; im.loading = 'lazy'; av.append(im); }
  else av.textContent = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const info = mk('div');
  info.append(mk('p', 'pname', name), mk('p', 'prole', role));
  if (link) {
    const a = mk('a', 'plink', 'LinkedIn');
    a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', name + ' on LinkedIn');
    info.append(a);
  }
  li.append(av, info);
  return li;
}
const boardEl = document.getElementById('board');
if (boardEl) BOARD.forEach((m) => boardEl.append(person(m, true)));
const teamsEl = document.getElementById('teams');
if (teamsEl) TEAMS.forEach(([title, desc, members]) => {
  const card = mk('article', 'card team lift');
  const ul = mk('ul', 'people');
  members.forEach((m) => ul.append(person(m, false)));
  card.append(mk('h3', '', title), mk('p', '', desc), ul);
  teamsEl.append(card);
});

// ===== الوضع المظلم / الفاتح =====
const rootEl = document.documentElement;
const themeBtn = document.getElementById('theme');
function applyTheme(t) {
  rootEl.dataset.theme = t;
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
}
applyTheme(rootEl.dataset.theme === 'dark' ? 'dark' : 'light');
themeBtn.addEventListener('click', () => {
  const next = rootEl.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});


const viewer = document.getElementById('otc3d');
if (viewer && matchMedia('(prefers-reduced-motion: reduce)').matches) viewer.removeAttribute('auto-rotate');
