export interface IPeriod {
  id: string;
  name: string; // Örn: "İlkbahar 2024", "Yaz 2024"
  year: number;
  season: "SPRING" | "SUMMER" | "AUTUMN" | "WINTER";
  startDate: string;
  endDate: string;
  animeCount: number;
  totalEpisodes: number; // Toplam bölüm sayısı
  animes: Array<{
    id: string;
    title: string;
    episodeCount: number;
    status: "ONGOING" | "COMPLETED" | "UPCOMING";
  }>;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPeriodsStore {
  periods: IPeriod[];
  loading: boolean;
  error: string | null;
}
