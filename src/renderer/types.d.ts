import { ChatResponse } from "./types/chat";

export {};

declare global {
  interface Window {
    api: {
      fetchCompletion: (data) => Promise<ChatResponse>;
    };
  }
}
