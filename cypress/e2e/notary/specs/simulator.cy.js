import {
  dndJackNotary,
  dndJN,
  dndDate,
  dndSignature,
  dndCheckmark,
  dndText,
  dndNotarySeal,
  dndNotaryCertificate,
  dndSignerFullName,
  dndSignerInitial,
  dndSignerSignature,
  dndSignerFreeText,
  dndWhiteoutBlock
} from "../functions/dnds"

describe("Main Page", () => {
  it("passes", () => {
    cy.visit("https://app.bluenotary.us");
  });
});

describe("Do Login", () => {
  it("Login", () => {
    cy.get("[aria-label='Email']").type("rohnotary@mailinator.com");
    cy.get("[aria-label='Password']").type("234567");
    cy.get("[type='submit'").click();
  });
  it("Check Url", () => {
    cy.url().should("include", "/notary");
  });
});

describe("Go to Simulator Page", () => {
  it("Go to", () => {
    cy.visit("https://app.bluenotary.us/pdf_edit/sessions/simulator");
  });
  it("Check Url", () => {
    cy.url().should("include", "/pdf_edit/sessions/simulator");
  });
});

describe("Do Simulation", () => {
  it("Scroll down", () => cy.get("#pdf-pages-container").scrollTo("bottom", { duration: 2000 }))
  var dataTransfer = new DataTransfer();
  dndJackNotary(dataTransfer)
  dndJN(dataTransfer)
  dndDate(dataTransfer)
  dndSignature(dataTransfer)
  dndCheckmark(dataTransfer)
  dndText(dataTransfer)
  dndNotarySeal(dataTransfer)
  dndNotaryCertificate(dataTransfer)
  dndSignerFullName(dataTransfer)
  dndSignerInitial(dataTransfer)
  dndSignerSignature(dataTransfer)
  dndSignerFreeText(dataTransfer)
  dndWhiteoutBlock(dataTransfer)
  it("Add Blank Page", () => {
    cy.get('.pdfdrgdrop > .q-btn > .q-btn__wrapper').click()
    cy.wait(1000)
    cy.get('[data-autofocus="true"] > .q-btn__wrapper > .q-btn__content').click()
  })
  dndNotarySeal(dataTransfer, false)
  it("Complete Session", () => {
    cy.get('.button').click()
    cy.wait(1000)
    cy.get('[data-autofocus="true"] > .q-btn__wrapper > .q-btn__content').click()
  })
})