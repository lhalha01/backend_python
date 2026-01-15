import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { ProductsApiService } from './products-api.service';
import type { Product, ProductInput } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <h1>🛒 Products CRUD</h1>
        <p class="subtitle">Gestión completa de productos - Angular</p>
      </header>

      <div class="actions">
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span class="icon">➕</span> Crear Producto
        </button>
        <button class="btn btn-secondary" (click)="loadProducts()" [disabled]="loading">
          <span class="icon">🔄</span> {{ loading ? 'Cargando...' : 'Refrescar' }}
        </button>
      </div>

      <div *ngIf="error" class="alert alert-error">
        <span class="icon">⚠️</span>
        <span>{{ error }}</span>
        <button class="close" (click)="error = null">✕</button>
      </div>

      <div *ngIf="success" class="alert alert-success">
        <span class="icon">✓</span>
        <span>{{ success }}</span>
        <button class="close" (click)="success = null">✕</button>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="5" class="loading-row">Cargando productos...</td>
            </tr>
            <tr *ngIf="!loading && products.length === 0">
              <td colspan="5" class="empty-row">No hay productos. Crea uno para empezar.</td>
            </tr>
            <tr *ngFor="let product of products" class="product-row">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>\${{ product.price.toFixed(2) }}</td>
              <td>
                <span class="stock-badge" [class.low-stock]="product.stock < 5">
                  {{ product.stock }} unidades
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn btn-sm btn-edit" (click)="openEditModal(product)" title="Editar">
                  ✏️
                </button>
                <button class="btn btn-sm btn-danger" (click)="deleteProduct(product)" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingProduct ? 'Editar Producto' : 'Crear Producto' }}</h2>
            <button class="close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Nombre</label>
              <input 
                id="name"
                class="input" 
                [(ngModel)]="form.name" 
                placeholder="Ej: Laptop HP"
                [disabled]="saving"
              />
            </div>
            <div class="form-group">
              <label for="price">Precio (\$)</label>
              <input 
                id="price"
                type="number" 
                step="0.01" 
                class="input" 
                [(ngModel)]="form.price" 
                placeholder="0.00"
                [disabled]="saving"
              />
            </div>
            <div class="form-group">
              <label for="stock">Stock (unidades)</label>
              <input 
                id="stock"
                type="number" 
                class="input" 
                [(ngModel)]="form.stock" 
                placeholder="0"
                [disabled]="saving"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" (click)="closeModal()" [disabled]="saving">
              Cancelar
            </button>
            <button class="btn btn-primary" (click)="saveProduct()" [disabled]="saving || !isFormValid()">
              {{ saving ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    h1 {
      font-size: 36px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }

    .subtitle {
      color: var(--text-muted);
      font-size: 14px;
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--border);
    }

    .btn-danger {
      background: var(--danger);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: var(--danger-dark);
    }

    .btn-edit {
      background: var(--warning);
      color: white;
    }

    .btn-edit:hover:not(:disabled) {
      background: #d97706;
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--surface);
      color: var(--text);
    }

    .btn-sm {
      padding: 6px 10px;
      font-size: 16px;
    }

    .icon {
      font-size: 16px;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      position: relative;
    }

    .alert-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #6ee7b7;
    }

    .alert .close {
      margin-left: auto;
      background: none;
      border: none;
      color: inherit;
      font-size: 20px;
      cursor: pointer;
      padding: 0 4px;
      opacity: 0.7;
    }

    .alert .close:hover {
      opacity: 1;
    }

    .table-container {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    .table thead {
      background: rgba(59, 130, 246, 0.1);
    }

    .table th {
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: var(--primary);
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .table td {
      padding: 16px;
      border-top: 1px solid var(--border);
    }

    .product-row {
      transition: background 0.2s;
    }

    .product-row:hover {
      background: rgba(59, 130, 246, 0.05);
    }

    .loading-row,
    .empty-row {
      text-align: center;
      color: var(--text-muted);
      padding: 48px 16px !important;
      font-style: italic;
    }

    .stock-badge {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(16, 185, 129, 0.2);
      color: var(--secondary);
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
    }

    .stock-badge.low-stock {
      background: rgba(239, 68, 68, 0.2);
      color: var(--danger);
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.3s;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
    }

    .modal-header h2 {
      font-size: 20px;
      font-weight: 600;
    }

    .modal-header .close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .modal-header .close:hover {
      background: var(--border);
      color: var(--text);
    }

    .modal-body {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input {
      width: 100%;
      padding: 10px 14px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-size: 14px;
      transition: all 0.2s;
    }

    .input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    .input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid var(--border);
    }

    @media (max-width: 768px) {
      .container {
        padding: 20px 16px;
      }

      h1 {
        font-size: 28px;
      }

      .actions {
        flex-direction: column;
      }

      .table-container {
        overflow-x: auto;
      }

      .table {
        min-width: 600px;
      }
    }
  `],
})
export class AppComponent implements OnInit {
  apiBaseUrl = environment.apiBaseUrl;
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  showModal = false;
  editingProduct: Product | null = null;
  saving = false;

  form = {
    name: '',
    price: 0,
    stock: 0,
  };

  constructor(private readonly api: ProductsApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.products = await this.api.list(this.apiBaseUrl);
    } catch (e: any) {
      this.error = e?.message ?? 'Error al cargar productos';
    } finally {
      this.loading = false;
    }
  }

  openCreateModal(): void {
    this.editingProduct = null;
    this.form = { name: '', price: 0, stock: 0 };
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.form = {
      name: product.name,
      price: product.price,
      stock: product.stock,
    };
    this.showModal = true;
  }

  closeModal(): void {
    if (!this.saving) {
      this.showModal = false;
      this.editingProduct = null;
    }
  }

  isFormValid(): boolean {
    return (
      this.form.name.trim().length > 0 &&
      this.form.price > 0 &&
      this.form.stock >= 0
    );
  }

  async saveProduct(): Promise<void> {
    if (!this.isFormValid()) return;

    this.saving = true;
    this.error = null;
    this.success = null;

    try {
      if (this.editingProduct) {
        await this.api.update(this.apiBaseUrl, this.editingProduct.id, {
          name: this.form.name,
          price: this.form.price,
          stock: this.form.stock,
        });
        this.success = `Producto "${this.form.name}" actualizado correctamente`;
      } else {
        await this.api.create(this.apiBaseUrl, {
          name: this.form.name,
          price: this.form.price,
          stock: this.form.stock,
        });
        this.success = `Producto "${this.form.name}" creado correctamente`;
      }
      await this.loadProducts();
      this.closeModal();
    } catch (e: any) {
      this.error = e?.message ?? 'Error al guardar producto';
    } finally {
      this.saving = false;
    }
  }

  async deleteProduct(product: Product): Promise<void> {
    if (!confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      return;
    }

    this.error = null;
    this.success = null;

    try {
      await this.api.remove(this.apiBaseUrl, product.id);
      this.success = `Producto "${product.name}" eliminado correctamente`;
      await this.loadProducts();
    } catch (e: any) {
      this.error = e?.message ?? 'Error al eliminar producto';
    }
  }
}
