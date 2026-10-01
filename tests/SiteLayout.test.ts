import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import SiteLayout from "../src/layouts/SiteLayout.astro";

const render = async (
  props: Record<string, unknown>,
  slots: Record<string, string> = {},
) => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(SiteLayout, {
    partial: false,
    props,
    slots: { default: "<p>Body</p>", ...slots },
  });
  return html.replace(/>\s+</g, "><");
};

describe("SiteLayout", () => {
  it("renders a document with the title and suffix", async () => {
    const html = await render({ title: "Inbox", titleSuffix: "Mail" });
    expect(html).toMatch(/^<!DOCTYPE html>/i);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>Inbox · Mail</title>");
  });

  it("wraps content in section and container by default", async () => {
    const html = await render({ title: "T" });
    expect(html).toMatch(
      /<main><section class="section"><div class="container"><p>Body<\/p><\/div><\/section><\/main>/,
    );
  });

  it("renders content directly in main when bare", async () => {
    const html = await render({ title: "T", bare: true });
    expect(html).toContain("<main><p>Body</p></main>");
  });

  it("renders a plain header with the theme toggle when no navbar slots are used", async () => {
    const html = await render({ title: "T" });
    expect(html).not.toContain('class="navbar');
    expect(html).toContain('<header class="is-flex is-justify-content-flex-end p-3">');
    expect(html).toContain("data-theme-toggle");
  });

  it("omits the theme toggle when disabled", async () => {
    const html = await render({ title: "T", themeToggle: false });
    expect(html).not.toContain("<header");
    expect(html).not.toContain("data-theme-toggle");
  });

  it("renders a navbar with the toggle before the end slot", async () => {
    const html = await render(
      { title: "T", navbarColor: "primary", navbarShadow: true },
      {
        brand: '<a class="navbar-item" href="/">Brand</a>',
        end: '<a class="navbar-item" href="/logout">Sign out</a>',
      },
    );
    expect(html).toContain('class="navbar is-primary has-shadow"');
    expect(html).not.toContain("<header");
    const brand = html.indexOf(">Brand</a>");
    const toggle = html.indexOf("data-theme-toggle");
    const signOut = html.indexOf(">Sign out</a>");
    expect(html.indexOf('class="navbar-brand"')).toBeLessThan(brand);
    expect(brand).toBeLessThan(toggle);
    expect(toggle).toBeLessThan(signOut);
    expect(html.indexOf('class="navbar-end"')).toBeLessThan(toggle);
  });

  it("renders optional head tags and the head and footer slots", async () => {
    const html = await render(
      { title: "T", description: "About", favicon: "/favicon.svg" },
      {
        head: '<meta name="robots" content="noindex">',
        footer: "<footer>Foot</footer>",
      },
    );
    expect(html).toContain('<meta name="description" content="About">');
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="/favicon.svg">');
    expect(html).toMatch(/<meta name="robots" content="noindex">[\s\S]*<\/head>/);
    expect(html).toMatch(/<\/main><footer>Foot<\/footer>/);
  });

  it("omits description and favicon when unset", async () => {
    const html = await render({ title: "T" });
    expect(html).not.toContain('name="description"');
    expect(html).not.toContain('rel="icon"');
  });

  it("renders ClientRouter only when enabled", async () => {
    const off = await render({ title: "T" });
    const on = await render({ title: "T", clientRouter: true });
    expect(off).not.toContain("astro-view-transitions-enabled");
    expect(on).toMatch(/astro-view-transitions-enabled[\s\S]*<\/head>/);
  });
});
