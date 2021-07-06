/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  constructor(width, height) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.board = [];
    this.currPlayer = 1;
    this.isPlaying = false;

    this.makeBoard();
    this.makeHtmlBoard();
    this.makeMenu();
  }

  /** makeBoard: create in-JS board structure:
   *  board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }).fill(null));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'row-top');

    // bind event listener function to class object
    this.handleClicked = this.handleClick.bind(this);

    top.addEventListener('click', this.handleClicked);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** makeMenu: create menu */

  makeMenu() {
    const menu = document.getElementById('menu');

    this.createStartButton();
  }

  // handle start button click
  handleStartClick(evt) {
    this.isPlaying = true;
    evt.target.removeEventListener('click', this.handleStart);
    // delete all pieces from HTML and class boards
    this.emptyBoard();
  }

  /** deactivateStartButton: remove start button event listener*/
  deactivateStartButton() {
    const startButton = document.getElementById('start-button');
    startButton.removeEventListener('click', this.handleStart);
  }

  /** activateStartButton: add event listener to start button */
  activateStartButton() {
    const startButton = document.getElementById('start-button');
    this.handleStart = this.handleStartClick.bind(this);
    startButton.addEventListener('click', this.handleStart);
  }

  /** createStartButton: creates start button and appends it to menu div */
  createStartButton() {
    // create start button element
    const start = document.createElement('button');
    start.setAttribute('id', 'start-button');
    start.innerText = 'START';

    // add button to DOM
    const menu = document.getElementById('menu');
    menu.appendChild(start);

    // add event handler to start button
    this.activateStartButton();
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  
  endGame(msg) {
    this.isPlaying = false;

    

    // add delay to ensure last piece has been added
    setTimeout( () => {
        
        alert(msg);
        // reactivate start button -- add event listener
        this.activateStartButton();
      },
      100
    );
    
  }

  /** emptyBoard: empty board of all pieces */
  emptyBoard() {
    // empty board matrix
    this.board.forEach(row => row.fill(null));

    // empty HTML board
    const htmlBoard = document.getElementById('board');
    const pieces = htmlBoard.querySelectorAll('.piece');
    pieces.forEach(piece => piece.remove());

  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {

    // cancel event if game is not in session
    if (!this.isPlaying) return;

    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = (this.currPlayer === 1) ? 2 : 1;
  }
  
  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // require arrow function to refer to the right "this"
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  

}

new Game(6, 7);

