export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export type ProductCreate = {
  name: string;
  price: number;
  stock: number;
};

export type ProductUpdate = Partial<ProductCreate>;
