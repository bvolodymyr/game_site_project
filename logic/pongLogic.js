// Логіка понгу для тестування

function getInitialState(canvasWidth = 800, canvasHeight = 600) {
  return {
    paddleWidth: 10,
    paddleHeight: 60,
    ballRadius: 10,
    leftPaddleY: canvasHeight / 2 - 60 / 2,
    rightPaddleY: canvasHeight / 2 - 60 / 2,
    ballX: canvasWidth / 2,
    ballY: canvasHeight / 2,
    ballSpeedX: 5,
    ballSpeedY: 5,
    leftScore: 0,
    rightScore: 0,
    canvasWidth,
    canvasHeight,
  };
}

function movePaddle(y, direction, speed, canvasHeight, paddleHeight) {
  if (direction === "up") return Math.max(0, y - speed);
  if (direction === "down") return Math.min(canvasHeight - paddleHeight, y + speed);
  return y;
}

function moveBall(ballX, ballY, speedX, speedY) {
  return [ballX + speedX, ballY + speedY];
}

function bounceY(ballY, ballRadius, canvasHeight, speedY) {
  if (ballY + ballRadius > canvasHeight || ballY - ballRadius < 0) {
    return -speedY;
  }
  return speedY;
}

function paddleCollision(ballX, ballY, ballRadius, paddleX, paddleY, paddleWidth, paddleHeight, speedX) {
  if (
    ballX - ballRadius < paddleX + paddleWidth &&
    ballX + ballRadius > paddleX &&
    ballY > paddleY &&
    ballY < paddleY + paddleHeight
  ) {
    return -speedX;
  }
  return speedX;
}

function scoreGoal(ballX, ballRadius, canvasWidth, leftScore, rightScore) {
  if (ballX - ballRadius < 0) {
    rightScore++;
    return { leftScore, rightScore, goal: "right" };
  }
  if (ballX + ballRadius > canvasWidth) {
    leftScore++;
    return { leftScore, rightScore, goal: "left" };
  }
  return { leftScore, rightScore, goal: null };
}

function resetBall(canvasWidth, canvasHeight, prevSpeedX) {
  return {
    ballX: canvasWidth / 2,
    ballY: canvasHeight / 2,
    ballSpeedX: -prevSpeedX,
    ballSpeedY: (Math.random() - 0.5) * 10,
  };
}

function resetGame(canvasWidth, canvasHeight) {
  return {
    leftScore: 0,
    rightScore: 0,
    leftPaddleY: canvasHeight / 2 - 60 / 2,
    rightPaddleY: canvasHeight / 2 - 60 / 2,
    ...resetBall(canvasWidth, canvasHeight, 5),
  };
}

module.exports = {
  getInitialState,
  movePaddle,
  moveBall,
  bounceY,
  paddleCollision,
  scoreGoal,
  resetBall,
  resetGame,
};
