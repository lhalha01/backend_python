import type { Product, ProductCreate, ProductUpdate } from './types';

export function defaultApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://127.0.0.1:8000';
}

async function apiFetch<T>(baseUrl: string, path: string, init?: RequestInit): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'Content-Type': 'application/json',
    },
  });

  const text = await response.text();
  const contentType = response.headers.get('content-type') ?? '';

  let parsed: unknown = text;
  if (contentType.includes('application/json') && text) {
    parsed = JSON.parse(text);
  }

  if (!response.ok) {
    const detail = typeof parsed === 'object' && parsed !== null && 'detail' in parsed ? (parsed as any).detail : text;
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${detail}`);
  }

  return parsed as T;
}

export const productsApi = {
  list: (baseUrl: string) => apiFetch<Product[]>(baseUrl, '/products', { method: 'GET' }),
  get: (baseUrl: string, id: number) => apiFetch<Product>(baseUrl, `/products/${id}`, { method: 'GET' }),
  create: (baseUrl: string, payload: ProductCreate) =>
    apiFetch<Product>(baseUrl, '/products', { method: 'POST', body: JSON.stringify(payload) }),
  update: (baseUrl: string, id: number, payload: ProductUpdate) =>
    apiFetch<Product>(baseUrl, `/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (baseUrl: string, id: number) => apiFetch<{ message: string }>(baseUrl, `/products/${id}`, { method: 'DELETE' }),
};

export async function rawRequest(
  baseUrl: string,
  method: string,
  path: string,
  bodyText?: string,
): Promise<{ status: number; statusText: string; headers: Record<string, string>; body: string }> {
  const url = `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

  const init: RequestInit = {
    method,
    headers: {},
  };

  if (bodyText && method !== 'GET' && method !== 'HEAD') {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = bodyText;
  }

  const resp = await fetch(url, init);
  const body = await resp.text();
  const headers: Record<string, string> = {};
  resp.headers.forEach((v, k) => {
    headers[k] = v;
  });

  return { status: resp.status, statusText: resp.statusText, headers, body };
}
