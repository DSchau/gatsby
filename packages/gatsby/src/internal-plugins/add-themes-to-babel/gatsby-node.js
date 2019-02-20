const path = require(`path`)

exports.onCreateWebpackConfig = function onCreateWebpackConfig({
  actions,
  loaders,
  store,
}) {
  const { themes } = store.getState()

  // Presumes published as JavaScript
  themes.forEach(theme => {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /\.js$/,
            include: path.dirname(require.resolve(theme.themeName)),
            use: [loaders.js()],
          },
        ],
      },
    })
  })
}
