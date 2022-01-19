class TurnVariables {
	names = new Set();
	ids = new Set();
	clicks = 0;
}

let turnState = new TurnVariables();

class MatchVariables {
	attempts = 0;
	coincidences = 0;
}

let matchState = new MatchVariables();

const $winMessage = document.querySelector('#win-message');
const $timer = document.querySelector('#timer');
const $memotest = document.querySelector('#memotest');
const $backSides = document.querySelectorAll('#memotest li');
const $frontSides = document.querySelectorAll('#memotest li img');
const $progress = document.querySelector('#inner-progress');

const imageReferences = [ '173bb65a04e59bd.png', '1af91bf292bf866.png', '1c4e1a60f6f272b.png', '1dc9966231bea27.png', '1eabadf2bd066b9.png', '281951ff9525864.png', '322bffcdeb73e92.png', '341b7607c0086b5.png', '347fd0623b46ecb.png', '3507bca0c9b23f2.png', '3adff5acd82c8fc.png', '41c94b1173e98ca.png', '435a273344dd828.png', '463a694731df27b.png', '522b3d709374b97.png', '53781f79a02975d.png', '53dad2f68a3469d.png', '54e82199a2c66ad.png', '55ce4863b78534b.png', '613f1e165a503d6.png', '62e8bf0026ec196.png', '6418321c3fa2aad.png', '660ee7eaaa386cc.png', '69b22d8036e2567.png', '6d60cc1eee4ff65.png', '77a022cc9cace14.png', '7c13d9d701dcbfc.png', '7c6f80332436016.png', '817a727f60859d2.png', '84a36202ad149c5.png', '8f381cec2cd704e.png', '94639b8c2810f1f.png', '9f6ac5b439b16fe.png', 'a2007e9fad8bfdb.png', 'a34273b60b6d9c1.png', 'b4b945b06f6336f.png', 'bb7a78c880c529b.png', 'bbc4ad44b295ba2.png', 'c2f97b500cea370.png', 'd29f2cc8b7fcf8c.png', 'd2ab6da55cac065.png', 'd96b1eeab623753.png', 'e30594246d32039.png', 'e7986ce0e6f81e5.png', 'ea45b164250754a.png', 'ebeeab25f1c1923.png', 'ec9114d102d52a4.png', 'eea33baf5d766a4.png', 'f1814b5c3b25f75.png', 'f52a913f0ed89fe.png', 'ffd7d8c5d6f920b.png', ];

const pickRandomItems = (itemPool, numberOfpicks) => {
	const randomSelections = [];
	for (let i = 0; i < numberOfpicks; i++) {
		let randomNum = Math.floor(Math.random() * itemPool.length);
		randomSelections.push(itemPool[randomNum]);
		itemPool.splice(randomNum, 1);
	}
	return randomSelections;
};

const duplicateArray = array => array.concat(array);
const randomizeOrder = array => array.sort(() => Math.random() - Math.random());
const duplicateAndRandomizeArray = array =>
	randomizeOrder(duplicateArray(array));

const shuffleCards = (slots, content) => {
	slots.forEach(slot => {
		let item = content.pop();
		slot.style.backgroundImage = `url("./img/pixelart/${item}")`;
		slot.setAttribute('name', item.match(/^[\w\d-_]+/));
	});
};

const renderTimer = slot => {
	for (let i = 0; i < 999; i++) {
		clearInterval(i);
	}
	let timer = 0;
	const intervalID = setInterval(() => {
		matchState.coincidences === 8 ? clearInterval(intervalID) : false;
		timer++;
		slot.innerText = `${timer / 10}`;
	}, 100);
};

const changeTurnState = target => {
	turnState.names.add(target.parentNode.getAttribute('name'));
	turnState.ids.add(target.parentNode.id);
	turnState.clicks++;
};

const handleAttempt = () => {
	matchState.attempts++;
	document.querySelector('#attempts').innerText = matchState.attempts;
};

const handleCoincidence = names => {
	$backSides.forEach($backSide => {
		names.has($backSide.getAttribute('name')) &&
			setTimeout(() => {
				$backSide.classList.add('hidden');
				$backSide.pointerEvents = 'all';
			}, 500);
	});
	matchState.coincidences++;
	$progress.ariaValueNow = `${(matchState.coincidences * 100) / 8}%`;
	$progress.style.width = `${(matchState.coincidences * 100) / 8}%`;
	turnState = new TurnVariables();
};

const handleDifference = (ids, target) => {
	$frontSides.forEach($frontSide => {
		if (ids.has($frontSide.parentNode.id)) {
			$frontSide.classList.remove('hidden');
			$frontSide.style.pointerEvents = 'all';
		}
	});
	turnState = new TurnVariables();
	target.classList.add('hidden');
	turnState.names.add(target.parentNode.getAttribute('name'));
	turnState.ids.add(target.parentNode.id);
	turnState.clicks++;
};

const handleWin = () => {
	document.querySelector('#final-attempts').innerText =
		matchState.attempts + ' tries';
	document.querySelector('#final-time').innerText =
		(+($timer.innerText) + 0.1) + ' seconds';
	$winMessage.classList.remove('none');
	$memotest.classList.add('none');
};

const restartDOM = () => {
	$winMessage.classList.add('none');
	$backSides.forEach($backSide => $backSide.classList.remove('hidden'));
	$frontSides.forEach($frontSide => $frontSide.classList.remove('hidden'));
	$memotest.classList.remove('none');
	document.querySelector('#attempts').innerText = 0;
	$progress.style.width = 0;
	$progress.ariaValueNow = 0;
	$memotest.classList.add('pointer');
};

const restartState = () => {
	matchState = new MatchVariables();
	turnState = new TurnVariables();
};

const handleCardClick = target => {
	target.classList.add('hidden');
	changeTurnState(target);
	if (turnState.ids.size === 2 && turnState.clicks === 2) {
		handleAttempt();
		if (turnState.names.size === 1) {
			handleCoincidence(turnState.names);
			if (matchState.coincidences === 8) {
				handleWin();
			}
		}
	}
	if (turnState.clicks === 3) {
		handleDifference(turnState.ids, target);
	}
};

document.querySelector('#start').onclick = () => {
	restartDOM();
	restartState();
	const randomSelections = pickRandomItems(imageReferences, 8);
	const deckToShuffle = duplicateAndRandomizeArray(randomSelections);
	shuffleCards($backSides, deckToShuffle);
	renderTimer($timer);
	$memotest.onclick = e =>
		e.target.nodeName === 'IMG' && handleCardClick(e.target);
};
