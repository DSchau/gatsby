jest.mock(`fs-extra`, () => {
  const fs = jest.requireActual(`fs-extra`)
  return {
    ...fs,
    readFile: jest.fn(),
  }
})
const getExportStatements = require(`../get-export-statements`)
const fs = require(`fs-extra`)
const path = require(`path`)

let fixtures
beforeAll(() => {
  fs.readFile.mockClear()
  const base = path.join(__dirname, `fixtures`)
  const files = fs.readdirSync(base)

  fixtures = files.reduce((merged, file) => {
    merged[file.split(`.`).shift()] = fs.readFileSync(
      path.join(base, file),
      `utf8`
    )
    return merged
  }, {})

  fs.readFile.mockRestore()
})

describe(`general behavior`, () => {
  it(`returns empty array with invalid file`, async () => {
    fs.readFile.mockResolvedValueOnce(fixtures.config_invalid)

    expect(await getExportStatements(`gatsby-config.js`)).toEqual([])
  })

  it(`returns empty array with non-gatsby file`, async () => {
    fs.readFile.mockResolvedValueOnce(`{}`)

    expect(await getExportStatements(`package.json`)).toEqual([])
  })

  it(`returns statements with single quote and template literal`, async () => {
    fs.readFile
      .mockResolvedValue(fixtures.node_with_exports)
      .mockResolvedValue(fixtures.node_with_exports_single_quote)

    const [uno, dos] = await Promise.all([
      getExportStatements(`gatsby-node.js`),
      getExportStatements(`gatsby-node.js`),
    ])

    expect(uno).toEqual(dos)
  })
})

describe(`gatsby-config.js`, () => {
  it(`gets expected require statements when present`, async () => {
    fs.readFile.mockResolvedValueOnce(fixtures.config_with_exports)

    const statements = await getExportStatements(`gatsby-config.js`)

    expect(statements).toEqual([
      `./gatsby/plugins.js`,
      `./gatsby/site-metadata.js`,
    ])
  })

  it(`returns empty array without require statements`, async () => {
    fs.readFile.mockResolvedValueOnce(fixtures.config_without_exports)

    expect(await getExportStatements(`gatsby-config.js`)).toEqual([])
  })
})

describe(`gatsby-node.js`, () => {
  it(`gets expected require statements when using exports`, async () => {
    fs.readFile.mockResolvedValueOnce(fixtures.node_with_exports)

    const statements = await getExportStatements(`gatsby-node.js`)

    expect(statements).toEqual([
      `./gatsby/create-pages.js`,
      `./gatsby/on-create-node.js`,
    ])
  })

  it(`gets expected require statements when using module.exports`, async () => {
    fs.readFile.mockResolvedValueOnce(fixtures.node_with_module_exports)

    const statements = await getExportStatements(`gatsby-node.js`)

    expect(statements).toEqual([
      `./gatsby/create-pages.js`,
      `./gatsby/on-create-node.js`,
    ])
  })

  it(`returns empty array without require statements`, async () => {
    fs.readFile.mockResolvedValueOnce(fixtures.node_without_module_exports)

    expect(await getExportStatements(`gatsby-node.js`)).toEqual([])
  })
})
