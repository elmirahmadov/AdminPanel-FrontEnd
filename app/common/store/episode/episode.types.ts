export interface IEpisode {
  id: string;
  seasonId: string;
  title: string;
  episodeNumber: number;
  duration?: number;
  videoUrl?: string;
  description?: string;
  thumbnailUrl?: string;
  releaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IEpisodeStore {
  episodes: IEpisode[];
  loading: boolean;
  error: string | null;
}
