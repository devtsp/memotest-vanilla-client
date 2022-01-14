const $memoTest = document.querySelector('#memotest');
const memoTestCards = [...$memoTest.children];
console.log('Reloaded page!');

function memoTestRandomDisplay() {
	$memoTest.style.display = 'block';
	console.log('Shuffled new sort of cards!!');

	const imageEntries = {};

	function imageRandomizer() {
		const imageReferences = [
			'335.jfif',
			'explorer.jfif',
			'iceman.jfif',
			'jaguar.jfif',
			'lp.jfif',
			'sg.jfif',
			'strat.jfif',
			'tele.jfif',
		];
		const randomNumber = Math.floor(Math.random() * 8);
		const randomImage = imageReferences[randomNumber];
		return randomImage;
	}

	function isDuplicated(randomImage) {
		if (imageEntries[randomImage] === 2) {
			return true;
		} else if (imageEntries[randomImage] === 1) {
			imageEntries[randomImage]++;
			return false;
		} else {
			imageEntries[randomImage] = 1;
			return false;
		}
	}

	function imageAssigner(card) {
		const selectImg = imageRandomizer();
		const duplicated = isDuplicated(selectImg);
		if (duplicated) {
			imageAssigner(card);
		} else {
			card.setAttribute('name', selectImg.match(/^[\w\d-_]+/));
			card.style.backgroundImage = `url("./img/${selectImg}")`;
		}
	}

	memoTestCards.forEach(card => {
		imageAssigner(card);
	});
}

document.querySelector('#shuffle').onclick = memoTestRandomDisplay;

memoTestCards.forEach(card => {
  card.children[0].addEventListener('click', e => handleSelection(e));
});


let clickCounter = 0;
const selections = [];
let totalMatches = 0;

function handleSelection(e) {
	e.target.style.display = 'none';
	const cardName = e.target.parentNode.getAttribute('name');
	clickCounter++;
	selections.push(cardName);
	console.log(`Card revealed: ${cardName}
  Selections made: ${clickCounter}
  Previous cards: ${selections}`);
	if (clickCounter === 2) {
		if (selections[0] === selections[1]) {
			handleMatch(selections);
		} else {
			handleUnmatch();
		}
		clickCounter = 0;
		selections.length = 0;
  }
  handleWin()
}

function handleMatch(selections) {
	totalMatches++;
	console.log(`Match!! Total matches: ${totalMatches}`);
	const $matchedPair = document.querySelectorAll(`[name="${selections[0]}"]`);
	setTimeout(() => {
		$matchedPair.forEach(card => {
			card.style.visibility = 'hidden';
		});
	}, 1000);
}

function handleUnmatch() {
	console.log('No match!');
	setTimeout(() => {
		memoTestCards.forEach(card => {
			card.children[0].style.display = 'inline-block';
		});
	}, 1000);
}

function handleWin() {
  if (totalMatches === 8) {
    console.log('Congrats!! you win the game!')
    setTimeout(() => { history.go() }, 2000)
  }
}
