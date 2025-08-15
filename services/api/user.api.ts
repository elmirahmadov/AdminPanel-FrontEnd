import { API } from "../apiResources";

import fetcher from "@/common/helpers/instance";

export const searchUsers = (query: string) =>
  fetcher.get(`${API.user.search}?q=${query}`);

export const getUser = (userId: string) => fetcher.get(API.user.get(userId));

export const updateUserRole = (userId: string, role: string) =>
  fetcher.put(API.user.updateRole(userId), { role });

export const deleteUser = (userId: string) =>
  fetcher.delete(API.user.delete(userId));

export const getNotifications = () => fetcher.get(API.user.notifications);

export const reportUser = (data: any) => fetcher.post(API.user.report, data);

export const getUsers = () => fetcher.get(API.user.all);
