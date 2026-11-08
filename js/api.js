
const API_URL = 'https://script.google.com/macros/s/AKfycbwrnaeSKoPEfkv2jn4NNm7dNeOZmcerVPxC3npCW4QZKVCxETCICSg2X49wBD5i_hU_/exec';

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
