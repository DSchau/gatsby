jest.mock(`md5-file/promise`, () => jest.fn())
jest.mock(`../get-export-statements`, () => jest.fn())
const md5File = require(`md5-file/promise`)
const getExportStatements = require(`../get-export-statements`)
const getFileHash = require(`../get-file-hash`)

beforeEach(() => {
  md5File.mockReset()
  getExportStatements.mockReset()
})

describe(`initial file hash change`, async () => {
  it(`returns new hash if file hashes change`, async () => {
    const newHash = `9001` // it's over 9000

    md5File.mockResolvedValueOnce(newHash)

    expect(
      await getFileHash({
        file: `gatsby-node.js`,
        fileHash: `9000`,
        program: { directory: process.cwd() },
      })
    ).toBe(newHash)
  })

  it(`does not invoke getExportStatements`, async () => {
    md5File.mockResolvedValueOnce(`1234`)

    await getFileHash({
      file: `gatsby-node.js`,
      fileHash: `5678`,
      program: { directory: process.cwd() },
    })

    expect(getExportStatements).not.toHaveBeenCalled()
  })
})
