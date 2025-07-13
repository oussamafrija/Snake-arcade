const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let veloCityX = 0, veloCityY = 0;
let setIntervalId;
let score = 0;
// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High score: ${highScore}`;

const changeFoodPosition = () => {
    // Passing a random 0-30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reload the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay");
    location.reload();
}

const changeDirection = (e) => {
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && veloCityY != 1){
        veloCityX = 0;
        veloCityY = -1;
    }else if(e.key === "ArrowDown" && veloCityY != -1){
        veloCityX = 0;
        veloCityY = 1;
    }
    else if(e.key === "ArrowLeft" && veloCityX != 1){
        veloCityX = -1;
        veloCityY = 0;
    }
    else if(e.key === "ArrowRight" && veloCityX != -1){
        veloCityX = 1;
        veloCityY = 0;
    }
}

// Make mobile arrow buttons trigger real keyboard-like behavior
controls.forEach(key => {
    key.addEventListener("click", () => {
        const event = new KeyboardEvent("keydown", { key: key.dataset.key });
        document.dispatchEvent(event);
    });
});

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class = "food" style = "grid-area: ${foodY} / ${foodX}"></div>`;
    // Checking if the snake hits the food
    if(snakeX === foodX && snakeY === foodY){
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //pushing food position to snake body array
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--){
        // Shifting forward the values of elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position 

    // Updating the snake's head position depending on the current velocity
    snakeX += veloCityX;
    snakeY += veloCityY;

    // Checking if snake's head is out of the Wall, if so setting the gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }
    for (let i = 0; i < snakeBody.length; i++){
        // Adding a div for each part of the snake's body
        htmlMarkup += `<div class = "head" style = "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hits the body, if so set gameOver to true
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);
