## Tejal Shinde v8.x.x

This repository holds the source code for [Tejal Shinde's portfolio](https://www.tejalshinde.com/) (hosted on [Netlify](https://www.netlify.com/)). It's the 8<sup>th</sup> iteration of the website, this one being built with [Hugo](https://www.gohugo.io/).

Note that, this is not a theme for Hugo. It is a standalone website, which uses Hugo as a Static Site Generator (SSG). Thus, if you wish to use this as a template, you will most likely have to directly modify the source code. This document tries to cover all the (important) aspects of the website, and should be enough to get you started.

### Directory structure

The directory structure is as follows (with the explanation following the diagram):

```text
.
├── @types/
│   ├── netlify__cache-utils/
│   │   └── index.d.ts
├── assets/
│   ├── css/
│   │   ├── bundle.scss
│   │   └── styles.css
│   ├── images/
│   │   ├── og.jpg
│   └── js/
│       └── bundle.ts
├── content/
│   ├── 404/
│   │   └── index.md
│   ├── about/
│   │   ├── assets/
│   │   │   └── [files]
│   │   └── index.md
│   ├── contact/
│   │   └── index.md
│   └── work/
│       ├── advertising/
│       │   ├── [project]/
│       │   │   ├── assets/
│       │   │   │   ├── [files]
│       │   │   │   └── cover.jpg
│       │   │   └── index.md
│       │   └── _index.md
│       ├── fashion/
│       │   ├── [project]/
│       │   │   ├── assets/
│       │   │   │   ├── [files]
│       │   │   │   └── cover.jpg
│       │   │   └── index.md
│       │   └── _index.md
│       ├── presentations/
│       │   ├── [project]/
│       │   │   ├── assets/
│       │   │   │   ├── presentation.pdf
│       │   │   │   └── cover.jpg
│       │   │   └── index.md
│       │   └── _index.md
│       └── _index.md
├── _index.md
├── layouts/
│   ├── _default/
│   │   └── baseof.html
│   ├── page/
│   │   ├── 404.html
│   │   ├── about.html
│   │   └── contact.html
│   ├── partials/
│   │   ├── gallery.html
│   │   ├── heading.html
│   │   ├── icon.html
│   │   ├── image.html
│   │   ├── tooltip.html
│   │   └── video.html
│   └── work/
│       ├── [project].html
│       └── section.html
│   ├── index.html
│   └── robots.txt
├── static/
│   ├── fonts/
│   │   ├── montserrat-italic.woff2
│   │   └── montserrat-regular.woff2
│   ├── 785dfe191d5146e0a0e852fa5003303e.txt
│   └── favicon.ico
├── .gitattributes
├── .gitignore
├── hugo.toml
├── license.md
├── netlify.toml
├── package.json
├── readme.md
├── scripts.ts
├── scripts.tsconfig.json
├── tsconfig.json
└── uno.config.ts
```

This is a typical directory structure for a Hugo website. If there are some unknowns, please refer to the [Hugo documentation on directory structure](https://www.gohugo.io/getting-started/directory-structure/). Along with the files and folders documented there, there are some other files required for the website to work. Anything that's not listed above can most likely be safely deleted.

### Layouts

While most SSGs are used to write single or similar templates for similar pages and write their content in Markdown, unfortunately, due to the nature of content for this site, that is not the case. Almost every page has its own layout. The only few components that are common across all or multiple pages have been added directly in `./layouts/_default/baseof.html`. That file also imports all CSS and JS bundles, handles SEO and similar stuff.

Moving on, each single page has its own layout, which is stored in `./layouts/page/`. Currently, this directory has `./404.html`, `./about.html`, and `./contact.html`. Note that, each of these files also needs an associated Markdown file in `./content/`. For example, `./404.html` needs `./content/404/index.md` to work. The frontmatter of that file should also contain a property named `layout` with the value `404`. This is also covered in the [Frontmatter](#frontmatter) section.

All the reusable components of the site that are documented in the [Available components](#available-components) section are stored in `./layouts/partials/`. Their respective documentation also covers how to use them.

Then, there is the `./layouts/work/` folder. This folder contains all the layouts for all posts under the `work` section. The `./section.html` file is used to render the list of subsections as well as the projects. Each individual project has its own layout as `[project].html` where `[project]` is replaced by the slug of the post. Again, as mentioned above, the content file of that post should have the layout set in its frontmatter.

Lastly, there's the `./layouts/index.html` which contains the layout for the home page and the `./layouts/robots.txt` that generates the `robots.txt` file for SEO.

#### Special config

The layout `.layouts/work/bombae-bantai-brewery.html` has a special config in the `./layouts/_default/baseof.html`. An extra `<p>` tag has been added by checking the title of the page.

### Frontmatter

The site is configured to use some specific frontmatter variables on certain pages. The following is the list of all possible variables along with their explanation:

```yaml
_build:
  list: "never"
cascade:
  sitemap:
    changefreq: "monthly"
    priority: 0.5
description: "Summary"
draft: false
layout: "slug"
menu:
  navigation:
    weight: 0
resources:
  - src: "assets/[path].[ext]"
    title: "Alt text"
sitemap:
  changefreq: "monthly"
  priority: 0.5
title: "Title"
weight: 0
```
- `build`: This can be used by all pages, but it is currently only used on the `./content/404/index.md` to exclude it from the sitemap. This is configured as per [Hugo's documentation on build options](https://www.gohugo.io/content-management/build-options/). 
  - `list`: This determines when to include the page within page collections. Refer to Hugo's documentation on build options, linked above.
- `cascade`: This can be used by all list pages and all properties applied here are automatically passed down to all its children, unless overridden by the child. Ideally, only `./content/work/advertising/_index.md` and `./content/work/fashion/_index.md` should need this.
  - `sitemap`: This is configured as per [Hugo's documentation on sitemap configuration](https://www.gohugo.io/templates/sitemap-template/#override-default-values).
- `description`: This can be used by all the pages. It sets the SEO description of the page. It is recommended to keep it in the range of 120 to 160 charters.
- `draft`: This should only be used by the project pages. When set to true, the page would not be published in the final output.
- `layout`: This can be used by all the pages. It sets the layout of the page. Its usage is explained in the [Layouts](#layouts) section.
- `menu`: This should only be used by the pages that need to appear in the `<nav>` of the website. Currently, this is being used by `about`, `contact`, and `work`.
  - `navigation`: This is the name of the menu. Currently, there is only one menu, so this should not be changed.
    - `weight`: This is used to determine the order of the pages in the menu. The lower the number, the higher the priority.
- `resources`: This should only be used by the pages that need to display images, which is almost always going to be a project page. However, even the `about`, page is using it.
  - `src`: This is the path to the image relative to the content file. For example, if the image is in `./content/work/art/[project]/assets/`, the path should be `assets/[path].[ext]`.
  - `title`: This is the alt text for the image.
- `sitemap`: This can be used by all the pages. This is configured as per [Hugo's documentation on sitemap configuration](https://www.gohugo.io/templates/sitemap-template/#override-default-values).
- `subtitle`: This can be used by all the project pages. It adds a small text below the title on the page in the center.
- `title`: This can be used by all the pages. It sets the SEO title of the page, as well as it is appended to the default title of the site.
- `weight`: This should only be used by the project pages. It determines the order of the projects in the list of projects. The lower the number, the higher the priority. However, the templates are organised in reverse. Thus, the highest `weight` is displayed first.

### CSS

The primary styling of the website is handled using [UnoCSS](https://www.unocss.dev/). Since UnoCSS doesn't have a Hugo integration, the site uses UnoCSS CLI. The configuration for UnoCSS is stored in `./uno.config.ts`.

UnoCSS is configured to scan `./layouts/**/*.html` and `./assets/css/styles.css` files. The HTML files contain all the classes, and the `styles.css` file contains all the CSS rules that use [UnoCSS Transform Directives](https://www.unocss.dev/transformers/directives/). This is done, because UnoCSS CLI doesn't support extracting rules from HTML files. There's an [open issue to track that](https://www.github.com/unocss/unocss/issues/2445/). The file generated by UnoCSS is saved in `./assets/css/uno.css`.

`./assets/css/bundle.scss` is the entrypoint for the CSS bundle. It imports all the CSS files that are required for the site to work. This includes `uno.css` and CSS required by Swiper, imported from `./node_modules`. Any custom CSS that's not supposed to be processed by UnoCSS should also go here.

#### Known issues:

- Cannot upgrade to UnoCSS v0.60.2+ because of this issue: https://github.com/unocss/unocss/issues/3845

### JavaScript

Hugo is not a JavaScript-based framework. This is good as well as bad for various reasons, but in this case, this means that one would have to write a lot of vanilla JavaScript to get things done, which would have been otherwise very easy to do with a framework. Hugo at least has great JavaScript bundling support - along with TypeScript. The TypeScript configuration stored in `./tsconfig.json` is made as strict as possible and any modifications to that should be made with care.

The entire site produces a single JavaScript bundle. This is generated from `./assets/js/bundle.ts`. A lot of the imports are used by the components, and are documented in the [Available components](#available-components) section. All the custom code is written at the end. The site deliberately doesn't try to use `querySelector()`. Instead, it uses `querySelectorAll()` so that the code runs only if the element(s) exist. This helps reduce redundant checks.

### `scripts.ts`

This file handles the `scripts` block in `package.json`. It is a Node.js script that does various tasks every time a script is run, which would otherwise have been very difficult to do with Hugo. The script takes care of doing the following:

- `--build` flag:
  - Deletes `./public/` and `./resources/` folder to build fresh data (`./resources/` is only deleted if `--clean` flag is passed to the command).
  - Restores `./resources/` folder from Netlify's build cache.
  - Runs type-checking.
  - Backs up `./assets/css/styles.css` to `./assets/css/styles.css.bak.css` as UnoCSS will overwrite this file. The backup is restored after the build errors, completes, or terminates.
  - Creates UnoCSS output file in `./assets/css/uno.css`. If it's not created before Hugo process is started, Hugo might fail with an error.
  - Runs UnoCSS CLI.
  - Runs Hugo.
  - Saves `./resources/` folder to Netlify's build cache.
- `--dev` flag:
  - Backs up `./assets/css/styles.css` to `./assets/css/styles.css.bak.css` just as above.
  - Creates UnoCSS output file just as above.
  - Sets up a watcher to watch the above backup file, so any changes made in that are reflected on the site.
  - Runs UnoCSS CLI in watch mode.
  - Runs Hugo server.

It also takes care of cleaning up all of this when the process closes, or exits. In case any of these fail, it will exit with error code 1.

This file is governed by a separate TSConfig named `./scripts.tsconfig.json`, which extends the standard `./tsconfig.json`, but overrides some items.

#### Note:

The script is very brittle. This is because of all the factors it depends on. For example, sometimes UnoCSS CLI keeps running even after the script tries to terminate it. This will overwrite the `./assets/css/styles.css`. Sometimes, Hugo process ends with an error and the script is not able to track it as it has already exited. So, please exercise caution when working and don't blindly rely on the script to do its thing. If you see nothing after `Process successfully completed`, the script most likely worked fine, so that's one clue to count on.

### Available components

#### Gallery

The gallery is a slightly complicated component, in terms of configuring props. It is capable of rendering three types of galleries: Flex, Masonry, Swiper. All of these galleries provide three ways of configuring the array of images to display:

- `images` - This accepts an array of image names. This is the most flexible option, as you are free to include any image name and are in control of the order, but requires the most work to configure.
- `sequence` - This accepts an array of numbers, which are used to generate the image paths. This is useful if you want to determine the order of images. However, the `name` of the images is fixed and must be provided. For example, if the `name` is `image`, and `sequence` is `[3, 1, 9]` the images will be `image-3.ext`, `image-1.ext`, `image-9.ext`.
- `first` and `last` - This accepts two numbers, which are used to generate the image paths. `first` is optional if the numbers start from `1`. Images will be placed from the first number to the last number. Just like `sequence`, the `name` of the images is fixed. For example, `first` is `3`, `last` is `5`, and `name` is `image`, the images will be `image-3.ext`, `image-4.ext`, `image-5.ext`.

All the images must exist in the `assets` folder of the Page Bundle. No image name should be passed with an extension. Extensions will be dynamically selected during building based on the description provided in the [Image](#image) component's documentation.

The list of available props is different for each type of gallery, and thus, the table has been separated out accordingly:

##### Available props:

###### Common:

|   Name    |                 Type                  | Required | Default  |            Description             |
|:---------:|:-------------------------------------:|:--------:|:--------:|:----------------------------------:|
| `element` | `'flex'` \| `'masonry'` \| `'swiper'` |   Yes    | `'flex'` |     Type of gallery to render      |
| `parent`  |                 Page                  |   Yes    |  `nil`   | The page whose assets are referred |

###### Configuring images:

|    Name    |     Type      |             Required              | Default |               Description                |
|:----------:|:-------------:|:---------------------------------:|:-------:|:----------------------------------------:|
|  `first`   |    Number     |     No, ignored if not `name`     |   `1`   | Number suffix to start the sequence from |
|  `images`  | Array<String> |        Yes, if not `name`         |  `nil`  |             Paths to images              |
|   `last`   |    Number     | Yes, if `name` and not `sequence` |  `nil`  |   Number suffix to end the sequence on   |
|   `name`   |    String     |       Yes, if not `images`        |  `nil`  |        Name prefix of all images         |
| `sequence` | Array<Number> |   Yes, if `name` and not `last`   |  `nil`  |     Order of images in the sequence      |

###### Flex:

This is the default gallery type if `element` prop is not supplied. It will render a flex-container with 2 images side-by-side. Every additional pair will create a new `<div>`. It is useful when having to match heights of images. This type doesn't need any additional props.

###### Masonry:

This will render a masonry gallery. It is useful when having several images and matching height is not required. This type doesn't need any additional props. It uses [`@appnest/masonry-layout` package](https://www.npmjs.com/package/@appnest/masonry-layout/) under-the-hood.

###### Swiper:

This will render a typical image gallery. It is useful when having several images and a gallery-type effect is required. This type can accept additional props. It uses [`swiper` package](https://www.npmjs.com/package/swiper) under-the-hood. The list of available parameters is available on [Swiper's API documentation](https://www.swiperjs.com/swiper-api#parameters).

|   Name    |     Type      | Required | Default |                   Description                   |
|:---------:|:-------------:|:--------:|:-------:|:-----------------------------------------------:|
| `classes` |    String     |    No    |  `""`   |     Classes to pass to `<swiper-container>`     |
| `swiper`  | SwiperOptions |    No    |  `{}`   | Swiper options as a `jsonify` compatible string |

The default options passed are:

```json
{
  "effect": "",
  "grabCursor": true,
  "preloadImages": true,
  "modules": [],
  "spaceBetween": 24,
  "speed": 500
}
```

If `effect` is `'cards'`, the following parameters are added:

```json
{
  "cardsEffect": {
    "slideShadows": false
  }
}
```

...else the following parameters are added:

```json
{
  "breakpoints": {
    "640": {
      "slidesPerView": 1
    },
    "768": {
      "slidesPerView": 2
    },
    "1024": {
      "slidesPerView": 3
    }
  }
}
```

If `modules` contains `'autoplay'`, the following parameters are added:

```json
{
  "autoplay": {
    "delay": 5000,
    "disableOnInteraction": false,
    "pauseOnMouseEnter": false
  },
  "speed": 500
}
```

##### Notes:

1. Effects are not automatically enabled by passing their names. Their CSS still needs to be imported into `./assets/css/bundle.scss` file.
2Modules need to be imported into `./assets/js/bundle.ts` file and the name that's being passed should be added as a property to `swiperModules` object. The current list of modules is:

```js
import {Autoplay, EffectCards, Navigation} from 'swiper/modules'
const swiperModules = {
  autoplay: Autoplay,
  cards: EffectCards,
  navigation: Navigation
}
```

##### Current workarounds:

1. Swiper is adding the navigation event listeners twice. Check out [this issue](https://www.github.com/nolimits4web/swiper/issues/6263) for more details. So, the navigation is being destroyed and initialized manually.

#### Heading

This a very simple component that renders a simple `<h#>` tag. This partial has been created to keep the heading size consistent throughout the website, without having to style it specifically using CSS. Ideally, this would be required only on the work pages.

##### Available props:

|  Name   |     Type      | Required | Default |                 Description                  |
|:-------:|:-------------:|:--------:|:-------:|:--------------------------------------------:|
| `level` | `3` \| `4` \| |    No    |   `3`   |          Level of heading to render          |
| `text`  |    String     |   Yes    |  `nil`  | Heading text, also gets appended as the `id` |

#### Icon

Icons are manually created and added as a property to `$icons` object in the component. Each icon should have a single path that should fill the 48px × 48px canvas completely (longest side should be 48px). The `d` attribute of the path should be added as the property value. Icons automatically take the font color (`currentColor`) as their fill. To maintain consistency, most icons are used or modified Font Awesome's Solid variant.

##### Available props:

|     Name     |  Type  | Required |     Default      |        Description         |
|:------------:|:------:|:--------:|:----------------:|:--------------------------:|
|    `name`    | String |   Yes    | `'square-xmark'` |      Name of the icon      |
|    `size`    | Number |    No    |       `4`        |    Size of icon in px/4    |

##### Available icons:

- `bars`
- `backward-step`
- `caret-down`
- `caret-right`
- `circle-arrow-left`
- `circle-arrow-right`
- `download`
- `forward-step`
- `linkedin`
- `moon`
- `square-envelope`
- `square-facebook`
- `square-instagram`
- `square-xmark`
- `sun-bright`
- `tejal`
- `xmark`

#### Image

This component is responsible for generating images used across the site. All images are lazy-loaded using the [`vanilla-lazyload` package](https://www.npmjs.com/package/vanilla-lazyload/). The component requires either the name of the image, and it chooses the extension dynamically based on the following logic:

1. First, `.jpg` is checked.
2. If it doesn't exist, `.png` is checked.
3. If it doesn't exist, `.gif` is checked.

...or the image resource itself, which is used as is.

If additional extensions are needed, the component would have to be edited accordingly.

The component would generate 2 images for each one:

1. A high quality image - If image's width is longer than 1200px, it is proportionally scaled to 1200px, else it is used as is.
2. A low quality placeholder image of 64px width, scaled proportionally. It is named as `image-low.ext`.

The images are generated as the same extension as source.

##### Available Props:

|    Name     |   Type   |      Required       | Default |            Description             |
|:-----------:|:--------:|:-------------------:|:-------:|:----------------------------------:|
| `container` |  String  |         No          |  `""`   |     Classes to pass to `<div>`     |
|   `flex`    | Boolean  |         No          |  `nil`  |      Sets image flex display       |
|   `image`   |  String  |         No          |  `""`   |    Classes to pass to `<image>`    |
|   `input`   | Resource | Yes, if not `name`  |  `nil`  |       Image resource to use        |
|   `name`    |  String  | Yes, if not `input` |  `nil`  |         Name of the image          |
|  `parent`   |   Page   |         Yes         |  `nil`  | The page whose assets are referred |

#### Tooltip

This component would be useful to show tooltips for icon buttons. This uses [`@floating-ui/dom` package](https://www.npmjs.com/package/@floating-ui/dom/) under-the-hood.

##### Available props:

|   Name   |  Type  | Required |     Default      |          Description          |
|:--------:|:------:|:--------:|:----------------:|:-----------------------------:|
| `button` | String |    No    |       `""`       | Classes to pass to `<button>` |
| `label`  | String |   Yes    |    `'Label'`     |        Text of tooltip        |
|  `name`  | String |   Yes    | `'square-xmark'` |       Name of the icon        |
|  `size`  | Number |    No    |       `4`        |     Size of icon in px/4      |

##### Notes:

1. The `name` and `size` props are inherited from the [`Icon`](#icon) component.

#### Video

The video component has a lot of specific requirements that needs manual configuration. This uses [`vidstack`](https://www.npmjs.com/package/vidstack/) and [`hls.js` package](https://www.npmjs.com/package/hls.js/) under-the-hood. Each video must have the following structure:

```text
.
└── assets/
    └── video-[n]/
        ├── video-[n]-[144-1080]p/
        │   ├── index.m3u8
        │   └── segment-[000...n].ts
        ├── video-[n].m3u8
        ├── video-[n]-cc.vtt
        ├── video-[n]-poster.jpg
        ├── video-[n]-thumbs.jpg
        └── video-[n]-thumbs.vtt
```

...where the root folder is the folder of the Page Bundle. Except the qualities and `-cc.vtt`, all files and folders are required following the same naming convention.

Video needs to be generated for HLS-compatibility. This can be generated using `ffmpeg`. Use the following shell script to generate multiple qualities of a video:

```sh
ffmpeg \
-i input.mp4 \
-sc_threshold 0 \
-keyint_min 60 \
-c:v libx264 \
-c:a aac \
-r 30 \
-g 60 \
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
-var_stream_map "v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:480p v:3,a:3,name:360p v:4,a:4,name:240p v:5,a:5,name:144p" \
-master_pl_name video-1.m3u8 \
-f hls \
-hls_time 2 \
-hls_playlist_type vod \
-hls_segment_filename video-1-%v/segment-%03d.ts \
video-1-%v/index.m3u8
```

Things to replace in the above script for each video:

  - `input.mp4` must be replaced with the absolute path of the input video.
  - Each `-s:#`, `-maxrate:#`, `-bufsize:#` and `-b:a:#` must be replaced with a 0-based sequential index, with `0` being the highest quality.
  - `-var_stream_map` must be replaced with the number of qualities.
  - `-master_pl_name video-1.m3u8` must be replaced with the name of the master playlist.
  - `video-1-%v/index.m3u8` must be replaced with the absolute path of the output destination.
  - On Windows, `\` must be replaced with `^`.

Thumbnails also need to be generated for each video. This can be done using `mtn`. The following shell script can be used to generate thumbnails for each video:

```sh
mtn -b 0.5 -c 10 -D 0 -f "/System/Library/Fonts/Supplemental/Arial.ttf" -g 0 -h 0 -i -j 100 -r 0 -s 2 -t -w 1920 --vtt input.mp4
```

Things to replace in the above script for each video:

- `input.mp4` must be replaced with the absolute path of the input video.
- On Windows, content from `-f` to before `-g` can be skipped.

The generated thumbnail file (ending with `_vtt_0_s`) might have to be renamed (the other one can be deleted). Once renamed, make sure to edit the generated `.vtt` file as well. All the references to the name of the thumbnail file must be replaced with the path to the thumbnail file relative to the `.vtt` file.

##### Available props:

|   Name   |  Type  | Required | Default |             Description             |
|:--------:|:------:|:--------:|:-------:|:-----------------------------------:|
|  `name`  | String |   Yes    |  `nil`  |   The name of the folder of video   |
| `parent` |  Page  |   Yes    |  `nil`  | The page whose assets are referred  |
| `video`  | String |    No    |  `""`   | Classes to pass to `<media-player>` |

### SEO

The site automatically adds basic SEO tags to the `<head>` of each page. This is done in `./layouts/_default/baseof.html` as explained in the [Layouts](#layouts) section. The same file is also used to generate the Open Graph meta tags and Structured Data for Google Rich Snippets. The following tags `meta` are added that could be used for SEO:

```gotemplate
<meta content="{{- .Description -}}" name="description"/>
<meta content="{{- $ogImage -}}" property="og:image"/>
<meta content="{{- $ogImageAlt -}}" property="og:image:alt"/>
<meta content="{{- $ogImage.Height -}}" property="og:image:height"/>
<meta content="image/jpeg" property="og:image:type"/>
<meta content="{{- $ogImage.Width -}}" property="og:image:width"/>
<meta content="{{- $title -}}" property="og:title"/>
<meta content="website" property="og:type"/>
<meta content="{{- .Permalink -}}" property="og:url"/>
<title>
  {{- $title -}}
</title>
```

All the variables are dynamically populated during the site's build stage using conditional logic.

- `$ogImage`: By default, the `./assets/images/og.jpg` is used as the Open Graph image for all pages. This is overridden only on project pages that have their own cover images. The generated images are automatically cropped to 1200 × 630 pixels, if either the height or width (since the height and the width is the same) is larger than 1200 pixels. If it's smaller, the largest possible image matching the aspect ratio of 1200 × 630 pixels is generated.
- `$ogImageAlt`: The default alternate text is "Open Graph cover for Tejal Shinde's portfolio". Similar to `$ogImage` this is overridden only on project pages. The text used by them is "Open Graph cover for .Title - a project by Tejal Shinde".
- `$title`: The default title is "Tejal Shinde". That is used only by the home page. All other pages use the title set in the frontmatter of the page along with " | Tejal Shinde" as the suffix.

The Structure Data is built using the following logic:

- For the home page and also the base template for all pages:

```json
{
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "WebSite",
    "name": "Tejal Shinde",
    "url": "https://tejalshinde.com/"
  }]
}
```

- For all the individual and work page, the following is appended into the above `@graph`:

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "item": "https://www.tejalshinde.com/",
    "name": "Tejal Shinde",
    "position": 1
  }, {
    "@type": "ListItem",
    "item": "{{- .Permalink -}}",
    "name": "{{- $title -}}",
    "position": 2
  }]
}
```

- For project list pages, the following is appended into the above `itemListElement`:

```json
{
  "@type": "ListItem",
  "item": "{{- .Permalink -}}",
  "name": "{{- $title -}}",
  "position": 3
}
```

- For project pages, the following is appended into the above `itemListElement`:

```json
{
  "@type": "ListItem",
  "item": "{{- .Permalink -}}",
  "name": "{{- .Title -}}",
  "position": 4
}
```

...and the following is appended to the above `@graph`:

```json
{
  "@type": "BlogPosting",
  "author": {
    "@type": "Person",
    "name": "Tejal Shinde",
    "url": "https://www.tejalshinde.com/"
  },
  "description": "{{- .Description -}}",
  "headline": "{{- $title -}}",
  "image": "{{- (.Resources.GetMatch \"assets/cover.jpg\").Permalink -}}",
  "mainEntityOfPage": {
    "@id": "{{- .Permalink -}}",
    "@type": "WebPage"
  },
  "url": "https://www.tejalshinde.com/"
}
``` 

Along with this, a `sitemap.xml` is also generated during the build time with values as per the frontmatter. Lastly, the `./layouts/robots.txt` file is used to block the 404 page from being indexed.