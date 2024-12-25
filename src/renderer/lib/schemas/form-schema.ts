import { z } from "zod";

export const formSchema = z.object({
  jobDescription: z.string().min(1, { message: "Required" }),
  salutation: z.string().min(1, { message: "Required" }),
  additionalNotes: z.string().optional(),
  settings: z.object({
    apiKey: z.string().min(1, { message: "Required" }),
    name: z.string().min(1, { message: "Required" }),
    model: z.enum(["gpt-3.5-turbo", "gpt-4o"]),
    temperature: z
      .number({ required_error: "Required" })
      .min(0, { message: "Enter a value between 0 and 2.0" })
      .max(2, { message: "Enter a value between 0 and 2.0" }),
    wordLimit: z
      .number({ required_error: "Required" })
      .min(100, { message: "Enter a value of 100 or more" }),
    workExperience: z.string().min(1, { message: "Required" }),
  }),
});

export type FormValues = z.infer<typeof formSchema>;
