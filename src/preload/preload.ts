import { contextBridge, ipcRenderer } from "electron";

console.log("Preload script is running");

// API exposed to renderer
contextBridge.exposeInMainWorld("api", {
  fetchChatData: (data: any) => ipcRenderer.invoke("fetch-chat-data", data),
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
