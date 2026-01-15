import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsApiService } from './products-api.service';
import type { Product } from './types';

describe('ProductsApiService', () => {
  let service: ProductsApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsApiService]
    });
    service = TestBed.inject(ProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products list', (done) => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Test Product', price: 10, stock: 5 }
    ];

    service.list('http://localhost:8000').then(products => {
      expect(products).toEqual(mockProducts);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8000/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create a product', (done) => {
    const newProduct = { name: 'New Product', price: 20, stock: 10 };
    const createdProduct: Product = { id: 1, ...newProduct };

    service.create('http://localhost:8000', newProduct).then(product => {
      expect(product).toEqual(createdProduct);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8000/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(createdProduct);
  });

  it('should update a product', (done) => {
    const updatedData = { price: 25 };
    const updatedProduct: Product = { id: 1, name: 'Product', price: 25, stock: 10 };

    service.update('http://localhost:8000', 1, updatedData).then(product => {
      expect(product).toEqual(updatedProduct);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8000/products/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedData);
    req.flush(updatedProduct);
  });

  it('should delete a product', (done) => {
    service.remove('http://localhost:8000', 1).then(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:8000/products/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
