import { is } from "@electron-toolkit/utils";
import { OpenAI } from "openai";
import type { FormValues } from "@/renderer/lib/schemas/form-schema";
import type { ChatResponse } from "@/types/chat";

export async function handleFetchCompletion(
  _: Electron.IpcMainInvokeEvent,
  formValues: FormValues,
) {
  const DEV_TEST = false;

  if (is.dev && DEV_TEST) {
    const data = await import("../../tests/mock-response.json");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return data as ChatResponse;
  }

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
  } = formValues;

  const prompt = `Here is a job description, write a cover letter for this job on behalf of the user: ${jobDescription}.`;

  try {
    const openai = new OpenAI({ apiKey });

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

    return chatCompletion as ChatResponse;
  } catch (error) {
    console.error(error);

    throw error;
  }
}
