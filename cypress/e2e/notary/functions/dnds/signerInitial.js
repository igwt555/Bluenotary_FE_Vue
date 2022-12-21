function dndSignerInitial(dataTransfer) {
  it("DnD Signer Initial", () => {
    cy.get(".pdfdrgdrop > :nth-child(11)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndSignerInitial }