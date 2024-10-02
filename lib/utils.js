import path from 'node:path'
import fs from 'node:fs/promises'

/**
 * Get file contents
 * @param {string} filePath - Path to file
 * @returns {string} File contents
 */
export async function getFileContents(filePath) {
  filePath = path.join(import.meta.dirname, '..', filePath)

  return await fs.readFile(filePath, { encoding: 'utf8' })
}

/**
 * Read contents of SCSS settings file
 * @param {object} dir - Eleventy directories
 * @param {object} options - Plugin options
 * @returns {Promise<string>} SCSS file contents
 */
export async function getScssSettings(dir, options) {
  let settings
  let settingsPath = path.join(dir.input, 'sass', '_settings.scss')

  if (options.scssSettingsPath) {
    settingsPath = path.join(dir.input, options.scssSettingsPath)
  }

  try {
    await fs.access(settingsPath, fs.constants.R_OK | fs.constants.W_OK)
    settings = fs.readFile(settingsPath)
  } catch (error) {
    if (error && options.scssSettingsPath) {
      console.error('Could not find SCSS settings at', error.path)
    }
  }

  return settings
}

/**
 * Get virtual templates
 * @param {object} eleventyConfig - Eleventy config
 * @returns {object} Template names and strings
 */
export async function getTemplates(eleventyConfig) {
  const { includes, layouts } = eleventyConfig.dir
  const layoutDir = layouts || includes
  const layoutNames = [
    'base',
    'collection',
    'feed',
    'page',
    'post',
    'product',
    'search-index',
    'sitemap',
    'sub-navigation',
    'tag',
    'tags'
  ]
  const templates = {}

  for (const name of layoutNames) {
    const templateString = await getFileContents(`lib/templates/${name}.njk`)
    templates[`${layoutDir}/${name}.njk`] = templateString
  }

  return templates
}

/**
 * Normalise value provided to a filter. Checks that a given value exists
 * before performing a transformation.
 * @param {*} value - Input value
 * @param {*} defaultValue - Value to fallback to if no value given
 * @returns {*} defaultValue
 */
export function normalise(value, defaultValue) {
  if (value === null || value === undefined || value === false) {
    return defaultValue
  }

  return value
}
