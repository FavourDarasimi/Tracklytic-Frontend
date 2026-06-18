import React, { memo, useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { motion } from "framer-motion";

const TransactionHeader = ({ onFilterClick, onSearch, filterPanel, isFilterOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);

  const triggerSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  useEffect(() => {
    if (!isFilterOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onFilterClick();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen, onFilterClick]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Transactions
        </h1>
        <p className="text-sm text-gray-500">
          Track and manage all your income and expenses
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder-gray-400"
          />
          <button
            type="button"
            onClick={triggerSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors cursor-pointer"
          >
            <Search size={16} />
          </button>
        </div>

        <div className="relative" ref={containerRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onFilterClick}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all text-sm font-medium cursor-pointer"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
          </motion.button>

          {filterPanel && isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 z-50">
              {filterPanel}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TransactionHeader);
