import { contextBridge, ipcRenderer } from "electron";

// API exposed to renderer
contextBridge.exposeInMainWorld("api", {
  fetchCompletion: (data: any) => ipcRenderer.invoke("fetch-completion", data), // TODO: replace any with type
  getStoreValue: (key: string) => ipcRenderer.invoke("getStoreValue", key),
  setStoreValue: (key: string, value: string) =>
    ipcRenderer.invoke("setStoreValue", key, value),
  setStoreValues: (values: any) => ipcRenderer.invoke("setStoreValues", values),
  getStoreValues: () => ipcRenderer.invoke("getStoreValues"),
});
