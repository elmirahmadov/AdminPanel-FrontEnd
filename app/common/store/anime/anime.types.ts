export interface IAnime {
  id: string;
  title: string;
  slug: string;
  description: string;
  releaseYear: number;
  releaseDate?: string;
  episodes?: number;
  status: string;
  type?: string;
  genres?: string[];
  coverImage?: string;
  bannerImage?: string;
  imageUrl?: string; // Form için
  bannerUrl?: string; // Form için
  rating?: number;
  studios?: string[];
  studio?: string;
  season?: string;
  featured?: boolean;
}

export interface IAnimeStore {
  animes: IAnime[];
  loading: boolean;
  error: string | null;
}
