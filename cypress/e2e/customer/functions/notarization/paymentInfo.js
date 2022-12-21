const paymentInfo = () => {
  describe("3. Payment Info", () => {
    var sessionId
    it("Check URL", () => {
      cy.url().should('include', 'payment_info').then((url) => {
        sessionId = url.split('/')[5]
        window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
      })
    });
    it("Input Card Info", () => {
      cy.get('#payment-form > .q-btn > .q-btn__wrapper').then($btn => {
        if ($btn.is(':visible')) {
          cy.wrap($btn).click()
        }
        cy.get('#cardNumber > .__PrivateStripeElement > iframe').should('be.visible').then(($iframe) => {
          const doc = $iframe.contents()
          cy.wrap(doc.find('[aria-label="Credit or debit card number"]')).type('4242424242424242', { force: true })
        })
        cy.wait(2000)
        cy.get('#cardExpiry > .__PrivateStripeElement > iframe').should('be.visible').then(($iframe) => {
          const doc = $iframe.contents()
          cy.wrap(doc.find('[aria-label="Credit or debit card expiration date"]')).type('04/24', { force: true })
        })
        cy.wait(2000)
        cy.get('#cardCvc > .__PrivateStripeElement > iframe').should('be.visible').then(($iframe) => {
          const doc = $iframe.contents()
          cy.wrap(doc.find('[aria-label="Credit or debit card CVC/CVV"]')).type('424', { force: true })
        })
      })
    })
    it("Next", () => {
      cy.scrollTo("bottom", { duration: 1000 })
      window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
      cy.get('.next-btn > .q-btn__wrapper').should('be.visible').click()
      cy.wait(10000)
    });
  })
}

module.exports = { paymentInfo }