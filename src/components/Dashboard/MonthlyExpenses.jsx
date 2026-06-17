import React from "react";
import { Pencil } from "lucide-react";

const MonthlyExpenses = ({ expenseDistribution = [] }) => {
  const expenses = expenseDistribution.length
    ? expenseDistribution.slice(0, 6).map((expense) => ({
        name: expense.name || "Expense",
        amount: `₦${expense.amount?.toLocaleString() ?? 0}`,
      }))
    : [{ name: "No data", amount: "₦0" }];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base md:text-[19px] font-semibold">
          Monthly Expenses
        </h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-2 gap-2 md:gap-3 xl:gap-4">
        {expenses.map((expense, index) => (
          <div
            key={index}
            className="bg-gray-50/40 rounded-xl p-3 text-center border border-gray-200"
          >
            <p className="text-xs text-gray-600 font-medium mb-2 truncate">
              {expense.name}
            </p>
            <p className="text-sm md:text-base font-semibold text-gray-900">
              {expense.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyExpenses;
