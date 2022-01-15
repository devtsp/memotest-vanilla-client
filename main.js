const shuffleButton = document.querySelector('#shuffle');
document.querySelector('#shuffle').onclick = startGame;

function startGame() {
	console.log('Game started!');
	const $memoTest = document.querySelector('#memotest');
	const $memoTestBacks = $memoTest.querySelectorAll('li');
	const $memoTestFront = $memoTest.querySelectorAll('img');
	const imagePastEntries = {};
	let clickCounter = { clicks: 0 };
	const selections = [];
	let totalMatches = { matches: 0 };

	$memoTestBacks.forEach(back => {
		imageAssigner(back, imagePastEntries);
		back.style.visibility = 'visible';
	});

  $memoTestFront.forEach(front => {
    front.style.visibility = 'visible'
		front.addEventListener('click', e =>
			handleSelection(e, clickCounter, selections, totalMatches)
		);
	});
}

//==============================
// SHUFFLE AND DISPLAY CARDS PROCEDURAL FUNCTION:
function imageAssigner(back, imagePastEntries) {
	const randomBackImg = imageRandomizer();
	const duplicated = isDuplicated(randomBackImg, imagePastEntries);
	if (duplicated) {
		imageAssigner(back, imagePastEntries);
	} else {
		back.setAttribute('name', randomBackImg.match(/^[\w\d-_]+/));
    back.style.backgroundImage = `url("./img/${randomBackImg}")`;    
	}
}

// HELPERS!!
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

//===================================
// USER INPUT SECTION MAIN HANDLER

function handleSelection(e, clickCounter, selections, totalMatches) {
	e.target.style.opacity = '0';
	const cardName = e.target.parentNode.getAttribute('name');
	clickCounter.clicks++;
	selections.push(cardName);
	console.log(`Guitar found: ${cardName}`);
	if (clickCounter.clicks === 2) {
		document.body.style.pointerEvents = 'none';
		setTimeout(() => {
			document.body.style.pointerEvents = 'all';
		}, 1000);
		if (selections[0] === selections[1]) {
			totalMatches.matches++;
			handleMatch(selections);
		} else {
			handleUnmatch();
		}
		clickCounter.clicks = 0;
		selections.length = 0;
	}
	handleWin(totalMatches);
}
// HELPERS!! (GAME STATE)
function handleMatch(selections) {
	console.log('Match!!');
	const $matchedPair = document.querySelectorAll(`[name="${selections[0]}"]`);
	setTimeout(() => {
		$matchedPair.forEach(matchedCard => {
      matchedCard.style.visibility = 'hidden';
      matchedCard.children[0].style.visibility = 'hidden';
      matchedCard.children[0].style.opacity = '1';
		});
	}, 1000);
}

function handleUnmatch() {
	console.log('No match!');
	const $fronts = document.querySelectorAll(`#memotest img`);
	setTimeout(() => {
		$fronts.forEach(front => {
			front.style.opacity = '1';
		});
	}, 1000);
}

function handleWin(totalMatches) {
	if (totalMatches.matches === 8) {
		console.log('Congrats!! you win the game!');
		setTimeout(() => {
			history.go();
		}, 2000);
	}
}
