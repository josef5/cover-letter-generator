import type {
  FormFieldContextValue,
  FormItemContextValue,
} from "@/components/ui/form";
import React from "react";

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);
