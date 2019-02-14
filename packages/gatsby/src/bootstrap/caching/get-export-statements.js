const parser = require(`@babel/parser`)
const traverse = require(`@babel/traverse`).default
const fs = require(`fs-extra`)
const path = require(`path`)

/*
 * handles exports.api and module.exports.api
 */
const isExport = node => {
  if (!node.object && !node.property) {
    return false
  } else if (
    node.object.name === `exports` ||
    node.property.name === `exports`
  ) {
    return true
  }

  return isExport(node.object)
}

const isRequire = node => node.callee && node.callee.name === `require`

const getRequireStatement = node => {
  const [statement] = node.arguments
  if (statement.value) {
    return statement.value
  }
  return statement.quasis[0].value.cooked
}

const getTraverser = (file, statements) => {
  const traversers = {
    "gatsby-config.js": {
      AssignmentExpression(path) {
        if (isExport(path.node.left)) {
          path.traverse({
            CallExpression(callPath) {
              if (isRequire(callPath.node)) {
                statements.push(getRequireStatement(callPath.node))
              }
            },
          })
        }
      },
    },
    "gatsby-node.js": {
      AssignmentExpression(path) {
        if (isExport(path.node.left) && isRequire(path.node.right)) {
          statements.push(getRequireStatement(path.node.right))
        }
      },
    },
  }

  const traverser = traversers[file]
  if (!traverser) {
    return null
  }

  return traverser
}

module.exports = async function getStatements(filePath) {
  try {
    const code = await fs.readFile(filePath, `utf8`)

    const ast = parser.parse(code, {
      plugins: [`flow`, `objectRestSpread`],
    })

    let statements = []

    const fileName = path.basename(filePath)
    const traverser = getTraverser(fileName, statements)

    if (!traverser) {
      return statements
    }

    traverse(ast, traverser)

    // deterministic sort by export-name
    return statements
      .map(statement => {
        if (!path.extname(statement)) {
          return `${statement}.js`
        }
        return statement
      })
      .sort()
  } catch (e) {
    return []
  }
}
