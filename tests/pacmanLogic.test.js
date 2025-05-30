const logic = require('../logic/pacmanLogic');

const sampleMap = [
  [1, 0, 0],
  [1, 7, 0],
  [1, 1, 1],
];

test('Pac-Man moves up', () => {
  const { x, y } = logic.move(32, 32, logic.MovingDirection.up, 32, 32, {
    didCollideWithEnvironment: () => false
  });
  expect(x).toBe(32);
  expect(y).toBe(0);
});

test('Pac-Man cannot move into wall', () => {
  const { x, y } = logic.move(32, 32, logic.MovingDirection.up, 32, 32, {
    didCollideWithEnvironment: () => true
  });
  expect(x).toBe(32);
  expect(y).toBe(32);
});

test('eats dot at position', () => {
  const map = JSON.parse(JSON.stringify(sampleMap));
  expect(logic.eatDot(32, 0, 32, map)).toBe(true);
  expect(map[0][1]).toBe(5);
});

test('eats power dot at position', () => {
  const map = JSON.parse(JSON.stringify(sampleMap));
  expect(logic.eatPowerDot(32, 32, 32, map)).toBe(true);
  expect(map[1][1]).toBe(5);
});

test('does not eat empty tile', () => {
  const map = JSON.parse(JSON.stringify(sampleMap));
  expect(logic.eatDot(0, 0, 32, map)).toBe(false);
});

test('collision with ghost detected', () => {
  expect(logic.collideWithGhost(32, 32, 40, 40, 32)).toBe(true);
});

test('no collision with ghost far away', () => {
  expect(logic.collideWithGhost(0, 0, 100, 100, 32)).toBe(false);
});

test('detect wall collision to the right', () => {
  const result = logic.didCollideWithEnvironment(32, 32, logic.MovingDirection.right, 32, sampleMap);
  expect(result).toBe(false);
});

test('detect wall collision to the left', () => {
  const result = logic.didCollideWithEnvironment(32, 32, logic.MovingDirection.left, 32, sampleMap);
  expect(result).toBe(true);
});

test('detect wall collision down', () => {
  const result = logic.didCollideWithEnvironment(32, 32, logic.MovingDirection.down, 32, sampleMap);
  expect(result).toBe(true);
});

test('no wall collision in open area', () => {
  const result = logic.didCollideWithEnvironment(32, 0, logic.MovingDirection.right, 32, sampleMap);
  expect(result).toBe(false);
});

test('dotsLeft returns correct count', () => {
  expect(logic.dotsLeft(sampleMap)).toBe(3);
});

test('dotsLeft is 0 after eating all', () => {
  const map = sampleMap.map(row => row.map(tile => (tile === 0 ? 5 : tile)));
  expect(logic.dotsLeft(map)).toBe(0);
});

test('Pac-Man moves left', () => {
  const { x, y } = logic.move(64, 32, logic.MovingDirection.left, 32, 32, {
    didCollideWithEnvironment: () => false
  });
  expect(x).toBe(32);
  expect(y).toBe(32);
});

test('Pac-Man moves right', () => {
  const { x, y } = logic.move(0, 32, logic.MovingDirection.right, 32, 32, {
    didCollideWithEnvironment: () => false
  });
  expect(x).toBe(32);
  expect(y).toBe(32);
});

test('Pac-Man moves down', () => {
  const { x, y } = logic.move(32, 0, logic.MovingDirection.down, 32, 32, {
    didCollideWithEnvironment: () => false
  });
  expect(x).toBe(32);
  expect(y).toBe(32);
});

test('eatDot returns false on already eaten tile', () => {
  const map = [
    [1, 5, 0],
    [1, 5, 0],
    [1, 1, 1],
  ];
  expect(logic.eatDot(32, 32, 32, map)).toBe(false);
});


test('eatPowerDot returns false on non-power-dot tile', () => {
  const map = [
    [1, 0, 0],
    [1, 5, 0],
    [1, 1, 1],
  ];
  expect(logic.eatPowerDot(32, 32, 32, map)).toBe(false);
});


test('eatPowerDot returns false if no power dot', () => {
  const map = JSON.parse(JSON.stringify(sampleMap));
  expect(logic.eatPowerDot(64, 0, 32, map)).toBe(false);
});

test('collideWithGhost returns false if edges just touch', () => {
  // Pacman ends at x=32, ghost starts at x=32 — no overlap
  expect(logic.collideWithGhost(0, 0, 32, 0, 32)).toBe(false);
});

