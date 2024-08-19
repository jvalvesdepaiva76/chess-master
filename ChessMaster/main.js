import './style.css'
import { createChessboard, movePiece } from './components/Chessboard.js'
import { loadPGN } from './components/PGNLoader.js'

document.querySelector('#app').innerHTML = `
  <input type="file" id="pgnInput" accept=".pgn">
  <div class="chess-app">
    <div id="chessboard" class="chessboard"></div>
    <div class="controls">
      <button id="prevMove">Anterior</button>
      <button id="nextMove">Próximo</button>
    </div>
    <div id="pgnDisplay" class="pgn-display"></div>
  </div>
`

let { board, pieces } = createChessboard(document.getElementById('chessboard'));
let moves = [];
let currentMoveIndex = 0;

document.getElementById('pgnInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    const pgnText = await file.text();
    moves = loadPGN(pgnText);
    displayPGN(moves);
    currentMoveIndex = 0;
    resetBoard();  // Resetar o tabuleiro ao carregar um novo PGN
  }
});

document.getElementById('nextMove').addEventListener('click', () => {
  if (currentMoveIndex < moves.length) {
    const { from, to } = moves[currentMoveIndex];
    movePiece(board, pieces, from, to);
    highlightMove(currentMoveIndex);
    currentMoveIndex++;
  }
});

document.getElementById('prevMove').addEventListener('click', () => {
  if (currentMoveIndex > 0) {
    currentMoveIndex--;
    resetBoard();
    for (let i = 0; i < currentMoveIndex; i++) {
      const { from, to } = moves[i];
      movePiece(board, pieces, from, to);
    }
    highlightMove(currentMoveIndex);
  }
});

function displayPGN(moves) {
  const pgnDisplay = document.getElementById('pgnDisplay');
  pgnDisplay.innerHTML = moves.map((move, index) =>
    `<span id="move-${index}" class="pgn-move">${move.move}</span> `
  ).join('');
}

function highlightMove(index) {
  const prev = document.querySelector('.pgn-move.highlight');
  if (prev) prev.classList.remove('highlight');

  const current = document.getElementById(`move-${index}`);
  if (current) current.classList.add('highlight');
}

function resetBoard() {
  const chessboardContainer = document.getElementById('chessboard');
  const { board: newBoard, pieces: newPieces } = createChessboard(chessboardContainer);
  board = newBoard;
  pieces = newPieces;
}
