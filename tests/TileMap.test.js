// tests/TileMap.test.js
const TileMap = require('../src/TileMap.js');
const MovingDirection = require('../src/MovingDirection.js');

jest.mock('../src/Pacman.js', () => {
  return jest.fn().mockImplementation(() => ({ isPacman: true }));
});

jest.mock('../src/Enemy.js', () => {
  return jest.fn().mockImplementation(() => ({ isEnemy: true }));
});

describe('TileMap', () => {
  const tileSize = 32;
  let tileMap;

  beforeEach(() => {
    tileMap = new TileMap(tileSize);
  });

  test("getPacman returns an object and clears its tile on the map", () => {
  const tileMap = new TileMap(32);
  const pacman = tileMap.getPacman();

  expect(pacman).toBeDefined();
  expect(typeof pacman).toBe("object");
  expect(tileMap.map[1][4]).toBe(0); // Перевірка очищення тайла з Pacman
  });



  test("getEnemies returns 3 enemies and clears their positions on the map", () => {
  const tileMap = new TileMap(32);
  const enemies = tileMap.getEnemies();

  // Перевіряємо, що повернувся масив довжиною 3
  expect(Array.isArray(enemies)).toBe(true);
  expect(enemies.length).toBe(3);

  // Перевіряємо, що тайли ворогів очищені
  expect(tileMap.map[3][3]).toBe(0);
  expect(tileMap.map[9][1]).toBe(0);
  expect(tileMap.map[9][11]).toBe(0);
  });





  test('setCanvasSize sets canvas dimensions correctly', () => {
    const canvas = { width: 0, height: 0 };
    tileMap.setCanvasSize(canvas);
    expect(canvas.width).toBe(tileMap.map[0].length * tileSize);
    expect(canvas.height).toBe(tileMap.map.length * tileSize);
  });

  test('didCollideWithEnvironment returns true when hitting wall', () => {
    const col = 0;
    const row = 0;
    const x = col * tileSize;
    const y = row * tileSize;
    const result = tileMap.didCollideWithEnvironment(x, y, MovingDirection.right);
    expect(result).toBe(true);
  });

  test('eatDot returns true and sets tile to 5 when eating dot', () => {
    const x = 2 * tileSize;
    const y = 1 * tileSize;
    const result = tileMap.eatDot(x, y);
    expect(result).toBe(true);
    expect(tileMap.map[1][2]).toBe(5);
  });

  test('eatPowerDot returns true and sets tile to 5 when eating power dot', () => {
    const x = 1 * tileSize;
    const y = 1 * tileSize;
    const result = tileMap.eatPowerDot(x, y);
    expect(result).toBe(true);
    expect(tileMap.map[1][1]).toBe(5);
  });

  test('didWin returns false initially (dots present)', () => {
    expect(tileMap.didWin()).toBe(false);
  });

  test('didWin returns true when no dots left', () => {
    tileMap.map = tileMap.map.map(row =>
      row.map(tile => (tile === 0 ? 5 : tile))
    );
    expect(tileMap.didWin()).toBe(true);
  });

  test("didWin returns false when dots are left", () => {
  const tileMap = new TileMap(32);
  expect(tileMap.didWin()).toBe(false);
  });

  test("eatDot replaces a dot with 5 and returns true", () => {
  const tileMap = new TileMap(32);
  const x = 2 * tileMap.tileSize; // column 2
  const y = 1 * tileMap.tileSize; // row 1
  expect(tileMap.eatDot(x, y)).toBe(true);
  expect(tileMap.map[1][2]).toBe(5);
  });

  test("didCollideWithEnvironment returns true when hitting wall", () => {
  const tileMap = new TileMap(32);
  const x = 0 * tileMap.tileSize; // column 0
  const y = 0 * tileMap.tileSize; // row 0
  const result = tileMap.didCollideWithEnvironment(x, y, MovingDirection.right);
  expect(result).toBe(true); // Впирається у стіну
  });

});
