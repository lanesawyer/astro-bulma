---
name: add-bulma-component
description: Add a new component to astro-bulma or update an existing one — Bulma wrappers and larger composite components alike. Use when creating, extending, or refactoring an astro-bulma component.
---

# Add or update a Bulma component

This library wraps [Bulma 1.0](https://bulma.io/) as typed, zero-client-JS Astro
components. Some components map 1:1 to a Bulma element; others are larger
composite components that have no native Bulma equivalent. This skill covers
both.

## Before you start

- For a Bulma-native component, read the relevant Bulma docs page first
  (`https://bulma.io/documentation/...`) so the props mirror the real modifier
  classes (`is-*`, `has-*`).
- For a composite/non-native component, look at existing complex components in
  `src/components/` (e.g. `Card.astro`, `Modal.astro`) for slot and structure
  conventions.
- Open a similar existing component and match its style. Consistency with the
  codebase beats inventing a new pattern.

## Where it goes

Pick the directory by kind:

- `src/elements/` — basic UI elements (`Box`, `Button`, `Icon`, `Tag`, …)
- `src/forms/` — form controls (`TextInput`, `Select`, `Checkbox`, `FileInput`)
- `src/components/` — complex / composite components (`Modal`, `Card`, `Tabs`, …)
- `src/layouts/` — page-level layout wrappers

## Steps

1. **Create `src/<dir>/<Name>.astro`.**
   - Define a TypeScript `interface Props` (or `type Props`) at the top of the
     frontmatter. Rename `class` to `className` on destructure, and spread the
     rest onto the root element:
     ```astro
     ---
     type Props = {
       size?: "small" | "medium" | "large";
       class?: string;
       [key: string]: unknown;
     };
     const { size, class: className, ...rest } = Astro.props;
     const classes = ["box", size && `is-${size}`, className]
       .filter(Boolean)
       .join(" ");
     ---
     <div class={classes} {...rest}><slot /></div>
     ```
   - Build the class string as a filtered array joined with spaces (see above).
   - Use `Astro.slots.has("name")` to conditionally render wrapper elements for
     optional named slots.
   - For elements that can render as different tags (e.g. `<a>` vs `<button>`),
     use a discriminated union with `type?: never` / `href?: never` to keep the
     props exclusive.
   - Form components should support a `standalone` boolean that renders only the
     raw input (no field/label/control wrapper) for use in `has-addons` /
     grouped layouts.

2. **Client-side interactivity (only if required).** Keep components zero-JS by
   default. When JS is unavoidable, put it in a `<script>` and register inside
   `document.addEventListener("astro:page-load", ...)` so it re-runs after
   `<ClientRouter>` navigations.

3. **Export it** from `src/index.ts` under the matching section comment,
   alphabetically within that section:
   ```ts
   export { default as Name } from './<dir>/Name.astro';
   ```

4. **Document it.** Add `docs/src/content/docs/<dir>/<name>.mdx` following the
   existing pages (frontmatter `title`/`description`, import `Preview`, then
   `<Preview>` blocks paired with fenced `astro` code samples). For
   Bulma-native components, link to the matching Bulma docs page in the intro.

5. **Verify.**
   ```bash
   pnpm check   # astro type check
   pnpm lint    # oxlint --deny-warnings
   pnpm fmt     # auto-fix + prettier
   ```
   If tests exist for the component area, run `pnpm test`.

## Updating an existing component

- Add new props additively; don't break the existing prop shape without reason.
- Keep the class-list array pattern — append new `cond && \`is-${x}\`` entries
  rather than restructuring.
- Update the component's `.mdx` doc page to cover the new prop/behavior.
- Re-run the verify commands above.

## Commit

Conventional Commits, scoped to the component:
`feat(tabs): add vertical orientation`, `fix(select): handle multiple mode`.
