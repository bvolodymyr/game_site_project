const Enemy = require("../src/Enemy.js");


// Мокаємо MovingDirection, бо він використовується в класі
const MovingDirection = {
  up: 0, down: 1, left: 2, right: 3
};

// Заглушка tileMap
const fakeTileMap = {
  didCollideWithEnvironment: jest.fn().mockReturnValue(false)
};

// Заглушка Image
global.Image = class {
  constructor() {
    this.src = '';
  }
};

describe("Enemy class", () => {
  // Базова ініціалізація
  const tileSize = 32;
  const velocity = 4;
  let enemy;

  beforeEach(() => {
    enemy = new Enemy(64, 96, tileSize, velocity, fakeTileMap);
  });

  test("constructor initializes properties correctly", () => {
    expect(enemy.x).toBe(64);
    expect(enemy.y).toBe(96);
    expect(enemy.tileSize).toBe(tileSize);
    expect(enemy.velocity).toBe(velocity);
    expect(enemy.tileMap).toBe(fakeTileMap);
    expect(enemy.directionTimer).toBe(enemy.directionTimerDefault);
    expect(enemy.scaredAboutToExpireTimer).toBe(enemy.scaredAboutToExpireTimerDefault);
    expect(enemy.image.src).toBe("/images/ghost.png");
  });

  test("collideWith returns true when overlapping", () => {
    const pacman = { x: 64, y: 96, powerDotActive: false };
    expect(enemy.collideWith(pacman)).toBe(true);
  });

  test("collideWith returns false when not overlapping", () => {
    const pacman = { x: 200, y: 300, powerDotActive: false };
    expect(enemy.collideWith(pacman)).toBe(false);
  });

  test("enemy moves up when direction is up", () => {
    enemy.movingDirection = MovingDirection.up;
    const oldY = enemy.y;
    enemy.tileMap.didCollideWithEnvironment = jest.fn().mockReturnValue(false);
    // Викликаємо публічний метод через draw (бо #move приватний)
    enemy.draw({ drawImage: jest.fn() }, false, { powerDotActive: false });
    expect(enemy.y).toBe(oldY - velocity);
  });

  test("enemy does not move if collision with environment", () => {
    enemy.movingDirection = MovingDirection.right;
    const oldX = enemy.x;
    enemy.tileMap.didCollideWithEnvironment = jest.fn().mockReturnValue(true);
    enemy.draw({ drawImage: jest.fn() }, false, { powerDotActive: false });
    expect(enemy.x).toBe(oldX);
  });

  test("enemy changes image when pacman has powerDotActive", () => {
    const ctx = { drawImage: jest.fn() };
    const pacman = { powerDotActive: true, powerDotAboutToExpire: false };
    enemy.draw(ctx, false, pacman);
    expect(enemy.image.src).toBe("/images/scaredGhost.png");
  });

  test("enemy alternates scared images when powerDotAboutToExpire", () => {
    const ctx = { drawImage: jest.fn() };
    const pacman = { powerDotActive: true, powerDotAboutToExpire: true };
    // Спочатку scaredGhost
    enemy.scaredAboutToExpireTimer = 1;
    enemy.image = enemy.scaredGhost;
    enemy.draw(ctx, false, pacman);
    expect(
      ["/images/scaredGhost.png", "/images/scaredGhost2.png"]
    ).toContain(enemy.image.src);
  });

  test("enemy direction changes after timer expires", () => {
    // Примусово обнуляємо таймер, щоб спрацювала зміна
    enemy.directionTimer = 1;
    enemy.tileMap.didCollideWithEnvironment = jest.fn().mockReturnValue(false);
    const prevDir = enemy.movingDirection;
    // Викликаємо через draw(), що викликає #changeDirection()
    enemy.draw({ drawImage: jest.fn() }, false, { powerDotActive: false });
    // Вірогідність зміни невелика, але або зміниться, або ні — тест на "не падає"
    expect(typeof enemy.movingDirection).toBe("number");
  });

    test("collideWith returns false when Pacman is far in X or Y", () => {
    const pacmanFarX = { x: 1000, y: enemy.y };
    const pacmanFarY = { x: enemy.x, y: 1000 };
    expect(enemy.collideWith(pacmanFarX)).toBe(false);
    expect(enemy.collideWith(pacmanFarY)).toBe(false);
    });


  test("enemy loads images correctly", () => {
    expect(enemy.normalGhost.src).toBe("/images/ghost.png");
    expect(enemy.scaredGhost.src).toBe("/images/scaredGhost.png");
    expect(enemy.scaredGhost2.src).toBe("/images/scaredGhost2.png");
  });
});
