import { CoverLetterData } from "@/types";
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
      openCoverLetterWindow: (data: CoverLetterData) => void;
      handleCoverLetterData: (
        listener: (event: IpcRendererEvent, data: CoverLetterData) => void,
      ) => IpcRenderer;
      saveCoverLetter: (text: string) => Promise<void>;
    };
  }
}
