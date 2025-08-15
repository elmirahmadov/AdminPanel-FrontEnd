import { create } from "zustand";
import { ISeason } from "./season.types";
import {
  getSeasonsByAnime,
  getSeasonById,
  addSeason as apiAddSeason,
  updateSeason as apiUpdateSeason,
  deleteSeason as apiDeleteSeason,
} from "../../../../services/api/season.api";

interface ISeasonStore {
  seasons: ISeason[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchSeasons: (animeId: string) => Promise<void>;
    fetchAllSeasons: () => Promise<void>;
    addSeason: (data: any) => Promise<void>;
    updateSeason: (id: string, data: any) => Promise<void>;
    deleteSeason: (id: string, animeId: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    reset: () => void;
  };
}

const initial: Omit<ISeasonStore, "actions"> = {
  seasons: [],
  loading: false,
  error: null,
};

export const useSeasonStore = create<ISeasonStore>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({ ...initial }),
    fetchSeasons: async (animeId: string) => {
      set({ loading: true, error: null });
      try {
        const res = await getSeasonsByAnime(animeId);
        set({ seasons: res.data.seasons || [], loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    fetchAllSeasons: async () => {
      set({ loading: true, error: null });
      try {
        // Mock data for mevsimler sayfası
        const mockSeasons = [
          {
            id: "1",
            animeId: "anime1",
            name: "Sezon 1",
            number: 1,
            episodeCount: 12,
            description: "İlk sezon",
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
          {
            id: "2",
            animeId: "anime2",
            name: "Sezon 2",
            number: 2,
            episodeCount: 24,
            description: "İkinci sezon",
            createdAt: "2024-01-02",
            updatedAt: "2024-01-02",
          },
        ];
        set({ seasons: mockSeasons, loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    addSeason: async (data) => {
      set({ loading: true, error: null });
      try {
        // slug ve releaseYear opsiyonel, number zorunlu
        const payload = {
          animeId: data.animeId,
          name: data.name,
          slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, "-"),
          number: data.number,
          releaseYear: data.releaseYear,
          episodeCount: data.episodeCount || 0,
        };
        await apiAddSeason(payload);
        await get().actions.fetchSeasons(data.animeId);
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    updateSeason: async (id, data) => {
      set({ loading: true, error: null });
      try {
        const payload = {
          name: data.name,
          slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, "-"),
          number: data.number,
          releaseYear: data.releaseYear,
          episodeCount: data.episodeCount || 0,
        };
        await apiUpdateSeason(id, data.animeId, payload);
        await get().actions.fetchSeasons(data.animeId);
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    deleteSeason: async (id, animeId) => {
      set({ loading: true, error: null });
      try {
        await apiDeleteSeason(id, animeId);
        await get().actions.fetchSeasons(animeId);
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
  },
}));
