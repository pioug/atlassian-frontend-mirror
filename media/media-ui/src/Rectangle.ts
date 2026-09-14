import { Vector2 } from './Vector2';

export class Rectangle {
	constructor(
		public readonly width: number,
		public readonly height: number,
	) {}

	get aspectRatio(): number {
		return this.width / this.height;
	}

	get center(): Vector2 {
		return new Vector2(this.width / 2, this.height / 2);
	}

	scaled(scale: number): Rectangle {
		return new Rectangle(this.width * scale, this.height * scale);
	}

	resized(width: number, height: number): Rectangle {
		return new Rectangle(width, height);
	}

	flipped(): Rectangle {
		return new Rectangle(this.height, this.width);
	}

	// Computes the scaling factor that needs to be applied to this
	// Rectangle so that it
	// - is fully visible inside of the containing Rectangle
	// - is the LARGEST possible size
	// - maintains the original aspect ratio (no distortion)
	scaleToFit(containing: Rectangle): number {
		const widthRatio = containing.width / this.width;
		const heightRatio = containing.height / this.height;
		if (widthRatio <= heightRatio) {
			return widthRatio;
		} else {
			return heightRatio;
		}
	}

	scaleToFitLargestSide(containing: Rectangle): number {
		return this.scaleToFit(containing);
	}

	// Computes the scaling factor that needs to be applied to this
	// Rectangle so that it
	// - is fully visible inside of the containing Rectangle
	// - is the SMALLEST possible size
	// - maintains the original aspect ratio (no distortion)
	scaleToFitSmallestSide(containing: Rectangle): number {
		const widthRatio = containing.width / this.width;
		const heightRatio = containing.height / this.height;
		if (widthRatio >= heightRatio) {
			return widthRatio;
		} else {
			return heightRatio;
		}
	}

	clone(): Rectangle {
		return new Rectangle(this.width, this.height);
	}
}
