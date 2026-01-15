export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
}
