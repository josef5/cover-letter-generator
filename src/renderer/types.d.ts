import { get } from "http";
import { set } from "react-hook-form";
import { ChatResponse } from "./types/chat";

export {};

declare global {
  interface Window {
    api: {
      fetchCompletion: (data) => Promise<ChatResponse>;
      getStoreValue: (key: string) => Promise<string>;
      setStoreValue: (key: string, value: string) => Promise<void>;
      setStoreValues: (values: any) => Promise<void>;
      getStoreValues: () => Promise<any>;
    };
  }
}
