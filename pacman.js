const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const tileMap = [
    "WWWWWWWWWWWWWWWWWWWWWWWWWW",
    "W . . . . . . . . . . . . W",
    "W . WWW WWW . WWW WWW . W",
    "W * W W W W . W W W W W * W",
    "W . W   W W . W W   W W . W",
    "W . . . . . . . . . . . . W",
    "W WWW WWW W W WWW WWW W W",
    "W W   W   W W W   W   W W",
    "W . . . . . . . . . . . . W",
    "W . WWW WWW . WWW WWW . W",
    "W . W W W W . W W W W W . W",
    "W * W   W   G   W   W * W",
    "W . . . P G G G . . . . . W",
    "WWWWWWWWWWWWWWWWWWWWWWWWWW"
];

const tileWidth = 32;
const tileHeight = 32;

const player = {
    x: 13 * tileWidth + tileWidth / 2,
    y: 10 * tileHeight + tileHeight / 2,
    radius: tileWidth / 2 - 2,
    speed: 3,
    direction: 0, // 0: right, 1: down, 2: left, 3: up
    nextDirection: 0,
    isPoweredUp: false,
    powerUpTimer: 0
};

const ghosts = [
    { x: 13.5 * tileWidth, y: 12 * tileHeight, color: "red", speed: 2, direction: 2, isEdible: false },
    { x: 10.5 * tileWidth, y: 12 * tileHeight, color: "pink", speed: 2, direction: 0, isEdible: false },
    { x: 11.5 * tileWidth, y: 12 * tileHeight, color: "cyan", speed: 2, direction: 1, isEdible: false },
    { x: 12.5 * tileWidth, y: 12 * tileHeight, color: "orange", speed: 2, direction: 3, isEdible: false }
];

const ghostSpawn = { x: 11.5 * tileWidth, y: 12 * tileHeight };
const ghostRespawnTime = 10 * 60; // 10 секунд * 60 кадрів/секунду
let ghostRespawnTimers = [0, 0, 0, 0];

let score = 0;
let pelletsRemaining = 0;
let gameInterval;
let isPaused = false;
let gameStarted = false;

function resetGame() {
    player.x = 13 * tileWidth + tileWidth / 2;
    player.y = 10 * tileHeight + tileHeight / 2;
    player.direction = 0;
    player.nextDirection = 0;
    player.isPoweredUp = false;
    player.powerUpTimer = 0;
    score = 0;
    scoreDisplay.textContent = score;
    pelletsRemaining = 0;
    isPaused = false;
    gameStarted = false;
    tileMap[3] = "W * W W W W . W W W W W * W";
    tileMap[11] = "W * W   W   G   W   W * W";
    tileMap[12] = "W . . . P G G G . . . . . W";
    ghosts.forEach((ghost, index) => {
        ghost.x = [13.5, 10.5, 11.5, 12.5][index] * tileWidth;
        ghost.y = 12 * tileHeight;
        ghost.isEdible = false;
        ghostRespawnTimers[index] = 0;
    });
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
}

function checkWin() {
    if (pelletsRemaining === 0) {
        clearInterval(gameInterval);
        ctx.fillStyle = "yellow";
        ctx.font = "40px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2);
        ctx.textAlign = "start";
    }
}

function handleCollisions() {
    ghosts.forEach((ghost, index) => {
        const dx = Math.abs(player.x - ghost.x);
        const dy = Math.abs(player.y - ghost.y);
        const collisionThreshold = player.radius + tileWidth / 2;

        if (dx < collisionThreshold && dy < collisionThreshold) {
            if (player.isPoweredUp && ghost.isEdible) {
                score += 200; // Очки за з'їденого привида
                scoreDisplay.textContent = score;
                ghost.x = ghostSpawn.x;
                ghost.y = ghostSpawn.y;
                ghost.isEdible = false;
                ghostRespawnTimers[index] = ghostRespawnTime;
            } else if (!ghost.isEdible) {
                clearInterval(gameInterval);
                ctx.fillStyle = "red";
                ctx.font = "40px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
                ctx.textAlign = "start";
            }
        }
    });
}

function drawMap() {
    pelletsRemaining = 0;
    for (let i = 0; i < tileMap.length; i++) {
        for (let j = 0; j < tileMap[i].length; j++) {
            const tile = tileMap[i][j];
            const x = j * tileWidth;
            const y = i * tileHeight;

            if (tile === "W") {
                ctx.fillStyle = "blue";
                ctx.fillRect(x, y, tileWidth, tileHeight);
            } else if (tile === ".") {
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.arc(x + tileWidth / 2, y + tileHeight / 2, 4, 0, Math.PI * 2);
                ctx.fill();
                pelletsRemaining++;
            } else if (tile === "*") {
                ctx.fillStyle = "lime";
                ctx.beginPath();
                ctx.arc(x + tileWidth / 2, y + tileHeight / 2, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = "yellow";
    const mouthAngle = Math.sin(Date.now() / 100) * 0.2 + 0.8; // Анімація рота
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, Math.PI * mouthAngle, Math.PI * (2 - mouthAngle));
    ctx.lineTo(player.x, player.y);
    ctx.closePath();
    ctx.fill();
}

function drawGhost(ghost) {
    ctx.fillStyle = ghost.isEdible ? "lightblue" : ghost.color;
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, tileWidth / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    // Прості очі
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ghost.x - 5, ghost.y - 5, 3, 0, Math.PI * 2);
    ctx.arc(ghost.x + 5, ghost.y - 5, 3, 0, Math.PI * 2);
    ctx.fill();
}

function updatePlayerDirection() {
    const gridX = Math.floor(player.x / tileWidth);
    const gridY = Math.floor(player.y / tileHeight);

    const canMove = (x, y) => tileMap[y] && tileMap[y][x] !== "W";

    const tryMove = (newDirection) => {
        const dx = [1, 0, -1, 0][newDirection];
        const dy = [0, 1, 0, -1][newDirection];
        const newGridX = gridX + dx;
        const newGridY = gridY + dy;
        return canMove(newGridX, newGridY);
    };

    if (player.nextDirection !== player.direction) {
        if (tryMove(player.nextDirection)) {
            player.direction = player.nextDirection;
        } else if (!tryMove(player.direction)) {
            player.direction = -1; // Зупиняємо, якщо нема куди йти
        }
    } else if (!tryMove(player.direction)) {
        player.direction = -1; // Зупиняємо, якщо нема куди йти прямо
    }

    if (player.direction !== -1) {
        player.x += Math.cos(player.direction * Math.PI / 2) * player.speed;
        player.y += Math.sin(player.direction * Math.PI / 2) * player.speed;

        // Коригуємо позицію до центру клітинки при зміні напрямку
        const offsetX = player.x % tileWidth;
        const offsetY = player.y % tileHeight;
        if (offsetX < player.speed && Math.cos(player.direction * Math.PI / 2) !== 0) {
            player.x -= offsetX;
        } else if (offsetX > tileWidth - player.speed && Math.cos(player.direction * Math.PI / 2) !== 0) {
            player.x += (tileWidth - offsetX);
        }
        if (offsetY < player.speed && Math.sin(player.direction * Math.PI / 2) !== 0) {
            player.y -= offsetY;
        } else if (offsetY > tileHeight - player.speed && Math.sin(player.direction * Math.PI / 2) !== 0) {
            player.y += (tileHeight - offsetY);
        }
    }
}

function updateGhosts() {
    ghosts.forEach((ghost, index) => {
        if (ghostRespawnTimers[index] > 0) {
            ghostRespawnTimers[index]--;
            if (ghostRespawnTimers[index] === 0) {
                ghost.x = ghostSpawn.x;
                ghost.y = ghostSpawn.y;
            }
            return;
        }

        const gridX = Math.floor(ghost.x / tileWidth);
        const gridY = Math.floor(ghost.y / tileHeight);
        const possibleDirections = [];
        const canMove = (x, y) => tileMap[y] && tileMap[y][x] !== "W";
        const dx = [1, 0, -1, 0];
        const dy = [0, 1, 0, -1];

        for (let i = 0; i < 4; i++) {
            const newGridX = gridX + dx[i];
            const newGridY = gridY + dy[i];
            if (canMove(newGridX, newGridY) && i !== (ghost.direction + 2) % 4) { // Не йти назад
                possibleDirections.push(i);
            }
        }

        if (possibleDirections.length > 0) {
            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }

        ghost.x += Math.cos(ghost.direction * Math.PI / 2) * ghost.speed;
        ghost.y += Math.sin(ghost.direction * Math.PI / 2) * ghost.speed;

        // Зациклювання привидів
        if (ghost.x < -tileWidth / 2) ghost.x = canvas.width + tileWidth / 2;
        if (ghost.x > canvas.width + tileWidth / 2) ghost.x = -tileWidth / 2;
        if (ghost.y < -tileHeight / 2) ghost.y = canvas.height + tileHeight / 2;
        if (ghost.y > canvas.height + tileHeight / 2) ghost.y = -tileHeight / 2;
    });
}

function handlePowerUp() {
    if (player.isPoweredUp) {
        player.powerUpTimer--;
        ghosts.forEach(ghost => ghost.isEdible = true);
        if (player.powerUpTimer <= 0) {
            player.isPoweredUp = false;
            ghosts.forEach(ghost => ghost.isEdible = false);
        }
    }
}

function updateGame() {
    if (!isPaused && gameStarted) {
        updatePlayerDirection();
        updateGhosts();
        handleCollisions();
        handlePowerUp();

        const gridX = Math.floor(player.x / tileWidth);
        const gridY = Math.floor(player.y / tileHeight);
        if (tileMap[gridY] && tileMap[gridY][gridX] === "*") {
            tileMap[gridY] = tileMap[gridY].substring(0, gridX) + " " + tileMap[gridY].substring(gridX + 1);
            player.isPoweredUp = true;
            player.powerUpTimer = 6 * 60; // 6 секунд * 60 кадрів/секунду
        }

        checkWin();
    }
}

function drawPauseScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.font = "30px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Пауза", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText("Натисніть Escape, щоб продовжити", canvas.width / 2, canvas.height / 2 + 20);
    ctx.textAlign = "start";
}

function drawStartScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "yellow";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Натисніть будь-яку клавішу, щоб почати", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "start";
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPlayer();
    ghosts.forEach(drawGhost);
    if (isPaused) {
        drawPauseScreen();
    }
    if (!gameStarted) {
        drawStartScreen();
    } else {
        updateGame();
    }
}

document.addEventListener("keydown", (e) => {
    if (!gameStarted) {
        gameStarted = true;
    } else if (e.key === "Escape") {
        isPaused = !isPaused;
    } else if (!isPaused) {
        if (e.key === "ArrowRight") player.nextDirection = 0;
        else if (e.key === "ArrowDown") player.nextDirection = 1;
        else if (e.key === "ArrowLeft") player.nextDirection = 2;
        else if (e.key === "ArrowUp") player.nextDirection = 3;
    }
});

resetGame();
gameLoop();