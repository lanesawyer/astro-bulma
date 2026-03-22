<!-- omit in toc -->
# Contributing to astro-bulma

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution.

<!-- omit in toc -->
## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)


## Code of Conduct

This project and everyone participating in it is governed by the
[astro-bulma Code of Conduct](./CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <github@lanesawyer.dev>.


## I Have a Question

Before you ask a question, it is best to search for existing [Issues](https://github.com/lanesawyer/astro-bulma/issues) that might help you. If you have found a suitable issue and still need clarification, you can write your question there.

If you still need to ask a question:

- Open an [Issue](https://github.com/lanesawyer/astro-bulma/issues/new).
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (Node.js, pnpm, Astro version, etc).

## I Want To Contribute

> ### Legal Notice <!-- omit in toc -->
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project license.

### Reporting Bugs

<!-- omit in toc -->
#### Before Submitting a Bug Report

- Make sure you are using the latest version.
- Confirm the bug is reproducible and not caused by your own environment.
- Search the [issue tracker](https://github.com/lanesawyer/astro-bulma/issues?q=label%3Abug) to see if it's already reported.
- Collect information about the bug:
  - Stack trace / error message
  - OS, platform, and versions (Node.js, pnpm, Astro, browser)
  - Minimal reproduction steps

<!-- omit in toc -->
#### How Do I Submit a Good Bug Report?

> Never report security vulnerabilities publicly. Send sensitive bugs by email to <github@lanesawyer.dev>.

- Open an [Issue](https://github.com/lanesawyer/astro-bulma/issues/new) using the Bug Report template.
- Describe the expected behavior vs. what actually happened.
- Include reproduction steps and a minimal code example if possible.


### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/lanesawyer/astro-bulma/issues).

Before submitting:

- Check you're on the latest version.
- Search [existing issues](https://github.com/lanesawyer/astro-bulma/issues) to avoid duplicates.
- Consider whether your idea fits the scope of the library — wrapping Bulma components for Astro.

When submitting, use the [Feature Request issue template](https://github.com/lanesawyer/astro-bulma/issues/new?template=feature_request.md) and include:

- A clear and descriptive title
- The current behavior and what you'd like instead
- Why this would be useful to other users of the library


### Your First Code Contribution

To get the project running locally:

1. **Install prerequisites**: [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/)
2. **Clone the repo** and install dependencies:
   ```bash
   git clone https://github.com/lanesawyer/astro-bulma.git
   cd astro-bulma
   pnpm install
   ```
3. **Start the dev server** to browse components:
   ```bash
   pnpm dev
   ```
4. **Run the tests**:
   ```bash
   pnpm test
   ```

From there, pick an issue tagged `good first issue` on the [issue tracker](https://github.com/lanesawyer/astro-bulma/issues), create a branch, and open a pull request when ready for review.

### Improving The Documentation

Documentation improvements are a great contribution — especially if you're new to the codebase. If you notice something outdated, unclear, or missing, please open a PR. Typo fixes and small clarifications are welcome.

## Styleguides

### Commit Messages

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <short description>
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`. For example: `feat(button): add outlined prop`.

## Join The Project Team

Regular contributors who consistently submit quality PRs and engage constructively will be invited to take on a larger role. The best way to get involved is to keep contributing.

<!-- omit in toc -->
## Attribution
This guide is based on **contributing-gen**. [Make your own](https://github.com/bttger/contributing-gen)!
