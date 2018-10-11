const fs = require(`fs-extra`)
const path = require(`path`)

const CACHE_DIR = `.cache`
const EXCLUDE = `caches`

const removeFiles = ({ base, filter }) => {
  return fs
    .readdir(base)
    .then(files => files.filter(filter).map(file => path.join(base, file)))
    .then(files => Promise.all(files.map(file => fs.remove(file))))
}

module.exports = async function removeCache(directory, pluginsToRemove = []) {
  const base = path.join(directory, CACHE_DIR)
  const cachesDir = path.join(base, EXCLUDE)

  await removeFiles({ base, filter: file => !file.includes(EXCLUDE) })

  if (pluginsToRemove.length > 0) {
    await removeFiles({
      base: cachesDir,
      filter: file => pluginsToRemove.includes(file),
    })
  }
}
