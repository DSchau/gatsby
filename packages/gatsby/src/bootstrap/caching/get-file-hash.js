const path = require(`path`)
const md5File = require(`md5-file/promise`)

const getExportStatements = require(`./get-export-statements`)

module.exports = async function configFileChanged({ file, fileHash, program }) {
  const filePath = path.join(program.directory, file)

  const hash = await md5File(filePath).catch(() => ``)

  const [existingFileHash] = fileHash

  // simple case; file content changed, let's invalidate
  if (existingFileHash && hash !== existingFileHash) {
    return hash
  }

  const exportStatements = await getExportStatements(filePath)

  // hash didn't change, no export statements, this file hasn't changed
  if (exportStatements.length === 0) {
    return hash
  }

  // return an array of hashes, sorted alphanumerically
  const hashes = await Promise.all(
    exportStatements.map(statement =>
      md5File(path.join(program.directory, statement))
    )
  )

  return [hash].concat(hashes)
}
