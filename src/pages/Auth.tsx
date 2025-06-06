
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock users database
  const mockUsers = [
    { email: 'demo@exemplo.com', password: '123456', name: 'Usuário Demo' },
    { email: 'teste@teste.com', password: 'teste123', name: 'Teste' }
  ];

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const truncatedName = name.trim().substring(0, 20);

    try {
      setLoading(true);
      
      console.log('Criando conta fictícia com nome:', truncatedName);
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se email já existe
      const existingUser = mockUsers.find(user => user.email === email.trim());
      if (existingUser) {
        throw new Error('Este email já está cadastrado. Tente fazer login.');
      }
      
      // Simular criação de usuário
      const newUser = {
        email: email.trim(),
        password,
        name: truncatedName
      };
      
      // Salvar no localStorage para simular persistência
      const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      users.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(users));
      
      // Salvar sessão atual
      localStorage.setItem('currentUser', JSON.stringify({
        id: Date.now().toString(),
        email: newUser.email,
        name: newUser.name
      }));
      
      console.log('Conta criada com sucesso:', newUser);
      toast.success('Conta criada com sucesso!');
      navigate('/');
      
    } catch (error: any) {
      console.error('Erro de cadastro:', error);
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Tentando fazer login fictício...');
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar usuários mock padrão + usuários salvos
      const savedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const allUsers = [...mockUsers, ...savedUsers];
      
      const user = allUsers.find(u => 
        u.email === email.trim() && u.password === password
      );
      
      if (!user) {
        throw new Error('Email ou senha incorretos.');
      }
      
      // Salvar sessão atual
      localStorage.setItem('currentUser', JSON.stringify({
        id: Date.now().toString(),
        email: user.email,
        name: user.name
      }));
      
      console.log('Login realizado com sucesso:', user);
      toast.success('Login realizado com sucesso!');
      navigate('/');
      
    } catch (error: any) {
      console.error('Erro de login:', error);
      toast.error(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Finanças Pessoais</CardTitle>
          <CardDescription>
            Gerencie suas finanças de forma simples e eficiente
          </CardDescription>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200">Demo:</p>
            <p className="text-blue-600 dark:text-blue-300">
              Email: demo@exemplo.com<br />
              Senha: 123456
            </p>
          </div>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {name.length}/20 caracteres
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Senha</Label>
                  <Input
                    id="password-register"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
