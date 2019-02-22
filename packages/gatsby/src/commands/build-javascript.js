const webpack = require(`webpack`)
const getWebpackConfig = require(`../utils/webpack.config`)

const build = config =>
  new Promise((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        reject(err)
        return
      }

      const jsonStats = stats.toJson()
      if (jsonStats.errors && jsonStats.errors.length > 0) {
        reject(jsonStats.errors)
        return
      }

      resolve()
    })
  })

module.exports = async program => {
  const compilerConfig = await getWebpackConfig(
    program,
    program.directory,
    `build-javascript`
  )

  await build(compilerConfig)
}
