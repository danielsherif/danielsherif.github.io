export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface OrderDetails {
  customerInfo: CheckoutFormData;
  items: Product[];
  total: string;
}
