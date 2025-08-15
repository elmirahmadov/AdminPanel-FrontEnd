// Use a single shared axios instance from helper to avoid duplication
import fetcher from "@/common/helpers/instance";
import { API } from "../apiResources";

// Tüm animeleri veya filtreli animeleri getir
export const getAnimes = (params?: any) =>
  fetcher.get(API.anime.getAll, { params });

// Belirli bir animeyi getir
export const getAnimeById = (id: string) => fetcher.get(API.anime.get(id));

// Yeni anime ekle (FormData veya JSON)
export const addAnime = (data: any) => {
  if (data instanceof FormData) {
    return fetcher.post(API.anime.create, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return fetcher.post(API.anime.create, data);
};

// Anime güncelle (FormData veya JSON)
export const updateAnime = (id: string, data: any) => {
  if (data instanceof FormData) {
    return fetcher.put(API.anime.update(id), data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return fetcher.put(API.anime.update(id), data);
};

// Anime sil
export const deleteAnime = (id: string) => fetcher.delete(API.anime.delete(id));

export const searchAnimes = (query: string) =>
  fetcher.get(`${API.anime.search}?q=${encodeURIComponent(query)}`);

export const lookupAnime = (query: string) =>
  fetcher.get(`${API.anime.lookup}?q=${encodeURIComponent(query)}`);

// Anime featured ekle
export const addToFeatured = (animeId: string) =>
  fetcher.post(API.anime.featured(animeId));

// Anime featured'dan çıkar
export const removeFromFeatured = (animeId: string) =>
  fetcher.delete(API.anime.featured(animeId));
