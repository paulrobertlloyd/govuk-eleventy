---
layout: sub-navigation
order: 1
title: Get started
description: With the GOV.UK Eleventy Plugin, start writing documentation rather than spend time building a website.
---

You can use this plugin to create and publish documentation and other simple websites for users in government.

This plugin includes the following features:

- a set of [layouts](../layouts) that use [`govuk-frontend`](https://github.com/alphagov/govuk-frontend) components and styles

- includes [`markdown-it-govuk`](https://github.com/x-govuk/markdown-it-govuk) to ensure pages uses the same typography and styles as those used on GOV.UK

- support for an [extended Markdown syntax](../markdown-advanced)

- [full configuration](../options) of your website’s header and footer

- site search

- SCSS compilation (for any files with the `.scss` extension)

## Requirements

- [Node.js](https://nodejs.org) v20 or later
- [Eleventy](https://www.11ty.dev) v3 or later

[Node version manager](https://github.com/nvm-sh/nvm) is recommended if you are working across multiple projects that use different versions of Node.js.

## Installation

To install both Eleventy and this plugin, in your terminal type:

```shell
npm install @11ty/eleventy @x-govuk/govuk-eleventy-plugin
```

Next, add an `eleventy.config.js` file to the root directory of your project. This file is used to [configure Eleventy](https://www.11ty.dev/docs/config/).

```js
import govukEleventyPlugin from '@x-govuk/govuk-eleventy-plugin'

export default function(eleventyConfig) {
  // Register the plugin
  eleventyConfig.addPlugin(govukEleventyPlugin)

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      // The folder where all your content will live:
      input: 'app',
    }
  }
};
```

To generate a site, type the following command:

```shell
npx eleventy --serve
```

Once all the files have been generated, a preview URL will be shown which you can enter into your browser’s address bar:

```shell
[11ty] Copied 14 files / Wrote 0 files in 1.11 seconds (v2.0.0)
[11ty] Watching…
[11ty] Server at http://localhost:8080/
```

Whenever you add a new page, or edit an existing one, the browser will automatically refresh with any of your changes applied.

## Create a folder

You can now create a folder to contain all the content for your site. This is often called `app`. If your site is documentation for another service, then it could be named `docs`.

Whichever folder name you choose should be referenced under the `input` key within the `eleventy.config.js` file.

## Create your first page

You’re now ready to start adding pages to your site.

Pages are made up of 2 parts: a front matter and its contents.

A front matter starts and ends with `---` and is written using a key/value data format called YAML. In most cases, you will only need 2 bits of information: `layout` and `title`. For example:

```yaml
---
homepage: true
layout: page
title: My first page
---
This is my first page, built using Eleventy and `@x-govuk/govuk-eleventy-plugin`.
```

Create a file named `index.md` file within the folder you created, and add the above content.

The first page in your site should also have a `homepage` value set to `true`[^1]. This is used to work out the structure of your site if it has [nested pages](https://www.11ty.dev/docs/plugins/navigation/).

[^1]: Using `homepage: true` is equivalent to writing the following:

    ```yaml
    eleventyComputed:
      eleventyNavigation:
        key: "{% raw %}{{ config.homeKey }}{% endraw %}"
    ```

Open the preview URL in your browser to see this new page appear using GOV.UK styles.

## Choose a layout

This plugin provides {{ collections.layout | length }} different layouts, each with different options you can provide in the front matter:

{% for page in collections.layout %}

- [{{ page.data.title }}]({{ page.url }}) – {{ page.data.description }}

{% endfor %}
