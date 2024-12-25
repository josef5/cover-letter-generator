import React, { useState } from "react";
import "./index.css";
import { wrap } from "module";

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  /* const handleClick1 = async () => {
    setLoading(true);
    setError("");

    try {
      if (!window.api?.sayHello) {
        throw new Error("API not available");
      }
      const response = await window.api.sayHello();
      setMessage(response.message);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }; */

  const handleClick = async () => {
    setLoading(true);
    setError("");

    try {
      if (!window.api?.fetchThirdPartyData) {
        throw new Error("API not available");
      }

      const response = await window.api.fetchThirdPartyData();

      console.log("[App] response :", response);
      setMessage(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl text-red-500">Hello World!</h1>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "Get Greeting"}
      </button>
      {message && <pre>{message}</pre>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default App;
