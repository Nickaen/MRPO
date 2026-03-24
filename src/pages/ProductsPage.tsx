import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/types';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  ArrowUpDown,
  ShoppingCart,
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { suppliers } from '@/data/mockData';

interface ProductsPageProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onViewOrders: () => void;
  onLogout: () => void;
}

export function ProductsPage({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewOrders,
  onLogout,
}: ProductsPageProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const isGuest = user?.role === 'guest';
  const isClient = user?.role === 'client';
  const isManager = user?.role === 'manager';
  const isAdmin = user?.role === 'admin';

  const canFilterSortSearch = isManager || isAdmin;
  const canEdit = isAdmin;

  // Фильтрация, сортировка и поиск
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Поиск (только для менеджера и админа)
    if (canFilterSortSearch && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.manufacturer.toLowerCase().includes(query) ||
          p.supplier.toLowerCase().includes(query)
      );
    }

    // Фильтрация по поставщику (только для менеджера и админа)
    if (canFilterSortSearch && selectedSupplier && selectedSupplier !== 'all') {
      result = result.filter((p) => p.supplier === selectedSupplier);
    }

    // Сортировка по количеству на складе (только для менеджера и админа)
    if (canFilterSortSearch && sortDirection) {
      result.sort((a, b) => {
        if (sortDirection === 'asc') {
          return a.stockQuantity - b.stockQuantity;
        } else {
          return b.stockQuantity - a.stockQuantity;
        }
      });
    }

    return result;
  }, [products, searchQuery, selectedSupplier, sortDirection, canFilterSortSearch]);

  const handleSort = () => {
    if (!canFilterSortSearch) return;
    if (sortDirection === null) {
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortDirection(null);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Функция для определения стиля строки
  const getRowStyle = (product: Product): React.CSSProperties => {
    // Если товара нет на складе - голубой цвет
    if (product.stockQuantity === 0) {
      return { backgroundColor: '#E3F2FD' };
    }
    // Если скидка > 15% - зеленый цвет
    if (product.discount > 15) {
      return { backgroundColor: '#2E8B57' };
    }
    return {};
  };

  // Функция для определения цвета текста в строке
  const getRowTextColor = (product: Product): string => {
    if (product.discount > 15) {
      return 'text-white';
    }
    return '';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Список товаров</h1>
                <p className="text-sm text-muted-foreground">
                  {isGuest && 'Просмотр как гость'}
                  {isClient && 'Просмотр как клиент'}
                  {isManager && 'Управление товарами (Менеджер)'}
                  {isAdmin && 'Полный доступ (Администратор)'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user?.fullName}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
              {(isManager || isAdmin) && (
                <Button variant="outline" onClick={onViewOrders}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Заказы
                </Button>
              )}
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
        {/* Панель управления */}
        {canFilterSortSearch && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Поиск */}
                <div className="flex-1 min-w-[250px]">
                  <Label htmlFor="search" className="mb-2 block">
                    Поиск
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Поиск по названию, категории, производителю..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Фильтр по поставщику */}
                <div className="w-[200px]">
                  <Label htmlFor="supplier" className="mb-2 block">
                    Поставщик
                  </Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Все поставщики" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все поставщики</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Кнопка сортировки */}
                <Button
                  variant="outline"
                  onClick={handleSort}
                  className="w-[180px]"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {sortDirection === null && 'Сортировать'}
                  {sortDirection === 'asc' && 'По возрастанию'}
                  {sortDirection === 'desc' && 'По убыванию'}
                </Button>

                {/* Кнопка добавления */}
                {canEdit && (
                  <Button onClick={onAddProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить товар
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Таблица товаров */}
        <Card>
          <CardHeader>
            <CardTitle>Товары ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Фото</TableHead>
                    <TableHead>Наименование</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Производитель</TableHead>
                    <TableHead>Поставщик</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>На складе</TableHead>
                    <TableHead>Скидка</TableHead>
                    {canEdit && <TableHead className="w-[100px]">Действия</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={canEdit ? 9 : 8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Товары не найдены
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        style={getRowStyle(product)}
                        className={getRowTextColor(product)}
                      >
                        <TableCell>
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.manufacturer}</TableCell>
                        <TableCell>{product.supplier}</TableCell>
                        <TableCell>
                          {product.discount > 0 ? (
                            <div>
                              <span className="line-through text-red-500">
                                {formatPrice(product.price)}
                              </span>
                              <br />
                              <span className={product.discount > 15 ? 'text-white' : 'text-black'}>
                                {formatPrice(
                                  product.price * (1 - product.discount / 100)
                                )}
                              </span>
                            </div>
                          ) : (
                            formatPrice(product.price)
                          )}
                        </TableCell>
                        <TableCell>
                          {product.stockQuantity > 0 ? (
                            `${product.stockQuantity} ${product.unit}`
                          ) : (
                            <Badge variant="destructive">Нет в наличии</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.discount > 0 && (
                            <Badge
                              variant={product.discount > 15 ? 'default' : 'secondary'}
                              className={
                                product.discount > 15 ? 'bg-white text-green-700' : ''
                              }
                            >
                              {product.discount}%
                            </Badge>
                          )}
                        </TableCell>
                        {canEdit && (
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEditProduct(product)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(product)}
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

        {/* Легенда подсветки */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#2E8B57] rounded" />
            <span>Скидка &gt; 15%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#E3F2FD] rounded border" />
            <span>Нет на складе</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="line-through text-red-500">~~Цена~~</span>
            <span>- есть скидка</span>
          </div>
        </div>
      </main>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить товар &quot;{productToDelete?.name}&quot;?
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
