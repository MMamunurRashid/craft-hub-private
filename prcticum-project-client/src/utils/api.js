export async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      const error = new Error('Network response was not ok');
      error.status = res.status;
      error.body = text;
      throw error;
    }
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  } catch (err) {
    console.error('safeFetch error:', err);
    throw err;
  }
}
