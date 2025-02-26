import Store, { Schema } from "electron-store";
import {
  MainFormValues,
  SettingsValues,
} from "@/renderer/lib/schemas/form-schema";

type MainFormSettingsValues = Pick<
  MainFormValues,
  "model" | "temperature" | "wordLimit"
>;

type MainFormSettingsSchema = Schema<MainFormSettingsValues>;
type SettingsSchema = Schema<SettingsValues>;

const mainFormSettingsSchema: MainFormSettingsSchema = {
  model: { type: "string" },
  temperature: { type: "number" },
  wordLimit: { type: "number" },
};

const settingsSchema: SettingsSchema = {
  apiKey: { type: "string" },
  name: { type: "string" },
  workExperience: { type: "string" },
  portfolioSite: { type: "string" },
  skillSet: { type: "string" },
  additionalSettings: { type: "string" },
};

// TODO: Investigate if the same store can be used for both settings
const mainFormSettingStore = new Store({
  name: "main-form-settings-store",
  schema: mainFormSettingsSchema,
});

const settingsStore = new Store({
  name: "settings-store",
  schema: settingsSchema,
});

export function getMainFormSettingsStore(): MainFormSettingsValues {
  return mainFormSettingStore.store;
}

export function setMainFormSettingsStore(data: MainFormSettingsValues) {
  mainFormSettingStore.set(data);
}

export function getSettingsStore(): SettingsValues {
  return settingsStore.store;
}

export function setSettingsStore(data: SettingsValues) {
  settingsStore.set(data);
}
