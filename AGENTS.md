# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

An Astro component library (`astro-bulma`) that wraps the [Bulma 1.0](https://bulma.io/) CSS framework. It exports typed, zero-client-JS Astro components (except where interactivity is required). Users install it and import components from `astro-bulma`.

## Commands

```bash
pnpm dev              # Local dev server
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm check            # TypeScript type checking via astro check
pnpm lint             # Oxlint on src/ (--deny-warnings)
pnpm fmt              # Auto-fix lint + prettier format
pnpm test             # Run Vitest (vitest run)
pnpm test:watch       # Vitest in watch mode
pnpm test:coverage    # Vitest with coverage report
```

## Architecture

**Source layout:**
- `src/elements/` — Basic UI elements: `Box`, `Button`, `Icon`, `Image`, `Notification`, `Table`, `Tag`
- `src/forms/` — Form components: `TextInput`, `Select`, `Checkbox`, `FileInput`
- `src/components/` — Complex components: `Modal`, `Card`, `Message`, `Breadcrumb`, `Tabs`
- `src/index.ts` — Single entry point; re-exports every component

Components import each other via relative paths (no aliases). There are no path aliases in this project.

## Component patterns

**Class list building** — every component builds its class string as a filtered array:
```astro
const classes = ["box", size && `is-${size}`, className].filter(Boolean).join(" ");
```

**Slot detection** — use `Astro.slots.has("name")` to conditionally render wrapper elements:
```astro
const hasFooter = Astro.slots.has("footer");
{hasFooter && <footer class="card-footer"><slot name="footer" /></footer>}
```

**Discriminated union props** — `Button.astro` renders as `<a>` or `<button>` based on `href`. Use `type?: never` / `href?: never` to make the union exclusive.

**`standalone` prop** — form components (`TextInput`, `Select`) accept a `standalone` boolean. When `true`, they render only the raw input element (no field/label/control wrapper), for use inside custom `has-addons` or grouped layouts managed by the parent.

**Client-side interactivity** — components that need JS (`Modal`, `Tabs`, `FileInput`) use `document.addEventListener("astro:page-load", ...)` inside a `<script>` tag so the handler re-runs after Astro's `<ClientRouter>` navigations.

**Attribute splitting** — `Checkbox` separates `data-*`/`aria-*` attrs onto the `<label>` and the remaining attrs onto the `<input>` via a manual loop. Follow this pattern when a component wraps two elements that both need attributes.

## Adding a new component

1. Create the `.astro` file in the appropriate subdirectory (`elements/`, `forms/`, or `components/`).
2. Define a TypeScript `interface Props` (or `type Props`) at the top of the frontmatter.
3. Export it from `src/index.ts`.
4. Add tests in `tests/`.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `feat(button): add outlined prop`, `fix(select): handle multiple mode`, etc.
