import type { AstroIntegration } from "astro";
import { readFileSync, writeFileSync } from "node:fs";

export type BulmaTheme = Record<string, string>;

export function astrobulma(
  options: { theme?: BulmaTheme } = {},
): AstroIntegration {
  const { theme = {} } = options;
  const entries = Object.entries(theme);

  if (entries.length === 0) {
    return { name: "astrobulma", hooks: {} };
  }

  const vars = entries.map(([k, v]) => `${k}:${v}`).join(";");

  return {
    name: "astrobulma",
    hooks: {
      // Dev: inject via a head-inline script. Vite injects CSS at runtime so
      // we can't control cascade position — use html:root (specificity 0,1,1)
      // to beat Bulma's :root (0,1,0) regardless of source order.
      "astro:config:setup": ({ command, injectScript }) => {
        if (command !== "dev") return;
        const css = `html:root{${vars}}`;
        const js = `(function(){var s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s)})();`;
        injectScript("head-inline", js);
      },

      // Build: post-process HTML files and inject right before </head>, so
      // the style lands after all linked stylesheets and wins the cascade
      // with a plain :root selector.
      "astro:build:done": ({ dir, pages }) => {
        const styleTag = `<style>:root{${vars}}</style>`;
        for (const { pathname } of pages) {
          const file = new URL(`${pathname.replace(/^\//, "")}index.html`, dir);
          try {
            const html = readFileSync(file, "utf8");
            writeFileSync(file, html.replace("</head>", `${styleTag}</head>`));
          } catch {
            // some pages (redirects, etc.) have no index.html
          }
        }
      },
    },
  };
}
