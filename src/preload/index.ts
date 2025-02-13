import { FormValues } from "./../renderer/lib/schemas/form-schema";
import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

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
