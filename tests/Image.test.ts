import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Image from "../src/elements/Image.astro";

const render = async (props: Record<string, unknown>) => {
  const container = await AstroContainer.create();
  return container.renderToString(Image, { props });
};

describe("Image", () => {
  it("renders a string src as a plain img, sized from `size`", async () => {
    const html = await render({ src: "/images/avatars/me.png", alt: "Me", size: "96x96", rounded: true });
    expect(html).toBe(
      '<figure class="image is-96x96 is-rounded"><img src="/images/avatars/me.png" alt="Me" width="96" height="96" loading="lazy"></figure>',
    );
  });

  it("leaves remote URLs and data URIs alone", async () => {
    const remote = await render({ src: "https://example.com/a.png", alt: "A", ratio: "16by9" });
    expect(remote).toContain('<img src="https://example.com/a.png" alt="A" loading="lazy">');
    expect(remote).not.toContain("/_image");

    const data = await render({ src: "data:image/png;base64,AAAA", alt: "B" });
    expect(data).toContain('<img src="data:image/png;base64,AAAA" alt="B" loading="lazy">');
  });

  it("puts style on the figure and imgStyle on the img", async () => {
    const html = await render({ src: "/a.png", alt: "", style: "margin: 0", imgStyle: "object-fit: cover" });
    expect(html).toContain('<figure class="image" style="margin: 0">');
    expect(html).toContain('style="object-fit: cover"');
  });

  it("optimizes imported images with Astro", async () => {
    const imported = { src: "/@fs/project/src/assets/photo.png", width: 640, height: 480, format: "png" };
    const html = await render({ src: imported, alt: "Photo", ratio: "4by3" });
    expect(html).toContain('width="640"');
    expect(html).toContain('height="480"');
    expect(html).toContain("/_image");
  });
});
