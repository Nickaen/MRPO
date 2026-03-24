// Типы пользователей
export type UserRole = 'guest' | 'client' | 'manager' | 'admin';

export type User = {
  id: number;
  login: string;
  password: string;
  role: UserRole;
  fullName: string;
}

// Типы товаров
export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  manufacturer: string;
  supplier: string;
  price: number;
  unit: string;
  stockQuantity: number;
  discount: number;
  imageUrl: string | null;
}

// Типы заказов
export type OrderStatus = 'Новый' | 'В обработке' | 'В доставке' | 'Выполнен' | 'Отменен';

export type Order = {
  id: number;
  article: string;
  status: OrderStatus;
  pickupPoint: string;
  orderDate: string;
  deliveryDate: string | null;
}

// Контекст авторизации
export type AuthContextType = {
  user: User | null;
  login: (login: string, password: string) => boolean;
  logout: () => void;
  loginAsGuest: () => void;
}
