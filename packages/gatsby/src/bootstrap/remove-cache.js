const fs = require(`fs-extra`)
const path = require(`path`)

const CACHE_DIR = `.cache`
const EXCLUDE_PATHS = [`gatsby-source-filesystem`]

module.exports = function removeCache(program, additionalExclusions = []) {
  const base = path.join(program.directory, CACHE_DIR)

  const exclude = EXCLUDE_PATHS.concat(additionalExclusions)

  return fs
    .readdir(base)
    .then(files =>
      files
        .map(file => path.join(base, file))
        .filter(file =>
          exclude.every(excludePath => !file.includes(excludePath))
        )
    )
    .then(safeFiles => Promise.all(safeFiles.map(file => fs.remove(file))))
}
