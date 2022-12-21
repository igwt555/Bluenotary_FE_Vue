function dndWhiteoutBlock(dataTransfer) {
  it("DnD Whiteout Block", () => {
    cy.get(".pdfdrgdrop > :nth-child(14)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndWhiteoutBlock }