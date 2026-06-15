import React, { useState, useEffect } from "react";
import { FiPieChart } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoAddOutline } from "react-icons/io5";
import AddCategory from "./AddCategory";
import { categoryService } from "@/services/api";

const CategoriesSettings = () => {
  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await categoryService.getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (categoryData) => {
    try {
      const created = await categoryService.addCategory(categoryData);
      setCategories((prev) => [...prev, created]);
      setShowCategory(false);
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  return (
    <div className="w-full">
      {showCategory && (
        <AddCategory
          setShowCategory={setShowCategory}
          onSubmit={handleAddCategory}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] md:text-[22px] font-semibold">
            Expense Categories
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your expense categories and customize them.
          </p>
        </div>
        <button
          className="flex items-center gap-x-1.5 bg-green-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap flex-shrink-0"
          onClick={() => setShowCategory(true)}
        >
          <IoAddOutline size={18} />
          Add Category
        </button>
      </div>

      {/* Category Grid */}
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex justify-between items-center p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Color swatch */}
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 border border-black/10"
                  style={{ backgroundColor: category.color || "#44bca2" }}
                />
                <div className="min-w-0">
                  <h2 className="text-sm md:text-[15px] font-semibold text-gray-800 truncate">
                    {category.name}
                  </h2>
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      category.type === "income" || category.type === "Income"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {category.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesSettings;
