const SOURCE_PLUGIN_NAME = `source-and-transformers-child-nodes/source-changed/gatsby-source`
const TRANSFORMER_PLUGIN_NAME = `source-and-transformers-child-nodes/source-changed/gatsby-transformer`
const plugins = [SOURCE_PLUGIN_NAME, TRANSFORMER_PLUGIN_NAME]

// Both plugins in both runs. Source is changing between first and second run.
const config = [
  {
    runs: [1, 2],
    plugins,
  },
]

const nodesTest = ({
  postBuildStateFromFirstRun,
  preBootstrapStateFromSecondRun,
  postBuildStateFromSecondRun,
  compareState,
}) => {
  {
    const diff = compareState(
      postBuildStateFromFirstRun,
      preBootstrapStateFromSecondRun
    )

    expect(diff.dirtyIds).toEqual([
      `parent_parentChangeForTransformer`,
      `parent_parentChangeForTransformer >>> Child`,
    ])

    expect(
      diff.deletions[`parent_parentChangeForTransformer >>> Child`]
    ).toBeTruthy()
    expect(diff.deletions[`parent_parentChangeForTransformer`]).toBeTruthy()
  }

  {
    const diff = compareState(
      postBuildStateFromFirstRun,
      postBuildStateFromSecondRun
    )

    expect(diff.dirtyIds).toEqual([
      `parent_parentChangeForTransformer`,
      `parent_parentChangeForTransformer >>> Child`,
    ])

    expect(diff.changes[`parent_parentChangeForTransformer >>> Child`].diff)
      .toMatchInlineSnapshot(`
      "  Object {
      -   \\"bar\\": undefined,
      +   \\"bar\\": \\"run-2\\",
          \\"children\\": Array [],
      -   \\"foo\\": \\"run-1\\",
      +   \\"foo\\": undefined,
          \\"id\\": \\"parent_parentChangeForTransformer >>> Child\\",
          \\"internal\\": Object {
      -     \\"contentDigest\\": \\"603e50c1fe96279688538ab046d1d70a\\",
      +     \\"contentDigest\\": \\"f784f9722081b56fee8ca34708299a37\\",
            \\"owner\\": \\"source-and-transformers-child-nodes/source-changed/gatsby-transformer\\",
            \\"type\\": \\"ChildOfParent_ParentChangeForTransformer\\",
          },
          \\"parent\\": \\"parent_parentChangeForTransformer\\",
        }"
    `)
    expect(diff.changes[`parent_parentChangeForTransformer`].diff)
      .toMatchInlineSnapshot(`
      "  Object {
      +   \\"bar\\": \\"run-2\\",
          \\"children\\": Array [
            \\"parent_parentChangeForTransformer >>> Child\\",
          ],
      -   \\"foo\\": \\"run-1\\",
          \\"id\\": \\"parent_parentChangeForTransformer\\",
          \\"internal\\": Object {
      -     \\"contentDigest\\": \\"9d6d458358c77dbe8f4247752ebe41f0\\",
      +     \\"contentDigest\\": \\"3021b9f76357d1cffb3c40fabc9e08fb\\",
            \\"owner\\": \\"source-and-transformers-child-nodes/source-changed/gatsby-source\\",
            \\"type\\": \\"Parent_ParentChangeForTransformer\\",
          },
          \\"parent\\": null,
        }"
    `)
  }
}

module.exports = {
  config,
  plugins,
  nodesTest,
}
