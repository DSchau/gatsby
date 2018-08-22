const tests = [
  `destructured`,
  `non-destructured`,
]

const defineTest = require(`jscodeshift/dist/testUtils`).defineTest

describe(`codemods`, () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      `bound-action-creators`,
      null,
      `bound-action-creators/${test}`
    )
  )
})
