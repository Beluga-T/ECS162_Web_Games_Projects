const words = ["javascript", "hangman", "programming", "coding"];
let selectedWord = words[Math.floor(Math.random() * words.length)];
let displayWord = "_".repeat(selectedWord.length).split('');
let wrongGuesses = 0;

document.getElementById('wordDisplay').innerHTML = displayWord.join(' ');

function makeGuess() {
    function Eval(userGuess) {
        alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
            document.getElementById('hangmanDrawing').innerText = 'Wrong guesses: ' + wrongGuesses;
            // Check if the game is lost
            if (wrongGuesses >= 6) {
                alert('Game Over! The word was: ' + selectedWord);
            }
        }
    } else {
        alert('Please enter a valid letter.');
    }
    document.getElementById('userGuess').value = '';  // Clear the input field
}

document.getElementById('userGuess').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        makeGuess();
    }
});
