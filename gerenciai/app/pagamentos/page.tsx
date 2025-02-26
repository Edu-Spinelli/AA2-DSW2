'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PagamentoPage() {
  const [clientes] = useState([
    'João da Silva',
    'Maria Oliveira'
  ]);
  const [vendas] = useState([
    { id: 1, cliente: 'João da Silva', valor: 200.00, pago: 50.00 },
    { id: 2, cliente: 'Maria Oliveira', valor: 150.00, pago: 0.00 }
  ]);
  
  const [pagamentos, setPagamentos] = useState([
    { cliente: 'João da Silva', valor: 50.00, compra: 1 },
  ]);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [novoPagamento, setNovoPagamento] = useState<{ cliente: string; compra: number; valor: number }>({ cliente: '', compra: 0, valor: 0 });

  const adicionarPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    setPagamentos([...pagamentos, novoPagamento]);
    setNovoPagamento({ cliente: '', compra: 0, valor: 0 });
    setModalAberto(false);
  };

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-semibold mt-4">Pagamentos</h1>

        <button className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold my-4" onClick={() => setModalAberto(true)}>
          Novo Pagamento
        </button>

        <section className="bg-purple-800 rounded p-4">
          <h2 className="text-xl font-bold mb-4">Histórico de Pagamentos</h2>
          <table className="min-w-full text-left">
            <thead className="border-b border-purple-700">
              <tr>
                <th className="py-2 px-2">Cliente</th>
                <th className="py-2 px-2">Valor Pago (R$)</th>
                <th className="py-2 px-2">Compra</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((pagamento, index) => (
                <tr key={index} className="border-b border-purple-700">
                  <td className="py-2 px-2">{pagamento.cliente}</td>
                  <td className="py-2 px-2">R$ {pagamento.valor.toFixed(2)}</td>
                  <td className="py-2 px-2">Compra #{pagamento.compra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 w-full max-w-md p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Adicionar Pagamento</h2>
            <form onSubmit={adicionarPagamento} className="flex flex-col gap-4">
              <select className="p-2 rounded text-gray-900" value={novoPagamento.cliente} onChange={(e) => setNovoPagamento({ ...novoPagamento, cliente: e.target.value })}>
                <option value="">Selecione um cliente...</option>
                {clientes.map((cliente, index) => (
                  <option key={index} value={cliente}>{cliente}</option>
                ))}
              </select>
              <select className="p-2 rounded text-gray-900" value={novoPagamento.compra ?? ''} onChange={(e) => setNovoPagamento({ ...novoPagamento, compra: parseInt(e.target.value) })}>
                <option value="">Selecione uma compra...</option>
                {vendas.map((venda) => (
                  <option key={venda.id} value={venda.id}>Compra #{venda.id} - Total: R$ {venda.valor.toFixed(2)}</option>
                ))}
              </select>
              <input type="number" placeholder="Valor do Pagamento (R$)" className="p-2 rounded text-gray-900" value={novoPagamento.valor} onChange={(e) => setNovoPagamento({ ...novoPagamento, valor: parseFloat(e.target.value) })} required />
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
