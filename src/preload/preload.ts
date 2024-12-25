import { contextBridge, ipcRenderer } from "electron";

console.log("Preload script is running");

// API exposed to renderer
contextBridge.exposeInMainWorld("api", {
  sayHello: async () => {
    console.log("sayHello was called");
    try {
      const response = await fetch("http://localhost:3000/api/hello");
      console.log("response :", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },
  fetchThirdPartyData: () => ipcRenderer.invoke("fetch-third-party-data"),
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});

console.log("API should be exposed now");
