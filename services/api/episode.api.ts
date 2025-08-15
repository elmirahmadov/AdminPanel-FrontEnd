import fetcher from "@/common/helpers/instance";
import { API } from "../apiResources";

// Bir sezona ait bölümleri getir
export const getEpisodesBySeason = (animeId: string, seasonId: string) => {
  console.log("Fetching episodes for anime:", animeId, "season:", seasonId);
  return fetcher.get(API.episode.getBySeason(animeId, seasonId));
};

// Belirli bir bölümü getir
export const getEpisodeById = (id: string) => fetcher.get(API.episode.get(id));

// Yeni bölüm ekle
export const addEpisode = (animeId: string, seasonId: string, data: any) => {
  console.log(
    "Adding episode for anime:",
    animeId,
    "season:",
    seasonId,
    "with data:",
    data
  );
  return fetcher.post(API.episode.create(animeId, seasonId), data);
};

// Bölüm güncelle
export const updateEpisode = (id: string, data: any) => {
  console.log("Updating episode:", id, "with data:", data);
  return fetcher.put(API.episode.update(id), data);
};

// Bölüm sil
export const deleteEpisode = (id: string) => {
  console.log("Deleting episode:", id);
  return fetcher.delete(API.episode.delete(id));
};
