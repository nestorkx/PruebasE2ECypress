'use strict'
describe('Pruebas del login', () => {
  before(() => {
    cy.exec('npm run test:clean')
  })
  beforeEach(() => {
    // Fixture son datos para mapear y evitar repetir strings
    // Son JSON de pruebas
    cy.fixture('user.json').as('userData')
    cy.visit('/login')
    // Aqui usamos aserciones para cuando necesitemos que este de cierta manera un objeto,
    // Un componente etc
    cy.contains('h1', 'Bienvenido').should('be.visible')
  })
  // .skip para saltar las pruebas
  it('Debe registrar un usuario', () => {
    // Para obtener la variable se declara con el "@"
    cy.get('@userData').then((userData) => {
      cy.createUser(userData)
      cy.screenshot('create-user')
    })
  })
  it('Debe fallar con un usuario erroneo', () => {
    cy.loginUser('fail@test.com', 'test1234')
    cy.get('.error-msg').should('be.visible')
    // Capturamos pantalla cuando haga esta tarea y el blaclout oculta el campo agrega una
    // Linea oscura
    cy.screenshot('login-failed', { blackout: ['#email1'] })
  })
  it('Debe loguear un usuario', () => {
    cy.get('@userData').then((userData) => {
      cy.loginUser(userData.email, userData.password)
      cy.screenshot('login-user')
      cy.contains('a', 'Dashboard').should('be.visible')
    })
  })
  after(() => {
    cy.log('Test finalizados')
  })
})
