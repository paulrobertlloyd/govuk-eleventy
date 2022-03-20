---
layout: side-navigation
order: 1
title: Get started
description: With the GOV.UK Eleventy Plugin, start writing documentation rather than spend time building a website.
---

You can use this plugin to create and publish documentation and other simple websites for users in government.

This plugin includes the following features:

* a set of [layouts](/layouts) that use [`govuk-frontend`](https://github.com/alphagov/govuk-frontend) components and styles

* uses [`markdown-it-govuk`](https://github.com/x-govuk/markdown-it-govuk), to ensure your pages use the same typography and styles as those used on GOV.UK

* support for an [extended Markdown syntax](/markdown-advanced)

* [full configuration](/options) of your website’s header and footer

* site search

## Requirements

* [Node.js](https://nodejs.org/en/) v16
* [Eleventy](https://www.11ty.dev) v1.0.0 or above

[Node version manager](https://github.com/nvm-sh/nvm) is recommended if you are working across multiple projects that use different versions of Node.js.

## Installation

To install both Eleventy and this plugin, in your terminal type:

```shell
npm install @11ty/eleventy govuk-eleventy-plugin --save
```

Next, add an `.eleventy.js` file to the root directory of your project. This file is used to [configure Eleventy](https://www.11ty.dev/docs/config/).

```js
const govukEleventyPlugin = require('govuk-eleventy-plugin')

module.exports = function(eleventyConfig) {
  // Register the plugin
  eleventyConfig.addPlugin(govukEleventyPlugin)

  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      // Use layouts from the plugin
      layouts: 'node_modules/govuk-eleventy-plugin/app/layouts'
    }
  }
};
```

To generate a site, type the following command:

```shell
npx eleventy --serve
```

Once all the files have been generated, 2 preview URLs will be shown, either of which you can enter into your browser’s address bar:

```shell
[11ty] Copied 14 files / Wrote 0 files in 1.11 seconds (v1.0.0)
[11ty] Watching…
[Browsersync] Access URLs:
 ------------------------------------
    Local: http://localhost:8080
 External: http://192.168.178.29:8080
 ------------------------------------
[Browsersync] Serving files from: public
```

Whenever you add a new page, or edit an existing one, the browser will automatically refresh with any of your changes applied.

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
This is my first page, built using Eleventy and `govuk-eleventy-plugin`.
```

Create a file named `index.md` file to the root directory of your project, and add the above content. Only one page in your site should have a `homepage` value set to `true`.

Open the preview URL in your browser to see this new page appear using GOV.UK styles.

## Choose a layout

This plugin provides {{ collections["layout"] | length }} different layouts, each with different options you can provide in the front matter:

{% for page in collections["layout"] %}

* [{{ page.data.title }}]({{ page.url | url }}) – {{ page.data.description }}

{% endfor %}
