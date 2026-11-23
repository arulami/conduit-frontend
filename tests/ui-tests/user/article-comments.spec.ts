import { test } from "../../../playwright-utils/ui/fixtures";

test.describe("Article comments", () => {
  test.beforeEach(async ({ pom }) => {
    await pom.homePage.open();
  });

  test("User can add and delete a comment on the first global feed article", async ({
    pom,
  }) => {
    const commentText = `Playwright comment ${Date.now()}`;
    const articleTitleValue = await pom.homePage.openFirstGlobalFeedArticle();
    await pom.articlePage.expectArticleTitle(articleTitleValue);
    await pom.articlePage.addComment(commentText);
    await pom.articlePage.expectCommentVisible(commentText);
    await pom.articlePage.deleteComment(commentText);
    await pom.articlePage.expectCommentRemoved(commentText);
  });
});
