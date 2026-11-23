import type { Page } from "@playwright/test";
import { HomePage } from "../pages/home-page";
import { HeaderComponent } from "../pages/header-component";
import { ArticlePage } from "../pages/article-page";

export class PageManager {
  readonly homePage: HomePage;
  readonly headerComponent: HeaderComponent;
  readonly articlePage: ArticlePage;

  constructor(page: Page) {
    this.homePage = new HomePage(page);
    this.headerComponent = new HeaderComponent(page);
    this.articlePage = new ArticlePage(page);
  }
}
