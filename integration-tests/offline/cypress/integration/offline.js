describe(`Production offline`, () => {
  beforeEach(() => {
    cy.visit(`/`).waitForRouteChange()
  })

  it(`returns 200 on base route`, () => {
    cy.location(`pathname`).should(`eq`, `/`)
  })

  it('registers service worker', () => {
    console.log('hellooo')
  })
})
