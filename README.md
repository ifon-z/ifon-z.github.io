# IF — Personal Portfolio

A minimal personal portfolio for a junior software engineer focused on AI full-stack development and data engineering.

The site is built with React and TypeScript, with a lightweight visual system and responsive layouts for desktop and mobile screens.

## Tech stack

- React
- TypeScript
- Vite
- CSS
- pnpm

## Getting started

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

## Project structure

```text
src/
├── config/
│   └── i18n.tsx       # Translation configuration
├── App.tsx            # Page layout and language state
├── main.tsx           # Application entry point
└── styles.css         # Global styles and responsive layout
```

## Internationalization

The current languages are Chinese (`zh`) and English (`en`). All localized copy is stored in [`src/config/i18n.tsx`](src/config/i18n.tsx).

To add another language:

1. Add the language code to the `Language` type.
2. Add a matching translation object to `translations`.
3. Add the language to the language switcher if needed.

The page content and project metadata are kept in the same configuration, so the UI component does not need to be rewritten when copy changes.

## GitHub Pages deployment

The repository includes a GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Every push to `main` will:

1. Install dependencies with pnpm.
2. Build the application with Vite.
3. Upload the `dist` directory as a Pages artifact.
4. Deploy the artifact to GitHub Pages.

In the repository settings, set **Settings → Pages → Source** to **GitHub Actions**.

The Vite configuration uses a relative base path so the site works both at a project URL and at a user site URL.

## License

This project is intended as a personal portfolio starter. Feel free to adapt the structure and styling for your own site.
