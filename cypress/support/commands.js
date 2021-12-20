// // ***********************************************
// // This example commands.js shows you how to
// // create various custom commands and overwrite
// // existing commands.
// //
// // For more comprehensive examples of custom
// // commands please read more here:
// // https://on.cypress.io/custom-commands
// // ***********************************************
// //
// //
// // -- This is a parent command --
// // Cypress.Commands.add('login', (email, password) => { ... })
// //
// //
// // -- This is a child command --
// // Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
// //
// //
// // -- This is a dual command --
// // Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
// //
// //
// // -- This will overwrite an existing command --
// // Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// // import 'cypress-keycloak';

// // Cypress.Commands.overwrite('login', (originalFn) => {
// //     originalFn({
// //       root: 'https://dev.oidc.gov.bc.ca/auth/realms/p2zhow64/protocol/openid-connect/auth',
// //       realm: 'p2zhow64',
// //       username: 'babangsund',
// //       password: 'bacon',
// //       client_id: 'dm-auth-web',
// //       redirect_uri: 'https://babangsund.com/',
// //     })
// //   })

import 'cypress-keycloak';


// Cypress.Commands.add('kcLogin', (username, password) => {
//     // Copy-pasted code from KC javascript client. It probably doesn't need to be
//     // this complicated but I refused to spend time on figuring that out.
//     function createUUID() {
//       var s = [];
//       var hexDigits = '0123456789abcdef';
//       for (var i = 0; i < 36; i++) {
//         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
//       }
//       s[14] = '4';
//       s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
//       s[8] = s[13] = s[18] = s[23] = '-';
//       var uuid = s.join('');
//       return uuid;
//     }
//     const kcRoot = 'https://dev.oidc.gov.bc.ca';
//     const kcRealm = 'p2zhow64';
//     const kcClient = 'dm-auth-web';
//     const kcRedirectUri = 'http://localhost:3000/';
//     const loginPageRequest = {
//       url: `${kcRoot}/auth/realms/${kcRealm}/protocol/openid-connect/auth`,
//       qs: {
//         client_id: kcClient,
//         redirect_uri: kcRedirectUri,
//         state: createUUID(),
//         nonce: createUUID(),
//         response_mode: 'fragment',
//         response_type: 'code',
//         scope: 'openid'
//       }
//     };

//     ////////////
//     function submitLoginForm(response) {
//     //   cy.log(response)
//     //   return cy.request({
//     //     form: true,
//     //     method: 'POST',
//     //     url: kcRoot,
//     //     followRedirect: true,
//     //     body: {
//     //       username: username,
//     //       password: password
//     //     }
//     //   });
//     function submitLoginForm(response) {
//         const _el = document.createElement('html');
//         _el.innerHTML = response.body;
//         // This should be more strict depending on your login page template.
//         const loginForm = _el.getElementsByTagName('form');
//         const isAlreadyLoggedIn = !loginForm.length;
//         if (isAlreadyLoggedIn) {
//           return;
//         }
//         return cy.request({
//           form: true,
//           method: 'POST',
//           url: loginForm[0].action,
//           followRedirect: false,
//           body: {
//             username: username,
//             password: password
//           }
//         });


//     }
//     // Open the KC login page, fill in the form with username and password and submit.
//     return cy.request(loginPageRequest)
//       .then(submitLoginForm);
//   });


// follow through what happens when someone logs in with an IDIR

Cypress.Commands.add('kcLogin', (username, password) => {
    const kcRoot = 'https://dev.oidc.gov.bc.ca';
    const kcRealm = 'p2zhow64';
    const kcClient = 'dm-auth-web';
    const kcRedirectUri = 'http://localhost:3000/auth/callback';
    const loginPageRequest = {
      url: `${kcRoot}/auth/realms/${kcRealm}/protocol/openid-connect/auth`,
      qs: {
        client_id: kcClient,
        redirect_uri: kcRedirectUri,
        state: createUUID(),
        nonce: createUUID(),
        response_mode: 'fragment',
        response_type: 'code',
        scope: 'openid'
      }
    };
    // Open the KC login page, fill in the form with username and password and submit.
    return cy.request("/auth/sign-in")
      .then(submitLoginForm);
    ////////////
    function submitLoginForm(response) {
      const _el = document.createElement('html');
      _el.innerHTML = response.body;
      // This should be more strict depending on your login page template.
      const loginForm = _el.getElementsByTagName('form');
      const isAlreadyLoggedIn = !loginForm.length;
      if (isAlreadyLoggedIn) {
        return;
      }
      return cy.request({
        form: true,
        method: 'POST',
        url: loginForm[0].action,
        followRedirect: true,
        body: {
          username: username,
          password: password
        }
      });
    }
    // Copy-pasted code from KC javascript client. It probably doesn't need to be
    // this complicated but I refused to spend time on figuring that out.
    function createUUID() {
      var s = [];
      var hexDigits = '0123456789abcdef';
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = '4';
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = '-';
      var uuid = s.join('');
      return uuid;
    }
  });
