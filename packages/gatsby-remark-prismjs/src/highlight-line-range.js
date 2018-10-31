const COMMENT_START = /(#|\/\/|\{\/\*|\/\*+|<!--)/
const COMMENT_END = /(-->|\*\/\}|\*\/)?/
const DIRECTIVE = /highlight-(next-line|line|start|end)/
const END_DIRECTIVE = /highlight-end/

const stripComment = line =>
  line.replace(
    new RegExp(
      `\\s*${COMMENT_START.source}\\s*${DIRECTIVE.source}\\s*${
        COMMENT_END.source
      }`
    ),
    ""
  )

const getHighlights = (line, code, index) => {
  const [, directive] = line.match(DIRECTIVE)
  switch (directive) {
    case "next-line":
      return [
        {
          code: code[index + 1],
          highlighted: true,
        },
        index + 1,
      ]
    case "start":
      const endIndex = code.findIndex(line => END_DIRECTIVE.test(line))
      const end = endIndex === -1 ? code.length : endIndex
      const highlighted = code.slice(index + 1, end).map(line => ({
        code: stripComment(line),
        highlighted: true,
      }))

      return [highlighted, end]
    case "line":
    default:
      return [
        {
          code: stripComment(line),
          highlighted: true,
        },
        index,
      ]
  }
}

module.exports = function highlightLineRange(code, highlights = []) {
  let highlighted = []
  const split = code.split("\n")

  if (highlights.length > 0) {
    return split.map((line, i) => {
      if (highlights.includes(i + 1)) {
        return {
          highlighted: true,
          code: line,
        }
      }
      return { code: line }
    })
  }

  for (let i = 0; i < split.length; i++) {
    const line = split[i]
    if (DIRECTIVE.test(line)) {
      const [highlights, index] = getHighlights(line, split, i)
      highlighted = highlighted.concat(highlights)
      i = index
    } else {
      highlighted.push({
        code: line,
      })
    }
  }

  return highlighted
}
