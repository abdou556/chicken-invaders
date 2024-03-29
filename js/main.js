// Game screen settings
const gameWidth = 400;
const gameHeight = 400; // Corrected typo in variable name
const playerSize = 60;
const enemySize = 40;
const bulletSize = 10;

// player movement settings
const playerSpeed = 3;
let playerX = gameWidth / 2 - playerSize / 2;
let playerY = gameHeight - playerSize - 20;
let IsMovingleft = false;
let IsMovingRight = false;

// Enemy settings
const enemySpeed = 2;
let enemies = [];

// bullet settings
const bulletSpeed = 5;
let bullets = [];

// Game state variables
let score = 0;

// game screen element
const gameScreen = document.getElementById('game-screen');
const scoreElement = document.getElementById('score');

// Add event Listener for player Movement
document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

// start game
const gameInterval = setInterval(updateGame, 20); // Store the interval ID

// function to handle keydown event
function handleKeydown(event) {
    if (event.code === 'ArrowLeft') {
        IsMovingleft = true; // Corrected assignment operator
    } else if (event.code === 'ArrowRight') {
        IsMovingRight = true; // Corrected assignment operator
    } else if (event.code === 'Space') {
        shoot();
    }
}

// function to handle keyUp event
function handleKeyup(event) {
    if (event.code === 'ArrowLeft') {
        IsMovingleft = false; // Corrected assignment operator
    } else if (event.code === 'ArrowRight') {
        IsMovingRight = false; // Corrected assignment operator
    }
}

function updateGame() {
    clearScreen();
    movePlayer();
    moveBullets();
    createEnemies();
    moveEnemies();
    checkCollisions();
    renderPlayer();
    renderBullets();
    renderEnemies();
    renderScore();
}

function clearScreen() {
    gameScreen.innerHTML = '';
}

function movePlayer() {
    if (IsMovingleft && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (IsMovingRight && playerX < gameWidth - playerSize) {
        playerX += playerSpeed;
    }
}

function shoot() {
    const bullet = {
        x: playerX + playerSize / 2 - bulletSize / 2,
        y: playerY - bulletSize
    };
    bullets.push(bullet);
}

function moveBullets() {
    bullets = bullets.filter(bullet => bullet.y > 0);
    bullets.forEach(bullet => bullet.y -= bulletSpeed);
}

function createEnemies() {
    if (Math.random() < 0.02) {
        const enemy = {
            x: Math.random() * (gameWidth - enemySize),
            y: -enemySize
        };
        enemies.push(enemy);
    }
}

function moveEnemies() {
    enemies = enemies.filter(enemy => enemy.y < gameHeight);
    enemies.forEach(enemy => enemy.y += enemySpeed);
}

function checkCollisions() {
    bullets.forEach(bullet => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemySize &&
                bullet.x + bulletSize > enemy.x &&
                bullet.y < enemy.y + enemySize &&
                bullet.y + bulletSize > enemy.y
            ) {
                bullets.splice(bullets.indexOf(bullet), 1);
                enemies.splice(enemyIndex, 1);
                score++;
            }
        });
    });
    enemies.forEach(enemy => {
        if (
            playerX < enemy.x + enemySize &&
            playerX + playerSize > enemy.x &&
            playerY < enemy.y + enemySize &&
            playerY + playerSize > enemy.y
        ) {
            gameOver();
        }
    });
}

function renderPlayer() {
    const player = document.createElement('div');
    player.id = 'player';
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px'; // Corrected property name
    gameScreen.appendChild(player);
}

function renderBullets() {
    bullets.forEach(bullet => {
        const bulletElement = document.createElement('div');
        bulletElement.className = 'bullet';
        bulletElement.style.left = bullet.x + 'px';
        bulletElement.style.top = bullet.y + 'px';
        gameScreen.appendChild(bulletElement);
    });
}

function renderEnemies() {
    enemies.forEach(enemy => {
        const enemyElement = document.createElement('div');
        enemyElement.className = 'enemy';
        enemyElement.style.left = enemy.x + 'px';
        enemyElement.style.top = enemy.y + 'px';
        gameScreen.appendChild(enemyElement);
    });
}

function renderScore() {
    scoreElement.textContent = 'Score: ' + score;
}

function gameOver() {
    clearInterval(gameInterval); // Clear the interval using the stored ID
    alert('Game Over! Your score: ' + score);
    location.reload();
}
