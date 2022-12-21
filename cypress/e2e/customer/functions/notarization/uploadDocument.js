const fileName = 'cypress.pdf'
const uploadDocument = () => {
  describe("1. Upload Document", () => {
    var sessionId = ''
    it("Go to Notarization Page", () => {
      cy.visit("https://app.bluenotary.us/business/prepare_doc/")
    })
    it("Check URL", () => {
      cy.url().should('include', '/?demo=true').then((url) => {
        sessionId = url.split('/')[5]
        window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
      })
    })
    it("Check URL", () => {
      cy.url().should('include', 'prepare_doc').then((url) => {
        sessionId = url.split('/')[5]
        window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
      })
    })
    it('Upload Document', () => {
      cy.scrollTo("bottom", { duration: 1000 })
      cy.get('.q-field__input.fit.absolute-full',).selectFile(`cypress/fixtures/${fileName}`,
        { force: true, action: 'drag-drop' });
    });
    it('Check if uploaded', () => {
      cy.get('.space-8 > span').should('have.text', fileName);
    });
    it('Next', () => {
      cy.wait(2000)
      window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
      cy.get('.next-btn > .q-btn__wrapper').click();
    })
  });
}
module.exports = { uploadDocument }