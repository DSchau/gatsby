jest.mock(`md5-file/promise`, () => jest.fn())
const md5File = require(`md5-file/promise`)

const getChangedPlugins = require(`../get-changed-plugins`)

beforeEach(() => {
  md5File.mockReset()
})

describe(`getting plugin diff`, () => {
  it(`returns empty array if existing and updated are empty`, async () => {
    const changes = await getChangedPlugins({ directory: `.`, plugins: [] })

    expect(changes).toEqual([])
  })

  describe(`comparing plugins`, () => {
    const plugins = [`gatsby-transformer-remark`, `gatsby-plugin-offline`].map(
      name => ({
        name,
        version: `1.0.0`,
      })
    )

    const updateVersions = (arr, ...items) =>
      arr.map(item => {
        const updated = items.find(update => update.name === item.name)
        return updated || item
      })

    const getExistingPlugins = plugins =>
      plugins.reduce((merged, plugin) => {
        merged[plugin.name] = plugin.version
        return merged
      }, {})

    it(`returns empty array without plugins change(s)`, async () => {
      const changes = await getChangedPlugins({
        plugins,
        existingPlugins: getExistingPlugins(plugins),
      })

      expect(changes).toEqual([])
    })

    it(`returns plugin that changes version`, async () => {
      const expected = `gatsby-transformer-remark`
      const updated = updateVersions(plugins, {
        name: expected,
        version: `2.0.0`,
      })

      const changes = await getChangedPlugins({
        plugins: updated,
        existingPlugins: getExistingPlugins(plugins),
      })

      expect(changes).toEqual([expected])
    })

    it(`returns multiple plugins, if multiple version changes`, async () => {
      const expected = [
        {
          name: `gatsby-transformer-remark`,
          version: `2.0.0`,
        },
        {
          name: `gatsby-plugin-offline`,
          version: `2.0.0`,
        },
      ]
      const updated = updateVersions(plugins, ...expected)

      const changes = await getChangedPlugins({
        plugins: updated,
        existingPlugins: getExistingPlugins(plugins),
      })

      expect(changes).toEqual(expected.map(plugin => plugin.name))
    })

    it(`returns changes if plugin was added`, async () => {
      const newPlugin = { name: `gatsby-hello`, version: `this-isnt-semver` }
      const updated = [newPlugin].concat(plugins)
      const changes = await getChangedPlugins({
        plugins: updated,
        existingPlugins: getExistingPlugins(plugins),
      })

      expect(changes).toEqual([newPlugin.name])
    })

    it(`returns changes if plugin was removed`, async () => {
      const expected = `gatsby-transformer-remark`
      const updated = plugins
        .slice(0)
        .filter(plugin => plugin.name !== expected)
      const changes = await getChangedPlugins({
        plugins: updated,
        existingPlugins: getExistingPlugins(plugins),
      })

      expect(changes).toEqual([expected])
    })
  })

  describe(`md5 caching`, () => {
    const hash = `_ha_pretend_this_is_md5`
    it(`returns empty array if no change to core files hash`, async () => {
      md5File.mockImplementation(() => Promise.resolve(hash))
      const existing = { "gatsby-node.js": hash }
      const changes = await getChangedPlugins({
        additional: [`gatsby-node.js`],
        directory: `.`,
        existingPlugins: existing,
      })

      expect(changes).toEqual([])
    })

    it(`returns array of changed core files, if hash change`, async () => {
      md5File.mockImplementation(() =>
        Promise.resolve(`__UNIQUE_HASH_TRUST_ME__`)
      )

      const existing = { "gatsby-node.js": hash }
      const additional = Object.keys(existing)
      const changes = await getChangedPlugins({
        additional,
        directory: `.`,
        existingPlugins: existing,
      })

      expect(changes).toEqual(additional)
    })

    it(`returns multiple files, if multiple file changes`, async () => {
      md5File.mockImplementation(() =>
        Promise.resolve(`__ANOTHER_UNIQUE_HASH__`)
      )
      const existing = {
        "gatsby-node.js": `${hash}100`,
        "gatsby-config.js": `whateva`,
      }
      const additional = Object.keys(existing)

      const changes = await getChangedPlugins({
        additional,
        directory: `.`,
        existingPlugins: existing,
      })

      expect(changes).toEqual(additional)
    })

    it(`returns changes, if file was deleted`, async () => {
      const deleted = `gatsby-node.js`
      const existing = { [deleted]: hash }

      md5File.mockImplementation(() => Promise.reject(`NOT FOUND`))

      const additional = Object.keys(existing)
      const changes = await getChangedPlugins({
        additional,
        directory: `.`,
        existingPlugins: existing,
      })

      expect(changes).toEqual([deleted])
    })

    it(`returns changes, if file was added`, async () => {
      md5File.mockImplementation(() => Promise.resolve(hash))
      const added = `gatsby-node.js`

      const additional = [added]
      const changes = await getChangedPlugins({ additional, directory: `.` })

      expect(changes).toEqual(additional)
    })
  })
})
