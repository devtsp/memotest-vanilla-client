const $memoTest = document.querySelector('#memotest');
const memoTestCards = Array.from($memoTest.children);

function memoTestRandomDisplay() {
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
			imageAssigner(card)
    } else {
      card.name = selectImg.match(/^[\w\d-_]+/);
      card.style.backgroundImage = `url("./img/${selectImg}")`;
    }
	}

	memoTestCards.forEach(card => {
		imageAssigner(card)
	});
}

document.querySelector('#shuffle').onclick = memoTestRandomDisplay;


