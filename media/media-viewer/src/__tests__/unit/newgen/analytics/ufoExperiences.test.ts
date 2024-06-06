const mockMediaEnvironment = 'test-local';
const mockMediaRegion = 'test-local-region';

jest.mock('@atlaskit/ufo', () => {
	const actualUfo = jest.requireActual('@atlaskit/ufo');
	return {
		...actualUfo,
		UFOExperience: jest.fn().mockReturnValue({
			start: jest.fn(),
			addMetadata: jest.fn(),
			success: jest.fn(),
			failure: jest.fn(),
		}),
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

jest.mock('@atlaskit/media-common/mediaFeatureFlags', () => {
	const actualUfo = jest.requireActual('@atlaskit/media-common/mediaFeatureFlags');
	return {
		...actualUfo,
		getFeatureFlagKeysAllProducts: () => ['feature-flag-1', 'feature-flag-2'],
	};
});

import { UFOExperience, ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo';

import {
	startMediaFileUfoExperience,
	succeedMediaFileUfoExperience,
	failMediaFileUfoExperience,
} from '../../../../analytics/ufoExperiences';

const mocks = (UFOExperience as jest.Mock)();

describe('ufoExperience', () => {
	const fileAttributes = {
		fileId: 'some-id',
		fileMediatype: undefined,
		fileMimetype: undefined,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('startUfoExperience', () => {
		it('should start UFO experience', () => {
			startMediaFileUfoExperience();

			const inlineExperience = {
				platform: { component: 'media-viewer' },
				type: ExperienceTypes.Experience,
				performanceType: ExperiencePerformanceTypes.InlineResult,
				featureFlags: ['feature-flag-1', 'feature-flag-2'],
			};
			expect(UFOExperience).toHaveBeenCalledTimes(1);
			expect(UFOExperience).toHaveBeenCalledWith('media-file', inlineExperience);
			expect(mocks.start).toHaveBeenCalledTimes(1);
		});

		describe('succeedMediaFileUfoExperience', () => {
			it('should be able to succeed an experience with provided metadata', () => {
				succeedMediaFileUfoExperience({
					fileAttributes,
					fileStateFlags: {
						wasStatusUploading: false,
						wasStatusProcessing: false,
					},
				});

				expect(mocks.success).toBeCalledWith({
					metadata: {
						fileAttributes: fileAttributes,
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						mediaEnvironment: mockMediaEnvironment,
						mediaRegion: mockMediaRegion,
						fileStateFlags: {
							wasStatusUploading: false,
							wasStatusProcessing: false,
						},
					},
				});
			});

			it('should be able to succeed an experience without provided metadata', () => {
				succeedMediaFileUfoExperience();

				expect(mocks.success).toBeCalledWith({
					metadata: {
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						mediaEnvironment: mockMediaEnvironment,
						mediaRegion: mockMediaRegion,
					},
				});
			});
		});

		describe('failMediaFileUfoExperience', () => {
			it('should be able to fail an experience with provided metadata', () => {
				failMediaFileUfoExperience({
					failReason: 'imageviewer-external-onerror',
					errorDetail: undefined,
					fileAttributes: fileAttributes,
					fileStateFlags: {
						wasStatusUploading: false,
						wasStatusProcessing: false,
					},
				});

				expect(mocks.failure).toBeCalledWith({
					metadata: {
						failReason: 'imageviewer-external-onerror',
						errorDetail: undefined,
						fileAttributes: fileAttributes,
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						mediaEnvironment: mockMediaEnvironment,
						mediaRegion: mockMediaRegion,
						fileStateFlags: {
							wasStatusUploading: false,
							wasStatusProcessing: false,
						},
					},
				});
			});

			it('should be able to fail an experience without provided metadata', () => {
				failMediaFileUfoExperience();

				expect(mocks.failure).toBeCalledWith({
					metadata: {
						packageName: expect.any(String),
						packageVersion: expect.any(String),
						mediaEnvironment: mockMediaEnvironment,
						mediaRegion: mockMediaRegion,
					},
				});
			});
		});
	});
});
