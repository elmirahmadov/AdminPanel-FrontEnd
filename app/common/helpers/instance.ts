// helpers/instance.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";

import { useAuthStore } from "../store/auth/auth.store";
import { LoggerKeys } from "../types/dev.types";
import { DEV_LOGGER } from "../utils/dev";

const maxRetries = 3;
let retryCount = 0;

const getHeaders = (): RawAxiosRequestHeaders => {
  const language = localStorage.getItem("lang") || "az";
  const token =
    localStorage.getItem("access_token") || localStorage.getItem("token");

  return {
    "Accept-Language": language,
    Authorization: token ? `Bearer ${token}` : "",
    // 'Content-Type': 'application/json',
    // 'Access-Control-Allow-Headers': 'Content-Type',
  };
};

const fetcher: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_FETCH || "http://localhost:5000",
  headers: getHeaders(),
  withCredentials: true,
  timeout: 10000,
});

const updateHeaders = (
  config: AxiosRequestConfig,
  headers: { [key in string]: string | number } = {}
): void => {
  const newHeaders = { ...getHeaders(), ...headers };
  Object.entries(newHeaders).forEach(([key, value]) => {
    config.headers = config.headers || {};
    config.headers[key] = value as string;
  });
};

const handleResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const handleError = async (error: AxiosError): Promise<AxiosResponse> => {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };
  if (!originalRequest) return Promise.reject(error);

  if (originalRequest.url?.includes("/auth/admin/login"))
    return Promise.reject(error);

  if (
    error.response?.status === HttpStatusCode.Unauthorized &&
    !originalRequest._retry &&
    retryCount < maxRetries
  ) {
    retryCount++;
    originalRequest._retry = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("Refresh token bulunamadı");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL_FETCH}/api/auth/refresh`,
        { refresh_token: refreshToken }
      );

      if (response.data && response.data.data && response.data.data.tokens) {
        const tokens = response.data.data.tokens;
        const accessToken = tokens.access_token;
        const newRefreshToken = tokens.refresh_token;

        if (!accessToken || !newRefreshToken) {
          throw new Error("Token bilgileri eksik");
        }

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);

        DEV_LOGGER(LoggerKeys.token, "Token yenilendi");

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } else {
        throw new Error("Token yenileme yanıtı geçersiz");
      }
    } catch (refreshError) {
      DEV_LOGGER(LoggerKeys.error, "Token yenileme hatası:", refreshError);
      clearSession();
      return Promise.reject(refreshError);
    }
  } else if (retryCount >= maxRetries) {
    clearSession();
    return Promise.reject(new Error("Max retry limit reached"));
  }

  return Promise.reject(error);
};

const clearSession = (): void => {
  DEV_LOGGER(LoggerKeys.token, "Session cleared");
  useAuthStore.getState().actions.reset();
};

const clearLogout = (): void => {
  clearSession();
};

const bootstrapToken =
  localStorage.getItem("access_token") || localStorage.getItem("token");
if (bootstrapToken) {
  fetcher.defaults.headers.common.Authorization = `Bearer ${bootstrapToken}`;
}

fetcher.interceptors.request.use((config) => {
  updateHeaders(config);
  return config;
}, handleError);
fetcher.interceptors.response.use(handleResponse, handleError);

export { updateHeaders, clearLogout as logout };

export default fetcher;
