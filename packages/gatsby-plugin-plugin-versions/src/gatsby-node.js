const fs = require(`fs-extra`)

exports.onPostBuild = async function onPostBuild({ graphql }) {
  const result = await graphql(`
    plugins: allSitePlugin {
      edges {
        node {
          name
          version
        }
      }
    }
  `)
}
