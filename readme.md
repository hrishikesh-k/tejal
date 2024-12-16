## Tejal Shinde v9.x.x

This repository holds the source code for [Tejal Shinde's portfolio](https://www.tejalshinde.com/) (hosted on [Netlify](https://www.netlify.com/)). It's the 9<sup>th</sup> iteration of the website, this one being built with [Astro](https://www.astro.build/).

Note that, this is not a theme for Astro. It is a standalone website, which uses Astro as a Static Site Generator (SSG). Thus, if you wish to use this as a template, you will most likely have to directly modify the source code. This document tries to cover all the (important) aspects of the website, and should be enough to get you started.

### Directory structure

The directory structure is as follows (with the explanation following the diagram):

```text
.
├── .git/
│   ├── <other git stuff>
│   ├── hooks/
│   |   ├── <sample hooks>
│   |   ├── post-checkout
│   |   └── pre-commit
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── [id]/
│   │   │   ├── [[video-#]]/
│   │   │   │   ├── [quality]/
│   │   │   │   │   └── [quality]-seg-[###].m3u8seg
│   │   │   │   ├── poster.jpg
│   │   │   │   └── thumbs.jpg
│   │   │   └── [name].{gif,jpg,pdf,png}
│   │   ├── fonts/
│   │   │   ├── montserrat-italic.woff2
│   │   │   └── montserrat-regular.woff2
│   │   ├── og.jpg
│   │   └── styles.css
│   ├── components/
│   │   ├── collection.astro
│   │   ├── explore.astro
│   │   ├── heading3.astro
│   │   ├── icon.astro
│   │   ├── jump.astro
│   │   ├── masonry.astro
│   │   ├── navigation.astro
│   │   ├── picture.astro
│   │   ├── swiper.astro
│   │   ├── tooltip.astro
│   │   └── video.astro
│   ├── content/
│   │   └── [collection]/
│   │       └── [id].mdx
│   ├── layouts/
│   |   └── base.astro
│   ├── pages/
│   │   ├── work/
│   │   │   ├── [collection]/
│   │   │   │   └── [id].astro
│   │   │   └── [collection].astro
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   ├── work.astro
│   ├── utils/
│   │   ├── components/
│   │   |   ├── contact.ts
│   │   |   ├── masonry.ts
│   │   |   ├── nav.ts
│   │   |   ├── swiper.ts
│   │   |   ├── tooltip.ts
│   │   |   └── video.ts
│   │   ├── constants.ts
│   │   └── functions.ts
│   ├── content.config.ts
│   └── env.d.ts
├── .gitattributes
├── .gitignore
├── .mtimes
├── astro.config.ts
├── biome.json
├── deno.lock
├── license.md
├── mtimestore
├── netlify.toml
├── package.json
├── package-lock.json
├── readme.md
├── tsconfig.json
└── uno.config.ts
```

This is a typical directory structure for an Astro website. If there are some unknowns, please refer to the [Astro documentation on directory structure](https://docs.astro.build/basics/project-structure/). Along with the files and folders documented here, there could be some other files required for the website to work. Anything that's not listed above (which might get generated during the development of the application) can most likely be safely deleted.

#### .git

This folder is used by Git for version control. The only relevant files in this folder are: `./.git/hooks/post-checkout` and `./.git/hooks/pre-commit`. These files handle the restoration and saving of the last modification time of files, respectively.

#### public

This folder contains files that should be placed as-is into the output folder. Read more on [Astro's documentation](https://docs.astro.build/basics/project-structure/#public). Currently, it has:

- favicon.ico
- robots.txt

#### src

This is the folder that contains mostly everything that the site needs. Read more on [Astro's documentation](https://docs.astro.build/en/basics/project-structure/#src).

##### assets

This folder contains all the assets imported/processed by Astro. To keep things organized, this folder contains sub-folders, each named after the id of a page. The assets being used on a page are stored in the folder with its id. The exceptions are:

- fonts/: contains the `.woff2` files of the fonts being used on the website
- og.jpg: used as the `og:image` for the website
- styles.css: contains the `font-family` declarations and CSS variables

Within each sub-folder, you could have assets like images, `.pdf` files, videos, etc. While placing most assets is relatively easy, for videos, reading the [docs on the `video` component](#video) is highly recommended.

##### components

This folder contains all the `.astro` components being imported across other files. The [documentation for each component and its usage](#components) exists below.

##### content

This folder contains all the `.mdx` files grouped into collections. Read more on [Astro's documentation](https://docs.astro.build/en/basics/project-structure/#srccontent).

##### layouts

This folder contains `base.astro` which contains the markup that houses the entire site. Read more on [Astro's documentation](https://docs.astro.build/en/basics/project-structure/#srclayouts). All pages use this layout. Technically, this is just another component, but it's placed in the `layouts` directory due to convention. This file imports all the global bundles and also manages the SEO.

##### pages

This folder contains all the routes for the website. Read more on [Astro's documentation](https://docs.astro.build/en/basics/project-structure/#srcpages). While the output of the site follows a directory pattern (`/path/index.html`), the routes are kept at the top-level (`/path.astro`). This is to avoid creating multiple files with the same name as `index.astro`.

##### utils

This folder contains sharable constants and functions. It has another folder named components which includes the client-side interactivity code required by the Astro components. The code has been added here so Biome can lint it. It currently does not support linting `<script>` tags in Astro components.

##### content.config.ts

This file defines the content collections as well as their structure. Read more on [Astro's documentation](https://docs.astro.build/en/guides/content-collections/#the-collection-config-file).

##### env.d.ts

This file is used to add some extra interfaces to `window` global.

#### .gitattributes

This file is used to ensure all text files use the `lf` separator as their line break. If you add/remove text extensions of files, it is important to update this file to ensure no `crlf` file get added to the repo. Read more on [Git's documentation](https://www.git-scm.com/docs/gitattributes/).

#### .gitignore

This file is used to prevent unwanted directories and files from getting added to the repo. Read more on [Git's documentation](https://www.git-scm.com/docs/gitignore/). 

#### .mtimes

This file is generated by the [`mtimestore`](#mtimestore) script which runs during Git hooks. It is used to save and restore the file modification time as Git does not maintain that.

#### astro.config.ts

This file contains the configuration for Astro. Read more on [Astro's documentation](https://docs.astro.build/en/reference/configuration-reference/).

#### biome.json

This file contains the configuration for Biome. Read more on [Biome's documentation](https://www.biomejs.dev/reference/configuration/)

#### deno.lock

This is Deno's lock file which is automatically generated when you run Netlify CLI. Read more on [Deno's documentation](https://docs.deno.com/runtime/fundamentals/modules/#integrity-checking-and-lock-files)

#### license.md

This file contains the license for this repo. This code is currently licensed as MIT. Read more on [MIT licence](https://www.license.md/licenses/mit-license/).

#### mtimestore

This is a bash application that handles saving/restoration of last modification time for files. This is executed by git hooks and during the build command on Netlify.

#### netlify.toml

This is the configuration file for Netlify. Read more on [Netlify's documentation](https://docs.netlify.com/configure-builds/file-based-configuration/#configuration-details).

#### package.json

This is Node.js' package.json. Read more on [NPM's documentation](https://docs.npmjs.com/cli/configuring-npm/package-json/).

#### package-lock.json

This is the lockfile generated by NPM. Read more on [NPM's documentation](https://docs.npmjs.com/cli/configuring-npm/package-lock-json/).

#### readme.md

This is the project's readme.

#### tsconfig.json

This is the project's TypeScript config. Read more on [TypeScript's documentation](https://www.typescriptlang.org/tsconfig/).

#### uno.config.ts

This is the configuration file for UnoCSS. Read more on [UnoCSS' documentation](https://www.unocss.dev/config/). To have complete control over the available variants and utilities, each CSS property is added as its own individual preset in the `presets` config with the list of allowed values. If you need to add/remove any utilities, it would have to be done in that file. For responsive utilities, the `layers` config should be correctly updated to maintain the correct order.

##### Known issues:

- For some reason, UnoCSS is not scanning `scale-75` utility from `./src/utils/functions.ts`. I have attempted to add it to the `content` config option in various manners, but it never worked. Thus, it currently lives in the `safelist` config.

### Components

This section documents the usage for the available components. The type and requirement for props and slots is not documented as TypeScript will help with it. Their description is documented though.

#### collection.astro

This component is used to render the links to the posts. It creates a grid layout to stack all the posts from a collection. Note that, for the `presentations` collection, the presentation's PDF needs to be imported in the component and mapped in the `presentationSlugRelations` constant. The component also has some client-side JavaScript in `./src/utils/functions.ts`. This logic controls the rounded-corners for the post links.

##### Available props:

- explore: if `true`, render an "Explore all" link
- jumpLinks: if `true`, render a link to the previous and the next collection
- noTitleMarginTop: if `true`, don't add a margin-top to the title of the component
- posts: array of the posts to render links for
- showTitle: if `true`, render the title of the component
- title: the title of the component

#### explore.astro

This component is used to show the list of other posts from the same collection.

##### Available props:

- collection: slug of the current collection
- exclude: id of the post to exclude from the list
- heading: title of the component
- noExplore: if `true`, don't render a link to the rest of the collection
- noHeadingMargin: if `true`, don't add a `margin-top` to the title of the component
- posts: array of the posts to render links for

#### heading3.astro

This component is used to render `<h3>` with `#id` and follow a consistent styling.

##### Available props:

- center: if `true`, align the heading to the center
- noMarginTop: if `true`, don't add a `margin-top` to the heading
- text: the text in the heading

#### icon.astro

This component renders an SVG icon. The list of icons is stored in `./src/utils/constants.ts`. Icons are taken from FontAwesome. New icons can be added from `https://fontawesome.com/search?q=${search}&o=r&s=solid&it=round&ip=classic`. Unused icons must be removed to reduce bundle size. Icons are resized in 48px × 48px boxes with the largest side being exactly 48px.

##### Available props:

- name: name of the icon
- size: expected size of icon in px / 4

#### jump.astro

This component renders links to jump to a different section.

##### Available props:

- entries: collection links to render

#### masonry.astro

This component renders the required markup for masonry layout. The actual JavaScript for that exists in `./src/utils/components/masonry.ts`.

##### Available slots:

- default: container for all masonry items

#### navigation.astro

This is a single-use component, that is, it's only abstracted into its own file to not complicate the original layout. But it's not meant for repeated use. It is responsible to render the site's navigation. The JavaScript logic exists in `./src/utils/components/nav.ts`.

##### Available props:

- collection: used to determine which collection to highlight in the menu
- menu: user to determine which menu to underline in the navigation

#### picture.astro

This component is responsible to render responsive images across the website. The generation of different sizes of the image is offloaded to Netlify Image CDN.

##### Available props:

- alt: the alt text for the image
- height: the height of the original image
- maxWidth: if provided, will limit the max responsive widths generated to that, instead of the default 1920px
- rounded: if `true`, add rounded corners to the image
- src: the source URL of the image
- width: the width of the original image

#### swiper.astro

This component using [Swiper](https://www.swiperjs.com/) to generate image galleries. The logic is stored in `./src/utils/components/swiper.ts`.

##### Available props:

- center: if `true`, set the [`centeredSlides`](https://www.swiperjs.com/swiper-api#param-centeredSlides) option to true
- effect: if provided, sets the effect
- maxWidth: if provided, sets the CSS class to set the maximum width of the container
- noNavigation: if `true`, skip the rendering of the navigation buttons

#### tooltip.astro

This components renders a tooltip. It uses [Floating UI](https://www.floating-ui.com/). The logic exists in `./src/utils/components/tooltip.ts`.

##### Available props:

- extraClass: if provided, the array of CSS class names gets concat to the the built-in CSS class names.
- icon: name of the icon to render
- size: size of the icon
- text: text within the tooltip
- transparent: if `true`, tooltip's container will be transparent

#### video.astro

This component is responsible to append a video to the DOM. It uses [Vidstack](https://www.vidstack.io/). The logic is stored in `'./src/utils/components/video.ts`.

##### Available props:

- duration: provides the duration of the video and also handles some calculations
- poster: source URL of the poster
- qualities: URLs of all segments of each quality
- thumbs: source URL of the thumbnails
- vertical: if `true`, video will be treated as a portrait video

##### Additional notes:

Generating the required video output requires additional steps. To generate the thumbnails:

1. calculate the duration of the video in seconds
2. divide it by 2
3. divide it by 10
4. if remainder = 0, replace `<rows>` in the following command by the quotient, else replace it with quotient + 1 
5. move the thumbs.jpg file to the appropriate folder of the video

```shell
ffmpeg -i ./video.mp4 -vf "fps=0.5,scale=192:-1,tile=10x<rows>" -frames:v 1 -q:v 1 -update 1 ./thumbs.jpg
```

### Frontmatter

The schema for frontmatter for each collection is defined in `./src/content.config.ts`. Most options are self-explanatory.
