// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";
import { readFileSync } from "fs";
import { createRequire } from "module";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const require = createRequire(import.meta.url);

/**
 * Vite plugin that rewrites every selector in bulma.min.css so it only
 * applies inside `.preview`, keeping Bulma from leaking into Starlight's UI.
 *
 * Selector rewrite rules:
 *  - `:root`        → `.preview`   (CSS custom properties scoped to .preview)
 *  - `html`, `body` → `.preview`
 *  - everything else → `.preview <selector>`
 *
 */
function scopeBulmaPlugin() {
  /** @param {string} css */
  function rewriteSelectors(css) {
    const root = postcss.parse(css);

    root.walkRules((/** @type {import("postcss").Rule} */ rule) => {
      rule.selectors = rule.selectors.map((sel) => {
        const transform = selectorParser((selectors) => {
          selectors.each((selector) => {
            const first = selector.first;

            // :root → .preview (keeps Bulma custom props scoped)
            if (first.type === "pseudo" && first.value === ":root") {
              selector.removeAll();
              selector.append(selectorParser.className({ value: "preview" }));
              return;
            }

            // html or body → .preview
            if (
              first.type === "tag" &&
              (first.value === "html" || first.value === "body")
            ) {
              selector.removeAll();
              selector.append(selectorParser.className({ value: "preview" }));
              return;
            }

            // Prepend .preview as ancestor for everything else
            selector.prepend(selectorParser.combinator({ value: " " }));
            selector.prepend(selectorParser.className({ value: "preview" }));
          });
        });

        return transform.processSync(sel);
      });
    });

    return root.toResult().css;
  }

  return {
    name: "scope-bulma",
    enforce: /** @type {"pre"} */ ("pre"),
    /** @param {string} id */
    load(id) {
      if (!id.endsWith("src/styles/bulma.css")) return null;
      const bulmaPath = require.resolve("bulma/css/bulma.min.css");
      return rewriteSelectors(readFileSync(bulmaPath, "utf8"));
    },
  };
}

export default defineConfig({
  site: "https://lanesawyer.github.io",
  base: "/astro-bulma",
  image: {
    service: passthroughImageService(),
    domains: ["bulma.io"],
  },
  integrations: [
    starlight({
      title: "astro-bulma",
      description: "Astro component library wrapping Bulma CSS",
      sidebar: [
        {
          label: "Getting Started",
          items: [{ label: "Introduction", slug: "index" }],
        },
        {
          label: "Elements",
          items: [
            { label: "Box", slug: "elements/box" },
            { label: "Button", slug: "elements/button" },
            { label: "Icon", slug: "elements/icon" },
            { label: "Image", slug: "elements/image" },
            { label: "Notification", slug: "elements/notification" },
            { label: "Table", slug: "elements/table" },
            { label: "Tag", slug: "elements/tag" },
          ],
        },
        {
          label: "Forms",
          items: [
            { label: "TextInput", slug: "forms/textinput" },
            { label: "Select", slug: "forms/select" },
            { label: "Checkbox", slug: "forms/checkbox" },
            { label: "FileInput", slug: "forms/fileinput" },
          ],
        },
        {
          label: "Components",
          items: [
            { label: "Breadcrumb", slug: "components/breadcrumb" },
            { label: "Card", slug: "components/card" },
            { label: "Message", slug: "components/message" },
            { label: "Modal", slug: "components/modal" },
            { label: "Tabs", slug: "components/tabs" },
          ],
        },
      ],
      customCss: [
        "@fortawesome/fontawesome-free/css/all.min.css",
        "./src/styles/bulma.css",
        "./src/styles/custom.css",
      ],
      components: {
        Head: "./src/components/Head.astro",
      },
    }),
  ],
  vite: {
    plugins: [scopeBulmaPlugin()],
    resolve: {
      alias: {
        "astro-bulma/elements": new URL("../src/elements", import.meta.url).pathname,
        "astro-bulma/forms": new URL("../src/forms", import.meta.url).pathname,
        "astro-bulma/components": new URL("../src/components", import.meta.url).pathname,
        "astro-bulma": new URL("../src/index.ts", import.meta.url).pathname,
      },
    },
  },
});
