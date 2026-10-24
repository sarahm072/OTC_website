const API_URL = 'https://script.google.com/macros/s/AKfycbx5c-AKqE-vO6SrsXoW5uV7dOGqy3G9szDZkhTQ4eMRG5WU_lD7Lc45Zj2YFUQ3QDEK/exec';


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