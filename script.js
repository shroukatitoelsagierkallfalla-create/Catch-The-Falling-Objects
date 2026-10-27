// ==========================================
// Game Variables
// ==========================================

const game = document.getElementById("game");
const basket = document.getElementById("basket");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");

const startMessage = document.getElementById("start-message");
const startButton = document.getElementById("startButton");

const gameOverScreen = document.getElementById("game-over");
const restartButton = document.getElementById("restartButton");
const finalScore = document.getElementById("final-score");


// ==========================================
// Variables
// ==========================================

let score = 0;
let lives = 3;

let basketPosition = 320;

let gameRunning = false;

let fallingObjects = [];

let gameLoop;
let objectSpawner;


// Fruits
const fruits = ["🍋", "🍓", "🍊", "🍉", "🍍"];


// ==========================================
// Start Game
// ==========================================

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);


function startGame() {

    // Reset values
    score = 0;
    lives = 3;

    basketPosition = 320;

    gameRunning = true;

    // Update scoreboard
    scoreElement.textContent = score;
    livesElement.textContent = lives;

    // Reset basket
    basket.style.left = basketPosition + "px";

    // Hide screens
    startMessage.style.display = "none";
    gameOverScreen.style.display = "none";

    // Remove old objects
    fallingObjects.forEach(function(object) {
        object.element.remove();
    });

    fallingObjects = [];

    // Start falling objects
    objectSpawner = setInterval(createObject, 1000);

    // Start game loop
    gameLoop = setInterval(updateObjects, 20);
}


// ==========================================
// Move Basket
// ==========================================

document.addEventListener("keydown", function(event) {

    if (!gameRunning) {
        return;
    }

    const basketSpeed = 30;

    // Move Left
    if (event.key === "ArrowLeft") {

        basketPosition -= basketSpeed;

    }

    // Move Right
    if (event.key === "ArrowRight") {

        basketPosition += basketSpeed;

    }


    // Keep basket inside game area

    if (basketPosition < 0) {

        basketPosition = 0;

    }


    if (basketPosition > game.clientWidth - basket.offsetWidth) {

        basketPosition = game.clientWidth - basket.offsetWidth;

    }


    basket.style.left = basketPosition + "px";

});


// ==========================================
// Create Falling Object
// ==========================================

function createObject() {

    if (!gameRunning) {
        return;
    }

    const object = document.createElement("div");

    object.classList.add("falling-object");

    // Random fruit
    const randomFruit =
        fruits[Math.floor(Math.random() * fruits.length)];

    object.textContent = randomFruit;


    // Random horizontal position

    const randomPosition =
        Math.random() *
        (game.clientWidth - 50);

    object.style.left = randomPosition + "px";


    // Add object to game

    game.appendChild(object);


    // Store object

    fallingObjects.push({

        element: object,

        top: -50,

        speed: 3 + Math.random() * 2

    });

}


// ==========================================
// Update Falling Objects
// ==========================================

function updateObjects() {

    for (let i = fallingObjects.length - 1; i >= 0; i--) {

        const object = fallingObjects[i];

        // Move object down

        object.top += object.speed;

        object.element.style.top =
            object.top + "px";


        // Check collision

        if (isColliding(object.element, basket)) {

            // Increase score

            score++;

            scoreElement.textContent = score;


            // Remove object

            object.element.remove();

            fallingObjects.splice(i, 1);

            continue;
        }


        // Check if object reached ground

        if (object.top > game.clientHeight) {

            // Lose life

            lives--;

            livesElement.textContent = lives;


            // Remove object

            object.element.remove();

            fallingObjects.splice(i, 1);


            // Check Game Over

            if (lives <= 0) {

                endGame();

            }
        }
    }
}


// ==========================================
// Collision Detection
// ==========================================

function isColliding(object, basket) {

    const objectRect =
        object.getBoundingClientRect();

    const basketRect =
        basket.getBoundingClientRect();


    return (

        objectRect.left < basketRect.right &&

        objectRect.right > basketRect.left &&

        objectRect.top < basketRect.bottom &&

        objectRect.bottom > basketRect.top

    );
}


// ==========================================
// Game Over
// ==========================================

function endGame() {

    gameRunning = false;

    clearInterval(gameLoop);

    clearInterval(objectSpawner);


    // Remove remaining objects

    fallingObjects.forEach(function(object) {

        object.element.remove();

    });

    fallingObjects = [];


    // Display final score

    finalScore.textContent = score;


    // Show Game Over

    gameOverScreen.style.display = "flex";
}