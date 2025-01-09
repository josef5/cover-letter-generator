import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
