import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductsApiService } from './products-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { Product } from './types';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ProductsApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        ProductsApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ProductsApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    spyOn(apiService, 'list').and.returnValue(Promise.resolve([]));
    
    component.ngOnInit();
    
    expect(apiService.list).toHaveBeenCalled();
  });

  it('should open create modal', () => {
    component.openCreateModal();
    
    expect(component.showModal).toBe(true);
    expect(component.isEditMode).toBe(false);
    expect(component.modalProduct).toEqual({
      name: '',
      price: 0,
      stock: 0
    });
  });

  it('should open edit modal', () => {
    const product: Product = { id: 1, name: 'Test', price: 10, stock: 5 };
    
    component.openEditModal(product);
    
    expect(component.showModal).toBe(true);
    expect(component.isEditMode).toBe(true);
    expect(component.modalProduct).toEqual(product);
  });

  it('should close modal', () => {
    component.showModal = true;
    component.closeModal();
    
    expect(component.showModal).toBe(false);
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Products CRUD');
  });

  it('should render create button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('.button.primary');
    expect(button?.textContent).toContain('Crear Producto');
  });
});
