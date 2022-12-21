function dndSignerFullName(dataTransfer) {
  it("DnD Signer FullName", () => {
    cy.get(".pdfdrgdrop > :nth-child(10)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndSignerFullName }