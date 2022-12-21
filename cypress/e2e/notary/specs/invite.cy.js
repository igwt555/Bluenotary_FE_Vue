import { randomDigitString } from "../../common/utils";

describe("Main Page", () => {
  it("passes", () => {
    cy.visit("https://app.bluenotary.us");
  });
});
describe("Do Login", () => {
  it("passes", () => {
    cy.get("[aria-label='Email']").type("rohnotary@mailinator.com");
    cy.get("[aria-label='Password']").type("234567");
    cy.get("[type='submit'").click();
  });
});
describe("Check Dashboard URL", () => {
  it("passes", () => {
    cy.url().should("include", "/notary");
  });
});
describe("Go to Invite Page", () => {
  it("passes", () => {
    cy.visit("https://app.bluenotary.us/notary/invite");
  });
});
describe("Check Invite Page URL", () => {
  it("passes", () => {
    cy.url().should("include", "/notary/invite");
  });
});

describe("Do Invite", () => {
  it("passes", () => {
    const ran = randomDigitString(3)
    cy.get("[aria-label='Signer Name']").type(`integration_test_signer_${ran}`);
    cy.get("[aria-label='Signer Email']").type(`integration_test_${ran}@bluenotary.us`);
    cy.wait(2000)
    cy.get("[aria-label='Meeting Date & Time']").click()
    cy.wait(2000)
    cy.get(".q-date__calendar-days .q-date__calendar-item--in").eq(1).click()
    cy.get(".q-time__clock-circle .q-time__clock-position").eq(2).click()
    cy.wait(1000)
    cy.get(".q-time__clock-circle .q-time__clock-position").eq(6).click()
    cy.get(".q-card__actions.q-card__actions--horiz button").click()
    cy.wait(1000)
    cy.get("[type='search']").click()
    cy.get(".q-virtual-scroll__content .q-item").eq(4).click();
    cy.wait(1000)
    cy.get(".q-form .q-select").eq(2).click()
    cy.get(".q-virtual-scroll__content .q-item").eq(0).click()
    cy.wait(3000)
    cy.get(".q-form > button").click()
  })
})