function dndCheckmark(dataTransfer) {
  it("DnD Checkmark", () => {
    cy.get(".pdfdrgdrop > :nth-child(6)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndCheckmark }