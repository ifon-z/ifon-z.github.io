# Image credits

All photographs in `public/projects/` come from [Unsplash](https://unsplash.com) and are used
under the [Unsplash License](https://unsplash.com/license), which permits commercial and
non-commercial use without requiring attribution. Attribution is not required — it is provided
here because it costs nothing and credits the photographers.

Each source image was downloaded once and converted to two committed WebP widths
(800w and 1600w) so the site never depends on a third-party CDN at runtime.

| File | Unsplash photo | Used for |
| --- | --- | --- |
| `latent-{800,1600}.webp` | [photo-1550751827-4bd374c3f58b](https://unsplash.com/photos/1550751827-4bd374c3f58b) | AI Workflow card |
| `pipeline-{800,1600}.webp` | [photo-1518186285589-2f7649de83e0](https://unsplash.com/photos/1518186285589-2f7649de83e0) | Data Platform card |
| `metric-{800,1600}.webp` | [photo-1551288049-bebda4e38f71](https://unsplash.com/photos/1551288049-bebda4e38f71) | Web Experience card |
| `signal-{800,1600}.webp` | [photo-1451187580459-43490279c0fa](https://unsplash.com/photos/1451187580459-43490279c0fa) | "Worldwide" full-bleed band |

## Fonts

Self-hosted via the `@fontsource` packages (SIL Open Font License 1.1), imported from
`src/main.tsx` rather than a third-party CSS `@import`:

- **Manrope** — variable weight 200–800, Latin subsets (`@fontsource-variable/manrope`)
- **Playfair Display** — 600 italic, Latin subset (`@fontsource/playfair-display`)

Chinese text intentionally falls back to the system stack (PingFang SC / Noto Sans SC /
Microsoft YaHei): a subsetted CJK webfont would outweigh the rest of the page.
