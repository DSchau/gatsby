const fs = require(`fs-extra`)
const getFileHash = require(`./get-file-hash`)

module.exports = async function possiblyInvalidateCache({
  cacheDirectory,
  program,
  plugins,
  report,
  store,
}) {
  // Check if any plugins have been updated since our last run. If so
  // we delete the cache due to possible plugin changes
  //
  // We do this by creating a hash of all the version numbers of installed
  // plugins, the site's package.json, gatsby-config.js, and gatsby-node.js.
  // The last, gatsby-node.js, is important as many gatsby sites put important
  // logic in there e.g. generating slugs for custom pages.
  const state = store.getState()
  const oldHash = state && state.status ? state.status.PLUGINS_HASH : ``
  const oldHashLookup = oldHash ? JSON.parse(oldHash) : {}
  const files = [`package.json`, `gatsby-config.js`, `gatsby-node.js`]
  const fileHashes = await Promise.all(
    files.map(file =>
      getFileHash({ file, fileHash: oldHashLookup[file], program })
    )
  ).then(hashes => hashes.map((hash, index) => [files[index], hash]))

  const hash = JSON.stringify(
    plugins
      .map(plugin => [plugin.name, plugin.version])
      .concat(fileHashes)
      .reduce((merged, [name, key]) => {
        merged[name] = key
        return merged
      }, {})
  )

  // Check if anything has changed. If it has, delete the site's .cache
  // directory and tell reducers to empty themselves.
  //
  // Also if the hash isn't there, then delete things just in case something
  // is weird.
  if (oldHash && hash !== oldHash) {
    report.info(report.stripIndent`
      One or more of your plugins have changed since the last time you ran Gatsby. As
      a precaution, we're deleting your site's cache to ensure there's not any stale
      data
    `)
  }
  if (!oldHash || hash !== oldHash) {
    try {
      // Attempt to empty dir if remove fails,
      // like when directory is mount point
      await fs.remove(cacheDirectory).catch(() => fs.emptyDir(cacheDirectory))
    } catch (e) {
      report.error(`Failed to remove .cache files.`, e)
    }
    // Tell reducers to delete their data (the store will already have
    // been loaded from the file system cache).
    store.dispatch({
      type: `DELETE_CACHE`,
    })
  }

  // Update the store with the new plugins hash.
  store.dispatch({
    type: `UPDATE_PLUGINS_HASH`,
    payload: hash,
  })

  return hash
}
