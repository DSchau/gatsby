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

// TODO: benchmark array of configs vs. running serially
// TODO: benchmark Promise.all vs. serial
module.exports = async program => {
  const compilerConfig = await getWebpackConfig(
    program,
    program.directory,
    `build-javascript`
  )

  await build(compilerConfig)

  if (program.legacy === false) {
    console.log(`building second bundle`)
    await build(
      await getWebpackConfig(
        {
          ...program,
          legacy: true,
        },
        program.directory,
        `build-javascript`
      )
    )
  }
}
