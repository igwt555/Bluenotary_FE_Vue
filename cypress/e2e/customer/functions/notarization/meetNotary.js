const meetNotary = () => {
  describe("4. Meet Notary", () => {
    var sessionId
    it("Check URL", () => {
      cy.url().should('include', 'meet_notary').then((url) => {
        sessionId = url.split('/')[5]
        window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
      })
    })
    it("Start Video Meeting", () => {
      cy.get('.q-pa-md.text-center > .q-btn > .q-btn__wrapper').click()
      cy.wait(5000)
      cy.get('.q-card__section').should('be.visible')
      cy.get('.q-card .q-card__actions button:nth-child(2)').click()
      cy.wait(5000)
    })
    it("Check session URL", () => {
      cy.url().should(`include`, `pdf_edit/sessions/${sessionId}`)
    })
  })
}
module.exports = { meetNotary }