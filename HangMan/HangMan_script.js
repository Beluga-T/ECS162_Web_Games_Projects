"use strict";
const words = ["javascript", "hangman", "programming", "coding", "game", "mississippi", "california", "coffee", "whisky", "league", "safari"];

let selectedWord = '';
let displayWord = [];
let wrongGuesses = 0;


function initializeGame() {
    wrongGuesses = 0;
    selectedWord = words[random()]; // Safely select a word
    displayWord = "_".repeat(selectedWord.length).split('');
    document.getElementById('wordDisplay').textContent = displayWord.join(' ');
    updateHangmanDrawing(); // Initialize hangman drawing correctly
}


function random() {
    console.log(Math.floor(Math.random(0, 1) * words.length));
    return Math.floor(Math.random(0, 1) * words.length);

}



const hangmanStages = [
    `
+-------+
|     |
|
|
|
|
=========`,
    `
+-------+
|     |
|     O
|
|
|
=========`,
    `
+-------+
|     |
|     O
|     |
|
|
=========`,
    `
+-------+
|     |
|     O
|    /|
|    
|
=========`,
    `
+-------+
|     |
|     O
|    /|\\
|
|      
=========`,
    `
+-------+
|     |
|     O
|    /|\\ 
|    / 
|
=========`,
    `
+-------+
|     |
|     O
|    /|\\
|    / \\
|      
=========`,
];



function updateHangmanDrawing() {

    document.getElementById('hangmanDrawing').textContent = hangmanStages[wrongGuesses];
}
function makeGuess() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function Eval(userGuess) {
        return userGuess.length === 1 && alphabet.includes(userGuess);
    }
    let userGuess = document.getElementById('userGuess').value.toLowerCase();
    if (userGuess && Eval(userGuess)) {  // Validates input is a single letter
        if (selectedWord.includes(userGuess)) {
            // Reveal the letter in the word
            selectedWord.split('').forEach((letter, index) => {
                if (letter === userGuess) {
                    displayWord[index] = userGuess;
                }
            });
            document.getElementById('wordDisplay').innerHTML = displayWord.join(' ');
            // Check if the game is won
            if (!displayWord.includes('_')) {

                setTimeout(() => {
                    alert('Congratulations! You won!');
                }, 100);
                initializeGame();

            }
        } else {
            wrongGuesses++;
            updateHangmanDrawing();
            document.getElementById('WrongCount').innerText = 'Wrong guesses: ' + wrongGuesses;
            // Check if the game is lost
            if (wrongGuesses >= 6) {
                setTimeout(() => {
                    alert('Game Over! The word was: ' + selectedWord);
                    initializeGame();
                }, 100);  // Delay to let other updates happen before alert
            }
        }
    } else {
        alert('Please enter a valid letter.');
    }
    document.getElementById('userGuess').value = '';  // Clear the input field
}

document.addEventListener('DOMContentLoaded', function () {
    initializeGame();
    const userGuessInput = document.getElementById('userGuess');
    if (userGuessInput) {
        userGuessInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                makeGuess();
            }
        });
    }
});

