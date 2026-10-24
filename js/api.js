const API_URL = 'https://script.google.com/macros/s/AKfycbxblCn3gkSW0_jTopu8RM9Z2k6PNZv0GOvp3mxUCZw1LpdEyMX_tW0Ad2SnMVf8IePy/exec';

async function submitApplication(data) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 1200));
    return { demo: true };
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!result.ok) throw new Error('Your application could not be saved. Please try again.');
  return { demo: false };
}
