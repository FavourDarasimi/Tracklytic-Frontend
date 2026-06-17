import React from "react";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { FiPieChart } from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#84cc16",
];

const ExpenseBreakdownChart = ({
  expenseDistribution = [],
  totalExpenses = 0,
  isLoading,
}) => {
  const hasData = expenseDistribution.length > 0;

  const labels = expenseDistribution.map((e) => e.name || "Unknown");
  const dataValues = expenseDistribution.map((e) => e.amount || 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
            return `₦${ctx.parsed.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 w-full flex flex-col min-h-[400px]">
      <h2 className="text-base md:text-[19px] font-semibold mb-4">
        Expense Breakdown
      </h2>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[320px]">
          <div className="w-48 h-48 rounded-full bg-gray-100 animate-pulse" />
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[320px]">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-gray-100">
              <FiPieChart size={24} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-1">
                No breakdown data yet
              </p>
              <p className="text-xs text-gray-400">
                Add transactions to see your category breakdown
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[320px]">
          {/* Doughnut */}
          <div className="flex items-center justify-center lg:w-1/2 min-h-[240px]">
            <div className="relative w-48 h-48">
              <Doughnut data={chartData} options={options} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    ₦{totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3 flex flex-col justify-center">
            {expenseDistribution.slice(0, 8).map((item, i) => {
              const pct =
                totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
              const color = CHART_COLORS[i % CHART_COLORS.length];
              return (
                <div key={item.name || i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs md:text-sm text-gray-700 truncate">
                        {item.name || "Unknown"}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 ml-2 whitespace-nowrap">
                      ₦{item.amount?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseBreakdownChart;
