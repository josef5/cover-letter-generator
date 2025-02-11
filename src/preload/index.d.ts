import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: { fetchCompletion: (data: FormValues) => Promise<ChatResponse> };
  }
}
