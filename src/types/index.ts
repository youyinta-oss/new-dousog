export interface Product {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  image: string;
  screenshots: string[];
  stars: number;
  downloads: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Category = 'all' | 'tools' | 'plugins' | 'apps' | 'themes';
