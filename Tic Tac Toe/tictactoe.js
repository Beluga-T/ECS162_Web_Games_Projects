const cells = document.querySelectorAll('.cell');
let currentPlayer = 'X'; // Player X is always the human
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

// Winning conditions using the indices of the gameState array
//
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Event listeners to handle game start and cell interaction
document.addEventListener('DOMContentLoaded', () => {
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('restartButton').addEventListener('click', restartGame);
});


// whenever the user clicks the restart game button,
// we reinitialize the game state
//
function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    document.getElementById('resultDisplay').innerText = "Player X's turn";
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.className = 'cell'; // Reset classes
    });
}

// get the game diffculty from the radio button
//
function getDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

// Interact with the user by responding to clicks on the cells
// and changing the cell state. 
//
function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'red' : 'blue');
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive || currentPlayer === 'O') {
        return;
    }

    // we respond to a click by handling the cell that has been played
    // and then updating the overall game status
    //
    handleCellPlayed(clickedCell, clickedCellIndex);
    updateGameStatus();
}

// when we update the game status, we only want to toggle the
// next player if the game is still active, that is, we do
// not yet have a winner
//
function updateGameStatus() {
    const result = checkWinner();
    if (result) {
        gameActive = false;
        if (result === 'tie') {
            document.getElementById('resultDisplay').innerText = "Game Draw!";
        } else {
            document.getElementById('resultDisplay').innerText = `Player ${result} Wins!`;
        }
    } else {
        togglePlayer();
    }
}

// select the other player, human player starts
//
function togglePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('resultDisplay').innerText = "Player " + currentPlayer + "'s turn";

    // note that you can change difficulty mid game!
    //
    if (currentPlayer === 'O' && gameActive) {
        let difficulty = getDifficulty();
        if(difficulty === "easy")
            randomComputerMove();
        else if(difficulty === "medium")
            staticEvaluatorComputerMove();
        else
            minimaxComputerMove(9); 
    }
}

// checking to see if there is currently a winner
//
function checkWinner() {

    // if the board is such that the same board state exists
    // in a winning conndition, then that player has won the game
    //
    for (let condition of winningConditions) {
        const [a, b, c] = condition.map(index => gameState[index]);
        if (a && a === b && b === c) {
            return a;  // 'X' or 'O'
        }
    }

    // if there are no longer any cells with no X or O
    // then there are no more empty cells to play
    //
    if (!gameState.includes("")) {
        return 'tie'; // Game is a draw
    }
    return null; // No winner yet
}

// The simplest computer move, just pick a random cell
//
function randomComputerMove() {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === "") {
            availableCells.push(index);
        }
    });

    if (availableCells.length > 0) {
        const move = availableCells[Math.floor(Math.random() * availableCells.length)];
        handleCellPlayed(cells[move], move);  // Assume this function places the mark and updates the game state
        updateGameStatus();  // Assume this function checks for a win/draw and updates the UI
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// meditum and hard difficulty computer moves follow
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// A medium computer move, try to move intelligently, however,
// there is no lookahead beyond the current state of the board
//
function staticEvaluatorComputerMove() {
    // Check for immediate wins or blocks
    //
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            // Test for a winning move for 'O'
            gameState[i] = 'O';
            if (checkWinner() === 'O') {
                handleCellPlayed(cells[i], i);
                updateGameStatus();
                return;
            }
            gameState[i] = ''; // Reset the cell

            // Test for blocking 'X' from winning
            //
            gameState[i] = 'X';
            if (checkWinner() === 'X') {
                gameState[i] = 'O'; // Place 'O' to block
                handleCellPlayed(cells[i], i);
                updateGameStatus();
                return;
            }
            gameState[i] = ''; // Reset the cell
        }
    }

    // Try to take the center if it's available and not yet checked
    //
    if (gameState[4] === "") {
        gameState[4] = 'O';
        handleCellPlayed(cells[4], 4);
        updateGameStatus();
        return;
    }

    // Prioritize corners over edges if center is not available
    //
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameState[index] === "");
    if (availableCorners.length > 0) {
        const move = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        gameState[move] = 'O';
        handleCellPlayed(cells[move], move);
        updateGameStatus();
        return;
    }

    // Fallback to random move if no strategic advantage can be gained
    //
    randomComputerMove();
}



// The minimax function is a recursive algorithm that simulates all possible 
// moves in the game and evaluates their outcomes. It's used to determine the 
// best move for the computer player by exploring the game tree, which is a 
// hypothetical tree of all possible moves and their outcomes.
// 
// The function takes four parameters:
//  - board: the current state of the game board
//
//  - depth: the current depth of the recursion (i.e., how many moves ahead 
//           we're simulating)
//
//  - isMaximizing: a boolean indicating whether we're trying to maximize 
//                  the score (for 'O') or minimize it (for 'X')
//  - maxDepth: the maximum depth of the recursion, which limits how far ahead 
//              we'll simulate
// 
// The function returns a score for each possible move, which is used to determine 
// the best move.If the current game state is a win for 'O', the function returns 10. 
// If it's a win for 'X', it returns -10. If it's a tie, it returns 0.
// 
// The minimax function uses recursion to explore all possible moves and their outcomes. 
// It simulates each possible move by making a temporary change to the board, recursively 
// calling itself with the new board state, and then undoing the change.
// 
// The outer loop in the main function iterates over each cell on the board, makes a 
// hypothetical move, evaluates the outcome using minimax, and keeps track of the best 
// score and corresponding move.
// 
// Finally, the function updates the game state with the best move found.assistant
//
function minimaxComputerMove(maxDepth) {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false, maxDepth);
            gameState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    if (move != null) {
        handleCellPlayed(cells[move], move);
        updateGameStatus();
    }

    function minimax(board, depth, isMaximizing, maxDepth) {
        if (depth === maxDepth) return 0;

        let winner = checkWinner();
        if (winner !== null) {
            return winner === 'O' ? 10 : winner === 'X' ? -10 : 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false, maxDepth);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === "") {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true, maxDepth);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
}


