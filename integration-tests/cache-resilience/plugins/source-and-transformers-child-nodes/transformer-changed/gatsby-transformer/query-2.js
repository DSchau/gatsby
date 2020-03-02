module.exports = {
  query: `
    
{
  allParentChildChangeForTransformer {
    nodes {
      foo
      id
      parent {
        id
      }
      children {
        id
      }
      childChildOfParentChildChangeForTransformer {
        id
        foo
        parent {
          id
        }
        children {
          id
        }
      }
    }
  }
}

  `,
  expectedResult: {
    data: {
      allParentChildChangeForTransformer: {
        nodes: [
          {
            foo: `run-1`,
            id: `parent_childChangeForTransformer`,
            parent: null,
            children: [
              {
                id: `parent_childChangeForTransformer >>> Child`,
              },
            ],
            childChildOfParentChildChangeForTransformer: {
              id: `parent_childChangeForTransformer >>> Child`,
              foo: `bar`,
              parent: {
                id: `parent_childChangeForTransformer`,
              },
              children: [],
            },
          },
        ],
      },
    },
  },
}
