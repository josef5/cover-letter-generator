import { test, expect, type Page, Locator } from "@playwright/test";
import { describe } from "node:test";
import mockResponse from "../tests/mock-response.json" with { type: "json" };

let settingsButton: Locator;
let settingsCloseButton: Locator;
let submitButton: Locator;
let mainSettingsSaveButton: Locator;

const apiRoute = "*/**/v1/chat/completions";

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
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: true,
  },
  {
    element: "textarea",
    name: "additionalNotes",
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: false,
  },

  {
    element: "input",
    name: "temperature",
    value: "0.7",
    required: true,
    hasDefaultValue: true,
  },
  {
    element: "input",
    name: "wordLimit",
    value: "300",
    required: true,
    hasDefaultValue: true,
  },
  {
    element: "input",
    page: "settings",
    name: "apiKey",
    value: "abc123",
    required: true,
  },
  {
    element: "input",
    page: "settings",
    name: "name",
    value: "John Doe",
    required: true,
  },
  {
    element: "textarea",
    page: "settings",
    name: "workExperience",
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    required: true,
  },
];

// Filter out the required input fields that have a default value and are not emptyable
const requiredInputFields = inputFields.filter(
  ({ required, hasDefaultValue }) => required && !hasDefaultValue,
);

const mainFormFields = requiredInputFields.filter(({ page }) => !page);
const settingsFields = requiredInputFields.filter(
  ({ page }) => page === "settings",
);

describe("Main", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    settingsButton = page.getByTestId("settings-button");
    settingsCloseButton = page.getByTestId("settings-close-button");
    mainSettingsSaveButton = page.getByTestId("main-settings-save-button");
    submitButton = page.getByRole("button", { name: "Generate" });
  });

  async function fillOutForm(page: Page, clearFields = false) {
    // Click the settings button to open the settings form
    await settingsButton?.click();
    await page.waitForTimeout(500);

    // Set values for the settings form
    for (const { element, name, value } of settingsFields) {
      await page.fill(`${element}[name='${name}']`, clearFields ? "" : value);
    }

    // Close the settings form
    await settingsCloseButton.click();
    await page.waitForTimeout(500);

    // Set values for the input fields and textareas
    for (const { element, name, value } of mainFormFields) {
      await page.fill(`${element}[name='${name}']`, clearFields ? "" : value);
    }
  }

  test("loads ok", async () => {
    await expect(submitButton).toBeVisible();
  });

  test("should not be submittable on load", async () => {
    const isDisabled = await submitButton?.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test("should not be submittable when required fields are empty", async ({
    page,
  }) => {
    await fillOutForm(page, true);

    const isDisabled = await submitButton?.isDisabled();
    expect(isDisabled).toBe(true);
  });

  test("should be submittable when required fields are filled", async ({
    page,
  }) => {
    await fillOutForm(page);

    const isDisabled = await submitButton?.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test("should main settings button be disabled on load", async () => {
    const isDisabled = await mainSettingsSaveButton?.isDisabled();

    expect(isDisabled).toBe(true);
  });

  test("should main settings update", async ({ page }) => {
    await page.fill(`input[name='wordLimit']`, "400");

    expect(await mainSettingsSaveButton?.isDisabled()).toBe(false);

    await mainSettingsSaveButton?.click();

    expect(await mainSettingsSaveButton?.isDisabled()).toBe(true);
  });

  test("should generate a cover letter", async ({ page }) => {
    await page.route(apiRoute, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse),
      });
    });

    // Set up response listener
    const responsePromise = page.waitForResponse(apiRoute);

    await fillOutForm(page);

    await submitButton?.click();

    await responsePromise;

    await page.waitForTimeout(500);

    expect(responsePromise).not.toBeNull();
    await expect(page.getByText("Dear Mock,")).toBeInViewport();
  });

  test("should display an error message when the API call fails", async ({
    page,
  }) => {
    await page.route(apiRoute, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal server error" }),
      });
    });

    // Set up response listener
    const responsePromise = page.waitForResponse(apiRoute);

    await fillOutForm(page);

    await submitButton?.click();

    await responsePromise;

    await page.waitForTimeout(500);

    expect(responsePromise).not.toBeNull();
    await expect(page.getByText("API response is empty")).toBeInViewport();
  });
});
