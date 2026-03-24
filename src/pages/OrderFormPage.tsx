import { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { orderStatuses } from '@/data/mockData';

interface OrderFormPageProps {
  order?: Order | null;
  onSave: (order: Omit<Order, 'id'>) => void;
  onCancel: () => void;
  nextId?: number;
}

export function OrderFormPage({
  order,
  onSave,
  onCancel,
  nextId,
}: OrderFormPageProps) {
  const isEditing = !!order;

  const [formData, setFormData] = useState<Partial<Order>>({
    article: '',
    status: 'Новый',
    pickupPoint: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData(order);
    } else {
      // Генерируем артикул для нового заказа
      const date = new Date();
      const year = date.getFullYear();
      const random = Math.floor(Math.random() * 900) + 100;
      setFormData((prev) => ({
        ...prev,
        article: `ORD-${year}-${random}`,
      }));
    }
  }, [order]);

  const handleChange = (field: keyof Order, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.article?.trim()) {
      newErrors.article = 'Введите артикул заказа';
    }

    if (!formData.status) {
      newErrors.status = 'Выберите статус заказа';
    }

    if (!formData.pickupPoint?.trim()) {
      newErrors.pickupPoint = 'Введите адрес пункта выдачи';
    }

    if (!formData.orderDate) {
      newErrors.orderDate = 'Выберите дату заказа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const orderData: Omit<Order, 'id'> = {
      article: formData.article || '',
      status: (formData.status as OrderStatus) || 'Новый',
      pickupPoint: formData.pickupPoint || '',
      orderDate: formData.orderDate || '',
      deliveryDate: formData.deliveryDate || null,
    };

    onSave(orderData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-xl font-bold">
              {isEditing ? 'Редактирование заказа' : 'Добавление заказа'}
            </h1>
          </div>
        </div>
      </header>

      {/* Форма */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Информация о заказе</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID заказа (только для редактирования) */}
              {isEditing && order && (
                <div>
                  <Label>ID заказа</Label>
                  <Input value={order.id} disabled className="bg-gray-100" />
                </div>
              )}

              {!isEditing && nextId && (
                <div>
                  <Label>ID заказа (будет присвоен автоматически)</Label>
                  <Input value={nextId} disabled className="bg-gray-100" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Артикул */}
                <div className="space-y-2">
                  <Label htmlFor="article">
                    Артикул <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="article"
                    value={formData.article}
                    onChange={(e) => handleChange('article', e.target.value)}
                    placeholder="Введите артикул"
                  />
                  {errors.article && (
                    <p className="text-sm text-red-500">{errors.article}</p>
                  )}
                </div>

                {/* Статус */}
                <div className="space-y-2">
                  <Label htmlFor="status">
                    Статус <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-red-500">{errors.status}</p>
                  )}
                </div>

                {/* Дата заказа */}
                <div className="space-y-2">
                  <Label htmlFor="orderDate">
                    Дата заказа <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={formData.orderDate || ''}
                    onChange={(e) => handleChange('orderDate', e.target.value)}
                  />
                  {errors.orderDate && (
                    <p className="text-sm text-red-500">{errors.orderDate}</p>
                  )}
                </div>

                {/* Дата выдачи */}
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Дата выдачи</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate || ''}
                    onChange={(e) =>
                      handleChange('deliveryDate', e.target.value || null)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Оставьте пустым, если заказ еще не выдан
                  </p>
                </div>
              </div>

              {/* Адрес пункта выдачи */}
              <div className="space-y-2">
                <Label htmlFor="pickupPoint">
                  Адрес пункта выдачи <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pickupPoint"
                  value={formData.pickupPoint}
                  onChange={(e) => handleChange('pickupPoint', e.target.value)}
                  placeholder="Введите адрес пункта выдачи"
                />
                {errors.pickupPoint && (
                  <p className="text-sm text-red-500">{errors.pickupPoint}</p>
                )}
              </div>

              {/* Кнопки */}
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Отмена
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Сохранить изменения' : 'Добавить заказ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
