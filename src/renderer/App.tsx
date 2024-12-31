import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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

  // TODO: add persistence

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // TODO: remove placeholder values
      salutation: "Dear Hiring Manager,",
      jobDescription:
        "We are Awesome Co. and we are looking for a Software Engineer to join our team. You will be working on our core product, which is a platform that helps people write better cover letters. You will be responsible for building new features, fixing bugs, and improving the performance of our platform. The ideal candidate is passionate about writing clean code, has experience with React and Node.js, and is a great team player. If you are interested in this position, please send us your resume and a cover letter explaining why you are a good fit for this role.",
      additionalNotes: "",
      settings: {
        apiKey: "abc123",
        name: "Jose Espejo",
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        wordLimit: 300,
        workExperience:
          "I am a frontend developer with 4 years of experience in React, Vue and TypeScript. In my last job I worked at a leading marketing agency; Tribal Worldwide, where our main client was Volkswagen and its subsidies Skoda and SEAT. I was a part of a team that developed and maintained a series of web apps in React and Typescript. A selection of my work can be viewed at https://joseespejo.info",
      },
    },
  });

  function onSubmit(data: FormValues) {
    setAccordionValue("close");

    fetchCoverLetterText(data);
  }

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function fetchCoverLetterText(userData: UserData) {
    setCoverLetterText("");
    setError(null);
    setIsLoading(true);

    /*
    try {
      if (!window.api?.fetchCompletion) {
        throw new Error("API not available");
      }

      const data = await window.api.fetchCompletion(userData);

      console.log("response: ", data.chatCompletion.choices[0].message.content);
      setCoverLetterText(data.chatCompletion.choices[0].message.content);
    } catch (error) {
      if (error instanceof TypeError) {
        console.error("Network error fetching chat completion:", error);
        setError("Network error fetching chat completion");

        return;
      } else {
        console.error(error);
      }

      setError(`${(error as Error).name}. ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }

    /*/
    // TODO: revert to use of API
    setIsLoading(true);

    await sleep(3000);

    setCoverLetterText("");
    setIsLoading(false);
    setError(null);

    setCoverLetterText(
      `Lorem ipsum odor amet, consectetuer adipiscing elit. Inceptos pellentesque turpis; primis pellentesque luctus in. Viverra sagittis dictum amet maecenas finibus aenean viverra semper. Parturient blandit fermentum tristique amet posuere? Phasellus lacus conubia neque auctor nisi per lectus. Eu pharetra habitant et vehicula nascetur dolor ut. Odio curabitur tempor efficitur fusce potenti. Posuere a dui venenatis gravida velit posuere. Habitasse nascetur vivamus feugiat mauris orci.

      Amet platea ante fusce eu auctor ornare ante. Nam class blandit dui ad orci imperdiet convallis dis mi. Enim placerat mattis inceptos purus maecenas taciti phasellus ornare. Enim sagittis eros nulla non primis. Placerat praesent mus volutpat aptent ex pharetra nullam fringilla orci. Ligula nec iaculis iaculis interdum non a eleifend. Velit magna dictum; lorem dignissim per sem. Amet egestas per donec; semper molestie curabitur. Dui sapien platea at mauris luctus mattis donec.

      Netus eros velit placerat porta nullam. Habitant volutpat sed pellentesque ac rutrum metus massa. Faucibus eget nascetur elit; torquent luctus ex euismod. Senectus mus conubia tortor tempus imperdiet in donec cubilia netus. Magna arcu risus vel; aptent nec egestas? Eu suspendisse auctor quam posuere fermentum pharetra convallis. Consectetur commodo elit mi taciti tortor torquent. Erat viverra orci nisi non porttitor vivamus efficitur porttitor.
      
      Lorem ipsum odor amet, consectetuer adipiscing elit. Inceptos pellentesque turpis; primis pellentesque luctus in. Viverra sagittis dictum amet maecenas finibus aenean viverra semper. Parturient blandit fermentum tristique amet posuere? Phasellus lacus conubia neque auctor nisi per lectus. Eu pharetra habitant et vehicula nascetur dolor ut. Odio curabitur tempor efficitur fusce potenti. Posuere a dui venenatis gravida velit posuere. Habitasse nascetur vivamus feugiat mauris orci.

      Amet platea ante fusce eu auctor ornare ante. Nam class blandit dui ad orci imperdiet convallis dis mi. Enim placerat mattis inceptos purus maecenas taciti phasellus ornare. Enim sagittis eros nulla non primis. Placerat praesent mus volutpat aptent ex pharetra nullam fringilla orci. Ligula nec iaculis iaculis interdum non a eleifend. Velit magna dictum; lorem dignissim per sem. Amet egestas per donec; semper molestie curabitur. Dui sapien platea at mauris luctus mattis donec.

      Netus eros velit placerat porta nullam. Habitant volutpat sed pellentesque ac rutrum metus massa. Faucibus eget nascetur elit; torquent luctus ex euismod. Senectus mus conubia tortor tempus imperdiet in donec cubilia netus. Magna arcu risus vel; aptent nec egestas? Eu suspendisse auctor quam posuere fermentum pharetra convallis. Consectetur commodo elit mi taciti tortor torquent. Erat viverra orci nisi non porttitor vivamus efficitur porttitor.`,
    ); //*/
  }

  return (
    <div className="App mx-auto max-w-5xl">
      <div className="flex h-screen flex-col gap-4 py-4">
        <h1 className="text-base font-bold">Cover Letter Generator</h1>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Textarea {...field} />
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
                />
                <Button type="submit">Generate</Button>
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
            <Textarea
              // TODO: Add copy button
              style={{ whiteSpace: "pre-line" }}
              value={coverLetterText}
              onChange={(event) => setCoverLetterText(event.target.value)}
              className="flex-1 bg-white text-neutral-800"
            ></Textarea>
          )
        )}
      </div>
    </div>
  );
}

export default App;
