import { type Page, expect } from "@playwright/test";

export class HeaderComponent {
  constructor(private page: Page) {}

  async expectUserLoggedIn() {
    await expect(
      this.page
        .getByRole("navigation")
        .getByRole("link", { name: "New Article" }),
    ).toBeVisible();
  }
}
