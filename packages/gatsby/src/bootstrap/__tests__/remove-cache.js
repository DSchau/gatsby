jest.mock(`fs-extra`, () => {
  return {
    readdir: jest.fn(),
    remove: jest.fn(),
  }
})

const removeCache = require(`../remove-cache`)
const fs = require(`fs-extra`)
const path = require(`path`)

const CACHE_DIR = `caches`

beforeEach(() => {
  Object.keys(fs).forEach(key => fs[key].mockReset())
})

const setupTestRun = files => {
  fs.readdir.mockReturnValueOnce(Promise.resolve(files))
  fs.remove.mockImplementation(() => Promise.resolve(undefined))
}

describe(`basic functionality`, () => {
  const directory = path.resolve(`.`)

  it(`it targets the cache directory for files to remove`, async () => {
    const files = [`random-file.js`]

    setupTestRun(files, [])

    await removeCache(directory)

    expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining(`.cache`))
  })

  it(`it ignores files that do not match exclusion pattern`, async () => {
    const files = [`random-file.js`]
    setupTestRun(files, [`hello-world-i-do-not-match`])

    await removeCache(directory)

    expect(fs.remove).toHaveBeenCalledTimes(files.length)
    expect(fs.remove).toHaveBeenLastCalledWith(
      path.join(directory, `.cache`, files[0])
    )
  })

  it(`it ignores cached files from createRemoteFileNode`, async () => {
    const ignored = [
      `gatsby-source-filesystem`,
      `gatsby-transformer-remark`,
    ].map(file => path.join(CACHE_DIR, file))
    const deleted = [`sample.js`, `hi.js`]
    const files = ignored.concat(deleted)

    setupTestRun(files)

    await removeCache(directory)
    expect(fs.remove).toHaveBeenCalledTimes(deleted.length)

    ignored.forEach(file => {
      expect(fs.remove).not.toHaveBeenCalledWith(
        path.join(directory, `.cache`, file)
      )
    })
  })

  it(`it skips files matching exclusion pattern`, async () => {
    const files = [`gatsby-source-filesystem`].map(file =>
      path.join(CACHE_DIR, file)
    )
    setupTestRun(files, files)

    await removeCache(directory)

    expect(fs.remove).not.toHaveBeenCalled()
  })
})
