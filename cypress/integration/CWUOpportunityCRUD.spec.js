/// <reference types="cypress" />

describe('CRUD for CWU opportunities', function() {
    beforeEach(function() {
      cy.visit('localhost:3000')
    })

    it('creates a new CWU opportunity', function() {
      // visit http://localhost:3000/opportunities/create
      // click get started on cwu card
      // fill out form, click next button, repeat for all tabs
      // save draft
      // click actions dropdown
      // click submit
      // in modal, check boxes to acknowledge reading terms and conditions
      //click submit
      // test if it saved--click view opportunity link in toast and confirm the opp name is the same as what was entered?
    })

    it('reads a CWU opportunity', function() {
      // visit http://localhost:3000/dashboard
      // click a cwu opportunity
      // test if it displays
    })

    it('updates a CWU opportunity', function() {
      // visit http://localhost:3000/dashboard
      // click a cwu opportunity
      // click opportunity tab
      // click actions and in dropdown, edit
      // change form fields, click next button, repeat for all tabs
      // click submit changes
      // in modal, acknowledge terms
      // click submit
      // test if it saved
    })

    it('deletes a CWU opportunity', function() {
      // visit http://localhost:3000/dashboard
      // click a cwu opportunity
      // click withdraw
      // in modal, click withdraw
      // test if it saved
    })
});
