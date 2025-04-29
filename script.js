const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const difficultySelector = document.getElementById("difficulty");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Baris
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Kolom
    [0, 4, 8], [2, 4, 6]             // Diagonal
];

function handleClick(e) {
    const index = e.target.dataset.index;

    if (board[index] !== "" || !gameActive || currentPlayer !== "X") return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `Pemain ${currentPlayer} menang!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusText.textContent = "Permainan seri!";
        gameActive = false;
        return;
    }

    currentPlayer = "O";
    statusText.textContent = `Giliran Bot (${currentPlayer})`;

    setTimeout(botMove, 500); // Memberi sedikit jeda untuk bot
}

function botMove() {
    const difficulty = difficultySelector.value;
    let move;

    if (difficulty === "easy") {
        move = easyBot();
    } else if (difficulty === "medium") {
        move = mediumBot();
    } else if (difficulty === "hard") {
        move = hardBot();
    } else if (difficulty === "impossible") {
        move = impossibleBot();
    }

    board[move] = currentPlayer;
    cells[move].textContent = currentPlayer;

    if (checkWin()) {
        statusText.textContent = `Bot (${currentPlayer}) menang!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusText.textContent = "Permainan seri!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    statusText.textContent = `Giliran pemain ${currentPlayer}`;
}

function easyBot() {
    const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function mediumBot() {
    if (Math.random() > 0.5) return easyBot();
    return hardBot();
}

function hardBot() {
    // Cari langkah menang untuk bot
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === "O" && board[b] === "O" && board[c] === "") return c;
        if (board[a] === "O" && board[b] === "" && board[c] === "O") return b;
        if (board[a] === "" && board[b] === "O" && board[c] === "O") return a;
    }

    // Blok langkah menang lawan
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] === "X" && board[b] === "X" && board[c] === "") return c;
        if (board[a] === "X" && board[b] === "" && board[c] === "X") return b;
        if (board[a] === "" && board[b] === "X" && board[c] === "X") return a;
    }

    return easyBot();
}

function impossibleBot() {
    // Menggunakan algoritma Minimax untuk langkah sempurna
    function minimax(newBoard, player) {
        const emptyCells = newBoard.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);

        if (checkWinner(newBoard, "X")) return { score: -10 };
        if (checkWinner(newBoard, "O")) return { score: 10 };
        if (emptyCells.length === 0) return { score: 0 };

        const moves = [];

        for (const index of emptyCells) {
            const move = { index };
            newBoard[index] = player;

            if (player === "O") {
                move.score = minimax(newBoard, "X").score;
            } else {
                move.score = minimax(newBoard, "O").score;
            }

            newBoard[index] = "";
            moves.push(move);
        }

        return moves.reduce((bestMove, move) => 
            (player === "O" ? move.score > bestMove.score : move.score < bestMove.score) ? move : bestMove
        );
    }

    return minimax([...board], "O").index;
}

function checkWinner(board, player) {
    return winConditions.some(condition => 
        condition.every(index => board[index] === player)
    );
}

function checkWin() {
    return checkWinner(board, currentPlayer);
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    cells.forEach(cell => cell.textContent = "");
    statusText.textContent = `Giliran pemain ${currentPlayer}`;
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
resetButton.addEventListener("click", resetGame);