import dotenv from "dotenv";
import { app, BrowserWindow, ipcMain } from "electron";
import Store, { Schema } from "electron-store";
import * as path from "path";
import { Settings } from "./../renderer/types/data";
import { startServer } from "./server";

// In production load .env from resources
dotenv.config({
  path: app.isPackaged
    ? path.join(process.resourcesPath, ".env")
    : path.resolve(process.cwd(), ".env"),
});

const port = process.env.PORT ?? 51515;

type SettingsSchema = Schema<Settings>;

const schema: SettingsSchema = {
  apiKey: { type: "string" },
  name: { type: "string" },
  model: { type: "string" },
  temperature: { type: "number" },
  wordLimit: { type: "number" },
  workExperience: { type: "string" },
};

const store = new Store<SettingsSchema>({ schema });

// Disable Node.js integration in renderer
app.enableSandbox();

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  const isDev = (await import("electron-is-dev")).default;

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "..", "preload", "preload.js"),
      sandbox: true, // Enable sandbox mode
      webSecurity: true, // Enable web security
    },
  });

  if (isDev) {
    await mainWindow.loadURL("http://localhost:5000");
    mainWindow.webContents.openDevTools();
  } else {
    await mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  console.log("Store at: ", app.getPath("userData"));
}

app.whenReady().then(() => {
  startServer();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("fetch-completion", async (event, data) => {
  try {
    const response = await fetch(`http://localhost:${port}/api/completion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

ipcMain.handle("getStoreValue", (event, key: string) => {
  return store.get(key);
});

ipcMain.handle("setStoreValue", (event, key: string, value: string) => {
  store.set(key, value);
});

ipcMain.handle("setStoreValues", (event, values: Schema<Settings>) => {
  store.store = values;
});

ipcMain.handle("getStoreValues", (event) => {
  return store.store;
});
