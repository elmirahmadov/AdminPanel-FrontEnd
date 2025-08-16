import { create } from "zustand";

import { IPeriod } from "./periods.types";

import { periodsApi } from "../../../../services/api/periods.api";

interface IPeriodsStore {
  periods: IPeriod[];
  loading: boolean;
  error: string | null;
  fetchAllPeriods: () => Promise<void>;
  getPeriodById: (id: number) => Promise<IPeriod>;
  addPeriod: (
    data: Omit<IPeriod, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updatePeriod: (id: number, data: Partial<IPeriod>) => Promise<void>;
  deletePeriod: (id: number) => Promise<void>;
  addAnimeToPeriod: (
    periodId: number,
    animeId: string,
    episodeCount?: number
  ) => Promise<void>;
  removeAnimeFromPeriod: (periodId: number, animeId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initial: Omit<
  IPeriodsStore,
  | "fetchAllPeriods"
  | "getPeriodById"
  | "addPeriod"
  | "updatePeriod"
  | "deletePeriod"
  | "addAnimeToPeriod"
  | "removeAnimeFromPeriod"
  | "setLoading"
  | "reset"
> = {
  periods: [],
  loading: false,
  error: null,
};

export const usePeriodsStore = create<IPeriodsStore>((set, get) => ({
  ...initial,
  setLoading: (loading: boolean) => set({ loading }),
  reset: () => set({ ...initial }),
  fetchAllPeriods: async () => {
    set({ loading: true, error: null });
    try {
      const periods = await periodsApi.getAllPeriods();
      set({ periods, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  getPeriodById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const period = await periodsApi.getPeriodById(id.toString());
      set({ loading: false });
      return period;
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
      throw err;
    }
  },
  addPeriod: async (data: Omit<IPeriod, "id" | "createdAt" | "updatedAt">) => {
    set({ loading: true, error: null });
    try {
      const newPeriod = await periodsApi.createPeriod(data);
      const currentPeriods = get().periods;
      set({ periods: [...currentPeriods, newPeriod], loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  updatePeriod: async (id: number, data: Partial<IPeriod>) => {
    set({ loading: true, error: null });
    try {
      const updatedPeriod = await periodsApi.updatePeriod(id.toString(), data);
      const currentPeriods = get().periods;
      const updatedPeriods = currentPeriods.map((period) =>
        period.id === id ? updatedPeriod : period
      );
      set({ periods: updatedPeriods, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  deletePeriod: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await periodsApi.deletePeriod(id.toString());
      const currentPeriods = get().periods;
      const filteredPeriods = currentPeriods.filter(
        (period) => period.id !== id
      );
      set({ periods: filteredPeriods, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  addAnimeToPeriod: async (
    periodId: number,
    animeId: string,
    episodeCount = 0
  ) => {
    set({ loading: true, error: null });
    try {
      await periodsApi.addAnimeToPeriod(
        periodId.toString(),
        animeId,
        episodeCount
      );
      // Refresh periods to get updated data
      await get().fetchAllPeriods();
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  removeAnimeFromPeriod: async (periodId: number, animeId: string) => {
    set({ loading: true, error: null });
    try {
      await periodsApi.removeAnimeFromPeriod(periodId.toString(), animeId);
      // Refresh periods to get updated data
      await get().fetchAllPeriods();
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
}));
