const API_URL = 'https://script.google.com/macros/s/AKfycbz02zI1ZOQ-McHx-OpG7bVCx53RMaiyRGFU93CrnylLqI2VIlY2kHRV6Axd4-rjITqr/exec';

async function submitApplication(data) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 1200));
    return { demo: true };
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    // text/plain باش المتصفح ما يدير preflight (Google ما يقبلوش)
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!result.ok) throw new Error('Your application could not be saved. Please try again.');
  return { demo: false };
}
