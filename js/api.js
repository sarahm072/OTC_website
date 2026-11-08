
const API_URL = 'https://script.google.com/macros/s/AKfycbwvxC5qzpj5-ynwTYcNjW1cqthjapDYJMU8B4EY-AknqTSLxOWttd-ZTMQleEYxSA/exec';

async function submitApplication(data) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 1200));
    return { demo: true };
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // text/plain باش Google يقبل بلا preflight
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!result.ok) throw new Error('Your application could not be saved. Please try again.');
  return { demo: false };
}
