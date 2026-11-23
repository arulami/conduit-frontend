import { test, expect } from "@playwright/test";

test.describe("User smoke", () => {
  test("Authenticated session is active", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "New Article" }),
    ).toBeVisible();
  });
});
