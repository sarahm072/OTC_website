// الملف الوحيد اللي يهدر مع الباكند.
// API_URL فارغ = وضع تجريبي: ما يتصيفط والو لحتى بلاصة.
// كي يوجد الباكند، حط الرابط هنا (رابط عام، ماشي سر).
const API_URL = '';

async function submitApplication(data) {
  if (!API_URL) {
    await new Promise((r) => setTimeout(r, 1200)); // محاكاة تحميل
    return { demo: true };
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('The server could not accept your application. Please try again.');
  return { demo: false };
}
