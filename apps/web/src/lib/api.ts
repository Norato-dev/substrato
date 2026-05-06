const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json();
    const message = Array.isArray(error.error)
      ? error.error.map((e: any) => e.message).join(', ')
      : error.error || 'Error en la petición';
    throw new Error(message);
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
  comments: {
    create: (data: { content: string; postId: string; parentId?: string }, token: string) =>
      request('/comments', { method: 'POST', body: JSON.stringify(data), headers: { Authorization: `Bearer ${token}` } }),
    delete: (id: string, token: string) =>
      request(`/comments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),
  },
};