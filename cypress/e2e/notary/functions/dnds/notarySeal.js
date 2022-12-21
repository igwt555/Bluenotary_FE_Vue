function dndNotarySeal(dataTransfer, close = true) {
  it("DnD Notary Seal", () => {
    cy.get(".pdfdrgdrop > :nth-child(8)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    if (close) cy.get('.delete').click()
  })
}
module.exports = { dndNotarySeal }