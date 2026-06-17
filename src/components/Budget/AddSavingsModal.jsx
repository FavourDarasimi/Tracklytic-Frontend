import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FiSave } from "react-icons/fi";

const AddSavingsModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || Number(targetAmount) <= 0) {
      setError("Please fill in all required fields.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        target_amount: Number(targetAmount),
        deadline: deadline || undefined,
        description: description.trim() || undefined,
        priority,
      });
      setName("");
      setTargetAmount("");
      setDeadline("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(err?.message || "Failed to create savings goal");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 grid place-items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[19px] font-semibold">New Savings Goal</h2>
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
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              placeholder="e.g. Emergency Fund"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Target Amount</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              placeholder="e.g. 500000"
              required
              min="1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              />
            </div>
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[14px] text-gray-700 mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="rounded-lg p-2.5 w-full border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm resize-none transition"
              placeholder="What are you saving for?"
            />
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
              {isSaving ? "Creating..." : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSavingsModal;
