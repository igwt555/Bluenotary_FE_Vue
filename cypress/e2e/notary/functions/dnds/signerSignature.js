function dndSignerSignature(dataTransfer) {
  it("DnD Signer Signature", () => {
    cy.get(".pdfdrgdrop > :nth-child(12)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndSignerSignature }