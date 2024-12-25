import express from "express";
import { Express } from "express";
import cors from "cors";

export function startServer() {
  const server = express();
  const port = 3000;

  server.use(
    cors({
      origin: "http://localhost:5000",
    }),
  );

  server.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express!" });
  });

  server.get("/api/third-party", async (req, res) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching third-party data:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
