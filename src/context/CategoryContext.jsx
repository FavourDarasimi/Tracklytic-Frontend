import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/api";

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const {
    data: categories = [],
    isLoading,
    refetch: refreshCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await categoryService.getCategories();
      return Array.isArray(data) ? data : [];
    },
  });

  return (
    <CategoryContext.Provider value={{ categories, isLoading, refreshCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategoryContext must be used within a CategoryProvider");
  }
  return context;
};

export default CategoryContext;
