---
name: verify
description: Verify astro-bulma component changes by driving them in a real browser — docs site for MPA behavior, a throwaway fixture app for ClientRouter behavior.
---

# Verifying astro-bulma changes

The library has no runnable app of its own. Two surfaces work:

## 1. Docs site (plain MPA, no ClientRouter)

```bash
pnpm docs:build                       # builds docs/dist (delete stale docs/dist if astro check drowns in warnings)
pnpm docs:preview --port 4399         # serves at http://localhost:4399/astro-bulma/
```

Component pages live at `/astro-bulma/<dir>/<name>/`. Drive with Playwright —
browsers are cached in `~/.cache/ms-playwright`; the package can be borrowed:

```js
import { createRequire } from "module";
const require = createRequire("/home/lane/Dev/super-productivity/package.json");
const { chromium } = require("playwright");
```

Gotchas:
- `astro:page-load` does NOT fire here (Starlight has no ClientRouter). Any
  component whose JS only binds inside that event will be dead on this site.
- Starlight writes `data-theme` on `<html>` from its own `starlight-theme`
  localStorage key, and re-applies it after body scripts run — theme-related
  assertions on the docs site are unreliable; use the fixture instead.
- Docs Bulma is selector-rewritten to only apply inside `.preview`, so
  `[data-theme=dark]` component styles won't restyle preview content there.

## 2. Fixture app (for ClientRouter / page-level behavior)

Create an untracked `.fixture/` in the repo root (do not commit it):

```bash
mkdir -p .fixture/src/pages
# .fixture/package.json: { "name": "fixture", "type": "module" }
# .fixture/astro.config.mjs: alias "astro-bulma" -> new URL("../src/index.ts", import.meta.url).pathname
# pages: import { ClientRouter } from "astro:transitions" + the component under test;
#        add a /plain page WITHOUT ClientRouter to cover MPA sites
node_modules/.bin/astro dev --root .fixture --port 4402 &
```

Restart the dev server after creating/along with astro.config.mjs — a config
written while the server runs can leave it in a broken resolve state.
Symlinking a fixture outside the repo into node_modules does NOT work (Vite
mangles paths); keep the fixture inside the repo and use the alias.

Always test both with and without ClientRouter: `astro:page-load` only fires
when it's present, so interactive components need an immediate init call too.

Cleanup: `rm -rf .fixture` and kill the servers (find PIDs via
`ss -tlnp | grep <port>` — `pkill -f "astro dev"` can match your own shell).
