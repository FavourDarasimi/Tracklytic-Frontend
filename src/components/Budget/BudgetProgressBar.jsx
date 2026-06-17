import React from "react";

const BudgetProgressBar = ({ percent, size = "md", color }) => {
  const p = Math.min(Math.max(percent, 0), 100);

  const barColor =
    color ||
    (p >= 90 ? "bg-red-500" : p >= 75 ? "bg-yellow-500" : "bg-green-500");

  const heights = { sm: "h-2", md: "h-3", lg: "h-4" };

  return (
    <div
      className={`w-full bg-gray-100 rounded-full ${heights[size]} overflow-hidden`}
      role="progressbar"
      aria-valuenow={p}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={`${Math.round(p)}% progress`}
    >
      <div
        className={`${barColor} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${p}%` }}
      />
    </div>
  );
};

export default BudgetProgressBar;
