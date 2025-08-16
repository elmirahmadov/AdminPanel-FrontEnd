import fetcher from "@/common/helpers/instance";
import { IPeriod } from "../../app/common/store/periods/periods.types";

export const periodsApi = {
  // Tüm dönemleri listele
  getAllPeriods: async (): Promise<IPeriod[]> => {
    const response = await fetcher.get("/api/periods");
    return response.data;
  },

  // Belirli dönemi getir
  getPeriodById: async (id: string): Promise<IPeriod> => {
    const response = await fetcher.get(`/api/periods/${id}`);
    return response.data;
  },

  // Yeni dönem oluştur
  createPeriod: async (
    data: Omit<IPeriod, "id" | "createdAt" | "updatedAt">
  ): Promise<IPeriod> => {
    const response = await fetcher.post("/api/periods", data);
    return response.data;
  },

  // Dönem güncelle
  updatePeriod: async (
    id: string,
    data: Partial<IPeriod>
  ): Promise<IPeriod> => {
    const response = await fetcher.put(`/api/periods/${id}`, data);
    return response.data;
  },

  // Dönem sil
  deletePeriod: async (id: string): Promise<void> => {
    await fetcher.delete(`/api/periods/${id}`);
  },

  // Döneme anime ekle
  addAnimeToPeriod: async (
    periodId: string,
    animeId: string,
    episodeCount: number = 0
  ): Promise<void> => {
    await fetcher.post(`/api/periods/${periodId}/animes/${animeId}`, {
      episodeCount,
    });
  },

  // Dönemden anime çıkar
  removeAnimeFromPeriod: async (
    periodId: string,
    animeId: string
  ): Promise<void> => {
    await fetcher.delete(`/api/periods/${periodId}/animes/${animeId}`);
  },
};
