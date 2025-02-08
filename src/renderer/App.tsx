import { ReactNode, useState } from "react";
import { useFetchCoverLetterText } from "./api/useFetchCoverLetterText";
import CoverLetterPage from "./components/cover-letter-page";
import MainForm from "./components/main-form";
import SettingsForm from "./components/settings-form";
import {
  AppDataContext,
  defaultValues,
  useAppDataContext,
} from "./contexts/app-data-context";
import "./index.css";
import { type FormValues } from "./lib/schemas/form-schema";
import { sleep } from "./lib/utils";
import { ChatResponse } from "./types/chat";

function AppContent() {
  const [page, setPage] = useState<"main" | "settings" | "cover-letter">(
    "main",
  );
  const [slide, setSlide] = useState<"left" | "right">("left");
  const { isLoading, error, fetchCoverLetterText } = useFetchCoverLetterText();

  const [usageData, setUsageData] = useState({
    total: 0,
    prompt: 0,
    completion: 0,
  });

  const { coverLetterText, setCoverLetterText } = useAppDataContext();

  async function handleSubmit(data: FormValues) {
    console.log("Request data :", data);

    const completion = await fetchCoverLetterText(data);

    if (completion) {
      handleResponse(completion);
    }
  }

  function handleResponse(completion: ChatResponse) {
    setCoverLetterText(completion?.choices[0].message.content as string);

    const {
      usage: { total_tokens, prompt_tokens, completion_tokens },
    } = completion as ChatResponse;

    setUsageData({
      total: total_tokens,
      prompt: prompt_tokens,
      completion: completion_tokens,
    });

    setCoverLetterText(
      (completion?.choices[0].message.content as string) ?? "",
    );

    navigateTo("cover-letter");
  }

  async function navigateTo(to: "main" | "settings" | "cover-letter") {
    switch (to) {
      case "main":
        setSlide("left");
        await sleep(550);
        setPage("main");
        break;

      case "settings":
        setSlide("right");
        setPage("settings");
        break;

      case "cover-letter":
        setSlide("right");
        setPage("cover-letter");
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
          {/* Page One */}
          <MainForm
            onNavigate={navigateTo}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Page Two */}
          {page === "cover-letter" ? (
            <CoverLetterPage
              text={coverLetterText as string}
              onNavigate={() => navigateTo("main")}
              usageData={usageData}
            />
          ) : (
            <SettingsForm onNavigate={() => navigateTo("main")} />
          )}
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
