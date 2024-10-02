import fs from 'node:fs'
import path from 'node:path'
import Nunjucks from 'nunjucks'

/**
 * If there is a version conflict between a govuk-eleventy-plugin dependency
 * and the host project's dependencies, npm will include the expected version
 * in a nested node_modules folder.
 * @param {string} module - Module name
 * @returns {string} Path to module
 */
const resolveNpmModule = (module) => {
  const localPath = `./node_modules/@x-govuk/govuk-eleventy-plugin/node_modules/${module}`
  return fs.existsSync(localPath) ? localPath : `./node_modules/${module}`
}

/**
 * Configure Nunjucks environment
 * @see {@link https://mozilla.github.io/nunjucks/api.html#environment}
 * @param {object} eleventyConfig - Eleventy config
 * @returns {Function} Nunjucks environment
 */
export function nunjucksConfig(eleventyConfig) {
  const { includes, input, layouts } = eleventyConfig.dir

  const searchPaths = [
    './node_modules/@x-govuk/govuk-eleventy-plugin',
    './node_modules/@x-govuk/govuk-eleventy-plugin/lib',
    './node_modules/govuk-frontend/dist',
    resolveNpmModule('@x-govuk/govuk-prototype-components'),
    ...(includes ? [path.join(input, includes)] : []),
    ...(layouts ? [path.join(input, layouts)] : []),
    ...input
  ]

  /**
   * Set default options, but respect `nunjucksEnvironmentOptions`
   * @see {@link https://www.11ty.dev/docs/languages/nunjucks/#optional-use-your-nunjucks-environment-options}
   */
  const options = {
    autoescape: false,
    lstripBlocks: true,
    trimBlocks: true,
    noCache: process.env === 'development',
    watch: process.env === 'development',
    ...eleventyConfig.nunjucksEnvironmentOptions
  }

  const nunjucks = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader(searchPaths),
    options
  )

  return nunjucks
}
