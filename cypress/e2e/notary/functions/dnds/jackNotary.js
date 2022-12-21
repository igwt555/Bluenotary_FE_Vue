function dndJackNotary(dataTransfer) {
  it("DnD JackNotary", () => {
    cy.get(".pdfdrgdrop > :nth-child(2)").trigger("dragstart", { dataTransfer })
    cy.get('#pdf-pages-container').trigger('drop', { dataTransfer });
    cy.wait(3000)
    cy.get('.delete').click()
  })
}
module.exports = { dndJackNotary }