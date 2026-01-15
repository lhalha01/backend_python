import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ProductsApiService } from './products-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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

  it('should have default selected API as list', () => {
    expect(component.selectedApi).toBe('list');
  });

  it('should change selected API', () => {
    component.selectApi('create');
    expect(component.selectedApi).toBe('create');
    expect(component.error).toBeNull();
  });

  it('should initialize with API base URL', () => {
    expect(component.apiBaseUrl).toBeTruthy();
  });

  it('should handle refresh operation', async () => {
    spyOn(apiService, 'list').and.returnValue(Promise.resolve([]));
    
    await component.refresh();
    
    expect(apiService.list).toHaveBeenCalled();
    expect(component.busy).toBe(false);
  });

  it('should handle errors during refresh', async () => {
    spyOn(apiService, 'list').and.returnValue(Promise.reject(new Error('Test error')));
    
    await component.refresh();
    
    expect(component.error).toBe('Test error');
    expect(component.busy).toBe(false);
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Products API Console');
  });

  it('should render API buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.apiBtn');
    expect(buttons.length).toBe(5);
  });
});
