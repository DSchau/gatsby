const DEPRECATED_METHOD = `boundActionCreators`
const METHOD = `actions`

module.exports = (file, api, options) => {
  const j = api.jscodeshift
  const root = j(file.source)

  const pattern = root.find(j.Identifier, {
    name: DEPRECATED_METHOD,
  })

  if (!pattern.length) {
    return false
  }

  pattern.replaceWith(({ node }) => {
    node.name = METHOD
    return node
  })

  return root.toSource({ quote: `single` })
}
