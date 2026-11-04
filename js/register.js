const form = document.getElementById('form');
const send = document.getElementById('send');
const sendText = document.getElementById('send-t');
const statusEl = document.getElementById('status');
const counter = document.getElementById('count');
const MIN = 40;
let touched = false;

// حالة الصفحة: مغلق / فورم / نجاح
document.getElementById('soon').hidden = REGISTRATION_OPEN;
document.getElementById('form-view').hidden = !REGISTRATION_OPEN;
document.getElementById('demo').hidden = !!API_URL;

const val = () => {
  const d = new FormData(form);
  const s = (k) => (d.get(k) || '').toString();
  return { fullName: s('fullName'), email: s('email'), phone: s('phone'), university: s('university'), department: s('department'), level: s('level'),
    interests: d.getAll('interests'), motivation: s('motivation'), experience: s('experience'),
    discord: s('discord'), linkedin: s('linkedin'), portfolio: s('portfolio') };
};
const isUrl = (v) => { try { const u = new URL(v.trim()); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; } };

function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 3) e.fullName = 'Enter your full name (at least 3 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email, for example name@example.com.';
  if (!/^(?:\+213|00213|0)[5-7]\d{8}$/.test(v.phone.replace(/[\s.-]/g, ''))) e.phone = 'Enter an Algerian mobile number, for example 0550 12 34 56.';
  if (!v.university.trim()) e.university = 'Enter your university.';
  if (!v.department.trim()) e.department = 'Enter your department.';
  if (!v.level) e.level = 'Choose your study level.';
  if (!v.interests.length) e.interests = 'Choose at least one field of interest.';
  if (v.motivation.trim().length < MIN) e.motivation = 'Write at least ' + MIN + ' characters about why you want to join.';
  if (v.discord.trim() && !/^@?[a-zA-Z0-9._]{2,32}$/.test(v.discord.trim())) e.discord = 'Enter your Discord username, for example sara_otc.';
  if (v.linkedin.trim() && !(isUrl(v.linkedin) && /linkedin\.com/i.test(v.linkedin))) e.linkedin = 'Enter a LinkedIn link, for example https://www.linkedin.com/in/your-name';
  if (v.portfolio.trim() && !isUrl(v.portfolio)) e.portfolio = 'Enter a full link starting with https://';
  return e;
}
function show(errors) {
  form.querySelectorAll('[data-f]').forEach((w) => {
    const m = errors[w.dataset.f] || '';
    w.querySelector('.ferr').textContent = m;
    w.classList.toggle('err', !!m);
    const i = w.querySelector('input:not([type=checkbox]),select,textarea');
    if (i) i.setAttribute('aria-invalid', String(!!m));
  });
}
const again = () => { if (touched) show(validate(val())); };
form.addEventListener('input', again);
form.addEventListener('change', again);
document.getElementById('motivation').addEventListener('input', (e) => { counter.textContent = e.target.value.trim().length + ' / ' + MIN + ' characters minimum'; });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (send.disabled) return;
  touched = true; statusEl.textContent = '';
  const v = val(), errors = validate(v);
  show(errors);
  const first = Object.keys(errors)[0];
  if (first) { (first === 'interests' ? form.querySelector('input[name=interests]') : document.getElementById(first)).focus(); return; }
  send.disabled = true; send.classList.add('loading'); sendText.textContent = 'Sending...';
  try {
    // honeypot: إذا عمّرو الحقل المخفي (بوت)، نبينو نجاح بلا ما نبعثو
    const bot = (new FormData(form).get('company') || '') !== '';
    const result = bot ? { demo: false } : await submitApplication(v);
    done(v, result);
  } catch (err) {
    statusEl.textContent = err.message || 'Something went wrong. Please try again.';
    send.disabled = false; send.classList.remove('loading'); sendText.textContent = 'Send application';
  }
});

function done(v, r) {
  const first = v.fullName.trim().split(' ')[0];
  document.getElementById('done-t').textContent = r.demo ? 'Demo complete' : 'Application received';
  document.getElementById('done-text').textContent = r.demo
    ? 'Thanks, ' + first + '. This was a demo: your application was NOT saved or sent to the club.'
    : 'Thanks, ' + first + '. We received your application and will contact you at ' + v.email + '.';
  document.getElementById('s-email').textContent = v.email;
  document.getElementById('s-studies').textContent = v.level + ', ' + v.department;
  document.getElementById('s-int').textContent = v.interests.join(', ');
  document.getElementById('form-view').hidden = true;
  const box = document.getElementById('done');
  box.hidden = false; box.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.getElementById('again').addEventListener('click', () => {
  form.reset(); touched = false; show({});
  counter.textContent = '0 / ' + MIN + ' characters minimum';
  send.disabled = false; send.classList.remove('loading'); sendText.textContent = 'Send application';
  document.getElementById('done').hidden = true;
  document.getElementById('form-view').hidden = false;
});
