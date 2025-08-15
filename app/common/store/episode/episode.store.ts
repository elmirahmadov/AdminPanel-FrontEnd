import { create } from "zustand";

import { IEpisode } from "./episode.types";
import {
  addEpisode,
  deleteEpisode,
  getEpisodesBySeason,
  updateEpisode,
} from "../../../../services/api/episode.api";

interface IEpisodeStore {
  episodes: IEpisode[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchEpisodes: (animeId: string, seasonId: string) => Promise<void>;
    addEpisode: (
      animeId: string,
      seasonId: string,
      data: Partial<IEpisode>
    ) => Promise<void>;
    updateEpisode: (id: string, data: Partial<IEpisode>) => Promise<void>;
    deleteEpisode: (id: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    reset: () => void;
  };
}

const initial: Omit<IEpisodeStore, "actions"> = {
  episodes: [],
  loading: false,
  error: null,
};

export const useEpisodeStore = create<IEpisodeStore>((set, get) => ({
  ...initial,
  episodes: [], // Explicitly ensure episodes is an array
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({ ...initial }),
    fetchEpisodes: async (animeId: string, seasonId: string) => {
      set({ loading: true, error: null });
      try {
        const res = await getEpisodesBySeason(animeId, seasonId);
        console.log("API Response:", res);
        console.log("Response data:", res.data);
        // Axios response has data property
        const episodesData = Array.isArray(res.data) ? res.data : [];
        console.log("Processed episodes:", episodesData);
        set({ episodes: episodesData, loading: false });
      } catch (err: any) {
        set({
          episodes: [],
          loading: false,
          error: err?.message || "Bir hata oluştu",
        });
      }
    },
    addEpisode: async (animeId: string, seasonId: string, data) => {
      set({ loading: true, error: null });
      try {
        console.log("Adding episode with data:", data);
        const response = await addEpisode(animeId, seasonId, data);
        console.log("Episode add response:", response);
        await get().actions.fetchEpisodes(animeId, seasonId);
        set({ loading: false });
      } catch (err: any) {
        console.error("Episode add error:", err);
        console.error("Error response:", err.response);
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
        throw err; // Re-throw to handle in component
      }
    },
    updateEpisode: async (id, data) => {
      set({ loading: true, error: null });
      try {
        await updateEpisode(id, data);
        // Update sonrası listeyi yenilemek için animeId ve seasonId gerekli
        // Bu bilgileri data'dan alabiliriz veya store'da tutabiliriz
        console.log("Episode updated, need to refresh list");
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
    deleteEpisode: async (id) => {
      set({ loading: true, error: null });
      try {
        // Silmeden önce seasonId'yi bulmamız gerek
        const episode = get().episodes.find((e) => e.id === id);
        await deleteEpisode(id);
        // Eğer episode bulunduysa ve animeId varsa, listeyi yenile
        if (episode?.seasonId) {
          // Burada animeId'yi de almamız gerekiyor, şimdilik sadece seasonId ile yeniliyoruz
          // TODO: Anime ID'yi de store'da tutmak gerekebilir
          console.log("Episode deleted, but need animeId to refresh list");
        }
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Bir hata oluştu" });
      }
    },
  },
}));
