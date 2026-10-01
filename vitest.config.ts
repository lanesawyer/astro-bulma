/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.astro', 'src/**/*.ts'],
      reporter: ['text', 'html'],
    },
  },
}, {
  // Keeps dev-only data-astro-source-* attributes out of rendered test HTML.
  devToolbar: { enabled: false },
});
