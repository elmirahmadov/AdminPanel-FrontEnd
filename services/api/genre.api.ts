import fetcher from "@/common/helpers/instance";
import { API } from "../apiResources";

// Genres API (reuses shared axios instance and baseURL)
export const getGenres = () => fetcher.get(API.genre.getAll);
export const getGenreById = (id: string) => fetcher.get(API.genre.get(id));
export const createGenre = (data: any) => fetcher.post(API.genre.create, data);
export const updateGenre = (id: string, data: any) =>
  fetcher.put(API.genre.update(id), data);
export const deleteGenre = (id: string) => fetcher.delete(API.genre.delete(id));
