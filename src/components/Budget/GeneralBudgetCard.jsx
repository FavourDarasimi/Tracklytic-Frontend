import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import BudgetProgressBar from "./BudgetProgressBar";

const GeneralBudgetCard = ({ budget, onEdit, onDelete }) => {
  const spent = Number(budget.spent_amount) || 0;
  const amount = Number(budget.amount) || 0;
  const percent = amount > 0 ? Math.min(100, (spent / amount) * 100) : 0;
  const period = budget.period || "monthly";
  const label = period.charAt(0).toUpperCase() + period.slice(1);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 xl:p-5 hover:shadow-md transition-shadow group relative">
      {onEdit && (
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(budget)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
            aria-label="Edit budget"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete?.(budget)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
            aria-label="Delete budget"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm md:text-[15px] font-semibold text-gray-800 truncate pr-2">
          {budget.name || `${label} Budget`}
        </h3>
        <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-lg md:text-xl font-bold text-gray-900">
          ₦{spent.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">
          / ₦{amount.toLocaleString()}
        </span>
      </div>

      <BudgetProgressBar percent={percent} size="sm" />

      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs font-medium ${percent >= 90 ? "text-red-500" : percent >= 75 ? "text-yellow-600" : "text-green-600"}`}>
          {percent >= 90 ? "Nearly full" : percent >= 75 ? "Getting close" : "On track"}
        </span>
        <span className="text-xs font-semibold text-gray-600">{Math.round(percent)}%</span>
      </div>
    </div>
  );
};

export default GeneralBudgetCard;
