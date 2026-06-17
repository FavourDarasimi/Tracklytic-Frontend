import React from "react";
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiAlertCircle } from "react-icons/fi";

const cards = [
  {
    label: "Total Income",
    field: "income",
    icon: FiTrendingUp,
    color: "text-green-600",
    prefix: "₦",
    subtitle: "Current period earnings",
  },
  {
    label: "Total Expenses",
    field: "expenses",
    icon: FiTrendingDown,
    color: "text-red-500",
    prefix: "₦",
    subtitle: "Current period spending",
  },
  {
    label: "Avg Transaction",
    field: "avgTransaction",
    icon: FiDollarSign,
    color: "text-blue-600",
    prefix: "₦",
    subtitle: "Average per transaction",
  },
  {
    label: "Largest Expense",
    field: "largestExpense",
    icon: FiAlertCircle,
    color: "text-purple-600",
    prefix: "₦",
    subtitle: "Highest single expense",
  },
];

const StatisticsSummaryCards = ({ income = 0, expenses = 0, avgTransaction = 0, largestExpense = 0, isLoading }) => {
  const values = { income, expenses, avgTransaction, largestExpense };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {cards.map((item) => {
        const IconComp = item.icon;
        return (
          <div key={item.field} className="border border-gray-200 bg-white p-3 xl:p-4 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-2 xl:pb-3">
              <p className="text-xs font-medium text-gray-600 truncate pr-1">{item.label}</p>
              <IconComp size={16} className={`flex-shrink-0 ${item.color}`} />
            </div>
            {isLoading ? (
              <div className="h-6 xl:h-7 bg-gray-200 rounded animate-pulse w-3/4 mb-1" />
            ) : (
              <div className={`text-lg xl:text-xl 2xl:text-2xl font-bold ${item.color} whitespace-nowrap`}>
                {item.prefix}{typeof values[item.field] === "number" ? values[item.field].toLocaleString() : values[item.field]}
              </div>
            )}
            <p className="text-[11px] xl:text-xs text-gray-500 mt-1 truncate">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsSummaryCards;
