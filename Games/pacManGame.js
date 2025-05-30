
const scoreDisplay = document.getElementById('score');
let score = 0;
// MovingDirection constants
const MovingDirection = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
};

// Enemy class

class Enemy {
	constructor(x, y, tileSize, velocity, tileMap) {
		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.velocity = velocity;
		this.tileMap = tileMap;

		this.#loadImages();

		this.movingDirection = Math.floor(
			Math.random() * Object.keys(MovingDirection).length
		);

		this.directionTimerDefault = this.#random(10, 25);
		this.directionTimer = this.directionTimerDefault;

		this.scaredAboutToExpireTimerDefault = 10;
		this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
	}

	draw(ctx, pause, pacman) {
		if (!pause) {
			this.#move();
			this.#changeDirection();
		}
		this.#setImage(ctx, pacman);
	}

	collideWith(pacman) {
		const size = this.tileSize / 2;
		if (
			this.x < pacman.x + size &&
			this.x + size > pacman.x &&
			this.y < pacman.y + size &&
			this.y + size > pacman.y
		) {
			return true;
		} else {
			return false;
		}
	}

	#setImage(ctx, pacman) {
		if (pacman.powerDotActive) {
			this.#setImageWhenPowerDotIsActive(pacman);
		} else {
			this.image = this.normalGhost;
		}
		ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
	}

	#setImageWhenPowerDotIsActive(pacman) {
		if (pacman.powerDotAboutToExpire) {
			this.scaredAboutToExpireTimer--;
			if (this.scaredAboutToExpireTimer === 0) {
				this.scaredAboutToExpireTimer =
					this.scaredAboutToExpireTimerDefault;
				if (this.image === this.scaredGhost) {
					this.image = this.scaredGhost2;
				} else {
					this.image = this.scaredGhost;
				}
			}
		} else {
			this.image = this.scaredGhost;
		}
	}

	#changeDirection() {
		this.directionTimer--;
		let newMoveDirection = null;
		if (this.directionTimer == 0) {
			this.directionTimer = this.directionTimerDefault;
			newMoveDirection = Math.floor(
				Math.random() * Object.keys(MovingDirection).length
			);
		}

		if (
			newMoveDirection != null &&
			this.movingDirection != newMoveDirection
		) {
			if (
				Number.isInteger(this.x / this.tileSize) &&
				Number.isInteger(this.y / this.tileSize)
			) {
				if (
					!this.tileMap.didCollideWithEnvironment(
						this.x,
						this.y,
						newMoveDirection
					)
				) {
					this.movingDirection = newMoveDirection;
				}
			}
		}
	}

	#move() {
		if (
			!this.tileMap.didCollideWithEnvironment(
				this.x,
				this.y,
				this.movingDirection
			)
		) {
			switch (this.movingDirection) {
				case MovingDirection.up:
					this.y -= this.velocity;
					break;
				case MovingDirection.down:
					this.y += this.velocity;
					break;
				case MovingDirection.left:
					this.x -= this.velocity;
					break;
				case MovingDirection.right:
					this.x += this.velocity;
					break;
			}
		}
	}

	#random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	#loadImages() {
		this.normalGhost = new Image();
		this.normalGhost.src = "../../images/ghost.png";

		this.scaredGhost = new Image();
		this.scaredGhost.src = "../../images/scaredGhost.png";

		this.scaredGhost2 = new Image();
		this.scaredGhost2.src = "../../images/scaredGhost2.png";

		this.image = this.normalGhost;
	}
}


// Pacman class

class Pacman {
	constructor(x, y, tileSize, velocity, tileMap) {
		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.velocity = velocity;
		this.tileMap = tileMap;

		this.currentMovingDirection = null;
		this.requestedMovingDirection = null;

		this.pacmanAnimationTimerDefault = 10;
		this.pacmanAnimationTimer = null;

		this.pacmanRotation = this.Rotation.right;
		this.wakaSound = new Audio("../../sounds/waka.wav");

		this.powerDotSound = new Audio("../../sounds/power_dot.wav");
		this.powerDotActive = false;
		this.powerDotAboutToExpire = false;
		this.timers = [];

		this.eatGhostSound = new Audio("../../sounds/eat_ghost.wav");

		this.madeFirstMove = false;

		document.addEventListener("keydown", this.#keydown);

		this.#loadPacmanImages();
	}

	Rotation = {
		right: 0,
		down: 1,
		left: 2,
		up: 3,
	};

	draw(ctx, pause, enemies) {
		if (!pause) {
			this.#move();
			this.#animate();
		}
		this.#eatDot();
		this.#eatPowerDot();
		this.#eatGhost(enemies);

		const size = this.tileSize / 2;

		ctx.save();
		ctx.translate(this.x + size, this.y + size);
		ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
		ctx.drawImage(
			this.pacmanImages[this.pacmanImageIndex],
			-size,
			-size,
			this.tileSize,
			this.tileSize
		);

		ctx.restore();

		// ctx.drawImage(
		//   this.pacmanImages[this.pacmanImageIndex],
		//   this.x,
		//   this.y,
		//   this.tileSize,
		//   this.tileSize
		// );
	}

	#loadPacmanImages() {
		const pacmanImage1 = new Image();
		pacmanImage1.src = "../../images/pac0.png";

		const pacmanImage2 = new Image();
		pacmanImage2.src = "../../images/pac1.png";

		const pacmanImage3 = new Image();
		pacmanImage3.src = "../../images/pac2.png";

		const pacmanImage4 = new Image();
		pacmanImage4.src = "../../images/pac1.png";

		this.pacmanImages = [
			pacmanImage1,
			pacmanImage2,
			pacmanImage3,
			pacmanImage4,
		];

		this.pacmanImageIndex = 0;
	}

	#keydown = (event) => {
		//up
		if (event.keyCode == 38) {
			if (this.currentMovingDirection == MovingDirection.down)
				this.currentMovingDirection = MovingDirection.up;
			this.requestedMovingDirection = MovingDirection.up;
			this.madeFirstMove = true;
		}
		//down
		if (event.keyCode == 40) {
			if (this.currentMovingDirection == MovingDirection.up)
				this.currentMovingDirection = MovingDirection.down;
			this.requestedMovingDirection = MovingDirection.down;
			this.madeFirstMove = true;
		}
		//left
		if (event.keyCode == 37) {
			if (this.currentMovingDirection == MovingDirection.right)
				this.currentMovingDirection = MovingDirection.left;
			this.requestedMovingDirection = MovingDirection.left;
			this.madeFirstMove = true;
		}
		//right
		if (event.keyCode == 39) {
			if (this.currentMovingDirection == MovingDirection.left)
				this.currentMovingDirection = MovingDirection.right;
			this.requestedMovingDirection = MovingDirection.right;
			this.madeFirstMove = true;
		}
	};

	#move() {
		if (this.currentMovingDirection !== this.requestedMovingDirection) {
			if (
				Number.isInteger(this.x / this.tileSize) &&
				Number.isInteger(this.y / this.tileSize)
			) {
				if (
					!this.tileMap.didCollideWithEnvironment(
						this.x,
						this.y,
						this.requestedMovingDirection
					)
				)
					this.currentMovingDirection = this.requestedMovingDirection;
			}
		}

		if (
			this.tileMap.didCollideWithEnvironment(
				this.x,
				this.y,
				this.currentMovingDirection
			)
		) {
			this.pacmanAnimationTimer = null;
			this.pacmanImageIndex = 1;
			return;
		} else if (
			this.currentMovingDirection != null &&
			this.pacmanAnimationTimer == null
		) {
			this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
		}

		switch (this.currentMovingDirection) {
			case MovingDirection.up:
				this.y -= this.velocity;
				this.pacmanRotation = this.Rotation.up;
				break;
			case MovingDirection.down:
				this.y += this.velocity;
				this.pacmanRotation = this.Rotation.down;
				break;
			case MovingDirection.left:
				this.x -= this.velocity;
				this.pacmanRotation = this.Rotation.left;
				break;
			case MovingDirection.right:
				this.x += this.velocity;
				this.pacmanRotation = this.Rotation.right;
				break;
		}
	}

	#animate() {
		if (this.pacmanAnimationTimer == null) {
			return;
		}
		this.pacmanAnimationTimer--;
		if (this.pacmanAnimationTimer == 0) {
			this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
			this.pacmanImageIndex++;
			if (this.pacmanImageIndex == this.pacmanImages.length)
				this.pacmanImageIndex = 0;
		}
	}

	#eatDot() {
		if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) {
			this.wakaSound.play();
			score++;
			scoreDisplay.textContent = score;
		}
	}

	#eatPowerDot() {
		if (this.tileMap.eatPowerDot(this.x, this.y)) {
			this.powerDotSound.play();
			this.powerDotActive = true;
			this.powerDotAboutToExpire = false;
			this.timers.forEach((timer) => clearTimeout(timer));
			this.timers = [];

			let powerDotTimer = setTimeout(() => {
				this.powerDotActive = false;
				this.powerDotAboutToExpire = false;
			}, 1000 * 6);

			this.timers.push(powerDotTimer);

			let powerDotAboutToExpireTimer = setTimeout(() => {
				this.powerDotAboutToExpire = true;
			}, 1000 * 3);
			score += 10;
			scoreDisplay.textContent = score;
			this.timers.push(powerDotAboutToExpireTimer);
		}
	}

	#eatGhost(enemies) {
		if (this.powerDotActive) {
			const collideEnemies = enemies.filter((enemy) =>
				enemy.collideWith(this)
			);
			collideEnemies.forEach((enemy) => {
				enemies.splice(enemies.indexOf(enemy), 1);
				score += 50;
				scoreDisplay.textContent = score;
				this.eatGhostSound.play();
			});
		}
	}
}


// TileMap class

class TileMap {
	constructor(tileSize) {
		this.tileSize = tileSize;

		this.yellowDot = new Image();
		this.yellowDot.src = "../../images/yellowDot.png";

		this.pinkDot = new Image();
		this.pinkDot.src = "../../images/pinkDot.png";

		this.wall = new Image();
		this.wall.src = "../../images/wall.png";

		this.powerDot = this.pinkDot;
		this.powerDotAnmationTimerDefault = 30;
		this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
	}

	//1 - wall
	//0 - dots
	//4 - pacman
	//5 - empty space
	//6 - enemy
	//7 - power dot
	map = [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
		[1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
		[1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
		[1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	];

	draw(ctx) {
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[row].length; column++) {
				let tile = this.map[row][column];
				if (tile === 1) {
					this.#drawWall(ctx, column, row, this.tileSize);
				} else if (tile === 0) {
					this.#drawDot(ctx, column, row, this.tileSize);
				} else if (tile == 7) {
					this.#drawPowerDot(ctx, column, row, this.tileSize);
				} else {
					this.#drawBlank(ctx, column, row, this.tileSize);
				}

				// ctx.strokeStyle = "yellow";
				// ctx.strokeRect(
				//   column * this.tileSize,
				//   row * this.tileSize,
				//   this.tileSize,
				//   this.tileSize
				// );
			}
		}
	}

	#drawDot(ctx, column, row, size) {
		ctx.drawImage(
			this.yellowDot,
			column * this.tileSize,
			row * this.tileSize,
			size,
			size
		);
	}

	#drawPowerDot(ctx, column, row, size) {
		this.powerDotAnmationTimer--;
		if (this.powerDotAnmationTimer === 0) {
			this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
			if (this.powerDot == this.pinkDot) {
				this.powerDot = this.yellowDot;
			} else {
				this.powerDot = this.pinkDot;
			}
		}
		ctx.drawImage(this.powerDot, column * size, row * size, size, size);
	}

	#drawWall(ctx, column, row, size) {
		ctx.drawImage(
			this.wall,
			column * this.tileSize,
			row * this.tileSize,
			size,
			size
		);
	}

	#drawBlank(ctx, column, row, size) {
		ctx.fillStyle = "black";
		ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
	}

	getPacman(velocity) {
		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[row].length; column++) {
				let tile = this.map[row][column];
				if (tile === 4) {
					this.map[row][column] = 0;
					return new Pacman(
						column * this.tileSize,
						row * this.tileSize,
						this.tileSize,
						velocity,
						this
					);
				}
			}
		}
	}

	getEnemies(velocity) {
		const enemies = [];

		for (let row = 0; row < this.map.length; row++) {
			for (let column = 0; column < this.map[row].length; column++) {
				const tile = this.map[row][column];
				if (tile == 6) {
					this.map[row][column] = 0;
					enemies.push(
						new Enemy(
							column * this.tileSize,
							row * this.tileSize,
							this.tileSize,
							velocity,
							this
						)
					);
				}
			}
		}
		return enemies;
	}

	setCanvasSize(canvas) {
		canvas.width = this.map[0].length * this.tileSize;
		canvas.height = this.map.length * this.tileSize;
	}

	didCollideWithEnvironment(x, y, direction) {
		if (direction == null) {
			return;
		}

		if (
			Number.isInteger(x / this.tileSize) &&
			Number.isInteger(y / this.tileSize)
		) {
			let column = 0;
			let row = 0;
			let nextColumn = 0;
			let nextRow = 0;

			switch (direction) {
				case MovingDirection.right:
					nextColumn = x + this.tileSize;
					column = nextColumn / this.tileSize;
					row = y / this.tileSize;
					break;
				case MovingDirection.left:
					nextColumn = x - this.tileSize;
					column = nextColumn / this.tileSize;
					row = y / this.tileSize;
					break;
				case MovingDirection.up:
					nextRow = y - this.tileSize;
					row = nextRow / this.tileSize;
					column = x / this.tileSize;
					break;
				case MovingDirection.down:
					nextRow = y + this.tileSize;
					row = nextRow / this.tileSize;
					column = x / this.tileSize;
					break;
			}
			const tile = this.map[row][column];
			if (tile === 1) {
				return true;
			}
		}
		return false;
	}

	didWin() {
		return this.#dotsLeft() === 0;
	}

	#dotsLeft() {
		return this.map.flat().filter((tile) => tile === 0).length;
	}

	eatDot(x, y) {
		const row = y / this.tileSize;
		const column = x / this.tileSize;
		if (Number.isInteger(row) && Number.isInteger(column)) {
			if (this.map[row][column] === 0) {
				this.map[row][column] = 5;
				return true;
			}
		}
		return false;
	}

	eatPowerDot(x, y) {
		const row = y / this.tileSize;
		const column = x / this.tileSize;
		if (Number.isInteger(row) && Number.isInteger(column)) {
			const tile = this.map[row][column];
			if (tile === 7) {
				this.map[row][column] = 5;
				return true;
			}
		}
		return false;
	}
}


// Game.js logic
const tileSize = 32; // Adjusted in one file

const velocity = 2; // Adjusted in one file


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("../../sounds/gameOver.wav");
const gameWinSound = new Audio("../../sounds/gameWin.wav");

function gameLoop() {
	tileMap.draw(ctx);
	drawGameEnd();
	pacman.draw(ctx, pause(), enemies);
	enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
	checkGameOver();
	checkGameWin();
}

function checkGameWin() {
	if (!gameWin) {
		gameWin = tileMap.didWin();
		if (gameWin) {
			gameWinSound.play();
		}
	}
}

function checkGameOver() {
	if (!gameOver) {
		gameOver = isGameOver();
		if (gameOver) {
			gameOverSound.play();
		}
	}
}

function isGameOver() {
	return enemies.some(
		(enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
	);
}

function pause() {
	return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
	if (gameOver || gameWin) {
		let text = "   You Win!";
		if (gameOver) {
			text = " Game Over";
		}
		ctx.font = "75px comic sans";
		ctx.fillStyle = "white";
		ctx.fillText(text, 10, canvas.height / 2);
	}
}

// List of all images to load
const images = [
  "../../images/ghost.png",
  "../../images/scaredGhost.png",
  "../../images/scaredGhost2.png",
  "../../images/yellowDot.png",
  "../../images/pinkDot.png",
  "../../images/wall.png",
  "../../images/pac0.png",
  "../../images/pac1.png",
  "../../images/pac2.png",
];

// Function to ensure all images are loaded
function loadImages(urls, callback) {
  let loadedCount = 0;
  const total = urls.length;
  urls.forEach((url) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === total) callback();
    };
    img.onerror = () => {
      console.error(`Image failed to load: ${url}`);
    };
  });
}

// Start the game after images are loaded
loadImages(images, () => {
  tileMap.setCanvasSize(canvas);
  setInterval(gameLoop, 1000 / 75);
});

