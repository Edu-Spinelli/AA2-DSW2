'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <nav className="bg-purple-800 p-4 shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-lg md:text-xl font-bold">Meu App Gerencial</Link>
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰
        </button>
        <ul className="hidden md:flex gap-4 md:gap-6 text-sm md:text-base">
          <li><Link href="/dashboard" className="hover:text-purple-300 transition">Dashboard</Link></li>
          <li><Link href="/estoque" className="hover:text-purple-300 transition">Estoque</Link></li>
          <li><Link href="/clientes" className="hover:text-purple-300 transition">Clientes</Link></li>
          <li><Link href="/vendas" className="hover:text-purple-300 transition">Vendas</Link></li>
          <li><Link href="/pagamentos" className="hover:text-purple-300 transition">Pagamentos</Link></li>
          <li><Link href="/login" className="hover:text-purple-300 transition">Sair</Link></li>
        </ul>
      </div>
      <div className={`fixed top-0 right-0 h-full bg-purple-900 shadow-lg transform ${
        menuAberto ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out w-64 md:hidden flex flex-col p-4 z-50 opacity-100`}>
        <button
          className="text-white text-2xl self-end mb-4"
          onClick={() => setMenuAberto(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col gap-4 text-white">
          <li><Link href="/dashboard" className="hover:text-purple-300 transition">Dashboard</Link></li>
          <li><Link href="/estoque" className="hover:text-purple-300 transition">Estoque</Link></li>
          <li><Link href="/clientes" className="hover:text-purple-300 transition">Clientes</Link></li>
          <li><Link href="/vendas" className="hover:text-purple-300 transition">Vendas</Link></li>
          <li><Link href="/pagamentos" className="hover:text-purple-300 transition">Pagamentos</Link></li>
          <li><Link href="/login" className="hover:text-purple-300 transition">Sair</Link></li>
        </ul>
      </div>
    </nav>
  );
}
