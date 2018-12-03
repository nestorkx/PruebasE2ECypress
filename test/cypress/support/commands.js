// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('createUser', (userData) => {
  cy.contains('Crear una cuenta').click()
  cy.get('#name').type(userData.name)
  cy.get('#title').type(userData.company)
  cy.get('#email2').type(userData.email)
  cy.get('#password2').type(userData.password)
  cy.contains('.button', 'Registrarse').click()
  cy.wait(3000)
  cy.get('.error-msg').should('not.exist')
})

Cypress.Commands.add('loginUser', (username, password) => {
  cy.get('#email1').type(username)
  cy.get('#password1').type(password)
  cy.contains('.button', 'Ingresar').click()
  cy.wait(3000)
})
