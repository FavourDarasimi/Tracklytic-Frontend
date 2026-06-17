import React, { useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDashboardData } from "../hooks/useDashboardData";
import ExpensesStatistics from "../components/Dashboard/ExpensesStatistics";
import MonthlyExpenses from "../components/Dashboard/MonthlyExpenses";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { IoWalletOutline } from "react-icons/io5";
import { FiPieChart } from "react-icons/fi";
import LatestTransactionTable from "../components/Dashboard/LatestTransactionTable";
import MonthlyBudget from "../components/Dashboard/MonthlyBudget";
import TotalTransactions from "../components/Dashboard/TotalTransactions";
import AIInsights from "../components/Dashboard/AIInsights";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    insights,
    categories,
    overview,
    latest_transactions,
    isLoading,
    isInsightsLoading,
    error,
  } = useDashboardData();

  const monthlyIncome = overview?.monthly_income ?? 0;
  const monthlyExpenses = overview?.monthly_expenses ?? 0;
  const dailyAverage = overview?.daily_average ?? 0;
  const topCategoryLabel = overview?.top_category ?? "Food";
  const totalTransactionsCount = overview?.total_transactions ?? 0;
  const weeklyTransactionsCount = overview?.weekly_transactions ?? 0;
  const expenseDistribution = overview?.expense_distribution ?? [];
  const expenseChart = overview?.expense_chart ?? null;
  const chartData = expenseChart
    ? { labels: expenseChart.labels, data: expenseChart.values }
    : { labels: [], data: [] };

  const greetingTitle = useMemo(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    if (hours >= 17 && hours < 21) return "Good Evening";
    return "Good Night";
  }, []);

  const displayName = useMemo(() => {
    if (!user) return "User";
    return user.first_name || user.username || user.email || "User";
  }, [user]);

  return (
    <div className="w-full">
      <div className="md:flex md:flex-col xl:flex-row xl:justify-between xl:items-start gap-4">
        <div className="-space-y-2">
          <p className="text-sm text-gray-600 font-medium">
            {greetingTitle} 👋
          </p>
          <h1 className="text-[24px] lg:text-[25px] xl:text-[26px] font-bold text-gray-900">
            {displayName}
          </h1>
        </div>
      </div>
      {/* 
      {error && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )} */}

      <div className="mt-4 md:mt-2"></div>

      <div className="flex flex-col 2xl:flex-row gap-5 mt-5 lg:mt-6">
        <div className="w-full xl:flex-1 min-w-0">
          <div className="grid grid-flow-col auto-cols-[11rem] gap-4 overflow-x-auto md:grid-cols-4 md:grid-flow-row md:auto-cols-auto md:overflow-x-hidden lg:gap-4 xl:gap-4">
            <div className="border border-gray-200 bg-white p-3 xl:p-4 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-2 xl:pb-3">
                <p className="text-xs font-medium text-gray-600 truncate pr-1">
                  Monthly Income
                </p>
                <FaArrowTrendUp
                  size={13}
                  className="flex-shrink-0 text-green-600"
                />
              </div>
              <div>
                <div className="text-lg xl:text-xl 2xl:text-2xl font-bold text-green-600 whitespace-nowrap">
                  +₦{monthlyIncome.toLocaleString()}
                </div>
                <p className="text-[11px] xl:text-xs text-gray-500 mt-1 truncate">
                  {overview?.monthly_income != null
                    ? "Current month"
                    : "Loading performance..."}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-3 xl:p-4 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-2 xl:pb-3">
                <p className="text-xs font-medium text-gray-600 truncate pr-1">
                  Monthly Expenses
                </p>
                <FaArrowTrendDown
                  size={13}
                  className="flex-shrink-0 text-red-500"
                />
              </div>
              <div>
                <div className="text-lg xl:text-xl 2xl:text-2xl font-bold text-red-500 whitespace-nowrap">
                  -₦{monthlyExpenses.toLocaleString()}
                </div>
                <p className="text-[11px] xl:text-xs text-gray-500 mt-1 truncate">
                  {overview?.monthly_expenses != null
                    ? "Tracked this month"
                    : "Loading performance..."}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-3 xl:p-4 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-2 xl:pb-3">
                <p className="text-xs font-medium text-gray-600 truncate pr-1">
                  Daily Average
                </p>
                <IoWalletOutline
                  size={13}
                  className="flex-shrink-0 text-blue-600"
                />
              </div>
              <div>
                <div className="text-lg xl:text-xl 2xl:text-2xl font-bold text-green-600 whitespace-nowrap">
                  ₦{dailyAverage.toLocaleString()}
                </div>
                <p className="text-[11px] xl:text-xs text-gray-500 mt-1 truncate">
                  {overview?.daily_average != null
                    ? "Average daily spend"
                    : "Loading performance..."}
                </p>
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-3 xl:p-4 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-2 xl:pb-3">
                <p className="text-xs font-medium text-gray-600 truncate pr-1">
                  Top Category
                </p>
                <FiPieChart
                  size={13}
                  className="flex-shrink-0 text-purple-600"
                />
              </div>
              <div>
                <div className="text-lg xl:text-xl 2xl:text-2xl font-bold text-purple-600 whitespace-nowrap">
                  {topCategoryLabel}
                </div>
                <p className="text-[11px] xl:text-xs text-gray-500 mt-1 truncate">
                  {overview?.expense_distribution?.length > 0
                    ? `${overview.expense_distribution[0].amount.toLocaleString()} this month`
                    : "No expense distribution yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full md:mt-8 flex flex-col md:hidden xl:flex xl:flex-row gap-6 items-stretch">
            <div className="flex flex-col xl:flex xl:w-[60%] w-full space-y-5 xl:space-y-6">
              <ExpensesStatistics chartData={chartData} />
            </div>
            <div className="w-full xl:w-[40%] flex flex-col">
              <LatestTransactionTable transactions={latest_transactions} />
            </div>
          </div>

          <div className="hidden 2xl:grid 2xl:grid-cols-2 gap-6 mt-6">
            <MonthlyBudget
              monthlyIncome={monthlyIncome}
              monthlyExpenses={monthlyExpenses}
            />
            <TotalTransactions
              totalTransactionsCount={totalTransactionsCount}
              weeklyTransactionsCount={weeklyTransactionsCount}
            />
          </div>
        </div>

        <div className="hidden xl:flex xl:gap-5 2xl:block 2xl:w-80 space-y-5 xl:space-y-5">
          <div className="hidden xl:flex xl:w-[50%] 2xl:w-full">
            <MonthlyExpenses expenseDistribution={expenseDistribution} />
          </div>

          <div className="w-full xl:w-[50%] 2xl:w-full space-y-5">
            <AIInsights insights={insights} isLoading={isInsightsLoading} />

            <div className="hidden xl:flex 2xl:hidden gap-5 w-full items-stretch">
              <div className="w-[50%] flex-1 h-full">
                <MonthlyBudget
                  monthlyIncome={monthlyIncome}
                  monthlyExpenses={monthlyExpenses}
                />
              </div>

              <div className="w-[50%] flex-1 h-full">
                <TotalTransactions
                  totalTransactionsCount={totalTransactionsCount}
                  weeklyTransactionsCount={weeklyTransactionsCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block xl:hidden w-full space-y-5 lg:space-y-6 pt-5 lg:pt-6">
        <div className="flex gap-5 lg:gap-5 w-full">
          <div className="flex flex-col md:w-[60%] lg:w-[62%] space-y-5">
            <ExpensesStatistics chartData={chartData} />
            <LatestTransactionTable transactions={latest_transactions} />
            <div className="grid grid-cols-2 gap-4">
              <MonthlyBudget
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
              />
              <TotalTransactions
                totalTransactionsCount={totalTransactionsCount}
                weeklyTransactionsCount={weeklyTransactionsCount}
              />
            </div>
          </div>
          <div className="md:w-[40%] lg:w-[38%] space-y-5">
            <MonthlyExpenses expenseDistribution={expenseDistribution} />
            <AIInsights insights={insights} isLoading={isInsightsLoading} />
          </div>
        </div>
      </div>

      <div className="block md:hidden mt-6 space-y-5">
        <MonthlyExpenses expenseDistribution={expenseDistribution} />
        <AIInsights insights={insights} isLoading={isInsightsLoading} />
        <MonthlyBudget
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
        />
        <TotalTransactions
          totalTransactionsCount={totalTransactionsCount}
          weeklyTransactionsCount={weeklyTransactionsCount}
        />
      </div>
    </div>
  );
};

export default Dashboard;
