// قائمة الموبايل
const toggle = document.querySelector('.navbar__toggle');
const menu = document.getElementById('nav-menu');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ===== Light / Dark mode =====
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function showTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
}
function saveTheme(theme) {
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

showTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  showTheme(next);
  saveTheme(next);
});

// ===== حالة التسجيل في الشارة =====
const statusBadge = document.getElementById('status-badge');
if (statusBadge) {
  statusBadge.classList.toggle('badge--open', REGISTRATION_OPEN);
  statusBadge.classList.toggle('badge--closed', !REGISTRATION_OPEN);
  document.getElementById('status-text').textContent =
    REGISTRATION_OPEN ? 'Recruitment is open' : 'Recruitment is closed';
}
