import React from "react";
import { FiTarget, FiTrendingDown, FiDollarSign, FiTrendingUp } from "react-icons/fi";

const cards = [
  {
    label: "Total Budget",
    field: "totalBudget",
    icon: FiTarget,
    color: "text-green-600",
    prefix: "₦",
    subtitle: "Combined spending limit",
  },
  {
    label: "Total Spent",
    field: "totalSpent",
    icon: FiTrendingDown,
    color: "text-red-500",
    prefix: "₦",
    subtitle: "Current period spending",
  },
  {
    label: "Remaining",
    field: "remaining",
    icon: FiDollarSign,
    color: "text-blue-600",
    prefix: "₦",
    subtitle: "Left to spend",
  },
  {
    label: "Active Savings",
    field: "savingsCount",
    icon: FiTrendingUp,
    color: "text-purple-600",
    prefix: "",
    suffix: " goals",
    subtitle: "Track your progress",
  },
];

const BudgetSummaryCards = ({ totalBudget = 0, totalSpent = 0, remaining = 0, savingsCount = 0 }) => {
  const values = { totalBudget, totalSpent, remaining, savingsCount };

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
            <div>
              <div className={`text-lg xl:text-xl 2xl:text-2xl font-bold ${item.color} whitespace-nowrap`}>
                {item.prefix}{typeof values[item.field] === "number" ? values[item.field].toLocaleString() : values[item.field]}{item.suffix || ""}
              </div>
              <p className="text-[11px] xl:text-xs text-gray-500 mt-1 truncate">{item.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetSummaryCards;
