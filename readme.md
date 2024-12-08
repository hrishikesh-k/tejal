## Tejal Shinde v9.x.x

This repository holds the source code for [Tejal Shinde's portfolio](https://www.tejalshinde.com/) (hosted on [Netlify](https://www.netlify.com/)). It's the 9<sup>th</sup> iteration of the website, this one being built with [Astro](https://www.astro.build/).

Note that, this is not a theme for Astro. It is a standalone website, which uses Astro as a Static Site Generator (SSG). Thus, if you wish to use this as a template, you will most likely have to directly modify the source code. This document tries to cover all the (important) aspects of the website, and should be enough to get you started.

### Directory structure

The directory structure is as follows (with the explanation following the diagram):

```text
.
├── public/
│   ├── 785dfe191d5146e0a0e852fa5003303e.txt
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/
│   |   └── [slug]
│   ├── components/
│   |   ├── astro/
│   |   └── svelte/
│   ├── content/
│   ├── layouts/
│   |   └── base.astro
│   ├── pages/
│   ├── utils/
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

```shell
ffmpeg -i ./video.mp4 -vf "fps=0.5,scale=192:-1,tile=10x<rows>" -frames:v 1 -q:v 1 -update 1 ./thumbs.jpg
```
