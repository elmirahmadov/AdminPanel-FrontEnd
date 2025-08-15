import { create } from "zustand";

import { IAuthStore } from "./auth.types";
import { adminLogin as fetchLogin } from "../../../../services/api/admin.api";

const initial: Omit<IAuthStore, "actions"> = {
  loading: false,
  profile: null,
  users: [],
};

export const useAuthStore = create<IAuthStore>((set) => ({
  ...initial,
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({ ...initial }),
    getProfile: async (errCb?: (err: unknown) => void) => {
      set({ loading: true });
      try {
        const res = await getProfile();
        set({ profile: res.data, loading: false });
      } catch (err) {
        set({ loading: false });
        errCb?.(err);
      }
    },
    login: async (
      data: { email: string; password: string },
      errCb?: (err: unknown) => void
    ) => {
      set({ loading: true });
      try {
        const res = await fetchLogin(data);
        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        set({ loading: false });
      } catch (err) {
        set({ loading: false });
        errCb?.(err);
        throw err;
      }
    },
  },
}));
