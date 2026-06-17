import React from "react";
import { FiTarget } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import GeneralBudgetCard from "./GeneralBudgetCard";

const GeneralBudgetList = ({ budgets, isLoading, onAdd, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-2 bg-gray-200 rounded-full w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div className="mt-4 text-center py-10">
        <FiTarget size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500 mb-4">No budgets set yet.</p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-x-1.5 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
        >
          <IoAddOutline size={18} />
          Create Budget
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {budgets.map((budget) => (
        <GeneralBudgetCard
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default GeneralBudgetList;
