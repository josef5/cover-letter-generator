import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getMainFormSettingsStore: () => Promise<MainFormSettingsValues>;
      setMainFormSettingsStore: (data: MainFormSettingsValues) => Promise<void>;
      getSettingsStore: () => Promise<SettingsValues>;
      setSettingsStore: (data: SettingsValues) => Promise<void>;
      fetchCompletion: (data: FormValues) => Promise<ChatResponse>;
      openCoverLetterWindow: (data: any) => void;
      handleCoverLetterData: (
        listener: (event: IpcRendererEvent, ...args: any[]) => void,
      ) => IpcRenderer;
    };
  }
}
