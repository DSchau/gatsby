const path = require(`path`)

const resolve = m => require.resolve(m)

const loadCachedConfig = () => {
  let pluginBabelConfig = {}
  if (process.env.NODE_ENV !== `test`) {
    pluginBabelConfig = require(path.join(
      process.cwd(),
      `./.cache/babelState.json`
    ))
  }
  return pluginBabelConfig
}

const modernConfig = {
  loose: true,
  targets: {
    esmodules: true,
  },
  useBuiltIns: false,
}

module.exports = function preset(_, options = {}) {
  if (process.env.MODERN) {
    options = modernConfig
  }

  let { targets = null, loose = true, useBuiltIns = `usage` } = options

  const pluginBabelConfig = loadCachedConfig()
  const stage = process.env.GATSBY_BUILD_STAGE || `test`

  if (!targets) {
    if (stage === `build-html` || stage === `test`) {
      targets = {
        node: `current`,
      }
    } else {
      targets = pluginBabelConfig.browserslist
    }
  }

  return {
    presets: [
      [
        resolve(`@babel/preset-env`),
        {
          loose,
          modules: stage === `test` ? `commonjs` : false,
          useBuiltIns,
          targets,
        },
      ],
      [
        resolve(`@babel/preset-react`),
        {
          useBuiltIns: true,
          pragma: `React.createElement`,
          development: stage === `develop`,
        },
      ],
    ],
    plugins: [
      [
        resolve(`@babel/plugin-proposal-class-properties`),
        {
          loose: true,
        },
      ],
      resolve(`babel-plugin-macros`),
      resolve(`@babel/plugin-syntax-dynamic-import`),
      [
        resolve(`@babel/plugin-transform-runtime`),
        {
          helpers: true,
          regenerator: true,
        },
      ],
    ],
  }
}
