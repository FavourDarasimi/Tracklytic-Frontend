import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import SavingsPlanCard from "./SavingsPlanCard";

const SavingsPlanList = ({ plans, isLoading, onAdd, onRenew }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-1" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-2 bg-gray-200 rounded-full w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="mt-4 text-center py-10">
        <FiTrendingUp size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500 mb-4">No savings goals yet.</p>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-x-1.5 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
        >
          <IoAddOutline size={18} />
          Create Savings Goal
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
      {plans.map((plan) => (
        <SavingsPlanCard
          key={plan.id}
          plan={plan}
          onRenew={onRenew}
        />
      ))}
    </div>
  );
};

export default SavingsPlanList;
