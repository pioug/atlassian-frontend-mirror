import { mockCanvas } from '@atlaskit/media-test-helpers';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import { DEFAULT_INNER_WIDTH, DEFAULT_INNER_HEIGHT } from '../../viewport';
import { renderViewport } from '../../viewport/viewport-render';
import { setup as setupViewport } from './viewportSpec';

const getCanvasMock = mockCanvas();
const mockImagePlacerUtil = {
	getCanvas: jest.fn().mockReturnValue(getCanvasMock),
};
jest.mock('../../util', () => mockImagePlacerUtil);

export const radians = (deg: number) => deg * (Math.PI / 180);

const mockImage = {
	naturalWidth: 1,
	naturalHeight: 2,
} as HTMLImageElement;
const translate = getCanvasMock.context.translate! as jest.Mock;
const scale = getCanvasMock.context.scale! as jest.Mock;
const rotate = getCanvasMock.context.rotate! as jest.Mock;
const drawImage = getCanvasMock.context.drawImage! as jest.Mock;
const toDataURL = getCanvasMock.canvas.toDataURL! as jest.Mock;
toDataURL.mockReturnValue('some-data-url');

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('Viewport Renderer', () => {
	let originalCSS: any;
	beforeAll(() => {
		originalCSS = global.CSS;
		global.CSS = {
			...originalCSS,
			supports: () => false,
		};
	});

	afterAll(() => {
		global.CSS = originalCSS;
	});

	beforeEach(() => {
		translate.mockClear();
		scale.mockClear();
		rotate.mockClear();
		drawImage.mockClear();
	});

	/* test the combinations of translate, scale, rotate required to achieve the orientation transforms */

	const setup = (orientation: number, outputSize?: number) => {
		const viewport = setupViewport();
		viewport.orientation = orientation;
		const { canvas, context } = mockImagePlacerUtil.getCanvas();

		renderViewport(viewport, mockImage, canvas, outputSize);

		return {
			viewport,
			canvas,
			context,
		};
	};

	it('should apply scaling to the canvas', () => {
		const { canvas } = setup(2, 512);
		expect(canvas.width).toBe(512);
		expect(canvas.height).toBe(512);
	});

	it('should apply orientation 2', () => {
		setup(2);
		expect(translate).toHaveBeenCalledTimes(1);
		expect(scale).toHaveBeenCalledTimes(1);
		expect(rotate).toHaveBeenCalledTimes(0);
		expect(translate).toHaveBeenCalledWith(DEFAULT_INNER_WIDTH, 0);
		expect(scale).toHaveBeenCalledWith(-1, 1);
	});

	it('should apply orientation 3', () => {
		setup(3);
		expect(translate).toHaveBeenCalledTimes(1);
		expect(scale).toHaveBeenCalledTimes(1);
		expect(rotate).toHaveBeenCalledTimes(0);
		expect(translate).toHaveBeenCalledWith(DEFAULT_INNER_WIDTH, DEFAULT_INNER_HEIGHT);
		expect(scale).toHaveBeenCalledWith(-1, -1);
	});

	it('should apply orientation 4', () => {
		setup(4);
		expect(translate).toHaveBeenCalledTimes(1);
		expect(scale).toHaveBeenCalledTimes(1);
		expect(rotate).toHaveBeenCalledTimes(0);
		expect(translate).toHaveBeenCalledWith(0, DEFAULT_INNER_HEIGHT);
		expect(scale).toHaveBeenCalledWith(1, -1);
	});

	it('should apply orientation 5', () => {
		setup(5);
		expect(translate).toHaveBeenCalledTimes(2);
		expect(scale).toHaveBeenCalledTimes(1);
		expect(rotate).toHaveBeenCalledTimes(1);
		expect(translate).toHaveBeenNthCalledWith(1, DEFAULT_INNER_HEIGHT, 0);
		expect(translate).toHaveBeenNthCalledWith(2, 0, DEFAULT_INNER_HEIGHT);
		expect(scale).toHaveBeenCalledWith(1, -1);
		expect(rotate).toHaveBeenCalledWith(radians(90));
	});

	it('should apply orientation 6', () => {
		setup(6);
		expect(translate).toHaveBeenCalledTimes(1);
		expect(scale).toHaveBeenCalledTimes(0);
		expect(rotate).toHaveBeenCalledTimes(1);
		expect(translate).toHaveBeenCalledWith(DEFAULT_INNER_HEIGHT, 0);
		expect(rotate).toHaveBeenCalledWith(radians(90));
	});

	it('should apply orientation 7', () => {
		setup(7);
		expect(translate).toHaveBeenCalledTimes(2);
		expect(scale).toHaveBeenCalledTimes(1);
		expect(rotate).toHaveBeenCalledTimes(1);
		expect(translate).toHaveBeenNthCalledWith(1, DEFAULT_INNER_HEIGHT, 0);
		expect(translate).toHaveBeenNthCalledWith(2, DEFAULT_INNER_HEIGHT, 0);
		expect(rotate).toHaveBeenCalledWith(radians(90));
		expect(scale).toHaveBeenCalledWith(-1, 1);
	});

	it('should apply orientation 8', () => {
		setup(8);
		expect(translate).toHaveBeenCalledTimes(2);
		expect(scale).toHaveBeenCalledTimes(1);
		expect(rotate).toHaveBeenCalledTimes(1);
		expect(translate).toHaveBeenNthCalledWith(1, DEFAULT_INNER_HEIGHT, 0);
		expect(translate).toHaveBeenNthCalledWith(2, DEFAULT_INNER_WIDTH, DEFAULT_INNER_HEIGHT);
		expect(rotate).toHaveBeenCalledWith(radians(90));
		expect(scale).toHaveBeenCalledWith(-1, -1);
	});
});
