import { useState, useCallback } from 'react';
import type { Order } from '@/types';
import { initialOrders } from '@/data/mockData';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = useCallback((order: Omit<Order, 'id'>) => {
    const newId = Math.max(...orders.map((o) => o.id), 0) + 1;
    const newOrder = { ...order, id: newId };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  }, [orders]);

  const updateOrder = useCallback((id: number, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    );
  }, []);

  const deleteOrder = useCallback((id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const getOrderById = useCallback((id: number): Order | undefined => {
    return orders.find((o) => o.id === id);
  }, [orders]);

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
  };
}
