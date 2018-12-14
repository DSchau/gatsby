import React from 'react'
import { Link, graphql } from 'gatsby'

import ClassComponent from '../components/class-component'
import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Hi people</h1>
    <p data-testid="page-component">Welcome to your new %GATSBY_SITE%</p>
    <p>Now go build something great.</p>
    <ClassComponent />
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/" data-testid="page-two">
      Go to page 2
    </Link>
    <Link to="/__non_existant_page__/" data-testid="broken-link">
      Go to a broken link
    </Link>
    <h2>Blog posts</h2>
    <ul>
      {data.posts.edges.map(({ node }) => (
        <li key={node.id}>
          <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
        </li>
      ))}
    </ul>
  </Layout>
)

export default IndexPage

export const indexQuery = graphql`
  {
    posts: allMarkdownRemark {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
