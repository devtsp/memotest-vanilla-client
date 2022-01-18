class FreshGame {
	playing = true;
	clickCounter = 0;
	selectionsNames = [];
	selectionsIDs = [];
	timer = 0;
	attempts = 0;
	coincidences = 0;
}

const $restartGame = document.querySelector('#restart-game'),
  $timer = document.querySelector('#timer'),
  $attempts = document.querySelector('#attempts'),
  $winMessage = document.querySelector('#win-message'),
  $backSides = document.querySelectorAll('#memotest li'),
  $frontSides = document.querySelectorAll('#memotest li img'),
  $progressBar = document.querySelector('#progress-bar'),
  imageReferences = [
    '335.jfif',
    'explorer.jfif',
    'iceman.jfif',
    'jaguar.jfif',
    'lp.jfif',
    'sg.jfif',
    'strat.jfif',
    'tele.jfif',
  ],
  duplicateArray = array => array.concat(array),
  randomizeArray = array => array.sort(() => Math.random() - Math.random()),
  newDuplicateRandomArray = array => randomizeArray(duplicateArray(array));
	
const shuffleCards = (slots, content) => {
  slots.forEach(
    slot => {
      let item = content.pop();
      slot.style.backgroundImage = `url("./img/theme/${item}")`;
      slot.name = item.match(/^[\w\d-_]+/)
    }
  )
}

renderTimer = slot => {
  for (let i = 0; i < 999; i++) {
    clearInterval(i);
  }
  let timer = 0;
  return setInterval(() => {
    timer++;
    slot.innerText = `${timer / 10}`;
  }, 100);
};

$restartGame.onclick = () => {
	startGame = new FreshGame();
	shuffleCards($backSides, newDuplicateRandomArray(imageReferences));
	renderTimer($timer);
};




