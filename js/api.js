const API_URL = 'https://script.google.com/macros/s/AKfycbxuQRBUBvuOVI3uFE9qOFubRSQguoOyj10FTVEm7CIrpwM4vUhRvX8c9jXE_qadf0FE/exec';

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
