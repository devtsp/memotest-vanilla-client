describe('Before pressing start (fresh load)', () => {
	it('App is running at localhost:5500', () => {
		cy.visit('http://localhost:5500');
	});

	it('Board interaction is disabled', () => {
		cy.get('#memotest').invoke('attr', 'onclick').should('eq', undefined);
		cy.get('#memotest').invoke('css', 'cursor').should('eq', 'auto');
	});

	it('All front side covers are displayed (despite not having been shuffled yet)', () => {
		cy.get('#memotest').should('be.visible');
		cy.get('#memotest li img')
			.should('have.attr', 'src', './img/questionmark.jpg')
			.should('have.css', 'opacity', '1');
	});

	it('Timer does not run before pressing start on reloading page', () => {
		cy.get('#timer').invoke('text').should('eq', '0');
	});

	it('Attempts counter starts at 0', () => {
		cy.get('#attempts').invoke('text').should('eq', '0');
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
		cy.get('#memotest li').each($li => {
			expect($li[0].getAttribute('style')).to.include(
				$li[0].getAttribute('name')
			);
		});
	});

	it('Random new distribution of cards on each start click', () => {
		cy.get('#memotest li img').then($shuffle1 => {
			cy.get('#start').click();
			cy.get('#memotest li img').should('not.eq', $shuffle1);
		});
	});
});

describe('Board interaction', () => {
	it('Reveal card on click, prevent further clicks on same slot. Attempts do not increment and the card stills visible', () => {
		cy.get('#1 img').then($1 => {
      $1.click()
			.click()
			.click();
			cy.wrap($1).should('have.class', 'hidden');
      cy.get("#attempts").invoke('text').should('eq', '0')
    })
			
	});

	it('Attempts counter increases only when clicking a second different card', () => {
		cy.get('#start').click();
		cy.get('#1').children().click();
		cy.get('#2').children().click();
		cy.get('#attempts').invoke('text').should('eq', '1');
	});

	it('Previous 2 mismatched cards are hide after a third selection', () => {
		cy.get('#start').click();
		cy.get(`#${Math.floor(Math.random() * 16 + 1)}`).then($1 => {
			cy.log($1[0].getAttribute('id'));
			$1.children().click();
			cy.get('#memotest li')
				.not($1)
				.not(`[name=${$1[0].getAttribute('name')}]`)
				.first()
				.then($2 => {
					cy.log($2[0].getAttribute('id'));
					$2.children().click();
					cy.get('#memotest li')
						.not($1)
						.not($2)
						.not(`[name=${$1[0].getAttribute('name')}]`)
						.not(`[name=${$2[0].getAttribute('name')}]`)
						.first()
						.then($3 => {
							$3.children().click();
							cy.wrap($1).children().should('not.have.class', 'hidden');
							cy.wrap($2).children().should('not.have.class', 'hidden');
						});
				});
		});
	});
});

describe('End game', () => {
	it('Waits few random seconds then solves the puzzle', () => {
		cy.get('#start').click();
		cy.wait(Math.random() * 2500);
		cy.get('#memotest li').then($lis => {
			const solution = {};
			$lis.each((i, $li) => {
				const current = $li.getAttribute('name');
				if (solution[current]) {
					solution[current].push($li);
				} else {
					solution[current] = [];
					solution[current].push($li);
				}
			});
			for (let key in solution) {
				const $el1 = solution[key][0];
				const $el2 = solution[key][1];
				$el1.children[0].click();
				$el2.children[0].click();
			}
		});
	});

	it('Wait 2 secs to check that timer did not continue running', () => {
		cy.wait(500);
		cy.get('#timer')
			.invoke('text')
			.then($timerStamp => {
				cy.wait(2000);
				cy.get('#timer').invoke('text').should('eq', $timerStamp);
			});
	});

	it('Attempts counter must be 8 due to perfect solving the puzzle', () => {
		cy.get('#attempts').invoke('text').should('eq', '8');
	});

	it('Board must be displayed "none" to allow progres bar moving up', () => {
		cy.get('#memotest').should('have.class', 'none');
	});

	it('Win message must be displayed and match status bar values', () => {
		cy.get('#win-message').should('not.have.class', 'hidden');

		cy.get('#attempts').then($attempts => {
			cy.get('#final-attempts').then($finalAttempts => {
				expect($attempts[0].innerText).to.equal($finalAttempts[0].innerText);
			});
		});

		cy.get('#timer').then($timer => {
			cy.get('#final-time').then($finalTime => {
				expect($timer[0].innerText).to.equal($finalTime[0].innerText);
			});
		});
	});
});
