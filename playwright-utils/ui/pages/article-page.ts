import { type Page, expect } from "@playwright/test";

export class ArticlePage {
  constructor(private page: Page) {}

  async addComment(commentText: string) {
    await this.page
      .getByRole("textbox", { name: "Write a comment..." })
      .fill(commentText);
    await this.page.getByRole("button", { name: "Post Comment" }).click();
    await expect(
      this.page.getByRole("textbox", { name: "Write a comment..." }),
    ).toHaveValue("");
  }

  async deleteComment(commentText: string) {
    const deleteCommentResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === "DELETE" &&
        response.url().includes("/comments/") &&
        response.status() === 200,
    );
    await this.page
      .getByTestId("comment-card")
      .filter({ hasText: commentText })
      .getByTestId("comment-delete-icon")
      .click();
    await deleteCommentResponse;
  }

  async expectArticleTitle(articleTitle: string) {
    await expect(
      this.page.getByRole("heading", { level: 1, name: articleTitle }),
    ).toBeVisible();
  }

  async expectCommentVisible(commentText: string) {
    await expect(
      this.page.getByTestId("comment-card").filter({ hasText: commentText }),
    ).toBeVisible();
  }

  async expectCommentRemoved(commentText: string) {
    await expect(
      this.page.getByTestId("comment-card").filter({ hasText: commentText }),
    ).toHaveCount(0);
  }
}
