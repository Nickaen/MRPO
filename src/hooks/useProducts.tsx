import { useState, useCallback } from 'react';
import type { Product } from '@/types';
import { initialProducts } from '@/data/mockData';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    const newProduct = { ...product, id: newId };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: number): boolean => {
    // Проверяем, есть ли товар в заказах (здесь можно добавить проверку)
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return true;
  }, []);

  const getProductById = useCallback((id: number): Product | undefined => {
    return products.find((p) => p.id === id);
  }, [products]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
  };
}
