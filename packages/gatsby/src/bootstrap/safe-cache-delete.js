const fs = require(`fs-extra`)
const path = require(`path`)

const CACHE_DIR = `.cache`
const EXCLUDE_PATHS = [
  `gatsby-source-filesystem`
]

module.exports = (program, additionalExclusions = []) => {
  const base = path.join(program.directory, CACHE_DIR)

  const exclude = EXCLUDE_PATHS.concat(additionalExclusions)
    .map(excludePath => path.join(base, excludePath))

  return fs.readdir(base)
    .then(files => {
      return files.filter(file => {
        return !EXCLUDE_PATHS.some(excludePath => file.startsWith(excludePath))
      })
    })
    .then(files => Promise.all(
      files.map(file => fs.remove(file))
    ))
}