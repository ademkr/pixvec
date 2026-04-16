// Pixvec API Client — sunucu taraflı işlemler için

const API_BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function vectorizeOnServer(
  file: File,
  options: Record<string, unknown>
): Promise<{ svg: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('options', JSON.stringify(options));

  const res = await fetch(`${API_BASE}/api/vectorize`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Vectorization failed: ${res.statusText}`);
  }

  return res.json();
}
