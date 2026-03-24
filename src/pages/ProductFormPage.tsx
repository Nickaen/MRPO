import { useState, useEffect, useRef } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { categories, manufacturers, suppliers } from '@/data/mockData';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductFormPageProps {
  product?: Product | null;
  onSave: (product: Omit<Product, 'id'>, imageFile?: File) => void;
  onCancel: () => void;
  nextId?: number;
}

export function ProductFormPage({
  product,
  onSave,
  onCancel,
  nextId,
}: ProductFormPageProps) {
  const isEditing = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    description: '',
    manufacturer: '',
    supplier: '',
    price: 0,
    unit: 'пара',
    stockQuantity: 0,
    discount: 0,
    imageUrl: null,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    }
  }, [product]);

  const handleChange = (field: keyof Product, value: string | number) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка размера файла (макс 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Размер файла не должен превышать 2MB',
        }));
        return;
      }

      // Проверка типа файла
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: 'Пожалуйста, выберите изображение',
        }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Очищаем ошибку
      if (errors.image) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Введите наименование товара';
    }

    if (!formData.category) {
      newErrors.category = 'Выберите категорию';
    }

    if (!formData.manufacturer) {
      newErrors.manufacturer = 'Выберите производителя';
    }

    if (!formData.supplier) {
      newErrors.supplier = 'Выберите поставщика';
    }

    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Цена не может быть отрицательной';
    }

    if (formData.stockQuantity === undefined || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Количество не может быть отрицательным';
    }

    if (formData.discount === undefined || formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = 'Скидка должна быть от 0 до 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const productData: Omit<Product, 'id'> = {
      name: formData.name || '',
      category: formData.category || '',
      description: formData.description || '',
      manufacturer: formData.manufacturer || '',
      supplier: formData.supplier || '',
      price: Number(formData.price) || 0,
      unit: formData.unit || 'пара',
      stockQuantity: Number(formData.stockQuantity) || 0,
      discount: Number(formData.discount) || 0,
      imageUrl: imagePreview || null,
    };

    onSave(productData, imageFile || undefined);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
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
              {isEditing ? 'Редактирование товара' : 'Добавление товара'}
            </h1>
          </div>
        </div>
      </header>

      {/* Форма */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Информация о товаре</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID товара (только для редактирования) */}
              {isEditing && product && (
                <div>
                  <Label>ID товара</Label>
                  <Input value={product.id} disabled className="bg-gray-100" />
                </div>
              )}

              {!isEditing && nextId && (
                <div>
                  <Label>ID товара (будет присвоен автоматически)</Label>
                  <Input value={nextId} disabled className="bg-gray-100" />
                </div>
              )}

              {/* Изображение */}
              <div>
                <Label>Фото товара</Label>
                <div
                  onClick={handleImageClick}
                  className="mt-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary transition-colors"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-[300px] max-h-[200px] object-contain"
                    />
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Нажмите для загрузки фото</p>
                      <p className="text-xs text-gray-400 mt-1">Рекомендуемый размер: 300x200</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {errors.image && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertDescription>{errors.image}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Наименование */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Наименование <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Введите наименование"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Категория */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Категория <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                {/* Производитель */}
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">
                    Производитель <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.manufacturer}
                    onValueChange={(value) => handleChange('manufacturer', value)}
                  >
                    <SelectTrigger id="manufacturer">
                      <SelectValue placeholder="Выберите производителя" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.map((mfr) => (
                        <SelectItem key={mfr} value={mfr}>
                          {mfr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.manufacturer && (
                    <p className="text-sm text-red-500">{errors.manufacturer}</p>
                  )}
                </div>

                {/* Поставщик */}
                <div className="space-y-2">
                  <Label htmlFor="supplier">
                    Поставщик <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) => handleChange('supplier', value)}
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Выберите поставщика" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup} value={sup}>
                          {sup}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplier && (
                    <p className="text-sm text-red-500">{errors.supplier}</p>
                  )}
                </div>

                {/* Цена */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Цена <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>

                {/* Единица измерения */}
                <div className="space-y-2">
                  <Label htmlFor="unit">Единица измерения</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    placeholder="пара"
                  />
                </div>

                {/* Количество на складе */}
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">
                    Количество на складе <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      handleChange('stockQuantity', parseInt(e.target.value))
                    }
                    placeholder="0"
                  />
                  {errors.stockQuantity && (
                    <p className="text-sm text-red-500">{errors.stockQuantity}</p>
                  )}
                </div>

                {/* Скидка */}
                <div className="space-y-2">
                  <Label htmlFor="discount">Скидка (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      handleChange('discount', parseInt(e.target.value))
                    }
                    placeholder="0"
                  />
                  {errors.discount && (
                    <p className="text-sm text-red-500">{errors.discount}</p>
                  )}
                </div>
              </div>

              {/* Описание */}
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Введите описание товара"
                  rows={4}
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Отмена
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Сохранить изменения' : 'Добавить товар'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
