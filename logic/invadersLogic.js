function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}

function valueInRange(value, min, max) {
	return value <= max && value >= min;
}

function checkRectCollision(A, B) {
	var xOverlap =
		valueInRange(A.x, B.x, B.x + B.w) || valueInRange(B.x, A.x, A.x + A.w);

	var yOverlap =
		valueInRange(A.y, B.y, B.y + B.h) || valueInRange(B.y, A.y, A.y + A.h);
	return xOverlap && yOverlap;
}

class Point2D {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	set(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Rect {
	constructor(x = 0, y = 0, w = 0, h = 0) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	set(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}

module.exports = {
	getRandomArbitrary,
	getRandomInt,
	clamp,
	valueInRange,
	checkRectCollision,
	Point2D,
	Rect,
};
