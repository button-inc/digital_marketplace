/// <reference types="cypress" />

import {CYPRESS_GITHUB_USERNAME, CYPRESS_GITHUB_PASSWORD} from '../../secrets'

// probably going to have to run keycloak locally for login

describe('Authenticate with Github', function() {
    beforeEach(function() {
        Cypress.Cookies.preserveOnce()
    })

    it('signs into the app using Github authentication', function() {
        cy.visit("/sign-in")
        cy.contains("Using GitHub").click()
        // add these variables to the cypress open/run command
        cy.get('#login_field').type(CYPRESS_GITHUB_USERNAME)
        cy.get('#password').type(CYPRESS_GITHUB_PASSWORD)
        cy.get('input').contains('Sign in').click()
        cy.contains("You're almost done!")
    })
});
