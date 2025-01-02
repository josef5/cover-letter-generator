import { contextBridge, ipcRenderer } from "electron";
import { UserData } from "../renderer/types/data";

// API exposed to renderer
contextBridge.exposeInMainWorld("api", {
  fetchCompletion: (data: UserData) =>
    ipcRenderer.invoke("fetch-completion", data),
  getStoreValue: (key: string) => ipcRenderer.invoke("getStoreValue", key),
  setStoreValue: (key: string, value: string) =>
    ipcRenderer.invoke("setStoreValue", key, value),
  setStoreValues: (values: any) => ipcRenderer.invoke("setStoreValues", values),
  getStoreValues: () => ipcRenderer.invoke("getStoreValues"),
});
