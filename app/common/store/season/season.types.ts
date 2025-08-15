export interface ISeason {
  id: string;
  animeId: string;
  name: string;
  number: number;
  episodeCount: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ISeasonStore {
  seasons: ISeason[];
  loading: boolean;
  error: string | null;
}
