import React, { memo } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Repeat, Clock } from "lucide-react";

const frequencyLabels = {
  Daily: "Daily",
  Weekly: "Weekly",
  Monthly: "Monthly",
  Yearly: "Yearly",
};

const RecurringTransactionTable = ({
  items = [],
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-20" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      ))}
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Repeat size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">No recurring transactions yet.</p>
        <p className="text-xs text-gray-400 mt-1">
          Create one to automate your regular expenses.
        </p>
      </div>
    );
  }

  const DesktopTable = () => (
    <div className="hidden lg:block bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Frequency
            </th>
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Next Due
            </th>
            <th className="text-left px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="text-center px-5 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Status
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
          {items.map((item) => (
            <motion.tr
              key={item.id}
              variants={rowItem}
              className="group hover:bg-gray-50/80 transition-colors"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Repeat size={18} className="text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {typeof item.category === "string" ? item.category : item.category?.name || "Uncategorized"}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="text-sm font-bold text-gray-900">
                  ₦{Number(item.amount).toLocaleString()}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                  <Clock size={13} />
                  {frequencyLabels[item.frequency] || item.frequency}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="text-sm text-gray-500">
                  {formatDate(item.next_due_date)}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="text-sm text-gray-500">
                  {formatDate(item.end_date)}
                </span>
              </td>
              <td className="px-5 py-4 text-center">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    item.active
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
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
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={rowItem}
          className="bg-white border border-gray-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Repeat size={18} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {typeof item.category === "string" ? item.category : item.category?.name || "Uncategorized"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-600">
                  <Clock size={11} />
                  {frequencyLabels[item.frequency] || item.frequency}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.active
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900">
                ₦{Number(item.amount).toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-400">
                Due {formatDate(item.next_due_date)}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => onEdit(item)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={() => onDelete(item)}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition cursor-pointer"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <>
      <DesktopTable />
      <MobileCards />
    </>
  );
};

export default memo(RecurringTransactionTable);
