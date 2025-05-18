const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const grid = 16;
let count = 0;
let score = 0;
let gameInterval;
let isPaused = false;
let gameStarted = false;

const snake = {
	x: 160,
	y: 160,
	dx: grid,
	dy: 0,
	cells: [],
	maxCells: 4,
};

const food = {
	x: 320,
	y: 320,
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function gameLoop() {
	if (!isPaused && gameStarted) {
		update();
		draw();
	}
	if (isPaused) {
		drawPauseScreen();
	} else {
		// Оновлюємо стан гри, тільки якщо не на паузі
		update();
	}
}

function update() {
	if (++count < 10) {
		return;
	}
	count = 0;

	snake.x += snake.dx;
	snake.y += snake.dy;

	// Зациклюємо змійку по краях
	if (snake.x < 0) {
		snake.x = canvas.width - grid;
	} else if (snake.x >= canvas.width) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - grid;
	} else if (snake.y >= canvas.height) {
		snake.y = 0;
	}

	snake.cells.unshift({ x: snake.x, y: snake.y });
	if (snake.cells.length > snake.maxCells) {
		snake.cells.pop();
	}

	// Їмо їжу
	if (snake.x === food.x && snake.y === food.y) {
		snake.maxCells++;
		score++;
		scoreDisplay.textContent = score;
		food.x = getRandomInt(0, 25) * grid;
		food.y = getRandomInt(0, 25) * grid;
	}

	// Перевірка на зіткнення з собою
	for (let i = 1; i < snake.cells.length; i++) {
		if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
			resetGame();
			break;
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Малюємо їжу
	ctx.fillStyle = 'white';
	ctx.fillRect(food.x, food.y, grid - 1, grid - 1);

	// Малюємо змійку
	ctx.fillStyle = '#971995';
	snake.cells.forEach(function (cell, index) {
		ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
	});

	// Малюємо екран паузи
	if (isPaused) {
		drawPauseScreen();
	}

	// Малюємо екран початку гри
	if (!gameStarted) {
		drawStartScreen();
	}
}

function drawPauseScreen() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = '20px sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText('Пауза', canvas.width / 2, canvas.height / 2 - 20);
	ctx.fillText(
		'Натисніть Escape, щоб продовжити',
		canvas.width / 2,
		canvas.height / 2 + 20
	);
	ctx.textAlign = 'start';
}

function drawStartScreen() {
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = 'white';
	ctx.font = '20px sans-serif';
	ctx.textAlign = 'center';
	ctx.fillText(
		'Натисніть Пробіл, щоб почати гру',
		canvas.width / 2,
		canvas.height / 2
	);
	ctx.textAlign = 'start';
}

function resetGame() {
	snake.x = 160;
	snake.y = 160;
	snake.dx = grid;
	snake.dy = 0;
	snake.cells = [];
	snake.maxCells = 4;
	score = 0;
	scoreDisplay.textContent = 0;
	food.x = getRandomInt(0, 25) * grid;
	food.y = getRandomInt(0, 25) * grid;
	isPaused = false;
	gameStarted = false;
	clearInterval(gameInterval); // Зупиняємо попередній інтервал
	gameInterval = setInterval(gameLoop, 30); // Запускаємо новий інтервал
}

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		isPaused = !isPaused;
	} else if (e.key === ' ') {
		gameStarted = true;
	} else if (gameStarted && !isPaused) {
		// Ліва стрілка
		if (e.which === 37 && snake.dx === 0) {
			snake.dx = -grid;
			snake.dy = 0;
		}
		// Верхня стрілка
		else if (e.which === 38 && snake.dy === 0) {
			snake.dy = -grid;
			snake.dx = 0;
		}
		// Права стрілка
		else if (e.which === 39 && snake.dx === 0) {
			snake.dx = grid;
			snake.dy = 0;
		}
		// Нижня стрілка
		else if (e.which === 40 && snake.dy === 0) {
			snake.dy = grid;
			snake.dx = 0;
		}
	}
});

// Замінюємо requestAnimationFrame на setInterval для кращого контролю швидкості
gameInterval = setInterval(gameLoop, 30);

// Перший малюнок екрана початку гри
draw();
