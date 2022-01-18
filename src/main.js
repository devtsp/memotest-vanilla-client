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

const duplicateArray = array => array.concat(array);
const randomizeArray = array => array.sort(() => Math.random() - Math.random());
const newDuplicateRandomArray = array => randomizeArray(duplicateArray(array));

const shuffleCards = (slots, content) => {
	slots.forEach(slot => {
		let item = content.pop();
		slot.style.backgroundImage = `url("./img/theme/${item}")`;
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

const handleCoincidence = names => {
	$backSides.forEach($backSide => {
		names.has($backSide.getAttribute('name')) &&
			setTimeout(() => {
				$backSide.classList.add('hidden');
				$backSide.pointerEvents = 'all';
			}, 500);
	});
};

const handleDifference = ids => {
	$frontSides.forEach($frontSide => {
		if (ids.has($frontSide.parentNode.id)) {
			$frontSide.classList.remove('hidden');
			$frontSide.style.pointerEvents = 'all';
		}
	});
};

const handleCardClick = target => {
	target.classList.add('hidden');
	turnState.names.add(target.parentNode.getAttribute('name'));
	turnState.ids.add(target.parentNode.id);
	turnState.clicks++;
	if (turnState.ids.size === 2 && turnState.clicks === 2) {
		matchState.attempts++;
		document.querySelector('#attempts').innerText = matchState.attempts;
		if (turnState.names.size === 1) {
			handleCoincidence(turnState.names);
			matchState.coincidences++;
			$progress.ariaValueNow = `${(matchState.coincidences * 100) / 8}%`;
			$progress.style.width = `${(matchState.coincidences * 100) / 8}%`;
			turnState = new TurnVariables();
			if (matchState.coincidences === 8) {
				document.querySelector('#final-attempts').innerText =
					matchState.attempts + ' tries';
				document.querySelector('#final-time').innerText =
					$timer.innerText + ' seconds';
				$winMessage.classList.remove('none');
				$memotest.classList.add('none');
			}
		}
	}
	if (turnState.clicks === 3) {
		handleDifference(turnState.ids);
		turnState = new TurnVariables();
		target.classList.add('hidden');
		turnState.names.add(target.parentNode.getAttribute('name'));
		turnState.ids.add(target.parentNode.id);
		turnState.clicks++;
	}
};

document.querySelector('#start').onclick = () => {
	$winMessage.classList.add('none');
	$backSides.forEach($backSide => $backSide.classList.remove('hidden'));
	$frontSides.forEach($frontSide => $frontSide.classList.remove('hidden'));
	$memotest.classList.remove('none');
	document.querySelector('#attempts').innerText = 0;
	$progress.style.width = 0;
	$progress.ariaValueNow = 0;
	$memotest.classList.add('pointer');
	matchState = new MatchVariables();
	turnState = new TurnVariables();
	shuffleCards($backSides, newDuplicateRandomArray(imageReferences));
	renderTimer($timer);
	$memotest.onclick = e =>
		e.target.nodeName === 'IMG' && handleCardClick(e.target);
};
