describe('Before board interaction', () => {
	it('App is running at localhost:5500', () => {
		cy.visit('http://localhost:5500');
	});

	it('Board/cards interaction is disabled on a fresh load', () => {
		cy.get('#memotest').invoke('attr', 'onclick').should('eq', undefined);
		cy.get('#memotest').invoke('css', 'cursor').should('eq', 'auto');
	});

	it('All front side imgs are displayed and hiding the back sides', () => {
		cy.get('#memotest').should('be.visible');
		cy.get('#memotest li img')
			.should('have.attr', 'src', './img/questionmark.jpg')
			.should('have.css', 'opacity', '1');
	});
});

describe('Actions espected when clicking Start', () => {
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

	it('Cards are shuffled in all slots', () => {
		cy.get('#memotest li').should('have.css', 'background-image');
	});

	it('Each card has a name identificator related to its img content', () => {
		cy.get('#memotest li').then($lis => {
			$lis.each((i, $li) => {
				expect($li.getAttribute('style', 'background-image')).to.include(
					$li.getAttribute('name')
				);
			});
		});
	});
});

describe('Board interaction', () => {
	it('Card pointer events removed after click and content visible', () => {
		cy.get('#1 img')
			.click()
			.should('have.class', 'click-off')
      .and('have.class' ,'hidden');
		cy.get('#attempts').invoke('text').should('eq', '0');
	});

	it('Click next card to check attempts incremented by one', () => {
		cy.get('#2 img').click();
		cy.get('#attempts').invoke('text').should('eq', '1');
	});
});





const solution = ($lis) => {
  cy.log($lis)
  const pairs = {};
  $lis.each(
    (i, $li) => {
      cy.log($li)
      const current = pairs[$li].getAttribute('name')
      if (pairs[current]) {
        pairs[current].push($li.getAttribute('id'))  
      } else {
        pairs[current] = [];
        pairs[current].push($li.getAttribute('id'))
      }
    })
    cy.log(pairs)
    return pairs
}

// const solution = () => {
//   const pairs = {};
//   document.querySelectorAll('#memotest li').forEach(
//     ($li) => {
//       const current = pairs[$li].getAttribute('name')
//       if (pairs[current]) {
//         pairs[current].push($li.getAttribute('id'))  
//       } else {
//         pairs[current] = [];
//         pairs[current].push($li.getAttribute('id'))
//       }
//     })
//     return pairs
// }