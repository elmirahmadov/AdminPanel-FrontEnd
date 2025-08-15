import { IDashboardStats } from "@/common/types/api.types";

export interface IDashboardStore {
  loading: boolean;
  stats: IDashboardStats | null;
  actions: {
    setLoading: (loading: boolean) => void;
    reset: () => void;
    getStats: (errCb?: (err: unknown) => void) => Promise<void>;
  };
}
