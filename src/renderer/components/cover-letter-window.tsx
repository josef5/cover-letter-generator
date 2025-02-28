import { CoverLetterData } from "@/types";
import type { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";
import CopiableTextarea from "./ui/copiable-textarea";
import TokenCount from "./ui/token-count";

function CoverLetterWindow() {
  const [coverLetterText, setCoverLetterText] = useState("");
  const [usageData, setUsageData] = useState({
    total: 0,
    prompt: 0,
    completion: 0,
  });

  useEffect(() => {
    window.api.handleCoverLetterData(
      (_: IpcRendererEvent, data: CoverLetterData) => {
        setCoverLetterText(data.text);
        setUsageData(data.usage);
      },
    );
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <CopiableTextarea
        value={coverLetterText}
        className="border-none resize-none"
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          setCoverLetterText(event.target?.value)
        }
      />
      <TokenCount className="text-neutral-800">
        Tokens Used: {usageData.total} (Prompt: {usageData.prompt}
        /Completion: {usageData.completion})
      </TokenCount>
    </div>
  );
}

export default CoverLetterWindow;
