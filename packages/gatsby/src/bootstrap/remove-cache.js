const fs = require(`fs-extra`)
const path = require(`path`)

const CACHE_DIR = `.cache`
const EXCLUDE = `caches`

module.exports = function removeCache(directory) {
  const base = path.join(directory, CACHE_DIR)

  return fs
    .readdir(base)
    .then(files =>
      files
        .filter(file => !file.includes(EXCLUDE))
        .map(file => path.join(base, file))
    )
    .then(safeFiles => Promise.all(safeFiles.map(file => fs.remove(file))))
}
