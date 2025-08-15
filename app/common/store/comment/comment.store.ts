import { create } from "zustand";
import type {
  IComment,
  ICommentStore,
  ICommentCreatePayload,
} from "./comment.types";
import {
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  approveComment,
  rejectComment,
} from "../../../../services/api/comment.api";

interface Store extends ICommentStore {
  actions: {
    fetchComments: () => Promise<void>;
    searchComments: (q: {
      content?: string;
      anime?: string;
      user?: string;
    }) => Promise<void>;
    addComment: (data: ICommentCreatePayload) => Promise<void>;
    editComment: (id: number, data: Partial<IComment>) => Promise<void>;
    removeComment: (id: number) => Promise<void>;
    approveComment: (id: number) => Promise<void>;
    rejectComment: (id: number) => Promise<void>;
    reset: () => void;
    setLoading: (loading: boolean) => void;
    setPagination: (pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }) => void;
  };
}

const initial: Omit<Store, "actions"> = {
  comments: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
  },
};

export const useCommentStore = create<Store>((set, get) => ({
  ...initial,
  actions: {
    setLoading: (loading: boolean) => set({ loading }),
    setPagination: (pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }) => set({ pagination }),
    reset: () => set({ ...initial }),
    fetchComments: async () => {
      set({ loading: true, error: null });
      try {
        const res = await getComments();
        // Handle the new response structure with pagination
        if (
          res.data &&
          typeof res.data === "object" &&
          "comments" in res.data
        ) {
          set({
            comments: res.data.comments || [],
            pagination: res.data.pagination || initial.pagination,
            loading: false,
          });
        } else {
          // Fallback for old API structure
          set({
            comments: Array.isArray(res.data) ? res.data : [],
            loading: false,
          });
        }
      } catch (err: any) {
        set({
          loading: false,
          error: err?.message || "Yorumlar yüklenemedi",
        });
      }
    },
    searchComments: async (q) => {
      set({ loading: true, error: null });
      try {
        const { searchComments } = await import(
          "../../../../services/api/comment.api"
        );
        const res = await searchComments(q);
        // Handle the new response structure with pagination
        if (
          res.data &&
          typeof res.data === "object" &&
          "comments" in res.data
        ) {
          set({
            comments: res.data.comments || [],
            pagination: res.data.pagination || initial.pagination,
            loading: false,
          });
        } else {
          // Fallback for old API structure
          set({
            comments: Array.isArray(res.data) ? res.data : [],
            loading: false,
          });
        }
      } catch (err: any) {
        set({
          loading: false,
          error: err?.message || "Yorumlar getirilemedi",
        });
      }
    },
    addComment: async (data) => {
      set({ loading: true, error: null });
      try {
        await createComment(data);
        await get().actions.fetchComments();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Yorum eklenemedi" });
      }
    },
    editComment: async (id, data) => {
      set({ loading: true, error: null });
      try {
        await updateComment(id.toString(), data);
        await get().actions.fetchComments();
        set({ loading: false });
      } catch (err: any) {
        set({
          loading: false,
          error: err?.message || "Yorum güncellenemedi",
        });
      }
    },
    removeComment: async (id) => {
      set({ loading: true, error: null });
      try {
        await deleteComment(id.toString());
        await get().actions.fetchComments();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Yorum silinemedi" });
      }
    },
    approveComment: async (id) => {
      set({ loading: true, error: null });
      try {
        await approveComment(id.toString());
        await get().actions.fetchComments();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Yorum onaylanamadı" });
      }
    },
    rejectComment: async (id) => {
      set({ loading: true, error: null });
      try {
        await rejectComment(id.toString());
        await get().actions.fetchComments();
        set({ loading: false });
      } catch (err: any) {
        set({ loading: false, error: err?.message || "Yorum reddedilemedi" });
      }
    },
  },
}));
