import React, { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FaFileExport } from "react-icons/fa6";
import TransactionHeader from "../components/Transactions/TransactionHeader";
import SummaryStats from "../components/Transactions/SummaryStats";
import TransactionFilters from "../components/Transactions/TransactionFilters";
import TransactionTableView from "../components/Transactions/TransactionTableView";
import EmptyState from "../components/Transactions/EmptyState";
import Pagination from "../components/Transactions/Pagination";
import AddTransactionForm from "../components/AddTransactionForm";
import * as transactionService from "../services/api/transactionService";
import { useCategoryContext } from "../context/CategoryContext";

const Transactions = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "all",
    category: "all",
    type: "all",
    sortBy: "latest",
    amountMin: 0,
    amountMax: 500,
    merchant: "all",
    dateFrom: "",
    dateTo: "",
  });
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    error: fetchError,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const data = await transactionService.getTransactions();
      return Array.isArray(data) ? data : [];
    },
  });
  const { categories, refreshCategories } = useCategoryContext();
  const [addError, setAddError] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!isFilterOpen) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const getTransactionCategory = (transaction) => {
    if (!transaction) return "Uncategorized";
    if (typeof transaction.category === "string") return transaction.category;
    return transaction.category?.name || "Uncategorized";
  };

  const formatDate = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const name = (transaction.party_name || "").toLowerCase();
    const category = getTransactionCategory(transaction).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || category.includes(query);
    const matchesType =
      filters.type === "all" ||
      (transaction.type || "").toLowerCase() === filters.type.toLowerCase();
    const matchesCategory =
      filters.category === "all" || category === filters.category.toLowerCase();

    return matchesSearch && matchesType && matchesCategory;
  });

  // Pagination
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIdx, endIdx);

  const handleExportCSV = () => {
    const headers = ["Merchant", "Date", "Type", "Category", "Amount"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((t) =>
        [
          t.party_name || "",
          formatDate(t.transaction_date || t.created_at),
          t.type || "",
          getTransactionCategory(t),
          t.amount != null ? t.amount : "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleAddTransaction = async (data) => {
    setAddError(null);
    try {
      const created = await transactionService.addTransaction(data);
      if (created) {
        refetchTransactions();
        setCurrentPage(1);
        setIsModalOpen(false);
      }
    } catch (error) {
      setAddError(error?.message || "Unable to save transaction.");
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="space-y-6 sm:space-y-8">
        <div ref={containerRef} className="relative">
          {/* Header */}
          <TransactionHeader
            onAddClick={() => setIsModalOpen(true)}
            onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
            onSearch={setSearchQuery}
          />

          {/* Filter Panel */}
          <div className="absolute right-0 top-full mt-3 z-50 w-full sm:w-auto">
            <TransactionFilters
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SummaryStats
            totalTransactions={transactions.length}
            totalIncome={transactions.reduce(
              (sum, txn) =>
                sum + (txn.type === "Income" ? Number(txn.amount || 0) : 0),
              0,
            )}
            totalExpenses={transactions.reduce(
              (sum, txn) =>
                sum + (txn.type === "Expense" ? Number(txn.amount || 0) : 0),
              0,
            )}
          />
        </motion.div>

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 sm:space-y-5"
        >
          {/* Header with Export */}
          {paginatedTransactions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Recent Transactions
              </h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportCSV}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm transition-all"
              >
                <FaFileExport size={14} />
                Export CSV
              </motion.button>
            </div>
          )}

          {/* Transactions Table or Empty State */}
          {(fetchError || addError) && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {fetchError?.message || addError}
            </div>
          )}

          {paginatedTransactions.length > 0 || isTransactionsLoading ? (
            <>
              <TransactionTableView
                transactions={paginatedTransactions}
                isLoading={isTransactionsLoading}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredTransactions.length}
                />
              )}
            </>
          ) : (
            <EmptyState onAddClick={() => setIsModalOpen(true)} />
          )}
        </motion.div>
      </div>

      <AddTransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
        categories={categories}
      />
    </div>
  );
};

export default Transactions;
