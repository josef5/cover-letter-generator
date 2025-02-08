import { z } from "zod";

export const mainFormSchema = z.object({
  jobDescription: z.string().min(1, { message: "Required" }),
  salutation: z.string().min(1, { message: "Required" }),
  model: z.enum(["gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini"]),
  temperature: z
    .number({ required_error: "Required" })
    .min(0, { message: "Enter a value between 0 and 2.0" })
    .max(2, { message: "Enter a value between 0 and 2.0" }),
  wordLimit: z
    .number({ required_error: "Required" })
    .min(100, { message: "Enter a value of 100 or more" }),
  additionalNotes: z.string().optional(),
});

export type MainFormValues = z.infer<typeof mainFormSchema>;

export const settingsSchema = z.object({
  apiKey: z.string().min(1, { message: "Required" }),
  name: z.string().min(1, { message: "Required" }),
  workExperience: z.string().min(1, { message: "Required" }),
  portfolioSite: z.union([z.string().url(), z.literal("")]).optional(),
  skillSet: z.string().optional(),
  additionalSettings: z.string().optional(),
});

export type SettingsValues = z.infer<typeof settingsSchema>;

export const formSchema = z.object({
  ...mainFormSchema.shape,
  settings: settingsSchema,
});

export type FormValues = z.infer<typeof formSchema>;
