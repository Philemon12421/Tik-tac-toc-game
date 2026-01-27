const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const playerScoreEl = document.getElementById("playerScore");
const aiScoreEl = document.getElementById("aiScore");
const levelEl = document.getElementById("level");

let board = Array(9).fill("");
let playerScore = 0;
let aiScore = 0;
let level = 1;
let gameOver = false;
let gameMode = "cpu"; // cpu | local
let currentTurn = "X";

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ---------------- MODE SWITCH ----------------
function setMode(mode) {
  gameMode = mode;
  resetGame();

  statusEl.textContent =
    mode === "cpu" ? "YOUR MOVE" : "PLAYER X TURN";
}

// ---------------- CREATE BOARD ----------------
function createBoard() {
  boardEl.innerHTML = "";
  board = Array(9).fill("");
  gameOver = false;
  currentTurn = "X";

  statusEl.textContent =
    gameMode === "cpu" ? "YOUR MOVE" : "PLAYER X TURN";

  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => handleMove(i);
    boardEl.appendChild(cell);
  });
}

// ---------------- HANDLE MOVE ----------------
function handleMove(i) {
  if (board[i] || gameOver) return;

  board[i] = currentTurn;
  render();

  if (checkEnd()) return;

  if (gameMode === "cpu" && currentTurn === "X") {
    currentTurn = "O";
    statusEl.textContent = "AI THINKING...";
    setTimeout(aiMove, 400);
  } else {
    currentTurn = currentTurn === "X" ? "O" : "X";
    statusEl.textContent = `PLAYER ${currentTurn} TURN`;
  }
}

// ---------------- AI MOVE ----------------
function aiMove() {
  let move;

  if (level < 3 && Math.random() < 0.3) {
    move = randomMove();
  } else {
    move = minimax(board, "O").index;
  }

  board[move] = "O";
  render();

  if (!checkEnd()) {
    currentTurn = "X";
    statusEl.textContent = "YOUR MOVE";
  }
}

function randomMove() {
  const empty = board
    .map((v,i)=>v===""?i:null)
    .filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

// ---------------- MINIMAX ----------------
function minimax(newBoard, player) {
  const empty = newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);

  if (checkWinner(newBoard,"X")) return {score:-10};
  if (checkWinner(newBoard,"O")) return {score:10};
  if (!empty.length) return {score:0};

  let moves = [];

  for (let i of empty) {
    let move = { index: i };
    newBoard[i] = player;

    let result = minimax(newBoard, player==="O"?"X":"O");
    move.score = result.score;

    newBoard[i] = "";
    moves.push(move);
  }

  return player === "O"
    ? moves.reduce((a,b)=>a.score>b.score?a:b)
    : moves.reduce((a,b)=>a.score<b.score?a:b);
}

// ---------------- CHECK WIN ----------------
function checkWinner(b,p) {
  return WIN_COMBOS.some(c=>c.every(i=>b[i]===p));
}

// ---------------- CHECK GAME END ----------------
function checkEnd() {
  if (checkWinner(board,"X")) {
    statusEl.textContent =
      gameMode === "cpu" ? "YOU WON!" : "PLAYER X WON!";
    playerScore++;
    level++;
    gameOver = true;
  }
  else if (checkWinner(board,"O")) {
    statusEl.textContent =
      gameMode === "cpu" ? "AI WON!" : "PLAYER O WON!";
    aiScore++;
    level++;
    gameOver = true;
  }
  else if (!board.includes("")) {
    statusEl.textContent = "DRAW!";
    gameOver = true;
  }

  updateUI();
  return gameOver;
}

// ---------------- RENDER ----------------
function render() {
  boardEl.childNodes.forEach((cell,i)=>{
    cell.textContent = board[i];
    cell.classList.toggle("x", board[i]==="X");
    cell.classList.toggle("o", board[i]==="O");
  });
}

// ---------------- UI ----------------
function updateUI() {
  playerScoreEl.textContent = playerScore;
  aiScoreEl.textContent = aiScore;
  levelEl.textContent = level;
}

// ---------------- RESET ----------------
function resetGame() {
  createBoard();
}

// ---------------- START ----------------
createBoard();
