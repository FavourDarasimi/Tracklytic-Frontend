import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileDown, Trash2 } from "lucide-react";
import TransactionHeader from "../components/Transactions/TransactionHeader";
import SummaryStats from "../components/Transactions/SummaryStats";
import TransactionFilters from "../components/Transactions/TransactionFilters";
import TransactionTableView from "../components/Transactions/TransactionTableView";
import EmptyState from "../components/Transactions/EmptyState";
import Pagination from "../components/Transactions/Pagination";
import EditTransactionDrawer from "../components/Transactions/EditTransactionDrawer";
import * as transactionService from "../services/api/transactionService";
import { useCategoryContext } from "../context/CategoryContext";

const Transactions = () => {
  const { categories } = useCategoryContext();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    amount_min: "",
    amount_max: "",
    date_from: "",
    date_to: "",
    deleted: false,
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    error: fetchError,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions", filters.deleted],
    queryFn: async () => {
      const data = await transactionService.getTransactions(
        filters.deleted ? { deleted: "all" } : {}
      );
      return Array.isArray(data) ? data : [];
    },
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getTransactionCategory = (transaction) => {
    if (!transaction) return "Uncategorized";
    if (typeof transaction.category === "string") return transaction.category;
    return transaction.category?.name || "Uncategorized";
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const name = (transaction.party_name || "").toLowerCase();
      const category = getTransactionCategory(transaction).toLowerCase();
      const query = searchQuery.toLowerCase();

      const matchesSearch = name.includes(query) || category.includes(query);
      const matchesType =
        filters.type === "all" ||
        (transaction.type || "") === filters.type;
      const matchesCategory =
        filters.category === "all" ||
        Number(transaction.category?.id) === Number(filters.category) ||
        (typeof transaction.category === "number" && transaction.category === Number(filters.category));
      const matchesAmount =
        (!filters.amount_min || Number(transaction.amount || 0) >= Number(filters.amount_min)) &&
        (!filters.amount_max || Number(transaction.amount || 0) <= Number(filters.amount_max));
      const matchesDeleted = filters.deleted || !transaction.is_deleted;

      return matchesSearch && matchesType && matchesCategory && matchesAmount && matchesDeleted;
    });
  }, [transactions, searchQuery, filters]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(
    () => filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredTransactions, currentPage],
  );

  const stats = useMemo(
    () => ({
      totalTransactions: transactions.length,
      totalIncome: transactions.reduce(
        (sum, txn) => sum + (txn.type === "Income" ? Number(txn.amount || 0) : 0),
        0,
      ),
      totalExpenses: transactions.reduce(
        (sum, txn) => sum + (txn.type === "Expense" ? Number(txn.amount || 0) : 0),
        0,
      ),
    }),
    [transactions],
  );

  const handleExportCSV = () => {
    transactionService.exportTransactionsCsv();
  };

  const handleEdit = useCallback((transaction) => {
    setEditingTransaction(transaction);
  }, []);

  const handleEditSubmit = useCallback(async (updated) => {
    setEditingTransaction(null);
    await refetchTransactions();
  }, [refetchTransactions]);

  const handleDelete = useCallback(async (transaction) => {
    if (!window.confirm(`Delete transaction "${transaction.party_name || "Unknown"}" (₦${Number(transaction.amount).toLocaleString()})?`)) return;
    await transactionService.deleteTransaction(transaction.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(transaction.id);
      return next;
    });
    await refetchTransactions();
  }, [refetchTransactions]);

  const handleRestore = useCallback(async (transaction) => {
    if (!window.confirm(`Restore transaction "${transaction.party_name || "Unknown"}"?`)) return;
    await transactionService.restoreTransaction(transaction.id);
    await refetchTransactions();
  }, [refetchTransactions]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Delete ${selectedIds.size} selected transaction(s)?`)) return;
    await transactionService.bulkDeleteTransactions([...selectedIds]);
    setSelectedIds(new Set());
    await refetchTransactions();
  }, [selectedIds, refetchTransactions]);

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === paginatedTransactions.length) return new Set();
      return new Set(paginatedTransactions.map((t) => t.id));
    });
  }, [paginatedTransactions]);

  const filterPanel = useMemo(() => (
    <TransactionFilters
      isOpen={isFilterOpen}
      onClose={() => setIsFilterOpen(false)}
      onApply={(newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
      }}
      categories={categories}
    />
  ), [isFilterOpen, categories]);

  return (
    <div className="space-y-6">
      <TransactionHeader
        isFilterOpen={isFilterOpen}
        onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
        onSearch={handleSearch}
        filterPanel={filterPanel}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SummaryStats {...stats} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-5"
      >
        {fetchError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {fetchError?.message}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
              {filteredTransactions.length > 0 && (
                <span className="text-sm font-normal text-gray-400 ml-2">
                  ({filteredTransactions.length})
                </span>
              )}
            </h2>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                Delete ({selectedIds.size})
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(searchQuery || filters.type !== "all" || filters.category !== "all" || filters.amount_min || filters.amount_max) && (
              <button
                onClick={() => { setSearchQuery(""); setFilters({ type: "all", category: "all", amount_min: "", amount_max: "", date_from: "", date_to: "", deleted: false }); }}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition cursor-pointer"
              >
                Clear filters
              </button>
            )}
            <label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.deleted}
                onChange={(e) => setFilters((prev) => ({ ...prev, deleted: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
              />
              Show deleted
            </label>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-all cursor-pointer"
            >
              <FileDown size={16} />
              Export CSV
            </motion.button>
          </div>
        </div>

        {paginatedTransactions.length > 0 || isTransactionsLoading ? (
          <>
            <TransactionTableView
              transactions={paginatedTransactions}
              isLoading={isTransactionsLoading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredTransactions.length}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </motion.div>

      <EditTransactionDrawer
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleEditSubmit}
        categories={categories}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
