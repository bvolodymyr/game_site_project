const pong = require('../logic/pongLogic');

test('getInitialState returns correct initial values', () => {
  const state = pong.getInitialState(800, 600);
  expect(state.leftPaddleY).toBe(270);
  expect(state.rightPaddleY).toBe(270);
  expect(state.ballX).toBe(400);
  expect(state.ballY).toBe(300);
});

test('movePaddle up cannot go above 0', () => {
  expect(pong.movePaddle(0, 'up', 10, 600, 60)).toBe(0);
  expect(pong.movePaddle(5, 'up', 10, 600, 60)).toBe(0);
});

test('movePaddle down cannot go below field', () => {
  expect(pong.movePaddle(540, 'down', 10, 600, 60)).toBe(540);
  expect(pong.movePaddle(530, 'down', 10, 600, 60)).toBe(540);
});

test('moveBall increases coordinates correctly', () => {
  const [x, y] = pong.moveBall(100, 200, 5, -5);
  expect(x).toBe(105);
  expect(y).toBe(195);
});

test('bounceY bounces off top and bottom', () => {
  expect(pong.bounceY(595, 10, 600, 5)).toBe(-5); // нижній край
  expect(pong.bounceY(5, 10, 600, -5)).toBe(5);  // верхній край
  expect(pong.bounceY(300, 10, 600, 5)).toBe(5); // середина
});

test('paddleCollision inverts speedX when collision', () => {
  // м'яч зліва на ракетці
  expect(
    pong.paddleCollision(15, 50, 10, 0, 40, 10, 60, 5)
  ).toBe(-5);
  // м'яч не зіштовхується
  expect(
    pong.paddleCollision(200, 50, 10, 0, 40, 10, 60, 5)
  ).toBe(5);
});

test('scoreGoal increases rightScore when ball goes left', () => {
  const result = pong.scoreGoal(5, 10, 800, 0, 0);
  expect(result.rightScore).toBe(1);
  expect(result.goal).toBe('right');
});

test('scoreGoal increases leftScore when ball goes right', () => {
  const result = pong.scoreGoal(795, 10, 800, 0, 0);
  expect(result.leftScore).toBe(1);
  expect(result.goal).toBe('left');
});

test('resetBall resets ball in the center and inverts X speed', () => {
  const res = pong.resetBall(800, 600, 5);
  expect(res.ballX).toBe(400);
  expect(res.ballY).toBe(300);
  expect(res.ballSpeedX).toBe(-5);
  expect(res.ballSpeedY).toBeGreaterThanOrEqual(-5);
  expect(res.ballSpeedY).toBeLessThanOrEqual(5);
});

test('resetGame resets scores and paddles', () => {
  const state = pong.resetGame(800, 600);
  expect(state.leftScore).toBe(0);
  expect(state.rightScore).toBe(0);
  expect(state.leftPaddleY).toBe(270);
  expect(state.rightPaddleY).toBe(270);
  expect(state.ballX).toBe(400);
  expect(state.ballY).toBe(300);
});
