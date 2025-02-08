import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { defaultValues, useAppDataContext } from "@/contexts/app-data-context";
import { type SettingsValues, settingsSchema } from "@/lib/schemas/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

function SettingsForm({ onNavigate }: { onNavigate: () => void }) {
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    mode: "onChange",
    defaultValues: defaultValues.settings,
    /* {
        apiKey: "abc123",
        name: "Jose Espejo",
        workExperience:
          "I am a frontend developer with 4 years of experience in React, Vue and TypeScript. In my last job I worked at a leading marketing agency; Tribal Worldwide, where our main client was Volkswagen and its subsidies Skoda and SEAT. I was a part of a team that developed and maintained a series of web apps in React and Typescript.
          
          My background in Design gives me an exceptional eye for detail and an affinity for high quality user experience, and I am adept at leveraging agile methodologies to deliver high-quality digital solutions.

          I possess comprehensive knowledge spanning the entire stack, both front-end and back-end development.",
          portfolioSite: "https://joseespejo.com",
          skillSet: "Professional experience: React, Vue, TypeScript, JavaScript, CSS, Redux, Styled Components, Storybook, Microservices, jQuery, Agile, Jira.
          Proficient: Next.js, Tailwind, Cypress, Figma, Vitest, React Native, Swift/UI, Express.js, MongoDB, Firebase.
          Familiar: Angular, Jest, Playwright, Nuxt, Pinia",
      }, */
  });

  const {
    control,
    formState: { isValid },
  } = form;

  const { appData, setAppData, setIsSettingsValid } = useAppDataContext();

  function handleSubmit(data: SettingsValues) {
    setAppData({ ...appData, settings: data });
    setIsSettingsValid(true);
    localStorage.setItem("settings", JSON.stringify(data));

    onNavigate();
  }

  // Watch for changes in isValid
  useEffect(() => {
    setIsSettingsValid(isValid);
  }, [isValid, setIsSettingsValid]);

  useEffect(() => {
    if (isValid) {
      setAppData({ ...appData, settings: form.getValues() });
    }
  }, [isValid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update form data on mount, with localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("settings");

    if (storedData) {
      const parsedData = JSON.parse(storedData);

      form.reset(parsedData);
      form.trigger();
    }
  }, [form]);

  return (
    <div className="relative flex h-full min-w-full flex-col bg-[hsl(var(--settings-background))] p-8 text-left">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={onNavigate}
        data-testid="settings-close-button"
      >
        <X />
      </Button>
      <h1 className="text-base font-bold">Settings</h1>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mt-4 flex flex-col gap-4">
              <FormField
                control={control}
                name="apiKey"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      OpenAI API Key{" "}
                      {errors?.apiKey?.message &&
                        `. ${errors?.apiKey?.message}`}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your API key"
                        {...field}
                        className="w-full bg-[hsl(var(--settings-background))] autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--settings-background))]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="row-of-inputs flex justify-between gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Name
                        {errors?.name?.message && `. ${errors?.name?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. John Smith"
                          {...field}
                          className="w-full bg-[hsl(var(--settings-background))] autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--settings-background))]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1">
                <FormField
                  control={control}
                  name="workExperience"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Work Experience
                        {errors?.workExperience?.message &&
                          `. ${errors?.workExperience?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={10}
                          className="bg-[hsl(var(--settings-background))]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name="portfolioSite"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Portfolio Site (Optional){" "}
                      {errors?.portfolioSite?.message &&
                        `. ${errors?.portfolioSite?.message}`}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a url"
                        {...field}
                        className="w-full bg-[hsl(var(--settings-background))] autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--settings-background))]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="skillSet"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Skill Set (Optional)
                      <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-[hsl(var(--settings-background))]"
                        rows={5}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="additionalSettings"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Additional Settings (Optional)
                      <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-[hsl(var(--settings-background))]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isValid}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}

export default SettingsForm;
