'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useState } from 'react';

export default function EstoquePage() {
  const [produtos, setProdutos] = useState([
    { nome: 'Produto A', quantidade: 20, preco: 100.00 },
    { nome: 'Produto B', quantidade: 5, preco: 200.00 }
  ]);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoProduto, setNovoProduto] = useState({ nome: '', quantidade: 0, preco: 0 });

  const adicionarProduto = (e: React.FormEvent) => {
    e.preventDefault();
    setProdutos([...produtos, novoProduto]);
    setNovoProduto({ nome: '', quantidade: 0, preco: 0 });
    setModalAberto(false);
  };

  const removerProduto = (nome: string) => {
    setProdutos(produtos.filter(prod => prod.nome !== nome));
  };

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-semibold mt-4">Estoque</h1>

        <button className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold my-4" onClick={() => setModalAberto(true)}>
          Novo Produto
        </button>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto, index) => (
            <div key={index} className="bg-purple-800 p-4 rounded shadow flex flex-col items-center text-center">
              <img src="https://via.placeholder.com/150" alt="Foto Produto" className="w-32 h-32 object-cover mb-4 rounded" />
              <h2 className="text-xl font-bold mb-2">{produto.nome}</h2>
              <p className="mb-2">Quantidade em estoque: {produto.quantidade}</p>
              <p className="mb-4">Preço: R$ {produto.preco.toFixed(2)}</p>
              <button className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm" onClick={() => removerProduto(produto.nome)}>
                Excluir
              </button>
            </div>
          ))}
        </section>
      </main>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 w-full max-w-md p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Adicionar Produto</h2>
            <form onSubmit={adicionarProduto} className="flex flex-col gap-4">
              <input type="text" placeholder="Nome do Produto" className="p-2 rounded text-gray-900" value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} required />
              <input type="number" placeholder="Quantidade" className="p-2 rounded text-gray-900" value={novoProduto.quantidade} onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: parseInt(e.target.value) })} required />
              <input type="number" step="0.01" placeholder="Preço" className="p-2 rounded text-gray-900" value={novoProduto.preco} onChange={(e) => setNovoProduto({ ...novoProduto, preco: parseFloat(e.target.value) })} required />
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
