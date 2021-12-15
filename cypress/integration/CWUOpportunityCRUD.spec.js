/// <reference types="cypress" />

describe('Creates a new CWU opportunity', function() {
    beforeEach(function() {
      cy.visit('localhost:3000')
    })

    // happy path
    it('authenticates gov user', function() {
      // logs in as gov user

    })

    it('visits opportunity creation page', function() {
      // above steps plus:
      // visit http://localhost:3000/opportunities/create
      // click get started on cwu card

    })

    it ('fills out opportunity form', function(){
      // above steps plus:
      // fill out form, click next button, repeat for all tabs

    })

    it ('saves opportunity as a draft', function(){
      // above steps plus:
      // save draft

    })

    it ('confirms draft was saved', function(){
      // above steps plus:
      // visit dashboard
      // click on opportunity
      // confirm all data is present

    })

    it ('publishes opportunity', function(){
      // above steps plus:
      // click actions dropdown
      // click submit
      // in modal, check boxes to acknowledge reading terms and conditions
      //click submit

    })


    it ('confirms opportunity was published', function(){
      // above steps plus:
      // visit https://localhost:3000/opportunities
      // click opportunity
      // confirm all data is present

    })

    // sad path
    it('authenticates vendor user', function() {
      // logs in as vendor user

    })

    it('cannot access opportunity creation page', function() {
      // above step plus:
      // visit http://localhost:3000/opportunities/create
      // gets page not found message

    })

});
