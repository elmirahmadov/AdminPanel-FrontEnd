import { useDashboardStore } from "./dashboard.store";

export const useDashboardLogs = () =>
  useDashboardStore((state) => ({
    logs: state.logs,
    loading: state.loading,
  }));

export const useDashboardStats = () =>
  useDashboardStore((state) => ({
    stats: state.stats,
    loading: state.loading,
  }));

export const useDashboardActions = () =>
  useDashboardStore((state) => state.actions);

export const useDashboardReset = () =>
  useDashboardStore((state) => state.actions.reset);
