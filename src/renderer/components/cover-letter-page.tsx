import { useState } from "react";
import { Button } from "./ui/button";
import CopiableTextarea from "./ui/copiable-textarea";
import TokenCount from "./ui/token-count";
import { Undo2 } from "lucide-react";

function CoverLetterPage({
  text,
  onNavigate,
  usageData,
}: {
  text: string;
  onNavigate: () => void;
  usageData: { total: number; prompt: number; completion: number };
}) {
  const [coverLetterText, setCoverLetterText] = useState(text);

  return (
    <div className="relative flex h-full min-w-full flex-col p-8 text-left">
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-4 top-4`}
        onClick={onNavigate}
      >
        <Undo2 />
      </Button>
      <h1 className="text-base font-bold">Cover Letter</h1>
      <div className="mt-4 flex h-full flex-col gap-4">
        <CopiableTextarea
          value={coverLetterText}
          className="mt-4 flex-1"
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCoverLetterText(event.target?.value)
          }
        />
        <TokenCount>
          Tokens Used: {usageData.total} (Prompt: {usageData.prompt}
          /Completion: {usageData.completion})
        </TokenCount>
      </div>
    </div>
  );
}

export default CoverLetterPage;
