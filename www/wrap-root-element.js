import React from "react"
import { MDXProvider } from "@mdx-js/react"
import GuideList from "./src/components/guide-list.js"
import HubspotForm from "./src/components/hubspot-form"
import Pullquote from "./src/components/shared/pullquote"
import DateChart from "./src/components/chart"
import CodeBlock from "./src/components/code-block"

import { H1, H2, H3, H4, H5, H6 } from "./src/components/heading"

const components = {
  GuideList,
  HubspotForm,
  DateChart,
  Pullquote,

  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,

  pre: CodeBlock,
}

export default ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
)
