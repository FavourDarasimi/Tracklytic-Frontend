import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { RxCross2 } from "react-icons/rx";
import {
  FiSave,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { recurringTransactionService } from "@/services/api";

const frequencies = ["Daily", "Weekly", "Monthly", "Yearly"];

const TransactionSelector = ({
  selectedId,
  onSelect,
  search,
  onSearchChange,
  page,
  onPageChange,
  totalPages,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["non-recurring-transactions", search, page],
    queryFn: () =>
      recurringTransactionService.getNonRecurringTransactions({
        search: search || undefined,
        page,
        page_size: 10,
      }),
    keepPreviousData: true,
  });

  const transactions = data?.results || [];
  const total = data?.count || 0;
  const pages = Math.ceil(total / 10);

  return (
    <div className="space-y-3">
      <div className="relative">
        <FiSearch
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onPageChange(1);
          }}
          placeholder="Search transactions..."
          className="rounded-lg pl-9 pr-3 py-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
        />
      </div>

      <div className="max-h-72 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            {search
              ? "No transactions match your search."
              : "No transactions yet. Add one first."}
          </p>
        ) : (
          transactions.map((txn) => {
            const isSelected = selectedId === txn.id;
            const isIncome = txn.type === "Income";
            return (
              <button
                key={txn.id}
                type="button"
                onClick={() => onSelect(txn)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isIncome ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${isIncome ? "text-green-600" : "text-red-500"}`}
                  >
                    {isIncome ? "I" : "E"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {txn.party_name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {txn.category?.name || "Uncategorized"}
                  </p>
                </div>
                <span
                  className={`text-sm font-bold flex-shrink-0 ${isIncome ? "text-green-600" : "text-red-500"}`}
                >
                  {isIncome ? "+" : "-"}₦{Number(txn.amount).toLocaleString()}
                </span>
              </button>
            );
          })
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-500">
            Page {page} of {pages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const FrequencyForm = ({
  selectedTxn,
  frequency,
  setFrequency,

  endDate,
  setEndDate,
  onSubmit,
  onBack,
  isSaving,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      frequency,

      end_date: endDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
            selectedTxn.type === "Income" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <span
            className={`text-xs font-bold ${selectedTxn.type === "Income" ? "text-green-600" : "text-red-500"}`}
          >
            {selectedTxn.type === "Income" ? "I" : "E"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {selectedTxn.party_name || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">
            {selectedTxn.category?.name || "Uncategorized"} — ₦
            {Number(selectedTxn.amount).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-[14px] text-gray-700 mb-1">
            Frequency *
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
          >
            {frequencies.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium text-[14px] text-gray-700 mb-1">
            End Date (Optional)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
          />
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-x-2 bg-green-600 text-white py-2 px-5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60 cursor-pointer"
        >
          <FiSave size={16} />
          {isSaving ? "Creating..." : "Create Recurring"}
        </button>
      </div>
    </form>
  );
};

const EditForm = ({
  initialData,
  categories,
  frequency,
  setFrequency,
  nextDueDate,
  setNextDueDate,
  endDate,
  setEndDate,
  onSubmit,
  onClose,
  isSaving,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nextDueDate) return;
    onSubmit({
      frequency,
      next_due_date: nextDueDate,
      end_date: endDate || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium text-[14px] text-gray-700 mb-1">
          Category
        </label>
        <select
          value=""
          disabled
          className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 bg-gray-50 text-sm transition cursor-not-allowed"
        >
          <option value="">
            {typeof initialData.category === "string" ? initialData.category : initialData.category?.name || "Uncategorized"}
          </option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-[14px] text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="text"
          value={`₦${Number(initialData.amount).toLocaleString()}`}
          disabled
          className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 bg-gray-50 text-sm transition cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-[14px] text-gray-700 mb-1">
            Frequency *
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
          >
            {frequencies.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium text-[14px] text-gray-700 mb-1">
            Next Due Date *
          </label>
          <input
            type="date"
            value={nextDueDate}
            onChange={(e) => setNextDueDate(e.target.value)}
            className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-medium text-[14px] text-gray-700 mb-1">
          End Date (Optional)
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-lg p-2.5 w-full h-[43px] border border-gray-200 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20 text-sm transition"
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
          {isSaving ? "Saving..." : "Update"}
        </button>
      </div>
    </form>
  );
};

const RecurringTransactionModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
}) => {
  const [step, setStep] = useState("select");
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [frequency, setFrequency] = useState("Monthly");
  const [nextDueDate, setNextDueDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setStep(initialData ? "edit" : "select");
    setSelectedTxn(null);
    setSearch("");
    setPage(1);
    setFrequency(initialData?.frequency || "Monthly");
    setNextDueDate(initialData?.next_due_date?.split("T")[0] || "");
    setEndDate(initialData?.end_date?.split("T")[0] || "");
    setError(null);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSelect = (txn) => {
    setSelectedTxn(txn);
    setStep("configure");
    setFrequency("Monthly");
    setNextDueDate("");
    setEndDate("");
  };

  const handleCreate = async (data) => {
    setIsSaving(true);
    setError(null);
    try {
      await recurringTransactionService.makeTransactionRecurring(
        selectedTxn.id,
        data,
      );
      onClose();
      onSubmit();
    } catch (err) {
      setError(err?.message || "Failed to create recurring transaction");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 grid place-items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-lg mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[19px] font-semibold">
            {step === "select" && "Select Transaction"}
            {step === "configure" && "Configure Schedule"}
            {step === "edit" && "Edit Recurring Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            aria-label="Close"
          >
            <RxCross2 size={20} className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-red-50 text-red-700 border-l-4 border-red-600">
            {error}
          </div>
        )}

        {step === "select" && (
          <TransactionSelector
            selectedId={selectedTxn?.id}
            onSelect={handleSelect}
            search={search}
            onSearchChange={setSearch}
            page={page}
            onPageChange={setPage}
          />
        )}

        {step === "configure" && selectedTxn && (
          <FrequencyForm
            selectedTxn={selectedTxn}
            frequency={frequency}
            setFrequency={setFrequency}
            nextDueDate={nextDueDate}
            setNextDueDate={setNextDueDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onSubmit={handleCreate}
            onBack={() => setStep("select")}
            isSaving={isSaving}
          />
        )}

        {step === "edit" && initialData && (
          <EditForm
            initialData={initialData}
            categories={categories}
            frequency={frequency}
            setFrequency={setFrequency}
            nextDueDate={nextDueDate}
            setNextDueDate={setNextDueDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onSubmit={(data) => {
              setIsSaving(true);
              setError(null);
              onSubmit(data)
                .catch((err) => {
                  setError(err?.message || "Failed to update");
                })
                .finally(() => setIsSaving(false));
            }}
            onClose={onClose}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default RecurringTransactionModal;
