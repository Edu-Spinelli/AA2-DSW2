"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  status: string;
  saldo_devedor: number | null;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [novoCliente, setNovoCliente] = useState<Cliente>({
    id: 0,
    nome: "",
    telefone: "",
    email: "",
    status: "Ativo",
    saldo_devedor: null,
  });
  const [busca, setBusca] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Erro ao buscar clientes:", error));
  }, []);

  const adicionarCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/clientes",
        novoCliente
      );
      setClientes([...clientes, response.data]);
      setNovoCliente({
        id: 0,
        nome: "",
        telefone: "",
        email: "",
        status: "Ativo",
        saldo_devedor: null,
      });
      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };

  const removerCliente = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/clientes/${id}`);
      setClientes(clientes.filter((cliente) => cliente.id !== id));
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
    }
  };

  const abrirModalEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setModalEditarAberto(true);
  };

  const editarCliente = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clienteEditando) return;
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/clientes/${clienteEditando.id}`,
        clienteEditando
      );
      setClientes(
        clientes.map((cliente) =>
          cliente.id === clienteEditando.id ? response.data : cliente
        )
      );
      setModalEditarAberto(false);
      setClienteEditando(null);
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
    }
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
          <button
            className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold transition-colors"
            onClick={() => {
              setClienteEditando(null); // Garante que não há cliente sendo editado
              setNovoCliente({
                id: 0,
                nome: "",
                telefone: "",
                email: "",
                status: "Ativo",
                saldo_devedor: null,
              }); // Resetando o novo cliente
              setModalAberto(true); // Abre o modal de adicionar cliente
            }}
          >
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
                <th className="py-2 px-2">Saldo Devedor</th>
                <th className="py-2 px-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes
                .filter((cliente) =>
                  cliente.nome.toLowerCase().includes(busca.toLowerCase())
                )
                .map((cliente) => (
                  <tr key={cliente.id} className="border-b border-purple-700">
                    <td className="py-2 px-2">{cliente.nome}</td>
                    <td className="py-2 px-2">{cliente.telefone}</td>
                    <td className="py-2 px-2">{cliente.email}</td>
                    <td className="py-2 px-2">{cliente.status}</td>
                    <td className="py-2 px-2">
                      {(cliente.saldo_devedor ?? 0).toFixed(2)}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        className="bg-blue-500 hover:bg-blue-400 rounded px-3 py-1 text-sm ml-2"
                        onClick={() => abrirModalEditar(cliente)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-500 rounded px-3 py-1 text-sm ml-2"
                        onClick={() => removerCliente(cliente.id)}
                      >
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
            <h2 className="text-2xl font-bold mb-4">Adicionar Cliente</h2>
            <form onSubmit={adicionarCliente} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome"
                className="p-2 rounded text-gray-900"
                value={novoCliente.nome}
                onChange={(e) =>
                  setNovoCliente({ ...novoCliente, nome: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Telefone"
                className="p-2 rounded text-gray-900"
                value={novoCliente.telefone}
                onChange={(e) =>
                  setNovoCliente({ ...novoCliente, telefone: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                className="p-2 rounded text-gray-900"
                value={novoCliente.email}
                onChange={(e) =>
                  setNovoCliente({ ...novoCliente, email: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Saldo Devedor"
                className="p-2 rounded text-gray-900"
                value={novoCliente.saldo_devedor ?? ""}
                onChange={(e) =>
                  setNovoCliente({
                    ...novoCliente,
                    saldo_devedor: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
              />

              <select
                className="p-2 rounded text-gray-900"
                value={novoCliente.status}
                onChange={(e) =>
                  setNovoCliente({ ...novoCliente, status: e.target.value })
                }
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-400 rounded px-4 py-2"
                  onClick={() => setModalAberto(false)}
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

      {modalEditarAberto && clienteEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 w-full max-w-md p-6 rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Editar Cliente</h2>
            <form onSubmit={editarCliente} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nome"
                className="p-2 rounded text-gray-900"
                value={clienteEditando.nome}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    nome: e.target.value,
                  })
                }
                required
              />
              <input
                type="text"
                placeholder="Telefone"
                className="p-2 rounded text-gray-900"
                value={clienteEditando.telefone}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    telefone: e.target.value,
                  })
                }
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                className="p-2 rounded text-gray-900"
                value={clienteEditando.email}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    email: e.target.value,
                  })
                }
                required
              />

              <input
                type="number"
                placeholder="Saldo Devedor"
                className="p-2 rounded text-gray-900"
                value={clienteEditando.saldo_devedor ?? ""}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    saldo_devedor: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
              />
              




              <select
                className="p-2 rounded text-gray-900"
                value={clienteEditando.status}
                onChange={(e) =>
                  setClienteEditando({
                    ...clienteEditando,
                    status: e.target.value,
                  })
                }
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold"
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
