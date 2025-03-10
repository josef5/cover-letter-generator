import { type FormValues } from "@/renderer/lib/schemas/form-schema";

export interface CoverLetterData {
  text: string;
  usage: {
    total: number;
    prompt: number;
    completion: number;
  };
}

export type AppDataContextValue = {
  appData: FormValues;
  setAppData: (data: FormValues) => void;
  isSettingsValid: boolean;
  setIsSettingsValid: (value: boolean) => void;
  coverLetterText?: string;
  setCoverLetterText: (text: string) => void;
};
