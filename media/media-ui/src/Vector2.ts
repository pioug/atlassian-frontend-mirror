export class Vector2 {
	constructor(
		public readonly x: number,
		public readonly y: number,
	) {}

	add({ x: thatX, y: thatY }: Vector2): Vector2 {
		const { x: thisX, y: thisY } = this;
		return new Vector2(thisX + thatX, thisY + thatY);
	}

	sub({ x: thatX, y: thatY }: Vector2): Vector2 {
		const { x: thisX, y: thisY } = this;
		return new Vector2(thisX - thatX, thisY - thatY);
	}

	scaled(scalar: number): Vector2 {
		const { x, y } = this;
		return new Vector2(x * scalar, y * scalar);
	}

	map(fn: (component: number) => number): Vector2 {
		return new Vector2(fn(this.x), fn(this.y));
	}

	clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	rounded(): Vector2 {
		return new Vector2(Math.round(this.x), Math.round(this.y));
	}

	toString() {
		return `[${this.x}, ${this.y}]`;
	}
}
