# Tejal Shinde v9.x.x

This repository holds the source code for [Tejal Shinde's portfolio](https://www.tejalshinde.com/). It is the 9<sup>th</sup> iteration of the website, built with [Astro](https://www.astro.build/).

**Note**: This is **not** an Astro theme. It's a standalone site using Astro as a Static Site Generator (SSG). To reuse it, you must directly modify the source code. This document provides an overview of the structure and key components.

---

## Development Setup

To develop locally, the following software is required:

- Deno v1.46
- ffmpeg v7 (for encoding videos)
- Node.js v22
- npm v10
- .env with the following contents:

```text
JWT_SECRET=<32-character (256-bit) string>
PASSWORD=<string password>
```

To get started, run:

```shell
npm i
npx netlify dev
```

To run a production build, run:

```shell
npx netlify build --offline
```

---

## Code Formatting

The project uses [Biome](https://www.biomejs.dev/) as its linter. It mainly works for CSS, JS, JSON and TS. However, HTML-like languages including Astro are [not fully supported](https://www.biomejs.dev/internals/language-support/#html-super-languages-support). Thus, the HTML code follows the following principles:

- attributes are sorted alphabetically
- attributes are arranged in a single line
- CSS classes are arranged alphabetically
- in case of variants, the actual underlying utility name is considered for arranging alphabetically

Additionally, until Biome is able to parse the `<script>` tags in the Astro components, all the client-side scripts are placed in the `utils` folder.

---

## Directory Structure

```plaintext
.
├── .git/
│   ├── hooks/               # Git hooks
│   │   ├── post-checkout    # Restores file modification times
│   │   └── pre-commit       # Saves file modification times
├── public/                  # Static files (served as-is)
│   ├── favicon.ico
│   └── robots.txt
├── netlify/
│   ├── edge-functions/
│   │   ├── import_map.json  # Deno import map
│   │   └── validations.ts      # Site password control
├── src/
│   ├── assets/              # Fonts, images, videos, and styles grouped by id
│   ├── components/          # Reusable Astro components
│   ├── content/             # MDX files grouped by collections
│   ├── layouts/             # Page layouts
│   ├── pages/               # Routes for the website
│   ├── utils/               # Helpers, constants, and client scripts
│   ├── content.config.ts    # Content collection schema
│   └── env.d.ts             # TypeScript environment interfaces
├── .gitattributes           # LF line endings enforcement
├── .gitignore               # Git ignore rules
├── .mtimes                  # File modification time tracker
├── astro.config.ts          # Astro configuration
├── biome.json               # Biome configuration
├── deno.lock                # Deno lockfile
├── license.md               # MIT License
├── mtimestore               # Bash script to save/restore lastmod
├── netlify.toml             # Netlify build configuration
├── package.json             # Node.js package manifest
├── package-lock.json        # NPM lock file
├── readme.md                # This document
├── tsconfig.json            # TypeScript configuration
└── uno.config.ts            # UnoCSS configuration
```

For additional details on the Astro directory structure, refer to the [Astro documentation](https://docs.astro.build/basics/project-structure/).

---

## Components

All components are located in `src/components`. Below is a detailed description of each component and its props. `*` next to the prop's/slot's name denotes that it's required.

### `collection.astro`

Renders a grid layout of post links.

####  Props:

- `explore`: shows an "Explore All" link
- `jumpLinks`: displays next/previous collection links
- `noTitleMarginTop`: don't add the top margin to the title
- `posts`*: array of posts to display
- `showTitle`: renders the component title.
- `title`*: title of the component

---

### `explore.astro`

Lists other posts from the same collection.

#### Props:

- `collection`*: current collection slug
- `exclude`: post id to exclude
- `heading`*: title of the component
- `noExplore`: don't show the "Explore All" link
- `noHeadingMargin`: don't add the top margin to the heading
- `posts`*: array of posts to display

---

### `heading3.astro`

Renders a styled `<h3>` element.

#### Props:

- `center`: center-align the heading
- `noMarginTop`: removes top margin
- `text`*: heading text

---

### `icon.astro`

Displays an SVG icon.

#### Props:

- `name`*: name of the icon - icon needs to be added in `src/utils/responses.ts`.
- `size`: icon size (in units of `4px`)

#### Things to note:

- Icons are taken from FontAwesome [classic + rounded + solid variant](https://fontawesome.com/search?q=${search}&o=r&s=solid&it=round&ip=classic)
- SVG to be resized it in a viewbox of 48px × 48px with the longest side of the icon being exactly 48px.
- All paths should be merged into a single path and the `d` attribute of the path should be saved in the constant.
- Unused icons should be removed from the constant to reduce bundle size.

---

### `jump.astro`

Creates links to other sections.

#### Props:

- `entries`*: array of links

---

### `masonry.astro`

Renders a responsive masonry grid layout.

#### Slots:

- `default`*: items to arrange in the grid

---

### `navigation.astro`

Renders the site navigation.

#### Props:

- `collection`: highlights the active collection
- `menu`: highlights the active menu

---

### `picture.astro`

Renders responsive images using Netlify Image CDN.

#### Props:

- `alt`*: alt text for the image
- `height`*: original image height
- `maxWidth`: limits responsive widths
- `rounded`: adds rounded corners
- `src`*: image source URL
- `width`*: original image width

---

### `swiper.astro`

Renders image galleries using [Swiper](https://www.swiperjs.com/).

#### Props:

- `center`: set the [`centeredSlides`](https://www.swiperjs.com/swiper-api#param-centeredSlides) option
- `effect`: set the [`effect`](https://swiperjs.com/swiper-api#param-effect) option
- `maxWidth`: CSS classes to set the maxWidth of container
- `noNavigation`: disables navigation buttons

#### Slots:

- `default`: items to add to gallery

---

### `textfield.astro`

Renders HTML inputs.

#### Props:

- `flex`: adds flex classes
- `label`: label for input
- `type`: input type

---

### `tooltip.astro`

Displays a tooltip using [Floating UI](https://www.floating-ui.com/).

#### Props:

- `extraClass`: CSS classes to append to the container
- `icon`*: icon name
- `size`: icon size
- `text`*: tooltip content
- `transparent`: makes the container transparent

---

### `turnstile.astro`

Renders [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/).

---

### `video.astro`:

Renders video player using [Vidstack](https://www.vidstack.io/).

#### Props:

- `duration`*: video duration in seconds (required for calculations)
- `poster`*: video poster image source URL
- `qualities`*: URLs for HLS video segments
- `thumbs`*: thumbnail image source URL
- `vertical`: forces a vertical video player

#### Things to note:

- The project uses v1 of Vidstack even though the latest on NPM is v0. For some reason, this library has been stuck in RC for quite some time.
- To generate the necessary video files for the component, follow these steps:
  1. Place the source video as `video.mp4` in the current directory
  2. Generate thumbnails:
    - calculate `duration / 2 / 10`
    - round the result to the next integer and replace `<rows>` with it
    - run:

```shell
ffmpeg -i ./video.mp4 -vf "fps=0.5,scale=192:-1,tile=10x<rows>" -frames:v 1 -q:v 1 -update 1 ./thumbs.jpg
```
- continue:
  3. Generate video segments:
   - replace quality dimensions if needed (e.g., for portrait videos)
   - adjust the `var_stream_map` for available streams
   - run:

```shell
mkdir ./video-1
ffmpeg \
-i ./video.mp4 \
-c:a aac \
-c:v libx264 \
-f hls \
-g 60 \
-hls_playlist_type vod \
-hls_segment_filename video-1/%v-seg-%03d.m3u8seg \
-hls_time 2 \
-keyint_min 60 \
-map v:0 -s:0 1920x1080 -maxrate:0 2.4M -bufsize:0 4.8M \
-map v:0 -s:1 1280x720 -maxrate:1 2.1M -bufsize:1 4.2M \
-map v:0 -s:2 854x480 -maxrate:2 1.8M -bufsize:2 3.6M \
-map v:0 -s:3 640x360 -maxrate:3 1.5M -bufsize:3 3M \
-map v:0 -s:4 426x240 -maxrate:4 1.2M -bufsize:4 2.4M \
-map v:0 -s:5 256x144 -maxrate:5 0.9M -bufsize:5 1.8M \
-map a:0 -b:a:0 128k \
-map a:0 -b:a:1 96k \
-map a:0 -b:a:2 80k \
-map a:0 -b:a:3 64k \
-map a:0 -b:a:4 48k \
-map a:0 -b:a:5 32k \
-r 30 \
-sc_threshold 0 \
-var_stream_map "v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:480p v:3,a:3,name:360p v:4,a:4,name:240p v:5,a:5,name:144p" \
video-1/index-%v.m3u8
```
- continue:
  3. continue:
    - delete the `.m3u8` files in `video-1/` folder
    - move the rest of the output along with `thumbs.jpg` in the `assets/<id>` folder

---

## Styling

Primarily, the project is styled using [UnoCSS](https://www.unocss.dev/). To have a complete control over what utilities get generated in production, the project does not use any built-in presets. Each utility, along with its values is manually added to the config. Thus, if you remove any used styles, it should also be removed from the config to not have an unmanageable list of utilities.

### Things to note:

- The utilities in `safelist` are used in `utils/ipv6.ts`. For some reason, they are not detected during scanning regardless of the any configuration values.

---

## SEO

SEO tags and Structured Data is added by `src/layouts/base.astro`. Thus, every page is required to use that layout.

### Props:

- `cover`: source image URL for post's cover
- `description`*: SEO description for the page
- `subtitle`: additional text to render below the title
- `title`*: SEO title for the page

---

## Deployment

The project is deployed to [Netlify](https://www.netlify.com). Build settings are defined in `netlify.toml`.

The site uses Netlify Edge Function to implement a custom password protection screen. The dependencies of the Edge Function are maintained separately in `netlify/edhe-functions/import_map.json`. Once you update the dependency versions in `package.json`, you should also update them in the import map.

---

## License

This project is licensed under the [MIT License](https://www.license.md/licenses/mit-license/).

---

## Contributing

All contributions are welcome! If you encounter any issues or have questions while using this repository, feel free to open an issue. Got a suggestion or an improvement? Submitting a pull request would be the icing on the cake.
