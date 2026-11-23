import { test } from "../../../playwright-utils/ui/fixtures";

test.describe("Guest smoke", () => {
  test.beforeEach(async ({ pom }) => {
    await pom.homePage.open();
  });

  test("Home page loads", async ({ pom }) => {
    await pom.homePage.expectHomePageLoaded();
  });
});
