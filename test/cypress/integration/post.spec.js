'use strict'

describe('Pruebas de posts', () => {
  before(() => {
    // Antes de correr esta prueba limpiamos la base de datos
    cy.exec('npm run test:clean')
    cy.fixture('user.json').as('userData')
    cy.visit('/login')

    cy.get('@userData').then((userData) => {
      cy.createUser(userData)
      cy.visit('/dashboard')
      cy.wait(3000)
    })
  })
  it('Debe crear un post', () => {
    cy.get('@userData').then((userData) => {
      cy.get('textarea').type(Cypress.env('postContent'))
      // Podemos agregar breakpoints con debug
      // .then(() => { debugger })
      // .debug()
      cy.contains('button', 'Crear').as('botonCrear')
      cy.get('@botonCrear').should('be.enabled')
      cy.get('@botonCrear').click()
      // Hacemos una asercion para saber que ya tengan datos los selectores .col y p
      // Una asercion es lo mismo que un expect
      cy.contains('.col2 h5', userData.name).should('visible')
      cy.contains('p', Cypress.env('postContent')).should('be.visible')
    })
  })
})
