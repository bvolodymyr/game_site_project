function isGameOver(pacman, enemies) {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause(pacman, gameOver, gameWin) {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function checkGameWin(tileMap, gameWin, playCallback) {
  if (!gameWin && tileMap.didWin()) {
    playCallback?.();
    return true;
  }
  return gameWin;
}

function checkGameOver(pacman, enemies, gameOver, playCallback) {
  if (!gameOver && isGameOver(pacman, enemies)) {
    playCallback?.();
    return true;
  }
  return gameOver;
}

module.exports = {
  isGameOver,
  pause,
  checkGameWin,
  checkGameOver,
};
