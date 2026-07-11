export interface Item {
  id: number;
  name: string;
  quantity: number;
  qr_code: string;
  category: string;
  location: string;
  min_quantity: number;
  status: string;
  created_at: string;
  description:string;
}

export interface Transaction {
  id: number;
  item_id: number;
  transaction_type: 'in' | 'out';
  quantity: number;
  notes: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}
