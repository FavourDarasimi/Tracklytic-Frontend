import React, { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services/api";
import StatisticsSummaryCards from "../components/Statistics/StatisticsSummaryCards";
import ExpenseTrendChart from "../components/Statistics/ExpenseTrendChart";
import ExpenseBreakdownChart from "../components/Statistics/ExpenseBreakdownChart";
import IncomeVsExpensesChart from "../components/Statistics/IncomeVsExpensesChart";

const Statistics = () => {
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [period, setPeriod] = useState("1M");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardData(period);
      setOverview(data?.overview || {});
    } catch (err) {
      setError(err?.message || "Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData, retryCount]);

  const income = overview?.monthly_income ?? 0;
  const expenses = overview?.monthly_expenses ?? 0;
  const totalTransactions = overview?.total_transactions ?? 0;
  const avgTransaction = totalTransactions > 0 ? Math.round(expenses / totalTransactions) : 0;

  const distribution = overview?.expense_distribution || [];
  const largestExpense = distribution.length > 0
    ? Math.max(...distribution.map((d) => d.amount || 0))
    : 0;

  const expenseChart = overview?.expense_chart || null;
  const chartData = expenseChart
    ? { labels: expenseChart.labels, data: expenseChart.values }
    : null;

  const comparisonChartData = chartData?.labels?.length
    ? {
        labels: chartData.labels,
        income: chartData.labels.map(() => income / Math.max(chartData.labels.length, 1)),
        expenses: chartData.data,
      }
    : null;

  return (
    <div className="w-full pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[25px] font-bold">Statistics</h1>
        <p className="text-sm md:text-[15px] text-gray-500 mt-1">
          Visual breakdown of your income, expenses, and trends.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border-l-4 border-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="text-red-700 underline hover:no-underline font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <StatisticsSummaryCards
        income={income}
        expenses={expenses}
        avgTransaction={avgTransaction}
        largestExpense={largestExpense}
        isLoading={isLoading}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <ExpenseTrendChart
          chartData={chartData}
          period={period}
          onPeriodChange={setPeriod}
          isLoading={isLoading}
        />
        <ExpenseBreakdownChart
          expenseDistribution={distribution}
          totalExpenses={expenses}
          isLoading={isLoading}
        />
      </div>

      {/* Income vs Expenses */}
      <IncomeVsExpensesChart
        chartData={comparisonChartData}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Statistics;
