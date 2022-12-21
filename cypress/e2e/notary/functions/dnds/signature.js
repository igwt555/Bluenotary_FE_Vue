function dndSignature(dataTransfer) {
  it("DnD Signature", () => {
    cy.get(".pdfdrgdrop > :nth-child(5)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get(':nth-child(1) > .innerTopSignatureCard > .innerSignatureCard').click()
    cy.get('.text-primary > .q-btn__wrapper').click()
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndSignature }