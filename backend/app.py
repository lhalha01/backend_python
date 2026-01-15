
import os
import sqlite3
from typing import Generator, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DATABASE = "products.db"

app = FastAPI(title="Products API")


def _cors_origins() -> list[str]:
    raw = os.getenv("CORS_ALLOW_ORIGINS", "").strip()
    if raw:
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

    return [
        "http://localhost:4200",  # Angular console dev server
        "http://127.0.0.1:4200",
        "http://localhost:4300",  # Angular CRUD dev server
        "http://127.0.0.1:4300",
        "http://localhost:5173",  # Vite (React) dev server
        "http://127.0.0.1:5173",
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def _connect_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DATABASE, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = _connect_db()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL
            );
            """
        )
        conn.commit()
    finally:
        conn.close()


def get_db() -> Generator[sqlite3.Connection, None, None]:
    conn = _connect_db()
    try:
        yield conn
    finally:
        conn.close()


@app.on_event("startup")
def _startup() -> None:
    init_db()


class ProductBase(BaseModel):
    name: str = Field(min_length=1)
    price: float = Field(gt=0)
    stock: int = Field(ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1)
    price: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)


class Product(ProductBase):
    id: int


@app.get("/products", response_model=list[Product])
def list_products(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    rows = cursor.execute("SELECT id, name, price, stock FROM products").fetchall()
    return [dict(row) for row in rows]


def _get_product_or_404(product_id: int, db: sqlite3.Connection) -> dict:
    cursor = db.cursor()
    row = cursor.execute(
        "SELECT id, name, price, stock FROM products WHERE id = ?",
        (product_id,),
    ).fetchone()
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto con ID {product_id} no encontrado",
        )
    return dict(row)


@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int, db: sqlite3.Connection = Depends(get_db)):
    return _get_product_or_404(product_id, db)


@app.post("/products", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute(
            "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
            (payload.name, payload.price, payload.stock),
        )
        db.commit()
    except sqlite3.Error:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

    return {
        "id": cursor.lastrowid,
        "name": payload.name,
        "price": payload.price,
        "stock": payload.stock,
    }


@app.put("/products/{product_id}", response_model=Product)
def update_product(product_id: int, payload: ProductUpdate, db: sqlite3.Connection = Depends(get_db)):
    _ = _get_product_or_404(product_id, db)

    updates: list[str] = []
    values: list[object] = []

    if payload.name is not None:
        updates.append("name = ?")
        values.append(payload.name)
    if payload.price is not None:
        updates.append("price = ?")
        values.append(payload.price)
    if payload.stock is not None:
        updates.append("stock = ?")
        values.append(payload.stock)

    if not updates:
        raise HTTPException(status_code=400, detail="No se proporcionaron campos válidos para actualizar.")

    values.append(product_id)
    query = f"UPDATE products SET {', '.join(updates)} WHERE id = ?"

    cursor = db.cursor()
    try:
        cursor.execute(query, tuple(values))
        db.commit()
    except sqlite3.Error:
        raise HTTPException(status_code=500, detail="Error interno del servidor")

    return _get_product_or_404(product_id, db)


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: sqlite3.Connection = Depends(get_db)):
    _ = _get_product_or_404(product_id, db)
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
        db.commit()
    except sqlite3.Error:
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    return {"message": "Producto eliminado"}
