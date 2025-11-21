import {
	AUTH_WINDOW_HEIGHT,
	AUTH_WINDOW_WIDTH,
	getWindowOpenFeatures,
} from '../window-open-features';

describe('getWindowOpenFeatures', () => {
	const windowHeight = window.innerHeight;
	const windowWidth = window.innerWidth;
	const clientWidth = document.documentElement.clientWidth;
	const clientHeight = document.documentElement.clientHeight;

	const setupWindow = (height: number, width: number, left: number = 0, top: number = 0) => {
		Object.defineProperty(window, 'innerHeight', { value: height, writable: true });
		Object.defineProperty(window, 'innerWidth', { value: width, writable: true });
		Object.defineProperty(window, 'screenLeft', { value: left, writable: true });
		Object.defineProperty(window, 'screenTop', { value: top, writable: true });
	};

	const setupDocument = (height: number, width: number) => {
		Object.defineProperties(document.documentElement, {
			clientHeight: { value: height, writable: true },
			clientWidth: { value: width, writable: true },
		});
	};

	const setup = (height: number, width: number, left: number = 0, top: number = 0) => {
		setupWindow(height, width, left, top);
		setupDocument(height, width);
	};

	afterEach(() => {
		Object.defineProperty(window, 'innerHeight', { value: windowHeight });
		Object.defineProperty(window, 'innerWidth', { value: windowWidth });
		Object.defineProperties(document.documentElement, {
			clientWidth: { value: clientWidth },
			clientHeight: { value: clientHeight },
		});
		jest.clearAllMocks();
	});

	it.each([
		[300, 400, 'width=400,height=300,left=440,top=250'],
		[400, 300, 'width=300,height=400,left=490,top=200'],
		[100, 100, 'width=100,height=100,left=590,top=350'],
		[AUTH_WINDOW_HEIGHT, AUTH_WINDOW_WIDTH, 'width=620,height=760,left=330,top=20'],
	])(
		'should return popup window features',
		(height: number, width: number, expected: string | undefined) => {
			setup(800, 1280);
			expect(getWindowOpenFeatures(height, width)).toBe(expected);
		},
	);

	it.each([
		[0, 100, 'width=620,height=760,left=330,top=120'],
		[100, 0, 'width=620,height=760,left=430,top=20'],
		[100, 100, 'width=620,height=760,left=430,top=120'],
	])(
		'should return popup window features when parent window is position at the top left of the screen',
		(left: number, top: number, expected: string | undefined) => {
			setup(800, 1280, left, top);
			expect(getWindowOpenFeatures(AUTH_WINDOW_HEIGHT, AUTH_WINDOW_WIDTH)).toBe(expected);
		},
	);

	it('should return undefined when popup size is exact same size as window', () => {
		setup(600, 800);
		expect(getWindowOpenFeatures(600, 800)).toBeUndefined();
	});

	it('should return undefined when popup size is bigger', () => {
		setup(600, 800);
		expect(getWindowOpenFeatures(800, 1000)).toBeUndefined();
	});

	it('should return undefined popup height is bigger', () => {
		setup(600, 800);
		expect(getWindowOpenFeatures(800, 200)).toBeUndefined();
	});

	it('should return undefined popup width is bigger', () => {
		setup(600, 800);
		expect(getWindowOpenFeatures(400, 1000)).toBeUndefined();
	});

	it('should use the max size of parent window or document to determine popup location', () => {
		setupWindow(600, 800);
		setupDocument(800, 600);

		expect(getWindowOpenFeatures(200, 200)).toBe('width=200,height=200,left=300,top=300');
	});
});
