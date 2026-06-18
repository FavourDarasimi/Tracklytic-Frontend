import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  FolderOpen,
  DollarSign,
  CalendarDays,
  Trash2,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Income", label: "Income" },
  { value: "Expense", label: "Expense" },
];

const TransactionFilters = ({ isOpen, onClose, onApply, categories = [] }) => {
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    amount_min: "",
    amount_max: "",
    date_from: "",
    date_to: "",
    deleted: false,
  });

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const payload = {};
    if (filters.type !== "all") payload.type = filters.type;
    if (filters.category !== "all") payload.category = Number(filters.category);
    if (filters.amount_min) payload.amount_min = Number(filters.amount_min);
    if (filters.amount_max) payload.amount_max = Number(filters.amount_max);
    if (filters.date_from) payload.date_from = filters.date_from;
    if (filters.date_to) payload.date_to = filters.date_to;
    if (filters.deleted) payload.deleted = true;
    onApply?.(payload);
    onClose?.();
  };

  const handleReset = () => {
    setFilters({
      type: "all",
      category: "all",
      amount_min: "",
      amount_max: "",
      date_from: "",
      date_to: "",
      deleted: false,
    });
  };

  const activeCount = [
    filters.type !== "all",
    filters.category !== "all",
    filters.amount_min || filters.amount_max,
    filters.date_from || filters.date_to,
    filters.deleted,
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
          className="w-full sm:w-[420px] rounded-2xl bg-white border border-gray-200 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <ArrowUpDown size={16} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                {activeCount > 0 && (
                  <p className="text-[11px] text-gray-500">{activeCount} active</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-600 transition-colors"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpDown size={15} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</span>
              </div>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange("type", option.value)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      filters.type === option.value
                        ? "border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600/20"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen size={15} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</span>
              </div>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={15} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount Range</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₦</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.amount_min}
                    onChange={(e) => handleChange("amount_min", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">₦</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.amount_max}
                    onChange={(e) => handleChange("amount_max", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white pl-8 pr-3 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={15} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Range</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1.5 font-medium">From</label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => handleChange("date_from", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1.5 font-medium">To</label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => handleChange("date_to", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Deleted Toggle */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trash2 size={15} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Deleted</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={filters.deleted}
                  onClick={() => handleChange("deleted", !filters.deleted)}
                  className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                    filters.deleted ? "bg-red-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      filters.deleted ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              {filters.deleted && (
                <p className="mt-1.5 text-[11px] text-gray-500">
                  Include soft-deleted transactions
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Apply
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionFilters;
