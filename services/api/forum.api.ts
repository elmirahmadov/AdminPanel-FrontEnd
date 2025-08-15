import instance from "../../app/common/helpers/instance";

import type {
  IForum,
  IForumCreate,
  IForumUpdate,
} from "../../app/common/store/forum/forum.types";
import { API } from "../apiResources";

export const forumApi = {
  // Admin forum yönetimi
  getAll: async (): Promise<IForum[]> => {
    const response = await instance.get(API.forum.getAll);
    return response.data;
  },

  create: async (forum: IForumCreate): Promise<IForum> => {
    const response = await instance.post(API.forum.create, forum);
    return response.data;
  },

  update: async (id: string, forum: IForumUpdate): Promise<IForum> => {
    const response = await instance.put(API.forum.update(id), forum);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(API.forum.delete(id));
  },

  // Admin kategori yönetimi
  createCategory: async (category: {
    name: string;
    description?: string;
  }): Promise<{ id: string; name: string; description?: string }> => {
    const response = await instance.post(API.forum.createCategory, category);
    return response.data;
  },

  updateCategory: async (
    id: string,
    category: { name?: string; description?: string }
  ): Promise<{ id: string; name: string; description?: string }> => {
    const response = await instance.put(API.forum.updateCategory(id), category);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await instance.delete(API.forum.deleteCategory(id));
  },

  // Admin konu yönetimi
  getAllTopics: async (): Promise<{ topics: any[]; pagination: any }> => {
    const response = await instance.get(API.forum.getAllTopics);
    return response.data;
  },

  getTopicsByForum: async (
    forumId: string
  ): Promise<{ topics: any[]; pagination: any }> => {
    const response = await instance.get(API.forum.getTopicsByForum(forumId));
    return response.data;
  },

  createTopic: async (topic: {
    title: string;
    content: string;
    forumId?: string;
  }): Promise<any> => {
    const response = await instance.post(API.forum.createTopic, topic);
    return response.data;
  },

  getTopic: async (id: string): Promise<any> => {
    const response = await instance.get(API.forum.getTopic(id));
    return response.data;
  },

  updateTopic: async (id: string, topic: any): Promise<any> => {
    const response = await instance.put(API.forum.updateTopic(id), topic);
    return response.data;
  },

  deleteTopic: async (id: string): Promise<void> => {
    await instance.delete(API.forum.deleteTopic(id));
  },

  // Topic moderasyon işlemleri
  pinTopic: async (id: string): Promise<any> => {
    const response = await instance.patch(API.forum.pinTopic(id));
    return response.data;
  },

  lockTopic: async (id: string): Promise<any> => {
    const response = await instance.patch(API.forum.lockTopic(id));
    return response.data;
  },

  stickyTopic: async (id: string): Promise<any> => {
    const response = await instance.patch(API.forum.stickyTopic(id));
    return response.data;
  },

  // Admin içerik moderasyonu
  deletePost: async (id: string): Promise<void> => {
    await instance.delete(API.forum.deletePost(id));
  },
};
