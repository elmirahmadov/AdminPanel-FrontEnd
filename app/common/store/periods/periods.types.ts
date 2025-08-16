export interface IPeriod {
  id: number;
  name: string;
  slug: string;
  description: string;
  startYear: number;
  endYear: number;
  animeCount: number;
  episodeCount: number;
  imageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  animes?: Array<{
    id: string;
    title: string;
    episodeCount: number;
    status: "ONGOING" | "COMPLETED" | "UPCOMING";
  }>;
}

export interface IPeriodsStore {
  periods: IPeriod[];
  loading: boolean;
  error: string | null;
}
