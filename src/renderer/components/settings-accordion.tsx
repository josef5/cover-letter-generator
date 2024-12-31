import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/renderer/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/renderer/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import type { FormValues } from "@/renderer/lib/schemas/form-schema";
import { useFormContext } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

function SettingsAccordion({
  accordionValue,
  setAccordionValue,
}: {
  accordionValue: string;
  setAccordionValue: (value: string) => void;
}) {
  const { control } = useFormContext<FormValues>();

  function handleAccordionChange(value: string) {
    setAccordionValue(value);
  }

  return (
    <Accordion
      type="single"
      collapsible
      className=""
      value={accordionValue}
      onValueChange={handleAccordionChange}
    >
      <AccordionItem value="fields" className="">
        <AccordionTrigger className="rounded-lg border bg-neutral-800 px-4 text-sm">
          Settings
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <div className="mt-4 flex flex-col gap-4">
            <FormField
              control={control}
              name="settings.apiKey"
              render={({ field, formState: { errors } }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel className="flex text-xs">
                    OpenAI API Key
                    {errors?.settings?.apiKey?.message &&
                      `. ${errors?.settings?.apiKey?.message}`}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your API key"
                      {...field}
                      className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="row-of-inputs flex justify-between gap-4">
              <FormField
                control={control}
                name="settings.name"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Name
                      {errors?.settings?.name?.message &&
                        `. ${errors?.settings?.name?.message}`}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. John Smith"
                        {...field}
                        className="w-full autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--background))]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="settings.model"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Model
                      {errors?.settings?.model?.message &&
                        `. ${errors?.settings?.model?.message}`}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Model" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="gpt-3.5-turbo">
                            gpt-3.5-turbo
                          </SelectItem>
                          <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="settings.temperature"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="text-xs">
                      Temperature
                      {errors?.settings?.temperature?.message &&
                        `. ${errors?.settings?.temperature?.message}`}
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
                name="settings.wordLimit"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-1 flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Word Limit
                      {errors?.settings?.wordLimit?.message &&
                        `. ${errors?.settings?.wordLimit?.message}`}
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
            </div>
            <div className="flex flex-col gap-1">
              <FormField
                control={control}
                name="settings.workExperience"
                render={({ field, formState: { errors } }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel className="flex text-xs">
                      Work Experience
                      {errors?.settings?.workExperience?.message &&
                        `. ${errors?.settings?.workExperience?.message}`}
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/*  TODO: Add skillset? */}
            {/* TODO: Add additional settings - e.g. British English */}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default SettingsAccordion;
