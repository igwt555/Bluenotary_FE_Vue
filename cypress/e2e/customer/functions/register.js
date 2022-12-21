import { randomDigitString } from "../common/utils";

const register = () => {
  describe("Register Page", () => {
    it("passes", () => {
      cy.visit("https://app.bluenotary.us/business/register");
    });
  });
  describe("Do Register", () => {
    it("passes", () => {
      const ran = randomDigitString(3)
      cy.get("[aria-label='First Name']").type(`integration_test_${ran}`);
      cy.get("[aria-label='Last Name']").type(`integration_test_${ran}`);
      cy.get("[aria-label='Email']").type(`integration_test_${ran}@bluenotary.us`);
      cy.get("[aria-label='Password']").type("123456");
      cy.get("[aria-label='Repeat Password']").type("123456");
      cy.get(".q-select--without-chips.q-select--single").click();
      cy.get(".q-item.q-item-type.row.no-wrap.q-item--clickable.q-link.cursor-pointer.q-manual-focusable:last-child").click();
      cy.get("[type='button']").click();
    });
  });
  describe("Go to Login Page", () => {
    it("passes", () => {
      cy.visit("https://app.bluenotary.us/sign-in");
    });
  });
  describe("Do Login", () => {
    it("passes", () => {
      cy.get("[aria-label='Email']").type("areejsz124@gmail.com");
      cy.get("[aria-label='Password']").type("123456");
      cy.get("[type='submit']").click();
    });
  });
}
module.exports = { register }