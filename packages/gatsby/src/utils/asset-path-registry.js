const path = require(`path`)
const fs = require(`fs-extra`)

let assets = new Set()

const normalize = filePath => filePath.split(`/`).join(path.sep)

exports.normalize = normalize

exports.register = function register(file) {
  if (file) {
    assets.add(normalize(file))
  }
  return assets
}

exports.remove = function remove(file) {
  assets.delete(normalize(file))
  return assets
}

exports.clear = function clear() {
  assets.clear()

  return assets
}

exports.getAssets = async function getAssets(
  directory,
  assetsDirectory = `public`
) {
  const webpackStats = path.join(
    directory,
    assetsDirectory,
    `webpack.stats.json`
  )
  let webpackAssets
  try {
    const { namedChunkGroups = {} } = await fs
      .readFile(webpackStats, `utf8`)
      .then(data => JSON.parse(data))

    webpackAssets = Object.keys(namedChunkGroups).reduce(
      (merged, chunkName) => {
        const group = namedChunkGroups[chunkName]
        group.assets.forEach(asset => {
          merged.add(asset)
        })
        return merged
      },
      new Set()
    )
  } catch (e) {
    webpackAssets = new Set()
  }

  return new Set(
    [...assets, ...webpackAssets].map(assetPath =>
      path.join(assetsDirectory, normalize(assetPath))
    )
  )
}
