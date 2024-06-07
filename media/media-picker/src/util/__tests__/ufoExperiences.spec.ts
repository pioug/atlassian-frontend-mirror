const mockMediaEnvironment = 'test-local';
const mockMediaRegion = 'test-local-region';

jest.mock('@atlaskit/ufo', () => {
	const actualUfo = jest.requireActual('@atlaskit/ufo');
	return {
		...actualUfo,
		ConcurrentExperience: jest.fn(),
	};
});

jest.mock('@atlaskit/media-client', () => {
	const mediaClient = jest.requireActual('@atlaskit/media-client');

	return {
		...mediaClient,
		getMediaEnvironment: () => mockMediaEnvironment,
		getMediaRegion: () => mockMediaRegion,
	};
});
import { ConcurrentExperience } from '@atlaskit/ufo';
import {
	startMediaUploadUfoExperience,
	succeedMediaUploadUfoExperience,
	failMediaUploadUfoExperience,
} from '../ufoExperiences';

jest.mock('@atlaskit/media-common/mediaFeatureFlags', () => {
	const actualUfo = jest.requireActual('@atlaskit/media-common/mediaFeatureFlags');
	return {
		...actualUfo,
		getFeatureFlagKeysAllProducts: () => ['feature-flag-1', 'feature-flag-2'],
	};
});

describe('ufoExperience', () => {
	const fileAttributes = {
		fileId: 'some-id',
		fileMediatype: undefined,
		fileMimetype: undefined,
	};

	const mockStart = jest.fn();
	const mockSuccess = jest.fn();
	const mockFailure = jest.fn();

	const mockGetInstance = jest.fn().mockReturnValue({
		start: mockStart,
		success: mockSuccess,
		failure: mockFailure,
	}) as any;

	const concurrentExperienceConstructor = jest.fn((experienceId, config) => {
		return {
			experienceId,
			config,
			getInstance: mockGetInstance,
			instances: {},
			release: jest.fn(),
		};
	});

	(ConcurrentExperience as jest.MockedClass<typeof ConcurrentExperience>).mockImplementation(
		concurrentExperienceConstructor,
	);

	beforeEach(() => {});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('startUfoExperience', () => {
		it('should retrieve the correct UFO experience and start it with properties', () => {
			startMediaUploadUfoExperience('file-test-id', 'browser');

			expect(mockGetInstance).toBeCalledTimes(1);
			expect(mockGetInstance).toBeCalledWith('file-test-id');
			expect(mockStart).toHaveBeenCalledTimes(1);
			expect(concurrentExperienceConstructor).toHaveBeenCalledWith(
				'media-upload',
				expect.objectContaining({
					type: 'experience',
					performanceType: 'inline-result',
					platform: expect.objectContaining({
						// We expect the component name to be prefixed with media-picker
						component: 'media-picker-browser',
					}),
					featureFlags: ['feature-flag-1', 'feature-flag-2'],
				}),
			);
		});
	});

	describe('succeedUfoExperience', () => {
		it('should be able to succeed an experience with provided metadata', () => {
			succeedMediaUploadUfoExperience('a-test-id', fileAttributes);

			expect(mockGetInstance).toBeCalledTimes(1);
			expect(mockGetInstance).toBeCalledWith('a-test-id');
			expect(mockSuccess).toBeCalledTimes(1);
			expect(mockSuccess).toBeCalledWith({
				metadata: {
					fileAttributes: fileAttributes,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					mediaEnvironment: mockMediaEnvironment,
					mediaRegion: mockMediaRegion,
				},
			});
		});

		it('should be able to succeed an experience without provided metadata', () => {
			succeedMediaUploadUfoExperience('b-test-id', fileAttributes);

			expect(mockGetInstance).toBeCalledTimes(1);
			expect(mockGetInstance).toBeCalledWith('b-test-id');
			expect(mockSuccess).toBeCalledTimes(1);
		});
	});

	describe('failMediaUploadUfoExperience', () => {
		it('should be able to fail an experience with provided metadata', () => {
			failMediaUploadUfoExperience('a-test-id', {
				failReason: 'upload_fail',
				error: 'serverBadGateway',
				request: { method: 'GET', endpoint: '/some-endpoint' },
				fileAttributes: {
					fileId: expect.any(String),
				},
				uploadDurationMsec: -1,
			});

			expect(mockGetInstance).toBeCalledTimes(1);
			expect(mockGetInstance).toBeCalledWith('a-test-id');
			expect(mockFailure).toBeCalledTimes(1);
			expect(mockFailure).toBeCalledWith({
				metadata: {
					failReason: 'upload_fail',
					error: 'serverBadGateway',
					request: { method: 'GET', endpoint: '/some-endpoint' },
					fileAttributes: {
						fileId: expect.any(String),
					},
					uploadDurationMsec: -1,
					packageName: expect.any(String),
					packageVersion: expect.any(String),
					mediaEnvironment: mockMediaEnvironment,
					mediaRegion: mockMediaRegion,
				},
			});
		});

		it('should be able to fail an experience without provided metadata', () => {
			failMediaUploadUfoExperience('b-test-id');

			expect(mockGetInstance).toBeCalledTimes(1);
			expect(mockGetInstance).toBeCalledWith('b-test-id');
			expect(mockFailure).toBeCalledTimes(1);
		});
	});
});
