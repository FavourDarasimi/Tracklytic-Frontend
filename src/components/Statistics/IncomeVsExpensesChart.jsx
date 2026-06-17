import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FiBarChart2 } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const IncomeVsExpensesChart = ({ chartData = null, isLoading }) => {
  const hasData = chartData?.labels?.length;

  const labels = chartData?.labels || [];
  const incomeData = chartData?.income || [];
  const expenseData = chartData?.expenses || [];

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgba(22, 163, 74, 0.7)",
        borderColor: "rgb(22, 163, 74)",
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.35,
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 2,
          usePointStyle: true,
          font: { size: 11 },
          color: "rgba(0,0,0,0.6)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: (ctx) => `₦${ctx.parsed.y?.toLocaleString() || 0}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 11 }, color: "rgba(0,0,0,0.5)" },
        grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
      },
      x: {
        ticks: { font: { size: 11 }, color: "rgba(0,0,0,0.5)" },
        grid: { display: false, drawBorder: false },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 w-full flex flex-col min-h-[400px]">
      <h2 className="text-base md:text-[19px] font-semibold mb-4">Income vs Expenses</h2>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[320px]">
          <div className="w-full h-full animate-pulse bg-gray-100 rounded-xl" />
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[320px]">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-gray-100">
              <FiBarChart2 size={24} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-1">No comparison data yet</p>
              <p className="text-xs text-gray-400">Add transactions to see income vs expenses</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 min-h-[320px]">
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default IncomeVsExpensesChart;
