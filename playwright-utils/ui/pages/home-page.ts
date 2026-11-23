import { type Page, expect } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto("/");
    await expect(
      this.page.getByText("Global Feed", { exact: true }),
    ).toBeVisible();
  }

  async openFirstGlobalFeedArticle(): Promise<string> {
    const globalFeedResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes("/api/articles?") && response.status() === 200,
    );
    await this.page.getByText("Global Feed", { exact: true }).click();
    await globalFeedResponse;
    const firstArticleHeading = this.page
      .getByTestId("article-preview-card")
      .first()
      .getByRole("heading", { level: 1 });
    await expect(firstArticleHeading).toBeVisible();
    const articleTitleValue = (await firstArticleHeading.textContent())!.trim();
    await firstArticleHeading.click();
    await expect(this.page).toHaveURL(/\/article\//);
    return articleTitleValue;
  }

  async expectHomePageLoaded() {
    await expect(this.page).toHaveURL("/");
  }
}
