function dndNotaryCertificate(dataTransfer) {
  it("DnD Notary Certificate", () => {
    cy.get(".pdfdrgdrop > :nth-child(9)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.innerTopSignatureCard').click()
    cy.get('.text-primary > .q-btn__wrapper').click()
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndNotaryCertificate }