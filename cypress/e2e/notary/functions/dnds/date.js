function dndDate(dataTransfer) {
  it("DnD Date", () => {
    cy.get(".pdfdrgdrop > :nth-child(4)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndDate }