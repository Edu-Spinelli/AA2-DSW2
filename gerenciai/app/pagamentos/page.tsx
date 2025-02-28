"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { X } from "lucide-react"

interface Cliente {
  id: number
  nome: string
  saldo_devedor: number
}

interface Pagamento {
  id: number
  cliente_id: number
  valor_pago: number
  data_pagamento: string
}

export default function PagamentoPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [novoPagamento, setNovoPagamento] = useState<{ cliente_id: number; valor_pago: number }>({
    cliente_id: 0,
    valor_pago: 0,
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const clientesResponse = await axios.get("http://127.0.0.1:5000/clientes")
      setClientes(clientesResponse.data)

      const pagamentosResponse = await axios.get("http://127.0.0.1:5000/pagamentos")
      console.log(pagamentosResponse.data)
      setPagamentos(pagamentosResponse.data)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const adicionarPagamento = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log(novoPagamento)
      await axios.post("http://127.0.0.1:5000/pagamentos", novoPagamento)
      setModalAberto(false)
      setNovoPagamento({ cliente_id: 0, valor_pago: 0 })
      carregarDados()
      alert("Pagamento registrado com sucesso!")
    } catch (error) {
      console.error("Erro ao adicionar pagamento:", error)
      alert("Erro ao registrar pagamento. Verifique o console para mais detalhes.")
    }
  }

  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleString("pt-BR")
  }

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-semibold mt-4">Pagamentos</h1>

        <button
          className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold my-4"
          onClick={() => setModalAberto(true)}
        >
          Novo Pagamento
        </button>

        <section className="bg-purple-800 rounded p-4">
          <h2 className="text-xl font-bold mb-4">Histórico de Pagamentos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-purple-700">
                <tr>
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Cliente</th>
                  <th className="py-2 px-2">Valor Pago</th>
                  <th className="py-2 px-2">Data do Pagamento</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map((pagamento) => (
                  <tr key={pagamento.id} className="border-b border-purple-700">
                    <td className="py-2 px-2">{pagamento.id}</td>
                    <td className="py-2 px-2">{clientes.find((c) => c.id === pagamento.cliente_id)?.nome}</td>
                    <td className="py-2 px-2">{formatarValor(pagamento.valor_pago)}</td>
                    <td className="py-2 px-2">{formatarData(pagamento.data_pagamento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 w-full max-w-md p-6 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
              onClick={() => setModalAberto(false)}
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-4">Adicionar Pagamento</h2>
            <form onSubmit={adicionarPagamento} className="flex flex-col gap-4">
              <select
                className="p-2 rounded text-gray-900"
                value={novoPagamento.cliente_id || ""}
                onChange={(e) => setNovoPagamento({ ...novoPagamento, cliente_id: Number.parseInt(e.target.value) })}
                required
              >
                <option value="">Selecione um cliente...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} - Saldo devedor: {formatarValor(cliente.saldo_devedor)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Valor do Pagamento (R$)"
                className="p-2 rounded text-gray-900"
                value={novoPagamento.valor_pago || ""}
                onChange={(e) => setNovoPagamento({ ...novoPagamento, valor_pago: Number.parseFloat(e.target.value) })}
                required
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-400 rounded px-4 py-2"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 rounded px-4 py-2 font-bold">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

