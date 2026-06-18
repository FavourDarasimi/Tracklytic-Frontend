import {
  Briefcase,
  UtensilsCrossed,
  Car,
  Clapperboard,
  ReceiptText,
  ShoppingBag,
  HeartPulse,
  PiggyBank,
  CircleDollarSign,
} from "lucide-react";

export const formatCurrency = (amount, currency = "₦") => {
  return `${currency}${typeof amount === "number" ? amount.toLocaleString() : amount}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const categoryConfig = {
  salary: { icon: Briefcase, bg: "bg-blue-100", text: "text-blue-600", ring: "ring-blue-200" },
  income: { icon: Briefcase, bg: "bg-green-100", text: "text-green-600", ring: "ring-green-200" },
  food: { icon: UtensilsCrossed, bg: "bg-orange-100", text: "text-orange-600", ring: "ring-orange-200" },
  transport: { icon: Car, bg: "bg-purple-100", text: "text-purple-600", ring: "ring-purple-200" },
  entertainment: { icon: Clapperboard, bg: "bg-pink-100", text: "text-pink-600", ring: "ring-pink-200" },
  bills: { icon: ReceiptText, bg: "bg-yellow-100", text: "text-yellow-600", ring: "ring-yellow-200" },
  shopping: { icon: ShoppingBag, bg: "bg-indigo-100", text: "text-indigo-600", ring: "ring-indigo-200" },
  health: { icon: HeartPulse, bg: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-200" },
  savings: { icon: PiggyBank, bg: "bg-teal-100", text: "text-teal-600", ring: "ring-teal-200" },
  default: { icon: CircleDollarSign, bg: "bg-gray-100", text: "text-gray-600", ring: "ring-gray-200" },
};

export const getCategoryConfig = (category) => {
  const key = (category || "").toLowerCase();
  return categoryConfig[key] || categoryConfig.default;
};

export const getTransactionBadgeColor = (type) => {
  return type === "Income"
    ? "bg-green-50 text-green-700 border border-green-200"
    : "bg-red-50 text-red-600 border border-red-200";
};

export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  const change = ((current - previous) / previous) * 100;
  return change.toFixed(1);
};
