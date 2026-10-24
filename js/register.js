const form = document.getElementById('apply-form');
const btn = document.getElementById('submit-btn');
const label = btn.querySelector('.btn__label');
const status = document.getElementById('form-status');
const counter = document.getElementById('motivation-count');
const MIN_MOTIVATION = 40;
let touched = false;

function readValues() {
  const d = new FormData(form);
  const s = (k) => d.get(k) || '';
  return {
    fullName: s('fullName'), email: s('email'), phone: s('phone'),
    university: s('university'), department: s('department'), level: s('level'),
    interests: d.getAll('interests'), motivation: s('motivation'), experience: s('experience'),
  };
}

function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 3) e.fullName = 'Enter your full name (at least 3 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email, for example name@example.com.';
  if (!/^(?:\+213|00213|0)[5-7]\d{8}$/.test(v.phone.replace(/[\s.-]/g, ''))) e.phone = 'Enter an Algerian mobile number, for example 0550 12 34 56.';
  if (!v.university.trim()) e.university = 'Enter your university.';
  if (!v.department.trim()) e.department = 'Enter your department.';
  if (!v.level) e.level = 'Choose your study level.';
  if (v.interests.length === 0) e.interests = 'Choose at least one field of interest.';
  if (v.motivation.trim().length < MIN_MOTIVATION) e.motivation = 'Write at least ' + MIN_MOTIVATION + ' characters about why you want to join.';
  return e;
}

function showErrors(errors) {
  form.querySelectorAll('[data-field]').forEach((wrap) => {
    const msg = errors[wrap.dataset.field] || '';
    wrap.querySelector('.field__error').textContent = msg;
    wrap.classList.toggle('has-error', !!msg);
    const input = wrap.querySelector('input:not([type=checkbox]), select, textarea');
    if (input) input.setAttribute('aria-invalid', String(!!msg));
  });
}

function revalidate() { if (touched) showErrors(validate(readValues())); }
form.addEventListener('input', revalidate);
form.addEventListener('change', revalidate);
document.getElementById('motivation').addEventListener('input', (e) => {
  counter.textContent = e.target.value.trim().length + ' / ' + MIN_MOTIVATION + ' characters minimum';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (btn.disabled) return;
  touched = true;
  status.textContent = '';
  const values = readValues();
  const errors = validate(values);
  showErrors(errors);
  const first = Object.keys(errors)[0];
  if (first) {
    (first === 'interests' ? form.querySelector('input[name="interests"]') : document.getElementById(first)).focus();
    return;
  }
  btn.disabled = true;
  btn.classList.add('is-loading');
  label.textContent = 'Sending...';
  try {
    showSuccess(values, await submitApplication(values));
  } catch (err) {
    status.textContent = err.message || 'Something went wrong. Please try again.';
    btn.disabled = false;
    btn.classList.remove('is-loading');
    label.textContent = 'Send application';
  }
});

const formView = document.getElementById('form-view');
const success = document.getElementById('success');

function showSuccess(values, result) {
  const first = values.fullName.trim().split(' ')[0];
  document.getElementById('success-title').textContent = result.demo ? 'Demo complete' : 'Application received';
  document.getElementById('success-text').textContent = result.demo
    ? 'Thanks, ' + first + '. This was a demo: your application was NOT saved or sent to the club.'
    : 'Thanks, ' + first + '. We received your application and will contact you at ' + values.email + '.';
  document.getElementById('s-email').textContent = values.email;
  document.getElementById('s-studies').textContent = values.level + ', ' + values.department;
  document.getElementById('s-interests').textContent = values.interests.join(', ');
  formView.hidden = true;
  success.hidden = false;
  success.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('again-btn').addEventListener('click', () => {
  form.reset();
  touched = false;
  showErrors({});
  counter.textContent = '0 / ' + MIN_MOTIVATION + ' characters minimum';
  btn.disabled = false;
  btn.classList.remove('is-loading');
  label.textContent = 'Send application';
  success.hidden = true;
  formView.hidden = false;
});
