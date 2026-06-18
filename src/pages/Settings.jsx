import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService, categoryService } from "@/services/api";
import { FaRegUser } from "react-icons/fa6";
import { FiLock, FiPieChart, FiSave, FiEdit2, FiTrash2, FiUpload } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { getCategoryConfig } from "../components/Transactions/transactionUtils";
import ConfirmModal from "../components/ConfirmModal";

const CURRENCIES = ["NGN", "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "KES", "ZAR", "GHS"];

const LOCALE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "ar", label: "Arabic" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
];

const TIMEZONE_OPTIONS = [
  "UTC", "Africa/Lagos", "Africa/Nairobi", "Africa/Johannesburg",
  "Africa/Accra", "Africa/Cairo", "Europe/London", "Europe/Paris",
  "Europe/Berlin", "America/New_York", "America/Chicago",
  "America/Denver", "America/Los_Angeles", "Asia/Dubai",
  "Asia/Tokyo", "Asia/Shanghai", "Asia/Kolkata",
];

const initialProfile = {
  username: "",
  email: "",
  age: "",
  phoneNumber: "",
  occupation: "",
  lastName: "",
  bio: "",
  avatar: null,
  locale: "en",
  timezone: "UTC",
  base_currency: "NGN",
};

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

    </div>
  );
};

/* ==================================================================
   Profile Information
   ================================================================== */
const ProfileSection = () => {
  const { user, updateUser, updateProfileData } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      const p = user.profile || {};
      setProfile({
        username: user.username || "",
        email: user.email || "",
        age: p.age?.toString() || "",
        phoneNumber: p.phone_number || "",
        occupation: p.occupation || "",
        lastName: user.last_name || "",
        bio: p.bio || "",
        avatar: null,
        locale: p.locale || "en",
        timezone: p.timezone || "UTC",
        base_currency: p.base_currency || "NGN",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfile((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const updatedUser = await authService.updateProfile({
        username: profile.username,
        email: profile.email,
        last_name: profile.lastName,
      });
      await updateProfileData({
        age: profile.age ? Number(profile.age) : undefined,
        phone_number: profile.phoneNumber || undefined,
        occupation: profile.occupation || undefined,
        bio: profile.bio || undefined,
        locale: profile.locale,
        timezone: profile.timezone,
        base_currency: profile.base_currency,
      });
      updateUser({ ...updatedUser, profile: { ...user?.profile, ...updatedUser.profile } });
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Locale</label>
            <select
              name="locale"
              value={profile.locale}
              onChange={handleChange}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
            >
              {LOCALE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Timezone</label>
            <select
              name="timezone"
              value={profile.timezone}
              onChange={handleChange}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Preferred Currency</label>
            <select
              name="base_currency"
              value={profile.base_currency}
              onChange={handleChange}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Avatar</label>
            <label className="flex items-center gap-2 rounded-lg p-2.5 w-full h-[43px] border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
              <FiUpload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{profile.avatar ? profile.avatar.name : "Upload photo"}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
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
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: () => {} });

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
    setConfirmModal({
      isOpen: true,
      title: "Delete Category",
      message: `Delete category "${cat.name}"?`,
      onConfirm: async () => {
        try {
          await categoryService.deleteCategory(cat.id);
          setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        } catch (err) {
          console.error("Failed to delete category", err);
        }
      },
    });
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
      />
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
