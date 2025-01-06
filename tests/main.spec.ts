import {
  _electron as electron,
  test,
  expect,
  type ElectronApplication,
  type Page,
} from "@playwright/test";
import { describe } from "node:test";

let electronApp: ElectronApplication;
let window: Page;

describe("Main", () => {
  test.beforeAll(async () => {
    electronApp = await electron.launch({
      // TODO: Figure out how to test the development build instead of the release build
      executablePath:
        "./release/mac-arm64/Cover Letter Generator.app/Contents/MacOS/Cover Letter Generator",
      args: ["main.js"],
    });

    electronApp.on("console", (msg) => {
      console.log(msg);
    });

    window = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test("launch app", async () => {
    await expect(window).toHaveTitle(/Cover Letter Generator/);
  });

  test("should not be submittable by default", async () => {
    const submitButton = await window.$('button[type="submit"]');
    const isDisabled = await submitButton?.isDisabled();

    expect(isDisabled).toBe(true);
  });

  async function fillOutForm() {
    await window.fill('input[name="salutation"]', "Dear Hiring Manager,");
    await window.fill(
      'textarea[name="jobDescription"]',
      "We are looking for a Software Engineer to join our team.",
    );
    await window.fill(
      'textarea[name="additionalNotes"]',
      "I am excited about this opportunity.",
    );

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

    // Fill out settings in the accordion
    await window.fill('input[name="settings.apiKey"]', "abc123");
    await window.fill('input[name="settings.name"]', "John Doe");

    await window.selectOption(
      "[data-testid='settings-model-select-trigger'] + select",
      "gpt-3.5-turbo",
    );

    await window.fill('input[name="settings.temperature"]', "0.7");
    await window.fill('input[name="settings.wordLimit"]', "300");
    await window.fill(
      'textarea[name="settings.workExperience"]',
      "I have 4 years of experience in software development.",
    );
  }

  test("should be submittable when required fields are filled", async () => {
    await fillOutForm();

    const submitButton = await window.$('button[type="submit"]');
    const isDisabled = await submitButton?.isDisabled();

    expect(isDisabled).toBe(false);
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
