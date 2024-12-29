import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { startServer } from "./server";
import dotenv from "dotenv";

// Disable Node.js integration in renderer
app.enableSandbox();

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
  const isDev = (await import("electron-is-dev")).default;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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

  dotenv.config({
    path: app.isPackaged
      ? path.join(process.resourcesPath, ".env")
      : path.resolve(process.cwd(), ".env"),
  });
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

ipcMain.handle("fetch-chat-data", async (event, data) => {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
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
