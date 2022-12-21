function dndJN(dataTransfer) {
  it("DnD JN", () => {
    cy.get(".pdfdrgdrop > :nth-child(3)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndJN }