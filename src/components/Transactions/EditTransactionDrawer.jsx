import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import * as transactionService from "../../services/api/transactionService";

const EditTransactionDrawer = ({ isOpen, onClose, onSubmit, categories = [], initialData }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    party_name: "",
    amount: "",
    type: "Income",
    category: "",
    currency: "NGN",
    notes: "",
    transaction_date: today,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen || !initialData) return;
    setFormData({
      party_name: initialData.party_name || "",
      amount: initialData.amount || "",
      type: initialData.type || "Income",
      category: initialData.category?.id || (typeof initialData.category === "number" ? initialData.category : "") || "",
      currency: initialData.currency || "NGN",
      notes: initialData.notes || "",
      transaction_date: initialData.transaction_date
        ? initialData.transaction_date.split("T")[0]
        : today,
    });
    setFormError("");
    setSubmitting(false);
  }, [isOpen, initialData, today]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sanitizeValue = (value) => {
    if (typeof value === "string") return value.trim();
    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount) {
      setFormError("Amount is required.");
      return;
    }
    setFormError("");
    setSubmitting(true);

    try {
      const parsedCategory = formData.category ? Number(formData.category) : undefined;

      const payload = {
        party_name: sanitizeValue(formData.party_name) || undefined,
        amount: Number(formData.amount),
        type: formData.type,
        category: parsedCategory && !isNaN(parsedCategory) ? parsedCategory : null,
        currency: formData.currency,
        notes: sanitizeValue(formData.notes) || undefined,
        transaction_date: formData.transaction_date
          ? `${formData.transaction_date}T00:00:00Z`
          : undefined,
      };

      const updated = await transactionService.updateTransaction(initialData.id, payload);

      if (onSubmit) onSubmit(updated);
      onClose();
    } catch (error) {
      setFormError(error?.message || "Unable to update transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[50]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-80 md:w-[400px] bg-white z-[60] transform transition-all duration-300 ease-in-out shadow-xl overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b border-gray-200 z-10">
          <h2 className="text-[17px] md:text-[19px] font-semibold">
            Edit Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X size={24} />
          </button>
        </div>

        <form className="p-4 space-y-4">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div>
            <label className="text-[14px] font-medium text-gray-600 mb-2 block">
              Party Name (Optional)
            </label>
            <input
              type="text"
              name="party_name"
              value={formData.party_name}
              onChange={handleChange}
              placeholder="e.g., Vendor, Store Name"
              className="w-full px-3 py-2 h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="text-[14px] font-medium text-gray-600 mb-2 block">
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              className="w-full px-3 py-2 h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="text-[14px] font-medium text-gray-600 mb-2 block">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="NGN">NGN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="JPY">JPY</option>
              <option value="KES">KES</option>
              <option value="ZAR">ZAR</option>
              <option value="GHS">GHS</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] font-medium text-gray-600 mb-2 block">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="text-[14px] font-medium text-gray-600 mb-2 block">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[14px] font-medium text-gray-600 mb-2 block">
              Date
            </label>
            <input
              type="date"
              name="transaction_date"
              value={formData.transaction_date}
              onChange={handleChange}
              className="w-full px-3 py-2 h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="text-[14px] font-medium text-gray-600 mb-2 block">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes..."
              rows="3"
              className="w-full px-3 py-2 h-[44px] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors mt-6 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Update Transaction"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditTransactionDrawer;
