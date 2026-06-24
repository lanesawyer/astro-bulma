import type { AstroIntegration } from "astro";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

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

      // Build: post-process HTML files using direct file URLs from the assets
      // map (Astro 5+). Injecting right before </head> means the style lands
      // after all <link rel="stylesheet"> tags and wins the cascade at equal
      // specificity with a plain :root selector.
      "astro:build:done": ({ assets, logger }) => {
        const styleTag = `<style>:root{${vars}}</style>`;
        let injected = 0;
        for (const urls of assets.values()) {
          for (const url of urls) {
            if (!url.pathname.endsWith(".html")) continue;
            try {
              const file = fileURLToPath(url);
              const html = readFileSync(file, "utf8");
              if (!html.includes("</head>")) {
                logger.warn(`astrobulma: no </head> found in ${file}`);
                continue;
              }
              writeFileSync(file, html.replace("</head>", `${styleTag}</head>`));
              injected++;
            } catch (e) {
              logger.warn(`astrobulma: failed to inject into ${url.href}: ${e}`);
            }
          }
        }
        if (injected === 0) {
          logger.warn(`astrobulma: theme vars set but no HTML files were found in the assets map — theme will not be applied in the build`);
        } else {
          logger.info(`astrobulma: injected theme into ${injected} HTML file(s)`);
        }
      },
    },
  };
}
