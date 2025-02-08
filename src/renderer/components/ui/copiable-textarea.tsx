import { CheckCircle, Copy } from "lucide-react";
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
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<number>(0);

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
    }
  }

  return (
    <div
      className={`relative flex-1 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Textarea
        style={{ whiteSpace: "pre-line" }}
        value={value}
        onChange={onChange}
        className="box-border h-full border-collapse bg-white px-8 py-12 text-neutral-800"
      ></Textarea>
      {isHovered && value && (
        <Button
          className="absolute right-2 top-2 rounded-md p-2 transition-colors hover:bg-gray-300 hover:text-gray-800"
          onClick={handleCopy}
        >
          {copied ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </Button>
      )}
    </div>
  );
}

export default CopiableTextarea;
