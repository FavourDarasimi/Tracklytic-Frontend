import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const periods = [
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "3M", label: "3M" },
  { key: "1Y", label: "1Y" },
  { key: "all", label: "All" },
];

const ExpenseTrendChart = ({ chartData = null, period = "1M", onPeriodChange, isLoading }) => {
  const labels = chartData?.labels || [];
  const dataValues = chartData?.data || [];
  const hasData = labels.length && dataValues.length;

  const chart = {
    labels,
    datasets: [
      {
        label: "Expenses",
        data: dataValues,
        borderColor: "rgb(22, 163, 74)",
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: "rgb(22, 163, 74)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        borderRadius: 8,
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        callbacks: {
          label: (ctx) => `₦${ctx.parsed.y}`,
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base md:text-[19px] font-semibold">Expense Trend</h2>

        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          {periods.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onPeriodChange?.(key)}
              className={`px-3 py-1 text-xs md:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                period === key
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[320px]">
          <div className="w-full h-full animate-pulse bg-gray-100 rounded-xl" />
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[320px]">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-gray-100">
              <TrendingUp size={24} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-1">No expense data yet</p>
              <p className="text-xs text-gray-400">Add transactions to see your expense trends</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex-1 min-h-[320px]">
          <Line data={chart} options={options} />
        </div>
      )}
    </div>
  );
};

export default ExpenseTrendChart;
