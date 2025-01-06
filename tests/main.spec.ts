import {
  _electron as electron,
  expect,
  test,
  type ElectronApplication,
  type ElementHandle,
  type Page,
} from "@playwright/test";
import { describe } from "node:test";

let electronApp: ElectronApplication;
let window: Page;
let submitButton: ElementHandle<SVGElement | HTMLElement> | null;

const inputFields = [
  {
    element: "input",
    name: "salutation",
    value: "Dear Hiring Manager,",
    required: true,
  },
  {
    element: "textarea",
    name: "jobDescription",
    value: "We are looking for a Software Engineer to join our team.",
    required: true,
  },
  {
    element: "textarea",
    name: "additionalNotes",
    value: "I am excited about this opportunity.",
    required: false,
  },
  {
    element: "input",
    name: "settings.apiKey",
    value: "abc123",
    required: true,
  },
  {
    element: "input",
    name: "settings.name",
    value: "John Doe",
    required: true,
  },
  {
    element: "input",
    name: "settings.temperature",
    value: "0.7",
    required: true,
    hasDefaultValue: true,
  },
  {
    element: "input",
    name: "settings.wordLimit",
    value: "300",
    required: true,
  },
  {
    element: "textarea",
    name: "settings.workExperience",
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: true,
  },
];

// Filter out the required input fields that have a default value and are not emptyable
const requiredInputFields = inputFields.filter(
  ({ required, hasDefaultValue }) => required && !hasDefaultValue,
);

describe("Main", () => {
  test.beforeAll(async () => {
    electronApp = await electron.launch({
      // TODO: Figure out how to test the development build instead of the release build
      executablePath:
        "./release/mac-arm64/Cover Letter Generator.app/Contents/MacOS/Cover Letter Generator",
      args: ["main.js"],
    });

    window = await electronApp.firstWindow();
    submitButton = await window.$('button[type="submit"]');
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test("launch app", async () => {
    await expect(window).toHaveTitle(/Cover Letter Generator/);
  });

  test("should not be submittable by default", async () => {
    const isDisabled = await submitButton?.isDisabled();

    expect(isDisabled).toBe(true);
  });

  async function openAccordion() {
    // Open the settings accordion
    const accordionTrigger = await window.$(
      '[data-testid="settings-accordion-trigger"]',
    );

    // Read data-state attribute
    const dataState = await accordionTrigger?.getAttribute("data-state");

    // If the accordion is closed, open it
    if (dataState === "closed") {
      await window.click('[data-testid="settings-accordion-trigger"]');

      // Set a delay to wait for the accordion to open
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async function fillOutForm(
    values: { element: string; name: string; value: string }[],
  ) {
    await openAccordion();

    // Set value for the model select
    await window.selectOption(
      "[data-testid='settings-model-select-trigger'] + select",
      "gpt-3.5-turbo",
    );

    // Set values for the input fields and textareas
    for (const { element, name, value } of values) {
      await window.fill(`${element}[name='${name}']`, value);
    }
  }

  test("should be submittable when required fields are filled", async () => {
    await fillOutForm(inputFields);

    const isDisabled = await submitButton?.isDisabled();

    expect(isDisabled).toBe(false);
  });

  test("should not be submittable when required fields are empty", async () => {
    await openAccordion();

    // Iterate over the required input fields
    for (const { element, name, value } of requiredInputFields) {
      const selector = `${element}[name='${name}']`;

      // Clear the input field
      await window.fill(selector, "");

      // Expect the submit button to be disabled
      expect(await submitButton?.isDisabled()).toBe(true);

      // Refill the input field
      await window.fill(selector, value);
    }
  });

  // TODO: Figure out how to mock (intercept) api calls from the main process
  // test("should submit form", async () => {
  //   // Intercept network requests in Playwright
  //   await window.route("**/fetchCompletion", (route) => {
  //     route.fulfill({
  //       status: 200,
  //       contentType: "application/json",
  //       body: JSON.stringify({ message: "Stubbed response text" }),
  //     });
  //   });

  //   await fillOutForm(window);

  //   await window.click('button[type="submit"]');

  //   await window.waitForLoadState("networkidle");

  //   const response = await window.waitForResponse((response) => {
  //     console.log("response :", response);
  //     return response.url().includes("**/fetchCompletion");
  //   });

  //   expect(response.status()).toBe(200);
  // });
});
