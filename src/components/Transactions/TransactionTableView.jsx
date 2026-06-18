import React, { memo } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, RotateCcw, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { getCategoryConfig, formatDateTime } from "./transactionUtils";

const TransactionTableView = ({
  transactions = [],
  isLoading = false,
  onEdit,
  onDelete,
  onRestore,
  selectedIds = new Set(),
  onToggleSelect,
  onSelectAll,
}) => {
  const getCategoryName = (transaction) => {
    if (!transaction) return "Uncategorized";
    if (typeof transaction.category === "string") {
      return transaction.category || "Uncategorized";
    }
    return transaction.category?.name || "Uncategorized";
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, staggerChildren: 0.04 },
  };

  const rowItem = {
    hidden: { opacity: 0, x: -12 },
    show: { opacity: 1, x: 0 },
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      ))}
    </div>
  );

  const allSelected = transactions.length > 0 && transactions.every((t) => selectedIds.has(t.id));
  const someSelected = transactions.some((t) => selectedIds.has(t.id));

  const DesktopTable = () => (
    <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {onToggleSelect && (
              <th className="px-5 py-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={() => onSelectAll?.()}
                  className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
                />
              </th>
            )}
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Merchant
            </th>
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="text-right px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="text-center px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider w-20">
              Actions
            </th>
          </tr>
        </thead>
        <motion.tbody
          variants={container}
          initial="hidden"
          animate="show"
          className="divide-y divide-gray-50"
        >
          {transactions.map((transaction) => {
            const categoryName = getCategoryName(transaction);
            const config = getCategoryConfig(categoryName);
            const Icon = config.icon;
            const isIncome = transaction.type === "Income";
            const isDeleted = transaction.is_deleted;
            const isSelected = selectedIds.has(transaction.id);

            return (
              <motion.tr
                key={transaction.id}
                variants={rowItem}
                className={`group hover:bg-gray-50/80 transition-colors ${isDeleted ? "opacity-60 bg-gray-50" : ""} ${isSelected ? "bg-green-50/50" : ""}`}
              >
                {onToggleSelect && (
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(transaction.id)}
                      className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer"
                    />
                  </td>
                )}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} ring-1 ${config.ring}`}
                    >
                      <Icon size={22} className={config.text} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {transaction.party_name || "Unknown"}
                      {isDeleted && (
                        <span className="ml-2 text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                          Deleted
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                  >
                    {categoryName}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {isIncome ? (
                      <ArrowDownLeft size={13} className="text-green-600" />
                    ) : (
                      <ArrowUpRight size={13} className="text-red-500" />
                    )}
                    {transaction.type || "Expense"}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={`text-sm font-bold ${isIncome ? "text-green-600" : "text-red-500"}`}
                  >
                    {isIncome ? "+" : "-"}₦
                    {transaction.amount?.toLocaleString() ?? "0"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-500">
                    {formatDateTime(
                      transaction.transaction_date || transaction.created_at,
                    )}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1">
                    {isDeleted ? (
                      <button
                        onClick={() => onRestore?.(transaction)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all cursor-pointer"
                        title="Restore"
                      >
                        <RotateCcw size={14} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit?.(transaction)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete?.(transaction)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );

  const MobileCards = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="lg:hidden space-y-3"
    >
      {transactions.map((transaction) => {
        const categoryName = getCategoryName(transaction);
        const config = getCategoryConfig(categoryName);
        const Icon = config.icon;
        const isIncome = transaction.type === "Income";
        const isDeleted = transaction.is_deleted;

        return (
          <motion.div
            key={transaction.id}
            variants={rowItem}
            className={`bg-white border border-gray-200 rounded-2xl p-4 ${isDeleted ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-3">
              {onToggleSelect && (
                <input
                  type="checkbox"
                  checked={selectedIds.has(transaction.id)}
                  onChange={() => onToggleSelect(transaction.id)}
                  className="w-4 h-4 rounded border-gray-300 accent-green-600 cursor-pointer flex-shrink-0"
                />
              )}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} ring-1 ${config.ring}`}
              >
                <Icon size={22} className={config.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {transaction.party_name || "Unknown"}
                  {isDeleted && (
                    <span className="ml-2 text-[10px] font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                      Deleted
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.text}`}
                  >
                    {categoryName}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatDateTime(
                      transaction.transaction_date || transaction.created_at,
                    )}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`text-sm font-bold ${isIncome ? "text-green-600" : "text-red-500"}`}
                >
                  {isIncome ? "+" : "-"}₦
                  {transaction.amount?.toLocaleString() ?? "0"}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              {isDeleted ? (
                <button
                  onClick={() => onRestore?.(transaction)}
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 px-2 py-1 rounded-lg hover:bg-green-50 transition cursor-pointer"
                >
                  <RotateCcw size={12} /> Restore
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onEdit?.(transaction)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => onDelete?.(transaction)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  if (isLoading) return <LoadingSkeleton />;

  return (
    <>
      <DesktopTable />
      <MobileCards />
    </>
  );
};

export default memo(TransactionTableView);
