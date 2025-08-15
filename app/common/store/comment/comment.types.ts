export interface IComment {
  id: number;
  content: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "HIDDEN";
  likesCount: number;
  dislikesCount: number;
  isEdited: boolean;
  isSpoiler: boolean;
  imageUrl: string | null;
  gifUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: "USER" | "ADMIN" | "MODERATOR";
    status: "ACTIVE" | "INACTIVE" | "BANNED";
  };
  anime: {
    id: number;
    title: string;
  } | null;
  season: {
    id: number;
    title: string;
    number: number;
  } | null;
  episode: {
    id: number;
    title: string;
    number: number;
  } | null;
  parent: IComment | null;
  replies: Array<{
    id: number;
    content: string;
    user: {
      id: number;
      username: string;
      role: string;
    };
  }>;
  reports: Array<{
    id: number;
    reason: string;
    reportedBy: string;
    createdAt: string;
  }>;
}

export interface ICommentCreatePayload {
  animeId: number;
  seasonId?: number; // Optional for anime comments
  episodeId?: number; // Optional for season comments
  content: string;
  isSpoiler?: boolean;
}

export interface ICommentStore {
  comments: IComment[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
