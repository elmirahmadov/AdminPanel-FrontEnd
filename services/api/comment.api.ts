// Comments API client
import { API } from "../apiResources";
import fetcher from "@/common/helpers/instance";

export const getComments = () => fetcher.get(API.comment.getAll);
export const getCommentById = (id: string) => fetcher.get(API.comment.get(id));
export const createComment = (data: Record<string, unknown>) =>
  fetcher.post(API.comment.create, data);
export const updateComment = (id: string, data: Record<string, unknown>) =>
  fetcher.put(API.comment.update(id), data);
export const deleteComment = (id: string) =>
  fetcher.delete(API.comment.delete(id));
export const searchComments = (params: {
  content?: string;
  anime?: string;
  user?: string;
}) => fetcher.get(API.comment.search, { params });
export const approveComment = (id: string) =>
  fetcher.patch(API.comment.approve(id));
export const rejectComment = (id: string) =>
  fetcher.patch(API.comment.reject(id));
