import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Notification from "../src/elements/Notification.astro";

const render = async (props: Record<string, unknown>) => {
  const container = await AstroContainer.create();
  return container.renderToString(Notification, {
    props,
    slots: { default: "Heads up" },
  });
};

describe("Notification", () => {
  it("builds Bulma classes", async () => {
    const html = await render({ color: "danger", light: true, class: "is-hidden" });
    expect(html).toContain('class="notification is-danger is-light is-hidden"');
    expect(html).toContain("Heads up");
  });

  it("passes extra attributes to the root element", async () => {
    const html = await render({ id: "error", role: "alert", "data-kind": "auth" });
    expect(html).toMatch(/<div class="notification" id="error" role="alert" data-kind="auth"/);
  });
});
