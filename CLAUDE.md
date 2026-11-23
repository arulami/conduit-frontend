# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Conduit: an Angular 21 frontend for a Medium-style blogging app (RealWorld spec), used as a practice target for UI (Playwright) and API test automation. There is **no backend in this repo**. All HTTP calls go to the hosted API `https://conduit-api.bondaracademy.com/api`. README.md has the full endpoint reference.

## Commands

```bash
npm start                  # dev server at http://localhost:4200
npm run build              # production build -> dist/angular-conduit/
npm run test:e2e           # Playwright tests (dev server must already be running)
npm run test:e2e:ui        # Playwright UI mode
npx playwright test tests/ui-tests/guest/smoke.spec.ts # single file
npx playwright test -g "Home page loads"               # single test by title
npx playwright test --project=user                     # one project (runs auth-setup first)
TEST_ENV=<env> npx playwright test                     # load .env.test.<env> instead of .env.test.local
```

- Run the dev server on port **4200**. The hosted API's CORS only allows `http://localhost:4200`, so the app on any other port gets no data.
- `npm test` (Karma) has no spec files, and `npm run lint` fails because `angular.json` has no lint target.
- Requires Node `^20.19 || ^22.12 || >=24`.
- The Husky pre-commit hook runs Prettier on staged `ts/html/css/json/md` files through lint-staged. There is no Prettier config file, so defaults apply.

## App architecture

- **Standalone components only** (no NgModules). Routes are lazy-loaded in `src/app/app.routes.ts`. Auth guards are inline `canActivate` functions using `UserService.isAuthenticated`. `/login` and `/register` are guarded the other way: logged-in users can't open them.
- **HTTP pipeline** (`src/app/core/interceptors/`, registered in `app.config.ts`, in this order):
  - `apiInterceptor` prefixes every request URL with the API base. Services therefore call relative paths like `/articles`, and the base URL can only be changed here.
  - `tokenInterceptor` adds `Authorization: Token <jwt>`. The scheme is `Token`, not `Bearer`.
  - `errorInterceptor` rethrows `err.error`. Subscribers receive the API's error body, not an `HttpErrorResponse`.
- **Auth state**:
  - `UserService` keeps the current user in a `BehaviorSubject`.
  - `JwtService` stores the token in `localStorage["jwtToken"]`.
  - An `APP_INITIALIZER` in `app.config.ts` calls `GET /user` on boot when a token exists. That is why Playwright `storageState` (which captures localStorage) is enough to restore a session.
- **Layout**:
  - `core/` holds app-wide singletons: auth, layout header/footer, interceptors.
  - `features/{article,profile,settings}` each hold their own pages, components, services and models.
  - `shared/` holds the `markdown` pipe (uses `marked`) and `list-errors`.
- **Two `IfAuthenticatedDirective` copies exist** (`core/auth/` and `shared/directives/`) and both are imported. Check which one a component uses before changing one.
- Templates use built-in control flow (`@if`/`@for`), and the code uses RxAngular `RxLet` (`*rxLet`) in places. Zone-based change detection is enabled explicitly in `src/main.ts`.

## Playwright framework

- `playwright.config.ts` loads `.env.test.${TEST_ENV ?? 'local'}` from the **project root** via dotenv. That file holds `BASE_URL`, `USER_EMAIL` and `USER_PASSWORD`, and git ignores it; only `.env.test.example` is committed.
- Projects:
  - `auth-setup` (`tests/ui-tests/auth.setup.ts`) logs in through the UI and saves `playwright-utils/ui/.auth/user.json`.
  - `user` (`tests/ui-tests/user/`) reuses that session and depends on `auth-setup`.
  - `guest` (`tests/ui-tests/guest/`) runs unauthenticated.
- UI tests use the Page Object Model. Page objects live in `playwright-utils/ui/pages/`, `PageManager` (`playwright-utils/ui/fixtures/page-manager.ts`) creates them, and specs get them through the `pom` fixture from `playwright-utils/ui/fixtures`. `playwright-utils/types/env.d.ts` types `process.env`.
- Login form quirks: the inputs have no `<label>`, only placeholders. `getByRole('textbox', { name: 'Email' })` works, but the password input needs `getByPlaceholder('Password')`. Both the header link and the submit button say "Sign in".
- `.claude/rules/playwright-{scripting,architecture}.md` hold the test-authoring conventions and auto-load for `tests/ui-tests/**` and `playwright-utils/ui/**`.
- The backend is shared with other users: give test data unique names (for example, add a timestamp) and clean up what tests create.
