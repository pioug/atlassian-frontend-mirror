import { Camera } from '@atlaskit/media-ui/camera/camera';
import { Rectangle } from '@atlaskit/media-ui/rectangle';

import { ZoomLevel } from '../../../../domain/zoomLevel';
import {
	refitViewport,
	insetFittedViewport,
	isUserScroll,
	readWrapperScroll,
	readWrapperSize,
	readViewportCenterOnMedia,
	restoreViewportCenterOnMedia,
} from '../../../../utils/fit-viewport';

const createWrapper = (width: number, height: number): HTMLElement => {
	const el = document.createElement('div');
	Object.defineProperty(el, 'clientWidth', { configurable: true, value: width });
	Object.defineProperty(el, 'clientHeight', { configurable: true, value: height });
	jest
		.spyOn(el, 'getBoundingClientRect')
		.mockReturnValue({ left: 0, top: 0, width, height } as DOMRect);
	return el;
};

const mediaAt = (rect: {
	left: number;
	top: number;
	width: number;
	height: number;
}): HTMLElement => {
	const el = document.createElement('img');
	jest.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);
	return el;
};

const fittedCamera = () => new Camera(new Rectangle(352, 300), new Rectangle(4000, 3000));
const fitted = new ZoomLevel(0.088);
const zoomed = new ZoomLevel(0.088, 0.5);

afterEach(() => jest.restoreAllMocks());

const stage = (clientWidth: number, clientHeight: number) =>
	({ clientWidth, clientHeight }) as HTMLElement;

describe('insetFittedViewport', () => {
	it('should take the horizontal gutters off both sides of the width and keep the height', () => {
		expect(insetFittedViewport(stage(848, 600))).toEqual(new Rectangle(800, 600));
	});

	it('should not go below zero width when the stage is narrower than its gutters', () => {
		expect(insetFittedViewport(stage(40, 600))).toEqual(new Rectangle(0, 600));
	});
});

describe('readViewportCenterOnMedia', () => {
	it('should return the viewport center as a fraction of the media', () => {
		expect(
			readViewportCenterOnMedia(
				createWrapper(400, 300),
				mediaAt({ left: -100, top: -150, width: 800, height: 600 }),
			),
		).toEqual({ x: 0.375, y: 0.5 });
	});

	it.each([
		{ width: 0, height: 600 },
		{ width: 800, height: 0 },
	])('should return undefined for media sized $width x $height', ({ width, height }) => {
		expect(
			readViewportCenterOnMedia(
				createWrapper(400, 300),
				mediaAt({ left: 0, top: 0, width, height }),
			),
		).toBeUndefined();
	});
});

describe('restoreViewportCenterOnMedia', () => {
	it('should scroll the saved point on the media back to the viewport center', () => {
		const wrapper = createWrapper(400, 300);
		wrapper.scrollLeft = 10;
		wrapper.scrollTop = 20;
		const media = mediaAt({ left: -100, top: -150, width: 800, height: 600 });

		restoreViewportCenterOnMedia(wrapper, media, { x: 0.5, y: 0.75 });

		expect(wrapper.scrollLeft).toBe(110);
		expect(wrapper.scrollTop).toBe(170);
	});

	it.each([
		{ width: 0, height: 600 },
		{ width: 800, height: 0 },
	])(
		'should leave the scroll position alone for media sized $width x $height',
		({ width, height }) => {
			const wrapper = createWrapper(400, 300);
			wrapper.scrollLeft = 10;
			const media = mediaAt({ left: 0, top: 0, width, height });

			restoreViewportCenterOnMedia(wrapper, media, { x: 0.5, y: 0.5 });

			expect(wrapper.scrollLeft).toBe(10);
			expect(wrapper.scrollTop).toBe(0);
		},
	);
});

describe('refitViewport', () => {
	it.each([
		{ width: 48, height: 300 },
		{ width: 400, height: 0 },
	])('should not refit a $width x $height wrapper with no usable area', ({ width, height }) => {
		expect(
			refitViewport({
				wrapper: createWrapper(width, height),
				camera: fittedCamera(),
				zoomLevel: fitted,
			}),
		).toBeNull();
	});

	it('should not refit when the fitted wrapper size is unchanged', () => {
		expect(
			refitViewport({
				wrapper: createWrapper(400, 300),
				camera: fittedCamera(),
				zoomLevel: fitted,
			}),
		).toBeNull();
	});

	it('should refit fitted media to the new wrapper', () => {
		const media = mediaAt({ left: 0, top: 0, width: 352, height: 264 });

		const result = refitViewport({
			wrapper: createWrapper(600, 300),
			media,
			camera: fittedCamera(),
			zoomLevel: fitted,
		});

		expect(result?.camera.viewport).toMatchObject({ width: 552, height: 300 });
		expect(result?.zoomLevel.value).toBe(0.1);
	});

	it('should size fitted media to the new fit straight away', () => {
		const media = mediaAt({ left: 0, top: 0, width: 352, height: 264 });

		refitViewport({
			wrapper: createWrapper(600, 300),
			media,
			camera: fittedCamera(),
			zoomLevel: fitted,
		});

		expect(media.style.width).toBe('400px');
		expect(media.style.height).toBe('300px');
	});

	it('should keep the saved center at the viewport center for zoomed media', () => {
		const wrapper = createWrapper(600, 300);
		const media = mediaAt({ left: 0, top: -150, width: 800, height: 600 });

		refitViewport({
			wrapper,
			media,
			camera: fittedCamera(),
			zoomLevel: zoomed,
			savedViewportCenter: { x: 0.5, y: 0.5 },
		});

		expect(wrapper.scrollLeft).toBe(100);
		expect(wrapper.scrollTop).toBe(0);
	});

	it('should not move the scroll of zoomed media with no media element', () => {
		const wrapper = createWrapper(600, 300);

		refitViewport({
			wrapper,
			media: null,
			camera: fittedCamera(),
			zoomLevel: zoomed,
			savedViewportCenter: { x: 0.2, y: 0.3 },
		});

		expect(wrapper.scrollLeft).toBe(0);
	});
});

describe('readWrapperSize', () => {
	it('should read the wrapper client size', () => {
		expect(readWrapperSize(createWrapper(400, 300))).toEqual({ width: 400, height: 300 });
	});
});

describe('readWrapperScroll', () => {
	it('should read the wrapper scroll position', () => {
		const wrapper = createWrapper(400, 300);
		wrapper.scrollLeft = 120;
		wrapper.scrollTop = 80;

		expect(readWrapperScroll(wrapper)).toEqual({ scrollLeft: 120, scrollTop: 80 });
	});
});

describe('isUserScroll', () => {
	const scrolledWrapper = () => {
		const wrapper = createWrapper(400, 300);
		wrapper.scrollLeft = 120;
		wrapper.scrollTop = 80;
		return wrapper;
	};

	it.each([
		{
			scroll: 'before any load or resize was handled',
			fittedSize: undefined,
			savedViewportCenterScroll: undefined,
			isUser: false,
		},
		{
			scroll: 'while a width change is unhandled',
			fittedSize: { width: 600, height: 300 },
			savedViewportCenterScroll: undefined,
			isUser: false,
		},
		{
			scroll: 'while a height change is unhandled',
			fittedSize: { width: 400, height: 200 },
			savedViewportCenterScroll: undefined,
			isUser: false,
		},
		{
			scroll: 'onto the position the saved center belongs to',
			fittedSize: { width: 400, height: 300 },
			savedViewportCenterScroll: { scrollLeft: 120, scrollTop: 80 },
			isUser: false,
		},
		{
			scroll: 'away from the saved center horizontally',
			fittedSize: { width: 400, height: 300 },
			savedViewportCenterScroll: { scrollLeft: 100, scrollTop: 80 },
			isUser: true,
		},
		{
			scroll: 'away from the saved center vertically',
			fittedSize: { width: 400, height: 300 },
			savedViewportCenterScroll: { scrollLeft: 120, scrollTop: 60 },
			isUser: true,
		},
		{
			scroll: 'with no saved center',
			fittedSize: { width: 400, height: 300 },
			savedViewportCenterScroll: undefined,
			isUser: true,
		},
	])(
		'should return $isUser for a scroll $scroll',
		({ fittedSize, savedViewportCenterScroll, isUser }) => {
			expect(isUserScroll(scrolledWrapper(), fittedSize, savedViewportCenterScroll)).toBe(isUser);
		},
	);
});
