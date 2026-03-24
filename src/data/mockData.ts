import type { User, Product, Order } from '@/types';

// Пользователи системы
export const users: User[] = [
  { id: 1, login: 'client1', password: 'client123', role: 'client', fullName: 'Иванов Иван Иванович' },
  { id: 2, login: 'client2', password: 'client123', role: 'client', fullName: 'Петров Петр Петрович' },
  { id: 3, login: 'manager1', password: 'manager123', role: 'manager', fullName: 'Сидорова Анна Михайловна' },
  { id: 4, login: 'manager2', password: 'manager123', role: 'manager', fullName: 'Козлов Дмитрий Сергеевич' },
  { id: 5, login: 'admin', password: 'admin123', role: 'admin', fullName: 'Администратор Системы' },
];

// Товары (обувь)
export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Кроссовки Nike Air Max',
    category: 'Кроссовки',
    description: 'Спортивные кроссовки с воздушной подушкой для комфортной ходьбы и бега',
    manufacturer: 'Nike',
    supplier: 'Спортивный мир',
    price: 8990,
    unit: 'пара',
    stockQuantity: 15,
    discount: 10,
    imageUrl: null,
  },
  {
    id: 2,
    name: 'Ботинки Timberland Classic',
    category: 'Ботинки',
    description: 'Классические кожаные ботинки для повседневной носки',
    manufacturer: 'Timberland',
    supplier: 'Обувной рай',
    price: 15990,
    unit: 'пара',
    stockQuantity: 8,
    discount: 0,
    imageUrl: null,
  },
  {
    id: 3,
    name: 'Туфли ECCO Soft',
    category: 'Туфли',
    description: 'Кожаные туфли для деловых встреч и офиса',
    manufacturer: 'ECCO',
    supplier: 'Элитная обувь',
    price: 12990,
    unit: 'пара',
    stockQuantity: 0,
    discount: 20,
    imageUrl: null,
  },
  {
    id: 4,
    name: 'Кеды Converse All Star',
    category: 'Кеды',
    description: 'Легендарные кеды для молодежного стиля',
    manufacturer: 'Converse',
    supplier: 'Спортивный мир',
    price: 4990,
    unit: 'пара',
    stockQuantity: 25,
    discount: 5,
    imageUrl: null,
  },
  {
    id: 5,
    name: 'Сапоги зимние Columbia',
    category: 'Сапоги',
    description: 'Теплые зимние сапоги с водоотталкивающей пропиткой',
    manufacturer: 'Columbia',
    supplier: 'Зимняя сказка',
    price: 11990,
    unit: 'пара',
    stockQuantity: 12,
    discount: 25,
    imageUrl: null,
  },
  {
    id: 6,
    name: 'Сандалии Adidas Adilette',
    category: 'Сандалии',
    description: 'Удобные пляжные сандалии',
    manufacturer: 'Adidas',
    supplier: 'Спортивный мир',
    price: 2990,
    unit: 'пара',
    stockQuantity: 30,
    discount: 0,
    imageUrl: null,
  },
  {
    id: 7,
    name: 'Туфли на каблуке Mango',
    category: 'Туфли',
    description: 'Элегантные женские туфли на среднем каблуке',
    manufacturer: 'Mango',
    supplier: 'Модный дом',
    price: 6990,
    unit: 'пара',
    stockQuantity: 5,
    discount: 18,
    imageUrl: null,
  },
  {
    id: 8,
    name: 'Кроссовки Puma RS-X',
    category: 'Кроссовки',
    description: 'Современные кроссовки в стиле ретро',
    manufacturer: 'Puma',
    supplier: 'Спортивный мир',
    price: 7990,
    unit: 'пара',
    stockQuantity: 0,
    discount: 0,
    imageUrl: null,
  },
  {
    id: 9,
    name: 'Ботинки Dr. Martens',
    category: 'Ботинки',
    description: 'Культовые ботинки с желтой строчкой',
    manufacturer: 'Dr. Martens',
    supplier: 'Обувной рай',
    price: 18990,
    unit: 'пара',
    stockQuantity: 7,
    discount: 30,
    imageUrl: null,
  },
  {
    id: 10,
    name: 'Мокасины Geox',
    category: 'Мокасины',
    description: 'Комфортные мокасины с дышащей подошвой',
    manufacturer: 'Geox',
    supplier: 'Элитная обувь',
    price: 9990,
    unit: 'пара',
    stockQuantity: 18,
    discount: 12,
    imageUrl: null,
  },
];

// Заказы
export const initialOrders: Order[] = [
  {
    id: 1,
    article: 'ORD-2024-001',
    status: 'Выполнен',
    pickupPoint: 'ул. Ленина, 15',
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-20',
  },
  {
    id: 2,
    article: 'ORD-2024-002',
    status: 'В обработке',
    pickupPoint: 'пр. Мира, 42',
    orderDate: '2024-01-18',
    deliveryDate: null,
  },
  {
    id: 3,
    article: 'ORD-2024-003',
    status: 'Новый',
    pickupPoint: 'ул. Гагарина, 8',
    orderDate: '2024-01-20',
    deliveryDate: null,
  },
  {
    id: 4,
    article: 'ORD-2024-004',
    status: 'В доставке',
    pickupPoint: 'ул. Пушкина, 25',
    orderDate: '2024-01-10',
    deliveryDate: null,
  },
  {
    id: 5,
    article: 'ORD-2024-005',
    status: 'Отменен',
    pickupPoint: 'ул. Ленина, 15',
    orderDate: '2024-01-05',
    deliveryDate: null,
  },
];

// Категории товаров
export const categories = ['Кроссовки', 'Ботинки', 'Туфли', 'Кеды', 'Сапоги', 'Сандалии', 'Мокасины'];

// Производители
export const manufacturers = ['Nike', 'Timberland', 'ECCO', 'Converse', 'Columbia', 'Adidas', 'Mango', 'Puma', 'Dr. Martens', 'Geox'];

// Поставщики
export const suppliers = ['Спортивный мир', 'Обувной рай', 'Элитная обувь', 'Зимняя сказка', 'Модный дом'];

// Статусы заказов
export const orderStatuses = ['Новый', 'В обработке', 'В доставке', 'Выполнен', 'Отменен'];
