import { create } from "zustand";

import { IPeriod } from "./periods.types";

interface IPeriodsStore {
  periods: IPeriod[];
  loading: boolean;
  error: string | null;
  fetchAllPeriods: () => Promise<void>;
  addPeriod: (data: any) => Promise<void>;
  updatePeriod: (id: string, data: any) => Promise<void>;
  deletePeriod: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initial: Omit<
  IPeriodsStore,
  | "fetchAllPeriods"
  | "addPeriod"
  | "updatePeriod"
  | "deletePeriod"
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
      // Mock data for anime seasons
      const mockPeriods = [
        {
          id: "1",
          name: "İlkbahar 2024",
          year: 2024,
          season: "SPRING",
          startDate: "2024-03-20",
          endDate: "2024-06-20",
          animeCount: 45,
          totalEpisodes: 540,
          animes: [
            {
              id: "1",
              title: "One Piece",
              episodeCount: 12,
              status: "ONGOING",
            },
            {
              id: "2",
              title: "Demon Slayer",
              episodeCount: 26,
              status: "COMPLETED",
            },
            {
              id: "3",
              title: "My Hero Academia",
              episodeCount: 25,
              status: "COMPLETED",
            },
            {
              id: "4",
              title: "Attack on Titan",
              episodeCount: 12,
              status: "ONGOING",
            },
            {
              id: "5",
              title: "Jujutsu Kaisen",
              episodeCount: 24,
              status: "COMPLETED",
            },
          ],
          description: "2024 İlkbahar anime sezonu",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          name: "Yaz 2024",
          year: 2024,
          season: "SUMMER",
          startDate: "2024-06-21",
          endDate: "2024-09-22",
          animeCount: 38,
          totalEpisodes: 456,
          animes: [
            {
              id: "6",
              title: "Naruto Shippuden",
              episodeCount: 20,
              status: "ONGOING",
            },
            {
              id: "7",
              title: "Dragon Ball Super",
              episodeCount: 12,
              status: "COMPLETED",
            },
            { id: "8", title: "Bleach", episodeCount: 25, status: "COMPLETED" },
            {
              id: "9",
              title: "Hunter x Hunter",
              episodeCount: 12,
              status: "ONGOING",
            },
          ],
          description: "2024 Yaz anime sezonu",
          createdAt: "2024-01-02",
          updatedAt: "2024-01-02",
        },
        {
          id: "3",
          name: "Sonbahar 2024",
          year: 2024,
          season: "AUTUMN",
          startDate: "2024-09-23",
          endDate: "2024-12-20",
          animeCount: 42,
          totalEpisodes: 504,
          animes: [
            {
              id: "10",
              title: "Death Note",
              episodeCount: 37,
              status: "COMPLETED",
            },
            {
              id: "11",
              title: "Fullmetal Alchemist",
              episodeCount: 51,
              status: "COMPLETED",
            },
            {
              id: "12",
              title: "Code Geass",
              episodeCount: 25,
              status: "COMPLETED",
            },
            {
              id: "13",
              title: "Steins;Gate",
              episodeCount: 24,
              status: "COMPLETED",
            },
          ],
          description: "2024 Sonbahar anime sezonu",
          createdAt: "2024-01-03",
          updatedAt: "2024-01-03",
        },
        {
          id: "4",
          name: "Kış 2024",
          year: 2024,
          season: "WINTER",
          startDate: "2024-12-21",
          endDate: "2025-03-19",
          animeCount: 35,
          totalEpisodes: 420,
          animes: [
            {
              id: "14",
              title: "Tokyo Ghoul",
              episodeCount: 12,
              status: "COMPLETED",
            },
            {
              id: "15",
              title: "Parasyte",
              episodeCount: 24,
              status: "COMPLETED",
            },
            {
              id: "16",
              title: "Psycho-Pass",
              episodeCount: 22,
              status: "COMPLETED",
            },
            {
              id: "17",
              title: "Fate/Stay Night",
              episodeCount: 25,
              status: "COMPLETED",
            },
          ],
          description: "2024 Kış anime sezonu",
          createdAt: "2024-01-04",
          updatedAt: "2024-01-04",
        },
      ];
      set({ periods: mockPeriods, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  addPeriod: async (data) => {
    set({ loading: true, error: null });
    try {
      // Mock add period
      const newPeriod = {
        id: Date.now().toString(),
        name: data.name,
        year: data.year,
        season: data.season,
        startDate: data.startDate,
        endDate: data.endDate,
        animeCount: data.animeCount || 0,
        totalEpisodes: data.totalEpisodes || 0,
        animes: data.animes || [],
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const currentPeriods = get().periods;
      set({ periods: [...currentPeriods, newPeriod], loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  updatePeriod: async (id, data) => {
    set({ loading: true, error: null });
    try {
      // Mock update period
      const currentPeriods = get().periods;
      const updatedPeriods = currentPeriods.map((period) =>
        period.id === id
          ? { ...period, ...data, updatedAt: new Date().toISOString() }
          : period
      );
      set({ periods: updatedPeriods, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
  deletePeriod: async (id) => {
    set({ loading: true, error: null });
    try {
      // Mock delete period
      const currentPeriods = get().periods;
      const filteredPeriods = currentPeriods.filter(
        (period) => period.id !== id
      );
      set({ periods: filteredPeriods, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.message || "Bir hata oluştu" });
    }
  },
}));
