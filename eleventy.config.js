import process from 'node:process'
import rssPlugin from '@11ty/eleventy-plugin-rss'
import govukPlugin from './index.js'

export default function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(rssPlugin)

  eleventyConfig.addPlugin(govukPlugin, {
    icons: {
      mask: 'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-mask-icon.svg?raw=true',
      shortcut:
        'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-favicon.ico',
      touch:
        'https://raw.githubusercontent.com/x-govuk/logo/main/images/x-govuk-apple-touch-icon.png'
    },
    opengraphImageUrl:
      'https://x-govuk.github.io/govuk-eleventy-plugin/assets/opengraph-image.png',
    homeKey: 'GOV.UK Eleventy Plugin',
    titleSuffix: 'GOV.UK Eleventy Plugin',
    parentSite: {
      url: 'https://x-govuk.github.io/#projects',
      name: 'X-GOVUK projects'
    },
    url:
      process.env.GITHUB_ACTIONS &&
      'https://x-govuk.github.io/govuk-eleventy-plugin/',
    stylesheets: ['/assets/application.css'],
    header: {
      logotype: 'x-govuk',
      productName: 'Eleventy Plugin',
      search: {
        indexPath: '/search.json',
        sitemapPath: '/sitemap'
      }
    },
    headingPermalinks: true,
    footer: {
      contentLicence: {
        html: 'Licensed under the <a class="govuk-footer__link" href="https://github.com/x-govuk/govuk-eleventy-plugin/blob/main/LICENSE.txt">MIT Licence</a>, except where otherwise stated'
      },
      copyright: {
        text: '© X-GOVUK'
      },
      meta: {
        items: [
          {
            href: 'https://www.11ty.dev',
            text: 'Documentation for Eleventy (opens in a new tab)',
            attributes: {
              target: '_blank'
            }
          }
        ]
      }
    }
  })

  // Collections
  eleventyConfig.addCollection('layout', (collection) =>
    collection
      .getFilteredByGlob(['docs/layouts/*.md'])
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  )
  eleventyConfig.addCollection('homepage', (collection) =>
    collection
      .getFilteredByGlob([
        'docs/options.md',
        'docs/design.md',
        'docs/layouts.md'
      ])
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  )
  eleventyConfig.addCollection('upgrading', (collection) =>
    collection
      .getFilteredByGlob(['docs/upgrading/*.md'])
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  )

  // Passthrough
  eleventyConfig.addPassthroughCopy('./docs/assets')

  // Watch
  eleventyConfig.addWatchTarget('./components/')
  eleventyConfig.addWatchTarget('./lib/')

  // Config
  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'docs'
    },
    pathPrefix: process.env.GITHUB_ACTIONS && '/govuk-eleventy-plugin/'
  }
}
