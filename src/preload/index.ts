import { CoverLetterData } from "@/types";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { FormValues } from "./../renderer/lib/schemas/form-schema";

// Custom APIs for renderer
const api = {
  getMainFormSettingsStore: () =>
    ipcRenderer.invoke("get-main-form-settings-store"),
  setMainFormSettingsStore: (data: FormValues) =>
    ipcRenderer.invoke("set-main-form-settings-store", data),
  getSettingsStore: () => ipcRenderer.invoke("get-settings-store"),
  setSettingsStore: (data: FormValues) =>
    ipcRenderer.invoke("set-settings-store", data),
  fetchCompletion: (data: FormValues) =>
    ipcRenderer.invoke("fetch-completion", data),
  openCoverLetterWindow: (data: CoverLetterData) =>
    ipcRenderer.send("open-cover-letter-window", data),
  handleCoverLetterData: (
    listener: (event: IpcRendererEvent, data: CoverLetterData) => void,
  ) => ipcRenderer.on("send-text-to-window", listener),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
