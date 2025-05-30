const logic = require("../logic/gameLogic");

test("isGameOver returns true if enemy hits pacman without power", () => {
  const pacman = { powerDotActive: false };
  const enemies = [{ collideWith: () => true }];
  expect(logic.isGameOver(pacman, enemies)).toBe(true);
});

test("isGameOver returns false if pacman has powerDot", () => {
  const pacman = { powerDotActive: true };
  const enemies = [{ collideWith: () => true }];
  expect(logic.isGameOver(pacman, enemies)).toBe(false);
});

test("pause returns true if pacman didn't move yet", () => {
  const pacman = { madeFirstMove: false };
  expect(logic.pause(pacman, false, false)).toBe(true);
});

test("pause returns true if game is over or won", () => {
  const pacman = { madeFirstMove: true };
  expect(logic.pause(pacman, true, false)).toBe(true);
  expect(logic.pause(pacman, false, true)).toBe(true);
});

test("pause returns false if game is active", () => {
  const pacman = { madeFirstMove: true };
  expect(logic.pause(pacman, false, false)).toBe(false);
});

test("checkGameOver returns true and calls play() if game over", () => {
  const pacman = { powerDotActive: false };
  const enemies = [{ collideWith: () => true }];
  const play = jest.fn();
  const result = logic.checkGameOver(pacman, enemies, false, play);
  expect(result).toBe(true);
  expect(play).toHaveBeenCalled();
});

test("checkGameOver returns false if not over", () => {
  const pacman = { powerDotActive: true };
  const enemies = [{ collideWith: () => true }];
  const play = jest.fn();
  const result = logic.checkGameOver(pacman, enemies, false, play);
  expect(result).toBe(false);
  expect(play).not.toHaveBeenCalled();
});

test("checkGameWin returns true and calls play if tileMap.didWin is true", () => {
  const tileMap = { didWin: () => true };
  const play = jest.fn();
  const result = logic.checkGameWin(tileMap, false, play);
  expect(result).toBe(true);
  expect(play).toHaveBeenCalled();
});

test("checkGameWin returns false if already won", () => {
  const tileMap = { didWin: () => true };
  const play = jest.fn();
  const result = logic.checkGameWin(tileMap, true, play);
  expect(result).toBe(true);
  expect(play).not.toHaveBeenCalled();
});
