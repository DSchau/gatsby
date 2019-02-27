const { gatsbyConfigSchema } = require(`../joi`)

describe(`gatsby config`, () => {
  it(`strips trailing slashes from url fields`, async () => {
    const config = {
      pathPrefix: `/blog///`,
      assetPrefix: `https://cdn.example.com/`,
    }

    expect(await gatsbyConfigSchema.validate(config)).toEqual({
      pathPrefix: `/blog`,
      assetPrefix: `https://cdn.example.com`,
    })
  })

  it(`allows assetPrefix to be full URL`, async () => {
    const config = {
      assetPrefix: `https://cdn.example.com`,
    }

    expect(await gatsbyConfigSchema.validate(config)).toEqual(config)
  })

  it(`allows relative paths for url fields`, async () => {
    const config = {
      pathPrefix: `/blog`,
      assetPrefix: `/assets`,
    }

    expect(await gatsbyConfigSchema.validate(config)).toEqual(config)
  })

  it(`does not allow pathPrefix to be full URL`, () => {
    const config = {
      pathPrefix: `https://google.com`,
    }

    expect(
      gatsbyConfigSchema.validate(config)
    ).rejects.toThrowErrorMatchingSnapshot()
  })
})
