import { create } from "zustand";
import type { ICharacter } from "./character.types";
import {
  getCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../../../../services/api/character.api";

interface Store {
  characters: ICharacter[];
  loading: boolean;
  error: string | null;
  actions: {
    fetchCharacters: () => Promise<void>;
    searchCharacters: (q: { anime?: string; name?: string }) => Promise<void>;
    addCharacter: (data: Partial<ICharacter>) => Promise<void>;
    editCharacter: (id: string, data: Partial<ICharacter>) => Promise<void>;
    removeCharacter: (id: string) => Promise<void>;
    reset: () => void;
    setLoading: (loading: boolean) => void;
  };
}

const initial: Omit<Store, "actions"> = {
  characters: [],
  loading: false,
  error: null,
};

export const useCharacterStore = create<Store>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({ ...initial }),
    fetchCharacters: async () => {
      set({ loading: true, error: null });
      try {
        const res = await getCharacters();
        set({ characters: res.data, loading: false });
      } catch (err: any) {
        set({
          loading: false,
          error: err?.message || "Karakterler yüklenemedi",
        });
      }
    },
    searchCharacters: async (q) => {
      set({ loading: true, error: null });
      try {
        const { searchCharacters } = await import(
          "../../../../services/api/character.api"
        );
        const res = await searchCharacters(q);
        set({ characters: res.data, loading: false });
      } catch (err: any) {
        set({
          loading: false,
          error: err?.message || "Karakterler getirilemedi",
        });
      }
    },
    addCharacter: async (data) => {
      set({ loading: true, error: null });
      try {
        await createCharacter(data);
        await get().actions.fetchCharacters();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Karakter eklenemedi" });
      }
    },
    editCharacter: async (id, data) => {
      set({ loading: true, error: null });
      try {
        await updateCharacter(id, data);
        await get().actions.fetchCharacters();
        set({ loading: false });
      } catch (err: any) {
        set({
          loading: false,
          error: err?.message || "Karakter güncellenemedi",
        });
      }
    },
    removeCharacter: async (id) => {
      set({ loading: true, error: null });
      try {
        await deleteCharacter(id);
        await get().actions.fetchCharacters();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Karakter silinemedi" });
      }
    },
  },
}));
