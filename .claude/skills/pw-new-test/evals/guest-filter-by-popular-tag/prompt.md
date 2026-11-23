---
tags: [skill-creator, pw-new-test]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write a Playwright test for this manual test case:

TC_TAG_001 - Filter articles by a popular tag
1. Open the Conduit home page as a guest
2. In the "Popular Tags" sidebar, click the first tag
Expected: A new feed tab with that tag's name is shown and selected, and the articles listed carry that tag.
