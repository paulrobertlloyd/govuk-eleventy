const path = require('node:path')
const { writeFile } = require('node:fs/promises')
const rollup = require('rollup')
const commonJs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const sass = require('sass')
const defaultConfig = require('./lib/config/defaults.js')

module.exports = function (eleventyConfig, options = {}) {
  // Libraries
  eleventyConfig.setLibrary('md', require('./lib/markdown-it.js'))
  eleventyConfig.setLibrary('njk', require('./lib/nunjucks.js')({
    views: options.views
  }))

  // Collections
  eleventyConfig.addCollection('orderedNavigation', collection => {
    return collection.getAll().sort((a, b) => {
      return (a.data.order || 0) - (b.data.order || 0)
    })
  })
  eleventyConfig.addCollection('search-index', collection => {
    return collection.getAll()
  })

  // Filters
  eleventyConfig.addFilter('date', require('./lib/filters/date.js'))
  eleventyConfig.addFilter('tokenize', require('./lib/filters/tokenize.js'))
  eleventyConfig.addFilter('items', require('./lib/filters/items.js'))
  eleventyConfig.addFilter('markdown', require('./lib/filters/markdown.js'))
  eleventyConfig.addFilter('noOrphans', require('./lib/filters/no-orphans.js'))
  eleventyConfig.addFilter('pretty', require('./lib/filters/pretty.js'))

  // Global data
  eleventyConfig.addGlobalData('config', {
    ...defaultConfig, ...options
  })

  // Sensible defaults for eleventyNavigation
  eleventyConfig.addGlobalData('eleventyComputed', {
    eleventyNavigation: {
      // Key: Use `config.homeKey` if home page, else navigation key or title
      key: data => (data.homepage)
        ? data.config.homeKey
        : data.eleventyNavigation.key || data.title,
      // Parent: If homepage `false`, else if page not excluded from collections, navigation parent or `config.homeKey`
      parent: data => (data.homepage)
        ? false
        : (!data.eleventyExcludeFromCollections)
            ? data.eleventyNavigation.parent || data.config.homeKey
            : false,
      // Excerpt: Defined navigation excerpt or page description
      excerpt: data => data.eleventyNavigation.excerpt || data.description
    }
  })

  // Pass through
  eleventyConfig.addPassthroughCopy({
    'node_modules/govuk-frontend/govuk/assets': 'assets'
  })

  // Plugins
  eleventyConfig.addPlugin(require('@11ty/eleventy-navigation'))

  // Events
  eleventyConfig.on('eleventy.after', async () => {
    // Default value for dir.output is not provided by eleventyConfig
    const outputDir = eleventyConfig.dir.output || '_site'

    // Generate CSS
    try {
      const cssFile = `${outputDir}/assets/govuk.css`
      const result = sass.compile(path.join(__dirname, './app/all.scss'), {
        loadPaths: [
          __dirname,
          './node_modules'
        ],
        quietDeps: true
      })
      writeFile(cssFile, result.css)
    } catch (error) {
      console.error(error)
    }

    // Bundle JavaScript
    try {
      const jsFile = `${outputDir}/assets/govuk.js`
      const bundle = await rollup.rollup({
        input: path.join(__dirname, './app/all.js'),
        context: 'window',
        plugins: [
          nodeResolve(),
          commonJs()
        ]
      })

      const { output } = await bundle.generate({ format: 'iife' })
      const { code } = output[0]
      writeFile(jsFile, code)
    } catch (error) {
      console.error(error)
    }
  })
}
