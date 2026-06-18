import React from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const SummaryStats = ({
  totalTransactions = 0,
  totalIncome = 0,
  totalExpenses = 0,
}) => {
  const stats = [
    {
      id: 1,
      icon: Wallet,
      label: "Total Transactions",
      value: totalTransactions,
      prefix: "",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      icon: ArrowDownLeft,
      label: "Total Income",
      value: totalIncome,
      prefix: "₦",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      icon: ArrowUpRight,
      label: "Total Expenses",
      value: totalExpenses,
      prefix: "₦",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            className="bg-white border border-gray-200 rounded-2xl p-5 transition-all hover:shadow-md hover:border-gray-300"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <Icon size={24} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {stat.prefix}
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString()
                    : stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SummaryStats;
