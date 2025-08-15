import { create } from "zustand";
import {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
} from "../../../../services/api/genre.api";
import type { IGenre } from "./genre.types";

interface IGenreStore {
  genres: IGenre[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchGenres: () => Promise<void>;
    addGenre: (data: Partial<IGenre>) => Promise<void>;
    editGenre: (id: string, data: Partial<IGenre>) => Promise<void>;
    removeGenre: (id: string) => Promise<void>;
    setLoading: (loading: boolean) => void;
    reset: () => void;
  };
}

const initial: Omit<IGenreStore, "actions"> = {
  genres: [],
  loading: false,
  error: null,
};

export const useGenreStore = create<IGenreStore>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({ ...initial }),
    fetchGenres: async () => {
      set({ loading: true, error: null });
      try {
        const res = await getGenres();
        set({ genres: res.data, loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Türler yüklenemedi" });
      }
    },
    addGenre: async (data) => {
      set({ loading: true, error: null });
      try {
        await createGenre(data);
        await get().actions.fetchGenres();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Tür eklenemedi" });
      }
    },
    editGenre: async (id, data) => {
      set({ loading: true, error: null });
      try {
        await updateGenre(id, data);
        await get().actions.fetchGenres();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Tür güncellenemedi" });
      }
    },
    removeGenre: async (id) => {
      set({ loading: true, error: null });
      try {
        await deleteGenre(id);
        await get().actions.fetchGenres();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Tür silinemedi" });
      }
    },
  },
}));
