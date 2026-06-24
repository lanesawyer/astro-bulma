import type { AstroIntegration } from "astro";

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
      // Inject via head-inline for all render modes (dev, static, SSR).
      // Vite/Astro controls stylesheet load order so we can't rely on source
      // order alone — html:root (specificity 0,1,1) beats Bulma's :root
      // (0,1,0) regardless of when stylesheets land in the DOM.
      "astro:config:setup": ({ injectScript }) => {
        const css = `html:root{${vars}}`;
        const js = `(function(){var s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s)})();`;
        injectScript("head-inline", js);
      },
    },
  };
}
