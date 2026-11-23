---
tags: [skill-creator, pw-new-test]
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

Write a Playwright test for this manual test case:

TC_AUTH_002 - Login fails with a wrong password
1. Open the Conduit home page as a guest
2. Click "Sign in" in the header
3. Enter a registered email address
4. Enter the password "WrongPass123!"
5. Click the "Sign in" button
Expected: An error message says the email or password is invalid, and the user stays on the login page.
