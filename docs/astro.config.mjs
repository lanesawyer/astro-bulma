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
      // Keyframe selectors (`0%`, `from`, `to`) live inside @keyframes and must
      // not be scoped — prepending `.preview` corrupts the animation.
      const parent = rule.parent;
      if (
        parent &&
        parent.type === "atrule" &&
        /keyframes$/i.test(
          /** @type {import("postcss").AtRule} */ (parent).name,
        )
      ) {
        return;
      }

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
          items: [
            { label: "Introduction", slug: "index" },
            { label: "Theming", slug: "theming" },
          ],
        },
        {
          label: "Elements",
          items: [
            { label: "Block", slug: "elements/block" },
            { label: "Box", slug: "elements/box" },
            { label: "Button", slug: "elements/button" },
            { label: "Content", slug: "elements/content" },
            { label: "Delete", slug: "elements/delete" },
            { label: "Icon", slug: "elements/icon" },
            { label: "Image", slug: "elements/image" },
            { label: "Notification", slug: "elements/notification" },
            { label: "Progress", slug: "elements/progress" },
            { label: "Table", slug: "elements/table" },
            { label: "Tag", slug: "elements/tag" },
            { label: "Title & Subtitle", slug: "elements/title" },
          ],
        },
        {
          label: "Forms",
          items: [
            { label: "TextInput", slug: "forms/textinput" },
            { label: "Textarea", slug: "forms/textarea" },
            { label: "Select", slug: "forms/select" },
            { label: "Checkbox", slug: "forms/checkbox" },
            { label: "Radio", slug: "forms/radio" },
            { label: "FileInput", slug: "forms/fileinput" },
            { label: "Field", slug: "forms/field" },
          ],
        },
        {
          label: "Components",
          items: [
            { label: "Breadcrumb", slug: "components/breadcrumb" },
            { label: "Card", slug: "components/card" },
            { label: "Dropdown", slug: "components/dropdown" },
            { label: "Menu", slug: "components/menu" },
            { label: "Message", slug: "components/message" },
            { label: "Modal", slug: "components/modal" },
            { label: "Navbar", slug: "components/navbar" },
            { label: "Pagination", slug: "components/pagination" },
            { label: "Panel", slug: "components/panel" },
            { label: "Tabs", slug: "components/tabs" },
            {
              label: "ThemeToggle",
              slug: "components/themetoggle",
              badge: { text: "Extra", variant: "success" },
            },
          ],
        },
        {
          label: "Columns & Grid",
          items: [
            { label: "Columns", slug: "layouts/columns" },
            { label: "Grid", slug: "layouts/grid" },
          ],
        },
        {
          label: "Layouts",
          items: [
            { label: "Container", slug: "layouts/container" },
            { label: "Hero", slug: "layouts/hero" },
            { label: "Section", slug: "layouts/section" },
            { label: "Level", slug: "layouts/level" },
            { label: "Media", slug: "layouts/media" },
            { label: "Footer", slug: "layouts/footer" },
            {
              label: "PageLayout",
              slug: "layouts/pagelayout",
              badge: { text: "Extra", variant: "success" },
            },
            {
              label: "SingleColumnLayout",
              slug: "layouts/singlecolumnlayout",
              badge: { text: "Extra", variant: "success" },
            },
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
        "astro-bulma/layouts": new URL("../src/layouts", import.meta.url).pathname,
        "astro-bulma": new URL("../src/index.ts", import.meta.url).pathname,
      },
    },
  },
});
