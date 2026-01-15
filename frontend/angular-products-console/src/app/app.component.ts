import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { ProductsApiService } from './products-api.service';
import type { Product } from './types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <div>
          <h1>Products API Console</h1>
          <p class="muted">Angular</p>
        </div>
        <div class="row">
          <label class="label">API Base URL</label>
          <input class="input" [(ngModel)]="apiBaseUrl" placeholder="http://127.0.0.1:8000" />
        </div>
      </header>

      <nav class="apiButtons">
        <button class="apiBtn" [class.active]="selectedApi === 'list'" (click)="selectApi('list')">
          <span class="method get">GET</span>
          <span class="endpoint">/products</span>
        </button>
        <button class="apiBtn" [class.active]="selectedApi === 'create'" (click)="selectApi('create')">
          <span class="method post">POST</span>
          <span class="endpoint">/products</span>
        </button>
        <button class="apiBtn" [class.active]="selectedApi === 'get'" (click)="selectApi('get')">
          <span class="method get">GET</span>
          <span class="endpoint">/products/{{ '{' }}id{{ '}' }}</span>
        </button>
        <button class="apiBtn" [class.active]="selectedApi === 'update'" (click)="selectApi('update')">
          <span class="method put">PUT</span>
          <span class="endpoint">/products/{{ '{' }}id{{ '}' }}</span>
        </button>
        <button class="apiBtn" [class.active]="selectedApi === 'delete'" (click)="selectApi('delete')">
          <span class="method delete">DELETE</span>
          <span class="endpoint">/products/{{ '{' }}id{{ '}' }}</span>
        </button>
      </nav>

      <div class="grid" *ngIf="selectedApi === 'list'">
        <section class="card fullWidth">
          <div class="cardHeader">
            <h2>GET /products - Listar todos los productos</h2>
            <button class="button" (click)="refresh()" [disabled]="busy">{{ busy ? 'Cargando...' : 'Ejecutar' }}</button>
          </div>

          <div *ngIf="error" class="error">{{ error }}</div>

          <div *ngIf="products.length === 0" class="muted">No hay productos (o no has cargado aún).</div>

          <table *ngIf="products.length > 0" class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td>{{ p.id }}</td>
                <td>{{ p.name }}</td>
                <td>{{ p.price }}</td>
                <td>{{ p.stock }}</td>
                <td style="text-align:right">
                  <button class="button danger" (click)="remove(p.id)" [disabled]="busy">Borrar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <div class="grid" *ngIf="selectedApi === 'create'">
        <section class="card fullWidth">
          <div class="cardHeader">
            <h2>POST /products - Crear nuevo producto</h2>
          </div>
          <div *ngIf="error" class="error">{{ error }}</div>
          <div class="form">
            <div class="row">
              <label class="label">Nombre</label>
              <input class="input" [(ngModel)]="createName" />
            </div>
            <div class="row">
              <label class="label">Precio</label>
              <input class="input" type="number" step="0.01" [(ngModel)]="createPrice" />
            </div>
            <div class="row">
              <label class="label">Stock</label>
              <input class="input" type="number" [(ngModel)]="createStock" />
            </div>
            <button class="button" (click)="create()" [disabled]="busy">Ejecutar</button>
          </div>
        </section>
      </div>

      <div class="grid" *ngIf="selectedApi === 'get'">
        <section class="card fullWidth">
          <div class="cardHeader">
            <h2>GET /products/{{ '{' }}id{{ '}' }} - Obtener producto por ID</h2>
          </div>
          <div *ngIf="error" class="error">{{ error }}</div>
          <div class="form">
            <div class="row">
              <label class="label">Product ID</label>
              <input class="input" type="number" [(ngModel)]="getProductId" />
            </div>
            <button class="button" (click)="getProduct()" [disabled]="busy">Ejecutar</button>
          </div>
          <div *ngIf="singleProduct" class="result">
            <h3>Resultado:</h3>
            <pre>{{ singleProduct | json }}</pre>
          </div>
        </section>
      </div>

      <div class="grid" *ngIf="selectedApi === 'update'">
        <section class="card fullWidth">
          <div class="cardHeader">
            <h2>PUT /products/{{ '{' }}id{{ '}' }} - Actualizar producto</h2>
          </div>
          <div *ngIf="error" class="error">{{ error }}</div>
          <div class="form">
            <div class="row">
              <label class="label">ID</label>
              <input class="input" type="number" [(ngModel)]="updateId" />
            </div>
            <div class="row">
              <label class="label">Nuevo precio</label>
              <input class="input" type="number" step="0.01" [(ngModel)]="updatePrice" />
            </div>
            <button class="button" (click)="updatePriceOnly()" [disabled]="busy">Ejecutar</button>
          </div>
        </section>
      </div>

      <div class="grid" *ngIf="selectedApi === 'delete'">
        <section class="card fullWidth">
          <div class="cardHeader">
            <h2>DELETE /products/{{ '{' }}id{{ '}' }} - Eliminar producto</h2>
          </div>
          <div *ngIf="error" class="error">{{ error }}</div>
          <div class="form">
            <div class="row">
              <label class="label">Product ID a eliminar</label>
              <input class="input" type="number" [(ngModel)]="deleteProductId" />
            </div>
            <button class="button danger" (click)="deleteProduct()" [disabled]="busy">Ejecutar</button>
          </div>
        </section>
      </div>

      <footer class="footer muted">
        Usa los botones de arriba para probar cada operación de la API
      </footer>
    </div>
  `,
  styles: [`
    .container { max-width: 1100px; margin: 0 auto; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 16px; }
    h1 { margin: 0; font-size: 22px; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    h2 { margin: 0 0 12px; font-size: 15px; color: var(--primary); font-weight: 600; }
    h3 { margin: 12px 0 8px; font-size: 14px; color: var(--accent); }
    .apiButtons { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .apiBtn { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1px solid var(--border); background: rgba(0,0,0,0.3); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .apiBtn:hover { border-color: var(--primary); background: rgba(168,85,247,0.1); }
    .apiBtn.active { border-color: var(--accent); background: rgba(236,72,153,0.15); box-shadow: 0 0 0 3px rgba(236,72,153,0.1); }
    .method { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .method.get { background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
    .method.post { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
    .method.put { background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
    .method.delete { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
    .endpoint { font-family: ui-monospace, monospace; font-size: 13px; color: var(--text); }
    .muted { color: var(--muted); }
    .grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .fullWidth { grid-column: 1 / -1; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 18px; backdrop-filter: blur(8px); box-shadow: 0 8px 32px rgba(168,85,247,0.15); }
    .cardHeader { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
    .form { margin-top: 12px; }
    .row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .label { font-size: 12px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .input { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: rgba(0,0,0,0.35); color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
    .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(168,85,247,0.15); }
    .button { border: 1px solid rgba(168,85,247,0.6); background: linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15)); color: var(--text); padding: 10px 14px; border-radius: 10px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(168,85,247,0.3); }
    .button:disabled { opacity: 0.5; cursor: not-allowed; }
    .danger { border-color: rgba(249,115,22,0.6); background: rgba(249,115,22,0.18); }
    .danger:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(249,115,22,0.3); }
    .error { border: 1px solid rgba(249,115,22,0.6); background: rgba(249,115,22,0.12); padding: 10px 12px; border-radius: 10px; margin-bottom: 12px; white-space: pre-wrap; }
    .result { margin-top: 16px; padding: 12px; background: rgba(0,0,0,0.35); border: 1px solid var(--border); border-radius: 10px; }
    .result pre { margin: 0; white-space: pre-wrap; font-size: 13px; color: var(--muted); }
    .table { width: 100%; border-collapse: collapse; }
    .table th, .table td { padding: 10px; border-bottom: 1px solid var(--border); text-align: left; }
    .table th { color: var(--primary); font-weight: 600; }
    .footer { margin-top: 16px; font-size: 12px; }
    @media (max-width: 980px) { .grid { grid-template-columns: 1fr; } .header { flex-direction: column; align-items: flex-start; } }
  `],
})
export class AppComponent {
  apiBaseUrl = environment.apiBaseUrl;
  selectedApi: 'list' | 'create' | 'get' | 'update' | 'delete' = 'list';

  products: Product[] = [];
  singleProduct: Product | null = null;
  busy = false;
  error: string | null = null;

  createName = 'Lapiz';
  createPrice = 1.5;
  createStock = 10;

  getProductId = 1;
  updateId = 1;
  updatePrice = 2.0;
  deleteProductId = 1;

  constructor(private readonly api: ProductsApiService) {}

  selectApi(api: 'list' | 'create' | 'get' | 'update' | 'delete'): void {
    this.selectedApi = api;
    this.error = null;
    this.singleProduct = null;
  }

  async refresh(): Promise<void> {
    this.error = null;
    this.busy = true;
    try {
      this.products = await this.api.list(this.apiBaseUrl);
    } catch (e: any) {
      this.error = e?.message ?? String(e);
    } finally {
      this.busy = false;
    }
  }

  async getProduct(): Promise<void> {
    this.error = null;
    this.busy = true;
    this.singleProduct = null;
    try {
      this.singleProduct = await this.api.list(this.apiBaseUrl).then(products => 
        products.find(p => p.id === Number(this.getProductId)) || null
      );
      if (!this.singleProduct) {
        this.error = `Producto con ID ${this.getProductId} no encontrado`;
      }
    } catch (e: any) {
      this.error = e?.message ?? String(e);
    } finally {
      this.busy = false;
    }
  }

  async create(): Promise<void> {
    this.error = null;
    this.busy = true;
    try {
      await this.api.create(this.apiBaseUrl, {
        name: this.createName,
        price: Number(this.createPrice),
        stock: Number(this.createStock),
      });
      this.error = null;
      alert('Producto creado correctamente');
    } catch (e: any) {
      this.error = e?.message ?? String(e);
    } finally {
      this.busy = false;
    }
  }

  async updatePriceOnly(): Promise<void> {
    this.error = null;
    this.busy = true;
    try {
      await this.api.update(this.apiBaseUrl, Number(this.updateId), { price: Number(this.updatePrice) });
      this.error = null;
      alert(`Producto ${this.updateId} actualizado correctamente`);
    } catch (e: any) {
      this.error = e?.message ?? String(e);
    } finally {
      this.busy = false;
    }
  }

  async deleteProduct(): Promise<void> {
    this.error = null;
    this.busy = true;
    try {
      await this.api.remove(this.apiBaseUrl, Number(this.deleteProductId));
      this.error = null;
      alert(`Producto ${this.deleteProductId} eliminado correctamente`);
    } catch (e: any) {
      this.error = e?.message ?? String(e);
    } finally {
      this.busy = false;
    }
  }

  async remove(id: number): Promise<void> {
    this.error = null;
    this.busy = true;
    try {
      await this.api.remove(this.apiBaseUrl, id);
      await this.refresh();
    } catch (e: any) {
      this.error = e?.message ?? String(e);
      this.busy = false;
    }
  }
}