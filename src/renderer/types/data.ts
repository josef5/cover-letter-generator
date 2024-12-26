export interface Settings {
  apiKey: string;
  name: string;
  model: string;
  temperature: number;
  wordLimit: number;
  workExperience: string;
}

export interface UserData {
  salutation: string;
  jobDescription: string;
  settings: Settings;
}
