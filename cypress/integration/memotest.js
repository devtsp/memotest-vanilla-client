const URL = '127.0.0.1:5500';

context('Memotest', () => {
	before(() => {
		cy.visit(URL);
	});

	describe('Display memotest', () => {
		const CARD_SLOTS = 16;

		it('checks the existence of 12 slots to display the pictures', () => {
			cy.get('#memotest').find('li').should('have.length', CARD_SLOTS);
		});

    it('Ensures that the distribution of images is random each time', () => {
      cy.get('#start').click();
      cy.get('#memotest img').log();
    }
    )

	});
});
