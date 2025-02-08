import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormValues } from "@/lib/schemas/form-schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type JsonValue = string | number | boolean | null | JsonArray | JsonObject;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };

export function countChars(value: JsonValue): number {
  switch (true) {
    case typeof value === "string":
      return value.length;
    case typeof value === "number":
      return String(value).length;
    case Array.isArray(value):
      return value.join("").length;
    case typeof value === "object" && value !== null:
      return Object.values(value).reduce(
        (acc: number, val: JsonValue) => acc + countChars(val),
        0,
      );
    default:
      return 0;
  }
}

export function getEstimatedTokens(formValues: FormValues) {
  const systemPromptChars = 500; // approx

  // Extract values from settings that count towards the token limit
  const {
    settings: {
      name = "",
      workExperience = "",
      portfolioSite = "",
      skillSet = "",
      additionalSettings = "",
    },
  } = formValues;

  // Use only those specific settings values for the token count
  const countableFormValues = {
    ...formValues,
    settings: {
      name,
      workExperience,
      portfolioSite,
      skillSet,
      additionalSettings,
    },
  };

  const formCharacterCount = countChars(countableFormValues);
  const total = formCharacterCount + systemPromptChars;

  return Math.round(total / 4);
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
