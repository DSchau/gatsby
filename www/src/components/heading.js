import React, { useState } from "react"
import styled from "@emotion/styled"
import MdLink from "react-icons/lib/md/link"
import MdCheckCircle from "react-icons/lib/md/check-circle"

import copyToClipboard from "../utils/copy-to-clipboard"

import {
  colors,
  letterSpacings,
  fontWeights,
  fontSizes,
  space,
  transition,
} from "../utils/presets"

const H = styled.h1()

const Copy = props => {
  const [copied] = useState(false)
  return (
    <a
      css={styles.a}
      href={`#${props.id}`}
      onClick={async () => {
        await copyToClipboard(`${window.location.href}#${props.id}`)
      }}
      {...props}
    >
      <span
        css={{
          display: `inline-block`,
          marginRight: space[1],
          color: copied && colors.green[50],
        }}
      >
        {copied ? <MdCheckCircle /> : <MdLink />}
      </span>
      {`${copied ? `Copied` : `Copy`} URL`}
    </a>
  )
}

function BaseHeading({ children, level, id, ...rest }) {
  const Heading = H.withComponent(`h${level}`)
  return (
    <Heading
      css={Object.assign({}, styles.base, styles[level])}
      id={id}
      {...rest}
    >
      {children}
      <Copy id={id} />
    </Heading>
  )
}

BaseHeading.defaultProps = {
  level: 1,
}

const styles = {
  a: {
    display: `flex`,
    alignItems: `center`,
    cursor: `pointer`,
    fontSize: fontSizes[1],
    fontWeight: fontWeights[0],
    marginLeft: space[2],
    transition: `${transition.speed.default} ${transition.curve.default}`,
    "&&": {
      color: colors.grey[50],
    },
  },
  base: {
    alignItems: `center`,
    display: `flex`,
    letterSpacing: letterSpacings.tight,
    userSelect: `none`,
    a: {
      opacity: 0,
    },
    ":hover a": {
      opacity: 1,
    },
  },
  1: {
    fontWeight: fontWeights[2],
  },
  2: {
    marginTop: space[9],
  },
  3: {
    marginTop: space[9],
  },
  4: {
    fontSize: fontSizes[3],
  },
  5: {
    fontSize: fontSizes[3],
    fontWeight: fontWeights[0],
  },
  6: {
    fontSize: fontSizes[2],
    fontWeight: fontWeights[0],
  },
}

export default BaseHeading

export const H1 = props => <BaseHeading level={1} {...props} />
export const H2 = props => <BaseHeading level={2} {...props} />
export const H3 = props => <BaseHeading level={3} {...props} />
export const H4 = props => <BaseHeading level={4} {...props} />
export const H5 = props => <BaseHeading level={5} {...props} />
export const H6 = props => <BaseHeading level={6} {...props} />
