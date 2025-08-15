// character API client
import { API } from "../apiResources";

import fetcher from "@/common/helpers/instance";

export const getCharacters = () => fetcher.get(API.character.getAll);
export const getCharacterById = (id: string) =>
  fetcher.get(API.character.get(id));
export const createCharacter = (data: Record<string, unknown>) =>
  fetcher.post(API.character.create, data);
export const updateCharacter = (id: string, data: Record<string, unknown>) =>
  fetcher.put(API.character.update(id), data);
export const deleteCharacter = (id: string) =>
  fetcher.delete(API.character.delete(id));
export const searchCharacters = (params: { anime?: string; name?: string }) =>
  fetcher.get(API.character.search, { params });
