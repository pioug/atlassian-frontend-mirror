import getJest from './getJest';

const jestHelper = getJest();

let getOrientationMock: jest.Mock | Promise<number>;
let loadImageMock: jest.Mock | Promise<{}>;

// so that jest doesn't hoist mock of media-ui and replaces actual module on every import of media-test-helpers
export const loadImageMockSetup = (): void => {
	jestHelper.doMock('@atlaskit/media-ui', () => ({
		...jestHelper.requireActual<Object>('@atlaskit/media-ui'),
		getOrientation: jestHelper.fn(() => getOrientationMock),
		loadImage: jestHelper.fn(() => loadImageMock),
	}));
};

export const mockLoadImage = (
	naturalWidth: number = 1,
	naturalHeight: number = 1,
	orientation: number = 1,
): void => {
	getOrientationMock = Promise.resolve(orientation);
	loadImageMock = Promise.resolve({ naturalHeight, naturalWidth });
};

export const mockLoadImageError = (
	errorMessage: string = 'some-image-failed-to-load-reason',
): void => {
	getOrientationMock = Promise.resolve(1);
	loadImageMock = Promise.reject(new Error(errorMessage));
};

export const unMockLoadImage = (): void => {
	const uiModule = jestHelper.requireActual('@atlaskit/media-ui');
	getOrientationMock = uiModule.getOrientation;
	loadImageMock = uiModule.loadImage;
};
