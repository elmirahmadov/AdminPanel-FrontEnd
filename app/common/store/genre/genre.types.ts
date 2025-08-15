export interface IGenre {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IGenreStore {
  genres: IGenre[];
  loading: boolean;
  error: string | null;
}
