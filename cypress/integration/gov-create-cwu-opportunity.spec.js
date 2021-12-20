/// <reference types="cypress" />

describe('As a user authenticated via IDIR', function() {
    beforeEach(function() {
      // add fixture data to db

      //logout of previous test


      // login
      // cy.login();
      // changing the login method broke login on dev, so not sure if it's the URL or something with the app
      //ciip URL: https://oidc.gov.bc.ca/auth/realms/pisrwwhx/protocol/openid-connect/auth?client_id=cas-ciip-portal&state=fa651d03-0dc2-47ae-9243-00c4c613a149&redirect_uri=https%3A%2F%2Fciip.gov.bc.ca%2Flogin%3Fauth_callback%3D1&scope=openid&response_type=code
      // https://stackoverflow.com/questions/61858077/keycloak-realm-login-page-is-not-appearing
      // cy.request({
      //   form: true,
      //   method: "POST",
      //   url: "https://dev.oidc.gov.bc.ca",
      //   followRedirect: true,
      //   retryOnStatusCodeFailure: true,
      //   body: {
      //     username: "cypress-gov",
      //     password: "password",
      //   },
      // });

      // cy.kcLogin("cypress-gov","password")
      // cy.setCookie('fakecookie', '123key')

      // cy.pause()
      Cypress.Cookies.debug(true)
      cy.setCookie('coookie_on','on')
      // Cypress.Cookies.preserveOnce("sid")
      cy.login({
        root: 'https://dev.oidc.gov.bc.ca',
        realm: 'p2zhow64',
        username: 'cypress-gov',
        password: 'password',
        client_id: 'dm-auth-web',
        redirect_uri: 'http://localhost:3000/auth/callback',
      });
      cy.setCookie('coookie_off','off')
    })

    it('creates a new published opportunity', function() {

      // cy.visit("/opportunities/create")
      cy.visit("auth/callback")
      cy.get("Read Guide").should('be.visible')

      // visit http://localhost:3000/opportunities/create
      // click get started on cwu card
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
