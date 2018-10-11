const path = require(`path`)
const md5File = require(`md5-file/promise`)
const _ = require(`lodash`)

module.exports = async function getChangedPlugins({
  additional = [],
  directory,
  plugins = [],
  existingPlugins,
} = {}) {
  existingPlugins = existingPlugins || {}

  const pluginsWithVersions = plugins.reduce((merged, plugin) => {
    merged[plugin.name] = plugin.version
    return merged
  }, {})

  const hashes = await Promise.all(
    additional.map(file =>
      md5File(path.join(directory, file))
        .catch(() => ``)
        .then(md5 => [md5, file])
    )
  ).then(fileHashes =>
    fileHashes.reduce((all, [md5, file]) => {
      all[file] = md5
      return all
    }, pluginsWithVersions)
  )

  return _.uniq(
    Object.keys(hashes)
      .concat(Object.keys(existingPlugins || {}))
      .filter(file => hashes[file] !== existingPlugins[file])
  )
}
