const hexToRgb = (hex) => {
  const rValue = parseInt(hex.substring(0, 2), 16);
  const gValue = parseInt(hex.substring(2, 4), 16);
  const bValue = parseInt(hex.substring(4), 16);
  return `rgb(${rValue}, ${gValue}, ${bValue})`;
}

describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/')
  })

  it('successfully loads', () => {
    cy.get(".home-nav-bar").should("exist");
    cy.get(".home-document-card").should("exist");
  })

  it('creates document', () => {
    cy.get('.home-create-doc-form').type('crazy document')
    cy.get('.home-create-doc-button').click()

  })

  // it('dark mode works successfully', () => {
  //   cy.get('.toggle-container').click()
  //   cy.get('.container').should('have.css', 'background-color', hexToRgb("e8e8e8"))
  //   cy.get('.container').should('have.css', 'color', hexToRgb("0a0a0a"))
  //   cy.get('.toggle-container').click()
  //   cy.get('.container').should('have.css', 'background-color', hexToRgb("1c1c1c"))
  //   cy.get('.container').should('have.css', 'color', hexToRgb("f6f6f6"))
  // })

})