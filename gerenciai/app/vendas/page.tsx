"use client"

import type React from "react"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { useState, useEffect } from "react"
import axios from "axios"
import { X } from "lucide-react"

interface Produto {
  id: number
  nome: string
  quantidade: number
  preco_pago: number
  preco_venda: number
}

interface Cliente {
  id: number
  nome: string
}

interface ItemVenda {
  produto_id: number | null
  nome: string
  quantidade: number
  preco_pago: number
  preco_venda: number
  subtotal: number
}

interface Venda {
  id?: number
  cliente_id: number | null
  cliente?: {
    id: number
    nome: string
    telefone?: string
    email?: string
    status?: string
    saldo_devedor?: number
  }
  itens: ItemVenda[]
  valor_total: number
  entrada: number | null
  parcelas: number | null
  data?: string
  status?: string
  saldo_restante?: number
}

export default function VendasPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [vendas, setVendas] = useState<Venda[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoVenda, setEditandoVenda] = useState<Venda | null>(null)
  const [modoEdicao, setModoEdicao] = useState(false)

  const [novaVenda, setNovaVenda] = useState<Venda>({
    cliente_id: null,
    itens: [],
    valor_total: 0,
    entrada: null,
    parcelas: null,
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = () => {
    axios
      .get("http://127.0.0.1:5000/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error("Erro ao buscar produtos:", error))

    axios
      .get("http://127.0.0.1:5000/clientes")
      .then((response) => setClientes(response.data))
      .catch((error) => console.error("Erro ao buscar clientes:", error))

    axios
      .get("http://127.0.0.1:5000/vendas")
      .then((response) => setVendas(response.data))
      .catch((error) => console.error("Erro ao buscar vendas:", error))
  }

  const atualizarTotalVenda = (itens: ItemVenda[]) => {
    const total = itens.reduce((sum, item) => sum + item.subtotal, 0)
    const totalPago = itens.reduce((sum, item) => sum + item.preco_pago * item.quantidade, 0)

    if (modoEdicao) {
      setEditandoVenda((prev) => (prev ? { ...prev, itens, valor_total: total } : null))
    } else {
      setNovaVenda((prev) => ({ ...prev, itens, valor_total: total }))
    }
  }

  const adicionarItemVenda = () => {
    if (modoEdicao && editandoVenda) {
      setEditandoVenda({
        ...editandoVenda,
        itens: [
          ...editandoVenda.itens,
          { produto_id: null, nome: "", quantidade: 1, preco_pago: 0, preco_venda: 0, subtotal: 0 },
        ],
      })
    } else {
      setNovaVenda((prev) => ({
        ...prev,
        itens: [
          ...prev.itens,
          { produto_id: null, nome: "", quantidade: 1, preco_pago: 0, preco_venda: 0, subtotal: 0 },
        ],
      }))
    }
  }

  const atualizarItemVenda = (index: number, produto_id: number | null, quantidade: number) => {
    const produtoSelecionado = produtos.find((prod) => prod.id === produto_id)
    if (!produtoSelecionado) return

    if (quantidade > produtoSelecionado.quantidade) {
      alert("Quantidade vendida não pode ser maior que o estoque disponível!")
      return
    }

    const novoItem = {
      produto_id,
      nome: produtoSelecionado.nome,
      quantidade,
      preco_pago: produtoSelecionado.preco_pago,
      preco_venda: produtoSelecionado.preco_venda,
      subtotal: produtoSelecionado.preco_venda * quantidade,
    }

    if (modoEdicao && editandoVenda) {
      const novosItens = [...editandoVenda.itens]
      novosItens[index] = novoItem
      atualizarTotalVenda(novosItens)
    } else {
      const novosItens = [...novaVenda.itens]
      novosItens[index] = novoItem
      atualizarTotalVenda(novosItens)
    }
  }

  const removerItemVenda = (index: number) => {
    if (modoEdicao && editandoVenda) {
      const novosItens = editandoVenda.itens.filter((_, i) => i !== index)
      atualizarTotalVenda(novosItens)
    } else {
      const novosItens = novaVenda.itens.filter((_, i) => i !== index)
      atualizarTotalVenda(novosItens)
    }
  }

  const adicionarVenda = async (e: React.FormEvent) => {
    e.preventDefault()

    const vendaAtual = modoEdicao ? editandoVenda : novaVenda

    if (!vendaAtual) return

    if (vendaAtual.itens.length === 0) {
      alert("Adicione pelo menos um produto à venda.")
      return
    }

    if (vendaAtual.cliente_id === null) {
      alert("Selecione um cliente para a venda.")
      return
    }

    try {
      if (modoEdicao && editandoVenda?.id) {
        // Implementar a lógica de edição quando o backend suportar
        await axios.put(`http://127.0.0.1:5000/vendas/${editandoVenda.id}`, editandoVenda)
        alert("Venda atualizada com sucesso!")
      } else {
        await axios.post("http://127.0.0.1:5000/vendas", novaVenda)
        alert("Venda registrada com sucesso!")
      }

      fecharModal()
      carregarDados()
    } catch (error) {
      console.error("Erro ao registrar/editar venda:", error)
      alert("Erro ao processar a venda. Verifique o console para mais detalhes.")
    }
  }

  const editarVenda = (venda: Venda) => {
    setEditandoVenda({
      ...venda,
      cliente_id: venda.cliente?.id || null,
    })
    setModoEdicao(true)
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setModoEdicao(false)
    setEditandoVenda(null)
    setNovaVenda({
      cliente_id: null,
      itens: [],
      valor_total: 0,
      entrada: null,
      parcelas: null,
    })
  }

  const calcularTotalPago = (itens: ItemVenda[]) => {
    return itens.reduce((sum, item) => sum + item.preco_pago * item.quantidade, 0)
  }

  const formatarData = (dataString?: string) => {
    if (!dataString) return ""
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-semibold mt-4">Vendas</h1>

        <button
          className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold my-4"
          onClick={() => setModalAberto(true)}
        >
          Nova Venda
        </button>

        {/* Tabela de Histórico de Vendas */}
        <div className="mt-6 bg-purple-800 rounded-lg p-4 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Histórico de Vendas</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-600">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Data</th>
                <th className="text-left py-2">Cliente</th>
                <th className="text-left py-2">Valor Total</th>
                <th className="text-left py-2">Entrada</th>
                <th className="text-left py-2">Saldo</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <tr key={venda.id} className="border-b border-purple-700 hover:bg-purple-700">
                  <td className="py-2">{venda.id}</td>
                  <td className="py-2">{formatarData(venda.data)}</td>
                  <td className="py-2">{venda.cliente?.nome}</td>
                  <td className="py-2">{formatarValor(venda.valor_total)}</td>
                  <td className="py-2">{formatarValor(venda.entrada || 0)}</td>
                  <td className="py-2">{formatarValor(venda.saldo_restante || 0)}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${venda.status === "Pago" ? "bg-green-500" : "bg-yellow-500"}`}
                    >
                      {venda.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded text-sm"
                      onClick={() => editarVenda(venda)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
              {vendas.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-4 text-center">
                    Nenhuma venda registrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-purple-800 w-full max-w-md p-6 rounded shadow-lg relative">
              <button className="absolute top-2 right-2 text-gray-300 hover:text-white" onClick={fecharModal}>
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-4">
                {modoEdicao ? `Editar Venda #${editandoVenda?.id}` : "Nova Venda"}
              </h2>

              <form onSubmit={adicionarVenda} className="flex flex-col gap-4">
                <select
                  className="p-2 rounded text-gray-900"
                  value={modoEdicao && editandoVenda ? editandoVenda.cliente_id || "" : novaVenda.cliente_id || ""}
                  onChange={(e) => {
                    const value = e.target.value ? Number.parseInt(e.target.value) : null
                    if (modoEdicao && editandoVenda) {
                      setEditandoVenda({ ...editandoVenda, cliente_id: value })
                    } else {
                      setNovaVenda({ ...novaVenda, cliente_id: value })
                    }
                  }}
                  required
                >
                  <option value="">Selecione um Cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>

                <h3 className="text-lg font-bold">Adicionar Produtos</h3>
                {(modoEdicao && editandoVenda ? editandoVenda.itens : novaVenda.itens).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <select
                      className="p-2 rounded text-gray-900 w-full"
                      value={item.produto_id || ""}
                      onChange={(e) => atualizarItemVenda(index, Number.parseInt(e.target.value), item.quantidade)}
                      required
                    >
                      <option value="">Selecione um Produto</option>
                      {produtos.map((produto) => (
                        <option key={produto.id} value={produto.id}>
                          {produto.nome} (Estoque: {produto.quantidade})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Quantidade"
                      min="1"
                      max={produtos.find((prod) => prod.id === item.produto_id)?.quantidade || 1}
                      className="p-2 rounded text-gray-900 w-20"
                      value={item.quantidade}
                      onChange={(e) => atualizarItemVenda(index, item.produto_id, Number.parseInt(e.target.value))}
                      required
                    />
                    <button type="button" className="text-red-500" onClick={() => removerItemVenda(index)}>
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-400 rounded px-3 py-1 text-sm"
                  onClick={adicionarItemVenda}
                >
                  + Adicionar Produto
                </button>

                {/* Resumo financeiro */}
                <div className="bg-purple-700 p-3 rounded">
                  <div className="flex justify-between mb-2">
                    <span>Valor total de venda:</span>
                    <span className="font-bold">
                      {formatarValor(modoEdicao && editandoVenda ? editandoVenda.valor_total : novaVenda.valor_total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor total pago (custo):</span>
                    <span className="font-bold">
                      {formatarValor(
                        calcularTotalPago(modoEdicao && editandoVenda ? editandoVenda.itens : novaVenda.itens),
                      )}
                    </span>
                  </div>
                </div>

                <input
                  type="number"
                  placeholder="Entrada (R$)"
                  className="p-2 rounded text-gray-900"
                  value={modoEdicao && editandoVenda ? (editandoVenda.entrada ?? "") : (novaVenda.entrada ?? "")}
                  onChange={(e) => {
                    const value = e.target.value ? Number.parseFloat(e.target.value) : null
                    if (modoEdicao && editandoVenda) {
                      setEditandoVenda({ ...editandoVenda, entrada: value })
                    } else {
                      setNovaVenda({ ...novaVenda, entrada: value })
                    }
                  }}
                  required
                />

                <input
                  type="number"
                  placeholder="Parcelas"
                  className="p-2 rounded text-gray-900"
                  value={modoEdicao && editandoVenda ? (editandoVenda.parcelas ?? "") : (novaVenda.parcelas ?? "")}
                  onChange={(e) => {
                    const value = e.target.value ? Number.parseInt(e.target.value) : null
                    if (modoEdicao && editandoVenda) {
                      setEditandoVenda({ ...editandoVenda, parcelas: value })
                    } else {
                      setNovaVenda({ ...novaVenda, parcelas: value })
                    }
                  }}
                  required
                />

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    className="bg-gray-600 hover:bg-gray-500 rounded px-4 py-2 font-bold flex-1"
                    onClick={fecharModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold flex-1"
                  >
                    {modoEdicao ? "Atualizar" : "Salvar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

