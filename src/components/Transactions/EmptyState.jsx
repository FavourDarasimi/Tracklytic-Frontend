import React from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 md:p-16 text-center"
    >
      <div className="flex justify-center mb-5">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center"
        >
          <Inbox size={32} className="text-gray-400" />
        </motion.div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        No transactions yet
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto">
        Use the <span className="font-semibold text-green-600">+</span> button in the top bar to add your first transaction.
      </p>
    </motion.div>
  );
};

export default EmptyState;
