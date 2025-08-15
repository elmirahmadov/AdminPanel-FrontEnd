import { create } from "zustand";

import { IDashboardStore } from "./dashboard.types";
import { getAdminStats } from "../../../../services/api/admin.api";

const initial: Omit<IDashboardStore, "actions"> = {
  loading: false,
  stats: null,
};

export const useDashboardStore = create<IDashboardStore>((set) => ({
  ...initial,
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({ ...initial }),
    getStats: async (errCb?: (err: unknown) => void) => {
      set({ loading: true });
      try {
        const res = await getAdminStats();

        if (res && res.data) {
          // Ensure the response has the expected structure
          const stats = res.data;
          if (typeof stats === "object" && stats !== null) {
            // Check if stats has the required properties
            const requiredProps = [
              "totalUsers",
              "activeUsers",
              "totalAnimes",
              "totalComments",
            ];
            const hasRequiredProps = requiredProps.every(
              (prop) => prop in stats
            );

            if (hasRequiredProps) {
              set({ stats, loading: false });
            } else {
              // eslint-disable-next-line no-console
              console.error("Stats missing required properties:", stats);
              // Create default stats object
              const defaultStats = {
                totalUsers: 0,
                activeUsers: 0,
                bannedUsers: 0,
                totalAnimes: 0,
                totalComments: 0,
                totalReports: 0,
                totalViews: 0,
                pendingReports: 0,
                lastUpdated: new Date().toISOString(),
              };
              set({ stats: defaultStats, loading: false });
              errCb?.(new Error("Stats missing required properties"));
            }
          } else {
            // eslint-disable-next-line no-console
            console.error("Invalid stats response structure:", stats);
            set({ stats: null, loading: false });
            errCb?.(new Error("Invalid stats response structure"));
          }
        } else {
          // eslint-disable-next-line no-console
          console.error("No data in stats response:", res);
          set({ stats: null, loading: false });
          errCb?.(new Error("No data in stats response"));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching stats:", err);
        // Network error durumunda default stats kullan
        const defaultStats = {
          totalUsers: 0,
          activeUsers: 0,
          bannedUsers: 0,
          totalAnimes: 0,
          totalComments: 0,
          totalReports: 0,
          totalViews: 0,
          pendingReports: 0,
          lastUpdated: new Date().toISOString(),
        };
        set({ stats: defaultStats, loading: false });
        errCb?.(err);
      }
    },
  },
}));
