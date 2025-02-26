'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([
    { nome: 'João da Silva', telefone: '(11) 99999-9999', email: 'joao.silva@example.com', status: 'Ativo' },
    { nome: 'Maria Oliveira', telefone: '(21) 98888-8888', email: 'maria.oliveira@example.com', status: 'Inadimplente' }
  ]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', email: '', status: 'Ativo' });
  const [busca, setBusca] = useState('');

  const adicionarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    setClientes([...clientes, novoCliente]);
    setNovoCliente({ nome: '', telefone: '', email: '', status: 'Ativo' });
    setModalAberto(false);
  };

  const removerCliente = (nome: string) => {
    setClientes(clientes.filter(cliente => cliente.nome !== nome));
  };

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-semibold mt-4">Clientes</h1>

        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
          <input
            type="text"
            className="w-64 p-2 rounded text-gray-900 focus:outline-none"
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold transition-colors" onClick={() => setModalAberto(true)}>
            Novo Cliente
          </button>
        </section>

        <section className="bg-purple-800 rounded p-4 overflow-x-auto">
          <table className="min-w-full text-left whitespace-nowrap">
            <thead className="border-b border-purple-700">
              <tr>
                <th className="py-2 px-2">Nome</th>
                <th className="py-2 px-2">Telefone</th>
                <th className="py-2 px-2">E-mail</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.filter(cliente => cliente.nome.toLowerCase().includes(busca.toLowerCase())).map((cliente, index) => (
                <tr key={index} className="border-b border-purple-700">
                  <td className="py-2 px-2">{cliente.nome}</td>
                  <td className="py-2 px-2">{cliente.telefone}</td>
                  <td className="py-2 px-2">{cliente.email}</td>
                  <td className="py-2 px-2">{cliente.status}</td>
                  <td className="py-2 px-2">
                    <button className="bg-red-600 hover:bg-red-500 rounded px-3 py-1 text-sm ml-2" onClick={() => removerCliente(cliente.nome)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <Footer />
    </div>
  );
}
