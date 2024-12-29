import cors from "cors";
import express from "express";
import { OpenAI } from "openai";

export async function startServer() {
  const server = express();
  const port = 3000;
  let openai: OpenAI;

  server.use(
    cors({
      origin: "http://localhost:5000",
    }),
  );

  server.use(express.json());

  server.post("/api/chat", async (req, res) => {
    const {
      jobDescription,
      salutation,
      additionalNotes,
      settings: { apiKey, name, model, temperature, wordLimit, workExperience },
    } = req.body;

    if (!jobDescription) {
      res.status(400).json({ error: "Job description required" });
      return;
    }

    if (!name) {
      res.status(400).json({ error: "Name required" });
      return;
    }

    const prompt = `Here is a job description, write a cover letter for this job on behalf of the user: ${jobDescription}. `;

    try {
      // openai = new OpenAI({ apiKey });
      openai = new OpenAI({ apiKey: process.env.OPENAI_KEY }); // TODO: revert to supplied API key

      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert in recruitment and job applications. Write a cover letter for this job.",
          },
          {
            role: "system",
            content: `Use the users work experience to explain why they are a good fit for the job: ${workExperience}`,
          },
          {
            role: "system",
            content:
              "Although we call it a letter it will be sent digitally, so we dont need subject line or an address or date.",
          },
          {
            role: "system",
            content: "Do not start with a subject line",
          },
          {
            role: "system",
            content: `Make sure to include the salutation ${salutation}`,
          },
          {
            role: "system",
            content: `Sign off with the users name ${name}`,
          },
          {
            role: "system",
            content: `The cover letter should be about ${wordLimit} words long and should explain why you are a good fit for the job.`,
          },
          { role: "system", content: additionalNotes ?? "" },
          { role: "user", content: prompt },
        ],
        temperature,
        model,
      });

      res.json({ chatCompletion });
    } catch (error) {
      res.status(500).json({
        error: `An error occurred while processing your request: ${error}`,
      });
    }
  });

  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
