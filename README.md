# Conduit

**Conduit** is a social blogging application (a Medium.com-style clone) built with **Angular 21**. It is a realistic single-page app with user authentication, full CRUD for articles and comments, tags, favorites, following other users, and paginated article feeds.

This repository is a practice target for **test automation**: both **UI (E2E) testing** through the web app and **API testing** against its REST backend. It was originally created for [Bondar Academy](https://www.bondaracademy.com/).

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Application pages](#application-pages)
- [API reference for testing](#api-reference-for-testing)
- [Project structure](#project-structure)
- [Docker](#docker)
- [Scripts](#scripts)

---

## Features

| Area      | What you can do                                                     |
| --------- | ------------------------------------------------------------------- |
| Auth      | Register, log in, stay logged in via JWT, log out                   |
| Articles  | Create, read, update, delete articles (Markdown body, tags)         |
| Feeds     | Global feed, personal "Your Feed", filter by tag, pagination        |
| Comments  | Add and delete comments on articles                                 |
| Favorites | Favorite / unfavorite articles, list an author's favorited articles |
| Profiles  | View user profiles, follow / unfollow authors                       |
| Settings  | Update avatar image, username, bio, email, and password             |

## Tech stack

- **Angular 21**: standalone components, built-in control flow (`@if`, `@for`), and lazy-loaded routes
- **RxJS** and **RxAngular** (`@rx-angular/template`, `@rx-angular/cdk`)
- **marked**: renders article bodies from Markdown
- **Karma + Jasmine**: unit test runner
- **Prettier + Husky + lint-staged**: formats staged files on commit
- **nginx + Docker**: production container

## Getting started

**Requirements:** Node.js `^20.19.0 || ^22.12.0 || >=24.0.0` (an LTS release such as 22 or 24 is recommended)

```bash
npm install
npm start
```

Open http://localhost:4200/. The app reloads when you change source files.

The frontend has **no local backend**. Every request goes to the hosted API at:

```
https://conduit-api.bondaracademy.com/api
```

This base URL is set in `src/app/core/interceptors/api.interceptor.ts`. To point the app at another backend, change it there.

## Application pages

| Route                          | Page                                | Requires login             |
| ------------------------------ | ----------------------------------- | -------------------------- |
| `/`                            | Home (global feed, your feed, tags) | No                         |
| `/login`                       | Sign in                             | No (hidden when logged in) |
| `/register`                    | Sign up                             | No (hidden when logged in) |
| `/article/:slug`               | Article details and comments        | No                         |
| `/profile/:username`           | User profile (my articles)          | No                         |
| `/profile/:username/favorites` | User's favorited articles           | No                         |
| `/editor`                      | New article                         | Yes                        |
| `/editor/:slug`                | Edit article                        | Yes                        |
| `/settings`                    | User settings and logout            | Yes                        |

## API reference for testing

**Base URL:** `https://conduit-api.bondaracademy.com/api`

### Authentication

After you log in or register, the response contains `user.token`. Send it on authenticated requests as:

```
Authorization: Token <jwt>
```

Note the scheme is `Token`, **not** `Bearer`. In the browser, the app keeps the token in `localStorage` (key `jwtToken`) and `src/app/core/interceptors/token.interceptor.ts` adds the header.

### Endpoints

#### Users and auth

| Method | Endpoint       | Auth | Body                                                                   |
| ------ | -------------- | ---- | ---------------------------------------------------------------------- |
| POST   | `/users`       | No   | `{ "user": { "username", "email", "password" } }`                      |
| POST   | `/users/login` | No   | `{ "user": { "email", "password" } }`                                  |
| GET    | `/user`        | Yes  | n/a                                                                    |
| PUT    | `/user`        | Yes  | `{ "user": { "email"?, "username"?, "password"?, "bio"?, "image"? } }` |

#### Articles

| Method | Endpoint          | Auth | Notes                                                              |
| ------ | ----------------- | ---- | ------------------------------------------------------------------ |
| GET    | `/articles`       | No   | Query: `tag`, `author`, `favorited`, `limit`, `offset`             |
| GET    | `/articles/feed`  | Yes  | Articles by followed authors. Query: `limit`, `offset`             |
| GET    | `/articles/:slug` | No   | Single article                                                     |
| POST   | `/articles/`      | Yes  | `{ "article": { "title", "description", "body", "tagList": [] } }` |
| PUT    | `/articles/:slug` | Yes  | `{ "article": { ...fields to update } }`                           |
| DELETE | `/articles/:slug` | Yes  | Author only                                                        |

List responses have the shape `{ "articles": [...], "articlesCount": <number> }`.

#### Favorites

| Method | Endpoint                   | Auth |
| ------ | -------------------------- | ---- |
| POST   | `/articles/:slug/favorite` | Yes  |
| DELETE | `/articles/:slug/favorite` | Yes  |

#### Comments

| Method | Endpoint                       | Auth | Body                               |
| ------ | ------------------------------ | ---- | ---------------------------------- |
| GET    | `/articles/:slug/comments`     | No   | n/a                                |
| POST   | `/articles/:slug/comments`     | Yes  | `{ "comment": { "body": "..." } }` |
| DELETE | `/articles/:slug/comments/:id` | Yes  | n/a                                |

#### Profiles

| Method | Endpoint                     | Auth |
| ------ | ---------------------------- | ---- |
| GET    | `/profiles/:username`        | No   |
| POST   | `/profiles/:username/follow` | Yes  |
| DELETE | `/profiles/:username/follow` | Yes  |

#### Tags

| Method | Endpoint | Auth |
| ------ | -------- | ---- |
| GET    | `/tags`  | No   |

### Example: full article lifecycle

```bash
BASE=https://conduit-api.bondaracademy.com/api

# 1. Log in and capture the token
TOKEN=$(curl -s -X POST "$BASE/users/login" \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"you@example.com","password":"your-password"}}' \
  | sed -E 's/.*"token":"([^"]+)".*/\1/')

# 2. Create an article
curl -s -X POST "$BASE/articles/" \
  -H "Content-Type: application/json" -H "Authorization: Token $TOKEN" \
  -d '{"article":{"title":"My test article","description":"About","body":"Hello","tagList":["test"]}}'

# 3. Update it (use the slug returned in step 2)
curl -s -X PUT "$BASE/articles/<slug>" \
  -H "Content-Type: application/json" -H "Authorization: Token $TOKEN" \
  -d '{"article":{"body":"Updated body"}}'

# 4. Delete it
curl -s -X DELETE "$BASE/articles/<slug>" -H "Authorization: Token $TOKEN"
```

### API testing ideas

- **Positive CRUD:** create, read, update, and delete articles and comments, then check that each response matches its request
- **Auth:** call protected endpoints with no token, a bad token, or the `Bearer` scheme (all should fail)
- **Ownership:** try to edit or delete another user's article or comment
- **Validation:** send empty titles, missing fields, duplicate usernames or emails, very long strings
- **Pagination and filters:** check `limit` and `offset` against `articlesCount`, and filter by `tag`, `author`, and `favorited`
- **State changes:** favorite and unfavorite (check `favoritesCount`), follow and unfollow (check `following` and `/articles/feed`)
- **Schema checks:** validate the response shapes for `user`, `article`, `comment`, and `profile`

> The backend is shared, so other people's data is on it too. Give your test data unique names (for example, add a timestamp) and clean up what you create.

## Project structure

```
src/app/
├── core/
│   ├── auth/            # Login/register page, UserService, JwtService
│   ├── interceptors/    # API base URL, auth token, error handling
│   ├── layout/          # Header and footer
│   └── models/          # Shared models (errors, loading state)
├── features/
│   ├── article/         # Home feed, article page, editor, comments, tags
│   ├── profile/         # Profile pages, follow, favorites
│   └── settings/        # User settings
├── shared/              # Reusable components, directives, pipes
├── app.config.ts        # App providers (router, HTTP, interceptors)
└── app.routes.ts        # Route definitions and guards
```

## Docker

Build and run the production image. nginx serves the app on port **8080**:

```bash
docker build -t conduit-frontend .
docker run -p 8080:8080 conduit-frontend
```

Then open http://localhost:8080/.

## Scripts

| Command         | Description                                 |
| --------------- | ------------------------------------------- |
| `npm start`     | Dev server at http://localhost:4200         |
| `npm run build` | Production build to `dist/angular-conduit/` |
| `npm test`      | Unit tests (Karma + Jasmine)                |

## License

[MIT](LICENSE)
