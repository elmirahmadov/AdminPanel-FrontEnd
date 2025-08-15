import { create } from "zustand";
import { IAnime } from "./anime.types";
import {
  getAnimes,
  getAnimeById,
  addAnime,
  updateAnime,
  deleteAnime,
  addToFeatured,
  removeFromFeatured,
} from "../../../../services/api/anime.api";

interface IAnimeStore {
  animes: IAnime[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchAnimes: () => Promise<void>;
    addAnime: (data: any) => Promise<void>;
    updateAnime: (id: string, data: any) => Promise<void>;
    deleteAnime: (id: string) => Promise<void>;
    addToFeatured: (animeId: string) => Promise<void>;
    removeFromFeatured: (animeId: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    reset: () => void;
  };
}

const initial: Omit<IAnimeStore, "actions"> = {
  animes: [],
  loading: false,
  error: null,
};

export const useAnimeStore = create<IAnimeStore>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({ ...initial }),
    fetchAnimes: async () => {
      set({ loading: true, error: null });
      try {
        const res = await getAnimes();
        set({ animes: res.data, loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    addAnime: async (data) => {
      set({ loading: true, error: null });
      try {
        await addAnime(data);
        await get().actions.fetchAnimes();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    updateAnime: async (id, data) => {
      set({ loading: true, error: null });
      try {
        await updateAnime(id, data);
        await get().actions.fetchAnimes();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    deleteAnime: async (id) => {
      set({ loading: true, error: null });
      try {
        await deleteAnime(id);
        await get().actions.fetchAnimes();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    addToFeatured: async (animeId: string) => {
      try {
        await addToFeatured(animeId);
      } catch (err: any) {
        console.error("Featured eklenirken hata oluştu:", err?.message);
      }
    },
    removeFromFeatured: async (animeId: string) => {
      try {
        await removeFromFeatured(animeId);
      } catch (err: any) {
        console.error("Featured çıkarılırken hata oluştu:", err?.message);
      }
    },
  },
}));
