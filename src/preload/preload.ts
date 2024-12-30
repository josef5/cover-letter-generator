import { contextBridge, ipcRenderer } from "electron";

console.log("Preload script is running");

// API exposed to renderer
contextBridge.exposeInMainWorld("api", {
  fetchCompletion: (data: any) => ipcRenderer.invoke("fetch-completion", data),
});
