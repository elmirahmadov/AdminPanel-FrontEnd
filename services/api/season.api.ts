import fetcher from "@/common/helpers/instance";
import { API } from "../apiResources";

// Bir animeye ait sezonları getir
export const getSeasonsByAnime = (animeId: string) =>
  fetcher.get(API.season.getByAnime(animeId));

// Belirli bir sezonu getir
export const getSeasonById = (id: string) => fetcher.get(API.season.get(id));

// Yeni sezon ekle
export const addSeason = (data: any) => {
  const { animeId, ...rest } = data;
  return fetcher.post(API.season.create(animeId), rest);
};

// Sezon güncelle
export const updateSeason = (seasonId: string, animeId: string, data: any) =>
  fetcher.put(API.season.update(seasonId, animeId), data);

// Sezon sil
export const deleteSeason = (seasonId: string, animeId: string) =>
  fetcher.delete(API.season.delete(seasonId, animeId));
