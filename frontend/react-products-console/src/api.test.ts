import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productsApi } from './api';

// Mock global fetch
global.fetch = vi.fn();

describe('productsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch products list', async () => {
    const mockProducts = [
      { id: 1, name: 'Test Product', price: 10, stock: 5 }
    ];
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(mockProducts),
      headers: {
        get: (name: string) => name === 'content-type' ? 'application/json' : null
      }
    });

    const result = await productsApi.list('http://localhost:8000');
    expect(result).toEqual(mockProducts);
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/products', expect.any(Object));
  });

  it('should create a product', async () => {
    const newProduct = { name: 'New Product', price: 20, stock: 10 };
    const createdProduct = { id: 1, ...newProduct };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(createdProduct),
      headers: {
        get: (name: string) => name === 'content-type' ? 'application/json' : null
      }
    });

    const result = await productsApi.create('http://localhost:8000', newProduct);
    expect(result).toEqual(createdProduct);
  });

  it('should update a product', async () => {
    const updatedData = { price: 25 };
    const updatedProduct = { id: 1, name: 'Product', price: 25, stock: 10 };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(updatedProduct),
      headers: {
        get: (name: string) => name === 'content-type' ? 'application/json' : null
      }
    });

    const result = await productsApi.update('http://localhost:8000', 1, updatedData);
    expect(result).toEqual(updatedProduct);
  });

  it('should delete a product', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ message: 'Deleted' }),
      headers: {
        get: (name: string) => name === 'content-type' ? 'application/json' : null
      }
    });

    await productsApi.remove('http://localhost:8000', 1);
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/products/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('should throw error on failed request', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: async () => 'Not Found',
      headers: {
        get: (name: string) => name === 'content-type' ? 'text/plain' : null
      }
    });

    await expect(productsApi.list('http://localhost:8000')).rejects.toThrow();
  });
});
