import { useQuery } from "@tanstack/react-query";
import { dashboardService, insightService } from "@/services/api";

export const useDashboardData = () => {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch: refreshDashboard,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const data = await dashboardService.getDashboardData();
      return {
        categories: data.categories ?? [],
        overview: data.overview ?? {},
        latest_transactions: data.latest_transactions ?? [],
      };
    },
  });

  const {
    data: insights = [],
    isLoading: isInsightsLoading,
  } = useQuery({
    queryKey: ["dashboard-insights"],
    queryFn: async () => {
      const data = await insightService.getAIInsights();
      return Array.isArray(data) ? data : [];
    },
  });

  return {
    categories: dashboardData?.categories ?? [],
    overview: dashboardData?.overview ?? {},
    latest_transactions: dashboardData?.latest_transactions ?? [],
    insights,
    isLoading,
    isInsightsLoading,
    error: error?.message || null,
    refreshDashboard,
  };
};

export default useDashboardData;
