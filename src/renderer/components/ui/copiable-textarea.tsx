import { CheckCircle, Copy, Save } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";

function CopiableTextarea({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<number>(0);

  async function handleSave() {
    try {
      await window.api.saveCoverLetter(value);

      setSaved(true);
    } catch (error) {
      console.error("Failed to save document:", error);

      setSaved(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Reset copied state after 2 seconds
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);

      setCopied(false);
    }
  }

  return (
    <div
      className={`relative flex-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Textarea
        style={{ whiteSpace: "pre-line" }}
        value={value}
        onChange={onChange}
        className={`box-border h-full border-collapse bg-white px-8 py-12 text-neutral-800 ${className}`}
      ></Textarea>
      {isHovered && value && (
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            className="rounded-md p-2 transition-colors hover:bg-gray-300 hover:text-gray-800"
            onClick={handleSave}
          >
            {saved ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Save className="h-5 w-5" />
            )}
          </Button>
          <Button
            className="rounded-md p-2 transition-colors hover:bg-gray-300 hover:text-gray-800"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default CopiableTextarea;
