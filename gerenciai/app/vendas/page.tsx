'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function VendasPage() {
  const [vendas, setVendas] = useState([
    { produto: 'Perfume A', cliente: 'João da Silva', valorTotal: 100.00, entrada: 50.00, parcelas: 2 }
  ]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novaVenda, setNovaVenda] = useState({ produto: '', cliente: '', valorTotal: 0, entrada: 0, parcelas: 1 });

  const adicionarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    setVendas([...vendas, novaVenda]);
    setNovaVenda({ produto: '', cliente: '', valorTotal: 0, entrada: 0, parcelas: 1 });
    setModalAberto(false);
  };

  const removerVenda = (index: number) => {
    setVendas(vendas.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-semibold mt-4">Vendas</h1>

        <button className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold my-4" onClick={() => setModalAberto(true)}>
          Nova Venda
        </button>

        <section className="bg-purple-800 rounded p-4 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">Histórico de Vendas</h2>
          <table className="min-w-full text-left whitespace-nowrap">
            <thead className="border-b border-purple-700">
              <tr>
                <th className="py-2 px-2">Produto(s)</th>
                <th className="py-2 px-2">Cliente</th>
                <th className="py-2 px-2">Valor Total (R$)</th>
                <th className="py-2 px-2">Entrada (R$)</th>
                <th className="py-2 px-2">Parcelas</th>
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda, index) => (
                <tr key={index} className="border-b border-purple-700">
                  <td className="py-2 px-2">{venda.produto}</td>
                  <td className="py-2 px-2">{venda.cliente}</td>
                  <td className="py-2 px-2">{venda.valorTotal.toFixed(2)}</td>
                  <td className="py-2 px-2">{venda.entrada.toFixed(2)}</td>
                  <td className="py-2 px-2">{venda.parcelas}x</td>
                  <td className="py-2 px-2">
                    <button className="bg-red-600 hover:bg-red-500 rounded px-3 py-1 text-sm ml-2" onClick={() => removerVenda(index)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 w-full max-w-md p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Nova Venda</h2>
            <form onSubmit={adicionarVenda} className="flex flex-col gap-4">
              <input type="text" placeholder="Produto" className="p-2 rounded text-gray-900" value={novaVenda.produto} onChange={(e) => setNovaVenda({ ...novaVenda, produto: e.target.value })} required />
              <input type="text" placeholder="Cliente" className="p-2 rounded text-gray-900" value={novaVenda.cliente} onChange={(e) => setNovaVenda({ ...novaVenda, cliente: e.target.value })} required />
              <input type="number" step="0.01" placeholder="Valor Total (R$)" className="p-2 rounded text-gray-900" value={novaVenda.valorTotal} onChange={(e) => setNovaVenda({ ...novaVenda, valorTotal: parseFloat(e.target.value) })} required />
              <input type="number" step="0.01" placeholder="Entrada (R$)" className="p-2 rounded text-gray-900" value={novaVenda.entrada} onChange={(e) => setNovaVenda({ ...novaVenda, entrada: parseFloat(e.target.value) })} required />
              <input type="number" placeholder="Parcelas" className="p-2 rounded text-gray-900" value={novaVenda.parcelas} onChange={(e) => setNovaVenda({ ...novaVenda, parcelas: parseInt(e.target.value) })} required />
              <div className="flex justify-end gap-4 mt-4">
                <button type="button" className="bg-gray-500 hover:bg-gray-400 rounded px-4 py-2" onClick={() => setModalAberto(false)}>Cancelar</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
