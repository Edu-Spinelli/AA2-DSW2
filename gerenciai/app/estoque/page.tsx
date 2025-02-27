"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

interface Produto {
  id: number;
  nome: string;
  quantidade: number | null;
  preco_pago: number | null;
  preco_venda: number | null;
  imagem: string | File;
}

const produtoInicial: Produto = {
  id: 0,
  nome: "",
  quantidade: null,
  preco_pago: null,
  preco_venda: null,
  imagem: "",
};

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [novoProduto, setNovoProduto] = useState(produtoInicial);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error("Erro ao buscar produtos:", error));
  }, []);

  const adicionarProduto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nome", novoProduto.nome);
      formData.append("quantidade", String(novoProduto.quantidade));
      formData.append("preco_pago", String(novoProduto.preco_pago));
      formData.append("preco_venda", String(novoProduto.preco_venda));

      if (novoProduto.imagem instanceof File) {
        formData.append("imagem", novoProduto.imagem); // Apenas adiciona se for uma nova imagem
      }

      let response;
      if (produtoEditando) {
        response = await axios.put(
          `http://127.0.0.1:5000/produtos/${produtoEditando.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(
          "http://127.0.0.1:5000/produtos",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setProdutos(
        produtoEditando
          ? produtos.map((p) =>
              p.id === produtoEditando.id ? response.data : p
            )
          : [...produtos, response.data]
      );
      fecharModal();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const editarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setNovoProduto({ ...produto });
    setModalAberto(true);
  };

  const removerProduto = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/produtos/${id}`);
      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProdutoEditando(null);
    setNovoProduto(produtoInicial);
  };

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-semibold mt-4">Estoque</h1>
        <button
          className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold my-4"
          onClick={() => {
            setModalAberto(true);
            setNovoProduto(produtoInicial);
          }}
        >
          Novo Produto
        </button>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-purple-800 p-4 rounded shadow flex flex-col items-center text-center"
            >
              <img
                src={`http://127.0.0.1:5000${produto.imagem}`}
                alt="Foto Produto"
                className="w-32 h-32 object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-bold mb-2">{produto.nome}</h2>
              <p className="mb-2">
                Quantidade em estoque: {produto.quantidade}
              </p>
              <p className="mb-2">
                Preço Pago: R$ {(produto.preco_pago ?? 0).toFixed(2)}
              </p>
              <p className="mb-4">
                Preço de Venda: R$ {(produto.preco_venda ?? 0).toFixed(2)}
              </p>

              <div className="flex gap-2">
                <button
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
                  onClick={() => editarProduto(produto)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
                  onClick={() => removerProduto(produto.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 w-full max-w-md p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {produtoEditando ? "Editar Produto" : "Adicionar Produto"}
            </h2>
            <form onSubmit={adicionarProduto} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome do Produto"
                className="p-2 rounded text-gray-900"
                value={novoProduto.nome}
                onChange={(e) =>
                  setNovoProduto({ ...novoProduto, nome: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Quantidade"
                className="p-2 rounded text-gray-900"
                value={novoProduto.quantidade ?? ""}
                onChange={(e) =>
                  setNovoProduto({
                    ...novoProduto,
                    quantidade: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  })
                }
                required
              />

              <input
                type="number"
                step="0.01"
                placeholder="Preço Pago"
                className="p-2 rounded text-gray-900"
                value={novoProduto.preco_pago ?? ""}
                onChange={(e) =>
                  setNovoProduto({
                    ...novoProduto,
                    preco_pago: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                required
              />

              <input
                type="number"
                step="0.01"
                placeholder="Preço de Venda"
                className="p-2 rounded text-gray-900"
                value={novoProduto.preco_venda ?? ""}
                onChange={(e) =>
                  setNovoProduto({
                    ...novoProduto,
                    preco_venda: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                required
              />

              <input
                type="file"
                accept="image/*"
                className="p-2 rounded text-gray-900"
                onChange={(e) => {
                  setNovoProduto({
                    ...novoProduto,
                    imagem:
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : novoProduto.imagem, // Mantém a imagem existente
                  });
                }}
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-400 rounded px-4 py-2"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
