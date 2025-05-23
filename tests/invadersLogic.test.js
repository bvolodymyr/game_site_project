const logic = require('../logic/invadersLogic');

test('getRandomArbitrary returns value within range', () => {
    for (let i = 0; i < 10; i++) {
        const val = logic.getRandomArbitrary(5, 10);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThan(10);
    }
});

test('getRandomInt returns integer in inclusive range', () => {
    for (let i = 0; i < 10; i++) {
        const val = logic.getRandomInt(1, 3);
        expect([1,2,3]).toContain(val);
    }
});

test('clamp clamps below and above', () => {
    expect(logic.clamp(5, 1, 10)).toBe(5);
    expect(logic.clamp(0, 1, 10)).toBe(1);
    expect(logic.clamp(15, 1, 10)).toBe(10);
});

test('valueInRange works as expected', () => {
    expect(logic.valueInRange(5, 1, 10)).toBe(true);
    expect(logic.valueInRange(1, 1, 10)).toBe(true);
    expect(logic.valueInRange(10, 1, 10)).toBe(true);
    expect(logic.valueInRange(0, 1, 10)).toBe(false);
    expect(logic.valueInRange(11, 1, 10)).toBe(false);
});

test('checkRectCollision returns true when rectangles overlap', () => {
    const a = {x: 0, y: 0, w: 10, h: 10};
    const b = {x: 5, y: 5, w: 10, h: 10};
    expect(logic.checkRectCollision(a, b)).toBe(true);
});

test('checkRectCollision returns false when rectangles do not overlap', () => {
    const a = {x: 0, y: 0, w: 10, h: 10};
    const b = {x: 20, y: 20, w: 5, h: 5};
    expect(logic.checkRectCollision(a, b)).toBe(false);
});

test('Point2D initializes and sets values correctly', () => {
    const p = new logic.Point2D(3, 4);
    expect(p.x).toBe(3);
    expect(p.y).toBe(4);
    p.set(7, 9);
    expect(p.x).toBe(7);
    expect(p.y).toBe(9);
});

test('Rect initializes and sets values correctly', () => {
    const r = new logic.Rect(1,2,3,4);
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.w).toBe(3);
    expect(r.h).toBe(4);
    r.set(5,6,7,8);
    expect(r.x).toBe(5);
    expect(r.y).toBe(6);
    expect(r.w).toBe(7);
    expect(r.h).toBe(8);
});

test('Rect and Point2D default to 0 if not provided', () => {
    const p = new logic.Point2D();
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
    const r = new logic.Rect();
    expect(r.x).toBe(0);
    expect(r.y).toBe(0);
    expect(r.w).toBe(0);
    expect(r.h).toBe(0);
});

test('getRandomArbitrary never returns min or >= max', () => {
    for (let i = 0; i < 20; i++) {
        const val = logic.getRandomArbitrary(0, 1);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
    }
});
