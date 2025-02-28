"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Chart from "chart.js/auto"
import axios from "axios"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

interface Venda {
  id: number
  data: string
  valor_total: number
  entrada: number
  status: string
  cliente: {
    nome: string
    saldo_devedor: number
    id: number
  }
  itens: ItemVenda[]
}

interface ItemVenda {
  produto: {
    id: number
    nome: string
  }
  quantidade: number
  preco_vendido: number
}

interface Pagamento {
  id: number
  cliente_id: number
  valor_pago: number
  data_pagamento: string
}

export default function DashboardPage() {
  const router = useRouter()
  const monthlySalesRef = useRef<HTMLCanvasElement | null>(null)
  const topProductsRef = useRef<HTMLCanvasElement | null>(null)
  const monthlyPaymentsRef = useRef<HTMLCanvasElement | null>(null)
  const [vendas, setVendas] = useState<Venda[]>([])
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([])
  const [clientesInadimplentes, setClientesInadimplentes] = useState<any[]>([])
  const monthlySalesChart = useRef<Chart | null>(null)
  const topProductsChart = useRef<Chart | null>(null)
  const monthlyPaymentsChart = useRef<Chart | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const vendasResponse = await axios.get("http://127.0.0.1:5000/vendas")
      const pagamentosResponse = await axios.get("http://127.0.0.1:5000/pagamentos")
      setVendas(vendasResponse.data)
      setPagamentos(pagamentosResponse.data)
      processarDados(vendasResponse.data, pagamentosResponse.data)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const processarDados = (vendas: Venda[], pagamentos: Pagamento[]) => {
    const vendasPorMes = new Array(12).fill(0)
    const pagamentosPorMes = new Array(12).fill(0)
    const produtosVendidos: { [key: string]: number } = {}
    const clientesComAtraso: any[] = []
    const hoje = new Date()

    vendas.forEach((venda) => {
      const data = new Date(venda.data)
      const mes = data.getMonth()
      vendasPorMes[mes] += venda.valor_total
      pagamentosPorMes[mes] += venda.entrada

      venda.itens.forEach((item: ItemVenda) => {
        const nomeProduto = item.produto.nome
        produtosVendidos[nomeProduto] = (produtosVendidos[nomeProduto] || 0) + item.quantidade
      })

      if (venda.status === "Pendente") {
        const clienteExistente = clientesComAtraso.find((c) => c.nome === venda.cliente.nome)
        if (!clienteExistente) {
          clientesComAtraso.push({
            nome: venda.cliente.nome,
            ultimoPagamento: venda.data,
            valorDevido: venda.cliente.saldo_devedor,
            id: venda.cliente.id,
          })
        }
      }
    })

    pagamentos.forEach((pagamento) => {
      const data = new Date(pagamento.data_pagamento)
      const mes = data.getMonth()
      pagamentosPorMes[mes] += pagamento.valor_pago
    })

    setClientesInadimplentes(clientesComAtraso)

    atualizarGraficoVendas(vendasPorMes)
    atualizarGraficoProdutos(produtosVendidos)
    atualizarGraficoPagamentos(pagamentosPorMes)
  }

  const atualizarGraficoVendas = (vendasPorMes: number[]) => {
    if (monthlySalesRef.current) {
      if (monthlySalesChart.current) {
        monthlySalesChart.current.destroy()
      }
      monthlySalesChart.current = new Chart(monthlySalesRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
          datasets: [
            {
              label: "Vendas (R$)",
              data: vendasPorMes,
              borderColor: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#fff",
              },
            },
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#fff",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#fff",
              },
            },
          },
        },
      })
    }
  }

  const atualizarGraficoProdutos = (produtosVendidos: { [key: string]: number }) => {
    const topProdutos = Object.entries(produtosVendidos)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)

    if (topProductsRef.current) {
      if (topProductsChart.current) {
        topProductsChart.current.destroy()
      }
      topProductsChart.current = new Chart(topProductsRef.current, {
        type: "bar",
        data: {
          labels: topProdutos.map(([nome]) => nome),
          datasets: [
            {
              label: "Quantidade Vendida",
              data: topProdutos.map(([, qtd]) => qtd),
              backgroundColor: [
                "rgba(255, 255, 255, 0.8)",
                "rgba(255, 255, 255, 0.6)",
                "rgba(255, 255, 255, 0.4)",
                "rgba(255, 255, 255, 0.2)",
              ],
              borderColor: [
                "rgba(255, 255, 255, 1)",
                "rgba(255, 255, 255, 0.8)",
                "rgba(255, 255, 255, 0.6)",
                "rgba(255, 255, 255, 0.4)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#fff",
              },
            },
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#fff",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#fff",
              },
            },
          },
        },
      })
    }
  }

  const atualizarGraficoPagamentos = (pagamentosPorMes: number[]) => {
    if (monthlyPaymentsRef.current) {
      if (monthlyPaymentsChart.current) {
        monthlyPaymentsChart.current.destroy()
      }
      monthlyPaymentsChart.current = new Chart(monthlyPaymentsRef.current, {
        type: "line",
        data: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
          datasets: [
            {
              label: "Pagamentos Recebidos (R$)",
              data: pagamentosPorMes,
              borderColor: "#4ade80",
              backgroundColor: "rgba(74, 222, 128, 0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#fff",
              },
            },
            x: {
              grid: {
                color: "rgba(255, 255, 255, 0.1)",
              },
              ticks: {
                color: "#fff",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#fff",
              },
            },
          },
        },
      })
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const enviarMensagemWhatsApp = async (cliente: any) => {
    try {
      await axios.post("http://127.0.0.1:5000/enviar-mensagem", {
        cliente_id: cliente.id,
      })
      alert(`Mensagem enviada para ${cliente.nome} no WhatsApp!`)
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      alert("Erro ao enviar mensagem!")
    }
  }

  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto p-4 flex flex-col gap-8">
        <h1 className="text-3xl font-semibold mt-4">Dashboard</h1>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Vendas no Mês</h2>
            <div className="relative w-full h-80">
              <canvas ref={monthlySalesRef} className="w-full h-full"></canvas>
            </div>
          </div>

          <div className="bg-purple-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Produtos Mais Vendidos</h2>
            <div className="relative w-full h-80">
              <canvas ref={topProductsRef} className="w-full h-full"></canvas>
            </div>
          </div>

          <div className="bg-purple-800 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Pagamentos Recebidos</h2>
            <div className="relative w-full h-80">
              <canvas ref={monthlyPaymentsRef} className="w-full h-full"></canvas>
            </div>
          </div>
        </section>

        <section className="bg-purple-800 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Clientes Inadimplentes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-purple-700">
                <tr>
                  <th className="py-2 px-2">Cliente</th>
                  <th className="py-2 px-2">Data Último Pagamento</th>
                  <th className="py-2 px-2">Valor Devido</th>
                  <th className="py-2 px-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesInadimplentes.map((cliente, index) => (
                  <tr key={index} className="border-b border-purple-700">
                    <td className="py-2 px-2">{cliente.nome}</td>
                    <td className="py-2 px-2">{formatarData(cliente.ultimoPagamento)}</td>
                    <td className="py-2 px-2">{formatarValor(cliente.valorDevido)}</td>
                    <td className="py-2 px-2">
                      <button
                        className="bg-purple-600 hover:bg-purple-500 rounded px-3 py-1 text-sm mr-2"
                        onClick={() => router.push(`/pagamentos?cliente=${cliente.nome}`)}
                      >
                        Registrar Pagamento
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-500 rounded px-3 py-1 text-sm"
                        onClick={() => enviarMensagemWhatsApp(cliente)}
                      >
                        Enviar WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
                {clientesInadimplentes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center">
                      Nenhum cliente inadimplente
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

