const md = require('../markdown-it.js')
const normalise = require('../utils.js')

/**
 * Convert Markdown into GOV.UK Frontend-compliant HTML
 *
 * @param {String} string Markdown
 * @param {String} value If `inline`, renders HTML without paragraph tags
 * @return {String} HTML
 *
 */
module.exports = (string, value) => {
  string = normalise(string, '')

  if (value === 'inline') {
    return md.renderInline(string)
  }

  return md.render(string)
}
