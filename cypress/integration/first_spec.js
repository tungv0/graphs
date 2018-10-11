describe('My First Test', function() {
    it('Does not do much!', function() {
      expect(true).to.equal(true)
    })
  })


  describe('My First Graph Test', function() {
    it('Visits Stock Graphs Page', function() {
      cy.visit('http://localhost:8080')

      cy.contains('')
    })
  })