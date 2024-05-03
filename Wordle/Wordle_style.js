"use strict";

const words = ["davis", "queue", "stack", "pixel", "debug", "class", "array", "index"]
let guessCount = 0
let word = ""
let lastGuess = ""

document.addEventListener('DOMContentLoaded', () => {
    initializeGame()
    const userGuessInput = document.getElementById('userGuess');
    if (userGuessInput) {
        userGuessInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                makeGuess();
                setTimeout(() => {
                    checkGame(lastGuess);
                }, 150);
            }
        });
    }
});

function initializeGame(){
    word = words[random()]
    console.log(word)
    guessCount = 0
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.className = 'cell';
    });
    document.getElementById("game-message").textContent = ""
}

function random() {
    return Math.floor(Math.random(0, 1) * words.length);
}

function makeGuess(){
    let currentWord = document.getElementById("userGuess").value.toLowerCase();
    let regularExpression = /^[a-zA-Z]+$/;
    //check if valid input (5 letters and all alphabetic characters)
    if(currentWord.length != 5 || !regularExpression.test(currentWord)){
        document.getElementById("error-message").textContent = "Word must be 5 letters and all alphabetic characters"
        document.getElementById("userGuess").value = ""
        return
    }
    
    const firstLetterOfWordID = guessCount * 5 + 1
    let curr = word //used to eliminate where two letters appear orange when only one occurence in actual word
    for(let i = 0; i < currentWord.length; i++){
        let currentLetter = currentWord[i] 
        let letterID = firstLetterOfWordID + i
        document.getElementById(letterID).innerText = currentLetter //showcase letter inside dedicated cell
        if(currentLetter == word[i]){ //check for correct letter in correct spot
            document.getElementById(letterID).classList.add("green")
            curr = curr.replace(currentLetter, '')
            console.log(curr)
        }
    }
    for(let i = 0; i < currentWord.length; i++){
        let currentLetter = currentWord[i] 
        let letterID = firstLetterOfWordID + i
        if(curr.includes(currentLetter)){ //check for correct letter in incorrect spot
            document.getElementById(letterID).classList.add("orange")
            curr = curr.replace(currentLetter, '')
        }
    }
    for(let i = 0; i < currentWord.length; i++){
        let currentLetter = currentWord[i] 
        let letterID = firstLetterOfWordID + i
        if(!word.includes(currentLetter) || document.getElementById(letterID).classList.length < 2){
            document.getElementById(letterID).classList.add("gray")
        }
    }
    document.getElementById("userGuess").value = ""
    document.getElementById("error-message").textContent = ""
    guessCount++
    lastGuess = currentWord
}

function checkGame(lastGuess){
    if(lastGuess == word){
        document.getElementById("game-message").classList.add("win")
        document.getElementById("game-message").textContent = "You won!"
        setTimeout(() => {
            initializeGame()
        }, 1000);
    } else if(guessCount == 6){
        document.getElementById("game-message").classList.add("loss")
        document.getElementById("game-message").textContent = "Correct word was " + word
        setTimeout(() => {
            initializeGame()
        }, 1000);
    }
}

