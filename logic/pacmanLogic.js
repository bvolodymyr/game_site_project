// pacmanLogic.js

const MovingDirection = {
  up: 0,
  down: 1,
  left: 2,
  right: 3,
};

function move(x, y, direction, velocity, tileSize, tileMap) {
  if (
    tileMap.didCollideWithEnvironment(x, y, direction, tileSize)
  ) return { x, y };

  switch (direction) {
    case MovingDirection.up: y -= velocity; break;
    case MovingDirection.down: y += velocity; break;
    case MovingDirection.left: x -= velocity; break;
    case MovingDirection.right: x += velocity; break;
  }
  return { x, y };
}

function eatDot(x, y, tileSize, map) {
  const row = Math.floor(y / tileSize);
  const col = Math.floor(x / tileSize);
  if (map[row][col] === 0) {
    map[row][col] = 5; // eaten
    return true;
  }
  return false;
}

function eatPowerDot(x, y, tileSize, map) {
  const row = Math.floor(y / tileSize);
  const col = Math.floor(x / tileSize);
  if (map[row][col] === 7) {
    map[row][col] = 5; // eaten
    return true;
  }
  return false;
}

function collideWithGhost(pacX, pacY, ghostX, ghostY, tileSize) {
  const size = tileSize / 2;
  return (
    pacX < ghostX + size &&
    pacX + size > ghostX &&
    pacY < ghostY + size &&
    pacY + size > ghostY
  );
}

function didCollideWithEnvironment(x, y, direction, tileSize, map) {
  if (!Number.isInteger(x / tileSize) || !Number.isInteger(y / tileSize)) {
    return false;
  }

  let row = Math.floor(y / tileSize);
  let col = Math.floor(x / tileSize);

  switch (direction) {
    case MovingDirection.right: col += 1; break;
    case MovingDirection.left: col -= 1; break;
    case MovingDirection.up: row -= 1; break;
    case MovingDirection.down: row += 1; break;
  }

  return map[row] && map[row][col] === 1;
}

function dotsLeft(map) {
  return map.flat().filter(tile => tile === 0).length;
}

module.exports = {
  MovingDirection,
  move,
  eatDot,
  eatPowerDot,
  collideWithGhost,
  didCollideWithEnvironment,
  dotsLeft,
};
