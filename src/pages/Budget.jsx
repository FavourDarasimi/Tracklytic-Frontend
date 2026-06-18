import React, { useState, useEffect, useCallback } from "react";
import { useCategoryContext } from "../context/CategoryContext";
import { budgetService, savingPlanService } from "@/services/api";
import BudgetSummaryCards from "../components/Budget/BudgetSummaryCards";
import GeneralBudgetList from "../components/Budget/GeneralBudgetList";
import CategoryBudgetList from "../components/Budget/CategoryBudgetList";
import SavingsPlanList from "../components/Budget/SavingsPlanList";
import AddBudgetModal from "../components/Budget/AddBudgetModal";
import AddSavingsModal from "../components/Budget/AddSavingsModal";
import { FiTarget, FiPieChart, FiTrendingUp } from "react-icons/fi";

const Budget = () => {
  const { categories } = useCategoryContext();

  const [generalBudgets, setGeneralBudgets] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [savingsPlans, setSavingsPlans] = useState([]);

  const [isLoadingGeneral, setIsLoadingGeneral] = useState(true);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [isLoadingSavings, setIsLoadingSavings] = useState(true);

  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showAddSavings, setShowAddSavings] = useState(false);

  const fetchGeneralBudgets = useCallback(async () => {
    setIsLoadingGeneral(true);
    try {
      const data = await budgetService.getGeneralBudgets();
      setGeneralBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load general budgets", err);
      setError(err?.message || "Failed to load budgets");
    } finally {
      setIsLoadingGeneral(false);
    }
  }, []);

  const fetchCategoryBudgets = useCallback(async () => {
    setIsLoadingCategory(true);
    try {
      const data = await budgetService.getCategoryBudgets();
      setCategoryBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load category budgets", err);
    } finally {
      setIsLoadingCategory(false);
    }
  }, []);

  const fetchSavingsPlans = useCallback(async () => {
    setIsLoadingSavings(true);
    try {
      const data = await savingPlanService.getUserSavingPlans();
      setSavingsPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load savings plans", err);
    } finally {
      setIsLoadingSavings(false);
    }
  }, []);

  useEffect(() => {
    fetchGeneralBudgets();
    fetchCategoryBudgets();
    fetchSavingsPlans();
  }, [fetchGeneralBudgets, fetchCategoryBudgets, fetchSavingsPlans, retryCount]);

  const totalBudget =
    [...generalBudgets, ...categoryBudgets].reduce(
      (sum, b) => sum + (Number(b.amount) || 0),
      0,
    );

  const totalSpent =
    [...generalBudgets, ...categoryBudgets].reduce(
      (sum, b) => sum + (Number(b.spent_amount) || 0),
      0,
    );

  const remaining = Math.max(0, totalBudget - totalSpent);
  const savingsCount = savingsPlans.length;

  const handleOpenAddBudget = () => {
    setEditingBudget(null);
    setShowAddBudget(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setShowAddBudget(true);
  };

  const handleCreateBudget = async (data) => {
    if (data.category) {
      await budgetService.addCategoryBudget(data);
    } else {
      await budgetService.addGeneralBudget(data);
    }
    setShowAddBudget(false);
    await Promise.all([fetchGeneralBudgets(), fetchCategoryBudgets()]);
  };

  const handleUpdateBudget = async (data) => {
    if (data.category) {
      await budgetService.editCategoryBudget(editingBudget.id, data);
    } else {
      await budgetService.editGeneralBudget(editingBudget.id, data);
    }
    setEditingBudget(null);
    setShowAddBudget(false);
    await Promise.all([fetchGeneralBudgets(), fetchCategoryBudgets()]);
  };

  const handleDeleteGeneralBudget = useCallback(async (budget) => {
    if (!window.confirm(`Delete general budget (₦${Number(budget.amount).toLocaleString()})?`)) return;
    await budgetService.deleteGeneralBudget(budget.id);
    await fetchGeneralBudgets();
  }, [fetchGeneralBudgets]);

  const handleDeleteCategoryBudget = useCallback(async (budget) => {
    if (!window.confirm(`Delete category budget for "${budget.category?.name || "Unknown"}"?`)) return;
    await budgetService.deleteCategoryBudget(budget.id);
    await fetchCategoryBudgets();
  }, [fetchCategoryBudgets]);

  const handleCreateSavings = async (data) => {
    await savingPlanService.addSavingPlan(data);
    setShowAddSavings(false);
    await fetchSavingsPlans();
  };

  const handleRenewSavings = async (plan) => {
    try {
      await savingPlanService.renewSavingPlan(plan.id, {
        savings_amount: 0,
        status: "active",
      });
      await fetchSavingsPlans();
    } catch (err) {
      console.error("Failed to renew savings plan", err);
    }
  };

  return (
    <div className="w-full pb-8">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[25px] font-bold">Budget & Savings</h1>
        <p className="text-sm md:text-[15px] text-gray-500 mt-1">
          Track your spending limits and savings goals.
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

      {/* Summary Stats */}
      <BudgetSummaryCards
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        remaining={remaining}
        savingsCount={savingsCount}
      />

      {/* Budget Overview */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex gap-x-3 items-center">
              <FiTarget size={22} className="text-green-600 flex-shrink-0" />
              <h2 className="text-[20px] md:text-[22px] font-semibold">Budget Overview</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Manage your general and category-specific spending limits.
            </p>
          </div>
          <button
            onClick={handleOpenAddBudget}
            className="flex items-center gap-x-1.5 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            Add Budget
          </button>
        </div>

        {/* General Budgets */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">General Budgets</h3>
          <GeneralBudgetList
            budgets={generalBudgets}
            isLoading={isLoadingGeneral}
            onAdd={handleOpenAddBudget}
            onEdit={handleEditBudget}
            onDelete={handleDeleteGeneralBudget}
          />
        </div>

        {/* Category Budgets */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Category Budgets</h3>
          <CategoryBudgetList
            budgets={categoryBudgets}
            isLoading={isLoadingCategory}
            onAdd={handleOpenAddBudget}
            onEdit={handleEditBudget}
            onDelete={handleDeleteCategoryBudget}
          />
        </div>
      </div>

      {/* Savings Goals */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex gap-x-3 items-center">
              <FiTrendingUp size={22} className="text-green-600 flex-shrink-0" />
              <h2 className="text-[20px] md:text-[22px] font-semibold">Savings Goals</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Set and track your savings targets.
            </p>
          </div>
          <button
            onClick={() => setShowAddSavings(true)}
            className="flex items-center gap-x-1.5 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer"
          >
            New Goal
          </button>
        </div>

        <SavingsPlanList
          plans={savingsPlans}
          isLoading={isLoadingSavings}
          onAdd={() => setShowAddSavings(true)}
          onRenew={handleRenewSavings}
        />
      </div>

      {/* Modals */}
      <AddBudgetModal
        isOpen={showAddBudget}
        onClose={() => { setShowAddBudget(false); setEditingBudget(null); }}
        onSubmit={editingBudget ? handleUpdateBudget : handleCreateBudget}
        categories={categories}
        initialData={editingBudget}
      />

      <AddSavingsModal
        isOpen={showAddSavings}
        onClose={() => setShowAddSavings(false)}
        onSubmit={handleCreateSavings}
      />
    </div>
  );
};

export default Budget;
