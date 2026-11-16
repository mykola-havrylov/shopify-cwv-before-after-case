# Third-party notices

The theme ships no npm code and, on `main`, no vendored library; jQuery, which the `baseline` branch vendors, is listed in [`docs/third-party-assets.md`](docs/third-party-assets.md). The packages below are development dependencies used for formatting, linting, Lighthouse measurements and the interaction diagnostic; they are installed locally and in CI from `package-lock.json` and are not distributed with the theme.

## Direct dependencies

| Package                           | Version | License    | Source                                          |
| --------------------------------- | ------- | ---------- | ----------------------------------------------- |
| `lighthouse`                      | 13.5.0  | Apache-2.0 | https://github.com/GoogleChrome/lighthouse      |
| `chrome-launcher`                 | 1.2.2   | Apache-2.0 | https://github.com/GoogleChrome/chrome-launcher |
| `puppeteer-core`                  | 25.14.0 | Apache-2.0 | https://github.com/puppeteer/puppeteer          |
| `prettier`                        | 3.9.10  | MIT        | https://github.com/prettier/prettier            |
| `@shopify/prettier-plugin-liquid` | 1.11.2  | MIT        | https://github.com/Shopify/theme-tools          |
| `eslint`                          | 10.12.0 | MIT        | https://github.com/eslint/eslint                |
| `@eslint/js`                      | 10.0.1  | MIT        | https://github.com/eslint/eslint                |
| `globals`                         | 17.13.0 | MIT        | https://github.com/sindresorhus/globals         |

Versions are pinned exactly in `package.json`.

## Transitive dependencies

`package-lock.json` resolves 198 packages in total (direct and transitive). Licenses as declared in the lockfile on 2026-10-15:

| License        | Packages |
| -------------- | -------: |
| MIT            |      136 |
| Apache-2.0     |       33 |
| ISC            |       11 |
| BSD-3-Clause   |        7 |
| BSD-2-Clause   |        7 |
| MPL-2.0        |        1 |
| BlueOak-1.0.0  |        1 |
| 0BSD           |        1 |
| MIT OR CC0-1.0 |        1 |

MPL-2.0 applies to `axe-core` (a Lighthouse dependency), used unmodified.

## Other tools

- Shopify CLI (`shopify theme check`) runs through `npx` at a pinned version in CI, not through `package.json`.
- GitHub Actions: `actions/checkout`, `actions/setup-node`, `shopify/lighthouse-ci-action` (MIT, https://github.com/Shopify/lighthouse-ci-action), pinned to the commit of v1.4.0.
