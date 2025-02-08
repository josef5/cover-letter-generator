import { useState, useCallback } from "react";
import { type FormValues } from "@/lib/schemas/form-schema";
import { OpenAI } from "openai";
import { ChatResponse } from "@/types/chat";

export function useFetchCoverLetterText() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetterText = useCallback(async (fromValues: FormValues) => {
    setError(null);
    setIsLoading(true);

    let data: ChatResponse | null = null;

    try {
      /*
      data = await import("@/../tests/mock-response.json");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      /*/
      const {
        salutation,
        jobDescription,
        model,
        temperature,
        wordLimit,
        additionalNotes,
        settings: {
          apiKey,
          name,
          workExperience,
          portfolioSite,
          skillSet,
          additionalSettings,
        },
      } = fromValues;

      const prompt = `Here is a job description, write a cover letter for this job on behalf of the user: ${jobDescription}.`;

      try {
        const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are an expert in recruitment and job applications. Write a cover letter for this job no more than ${wordLimit} words long. Explain why the user is a good fit for the job.`,
            },
            {
              role: "system",
              content: "Do not start with a subject line",
            },
            {
              role: "system",
              content: `Only mention skills included in the users work experience. Do not improvise mention of other skills if the user has not specified them.`,
            },
            {
              role: "system",
              content: `Use the users work experience to explain why they are a good fit for the job: ${workExperience}`,
            },
            {
              role: "system",
              content: `Make sure to include the salutation ${salutation}`,
            },
            {
              role: "system",
              content: portfolioSite
                ? `Include a paragraph with one sentence like: A selection of my work can be viewed at ${portfolioSite}`
                : "",
            },
            {
              role: "system",
              content: skillSet
                ? `The user has the following skills: ${skillSet}`
                : "",
            },
            {
              role: "user",
              content: additionalSettings ?? "",
            },
            {
              role: "user",
              content: additionalNotes ?? "",
            },
            {
              role: "system",
              content: `Sign off with the users name ${name}`,
            },
            { role: "user", content: prompt },
          ],
          temperature,
          model,
        });

        data = chatCompletion as ChatResponse;
      } catch (error) {
        console.error(error);
        setError((error as Error).message);
      }
      //*/

      if (!data) {
        throw new Error("API response is empty");
      }

      console.log("Response data :", data);

      return data;
    } catch (error) {
      console.error(error);
      setError((error as Error).message);

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { fetchCoverLetterText, isLoading, error };
}
