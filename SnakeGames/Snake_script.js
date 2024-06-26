"use strict";
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const restartButton = document.getElementById("restartButton");
let gameOver = false; // Game over flag
let foodX, foodY; // Food position
let snakeX = 5, snakeY = 5; // Snake head position 
let velocityX = 0, velocityY = 0; // Snake velocity 
let snakeBody = []; // Snake body array
let setIntervalId; // Interval id for the game loop
let score = 0; // Score
let currentSpeed = 200; // Game speed in milliseconds

const gameSpeed = { //added for game mode selection
    'easy': 200,
    'hard': 50,
    'crazy': 25
};
// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0; //added for high score tracking
highScoreElement.innerText = `High Score: ${highScore}`; //added for high score tracking


const updateFoodPosition = () => { //added for food position update
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    restartButton.style.display = 'block'; // Show the restart button
}
restartButton.addEventListener('click', () => {
    location.reload(); // Reload the page to restart the game
});

const changeDirection = e => {// adapted for WASD controls Change to switch statement for better readability
    // Changing velocity value based on key press
    // if ((e.key === "ArrowUp" || e.key === "w") && velocityY != 1) {
    //     velocityX = 0;
    //     velocityY = -1;
    // } else if ((e.key === "ArrowDown" || e.key === "s") && velocityY != -1) {
    //     velocityX = 0;
    //     velocityY = 1;
    // } else if ((e.key === "ArrowLeft" || e.key === "a") && velocityX != 1) {
    //     velocityX = -1;
    //     velocityY = 0;
    // } else if ((e.key === "ArrowRight" || e.key === "d") && velocityX != -1) {
    //     velocityX = 1;
    //     velocityY = 0;
    // }
    switch (e.key) { // added for WASD controls for easier gameplay on desktop
        case "ArrowUp":
        case "w":
            if (velocityY != 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowDown":
        case "s":
            if (velocityY != -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "ArrowLeft":
        case "a":
            if (velocityX != 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowRight":
        case "d":
            if (velocityX != -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) {
        return handleGameOver();
    }

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;


    // Checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`; // grid-area: column / row
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}
updateFoodPosition();
const setGameMode = (mode) => {
    currentSpeed = gameSpeed[mode];
    if (setIntervalId) clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, currentSpeed); // Dynamically change the game speed based on the selected mode
    document.addEventListener("keydown", changeDirection); // Attach the keydown event for better control response
    restartButton.style.display = 'none'; // Hide the restart button when game mode is set
};

setGameMode('easy'); // Or any default mode you'd like to start with