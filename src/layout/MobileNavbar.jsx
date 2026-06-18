import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardSquare01Icon,
  Wallet01Icon,
  ChartLineData01Icon,
  ChartIcon,
  Add01Icon,
  RepeatIcon,
} from "hugeicons-react";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: DashboardSquare01Icon, href: "/dashboard" },
  { key: "transactions", label: "Transactions", icon: Wallet01Icon, href: "/transactions" },
  { key: "budget", label: "Budget", icon: ChartLineData01Icon, href: "/budget" },
  { key: "recurring", label: "Recurring", icon: RepeatIcon, href: "/recurring-transactions" },
  { key: "statistics", label: "Stats", icon: ChartIcon, href: "/statistics" },
];

const MobileNavbar = ({ onAddTransaction }) => {
  const location = useLocation();

  const getActive = (pathname) => {
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/transactions")) return "transactions";
    if (pathname.startsWith("/budget")) return "budget";
    if (pathname.startsWith("/recurring-transactions")) return "recurring";
    if (pathname.startsWith("/statistics")) return "statistics";
    return "dashboard";
  };

  const active = getActive(location.pathname);

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <Link
              key={item.key}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-0 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* FAB */}
        <div className="relative -mt-5">
          <button
            onClick={onAddTransaction}
            className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors active:scale-95 cursor-pointer"
            aria-label="Add transaction"
          >
            <Add01Icon size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
