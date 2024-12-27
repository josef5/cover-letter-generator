export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  chatCompletion: {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  };
}
