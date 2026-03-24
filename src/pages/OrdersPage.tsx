import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  ShoppingCart,
  LogOut,
} from 'lucide-react';

interface OrdersPageProps {
  orders: Order[];
  onAddOrder: () => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: number) => void;
  onBack: () => void;
  onLogout: () => void;
}

const statusColors: Record<string, string> = {
  'Новый': 'bg-blue-500',
  'В обработке': 'bg-yellow-500',
  'В доставке': 'bg-purple-500',
  'Выполнен': 'bg-green-500',
  'Отменен': 'bg-red-500',
};

export function OrdersPage({
  orders,
  onAddOrder,
  onEditOrder,
  onDeleteOrder,
  onBack,
  onLogout,
}: OrdersPageProps) {
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const isAdmin = user?.role === 'admin';

  const handleDeleteClick = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      onDeleteOrder(orderToDelete.id);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Заказы</h1>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? 'Управление заказами' : 'Просмотр заказов'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Кнопка добавления */}
        {isAdmin && (
          <div className="mb-6">
            <Button onClick={onAddOrder}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить заказ
            </Button>
          </div>
        )}

        {/* Таблица заказов */}
        <Card>
          <CardHeader>
            <CardTitle>Список заказов ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Артикул</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Адрес пункта выдачи</TableHead>
                    <TableHead>Дата заказа</TableHead>
                    <TableHead>Дата выдачи</TableHead>
                    {isAdmin && <TableHead className="w-[100px]">Действия</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={isAdmin ? 6 : 5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Заказы не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.article}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.pickupPoint}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEditOrder(order)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(order)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить заказ &quot;{orderToDelete?.article}&quot;?
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
