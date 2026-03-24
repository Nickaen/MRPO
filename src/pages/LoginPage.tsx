import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, User, Lock, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin, loginAsGuest } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!login.trim() || !password.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    const success = authLogin(login, password);
    if (success) {
      onLogin();
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Обувной магазин</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Войдите в систему или продолжите как гость
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login">Логин</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login"
                  type="text"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">или</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
            Войти как гость
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Демо-данные для входа:</p>
            <p className="mt-1">
              <span className="font-medium">Клиент:</span> client1 / client123
            </p>
            <p>
              <span className="font-medium">Менеджер:</span> manager1 / manager123
            </p>
            <p>
              <span className="font-medium">Админ:</span> admin / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
