import { EleventyHtmlBasePlugin } from '@11ty/eleventy'
import eleventyNavigation from '@11ty/eleventy-navigation'
import { eleventyComputed } from './lib/data/eleventy-computed.js'
import { defaultPluginOptions } from './lib/data/options.js'
import * as collections from './lib/collections/index.js'
import * as filters from './lib/filters/index.js'
import { generateAssets } from './lib/events/generate-govuk-assets.js'
import { md } from './lib/markdown-it.js'
import { nunjucksConfig } from './lib/nunjucks.js'
import { scssExtension } from './lib/extensions/scss.js'
import { getTemplates } from './lib/utils.js'

export default async function (eleventyConfig, pluginOptions = {}) {
  const { pathPrefix } = eleventyConfig

  // Plugin options
  const options = defaultPluginOptions(pluginOptions, pathPrefix)

  // Libraries
  eleventyConfig.setLibrary('md', md(options))
  eleventyConfig.setLibrary('njk', nunjucksConfig(eleventyConfig))

  // Extensions and template formats
  eleventyConfig.addExtension('scss', scssExtension)
  eleventyConfig.addTemplateFormats('scss')

  // Virtual templates
  const templates = await getTemplates(eleventyConfig)
  for (const [virtualPath, template] of Object.entries(templates)) {
    eleventyConfig.addTemplate(virtualPath, template)
  }

  // Collections
  for (const [name, collection] of Object.entries(collections)) {
    eleventyConfig.addCollection(name, collection)
  }

  // Filters
  for (const [name, filter] of Object.entries(filters)) {
    eleventyConfig.addFilter(name, filter)
  }

  // Global data
  eleventyConfig.addGlobalData('options', options)
  eleventyConfig.addGlobalData('eleventyComputed', eleventyComputed)

  // Passthrough
  eleventyConfig.addPassthroughCopy({
    'node_modules/govuk-frontend/dist/govuk/assets': 'assets'
  })

  // Plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin)
  eleventyConfig.addPlugin(eleventyNavigation)

  // Events
  eleventyConfig.on('eleventy.after', async ({ dir }) => {
    generateAssets(dir, options)
  })
}
