"use strict";
const words = ["javascript", "hangman", "programming", "coding", "game", "mississippi"]
function random() {
    return Math.floor(Math.random(0, 1) * words.length);
}
let selectedWord = words[random()];
let displayWord = "_".repeat(selectedWord.length).split(''); // Create an array of underscores
let wrongGuesses = 0;
let blackslash = "\\";

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
                alert('Congratulations! You won!');
            }
        } else {
            wrongGuesses++;
            updateHangmanDrawing();
            document.getElementById('WrongCount').innerText = 'Wrong guesses: ' + wrongGuesses;
            // Check if the game is lost
            setTimeout(() => {
                if (wrongGuesses >= 6) {
                    alert('Game Over! The word was: ' + selectedWord);
                }
            }, 100);
        }
    } else {
        alert('Please enter a valid letter.');
    }
    document.getElementById('userGuess').value = '';  // Clear the input field
}

document.addEventListener('DOMContentLoaded', function () {
    const userGuessInput = document.getElementById('userGuess');
    if (userGuessInput) {
        userGuessInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                makeGuess();
            }
        });
    }
});

