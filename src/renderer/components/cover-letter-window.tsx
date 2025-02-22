import { useEffect, useState } from "react";
import CopiableTextarea from "./ui/copiable-textarea";
import TokenCount from "./ui/token-count";
import type { IpcRendererEvent } from "electron";

function CoverLetterWindow({
  text,
  usageData,
}: {
  text: string;
  usageData: { total: number; prompt: number; completion: number };
}) {
  const [coverLetterText, setCoverLetterText] = useState(text);

  useEffect(() => {
    window.api.handleCoverLetterData((_: IpcRendererEvent, data: any) => {
      console.log("Received text from main", data);
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
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
