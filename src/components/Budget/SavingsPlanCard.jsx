import React from "react";
import { FiRefreshCw, FiEdit2, FiTrash2 } from "react-icons/fi";
import BudgetProgressBar from "./BudgetProgressBar";

const priorityColors = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-600",
};

const SavingsPlanCard = ({ plan, onRenew, onEdit, onDelete }) => {
  const target = Number(plan.target_amount) || 0;
  const saved = Number(plan.savings_amount) || 0;
  const percent = target > 0 ? Math.min(100, (saved / target) * 100) : 0;
  const priority = plan.priority || "medium";
  const deadline = plan.deadline
    ? new Date(plan.deadline).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const isCompleted = plan.status === "completed" || percent >= 100;

  return (
    <div className={`bg-white rounded-2xl border p-4 xl:p-5 transition-shadow hover:shadow-md ${
      isCompleted ? "border-green-300" : "border-gray-200"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm md:text-[15px] font-semibold text-gray-800 truncate">
            {plan.name || "Untitled Goal"}
          </h3>
          {plan.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{plan.description}</p>
          )}
        </div>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ml-2 whitespace-nowrap ${
          priorityColors[priority] || priorityColors.medium
        }`}>
          {priority}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-lg md:text-xl font-bold text-gray-900">
          ₦{saved.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">
          / ₦{target.toLocaleString()}
        </span>
      </div>

      <BudgetProgressBar
        percent={isCompleted ? 100 : percent}
        size="sm"
        color={isCompleted ? "bg-green-500" : undefined}
      />

      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${isCompleted ? "text-green-600" : "text-gray-600"}`}>
            {isCompleted ? "Completed!" : `${Math.round(percent)}%`}
          </span>
          {deadline && !isCompleted && (
            <span className="text-[11px] text-gray-400">Due {deadline}</span>
          )}
          {deadline && isCompleted && (
            <span className="text-[11px] text-green-500">Achieved</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(plan)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Edit savings plan"
            >
              <FiEdit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(plan)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
              aria-label="Delete savings plan"
            >
              <FiTrash2 size={13} />
            </button>
          )}
          {isCompleted && onRenew && (
            <button
              onClick={() => onRenew(plan)}
              className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              aria-label={`Renew ${plan.name}`}
            >
              <FiRefreshCw size={12} />
              Renew
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsPlanCard;
