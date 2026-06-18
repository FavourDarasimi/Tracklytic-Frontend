import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import AddTransactionForm from "../components/AddTransactionForm";
import { useCategoryContext } from "../context/CategoryContext";
import * as savingPlanService from "../services/api/savingPlanService";

const MainLayout = () => {
  const queryClient = useQueryClient();
  const [collapsed, setCollapsed] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const { categories } = useCategoryContext();

  const { data: savingsPlans = [] } = useQuery({
    queryKey: ["saving-plans"],
    queryFn: async () => {
      const data = await savingPlanService.getUserSavingPlans();
      return Array.isArray(data) ? data : [];
    },
  });

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header — visible on all screens */}
        <div className="sticky top-0 z-30 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
          <Navbar onAddTransaction={() => setShowAddTransaction(true)} />
        </div>

        {/* Page Content */}
        <div className="flex-1 px-4 md:px-6 xl:px-7 py-4 md:py-5 pb-20 lg:pb-4 md:pb-5">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNavbar onAddTransaction={() => setShowAddTransaction(true)} />

      {/* Add Transaction Form */}
      <AddTransactionForm
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSubmit={() => queryClient.invalidateQueries({ queryKey: ["transactions"] })}
        categories={categories}
        savingsPlans={savingsPlans}
      />
    </div>
  );
};

export default MainLayout;
