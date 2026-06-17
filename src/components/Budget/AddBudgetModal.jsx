import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiSave } from "react-icons/fi";

const AddBudgetModal = ({ isOpen, onClose, onSubmit, categories }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [categoryId, setCategoryId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      if (categoryId) {
        await onSubmit({
          category: Number(categoryId),
          amount: Number(amount),
          period,
          name: name.trim() || undefined,
        });
      } else {
        await onSubmit({
          amount: Number(amount),
          period,
          name: name.trim() || undefined,
        });
      }
      setName("");
      setAmount("");
      setPeriod("monthly");
      setCategoryId("");
    } catch (err) {
      setError(err?.message || "Failed to create budget");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 grid place-items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[19px] font-semibold">Create Budget</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer" aria-label="Close">
            <RxCross2 size={20} className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border-l-4 border-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Budget Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              placeholder="e.g. Monthly Spending"
            />
          </div>

          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Budget Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              placeholder="e.g. 100000"
              required
              min="1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">Category (optional)</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              >
                <option value="">General Budget</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-x-2 bg-green-600 text-white py-2 px-5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60 cursor-pointer"
            >
              <FiSave size={16} />
              {isSaving ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudgetModal;
