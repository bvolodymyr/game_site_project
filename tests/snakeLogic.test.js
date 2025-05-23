const logic = require('../logic/snakeLogic');

test('getRandomInt returns value in range [min, max)', () => {
	for (let i = 0; i < 10; i++) {
		const val = logic.getRandomInt(0, 10);
		expect(val).toBeGreaterThanOrEqual(0);
		expect(val).toBeLessThan(10);
	}
});

test('moveSnake updates snake position according to dx/dy', () => {
	const snake = { x: 10, y: 10, dx: 16, dy: 0 };
	const moved = logic.moveSnake({...snake}, 16);
	expect(moved.x).toBe(26);
	expect(moved.y).toBe(10);
});

test('wrapSnake wraps snake horizontally', () => {
	const grid = 16;
	const canvasWidth = 64, canvasHeight = 64;
	let snake = { x: -grid, y: 16 };
	snake = logic.wrapSnake(snake, canvasWidth, canvasHeight, grid);
	expect(snake.x).toBe(48);
	snake = { x: 64, y: 16 };
	snake = logic.wrapSnake(snake, canvasWidth, canvasHeight, grid);
	expect(snake.x).toBe(0);
});

test('wrapSnake wraps snake vertically', () => {
	const grid = 16;
	const canvasWidth = 64, canvasHeight = 64;
	let snake = { x: 16, y: -grid };
	snake = logic.wrapSnake(snake, canvasWidth, canvasHeight, grid);
	expect(snake.y).toBe(48);
	snake = { x: 16, y: 64 };
	snake = logic.wrapSnake(snake, canvasWidth, canvasHeight, grid);
	expect(snake.y).toBe(0);
});

test('eatFood returns true and updates food when eating', () => {
	const snake = { x: 32, y: 32, maxCells: 4 };
	const food = { x: 32, y: 32 };
	const eaten = logic.eatFood(snake, food, 16, 25);
	expect(eaten).toBe(true);
});

test('eatFood returns false if not eating', () => {
	const snake = { x: 16, y: 16, maxCells: 4 };
	const food = { x: 32, y: 32 };
	const eaten = logic.eatFood(snake, food, 16, 25);
	expect(eaten).toBe(false);
});

test('checkSelfCollision detects collision', () => {
	const snake = {
		x: 10, y: 10,
		cells: [{x: 10, y: 10}, {x: 10, y: 20}, {x: 10, y: 10}]
	};
	expect(logic.checkSelfCollision(snake)).toBe(true);
});

test('checkSelfCollision returns false if no collision', () => {
	const snake = {
		x: 10, y: 10,
		cells: [{x: 10, y: 10}, {x: 10, y: 20}, {x: 10, y: 30}]
	};
	expect(logic.checkSelfCollision(snake)).toBe(false);
});

test('resetSnake resets snake to initial state', () => {
	const snake = logic.resetSnake(16);
	expect(snake.x).toBe(160);
	expect(snake.y).toBe(160);
	expect(snake.dx).toBe(16);
	expect(snake.dy).toBe(0);
	expect(snake.maxCells).toBe(4);
	expect(Array.isArray(snake.cells)).toBe(true);
});

test('after eatFood maxCells increases by 1', () => {
	const snake = { x: 32, y: 32, maxCells: 4 };
	const food = { x: 32, y: 32 };
	logic.eatFood(snake, food, 16, 25);
	expect(snake.maxCells).toBe(5);
});
