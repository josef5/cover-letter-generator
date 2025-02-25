import { ReactNode, useState } from "react";
import { useFetchCoverLetterText } from "./api/useFetchCoverLetterText";
import MainForm from "./components/main-form";
import SettingsForm from "./components/settings-form";
import { AppDataContext, defaultValues } from "./contexts/app-data-context";
import { type FormValues } from "./lib/schemas/form-schema";
import { ChatResponse } from "./types/chat";
import { CoverLetterData } from "@/types";

function AppContent() {
  const [slide, setSlide] = useState<"left" | "right">("left");
  const { isLoading, error, fetchCoverLetterText } = useFetchCoverLetterText();

  async function handleSubmit(data: FormValues) {
    console.log("Request data :", data);

    const completion = await fetchCoverLetterText(data);

    if (completion) {
      handleResponse(completion);
    }
  }

  function handleResponse(completion: ChatResponse) {
    const {
      choices: [
        {
          message: { content },
        },
      ],
      usage: { total_tokens, prompt_tokens, completion_tokens },
    } = completion as ChatResponse;

    const coverLetterData: CoverLetterData = {
      text: content,
      usage: {
        total: total_tokens,
        prompt: prompt_tokens,
        completion: completion_tokens,
      },
    };

    window.api.openCoverLetterWindow(coverLetterData);

    console.log("coverLetterText :", completion?.choices[0].message.content);
  }

  async function navigateTo(to: "main" | "settings") {
    switch (to) {
      case "main":
        setSlide("left");
        break;

      case "settings":
        setSlide("right");
        break;

      default:
    }
  }

  return (
    <>
      <div className="mx-auto flex min-h-screen w-screen max-w-5xl overflow-x-hidden">
        <div
          className={`flex flex-1 transition-transform duration-500 ease-in-out`}
          style={{
            transform: `translateX(${slide === "left" ? "0" : "-100%"})`,
          }}
        >
          {/* Main Page */}
          <MainForm
            onNavigate={() => navigateTo("settings")}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Settings Page */}
          <SettingsForm onNavigate={() => navigateTo("main")} />
        </div>
      </div>
    </>
  );
}

function AppDataProvider({ children }: { children: ReactNode }) {
  const [appData, setAppData] = useState<FormValues>(defaultValues);
  const [isSettingsValid, setIsSettingsValid] = useState<boolean>(false);
  const [coverLetterText, setCoverLetterText] = useState("");

  const value = {
    appData,
    setAppData,
    isSettingsValid,
    setIsSettingsValid,
    coverLetterText,
    setCoverLetterText,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}

export default App;
