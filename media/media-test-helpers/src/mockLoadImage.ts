import getJest from './getJest';

const jestHelper = getJest();

let getOrientationMock: jest.Mock | Promise<number>;
let loadImageMock: jest.Mock | Promise<{}>;

// Register mocks only when setup is called, rather than when media-test-helpers is imported.
export const loadImageMockSetup = (): void => {
	jestHelper.doMock('@atlaskit/media-ui/imageMetaData/getOrientation', () => ({
		getOrientation: jestHelper.fn(() => getOrientationMock),
	}));
	jestHelper.doMock('@atlaskit/media-ui/loadImage', () => ({
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
	getOrientationMock = jestHelper.requireActual(
		'@atlaskit/media-ui/imageMetaData/getOrientation',
	).getOrientation;
	loadImageMock = jestHelper.requireActual('@atlaskit/media-ui/loadImage').loadImage;
};
