// In production (Docker), the frontend is served from the same origin as the backend,
// so the base path is relative: "/api". For separate dev servers, set VITE_API_URL.
const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

// A07: token stored in localStorage -> accessible to any XSS.
export const getToken = () => localStorage.getItem('token');
export const setToken = (t: string) => localStorage.setItem('token', t);
export const logout = () => localStorage.removeItem('token');

async function req(path: string, opts: RequestInit = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  login: (email: string, password: string) =>
    req('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    publicFiles: () => req('/notes/public'),
    notes: () => req('/notes'),
  note: (id: string) => req(`/notes/${id}`),
  search: (term: string) => req(`/notes/search?term=${encodeURIComponent(term)}`),
  createNote: (title: string, content: string) =>
    req('/notes', { method: 'POST', body: JSON.stringify({ title, content }) }),
  profile: (id: string) => req(`/users/${id}`),
  updateBio: (bio: string) =>
    req('/users/me/bio', { method: 'PUT', body: JSON.stringify({ bio }) }),
};
