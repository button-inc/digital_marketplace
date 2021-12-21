/// <reference types="cypress" />

describe('As a user authenticated via IDIR', function() {
    beforeEach(function() {
        cy.visit('auth/createsession')
        Cypress.Cookies.preserveOnce("sid")
    })

    it('creates a new published opportunity', function() {

        cy.visit("/opportunities/create")
        cy.contains('Get Started').first().click()

        // 1. Overview tab
        cy.get('#cwu-opportunity-title').type('Cypress Opp')
        cy.get('#cwu-opportunity-teaser').type('Teaser text')
        cy.get('#cwu-opportunity-remote-ok-0').first().check({force:true})
        cy.get('#cwu-opportunity-remote-desc').type('Remote description text')
        cy.get('#cwu-opportunity-location').clear().type('Vancouver')
        cy.get('#cwu-opportunity-reward').type('5000')
        cy.get('#cwu-opportunity-skills').click()
        cy.contains('Agile').click({force: true})
        cy.contains('Next').click()

        // 2. Description tab
        cy.get('#cwu-opportunity-description').type('Opp description')
        cy.contains('Next').click()

        // 3. Details tab
        cy.get('#cwu-opportunity-proposal-deadline').type('2050-01-01')
        cy.get('#cwu-opportunity-assignment-date').type('2050-02-02')
        cy.get('#cwu-opportunity-start-date').type('2050-03-03')
        cy.get('#cwu-opportunity-completion-date').type('2050-04-04')
        cy.get('#cwu-opportunity-submission-info').type('github repo')
        cy.get('#cwu-opportunity-acceptance-criteria').type('Some acceptance criteria')
        cy.get('#cwu-opportunity-evaluation-criteria').type('Some evaluation criteria')
        cy.contains('Next').click()
        // 4. Attachments tab
        cy.get('#').type('')

      // fill out form, click next button, repeat for all tabs
      // save draft
      // visit dashboard
      // click on opportunity
      // confirm all data is present
      // click actions dropdown
      // click submit
      // in modal, check boxes to acknowledge reading terms and conditions
      //click submit
      // visit https://localhost:3000/opportunities
      // click opportunity
      // confirm all data is present
      // cy.getCookie('mocks.auth').should('have.property', 'value', 'admin')
    })



});
