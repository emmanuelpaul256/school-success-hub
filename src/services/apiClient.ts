const BASE_PATH = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('educonnect_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.access) return String(parsed.access);
      if (parsed?.token) return String(parsed.token);
    }
  } catch {
    // fallthrough to legacy keys
  }
  return localStorage.getItem('auth_token') || localStorage.getItem('educonnect_token') || null;
}

function buildUrl(path: string, query?: Record<string, any>) {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const url = new URL(`${BASE_PATH}${path}`, base || 'http://localhost');
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (Array.isArray(v)) {
        v.forEach((item) => url.searchParams.append(k, String(item)));
      } else {
        url.searchParams.set(k, String(v));
      }
    });
  }
  return url.toString();
}

async function request<T = any>(
  path: string,
  options: {
    method?: string;
    query?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = 'GET', query, body, headers = {} } = options;
  const url = buildUrl(path, query);

  const token = getToken();

  const init: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  };

  if (token) (init.headers as any)['Authorization'] = `Bearer ${token}`;

  if (body !== undefined && body !== null) {
    (init.headers as any)['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    // If token is expired or invalid, clear stored auth and redirect to login
    if (res.status === 401 || res.status === 403) {
      try {
        localStorage.removeItem('educonnect_auth');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('educonnect_token');
      } catch (e) {
        // ignore
      }
      if (typeof window !== 'undefined') {
        // Force navigation to login page
        window.location.href = '/login';
      }
    }

    const message = payload?.error?.message || payload?.message || res.statusText;
    const err: any = new Error(message || 'API request failed');
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload as T;
}

export const api = {
  get: <T = any>(path: string, query?: Record<string, any>) => request<T>(path, { method: 'GET', query }),
  post: <T = any>(path: string, body?: any) => request<T>(path, { method: 'POST', body }),
  put: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PUT', body }),
  patch: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PATCH', body }),
  del: <T = any>(path: string, body?: any) => request<T>(path, { method: 'DELETE', body }),
};

export default api;
