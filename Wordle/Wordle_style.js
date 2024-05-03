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

function random() {
    return Math.floor(Math.random(0, 1) * words.length);
}

function makeGuess(){
    let currentWord = document.getElementById("userGuess").value.toLowerCase();
    let regularExpression = /^[a-zA-Z]+$/;
    if(currentWord.length != 5 || !regularExpression.test(currentWord)){
        alert("Word must be 5 letters and all alphabetic characters")
        document.getElementById("userGuess").value = ""
        return
    }
    const firstLetterOfWordID = guessCount * 5 + 1
    let curr = word
    for(let i = 0; i < currentWord.length; i++){
        let currentLetter = currentWord[i]
        let letterID = firstLetterOfWordID + i
        document.getElementById(letterID).innerText = currentLetter
        if(currentLetter == word[i]){
            document.getElementById(letterID).classList.add("green")
            curr = curr.replace(currentLetter, '')
            console.log(curr)
        } else if(curr.includes(currentLetter)){
            document.getElementById(letterID).classList.add("orange")
            curr = curr.replace(currentLetter, '')
        } else {
            document.getElementById(letterID).classList.add("gray")
        }
    }
    document.getElementById("userGuess").value = ""
    guessCount++
    lastGuess = currentWord
}

function checkGame(lastGuess){
    if(lastGuess == word){
        alert("You won!")
        setTimeout(() => {
            initializeGame()
        }, 150);
    } else if(guessCount == 6){
        alert("Correct word was" + word)
        setTimeout(() => {
            initializeGame()
        }, 150);
    }
}

function initializeGame(){
    word = words[random()]
    console.log(word)
    guessCount = 0
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.className = 'cell';
    });
}