import { app, shell, BrowserWindow, ipcMain } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { handleFetchCompletion } from "./fetch-completion";
import {
  getMainFormSettingsStore,
  getSettingsStore,
  setMainFormSettingsStore,
  setSettingsStore,
} from "./store";

let mainWindow: BrowserWindow;
let coverLetterWindow: BrowserWindow;

function createMainWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 960,
    show: false,
    autoHideMenuBar: true,
    // ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  console.log(
    'process.env["ELECTRON_RENDERER_URL"] :',
    process.env["ELECTRON_RENDERER_URL"],
  );

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev) {
    if (process.env["ELECTRON_RENDERER_URL"]) {
      mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    }
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

async function createCoverLetterWindow() {
  coverLetterWindow = new BrowserWindow({
    width: 760,
    height: 900,
    parent: mainWindow,
    // modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  if (is.dev) {
    if (process.env["ELECTRON_RENDERER_URL"]) {
      await coverLetterWindow.loadURL(
        `${process.env["ELECTRON_RENDERER_URL"]}/cover-letter-window.html`,
      );
    }
    coverLetterWindow.webContents.openDevTools();
  } else {
    await coverLetterWindow.loadFile(
      join(__dirname, "../renderer/cover-letter-window.html"),
    );
  }

  coverLetterWindow.webContents.send(
    "send-text-to-window",
    "Hello from main process",
  );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));

  createMainWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });

  ipcMain.on("open-cover-letter-window", () => {
    createCoverLetterWindow();
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle("fetch-completion", handleFetchCompletion);

ipcMain.handle("get-main-form-settings-store", getMainFormSettingsStore);

ipcMain.handle("set-main-form-settings-store", (_, data) => {
  setMainFormSettingsStore(data);
});

ipcMain.handle("get-settings-store", getSettingsStore);

ipcMain.handle("set-settings-store", (_, data) => {
  setSettingsStore(data);
});
