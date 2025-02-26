'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Chart from 'chart.js/auto';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  const router = useRouter();
  const monthlySalesRef = useRef<HTMLCanvasElement | null>(null);
  const topProductsRef = useRef<HTMLCanvasElement | null>(null);
  let monthlySalesChart = useRef<Chart | null>(null);
  let topProductsChart = useRef<Chart | null>(null);

  useEffect(() => {
    if (monthlySalesRef.current) {
      if (monthlySalesChart.current) {
        monthlySalesChart.current.destroy();
      }
      monthlySalesChart.current = new Chart(monthlySalesRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          datasets: [{
            label: 'Vendas (R$)',
            data: [1200, 1500, 800, 2000, 3000, 1800, 2200, 2700, 3500, 4000, 3800, 4200],
            borderColor: '#d6bcfa',
            backgroundColor: '#a78bfa33',
            fill: true,
            tension: 0.3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    if (topProductsRef.current) {
      if (topProductsChart.current) {
        topProductsChart.current.destroy();
      }
      topProductsChart.current = new Chart(topProductsRef.current, {
        type: 'bar',
        data: {
          labels: ['Perfume A', 'Perfume B', 'Perfume C', 'Perfume D'],
          datasets: [{
            label: 'Quantidade Vendida',
            data: [45, 30, 25, 15],
            backgroundColor: ['#c084fc', '#a78bfa', '#8b5cf6', '#6d28d9'],
            borderColor: ['#a855f7', '#7c3aed', '#6d28d9', '#581c87'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  }, []);
  return (
    <div className="bg-purple-900 text-white min-h-screen flex flex-col">

      <Navbar />
      
      <main className="flex-grow container mx-auto p-4 flex flex-col gap-8">
        <h1 className="text-3xl font-semibold mt-4">Dashboard</h1>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-800 rounded p-4">
            <h2 className="text-xl font-bold mb-4">Vendas no Mês</h2>
            <div className="relative w-full h-80"> 
              <canvas ref={monthlySalesRef} className="w-full h-full"></canvas>
            </div>
          </div>

          <div className="bg-purple-800 rounded p-4">
            <h2 className="text-xl font-bold mb-4">Produtos Mais Vendidos</h2>
            <div className="relative w-full h-80">
              <canvas ref={topProductsRef} className="w-full h-full"></canvas>
            </div>
          </div>
        </section>

        <section className="bg-purple-800 rounded p-4">
          <h2 className="text-xl font-bold mb-4">Clientes Inadimplentes (+30 dias)</h2>
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
              <tr className="border-b border-purple-700">
                <td className="py-2 px-2">Cliente A</td>
                <td className="py-2 px-2">01/10/2024</td>
                <td className="py-2 px-2">R$ 250,00</td>
                <td className="py-2 px-2">
                  <button className="bg-purple-600 hover:bg-purple-500 rounded px-3 py-1 text-sm">
                    Notificar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <Footer/>
    </div>
  );
}
