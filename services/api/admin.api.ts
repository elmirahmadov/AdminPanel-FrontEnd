import { API } from "../apiResources";

import fetcher from "@/common/helpers/instance";

export const adminLogin = (data: { email: string; password: string }) =>
  fetcher.post(API.admin.login, data);

export const getAdminStats = () => fetcher.get(API.admin.stats);
