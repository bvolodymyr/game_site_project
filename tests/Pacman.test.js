const Pacman = require("../src/Pacman.js");




global.Audio = class {
  constructor() {
    this.play = jest.fn();
  }
};

const MovingDirection = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
};

const mockTileMap = {
  didCollideWithEnvironment: jest.fn(() => false),
  eatDot: jest.fn(() => false),
  eatPowerDot: jest.fn(() => false),
};

describe("Pacman", () => {
  let pacman;

  beforeEach(() => {
    pacman = new Pacman(64, 64, 32, 2, mockTileMap);
  });

  test("constructor initializes values correctly", () => {
    expect(pacman.x).toBe(64);
    expect(pacman.y).toBe(64);
    expect(pacman.velocity).toBe(2);
    expect(pacman.tileSize).toBe(32);
    expect(Array.isArray(pacman.pacmanImages)).toBe(true);
    expect(pacman.pacmanImageIndex).toBe(0);
  });


  test("animate cycles pacmanImageIndex", () => {
    pacman.pacmanAnimationTimer = 1;
    pacman.pacmanImageIndex = 2;
    pacman.draw({ save() {}, translate() {}, rotate() {}, drawImage() {}, restore() {} }, false, []);
    expect(pacman.pacmanImageIndex).toBe(3);
  });

  test("eatDot triggers waka sound", () => {
    pacman.madeFirstMove = true;
    mockTileMap.eatDot = jest.fn(() => true);
    const ctx = { save() {}, translate() {}, rotate() {}, drawImage() {}, restore() {} };
    pacman.draw(ctx, false, []);
    expect(pacman.wakaSound.play).toHaveBeenCalled();
  });

  test("eatPowerDot activates power mode and sets timers", () => {
    mockTileMap.eatPowerDot = jest.fn(() => true);
    jest.useFakeTimers();
    const ctx = { save() {}, translate() {}, rotate() {}, drawImage() {}, restore() {} };
    pacman.draw(ctx, false, []);
    expect(pacman.powerDotActive).toBe(true);
    expect(pacman.powerDotSound.play).toHaveBeenCalled();
    jest.advanceTimersByTime(6000);
    expect(pacman.powerDotActive).toBe(false);
    jest.useRealTimers();
  });

  test("eatGhost removes collided enemies", () => {
    pacman.powerDotActive = true;
    const enemy = { collideWith: () => true };
    const enemies = [enemy];
    const ctx = { save() {}, translate() {}, rotate() {}, drawImage() {}, restore() {} };
    pacman.draw(ctx, false, enemies);
    expect(enemies.length).toBe(0);
    expect(pacman.eatGhostSound.play).toHaveBeenCalled();
  });

  test("move cancels animation if collision detected", () => {
    mockTileMap.didCollideWithEnvironment = jest.fn(() => true);
    pacman.currentMovingDirection = MovingDirection.left;
    const ctx = { save() {}, translate() {}, rotate() {}, drawImage() {}, restore() {} };
    pacman.draw(ctx, false, []);
    expect(pacman.pacmanAnimationTimer).toBeNull();
  });
});
