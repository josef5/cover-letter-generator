import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CopiableTextarea from "./components/copiable-textarea";
import SettingsAccordion from "./components/settings-accordion";
import { Button } from "./components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Input } from "./components/ui/input";
import Spinner from "./components/ui/spinner";
import { Textarea } from "./components/ui/textarea";
import "./index.css";
import { formSchema, type FormValues } from "./lib/schemas/form-schema";
import type { UserData } from "./types/data";

function App() {
  const [coverLetterText, setCoverLetterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState("default"); // State for accordion

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      salutation: "Dear Hiring Manager,",
      jobDescription: "",
      // jobDescription: "We are Awesome Co. and we are looking for a Software Engineer to join our team. You will be working on our core product, which is a platform that helps people write better cover letters. You will be responsible for building new features, fixing bugs, and improving the performance of our platform. The ideal candidate is passionate about writing clean code, has experience with React and Node.js, and is a great team player. If you are interested in this position, please send us your resume and a cover letter explaining why you are a good fit for this role.",
      additionalNotes: "",
      settings: {
        apiKey: "",
        name: "",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        wordLimit: 300,
        workExperience: "",
      },
      /* settings: {
        apiKey: "abc123",
        name: "Jose Espejo",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        wordLimit: 300,
        workExperience:
          "I am a frontend developer with 4 years of experience in React, Vue and TypeScript. In my last job I worked at a leading marketing agency; Tribal Worldwide, where our main client was Volkswagen and its subsidies Skoda and SEAT. I was a part of a team that developed and maintained a series of web apps in React and Typescript. A selection of my work can be viewed at https://joseespejo.info",
      }, */
    },
  });

  const {
    handleSubmit,
    formState: { isValid, errors },
  } = form;

  function onSubmit(data: FormValues) {
    setAccordionValue("close");

    window.api?.setStoreValues(data.settings);

    fetchCoverLetterText(data);
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function fetchCoverLetterText(userData: UserData) {
    setCoverLetterText("");
    setError(null);
    setIsLoading(true);

    try {
      if (!window.api?.fetchCompletion) {
        throw new Error("API not available");
      }

      const data = await window.api.fetchCompletion(userData);

      if (!data) {
        throw new Error("API response is empty");
      }

      setCoverLetterText(data.chatCompletion.choices[0].message.content);
    } catch (error) {
      console.error(error);

      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function getStoredSettings() {
      const settings = await window.api?.getStoreValues();
      console.log("stored settings:", settings);

      if (Object.keys(settings).length > 0) {
        form.setValue("settings", settings, { shouldValidate: true });
      }
    }

    getStoredSettings();
  }, []);

  return (
    <div className="App mx-auto max-w-5xl">
      <div className="flex h-screen flex-col gap-4 pb-4 pt-8">
        <h1 className="text-base font-bold">Generate cover letter</h1>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="salutation"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Salutation
                        <FormMessage className="text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Dear Hiring Manager," {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Job Description
                        <FormMessage className="text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Paste job description here"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Additional Notes (Optional)
                        <FormMessage className="text-xs" />
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <SettingsAccordion
                  accordionValue={accordionValue}
                  setAccordionValue={setAccordionValue}
                  hasErrors={!!errors.settings}
                />
                <Button type="submit" disabled={!isValid}>
                  Generate
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
        {error && <div className="text-red-500">{error}</div>}
        {isLoading ? (
          <div className="mt-4 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          coverLetterText && (
            <CopiableTextarea
              value={coverLetterText}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                setCoverLetterText(event.target?.value)
              }
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;
