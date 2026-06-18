import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Add01Icon,
  Notification01Icon,
  Settings01Icon,
  ArrowDown01Icon,
  Logout01Icon,
  ChartLineData01Icon,
} from "hugeicons-react";

const Navbar = ({ onAddTransaction }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/auth");
    }
    setShowUserMenu(false);
  };

  const getPageTitle = (pathname) => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/transactions")) return "Transactions";
    if (pathname.startsWith("/budget")) return "Budget & Savings";
    if (pathname.startsWith("/recurring-transactions"))
      return "Recurring Transactions";
    if (pathname.startsWith("/statistics")) return "Statistics";
    if (pathname.startsWith("/settings")) return "Settings";
    return "";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="flex items-center gap-x-3 px-4 md:px-6 xl:px-7 py-3">
      {/* Logo + Page Title — mobile only */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <ChartLineData01Icon className="text-white w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">
            Track<span className="text-green-600">lytic</span>
          </h1>
          {pageTitle && (
            <p className="text-[10px] text-gray-500 leading-tight">
              {pageTitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-x-3 md:gap-x-7 ml-auto">
        <div className="relative border border-gray-300 rounded-full">
          <Notification01Icon
            className={`p-[2px] md:p-[5px] w-7 h-7 md:w-8 md:h-8 cursor-pointer text-gray-700 hover:text-green-600 transition`}
          />
          <div className="w-[6px] h-[6px] bg-red-700 rounded-full absolute top-0 right-0 md:right-0.5"></div>
        </div>

        <button
          onClick={() => navigate("/settings")}
          aria-label="Settings"
          className="border border-gray-300 rounded-full cursor-pointer text-gray-700 hover:text-green-600 transition"
        >
          <Settings01Icon className="p-[2px] md:p-[5px] w-7 h-7 md:w-8 md:h-8" />
        </button>

        <button
          onClick={onAddTransaction}
          aria-label="Add a new transaction"
          className={`hidden lg:flex bg-green-600 outline-none items-center gap-x-1 border-2 cursor-pointer text-white rounded-4xl hover:bg-white hover:border-2 hover:border-green-600 hover:text-green-600 transition-colors duration-500 whitespace-nowrap p-[4px] md:py-[10px] md:px-4 text-xs md:text-[14px]`}
        >
          <Add01Icon className="w-6 h-6" />
          <span className="hidden md:block">Add Transaction</span>
        </button>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-x-2 px-3 py-2 transition border border-gray-200 rounded-full"
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <ArrowDown01Icon
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>

              <div className="py-2">
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-x-2"
                >
                  <Logout01Icon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
