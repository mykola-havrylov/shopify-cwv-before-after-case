# Image brief

36 images: one per variant (30) plus 6 hero carousel slides (three scenes, desktop and mobile). `prompts.json` holds the same data and is the source of truth.

## Output

These are deliberately large originals: heavy images are part of the unoptimised state of the theme.

| Kind           | Size (px) | Ratio | Weight           |
| -------------- | --------- | ----- | ---------------- |
| Product        | 3000x3750 | 4:5   | 800 KB to 2 MB   |
| Slide, desktop | 3840x2160 | 16:9  | 800 KB to 2 MB   |
| Slide, mobile  | 1800x2250 | 4:5   | 500 KB to 1.5 MB |

- JPEG, file name exactly as given in each heading, saved to `data/images/`.
- Never stretch: resize and centre-crop to the exact size, with the object fully inside the frame.
- No text, letters, numbers, logos, brand marks or watermarks on any image. Product names, descriptions and alt texts below are reference only.

## Product images

- Background: seamless light warm grey studio background (#EDEBE7), no visible horizon; the object rests on the same surface.
- Light: soft natural daylight from the left, a gentle soft shadow falling to the right.
- Framing: portrait 4:5 (3000x3750 px), one object centered, three-quarter view, whole object inside the frame.
- Mood: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, slightly muted colour.
- Always: no text, logos, labels, hands, people, props, plants or other objects.

### Colours

| Colour | Look                    |
| ------ | ----------------------- |
| Slate  | a muted slate grey-blue |
| Moss   | a muted moss green      |
| Rust   | a burnt rust orange     |
| Sand   | a warm sand beige       |
| Olive  | a muted olive green     |
| Navy   | a deep navy blue        |

### Keeping variants consistent

Generate the first variant of a product from its full prompt. For the other variants, apply the edit prompt to the first image (`base_file`) so shape, angle, framing, scale, light and background stay identical and only the colour changes. If editing is not possible, use the full prompt and compare the results side by side.

## Slides

Landscape scenes without people. Desktop slides keep the left third calm for text; mobile slides keep the top third calm. The desktop and mobile versions of a slide show the same scene.

## Images

### Ridge 22 Daypack, Color: Slate (`ridge-22-daypack-slate.jpg`)

- Size: 3000x3750
- SKU: FP-RD22-SLA
- Alt text: Slate daypack

Prompt:

> Product photo of one 22-litre hiking daypack standing upright, front panel turned three-quarter to the left, zipped top lid, two mesh side bottle pockets, padded shoulder straps visible at the sides. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a muted slate grey-blue ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 22-litre daypack for day hikes and commutes: zipped top lid, two mesh bottle pockets and padded shoulder straps. Ripstop nylon, 650 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Ridge 22 Daypack, Color: Moss (`ridge-22-daypack-moss.jpg`)

- Size: 3000x3750
- SKU: FP-RD22-MOS
- Alt text: Moss daypack
- Base image: `ridge-22-daypack-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one 22-litre hiking daypack standing upright, front panel turned three-quarter to the left, zipped top lid, two mesh side bottle pockets, padded shoulder straps visible at the sides. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a muted moss green ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 22-litre daypack for day hikes and commutes: zipped top lid, two mesh bottle pockets and padded shoulder straps. Ripstop nylon, 650 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a muted moss green ripstop nylon fabric with matching webbing. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Ridge 22 Daypack, Color: Rust (`ridge-22-daypack-rust.jpg`)

- Size: 3000x3750
- SKU: FP-RD22-RUS
- Alt text: Rust daypack
- Base image: `ridge-22-daypack-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one 22-litre hiking daypack standing upright, front panel turned three-quarter to the left, zipped top lid, two mesh side bottle pockets, padded shoulder straps visible at the sides. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a burnt rust orange ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 22-litre daypack for day hikes and commutes: zipped top lid, two mesh bottle pockets and padded shoulder straps. Ripstop nylon, 650 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a burnt rust orange ripstop nylon fabric with matching webbing. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Trailhead 38 Pack, Color: Slate (`trailhead-38-pack-slate.jpg`)

- Size: 3000x3750
- SKU: FP-TH38-SLA
- Alt text: Slate trekking backpack

Prompt:

> Product photo of one 38-litre trekking backpack standing upright, front turned three-quarter to the left, roll-top closure, front stretch pocket, side compression straps, padded hip belt with small pockets. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a muted slate grey-blue ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 38-litre roll-top pack for overnight and weekend trips, with a stretch front pocket, side compression straps and a padded hip belt. 1.15 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Trailhead 38 Pack, Color: Rust (`trailhead-38-pack-rust.jpg`)

- Size: 3000x3750
- SKU: FP-TH38-RUS
- Alt text: Rust trekking backpack
- Base image: `trailhead-38-pack-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one 38-litre trekking backpack standing upright, front turned three-quarter to the left, roll-top closure, front stretch pocket, side compression straps, padded hip belt with small pockets. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a burnt rust orange ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 38-litre roll-top pack for overnight and weekend trips, with a stretch front pocket, side compression straps and a padded hip belt. 1.15 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a burnt rust orange ripstop nylon fabric with matching webbing. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Summit 60 Pack, Color: Slate (`summit-60-pack-slate.jpg`)

- Size: 3000x3750
- SKU: FP-SM60-SLA
- Alt text: Slate expedition backpack

Prompt:

> Product photo of one 60-litre expedition backpack standing upright, front turned three-quarter to the left, floating top lid, ice-axe loop, side compression straps, wide padded hip belt. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 65% of the frame height, the whole object inside the frame with even margins. Colour: a muted slate grey-blue heavy ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 60-litre expedition pack with a floating lid, ice-axe loop and a load-bearing hip belt for long trips with heavy loads. 1.65 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Summit 60 Pack, Color: Moss (`summit-60-pack-moss.jpg`)

- Size: 3000x3750
- SKU: FP-SM60-MOS
- Alt text: Moss expedition backpack
- Base image: `summit-60-pack-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one 60-litre expedition backpack standing upright, front turned three-quarter to the left, floating top lid, ice-axe loop, side compression straps, wide padded hip belt. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 65% of the frame height, the whole object inside the frame with even margins. Colour: a muted moss green heavy ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 60-litre expedition pack with a floating lid, ice-axe loop and a load-bearing hip belt for long trips with heavy loads. 1.65 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a muted moss green heavy ripstop nylon fabric with matching webbing. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Scramble Hip Pack, Color: Slate (`scramble-hip-pack-slate.jpg`)

- Size: 3000x3750
- SKU: FP-SHP-SLA
- Alt text: Slate hip pack

Prompt:

> Product photo of one small hip pack lying flat, three-quarter view from slightly above, curved zip front pocket, its waist strap loosely coiled behind it. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 50% of the frame width, the whole object inside the frame with even margins. Colour: a muted slate grey-blue ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A small hip pack for phone, keys and snacks on short hikes and runs, with a curved zip pocket and an adjustable waist strap. 220 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Scramble Hip Pack, Color: Rust (`scramble-hip-pack-rust.jpg`)

- Size: 3000x3750
- SKU: FP-SHP-RUS
- Alt text: Rust hip pack
- Base image: `scramble-hip-pack-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one small hip pack lying flat, three-quarter view from slightly above, curved zip front pocket, its waist strap loosely coiled behind it. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 50% of the frame width, the whole object inside the frame with even margins. Colour: a burnt rust orange ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A small hip pack for phone, keys and snacks on short hikes and runs, with a curved zip pocket and an adjustable waist strap. 220 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a burnt rust orange ripstop nylon fabric with matching webbing. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Scramble Hip Pack, Color: Sand (`scramble-hip-pack-sand.jpg`)

- Size: 3000x3750
- SKU: FP-SHP-SAN
- Alt text: Sand hip pack
- Base image: `scramble-hip-pack-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one small hip pack lying flat, three-quarter view from slightly above, curved zip front pocket, its waist strap loosely coiled behind it. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 50% of the frame width, the whole object inside the frame with even margins. Colour: a warm sand beige ripstop nylon fabric with matching webbing. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A small hip pack for phone, keys and snacks on short hikes and runs, with a curved zip pocket and an adjustable waist strap. 220 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a warm sand beige ripstop nylon fabric with matching webbing. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Larch 1P Tent, Color: Sand (`larch-1p-tent-sand.jpg`)

- Size: 3000x3750
- SKU: FP-L1P-SAN
- Alt text: Sand one-person tent

Prompt:

> Product photo of one pitched one-person backpacking tent with a single hoop pole and a low profile, rainfly fully on, door zipped closed, guy lines staked into the same seamless surface, three-quarter front view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 70% of the frame width, the whole object inside the frame with even margins. Colour: a warm sand beige silicone-coated ripstop rainfly. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A one-person backpacking tent with a single-hoop frame, full rainfly and one door. Packs small for solo trips. 1.3 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Larch 1P Tent, Color: Olive (`larch-1p-tent-olive.jpg`)

- Size: 3000x3750
- SKU: FP-L1P-OLI
- Alt text: Olive one-person tent
- Base image: `larch-1p-tent-sand.jpg` (use the edit prompt)

Prompt:

> Product photo of one pitched one-person backpacking tent with a single hoop pole and a low profile, rainfly fully on, door zipped closed, guy lines staked into the same seamless surface, three-quarter front view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 70% of the frame width, the whole object inside the frame with even margins. Colour: a muted olive green silicone-coated ripstop rainfly. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A one-person backpacking tent with a single-hoop frame, full rainfly and one door. Packs small for solo trips. 1.3 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a muted olive green silicone-coated ripstop rainfly. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Larch 2P Tent, Color: Sand (`larch-2p-tent-sand.jpg`)

- Size: 3000x3750
- SKU: FP-L2P-SAN
- Alt text: Sand two-person dome tent

Prompt:

> Product photo of one pitched two-person freestanding dome tent with two crossing poles, rainfly fully on, one vestibule door rolled half open showing a dark interior, three-quarter front view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 75% of the frame width, the whole object inside the frame with even margins. Colour: a warm sand beige silicone-coated ripstop rainfly. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A freestanding two-person dome tent with crossing poles, two doors and two vestibules for packs and boots. 1.9 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Larch 2P Tent, Color: Olive (`larch-2p-tent-olive.jpg`)

- Size: 3000x3750
- SKU: FP-L2P-OLI
- Alt text: Olive two-person dome tent
- Base image: `larch-2p-tent-sand.jpg` (use the edit prompt)

Prompt:

> Product photo of one pitched two-person freestanding dome tent with two crossing poles, rainfly fully on, one vestibule door rolled half open showing a dark interior, three-quarter front view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 75% of the frame width, the whole object inside the frame with even margins. Colour: a muted olive green silicone-coated ripstop rainfly. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A freestanding two-person dome tent with crossing poles, two doors and two vestibules for packs and boots. 1.9 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a muted olive green silicone-coated ripstop rainfly. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Ultralight Tarp 3x3, Color: Olive (`ultralight-tarp-3x3-olive.jpg`)

- Size: 3000x3750
- SKU: FP-UT33-OLI
- Alt text: Olive folded ultralight tarp with stuff sack

Prompt:

> Product photo of one ultralight tarp folded into a neat flat rectangle with its matching drawstring stuff sack lying beside it, three-quarter view from slightly above. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame width, the whole object inside the frame with even margins. Colour: a muted olive green thin silicone-coated ripstop nylon. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 3 x 3 m ultralight tarp with 16 tie-outs for A-frame, lean-to or storm pitches. Comes with a stuff sack. 520 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Ultralight Tarp 3x3, Color: Sand (`ultralight-tarp-3x3-sand.jpg`)

- Size: 3000x3750
- SKU: FP-UT33-SAN
- Alt text: Sand folded ultralight tarp with stuff sack
- Base image: `ultralight-tarp-3x3-olive.jpg` (use the edit prompt)

Prompt:

> Product photo of one ultralight tarp folded into a neat flat rectangle with its matching drawstring stuff sack lying beside it, three-quarter view from slightly above. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame width, the whole object inside the frame with even margins. Colour: a warm sand beige thin silicone-coated ripstop nylon. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 3 x 3 m ultralight tarp with 16 tie-outs for A-frame, lean-to or storm pitches. Comes with a stuff sack. 520 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a warm sand beige thin silicone-coated ripstop nylon. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Alpine Down Bag -5°C, Color: Navy (`alpine-down-bag-navy.jpg`)

- Size: 3000x3750
- SKU: FP-ADB-NAV
- Alt text: Navy mummy down sleeping bag

Prompt:

> Product photo of one mummy-shaped down sleeping bag laid out flat, seen three-quarter from above, hood at the top, horizontal down baffles, side zip half open showing a light grey lining. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 75% of the frame height, the whole object inside the frame with even margins. Colour: a deep navy blue lightweight nylon shell. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A mummy-shaped down sleeping bag rated to -5 °C comfort for three-season trips, with a shaped hood and a two-way side zip. 1.1 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Alpine Down Bag -5°C, Color: Rust (`alpine-down-bag-rust.jpg`)

- Size: 3000x3750
- SKU: FP-ADB-RUS
- Alt text: Rust mummy down sleeping bag
- Base image: `alpine-down-bag-navy.jpg` (use the edit prompt)

Prompt:

> Product photo of one mummy-shaped down sleeping bag laid out flat, seen three-quarter from above, hood at the top, horizontal down baffles, side zip half open showing a light grey lining. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 75% of the frame height, the whole object inside the frame with even margins. Colour: a burnt rust orange lightweight nylon shell. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A mummy-shaped down sleeping bag rated to -5 °C comfort for three-season trips, with a shaped hood and a two-way side zip. 1.1 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a burnt rust orange lightweight nylon shell. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Valley Synthetic Bag, Color: Moss (`valley-synthetic-bag-moss.jpg`)

- Size: 3000x3750
- SKU: FP-VSB-MOS
- Alt text: Moss rectangular synthetic sleeping bag, partly rolled

Prompt:

> Product photo of one rectangular synthetic-fill sleeping bag partly rolled up from the foot end, quilted diamond pattern, seen three-quarter from above. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 65% of the frame height, the whole object inside the frame with even margins. Colour: a muted moss green polyester shell. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A roomy rectangular sleeping bag with synthetic fill that keeps insulating when damp. Unzips fully into a quilt. 1.4 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Valley Synthetic Bag, Color: Navy (`valley-synthetic-bag-navy.jpg`)

- Size: 3000x3750
- SKU: FP-VSB-NAV
- Alt text: Navy rectangular synthetic sleeping bag, partly rolled
- Base image: `valley-synthetic-bag-moss.jpg` (use the edit prompt)

Prompt:

> Product photo of one rectangular synthetic-fill sleeping bag partly rolled up from the foot end, quilted diamond pattern, seen three-quarter from above. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 65% of the frame height, the whole object inside the frame with even margins. Colour: a deep navy blue polyester shell. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A roomy rectangular sleeping bag with synthetic fill that keeps insulating when damp. Unzips fully into a quilt. 1.4 kg. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a deep navy blue polyester shell. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Air Sleeping Pad, Color: Rust (`air-sleeping-pad-rust.jpg`)

- Size: 3000x3750
- SKU: FP-ASP-RUS
- Alt text: Rust inflated air sleeping pad with stuff sack

Prompt:

> Product photo of one inflated tapered air sleeping pad lying flat, seen three-quarter from above, horizontal baffles, a flat valve at the top corner, its small stuff sack lying beside it. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 75% of the frame height, the whole object inside the frame with even margins. Colour: a burnt rust orange matte ripstop nylon. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: An inflatable sleeping pad with horizontal baffles and a flat valve, 7 cm thick, rolls down to the size of a water bottle. 480 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Air Sleeping Pad, Color: Slate (`air-sleeping-pad-slate.jpg`)

- Size: 3000x3750
- SKU: FP-ASP-SLA
- Alt text: Slate inflated air sleeping pad with stuff sack
- Base image: `air-sleeping-pad-rust.jpg` (use the edit prompt)

Prompt:

> Product photo of one inflated tapered air sleeping pad lying flat, seen three-quarter from above, horizontal baffles, a flat valve at the top corner, its small stuff sack lying beside it. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 75% of the frame height, the whole object inside the frame with even margins. Colour: a muted slate grey-blue matte ripstop nylon. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: An inflatable sleeping pad with horizontal baffles and a flat valve, 7 cm thick, rolls down to the size of a water bottle. 480 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a muted slate grey-blue matte ripstop nylon. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Titanium Pot 750 ml, Title: Default Title (`titanium-pot-750.jpg`)

- Size: 3000x3750
- SKU: FP-TP750
- Alt text: Titanium cooking pot with lid

Prompt:

> Product photo of one 750 ml titanium cooking pot with its lid on and two folding handles extended, brushed natural titanium with a faint heat-tinted blue-bronze ring near the base, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 55% of the frame height, the whole object inside the frame with even margins. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 750 ml titanium pot with a vented lid and folding handles. Boils water for one, and a gas canister fits inside. 135 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Compact Canister Stove, Title: Default Title (`compact-canister-stove.jpg`)

- Size: 3000x3750
- SKU: FP-CCS
- Alt text: Compact camping stove on a gas canister

Prompt:

> Product photo of one compact folding camping stove head with three unfolded serrated pot supports, screwed onto a small plain unbranded gas canister in matte dark grey, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 55% of the frame height, the whole object inside the frame with even margins. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A folding stove head for threaded gas canisters, with three wide pot supports and a precise flame control. 85 g, canister not included. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Insulated Bottle 750 ml, Color: Slate (`insulated-bottle-750-slate.jpg`)

- Size: 3000x3750
- SKU: FP-IB750-SLA
- Alt text: Slate insulated bottle

Prompt:

> Product photo of one 750 ml double-wall insulated bottle standing upright with a stainless loop cap, brushed stainless rim visible below the cap, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a muted slate grey-blue matte powder-coated stainless steel. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 750 ml double-wall stainless steel bottle that keeps drinks hot for 12 hours or cold for 24, with a leak-proof loop cap. 420 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Insulated Bottle 750 ml, Color: Moss (`insulated-bottle-750-moss.jpg`)

- Size: 3000x3750
- SKU: FP-IB750-MOS
- Alt text: Moss insulated bottle
- Base image: `insulated-bottle-750-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one 750 ml double-wall insulated bottle standing upright with a stainless loop cap, brushed stainless rim visible below the cap, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a muted moss green matte powder-coated stainless steel. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 750 ml double-wall stainless steel bottle that keeps drinks hot for 12 hours or cold for 24, with a leak-proof loop cap. 420 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a muted moss green matte powder-coated stainless steel. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Insulated Bottle 750 ml, Color: Sand (`insulated-bottle-750-sand.jpg`)

- Size: 3000x3750
- SKU: FP-IB750-SAN
- Alt text: Sand insulated bottle
- Base image: `insulated-bottle-750-slate.jpg` (use the edit prompt)

Prompt:

> Product photo of one 750 ml double-wall insulated bottle standing upright with a stainless loop cap, brushed stainless rim visible below the cap, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 60% of the frame height, the whole object inside the frame with even margins. Colour: a warm sand beige matte powder-coated stainless steel. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 750 ml double-wall stainless steel bottle that keeps drinks hot for 12 hours or cold for 24, with a leak-proof loop cap. 420 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a warm sand beige matte powder-coated stainless steel. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Enamel Camp Mug, Color: Sand (`enamel-camp-mug-sand.jpg`)

- Size: 3000x3750
- SKU: FP-ECM-SAN
- Alt text: Sand enamel camp mug

Prompt:

> Product photo of one 350 ml enamel camp mug with straight sides and a handle on the right, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 50% of the frame height, the whole object inside the frame with even margins. Colour: a warm sand beige glossy speckled enamel with a rolled dark steel rim. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 350 ml enamel steel mug with a rolled rim, for coffee by the fire or soup on the trail. 180 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Enamel Camp Mug, Color: Moss (`enamel-camp-mug-moss.jpg`)

- Size: 3000x3750
- SKU: FP-ECM-MOS
- Alt text: Moss enamel camp mug
- Base image: `enamel-camp-mug-sand.jpg` (use the edit prompt)

Prompt:

> Product photo of one 350 ml enamel camp mug with straight sides and a handle on the right, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 50% of the frame height, the whole object inside the frame with even margins. Colour: a muted moss green glossy speckled enamel with a rolled dark steel rim. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 350 ml enamel steel mug with a rolled rim, for coffee by the fire or soup on the trail. 180 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a muted moss green glossy speckled enamel with a rolled dark steel rim. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Enamel Camp Mug, Color: Rust (`enamel-camp-mug-rust.jpg`)

- Size: 3000x3750
- SKU: FP-ECM-RUS
- Alt text: Rust enamel camp mug
- Base image: `enamel-camp-mug-sand.jpg` (use the edit prompt)

Prompt:

> Product photo of one 350 ml enamel camp mug with straight sides and a handle on the right, three-quarter view. Seamless light warm grey studio background (#EDEBE7) with no visible horizon; the object rests on the same light grey surface. Soft natural daylight from the left, a gentle soft shadow falling to the right. Portrait 4:5 composition (3000x3750 px), centered, filling about 50% of the frame height, the whole object inside the frame with even margins. Colour: a burnt rust orange glossy speckled enamel with a rolled dark steel rim. Style: clean, minimal, editorial outdoor-gear catalog photograph, realistic materials, natural proportions, slightly muted colour. Mood reference only, never to be written on the image: A 350 ml enamel steel mug with a rolled rim, for coffee by the fire or soup on the trail. 180 g. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

Edit prompt:

> Edit the previous image of this product. Keep the shape, camera angle, framing, scale, light, shadow and background exactly the same. Change only the colour to a burnt rust orange glossy speckled enamel with a rolled dark steel rim. No text, no letters, no numbers, no logos, no brand marks, no labels, no watermarks, no hands, no people, no props, no plants, no other objects.

### Slide 1, desktop: Ridge camp at sunrise, 16:9 (`slide-1-desktop.jpg`)

- Size: 3840x2160
- Alt text: A sand-coloured tent pitched on a grassy mountain ridge at sunrise, mist in the valleys below

Prompt:

> Landscape outdoor photograph, wide 16:9 composition (3840x2160 px): a single sand-coloured two-person dome tent pitched on a grassy alpine ridge at sunrise, layered mountain ridges fading into the distance, soft mist in the valleys, warm low golden light from the right. The main subject sits in the right two thirds of the frame; the left third is calm, uncluttered sky or landscape kept empty for a text overlay. Natural colours, realistic detail, slightly muted, quiet editorial travel photograph. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no people, no animals.

### Slide 1, mobile: Ridge camp at sunrise, 4:5 (`slide-1-mobile.jpg`)

- Size: 1800x2250
- Alt text: A sand-coloured tent pitched on a grassy mountain ridge at sunrise, mist in the valleys below

Prompt:

> Outdoor photograph, portrait 4:5 composition (1800x2250 px): a single sand-coloured two-person dome tent pitched on a grassy alpine ridge at sunrise, layered mountain ridges fading into the distance, soft mist in the valleys, warm low golden light from the right. The main subject sits in the lower two thirds of the frame; the top third is calm, uncluttered sky kept empty for a text overlay. Same scene, light and colours as the desktop version of this slide. Natural colours, realistic detail, slightly muted, quiet editorial travel photograph. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no people, no animals.

### Slide 2, desktop: Forest trail, 16:9 (`slide-2-desktop.jpg`)

- Size: 3840x2160
- Alt text: A slate-blue daypack resting against a tree stump beside a trail through a pine forest

Prompt:

> Landscape outdoor photograph, wide 16:9 composition (3840x2160 px): a narrow dirt trail winding through a tall pine forest in early morning light, a slate grey-blue hiking daypack resting against a mossy tree stump beside the trail, light shafts through the trees, soft haze. The main subject sits in the right two thirds of the frame; the left third is calm, uncluttered sky or landscape kept empty for a text overlay. Natural colours, realistic detail, slightly muted, quiet editorial travel photograph. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no people, no animals.

### Slide 2, mobile: Forest trail, 4:5 (`slide-2-mobile.jpg`)

- Size: 1800x2250
- Alt text: A slate-blue daypack resting against a tree stump beside a trail through a pine forest

Prompt:

> Outdoor photograph, portrait 4:5 composition (1800x2250 px): a narrow dirt trail winding through a tall pine forest in early morning light, a slate grey-blue hiking daypack resting against a mossy tree stump beside the trail, light shafts through the trees, soft haze. The main subject sits in the lower two thirds of the frame; the top third is calm, uncluttered sky kept empty for a text overlay. Same scene, light and colours as the desktop version of this slide. Natural colours, realistic detail, slightly muted, quiet editorial travel photograph. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no people, no animals.

### Slide 3, desktop: Lake camp at dusk, 16:9 (`slide-3-desktop.jpg`)

- Size: 3840x2160
- Alt text: An olive tent on the shore of a still mountain lake at dusk, peaks reflected in the water

Prompt:

> Landscape outdoor photograph, wide 16:9 composition (3840x2160 px): a single olive green one-person tent on the pebbly shore of a still alpine lake at dusk, snow-dusted peaks reflected in the calm water, deep blue sky with the last warm glow on the summits. The main subject sits in the right two thirds of the frame; the left third is calm, uncluttered sky or landscape kept empty for a text overlay. Natural colours, realistic detail, slightly muted, quiet editorial travel photograph. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no people, no animals.

### Slide 3, mobile: Lake camp at dusk, 4:5 (`slide-3-mobile.jpg`)

- Size: 1800x2250
- Alt text: An olive tent on the shore of a still mountain lake at dusk, peaks reflected in the water

Prompt:

> Outdoor photograph, portrait 4:5 composition (1800x2250 px): a single olive green one-person tent on the pebbly shore of a still alpine lake at dusk, snow-dusted peaks reflected in the calm water, deep blue sky with the last warm glow on the summits. The main subject sits in the lower two thirds of the frame; the top third is calm, uncluttered sky kept empty for a text overlay. Same scene, light and colours as the desktop version of this slide. Natural colours, realistic detail, slightly muted, quiet editorial travel photograph. No text, no letters, no numbers, no logos, no brand marks, no watermarks, no people, no animals.
