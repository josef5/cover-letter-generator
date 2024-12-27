import { ChatResponse } from "./types/chat";

export {};

declare global {
  interface Window {
    api: {
      sayHello: () => Promise<{ message: string }>;
      fetchChatData: (data) => Promise<ChatResponse>;
      fetchThirdPartyData: () => Promise<{ message: string }>;
    };
  }
}
