function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function moveSnake(snake, grid) {
	snake.x += snake.dx;
	snake.y += snake.dy;
	return snake;
}

function wrapSnake(snake, canvasWidth, canvasHeight, grid) {
	if (snake.x < 0) {
		snake.x = canvasWidth - grid;
	} else if (snake.x >= canvasWidth) {
		snake.x = 0;
	}
	if (snake.y < 0) {
		snake.y = canvasHeight - grid;
	} else if (snake.y >= canvasHeight) {
		snake.y = 0;
	}
	return snake;
}

function eatFood(snake, food, grid, maxGrid) {
	if (snake.x === food.x && snake.y === food.y) {
		snake.maxCells++;
		food.x = getRandomInt(0, maxGrid) * grid;
		food.y = getRandomInt(0, maxGrid) * grid;
		return true;
	}
	return false;
}

function checkSelfCollision(snake) {
	for (let i = 1; i < snake.cells.length; i++) {
		if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
			return true;
		}
	}
	return false;
}

function resetSnake(grid) {
	return {
		x: 160,
		y: 160,
		dx: grid,
		dy: 0,
		cells: [],
		maxCells: 4,
	};
}

module.exports = {
	getRandomInt,
	moveSnake,
	wrapSnake,
	eatFood,
	checkSelfCollision,
	resetSnake,
};
