import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import type { Product, ProductCreate, ProductUpdate } from './types';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  constructor(private readonly http: HttpClient) {}

  list(baseUrl: string): Promise<Product[]> {
    return firstValueFrom(this.http.get<Product[]>(`${baseUrl.replace(/\/$/, '')}/products`));
  }

  create(baseUrl: string, payload: ProductCreate): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(`${baseUrl.replace(/\/$/, '')}/products`, payload));
  }

  update(baseUrl: string, id: number, payload: ProductUpdate): Promise<Product> {
    return firstValueFrom(this.http.put<Product>(`${baseUrl.replace(/\/$/, '')}/products/${id}`, payload));
  }

  remove(baseUrl: string, id: number): Promise<{ message: string }> {
    return firstValueFrom(this.http.delete<{ message: string }>(`${baseUrl.replace(/\/$/, '')}/products/${id}`));
  }
}
