import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { LoginPage } from '@/pages/LoginPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductFormPage } from '@/pages/ProductFormPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderFormPage } from '@/pages/OrderFormPage';
import type { Product, Order } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type Page = 'login' | 'products' | 'product-form' | 'orders' | 'order-form';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const { user, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, addOrder, updateOrder, deleteOrder } = useOrders();

  // Получаем следующий ID для товара
  const getNextProductId = () => {
    return Math.max(...products.map((p) => p.id), 0) + 1;
  };

  // Получаем следующий ID для заказа
  const getNextOrderId = () => {
    return Math.max(...orders.map((o) => o.id), 0) + 1;
  };

  // Обработчики навигации
  const handleLogin = () => {
    setCurrentPage('products');
    toast.success(`Добро пожаловать, ${user?.fullName}!`);
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
    setEditingProduct(null);
    setEditingOrder(null);
    toast.info('Вы вышли из системы');
  };

  // Обработчики товаров
  const handleAddProduct = () => {
    setEditingProduct(null);
    setCurrentPage('product-form');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setCurrentPage('product-form');
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'>, _imageFile?: File) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Товар успешно обновлен');
    } else {
      addProduct(productData);
      toast.success('Товар успешно добавлен');
    }
    setCurrentPage('products');
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    // Проверяем, есть ли товар в заказах (в реальном приложении)
    // Здесь просто удаляем
    deleteProduct(id);
    toast.success('Товар успешно удален');
  };

  const handleCancelProductForm = () => {
    setCurrentPage('products');
    setEditingProduct(null);
  };

  // Обработчики заказов
  const handleViewOrders = () => {
    setCurrentPage('orders');
  };

  const handleBackFromOrders = () => {
    setCurrentPage('products');
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setCurrentPage('order-form');
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setCurrentPage('order-form');
  };

  const handleSaveOrder = (orderData: Omit<Order, 'id'>) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
      toast.success('Заказ успешно обновлен');
    } else {
      addOrder(orderData);
      toast.success('Заказ успешно добавлен');
    }
    setCurrentPage('orders');
    setEditingOrder(null);
  };

  const handleDeleteOrder = (id: number) => {
    deleteOrder(id);
    toast.success('Заказ успешно удален');
  };

  const handleCancelOrderForm = () => {
    setCurrentPage('orders');
    setEditingOrder(null);
  };

  // Рендер текущей страницы
  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;

      case 'products':
        return (
          <ProductsPage
            products={products}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onViewOrders={handleViewOrders}
            onLogout={handleLogout}
          />
        );

      case 'product-form':
        return (
          <ProductFormPage
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={handleCancelProductForm}
            nextId={getNextProductId()}
          />
        );

      case 'orders':
        return (
          <OrdersPage
            orders={orders}
            onAddOrder={handleAddOrder}
            onEditOrder={handleEditOrder}
            onDeleteOrder={handleDeleteOrder}
            onBack={handleBackFromOrders}
            onLogout={handleLogout}
          />
        );

      case 'order-form':
        return (
          <OrderFormPage
            order={editingOrder}
            onSave={handleSaveOrder}
            onCancel={handleCancelOrderForm}
            nextId={getNextOrderId()}
          />
        );

      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster position="top-right" />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
