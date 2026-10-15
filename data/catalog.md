# Demo catalog

Fernpeak Outfitters is a fictional outdoor-gear store. Products, prices and descriptions are invented for this case; any resemblance to a real brand is unintended.

The catalog is created only by `npm run catalog:seed` from the files in `data/`; nothing is entered by hand in the Shopify admin.

| Source                     | Content                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `data/products.csv`        | Products and variants, Shopify product CSV layout                                       |
| `scripts/src/catalog.js`   | Automated collections and menus                                                         |
| `data/images/prompts.json` | One image per variant and the carousel slides (`brief.md` is the same data for reading) |

## Products

14 products, 30 variants. Variants differ only by colour, so every variant has its own image; products with a single variant use `Title: Default Title`.

| Collection   | Product                 | Colours           | Price |
| ------------ | ----------------------- | ----------------- | ----: |
| Backpacks    | Ridge 22 Daypack        | Slate, Moss, Rust |    89 |
| Backpacks    | Trailhead 38 Pack       | Slate, Rust       |   149 |
| Backpacks    | Summit 60 Pack          | Slate, Moss       |   229 |
| Backpacks    | Scramble Hip Pack       | Slate, Rust, Sand |    39 |
| Tents        | Larch 1P Tent           | Sand, Olive       |   279 |
| Tents        | Larch 2P Tent           | Sand, Olive       |   349 |
| Tents        | Ultralight Tarp 3x3     | Olive, Sand       |   119 |
| Sleep        | Alpine Down Bag -5°C    | Navy, Rust        |   259 |
| Sleep        | Valley Synthetic Bag    | Moss, Navy        |   129 |
| Sleep        | Air Sleeping Pad        | Rust, Slate       |    99 |
| Camp kitchen | Titanium Pot 750 ml     | single variant    |    45 |
| Camp kitchen | Compact Canister Stove  | single variant    |    59 |
| Camp kitchen | Insulated Bottle 750 ml | Slate, Moss, Sand |    35 |
| Camp kitchen | Enamel Camp Mug         | Sand, Moss, Rust  |    18 |

Inventory is not tracked, so every variant stays available for sale and no measurement runs into a "Sold out" state.

## Collections

Automated, one condition each: product type equals the value below.

| Handle         | Title        | Product type |
| -------------- | ------------ | ------------ |
| `backpacks`    | Backpacks    | Backpack     |
| `tents`        | Tents        | Shelter      |
| `sleep`        | Sleep        | Sleep        |
| `camp-kitchen` | Camp kitchen | Camp kitchen |

## Menus

| Menu        | Items                                                                                  |
| ----------- | -------------------------------------------------------------------------------------- |
| `main-menu` | Backpacks, Tents, Sleep, Camp kitchen (collections), All products (`/collections/all`) |
| `footer`    | Search (`/search`), All products (`/collections/all`)                                  |

Both handles exist in a new store; the seed updates them in place.

## Images

Product images and carousel slides are AI-generated from `data/images/prompts.json`.

Art direction:

- Products: seamless light warm grey studio background (#EDEBE7), soft daylight from the left, soft shadow to the right, three-quarter view, one object centered. Colour variants are edits of the first variant's image, so only the colour changes.
- Carousel: three landscape scenes without people (ridge camp at sunrise, forest trail, lake camp at dusk), desktop 16:9 with the left third free for text, mobile 4:5 with the top third free.
- No text, logos or brand marks on any image.

Sizes are deliberately large originals, because heavy images are part of the unoptimised state; the optimised theme serves the same files through `image_url`.

| Kind           | Size (px) | Weight           |
| -------------- | --------- | ---------------- |
| Product        | 3000x3750 | 800 KB to 2 MB   |
| Slide, desktop | 3840x2160 | 800 KB to 2 MB   |
| Slide, mobile  | 1800x2250 | 500 KB to 1.5 MB |
