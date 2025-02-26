'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!username || !password) {
      alert('Por favor, preencha usuário e senha.');
      return;
    }
    
    // Simulação de autenticação
    alert('Login efetuado com sucesso!');
    router.push('/dashboard');
  };

  return (
    <div className="bg-purple-900 text-white h-screen flex flex-col">
      <header className="p-4 bg-purple-800 shadow-md">
        <h1 className="text-2xl font-bold text-center">Meu App Gerencial</h1>
      </header>
      
      <main className="flex-grow flex items-center justify-center px-4">
        <section className="bg-purple-800 p-6 rounded-md w-full max-w-sm flex flex-col gap-6 shadow-xl">
          <h2 className="text-center text-2xl font-semibold">Acesse sua conta</h2>
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium">Usuário ou E-mail</label>
              <input 
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded text-gray-800 focus:outline-none"
                placeholder="Digite seu usuário ou e-mail"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">Senha</label>
              <input 
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded text-gray-800 focus:outline-none"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-500 rounded p-2 font-bold transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="flex justify-center">
            <a href="#" className="text-sm underline hover:text-purple-300">Esqueci minha senha</a>
          </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
}
