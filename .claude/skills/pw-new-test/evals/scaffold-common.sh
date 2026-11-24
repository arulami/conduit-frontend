#!/usr/bin/env bash
# Copies the Conduit project into the eval sandbox's working directory.
# Runs as you (outside the sandbox) from the sandbox cwd, before the agent starts.
set -euo pipefail

EVALS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(cd "$EVALS_DIR/../../../.." && pwd -P)"

# Project files the agent needs: app source, tests, page objects, config, rules, CLAUDE.md.
# Left out: git data, build output, secrets, saved login sessions, and every skill
# (the "with" arm loads pw-new-test itself; the "without" arm must not see it).
rsync -a \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'dist/' \
  --exclude '.angular/' \
  --exclude 'test-results/' \
  --exclude 'playwright-report/' \
  --exclude 'playwright-utils/ui/.auth/' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude '.env.test.*' \
  --exclude '.claude/skills/' \
  --exclude '.claude/settings.local.json' \
  "$REPO_ROOT/" ./

# Placeholder env file so playwright.config.ts loads; no real credentials.
cp "$REPO_ROOT/.env.test.example" ./.env.test.local

# Only the packages `npx playwright test --list` needs.
mkdir -p node_modules/.bin
for pkg in @playwright playwright playwright-core dotenv; do
  rsync -a "$REPO_ROOT/node_modules/$pkg" node_modules/
done
cp -P "$REPO_ROOT/node_modules/.bin/playwright" node_modules/.bin/
