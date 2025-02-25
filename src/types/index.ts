export interface CoverLetterData {
  text: string;
  usage: {
    total: number;
    prompt: number;
    completion: number;
  };
}

// TODO: Consolidate all types into one file
