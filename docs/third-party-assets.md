# Third-party assets

## Dawn theme

| Field         | Value                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| Source        | https://github.com/Shopify/dawn                                                     |
| Tag           | `v16.0.0` (Dawn 16.0.0, released 2026-08-10)                                        |
| Commit        | `bc39a7d2024f1e5c14c42f855bd3552b4913e204`                                          |
| Imported      | 2026-10-15, without Dawn's git history                                              |
| Imported path | `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` |
| License       | Shopify theme license, kept verbatim in [`LICENSE.md`](../LICENSE.md)               |
| Copyright     | Copyright (c) 2021-present Shopify Inc.                                             |

The Dawn license is an MIT-style grant limited to developing themes that integrate or interoperate with Shopify software or services. Dawn-derived files, including modified ones, remain under `LICENSE.md`; own work outside those files is under [`LICENSE`](../LICENSE).

Not imported: Dawn's `README.md`, `release-notes.md`, `.github/`, `.gitignore`. Dawn's `.prettierrc.json` and `.theme-check.yml` were used as the starting point for this repository's own configuration.

### Changed Dawn files

| File                   | Change                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `layout/theme.liquid`  | Head scripts, resource hints and global stylesheets added; `font_display: 'swap'` removed from the five `font_face` calls |
| `templates/index.json` | Hero carousel and promo video sections added; the image banner section removed                                            |

## jQuery

| Field     | Value                                                                              |
| --------- | ---------------------------------------------------------------------------------- |
| Source    | https://code.jquery.com/jquery-3.7.1.min.js                                        |
| Version   | 3.7.1                                                                              |
| SHA-256   | `fc9a93dd241f6b045cbff0481cf4e1901becd0e12fb45166a8f17f95823f0b1a`                 |
| License   | MIT, https://jquery.org/license/                                                   |
| Copyright | OpenJS Foundation and other contributors                                           |
| Added     | 2026-10-21, as `assets/jquery-3.7.1.min.js`, unmodified; used by the hero carousel |

## Video

| Field    | Value                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------- |
| Source   | https://www.pexels.com/uk-ua/video/39708564/                                                      |
| Author   | Ekam Juneja                                                                                       |
| License  | Pexels License, https://www.pexels.com/license/ (checked 2026-10-21; attribution is not required) |
| Original | `16929689_1920_1080_30fps.mp4`, 1920×1080, 10 s, H.264                                            |
| Used as  | `assets/hero-video.mp4`, unmodified                                                               |
| Poster   | `assets/hero-poster.jpg`, a still frame of the same video at 4 s                                  |

## npm packages

Development tooling only; nothing is bundled into the theme. See [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md).
