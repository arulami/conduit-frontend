---
tags: [skill-creator, pw-new-test]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write a Playwright test for this manual test case:

TC_FEED_004 - Favourite an article from the Global Feed
1. Log in and open the home page
2. Click "Global Feed"
3. Note the favourite count on the second article in the list
4. Click the heart button on the second article
Expected: The count on that same article goes up by 1.
5. Click the heart button again
Expected: The count goes back to the original number.
