import { Injectable } from '@angular/core';
import type { Product, ProductInput } from './types';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  async list(baseUrl: string): Promise<Product[]> {
    const res = await fetch(`${baseUrl}/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async get(baseUrl: string, id: number): Promise<Product> {
    const res = await fetch(`${baseUrl}/products/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async create(baseUrl: string, product: ProductInput): Promise<Product> {
    const res = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async update(baseUrl: string, id: number, updates: Partial<ProductInput>): Promise<Product> {
    const res = await fetch(`${baseUrl}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async remove(baseUrl: string, id: number): Promise<{ message: string }> {
    const res = await fetch(`${baseUrl}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }
}
