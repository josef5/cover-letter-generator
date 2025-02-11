import { useState, useCallback } from "react";
import { type FormValues } from "@/renderer/lib/schemas/form-schema";

export function useFetchCoverLetterText() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetterText = useCallback(async (formValues: FormValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const data = await window.api.fetchCompletion(formValues);

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

  return {
    fetchCoverLetterText,
    isLoading,
    error,
  };
}
