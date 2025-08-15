import { IAdminProfile } from "@/common/types/api.types";

export interface IAuthStore {
  loading: boolean;
  profile: IAdminProfile | null;
  users: IAdminProfile[];
  actions: {
    setLoading: (loading: boolean) => void;
    reset: () => void;
    getProfile: (errCb?: (err: unknown) => void) => Promise<void>;
    login: (data: { email: string; password: string }, errCb?: (err: unknown) => void) => Promise<void>;
  };
}
