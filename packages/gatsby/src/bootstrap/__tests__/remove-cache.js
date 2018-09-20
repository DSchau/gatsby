jest.mock(`fs-extra`, () => ({
  readdir: jest.fn(),
  remove: jest.fn(),
}))

const removeCache = require(`../remove-cache`)
const fs = require(`fs-extra`)
const path = require(`path`)

beforeEach(() => {
  Object.keys(fs).forEach(key => fs[key].mockReset())
})

const setupTestRun = (files, exclusions = []) => {
  fs.readdir.mockReturnValueOnce(Promise.resolve(files))
  fs.remove.mockImplementation(() => Promise.resolve(undefined))
}

describe(`basic functionality`, () => {
  const directory = path.resolve(".")

  test(`it targets the cache directory for files to remove`, async () => {
    const files = [`random-file.js`]

    setupTestRun(files, [])

    await removeCache({ directory })

    expect(fs.remove).toHaveBeenCalledWith(expect.stringContaining(`.cache`))
  })

  test(`it removes files that do not match exclusion pattern`, async () => {
    const files = ["random-file.js"]
    setupTestRun(files, ["hello-world-i-do-not-match"])

    await removeCache({ directory })

    expect(fs.remove).toHaveBeenCalledTimes(files.length)
    expect(fs.remove).toHaveBeenLastCalledWith(
      path.join(directory, `.cache`, files[0])
    )
  })

  test(`it skips files matching exclusion pattern`, async () => {
    const files = [`gatsby-source-filesystem`]
    setupTestRun(files, files)

    await removeCache({ directory })

    expect(fs.remove).not.toHaveBeenCalled()
  })

  test(`it can be extended with custom exclusion patterns`, async () => {
    const files = [`gatsby-source-filesystem`]
    setupTestRun(files.concat(`hello-world`), files)

    await removeCache({ directory }, [`hello-world`])

    expect(fs.remove).not.toHaveBeenCalled()
  })
})
