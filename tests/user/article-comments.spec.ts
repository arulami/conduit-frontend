import { test, expect } from "@playwright/test";

test.describe("Article comments", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("User can add and delete a comment on the first global feed article", async ({
    page,
  }) => {
    const commentText = `Playwright comment ${Date.now()}`;
    const globalFeedResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/api/articles?") && response.status() === 200,
    );
    await page.getByText("Global Feed", { exact: true }).click();
    await globalFeedResponse;
    const firstArticleHeading = page
      .locator("app-article-preview")
      .first()
      .getByRole("heading", { level: 1 });
    await expect(firstArticleHeading).toBeVisible();
    const articleTitleValue = (await firstArticleHeading.textContent())!.trim();
    await firstArticleHeading.click();
    await expect(
      page.getByRole("heading", { level: 1, name: articleTitleValue }),
    ).toBeVisible();
    await page
      .getByRole("textbox", { name: "Write a comment..." })
      .fill(commentText);
    await page.getByRole("button", { name: "Post Comment" }).click();
    const commentCard = page.locator("app-article-comment", {
      hasText: commentText,
    });
    await expect(commentCard).toBeVisible();
    const deleteCommentResponse = page.waitForResponse(
      (response) =>
        response.request().method() === "DELETE" &&
        response.url().includes("/comments/") &&
        response.status() === 200,
    );
    await commentCard.locator("i").click();
    await deleteCommentResponse;
    await expect(commentCard).toHaveCount(0);
  });
});
