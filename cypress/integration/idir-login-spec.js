/// <reference types="cypress" />



describe('Authenticate with IDIR', function() {
    it('signs into the app via the UI using IDIR authentication', function() {
        cy.visit("/sign-in")

        cy.contains("Using IDIR").click().debug()

        cy.get('#user').type(Cypress.env('IDIR_USERNAME'))
        cy.pause()
        cy.get('#password').type(Cypress.env('IDIR_PASSWORD'))
        cy.pause()
        cy.get('input').contains('Continue').click()
        cy.pause()
        cy.contains("Create Your First Opportunity").should('be.visible')
});
});
