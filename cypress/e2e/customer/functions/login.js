const login = () => {
  describe("Start Customer Profile", () => {
    it("Go to BlueNotary", () => {
      cy.visit("https://app.bluenotary.us");
    });
    it("Check if logged in", () => {
      cy.url().then((url) => {
        if (url.indexOf('sign-in') >= 0) {
          cy.get("[aria-label='Email']").type("rohcustomer@mailinator.com");
          cy.get("[aria-label='Password']").type("234567");
          cy.get("button").click();
        }
      });
    })
    it("Check Dashboard", () => {
      cy.wait(5000)
      cy.url().should('include', '/business')
    })
  });
}

module.exports = { login }