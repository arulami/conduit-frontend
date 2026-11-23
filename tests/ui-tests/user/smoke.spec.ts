import { test } from "../../../playwright-utils/ui/fixtures";

test.describe("User smoke", () => {
  test("Authenticated session is active", async ({ pom }) => {
    await pom.homePage.open();
    await pom.headerComponent.expectUserLoggedIn();
  });
});
