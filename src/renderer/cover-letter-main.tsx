import React from "react";
import ReactDOM from "react-dom/client";
import CoverLetterWindow from "./components/cover-letter-window";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CoverLetterWindow
      text=""
      usageData={{ total: 0, prompt: 0, completion: 0 }}
    />
  </React.StrictMode>,
);
