function dndText(dataTransfer) {
  it("DnD Text", () => {
    cy.get(".pdfdrgdrop > :nth-child(7)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('textarea').type("Notary Text")
    cy.wait(2000)
    cy.get('.delete').click()
  })
}
module.exports = { dndText }