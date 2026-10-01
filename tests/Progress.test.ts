import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Progress from "../src/elements/Progress.astro";

const render = async (props: Record<string, unknown>) => {
  const container = await AstroContainer.create();
  return container.renderToString(Progress, { props });
};

describe("Progress", () => {
  it("labels the value as a percent of max", async () => {
    const html = await render({ value: 13, max: 52 });
    expect(html).toContain('value="13"');
    expect(html).toContain('max="52"');
    expect(html).toMatch(/>\s*25%\s*<\/progress>/);
  });

  it("defaults max to 100", async () => {
    expect(await render({ value: 45 })).toMatch(/>\s*45%\s*<\/progress>/);
  });

  it("renders no label when indeterminate", async () => {
    const html = await render({ color: "primary" });
    expect(html).not.toContain("%");
    expect(html).not.toContain("value=");
  });

  it("renders no label when max is zero", async () => {
    expect(await render({ value: 0, max: 0 })).not.toContain("%");
  });
});
