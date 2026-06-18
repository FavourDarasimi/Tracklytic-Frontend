import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService, categoryService, budgetService } from "@/services/api";
import { FaRegUser } from "react-icons/fa6";
import { FiLock, FiPieChart, FiTarget, FiSave, FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { getCategoryConfig } from "../components/Transactions/transactionUtils";

const initialProfile = {
  username: "",
  email: "",
  age: "",
  phoneNumber: "",
  occupation: "",
  lastName: "",
  bio: "",
};

const initialBudget = {
  currency: "NGN",
  budgetPeriod: "Monthly",
  startDate: "",
  spendingLimit: "",
  alertThresholds: [],
  overSpendingAlerts: false,
};

const thresholdOptions = ["50%", "75%", "90%"];

const Settings = () => {
  const { user } = useAuth();

  const displayName = useMemo(() => {
    if (!user) return "Tracklytic user";
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Tracklytic user";
  }, [user]);

  const memberSince = useMemo(() => {
    if (!user?.created_at) return null;
    const d = new Date(user.created_at);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  }, [user]);

  return (
    <div className="w-full pb-8">

      {/* ====== Page Header ====== */}
      <div className="mb-6">
        <h1 className="text-[22px] md:text-[25px] font-bold">Settings</h1>
        <p className="text-sm md:text-[15px] text-gray-500 mt-1">
          Manage your account and personal preferences.
        </p>
      </div>

      {/* ====== User Info Card ====== */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {user?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email || ""}</p>
            {memberSince && (
              <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>
            )}
          </div>
        </div>
      </div>

      {/* ====== Profile Information ====== */}
      <ProfileSection />

      {/* ====== Change Password ====== */}
      <PasswordSection />

      {/* ====== Categories ====== */}
      <CategoriesSection />

      {/* ====== Budget Settings ====== */}
      <BudgetSection />

    </div>
  );
};

/* ==================================================================
   Profile Information
   ================================================================== */
const ProfileSection = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || "",
        age: user.age || "",
        phoneNumber: user.phone_number || "",
        occupation: user.occupation || "",
        lastName: user.last_name || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const updated = await authService.updateProfile({
        username: profile.username,
        email: profile.email,
        last_name: profile.lastName,
        age: profile.age ? Number(profile.age) : undefined,
        phone_number: profile.phoneNumber,
        occupation: profile.occupation,
        bio: profile.bio,
      });
      updateUser(updated);
      setMessage({ type: "success", text: "Profile saved successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to save profile" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <SectionCard icon={<FaRegUser size={22} className="text-green-600" />} title="Profile Information" description="Update your account profile information.">
      {message && <MessageBanner message={message} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Username" name="username" value={profile.username} onChange={handleChange} placeholder="Username" />
          <InputField label="Email" name="email" type="email" value={profile.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Age" name="age" type="number" value={profile.age} onChange={handleChange} placeholder="Age" />
          <InputField label="Phone Number" name="phoneNumber" type="tel" value={profile.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Occupation" name="occupation" value={profile.occupation} onChange={handleChange} placeholder="Occupation" />
          <InputField label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" />
        </div>
        <div>
          <label className="block font-medium text-[14px] text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={3}
            className="rounded-lg p-2.5 w-full border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm resize-none transition"
            placeholder="Tell us a little about yourself..."
          />
        </div>
        <SaveButton isSaving={isSaving} />
      </form>
    </SectionCard>
  );
};

/* ==================================================================
   Change Password
   ================================================================== */
const PasswordSection = () => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const result = await changePassword(form.oldPassword, form.newPassword);
      if (result.success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update password" });
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to update password" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <SectionCard icon={<FiLock size={22} className="text-green-600" />} title="Change Password" description="Update your account password.">
      {message && <MessageBanner message={message} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Current Password" name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} placeholder="Enter current password" />
        <InputField label="New Password" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="Enter new password" />
        <InputField label="Confirm New Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
        <SaveButton isSaving={isSaving} text={isSaving ? "Updating..." : "Update Password"} />
      </form>
    </SectionCard>
  );
};

/* ==================================================================
   Categories
   ================================================================== */
const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await categoryService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAdd = async (data) => {
    try {
      const created = await categoryService.addCategory(data);
      setCategories((prev) => [...prev, created]);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  const handleEdit = async (data) => {
    try {
      const updated = await categoryService.updateCategory(editingCategory.id, data);
      setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated } : c)));
      setEditingCategory(null);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update category", err);
    }
  };

  const handleDelete = useCallback(async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await categoryService.deleteCategory(cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  }, []);

  const openEdit = useCallback((cat) => {
    setEditingCategory(cat);
    setShowModal(true);
  }, []);

  const openAdd = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  return (
    <SectionCard
      icon={<FiPieChart size={22} className="text-green-600" />}
      title="Expense Categories"
      description="Manage your expense categories."
      action={
        <button
          onClick={openAdd}
          className="flex items-center gap-x-1.5 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap flex-shrink-0"
        >
          <IoAddOutline size={18} />
          Add Category
        </button>
      }
    >
      {showModal && (
        <AddCategoryModal
          onSubmit={editingCategory ? handleEdit : handleAdd}
          onClose={() => { setShowModal(false); setEditingCategory(null); }}
          initialData={editingCategory}
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">No categories yet. Click "Add Category" to create one.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {categories.map((cat) => {
            const config = getCategoryConfig(cat.name);
            const Icon = config.icon;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow group relative"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg} ring-1 ${config.ring}`}>
                  <Icon size={20} className={config.text} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">{cat.name}</p>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                    cat.type === "income" || cat.type === "Income"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-500"
                  }`}>
                    {cat.type}
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                    aria-label="Edit category"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 cursor-pointer"
                    aria-label="Delete category"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
};

/* ==================================================================
   Add Category Modal
   ================================================================== */
const AddCategoryModal = ({ onSubmit, onClose, initialData }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Expense");
  const [color, setColor] = useState("#44bca2");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setType(initialData.type === "Income" ? "Income" : "Expense");
      setColor(initialData.color || "#44bca2");
    } else {
      setName("");
      setType("Expense");
      setColor("#44bca2");
    }
  }, [initialData]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), type: type.toLowerCase(), color });
  };

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 grid place-items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h1 className="text-[19px] font-semibold">{isEdit ? "Edit Category" : "Add Category"}</h1>
          <RxCross2 size={20} onClick={onClose} className="cursor-pointer text-gray-500 hover:text-gray-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="font-medium pb-1 text-[15px]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm mt-1"
              placeholder="Category name"
              required
            />
          </div>
          <div>
            <label className="font-medium pb-1 text-[15px]">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm mt-1"
            >
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
          <div>
            <label className="font-medium pb-1 text-[15px]">Color Tag</label>
            <div className="flex gap-3 mt-1 items-center">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-full w-10 h-10 cursor-pointer"
              />
              <span className="text-[14px] text-gray-500">{color}</span>
              <div className="w-6 h-6 rounded-full shadow" style={{ backgroundColor: color }} />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
          >
            {isEdit ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ==================================================================
   Budget Settings
   ================================================================== */
const BudgetSection = () => {
  const [form, setForm] = useState(initialBudget);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleThresholdToggle = (value) => {
    setForm((prev) => ({
      ...prev,
      alertThresholds: prev.alertThresholds.includes(value)
        ? prev.alertThresholds.filter((t) => t !== value)
        : [...prev.alertThresholds, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await budgetService.addGeneralBudget({
        amount: form.spendingLimit ? Number(form.spendingLimit) : undefined,
        period: form.budgetPeriod.toLowerCase(),
        currency: form.currency,
        start_date: form.startDate || undefined,
        alert_thresholds: form.alertThresholds,
        over_spending_alerts: form.overSpendingAlerts,
      });
      setMessage({ type: "success", text: "Budget settings saved successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "Failed to save budget settings" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <SectionCard icon={<FiTarget size={22} className="text-green-600" />} title="Budget Settings" description="Set your budget preferences and spending limits.">
      {message && <MessageBanner message={message} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Preferred Currency" value={form.currency} onChange={handleChange("currency")}>
            <option value="NGN">NGN — Nigerian Naira</option>
            <option value="USD">USD — US Dollar</option>
            <option value="GBP">GBP — British Pound</option>
          </SelectField>
          <SelectField label="Budget Period" value={form.budgetPeriod} onChange={handleChange("budgetPeriod")}>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Budget Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={handleChange("startDate")}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
            />
          </div>
          <InputField label="Overall Spending Limit" name="spendingLimit" type="number" value={form.spendingLimit} onChange={handleChange("spendingLimit")} placeholder="e.g. 50000" />
        </div>

        <div>
          <label className="block font-medium text-[14px] text-gray-700 mb-2">Alert Thresholds</label>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {thresholdOptions.map((threshold) => (
              <label key={threshold} className="flex items-center gap-x-1.5 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.alertThresholds.includes(threshold)}
                  onChange={() => handleThresholdToggle(threshold)}
                  className="accent-green-600 w-4 h-4"
                />
                {threshold}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <label className="font-medium text-[14px] text-gray-700 whitespace-nowrap">Over-Spending Alerts:</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.overSpendingAlerts}
              onChange={(e) => setForm((prev) => ({ ...prev, overSpendingAlerts: e.target.checked }))}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600" />
          </label>
        </div>

        <SaveButton isSaving={isSaving} text={isSaving ? "Saving..." : "Save Budget Settings"} />
      </form>
    </SectionCard>
  );
};

/* ==================================================================
   Shared UI Components
   ================================================================== */

const SectionCard = ({ icon, title, description, action, children }) => (
  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex gap-x-3 items-center">
          {icon}
          <h2 className="text-[20px] md:text-[22px] font-semibold">{title}</h2>
        </div>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
    <div className="mt-5">{children}</div>
  </div>
);

const MessageBanner = ({ message }) => (
  <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
    message.type === "success"
      ? "bg-green-50 text-green-700 border-l-4 border-green-600"
      : "bg-red-50 text-red-700 border-l-4 border-red-600"
  }`}>
    {message.text}
  </div>
);

const InputField = ({ label, name, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block font-medium text-[14px] text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, value, onChange, children }) => (
  <div>
    <label className="block font-medium text-[14px] text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
    >
      {children}
    </select>
  </div>
);

const SaveButton = ({ isSaving, text = "Save Changes" }) => (
  <button
    type="submit"
    disabled={isSaving}
    className="flex items-center gap-x-2 bg-green-600 text-white py-2 px-5 rounded-xl text-sm md:text-[15px] font-medium hover:bg-green-700 transition-colors disabled:opacity-60 cursor-pointer"
  >
    <FiSave size={16} />
    {isSaving ? "Saving..." : text}
  </button>
);

export default Settings;
