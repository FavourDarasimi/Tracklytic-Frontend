import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Add01Icon,
  Notification01Icon,
  Logout01Icon,
} from "hugeicons-react";

const Navbar = ({ onAddTransaction }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/auth");
    }
    setShowUserMenu(false);
  };

  return (
    <div className="flex items-center justify-end gap-x-3 md:gap-x-7 px-4 md:px-6 xl:px-7 py-3">
      <div className="flex items-center gap-x-3 md:gap-x-7">
        <div className="relative border-1 border-black rounded-full">
          <Notification01Icon
            className={`p-[2px] md:p-[5px] w-7 h-7 md:w-8 md:h-8 cursor-pointer hover:text-green-600 transition`}
          />
          <div className="w-[6px] h-[6px] bg-red-700 rounded-full absolute top-0 right-0 md:right-0.5"></div>
        </div>

        <button
          onClick={onAddTransaction}
          aria-label="Add a new transaction"
          className={`bg-green-600 outline-none flex items-center gap-x-1 border-2 cursor-pointer text-white rounded-4xl hover:bg-white hover:border-2 hover:border-green-600 hover:text-green-600 transition-colors duration-500 whitespace-nowrap p-[4px] md:py-[10px] md:px-4 text-xs md:text-[14px]`}
        >
          <Add01Icon className="w-6 h-6" />
          <span className="hidden md:block">Add Transaction</span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">
                {user?.first_name || user?.email || "User"}
              </p>
            </div>
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
