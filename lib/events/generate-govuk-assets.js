const fs = require('node:fs/promises')
const path = require('node:path')

const commonJs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const rollup = require('rollup')
const sass = require('sass')

const { getScssSettings } = require('../utils.js')

/**
 * Generate GOV.UK Frontend assets
 *
 * @param {object} dir - Project directories
 * @param {object} pathPrefix - Path prefix
 * @param {object} options - Plugin options
 * @returns {Function} Eleventy event
 */
module.exports = async function (dir, pathPrefix, options) {
  const inputFilePath = path.join(__dirname, '../govuk.scss')
  const inputFile = await fs.readFile(inputFilePath)

  // Prepend contents from GOV.UK Frontend settings file, if provided
  const settingsFile = await getScssSettings(dir, options)
  const source = [settingsFile, inputFile].join('\n')

  // Generate CSS
  try {
    const outputFile = `${dir.output}/assets/govuk.css`
    const result = sass.compileString(source, {
      loadPaths: [path.join(__dirname, '../../'), './node_modules', './'],
      quietDeps: true
    })
    fs.writeFile(outputFile, result.css)
  } catch (error) {
    console.error(error)
  }

  // Bundle JavaScript
  try {
    const jsFile = `${dir.output}/assets/govuk.js`
    const bundle = await rollup.rollup({
      input: path.join(__dirname, '../govuk.js'),
      context: 'window',
      plugins: [nodeResolve(), commonJs()]
    })

    const { output } = await bundle.generate({ format: 'iife' })
    const { code } = output[0]
    fs.writeFile(jsFile, code)
  } catch (error) {
    console.error(error)
  }
}
