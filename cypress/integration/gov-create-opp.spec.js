/// <reference types="cypress" />

describe('As a user authenticated via IDIR', function() {
    beforeEach(function() {
        cy.visit('auth/createsession')
        Cypress.Cookies.preserveOnce("sid")
    })

    it('creates and saves a draft of a new CWU opportunity', function() {

        cy.visit("/opportunities/create")
        cy.contains('Get Started').first().click()

        // 1. Overview tab
        cy.get('#cwu-opportunity-title').type('Cypress Opp')
        cy.get('#cwu-opportunity-teaser').type('Teaser text')
        cy.get('#cwu-opportunity-remote-ok-0').check({force:true}) // is force OK?
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
        cy.get('#cwu-opportunity-proposal-deadline').type('2050-01-31')
        cy.get('#cwu-opportunity-assignment-date').type('2050-02-28')
        cy.get('#cwu-opportunity-start-date').type('2050-03-31')
        cy.pause()
        cy.get('#cwu-opportunity-completion-date').type('2050-04-30')
        cy.pause()
        cy.get('#cwu-opportunity-submission-info').type('github repo')
        cy.get('#cwu-opportunity-acceptance-criteria').type('Some acceptance criteria')
        cy.get('#cwu-opportunity-evaluation-criteria').type('Some evaluation criteria')
        cy.contains('Next').click()
        // 4. Attachments tab
        // cy.route({
        //     method: 'POST',
        //     url: /upload_endpoint/
        //   }).as('upload');
        const fixtureFile = 'jairo-alzate-sssxyuZape8-unsplash.jpg';
        cy.contains('Add Attachment').attachFile(fixtureFile);
        // cy.wait('@upload', { requestTimeout: 120000 });
        cy.contains('Save Draft').click({force: true});

        // After opportunity has been created
        cy.contains('Draft Opportunity Saved').should('be.visible')

        // 1. Overview tab
        cy.get('#cwu-opportunity-title').should('have.value', 'Cypress Opp')
        cy.get('#cwu-opportunity-teaser').should('have.value','Teaser text')
        cy.get('#cwu-opportunity-remote-ok-0').should('be.checked')
        cy.get('#cwu-opportunity-remote-ok-1').should('not.be.checked')
        cy.get('#cwu-opportunity-remote-desc').should('have.value','Remote description text')
        cy.get('#cwu-opportunity-location').should('have.value','Vancouver')
        cy.get('#cwu-opportunity-reward').should('have.value','5000')
        cy.contains('Agile').should('be.visible') // weak
        cy.contains('Next').click()

        // 2. Description tab
        cy.get('#cwu-opportunity-description').should('have.value','Opp description')
        cy.contains('Next').click()

        // 3. Details tab
        cy.get('#cwu-opportunity-proposal-deadline').should('have.value','2050-01-31')
        cy.get('#cwu-opportunity-assignment-date').should('have.value','2050-02-28')
        cy.get('#cwu-opportunity-start-date').should('have.value','2050-03-31')
        cy.get('#cwu-opportunity-completion-date').should('have.value','2050-04-30')
        cy.get('#cwu-opportunity-submission-info').should('have.value','github repo')
        cy.get('#cwu-opportunity-acceptance-criteria').should('have.value','Some acceptance criteria')
        cy.get('#cwu-opportunity-evaluation-criteria').should('have.value','Some evaluation criteria')
        cy.contains('Next').click()
        // 4. Attachments tab



        // cy.contains('Agile').click({force: true})
        // cy.contains('Next').click()


        // cy.contains('').should('be.visible')
        // cy.contains('').should('be.visible')
        // cy.contains('').should('be.visible')




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
