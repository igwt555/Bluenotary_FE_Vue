function dndSignerFreeText(dataTransfer) {
  it("DnD Signer Free Text", () => {
    cy.get(".pdfdrgdrop > :nth-child(13)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndSignerFreeText }