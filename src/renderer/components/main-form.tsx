import {
  defaultValues,
  useAppDataContext,
} from "@/renderer/contexts/app-data-context";
import "@/renderer/index.css";
import {
  type FormValues,
  type MainFormValues,
  mainFormSchema,
} from "@/renderer/lib/schemas/form-schema";
import { getEstimatedTokens, isObjectEmpty } from "@/renderer/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CornerUpRight, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Spinner from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import TokenCount from "./ui/token-count";

function MainForm({
  onNavigate,
  onSubmit,
  isLoading,
  error,
}: {
  onNavigate: (to: "settings" | "cover-letter") => void;
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
  error?: string | null;
}) {
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  const [isMainSettingsSaved, setIsMainSettingsSaved] = useState(true);
  const { appData, isSettingsValid, coverLetterText } = useAppDataContext();
  const models = mainFormSchema.shape.model._def.values;

  const form = useForm<MainFormValues>({
    resolver: zodResolver(mainFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const {
    control,
    formState: { isValid },
    watch,
  } = form;

  const mainFormSettings = form.getValues([
    "model",
    "temperature",
    "wordLimit",
  ]);

  function handleSubmit(data: MainFormValues) {
    const compositeData = { ...data, settings: appData.settings };
    onSubmit(compositeData);
  }

  async function handleSaveValues(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const { model, temperature, wordLimit } = form.getValues();

    await window.api.setMainFormSettingsStore({
      model,
      temperature,
      wordLimit,
    });

    // Update the form state so the button is disabled
    form.trigger();
  }

  // Calculate estimated tokens on main form change
  useEffect(() => {
    // Use watch() to react to real-time changes in the form
    // i.e. before state is updated
    const subscription = watch((formValues) => {
      const consolidatedValues = {
        ...formValues,
        settings: appData.settings,
      } as FormValues;

      const tokens = getEstimatedTokens(consolidatedValues);

      setEstimatedTokens(tokens);
    });

    return () => subscription.unsubscribe();
  }, [watch, appData.settings]);

  // Calculate estimated tokens on prompt data change (settings)
  useEffect(() => {
    const consolidatedValues = {
      ...form.getValues(),
      settings: appData.settings,
    } as FormValues;

    const tokens = getEstimatedTokens(consolidatedValues);

    setEstimatedTokens(tokens);
  }, [appData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update main form settings from localStorage, on mount
  useEffect(() => {
    async function initializeFormSettings() {
      const storedData = await window.api.getMainFormSettingsStore();

      if (!isObjectEmpty(storedData)) {
        form.reset({ ...form.getValues(), ...storedData });
      } else {
        // If no settings saved save default values to localStorage
        const [model, temperature, wordLimit] = mainFormSettings;

        await window.api.setMainFormSettingsStore({
          model,
          temperature,
          wordLimit,
        });
      }
    }

    initializeFormSettings();
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update isMainSettingsSaved on main form settings change
  useEffect(() => {
    async function checkIfMainSettingsSaved() {
      const storedData = await window.api.getMainFormSettingsStore();
      const [model, temperature, wordLimit] = mainFormSettings;

      setIsMainSettingsSaved(
        JSON.stringify({ model, temperature, wordLimit }) ===
          JSON.stringify(storedData),
      );
    }

    checkIfMainSettingsSaved();
  }, [form, mainFormSettings]);

  return (
    <div className="relative flex h-full min-w-full flex-col p-8 text-left">
      <Button
        variant="ghost"
        size="icon"
        className={`absolute right-4 top-4 ${!isSettingsValid ? "text-red-500" : ""}`}
        onClick={() => onNavigate("settings")}
        data-testid="settings-button"
      >
        <Settings />
      </Button>
      <h1 className="text-base font-bold">Generate Cover Letter</h1>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mt-4 flex flex-col gap-4">
              <FormField
                control={control}
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
                control={control}
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
                        rows={10}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="row-of-inputs flex justify-between gap-4">
                <FormField
                  control={control}
                  name="model"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Model
                        {errors?.model?.message &&
                          `. ${errors?.model?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                        >
                          <SelectTrigger
                            className="w-full"
                            data-testid="settings-model-select-trigger"
                          >
                            <SelectValue placeholder="Model" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            {models.map((model) => (
                              <SelectItem key={model} value={model}>
                                {model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="temperature"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="text-xs">
                        Temperature
                        {errors?.temperature?.message &&
                          `. ${errors?.temperature?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={0.1}
                          placeholder="0.7"
                          min={0.0}
                          max={2.0}
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="wordLimit"
                  render={({ field, formState: { errors } }) => (
                    <FormItem className="flex flex-1 flex-col gap-1">
                      <FormLabel className="flex text-xs">
                        Word Limit
                        {errors?.wordLimit?.message &&
                          `. ${errors?.wordLimit?.message}`}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="200"
                          step="100"
                          {...field}
                          onChange={(event) =>
                            field.onChange(Number(event.target.value))
                          }
                          className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="self-end"
                  disabled={isMainSettingsSaved}
                  onClick={handleSaveValues}
                  data-testid="main-settings-save-button"
                >
                  <Save />
                </Button>
              </div>
              <FormField
                control={control}
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
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!isValid || !isSettingsValid}
                  className="flex-1"
                >
                  Generate
                </Button>
                {coverLetterText && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="self-end"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      event.preventDefault();
                      onNavigate("cover-letter");
                    }}
                  >
                    <CornerUpRight />
                  </Button>
                )}
              </div>
              <TokenCount>
                Estimated token count in prompt: {estimatedTokens}
              </TokenCount>
            </div>
          </form>
        </Form>
      </FormProvider>
      {error && <div className="text-red-500">{error}</div>}
      {isLoading && (
        <div className="mt-4 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default MainForm;
