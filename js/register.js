// ===== الأقسام والاختيارات (بدّلي القوائم هنا) =====
const DEPTS = {
  cs: { label: 'CS', desc: 'Coding and software projects', skills: ['Front-end', 'Backend', 'AI / Machine Learning', 'Data Science', 'Python', 'Cybersecurity'] },
  tech: { label: 'Tech (robotics)', desc: 'Robots, electronics and embedded projects', skills: ['Arduino', 'Electronics and circuits', 'Robot design and building', 'Embedded systems and IoT', '3D design and printing'] },
  sm: { label: 'Social media', desc: "Content and the club's online image", skills: ['Graphic design', 'Photography', 'Video editing', 'Content writing', 'Community management'] },
  logistics: { label: 'Logistics', desc: 'Equipment, venues and event preparation', skills: ['Event organization', 'Equipment and inventory', 'Venues and planning', 'Sponsors and partners'] },
};
const MAX_DEPTS = 3, MIN = 40;

const form = document.getElementById('form');
const send = document.getElementById('send'), sendText = document.getElementById('send-t');
const statusEl = document.getElementById('status');
let touched = false, picked = [];

document.getElementById('soon').hidden = REGISTRATION_OPEN;
document.getElementById('form-view').hidden = !REGISTRATION_OPEN;
const demoEl = document.getElementById('demo');
if (demoEl) demoEl.hidden = !!API_URL;   // التنبيه اختياري (ممكن يكون ممسوح)

function mk(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }

// ===== بطاقات الأقسام + الأدوار =====
const cards = document.getElementById('dept-cards');
Object.entries(DEPTS).forEach(([id, d]) => {
  const l = mk('label', 'choice'), i = mk('input');
  i.type = 'checkbox'; i.name = 'interests'; i.value = id;
  const b = mk('span', 'cbody'); b.append(mk('strong', '', d.label), mk('small', '', d.desc));
  l.append(i, b); cards.append(l);
});
const rolesBox = document.getElementById('roles');
const secondWrap = document.getElementById('second-wrap'), second = document.getElementById('secondChoice');

function syncDepts() {
  const boxes = [...cards.querySelectorAll('input')];
  picked = picked.filter((id) => boxes.find((b) => b.value === id && b.checked));
  boxes.forEach((b) => { if (b.checked && !picked.includes(b.value)) picked.push(b.value); });
  while (picked.length > MAX_DEPTS) { const x = picked.pop(); boxes.find((b) => b.value === x).checked = false; }
  boxes.forEach((b) => { b.disabled = !b.checked && picked.length >= MAX_DEPTS; });
  document.getElementById('dept-count').textContent = `Choose 1 to ${MAX_DEPTS} departments (${picked.length} of ${MAX_DEPTS} chosen)`;
  [...rolesBox.children].forEach((w) => { if (!picked.includes(w.dataset.dept)) w.remove(); });
  picked.forEach((id) => {
    if (rolesBox.querySelector(`[data-dept="${id}"]`)) return;
    const w = mk('fieldset', 'sub'); w.dataset.dept = id; w.dataset.f = 'role_' + id;
    const lg = mk('legend', '', `What do you know in ${DEPTS[id].label}? `); lg.append(mk('span', 'hint', 'Choose at least one'));
    const box = mk('div', 'days');
    DEPTS[id].skills.forEach((sk) => {
      const l = mk('label', 'dayc'), i = mk('input'); i.type = 'checkbox'; i.name = 'role_' + id; i.value = sk;
      l.append(i, mk('span', '', sk)); box.append(l);
    });
    const e = mk('p', 'ferr'); e.setAttribute('role', 'alert');
    w.append(lg, box, e); rolesBox.append(w);
  });
  const keep = second.value;   // الخيار الثاني: الأقسام الباقية (الأول = أول قسم اخترتيه)
  second.replaceChildren(new Option('No second choice', ''));
  picked.slice(1).forEach((id) => second.append(new Option(DEPTS[id].label, id)));
  second.value = picked.slice(1).includes(keep) ? keep : '';
  secondWrap.hidden = picked.length < 2;
}
cards.addEventListener('change', syncDepts);

// ===== القيم والتحقق =====
const isUrl = (v) => { try { const u = new URL(v.trim()); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; } };
function val() {
  const d = new FormData(form), s = (k) => (d.get(k) || '').toString();
  const yn = (k) => (d.get(k) === 'on' ? 'Yes' : 'No');
  return {
    fullName: s('fullName'), birth: s('birth'), email: s('email'), phone: s('phone'),
    university: s('university'), department: s('department'), specialty: s('specialty'), level: s('level'), studentId: s('studentId'),
    interests: picked.map((id) => DEPTS[id].label),
    roles: picked.map((id) => DEPTS[id].label + ': ' + d.getAll('role_' + id).join(', ')).join(' | '),
    firstChoice: picked[0] ? DEPTS[picked[0]].label : '',
    secondChoice: s('secondChoice') ? DEPTS[s('secondChoice')].label : '',
    currentLevel: s('currentLevel'), skills: s('skills'),
    days: d.getAll('days'), hours: s('hours'), laptop: s('laptop'), heard: s('heard'),
    motivation: s('motivation'), goals: s('goals'), experience: s('experience'),
    discord: s('discord'), linkedin: s('linkedin'), portfolio: s('portfolio'),
    consentRules: yn('consentRules'), consentData: yn('consentData'), consentMedia: yn('consentMedia'),
    _raw: Object.fromEntries(picked.map((id) => [id, d.getAll('role_' + id)])),
  };
}
function validate(v) {
  const e = {}, t = (x) => x.trim();
  if (t(v.fullName).length < 3) e.fullName = 'Enter your full name (at least 3 characters).';
  const bd = new Date(v.birth);
  if (!v.birth || isNaN(bd) || bd > new Date() || bd.getFullYear() < 1950) e.birth = 'Enter your date of birth.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t(v.email))) e.email = 'Enter a valid email, for example name@example.com.';
  if (!/^(?:\+213|00213|0)[5-7]\d{8}$/.test(v.phone.replace(/[\s.-]/g, ''))) e.phone = 'Enter an Algerian mobile number, for example 0550 12 34 56.';
  if (!t(v.university)) e.university = 'Enter your university.';
  if (!t(v.department)) e.department = 'Enter your department.';
  if (!t(v.specialty)) e.specialty = 'Enter your specialty.';
  if (!v.level) e.level = 'Choose your study level.';
  if (!/^[A-Za-z0-9\-\/ ]{4,20}$/.test(t(v.studentId))) e.studentId = 'Enter your student ID (4 to 20 characters).';
  if (!picked.length) e.interests = 'Choose at least one department.';
  picked.forEach((id) => { if (!v._raw[id].length) e['role_' + id] = `Choose what you know in ${DEPTS[id].label} (at least one).`; });
  if (!v.currentLevel) e.currentLevel = 'Choose your current level.';
  if (!v.days.length) e.days = 'Choose at least one day.';
  if (!v.hours) e.hours = 'Choose how many hours you can give.';
  if (!v.laptop) e.laptop = 'Choose an answer.';
  if (!v.heard) e.heard = 'Choose an answer.';
  if (t(v.motivation).length < MIN) e.motivation = `Write at least ${MIN} characters about why you want to join.`;
  if (t(v.goals).length < 10) e.goals = 'Tell us what you hope to learn or build.';
  if (!/^@?[a-zA-Z0-9._]{2,32}$/.test(t(v.discord))) e.discord = 'Enter your Discord username, for example sara_otc.';
  if (t(v.linkedin) && !(isUrl(v.linkedin) && /linkedin\.com/i.test(v.linkedin))) e.linkedin = 'Enter a LinkedIn link, for example https://www.linkedin.com/in/your-name';
  if (t(v.portfolio) && !isUrl(v.portfolio)) e.portfolio = 'Enter a full link starting with https://';
  if (v.consentRules !== 'Yes') e.consentRules = 'You need to accept this to register.';
  if (v.consentData !== 'Yes') e.consentData = 'You need to accept this to register.';
  return e;
}
function show(errors) {
  form.querySelectorAll('[data-f]').forEach((w) => {
    const m = errors[w.dataset.f] || '';
    const p = w.querySelector('.ferr'); if (p) p.textContent = m;
    w.classList.toggle('err', !!m);
    const i = w.querySelector('input:not([type=checkbox]),select,textarea');
    if (i) i.setAttribute('aria-invalid', String(!!m));
  });
}
const again = () => { if (touched) show(validate(val())); };
form.addEventListener('input', again);
form.addEventListener('change', again);
document.getElementById('motivation').addEventListener('input', (e) => { document.getElementById('count').textContent = e.target.value.trim().length + ` / ${MIN} characters minimum`; });

// ===== الإرسال =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (send.disabled) return;
  touched = true; statusEl.textContent = '';
  const v = val(), errors = validate(v);
  show(errors);
  const firstWrap = [...form.querySelectorAll('[data-f]')].find((w) => errors[w.dataset.f]);
  if (firstWrap) { (firstWrap.querySelector('input,select,textarea') || firstWrap).focus(); return; }
  send.disabled = true; send.classList.add('loading'); sendText.textContent = 'Sending...';
  try {
    const bot = (new FormData(form).get('company') || '') !== '';   // honeypot
    delete v._raw;
    done(v, bot ? { demo: false } : await submitApplication(v));
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
  const box = document.getElementById('done'); box.hidden = false; box.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.getElementById('again').addEventListener('click', () => {
  form.reset(); picked = []; touched = false; syncDepts(); show({});
  document.getElementById('count').textContent = `0 / ${MIN} characters minimum`;
  send.disabled = false; send.classList.remove('loading'); sendText.textContent = 'Send application';
  document.getElementById('done').hidden = true;
  document.getElementById('form-view').hidden = false;
});
syncDepts();
