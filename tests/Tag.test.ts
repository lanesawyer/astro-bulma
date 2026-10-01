import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Tag from "../src/elements/Tag.astro";

const render = async (props: Record<string, unknown>, text = "Label") => {
  const container = await AstroContainer.create();
  return container.renderToString(Tag, { props, slots: { default: text } });
};

describe("Tag", () => {
  it("renders a span by default", async () => {
    const html = await render({ color: "primary", rounded: true });
    expect(html).toBe('<span class="tag is-primary is-rounded">Label</span>');
  });

  it("renders a link with as='a'", async () => {
    const html = await render({ as: "a", href: "/?tag=1", color: "dark" });
    expect(html).toBe('<a class="tag is-dark" href="/?tag=1">Label</a>');
  });

  it("renders a button with type='button' by default", async () => {
    const html = await render({ as: "button", title: "Remove" });
    expect(html).toBe('<button class="tag" title="Remove" type="button">Label</button>');
  });

  it("passes the button type through", async () => {
    expect(await render({ as: "button", type: "submit" })).toContain('type="submit"');
  });

  it("renders an empty delete button", async () => {
    const html = await render({ as: "button", isDelete: true, "aria-label": "Delete tag" });
    expect(html).toBe(
      '<button class="tag is-delete" type="button" aria-label="Delete tag"></button>',
    );
  });

  it("passes extra attributes through", async () => {
    const html = await render({ style: "background-color:#7a5af5", "data-id": "3" });
    expect(html).toBe(
      '<span class="tag" style="background-color:#7a5af5" data-id="3">Label</span>',
    );
  });
});
