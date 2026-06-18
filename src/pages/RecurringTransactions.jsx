import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiRefreshCw } from "react-icons/fi";
import { recurringTransactionService } from "@/services/api";
import { useCategoryContext } from "../context/CategoryContext";
import RecurringTransactionTable from "../components/RecurringTransactions/RecurringTransactionTable";
import RecurringTransactionModal from "../components/RecurringTransactions/RecurringTransactionModal";

const RecurringTransactions = () => {
  const { categories } = useCategoryContext();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const {
    data: items = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["recurring-transactions"],
    queryFn: async () => {
      const data = await recurringTransactionService.getRecurringTransactions();
      return Array.isArray(data) ? data : [];
    },
  });

  const handleCreate = () => {
    refetch();
  };

  const handleEdit = async (data) => {
    await recurringTransactionService.updateRecurringTransaction(editingItem.id, data);
    setEditingItem(null);
    setShowModal(false);
    refetch();
  };

  const handleDelete = useCallback(async (item) => {
    if (!window.confirm(`Delete recurring "${item.category?.name || "Uncategorized"}" (₦${Number(item.amount).toLocaleString()})?`)) return;
    await recurringTransactionService.deleteRecurringTransaction(item.id);
    refetch();
  }, [refetch]);

  const openEdit = useCallback((item) => {
    setEditingItem(item);
    setShowModal(true);
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  return (
    <div className="w-full pb-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] md:text-[25px] font-bold">Recurring Transactions</h1>
          <p className="text-sm md:text-[15px] text-gray-500 mt-1">
            Automate your regular income and expenses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            aria-label="Refresh"
          >
            <FiRefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-x-1.5 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            Add Recurring
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
        <RecurringTransactionTable
          items={items}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <RecurringTransactionModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingItem(null); }}
        onSubmit={editingItem ? handleEdit : handleCreate}
        categories={categories}
        initialData={editingItem}
      />
    </div>
  );
};

export default RecurringTransactions;
