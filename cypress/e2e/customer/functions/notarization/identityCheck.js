const identityCheck = () => {
  describe("2. Identity Check", () => {
    var sessionId;
    it("Check URL", () => {
      cy.url().should('include', 'personal_info').then((url) => {
        sessionId = url.split('/')[5]
        window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
      })
    })
    describe("2.1. Fill Identity", () => {
      // it("Input Full Name", () => {
      //   cy.get(':nth-child(1) > :nth-child(1) > .q-field > .q-field__inner > .q-field__control input')
      //     .clear().type(`Michael`, { timeout: 1000 });
      //   cy.wait(2000)
      //   cy.get(':nth-child(1) > :nth-child(2) > .q-field > .q-field__inner > .q-field__control input')
      //     .clear().type(`William`, { timeout: 1000 });
      //   cy.wait(2000)
      //   cy.get(':nth-child(2) > .col-lg-5 > .q-field > .q-field__inner > .q-field__control input')
      //     .clear().type(`Lindquist`, { timeout: 1000 });
      //   cy.wait(2000)
      // })
      // it("Select Birthday", () => {
      //   cy.get('.c-width-wrapper > .q-field > .q-field__inner > .q-field__control').click()
      //   cy.wait(500)
      //   cy.get('.relative-position.col > div > .q-btn > .q-btn__wrapper').click()
      //   cy.wait(500)
      //   cy.get(':nth-child(5) > .q-btn > .q-btn__wrapper').click()
      //   cy.wait(500)
      //   cy.get(':nth-child(5) > div > .q-btn > .q-btn__wrapper').click()
      //   cy.wait(500)
      //   cy.get(':nth-child(13) > .q-btn > .q-btn__wrapper').click()
      //   cy.wait(500)
      //   cy.get('.q-date__calendar-days > :nth-child(17)').click()
      //   cy.wait(500)
      //   cy.get('.justify-end > .q-btn > .q-btn__wrapper').click()
      // })
      // it("Input SSN", () => {
      //   cy.get(':nth-child(3) > :nth-child(3) > .q-field--outlined > .q-field__inner > .q-field__control input')
      //     .clear().type('2222')
      // })
      // it("Input Address", () => {
      //   cy.get('.col-md-9 > .q-field__inner > .q-field__control input').clear().type(`13584 ST RD 62`)
      //   cy.get('.col-md-4 > .q-field__inner > .q-field__control input').clear().type(`Lincoln Park`)
      //   cy.get('.col-md-3 > .q-field__inner > .q-field__control').click()
      //   cy.wait(1000)
      //   cy.get('#qvs_2 > :nth-child(6)').click()
      //   cy.get('.q-pt-lg > .q-gutter-sm > .col-md-2 > .q-field__inner > .q-field__control input')
      //     .clear().type('47537')
      // })
      it("Next", () => {
        cy.scrollTo("bottom", { duration: 1000 })
        window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
        cy.get(':nth-child(1) > .q-btn > .q-btn__wrapper').click()
        cy.wait(3000)
      });
    })
    describe("2.2. Questions", () => {
      it("Check URL", () => {
        cy.url().should('include', 'kba')
      })
      it("Next", () => {
        cy.scrollTo("bottom", { duration: 1000 })
        window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
        cy.get(':nth-child(1) > .q-btn > .q-btn__wrapper').should('be.visible').click()
        cy.wait(10000)
      });
    });
    describe("2.3. Photo Id", () => {
      it("Check URL", () => {
        cy.url().should('include', 'photoid')
      })
      it("Begin Verification", () => {
        cy.get("iframe.persona-widget__iframe").should('be.visible').then(($iframe) => {
          cy.wrap($iframe.contents().find('#submit__button')).click({ force: true })
        })
      });
      it("Select Country", () => {
        cy.wait(3000)
        cy.get("iframe.persona-widget__iframe").then(($iframe) => {
          const doc = $iframe.contents()
          cy.wrap(doc.find('#input_country_select')).select('CA', { force: true });
          cy.wrap(doc.find('#submit__button')).click({ force: true });
        })
      });
      it("Select Verify Method", () => {
        cy.wait(3000)
        cy.get("iframe.persona-widget__iframe").then(($iframe) => {
          const doc = $iframe.contents()
          cy.wrap(doc.find('#select__option--pp')).click({ force: true });
        })
      })
      it("Upload Photo Id", () => {
        const fileName = 'ca-passport.png'
        cy.wait(3000)
        cy.get("iframe.persona-widget__iframe").then(($iframe) => {
          const doc = $iframe.contents()
          cy.wrap(doc.find('input[type="file"]')).selectFile(`cypress/fixtures/${fileName}`, { force: true });
        })
      })
      it("Check Photo", () => {
        cy.wait(3000)
        cy.get("iframe.persona-widget__iframe").then(($iframe) => {
          const doc = $iframe.contents()
          cy.wrap(doc.find('#government_id__use-image')).click({ force: true });
        })
      })
      it("Complete", () => {
        cy.wait(10000)
        cy.get("iframe.persona-widget__iframe").then(($iframe) => {
          const doc = $iframe.contents()
          window.localStorage.setItem('sessionData', `__q_strn|${sessionId}`)
          cy.wrap(doc.find('#complete__button'), { timeout: 10000 }).should('be.visible').click({ force: true });
        })
        cy.wait(10000)
      })
    })
  });
}
module.exports = { identityCheck }