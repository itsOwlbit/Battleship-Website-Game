let boardArray = 
  ['0', '0', '0', '0', '0', '-1', '-1', '-1', '-1', '-1',
  '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1',
  '-1', '-1', '-1', '-1', '-1', '-1', '-1', '1', '-1', '-1',
  '-1', '2', '-1', '-1', '-1', '-1', '-1', '1', '-1', '-1',
  '-1', '2', '-1', '-1', '-1', '-1', '-1', '1', '-1', '-1',
  '-1', '2', '-1', '-1', '-1', '-1', '-1', '1', '-1', '-1',
  '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1',
  '-1', '-1', '3', '3', '3', '-1', '-1', '-1', '-1', '-1',
  '-1', '-1', '-1', '-1', '-1', '-1', '-1', '4', '4', '-1',
  '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1', '-1'];


const topMessage = document.querySelector('.top-message'); 
const bottomMessage = document.querySelector('.bottom-message');
const refreshMessage = document.querySelector('.refresh-message');
const board = document.querySelector('.game-board');

const shipsList = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol Boat'];
let shipsHealth = [5, 4, 3, 3, 2];
let turns = 0;

displayScreen();

// display screen for start of game
function displayScreen() {
  // add img
  const image = document.createElement('img');
  image.src = 'img/warship.png';
  image.classList.add('ship-img');
  board.append(image);

  // set start button event listener
  const startButton = document.querySelector('.start-button');
  startButton.addEventListener('click', populateBoard);
}

// populate board with 100 buttons that have event listeners
function populateBoard() {
  // remove ship image
  const image = document.querySelector('.ship-img');
  board.removeChild(image);

  // create 100 buttons with event listeners
  for(let i = 0; i < 100; i++) {
    const square = document.createElement('button');

    square.classList.add('square');
    square.classList.add(`sq-${i}`);
    square.addEventListener('click', attack);
    square.innerText = "";

    board.append(square);
  }

  // change button use
  const startButton = document.querySelector('.start-button');
  // startButton.classList.remove('start-button');
  startButton.classList.add('quit-button');
  startButton.classList.remove('start-button');
  startButton.innerText = 'Surrender';
  startButton.removeEventListener('click', populateBoard);
  startButton.addEventListener('click', quitGame);

  // screen text in top and bottom message bars
  topMessage.innerText = 'Click a square to attack.';
  bottomMessage.innerHTML = `Number of Turns: ${turns}`;
}

// callback for square button event listener
function attack() {
  // get the square index from it's class (sq-0)
  const squareClass = this.getAttribute('class');
  const squareId = Number(squareClass.slice(10));

  let message = "";

  // prevent double clicking
  this.setAttribute('disabled', true);
  
  // check if 'hit' or 'miss'
  if(boardArray[squareId] > -1) {
    this.classList.add('hit');
    this.innerText = 'X';
    message = checkShipsHealth(parseInt(boardArray[squareId]));
  } else {
    this.classList.add('miss');
    this.innerText = 'O';
    message = 'Miss!';
  }

  // update turns
  turns++;
  bottomMessage.innerHTML = `Number of Turns: ${turns}`;

  // check if game is over
  if(isGameOver()) {
    message = 'I lost all my ships.  YOU WIN!!!!!';
    topMessage.innerHTML = message;

    endGame();
  }

  // display message for attack results in top message bar
  topMessage.innerHTML = message;
}

// check array to see if ship has lost all its health (squares)
function checkShipsHealth(index) {
  shipsHealth[index]--;

  if(shipsHealth[index] === 0) {
    return 'YOU SUNK MY BATTLESHIP!!!';
  }
  else {
    return 'Hit!';
  }
}

// check if all ships have been sunk
function isGameOver() {
  for(let i = 0; i < shipsHealth.length; i++) {
    if(shipsHealth[i] > 0) {
      console.log(shipsHealth[i]);
      return false;
    }
  }

  return true;
}

// player won, game over
function endGame() {
  // remove event listeners on squares
  const squares = document.querySelectorAll('.square');
  for(let square of squares) {
    square.removeEventListener('click', attack);
  }

  // disable surrender button
  const surrender = document.querySelector('.quit-button');
  surrender.removeEventListener('click', quitGame);
  surrender.classList.remove('quit-button');
  surrender.classList.add('end-button');
  surrender.innerHTML = "Game Over";

  refreshMessage.innerHTML = '<br />** Refresh page **<br />to play again.';
}


// player surrendered, game over
function quitGame() {
  const squares = document.querySelectorAll('.square');
  for(let square of squares) {
    square.removeEventListener('click', attack);
    // square.style.visibility = 'hidden';
    board.removeChild(square);
  }

  const image = document.createElement('img');
  image.src = 'img/warship.png';
  image.classList.add('ship-img');
  board.append(image);
  
  // disable surrender button
  const surrender = document.querySelector('.quit-button');
  surrender.removeEventListener('click', quitGame);
  surrender.classList.remove('quit-button');
  surrender.classList.add('end-button');
  surrender.innerHTML = "Game Over";

  topMessage.innerHTML = 'You have surrendered.  The computer wins!';
  bottomMessage.innerHTML = 'Refresh page to play again.';
}