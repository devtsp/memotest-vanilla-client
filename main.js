document.onload = initialState();

function initialState() {
	const clickCounter = { clicks: 0 };
	const cardsSelected = [];
	const selectionsIDs = [];
	const timerCount = { seconds: 0 };
	const triesCount = { tries: 0 };
	const totalMatches = { matches: 0 };
	document.querySelector('#shuffle').onclick = () => {
		location.reload();
	};
	document.querySelector('#win').classList.replace('shown', 'hidden');

	startStats(timerCount, triesCount, totalMatches);
	backSidesShuffler();
	frontSidesShuffler(
		clickCounter,
		cardsSelected,
		totalMatches,
		selectionsIDs,
		triesCount,
		timerCount
	);
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

function frontSidesShuffler(
	clickCounter,
	cardsSelected,
	totalMatches,
	selectionsIDs,
	triesCount,
	timerCount
) {
	const $cardFronts = document.querySelectorAll('#memotest img');
	$cardFronts.forEach(card => {
		card.classList.remove('invisible');
		card.src = './img/questionmark.jpg';
		card.addEventListener('click', e =>
			handleClick(
				e,
				clickCounter,
				cardsSelected,
				totalMatches,
				selectionsIDs,
				triesCount,
				timerCount
			)
		);
	});
}

function startStats(timerCount, triesCount, totalMatches) {
	// Awfull solution to clear past intervals. I tried EVERYTHING
	for (let i = 0; i < 5; i++) {
		clearInterval(i);
	}
	const $tries = document.querySelector('#tries');
	const $timer = document.querySelector('#timer');
	$tries.classList.remove('hidden');
	$timer.classList.remove('hidden');
	$tries.innerText = `${triesCount.tries}`;
	$timer.innerText = `${timerCount.seconds}`;
	const intervalID = setInterval(() => {
		timerCount.seconds++;
		$timer.innerText = `${timerCount.seconds}`;
		if (totalMatches.matches === 8) {
			clearInterval(intervalID);
		}
	}, 1000);
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
function handleClick(
	e,
	clickCounter,
	cardsSelected,
	totalMatches,
	selectionsIDs,
	triesCount,
	timerCount
) {
	changeState(e, clickCounter, cardsSelected, selectionsIDs);
	if (clickCounter.clicks === 2) {
		triesCount.tries++;
		document.querySelector('#tries').innerText = `${triesCount.tries}`;
		clickDisabler();
		matchOrMismatch(clickCounter, cardsSelected, selectionsIDs, totalMatches);
	}
	checkWin(totalMatches, triesCount, timerCount);
}

function changeState(e, clickCounter, cardsSelected, selectionsIDs) {
	clickCounter.clicks++;
	e.target.classList.add('hidden');
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

function matchOrMismatch(
	clickCounter,
	cardsSelected,
	selectionsIDs,
	totalMatches
) {
	if (cardsSelected[0] === cardsSelected[1]) {
		handleMatch(cardsSelected, totalMatches);
	} else {
		handleMismatch(selectionsIDs);
	}
	clickCounter.clicks = 0;
	cardsSelected.length = 0;
	selectionsIDs.length = 0;
}

function handleMatch(cardsSelected, totalMatches) {
	totalMatches.matches++;
	const $matchedPair = document.querySelectorAll(
		`[name="${cardsSelected[0]}"]`
	);
	const $progress = document.querySelector('#matches');
	const percentage = (totalMatches.matches * 100) / 8;
	$progress.ariaValueNow = `${percentage}%`;
	$progress.style.width = `${percentage}%`;
	setTimeout(() => {
		$matchedPair.forEach(matchedCard => {
			matchedCard.style.display = 'none';
		});
	}, 1000);
}

function handleMismatch(selectionsIDs) {
  console.log(selectionsIDs)
	const $cards = document.querySelectorAll(`#memotest li`);
	setTimeout(() => {
		$cards.forEach(card => {
			if (selectionsIDs.includes(card.id)) {
				card.cildren[0].classList.replace('hidden', 'shown');
			}
		});
	}, 1000);
}

function checkWin(totalMatches, triesCount, timerCount) {
	const $message = document.querySelector('#win');
	if (totalMatches.matches === 8) {
		setTimeout(() => {
			$message.classList.replace('hidden', 'shown');
			$message.innerText = `Congratulations! \n You took ${triesCount.tries} tries\n and ${timerCount.seconds} seconds \nto solve the puzzle.\n Well done!`;
		}, 1000);
	}
}
