import React from "react"
import PropTypes from "prop-types"
import Highlight, { defaultProps } from "prism-react-renderer"

import Copy from "../copy"
import normalize from "./normalize"
import { fontSizes, radii, space } from "../../utils/presets"

const getParams = (name = ``) => {
  const [lang, params = ``] = name.split(`:`)
  return [
    lang
      .split(`language-`)
      .pop()
      .split(`{`)
      .shift(),
  ].concat(
    params.split(`&`).reduce((merged, param) => {
      const [key, value] = param.split(`=`)
      merged[key] = value
      return merged
    }, {})
  )
}

const getTextToCopy = (content, language) => {
  if (language !== `diff`) {
    return content
  }
  return content
    .split(`\n`)
    .reduce((normalized, line) => {
      const char = line.charAt(0)
      if (char !== `-`) {
        normalized.push(
          line.replace(/^[-+](\s*)/, (_, spacing) => spacing.slice(1))
        )
      }
      return normalized
    }, [])
    .join(`\n`)
}

/*
 * MDX passes the code block as JSX
 * we un-wind it a bit to get the string content
 * but keep it extensible so it can be used with just children (string) and className
 */
const CodeBlock = ({
  children,
  className = children.props ? children.props.className : ``,
  copy,
}) => {
  const [language, { title = `` }] = getParams(className)
  const [content, highlights] = normalize(
    children.props && children.props.children
      ? children.props.children
      : children,
    className
  )

  return (
    <Highlight
      {...defaultProps}
      code={content}
      language={language}
      theme={undefined}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <React.Fragment>
          {title && (
            <div className="gatsby-code-title">
              <div css={{ fontSize: fontSizes[0] }}>{title}</div>
            </div>
          )}
          <div className="gatsby-highlight">
            <pre className={`language-${language}`}>
              {copy && (
                <Copy
                  fileName={title}
                  css={{
                    position: `absolute`,
                    right: space[1],
                    top: space[1],
                    borderRadius: `${radii[2]}px ${radii[2]}px`,
                  }}
                  content={getTextToCopy(content, language)}
                />
              )}
              <code className={`language-${language}`}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i })
                  const className = [lineProps.className]
                    .concat(highlights[i] && `gatsby-highlight-code-line`)
                    .filter(Boolean)
                    .join(` `)
                  return (
                    <div
                      key={i}
                      {...Object.assign({}, lineProps, {
                        className,
                      })}
                    >
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  )
                })}
              </code>
            </pre>
          </div>
        </React.Fragment>
      )}
    </Highlight>
  )
}

CodeBlock.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  className: PropTypes.string,
  copy: PropTypes.bool,
}

CodeBlock.defaultProps = {
  copy: true,
}

export default CodeBlock
