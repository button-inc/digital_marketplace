/// <reference types="cypress" />

describe('As a user authenticated via Github', function() {
    beforeEach(function() {
      cy.visit("/sign-in")
      cy.contains("Using GitHub").click()
      cy.contains("Authorize bcgov").click()
    
    })

    it('creates a new published opportunity', function() {

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
      cy.getCookie('mocks.auth').should('have.property', 'value', 'admin')
    })



});
