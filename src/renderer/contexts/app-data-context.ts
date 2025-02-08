import { FormValues } from "@/lib/schemas/form-schema";
import { createContext, useContext } from "react";

export type AppDataContextValue = {
  appData: FormValues;
  setAppData: (data: FormValues) => void;
  isSettingsValid: boolean;
  setIsSettingsValid: (value: boolean) => void;
  coverLetterText?: string;
  setCoverLetterText: (text: string) => void;
};

export const AppDataContext = createContext<AppDataContextValue>(
  {} as AppDataContextValue,
);

export const defaultValues: FormValues = {
  salutation: "Dear Hiring Manager,",
  jobDescription: "",
  // jobDescription:
  //   "We are Awesome Co. and we are looking for a Software Engineer to join our team. You will be working on our core product, which is a platform that helps people write better cover letters. You will be responsible for building new features, fixing bugs, and improving the performance of our platform. The ideal candidate is passionate about writing clean code, has experience with React and Node.js, and is a great team player. If you are interested in this position, please send us your resume and a cover letter explaining why you are a good fit for this role.",
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  wordLimit: 300,
  additionalNotes: "",
  settings: {
    apiKey: "",
    name: "",
    workExperience: "",
    portfolioSite: "",
    skillSet: "",
    additionalSettings: "",
  },
} as const;

export function useAppDataContext() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error("useAppDataContext must be used within a AppDataProvider");
  }
  return context;
}
