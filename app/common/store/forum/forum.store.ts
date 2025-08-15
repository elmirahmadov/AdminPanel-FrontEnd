import { create } from "zustand";

import type { IForum, IForumCreate, IForumUpdate, ITopic } from "./forum.types";
import { forumApi } from "../../../../services/api/forum.api";

interface ForumState {
  forums: IForum[];
  topics: ITopic[]; // Konular için state ekledim
  loading: boolean;
  error: string | null;
  // Moderasyon işlemleri için ayrı loading state'leri
  moderatingTopics: Set<string>; // Hangi topic'lerin moderasyon işlemi yapıldığını takip et
}

interface ForumActions {
  // Admin forum yönetimi
  fetchForums: () => Promise<void>;
  addForum: (forum: IForumCreate) => Promise<void>;
  editForum: (id: string, updates: IForumUpdate) => Promise<void>;
  removeForum: (id: string) => Promise<void>;

  // Admin kategori yönetimi
  createCategory: (category: {
    name: string;
    description?: string;
  }) => Promise<void>;
  updateCategory: (
    id: string,
    category: { name?: string; description?: string }
  ) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  // Admin konu yönetimi
  getAllTopics: () => Promise<void>;
  getTopicsByForum: (forumId: string) => Promise<void>;
  createTopic: (topic: {
    title: string;
    content: string;
    forumId?: string;
  }) => Promise<void>;
  updateTopic: (
    id: string,
    topic: { title?: string; content?: string; status?: string }
  ) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;

  // Topic moderasyon işlemleri
  pinTopic: (id: string) => Promise<void>;
  lockTopic: (id: string) => Promise<void>;
  stickyTopic: (id: string) => Promise<void>;

  // Admin içerik moderasyonu
  deletePost: (id: string) => Promise<void>;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type ForumStore = ForumState & ForumActions;

export const useForumStore = create<ForumStore>((set) => ({
  // State
  forums: [],
  topics: [],
  loading: false,
  error: null,
  moderatingTopics: new Set(),

  // Actions
  fetchForums: async () => {
    set({ loading: true, error: null });
    try {
      const forums = await forumApi.getAll();
      set({ forums, loading: false });
    } catch (error) {
      set({
        error: "Forums yüklenirken hata oluştu",
        loading: false,
      });
    }
  },

  addForum: async (forumData: IForumCreate) => {
    set({ loading: true, error: null });
    try {
      const newForum = await forumApi.create(forumData);
      set((state) => ({
        forums: [...state.forums, newForum],
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Forum eklenirken hata oluştu",
        loading: false,
      });
    }
  },

  editForum: async (id: string, updates: IForumUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedForum = await forumApi.update(id, updates);
      set((state) => ({
        forums: state.forums.map((forum) =>
          forum.id === id ? updatedForum : forum
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Forum güncellenirken hata oluştu",
        loading: false,
      });
    }
  },

  removeForum: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await forumApi.delete(id);
      set((state) => ({
        forums: state.forums.filter((forum) => forum.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Forum silinirken hata oluştu",
        loading: false,
      });
    }
  },

  // Admin kategori yönetimi
  createCategory: async (categoryData: {
    name: string;
    description?: string;
  }) => {
    set({ loading: true, error: null });
    try {
      await forumApi.createCategory(categoryData);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Kategori eklenirken hata oluştu",
        loading: false,
      });
    }
  },

  updateCategory: async (
    id: string,
    categoryData: { name?: string; description?: string }
  ) => {
    set({ loading: true, error: null });
    try {
      await forumApi.updateCategory(id, categoryData);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Kategori güncellenirken hata oluştu",
        loading: false,
      });
    }
  },

  removeCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await forumApi.deleteCategory(id);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Kategori silinirken hata oluştu",
        loading: false,
      });
    }
  },

  // Admin konu yönetimi
  getAllTopics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await forumApi.getAllTopics();
      // API response'u doğru şekilde parse et
      const topics = response.topics || [];
      set({ topics, loading: false });
    } catch (error) {
      set({
        error: "Konular yüklenirken hata oluştu",
        loading: false,
      });
    }
  },

  getTopicsByForum: async (forumId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await forumApi.getTopicsByForum(forumId);
      // API response'u doğru şekilde parse et
      const topics = response.topics || [];
      set({ topics, loading: false });
    } catch (error) {
      set({
        error: "Forum konuları yüklenirken hata oluştu",
        loading: false,
      });
    }
  },

  createTopic: async (topicData: {
    title: string;
    content: string;
    forumId?: string;
  }) => {
    set({ loading: true, error: null });
    try {
      const newTopic = await forumApi.createTopic(topicData);
      set((state) => ({
        topics: [...state.topics, newTopic],
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Konu oluşturulurken hata oluştu",
        loading: false,
      });
    }
  },

  getTopic: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await forumApi.getTopic(id);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Konu yüklenirken hata oluştu",
        loading: false,
      });
    }
  },

  updateTopic: async (
    id: string,
    topic: { title?: string; content?: string; status?: string }
  ) => {
    set({ loading: true, error: null });
    try {
      const updatedTopic = await forumApi.updateTopic(id, topic);
      set((state) => ({
        topics: state.topics.map((t) =>
          t.id.toString() === id ? updatedTopic : t
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Konu güncellenirken hata oluştu",
        loading: false,
      });
    }
  },

  deleteTopic: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await forumApi.deleteTopic(id);
      set((state) => ({
        topics: state.topics.filter((t) => t.id.toString() !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Konu silinirken hata oluştu",
        loading: false,
      });
    }
  },

  // Topic moderasyon işlemleri
  pinTopic: async (id: string) => {
    set((state) => ({
      moderatingTopics: new Set([...state.moderatingTopics, id]),
      error: null,
    }));
    try {
      await forumApi.pinTopic(id);
      // Local state'i güncelle, yeni API çağrısı yapma
      set((state) => ({
        topics: state.topics.map((t) =>
          t.id.toString() === id ? { ...t, isPinned: !t.isPinned } : t
        ),
        moderatingTopics: new Set(
          [...state.moderatingTopics].filter((topicId) => topicId !== id)
        ),
      }));
    } catch (error) {
      set((state) => ({
        error: "Konu sabitleme hatası",
        moderatingTopics: new Set(
          [...state.moderatingTopics].filter((topicId) => topicId !== id)
        ),
      }));
    }
  },

  lockTopic: async (id: string) => {
    set((state) => ({
      moderatingTopics: new Set([...state.moderatingTopics, id]),
      error: null,
    }));
    try {
      await forumApi.lockTopic(id);
      // Local state'i güncelle, yeni API çağrısı yapma
      set((state) => ({
        topics: state.topics.map((t) =>
          t.id.toString() === id ? { ...t, isLocked: !t.isLocked } : t
        ),
        moderatingTopics: new Set(
          [...state.moderatingTopics].filter((topicId) => topicId !== id)
        ),
      }));
    } catch (error) {
      set((state) => ({
        error: "Konu kilitleme hatası",
        moderatingTopics: new Set(
          [...state.moderatingTopics].filter((topicId) => topicId !== id)
        ),
      }));
    }
  },

  stickyTopic: async (id: string) => {
    set((state) => ({
      moderatingTopics: new Set([...state.moderatingTopics, id]),
      error: null,
    }));
    try {
      await forumApi.stickyTopic(id);
      // Local state'i güncelle, yeni API çağrısı yapma
      set((state) => ({
        topics: state.topics.map((t) =>
          t.id.toString() === id ? { ...t, isSticky: !t.isSticky } : t
        ),
        moderatingTopics: new Set(
          [...state.moderatingTopics].filter((topicId) => topicId !== id)
        ),
      }));
    } catch (error) {
      set((state) => ({
        error: "Konu yapışkan yapma hatası",
        moderatingTopics: new Set(
          [...state.moderatingTopics].filter((topicId) => topicId !== id)
        ),
      }));
    }
  },

  // Admin içerik moderasyonu
  deletePost: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await forumApi.deletePost(id);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Yanıt silinirken hata oluştu",
        loading: false,
      });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
