const player = document.getElementById('player');
const obstacles = [
    document.getElementById('obstacle1'),
    document.getElementById('obstacle2'),
    document.getElementById('obstacle3')
];
const scoreDisplay = document.getElementById('score');
const gameOverNotif = document.getElementById('gameOverNotif');
const finalScore = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

let playerY = 0;
let playerVelocity = 0;
const gravity = 0.0;
const jumpStrength = -15;
let obstaclePositions = [800, 1200, 1600]; // Initial positions
let score = 0;
let gameRunning = true;

function jump() {
    if (playerY === 0) { // Only jump if on ground
        playerVelocity = jumpStrength;
    }
}

function update() {
    if (!gameRunning) return;

    // Update player
    playerVelocity += gravity;
    playerY += playerVelocity;
    if (playerY < 0) {
        playerY = 0; // Ground
        playerVelocity = 0; // Stop falling
    }
    if (playerY > 350) playerY = 350; // Ceiling (game height 400 - player height 50)
    player.style.bottom = playerY + 'px';

    // Update obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstaclePositions[i] -= 5;
        if (obstaclePositions[i] < -50) {
            obstaclePositions[i] = 800 + Math.random() * 400; // Random respawn
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
        }
        obstacles[i].style.right = (800 - obstaclePositions[i]) + 'px';

        // Collision detection
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacles[i].getBoundingClientRect();
        if (playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top && playerRect.top < obstacleRect.bottom) {
            gameRunning = false;
            setTimeout(() => restartGame(), 500); // Auto restart after 0.5 seconds
        }
    }

    requestAnimationFrame(update);
}

function showGameOver() {
    finalScore.textContent = 'Score: ' + score;
    gameOverNotif.classList.add('show');
}

function restartGame() {
    playerY = 0;
    playerVelocity = 0;
    obstaclePositions = [800, 1200, 1600];
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameRunning = true;
    gameOverNotif.classList.remove('show');
    update();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            jump();
        }
    }
});

restartBtn.addEventListener('click', restartGame);

update();