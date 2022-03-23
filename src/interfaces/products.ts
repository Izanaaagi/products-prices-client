export interface Product {
  id: number;
  title: string;
  price: number;
  discount_price?: number;
  weight: string;
  category_id: number;
  store_title: string;
  store_id: number;
  count: number;
}
