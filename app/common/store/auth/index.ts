import { useAuthStore } from "./auth.store";

export const useAuthProfile = () =>
  useAuthStore((state) => ({
    profile: state.profile,
    loading: state.loading,
  }));

export const useAuthUsers = () =>
  useAuthStore((state) => ({
    users: state.users,
    loading: state.loading,
  }));

export const useAuthActions = () => useAuthStore((state) => state.actions);

export const useAuthReset = () => useAuthStore((state) => state.actions.reset);
