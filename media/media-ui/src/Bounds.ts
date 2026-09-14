import { Rectangle } from './Rectangle';
import { Vector2 } from './Vector2';

export class Bounds extends Rectangle {
	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly width: number,
		public readonly height: number,
	) {
		super(width, height);
	}

	get origin(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	get corner(): Vector2 {
		return new Vector2(this.x + this.width, this.y + this.height);
	}

	get center(): Vector2 {
		return new Vector2(this.x + this.width * 0.5, this.y + this.height * 0.5);
	}

	get rect(): Rectangle {
		return new Rectangle(this.width, this.height);
	}

	get left(): number {
		return this.x;
	}

	get top(): number {
		return this.y;
	}

	get right(): number {
		return this.x + this.width;
	}

	get bottom(): number {
		return this.y + this.height;
	}

	flipped(): Bounds {
		const rect = this.rect.flipped();
		return new Bounds(this.x, this.y, rect.width, rect.height);
	}

	scaled(scale: number): Bounds {
		return new Bounds(this.x * scale, this.y * scale, this.width * scale, this.height * scale);
	}

	relativeTo(bounds: Bounds): Bounds {
		return new Bounds(this.x - bounds.x, this.y - bounds.y, this.width, this.height);
	}

	clone(): Bounds {
		return new Bounds(this.x, this.y, this.width, this.height);
	}

	map(fn: (value: number) => number): Bounds {
		return new Bounds(fn(this.x), fn(this.y), fn(this.width), fn(this.height));
	}

	hFlipWithin(containerBounds: Bounds): Bounds {
		const hGap = containerBounds.right - this.right;
		return new Bounds(containerBounds.left + hGap, this.top, this.width, this.height);
	}

	vFlipWithin(containerBounds: Bounds): Bounds {
		const vGap = this.top - containerBounds.top;
		return new Bounds(
			this.left,
			containerBounds.bottom - vGap - this.height,
			this.width,
			this.height,
		);
	}

	rotate90DegWithin(containerBounds: Bounds): Bounds {
		const hGap = containerBounds.right - this.right;
		const vGap = this.top - containerBounds.top;
		return new Bounds(
			containerBounds.left + vGap,
			containerBounds.top + hGap,
			this.height,
			this.width,
		);
	}

	translated(xDelta: number, yDelta: number): Bounds {
		return new Bounds(this.x + xDelta, this.y + yDelta, this.width, this.height);
	}

	equals(bounds: Bounds): boolean {
		return (
			this.x === bounds.x &&
			this.y === bounds.y &&
			this.width === bounds.width &&
			this.height === bounds.height
		);
	}
}
