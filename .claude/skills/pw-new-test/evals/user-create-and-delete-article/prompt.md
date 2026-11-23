---
tags: [skill-creator, pw-new-test]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write a Playwright test for this manual test case:

TC_ART_010 - Logged-in user publishes and deletes an article
1. Log in and open the home page
2. Click "New Article" in the header
3. Enter a title, a short description, the article body and the tag "playwright"
4. Click "Publish Article"
Expected: The article page opens and shows the same title.
5. Click "Delete Article"
Expected: The user is back on the home page and the article no longer exists.
