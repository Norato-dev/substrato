const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error en la petición');
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; username: string; password: string; name: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: (token: string) =>
      request('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
  },
  posts: {
    list: (params?: { status?: string; page?: number; featured?: boolean }) => {
      const query = new URLSearchParams(params as any).toString();
      return request(`/posts${query ? `?${query}` : ''}`);
    },
    get: (slug: string) => request(`/posts/${slug}`),
    create: (data: any, token: string) =>
      request('/posts', { method: 'POST', body: JSON.stringify(data), headers: { Authorization: `Bearer ${token}` } }),
    update: (id: string, data: any, token: string) =>
      request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { Authorization: `Bearer ${token}` } }),
    delete: (id: string, token: string) =>
      request(`/posts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),
  },
  categories: {
    list: () => request('/categories'),
    create: (data: { name: string; color?: string }, token: string) =>
      request('/categories', { method: 'POST', body: JSON.stringify(data), headers: { Authorization: `Bearer ${token}` } }),
  },
};