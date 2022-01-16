document.querySelector('#shuffle').onclick = startGame;

function startGame() {
	const clickCounter = { clicks: 0 };
	const cardsSelected = [];
	const totalMatches = { matches: 0 };
	const selectionsIDs = [];

	backSidesShuffler(totalMatches);
	frontSidesShuffler(clickCounter, cardsSelected, totalMatches, selectionsIDs);
}

function backSidesShuffler() {
	let id = 0;
	const imagePastEntries = {};
	const $cardBacks = document.querySelectorAll('#memotest li');
	$cardBacks.forEach(back => {
		imageAssigner(back, imagePastEntries);
		back.classList.remove('invisible');
		back.style.backgroundColor = 'white';
		back.id = ++id;
		back.tabIndex = 0;
	});
}

function frontSidesShuffler(clickCounter, cardsSelected, totalMatches, selectionsIDs) {
	const $cardFronts = document.querySelectorAll('#memotest img');
	$cardFronts.forEach(card => {
		card.classList.remove('invisible');
		card.src = './img/questionmark.jpg';
		card.addEventListener('click', e =>
			handleClick(e, clickCounter, cardsSelected, totalMatches, selectionsIDs)
		);
	});
}

// SHUFFLE PROCEDURAL FUNCTION:
function imageAssigner(back, imagePastEntries) {
	const randomBackImg = imageRandomizer();
	const duplicated = isDuplicated(randomBackImg, imagePastEntries);
	if (duplicated) {
		imageAssigner(back, imagePastEntries);
	} else {
		back.setAttribute('name', randomBackImg.match(/^[\w\d-_]+/));
		back.style.backgroundImage = `url("./img/guitars/${randomBackImg}")`;
	}
}

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

function isDuplicated(currentEntry, pastEntries) {
	if (pastEntries[currentEntry] === 2) {
		return true;
	} else if (pastEntries[currentEntry] === 1) {
		pastEntries[currentEntry]++;
		return false;
	} else {
		pastEntries[currentEntry] = 1;
		return false;
	}
}

// USER INPUT PROCEDURAL
function handleClick(e, clickCounter, cardsSelected, totalMatches, selectionsIDs) {
	changeState(e, clickCounter, cardsSelected, selectionsIDs);
	if (clickCounter.clicks === 2) {
		clickDisabler();
		matchOrMismatch(clickCounter, cardsSelected, selectionsIDs);
	}
	checkWin(totalMatches);
}

function changeState(e, clickCounter, cardsSelected, selectionsIDs) {
	clickCounter.clicks++;
	e.target.classList.add('invisible');
	selectionsIDs.push(e.target.parentNode.id);
	const cardName = e.target.parentNode.getAttribute('name');
	cardsSelected.push(cardName);
}

function clickDisabler() {
	document.body.style.pointerEvents = 'none';
	setTimeout(() => {
		document.body.style.pointerEvents = 'all';
	}, 1000);
}

function matchOrMismatch(clickCounter, cardsSelected, selectionsIDs) {
	if (cardsSelected[0] === cardsSelected[1]) {
		handleMatch(cardsSelected, selectionsIDs);
	} else {
		handleMismatch(selectionsIDs);
	}
	clickCounter.clicks = 0;
	cardsSelected.length = 0;
	selectionsIDs.length = 0;
}

function handleMatch(cardsSelected, totalMatches) {
	totalMatches.matches++;
	const $matchedPair = document.querySelectorAll(`[name="${cardsSelected[0]}"]`);
	$matchedPair.forEach(card => {
		card.classList.add('border', 'border-success');
	});
	setTimeout(() => {
		$matchedPair.forEach(matchedCard => {
			matchedCard.classList.add('invisible');
			matchedCard.children[0].classList.add('invisible');
			$matchedPair.forEach(card => {
				card.classList.remove('border', 'border-success');
			});
		});
	}, 1000);
}

function handleMismatch(selectionsIDs) {
	const $cards = document.querySelectorAll(`#memotest li`);
	$cards.forEach(card => {
		if (selectionsIDs.includes(card.id)) {
			card.classList.add('border', 'border-danger');
		}
	});
	setTimeout(() => {
		$cards.forEach(card => {
			card.children[0].classList.remove('invisible');
			card.classList.remove('border', 'border-danger');
		});
	}, 1000);
}

function checkWin(totalMatches) {
	if (totalMatches.matches === 8) {
		setTimeout(() => {
			history.go();
		}, 2000);
	}
}
