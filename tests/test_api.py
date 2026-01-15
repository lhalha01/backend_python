"""
Tests para la API de productos
"""
import pytest
from fastapi.testclient import TestClient
import app as app_module
import sqlite3
import os


@pytest.fixture(scope="function")
def test_db():
    """Crear base de datos de test"""
    test_db_path = "test_products.db"
    # Eliminar DB de test si existe
    if os.path.exists(test_db_path):
        os.remove(test_db_path)
    
    yield test_db_path
    
    # Limpiar después del test
    if os.path.exists(test_db_path):
        os.remove(test_db_path)


@pytest.fixture(scope="function")
def client(test_db, monkeypatch):
    """Cliente de test con base de datos temporal"""
    # Parchear el nombre de la base de datos en el módulo app
    monkeypatch.setattr(app_module, "DATABASE", test_db)
    
    # Inicializar la base de datos
    app_module.init_db()
    
    with TestClient(app_module.app) as c:
        yield c


def test_read_products_empty(client):
    """Test: Listar productos cuando no hay ninguno"""
    response = client.get("/products")
    assert response.status_code == 200
    assert response.json() == []


def test_create_product(client):
    """Test: Crear un producto"""
    product_data = {
        "name": "Laptop",
        "price": 999.99,
        "stock": 10
    }
    response = client.post("/products", json=product_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Laptop"
    assert data["price"] == 999.99
    assert data["stock"] == 10
    assert "id" in data


def test_create_product_validation(client):
    """Test: Validación al crear producto"""
    # Precio negativo
    response = client.post("/products", json={
        "name": "Test",
        "price": -10,
        "stock": 5
    })
    assert response.status_code == 422
    
    # Stock negativo
    response = client.post("/products", json={
        "name": "Test",
        "price": 10,
        "stock": -5
    })
    assert response.status_code == 422


def test_read_product(client):
    """Test: Obtener un producto por ID"""
    # Crear producto
    product_data = {"name": "Mouse", "price": 25.50, "stock": 50}
    create_response = client.post("/products", json=product_data)
    product_id = create_response.json()["id"]
    
    # Obtener producto
    response = client.get(f"/products/{product_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_id
    assert data["name"] == "Mouse"
    assert data["price"] == 25.50


def test_read_product_not_found(client):
    """Test: Obtener producto inexistente"""
    response = client.get("/products/9999")
    assert response.status_code == 404


def test_update_product(client):
    """Test: Actualizar un producto"""
    # Crear producto
    product_data = {"name": "Teclado", "price": 50.0, "stock": 20}
    create_response = client.post("/products", json=product_data)
    product_id = create_response.json()["id"]
    
    # Actualizar precio
    update_response = client.put(
        f"/products/{product_id}",
        json={"price": 45.0}
    )
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["price"] == 45.0
    assert data["name"] == "Teclado"
    assert data["stock"] == 20


def test_update_product_not_found(client):
    """Test: Actualizar producto inexistente"""
    response = client.put(
        "/products/9999",
        json={"price": 100.0}
    )
    assert response.status_code == 404


def test_delete_product(client):
    """Test: Eliminar un producto"""
    # Crear producto
    product_data = {"name": "Monitor", "price": 200.0, "stock": 5}
    create_response = client.post("/products", json=product_data)
    product_id = create_response.json()["id"]
    
    # Eliminar producto
    delete_response = client.delete(f"/products/{product_id}")
    assert delete_response.status_code == 200
    
    # Verificar que no existe
    get_response = client.get(f"/products/{product_id}")
    assert get_response.status_code == 404


def test_delete_product_not_found(client):
    """Test: Eliminar producto inexistente"""
    response = client.delete("/products/9999")
    assert response.status_code == 404


def test_cors_headers(client):
    """Test: Verificar headers CORS"""
    response = client.get("/products", headers={"Origin": "http://localhost:4200"})
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] in ["http://localhost:4200", "*"]


def test_product_list_after_operations(client):
    """Test: Verificar lista de productos después de operaciones CRUD"""
    # Crear varios productos
    products = [
        {"name": "Producto A", "price": 10.0, "stock": 5},
        {"name": "Producto B", "price": 20.0, "stock": 10},
        {"name": "Producto C", "price": 30.0, "stock": 15}
    ]
    
    for p in products:
        client.post("/products", json=p)
    
    # Listar productos
    response = client.get("/products")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert all("id" in p for p in data)
