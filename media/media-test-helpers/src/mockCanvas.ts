import getJest from './getJest';

const jestHelper = getJest();

export function mockCanvas(width: number = 0, height: number = 0) {
	const context: Partial<CanvasRenderingContext2D> = {
		translate: jestHelper.fn(),
		rotate: jestHelper.fn(),
		scale: jestHelper.fn(),
		drawImage: jestHelper.fn(),
		arc: jestHelper.fn(),
		save: jestHelper.fn(),
		beginPath: jestHelper.fn(),
		restore: jestHelper.fn(),
		fill: jestHelper.fn(),
		stroke: jestHelper.fn(),
		clip: jestHelper.fn(),
		fillRect: jestHelper.fn(),
		closePath: jestHelper.fn(),
		moveTo: jestHelper.fn(),
		lineTo: jestHelper.fn(),
		fillStyle: '',
		strokeStyle: '',
	};

	return {
		canvas: {
			width,
			height,
			toDataURL: jestHelper.fn(),
			getContext: jestHelper.fn().mockReturnValue(context),
		},
		context,
	};
}
