describe('Setup board state tests', () => {
	it('App is running at localhost:5500', () => {
		cy.visit('http://localhost:5500');
	});

	it('Board/cards interaction is disabled before pressing start on a fresh load', () => {
		cy.get('#memotest').invoke('attr', 'onclick').should('eq', undefined);
		cy.get('#memotest').invoke('css', 'cursor').should('eq', 'auto');
	});

	it('All front sides are hiding the back sides', () => {
		cy.get('#memotest li img')
			.should('have.attr', 'src', './img/questionmark.jpg')
			.should('have.css', 'opacity', '1');
	});

	it('Timer runs after pressing start button', () => {
		cy.get('#timer')
			.invoke('text')
			.then(timerStopped => {
				cy.get('#start').click();
				cy.get('#timer')
					.invoke('text')
					.should(timerRunning => {
						expect(timerStopped).not.to.eq(timerRunning);
					});
			});
	});

	it('Cards were shuffled in all slots', () => {
		cy.get('#memotest li').should('have.css', 'background-image');
	});

	it('Each card has a name identificator related to its img content', () => {
		cy.get('#memotest li')
      .then($lis => {
        $lis.each((i, $li) => {
          expect($li.getAttribute('style')).to.include($li.getAttribute('name'));
        })
      });
	});

	it('Board interaction after clicking start', () => {
		cy.get('#memotest')
			.should('be.visible')
			.invoke('css', 'cursor')
			.should('eq', 'pointer');
	});
});
