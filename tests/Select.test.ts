import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Select from "../src/forms/Select.astro";

const render = async (props: Record<string, unknown>) => {
  const container = await AstroContainer.create();
  return container.renderToString(Select, {
    props,
    slots: { default: '<option value="a">A</option>' },
  });
};

const selectTag = (html: string) => html.match(/<select[^>]*>/)?.[0] ?? "";

describe("Select", () => {
  const extra = {
    "aria-label": "Sort items",
    onchange: "this.form.submit()",
    "data-testid": "sort",
  };

  it("passes extra attributes to the <select> when standalone", async () => {
    const html = await render({ name: "sort", standalone: true, size: "small", ...extra });
    expect(html).toContain('<div class="select is-small">');
    const tag = selectTag(html);
    expect(tag).toContain('aria-label="Sort items"');
    expect(tag).toContain('onchange="this.form.submit()"');
    expect(tag).toContain('data-testid="sort"');
  });

  it("passes extra attributes to the <select> inside the field wrapper", async () => {
    const html = await render({ name: "sort", label: "Sort", ...extra });
    expect(html).toContain('<div class="field">');
    expect(selectTag(html)).toContain('aria-label="Sort items"');
    expect(html.match(/aria-label=/g)).toHaveLength(1);
  });
});
