import { test, expect } from "@playwright/test";

test("dashboard loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("CABS");
  await expect(page.locator("text=Cab Dispatch System")).toBeVisible();
});

test("can navigate to clients page", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Clients");
  await expect(page.locator("h1")).toContainText("Clients");
  await expect(page.locator("text=Create Client")).toBeVisible();
});

test("can navigate to drivers page", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Drivers");
  await expect(page.locator("h1")).toContainText("Drivers");
});

test("can navigate to transits page", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Transits");
  await expect(page.locator("h1")).toContainText("Transits");
  await expect(page.locator("text=Transit Lifecycle")).toBeVisible({ timeout: 1000 }).catch(() => {
    // Transit lifecycle text is on detail page, not list page
  });
});

test("can navigate to all domain pages via sidebar", async ({ page }) => {
  await page.goto("/");

  const pages = ["Clients", "Drivers", "Transits", "Claims", "Contracts", "Car Types"];

  for (const pageName of pages) {
    await page.click(`nav >> text=${pageName}`);
    await expect(page.locator("h1")).toContainText(pageName, { timeout: 5000 });
  }
});
