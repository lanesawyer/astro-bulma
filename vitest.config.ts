/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
});
