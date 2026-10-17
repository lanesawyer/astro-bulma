import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import AppLayout from "../src/layouts/AppLayout.astro";
import SidebarSearch from "../src/components/SidebarSearch.astro";

const render = async (
  component: Parameters<AstroContainer["renderToString"]>[0],
  props: Record<string, unknown>,
  slots: Record<string, string> = {},
  partial = false,
) => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(component, {
    partial,
    props,
    slots,
  });
  return html
    .replace(/\s+data-astro-cid-\w+(="[^"]*")?/g, "")
    .replace(/\s+class="astro-\w+"/g, "")
    .replace(/>\s+</g, "><");
};

const layout = (
  props: Record<string, unknown>,
  slots: Record<string, string> = {},
) => render(AppLayout, props, { default: "<p>Body</p>", ...slots });

describe("AppLayout", () => {
  it("renders a document with the title and suffix and no navbar", async () => {
    const html = await layout({ title: "Inbox", titleSuffix: "Mail" });
    expect(html).toMatch(/^<!DOCTYPE html>/i);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>Inbox · Mail</title>");
    expect(html).not.toContain("navbar");
  });

  it("puts brand and sidebar slots in a labelled sidebar menu", async () => {
    const html = await layout(
      { title: "T", sidebarLabel: "Main navigation" },
      { brand: '<a href="/">Brand</a>', sidebar: "<nav>links</nav>" },
    );
    expect(html).toContain(
      '<aside id="app-sidebar" class="app-sidebar menu" aria-label="Main navigation">',
    );
    expect(html).toContain(
      '<div class="app-sidebar-brand"><a href="/">Brand</a></div>',
    );
    expect(html).toContain(
      '<div class="app-sidebar-body"><nav>links</nav></div>',
    );
  });

  it("wraps content in section and container unless bare", async () => {
    expect(await layout({ title: "T" })).toContain(
      '<section class="section"><div class="container"><p>Body</p></div></section></main>',
    );
    expect(await layout({ title: "T", bare: true })).toMatch(
      /<\/button><p>Body<\/p><\/main>/,
    );
  });

  it("renders collapsed when asked, and never stores state itself", async () => {
    const html = await layout({ title: "T", collapsed: true });
    expect(html).toContain('<html lang="en" data-sidebar="collapsed">');
    expect(html).not.toMatch(/localStorage\.(get|set)Item\("sidebar/);
  });

  it("renders the theme toggle and footer slot, or neither", async () => {
    const withFooter = await layout(
      { title: "T" },
      { "sidebar-footer": "<span>v1</span>" },
    );
    expect(withFooter).toMatch(
      /<div class="app-sidebar-footer"><button[^>]*data-theme-toggle/,
    );
    expect(withFooter).toContain("<span>v1</span></div>");
    const none = await layout({ title: "T", themeToggle: false });
    expect(none).not.toContain("app-sidebar-footer");
  });

  it("labels the collapse toggle for the rail", async () => {
    const html = await layout({ title: "T" });
    expect(html).toContain(
      'data-sidebar-rail-toggle aria-controls="app-sidebar" aria-label="Collapse sidebar"',
    );
    expect(html).toContain('aria-label="Open sidebar"');
  });
});

describe("SidebarSearch", () => {
  it("renders a GET search form whose input expands the rail on focus", async () => {
    const html = await render(
      SidebarSearch,
      {
        action: "/search",
        placeholder: "Search tasks",
        value: "bulma",
      },
      {},
      true,
    );
    expect(html).toMatch(
      /^<form class="sidebar-search" method="GET" action="\/search" role="search">/,
    );
    expect(html).toContain("fa-magnifying-glass");
    expect(html).toMatch(
      /<input class="menu-item-label" type="search" name="q" value="bulma" placeholder="Search tasks" aria-label="Search tasks" data-sidebar-expand-on-focus/,
    );
  });
});
