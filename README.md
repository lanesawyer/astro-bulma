# astro-bulma

Astro component library wrapping [Bulma CSS](https://bulma.io). Drop-in components for elements, forms, and common UI patterns — fully typed, zero client-side JS (except where Bulma requires it).

## Installation

```bash
pnpm add astro-bulma bulma
```

Bulma's CSS is a peer dependency — import it in your layout however you prefer:

```ts
import 'bulma/css/bulma.min.css';
```

## Usage

```astro
---
import { Button, Box, TextInput, Modal } from 'astro-bulma';
---

<Box>
  <TextInput name="email" label="Email" type="email" iconLeft="fa-envelope" />
  <Button color="primary" type="submit">Send</Button>
</Box>
```

## Components

### Elements

#### `Box`
Wraps Bulma's `.box`. Accepts `class`, `id`, and any HTML div attributes.

```astro
<Box class="mb-5">Content</Box>
```

#### `Button`
Renders as `<button>` or `<a>` depending on whether `href` is set. Props:

| Prop | Type | Default |
|------|------|---------|
| `href` | `string` | — |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` |
| `color` | `"primary" \| "danger" \| "warning" \| "info" \| "success" \| "link" \| "light" \| "white"` | — |
| `size` | `"small" \| "large"` | — |
| `fullwidth` | `boolean` | — |
| `outlined` | `boolean` | — |
| `light` | `boolean` | — |
| `disabled` | `boolean` | — |
| `form` | `string` | — |

```astro
<Button color="primary" type="submit">Save</Button>
<Button href="/dashboard" color="link">Dashboard</Button>
```

#### `Icon`
Wraps Font Awesome icons in Bulma's `.icon` span. Props:

| Prop | Type | Default |
|------|------|---------|
| `icon` | `string` | required |
| `variant` | `"fas" \| "far" \| "fab" \| "fal" \| "fad"` | `"fas"` |
| `size` | `"small" \| "medium" \| "large"` | — |
| `color` | `string` | — |
| `position` | `"left" \| "right"` | — |

```astro
<Icon icon="fa-check" color="success" />
<Icon icon="fa-github" variant="fab" size="large" />
```

#### `Tag`

| Prop | Type |
|------|------|
| `color` | Bulma color |
| `size` | `"small" \| "normal" \| "medium" \| "large"` |
| `light` | `boolean` |
| `rounded` | `boolean` |
| `isDelete` | `boolean` |

```astro
<Tag color="primary">Active</Tag>
<Tag color="danger" light rounded>Error</Tag>
```

#### `Notification`

| Prop | Type |
|------|------|
| `color` | `"link" \| "primary" \| "info" \| "success" \| "warning" \| "danger"` |
| `light` | `boolean` |
| `dismissible` | `boolean` |

```astro
<Notification color="success" light dismissible>Saved!</Notification>
```

#### `Image`
Wraps Bulma's `.image` figure element. Uses Astro's `<Image>` for real URLs, falls back to plain `<img>` for data URIs. Props: `src`, `alt`, `size` (e.g. `"96x96"`), `ratio`, `rounded`, `fullwidth`, `class`, `style`, `imgStyle`.

#### `Table`
Wraps Bulma's `.table`. Accepts `striped`, `bordered`, `hoverable`, `fullwidth`, `narrow`, `scrollable` boolean props.

---

### Forms

All form components handle Bulma's `field` / `label` / `control` wrapper automatically. Use the `standalone` prop when you're managing the outer layout yourself (e.g. inside a `has-addons` group).

#### `TextInput`

| Prop | Type | Default |
|------|------|---------|
| `name` | `string` | required |
| `label` | `string` | — |
| `type` | `"text" \| "email" \| "password" \| "tel" \| "url" \| "number" \| "search" \| "date" \| "time"` | `"text"` |
| `color` | Bulma color | — |
| `size` | `"small" \| "normal" \| "medium" \| "large"` | — |
| `rounded` | `boolean` | — |
| `iconLeft` / `iconRight` | `string` (FA icon name) | — |
| `help` | `string` | — |
| `helpColor` | Bulma color | — |
| `standalone` | `boolean` | — |
| `controlClass` | `string` | — |
| native attrs | `min`, `max`, `pattern`, `autofocus`, etc. | — |

```astro
<TextInput name="email" label="Email" type="email" iconLeft="fa-envelope" required />
<TextInput name="search" placeholder="Search..." iconLeft="fa-search" standalone />
```

#### `Select`

| Prop | Type |
|------|------|
| `name` | `string` (required) |
| `label` | `string` |
| `color` | Bulma color |
| `size` | `"small" \| "normal" \| "medium" \| "large"` |
| `fullwidth` | `boolean` |
| `rounded` | `boolean` |
| `loading` | `boolean` |
| `multiple` | `boolean` |
| `iconLeft` | `string` (FA icon name) |
| `standalone` | `boolean` |

```astro
<Select name="role" label="Role" iconLeft="fa-user">
  <option value="member">Member</option>
  <option value="admin">Admin</option>
</Select>
```

#### `Checkbox`

| Prop | Type |
|------|------|
| `name` | `string` (required) |
| `label` | `string` |
| `checked` | `boolean` |
| `disabled` | `boolean` |
| `required` | `boolean` |

```astro
<Checkbox name="agree" label="I agree to the terms" required />

<!-- Rich label content via slot -->
<Checkbox name="agree">I agree to the <a href="/terms">terms</a></Checkbox>
```

#### `FileInput`
Wraps Bulma's file upload element.

---

### Components

#### `Modal`
Card-style modal with header, body, and footer slots. Toggled by adding/removing `.is-active` on the wrapper. Close buttons use `data-modal-close`.

| Prop | Type |
|------|------|
| `id` | `string` (required) |
| `title` | `string` (required) |

```astro
<Modal id="confirm-modal" title="Are you sure?">
  <p>This action cannot be undone.</p>
  <div slot="footer">
    <Button color="danger" type="submit" form="delete-form">Delete</Button>
    <Button data-modal-close>Cancel</Button>
  </div>
</Modal>

<!-- Open it from anywhere -->
<Button onclick="document.getElementById('confirm-modal').classList.add('is-active')">
  Delete
</Button>
```

#### `Card`
Slots: `header`, `image`, `default` (content), `footer`. The `header`, `image`, and `footer` slots are only rendered when provided.

```astro
<Card>
  <span slot="header">Card Title</span>
  <p>Card body content.</p>
  <a slot="footer" class="card-footer-item">Action</a>
</Card>
```

#### `Breadcrumb`
Renders a `<nav class="breadcrumb">`. Pass items via the default slot.

#### `Message`
Bulma message box with optional header slot.

#### `Tabs`
Bulma tabs wrapper. Pass `<li>` items via the default slot.

---

## Licensing

This project is dual-licensed:

- **GPL-3.0-only** — applies when you fork or redistribute the source. Derivative works must remain open source under the same terms.
- **MIT** — applies when you use these components in your own project. You can build proprietary applications with astro-bulma without any copyleft obligations.

In short: **use it freely, fork it openly.**

The full GPL-3.0 text is in [`LICENSE`](./LICENSE). The MIT grant is in [`LICENSE-MIT`](./LICENSE-MIT).
