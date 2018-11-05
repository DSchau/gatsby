const systemPath = require(`path`)

const tsDeclarationExtTest = /\.d\.tsx?$/
const jsonYamlExtTest = /\.(json|ya?ml)$/

function isTestFile({ base, dir }) {
  const testFileExpr = new RegExp(
    `(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$`,
    `i`
  )
  return testFileExpr.test(base) || dir === `__tests__`
}

module.exports = path => {
  // Disallow paths starting with an underscore (_) or dot (.)
  // and template-.
  // and .d.ts
  const parsedPath = systemPath.parse(path)
  return (
    parsedPath.name.slice(0, 1) !== `_` &&
    parsedPath.name.slice(0, 1) !== `.` &&
    parsedPath.name.slice(0, 9) !== `template-` &&
    !tsDeclarationExtTest.test(parsedPath.base) &&
    !jsonYamlExtTest.test(parsedPath.base) &&
    !isTestFile(parsedPath)
  )
}
