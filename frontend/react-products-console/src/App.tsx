import React, { useMemo, useState } from 'react';
import { defaultApiBaseUrl, productsApi, rawRequest } from './api';
import type { Product } from './types';

type Tab = 'products' | 'request';

export function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState(defaultApiBaseUrl());
  const [tab, setTab] = useState<Tab>('products');

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Products API Console</h1>
          <p className="muted">React + Vite</p>
        </div>
        <div className="row">
          <label className="label">API Base URL</label>
          <input
            className="input"
            value={apiBaseUrl}
            onChange={(e) => setApiBaseUrl(e.target.value)}
            placeholder="http://127.0.0.1:8000"
          />
        </div>
      </header>

      <nav className="tabs">
        <button className={tab === 'products' ? 'tab tabActive' : 'tab'} onClick={() => setTab('products')}>
          Productos
        </button>
        <button className={tab === 'request' ? 'tab tabActive' : 'tab'} onClick={() => setTab('request')}>
          Request manual
        </button>
      </nav>

      {tab === 'products' ? <ProductsPanel apiBaseUrl={apiBaseUrl} /> : <RequestPanel apiBaseUrl={apiBaseUrl} />}

      <footer className="footer muted">
        Endpoints: GET/POST /products, GET/PUT/DELETE /products/{'{id}'}
      </footer>
    </div>
  );
}

function ProductsPanel({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createName, setCreateName] = useState('Lapiz');
  const [createPrice, setCreatePrice] = useState(1.5);
  const [createStock, setCreateStock] = useState(10);

  const [updateId, setUpdateId] = useState<number>(1);
  const [updatePrice, setUpdatePrice] = useState<number>(2.0);

  async function refresh() {
    setError(null);
    setBusy(true);
    try {
      const list = await productsApi.list(apiBaseUrl);
      setProducts(list);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    setError(null);
    setBusy(true);
    try {
      await productsApi.create(apiBaseUrl, { name: createName, price: createPrice, stock: createStock });
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setBusy(false);
    }
  }

  async function updatePriceOnly() {
    setError(null);
    setBusy(true);
    try {
      await productsApi.update(apiBaseUrl, updateId, { price: updatePrice });
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setBusy(false);
    }
  }

  async function remove(id: number) {
    setError(null);
    setBusy(true);
    try {
      await productsApi.remove(apiBaseUrl, id);
      await refresh();
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setBusy(false);
    }
  }

  const hasProducts = products.length > 0;

  return (
    <div className="grid">
      <section className="card">
        <div className="cardHeader">
          <h2>Listado</h2>
          <button className="button" onClick={refresh} disabled={busy}>
            {busy ? 'Cargando…' : 'Refrescar'}
          </button>
        </div>

        {error ? <div className="error">{error}</div> : null}

        {!hasProducts ? (
          <div className="muted">No hay productos (o no has cargado aún).</div>
        ) : (
          <table className="table">
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
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="button danger" onClick={() => remove(p.id)} disabled={busy}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card">
        <h2>Crear producto</h2>
        <div className="form">
          <div className="row">
            <label className="label">Nombre</label>
            <input className="input" value={createName} onChange={(e) => setCreateName(e.target.value)} />
          </div>
          <div className="row">
            <label className="label">Precio</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={createPrice}
              onChange={(e) => setCreatePrice(Number(e.target.value))}
            />
          </div>
          <div className="row">
            <label className="label">Stock</label>
            <input
              className="input"
              type="number"
              value={createStock}
              onChange={(e) => setCreateStock(Number(e.target.value))}
            />
          </div>
          <button className="button" onClick={create} disabled={busy}>
            Crear
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Actualizar precio</h2>
        <div className="form">
          <div className="row">
            <label className="label">ID</label>
            <input
              className="input"
              type="number"
              value={updateId}
              onChange={(e) => setUpdateId(Number(e.target.value))}
            />
          </div>
          <div className="row">
            <label className="label">Nuevo precio</label>
            <input
              className="input"
              type="number"
              step="0.01"
              value={updatePrice}
              onChange={(e) => setUpdatePrice(Number(e.target.value))}
            />
          </div>
          <button className="button" onClick={updatePriceOnly} disabled={busy}>
            Actualizar
          </button>
        </div>
      </section>
    </div>
  );
}

function RequestPanel({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/products');
  const [bodyText, setBodyText] = useState('');

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const prettyPlaceholder = useMemo(
    () => JSON.stringify({ name: 'Lapiz', price: 1.5, stock: 10 }, null, 2),
    [],
  );

  async function send() {
    setError(null);
    setBusy(true);
    setResult('');
    try {
      const resp = await rawRequest(apiBaseUrl, method, path, bodyText || undefined);
      const headerLines = Object.entries(resp.headers)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      setResult(`HTTP ${resp.status} ${resp.statusText}\n${headerLines}\n\n${resp.body}`);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <div className="cardHeader">
        <h2>Request manual</h2>
        <button className="button" onClick={send} disabled={busy}>
          {busy ? 'Enviando…' : 'Enviar'}
        </button>
      </div>

      <div className="grid2">
        <div className="row">
          <label className="label">Método</label>
          <select className="input" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>
        <div className="row">
          <label className="label">Path</label>
          <input className="input" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
      </div>

      <div className="row">
        <label className="label">Body (JSON)</label>
        <textarea
          className="textarea"
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          placeholder={prettyPlaceholder}
        />
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="row">
        <label className="label">Resultado</label>
        <pre className="pre">{result || '—'}</pre>
      </div>
    </section>
  );
}
