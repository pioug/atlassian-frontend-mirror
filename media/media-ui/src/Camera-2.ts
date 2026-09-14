import type { Rectangle } from './Rectangle';
import type { Vector2 } from './Vector2';

export class Camera {
	constructor(
		public readonly viewport: Rectangle,
		public readonly originalImg: Rectangle,
	) {}

	resizedViewport(newViewport: Rectangle): Camera {
		return new Camera(newViewport, this.originalImg);
	}

	get scaleToFit(): number {
		return this.originalImg.scaleToFitLargestSide(this.viewport);
	}

	// If the image is smaller than or equal to the viewport, it won't be scaled.
	// If the image is larger than the viewport, it will be scaled down to fit.
	get scaleDownToFit(): number {
		return Math.min(1, this.scaleToFit);
	}

	get fittedImg(): Rectangle {
		return this.originalImg.scaled(this.scaleDownToFit);
	}

	scaledImg(newScale: number): Rectangle {
		return this.originalImg.scaled(newScale);
	}

	scaledOffset(prevOffset: Vector2, prevScale: number, newScale: number): Vector2 {
		const { viewport } = this;
		return prevOffset
			.add(viewport.center)
			.scaled(newScale / prevScale)
			.sub(viewport.center);
	}
}
