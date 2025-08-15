export interface ICharacter {
  id: string;
  name: string;
  description?: string;
  animeId?: string | number;
  animeTitle?: string;
  anime?: {
    id?: string | number;
    title?: string;
    name?: string;
  };
  imageUrl?: string;
  voiceActor?: string;
  role?: string;
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICharacterStore {
  characters: ICharacter[];
  loading: boolean;
  error: string | null;
}
