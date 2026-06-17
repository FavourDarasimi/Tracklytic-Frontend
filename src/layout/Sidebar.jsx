import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DashboardSquare01Icon,
  Wallet01Icon,
  TransactionIcon,
  ChartIcon,
  Logout01Icon,
  ChartLineData01Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "hugeicons-react";

const navItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: DashboardSquare01Icon,
    href: "/dashboard",
  },
  {
    key: "transactions",
    label: "Transactions",
    icon: Wallet01Icon,
    href: "/transactions",
  },
  {
    key: "budget",
    label: "Budget & Savings",
    icon: ChartLineData01Icon,
    href: "/budget",
  },
  { key: "statistics", label: "Statistics", icon: ChartIcon, disabled: true },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getActive = (pathname) => {
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/transactions")) return "transactions";
    if (pathname.startsWith("/budget")) return "budget";
    return "dashboard";
  };

  const active = getActive(location.pathname);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/auth");
    }
  };

  const navItemClass = (isActive, disabled = false, collapsed = false) =>
    `flex items-center gap-3 text-sm md:text-[15px] ${
      collapsed ? "justify-center px-0" : "px-4"
    } py-3 rounded-full transition-all duration-200 font-medium select-none ${
      disabled
        ? "cursor-not-allowed opacity-50"
        : isActive
          ? "bg-green-600 text-white shadow-md"
          : "hover:bg-gray-100 hover:text-black cursor-pointer text-gray-700"
    }`;

  return (
    <aside
      className={`hidden lg:flex relative flex-col bg-white h-full transition-all duration-300 shrink-0 border-r border-gray-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className={collapsed ? "flex justify-center p-3 pt-5" : "p-4 pt-5"}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ChartLineData01Icon className="text-white w-4 h-4" />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold">
              Track<span className="text-green-600">lytic</span>
            </h1>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto mt-4">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;

            if (item.href) {
              return (
                <li key={item.key}>
                  <Link to={item.href}>
                    <div
                      className={navItemClass(
                        isActive,
                        item.disabled,
                        collapsed,
                      )}
                    >
                      <Icon size={collapsed ? 24 : 20} />
                      {!collapsed && (
                        <span className="text-[14px] md:text-[15px] truncate">
                          {item.label}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.key}>
                <div
                  className="relative group"
                  title={collapsed ? item.label : undefined}
                >
                  <div
                    className={navItemClass(isActive, item.disabled, collapsed)}
                  >
                    <Icon size={collapsed ? 24 : 20} />
                    {!collapsed && (
                      <span className="text-[14px] md:text-[15px] truncate">
                        {item.label}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile */}
      <div className={collapsed ? "p-2 pb-4" : "px-3 pb-4"}>
        <div
          className={`flex items-center border-t border-gray-200 ${
            collapsed ? "justify-center pt-3" : "justify-between p-3"
          }`}
        >
          {collapsed ? (
            <div className="relative group">
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : user?.email || "User"}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {user?.first_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm md:text-[15px] font-semibold truncate">
                    {user?.first_name
                      ? `${user.first_name} ${user.last_name || ""}`
                      : user?.email || "User"}
                  </p>
                  <p className="text-[12px] text-gray-500 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                aria-label="Log out"
              >
                <Logout01Icon size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-7  w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition z-50 cursor-pointer"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpenIcon size={18} className="text-gray-500" />
        ) : (
          <PanelLeftCloseIcon size={18} className="text-gray-500" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
