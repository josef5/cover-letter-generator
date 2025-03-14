import React from "react";
import ReactDOM from "react-dom/client";
import CoverLetterWindow from "./cover-letter-window";
import "@/renderer/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CoverLetterWindow />
  </React.StrictMode>,
);
