import React, { useState } from "react";
import { FiTarget } from "react-icons/fi";
import { FiSave } from "react-icons/fi";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { budgetService } from "@/services/api";

const initialForm = {
  currency: "NGN",
  budgetPeriod: "Monthly",
  startDate: null,
  spendingLimit: "",
  alertThresholds: [],
  overSpendingAlerts: false,
};

const thresholdOptions = ["50%", "75%", "90%"];

const BudgetSettings = () => {
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
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
    setSaveMessage("");

    try {
      await budgetService.addGeneralBudget({
        amount: form.spendingLimit ? Number(form.spendingLimit) : undefined,
        period: form.budgetPeriod.toLowerCase(),
        currency: form.currency,
        start_date: form.startDate
          ? dayjs(form.startDate).format("YYYY-MM-DD")
          : undefined,
        alert_thresholds: form.alertThresholds,
        over_spending_alerts: form.overSpendingAlerts,
      });
      setSaveMessage("Budget settings saved successfully!");
    } catch (error) {
      setSaveMessage(error?.message || "Failed to save budget settings");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-x-3 items-center">
        <FiTarget size={22} className="text-green-600 flex-shrink-0" />
        <h1 className="text-[20px] md:text-[22px] font-semibold">
          Budget Settings
        </h1>
      </div>

      {saveMessage && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
          saveMessage.includes("successfully")
            ? "bg-green-50 text-green-700 border-l-4 border-green-600"
            : "bg-red-50 text-red-700 border-l-4 border-red-600"
        }`}>
          {saveMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-6 space-y-8">
          {/* Budget Basics */}
          <div>
            <h2 className="text-base md:text-[17px] font-semibold text-gray-800 mb-3">
              Budget Basics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Currency */}
              <div>
                <label className="block font-medium text-[14px] text-gray-700 mb-1">
                  Preferred Currency
                </label>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={form.currency}
                  onChange={handleChange("currency")}
                  InputProps={{ style: { height: "43px", fontSize: "14px" } }}
                >
                  <option value="NGN">NGN — Nigerian Naira</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="GBP">GBP — British Pound</option>
                </TextField>
              </div>

              {/* Budget Period */}
              <div>
                <label className="block font-medium text-[14px] text-gray-700 mb-1">
                  Budget Period
                </label>
                <TextField
                  select
                  SelectProps={{ native: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={form.budgetPeriod}
                  onChange={handleChange("budgetPeriod")}
                  InputProps={{ style: { height: "43px", fontSize: "14px" } }}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </TextField>
              </div>

              {/* Budget Start Date */}
              <div className="flex flex-col">
                <label className="block font-medium text-[14px] text-gray-700 mb-1">
                  Budget Start Date
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={form.startDate}
                    onChange={(newValue) =>
                      setForm((prev) => ({ ...prev, startDate: newValue }))
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        inputProps: { style: { height: "43px", fontSize: "14px" } },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>

          {/* Spending Controls */}
          <div>
            <h2 className="text-base md:text-[17px] font-semibold text-gray-800 mb-3">
              Spending Controls
            </h2>
            <div>
              <label className="block font-medium text-[14px] text-gray-700 mb-1">
                Overall Spending Limit
              </label>
              <TextField
                type="number"
                size="small"
                variant="outlined"
                placeholder="e.g. 50000"
                className="w-full sm:w-1/2"
                value={form.spendingLimit}
                onChange={handleChange("spendingLimit")}
                InputProps={{ style: { height: "43px", fontSize: "14px" } }}
              />
            </div>
          </div>

          {/* Alerts and Notifications */}
          <div>
            <h2 className="text-base md:text-[17px] font-semibold text-gray-800 mb-3">
              Alerts and Notifications
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              {/* Alert Thresholds */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <label className="font-medium text-[14px] text-gray-700 whitespace-nowrap">
                  Alert Thresholds:
                </label>
                <Box display="flex" flexWrap="wrap">
                  {thresholdOptions.map((threshold) => (
                    <FormControlLabel
                      key={threshold}
                      control={
                        <Checkbox
                          size="small"
                          checked={form.alertThresholds.includes(threshold)}
                          onChange={() => handleThresholdToggle(threshold)}
                        />
                      }
                      label={threshold}
                    />
                  ))}
                </Box>
              </div>

              {/* Over-Spending Alerts */}
              <div className="flex items-center gap-x-2">
                <label className="font-medium text-[14px] text-gray-700 whitespace-nowrap">
                  Over-Spending Alerts:
                </label>
                <Switch
                  size="small"
                  checked={form.overSpendingAlerts}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      overSpendingAlerts: e.target.checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-x-2 bg-green-600 text-white py-2 px-5 rounded-xl text-sm md:text-[15px] font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            <FiSave size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetSettings;
