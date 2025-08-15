import { LoggerKeys } from "@/common/types/dev.types";

export function DEV_LOGGER(key: LoggerKeys | string, ...args: any[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${key}]`, ...args);
  }
}
