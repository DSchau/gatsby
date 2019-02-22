const webpack = require(`webpack`)
const getWebpackConfig = require(`../webpack.config`)
const { store } = require(`../../redux`)

export async function buildJavascript(program) {
  const compilerConfig = await getWebpackConfig(
    program,
    program.directory,
    `build-javascript`
  )  

  return new Promise((resolve, reject) => {
    webpack(compilerConfig).run((err, stats) => {
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
}
