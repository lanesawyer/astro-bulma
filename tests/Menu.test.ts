import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Menu from "../src/components/Menu.astro";
import MenuItem from "../src/components/MenuItem.astro";
import MenuSection from "../src/components/MenuSection.astro";

const render = async (
  component: Parameters<AstroContainer["renderToString"]>[0],
  props: Record<string, unknown>,
  slots: Record<string, string> = {},
) => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(component, { props, slots });
  return html
    .replace(/\s+data-astro-cid-\w+(="[^"]*")?/g, "")
    .replace(/\s+class="astro-\w+"/g, "")
    .replace(/>\s+</g, "><");
};

describe("Menu", () => {
  it("renders sections as labels and lists", async () => {
    const html = await render(Menu, {
      sections: [
        { label: "General", items: [{ label: "Dashboard", href: "/" }] },
      ],
    });
    expect(html).toMatch(/^<aside class="menu">/);
    expect(html).toContain('<p class="menu-label"><span>General</span></p>');
    expect(html).toContain(
      '<ul class="menu-list"><li><a href="/" class="menu-item-link">',
    );
    expect(html).toContain('<span class="menu-item-label">Dashboard</span>');
  });

  it("marks the active item", async () => {
    const html = await render(Menu, {
      sections: [{ items: [{ label: "Customers", href: "/c", active: true }] }],
    });
    expect(html).toContain(
      'class="menu-item-link is-active" aria-current="page"',
    );
    expect(html).not.toContain('class="menu-label"');
  });

  it("nests one level of children inside the parent item", async () => {
    const html = await render(Menu, {
      sections: [
        {
          items: [
            {
              label: "Team",
              href: "/team",
              children: [{ label: "Members", href: "/team/members" }],
            },
          ],
        },
      ],
    });
    expect(html).toMatch(
      /Team<\/span><\/a><ul class="menu-list"><li><a href="\/team\/members"/,
    );
  });

  it("renders item icons and collapsible sections from data", async () => {
    const html = await render(Menu, {
      sections: [
        {
          label: "Admin",
          collapsible: true,
          items: [{ label: "Inbox", href: "/inbox", icon: "fa-inbox" }],
        },
      ],
    });
    expect(html).toContain('<i class="fas fa-inbox" aria-hidden="true"></i>');
    expect(html).toContain('<details open><summary class="menu-label">');
  });

  it("renders composed children when sections is omitted", async () => {
    const html = await render(Menu, {}, { default: "<p>composed</p>" });
    expect(html).toBe('<aside class="menu"><p>composed</p></aside>');
  });
});

describe("MenuItem", () => {
  it("renders the end slot after the label", async () => {
    const html = await render(
      MenuItem,
      { label: "Inbox", href: "/inbox" },
      { end: '<span class="tag">3</span>' },
    );
    expect(html).toContain(
      '<span class="menu-item-label">Inbox</span><span class="menu-item-end"><span class="tag">3</span></span></a>',
    );
  });

  it("falls back to initials, or abbr, for items without an icon", async () => {
    expect(
      await render(MenuItem, { label: "Home renovation", href: "/" }),
    ).toMatch(/class="icon menu-item-abbr" aria-hidden="true">HR</);
    expect(await render(MenuItem, { label: "Garden", href: "/" })).toContain(
      ">GA<",
    );
    expect(
      await render(MenuItem, { label: "Garden", href: "/", abbr: "G" }),
    ).toMatch(/class="icon menu-item-abbr has-abbr" aria-hidden="true">G</);
  });

  it("passes extra attributes to the link", async () => {
    const html = await render(MenuItem, {
      label: "Docs",
      href: "/docs",
      class: "is-special",
      "data-test": "x",
    });
    expect(html).toContain('class="menu-item-link is-special"');
    expect(html).toContain('data-test="x"');
  });
});

describe("MenuSection", () => {
  it("puts actions outside the summary so they don't fold the section", async () => {
    const html = await render(
      MenuSection,
      {
        label: "Projects",
        collapsible: true,
        open: false,
        "data-section": "p",
      },
      { default: "<ul></ul>", actions: '<a href="/new">New</a>' },
    );
    expect(html).toMatch(
      /^<div class="menu-section is-collapsible"><details data-section="p">/,
    );
    expect(html).toContain(
      '</details><div class="menu-section-actions"><a href="/new">New</a></div>',
    );
    expect(html).toContain("fa-chevron-right");
  });

  it("renders a plain section without a label or actions", async () => {
    const html = await render(MenuSection, {}, { default: "<ul></ul>" });
    expect(html).toBe(
      '<div class="menu-section"><section><ul></ul></section></div>',
    );
  });
});
