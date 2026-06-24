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

  // Injected right before </head>, so it comes after all linked stylesheets —
  // plain :root wins the cascade without any specificity tricks.
  const styleTag = `<style>:root{${entries.map(([k, v]) => `${k}:${v}`).join(";")}}`;

  return {
    name: "astrobulma",
    hooks: {
      "astro:build:done": ({ dir, pages }) => {
        for (const { pathname } of pages) {
          const file = new URL(`${pathname}index.html`, dir);
          try {
            const html = readFileSync(file, "utf8");
            writeFileSync(file, html.replace("</head>", `${styleTag}</head>`));
          } catch {
            // some pages (redirects, etc.) have no index.html
          }
        }
      },

      "astro:server:setup": ({ server }) => {
        server.middlewares.use((_req, res, next) => {
          const originalEnd = res.end.bind(res);
          const chunks: Buffer[] = [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res as any).write = (chunk: any): boolean => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            return true;
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res as any).end = (chunk?: any): typeof res => {
            if (chunk != null) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            }
            const contentType = res.getHeader("content-type");
            if (
              typeof contentType === "string" &&
              contentType.includes("text/html")
            ) {
              const body = Buffer.concat(chunks).toString("utf8");
              const injected = body.replace("</head>", `${styleTag}</head>`);
              res.setHeader("content-length", Buffer.byteLength(injected, "utf8"));
              originalEnd(injected);
            } else {
              originalEnd(Buffer.concat(chunks));
            }
            return res;
          };

          next();
        });
      },
    },
  };
}
