const getImgs = liNodeList => {
	const ImgNames = [];
  const regEx = /\w+((?=\.jfif)|(?=\.png)|(?=\.jpeg))/;
	liNodeList.each($li => {
    const $liEl = $li[0]
		const imgBground = $liEl.style.background;
		const extractedName = imgBground.match(regEx)[0];
		ImgNames.push(extractedName);
	});
	return ImgNames;
};

const getNames = liNodeList => {
	const liNames = [];
	liNodeList.each($li => {
    const $liEl = $li[0]
		const liName = $liEl.getAttribute('name');
		liNames.push(liName);
	});
	return liNames;
};

describe('My first test', () => {
	it('App is hosted at localhost:5500', () => {
		cy.visit('http://localhost:5500');
	});

	it('Board/cards interaction is disabled before pressing start on a fresh load', () => {
		cy.get('#memotest').invoke('attr', 'onclick').should('eq', undefined);
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

	it('Cards were shuffled in all slots (have a bg img setted)', () => {
		cy.get('#memotest li').should('have.css', 'background-image');
	});

	it('Each card has his "name" attribute binded to its background img content', () => {
		const cards = cy.get('#memotest li')
    expect(getImgs(cards)).to.eql(getNames(cards));
	});
});
