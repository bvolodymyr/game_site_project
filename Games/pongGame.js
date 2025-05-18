const canvas = document.getElementById("pingPongCanvas");
const ctx = canvas.getContext("2d");

// Розміри ракеток та м'яча
const paddleWidth = 10;
const paddleHeight = 60;
const ballRadius = 10;

// Початкові позиції ракеток
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Початкова позиція та швидкість м'яча
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Швидкість руху ракеток
const paddleSpeed = 10;

// Рахунок гравців
let leftScore = 0;
let rightScore = 0;

// Стан гри
let isPaused = false;

// Керування ракетками та іншими діями
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "Escape") {
    isPaused = !isPaused;
  }

  if (e.key === "r" || e.key === "R") {
    resetGame();
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function drawPaddle(x, y) {
  ctx.fillStyle = "#6B046D";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#971995";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Player 1: ${leftScore}`, 50, 30);
  ctx.fillText(`Player 2: ${rightScore}`, canvas.width - 150, 30);
}

function drawPauseScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Пауза", canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText("Натисніть Escape, щоб продовжити", canvas.width / 2, canvas.height / 2 + 20);
  ctx.textAlign = "start";
}

function update() {
  if (!isPaused) {
    // Рух ракеток
    if (keys["w"] && leftPaddleY > 0) {
      leftPaddleY -= paddleSpeed;
    }
    if (keys["s"] && leftPaddleY < canvas.height - paddleHeight) {
      leftPaddleY += paddleSpeed;
    }
    if (keys["ArrowUp"] && rightPaddleY > 0) {
      rightPaddleY -= paddleSpeed;
    }
    if (keys["ArrowDown"] && rightPaddleY < canvas.height - paddleHeight) {
      rightPaddleY += paddleSpeed;
    }

    // Рух м'яча
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Відбиття від верхньої та нижньої стінок
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
      ballSpeedY = -ballSpeedY;
    }

    // Перевірка зіткнення з лівою ракеткою
    if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
    }

    // Перевірка зіткнення з правою ракеткою
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
      ballSpeedX = -ballSpeedX;
    }

    // Перевірка виходу м'яча за межі поля (гол)
    if (ballX - ballRadius < 0) {
      rightScore++;
      resetBall();
    } else if (ballX + ballRadius > canvas.width) {
      leftScore++;
      resetBall();
    }
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX; // Змінюємо напрямок після голу
  ballSpeedY = (Math.random() - 0.5) * 10; // Додаємо випадкову вертикальну швидкість
}

function resetGame() {
  leftScore = 0;
  rightScore = 0;
  leftPaddleY = canvas.height / 2 - paddleHeight / 2;
  rightPaddleY = canvas.height / 2 - paddleHeight / 2;
  resetBall();
  isPaused = false; // Переконаємося, що гра не на паузі після рестарту
}

function gameLoop() {
  // Очищаємо canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Малюємо елементи гри
  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);
  drawBall();
  drawScore();

  // Якщо гра на паузі, малюємо екран паузи
  if (isPaused) {
    drawPauseScreen();
  } else {
    // Оновлюємо стан гри, тільки якщо не на паузі
    update();
  }

  // Запускаємо наступний кадр анімації
  requestAnimationFrame(gameLoop);
}

// Запускаємо гру
gameLoop();