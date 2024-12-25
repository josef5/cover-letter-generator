export {};

declare global {
  interface Window {
    api: {
      sayHello: () => Promise<{ message: string }>;
      fetchThirdPartyData: () => Promise<{ message: string }>;
    };
  }
}
